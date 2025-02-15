const finalCanvas = document.getElementById("finalCanvas");
const ctx = finalCanvas.getContext("2d");
const downloadBtn = document.getElementById("download-btn");
const colorButtons = document.querySelectorAll(".color-btn");

let selectedFrameColor = "img/nude.png"; // Default frame
let capturedPhotos = JSON.parse(sessionStorage.getItem("capturedPhotos")) || [];

if (capturedPhotos.length === 0) {
    console.error("No photos found in sessionStorage.");
}

// Canvas dimensions
const canvasWidth = 240;
const imageHeight = 160;
const spacing = 10;
const framePadding = 10;
const logoSpace = 100;

finalCanvas.width = canvasWidth;
finalCanvas.height = framePadding + (imageHeight + spacing) * capturedPhotos.length + logoSpace;

// Function to load an image with CORS enabled
function loadImage(src, onLoadCallback) {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Prevent tainted canvas error
    img.src = src;
    img.onload = () => onLoadCallback(img);
    img.onerror = () => console.error(`Failed to load image: ${src}`);
}

// Function to draw the collage
function drawCollage() {
    loadImage(selectedFrameColor, (background) => {
        ctx.clearRect(0, 0, finalCanvas.width, finalCanvas.height);
        ctx.drawImage(background, 0, 0, finalCanvas.width, finalCanvas.height);

        capturedPhotos.forEach((photo, index) => {
            loadImage(photo, (img) => {
                const x = framePadding;
                const y = framePadding + index * (imageHeight + spacing);
                ctx.drawImage(img, x, y, canvasWidth - 2 * framePadding, imageHeight);
            });
        });

        // Draw the logo
        drawLogo();
    });
}

// Function to draw the logo
function drawLogo() {
    loadImage("img/logo.jpg", (logo) => {
        const logoWidth = 80;
        const logoHeight = 20;
        const logoX = (canvasWidth - logoWidth) / 2;
        const logoY = finalCanvas.height - logoSpace + 35;
        ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
    });
}

// Change frame color and redraw instantly
colorButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        selectedFrameColor = event.target.getAttribute("data-color");
        drawCollage();
    });
});

// Download the final image
downloadBtn.addEventListener("click", () => {
    drawCollage(); // Ensure collage is redrawn before saving
    setTimeout(() => {
        const link = document.createElement("a");
        link.href = finalCanvas.toDataURL("image/png");
        link.download = "photobooth.png";
        link.click();
    }, 500); // Small delay to allow images to render
});

// Initial drawing
drawCollage();
