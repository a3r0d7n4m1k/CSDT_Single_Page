const canvas = document.getElementById('canvas');

/**
 * @param {number} braidSize width of the braid in pixels
 * @param {number} x
 * @param {number} y
 */
function drawBraid(braidSize = 20, x, y) {
    if (canvas.getContext) {
        const braid = canvas.getContext('2d');
        const lineWidth = braidSize / 7;
        const offset = lineWidth / 2;
        braid.beginPath();
        braid.lineWidth = lineWidth;
        braid.moveTo(x + offset, y + offset);
        braid.lineTo(x + braidSize / 2, y + braidSize / 2);
        braid.moveTo(x + braidSize - offset, y + offset);
        braid.lineTo(x + offset, y + braidSize - offset);
        braid.stroke();
    }
};
drawBraid(50, 100, 100);

for (let i = 1; i <= 5; i++) {
    drawBraid(50, 100 + i * 50, 100);
}
