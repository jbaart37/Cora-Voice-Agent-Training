// Voice Agent Simulator - Client Application

class VoiceAgentSimulator {
    constructor() {
        this.socket = null;
        this.currentConversationId = null;
        this.messages = [];
        this.voiceEnabled = false;
        this.isListening = false;
        this.isPaused = false;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.conversationVoice = null; // Lock voice for entire conversation
        this.speechRetryCount = 0; // Track synthesis retry attempts
        this.MAX_SPEECH_RETRIES = 2; // Maximum retry attempts for failed synthesis
        this.isCurrentlySpeaking = false;
        this.init();
    }

    init() {
        this.connectSocket();
        this.setupEventListeners();
        this.setupVoiceRecognition();
        this.loadAgentInfo();
        this.loadUserIdentity();
        this.populateVoiceOptions();
        this.initializeTheme();
    }

    populateVoiceOptions() {
        // Wait for voices to be loaded
        const loadVoices = () => {
            const voices = this.synthesis.getVoices();
            if (voices.length === 0) {
                // Voices not loaded yet, try again
                setTimeout(loadVoices, 100);
                return;
            }

            const voiceSelect = document.getElementById('voice-gender');
            
            // Get unique English voices
            const englishVoices = voices.filter(v => v.lang.startsWith('en'));
            
            // Add specific voices to dropdown
            englishVoices.forEach(voice => {
                const option = document.createElement('option');
                const gender = this.getVoiceGender(voice.name);
                const genderIcon = gender === 'female' ? '👩' : '👨';
                const isNatural = /neural|natural|premium|enhanced/i.test(voice.name);
                const qualityIcon = isNatural ? ' ⭐' : '';
                
                option.value = voice.name;
                option.textContent = `${genderIcon} ${voice.name}${qualityIcon}`;
                option.dataset.voiceName = voice.name;
                voiceSelect.appendChild(option);
            });

            console.log(`Loaded ${englishVoices.length} English voices`);
        };

        // Start loading voices
        loadVoices();
        
        // Also listen for voiceschanged event (some browsers need this)
        if (this.synthesis.onvoiceschanged !== undefined) {
            this.synthesis.onvoiceschanged = loadVoices;
        }
    }

    connectSocket() {
        this.socket = io();
        
        this.socket.on('connect', () => {
            console.log('Connected to server');
            this.updateStatus('Connected');
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
            this.updateStatus('Disconnected');
        });

        this.socket.on('message_response', (data) => {
            this.handleMessageResponse(data);
        });

        this.socket.on('error', (data) => {
            this.showError(data.message);
            this.hideLoading();
        });
    }

