export class ShaderComposer {
    constructor() {
        this.shaders = {};
        this.commonCode = '';
    }

    async loadShaders() {
        // Load common utilities first
        this.commonCode = await this.loadShaderFile('/src/shaders/common.glsl');
        
        // Load individual shader algorithms
        const shaderFiles = [
            'fbm.frag',
            'voronoi.frag',
            'reactionDiff.frag',
            'cellular.frag',
            'kaleido.frag',
            'fractal.frag'
        ];
        
        await Promise.all(shaderFiles.map(async (file) => {
            const name = file.split('.')[0];
            this.shaders[name] = await this.loadShaderFile(`/src/shaders/${file}`);
        }));
    }

    async loadShaderFile(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`Failed to load ${path}`);
            return await response.text();
        } catch (error) {
            console.error(`Error loading shader ${path}:`, error);
            return '';
        }
    }

    getComposedShader() {
        return `
            precision highp float;
            
            // Uniforms
            uniform float u_time;
            uniform vec2 u_resolution;
            uniform vec2 u_mouse;
            
            // Shader enable toggles
            uniform float u_fbmEnabled;
            uniform float u_voronoiEnabled;
            uniform float u_reactionEnabled;
            uniform float u_cellularEnabled;
            uniform float u_kaleidoEnabled;
            uniform float u_fractalEnabled;
            
            // Master blend weights
            uniform float u_fbmWeight;
            uniform float u_voronoiWeight;
            uniform float u_reactionWeight;
            uniform float u_cellularWeight;
            uniform float u_kaleidoWeight;
            uniform float u_fractalWeight;
            
            // Algorithm-specific uniforms
            uniform float u_fbmScale;
            uniform float u_fbmSpeed;
            uniform float u_fbmOctaves;
            uniform float u_fbmHueShift;
            
            uniform float u_voronoiScale;
            uniform float u_voronoiSpeed;
            uniform float u_voronoiSmooth;
            uniform float u_voronoiColor;
            
            uniform float u_reactionFeed;
            uniform float u_reactionKill;
            uniform float u_reactionSpeed;
            uniform float u_reactionScale;
            
            uniform float u_cellularThreshold;
            uniform float u_cellularSpeed;
            uniform float u_cellularScale;
            uniform float u_cellularSmooth;
            
            uniform float u_kaleidoSegments;
            uniform float u_kaleidoRotation;
            uniform float u_kaleidoZoom;
            uniform float u_kaleidoOffset;
            
            uniform float u_fractalIterations;
            uniform float u_fractalZoom;
            uniform vec2 u_fractalOffset;
            uniform float u_fractalColor;
            
            // Global parameters
            uniform float u_timeScale;
            uniform float u_brightness;
            uniform float u_contrast;
            uniform float u_saturation;
            
            // Varying
            varying vec2 vUv;
            
            // Common utilities
            ${this.commonCode}
            
            // Individual shader algorithms
            ${this.shaders.fbm || ''}
            ${this.shaders.voronoi || ''}
            ${this.shaders.reactionDiff || ''}
            ${this.shaders.cellular || ''}
            ${this.shaders.kaleido || ''}
            ${this.shaders.fractal || ''}
            
            // Color adjustment functions
            vec3 adjustBrightness(vec3 color, float brightness) {
                return color * brightness;
            }
            
            vec3 adjustContrast(vec3 color, float contrast) {
                return (color - 0.5) * contrast + 0.5;
            }
            
            vec3 adjustSaturation(vec3 color, float saturation) {
                float gray = dot(color, vec3(0.299, 0.587, 0.114));
                return mix(vec3(gray), color, saturation);
            }
            
            void main() {
                vec2 uv = vUv;
                vec2 st = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
                float time = u_time * u_timeScale;
                
                // Calculate individual shader contributions only if enabled
                vec3 fbmColor = u_fbmEnabled > 0.5 ? fbmShader(st, time) : vec3(0.0);
                vec3 voronoiColor = u_voronoiEnabled > 0.5 ? voronoiShader(st, time) : vec3(0.0);
                vec3 reactionColor = u_reactionEnabled > 0.5 ? reactionDiffShader(st, time) : vec3(0.0);
                vec3 cellularColor = u_cellularEnabled > 0.5 ? cellularShader(st, time) : vec3(0.0);
                vec3 kaleidoColor = u_kaleidoEnabled > 0.5 ? kaleidoShader(st, time) : vec3(0.0);
                vec3 fractalColor = u_fractalEnabled > 0.5 ? fractalShader(st, time) : vec3(0.0);
                
                // Calculate effective weights (weight * enabled)
                float fbmEffectiveWeight = u_fbmWeight * u_fbmEnabled;
                float voronoiEffectiveWeight = u_voronoiWeight * u_voronoiEnabled;
                float reactionEffectiveWeight = u_reactionWeight * u_reactionEnabled;
                float cellularEffectiveWeight = u_cellularWeight * u_cellularEnabled;
                float kaleidoEffectiveWeight = u_kaleidoWeight * u_kaleidoEnabled;
                float fractalEffectiveWeight = u_fractalWeight * u_fractalEnabled;
                
                // Blend all shaders with effective weights
                float totalWeight = fbmEffectiveWeight + voronoiEffectiveWeight + reactionEffectiveWeight + 
                                  cellularEffectiveWeight + kaleidoEffectiveWeight + fractalEffectiveWeight + 0.001;
                
                vec3 color = (
                    fbmEffectiveWeight * fbmColor +
                    voronoiEffectiveWeight * voronoiColor +
                    reactionEffectiveWeight * reactionColor +
                    cellularEffectiveWeight * cellularColor +
                    kaleidoEffectiveWeight * kaleidoColor +
                    fractalEffectiveWeight * fractalColor
                ) / totalWeight;
                
                // Apply global adjustments
                color = adjustBrightness(color, u_brightness);
                color = adjustContrast(color, u_contrast);
                color = adjustSaturation(color, u_saturation);
                
                // Clamp and output
                color = clamp(color, 0.0, 1.0);
                gl_FragColor = vec4(color, 1.0);
            }
        `;
    }
}
