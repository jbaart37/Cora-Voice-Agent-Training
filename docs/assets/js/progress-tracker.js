/**
 * Progress Tracker - Local Storage Based Progress Management
 * No authentication required - uses browser localStorage
 */

const STORAGE_KEY = 'cora-workshop-progress';
const MODULES = ['module1', 'module2', 'module3', 'module4', 'module5', 'module6'];

// Initialize progress data structure
function initializeProgress() {
    let progress = localStorage.getItem(STORAGE_KEY);
    
    if (!progress) {
        const initialProgress = {
            overall: 0,
            modules: {
                module1: { completed: false, sections: {}, percentage: 0 },
                module2: { completed: false, sections: {}, percentage: 0 },
                module3: { completed: false, sections: {}, percentage: 0 },
                module4: { completed: false, sections: {}, percentage: 0 },
                module5: { completed: false, sections: {}, percentage: 0 },
                module6: { completed: false, sections: {}, percentage: 0 }
            },
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProgress));
        return initialProgress;
    }
    
    return JSON.parse(progress);
}

// Get current progress
function getProgress() {
    return initializeProgress();
}

// Save progress
function saveProgress(progress) {
    progress.lastUpdated = new Date().toISOString();
    console.log('[Progress Tracker] Saving progress:', progress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    // Force update all displays with fresh data from storage
    setTimeout(() => {
        console.log('[Progress Tracker] Updating all displays');
        updateAllProgressDisplays();
    }, 0);
}

// Mark section as complete
function markSectionComplete(moduleId, sectionId, completed = true) {
    const progress = getProgress();
    
    if (!progress.modules[moduleId]) {
        progress.modules[moduleId] = { completed: false, sections: {}, percentage: 0 };
    }
    
    progress.modules[moduleId].sections[sectionId] = completed;
    
    // Calculate module percentage
    const sections = progress.modules[moduleId].sections;
    const totalSections = Object.keys(sections).length;
    const completedSections = Object.values(sections).filter(v => v === true).length;
    progress.modules[moduleId].percentage = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;
    
    // Calculate overall progress
    calculateOverallProgress(progress);
    
    saveProgress(progress);
    
    // Show celebration if module complete
    if (progress.modules[moduleId].percentage === 100 && !progress.modules[moduleId].completed) {
        showModuleCompleteNotification(moduleId);
    }
}

// Mark entire module as complete
function markModuleComplete(moduleId) {
    const progress = getProgress();
    
    if (!progress.modules[moduleId]) {
        progress.modules[moduleId] = { completed: false, sections: {}, percentage: 0 };
    }
    
    progress.modules[moduleId].completed = true;
    progress.modules[moduleId].percentage = 100;
    
    // Mark all sections complete
    const sections = progress.modules[moduleId].sections;
    Object.keys(sections).forEach(key => {
        sections[key] = true;
    });
    
    calculateOverallProgress(progress);
    saveProgress(progress);
    
    showModuleCompleteNotification(moduleId);
}

// Calculate overall progress
function calculateOverallProgress(progress) {
    let totalPercentage = 0;
    MODULES.forEach(module => {
        if (progress.modules[module]) {
            totalPercentage += progress.modules[module].percentage;
        }
    });
    progress.overall = Math.round(totalPercentage / MODULES.length);
}

// Reset all progress
function resetProgress() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
        localStorage.removeItem(STORAGE_KEY);
        initializeProgress();
        updateAllProgressDisplays();
        location.reload();
    }
}

// Update progress panel display
function updateProgressPanel(progress) {
    console.log('[Progress Tracker] updateProgressPanel called with:', progress);
    
    // Update circular progress indicator
    const progressText = document.getElementById('progress-text');
    if (progressText) {
        progressText.textContent = `${progress.overall}%`;
        console.log('[Progress Tracker] Updated progress text to:', progress.overall + '%');
    } else {
        console.warn('[Progress Tracker] Progress text element not found');
    }
    
    // Update progress circle fill
    const progressCircleFill = document.getElementById('progress-circle-fill');
    if (progressCircleFill) {
        const circumference = 2 * Math.PI * 54; // radius = 54
        const offset = circumference - (progress.overall / 100) * circumference;
        progressCircleFill.style.strokeDasharray = circumference;
        progressCircleFill.style.strokeDashoffset = offset;
        console.log('[Progress Tracker] Updated progress circle, offset:', offset);
    } else {
        console.warn('[Progress Tracker] Progress circle element not found');
    }
    
    // Update module progress list
    MODULES.forEach((moduleId, index) => {
        const moduleItem = document.querySelector(`.module-item[data-module="${moduleId}"]`);
        if (moduleItem && progress.modules[moduleId]) {
            const percentage = progress.modules[moduleId].percentage;
            const completed = progress.modules[moduleId].completed;
            
            const percentSpan = moduleItem.querySelector('.module-percent');
            if (percentSpan) {
                percentSpan.textContent = `${percentage}%`;
                console.log(`[Progress Tracker] Updated ${moduleId} to ${percentage}%`);
            } else {
                console.warn(`[Progress Tracker] Percent span not found for ${moduleId}`);
            }
            
            // Update completed status
            if (completed || percentage === 100) {
                moduleItem.classList.add('completed');
            } else {
                moduleItem.classList.remove('completed');
            }
        } else {
            if (!moduleItem) {
                console.warn(`[Progress Tracker] Module item not found for ${moduleId}`);
            }
        }
    });
}

