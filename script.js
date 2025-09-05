// Initialize EmailJS
(function() {
    emailjs.init("your_public_key_here"); // Replace with your EmailJS public key
})();

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Global audio state
let audioEnabled = false;

// YouTube video IDs for random hero video rotation
const heroVideoIds = [
    'UqYtAWzNm28', // Tracy Sushel - Spending Time With mr Clock
    'EJMGDcLZspw', // Victoria's Story
    'dy48vro3vKY', // Nella's Kindness Kicks
    'PcJIW_QuJ6M', // Angela Rodriguez - On the Highway
    'gcAm0C5Sjpo'  // Tate Bailey - Patchy Lou
];

// Video data for fullscreen modal
const videoData = {
    'UqYtAWzNm28': 'Spending Time With mr Clock by Tracy Sushel',
    'EJMGDcLZspw': 'Victoria\'s Story',
    'dy48vro3vKY': 'Nella\'s Kindness Kicks by NelliROse Farells',
    'PcJIW_QuJ6M': 'On the Highway by Angela Rodriguez',
    'gcAm0C5Sjpo': 'Patchy Lou by Tate Bailey'
};

// YouTube Player API variables
let fullscreenPlayer = null;
let isPlayerReady = false;
let projectPlayers = {}; // Store all project video players

// Function to get random hero video
function getRandomHeroVideo() {
    const randomIndex = Math.floor(Math.random() * heroVideoIds.length);
    const videoId = heroVideoIds[randomIndex];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1`;
}

// Function to initialize random hero video
function initializeRandomHeroVideo() {
    const heroVideoFrame = document.getElementById('heroVideoFrame');
    if (heroVideoFrame) {
        heroVideoFrame.src = getRandomHeroVideo();
        console.log('🎥 Random hero video initialized');
    }
}

// PDF rendering state
const pdfState = {
    tracy: { pdfDoc: null, pageNum: 1, totalPages: 0 },
    victoria: { pdfDoc: null, pageNum: 1, totalPages: 0 },
    nellirose: { pdfDoc: null, pageNum: 1, totalPages: 0 },
    angela: { pdfDoc: null, pageNum: 1, totalPages: 0 },
    tate: { pdfDoc: null, pageNum: 1, totalPages: 0 }
};

// PDF file paths - detect if we're running on HTTP server
const isLocalFile = window.location.protocol === 'file:';
const baseUrl = isLocalFile ? '' : window.location.origin;

console.log('🔍 Debug Info:');
console.log('Protocol:', window.location.protocol);
console.log('Host:', window.location.host);  
console.log('Full URL:', window.location.href);
console.log('Is Local File:', isLocalFile);

// Dynamic PDF folder paths - will auto-detect PDF files
const pdfFolders = {
    tracy: './Assets/Tracy Sushel Animation/',
    victoria: './Assets/Victoria Animation 2/',
    nellirose: './Assets/NailROse Animation/',
    angela: './Assets/Angela Rodriguez - On the Highway/',
    tate: './Assets/Tate Bailey _ Patchy Lou/'
};

let pdfPaths = {}; // Will be populated dynamically

// YouTube Player API ready callback
function onYouTubeIframeAPIReady() {
    console.log('🎥 YouTube Player API ready');
    initializeProjectPlayers();
    initializeVideoClickHandlers();
}

// Dynamically detect PDF files in folders
async function detectPDFFiles() {
    console.log('🔍 Detecting PDF files...');
    console.log('PDF folders to check:', pdfFolders);
    
    // Extended list of possible PDF filenames to try
    const commonPDFNames = [
        'layout.pdf', 'Layout.pdf', 'lyout.pdf', 'Lyout.pdf',
        'book.pdf', 'Book.pdf', 'page.pdf', 'Page.pdf',
        'preview.pdf', 'Preview.pdf', 'sample.pdf', 'Sample.pdf'
    ];
    
    for (const [projectKey, folderPath] of Object.entries(pdfFolders)) {
        try {
            let foundPDF = false;
            
            // Try common PDF names
            for (const fileName of commonPDFNames) {
                const testPath = folderPath + fileName;
                console.log(`🔍 Trying: ${testPath}`);
                try {
                    const response = await fetch(testPath, { method: 'HEAD' });
                    console.log(`Response for ${testPath}:`, response.status, response.ok);
                    if (response.ok) {
                        pdfPaths[projectKey] = testPath;
                        console.log(`📄 Found PDF for ${projectKey}: ${testPath}`);
                        foundPDF = true;
                        break;
                    }
                } catch (e) {
                    console.log(`❌ Error fetching ${testPath}:`, e.message);
                }
            }
            
            // Try project-specific names based on the known files
            if (!foundPDF) {
                const specificNames = {
                    tracy: ['Lyout.pdf'],
                    victoria: ['Layout.pdf'],
                    nellirose: ['Nella\'s Kindness Kicks by NelliROse Farells.pdf'],
                    angela: ['On the Highway - Interior 2.pdf'],
                    tate: ['Layout.pdf']
                };
                
                const projectSpecific = specificNames[projectKey] || [];
                for (const fileName of projectSpecific) {
                    const testPath = folderPath + fileName;
                    try {
                        const response = await fetch(testPath, { method: 'HEAD' });
                        if (response.ok) {
                            pdfPaths[projectKey] = testPath;
                            console.log(`📄 Found specific PDF for ${projectKey}: ${testPath}`);
                            foundPDF = true;
                            break;
                        }
                    } catch (e) {
                        // Continue
                    }
                }
            }
            
            if (!foundPDF) {
                console.log(`❌ No PDF found for ${projectKey} in ${folderPath}`);
            }
            
        } catch (error) {
            console.error(`Error detecting PDF for ${projectKey}:`, error);
        }
    }
    
    console.log('📄 PDF detection complete:', pdfPaths);
}

// Initialize PDF viewers for all projects
async function initializePDFViewers() {
    console.log('🎯 Initializing PDF viewers...');
    console.log('Available PDF paths:', pdfPaths);
    
    // Use the existing loadAllPDFs function
    await loadAllPDFs();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM loaded, initializing...');
    
    // Detect PDF files first
    await detectPDFFiles();
    
    // Initialize random hero video
    initializeRandomHeroVideo();
    
    // Initialize intersection observer for animations
    initializeAnimations();
    
    // Initialize video autoplay on scroll
    initializeVideoAutoplay();
    
    // Add click controls for hero video
    initializeHeroVideoControls();
    
    // Initialize contact form
    initializeContactForm();
    
    // Initialize video modal controls
    initializeVideoModalControls();
    
    // Initialize PDF viewers
    await initializePDFViewers();
    
    // Add smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // PDFs will be loaded after detection in initializePDFViewers()
    
    // Click anywhere to enable audio for all videos (only once)
    let audioEnabled = false;
    document.addEventListener('click', function() {
        if (!audioEnabled) {
            audioEnabled = true;
            console.log('🔊 Enabling audio for all videos');
            document.querySelectorAll('video').forEach(video => {
                video.muted = false;
            });
        }
    });
});

// Animation on scroll
function initializeAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                console.log('Animating element:', entry.target.className);
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    // Observe elements for animation
    document.querySelectorAll('.prop-card, .project-card, .step, .floating-card').forEach((el) => {
        observer.observe(el);
    });
}

// Video Autoplay on Scroll
function initializeVideoAutoplay() {
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const video = entry.target.querySelector('video');
            const iframe = entry.target.querySelector('iframe');
            
            if (video) {
                if (entry.isIntersecting) {
                    // Video is in view, play it (keep current muted state)
                    video.currentTime = 0;
                    video.play();
                } else {
                    // Video is out of view, pause it
                    console.log('Video leaving view, pausing:', video.src);
                    video.pause();
                }
            } else if (iframe && iframe.id !== 'heroVideoFrame') {
                // Handle project YouTube iframes (not hero video)
                if (entry.isIntersecting) {
                    console.log('YouTube video coming into view, reloading to autoplay');
                    // Reload iframe to trigger autoplay when it comes into view
                    const currentSrc = iframe.src;
                    iframe.src = '';
                    setTimeout(() => {
                        iframe.src = currentSrc;
                    }, 100);
                } else {
                    console.log('YouTube video leaving view');
                }
            }
        });
    }, {
        threshold: 0.5, // Video needs to be 50% visible
        rootMargin: '0px 0px -100px 0px' // Start playing a bit before fully visible
    });

    // Observe all project cards and hero video
    document.querySelectorAll('.project-card, .hero-video-preview').forEach((card) => {
        videoObserver.observe(card);
    });
}

// Hero video click controls
function initializeHeroVideoControls() {
    const heroVideo = document.querySelector('.hero-video-preview video');
    if (!heroVideo) return;
    
    heroVideo.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (heroVideo.paused) {
            heroVideo.play();
            console.log('▶ Hero video playing');
        } else {
            heroVideo.pause();
            console.log('⏸ Hero video paused');
        }
    });
    
    // Make it clear it's clickable
    heroVideo.style.cursor = 'pointer';
}

// Show audio enable prompt
function showAudioPrompt(container, video) {
    // Remove any existing prompts
    const existingPrompt = container.querySelector('.audio-prompt');
    if (existingPrompt) return;
    
    // Create audio enable prompt
    const prompt = document.createElement('div');
    prompt.className = 'audio-prompt';
    prompt.innerHTML = `
        <div class="audio-prompt-content">
            <div class="audio-icon">🔊</div>
            <p>Enable Audio</p>
        </div>
    `;
    
    // Add click handler
    prompt.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔊 Audio enable button clicked');
        enableAudio();
    });
    
    // Add to video container
    const videoContainer = container.querySelector('.video-container');
    if (videoContainer) {
        videoContainer.appendChild(prompt);
        console.log('🔊 Audio enable button added to video container');
    } else {
        console.error('❌ Video container not found for audio prompt');
    }
}

// Global audio toggle function
function toggleAllAudio() {
    const allVideos = document.querySelectorAll('video');
    const button = document.getElementById('audioToggleBtn');
    
    console.log(`Found ${allVideos.length} videos to toggle`);
    
    // Check if videos are currently muted
    const isMuted = allVideos[0] ? allVideos[0].muted : true;
    
    allVideos.forEach((video, index) => {
        video.muted = !isMuted;
        console.log(`Video ${index + 1} muted: ${video.muted}`);
    });
    
    // Update button visual state
    const mutedIcon = button.querySelector('.muted');
    const unmutedIcon = button.querySelector('.unmuted');
    
    if (isMuted) {
        // Videos are now unmuted - show unmuted icon
        mutedIcon.style.display = 'none';
        unmutedIcon.style.display = 'block';
        button.classList.add('audio-enabled');
        console.log('🔊 All videos unmuted');
    } else {
        // Videos are now muted - show muted icon
        mutedIcon.style.display = 'block';
        unmutedIcon.style.display = 'none';
        button.classList.remove('audio-enabled');
        console.log('🔇 All videos muted');
    }
}

// PDF Loading Functions - Load sequentially to avoid overwhelming server
async function loadAllPDFs() {
    console.log('loadAllPDFs called, available projects:', Object.keys(pdfPaths));
    
    // Load smaller PDFs first
    const projects = ['nellirose', 'victoria', 'angela', 'tracy', 'tate']; // Reordered by size
    
    for (const projectKey of projects) {
        console.log(`Starting load for ${projectKey}`);
        await loadPDF(projectKey);
        await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between loads
    }
}

async function loadPDF(projectKey) {
    const canvas = document.getElementById(`pdf-canvas-${projectKey}`);
    const container = canvas.parentNode;
    
    if (!canvas) {
        console.error(`Canvas not found for project: ${projectKey}`);
        return;
    }
    
    // Check if already loading or loaded
    if (container.querySelector('.pdf-skeleton') || container.querySelector('.pdf-error') || canvas.classList.contains('loaded')) {
        console.log(`PDF ${projectKey} already loading or loaded, skipping`);
        return;
    }
    
    console.log(`Loading PDF for ${projectKey}...`);
    
    // Create and show skeleton loader with progress indicator
    const skeletonDiv = document.createElement('div');
    skeletonDiv.className = 'pdf-skeleton';
    skeletonDiv.innerHTML = '<div class="loading-text">Loading PDF...</div>';
    container.insertBefore(skeletonDiv, canvas);
    canvas.style.display = 'none';
    
    // Add loading progress for large files
    let progressTimeout;
    const showProgress = () => {
        const progressText = skeletonDiv.querySelector('.loading-text');
        if (progressText) {
            progressText.textContent = 'Loading large PDF... Please wait...';
        }
    };
    progressTimeout = setTimeout(showProgress, 5000);
    
    // Check if running on local file system
    if (isLocalFile) {
        console.log('Running on local file system, showing error');
        setTimeout(() => {
            skeletonDiv.remove();
            const errorDiv = document.createElement('div');
            errorDiv.className = 'pdf-error';
            errorDiv.innerHTML = '<div>📋<br>PDF Preview<br><small>Start local server to view PDFs<br><code>python3 -m http.server 3001</code></small></div>';
            container.insertBefore(errorDiv, canvas);
        }, 1000);
        return;
    }
    
    try {
        console.log(`Fetching PDF: ${pdfPaths[projectKey]}`);
        
        // Add timeout to prevent infinite loading (increased for large PDFs)
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('PDF loading timeout')), 30000);
        });
        
        const loadingTask = pdfjsLib.getDocument(pdfPaths[projectKey]);
        const pdf = await Promise.race([loadingTask.promise, timeoutPromise]);
        
        console.log(`PDF loaded for ${projectKey}, pages: ${pdf.numPages}`);
        
        pdfState[projectKey].pdfDoc = pdf;
        pdfState[projectKey].totalPages = pdf.numPages;
        
        // Render first page
        await renderPage(projectKey, 1);
        
        // Get the actual canvas height and update skeleton
        const canvasHeight = canvas.height;
        if (canvasHeight > 0) {
            skeletonDiv.style.height = canvasHeight + 'px';
        }
        
        // Update page info
        updatePageInfo(projectKey);
        
        console.log(`PDF rendered for ${projectKey}`);
        
        // Clear progress timeout
        clearTimeout(progressTimeout);
        
        // Smooth transition from skeleton to PDF
        setTimeout(() => {
            if (skeletonDiv.parentNode) { // Check if skeleton still exists
                skeletonDiv.style.opacity = '0';
                skeletonDiv.style.transition = 'opacity 0.3s ease';
                
                setTimeout(() => {
                    if (skeletonDiv.parentNode) {
                        skeletonDiv.remove();
                    }
                    canvas.style.display = 'block';
                    canvas.classList.add('loaded');
                    console.log(`PDF transition complete for ${projectKey}`);
                }, 300);
            }
        }, 200);
        
    } catch (error) {
        console.error(`Error loading PDF for ${projectKey}:`, error);
        if (skeletonDiv.parentNode) {
            skeletonDiv.remove();
        }
        const errorDiv = document.createElement('div');
        errorDiv.className = 'pdf-error';
        errorDiv.innerHTML = '<div>❌<br>Error loading PDF<br><small>Refresh page or check server on port 3001</small></div>';
        container.insertBefore(errorDiv, canvas);
    }
}

async function renderPage(projectKey, pageNumber) {
    const state = pdfState[projectKey];
    const canvas = document.getElementById(`pdf-canvas-${projectKey}`);
    
    if (!state.pdfDoc || !canvas) return;
    
    try {
        const page = await state.pdfDoc.getPage(pageNumber);
        const context = canvas.getContext('2d');
        
        // Calculate scale to fit container
        const containerWidth = canvas.parentNode.clientWidth - 40; // Account for padding
        const viewport = page.getViewport({ scale: 1.0 });
        const scale = Math.min(containerWidth / viewport.width, 1.5);
        const scaledViewport = page.getViewport({ scale: scale });
        
        // Set canvas dimensions
        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;
        
        // Render PDF page into canvas context
        const renderContext = {
            canvasContext: context,
            viewport: scaledViewport
        };
        
        await page.render(renderContext).promise;
        
        state.pageNum = pageNumber;
        updatePageInfo(projectKey);
        
    } catch (error) {
        console.error('Error rendering page:', error);
    }
}

function updatePageInfo(projectKey) {
    const state = pdfState[projectKey];
    const infoElement = document.getElementById(`pdf-info-${projectKey}`);
    
    if (infoElement) {
        infoElement.textContent = `Page ${state.pageNum} of ${state.totalPages}`;
    }
    
    // Update button states
    const prevButton = document.querySelector(`button[onclick="previousPage('${projectKey}')"]`);
    const nextButton = document.querySelector(`button[onclick="nextPage('${projectKey}')"]`);
    
    if (prevButton) {
        prevButton.disabled = state.pageNum <= 1;
    }
    
    if (nextButton) {
        nextButton.disabled = state.pageNum >= state.totalPages;
    }
}

// PDF Navigation Functions
function previousPage(projectKey) {
    const state = pdfState[projectKey];
    if (state.pageNum <= 1) return;
    
    renderPage(projectKey, state.pageNum - 1);
}

function nextPage(projectKey) {
    const state = pdfState[projectKey];
    if (state.pageNum >= state.totalPages) return;
    
    renderPage(projectKey, state.pageNum + 1);
}

// Smooth scroll to projects section
function scrollToProjects() {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
        projectsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Contact Form Functions
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', handleFormSubmit);
    
    // Close modal when clicking outside
    const contactModal = document.getElementById('contactModal');
    
    contactModal.addEventListener('click', function(e) {
        if (e.target === contactModal) {
            closeContactForm();
        }
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (contactModal.classList.contains('show')) {
                closeContactForm();
            }
        }
    });
}

function openContactForm() {
    const modal = document.getElementById('contactModal');
    modal.classList.add('show');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Focus on first input
    setTimeout(() => {
        const firstInput = modal.querySelector('input');
        if (firstInput) firstInput.focus();
    }, 300);
}

function closeContactForm() {
    const modal = document.getElementById('contactModal');
    modal.classList.remove('show');
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        
        // Reset form if submission was successful
        const form = document.getElementById('contactForm');
        const successMessage = document.getElementById('successMessage');
        
        if (successMessage.style.display !== 'none') {
            form.reset();
            form.style.display = 'block';
            successMessage.style.display = 'none';
        }
    }, 300);
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const submitSpinner = document.getElementById('submitSpinner');
    const successMessage = document.getElementById('successMessage');
    
    // Show loading state
    submitBtn.disabled = true;
    submitText.style.display = 'none';
    submitSpinner.style.display = 'inline-block';
    
    // Collect form data
    const formData = new FormData(form);
    const templateParams = {
        to_email: 'info@usillustration.com',
        from_name: formData.get('name'),
        from_email: formData.get('email'),
        phone: formData.get('phone') || 'Not provided',
        book_title: formData.get('book_title'),
        page_count: formData.get('page_count') || 'Not specified',
        timeline: formData.get('timeline') || 'Not specified',
        message: formData.get('message') || 'No additional details provided',
        subject: `New Animation Service Inquiry from ${formData.get('name')}`,
        service_type: 'Children\'s Book Animation Service'
    };
    
    try {
        // For demo purposes, we'll simulate sending
        // Replace this with actual EmailJS implementation
        await simulateEmailSend(templateParams);
        
        // Show success message
        form.style.display = 'none';
        successMessage.style.display = 'block';
        
        // Close modal after delay
        setTimeout(() => {
            closeContactForm();
        }, 5000);
        
    } catch (error) {
        console.error('Error sending email:', error);
        
        // Show error message
        alert('Sorry, there was an error sending your message. Please try again or contact us directly at info@usillustration.com');
        
        // Reset button state
        submitBtn.disabled = false;
        submitText.style.display = 'inline-block';
        submitSpinner.style.display = 'none';
    }
}

// Simulate email sending (replace with actual EmailJS)
async function simulateEmailSend(params) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For demo - log the form data
    console.log('Form submission:', params);
    
    // In production, replace this with:
    /*
    return emailjs.send(
        'your_service_id',    // Replace with your EmailJS service ID
        'your_template_id',   // Replace with your EmailJS template ID
        params,
        'your_public_key'     // Replace with your EmailJS public key
    );
    */
    
    // For demo, randomly succeed/fail (90% success rate)
    if (Math.random() > 0.1) {
        return Promise.resolve();
    } else {
        return Promise.reject(new Error('Simulated error'));
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize for PDF rendering
window.addEventListener('resize', debounce(() => {
    Object.keys(pdfState).forEach(projectKey => {
        if (pdfState[projectKey].pdfDoc) {
            renderPage(projectKey, pdfState[projectKey].pageNum);
        }
    });
}, 300));

// Lazy loading for videos
function initializeLazyLoading() {
    const videos = document.querySelectorAll('video[data-src]');
    
    if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    video.src = video.dataset.src;
                    video.load();
                    videoObserver.unobserve(video);
                }
            });
        });
        
        videos.forEach(video => {
            videoObserver.observe(video);
        });
    } else {
        // Fallback for older browsers
        videos.forEach(video => {
            video.src = video.dataset.src;
            video.load();
        });
    }
}

// Performance monitoring
function trackPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
        });
    }
}

// Initialize performance tracking
trackPerformance();

// Video Modal Functions
function initializeVideoClickHandlers() {
    // Add click handlers to all project videos
    document.querySelectorAll('.video-container iframe').forEach(iframe => {
        // Create a transparent overlay for click detection
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: transparent;
            cursor: pointer;
            z-index: 10;
        `;
        
        // Extract video ID from iframe src
        const src = iframe.src;
        const videoId = extractVideoId(src);
        
        overlay.addEventListener('click', () => {
            if (videoId) {
                openVideoModal(videoId);
            }
        });
        
        // Add overlay to video container
        const container = iframe.closest('.video-container');
        if (container) {
            container.style.position = 'relative';
            container.appendChild(overlay);
        }
    });
    
    console.log('🎥 Video click handlers initialized');
}

