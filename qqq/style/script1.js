// file: giama1.js
const heartsContainer = document.querySelector('.hearts-container');
const imageFiles = Array.from({ length: 14 }, (_, i) => 'style/images/image' + (i + 1) + '.jpg');
let letterText = [];

// ==========================================
// 1. XỬ LÝ NỘI DUNG THƯ (LETTER)
// ==========================================
async function loadLetter() {
    try {
        const response = await fetch('letter.txt');
        const text = await response.text();
        // Cắt văn bản theo đoạn và loại bỏ dòng trống
        letterText = text.split(/\n\s*\n/).map(p => p.trim()).filter(p => p !== '');
    } catch (error) {
        console.error("Error loading letter", error);
        letterText = ['Mãi yêu em ❤️']; // Text mặc định nếu lỗi tải file
    }
}
loadLetter();

// ==========================================
// 2. DANH SÁCH BÀI HÁT (MUSIC PLAYER)
// ==========================================
const songs = [
    { title: 'Tình Yêu Khủng Long x Cậu Cả', cover: 'style/sound/Cậu Cả.jpg', src: 'style/sound/Cậu Cả (Remix).mp3' },
    { title: 'In Love x Có Đôi Điều', cover: 'style/sound/Có đôi điều.jpg', src: 'style/sound/Có Đôi Điều (Remix).mp3' },
    { title: 'Track 06 x Nơi Này Có Anh', cover: 'style/sound/Anh (3).jpg', src: 'style/sound/Nơi Này Có Anh (Remix).mp3' },
    { title: 'Lỡ Say Bye Là Bye', cover: 'style/sound/say bye.jpg', src: 'style/sound/Lỡ say bye là bye.mp3' },
    { title: 'Sau Lời Từ Khước', cover: 'style/sound/Mai.jpg', src: 'style/sound/Sau Lời Từ Khước.mp3' },
    { title: 'Làm Gì Phải Hốt', cover: 'style/sound/Làm Gì Phải Hốt.jpg', src: 'style/sound/Làm Gì Phải Hốt.mp3' }
];

// ==========================================
// 3. HIỆU ỨNG THẢ TIM (FALLING HEARTS)
// ==========================================
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');

    const emojis = ['❤', '💖', '💗', '💓', '💕', '🌸'];
    const gifs = [
        'https://i.pinimg.com/originals/88/23/82/882382f97862c72e60fc06822e36eb55.gif',
        'https://i.pinimg.com/originals/b9/67/4f/b9674f3f995aba177250894d57f42bbf.gif',
        'https://i.pinimg.com/originals/b6/6b/1b/b66b1bfe70a9ad4f69dea3b620011222.gif'
    ];
    
    // Tỉ lệ 50% hiển thị ảnh GIF, 50% hiển thị Emoji
    const isGif = Math.random() > 0.5;

    if (isGif) {
        const img = document.createElement('img');
        img.src = gifs[Math.floor(Math.random() * gifs.length)];
        const size = Math.floor(Math.random() * 30) + 30;
        img.style.width = size + 'px';
        img.style.height = 'auto';
        heart.appendChild(img);
    } else {
        heart.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        const fontSize = Math.floor(Math.random() * 20) + 10;
        heart.style.fontSize = fontSize + 'px';
    }

    const left = Math.random() * 100;
    const duration = Math.random() * 3 + 3;
    const opacity = Math.random() * 0.5 + 0.5;

    heart.style.left = left + '%';
    heart.style.animationDuration = duration + 's';
    heart.style.opacity = opacity;

    heartsContainer.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, duration * 1000);
}

// Khởi tạo tim rơi ban đầu
for (let i = 0; i < 10; i++) {
    setTimeout(createHeart, Math.random() * 3000);
}
setInterval(createHeart, 400);

// ==========================================
// 4. HIỆU ỨNG ĐÁNH CHỮ (TYPEWRITER)
// ==========================================
const btnLetter = document.getElementById('btn-letter');
const letterOverlay = document.getElementById('letter-overlay');
const closeLetter = document.getElementById('close-letter');
const letterBody = document.getElementById('letter-body');

let typingInterval, paragraphIndex = 0, charIndex = 0, isTyping = false;

function typeWriter() {
    if (paragraphIndex < letterText.length) {
        isTyping = true;
        let currentParagraph = letterBody.lastElementChild;

        if (!currentParagraph || charIndex === 0) {
            currentParagraph = document.createElement('p');
            letterBody.appendChild(currentParagraph);
        }

        currentParagraph.innerHTML += letterText[paragraphIndex][charIndex];
        charIndex++;
        letterBody.scrollTop = letterBody.scrollHeight;

        if (charIndex < letterText[paragraphIndex].length) {
            typingInterval = setTimeout(typeWriter, 30);
        } else {
            paragraphIndex++;
            charIndex = 0;
            typingInterval = setTimeout(typeWriter, 500);
        }
    } else {
        isTyping = false;
    }
}