// Update all progress displays on page
function updateAllProgressDisplays() {
    // Always get fresh progress data from storage
    const progress = getProgress();
    console.log('[Progress Tracker] Updating displays with progress:', progress);
    
    // Update header badge
    const headerBadge = document.getElementById('overall-progress');
    if (headerBadge) {
        headerBadge.textContent = `${progress.overall}%`;
        console.log('[Progress Tracker] Updated header badge to:', progress.overall + '%');
    } else {
        console.warn('[Progress Tracker] Header badge element not found');
    }
    
    // Update progress panel with fresh data
    updateProgressPanel(progress);
    
    // Update module progress bar if on module page
    const moduleProgressBar = document.getElementById('module-progress-bar');
    if (moduleProgressBar) {
        const moduleId = moduleProgressBar.dataset.module;
        if (progress.modules[moduleId]) {
            const percentage = progress.modules[moduleId].percentage;
            moduleProgressBar.style.width = `${percentage}%`;
            const percentText = moduleProgressBar.querySelector('.progress-percentage');
            if (percentText) {
                percentText.textContent = `${percentage}%`;
            }
        }
    }

    // Update module status badges on homepage
    updateModuleStatusBadges(progress);

    // Update Continue Learning button
    updateContinueLearningButton(progress);
}

// Toggle progress panel
function toggleProgressPanel() {
    const panel = document.getElementById('progress-panel');
    if (panel) {
        panel.classList.toggle('active');
    }
}

// Initialize module-specific progress
function initializeModuleProgress(moduleId) {
    const progress = getProgress();
    
    // Find all h2 and h3 headers to create section checkpoints
    const content = document.getElementById('module-content');
    if (!content) return;
    
    const headers = content.querySelectorAll('h2, h3');
    headers.forEach((header, index) => {
        const sectionId = `section-${index}`;
        
        // Initialize section if not exists
        if (progress.modules[moduleId] && progress.modules[moduleId].sections[sectionId] === undefined) {
            progress.modules[moduleId].sections[sectionId] = false;
        }
    });
    
    saveProgress(progress);
}

// Inject section checkboxes after headers
function injectSectionCheckboxes() {
    const content = document.getElementById('module-content');
    if (!content) return;
    
    const moduleProgressBar = document.getElementById('module-progress-bar');
    if (!moduleProgressBar) return;
    
    const moduleId = moduleProgressBar.dataset.module;
    const progress = getProgress();
    
    const headers = content.querySelectorAll('h2');
    headers.forEach((header, index) => {
        const sectionId = `section-${index}`;
        const isCompleted = progress.modules[moduleId]?.sections[sectionId] || false;
        
        // Create checkpoint
        const checkpoint = document.createElement('div');
        checkpoint.className = 'section-checkpoint';
        checkpoint.innerHTML = `
            <div class="checkpoint-item ${isCompleted ? 'completed' : ''}">
                <input 
                    type="checkbox" 
                    class="checkpoint-checkbox" 
                    id="${sectionId}" 
                    ${isCompleted ? 'checked' : ''}
                    onchange="handleCheckpointChange('${moduleId}', '${sectionId}', this.checked)"
                >
                <label for="${sectionId}" class="checkpoint-label">
                    <i class="fas fa-check-circle"></i> Mark "${header.textContent}" complete
                </label>
            </div>
        `;
        
        // Insert after the next paragraph or list
        let nextElement = header.nextElementSibling;
        let insertAfter = header;
        
        // Find a good place to insert (after first paragraph or list)
        while (nextElement && (nextElement.tagName === 'P' || nextElement.tagName === 'UL' || nextElement.tagName === 'OL')) {
            insertAfter = nextElement;
            nextElement = nextElement.nextElementSibling;
            if (insertAfter.tagName !== 'H2' && insertAfter.tagName !== 'H3') {
                break;
            }
        }
        
        insertAfter.after(checkpoint);
    });
}

// Handle checkpoint change
function handleCheckpointChange(moduleId, sectionId, checked) {
    markSectionComplete(moduleId, sectionId, checked);
    
    // Update UI
    const checkpointItem = document.querySelector(`#${sectionId}`).closest('.checkpoint-item');
    if (checked) {
        checkpointItem.classList.add('completed');
    } else {
        checkpointItem.classList.remove('completed');
    }
}