function extractVideoId(url) {
    const match = url.match(/embed\/([^?]+)/);
    return match ? match[1] : null;
}

function openVideoModal(videoId) {
    const modal = document.getElementById('videoModal');
    const title = document.getElementById('videoModalTitle');
    
    // Set video title
    title.textContent = videoData[videoId] || 'Video Preview';
    
    // Create YouTube player
    fullscreenPlayer = new YT.Player('fullscreenPlayer', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
            autoplay: 1,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            fs: 1,
            iv_load_policy: 3,
            disablekb: 1
        },
        events: {
            onReady: (event) => {
                isPlayerReady = true;
                event.target.unMute();
                console.log('🎥 Fullscreen player ready with sound');
            },
            onStateChange: updateControlButtons
        }
    });
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    
    // Destroy player
    if (fullscreenPlayer) {
        fullscreenPlayer.destroy();
        fullscreenPlayer = null;
        isPlayerReady = false;
    }
    
    // Hide modal
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    console.log('🎥 Video modal closed');
}

function initializeVideoModalControls() {
    // Close button
    document.getElementById('closeVideoModal').addEventListener('click', closeVideoModal);
    
    // Mute/Unmute button
    document.getElementById('muteToggle').addEventListener('click', () => {
        if (fullscreenPlayer && isPlayerReady) {
            if (fullscreenPlayer.isMuted()) {
                fullscreenPlayer.unMute();
                document.getElementById('muteToggle').textContent = '🔊';
            } else {
                fullscreenPlayer.mute();
                document.getElementById('muteToggle').textContent = '🔇';
            }
        }
    });
    
    // Play/Pause button
    document.getElementById('playPauseToggle').addEventListener('click', () => {
        if (fullscreenPlayer && isPlayerReady) {
            const state = fullscreenPlayer.getPlayerState();
            if (state === YT.PlayerState.PLAYING) {
                fullscreenPlayer.pauseVideo();
                document.getElementById('playPauseToggle').textContent = '▶️';
            } else {
                fullscreenPlayer.playVideo();
                document.getElementById('playPauseToggle').textContent = '⏸️';
            }
        }
    });
    
    // Close on background click
    document.getElementById('videoModal').addEventListener('click', (e) => {
        if (e.target.id === 'videoModal') {
            closeVideoModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('videoModal').style.display === 'block') {
            closeVideoModal();
        }
    });
}

