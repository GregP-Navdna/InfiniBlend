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
            'fractal.frag',
            'curlFlow.frag',
            'metaballs.frag', 
            'superformula.frag',
            'truchet.frag',
            'plasma.frag',
            'moire.frag',
            'phyllotaxis.frag',
            'dla.frag',
            'mandelbrot.frag',
            'hexRelax.frag'
        ];
        
        await Promise.all(shaderFiles.map(async (file) => {
            const name = file.split('.')[0];
            this.shaders[name] = await this.loadShaderFile(`/src/shaders/${file}`);
        }));
        
        console.log('Loaded shaders:', Object.keys(this.shaders));
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
        // Check if shaders are loaded
        if (Object.keys(this.shaders).length === 0) {
            console.error('No shaders loaded!');
            return `
                void main() {
                    gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0); // Magenta error color
                }
            `;
        }
        
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
            uniform float u_curlFlowEnabled;
            uniform float u_metaballsEnabled;
            uniform float u_superformulaEnabled;
            uniform float u_truchetEnabled;
            uniform float u_plasmaEnabled;
            uniform float u_moireEnabled;
            uniform float u_phyllotaxisEnabled;
            uniform float u_dlaEnabled;
            uniform float u_mandelbrotEnabled;
            uniform float u_hexRelaxEnabled;
            
            // Master blend weights
            uniform float u_fbmWeight;
            uniform float u_voronoiWeight;
            uniform float u_reactionWeight;
            uniform float u_cellularWeight;
            uniform float u_kaleidoWeight;
            uniform float u_fractalWeight;
            uniform float u_curlFlowWeight;
            uniform float u_metaballsWeight;
            uniform float u_superformulaWeight;
            uniform float u_truchetWeight;
            uniform float u_plasmaWeight;
            uniform float u_moireWeight;
            uniform float u_phyllotaxisWeight;
            uniform float u_dlaWeight;
            uniform float u_mandelbrotWeight;
            uniform float u_hexRelaxWeight;
            
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
            
            // Curl Flow parameters
            uniform float u_flowScale;
            uniform float u_advectSpeed;
            uniform float u_turbulence;
            
            // Metaballs parameters
            uniform float u_ballCount;
            uniform float u_metaRadius;
            uniform float u_metaThreshold;
            uniform float u_metaSpeed;
            
            // Superformula parameters
            uniform float u_superM;
            uniform float u_superN1;
            uniform float u_superN2;
            uniform float u_superN3;
            uniform float u_shapeMix;
            
            // Truchet parameters
            uniform float u_tileScale;
            uniform float u_rotationSeed;
            uniform float u_lineWidth;
            
            // Plasma parameters
            uniform float u_plasmaFreq;
            uniform float u_plasmaSpeed;
            uniform float u_colorShift;
            
            // Moire parameters
            uniform float u_lineDensity;
            uniform float u_angleOffset;
            uniform float u_waveSpeed;
            
            // Phyllotaxis parameters
            uniform float u_pointCount;
            uniform float u_spiralScale;
            uniform float u_rotateSpeed;
            
            // DLA parameters
            uniform float u_spawnRate;
            uniform float u_stickProb;
            uniform float u_growthSpeed;
            
            // Mandelbrot parameters
            uniform float u_mandelbrotZoom;
            uniform vec2 u_mandelbrotCenter;
            uniform float u_maxIter;
            uniform float u_colorCycle;
            
            // Hex Relax parameters
            uniform float u_hexScale;
            uniform float u_relaxSteps;
            uniform float u_jitter;
            uniform float u_blendSharpness;
            
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
            ${this.shaders.curlFlow || ''}
            ${this.shaders.metaballs || ''}
            ${this.shaders.superformula || ''}
            ${this.shaders.truchet || ''}
            ${this.shaders.plasma || ''}
            ${this.shaders.moire || ''}
            ${this.shaders.phyllotaxis || ''}
            ${this.shaders.dla || ''}
            ${this.shaders.mandelbrot || ''}
            ${this.shaders.hexRelax || ''}
            
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
                vec3 curlFlowColor = u_curlFlowEnabled > 0.5 ? curlFlowShader(st, time) : vec3(0.0);
                vec3 metaballsColor = u_metaballsEnabled > 0.5 ? metaballsShader(st, time) : vec3(0.0);
                vec3 superformulaColor = u_superformulaEnabled > 0.5 ? superformulaShader(st, time) : vec3(0.0);
                vec3 truchetColor = u_truchetEnabled > 0.5 ? truchetShader(st, time) : vec3(0.0);
                vec3 plasmaColor = u_plasmaEnabled > 0.5 ? plasmaShader(st, time) : vec3(0.0);
                vec3 moireColor = u_moireEnabled > 0.5 ? moireShader(st, time) : vec3(0.0);
                vec3 phyllotaxisColor = u_phyllotaxisEnabled > 0.5 ? phyllotaxisShader(st, time) : vec3(0.0);
                vec3 dlaColor = u_dlaEnabled > 0.5 ? dlaShader(st, time) : vec3(0.0);
                vec3 mandelbrotColor = u_mandelbrotEnabled > 0.5 ? mandelbrotShader(st, time) : vec3(0.0);
                vec3 hexRelaxColor = u_hexRelaxEnabled > 0.5 ? hexRelaxShader(st, time) : vec3(0.0);
                
                // DEBUG: Add a test pattern to see if shader is running
                vec3 debugColor = vec3(st.x * 0.5 + 0.5, st.y * 0.5 + 0.5, sin(time) * 0.5 + 0.5);
                
                // Calculate effective weights (weight * enabled)
                float fbmEffectiveWeight = u_fbmWeight * u_fbmEnabled;
                float voronoiEffectiveWeight = u_voronoiWeight * u_voronoiEnabled;
                float reactionEffectiveWeight = u_reactionWeight * u_reactionEnabled;
                float cellularEffectiveWeight = u_cellularWeight * u_cellularEnabled;
                float kaleidoEffectiveWeight = u_kaleidoWeight * u_kaleidoEnabled;
                float fractalEffectiveWeight = u_fractalWeight * u_fractalEnabled;
                float curlFlowEffectiveWeight = u_curlFlowWeight * u_curlFlowEnabled;
                float metaballsEffectiveWeight = u_metaballsWeight * u_metaballsEnabled;
                float superformulaEffectiveWeight = u_superformulaWeight * u_superformulaEnabled;
                float truchetEffectiveWeight = u_truchetWeight * u_truchetEnabled;
                float plasmaEffectiveWeight = u_plasmaWeight * u_plasmaEnabled;
                float moireEffectiveWeight = u_moireWeight * u_moireEnabled;
                float phyllotaxisEffectiveWeight = u_phyllotaxisWeight * u_phyllotaxisEnabled;
                float dlaEffectiveWeight = u_dlaWeight * u_dlaEnabled;
                float mandelbrotEffectiveWeight = u_mandelbrotWeight * u_mandelbrotEnabled;
                float hexRelaxEffectiveWeight = u_hexRelaxWeight * u_hexRelaxEnabled;
                
                // Blend all shaders with effective weights
                float totalWeight = fbmEffectiveWeight + voronoiEffectiveWeight + reactionEffectiveWeight + 
                                  cellularEffectiveWeight + kaleidoEffectiveWeight + fractalEffectiveWeight + 
                                  curlFlowEffectiveWeight + metaballsEffectiveWeight + superformulaEffectiveWeight +
                                  truchetEffectiveWeight + plasmaEffectiveWeight + moireEffectiveWeight + 
                                  phyllotaxisEffectiveWeight + dlaEffectiveWeight + mandelbrotEffectiveWeight +
                                  hexRelaxEffectiveWeight + 0.001;
                
                vec3 color = (
                    fbmEffectiveWeight * fbmColor +
                    voronoiEffectiveWeight * voronoiColor +
                    reactionEffectiveWeight * reactionColor +
                    cellularEffectiveWeight * cellularColor +
                    kaleidoEffectiveWeight * kaleidoColor +
                    fractalEffectiveWeight * fractalColor +
                    curlFlowEffectiveWeight * curlFlowColor +
                    metaballsEffectiveWeight * metaballsColor +
                    superformulaEffectiveWeight * superformulaColor +
                    truchetEffectiveWeight * truchetColor +
                    plasmaEffectiveWeight * plasmaColor +
                    moireEffectiveWeight * moireColor +
                    phyllotaxisEffectiveWeight * phyllotaxisColor +
                    dlaEffectiveWeight * dlaColor +
                    mandelbrotEffectiveWeight * mandelbrotColor +
                    hexRelaxEffectiveWeight * hexRelaxColor
                ) / totalWeight;
                
                // DEBUG: If no shaders are active, show debug pattern
                if (totalWeight < 0.01) {
                    color = debugColor;
                }
                
                // Apply global adjustments
                color = adjustBrightness(color, u_brightness);
                color = adjustContrast(color, u_contrast);
                color = adjustSaturation(color, u_saturation);
                
                // Clamp and output
                color = clamp(color, 0.0, 1.0);
                gl_FragColor = vec4(color, 1.0);
                
                // DEBUG: Override with solid red to test if mesh is rendering
                // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
            }
        `;
    }
}
