# Darren Sim CV Website

A modern, interactive personal website showcasing skills through an animated point cloud visualization.

## Features

- **Interactive Point Cloud**: Animated visualization of skills with connecting lines
- **Modern Design**: Dark blue gradient background with blue-white glowing elements
- **Responsive Layout**: Mobile-friendly design that adapts to different screen sizes
- **Interactive Elements**: Hover effects, mouse interactions, and clickable skill points
- **Projects Section**: Ready-to-use section for showcasing recent work

## Technical Details

- **Frontend**: Pure HTML, CSS, and JavaScript (no frameworks)
- **Canvas Animation**: Smooth 60fps animations using HTML5 Canvas
- **Responsive Design**: CSS Grid and Flexbox for modern layout
- **Interactive Physics**: Points move with velocity and bounce off boundaries
- **Mouse Interaction**: Points respond to mouse movement and clicks

## File Structure

```
darrensim.co.uk/
├── index.html          # Main HTML structure
├── styles.css          # Styling and responsive design
├── script.js           # Interactive point cloud logic
└── README.md           # Project documentation
```

## Setup

1. Clone or download the project files
2. Open `index.html` in a modern web browser
3. The site will load automatically with the animated point cloud

## Customization

### Skills
Edit the `skills` array in `script.js` to modify the skills displayed in the point cloud.

### Colors
Modify the CSS variables in `styles.css` to change the color scheme:
- Primary: `#b8d4ff` (blue-white)
- Background: `#0a0a1a` to `#1a1a3a` (dark blue gradient)

### Projects
Replace the placeholder content in the projects section of `index.html` with your actual project information.

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Performance

The point cloud animation is optimized for smooth 60fps performance on modern devices. The number of connections is limited to prevent performance issues on slower devices.

## License

Personal project for Darren Sim's portfolio website. 