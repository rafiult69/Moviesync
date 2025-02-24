
const socket = io();
let currentVideoUrl = "";

// Video Loader
const videoLoader = document.querySelector('.loader');

// Video Embed Handler
function convertToEmbedUrl(url) {
    if (url.includes('drive.google.com')) {
        return `https://drive.google.com/file/d/${url.split('/d/')[1].split('/')[0]}/preview`;
    } else if (url.includes('dailymotion.com')) {
        const videoId = url.split('/video/')[1].split('_')[0];
        return `https://www.dailymotion.com/embed/video/${videoId}`;
    }
    return url;
}

function loadVideo() {
    const urlInput = document.getElementById('videoUrl').value;
    currentVideoUrl = convertToEmbedUrl(urlInput);
    document.getElementById('videoPlayer').src = currentVideoUrl;
    videoLoader.style.display = 'block';
    
    // Hide loader when video loads
    document.getElementById('videoPlayer').onload = () => {
        videoLoader.style.display = 'none';
    };
    
    socket.emit('video-change', currentVideoUrl);
}

// Chat Functions
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    if (messageInput.value.trim()) {
        socket.emit('chat', messageInput.value);
        messageInput.value = '';
    }
}

// Socket Events
socket.on('users-count', count => {
    document.getElementById('usersCount').textContent = count;
});

socket.on('chat', msg => {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML += `<div class="message"><span class="user">👤 Friend:</span> ${msg}</div>`;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

socket.on('video-change', url => {
    if (url !== currentVideoUrl) {
        document.getElementById('videoPlayer').src = url;
        currentVideoUrl = url;
    }
});

// Error Handling
window.addEventListener('error', (e) => {
    console.error('Error:', e.message);
    alert('Something went wrong! Please refresh the page.');
});
