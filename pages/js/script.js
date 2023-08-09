$(document).ready(function () {
    const canvas = document.getElementById("myCanvas");
    const context = canvas.getContext("2d");
    const points = [];

    function drawPoints() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "black";
        points.forEach(point => {
            context.beginPath();
            context.arc(point.x, point.y, 20, 0, 2 * Math.PI);
            context.stroke();
        });
    }

    function handleCanvasClick(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        points.push({ x, y });
        drawPoints();
    }


    $("#myCanvas").on("click", handleCanvasClick);
});