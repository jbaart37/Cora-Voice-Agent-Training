"""
Azure Storage Service for conversation score management

LEARNING NOTES:
===============
This module demonstrates enterprise-grade Azure Table Storage integration:

1. **Dual Authentication**: Supports both connection strings (dev) and managed identity (prod)
2. **Automatic Table Creation**: Creates table if it doesn't exist on first run
3. **Error Handling**: Graceful degradation if storage unavailable
4. **Case Normalization**: Ensures consistent querying with lowercase keys
5. **Data Serialization**: Properly handles JSON for complex fields

KEY AZURE CONCEPTS:
- **PartitionKey**: Groups related entities (we use user_identity for fast user queries)
- **RowKey**: Unique identifier within partition (we use conversation_id)
- **Managed Identity**: Container Apps can access storage without connection strings
- **Table Storage**: NoSQL key-value store, cheaper than Cosmos DB for simple data

SCHEMA DESIGN:
- PartitionKey: user_identity (lowercase normalized) - enables fast "all scores for user" queries
- RowKey: conversation_id (UUID) - unique per conversation
- Fields: scores (5 criteria), timestamps, feedback text
"""
import os
import json
from datetime import datetime
from typing import Dict, List, Optional
from azure.data.tables import TableServiceClient, TableEntity
from azure.identity import DefaultAzureCredential
from config import Config

