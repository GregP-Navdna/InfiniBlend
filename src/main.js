import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { GUI } from 'https://cdn.jsdelivr.net/npm/lil-gui@0.19.1/dist/lil-gui.esm.js';
import { ShaderComposer } from './shaderComposer.js';
import { guiConfig } from './guiConfig.js';

class GenerativeShaderApp {
    constructor() {
        this.clock = new THREE.Clock();
        this.elapsedTime = 0;
        this.params = this.initParams();
        this.autoAnimateIncrements = {};
        this.init();
    }

    initParams() {
        const params = {
            // Shader enable toggles
            fbmEnabled: true,
            voronoiEnabled: true,
            reactionEnabled: false,
            cellularEnabled: false,
            kaleidoEnabled: true,
            fractalEnabled: false,
            curlFlowEnabled: false,
            metaballsEnabled: false,
            superformulaEnabled: false,
            truchetEnabled: false,
            plasmaEnabled: false,
            moireEnabled: false,
            phyllotaxisEnabled: false,
            dlaEnabled: false,
            mandelbrotEnabled: false,
            hexRelaxEnabled: false,
            
            // Master blend weights
            fbmWeight: 0.5,
            voronoiWeight: 0.3,
            reactionWeight: 0.0,
            cellularWeight: 0.0,
            kaleidoWeight: 0.2,
            fractalWeight: 0.0,
            curlFlowWeight: 0.0,
            metaballsWeight: 0.0,
            superformulaWeight: 0.0,
            truchetWeight: 0.0,
            plasmaWeight: 0.0,
            moireWeight: 0.0,
            phyllotaxisWeight: 0.0,
            dlaWeight: 0.0,
            mandelbrotWeight: 0.0,
            hexRelaxWeight: 0.0,
            
            // FBM parameters
            fbmScale: 2.0,
            fbmSpeed: 0.5,
            fbmOctaves: 4,
            fbmHueShift: 0.0,
            
            // Voronoi parameters
            voronoiScale: 5.0,
            voronoiSpeed: 0.3,
            voronoiSmooth: 0.02,
            voronoiColor: 0.5,
            
            // Reaction-diffusion parameters
            reactionFeed: 0.055,
            reactionKill: 0.062,
            reactionSpeed: 1.0,
            reactionScale: 1.0,
            
            // Cellular automata parameters
            cellularThreshold: 0.5,
            cellularSpeed: 5.0,
            cellularScale: 50.0,
            cellularSmooth: 0.1,
            
            // Kaleidoscope parameters
            kaleidoSegments: 6,
            kaleidoRotation: 0.1,
            kaleidoZoom: 1.0,
            kaleidoOffset: 0.0,
            
            // Fractal parameters
            fractalIterations: 100,
            fractalZoom: 1.0,
            fractalOffsetX: 0.0,
            fractalOffsetY: 0.0,
            fractalColor: 0.5,
            
            // Curl Flow parameters
            flowScale: 3.0,
            advectSpeed: 0.5,
            turbulence: 1.0,
            
            // Metaballs parameters
            ballCount: 5,
            metaRadius: 0.5,
            metaThreshold: 1.0,
            metaSpeed: 0.5,
            
            // Superformula parameters
            superM: 6,
            superN1: 1.0,
            superN2: 1.0,
            superN3: 1.0,
            shapeMix: 0.0,
            
            // Truchet parameters
            tileScale: 10.0,
            rotationSeed: 0.0,
            lineWidth: 0.05,
            
            // Plasma parameters
            plasmaFreq: 3.0,
            plasmaSpeed: 0.5,
            colorShift: 0.0,
            
            // Moire parameters
            lineDensity: 20.0,
            angleOffset: 0.1,
            waveSpeed: 0.3,
            
            // Phyllotaxis parameters
            pointCount: 200,
            spiralScale: 1.0,
            rotateSpeed: 0.1,
            
            // DLA parameters
            spawnRate: 1.0,
            stickProb: 0.8,
            growthSpeed: 0.5,
            
            // Mandelbrot parameters
            mandelbrotZoom: 0.5,
            mandelbrotCenterX: -0.7,
            mandelbrotCenterY: 0.0,
            maxIter: 100,
            colorCycle: 0.0,
            
            // Hex Relax parameters
            hexScale: 5.0,
            relaxSteps: 3,
            jitter: 0.1,
            blendSharpness: 1.0,
            
            // Global parameters
            timeScale: 1.0,
            brightness: 1.0,
            contrast: 1.0,
            saturation: 1.0,
            
            // Auto-animation
            autoAnimate: false,
            autoAnimateSpeed: 1.0
        };
        
        return params;
    }