btnLetter.addEventListener('click', () => {
    letterOverlay.classList.add('active');
    if (!isTyping && paragraphIndex < letterText.length) {
        setTimeout(typeWriter, 500);
    }
});

closeLetter.addEventListener('click', () => {
    letterOverlay.classList.remove('active');
    clearTimeout(typingInterval);
    isTyping = false;
});

// ==========================================
// 5. LOGIC TRÌNH PHÁT NHẠC
// ==========================================
const btnMusic = document.getElementById('btn-music');
const musicOverlay = document.getElementById('music-overlay');
const closeMusic = document.getElementById('close-music');
const audioPlayer = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const songTitle = document.getElementById('song-title');
const songArtist = document.getElementById('song-artist');
const albumArt = document.querySelector('.album-art img');
const songListContainer = document.getElementById('song-list');

let songIndex = 0, isPlaying = false;

function loadSong(song) {
    const parts = song.title.split(' x ');
    songTitle.innerText = parts[0] || song.title;
    songArtist.innerText = parts[1] || 'Unknown Artist';
    audioPlayer.src = song.src;
    albumArt.src = song.cover;
    updateSongListUI();
}

function updateSongListUI() {
    const items = document.querySelectorAll('.song-item');
    items.forEach((item, index) => {
        if (index === songIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function playSong() {
    isPlaying = true;
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    audioPlayer.play();
}

function pauseSong() {
    isPlaying = false;
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    audioPlayer.pause();
}

function prevSong() {
    songIndex--;
    if (songIndex < 0) songIndex = songs.length - 1;
    loadSong(songs[songIndex]);
    playSong();
}

function nextSong() {
    songIndex++;
    if (songIndex > songs.length - 1) songIndex = 0;
    loadSong(songs[songIndex]);
    playSong();
}

function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    if (isNaN(duration)) return;
    const percent = (currentTime / duration) * 100;
    progress.style.width = percent + '%';
    currentTimeEl.innerText = formatTime(currentTime);
    durationEl.innerText = formatTime(duration);
}

function formatTime(time) {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return min + ':' + (sec < 10 ? '0' : '') + sec;
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
}

// Khởi tạo danh sách UI cho list nhạc
songs.forEach((song, index) => {
    const songItem = document.createElement('div');
    songItem.classList.add('song-item');
    songItem.innerHTML = `
        <img src="${song.cover}" alt="${song.title}">
        <div class="song-item-info">
            <div class="song-item-title">${song.title}</div>
        </div>`;
    
    songItem.addEventListener('click', () => {
        songIndex = index;
        loadSong(songs[songIndex]);
        playSong();
    });
    songListContainer.appendChild(songItem);
});

btnMusic.addEventListener('click', () => musicOverlay.classList.add('active'));
closeMusic.addEventListener('click', () => musicOverlay.classList.remove('active'));

playPauseBtn.addEventListener('click', () => {
    if (isPlaying) pauseSong();
    else playSong();
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
audioPlayer.addEventListener('timeupdate', updateProgress);
audioPlayer.addEventListener('ended', nextSong);
progressBar.addEventListener('click', setProgress);

// Âm thanh click pop-sound chung cho toàn trang
const popSound = document.getElementById('pop-sound');
window.addEventListener('click', () => {
    if (popSound) {
        popSound.currentTime = 0;
        popSound.play().catch(()=>console.log("Audio autoplay prevented"));
    }
}, true);

loadSong(songs[songIndex]);

// ==========================================
// 6. THƯ VIỆN ẢNH (GALLERY & LIGHTBOX)
// ==========================================
const btnImage = document.getElementById('btn-image');
const imageOverlay = document.getElementById('image-overlay');
const closeImage = document.getElementById('close-image');
const galleryTop = document.getElementById('gallery-top');
const galleryBottom = document.getElementById('gallery-bottom');
const lightboxOverlay = document.getElementById('lightbox-overlay');
const lightboxImg = document.getElementById('lightbox-img');
const closeLightbox = document.getElementById('close-lightbox');

function populateGallery() {
    galleryTop.innerHTML = '';
    galleryBottom.innerHTML = '';
    const topImages = imageFiles.slice(0, 7);
    const bottomImages = imageFiles.slice(7);

    const createImgElement = (src) => {
        const img = document.createElement('img');
        img.src = src;
        img.loading = 'lazy';
        img.addEventListener('click', () => openLightbox(src));
        return img;
    };

    [...topImages, ...topImages].forEach(src => galleryTop.appendChild(createImgElement(src)));
    [...bottomImages, ...bottomImages].forEach(src => galleryBottom.appendChild(createImgElement(src)));
}

function openLightbox(src) {
    lightboxImg.src = src;
    lightboxOverlay.classList.add('active');
}

closeLightbox.addEventListener('click', () => {
    lightboxOverlay.classList.remove('active');
});

lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay) lightboxOverlay.classList.remove('active');
});

btnImage.addEventListener('click', () => {
    populateGallery();
    imageOverlay.classList.add('active');
});

closeImage.addEventListener('click', () => {
    imageOverlay.classList.remove('active');
});

// ==========================================
// 7. HỘP QUÀ (GIFT MODAL)
// ==========================================
const btnGift = document.getElementById('btn-gift');
const giftOverlay = document.getElementById('gift-overlay');
const closeGift = document.getElementById('close-gift');
const fullscreenGiftBtn = document.getElementById('fullscreen-gift-btn');
const giftModalElement = document.getElementById('gift-modal');
const giftIframe = document.querySelector('.gift-iframe');

btnGift.addEventListener('click', () => {
    if (giftIframe) {
        giftIframe.src = giftIframe.src; // Khởi động lại Iframe
    }
    giftOverlay.classList.add('active');
});

closeGift.addEventListener('click', () => {
    giftOverlay.classList.remove('active');
});

fullscreenGiftBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        if (giftModalElement.requestFullscreen) {
            giftModalElement.requestFullscreen();
        } else if (giftModalElement.webkitRequestFullscreen) {
            giftModalElement.webkitRequestFullscreen();
        }
        fullscreenGiftBtn.innerHTML = '<i class="fas fa-compress"></i>';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
        fullscreenGiftBtn.innerHTML = '<i class="fas fa-expand"></i>';
    }
});