function updateControlButtons(event) {
    const state = event.data;
    const playPauseBtn = document.getElementById('playPauseToggle');
    
    if (state === YT.PlayerState.PLAYING) {
        playPauseBtn.textContent = '⏸️';
    } else if (state === YT.PlayerState.PAUSED) {
        playPauseBtn.textContent = '▶️';
    }
}

// Initialize project video players
function initializeProjectPlayers() {
    const playerElements = document.querySelectorAll('.youtube-player');
    
    playerElements.forEach(element => {
        const playerId = element.id;
        const videoId = element.getAttribute('data-video-id');
        const playerKey = playerId.replace('player-', '');
        
        console.log(`🎥 Initializing player: ${playerId} with video: ${videoId}`);
        
        projectPlayers[playerKey] = new YT.Player(playerId, {
            height: '400',
            width: '100%',
            videoId: videoId,
            playerVars: {
                autoplay: 1,
                mute: 1,
                controls: 1,
                modestbranding: 1,
                rel: 0,
                loop: 1,
                playlist: videoId,
                iv_load_policy: 3,
                disablekb: 1,
                fs: 0
            },
            events: {
                onReady: (event) => {
                    console.log(`🎥 Project player ${playerKey} ready`);
                    initializeMuteToggle(playerKey);
                },
                onStateChange: (event) => {
                    updateProjectPlayerState(playerKey, event);
                }
            }
        });
    });
}

