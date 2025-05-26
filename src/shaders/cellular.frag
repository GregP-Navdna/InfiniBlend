// Cellular Automata shader

vec3 cellularShader(vec2 st, float time) {
    vec2 p = st * u_cellularScale;
    
    // Grid coordinates
    vec2 cell = floor(p);
    vec2 uv = fract(p);
    
    // Time-based generation
    float generation = floor(time * u_cellularSpeed);
    
    // Calculate cell state based on neighbors (Conway's Game of Life style)
    float state = 0.0;
    float neighbors = 0.0;
    
    // Check all 8 neighbors
    for(int y = -1; y <= 1; y++) {
        for(int x = -1; x <= 1; x++) {
            if(x == 0 && y == 0) continue;
            
            vec2 neighborCell = cell + vec2(float(x), float(y));
            float neighborState = hash(neighborCell + generation * 1000.0);
            neighbors += step(u_cellularThreshold, neighborState);
        }
    }
    
    // Current cell state
    float currentState = hash(cell + generation * 1000.0);
    
    // Apply rules (modified Conway's rules)
    if(currentState > u_cellularThreshold) {
        // Cell is alive
        if(neighbors < 2.0 || neighbors > 3.0) {
            state = 0.0; // Dies
        } else {
            state = 1.0; // Survives
        }
    } else {
        // Cell is dead
        if(neighbors > 2.5 && neighbors < 3.5) {
            state = 1.0; // Born
        } else {
            state = 0.0; // Stays dead
        }
    }
    
    // Smooth cell rendering
    float cellDist = length(uv - 0.5) * 2.0;
    float cellShape = 1.0 - smoothstep(0.8 - u_cellularSmooth, 0.8 + u_cellularSmooth, cellDist);
    
    // Add some variation to living cells
    if(state > 0.5) {
        float variation = noise(cell * 0.1 + time * 0.5);
        state *= 0.7 + 0.3 * variation;
    }
    
    // Create trails effect
    float prevState = hash(cell + (generation - 1.0) * 1000.0);
    float trail = prevState * 0.3;
    
    // Color based on state and history
    vec3 deadColor = vec3(0.05, 0.05, 0.1);
    vec3 aliveColor = hsv2rgb(vec3(
        hash(cell) * 0.2 + 0.5,  // Hue varies by cell
        0.8,                      // High saturation
        0.9                       // Bright value
    ));
    vec3 trailColor = aliveColor * 0.3;
    
    vec3 color = deadColor;
    color = mix(color, trailColor, trail * cellShape);
    color = mix(color, aliveColor, state * cellShape);
    
    // Grid lines
    float grid = 1.0 - max(
        smoothstep(0.98, 1.0, uv.x),
        smoothstep(0.98, 1.0, uv.y)
    ) * 0.2;
    color *= grid;
    
    return color;
}
