// Distance-estimator Mandelbrot zoom

// Mandelbrot distance estimator
vec2 mandelbrotDE(vec2 c, out float distance) {
    vec2 z = vec2(0.0);
    vec2 dz = vec2(0.0);
    float m2 = 0.0;
    
    for (float i = 0.0; i < 256.0; i++) {
        if (i >= u_maxIter) break;
        
        // Derivative
        dz = 2.0 * vec2(z.x * dz.x - z.y * dz.y, z.x * dz.y + z.y * dz.x) + vec2(1.0, 0.0);
        
        // Z iteration
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
        m2 = dot(z, z);
        
        if (m2 > 256.0) {
            // Distance estimation
            distance = 0.5 * log(m2) * sqrt(m2) / length(dz);
            return z;
        }
    }
    
    distance = 0.0;
    return z;
}

vec3 mandelbrotShader(vec2 st, float time) {
    // Animated zoom
    float zoom = u_mandelbrotZoom * exp(sin(time * 0.1) * 0.5);
    
    // Transform coordinates
    vec2 c = (st - vec2(0.5)) / zoom + u_mandelbrotCenter;
    
    // Calculate Mandelbrot
    float distance;
    vec2 z = mandelbrotDE(c, distance);
    
    // Smooth coloring
    float m = length(z);
    float n = log2(log2(m));
    float iter = n - floor(n);
    
    // Create color based on distance and iteration
    float hue = distance * 10.0 + u_colorCycle + time * 0.02;
    float sat = 1.0 - exp(-distance * 20.0);
    float val = 1.0 - exp(-distance * 5.0);
    
    vec3 color = hsv2rgb(vec3(hue, sat * 0.8, val * 0.9));
    
    // Add detail enhancement
    float edge = 1.0 - smoothstep(0.0, 0.001 / zoom, distance);
    color += vec3(edge) * 0.3;
    
    // Inside the set
    if (distance == 0.0) {
        color = vec3(0.0);
    }
    
    return color;
}
