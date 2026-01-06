// Sample content data - this will eventually come from your backend/CMS
const contentData = [
    {
        id: 1,
        type: 'image',
        src: 'assets/images/future_is_yours.jpg',
        alt: 'Future is Yours'
    },
    {
        id: 2,
        type: 'video',
        src: 'assets/images/100.mov',
        alt: '100'
    },
    {
        id: 3,
        type: 'image',
        src: 'assets/images/itll_work.jpg',
        alt: 'It\'ll Work'
    },
    {
        id: 4,
        type: 'video',
        src: 'assets/images/celestial.MOV',
        alt: 'Celestial'
    },
    {
        id: 5,
        type: 'image',
        src: 'assets/images/lock_in.jpg',
        alt: 'Lock In'
    },
    {
        id: 6,
        type: 'video',
        src: 'assets/images/motive.mov',
        alt: 'Motive'
    },
    {
        id: 7,
        type: 'image',
        src: 'assets/images/reach_for_the_stars.jpg',
        alt: 'Reach for the Stars'
    },
    {
        id: 8,
        type: 'video',
        src: 'assets/images/nice.mov',
        alt: 'Nice'
    },
    {
        id: 9,
        type: 'image',
        src: 'assets/images/start.jpg',
        alt: 'Start'
    },
    {
        id: 10,
        type: 'video',
        src: 'assets/images/nyc.mov',
        alt: 'NYC'
    },
    {
        id: 11,
        type: 'image',
        src: 'assets/images/city_night.jpg',
        alt: 'City Night'
    },
    {
        id: 12,
        type: 'video',
        src: 'assets/images/sky.mov',
        alt: 'Sky'
    },
    {
        id: 13,
        type: 'image',
        src: 'assets/images/gym_girl.jpg',
        alt: 'Gym Girl'
    },
    {
        id: 14,
        type: 'image',
        src: 'assets/images/nothing_changes.jpg',
        alt: 'Nothing Changes'
    },
    {
        id: 15,
        type: 'image',
        src: 'assets/images/results.jpg',
        alt: 'Results'
    },
    {
        id: 16,
        type: 'image',
        src: 'assets/images/flowers.jpg',
        alt: 'Flowers'
    },
    {
        id: 17,
        type: 'image',
        src: 'assets/images/ski.jpg',
        alt: 'Ski'
    },
    {
        id: 18,
        type: 'image',
        src: 'assets/images/flights.jpg',
        alt: 'Flights'
    },
    {
        id: 19,
        type: 'image',
        src: 'assets/images/time.jpg',
        alt: 'Time'
    },
    {
        id: 20,
        type: 'image',
        src: 'assets/images/text_1.jpg',
        alt: 'Text'
    },
    {
        id: 21,
        type: 'image',
        src: 'assets/images/IMG_1235.jpg',
        alt: 'IMG 1235'
    },
    {
        id: 22,
        type: 'image',
        src: 'assets/images/IMG_1247.jpg',
        alt: 'IMG 1247'
    }
];

// State management
let savedItems = JSON.parse(localStorage.getItem('pocket2square_saved')) || [];
let currentItemId = null;

// DOM elements
const gallery = document.getElementById('gallery');
const modal = document.getElementById('modal');
const modalMedia = document.getElementById('modalMedia');
const modalClose = document.getElementById('modalClose');

// Initialize the app
function init() {
    renderGallery();
    attachEventListeners();
}

// Render gallery items
function renderGallery() {
    gallery.innerHTML = '';
    
    contentData.forEach(item => {
        const galleryItem = createGalleryItem(item);
        gallery.appendChild(galleryItem);
    });
}

// Create individual gallery item
function createGalleryItem(item) {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.dataset.id = item.id;

    if (item.type === 'image') {
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.alt;
        img.loading = 'lazy';
        div.appendChild(img);
    } else if (item.type === 'video') {
        const video = document.createElement('video');
        video.src = item.src;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        div.appendChild(video);

        // Use Intersection Observer to auto-play when visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play();
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.5 });

        observer.observe(div);
    } else if (item.type === 'text') {
        div.classList.add('text-card');
        div.style.background = item.bgColor || '#f0f0f0';
        const textContent = document.createElement('div');
        textContent.className = 'text-content';
        textContent.textContent = item.content;
        div.appendChild(textContent);
    }

    // Click to open modal
    div.addEventListener('click', () => openModal(item));

    return div;
}

// Open modal with enlarged content
function openModal(item) {
    currentItemId = item.id;
    modalMedia.innerHTML = '';
    
    if (item.type === 'image') {
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.alt;
        modalMedia.appendChild(img);
    } else if (item.type === 'video') {
        const video = document.createElement('video');
        video.src = item.src;
        video.controls = true;
        video.autoplay = true;
        modalMedia.appendChild(video);
    } else if (item.type === 'text') {
        modalMedia.classList.add('text-card');
        modalMedia.style.background = item.bgColor || '#f0f0f0';
        const textContent = document.createElement('div');
        textContent.className = 'text-content';
        textContent.textContent = item.content;
        modalMedia.appendChild(textContent);
    }

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    modal.classList.remove('active');
    modalMedia.innerHTML = '';
    modalMedia.classList.remove('text-card');
    currentItemId = null;
    document.body.style.overflow = '';
}

// Toggle save item
function toggleSave() {
    if (!currentItemId) return;
    
    const index = savedItems.indexOf(currentItemId);
    
    if (index > -1) {
        // Unsave
        savedItems.splice(index, 1);
        saveBtn.classList.remove('saved');
    } else {
        // Save
        savedItems.push(currentItemId);
        saveBtn.classList.add('saved');
        
        // Add a little celebration animation
        createConfetti();
    }
    
    // Persist to localStorage
    localStorage.setItem('pocket2square_saved', JSON.stringify(savedItems));
    updateSavedCount();
}

// Update save button appearance
function updateSaveButton() {
    if (savedItems.includes(currentItemId)) {
        saveBtn.classList.add('saved');
    } else {
        saveBtn.classList.remove('saved');
    }
}

// Update saved items count
function updateSavedCount() {
    savedCount.textContent = savedItems.length;
}

// Create confetti effect when saving
function createConfetti() {
    const colors = ['#ff6b9d', '#4ecdc4', '#6b5b95', '#ffeaa7', '#fab1a0'];
    const confettiCount = 15;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = '50%';
        confetti.style.top = '50%';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        
        document.body.appendChild(confetti);
        
        const angle = (Math.PI * 2 * i) / confettiCount;
        const velocity = 100 + Math.random() * 100;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let x = 0;
        let y = 0;
        let opacity = 1;
        
        const animate = () => {
            x += vx * 0.016;
            y += vy * 0.016 + 50 * 0.016;
            opacity -= 0.02;
            
            confetti.style.transform = `translate(${x}px, ${y}px)`;
            confetti.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                confetti.remove();
            }
        };
        
        animate();
    }
}

// Attach event listeners
function attachEventListeners() {
    modalClose.addEventListener('click', closeModal);

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Close modal on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Show saved items (placeholder for future feature)
function showSavedItems() {
    alert(`You have ${savedItems.length} saved items! This feature will show your collection soon.`);
    // TODO: Implement saved items view
}

// Start the app
init();
