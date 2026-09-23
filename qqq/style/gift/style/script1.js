// Biểu tượng hiệu ứng
let explosionIcon = '💖';
let isGifting = true;
let giftInterval = null;
let isMessaging = true;
let messageInterval = null;
let messages = [];

// Hàm tải lời chúc từ file messages.txt
async function loadMessages() {
    try {
        const response = await fetch('messages.txt');
        const data = await response.json();
         // const data = await response.text();
        // Tách các dòng và lọc bỏ dòng trống
        messages = data.split(/\n/).map(msg => msg.trim()).filter(msg => msg !== '');
    } catch (error) {
        console.error("Không thể tải lời chúc:", error);
        messages = ["Anh yêu em ❤️"]; // Lời chúc mặc định nếu lỗi
    }
}

loadMessages();

const mainContent = document.getElementById('main-content');

// Hàm bắt đầu trải nghiệm sau khi mở khóa
function startExperience() {
    if (mainContent.classList.contains('hidden')) {
        mainContent.classList.remove('hidden');
    }
    
    document.body.classList.remove('hidden');
    
    // Bắt đầu hiệu ứng ảnh rơi và tin nhắn rơi sau 5 giây
    setTimeout(() => {
        createFallingImage();
        giftInterval = setInterval(createFallingImage, 1000);
        
        createFallingMessage();
        messageInterval = setInterval(createFallingMessage, 1500);
    }, 5000);
}

// Lắng nghe sự kiện để bắt đầu
window.addEventListener('load', startExperience);

// Hàm tạo hiệu ứng hình ảnh rơi tự do
function createFallingImage() {
    if (!isGifting) return;

    const img = document.createElement('img');
    // Chọn ngẫu nhiên ảnh từ anh1.jpg đến anh14.jpg
    const randomNum = Math.floor(Math.random() * 14) + 1;
    img.src = `style/img/anh${randomNum}.jpg`;
    img.classList.add('falling-item');

    const screenWidth = window.innerWidth;
    // Kích thước ảnh ngẫu nhiên từ 50px đến 110px
    const size = screenWidth < 600 ? Math.random() * 40 + 50 : Math.random() * 60 + 60;
    const posX = Math.random() * (screenWidth - size);
    const duration = Math.random() * 4 + 4; // Thời gian rơi 4-8s

    img.style.left = posX + 'px';
    img.style.width = size + 'px';
    img.style.position = 'absolute';
    img.style.animationDuration = duration + 's';

    document.body.appendChild(img);

    // Xóa ảnh sau khi rơi xong
    setTimeout(() => {
        img.remove();
    }, duration * 1000);
}

// Hàm tạo tin nhắn văn bản rơi
function createFallingMessage() {
    if (!isMessaging) return;

    const msgDiv = document.createElement('div');
    msgDiv.classList.add('falling-message');
    // Lấy nội dung ngẫu nhiên từ danh sách messages
    msgDiv.innerHTML = messages[Math.floor(Math.random() * messages.length)];

    const styles = [
        { text: '#ff69b4', border: '#ff1493' },
        { text: '#40e0d0', border: '#00ced1' },
        { text: '#afeeee', border: '#00ffff' }
    ];
    
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    const screenWidth = window.innerWidth;
    const padding = 20;
    const posX = Math.random() * (screenWidth - 180 - padding * 2) + padding;
    const duration = screenWidth < 600 ? Math.random() * 4 + 10 : Math.random() * 6 + 10;

    msgDiv.style.left = Math.max(padding, posX) + 'px';
    msgDiv.style.fontSize = (screenWidth < 600 ? Math.random() * 4 + 14 : Math.random() * 6 + 16) + 'px';
    msgDiv.style.color = randomStyle.text;
    msgDiv.style.borderColor = randomStyle.border;
    msgDiv.style.animationDuration = duration + 's';

    document.body.appendChild(msgDiv);

    setTimeout(() => {
        msgDiv.remove();
    }, duration * 1000);
}

// Hiệu ứng tạo trái tim khi click hoặc chạm màn hình
document.addEventListener('click', (e) => {
    createHearts(e.clientX, e.clientY);
});

document.addEventListener('touchstart', (e) => {
    createHearts(e.touches[0].clientX, e.touches[0].clientY);
});

function createHearts(x, y) {
    const heartCount = 15;
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = explosionIcon;
        heart.classList.add('heart');

        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * 150;
        const destX = Math.cos(angle) * velocity;
        const destY = Math.sin(angle) * velocity;

        heart.style.setProperty('--dest-x', destX + 'px');
        heart.style.setProperty('--dest-y', destY + 'px');
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';

        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 1000);
    }
}

// Xử lý âm thanh khi tương tác
const popSound = document.getElementById('pop-sound');
window.addEventListener('mousedown', () => {
    if (popSound) {
        const soundClone = popSound.cloneNode(true);
        soundClone.play();
    }
}, true);