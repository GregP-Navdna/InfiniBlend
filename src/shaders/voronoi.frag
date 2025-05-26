// Voronoi diagram shader

vec3 voronoiShader(vec2 st, float time) {
    vec2 p = st * u_voronoiScale;
    
    // Animate cells
    float animTime = time * u_voronoiSpeed;
    
    // Initialize minimum distance
    float minDist = 10.0;
    float secondMinDist = 10.0;
    vec2 minPoint;
    
    // Check neighboring cells
    for(int y = -1; y <= 1; y++) {
        for(int x = -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 cellId = floor(p) + neighbor;
            
            // Random point in cell
            vec2 randPoint = hash2(cellId);
            
            // Animate the point
            randPoint = 0.5 + 0.5 * sin(animTime + 6.2831 * randPoint);
            
            vec2 pointPos = cellId + randPoint;
            float dist = length(pointPos - p);
            
            // Keep track of closest and second closest
            if(dist < minDist) {
                secondMinDist = minDist;
                minDist = dist;
                minPoint = pointPos;
            } else if(dist < secondMinDist) {
                secondMinDist = dist;
            }
        }
    }
    
    // Calculate features
    float cellDist = minDist;
    float edgeDist = secondMinDist - minDist;
    
    // Smooth edge detection
    float edge = 1.0 - smoothstep(0.0, u_voronoiSmooth, edgeDist);
    
    // Create color
    vec3 cellColor = hash3(vec3(floor(minPoint), 0.0));
    float hue = cellColor.x + u_voronoiColor;
    
    vec3 color = hsv2rgb(vec3(hue, 0.7, 0.8));
    
    // Mix with edge color
    vec3 edgeColor = vec3(1.0);
    color = mix(color, edgeColor, edge * 0.5);
    
    // Add some variation based on distance
    color *= 0.5 + 0.5 * smoothstep(0.0, 1.0, cellDist);
    
    return color;
}