    async init() {
        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: false });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        
        // Setup scene and camera
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        // Load and compose shaders
        this.shaderComposer = new ShaderComposer();
        await this.shaderComposer.loadShaders();
        
        // Create material with composed shader
        const composedShader = this.shaderComposer.getComposedShader();
        
        this.material = new THREE.ShaderMaterial({
            uniforms: this.createUniforms(),
            vertexShader: this.getVertexShader(),
            fragmentShader: composedShader
        });

        // Create full-screen quad
        const geometry = new THREE.PlaneGeometry(2, 2);
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.scene.add(this.mesh);

        // Setup GUI
        this.setupGUI();
        
        // Initialize auto-animation increments
        this.initializeAutoAnimateIncrements();

        // Handle resize
        window.addEventListener('resize', () => this.onWindowResize());

        // Start animation loop
        this.animate();
    }

    createUniforms() {
        const uniforms = {
            u_time: { value: 0.0 },
            u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
            
            // Shader enable toggles
            u_fbmEnabled: { value: this.params.fbmEnabled ? 1.0 : 0.0 },
            u_voronoiEnabled: { value: this.params.voronoiEnabled ? 1.0 : 0.0 },
            u_reactionEnabled: { value: this.params.reactionEnabled ? 1.0 : 0.0 },
            u_cellularEnabled: { value: this.params.cellularEnabled ? 1.0 : 0.0 },
            u_kaleidoEnabled: { value: this.params.kaleidoEnabled ? 1.0 : 0.0 },
            u_fractalEnabled: { value: this.params.fractalEnabled ? 1.0 : 0.0 },
            u_curlFlowEnabled: { value: this.params.curlFlowEnabled ? 1.0 : 0.0 },
            u_metaballsEnabled: { value: this.params.metaballsEnabled ? 1.0 : 0.0 },
            u_superformulaEnabled: { value: this.params.superformulaEnabled ? 1.0 : 0.0 },
            u_truchetEnabled: { value: this.params.truchetEnabled ? 1.0 : 0.0 },
            u_plasmaEnabled: { value: this.params.plasmaEnabled ? 1.0 : 0.0 },
            u_moireEnabled: { value: this.params.moireEnabled ? 1.0 : 0.0 },
            u_phyllotaxisEnabled: { value: this.params.phyllotaxisEnabled ? 1.0 : 0.0 },
            u_dlaEnabled: { value: this.params.dlaEnabled ? 1.0 : 0.0 },
            u_mandelbrotEnabled: { value: this.params.mandelbrotEnabled ? 1.0 : 0.0 },
            u_hexRelaxEnabled: { value: this.params.hexRelaxEnabled ? 1.0 : 0.0 },
            
            // Master blend weights
            u_fbmWeight: { value: this.params.fbmWeight },
            u_voronoiWeight: { value: this.params.voronoiWeight },
            u_reactionWeight: { value: this.params.reactionWeight },
            u_cellularWeight: { value: this.params.cellularWeight },
            u_kaleidoWeight: { value: this.params.kaleidoWeight },
            u_fractalWeight: { value: this.params.fractalWeight },
            u_curlFlowWeight: { value: this.params.curlFlowWeight },
            u_metaballsWeight: { value: this.params.metaballsWeight },
            u_superformulaWeight: { value: this.params.superformulaWeight },
            u_truchetWeight: { value: this.params.truchetWeight },
            u_plasmaWeight: { value: this.params.plasmaWeight },
            u_moireWeight: { value: this.params.moireWeight },
            u_phyllotaxisWeight: { value: this.params.phyllotaxisWeight },
            u_dlaWeight: { value: this.params.dlaWeight },
            u_mandelbrotWeight: { value: this.params.mandelbrotWeight },
            u_hexRelaxWeight: { value: this.params.hexRelaxWeight },
            
            // Algorithm-specific uniforms
            u_fbmScale: { value: this.params.fbmScale },
            u_fbmSpeed: { value: this.params.fbmSpeed },
            u_fbmOctaves: { value: this.params.fbmOctaves },
            u_fbmHueShift: { value: this.params.fbmHueShift },
            
            u_voronoiScale: { value: this.params.voronoiScale },
            u_voronoiSpeed: { value: this.params.voronoiSpeed },
            u_voronoiSmooth: { value: this.params.voronoiSmooth },
            u_voronoiColor: { value: this.params.voronoiColor },
            
            u_reactionFeed: { value: this.params.reactionFeed },
            u_reactionKill: { value: this.params.reactionKill },
            u_reactionSpeed: { value: this.params.reactionSpeed },
            u_reactionScale: { value: this.params.reactionScale },
            
            u_cellularThreshold: { value: this.params.cellularThreshold },
            u_cellularSpeed: { value: this.params.cellularSpeed },
            u_cellularScale: { value: this.params.cellularScale },
            u_cellularSmooth: { value: this.params.cellularSmooth },
            
            u_kaleidoSegments: { value: this.params.kaleidoSegments },
            u_kaleidoRotation: { value: this.params.kaleidoRotation },
            u_kaleidoZoom: { value: this.params.kaleidoZoom },
            u_kaleidoOffset: { value: this.params.kaleidoOffset },
            
            u_fractalIterations: { value: this.params.fractalIterations },
            u_fractalZoom: { value: this.params.fractalZoom },
            u_fractalOffset: { value: new THREE.Vector2(this.params.fractalOffsetX, this.params.fractalOffsetY) },
            u_fractalColor: { value: this.params.fractalColor },
            
            u_flowScale: { value: this.params.flowScale },
            u_advectSpeed: { value: this.params.advectSpeed },
            u_turbulence: { value: this.params.turbulence },
            
            u_ballCount: { value: this.params.ballCount },
            u_metaRadius: { value: this.params.metaRadius },
            u_metaThreshold: { value: this.params.metaThreshold },
            u_metaSpeed: { value: this.params.metaSpeed },
            
            u_superM: { value: this.params.superM },
            u_superN1: { value: this.params.superN1 },
            u_superN2: { value: this.params.superN2 },
            u_superN3: { value: this.params.superN3 },
            u_shapeMix: { value: this.params.shapeMix },
            
            u_tileScale: { value: this.params.tileScale },
            u_rotationSeed: { value: this.params.rotationSeed },
            u_lineWidth: { value: this.params.lineWidth },
            
            u_plasmaFreq: { value: this.params.plasmaFreq },
            u_plasmaSpeed: { value: this.params.plasmaSpeed },
            u_colorShift: { value: this.params.colorShift },
            
            u_lineDensity: { value: this.params.lineDensity },
            u_angleOffset: { value: this.params.angleOffset },
            u_waveSpeed: { value: this.params.waveSpeed },
            
            u_pointCount: { value: this.params.pointCount },
            u_spiralScale: { value: this.params.spiralScale },
            u_rotateSpeed: { value: this.params.rotateSpeed },
            
            u_spawnRate: { value: this.params.spawnRate },
            u_stickProb: { value: this.params.stickProb },
            u_growthSpeed: { value: this.params.growthSpeed },
            
            u_mandelbrotZoom: { value: this.params.mandelbrotZoom },
            u_mandelbrotCenter: { value: new THREE.Vector2(this.params.mandelbrotCenterX, this.params.mandelbrotCenterY) },
            u_maxIter: { value: this.params.maxIter },
            u_colorCycle: { value: this.params.colorCycle },
            
            u_hexScale: { value: this.params.hexScale },
            u_relaxSteps: { value: this.params.relaxSteps },
            u_jitter: { value: this.params.jitter },
            u_blendSharpness: { value: this.params.blendSharpness },
            
            u_timeScale: { value: this.params.timeScale },
            u_brightness: { value: this.params.brightness },
            u_contrast: { value: this.params.contrast },
            u_saturation: { value: this.params.saturation },
            
            u_autoAnimate: { value: this.params.autoAnimate ? 1.0 : 0.0 },
            u_autoAnimateSpeed: { value: this.params.autoAnimateSpeed }
        };
        
        return uniforms;
    }

    getVertexShader() {
        return `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1.0);
            }
        `;
    }

    setupGUI() {
        this.gui = new GUI();
        
        // Master blend weights
        const blendFolder = this.gui.addFolder('Shader Blend Weights');
        
        // Add toggles and weights for each shader
        blendFolder.add(this.params, 'fbmEnabled').name('FBM On/Off').onChange(v => this.material.uniforms.u_fbmEnabled.value = v ? 1.0 : 0.0);
        blendFolder.add(this.params, 'fbmWeight', 0, 1).name('FBM Weight').onChange(v => this.material.uniforms.u_fbmWeight.value = v);
        
        blendFolder.add(this.params, 'voronoiEnabled').name('Voronoi On/Off').onChange(v => this.material.uniforms.u_voronoiEnabled.value = v ? 1.0 : 0.0);
        blendFolder.add(this.params, 'voronoiWeight', 0, 1).name('Voronoi Weight').onChange(v => this.material.uniforms.u_voronoiWeight.value = v);
        
        blendFolder.add(this.params, 'reactionEnabled').name('Reaction On/Off').onChange(v => this.material.uniforms.u_reactionEnabled.value = v ? 1.0 : 0.0);
        blendFolder.add(this.params, 'reactionWeight', 0, 1).name('Reaction Weight').onChange(v => this.material.uniforms.u_reactionWeight.value = v);
        
        blendFolder.add(this.params, 'cellularEnabled').name('Cellular On/Off').onChange(v => this.material.uniforms.u_cellularEnabled.value = v ? 1.0 : 0.0);
        blendFolder.add(this.params, 'cellularWeight', 0, 1).name('Cellular Weight').onChange(v => this.material.uniforms.u_cellularWeight.value = v);
        
        blendFolder.add(this.params, 'kaleidoEnabled').name('Kaleido On/Off').onChange(v => this.material.uniforms.u_kaleidoEnabled.value = v ? 1.0 : 0.0);
        blendFolder.add(this.params, 'kaleidoWeight', 0, 1).name('Kaleido Weight').onChange(v => this.material.uniforms.u_kaleidoWeight.value = v);
        
        blendFolder.add(this.params, 'fractalEnabled').name('Fractal On/Off').onChange(v => this.material.uniforms.u_fractalEnabled.value = v ? 1.0 : 0.0);
        blendFolder.add(this.params, 'fractalWeight', 0, 1).name('Fractal Weight').onChange(v => this.material.uniforms.u_fractalWeight.value = v);
        
        blendFolder.add(this.params, 'curlFlowEnabled').name('Curl Flow On/Off').onChange(v => this.material.uniforms.u_curlFlowEnabled.value = v ? 1.0 : 0.0);
        blendFolder.add(this.params, 'curlFlowWeight', 0, 1).name('Curl Flow Weight').onChange(v => this.material.uniforms.u_curlFlowWeight.value = v);
        
        blendFolder.add(this.params, 'metaballsEnabled').name('Metaballs On/Off').onChange(v => this.material.uniforms.u_metaballsEnabled.value = v ? 1.0 : 0.0);
        blendFolder.add(this.params, 'metaballsWeight', 0, 1).name('Metaballs Weight').onChange(v => this.material.uniforms.u_metaballsWeight.value = v);
        
        blendFolder.add(this.params, 'superformulaEnabled').name('Superformula On/Off').onChange(v => this.material.uniforms.u_superformulaEnabled.value = v ? 1.0 : 0.0);
        blendFolder.add(this.params, 'superformulaWeight', 0, 1).name('Superformula Weight').onChange(v => this.material.uniforms.u_superformulaWeight.value = v);
        
        blendFolder.add(this.params, 'truchetEnabled').name('Truchet On/Off').onChange(v => this.material.uniforms.u_truchetEnabled.value = v ? 1.0 : 0.0);
        blendFolder.add(this.params, 'truchetWeight', 0, 1).name('Truchet Weight').onChange(v => this.material.uniforms.u_truchetWeight.value = v);
        
        blendFolder.add(this.params, 'plasmaEnabled').name('Plasma On/Off').onChange(v => this.material.uniforms.u_plasmaEnabled.value = v ? 1.0 : 0.0);
        blendFolder.add(this.params, 'plasmaWeight', 0, 1).name('Plasma Weight').onChange(v => this.material.uniforms.u_plasmaWeight.value = v);
        
        blendFolder.add(this.params, 'moireEnabled').name('Moire On/Off').onChange(v => this.material.uniforms.u_moireEnabled.value = v ? 1.0 : 0.0);
        blendFolder.add(this.params, 'moireWeight', 0, 1).name('Moire Weight').onChange(v => this.material.uniforms.u_moireWeight.value = v);
        
        blendFolder.add(this.params, 'phyllotaxisEnabled').name('Phyllotaxis On/Off').onChange(v => this.material.uniforms.u_phyllotaxisEnabled.value = v ? 1.0 : 0.0);
        blendFolder.add(this.params, 'phyllotaxisWeight', 0, 1).name('Phyllotaxis Weight').onChange(v => this.material.uniforms.u_phyllotaxisWeight.value = v);
        
        blendFolder.add(this.params, 'dlaEnabled').name('DLA On/Off').onChange(v => this.material.uniforms.u_dlaEnabled.value = v ? 1.0 : 0.0);
        blendFolder.add(this.params, 'dlaWeight', 0, 1).name('DLA Weight').onChange(v => this.material.uniforms.u_dlaWeight.value = v);
        
        blendFolder.add(this.params, 'mandelbrotEnabled').name('Mandelbrot On/Off').onChange(v => this.material.uniforms.u_mandelbrotEnabled.value = v ? 1.0 : 0.0);
        blendFolder.add(this.params, 'mandelbrotWeight', 0, 1).name('Mandelbrot Weight').onChange(v => this.material.uniforms.u_mandelbrotWeight.value = v);
        
        blendFolder.add(this.params, 'hexRelaxEnabled').name('Hex Relax On/Off').onChange(v => this.material.uniforms.u_hexRelaxEnabled.value = v ? 1.0 : 0.0);
        blendFolder.add(this.params, 'hexRelaxWeight', 0, 1).name('Hex Relax Weight').onChange(v => this.material.uniforms.u_hexRelaxWeight.value = v);
        
        blendFolder.open();
        
        // Algorithm-specific parameters
        guiConfig.setupGUI(this.gui, this.params, this.material.uniforms);
        
        // Global parameters
        const globalFolder = this.gui.addFolder('Global');
        globalFolder.add(this.params, 'timeScale', 0, 5).onChange(v => this.material.uniforms.u_timeScale.value = v);
        globalFolder.add(this.params, 'brightness', 0, 2).onChange(v => this.material.uniforms.u_brightness.value = v);
        globalFolder.add(this.params, 'contrast', 0, 2).onChange(v => this.material.uniforms.u_contrast.value = v);
        globalFolder.add(this.params, 'saturation', 0, 2).onChange(v => this.material.uniforms.u_saturation.value = v);
        globalFolder.add(this.params, 'autoAnimate').name('Auto-Animation On/Off').onChange(v => {
            this.material.uniforms.u_autoAnimate.value = v ? 1.0 : 0.0;
            if (v) {
                // Regenerate random increments when turning on
                this.initializeAutoAnimateIncrements();
            }
        });
        globalFolder.add(this.params, 'autoAnimateSpeed', 0, 5).name('Auto-Animation Speed').onChange(v => this.material.uniforms.u_autoAnimateSpeed.value = v);
        
        // Utility buttons
        const utilsFolder = this.gui.addFolder('Utils');
        utilsFolder.add({ randomize: () => this.randomize() }, 'randomize').name('Randomize');
        utilsFolder.add({ preset1: () => this.loadPreset(0) }, 'preset1').name('Preset 1');
        utilsFolder.add({ preset2: () => this.loadPreset(1) }, 'preset2').name('Preset 2');
        utilsFolder.add({ preset3: () => this.loadPreset(2) }, 'preset3').name('Preset 3');
        utilsFolder.add({ preset4: () => this.loadPreset(3) }, 'preset4').name('Preset 4');
        utilsFolder.add({ preset5: () => this.loadPreset(4) }, 'preset5').name('Preset 5');
        utilsFolder.add({ preset6: () => this.loadPreset(5) }, 'preset6').name('Preset 6');
        utilsFolder.add({ save: () => this.saveParams() }, 'save').name('Save JSON');
        
        // Add GitHub link with icon
        const githubButton = utilsFolder.add({ github: () => {
            window.open('https://github.com/GregP-Navdna/InfiniBlend', '_blank');
        }}, 'github').name('');
        
        // Customize the GitHub button to show an icon
        setTimeout(() => {
            const controller = utilsFolder.controllers.find(c => c.property === 'github');
            if (controller && controller.domElement) {
                const nameElement = controller.domElement.querySelector('.name');
                if (nameElement) {
                    nameElement.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 18px; height: 18px; fill: #c3c3c3;">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <span style="margin-left: 8px; font-size: 11px; opacity: 0.8;">GitHub</span>
                    `;
                    controller.domElement.classList.add('github-button');
                }
            }
        }, 100);
        
        utilsFolder.open();
    }

    initializeAutoAnimateIncrements() {
        // Generate random increments for all parameters
        const paramKeys = Object.keys(this.params);
        const excludedParams = ['autoAnimate', 'autoAnimateSpeed', 'brightness', 'contrast', 'saturation'];
        
        paramKeys.forEach(key => {
            if (!excludedParams.includes(key)) {
                // Random increment between -0.01 and 0.01, scaled by parameter range
                const baseIncrement = (Math.random() - 0.5) * 0.02;
                
                // Scale increment based on typical parameter range
                let scale = 1.0;
                if (key.includes('Weight')) scale = 0.5; // Slower for weights
                if (key.includes('Scale') || key.includes('Zoom')) scale = 0.1; // Much slower for scale params
                if (key.includes('Speed')) scale = 0.5;
                if (key.includes('Freq')) scale = 0.2;
                if (key.includes('Center')) scale = 0.05; // Very slow for position params
                if (key.includes('Offset')) scale = 0.1;
                
                this.autoAnimateIncrements[key] = baseIncrement * scale;
            }
        });
    }

    randomize() {
        // Regenerate auto-animation increments
        if (this.params.autoAnimate) {
            this.initializeAutoAnimateIncrements();
        }
        
        // Randomize boolean toggles
        const booleanParams = [
            'fbmEnabled', 'voronoiEnabled', 'reactionEnabled', 
            'cellularEnabled', 'kaleidoEnabled', 'fractalEnabled',
            'curlFlowEnabled', 'metaballsEnabled', 'superformulaEnabled',
            'truchetEnabled', 'plasmaEnabled', 'moireEnabled',
            'phyllotaxisEnabled', 'dlaEnabled', 'mandelbrotEnabled',
            'hexRelaxEnabled'
        ];
        
        booleanParams.forEach(key => {
            const value = Math.random() > 0.5;
            this.params[key] = value;
            const controller = this.gui.controllersRecursive().find(c => c.property === key);
            if (controller) {
                controller.setValue(value);
            }
        });
        
        // Randomize numeric parameters
        Object.keys(this.params).forEach(key => {
            // Skip boolean parameters as they're already handled
            if (booleanParams.includes(key)) return;
            
            const controller = this.gui.controllersRecursive().find(c => c.property === key);
            if (controller && controller._min !== undefined && controller._max !== undefined) {
                const min = controller._min;
                const max = controller._max;
                const value = min + Math.random() * (max - min);
                this.params[key] = value;
                controller.setValue(value);
            }
        });
    }

    loadPreset(index) {
        const presets = [
            // Preset 1: Dreamy Flow (Original)
            {
                fbmEnabled: true, voronoiEnabled: true, reactionEnabled: false, 
                cellularEnabled: false, kaleidoEnabled: false, fractalEnabled: false,
                curlFlowEnabled: false, metaballsEnabled: false, superformulaEnabled: false,
                truchetEnabled: false, plasmaEnabled: false, moireEnabled: false,
                phyllotaxisEnabled: false, dlaEnabled: false, mandelbrotEnabled: false,
                hexRelaxEnabled: false,
                fbmWeight: 0.7, voronoiWeight: 0.3, reactionWeight: 0, cellularWeight: 0,
                kaleidoWeight: 0, fractalWeight: 0, curlFlowWeight: 0, metaballsWeight: 0,
                superformulaWeight: 0, truchetWeight: 0, plasmaWeight: 0, moireWeight: 0,
                phyllotaxisWeight: 0, dlaWeight: 0, mandelbrotWeight: 0, hexRelaxWeight: 0,
                fbmScale: 1.5, fbmSpeed: 0.3, fbmOctaves: 5, fbmHueShift: 0.2,
                voronoiScale: 3, voronoiSpeed: 0.1,
                timeScale: 0.8, brightness: 1.1, contrast: 1.2, saturation: 0.9
            },
            // Preset 2: Kaleidoscope Dreams (Original)
            {
                fbmEnabled: true, voronoiEnabled: false, reactionEnabled: false, 
                cellularEnabled: false, kaleidoEnabled: true, fractalEnabled: false,
                curlFlowEnabled: false, metaballsEnabled: false, superformulaEnabled: false,
                truchetEnabled: false, plasmaEnabled: false, moireEnabled: false,
                phyllotaxisEnabled: false, dlaEnabled: false, mandelbrotEnabled: false,
                hexRelaxEnabled: false,
                fbmWeight: 0.2, voronoiWeight: 0, reactionWeight: 0, cellularWeight: 0,
                kaleidoWeight: 0.8, fractalWeight: 0, curlFlowWeight: 0, metaballsWeight: 0,
                superformulaWeight: 0, truchetWeight: 0, plasmaWeight: 0, moireWeight: 0,
                phyllotaxisWeight: 0, dlaWeight: 0, mandelbrotWeight: 0, hexRelaxWeight: 0,
                kaleidoSegments: 8, kaleidoRotation: 0.2, kaleidoZoom: 1.5,
                fbmScale: 0.5, timeScale: 1.2, brightness: 1.2,
                contrast: 1.3, saturation: 1.1
            },
            // Preset 3: Fractal Reaction (Original)
            {
                fbmEnabled: false, voronoiEnabled: false, reactionEnabled: true, 
                cellularEnabled: false, kaleidoEnabled: false, fractalEnabled: true,
                curlFlowEnabled: false, metaballsEnabled: false, superformulaEnabled: false,
                truchetEnabled: false, plasmaEnabled: false, moireEnabled: false,
                phyllotaxisEnabled: false, dlaEnabled: false, mandelbrotEnabled: false,
                hexRelaxEnabled: false,
                fbmWeight: 0, voronoiWeight: 0, reactionWeight: 0.6, cellularWeight: 0,
                kaleidoWeight: 0, fractalWeight: 0.4, curlFlowWeight: 0, metaballsWeight: 0,
                superformulaWeight: 0, truchetWeight: 0, plasmaWeight: 0, moireWeight: 0,
                phyllotaxisWeight: 0, dlaWeight: 0, mandelbrotWeight: 0, hexRelaxWeight: 0,
                reactionFeed: 0.055, reactionKill: 0.062,
                fractalIterations: 80, fractalZoom: 0.8, timeScale: 0.5, brightness: 1.0,
                contrast: 1.5, saturation: 0.8
            },
            // Preset 4: Flowing Metaballs
            {
                fbmEnabled: false, voronoiEnabled: false, reactionEnabled: false, 
                cellularEnabled: false, kaleidoEnabled: false, fractalEnabled: false,
                curlFlowEnabled: true, metaballsEnabled: true, superformulaEnabled: false,
                truchetEnabled: false, plasmaEnabled: false, moireEnabled: false,
                phyllotaxisEnabled: false, dlaEnabled: false, mandelbrotEnabled: false,
                hexRelaxEnabled: false,
                fbmWeight: 0, voronoiWeight: 0, reactionWeight: 0, cellularWeight: 0,
                kaleidoWeight: 0, fractalWeight: 0, curlFlowWeight: 0.6, metaballsWeight: 0.4,
                superformulaWeight: 0, truchetWeight: 0, plasmaWeight: 0, moireWeight: 0,
                phyllotaxisWeight: 0, dlaWeight: 0, mandelbrotWeight: 0, hexRelaxWeight: 0,
                flowScale: 3.0, advectSpeed: 0.8, turbulence: 1.5,
                ballCount: 5, metaRadius: 0.8, metaThreshold: 1.0, metaSpeed: 0.5,
                timeScale: 1.0, brightness: 1.2, contrast: 1.1, saturation: 1.3
            },
            // Preset 5: Geometric Patterns
            {
                fbmEnabled: false, voronoiEnabled: false, reactionEnabled: false, 
                cellularEnabled: false, kaleidoEnabled: false, fractalEnabled: false,
                curlFlowEnabled: false, metaballsEnabled: false, superformulaEnabled: true,
                truchetEnabled: true, plasmaEnabled: false, moireEnabled: true,
                phyllotaxisEnabled: false, dlaEnabled: false, mandelbrotEnabled: false,
                hexRelaxEnabled: false,
                fbmWeight: 0, voronoiWeight: 0, reactionWeight: 0, cellularWeight: 0,
                kaleidoWeight: 0, fractalWeight: 0, curlFlowWeight: 0, metaballsWeight: 0,
                superformulaWeight: 0.3, truchetWeight: 0.4, plasmaWeight: 0, moireWeight: 0.3,
                phyllotaxisWeight: 0, dlaWeight: 0, mandelbrotWeight: 0, hexRelaxWeight: 0,
                superM: 6, superN1: 1.0, superN2: 1.0, superN3: 1.0, shapeMix: 0.5,
                tileScale: 10, rotationSeed: 2.5, lineWidth: 0.05,
                lineDensity: 20, angleOffset: 0.785, waveSpeed: 0.3,
                timeScale: 0.7, brightness: 1.1, contrast: 1.3, saturation: 0.8
            },
            // Preset 6: Cosmic Fractals
            {
                fbmEnabled: false, voronoiEnabled: false, reactionEnabled: false, 
                cellularEnabled: false, kaleidoEnabled: false, fractalEnabled: false,
                curlFlowEnabled: false, metaballsEnabled: false, superformulaEnabled: false,
                truchetEnabled: false, plasmaEnabled: true, moireEnabled: false,
                phyllotaxisEnabled: true, dlaEnabled: false, mandelbrotEnabled: true,
                hexRelaxEnabled: false,
                fbmWeight: 0, voronoiWeight: 0, reactionWeight: 0, cellularWeight: 0,
                kaleidoWeight: 0, fractalWeight: 0, curlFlowWeight: 0, metaballsWeight: 0,
                superformulaWeight: 0, truchetWeight: 0, plasmaWeight: 0.3, moireWeight: 0,
                phyllotaxisWeight: 0.3, dlaWeight: 0, mandelbrotWeight: 0.4, hexRelaxWeight: 0,
                plasmaFreq: 3.0, plasmaSpeed: 0.5, colorShift: 0.6,
                pointCount: 200, spiralScale: 0.8, rotateSpeed: 0.1,
                mandelbrotZoom: 1.5, mandelbrotCenterX: -0.5, mandelbrotCenterY: 0,
                maxIter: 100, colorCycle: 0.3,
                timeScale: 0.6, brightness: 1.2, contrast: 1.4, saturation: 1.2
            }
        ];
        
        // Use modulo to cycle through presets if index is greater than original 3
        const preset = presets[index % presets.length];
        if (preset) {
            Object.keys(preset).forEach(key => {
                if (this.params.hasOwnProperty(key)) {
                    this.params[key] = preset[key];
                    const controller = this.gui.controllersRecursive().find(c => c.property === key);
                    if (controller) controller.setValue(preset[key]);
                }
            });
        }
    }

    saveParams() {
        const dataStr = JSON.stringify(this.params, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'shader-params-' + Date.now() + '.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    onWindowResize() {
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.material.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Get delta time once
        const deltaTime = this.clock.getDelta();
        
        // Update elapsed time
        this.elapsedTime += deltaTime * this.params.timeScale;
        
        // Update time uniform
        this.material.uniforms.u_time.value = this.elapsedTime;
        
        // Update fractal offset
        this.material.uniforms.u_fractalOffset.value.set(
            this.params.fractalOffsetX,
            this.params.fractalOffsetY
        );
        
        // Auto-animate parameters
        if (this.params.autoAnimate) {
            const excludedParams = ['autoAnimate', 'autoAnimateSpeed', 'brightness', 'contrast', 'saturation'];
            
            Object.keys(this.params).forEach(key => {
                if (!excludedParams.includes(key) && this.autoAnimateIncrements[key] !== undefined) {
                    const increment = this.autoAnimateIncrements[key] * deltaTime * 60; // Frame-independent
                    let value = this.params[key] + increment * this.params.autoAnimateSpeed;
                    
                    // Find the controller to get min/max bounds
                    const controller = this.gui.controllersRecursive().find(c => c.property === key);
                    if (controller && controller._min !== undefined && controller._max !== undefined) {
                        // Bounce off boundaries
                        if (value > controller._max || value < controller._min) {
                            this.autoAnimateIncrements[key] *= -1; // Reverse direction
                            value = Math.max(controller._min, Math.min(controller._max, value));
                        }
                    } else if (typeof this.params[key] === 'boolean') {
                        // Skip boolean parameters
                        return;
                    }
                    
                    this.params[key] = value;
                    
                    // Update GUI
                    if (controller) {
                        controller.setValue(value);
                    }
                    
                    // Update uniform
                    const uniformKey = `u_${key}`;
                    if (this.material.uniforms[uniformKey]) {
                        this.material.uniforms[uniformKey].value = value;
                    }
                }
            });
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Start application
window.addEventListener('DOMContentLoaded', () => {
    new GenerativeShaderApp();
});
