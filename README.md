# InfiniBlend - Generative Shader Blender

A real-time generative art application that blends multiple shader algorithms through an intuitive GUI interface.

## Features

- **16 Generative Algorithms**:
  - FBM (Fractal Brownian Motion) noise layers
  - Voronoi diagrams with animated cells
  - Reaction-Diffusion (Gray-Scott model)
  - Cellular Automata (Conway's Game of Life variant)
  - Kaleidoscopic transformations
  - Julia set fractals with animated parameters
  - Curl-noise flow field with drifting dye
  - Distance-field metaballs (soft blobs merging)
  - Animated superformula shapes morphing over time
  - Truchet tile patterns with rotation randomness
  - Classic sine-based plasma with palette cycling
  - Moiré interference rings & grids
  - Phyllotactic spiral particles (golden-angle)
  - Diffusion-Limited Aggregation growth simulation
  - Distance-estimator Mandelbrot zoom
  - Lloyd-relaxed hex tiling morphing
- **Interactive Controls**:
  - Master blend weight for each algorithm (0-1)
  - Algorithm-specific parameters
  - Global adjustments (brightness, contrast, saturation)
  - Randomize button for instant variations
  - 6 built-in presets
  - Save parameters to JSON

## Running Locally

### Prerequisites

- Node.js (version 18 or higher)
- npm (comes with Node.js)

### Quick Start

1. **Clone the repository**:

   ```bash
   git clone https://github.com/GregP-Navdna/InfiniBlend.git
   cd InfiniBlend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm start
   ```

4. **Open in browser**:
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - The server will log the URL in the console

### Alternative: Simple HTTP Server

If you prefer not to use Node.js, you can still run with a simple HTTP server:

```bash
# Python 3
python -m http.server 8000

# Or using Node.js http-server
npx http-server -p 8000
```

## Railway Deployment

This project is configured for easy deployment on Railway.app:

1. **Prerequisites**:
   - A Railway account (sign up at [railway.app](https://railway.app))
   - Git installed on your machine

2. **Deploy to Railway**:

   ```bash
   # Install dependencies locally first
   npm install
   
   # Initialize git if not already done
   git init
   git add .
   git commit -m "Initial commit"
   
   # Deploy using Railway CLI
   npm install -g @railway/cli
   railway login
   railway link
   railway up
   ```

3. **Alternative: Deploy via GitHub**:
   - Push your code to a GitHub repository
   - Connect your GitHub account to Railway
   - Create a new project and select your repository
   - Railway will automatically detect the configuration and deploy

4. **Configuration**:
   - The project uses Node.js with Express to serve static files
   - Port is automatically configured via `process.env.PORT`
   - All necessary Railway configuration is included in `railway.json`

## Controls

- **Shader Blend Weights**: Control the mix ratio of each algorithm
- **Algorithm Parameters**: Fine-tune each effect
- **Global Settings**: Adjust overall appearance
- **Utils**:
  - Randomize: Generate random parameter combinations
  - Preset 1-6: Load predefined beautiful combinations
  - Save JSON: Export current parameters

## Presets

The application includes 6 carefully crafted presets:

1. **Dreamy Flow**: Soft FBM noise blended with flowing Voronoi cells
2. **Kaleidoscope Dreams**: Hypnotic kaleidoscopic patterns with subtle noise
3. **Fractal Reaction**: Julia set fractals mixed with reaction-diffusion patterns
4. **Flowing Metaballs**: Curl-noise flow fields with organic metaball shapes
5. **Geometric Patterns**: Superformula shapes combined with Truchet tiles and Moiré patterns
6. **Cosmic Fractals**: Plasma effects, phyllotactic spirals, and Mandelbrot zoom

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
