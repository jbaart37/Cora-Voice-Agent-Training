"""
Voice Agent Implementation using Azure OpenAI
"""
import os
from typing import Dict, List, Optional
from azure.identity import DefaultAzureCredential
from openai import AzureOpenAI
from config import Config

# Import OpenTelemetry for tracing
try:
    from opentelemetry import trace
    tracer = trace.get_tracer(__name__)
except ImportError:
    tracer = None

class VoiceAgent:
    """AI Voice Agent for customer service interactions"""
    
    def __init__(self):
        """Initialize the voice agent with Azure AI Foundry connection"""
        self.config = Config()
        self.agent = None
        self._initialize_agent()
    
    def _initialize_agent(self):
        """Set up the agent with Microsoft Agent Framework"""
        try:
            # Initialize Azure OpenAI client
            # Use API key if provided, otherwise use DefaultAzureCredential (Azure CLI auth)
            if self.config.AZURE_AI_FOUNDRY_API_KEY:
                self.client = AzureOpenAI(
                    azure_endpoint=self.config.AZURE_AI_FOUNDRY_ENDPOINT,
                    api_key=self.config.AZURE_AI_FOUNDRY_API_KEY,
                    api_version="2024-08-01-preview"
                )
            else:
                # Use Azure CLI credentials (DefaultAzureCredential)
                credential = DefaultAzureCredential()
                from azure.core.credentials import TokenCredential
                # Get token for Azure Cognitive Services
                token = credential.get_token("https://cognitiveservices.azure.com/.default")
                
                self.client = AzureOpenAI(
                    azure_endpoint=self.config.AZURE_AI_FOUNDRY_ENDPOINT,
                    azure_ad_token=token.token,
                    api_version="2024-08-01-preview"
                )
            
            # Store agent configuration
            self.agent = {
                "name": self.config.AGENT_NAME,
                "description": self.config.AGENT_DESCRIPTION,
                "model": self.config.AZURE_AI_MODEL_NAME,
                "system_prompt": self.config.AGENT_SYSTEM_PROMPT
            }
            
            print(f"✓ Voice agent '{self.config.AGENT_NAME}' initialized successfully")
            
        except Exception as e:
            print(f"✗ Failed to initialize voice agent: {str(e)}")
            raise
    
    async def process_message(self, user_message: str, conversation_history: List[Dict] = None, mood: str = "neutral", is_scenario_prompt: bool = False) -> Dict:
        """
        Process a user message and return the agent's response
        
        Args:
            user_message: The user's input message
            conversation_history: Optional list of previous messages
            mood: The customer's emotional state (neutral, happy, curious, frustrated, confused, impatient)
            is_scenario_prompt: If True, treat message as scenario trigger (AI initiates conversation)
            
        Returns:
            Dictionary containing the response and metadata
        """
        # Create a trace span for this operation if tracing is enabled
        if tracer:
            with tracer.start_as_current_span("cora.process_message") as span:
                span.set_attribute("cora.mood", mood)
                span.set_attribute("cora.is_scenario_prompt", is_scenario_prompt)
                span.set_attribute("cora.message_length", len(user_message))
                span.set_attribute("cora.model", self.config.AZURE_AI_MODEL_NAME)
                return await self._process_message_internal(user_message, conversation_history, mood, is_scenario_prompt)
        else:
            return await self._process_message_internal(user_message, conversation_history, mood, is_scenario_prompt)
    
    async def _process_message_internal(self, user_message: str, conversation_history: List[Dict] = None, mood: str = "neutral", is_scenario_prompt: bool = False) -> Dict:
        """Internal implementation of message processing"""
        try:
            # Define mood-specific behavior instructions
            mood_contexts = {
                "happy": "You are speaking as a happy and satisfied customer. You're pleased with the service, speak positively, and express gratitude. You're cooperative and friendly.",
                "curious": "You are speaking as a curious and inquisitive customer. You ask many questions, want to understand details, and show genuine interest in learning more. You're engaged and thoughtful.",
                "frustrated": "You are speaking as a frustrated and upset customer. You've had a bad experience, express disappointment or anger, and may be impatient. However, you're still looking for resolution.",
                "confused": "You are speaking as a confused and unsure customer. You don't fully understand the situation, need clear explanations, and may ask for clarification multiple times. You appreciate patience.",
                "impatient": "You are speaking as an impatient customer with an urgent need. You want quick answers, express time pressure, and may seem rushed. You need efficient and direct responses.",
                "neutral": "You are speaking as a neutral customer with a standard inquiry. You're polite and professional, seeking assistance without strong emotional overtones."
            }
            
            # Build system prompt with mood context
            mood_instruction = mood_contexts.get(mood, mood_contexts["neutral"])
            
            # If scenario prompt, add instruction to initiate the conversation
            if is_scenario_prompt:
                mood_instruction += f" {user_message} Start the conversation naturally as a customer would when contacting support."
            enhanced_prompt = f"{self.agent['system_prompt']}\n\nCUSTOMER EMOTIONAL STATE: {mood_instruction}"
            
            # Prepare conversation context with enhanced system message
            messages = [{"role": "system", "content": enhanced_prompt}]
            
            # Add conversation history (skip system messages from history)
            if conversation_history:
                for msg in conversation_history:
                    if msg.get("role") != "system":
                        messages.append({"role": msg["role"], "content": msg["content"]})
            
            # Add current user message
            messages.append({"role": "user", "content": user_message})
            
            # Call Azure OpenAI with stored completions enabled
            response = self.client.chat.completions.create(
                model=self.config.AZURE_AI_MODEL_NAME,
                messages=messages,
                temperature=0.7,
                max_tokens=800,
                store=True  # Enable stored completions for data loss prevention
            )
            
            assistant_message = response.choices[0].message.content
            
            result = {
                "success": True,
                "response": assistant_message,
                "metadata": {
                    "agent_name": self.agent["name"],
                    "model": self.config.AZURE_AI_MODEL_NAME,
                    "usage": {
                        "prompt_tokens": response.usage.prompt_tokens,
                        "completion_tokens": response.usage.completion_tokens,
                        "total_tokens": response.usage.total_tokens
                    }
                }
            }
            
            # Add trace attributes if tracing is enabled
            if tracer:
                span = trace.get_current_span()
                if span:
                    span.set_attribute("cora.response_length", len(assistant_message))
                    span.set_attribute("cora.prompt_tokens", response.usage.prompt_tokens)
                    span.set_attribute("cora.completion_tokens", response.usage.completion_tokens)
                    span.set_attribute("cora.total_tokens", response.usage.total_tokens)
            
            return result
            
        except Exception as e:
            print(f"Error processing message: {str(e)}")
            
            # Log error to trace if available
            if tracer:
                span = trace.get_current_span()
                if span:
                    span.set_attribute("cora.error", str(e))
                    span.record_exception(e)
            
            return {
                "success": False,
                "error": str(e),
                "response": "I apologize, but I'm having trouble processing your request right now."
            }
    
    def analyze_interaction(self, conversation: List[Dict]) -> Dict:
        """
        Analyze a completed conversation using standardized 5-criteria scoring (1-5 each, total 25)
        
        Args:
            conversation: List of messages in the conversation
            
        Returns:
            Analysis results with standardized scores
        """
        analysis_prompt = f"""You are a customer service quality evaluator. Analyze the following conversation between a customer service agent and a customer (Cora).

CONVERSATION:
{self._format_conversation(conversation)}

Evaluate the agent's performance using these 5 criteria. Score each criterion from 1-5 (1=Poor, 2=Below Average, 3=Average, 4=Good, 5=Excellent):

1. **Professionalism & Courtesy** (1-5): Tone, respect, politeness, professional language
2. **Communication Clarity** (1-5): Clear explanations, easy to understand, avoids jargon
3. **Problem Resolution** (1-5): Addressed customer needs, provided solutions, followed through
4. **Empathy & Active Listening** (1-5): Showed understanding, acknowledged concerns, personalized responses
5. **Efficiency & Responsiveness** (1-5): Timely responses, concise answers, stayed on topic

Provide your response in this EXACT JSON format (do not include markdown code blocks):
{{
    "scores": {{
        "professionalism": <1-5>,
        "communication": <1-5>,
        "problem_resolution": <1-5>,
        "empathy": <1-5>,
        "efficiency": <1-5>
    }},
    "total_score": <sum of all 5 scores>,
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "improvements": ["improvement 1", "improvement 2", "improvement 3"],
    "overall_feedback": "Brief summary of performance (2-3 sentences)"
}}"""
        
        try:
            # Use Azure OpenAI to analyze
            response = self.client.chat.completions.create(
                model=self.config.AZURE_AI_MODEL_NAME,
                messages=[
                    {"role": "system", "content": "You are a customer service quality evaluator. Respond only with valid JSON."},
                    {"role": "user", "content": analysis_prompt}
                ]
            )
            
            # Parse response
            import json
            result_text = response.choices[0].message.content.strip()
            # Remove markdown code blocks if present
            if result_text.startswith('```'):
                result_text = result_text.split('```')[1]
                if result_text.startswith('json'):
                    result_text = result_text[4:]
                result_text = result_text.strip()
            
            analysis = json.loads(result_text)
            return analysis
            
        except Exception as e:
            print(f"Error analyzing conversation: {e}")
            # Return default structure if analysis fails
            return {
                "scores": {
                    "professionalism": 3,
                    "communication": 3,
                    "problem_resolution": 3,
                    "empathy": 3,
                    "efficiency": 3
                },
                "total_score": 15,
                "strengths": ["Unable to analyze - error occurred"],
                "improvements": ["Please try analyzing again"],
                "overall_feedback": f"Analysis failed: {str(e)}"
            }
    
    def _format_conversation(self, conversation: List[Dict]) -> str:
        """Format conversation for analysis"""
        formatted = []
        for msg in conversation:
            role = msg.get('role', 'unknown')
            content = msg.get('content', '')
            formatted.append(f"{role.upper()}: {content}")
        return "\n".join(formatted)
    
    def get_agent_info(self) -> Dict:
        """Get information about the agent"""
        return {
            "name": self.config.AGENT_NAME,
            "description": self.config.AGENT_DESCRIPTION,
            "model": self.config.AZURE_AI_MODEL_NAME,
            "status": "active" if self.agent else "inactive"
        }
