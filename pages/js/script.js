$(document).ready(function () {
    const canvas = document.getElementById("myCanvas");
    const radius = 20;
    const nodes = [];
    let edges = [];
    let selectedNode = -1;
    let creatingEdge = null;

    function repaint() {
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
            context.lineTo(nodes[edge.right].x, nodes[edge.right].y)
            context.stroke();
        })

        if (creatingEdge != null) {
            context.beginPath();
            context.moveTo(nodes[creatingEdge.left].x, nodes[creatingEdge.left].y)
            context.lineTo(creatingEdge.right.x, creatingEdge.right.y)
            context.stroke();
        }
    }

    function findNodeIndex(x, y) {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);

            if (distance <= radius) {
                return i;
            }
        }
        return -1;
    }

    function deleteNode(removingIndex) {
        nodes.splice(removingIndex, 1);

        let edgesToRemove = new Set();
        edges.forEach((value, index) => {
            if (value.left === removingIndex || value.right === removingIndex) {
                edgesToRemove.add(index);
            }
        })
        edges = edges.filter((value, index) => {
            return !edgesToRemove.has(index);
        }).map(value => {
            if (value.left>removingIndex) {
                value.left--;
            }
            if (value.right>removingIndex) {
                value.right--;
            }
            return value;
        })
        repaint();
    }

    function getCanvasMousePoint(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        return {x, y}
    }

    function handleMouseDown(event) {
        let point = getCanvasMousePoint(event);
        selectedNode = findNodeIndex(point.x, point.y);

        if (event.button === 1 && selectedNode !== -1){
            deleteNode(selectedNode);
            selectedNode = -1;
        } else if (event.ctrlKey && selectedNode !== -1) {
            creatingEdge = {"left": selectedNode, "right": point};
        } else if (selectedNode === -1) {
            selectedNode = nodes.length;
            nodes.push(point);
        }
        repaint();
    }

    function handleMouseUp(event) {
        let point = getCanvasMousePoint(event);
        selectedNode = findNodeIndex(point.x, point.y);
        if (creatingEdge != null) {
            if (selectedNode !== -1) {
                edges.push({"left": creatingEdge.left, "right": selectedNode});
            }
            creatingEdge = null;
        }
        selectedNode = -1;
        repaint();
    }

    function handleMouseMove(event) {
        let point = getCanvasMousePoint(event);

        if (creatingEdge != null) {
            creatingEdge.right = point;
        } else if (selectedNode !== -1) {
            nodes[selectedNode] = point;
        }
        repaint();
    }

    $("#myCanvas").on("mousedown", handleMouseDown);
    $("#myCanvas").on("mouseup", handleMouseUp);
    $("#myCanvas").on("mousemove", handleMouseMove);
});