// Initialize mute toggle for a specific player
function initializeMuteToggle(playerKey) {
    const toggleBtn = document.querySelector(`[data-player="${playerKey}"]`);
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            togglePlayerMute(playerKey);
        });
        
        // Update initial button state
        updateMuteButtonState(playerKey, true); // Start muted
    }
}

// Toggle mute/unmute for a specific player
function togglePlayerMute(playerKey) {
    const player = projectPlayers[playerKey];
    if (player && player.isMuted !== undefined) {
        if (player.isMuted()) {
            player.unMute();
            updateMuteButtonState(playerKey, false);
            console.log(`🔊 Unmuted ${playerKey}`);
        } else {
            player.mute();
            updateMuteButtonState(playerKey, true);
            console.log(`🔇 Muted ${playerKey}`);
        }
    }
}

// Update mute button visual state
function updateMuteButtonState(playerKey, isMuted) {
    const toggleBtn = document.querySelector(`[data-player="${playerKey}"]`);
    if (toggleBtn) {
        const mutedIcon = toggleBtn.querySelector('.audio-icon.muted');
        const unmutedIcon = toggleBtn.querySelector('.audio-icon.unmuted');
        
        if (isMuted) {
            mutedIcon.style.display = 'block';
            unmutedIcon.style.display = 'none';
        } else {
            mutedIcon.style.display = 'none';
            unmutedIcon.style.display = 'block';
        }
    }
}

// Update project player state (removed playing labels)
function updateProjectPlayerState(playerKey, event) {
    // Playing state tracking removed - no more visual labels
}