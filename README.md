# 🌌 Cosmic Economy - Futuristic 3D Economy Website

A stunning, futuristic 3D animated economy website built with Three.js, GSAP, and modern web technologies. Experience interplanetary trading like never before with immersive cosmic visuals and smooth animations.

![Cosmic Economy](https://img.shields.io/badge/Status-Live-brightgreen) ![Three.js](https://img.shields.io/badge/Three.js-r158-blue) ![GSAP](https://img.shields.io/badge/GSAP-3.12.2-orange) ![Responsive](https://img.shields.io/badge/Design-Responsive-purple)

## ✨ Features

### 🎨 Visual & Design
- **Stunning 3D Background**: Real-time Three.js scene with animated planets, starfields, and nebula effects
- **Futuristic UI**: Clean, modern interface with glassmorphism effects and neon accents
- **Smooth Animations**: GSAP-powered scroll-triggered animations and micro-interactions
- **Responsive Design**: Optimized for all devices and screen sizes
- **Custom Loading Screen**: Animated cosmic loader with orbital planets

### 🚀 Interactive Elements
- **Smooth Scrolling**: Implemented with Lenis for butter-smooth navigation
- **Particle Effects**: Dynamic particle explosions on button interactions
- **Hover Animations**: Engaging micro-interactions throughout the site
- **Real-time Charts**: Canvas-based market data visualization
- **Form Interactions**: Enhanced form fields with floating labels and animations

### 🌟 Performance Optimized
- **GPU Acceleration**: Hardware-accelerated 3D rendering
- **Mobile Optimization**: Reduced complexity for mobile devices
- **Lazy Loading**: Intersection Observer for performance-critical animations
- **Efficient Rendering**: Optimized Three.js scene management

## 🛠️ Technologies Used

- **Three.js** - 3D graphics and WebGL rendering
- **GSAP** - High-performance animations
- **Lenis** - Smooth scrolling library
- **HTML5 Canvas** - Chart rendering
- **CSS3** - Modern styling with custom properties
- **Vanilla JavaScript** - No framework dependencies

## 📦 Installation

### Prerequisites
- Web browser with WebGL support
- Python 3.x (for local server) or Node.js

### Quick Start

1. **Clone or download the project files**
2. **Open terminal in the project directory**

3. **Option A: Using Python (Recommended)**
   ```bash
   # For Python 3
   python3 -m http.server 8000
   
   # For Python 2
   python -m SimpleHTTPServer 8000
   ```

4. **Option B: Using Node.js**
   ```bash
   npm install
   npm run serve
   ```

5. **Option C: Using Live Server (VS Code)**
   - Install Live Server extension
   - Right-click on `index.html` → "Open with Live Server"

6. **Open your browser and navigate to:**
   ```
   http://localhost:8000
   ```

## 🎯 Usage

### Navigation
- **Smooth Scroll**: Click navigation links for smooth section transitions
- **Mouse Parallax**: Move your mouse to see subtle 3D parallax effects
- **Interactive Elements**: Hover over planets, cards, and buttons for animations

### Sections Overview

#### 🏠 Hero Section
- Animated title with staggered text reveal
- Call-to-action buttons with particle effects
- Scroll indicator with bouncing animation

#### 📊 Markets Section
- Real-time market data cards
- Animated charts for different planets
- Hover effects and counter animations

#### 🪐 Planets Section
- 3D planet spheres with floating animations
- Interactive hover effects with rotation
- Detailed planet information cards

#### 💹 Trading Section
- Advanced trading dashboard interface
- Candlestick chart visualization
- Portfolio tracking and quick actions

#### 📬 Contact Section
- Enhanced form with floating labels
- Particle success animations
- Interactive info cards

## 🎨 Customization

### Colors
Modify CSS custom properties in `style.css`:
```css
:root {
    --primary-color: #00d4ff;      /* Main accent color */
    --secondary-color: #ff6b6b;    /* Secondary accent */
    --accent-color: #ffd700;       /* Highlight color */
    --bg-dark: #0a0a0f;           /* Dark background */
}
```

### 3D Scene
Customize planets and effects in `script.js`:
```javascript
const planetData = [
    { radius: 0.8, color: 0x00d4ff, position: [-15, 5, -10], speed: 0.01 },
    // Add more planets or modify existing ones
];
```

### Animations
Adjust animation timings and effects:
```javascript
gsap.from('.hero-title .title-line', {
    y: 100,
    opacity: 0,
    duration: 1,        // Modify duration
    stagger: 0.2,       // Adjust stagger timing
    ease: 'power3.out'  // Change easing
});
```

## 📱 Browser Support

- **Chrome**: ✅ Full support
- **Firefox**: ✅ Full support
- **Safari**: ✅ Full support
- **Edge**: ✅ Full support
- **Mobile Browsers**: ✅ Optimized experience

## ⚡ Performance Tips

1. **Hardware Acceleration**: Ensure GPU acceleration is enabled
2. **Close Background Tabs**: For optimal 3D performance
3. **Update Drivers**: Keep graphics drivers up to date
4. **Disable Extensions**: Some browser extensions may affect performance

## 🔧 Troubleshooting

### Common Issues

**Q: 3D scene not loading**
- Ensure WebGL is enabled in your browser
- Check browser console for errors
- Try refreshing the page

**Q: Animations not smooth**
- Close other browser tabs
- Ensure hardware acceleration is enabled
- Try a different browser

**Q: Mobile performance issues**
- The site automatically reduces complexity on mobile
- Ensure you're on a stable internet connection
- Close other apps for better performance

## 🚀 Deployment

### GitHub Pages
1. Push code to GitHub repository
2. Go to repository Settings
3. Enable GitHub Pages from main branch
4. Access via `https://username.github.io/repository-name`

### Netlify
1. Drag and drop project folder to Netlify
2. Or connect GitHub repository
3. Deploy automatically

### Vercel
```bash
npx vercel
```

## 🎓 Learning Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [GSAP Documentation](https://greensock.com/docs/)
- [WebGL Fundamentals](https://webglfundamentals.org/)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)

## 🤝 Contributing

Feel free to submit issues and enhancement requests! Contributions are welcome:

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🌟 Acknowledgments

- Three.js community for excellent documentation
- GSAP for powerful animation tools
- Inspiration from futuristic UI designs
- Space imagery and cosmic themes

## 🔗 Live Demo

Visit the live demo: [Cosmic Economy Website](#)

---

**Built with ❤️ and cosmic energy** 🚀

*Experience the future of interplanetary commerce today!*