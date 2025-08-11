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
        this.shareBtn = document.getElementById('shareBtn');
        this.challengeBtn = document.getElementById('challengeBtn');
        
        this.isDrawing = false;
        this.points = [];
        this.centerX = 0;
        this.centerY = 0;
        this.radius = 0;
        this.hasDrawn = false;
        this.currentScore = 0;
        this.userProfile = null;
        this.loaded = false;
        this.sdk = null;
        
        // Initialize the game
        this.init();
    }
    
    async init() {
        // Initialize Farcaster Mini App SDK
        await this.initializeMiniApp();
        this.setupCanvas();
        this.bindEvents();
        this.updateScoreDisplay();
        
        // Test drawing to verify canvas works
        this.testCanvas();
    }
    
    async initializeMiniApp() {
        try {
            // Try to import the Farcaster SDK
            const sdkModule = await import('@farcaster/miniapp-sdk');
            this.sdk = sdkModule.sdk;
            console.log('Farcaster SDK loaded successfully');
        } catch (error) {
            console.log('Farcaster SDK not available, running in standalone mode');
            // Create a mock SDK for standalone mode
            this.sdk = {
                actions: {
                    ready: async () => console.log('Mock SDK ready')
                },
                getUser: async () => null,
                haptics: {
                    impact: () => {}
                },
                notifications: {
                    requestPermission: () => {},
                    send: () => {}
                },
                share: null
            };
        }
        
        try {
            // Set loaded state
            if (!this.loaded) {
                this.loaded = true;
            }
            
            // Call ready() when loaded
            if (this.loaded && this.sdk) {
                await this.sdk.actions.ready();
                console.log('Mini App SDK ready');
            }
            
            // Get user profile if available
            if (this.sdk && this.sdk.getUser) {
                try {
                    this.userProfile = await this.sdk.getUser();
                    console.log('User profile:', this.userProfile);
                } catch (error) {
                    console.log('User not authenticated or not in Mini App environment');
                }
            }
            
            // Set up haptic feedback
            this.setupHaptics();
            
            // Set up notifications
            this.setupNotifications();
        } catch (error) {
            console.log('Mini App SDK initialization failed:', error);
        }
    }
    
    testCanvas() {
        // Draw a test line to verify canvas is working
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(10, 10);
        this.ctx.lineTo(50, 50);
        this.ctx.stroke();
        
        // Reset to normal drawing style
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 4;
        
        console.log('Test line drawn on canvas');
    }
    
    setupHaptics() {
        if (this.sdk && this.sdk.haptics) {
            // Add haptic feedback for drawing
            this.canvas.addEventListener('touchstart', () => {
                this.sdk.haptics.impact('light');
            });
        }
    }
    
    setupNotifications() {
        if (this.sdk && this.sdk.notifications) {
            // Set up notification permissions
            this.sdk.notifications.requestPermission();
        }
    }
    
    setupCanvas() {
        // Get the container dimensions
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        // Set canvas size to match container
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        // Set drawing context properties
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 4;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        console.log('Canvas setup:', {
            width: this.canvas.width,
            height: this.canvas.height,
            containerRect: rect
        });
    }
    
    bindEvents() {
        // Remove any existing event listeners
        this.canvas.removeEventListener('mousedown', this.handleMouseDown);
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
        this.canvas.removeEventListener('mouseup', this.handleMouseUp);
        this.canvas.removeEventListener('touchstart', this.handleTouchStart);
        this.canvas.removeEventListener('touchmove', this.handleTouchMove);
        this.canvas.removeEventListener('touchend', this.handleTouchEnd);
        
        // Bind new event listeners
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('mouseleave', this.handleMouseUp.bind(this));
        
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
        
        // Mini App buttons
        this.resetBtn.addEventListener('click', this.resetGame.bind(this));
        this.shareBtn.addEventListener('click', this.shareScore.bind(this));
        this.challengeBtn.addEventListener('click', this.challengeFriends.bind(this));
        
        // Window resize
        window.addEventListener('resize', this.handleResize.bind(this));
        
        console.log('Events bound to canvas');
    }
    
    handleResize() {
        this.setupCanvas();
    }
    
    getCanvasCoordinates(clientX, clientY) {
        const rect = this.canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        return { x, y };
    }
    
    handleMouseDown(e) {
        e.preventDefault();
        const coords = this.getCanvasCoordinates(e.clientX, e.clientY);
        this.startDrawing(coords);
    }
    
    handleMouseMove(e) {
        e.preventDefault();
        if (this.isDrawing) {
            const coords = this.getCanvasCoordinates(e.clientX, e.clientY);
            this.draw(coords);
        }
    }
    
    handleMouseUp(e) {
        e.preventDefault();
        this.stopDrawing();
    }
    
    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const coords = this.getCanvasCoordinates(touch.clientX, touch.clientY);
        this.startDrawing(coords);
    }
    
    handleTouchMove(e) {
        e.preventDefault();
        if (this.isDrawing) {
            const touch = e.touches[0];
            const coords = this.getCanvasCoordinates(touch.clientX, touch.clientY);
            this.draw(coords);
        }
    }
    
    handleTouchEnd(e) {
        e.preventDefault();
        this.stopDrawing();
    }
    
    startDrawing(coords) {
        console.log('Starting to draw at:', coords);
        this.isDrawing = true;
        this.points = [];
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Add first point
        this.points.push(coords);
        
        // Start drawing path
        this.ctx.beginPath();
        this.ctx.moveTo(coords.x, coords.y);
        
        // Hide drawing hint
        this.drawingHint.classList.add('fade-out');
        
        // Haptic feedback
        if (this.sdk && this.sdk.haptics) {
            this.sdk.haptics.impact('light');
        }
    }
    
    draw(coords) {
        if (!this.isDrawing) return;
        
        console.log('Drawing to:', coords);
        
        // Add point
        this.points.push(coords);
        
        // Draw line to this point
        this.ctx.lineTo(coords.x, coords.y);
        this.ctx.stroke();
    }
    
    stopDrawing() {
        if (!this.isDrawing) return;
        
        console.log('Stopping drawing, points:', this.points.length);
        this.isDrawing = false;
        
        if (this.points.length > 8) {
            this.hasDrawn = true;
            this.calculateScore();
        } else {
            this.showDrawingHint();
        }
        
        // Haptic feedback
        if (this.sdk && this.sdk.haptics) {
            this.sdk.haptics.impact('medium');
        }
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
        this.currentScore = score;
        
        this.showScore(score);
        this.showPerfectCircle();
        
        // Send notification for high scores
        if (score >= 90 && this.sdk && this.sdk.notifications) {
            this.sendHighScoreNotification(score);
        }
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
        this.currentScore = 0;
        this.showDrawingHint();
        this.updateScoreDisplay();
        
        // Haptic feedback
        if (this.sdk && this.sdk.haptics) {
            this.sdk.haptics.impact('light');
        }
    }
    
    async shareScore() {
        const shareText = `🎯 I scored ${this.currentScore}% on Perfect Circle! Can you beat my score? Play now: https://perfect-circle-nine.vercel.app`;
        
        if (this.sdk && this.sdk.share) {
            try {
                await this.sdk.share({
                    title: 'Perfect Circle Score',
                    text: shareText,
                    url: 'https://perfect-circle-nine.vercel.app'
                });
            } catch (error) {
                console.log('Share failed:', error);
                this.fallbackShare(shareText);
            }
        } else {
            this.fallbackShare(shareText);
        }
        
        // Haptic feedback
        if (this.sdk && this.sdk.haptics) {
            this.sdk.haptics.impact('light');
        }
    }
    
    fallbackShare(text) {
        if (navigator.share) {
            navigator.share({
                title: 'Perfect Circle Score',
                text: text,
                url: 'https://perfect-circle-nine.vercel.app'
            });
        } else {
            // Copy to clipboard
            navigator.clipboard.writeText(text).then(() => {
                alert('Score copied to clipboard!');
            });
        }
    }
    
    async challengeFriends() {
        if (!this.hasDrawn) {
            alert('Draw a circle first to challenge your friends!');
            return;
        }
        
        const challengeText = `🎯 I scored ${this.currentScore}% on Perfect Circle! Think you can do better? Challenge me: https://perfect-circle-nine.vercel.app`;
        
        if (this.sdk && this.sdk.share) {
            try {
                await this.sdk.share({
                    title: 'Perfect Circle Challenge',
                    text: challengeText,
                    url: 'https://perfect-circle-nine.vercel.app'
                });
            } catch (error) {
                console.log('Challenge share failed:', error);
                this.fallbackShare(challengeText);
            }
        } else {
            this.fallbackShare(challengeText);
        }
        
        // Haptic feedback
        if (this.sdk && this.sdk.haptics) {
            this.sdk.haptics.impact('medium');
        }
    }
    
    async sendHighScoreNotification(score) {
        if (this.sdk && this.sdk.notifications) {
            try {
                await this.sdk.notifications.send({
                    title: '🎯 Amazing Score!',
                    body: `You scored ${score}% on Perfect Circle! Share your achievement with friends!`,
                    data: {
                        score: score,
                        url: 'https://perfect-circle-nine.vercel.app'
                    }
                });
            } catch (error) {
                console.log('Notification failed:', error);
            }
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PerfectCircleGame();
}); 