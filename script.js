class PerfectCircleGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.drawingHint = document.getElementById('drawingHint');
        this.scoreContainer = document.getElementById('scoreContainer');
        this.scoreTitle = document.getElementById('scoreTitle');
        this.scoreFill = document.getElementById('scoreFill');
        this.scorePercentage = document.getElementById('scorePercentage');
        this.scoreMessage = document.getElementById('scoreMessage');
        this.resetBtn = document.getElementById('resetBtn');
        
        this.isDrawing = false;
        this.points = [];
        this.centerX = 0;
        this.centerY = 0;
        this.radius = 0;
        this.hasDrawn = false;
        this.canvasRect = null;
        
        this.setupCanvas();
        this.bindEvents();
        this.resizeCanvas();
        this.updateScoreDisplay();
    }
    
    setupCanvas() {
        // Get the actual canvas dimensions
        this.canvasRect = this.canvas.getBoundingClientRect();
        this.canvas.width = this.canvasRect.width;
        this.canvas.height = this.canvasRect.height;
        
        // Set drawing context properties
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 4; // Thicker line for mobile
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    }
    
    resizeCanvas() {
        // Update canvas rect after resize
        this.canvasRect = this.canvas.getBoundingClientRect();
        this.canvas.width = this.canvasRect.width;
        this.canvas.height = this.canvasRect.height;
    }
    
    bindEvents() {
        // Mouse events
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        this.canvas.addEventListener('mouseleave', this.stopDrawing.bind(this));
        
        // Touch events with better handling
        this.canvas.addEventListener('touchstart', this.handleTouch.bind(this), { passive: false });
        this.canvas.addEventListener('touchmove', this.handleTouch.bind(this), { passive: false });
        this.canvas.addEventListener('touchend', this.stopDrawing.bind(this));
        
        // Try again button
        this.resetBtn.addEventListener('click', this.resetGame.bind(this));
        
        // Window resize
        window.addEventListener('resize', this.resizeCanvas.bind(this));
    }
    
    getCanvasCoordinates(clientX, clientY) {
        // Get the current canvas rect (it might have changed)
        this.canvasRect = this.canvas.getBoundingClientRect();
        
        // Calculate the correct coordinates relative to the canvas
        const x = clientX - this.canvasRect.left;
        const y = clientY - this.canvasRect.top;
        
        return { x, y };
    }
    
    handleTouch(e) {
        e.preventDefault(); // Prevent scrolling while drawing
        
        const touch = e.touches[0] || e.changedTouches[0];
        const coords = this.getCanvasCoordinates(touch.clientX, touch.clientY);
        
        if (e.type === 'touchstart') {
            this.startDrawing(coords);
        } else if (e.type === 'touchmove') {
            this.draw(coords);
        }
    }
    
    startDrawing(e) {
        this.isDrawing = true;
        this.points = [];
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Get coordinates - handle both mouse and touch events
        let coords;
        if (e.clientX !== undefined) {
            coords = this.getCanvasCoordinates(e.clientX, e.clientY);
        } else {
            coords = e; // Already in canvas coordinates
        }
        
        // Add the first point and start the path
        this.addPoint(coords.x, coords.y);
        this.ctx.beginPath();
        this.ctx.moveTo(coords.x, coords.y);
        
        // Hide drawing hint
        this.drawingHint.classList.add('fade-out');
    }
    
    draw(e) {
        if (!this.isDrawing) return;
        
        // Get coordinates - handle both mouse and touch events
        let coords;
        if (e.clientX !== undefined) {
            coords = this.getCanvasCoordinates(e.clientX, e.clientY);
        } else {
            coords = e; // Already in canvas coordinates
        }
        
        // Add point and draw line to it
        this.addPoint(coords.x, coords.y);
        this.ctx.lineTo(coords.x, coords.y);
        this.ctx.stroke();
    }
    
    stopDrawing() {
        if (!this.isDrawing) return;
        this.isDrawing = false;
        
        if (this.points.length > 8) { // Lower threshold for mobile
            this.hasDrawn = true;
            this.calculateScore();
        } else {
            this.showDrawingHint();
        }
    }
    
    addPoint(x, y) {
        // Ensure coordinates are within canvas bounds
        const boundedX = Math.max(0, Math.min(x, this.canvas.width));
        const boundedY = Math.max(0, Math.min(y, this.canvas.height));
        this.points.push({ x: boundedX, y: boundedY });
    }
    
    calculateScore() {
        // Calculate center and radius
        const center = this.calculateCenter();
        this.centerX = center.x;
        this.centerY = center.y;
        
        // Calculate average radius
        const radii = this.points.map(point => {
            const dx = point.x - this.centerX;
            const dy = point.y - this.centerY;
            return Math.sqrt(dx * dx + dy * dy);
        });
        
        this.radius = radii.reduce((sum, r) => sum + r, 0) / radii.length;
        
        // Calculate circularity score
        const score = this.calculateCircularity(radii);
        
        this.showScore(score);
        this.showPerfectCircle();
    }
    
    calculateCenter() {
        const sumX = this.points.reduce((sum, point) => sum + point.x, 0);
        const sumY = this.points.reduce((sum, point) => sum + point.y, 0);
        return {
            x: sumX / this.points.length,
            y: sumY / this.points.length
        };
    }
    
    calculateCircularity(radii) {
        // Calculate variance from average radius
        const meanRadius = this.radius;
        const variance = radii.reduce((sum, radius) => {
            const diff = radius - meanRadius;
            return sum + diff * diff;
        }, 0) / radii.length;
        
        // Calculate standard deviation
        const stdDev = Math.sqrt(variance);
        
        // Calculate circularity score (0-100)
        const maxExpectedVariance = meanRadius * 0.3; // More lenient for mobile
        const circularityScore = Math.max(0, 100 - (stdDev / maxExpectedVariance) * 100);
        
        // Additional checks for shape completeness
        const perimeter = this.calculatePerimeter();
        const expectedPerimeter = 2 * Math.PI * meanRadius;
        const perimeterScore = Math.max(0, 100 - Math.abs(perimeter - expectedPerimeter) / expectedPerimeter * 100);
        
        // Check if shape is closed (start and end points are close)
        const startPoint = this.points[0];
        const endPoint = this.points[this.points.length - 1];
        const distance = Math.sqrt(
            Math.pow(endPoint.x - startPoint.x, 2) + 
            Math.pow(endPoint.y - startPoint.y, 2)
        );
        const closureScore = Math.max(0, 100 - (distance / meanRadius) * 100);
        
        // Combine scores with weights (adjusted for mobile)
        const finalScore = Math.round(
            circularityScore * 0.65 + 
            perimeterScore * 0.25 + 
            closureScore * 0.1
        );
        
        return Math.max(0, Math.min(100, finalScore));
    }
    
    calculatePerimeter() {
        let perimeter = 0;
        for (let i = 1; i < this.points.length; i++) {
            const dx = this.points[i].x - this.points[i-1].x;
            const dy = this.points[i].y - this.points[i-1].y;
            perimeter += Math.sqrt(dx * dx + dy * dy);
        }
        return perimeter;
    }
    
    showScore(score) {
        // Update score text with different messages based on score
        let title = '';
        let message = '';
        
        if (score >= 95) {
            title = `Perfect! ${score}%`;
            message = 'Incredible! You drew an almost perfect circle! 🎯';
        } else if (score >= 85) {
            title = `Excellent! ${score}%`;
            message = 'Great job! That\'s a very good circle! 👍';
        } else if (score >= 70) {
            title = `Good! ${score}%`;
            message = 'Not bad at all! Keep practicing to improve! 💪';
        } else if (score >= 50) {
            title = `${score}%`;
            message = 'You\'re getting there! Try to make it more circular. 🔄';
        } else {
            title = `${score}%`;
            message = 'Keep practicing! Focus on making a smooth, round shape. 📝';
        }
        
        this.scoreTitle.textContent = title;
        this.scoreMessage.textContent = message;
        this.scorePercentage.textContent = `${score}%`;
        
        // Animate score bar
        setTimeout(() => {
            this.scoreFill.style.width = score + '%';
        }, 100);
        
        // Add celebration effect for high scores
        if (score >= 90) {
            this.scoreContainer.classList.add('celebration');
            setTimeout(() => {
                this.scoreContainer.classList.remove('celebration');
            }, 600);
        }
        
        // Show drawing hint again after a delay
        setTimeout(() => {
            this.showDrawingHint();
        }, 3000); // Longer delay for mobile
    }
    
    showPerfectCircle() {
        // Draw the perfect circle guide
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(0, 150, 255, 0.6)';
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.restore();
    }
    
    showDrawingHint() {
        this.drawingHint.classList.remove('fade-out');
    }
    
    updateScoreDisplay() {
        if (!this.hasDrawn) {
            this.scoreTitle.textContent = 'Ready to draw!';
            this.scoreMessage.textContent = 'Tap the canvas to start drawing your circle';
            this.scorePercentage.textContent = '0%';
            this.scoreFill.style.width = '0%';
        }
    }
    
    resetGame() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.points = [];
        this.isDrawing = false;
        this.hasDrawn = false;
        this.showDrawingHint();
        this.updateScoreDisplay();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PerfectCircleGame();
}); 