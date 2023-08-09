$(document).ready(function () {
    const radius = 20;
    const nodes = [];
    const edges = [];

    function repaint() {
        const canvas = document.getElementById("myCanvas");
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawEdges(context);
        drawNodes(context);
    }

    function drawNodes(context) {
        context.fillStyle = "black";
        nodes.forEach(point => {
            context.beginPath();
            context.arc(point.x, point.y, radius, 0, 2 * Math.PI);
            context.stroke();
        });
    }

    function drawEdges(context) {
        context.fillStyle = "black";
        edges.forEach(edge => {
            context.beginPath();
            context.moveTo(nodes[edge.left].x, nodes[edge.left].y)
            context.lineTo(nodes[edge.rigth].x, nodes[edge.rigth].y)
            context.stroke();
        })
    }

    function handleCanvasClick(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        nodes.push({ x, y });
        repaint();
    }

    function findNodeIndex(x, y) {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const distance = Math.sqrt((pointX - node.x) ** 2 + (pointY - node.y) ** 2);
            
            if (distance <= radius) {
                return i;
            }
        }
        return -1;
    }


    $("#myCanvas").on("click", handleCanvasClick);
});