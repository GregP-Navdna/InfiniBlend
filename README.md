# WebGL2 Generative Shader Blender

A real-time generative art application that blends multiple shader algorithms through an intuitive GUI interface.

## Features

- **6 Generative Algorithms**:
  - FBM (Fractal Brownian Motion) noise layers
  - Voronoi diagrams with animated cells
  - Reaction-Diffusion (Gray-Scott model)
  - Cellular Automata (Conway's Game of Life variant)
  - Kaleidoscopic transformations
  - Julia set fractals with animated parameters

- **Interactive Controls**:
  - Master blend weight for each algorithm (0-1)
  - Algorithm-specific parameters
  - Global adjustments (brightness, contrast, saturation)
  - Randomize button for instant variations
  - 3 built-in presets
  - Save parameters to JSON

## Setup

1. Clone or download this repository
2. Start a local web server:
   ```bash
   python -m http.server 8000
   ```
   or
   ```bash
   npx http-server -p 8000
   ```
3. Open http://localhost:8000 in your browser

## Controls

- **Shader Blend Weights**: Control the mix ratio of each algorithm
- **Algorithm Parameters**: Fine-tune each effect
- **Global Settings**: Adjust overall appearance
- **Utils**:
  - Randomize: Generate random parameter combinations
  - Preset 1-3: Load predefined beautiful combinations
  - Save JSON: Export current parameters

## Architecture

- **main.js**: Three.js setup, GUI management, animation loop
- **shaderComposer.js**: Loads and combines individual shaders
- **guiConfig.js**: GUI parameter definitions
- **shaders/**:
  - `common.glsl`: Shared utility functions
  - Individual `.frag` files for each algorithm

## Performance

- Optimized for 60 FPS on mid-range GPUs
- Single-pass rendering with weighted blending
- Shared noise functions to reduce computation

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari (desktop)

## Algorithm Credits

- Perlin/Simplex noise: Ken Perlin
- Voronoi diagrams: Georgy Voronoi
- Reaction-Diffusion: Alan Turing, Gray-Scott model
- Cellular Automata: John Conway
- Fractal algorithms: Benoit Mandelbrot, Gaston Julia

## License

MIT License - Feel free to use and modify for your projects!
