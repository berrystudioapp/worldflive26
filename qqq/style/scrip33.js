/**
 * TOÀN BỘ MÃ NGUỒN SCRIPT.JS (BẢN ĐẦY ĐỦ ĐÃ GIẢI MÃ)
 */

// --- 1. Cấu hình hằng số & Dữ liệu ---
const CORRECT_PASSCODE = "0803"; // Mật khẩu bạn có thể thay đổi
let currentPasscode = "";
let messages = [];

// DANH SÁCH NHẠC (Full Playlist)
const songs = [
    {
        title: "Tên Bài Hát 1",
        artist: "Nghệ sĩ 1",
        cover: "style/img/cover1.jpg",
        src: "style/music/song1.mp3"
    },
    {
        title: "Tên Bài Hát 2",
        artist: "Nghệ sĩ 2",
        cover: "style/img/cover2.jpg",
        src: "style/music/song2.mp3"
    },
    {
        title: "Tên Bài Hát 3",
        artist: "Nghệ sĩ 3",
        cover: "style/img/cover3.jpg",
        src: "style/music/song3.mp3"
    }
];

let currentSongIndex = 0;
const audio = new Audio(); // Trình phát nhạc trung tâm

// --- 2. Xử lý Màn hình khóa (Lock Screen) ---

function handleNumpadClick(digit) {
    if (currentPasscode.length < 4) {
        currentPasscode += digit;
        updatePasscodeDots();
        if (currentPasscode.length === 4) checkPasscode();
    }
}

function updatePasscodeDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        i < currentPasscode.length ? dot.classList.add('active') : dot.classList.remove('active');
    });
}

function deleteLastDigit() {
    currentPasscode = currentPasscode.slice(0, -1);
    updatePasscodeDots();
}

function checkPasscode() {
    if (currentPasscode === CORRECT_PASSCODE) {
        const lockScreen = document.getElementById('lock-screen');
        const mainContent = document.getElementById('main-content');
        lockScreen.style.opacity = '0';
        setTimeout(() => {
            lockScreen.style.display = 'none';
            mainContent.classList.remove('main-content-hidden');
            initApp(); // Khởi động toàn bộ hiệu ứng
        }, 500);
    } else {
        const lockForm = document.querySelector('.lock-form');
        lockForm.classList.add('shake');
        setTimeout(() => {
            lockForm.classList.remove('shake');
            currentPasscode = "";
            updatePasscodeDots();
        }, 500);
    }
}

// --- 3. Quản lý Âm nhạc (Music Player Logic) ---

function loadSong(index) {
    const song = songs[index];
    audio.src = song.src;
    document.getElementById('music-title').innerText = song.title;
    document.getElementById('music-artist').innerText = song.artist;
    document.getElementById('music-cover').src = song.cover;
}

function playMusic() {
    audio.play();
    document.getElementById('play-pause').innerHTML = '<i class="fa-solid fa-pause"></i>';
}

function pauseMusic() {
    audio.pause();
    document.getElementById('play-pause').innerHTML = '<i class="fa-solid fa-play"></i>';
}

function renderSongList() {
    const container = document.getElementById('song-list');
    if (!container) return;
    container.innerHTML = '';

    songs.forEach((song, index) => {
        const item = document.createElement('div');
        item.className = `song-item ${index === currentSongIndex ? 'active' : ''}`;
        item.innerHTML = `
            <div class="song-info">
                <div class="song-name">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
        `;
        item.onclick = () => {
            currentSongIndex = index;
            loadSong(index);
            playMusic();
            renderSongList();
        };
        container.appendChild(item);
    });
}

// Điều khiển Spotify UI
document.getElementById('play-pause')?.addEventListener('click', () => {
    audio.paused ? playMusic() : pauseMusic();
});

document.getElementById('next-song')?.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    playMusic();
    renderSongList();
});

document.getElementById('prev-song')?.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    playMusic();
    renderSongList();
});

// --- 4. Hiệu ứng Hình ảnh & Lời chúc rơi ---

async function loadMessages() {
    try {
        const res = await fetch('messages.txt');
        const data = await res.json();
        messages = data.split('\n').filter(m => m.trim() !== "");
    } catch (e) {
        messages = ["Chúc em ngày 8/3 rạng rỡ! ❤️", "Hạnh phúc nhé cô gái của anh!"];
    }
}

function createFallingImage() {
    const img = document.createElement('img');
    const randomId = Math.floor(Math.random() * 14) + 1; // Từ anh (1) đến anh (14)
    img.src = `style/img/anh (${randomId}).jpg`;
    img.className = 'falling-item';
    img.style.left = Math.random() * 95 + 'vw';
    img.style.animationDuration = (Math.random() * 3 + 4) + 's';
    document.body.appendChild(img);
    setTimeout(() => img.remove(), 7000);
}

function createFallingMessage() {
    if (messages.length === 0) return;
    const msg = document.createElement('div');
    msg.className = 'falling-message';
    msg.innerText = messages[Math.floor(Math.random() * messages.length)];
    msg.style.left = Math.random() * 70 + 'vw';
    msg.style.animationDuration = (Math.random() * 4 + 6) + 's';
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 10000);
}

// --- 5. Hiệu ứng Click nổ Trái tim ---

function createHeartExplosion(x, y) {
    const pop = document.getElementById('pop-sound');
    if (pop) pop.cloneNode().play();

    for (let i = 0; i < 12; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '💖';
        heart.className = 'heart-particle';
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        
        const angle = Math.random() * Math.PI * 2;
        const dist = 50 + Math.random() * 100;
        heart.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
        heart.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
        
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1000);
    }
}

// --- 6. Khởi chạy ---

function initApp() {
    loadMessages();
    loadSong(currentSongIndex);
    setInterval(createFallingImage, 2500);
    setInterval(createFallingMessage, 4500);
}

document.querySelectorAll('.num-btn').forEach(btn => {
    btn.onclick = () => handleNumpadClick(btn.dataset.value);
});

document.querySelector('.delete-btn')?.addEventListener('click', deleteLastDigit);

document.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
        createHeartExplosion(e.clientX, e.clientY);
    }
});

document.getElementById('btn-music')?.addEventListener('click', () => {
    document.getElementById('music-overlay').style.display = 'flex';
    renderSongList();
});











