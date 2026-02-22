# Contributing to Algorithmic Art Lab

Thank you for your interest in contributing! 🎨

## How to Contribute

### Adding a New Algorithm

1. Add your algorithm entry to the `ALGORITHMS` array in `app.js`:
```javascript
{
  id: 'myalgo', 
  icon: '★', 
  label: 'My Algorithm', 
  desc: 'Brief description', 
  section: 'Generative'
}
```

2. Create your sketch function:
```javascript
function myAlgoSketch(p) {
  p.setup = function() {
    const container = document.getElementById('myalgo-canvas');
    p.createCanvas(container.clientWidth, container.clientHeight);
    buildMyAlgoControls();
  };
  
  p.draw = function() {
    const theme = getTheme();
    p.background(theme.background);
    // Your drawing code here
  };
}
```

3. Add it to `initAlgorithm()` function

4. Build controls using `buildThemeControls('myalgo-controls')` for theme support

### Color Theme Guidelines

- Use `getTheme()` to get current theme colors
- Access via `theme.primary`, `theme.secondary`, `theme.background`, `theme.hue`
- If using HSB color mode, convert hex with `hexToRgb()`
- Always call `buildThemeControls(controlsId)` to add theme selector

### Code Style

- Use ES6+ features
- Comment complex algorithms
- Keep functions focused and readable
- Use meaningful variable names

### Testing

Before submitting:
- Test all color themes
- Test export functionality
- Test on different screen sizes
- Check browser console for errors



