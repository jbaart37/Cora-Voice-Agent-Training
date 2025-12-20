"""
Flask application for Voice Agent Simulator
"""
import os
import asyncio
import json
import random
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from config import Config
from agent import VoiceAgent
from storage_service import StorageService
import uuid
from datetime import datetime, timedelta
from functools import wraps

# Configure Azure Monitor OpenTelemetry BEFORE importing Flask
# This enables automatic instrumentation of Flask, requests, and other libraries
try:
    from azure.monitor.opentelemetry import configure_azure_monitor
    from opentelemetry import trace
    
    app_insights_conn_str = os.getenv('APPLICATIONINSIGHTS_CONNECTION_STRING')
    if app_insights_conn_str:
        configure_azure_monitor(
            connection_string=app_insights_conn_str,
            enable_live_metrics=True,
            logger_name="cora.voice.agent"
        )
        print("✓ Azure Monitor OpenTelemetry configured")
        tracer = trace.get_tracer(__name__)
    else:
        print("⚠ APPLICATIONINSIGHTS_CONNECTION_STRING not set - monitoring disabled")
        tracer = None
except ImportError:
    print("⚠ azure-monitor-opentelemetry not installed - monitoring disabled")
    tracer = None

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

# Initialize SocketIO for real-time communication
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

# Initialize voice agent
voice_agent = VoiceAgent()

# Initialize storage service for conversation scores
storage_service = StorageService()

# Easy Auth helper functions
def get_easy_auth_user():
    """Get user from Easy Auth headers"""
    # Easy Auth injects these headers automatically
    principal_name = request.headers.get('X-MS-CLIENT-PRINCIPAL-NAME')  # UPN
    principal_id = request.headers.get('X-MS-CLIENT-PRINCIPAL-ID')  # Object ID
    
    if principal_name:
        return {
            'email': principal_name,
            'id': principal_id,
            'name': principal_name.split('@')[0] if '@' in principal_name else principal_name
        }
    return None

def is_authenticated():
    """Check if user is authenticated via Entra ID or local session"""
    entra_user = request.headers.get('X-MS-CLIENT-PRINCIPAL-NAME')
    local_user = session.get('local_user')
    return entra_user or local_user