// Update module progress bar
function updateModuleProgressBar(moduleId) {
    const progress = getProgress();
    const moduleProgressBar = document.getElementById('module-progress-bar');
    
    if (moduleProgressBar && progress.modules[moduleId]) {
        const percentage = progress.modules[moduleId].percentage;
        moduleProgressBar.style.width = `${percentage}%`;
        const percentText = moduleProgressBar.querySelector('.progress-percentage');
        if (percentText) {
            percentText.textContent = `${percentage}%`;
        }
    }
}

// Show module complete notification
function showModuleCompleteNotification(moduleId) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #107c10, #0f7c0f);
        color: white;
        padding: 1.5rem 2rem;
        border-radius: 12px;
        box-shadow: 0 8px 16px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    const moduleNumber = moduleId.replace('module', '');
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px;">
            <i class="fas fa-trophy" style="font-size: 2rem;"></i>
            <div>
                <div style="font-weight: 700; font-size: 1.1rem; margin-bottom: 0.25rem;">
                    🎉 Module ${moduleNumber} Complete!
                </div>
                <div style="font-size: 0.9rem; opacity: 0.9;">
                    Great job! Keep learning!
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeProgress();
    updateAllProgressDisplays();
});

// Update module status badges on homepage
function updateModuleStatusBadges(progress) {
    MODULES.forEach(moduleId => {
        const moduleCard = document.querySelector(`.module-card[data-module="${moduleId}"]`);
        if (moduleCard) {
            const statusBadge = moduleCard.querySelector('.module-status-badge');
            if (statusBadge && progress.modules[moduleId]) {
                const percentage = progress.modules[moduleId].percentage;
                const completed = progress.modules[moduleId].completed;

                let status = 'not-started';
                let statusText = 'Not Started';

                if (completed || percentage === 100) {
                    status = 'complete';
                    statusText = '✓ Complete';
                } else if (percentage > 0) {
                    status = 'in-progress';
                    statusText = `${percentage}% In Progress`;
                }

                statusBadge.setAttribute('data-status', status);
                statusBadge.textContent = statusText;
            }
        }
    });
}

// Update Continue Learning button visibility and link
function updateContinueLearningButton(progress) {
    const continueBtn = document.getElementById('continue-btn');
    if (!continueBtn) return;

    // Find the last module with progress
    let lastModuleWithProgress = null;
    let lastModuleIndex = -1;

    MODULES.forEach((moduleId, index) => {
        if (progress.modules[moduleId] && progress.modules[moduleId].percentage > 0) {
            lastModuleIndex = index;
            lastModuleWithProgress = moduleId;
        }
    });

    // Show button if there's any progress
    if (lastModuleWithProgress) {
        continueBtn.style.display = 'flex';

        // Store the module to continue to
        continueBtn.dataset.continueModule = lastModuleWithProgress;
        continueBtn.dataset.continueIndex = lastModuleIndex;
    } else {
        continueBtn.style.display = 'none';
    }
}

// Continue to last section function
function continueToLastSection() {
    const continueBtn = document.getElementById('continue-btn');
    if (!continueBtn) return;

    const moduleId = continueBtn.dataset.continueModule;
    const moduleIndex = parseInt(continueBtn.dataset.continueIndex);

    if (!moduleId) {
        // No progress yet, go to module 1
        window.location.href = getModuleUrl('module1');
        return;
    }

    const progress = getProgress();
    const moduleProgress = progress.modules[moduleId];

    // If module is complete, go to next module
    if (moduleProgress.completed || moduleProgress.percentage === 100) {
        const nextModuleIndex = moduleIndex + 1;
        if (nextModuleIndex < MODULES.length) {
            const nextModule = MODULES[nextModuleIndex];
            window.location.href = getModuleUrl(nextModule);
        } else {
            // All modules complete, go to first module
            window.location.href = getModuleUrl('module1');
        }
    } else {
        // Module in progress, go to that module
        window.location.href = getModuleUrl(moduleId);
    }
}

// Get module URL helper
function getModuleUrl(moduleId) {
    const moduleNumber = moduleId.replace('module', '');
    const moduleFiles = {
        'module1': 'module1-overview.html',
        'module2': 'module2-infrastructure.html',
        'module3': 'module3-deployment.html',
        'module4': 'module4-ai-foundry.html',
        'module5': 'module5-analytics.html',
        'module6': 'module6-advanced.html'
    };

    const baseUrl = window.location.origin + window.location.pathname.split('/').slice(0, -1).join('/');
    return `${baseUrl}/modules/${moduleFiles[moduleId]}`;
}

// Export functions for inline use
window.toggleProgressPanel = toggleProgressPanel;
window.resetProgress = resetProgress;
window.markModuleComplete = markModuleComplete;
window.handleCheckpointChange = handleCheckpointChange;
window.initializeModuleProgress = initializeModuleProgress;
window.injectSectionCheckboxes = injectSectionCheckboxes;
window.updateModuleProgressBar = updateModuleProgressBar;
window.continueToLastSection = continueToLastSection;