    setupEventListeners() {
        // Theme Toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Getting Started Modal
        document.getElementById('getting-started-btn').addEventListener('click', () => {
            this.showGettingStartedModal();
        });

        document.getElementById('close-getting-started').addEventListener('click', () => {
            this.hideGettingStartedModal();
        });

        // Close Getting Started modal when clicking outside
        document.getElementById('getting-started-modal').addEventListener('click', (e) => {
            if (e.target.id === 'getting-started-modal') {
                this.hideGettingStartedModal();
            }
        });

        // About Cora Modal
        document.getElementById('about-cora-btn').addEventListener('click', () => {
            this.showAboutModal();
        });

        document.getElementById('close-modal').addEventListener('click', () => {
            this.hideAboutModal();
        });

        // Close modal when clicking outside
        document.getElementById('about-modal').addEventListener('click', (e) => {
            if (e.target.id === 'about-modal') {
                this.hideAboutModal();
            }
        });

        // Performance Analytics button
        document.getElementById('performance-analytics-btn').addEventListener('click', () => {
            this.showPerformanceAnalytics();
        });

        // Close analytics modal when clicking outside
        document.getElementById('analytics-modal').addEventListener('click', (e) => {
            if (e.target.id === 'analytics-modal') {
                document.getElementById('analytics-modal').style.display = 'none';
            }
        });

        // New Conversation
        document.getElementById('new-conversation').addEventListener('click', () => {
            this.startNewConversation();
        });

        // Send Message
        document.getElementById('send-message').addEventListener('click', () => {
            this.sendMessage();
        });

        // Enter key to send
        document.getElementById('user-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Analyze Conversation
        document.getElementById('analyze-conversation').addEventListener('click', () => {
            this.analyzeConversation();
        });

        // Pause Conversation
        document.getElementById('pause-conversation').addEventListener('click', () => {
            this.togglePauseConversation();
        });

        // End Conversation
        document.getElementById('end-conversation').addEventListener('click', () => {
            this.endConversation();
        });

        // Scenario buttons
        document.querySelectorAll('.btn-scenario').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.loadScenario(e.target.dataset.scenario);
            });
        });

        // Voice toggle button
        document.getElementById('toggle-voice').addEventListener('click', () => {
            this.toggleVoiceMode();
        });
    }

    setupVoiceRecognition() {
        // Check if browser supports speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            console.warn('Speech recognition not supported in this browser');
            document.getElementById('toggle-voice').disabled = true;
            document.querySelector('.panel-section h3:nth-child(1)').insertAdjacentHTML(
                'afterend', 
                '<p class="info-text" style="color: red;">Speech recognition not supported in this browser. Try Chrome or Edge.</p>'
            );
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateVoiceUI('listening');
        };

        this.recognition.onend = () => {
            this.isListening = false;
            // Only restart if voice is enabled AND we're not currently speaking
            if (this.voiceEnabled && !this.isCurrentlySpeaking) {
                // Restart if voice mode is still enabled
                try {
                    this.recognition.start();
                } catch (e) {
                    console.error('Failed to restart recognition:', e);
                }
            } else {
                this.updateVoiceUI('inactive');
            }
        };

        this.recognition.onresult = (event) => {
            const last = event.results.length - 1;
            const transcript = event.results[last][0].transcript;
            
            if (transcript.trim() && !this.isPaused) {
                console.log('Voice input:', transcript);
                this.updateVoiceUI('processing');
                
                // Send the transcribed text as a message
                document.getElementById('user-input').value = transcript;
                this.sendMessage();
            }
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'no-speech') {
                // Continue listening
                return;
            }
            this.updateVoiceUI('error');
        };
    }

    toggleVoiceMode() {
        if (!this.currentConversationId) {
            alert('Please start a new conversation first');
            return;
        }

        this.voiceEnabled = !this.voiceEnabled;
        const button = document.getElementById('toggle-voice');
        const voiceStatus = document.getElementById('voice-status');

        if (this.voiceEnabled) {
            button.textContent = '🔴 Disable Voice Chat';
            button.classList.add('btn-voice-active');
            voiceStatus.style.display = 'block';
            
            try {
                this.recognition.start();
            } catch (e) {
                console.error('Failed to start recognition:', e);
                this.voiceEnabled = false;
                button.textContent = '🎤 Enable Voice Chat';
                button.classList.remove('btn-voice-active');
                voiceStatus.style.display = 'none';
            }
        } else {
            button.textContent = '🎤 Enable Voice Chat';
            button.classList.remove('btn-voice-active');
            voiceStatus.style.display = 'none';
            
            try {
                this.recognition.stop();
            } catch (e) {
                console.error('Failed to stop recognition:', e);
            }
            
            // Cancel any ongoing speech
            this.synthesis.cancel();
        }
    }

    updateVoiceUI(state) {
        const stateText = document.getElementById('voice-state-text');
        const pulseDot = document.querySelector('.pulse-dot');
        
        switch(state) {
            case 'listening':
                stateText.textContent = 'Listening...';
                pulseDot.className = 'pulse-dot listening';
                break;
            case 'processing':
                stateText.textContent = 'Processing...';
                pulseDot.className = 'pulse-dot processing';
                break;
            case 'speaking':
                stateText.textContent = 'AI Speaking...';
                pulseDot.className = 'pulse-dot speaking';
                break;
            case 'error':
                stateText.textContent = 'Error - Retrying...';
                pulseDot.className = 'pulse-dot error';
                break;
            case 'inactive':
                stateText.textContent = 'Inactive';
                pulseDot.className = 'pulse-dot';
                break;
        }
    }

    speakText(text) {
        // Check if auto-speak is enabled
        const autoSpeakCheckbox = document.getElementById('auto-speak');
        if (!autoSpeakCheckbox || !autoSpeakCheckbox.checked) {
            console.log('Auto-speak disabled or checkbox not found');
            return;
        }

        console.log('Speaking text:', text.substring(0, 50) + '...');

        // CRITICAL: Stop listening BEFORE starting synthesis to prevent feedback loop
        this.isCurrentlySpeaking = true;
        if (this.isListening) {
            try {
                this.recognition.stop();
                this.isListening = false;
            } catch (e) {
                console.error('Failed to stop recognition:', e);
            }
        }

        // Cancel any ongoing speech
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set voice characteristics based on customer mood
        const mood = document.getElementById('customer-mood').value;
        utterance.rate = this.getVoiceRate(mood);
        utterance.pitch = this.getVoicePitch(mood);
        
        // Select voice based on preference
        const selectedVoice = document.getElementById('voice-gender').value;
        const selectedQuality = document.getElementById('voice-quality').value;
        const voices = this.synthesis.getVoices();
        const englishVoices = voices.filter(v => v.lang.startsWith('en'));
        
        let preferredVoice = null;

        if (selectedVoice === 'random') {
            // Use locked conversation voice, or pick a new random one
            if (this.conversationVoice) {
                preferredVoice = this.conversationVoice;
                console.log('🔒 Using locked conversation voice:', preferredVoice?.name);
            } else {
                // Pick random and lock it for this conversation
                preferredVoice = englishVoices[Math.floor(Math.random() * englishVoices.length)];
                this.conversationVoice = preferredVoice;
                console.log('🎲 Random voice selected and locked:', preferredVoice?.name);
            }
        } else if (selectedVoice === 'female' || selectedVoice === 'male') {
            // Gender-based selection with quality preference
            const qualityPatterns = this.getVoiceQualityPatterns(selectedQuality);
            
            for (const pattern of qualityPatterns) {
                preferredVoice = englishVoices.find(v => 
                    this.getVoiceGender(v.name) === selectedVoice &&
                    (pattern === '' || new RegExp(pattern, 'i').test(v.name))
                );
                if (preferredVoice) break;
            }
            
            // Fallback to any voice matching gender
            if (!preferredVoice) {
                preferredVoice = englishVoices.find(v => 
                    this.getVoiceGender(v.name) === selectedVoice
                );
            }
            console.log('Using', selectedVoice, 'voice:', preferredVoice?.name, '| Quality:', selectedQuality);
        } else {
            // Specific voice selected by name
            preferredVoice = voices.find(v => v.name === selectedVoice);
            console.log('Using specific voice:', preferredVoice?.name);
        }
        
        // Final fallback to any English voice
        if (!preferredVoice && englishVoices.length > 0) {
            preferredVoice = englishVoices[0];
            console.log('Fallback to default voice:', preferredVoice?.name);
        }
        
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        // Cancel any ongoing speech to prevent interruption errors
        if (this.isCurrentlySpeaking) {
            this.synthesis.cancel();
        }

        utterance.onstart = () => {
            this.updateVoiceUI('speaking');
            this.isCurrentlySpeaking = true;
            this.speechRetryCount = 0; // Reset retry counter on successful start
        };

        utterance.onend = () => {
            this.isCurrentlySpeaking = false;
            this.updateVoiceUI('listening');
            
            // Add 1000ms delay after speech ends before restarting recognition
            // This prevents picking up echo or residual audio from the speech synthesis
            setTimeout(() => {
                if (this.voiceEnabled && !this.isListening && !this.isCurrentlySpeaking) {
                    try {
                        // Stop any existing recognition before starting
                        if (this.recognition) {
                            try {
                                this.recognition.stop();
                            } catch (e) {
                                // Already stopped, ignore
                            }
                        }
                        this.recognition.start();
                        this.isListening = true;
                    } catch (e) {
                        // Only log non-'already started' errors
                        if (!e.message?.includes('already started')) {
                            console.error('Failed to restart recognition:', e);
                        }
                    }
                }
            }, 1000);
        };

        utterance.onerror = (event) => {
            // Only log non-interrupted errors (interrupted is normal when user speaks)
            if (event.error !== 'interrupted') {
                console.error('Speech synthesis error:', event.error);
            }
            this.isCurrentlySpeaking = false;
            
            // Handle synthesis-failed errors with retry logic
            if (event.error === 'synthesis-failed' && this.speechRetryCount < this.MAX_SPEECH_RETRIES) {
                this.speechRetryCount++;
                console.log(`Retrying speech synthesis (attempt ${this.speechRetryCount}/${this.MAX_SPEECH_RETRIES})...`);
                
                // Reset speech synthesis and try again with a different voice
                this.synthesis.cancel();
                
                setTimeout(() => {
                    // Clear conversation voice to force selection of different voice
                    this.conversationVoice = null;
                    this.speak(text); // Retry with new voice
                }, 500);
                return;
            }
            
            // Reset retry counter on non-synthesis-failed errors or max retries reached
            if (event.error !== 'synthesis-failed' || this.speechRetryCount >= this.MAX_SPEECH_RETRIES) {
                this.speechRetryCount = 0;
                if (event.error === 'synthesis-failed') {
                    console.warn('Speech synthesis failed after retries. Continuing without voice output.');
                }
            }
            
            this.updateVoiceUI('listening');
            
            // Add delay even on error to prevent feedback loop
            setTimeout(() => {
                if (this.voiceEnabled && !this.isListening && !this.isCurrentlySpeaking) {
                    try {
                        // Stop any existing recognition before starting
                        if (this.recognition) {
                            try {
                                this.recognition.stop();
                            } catch (e) {
                                // Already stopped, ignore
                            }
                        }
                        this.recognition.start();
                        this.isListening = true;
                    } catch (e) {
                        // Only log non-'already started' errors
                        if (!e.message?.includes('already started')) {
                            console.error('Failed to restart recognition:', e);
                        }
                    }
                }
            }, 1000);
        };

        this.synthesis.speak(utterance);
    }

    getVoiceGender(voiceName) {
        // Common patterns in voice names to determine gender
        const malePat = /male|david|mark|james|george|ryan|christopher|andrew|brian|daniel/i;
        const femalePat = /female|zira|susan|catherine|mary|helen|linda|samantha|karen|sarah|emma/i;
        
        if (femalePat.test(voiceName)) return 'female';
        if (malePat.test(voiceName)) return 'male';
        
        // Default to female if unclear
        return 'female';
    }
    getVoiceQualityPatterns(quality) {
        // Return priority-ordered patterns for voice selection
        // Browser vendors use different naming conventions for voice quality
        const patterns = {
            'premium': [
                'neural|natural|premium|enhanced|wavenet', // Google/Microsoft neural voices
                'compact|quality|novelty|improved', // Alternative high-quality indicators
                '' // Fallback to any voice
            ],
            'enhanced': [
                'enhanced|improved|hd|quality',
                'online|network|cloud', // Cloud-based voices
                '' // Fallback
            ],
            'standard': [
                'standard|default|basic',
                '' // Any voice
            ]
        };
        return patterns[quality] || patterns['premium'];
    }
    getVoiceQualityPatterns(quality) {
        // Return priority-ordered patterns for voice selection
        // Browser vendors use different naming conventions
        const patterns = {
            'premium': [
                'neural|natural|premium|enhanced|wavenet', // Google/Microsoft neural voices
                'compact|quality|novelty', // Alternative high-quality indicators
                '' // Fallback to any voice
            ],
            'enhanced': [
                'enhanced|improved|hd|quality',
                'online|network|cloud', // Cloud-based voices
                '' // Fallback
            ],
            'standard': [
                'standard|default|basic',
                '' // Any voice
            ]
        };
        return patterns[quality] || patterns['premium'];
    }

    getVoiceRate(mood) {
        const rates = {
            'happy': 1.1,
            'curious': 1.0,
            'frustrated': 1.2,
            'confused': 0.9,
            'impatient': 1.3,
            'neutral': 1.0
        };
        return rates[mood] || 1.0;
    }

    getVoicePitch(mood) {
        const pitches = {
            'happy': 1.2,
            'curious': 1.1,
            'frustrated': 0.9,
            'confused': 1.0,
            'impatient': 1.1,
            'neutral': 1.0
        };
        return pitches[mood] || 1.0;
    }

    async loadAgentInfo() {
        try {
            const response = await fetch('/api/agent/info');
            const data = await response.json();
            
            if (data.success) {
                document.getElementById('agent-name').textContent = data.data.name;
                document.getElementById('model-name').textContent = data.data.model;
                document.getElementById('status').textContent = data.data.status;
            }
        } catch (error) {
            console.error('Failed to load agent info:', error);
        }
        
        // Load user identity
        this.loadUserIdentity();
    }

    async loadUserIdentity() {
        try {
            const response = await fetch('/api/user/identity');
            const data = await response.json();
            
            const identityText = document.getElementById('identity-text');
            if (data.authenticated && data.user) {
                // Show auth method and username
                const authLabel = data.auth_method === 'Azure AD (Entra ID)' ? 'Entra ID' : 'Local Auth';
                identityText.textContent = `${authLabel}: ${data.user}`;
            } else {
                identityText.textContent = 'Not Authenticated';
            }
        } catch (error) {
            document.getElementById('identity-text').textContent = 'Not Authenticated';
        }
    }

    showAboutModal() {
        document.getElementById('about-modal').classList.add('active');
    }

    hideAboutModal() {
        document.getElementById('about-modal').classList.remove('active');
    }

    showGettingStartedModal() {
        document.getElementById('getting-started-modal').classList.add('active');
    }

    hideGettingStartedModal() {
        document.getElementById('getting-started-modal').classList.remove('active');
    }

    initializeTheme() {
        // Load saved theme from localStorage or default to light
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeButton(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeButton(newTheme);
    }

    updateThemeButton(theme) {
        const themeToggle = document.getElementById('theme-toggle');
        if (theme === 'dark') {
            themeToggle.innerHTML = '☀️ Light';
        } else {
            themeToggle.innerHTML = '🌙 Dark';
        }
    }

    async startNewConversation() {
        this.showLoading();
        
        try {
            // Get selected mood
            const mood = document.getElementById('customer-mood').value;
            
            const response = await fetch('/api/conversation/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ mood: mood })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Clear the previous conversation ID now
                this.currentConversationId = data.conversation_id;
                this.messages = [];
                this.conversationVoice = null; // Reset voice lock for new conversation
                this.isPaused = false;
                this.clearChatMessages();
                this.enableChatInput();
                
                // Reset pause button state
                const pauseBtn = document.getElementById('pause-conversation');
                if (pauseBtn) {
                    pauseBtn.textContent = '⏸️ Pause';
                    pauseBtn.classList.remove('active');
                }
                
                // Clear any previous analysis
                const analysisContent = document.getElementById('analysis-content');
                if (analysisContent) {
                    analysisContent.innerHTML = '<p>Complete a conversation and click "Analyze Conversation" to see detailed scoring.</p>';
                }
                
                this.updateConversationId();
                this.addSystemMessage('Conversation started. You are the customer service agent. Wait for Cora (the digital customer) to speak or greet them first.');
            } else {
                this.showError('Failed to start conversation');
            }
        } catch (error) {
            this.showError('Error starting conversation: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    sendMessage(messageText = null, isScenarioPrompt = false) {
        const input = document.getElementById('user-input');
        const message = messageText || input.value.trim();
        
        if (!message || !this.currentConversationId || this.isPaused) return;
        
        // Only show message in UI if it's not a hidden scenario prompt
        if (!isScenarioPrompt) {
            this.addMessage('user', message);
            input.value = '';
        } else {
            // For scenario prompts, show a system message
            this.addSystemMessage('Starting scenario... Cora will begin the conversation.');
        }
        
        // Send to server via WebSocket
        this.socket.emit('send_message', {
            conversation_id: this.currentConversationId,
            message: message,
            is_scenario_prompt: isScenarioPrompt
        });
        
        this.showLoading();
    }

    handleMessageResponse(data) {
        this.hideLoading();
        
        if (data.conversation_id === this.currentConversationId) {
            this.addMessage('assistant', data.message.content, data.message.timestamp);
            
            // Speak the AI response if auto-speak is enabled (independent of voice mode)
            this.speakText(data.message.content);
            
            // Enable analyze button after at least one exchange
            if (this.messages.length >= 2) {
                document.getElementById('analyze-conversation').disabled = false;
            }
        }
    }

    addMessage(role, content, timestamp = null) {
        this.messages.push({ role, content, timestamp: timestamp || new Date().toISOString() });
        
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) {
            console.error('Messages container not found');
            return;
        }
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;
        
        const time = timestamp ? new Date(timestamp) : new Date();
        const timeStr = time.toLocaleTimeString();
        
        messageDiv.innerHTML = `
            <div class="message-role">${role === 'user' ? 'You (Agent)' : 'Cora (Customer)'}</div>
            <div class="message-bubble">
                ${this.escapeHtml(content)}
            </div>
            <div class="message-timestamp">${timeStr}</div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    addSystemMessage(content) {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) {
            console.error('Messages container not found');
            return;
        }
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message system-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <p><em>🔔 ${content}</em></p>
            </div>
        `;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    togglePauseConversation() {
        this.isPaused = !this.isPaused;
        const pauseBtn = document.getElementById('pause-conversation');
        
        if (this.isPaused) {
            // Pause: Stop voice recognition
            if (this.voiceEnabled && this.isListening) {
                try {
                    this.recognition.stop();
                    this.isListening = false;
                } catch (e) {
                    console.error('Failed to stop recognition:', e);
                }
            }
            // Stop any ongoing speech
            this.synthesis.cancel();
            this.isCurrentlySpeaking = false;
            
            pauseBtn.textContent = '▶️ Resume';
            pauseBtn.classList.add('active');
            this.updateVoiceUI('paused');
            this.addSystemMessage('Conversation paused by agent');
        } else {
            // Resume: Restart voice recognition if enabled
            if (this.voiceEnabled && !this.isListening && !this.isCurrentlySpeaking) {
                try {
                    this.recognition.start();
                    this.isListening = true;
                } catch (e) {
                    console.error('Failed to restart recognition:', e);
                }
            }
            
            pauseBtn.textContent = '⏸️ Pause';
            pauseBtn.classList.remove('active');
            this.updateVoiceUI(this.voiceEnabled ? 'listening' : 'inactive');
            this.addSystemMessage('Conversation resumed by agent');
        }
    }

    endConversation() {
        if (!this.currentConversationId) return;
        
        // Stop all voice activity
        if (this.voiceEnabled) {
            this.toggleVoiceMode(); // Turn off voice mode
        }
        
        // Stop recognition and speech
        if (this.isListening) {
            try {
                this.recognition.stop();
                this.isListening = false;
            } catch (e) {
                console.error('Failed to stop recognition:', e);
            }
        }
        this.synthesis.cancel();
        this.isCurrentlySpeaking = false;
        
        // Reset conversation state
        this.addSystemMessage('Conversation ended. You can now analyze this conversation.');
        // DON'T clear the conversation ID - keep it so user can analyze
        // this.currentConversationId = null;
        this.conversationVoice = null;
        this.isPaused = false;
        
        // Update UI
        document.getElementById('user-input').disabled = true;
        document.getElementById('send-message').disabled = true;
        document.getElementById('pause-conversation').disabled = true;
        document.getElementById('end-conversation').disabled = true;
        document.getElementById('pause-conversation').textContent = '⏸️ Pause';
        document.getElementById('pause-conversation').classList.remove('active');
        
        // Keep conversation ID visible for analysis
        this.updateConversationId();
        this.updateVoiceUI('inactive');
    }

    addSystemMessage(text) {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) {
            console.error('Messages container not found');
            return;
        }
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message system-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <p><em>🔔 ${text}</em></p>
            </div>
        `;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async analyzeConversation() {
        if (!this.currentConversationId) {
            console.log('No conversation ID');
            return;
        }
        
        console.log('Analyzing conversation:', this.currentConversationId);
        this.showLoading();
        
        try {
            const response = await fetch(`/api/conversation/${this.currentConversationId}/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server error:', errorText);
                this.showError(`Server error (${response.status}): ${errorText}`);
                this.hideLoading();
                return;
            }
            
            const data = await response.json();
            console.log('Analysis data:', data);
            
            if (data.success) {
                this.displayAnalysis(data.analysis);
            } else {
                this.showError('Failed to analyze conversation: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error analyzing conversation:', error);
            this.showError('Error analyzing conversation: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    displayAnalysis(analysis) {
        const analysisContent = document.getElementById('analysis-content');
        
        const scores = analysis.scores || {};
        const totalScore = analysis.total_score || 0;
        
        // Helper function to get score width
        const getScoreWidth = (score) => {
            const widthMap = { 0: 0, 1: 20, 2: 40, 3: 60, 4: 80, 5: 100 };
            return widthMap[score] || 0;
        };
        
        analysisContent.innerHTML = `
            <div class="analysis-header">
                <div class="total-score-card">
                    <div class="score-display">${totalScore}/25</div>
                    <div class="score-label">Total Score</div>
                </div>
            </div>
            
            <div class="analysis-section">
                <h4>📊 Detailed Scores</h4>
                <div class="score-breakdown">
                    <div class="score-item">
                        <span class="score-name">👔 Professionalism & Courtesy</span>
                        <span class="score-bar">
                            <span class="score-fill score-${scores.professionalism || 0}" style="width: ${getScoreWidth(scores.professionalism || 0)}%"></span>
                        </span>
                        <span class="score-value">${scores.professionalism || 0}/5</span>
                    </div>
                    <div class="score-item">
                        <span class="score-name">💬 Communication Clarity</span>
                        <span class="score-bar">
                            <span class="score-fill score-${scores.communication || 0}" style="width: ${getScoreWidth(scores.communication || 0)}%"></span>
                        </span>
                        <span class="score-value">${scores.communication || 0}/5</span>
                    </div>
                    <div class="score-item">
                        <span class="score-name">✅ Problem Resolution</span>
                        <span class="score-bar">
                            <span class="score-fill score-${scores.problem_resolution || 0}" style="width: ${getScoreWidth(scores.problem_resolution || 0)}%"></span>
                        </span>
                        <span class="score-value">${scores.problem_resolution || 0}/5</span>
                    </div>
                    <div class="score-item">
                        <span class="score-name">❤️ Empathy & Active Listening</span>
                        <span class="score-bar">
                            <span class="score-fill score-${scores.empathy || 0}" style="width: ${getScoreWidth(scores.empathy || 0)}%"></span>
                        </span>
                        <span class="score-value">${scores.empathy || 0}/5</span>
                    </div>
                    <div class="score-item">
                        <span class="score-name">⚡ Efficiency & Responsiveness</span>
                        <span class="score-bar">
                            <span class="score-fill score-${scores.efficiency || 0}" style="width: ${getScoreWidth(scores.efficiency || 0)}%"></span>
                        </span>
                        <span class="score-value">${scores.efficiency || 0}/5</span>
                    </div>
                </div>
            </div>
            
            <div class="analysis-section">
                <h4>✅ Strengths</h4>
                <ul>
                    ${(analysis.strengths || []).map(s => `<li>${this.escapeHtml(s)}</li>`).join('')}
                </ul>
            </div>
            
            <div class="analysis-section">
                <h4>🔍 Areas for Improvement</h4>
                <ul>
                    ${(analysis.improvements || []).map(i => `<li>${this.escapeHtml(i)}</li>`).join('')}
                </ul>
            </div>
            
            <div class="analysis-section">
                <h4>💡 Overall Feedback</h4>
                <p>${this.escapeHtml(analysis.overall_feedback || 'No feedback available')}</p>
            </div>
        `;
    }

    async loadScenario(scenarioType) {
        const scenarioPrompts = {
            product: "Start a conversation as a customer interested in learning about products and services. Begin by asking about what's available.",
            complaint: "Start a conversation as a frustrated customer with a complaint about a recent purchase or service. Express your dissatisfaction and explain the issue.",
            return: "Start a conversation as a customer who needs to return or exchange a product. Explain what you bought and why you want to return it.",
            technical: "Start a conversation as a confused customer experiencing a technical problem. Describe the issue you're having with the product or service."
        };
        
        if (scenarioPrompts[scenarioType]) {
            // Send the scenario prompt to trigger Cora (digital customer) to start conversation
            const mood = document.getElementById('customer-mood').value;
            await this.sendMessage(scenarioPrompts[scenarioType], true); // true = system message, hidden from user
        }
    }

    clearChatMessages() {
        const messagesContainer = document.getElementById('chat-messages');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
        }
    }

    enableChatInput() {
        document.getElementById('user-input').disabled = false;
        document.getElementById('send-message').disabled = false;
        document.getElementById('toggle-voice').disabled = false;
        document.getElementById('pause-conversation').disabled = false;
        document.getElementById('end-conversation').disabled = false;
        document.querySelectorAll('.btn-scenario').forEach(btn => btn.disabled = false);
    }

    updateConversationId() {
        const idElement = document.getElementById('conversation-id');
        if (this.currentConversationId) {
            idElement.textContent = `ID: ${this.currentConversationId.substring(0, 8)}...`;
        } else {
            idElement.textContent = 'No active conversation';
        }
    }

    updateStatus(status) {
        document.getElementById('status').textContent = status;
    }

    showLoading() {
        document.getElementById('loading-overlay').classList.add('active');
    }

    hideLoading() {
        document.getElementById('loading-overlay').classList.remove('active');
    }

    showError(message) {
        alert('Error: ' + message);
        console.error(message);
    }

    async showPerformanceAnalytics() {
        const modal = document.getElementById('analytics-modal');
        const loading = document.getElementById('analytics-loading');
        const content = document.getElementById('analytics-content');
        const noData = document.getElementById('no-data-message');
        
        // Show modal and loading state
        modal.style.display = 'block';
        loading.style.display = 'block';
        content.style.display = 'none';
        
        try {
            // Fetch user scores
            console.log('Fetching user scores from /api/user/scores');
            const response = await fetch('/api/user/scores?limit=20');
            const data = await response.json();
            
            console.log('API Response:', data);
            console.log('User Identity:', data.user_identity);
            console.log('Scores Count:', data.scores ? data.scores.length : 0);
            
            if (!data.success || !data.scores || data.scores.length === 0) {
                console.warn('No scores found for user');
                loading.style.display = 'none';
                content.style.display = 'block';
                noData.style.display = 'block';
                return;
            }
            
            const scores = data.scores.reverse(); // Oldest to newest for chart
            
            // Calculate summary stats
            const totalConversations = scores.length;
            const avgScore = (scores.reduce((sum, s) => sum + s.total_score, 0) / totalConversations).toFixed(1);
            const bestScore = Math.max(...scores.map(s => s.total_score));
            
            // Update summary cards
            document.getElementById('total-conversations').textContent = totalConversations;
            document.getElementById('avg-score').textContent = avgScore;
            document.getElementById('best-score').textContent = bestScore;
            
            // Prepare chart data
            const labels = scores.map((s, i) => `Conv ${i + 1}`);
            const datasets = [
                {
                    label: 'Total Score',
                    data: scores.map(s => s.total_score),
                    borderColor: 'rgb(99, 102, 241)',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.3,
                    borderWidth: 3
                },
                {
                    label: 'Professionalism',
                    data: scores.map(s => s.professionalism),
                    borderColor: 'rgb(34, 197, 94)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.3,
                    borderWidth: 2
                },
                {
                    label: 'Communication',
                    data: scores.map(s => s.communication),
                    borderColor: 'rgb(249, 115, 22)',
                    backgroundColor: 'rgba(249, 115, 22, 0.1)',
                    tension: 0.3,
                    borderWidth: 2
                },
                {
                    label: 'Problem Resolution',
                    data: scores.map(s => s.problem_resolution),
                    borderColor: 'rgb(236, 72, 153)',
                    backgroundColor: 'rgba(236, 72, 153, 0.1)',
                    tension: 0.3,
                    borderWidth: 2
                },
                {
                    label: 'Empathy',
                    data: scores.map(s => s.empathy),
                    borderColor: 'rgb(168, 85, 247)',
                    backgroundColor: 'rgba(168, 85, 247, 0.1)',
                    tension: 0.3,
                    borderWidth: 2
                },
                {
                    label: 'Efficiency',
                    data: scores.map(s => s.efficiency),
                    borderColor: 'rgb(14, 165, 233)',
                    backgroundColor: 'rgba(14, 165, 233, 0.1)',
                    tension: 0.3,
                    borderWidth: 2
                }
            ];
            
            // Destroy existing chart if any
            if (this.performanceChart) {
                this.performanceChart.destroy();
            }
            
            // Create new chart
            const ctx = document.getElementById('performance-chart').getContext('2d');
            this.performanceChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Performance Metrics Over Time',
                            font: { size: 16, weight: 'bold' }
                        },
                        legend: {
                            position: 'bottom'
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            title: {
                                display: true,
                                text: 'Score'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Conversations'
                            }
                        }
                    },
                    interaction: {
                        mode: 'nearest',
                        axis: 'x',
                        intersect: false
                    }
                }
            });
            
            // Show content
            loading.style.display = 'none';
            content.style.display = 'block';
            noData.style.display = 'none';
            
        } catch (error) {
            console.error('Failed to load analytics:', error);
            loading.style.display = 'none';
            content.style.display = 'block';
            noData.style.display = 'block';
            document.querySelector('#no-data-message p').textContent = '⚠️ Failed to load analytics data';
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new VoiceAgentSimulator();
});