class StorageService:
    """Service for managing conversation scores in Azure Table Storage"""
    
    def __init__(self):
        """
        Initialize the storage service with managed identity or connection string
        
        LEARNING NOTE: This pattern allows the same code to work in:
        - Local development (using connection string from .env)
        - Production (using managed identity - no secrets needed!)
        """
        self.table_name = "conversationscores"
        self.table_client = None
        self._initialize_storage()
    
    def _initialize_storage(self):
        """
        Initialize Azure Table Storage client with automatic authentication
        
        AUTHENTICATION FLOW:
        1. Try connection string (for local development)
        2. Fall back to DefaultAzureCredential (for Azure production)
        3. If neither works, disable storage (app continues without analytics)
        """
        try:
            # Try connection string first (for local development)
            # Get from environment: AZURE_STORAGE_CONNECTION_STRING
            connection_string = os.getenv('AZURE_STORAGE_CONNECTION_STRING')
            
            if connection_string:
                print("✓ Using Azure Storage connection string (local development)")
                table_service = TableServiceClient.from_connection_string(connection_string)
            else:
                # Use managed identity in production (Azure Container Apps)
                # This is MORE SECURE - no secrets to manage!
                storage_account_name = Config.AZURE_STORAGE_ACCOUNT_NAME
                if not storage_account_name:
                    print("⚠ No storage account configured - score storage disabled")
                    return
                
                print(f"✓ Using managed identity for storage: {storage_account_name}")
                
                # DefaultAzureCredential tries multiple authentication methods:
                # 1. Environment variables (AZURE_CLIENT_ID, etc.)
                # 2. Managed Identity (in Azure Container Apps/App Service)
                # 3. Azure CLI (if logged in with 'az login')
                # 4. Visual Studio / VS Code credentials
                credential = DefaultAzureCredential()
                table_endpoint = f"https://{storage_account_name}.table.core.windows.net"
                table_service = TableServiceClient(endpoint=table_endpoint, credential=credential)
            
            # Get table client for our specific table
            self.table_client = table_service.get_table_client(self.table_name)
            
            # Create table if it doesn't exist (idempotent operation)
            try:
                self.table_client.create_table()
                print(f"✓ Created Azure Table: {self.table_name}")
            except Exception:
                # Table already exists - this is normal
                print(f"✓ Azure Table '{self.table_name}' already exists")
                
        except Exception as e:
            print(f"⚠ Failed to initialize Azure Table Storage: {e}")
            print("   App will continue without score storage")
            self.table_client = None
    
    def save_conversation_score(self, 
                                conversation_id: str,
                                user_identity: str,
                                auth_method: str,
                                analysis: Dict,
                                message_count: int) -> bool:
        """
        Save conversation score to Azure Table Storage
        
        Args:
            conversation_id: Unique conversation identifier (UUID)
            user_identity: User email or username
            auth_method: How user authenticated (Azure AD, Local, Anonymous)
            analysis: AI-generated analysis with scores and feedback
            message_count: Number of messages exchanged
            
        Returns:
            True if successful, False otherwise
            
        LEARNING NOTES:
        - PartitionKey = user_identity: Groups all conversations for one user
        - RowKey = conversation_id: Unique identifier for this conversation
        - This design enables fast "get all scores for user" queries
        - Normalization to lowercase ensures case-insensitive matching
        """
        if not self.table_client:
            print("⚠ Table client not initialized - cannot save score")
            return False
        
        try:
            # IMPORTANT: Normalize to lowercase for case-insensitive queries
            # Azure Table Storage is case-sensitive, so "user@email.com" != "User@Email.com"
            user_identity_normalized = user_identity.lower()
            
            # Create entity (row) for Table Storage
            score_entity = TableEntity()
            
            # PRIMARY KEYS (required for every entity)
            score_entity['PartitionKey'] = user_identity_normalized  # Groups related data
            score_entity['RowKey'] = conversation_id  # Unique within partition
            
            # METADATA FIELDS
            score_entity['created_at'] = datetime.utcnow().isoformat()
            score_entity['user_identity'] = user_identity_normalized
            score_entity['auth_method'] = auth_method
            score_entity['conversation_id'] = conversation_id
            score_entity['message_count'] = message_count
            
            # SCORE FIELDS (all integers 1-5, total 5-25)
            # These are flattened from the analysis dict for easy querying
            score_entity['total_score'] = analysis.get('total_score', 0)
            score_entity['professionalism'] = analysis['scores'].get('professionalism', 0)
            score_entity['communication'] = analysis['scores'].get('communication', 0)
            score_entity['problem_resolution'] = analysis['scores'].get('problem_resolution', 0)
            score_entity['empathy'] = analysis['scores'].get('empathy', 0)
            score_entity['efficiency'] = analysis['scores'].get('efficiency', 0)
            
            # COMPLEX FIELDS (stored as JSON strings)
            # Table Storage doesn't natively support arrays, so we JSON-encode them
            score_entity['strengths'] = json.dumps(analysis.get('strengths', []))
            score_entity['improvements'] = json.dumps(analysis.get('improvements', []))
            score_entity['overall_feedback'] = analysis.get('overall_feedback', '')
            
            # UPSERT: Insert if new, update if exists (safer than insert-only)
            self.table_client.upsert_entity(score_entity)
            print(f"✓ Stored score for conversation {conversation_id} by {user_identity}")
            return True
            
        except Exception as e:
            print(f"⚠ Failed to store score in Azure Table: {e}")
            return False
    
    def get_user_scores(self, user_identity: str, limit: int = 10) -> List[Dict]:
        """
        Retrieve recent conversation scores for a user
        
        Args:
            user_identity: User email or username
            limit: Maximum number of scores to retrieve
            
        Returns:
            List of score dictionaries, sorted by timestamp (newest first)
            
        QUERY OPTIMIZATION:
        - PartitionKey query is FAST (single-partition scan)
        - We only select fields needed for analytics dashboard
        - Results sorted in memory (Table Storage doesn't guarantee order)
        """
        if not self.table_client:
            return []
        
        try:
            # Normalize to lowercase for consistent querying
            user_identity_normalized = user_identity.lower()
            
            # Query all entities for this user (PartitionKey match)
            # This is efficient because Table Storage indexes PartitionKey
            entities = self.table_client.query_entities(
                query_filter=f"PartitionKey eq '{user_identity_normalized}'",
                # SELECT only fields we need (reduces network transfer)
                select=["RowKey", "created_at", "total_score", "professionalism", 
                       "communication", "problem_resolution", "empathy", "efficiency",
                       "message_count"]
            )
            
            scores = []
            for entity in entities:
                # Skip old records without timestamps (data migration safety)
                if not entity.get('created_at'):
                    continue
                    
                # Convert entity to dictionary format expected by frontend
                scores.append({
                    'conversation_id': entity['RowKey'],
                    'timestamp': entity.get('created_at', ''),
                    'total_score': entity.get('total_score', 0),
                    'professionalism': entity.get('professionalism', 0),
                    'communication': entity.get('communication', 0),
                    'problem_resolution': entity.get('problem_resolution', 0),
                    'empathy': entity.get('empathy', 0),
                    'efficiency': entity.get('efficiency', 0),
                    'message_count': entity.get('message_count', 0)
                })
            
            # Sort by timestamp descending (newest first) and apply limit
            scores.sort(key=lambda x: x['timestamp'] or '', reverse=True)
            return scores[:limit]
            
        except Exception as e:
            print(f"⚠ Failed to retrieve scores: {e}")
            return []
    
    def get_conversation_score(self, user_identity: str, conversation_id: str) -> Optional[Dict]:
        """
        Retrieve a specific conversation score
        
        Args:
            user_identity: User email or username
            conversation_id: Conversation identifier
            
        Returns:
            Score dictionary with full details, or None if not found
            
        LEARNING NOTE: This is a POINT QUERY (most efficient):
        - Uses both PartitionKey AND RowKey
        - O(1) lookup time regardless of table size
        - Returns single entity directly
        """
        if not self.table_client:
            return None
        
        try:
            # Point query: Get exact entity by both keys
            # This is the FASTEST query type in Table Storage
            entity = self.table_client.get_entity(
                partition_key=user_identity.lower(),
                row_key=conversation_id
            )
            
            # Return full details including complex fields
            return {
                'conversation_id': entity['RowKey'],
                'timestamp': entity['Timestamp'].isoformat() if hasattr(entity['Timestamp'], 'isoformat') else str(entity['Timestamp']),
                'total_score': entity.get('total_score', 0),
                'professionalism': entity.get('professionalism', 0),
                'communication': entity.get('communication', 0),
                'problem_resolution': entity.get('problem_resolution', 0),
                'empathy': entity.get('empathy', 0),
                'efficiency': entity.get('efficiency', 0),
                # Deserialize JSON fields
                'strengths': json.loads(entity.get('strengths', '[]')),
                'improvements': json.loads(entity.get('improvements', '[]')),
                'overall_feedback': entity.get('overall_feedback', ''),
                'message_count': entity.get('message_count', 0),
                'auth_method': entity.get('auth_method', 'Unknown')
            }
            
        except Exception as e:
            print(f"⚠ Failed to retrieve conversation score: {e}")
            return None
