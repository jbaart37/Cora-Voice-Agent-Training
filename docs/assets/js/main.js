/**
 * Main JavaScript for Cora Voice Agent Workshop
 * Additional interactivity and utilities
 */

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Copy code button for code blocks
document.addEventListener('DOMContentLoaded', function() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(block => {
        const pre = block.parentElement;
        const button = document.createElement('button');
        button.className = 'copy-code-btn';
        button.innerHTML = '<i class="fas fa-copy"></i> Copy';
        button.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(255,255,255,0.1);
            color: white;
            border: 1px solid rgba(255,255,255,0.2);
            padding: 0.5rem 1rem;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.875rem;
            transition: all 0.3s ease;
        `;
        
        button.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255,255,255,0.2)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(255,255,255,0.1)';
        });
        
        button.addEventListener('click', async function() {
            const code = block.textContent;
            
            try {
                await navigator.clipboard.writeText(code);
                this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                this.style.background = 'rgba(16, 124, 16, 0.8)';
                
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-copy"></i> Copy';
                    this.style.background = 'rgba(255,255,255,0.1)';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
                this.innerHTML = '<i class="fas fa-times"></i> Failed';
            }
        });
        
        pre.style.position = 'relative';
        pre.appendChild(button);
    });
});

// Expand/collapse for long content sections
function addCollapsibleSections() {
    const longLists = document.querySelectorAll('.module-content ul');
    
    longLists.forEach(list => {
        const items = list.querySelectorAll('li');
        if (items.length > 10) {
            // Hide items after 10
            items.forEach((item, index) => {
                if (index >= 10) {
                    item.style.display = 'none';
                }
            });
            
            // Add "Show More" button
            const button = document.createElement('button');
            button.className = 'show-more-btn';
            button.textContent = `Show ${items.length - 10} more items`;
            button.style.cssText = `
                margin-top: 1rem;
                background: none;
                border: 2px solid #0078d4;
                color: #0078d4;
                padding: 0.5rem 1rem;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.3s ease;
            `;
            
            button.addEventListener('click', function() {
                const isExpanded = this.classList.contains('expanded');
                
                items.forEach((item, index) => {
                    if (index >= 10) {
                        item.style.display = isExpanded ? 'none' : 'list-item';
                    }
                });
                
                if (isExpanded) {
                    this.textContent = `Show ${items.length - 10} more items`;
                    this.classList.remove('expanded');
                } else {
                    this.textContent = 'Show less';
                    this.classList.add('expanded');
                }
            });
            
            list.after(button);
        }
    });
}

// Add warning/info/tip boxes styling
document.addEventListener('DOMContentLoaded', function() {
    const blockquotes = document.querySelectorAll('blockquote');
    
    blockquotes.forEach(quote => {
        const text = quote.textContent.trim();
        
        if (text.startsWith('⚠') || text.startsWith('WARNING')) {
            quote.classList.add('warning-box');
            quote.style.cssText = `
                border-left: 4px solid #ffaa44;
                background: #fff8e1;
                padding: 1rem;
                border-radius: 4px;
                margin: 1.5rem 0;
            `;
        } else if (text.startsWith('ℹ') || text.startsWith('INFO')) {
            quote.classList.add('info-box');
            quote.style.cssText = `
                border-left: 4px solid #0078d4;
                background: #e7f3ff;
                padding: 1rem;
                border-radius: 4px;
                margin: 1.5rem 0;
            `;
        } else if (text.startsWith('💡') || text.startsWith('TIP')) {
            quote.classList.add('tip-box');
            quote.style.cssText = `
                border-left: 4px solid #107c10;
                background: #e7f5e7;
                padding: 1rem;
                border-radius: 4px;
                margin: 1.5rem 0;
            `;
        }
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Alt + P: Toggle progress panel
    if (e.altKey && e.key === 'p') {
        e.preventDefault();
        toggleProgressPanel();
    }
    
    // Alt + N: Next module (if exists)
    if (e.altKey && e.key === 'n') {
        const nextButton = document.querySelector('.nav-btn.next, .footer-nav-btn.next');
        if (nextButton) {
            nextButton.click();
        }
    }
    
    // Alt + B: Previous module (if exists)
    if (e.altKey && e.key === 'b') {
        const prevButton = document.querySelector('.nav-btn.prev, .footer-nav-btn:not(.next)');
        if (prevButton) {
            prevButton.click();
        }
    }
});

// Add keyboard shortcuts hint
document.addEventListener('DOMContentLoaded', function() {
    const hint = document.createElement('div');
    hint.className = 'keyboard-hint';
    hint.innerHTML = `
        <i class="fas fa-keyboard"></i> 
        Shortcuts: Alt+P (Progress), Alt+N (Next), Alt+B (Back)
    `;
    hint.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        font-size: 0.85rem;
        z-index: 50;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
    `;
    
    document.body.appendChild(hint);
    
    // Show hint on Alt key press
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Alt') {
            hint.style.opacity = '1';
        }
    });
    
    document.addEventListener('keyup', function(e) {
        if (e.key === 'Alt') {
            hint.style.opacity = '0';
        }
    });
});

// Print progress summary
function printProgressSummary() {
    const progress = getProgress();
    console.log('=== Workshop Progress Summary ===');
    console.log(`Overall Progress: ${progress.overall}%`);
    console.log(`Last Updated: ${new Date(progress.lastUpdated).toLocaleString()}`);
    console.log('\nModule Breakdown:');
    
    MODULES.forEach((moduleId, index) => {
        const module = progress.modules[moduleId];
        console.log(`  Module ${index + 1}: ${module.percentage}% ${module.completed ? '✓' : ''}`);
    });
}

// Make print function available globally
window.printProgressSummary = printProgressSummary;

// Welcome message in console
console.log('%c🎓 Welcome to Cora Voice Agent Workshop!', 'font-size: 20px; font-weight: bold; color: #0078d4;');
console.log('%cYour progress is automatically saved in your browser.', 'font-size: 14px; color: #107c10;');
console.log('%cType printProgressSummary() to see your progress.', 'font-size: 12px; color: #605e5c;');

// Theme Toggle Functionality
function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.toggle('dark-theme');
    
    // Save preference
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    console.log(`Theme switched to: ${isDark ? 'dark' : 'light'}`);
}

// Load saved theme preference
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
});

// Make toggleTheme available globally
window.toggleTheme = toggleTheme;

// Image Modal / Lightbox Functionality
function openImageModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    
    modal.classList.add('active');
    modalImg.src = imageSrc;
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('active');
    
    // Re-enable body scroll
    document.body.style.overflow = 'auto';
}

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeImageModal();
    }
});

// Make functions available globally
window.openImageModal = openImageModal;
window.closeImageModal = closeImageModal;

