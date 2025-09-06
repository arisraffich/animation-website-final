// DEAD SIMPLE IMAGE SLIDER - NO BULLSHIT

const images = {
    tracy: [
        './Assets/Tracy Sushel Animation/Lyout_Page_01.jpg',
        './Assets/Tracy Sushel Animation/Lyout_Page_03.jpg',
        './Assets/Tracy Sushel Animation/Lyout_Page_05.jpg'
    ],
    angela: [
        './Assets/Angela Rodriguez - On the Highway/On the Highway - Interior 2_Page_01.jpg',
        './Assets/Angela Rodriguez - On the Highway/On the Highway - Interior 2_Page_03.jpg',
        './Assets/Angela Rodriguez - On the Highway/On the Highway - Interior 2_Page_05.jpg'
    ]
};

let currentIndex = {
    tracy: 0,
    angela: 0
};

function previousImage(project) {
    console.log('Previous clicked:', project);
    if (!images[project]) return;
    
    currentIndex[project]--;
    if (currentIndex[project] < 0) {
        currentIndex[project] = images[project].length - 1;
    }
    
    updateSlide(project);
}

function nextImage(project) {
    console.log('Next clicked:', project);
    if (!images[project]) return;
    
    currentIndex[project]++;
    if (currentIndex[project] >= images[project].length) {
        currentIndex[project] = 0;
    }
    
    updateSlide(project);
}

function updateSlide(project) {
    const img = document.getElementById('slideshow-image-' + project);
    const info = document.getElementById('slideshow-info-' + project);
    
    if (img && images[project]) {
        img.src = images[project][currentIndex[project]];
        console.log('Updated image to:', img.src);
    }
    
    if (info && images[project]) {
        info.textContent = 'Page ' + (currentIndex[project] + 1) + ' of ' + images[project].length;
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading simple slider...');
    
    // Set first images
    Object.keys(images).forEach(project => {
        updateSlide(project);
    });
    
    console.log('Simple slider loaded!');
});