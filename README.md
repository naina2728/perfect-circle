# Perfect Circle Game

A web-based game where players draw circles and get scored on how close they are to a perfect circle. Inspired by [neal.fun/perfect-circle](https://neal.fun/perfect-circle).

## 🎯 Features

- **Interactive Drawing**: Draw circles using mouse or touch input
- **Real-time Scoring**: Get instant feedback on how circular your shape is
- **Visual Comparison**: See your drawn shape compared to a perfect circle
- **Responsive Design**: Works on desktop and mobile devices
- **Smooth Animations**: Beautiful UI transitions and score animations
- **Celebration Effects**: Special animations for high scores (90%+)

## 🎮 How to Play

1. **Start Drawing**: Click and drag (or touch and drag on mobile) to start drawing
2. **Draw a Circle**: Try to draw as close to a perfect circle as possible
3. **Release to Score**: Let go of the mouse/touch to see your score
4. **Try Again**: Click "Try Again" to start over

## 🏆 Scoring System

The game uses advanced geometric algorithms to calculate how circular your shape is:

- **Radius Consistency**: Measures how uniform the distance from center to edge is
- **Perimeter Analysis**: Compares your shape's perimeter to a perfect circle
- **Shape Completeness**: Evaluates how well the shape closes

Score ranges:
- **95%+**: Perfect! Amazing circle!
- **85-94%**: Great job!
- **70-84%**: Not bad!
- **50-69%**: Keep practicing!
- **<50%**: More practice needed!

## 🛠️ Technical Details

### Built With
- **HTML5 Canvas**: For drawing and graphics
- **Vanilla JavaScript**: No frameworks, pure JS
- **CSS3**: Modern styling with animations
- **Touch API**: Full mobile support

### Key Algorithms
- **Centroid Calculation**: Finds the center of the drawn shape
- **Radius Variance Analysis**: Measures consistency of distances from center
- **Perimeter Comparison**: Compares actual vs expected circle perimeter
- **Circularity Scoring**: Combines multiple metrics for final score

## 🚀 Getting Started

1. **Download Files**: Save all three files in the same directory:
   - `index.html`
   - `style.css`
   - `script.js`

2. **Open in Browser**: Double-click `index.html` or open it in your web browser

3. **Start Playing**: The game will load immediately and you can start drawing!

## 📱 Mobile Support

The game is fully optimized for mobile devices:
- Touch input support
- Responsive canvas sizing
- Mobile-friendly UI elements
- Optimized for various screen sizes

## 🎨 Customization

You can easily customize the game by modifying:

- **Colors**: Edit CSS variables for different themes
- **Scoring**: Adjust the scoring algorithm in `script.js`
- **UI**: Modify the HTML structure and CSS styling
- **Animations**: Add new CSS animations or modify existing ones

## 🔧 Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Inspired by Neal Agarwal's [Perfect Circle](https://neal.fun/perfect-circle)
- Built with modern web technologies
- Designed for accessibility and user experience

---

**Enjoy drawing perfect circles!** 🎯 # perfect-circle

## 🚀 Latest Update

**Deployed and ready for Farcaster Mini App integration!** 

- ✅ Account association configured
- ✅ Meta tags optimized for embedding
- ✅ Image URLs updated for local serving
- ✅ Vercel deployment active

**Try it now:** https://perfect-circle-nine.vercel.app