document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        fullscreenGiftBtn.innerHTML = '<i class="fas fa-expand"></i>';
    }
});

// ==========================================
// 8. MÀN HÌNH KHÓA (LOCK SCREEN)
// ==========================================
const lockScreen = document.getElementById('lock-screen');
const mainContent = document.getElementById('main-content');
const passDots = document.querySelectorAll('.pass-dot');
const numBtns = document.querySelectorAll('.num-btn');
const deleteBtn = document.querySelector('.delete-btn');

let enteredPin = '';
const correctPin = '1106'; // Chú ý: Bạn có thể đổi mã PIN tại đây

function updateDots() {
    passDots.forEach((dot, index) => {
        if (index < enteredPin.length) {
            dot.classList.add('active');
            
            // Random tạo hình ảnh hoặc Emoji vào dot nhập mật khẩu
            const emojis = ['❤', '💖', '💗', '💓', '💕', '🌸'];
            const gifs = [
                'https://i.pinimg.com/originals/88/23/82/882382f97862c72e60fc06822e36eb55.gif',
                'https://i.pinimg.com/originals/b9/67/4f/b9674f3f995aba177250894d57f42bbf.gif',
                'https://i.pinimg.com/originals/b6/6b/1b/b66b1bfe70a9ad4f69dea3b620011222.gif'
            ];
            
            if (Math.random() > 0.5) {
                dot.innerHTML = `<img src="${gifs[Math.floor(Math.random() * gifs.length)]}" style="width: 30px; height: auto;">`;
            } else {
                dot.innerText = emojis[Math.floor(Math.random() * emojis.length)];
                dot.style.fontSize = Math.floor(Math.random() * 10) + 10 + 'px';
            }
        } else {
            dot.classList.remove('active');
            dot.innerHTML = '';
            dot.innerText = '';
        }
    });
}

function handleInput(num) {
    if (!lockScreen || lockScreen.classList.contains('hidden')) return;
    
    if (enteredPin.length < 4) {
        enteredPin += num;
        updateDots();
        if (enteredPin.length === 4) {
            setTimeout(checkPin, 300);
        }
    }
}

function checkPin() {
    if (enteredPin === correctPin) {
        unlock();
    } else {
        fail();
    }
}

function unlock() {
    lockScreen.classList.add('main-content-hidden');
    mainContent.classList.remove('main-content-hidden');
    mainContent.classList.add('main-content-visible');
    enteredPin = '';
    updateDots();
}

function fail() {
    const lockpad = document.getElementById('lockpad') || lockScreen;
    lockpad.classList.add('shake');
    if (navigator.vibrate) navigator.vibrate(200);
    setTimeout(() => {
        lockpad.classList.remove('shake');
        enteredPin = '';
        updateDots();
    }, 500);
}

function deleteLastDigit() {
    if (enteredPin.length > 0) {
        enteredPin = enteredPin.slice(0, -1);
        updateDots();
    }
}

if (numBtns) {
    numBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            handleInput(btn.getAttribute('data-num') || btn.innerText.trim());
        });
    });
}

if (deleteBtn) {
    deleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        deleteLastDigit();
    });
}

// Lắng nghe sự kiện bàn phím
document.addEventListener('keydown', (e) => {
    if (!lockScreen || lockScreen.classList.contains('main-content-hidden')) return;
    if (e.key >= '0' && e.key <= '9') {
        handleInput(e.key);
    } else if (e.key === 'Backspace') {
        deleteLastDigit();
    }
});

const resetLockBtn = document.getElementById('reset-lock');
if (resetLockBtn) {
    resetLockBtn.addEventListener('click', () => {
        window.location.reload();
    });
}