def login_required(f):
    """Decorator to require authentication (Entra ID or local)"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not is_authenticated():
            return jsonify({"error": "Authentication required"}), 401
        return f(*args, **kwargs)
    return decorated_function

# Store active conversations
conversations = {}

# Local user credentials (stored in environment variables for security)
LOCAL_USERS = {
    'admin': os.getenv('LOCAL_ADMIN_PASSWORD', 'admin123'),
    'user': os.getenv('LOCAL_USER_PASSWORD', 'user123')
}

# Authentication Routes

@app.route('/landing')
def landing():
    """Landing page with authentication options"""
    return render_template('landing.html')

@app.route('/login/local', methods=['GET', 'POST'])
def local_login():
    """Local username/password login"""
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        if username in LOCAL_USERS and LOCAL_USERS[username] == password:
            session['local_user'] = username
            session['auth_method'] = 'local'
            return redirect(url_for('index'))
        else:
            return render_template('landing.html', error='Invalid username or password')
    
    return render_template('landing.html')

@app.route('/login/entra')
def entra_login():
    """Redirect to Entra ID login via Easy Auth"""
    # Add post_login_redirect_uri to automatically return to app after login
    return redirect('/.auth/login/aad?post_login_redirect_uri=/')

@app.route('/logout')
def logout():
    """Logout user"""
    if 'local_user' in session:
        session.clear()
        return redirect(url_for('landing'))
    else:
        # Entra ID logout
        return redirect('/.auth/logout')

@app.route('/api/auth/status')
def auth_status():
    """Check authentication status from Easy Auth headers"""
    user = get_easy_auth_user()
    return jsonify({
        "authenticated": user is not None,
        "user": user,
        "auth_enabled": True
    })

# Application Routes

@app.route('/')
def index():
    """Render the main application page"""
    # Check if user is authenticated (either Entra ID or local)
    entra_user = request.headers.get('X-MS-CLIENT-PRINCIPAL-NAME')
    local_user = session.get('local_user')
    
    if not entra_user and not local_user:
        return redirect(url_for('landing'))
    
    return render_template('index.html', user=session.get('user'))

@app.route('/api/agent/info', methods=['GET'])
@login_required
def get_agent_info():
    """Get information about the voice agent"""
    try:
        info = voice_agent.get_agent_info()
        return jsonify({"success": True, "data": info})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/user/identity', methods=['GET'])
def get_user_identity():
    """Get current user identity information from Easy Auth headers or local session"""
    try:
        # Check for Easy Auth headers (Azure Container Apps / App Service)
        principal_name = request.headers.get('X-MS-CLIENT-PRINCIPAL-NAME')
        principal_id = request.headers.get('X-MS-CLIENT-PRINCIPAL-ID')
        
        if principal_name:
            # Extract alias from UPN if needed (user@domain.com -> user)
            user_display = principal_name
            if '@' in principal_name:
                alias = principal_name.split('@')[0]
                user_display = f"{alias} ({principal_name})"
            
            return jsonify({
                "success": True,
                "authenticated": True,
                "user": user_display,
                "upn": principal_name,
                "auth_method": "Azure AD (Entra ID)"
            })
        
        # Check for local authentication
        local_user = session.get('local_user')
        if local_user:
            return jsonify({
                "success": True,
                "authenticated": True,
                "user": local_user,
                "auth_method": "Local Account"
            })
        
        # No authentication found
        return jsonify({
            "success": True,
            "authenticated": False,
            "user": None,
            "auth_method": "Local (No Authentication)"
        })
    except Exception as e:
        return jsonify({
            "success": True,
            "authenticated": False,
            "user": None,
            "auth_method": "Local (No Authentication)"
        })

@app.route('/api/conversation/new', methods=['POST'])
@login_required
def new_conversation():
    """Start a new conversation"""
    try:
        data = request.get_json() or {}
        mood = data.get('mood', 'neutral')
        
        conversation_id = str(uuid.uuid4())
        conversations[conversation_id] = {
            "id": conversation_id,
            "messages": [],
            "mood": mood,
            "created_at": datetime.utcnow().isoformat(),
            "status": "active"
        }
        return jsonify({
            "success": True,
            "conversation_id": conversation_id,
            "mood": mood
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/conversation/<conversation_id>/messages', methods=['GET'])
@login_required
def get_conversation_messages(conversation_id):
    """Get all messages from a conversation"""
    if conversation_id not in conversations:
        return jsonify({"success": False, "error": "Conversation not found"}), 404
    
    return jsonify({
        "success": True,
        "messages": conversations[conversation_id]["messages"]
    })

@app.route('/api/user/scores', methods=['GET'])
def get_user_scores():
    """Get conversation scores for the current user"""
    try:
        # Get user identity - check all possible headers
        principal_name = request.headers.get('X-MS-CLIENT-PRINCIPAL-NAME')
        principal_id = request.headers.get('X-MS-CLIENT-PRINCIPAL-ID')
        local_user = session.get('local_user')
        
        # Debug: print all relevant headers and ALL request headers
        print(f"📊 === Fetching User Scores ===")
        print(f"   All Headers:")
        for header, value in request.headers:
            if 'MS-CLIENT' in header or 'PRINCIPAL' in header or 'AUTH' in header:
                print(f"     {header}: {value}")
        print(f"   Easy Auth Headers:")
        print(f"     X-MS-CLIENT-PRINCIPAL-NAME: {principal_name}")
        print(f"     X-MS-CLIENT-PRINCIPAL-ID: {principal_id}")
        print(f"   Session:")
        print(f"     local_user: {local_user}")
        
        user_identity = principal_name or local_user or 'anonymous'
        print(f"   Using Identity (original): '{user_identity}'")
        print(f"   Using Identity (normalized): '{user_identity.lower()}'")
        
        # Get limit from query params (default 10)
        limit = request.args.get('limit', 10, type=int)
        
        # Fetch scores from storage (storage service will normalize to lowercase)
        scores = storage_service.get_user_scores(user_identity, limit)
        
        print(f"   Query returned {len(scores)} scores")
        if len(scores) == 0:
            print(f"   ⚠ No scores found - verifying table has data for '{user_identity.lower()}'")
        else:
            print(f"   ✓ Successfully retrieved {len(scores)} scores for '{user_identity.lower()}'")
        
        return jsonify({
            "success": True,
            "scores": scores,
            "user_identity": user_identity
        })
    except Exception as e:
        print(f"⚠ Error fetching user scores: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/conversation/<conversation_id>/analyze', methods=['POST'])
def analyze_conversation(conversation_id):
    """Analyze a conversation for quality and improvement with standardized scoring"""
    print(f"Analyzing conversation: {conversation_id}")
    
    if conversation_id not in conversations:
        print(f"Conversation {conversation_id} not found. Available: {list(conversations.keys())}")
        return jsonify({"success": False, "error": "Conversation not found"}), 404
    
    try:
        # Get analysis from AI
        analysis = voice_agent.analyze_interaction(
            conversations[conversation_id]["messages"]
        )
        
        # Get user identity
        principal_name = request.headers.get('X-MS-CLIENT-PRINCIPAL-NAME')
        local_user = session.get('local_user')
        user_identity = principal_name or local_user or 'anonymous'
        auth_method = 'Azure AD' if principal_name else ('Local' if local_user else 'Anonymous')
        
        # Store score in Azure Table Storage
        storage_service.save_conversation_score(
            conversation_id=conversation_id,
            user_identity=user_identity,
            auth_method=auth_method,
            analysis=analysis,
            message_count=len(conversations[conversation_id]["messages"])
        )
        
        return jsonify({"success": True, "analysis": analysis})
    except Exception as e:
        print(f"Error analyzing conversation: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

# WebSocket Events for real-time communication

@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    print(f"Client connected: {request.sid}")
    emit('connected', {'message': 'Connected to Voice Agent Simulator'})

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    print(f"Client disconnected: {request.sid}")

@socketio.on('send_message')
def handle_message(data):
    """
    Handle incoming message from user
    Expected data: {
        "conversation_id": str,
        "message": str,
        "is_scenario_prompt": bool (optional)
    }
    """
    try:
        conversation_id = data.get('conversation_id')
        user_message = data.get('message')
        is_scenario_prompt = data.get('is_scenario_prompt', False)
        
        if not conversation_id or not user_message:
            emit('error', {'message': 'Missing conversation_id or message'})
            return
        
        if conversation_id not in conversations:
            emit('error', {'message': 'Conversation not found'})
            return
        
        # For scenario prompts, don't add to conversation history - just use to trigger AI
        if not is_scenario_prompt:
            # Add user message to conversation
            conversations[conversation_id]["messages"].append({
                "role": "user",
                "content": user_message,
                "timestamp": datetime.utcnow().isoformat()
            })
        
        # Get conversation mood
        mood = conversations[conversation_id].get("mood", "neutral")
        
        # Process message with voice agent (run async in sync context)
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        result = loop.run_until_complete(
            voice_agent.process_message(
                user_message,
                conversations[conversation_id]["messages"],
                mood=mood,
                is_scenario_prompt=is_scenario_prompt
            )
        )
        loop.close()
        
        if result["success"]:
            # Add agent response to conversation
            agent_message = {
                "role": "assistant",
                "content": result["response"],
                "timestamp": datetime.utcnow().isoformat(),
                "metadata": result.get("metadata", {})
            }
            conversations[conversation_id]["messages"].append(agent_message)
            
            # Send response to client
            emit('message_response', {
                "conversation_id": conversation_id,
                "message": agent_message
            })
        else:
            emit('error', {'message': result.get("error", "Failed to process message")})
            
    except Exception as e:
        print(f"Error handling message: {str(e)}")
        emit('error', {'message': str(e)})

@socketio.on('audio_data')
def handle_audio(data):
    """
    Handle incoming audio data for voice input
    This is a placeholder for future voice recognition implementation
    """
    # TODO: Implement audio processing with Azure Speech Services
    emit('audio_processing', {'status': 'Audio processing not yet implemented'})

@app.route('/api/admin/seed-demo-data', methods=['POST'])
def seed_demo_data():
    """
    Seed demo analytics data for testing
    (Admin endpoint - should be secured in production)
    
    LEARNING NOTE: This endpoint creates sample data for testing the analytics dashboard.
    In a real deployment, you would:
    1. Secure this endpoint (require admin role)
    2. Use actual user identities from your organization
    3. Or remove it entirely for production
    """
    # Example users - replace with your own test accounts
    users = [
        'testuser1@example.com',
        'testuser2@example.com'
    ]
    
    base_scores = {
        'professionalism': 15,
        'communication': 14,
        'problem_resolution': 13,
        'empathy': 14,
        'efficiency': 13
    }
    
    results = []
    
    for user in users:
        for i in range(5):
            conversation_id = str(uuid.uuid4())
            improvement = i * 1.5
            variance = random.uniform(-1, 2)
            
            scores = {
                'professionalism': min(25, base_scores['professionalism'] + improvement + variance),
                'communication': min(25, base_scores['communication'] + improvement + variance),
                'problem_resolution': min(25, base_scores['problem_resolution'] + improvement + variance),
                'empathy': min(25, base_scores['empathy'] + improvement + variance),
                'efficiency': min(25, base_scores['efficiency'] + improvement + variance)
            }
            
            scores = {k: round(v, 1) for k, v in scores.items()}
            total = round(sum(scores.values()), 1)
            
            analysis = {
                'scores': scores,
                'total_score': total,
                'strengths': ['Good performance', 'Steady improvement'],
                'improvements': ['Continue practicing' if total < 90 else 'Excellent work'],
                'overall_feedback': f"Score: {total}/125"
            }
            
            message_count = random.randint(8, 25)
            
            success = storage_service.save_conversation_score(
                conversation_id=conversation_id,
                user_identity=user,
                auth_method="Azure AD (Entra ID)",
                analysis=analysis,
                message_count=message_count
            )
            
            results.append({
                'user': user,
                'conversation': i + 1,
                'total': total,
                'success': success
            })
    
    return jsonify({
        'status': 'completed',
        'results': results
    })

if __name__ == '__main__':
    try:
        Config.validate_config()
        print("\n" + "="*60)
        print("Voice Agent Simulator Starting...")
        print("="*60)
        print(f"Environment: {Config.ENV}")
        print(f"Port: {Config.PORT}")
        print(f"Agent: {Config.AGENT_NAME}")
        print("="*60 + "\n")
        
        socketio.run(
            app,
            host='0.0.0.0',
            port=Config.PORT,
            debug=Config.DEBUG
        )
    except Exception as e:
        print(f"\n✗ Failed to start application: {str(e)}")
        print("Please check your configuration in .env file\n")
