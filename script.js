document.getElementById('upload').addEventListener('change', handleFiles);

function handleFiles(event) {
    const files = event.target.files;
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = ''; // Очистка галереи перед добавлением новых изображений

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            createPolaroidElement(e.target.result, gallery);
        };
        reader.readAsDataURL(file);
    });
}

function createPolaroidElement(src, gallery) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Устанавливаем коэффициент для повышения разрешения
    const scaleFactor = 3; // 3x увеличение разрешения

    // Устанавливаем размеры в пикселях, умноженные на scaleFactor
    const photoWidth = 3.1 * 96 * scaleFactor;
    const photoHeight = 3.1 * 96 * scaleFactor;
    const canvasWidth = 3.5 * 96 * scaleFactor;
    const canvasHeight = 4.2 * 96 * scaleFactor;

    // Настройка размера канваса
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const img = new Image();
    img.onload = function() {
        // Кадрирование изображения по центру с соотношением 1:1
        const minSize = Math.min(img.width, img.height);
        const sx = (img.width - minSize) / 2;
        const sy = (img.height - minSize) / 2;

        // Заливка фона белым
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Позиционирование изображения с учетом scaleFactor
        const offsetX = (canvasWidth - photoWidth) / 2;
        const offsetY = 0.1 * 96 * scaleFactor; // Отступ сверху (0.1 дюйма)

        // Отрисовка изображения
        ctx.drawImage(img, sx, sy, minSize, minSize, offsetX, offsetY, photoWidth, photoHeight);

        // Создание div для отображения полароида
        const polaroid = document.createElement('div');
        polaroid.className = 'polaroid';
        polaroid.appendChild(canvas);

        // Создание кнопки для скачивания
        const downloadBtn = document.createElement('a');
        downloadBtn.className = 'download-btn';
        downloadBtn.innerText = 'Скачать';
        downloadBtn.href = canvas.toDataURL('image/jpeg', 0.92); // Сохраняем с высоким качеством
        downloadBtn.download = 'polaroid-photo.jpg';
        polaroid.appendChild(downloadBtn);

        gallery.appendChild(polaroid);
    };
    img.src = src;
}
