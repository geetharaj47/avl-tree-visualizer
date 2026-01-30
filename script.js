/*************************************************
 * AVL TREE VISUALIZATION - COMPLETE SCRIPT
 * Author: (Your Name)
 *************************************************/

/* ---------- NODE CLASS ---------- */
class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;

        // For visualization
        this.x = 0;
        this.y = 0;
    }
}

/* ---------- AVL TREE CLASS ---------- */
class AVLTree {
    constructor() {
        this.root = null;
    }

    height(node) {
        return node ? node.height : 0;
    }

    getBalance(node) {
        return node ? this.height(node.left) - this.height(node.right) : 0;
    }

    /* ---------- RIGHT ROTATION ---------- */
    rightRotate(y) {
        let x = y.left;
        let T2 = x.right;

        // Perform rotation
        x.right = y;
        y.left = T2;

        // Update heights
        y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;
        x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;

        return x;
    }

    /* ---------- LEFT ROTATION ---------- */
    leftRotate(x) {
        let y = x.right;
        let T2 = y.left;

        // Perform rotation
        y.left = x;
        x.right = T2;

        // Update heights
        x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
        y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;

        return y;
    }

    /* ---------- INSERT NODE ---------- */
    insert(node, value) {
        // Normal BST insert
        if (!node) return new Node(value);

        if (value < node.value)
            node.left = this.insert(node.left, value);
        else if (value > node.value)
            node.right = this.insert(node.right, value);
        else
            return node; // No duplicates

        // Update height
        node.height = 1 + Math.max(this.height(node.left), this.height(node.right));

        // Get balance factor
        let balance = this.getBalance(node);

        // LL Case
        if (balance > 1 && value < node.left.value)
            return this.rightRotate(node);

        // RR Case
        if (balance < -1 && value > node.right.value)
            return this.leftRotate(node);

        // LR Case
        if (balance > 1 && value > node.left.value) {
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }

        // RL Case
        if (balance < -1 && value < node.right.value) {
            node.right = this.rightRotate(node.right);
            return this.leftRotate(node);
        }

        return node;
    }
}

/* ---------- GLOBAL VARIABLES ---------- */
const tree = new AVLTree();
const svg = document.getElementById("treeCanvas");

/* ---------- INSERT BUTTON HANDLER ---------- */
function insertValue() {
    const input = document.getElementById("valueInput");
    const value = parseInt(input.value);

    if (isNaN(value)) return;

    tree.root = tree.insert(tree.root, value);
    input.value = "";

    svg.innerHTML = "";
    calculatePositions(tree.root, 500, 50, 200);
    drawTree(tree.root);
}

/* ---------- POSITION CALCULATION ---------- */
function calculatePositions(node, x, y, gap) {
    if (!node) return;

    node.x = x;
    node.y = y;

    calculatePositions(node.left, x - gap, y + 80, gap / 2);
    calculatePositions(node.right, x + gap, y + 80, gap / 2);
}

/* ---------- DRAW TREE ---------- */
function drawTree(node) {
    if (!node) return;

    if (node.left) drawLine(node, node.left);
    if (node.right) drawLine(node, node.right);

    drawNode(node);

    drawTree(node.left);
    drawTree(node.right);
}

/* ---------- DRAW NODE ---------- */
function drawNode(node) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", node.x);
    circle.setAttribute("cy", node.y);
    circle.setAttribute("r", 18);
    circle.setAttribute("fill", "#4CAF50");

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", node.x);
    text.setAttribute("y", node.y + 5);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("fill", "white");
    text.setAttribute("font-size", "14px");
    text.textContent = node.value;

    svg.appendChild(circle);
    svg.appendChild(text);
}

/* ---------- DRAW EDGE ---------- */
function drawLine(parent, child) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", parent.x);
    line.setAttribute("y1", parent.y);
    line.setAttribute("x2", child.x);
    line.setAttribute("y2", child.y);
    line.setAttribute("stroke", "#000");

    svg.appendChild(line);
}
