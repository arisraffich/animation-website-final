// CLEAN SIMPLE IMAGE SLIDER

// Current page for each project
let currentPage = { tracy: 1, victoria: 1, nellirose: 1, angela: 1, tate: 1 };

function previousImage(project) {
    if (currentPage[project] > 1) {
        currentPage[project]--;
    }
    showImage(project);
}

function nextImage(project) {
    currentPage[project]++;
    showImage(project);
}

function showImage(project) {
    // Universal pattern: 1.jpg, 2.jpg, 3.jpg...
    const folders = {
        tracy: './Assets/Tracy Sushel Animation/',
        victoria: './Assets/Victoria Animation 2/',
        nellirose: './Assets/NailROse Animation/',
        angela: './Assets/Angela Rodriguez - On the Highway/',
        tate: './Assets/Tate Bailey _ Patchy Lou/'
    };
    
    const imagePath = folders[project] + currentPage[project] + '.jpg';
    
    const img = document.getElementById(`slideshow-image-${project}`);
    const info = document.getElementById(`slideshow-info-${project}`);
    
    if (img && imagePath) {
        img.src = imagePath;
        
        // Update page info when image loads successfully
        img.onload = function() {
            if (info) info.textContent = `Page ${currentPage[project]}`;
        };
        
        // If image fails to load, go back one page
        img.onerror = function() {
            if (currentPage[project] > 1) {
                currentPage[project]--;
                if (info) info.textContent = `Page ${currentPage[project]}`;
            }
        };
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing simple sliders...');
    
    // Show first image for each project
    ['tracy', 'victoria', 'nellirose', 'angela', 'tate'].forEach(project => {
        showImage(project);
    });
});