export const guiConfig = {
    setupGUI: (gui, params, uniforms) => {
        // FBM parameters
        const fbmFolder = gui.addFolder('FBM Noise');
        fbmFolder.add(params, 'fbmScale', 0.1, 10).onChange(v => uniforms.u_fbmScale.value = v);
        fbmFolder.add(params, 'fbmSpeed', 0, 2).onChange(v => uniforms.u_fbmSpeed.value = v);
        fbmFolder.add(params, 'fbmOctaves', 1, 8, 1).onChange(v => uniforms.u_fbmOctaves.value = v);
        fbmFolder.add(params, 'fbmHueShift', 0, 1).onChange(v => uniforms.u_fbmHueShift.value = v);
        
        // Voronoi parameters
        const voronoiFolder = gui.addFolder('Voronoi');
        voronoiFolder.add(params, 'voronoiScale', 1, 20).onChange(v => uniforms.u_voronoiScale.value = v);
        voronoiFolder.add(params, 'voronoiSpeed', 0, 2).onChange(v => uniforms.u_voronoiSpeed.value = v);
        voronoiFolder.add(params, 'voronoiSmooth', 0.001, 0.1).onChange(v => uniforms.u_voronoiSmooth.value = v);
        voronoiFolder.add(params, 'voronoiColor', 0, 1).onChange(v => uniforms.u_voronoiColor.value = v);
        
        // Reaction-diffusion parameters
        const reactionFolder = gui.addFolder('Reaction-Diffusion');
        reactionFolder.add(params, 'reactionFeed', 0.01, 0.1).onChange(v => uniforms.u_reactionFeed.value = v);
        reactionFolder.add(params, 'reactionKill', 0.04, 0.08).onChange(v => uniforms.u_reactionKill.value = v);
        reactionFolder.add(params, 'reactionSpeed', 0, 5).onChange(v => uniforms.u_reactionSpeed.value = v);
        reactionFolder.add(params, 'reactionScale', 0.1, 5).onChange(v => uniforms.u_reactionScale.value = v);
        
        // Cellular automata parameters
        const cellularFolder = gui.addFolder('Cellular Automata');
        cellularFolder.add(params, 'cellularThreshold', 0, 1).onChange(v => uniforms.u_cellularThreshold.value = v);
        cellularFolder.add(params, 'cellularSpeed', 0, 20).onChange(v => uniforms.u_cellularSpeed.value = v);
        cellularFolder.add(params, 'cellularScale', 10, 200).onChange(v => uniforms.u_cellularScale.value = v);
        cellularFolder.add(params, 'cellularSmooth', 0, 1).onChange(v => uniforms.u_cellularSmooth.value = v);
        
        // Kaleidoscope parameters
        const kaleidoFolder = gui.addFolder('Kaleidoscope');
        kaleidoFolder.add(params, 'kaleidoSegments', 2, 16, 1).onChange(v => uniforms.u_kaleidoSegments.value = v);
        kaleidoFolder.add(params, 'kaleidoRotation', -1, 1).onChange(v => uniforms.u_kaleidoRotation.value = v);
        kaleidoFolder.add(params, 'kaleidoZoom', 0.1, 5).onChange(v => uniforms.u_kaleidoZoom.value = v);
        kaleidoFolder.add(params, 'kaleidoOffset', -5, 5).onChange(v => uniforms.u_kaleidoOffset.value = v);
        
        // Fractal parameters
        const fractalFolder = gui.addFolder('Fractal');
        fractalFolder.add(params, 'fractalIterations', 10, 200, 1).onChange(v => uniforms.u_fractalIterations.value = v);
        fractalFolder.add(params, 'fractalZoom', 0.1, 5).onChange(v => uniforms.u_fractalZoom.value = v);
        fractalFolder.add(params, 'fractalOffsetX', -2, 2).onChange(v => uniforms.u_fractalOffset.value.x = v);
        fractalFolder.add(params, 'fractalOffsetY', -2, 2).onChange(v => uniforms.u_fractalOffset.value.y = v);
        fractalFolder.add(params, 'fractalColor', 0, 1).onChange(v => uniforms.u_fractalColor.value = v);
        
        // Curl Flow parameters
        const curlFlowFolder = gui.addFolder('Curl Flow');
        curlFlowFolder.add(params, 'flowScale', 0.5, 10).onChange(v => uniforms.u_flowScale.value = v);
        curlFlowFolder.add(params, 'advectSpeed', 0, 2).onChange(v => uniforms.u_advectSpeed.value = v);
        curlFlowFolder.add(params, 'turbulence', 0, 3).onChange(v => uniforms.u_turbulence.value = v);
        
        // Metaballs parameters
        const metaballsFolder = gui.addFolder('Metaballs');
        metaballsFolder.add(params, 'ballCount', 1, 8, 1).onChange(v => uniforms.u_ballCount.value = v);
        metaballsFolder.add(params, 'metaRadius', 0.1, 1.5).onChange(v => uniforms.u_metaRadius.value = v);
        metaballsFolder.add(params, 'metaThreshold', 0.5, 2).onChange(v => uniforms.u_metaThreshold.value = v);
        metaballsFolder.add(params, 'metaSpeed', 0, 2).onChange(v => uniforms.u_metaSpeed.value = v);
        
        // Superformula parameters
        const superformulaFolder = gui.addFolder('Superformula');
        superformulaFolder.add(params, 'superM', 1, 20).onChange(v => uniforms.u_superM.value = v);
        superformulaFolder.add(params, 'superN1', 0.1, 5).onChange(v => uniforms.u_superN1.value = v);
        superformulaFolder.add(params, 'superN2', 0.1, 5).onChange(v => uniforms.u_superN2.value = v);
        superformulaFolder.add(params, 'superN3', 0.1, 5).onChange(v => uniforms.u_superN3.value = v);
        superformulaFolder.add(params, 'shapeMix', 0, 1).onChange(v => uniforms.u_shapeMix.value = v);
        
        // Truchet parameters
        const truchetFolder = gui.addFolder('Truchet');
        truchetFolder.add(params, 'tileScale', 2, 30).onChange(v => uniforms.u_tileScale.value = v);
        truchetFolder.add(params, 'rotationSeed', -10, 10).onChange(v => uniforms.u_rotationSeed.value = v);
        truchetFolder.add(params, 'lineWidth', 0.01, 0.2).onChange(v => uniforms.u_lineWidth.value = v);
        
        // Plasma parameters
        const plasmaFolder = gui.addFolder('Plasma');
        plasmaFolder.add(params, 'plasmaFreq', 1, 10).onChange(v => uniforms.u_plasmaFreq.value = v);
        plasmaFolder.add(params, 'plasmaSpeed', 0, 2).onChange(v => uniforms.u_plasmaSpeed.value = v);
        plasmaFolder.add(params, 'colorShift', 0, 1).onChange(v => uniforms.u_colorShift.value = v);
        
        // Moire parameters
        const moireFolder = gui.addFolder('Moire');
        moireFolder.add(params, 'lineDensity', 5, 50).onChange(v => uniforms.u_lineDensity.value = v);
        moireFolder.add(params, 'angleOffset', 0, 3.14).onChange(v => uniforms.u_angleOffset.value = v);
        moireFolder.add(params, 'waveSpeed', 0, 1).onChange(v => uniforms.u_waveSpeed.value = v);
        
        // Phyllotaxis parameters
        const phyllotaxisFolder = gui.addFolder('Phyllotaxis');
        phyllotaxisFolder.add(params, 'pointCount', 50, 500, 1).onChange(v => uniforms.u_pointCount.value = v);
        phyllotaxisFolder.add(params, 'spiralScale', 0.1, 3).onChange(v => uniforms.u_spiralScale.value = v);
        phyllotaxisFolder.add(params, 'rotateSpeed', -0.5, 0.5).onChange(v => uniforms.u_rotateSpeed.value = v);
        
        // DLA parameters
        const dlaFolder = gui.addFolder('DLA');
        dlaFolder.add(params, 'spawnRate', 0, 3).onChange(v => uniforms.u_spawnRate.value = v);
        dlaFolder.add(params, 'stickProb', 0, 1).onChange(v => uniforms.u_stickProb.value = v);
        dlaFolder.add(params, 'growthSpeed', 0, 2).onChange(v => uniforms.u_growthSpeed.value = v);
        
        // Mandelbrot parameters
        const mandelbrotFolder = gui.addFolder('Mandelbrot');
        mandelbrotFolder.add(params, 'mandelbrotZoom', 0.1, 3).onChange(v => uniforms.u_mandelbrotZoom.value = v);
        mandelbrotFolder.add(params, 'mandelbrotCenterX', -2, 2).onChange(v => uniforms.u_mandelbrotCenter.value.x = v);
        mandelbrotFolder.add(params, 'mandelbrotCenterY', -2, 2).onChange(v => uniforms.u_mandelbrotCenter.value.y = v);
        mandelbrotFolder.add(params, 'maxIter', 10, 256, 1).onChange(v => uniforms.u_maxIter.value = v);
        mandelbrotFolder.add(params, 'colorCycle', 0, 1).onChange(v => uniforms.u_colorCycle.value = v);
        
        // Hex Relax parameters
        const hexRelaxFolder = gui.addFolder('Hex Relax');
        hexRelaxFolder.add(params, 'hexScale', 1, 15).onChange(v => uniforms.u_hexScale.value = v);
        hexRelaxFolder.add(params, 'relaxSteps', 0, 5, 1).onChange(v => uniforms.u_relaxSteps.value = v);
        hexRelaxFolder.add(params, 'jitter', 0, 0.5).onChange(v => uniforms.u_jitter.value = v);
        hexRelaxFolder.add(params, 'blendSharpness', 0.1, 3).onChange(v => uniforms.u_blendSharpness.value = v);
        
        // Aurora parameters
        const auroraFolder = gui.addFolder('Aurora');
        auroraFolder.add(params, 'auroraScale', 0.5, 5).onChange(v => uniforms.u_auroraScale.value = v);
        auroraFolder.add(params, 'auroraSpeed', 0, 2).onChange(v => uniforms.u_auroraSpeed.value = v);
        auroraFolder.add(params, 'auroraCurtain', 0.5, 5).onChange(v => uniforms.u_auroraCurtain.value = v);
        auroraFolder.add(params, 'auroraHue', 0, 1).onChange(v => uniforms.u_auroraHue.value = v);
        
        // Spirograph parameters
        const spirographFolder = gui.addFolder('Spirograph');
        spirographFolder.add(params, 'spiroR1', 1, 8).onChange(v => uniforms.u_spiroR1.value = v);
        spirographFolder.add(params, 'spiroR2', 0.5, 5).onChange(v => uniforms.u_spiroR2.value = v);
        spirographFolder.add(params, 'spiroD', 0.5, 5).onChange(v => uniforms.u_spiroD.value = v);
        spirographFolder.add(params, 'spiroSpeed', 0, 2).onChange(v => uniforms.u_spiroSpeed.value = v);
        
        // Nebula parameters
        const nebulaFolder = gui.addFolder('Nebula');
        nebulaFolder.add(params, 'nebulaScale', 0.5, 5).onChange(v => uniforms.u_nebulaScale.value = v);
        nebulaFolder.add(params, 'nebulaDensity', 0.5, 3).onChange(v => uniforms.u_nebulaDensity.value = v);
        nebulaFolder.add(params, 'nebulaSpeed', 0, 1).onChange(v => uniforms.u_nebulaSpeed.value = v);
        nebulaFolder.add(params, 'nebulaColor', 0, 1).onChange(v => uniforms.u_nebulaColor.value = v);
        
        // Lissajous parameters
        const lissajousFolder = gui.addFolder('Lissajous');
        lissajousFolder.add(params, 'lissajousA', 1, 7).onChange(v => uniforms.u_lissajousA.value = v);
        lissajousFolder.add(params, 'lissajousB', 1, 7).onChange(v => uniforms.u_lissajousB.value = v);
        lissajousFolder.add(params, 'lissajousDelta', 0, 6.28).onChange(v => uniforms.u_lissajousDelta.value = v);
        lissajousFolder.add(params, 'lissajousSpeed', 0, 2).onChange(v => uniforms.u_lissajousSpeed.value = v);
        
        // Warp parameters
        const warpFolder = gui.addFolder('Warp');
        warpFolder.add(params, 'warpSpeed', 0, 2).onChange(v => uniforms.u_warpSpeed.value = v);
        warpFolder.add(params, 'warpTwist', 0, 5).onChange(v => uniforms.u_warpTwist.value = v);
        warpFolder.add(params, 'warpZoom', 0.1, 3).onChange(v => uniforms.u_warpZoom.value = v);
        warpFolder.add(params, 'warpRings', 1, 15).onChange(v => uniforms.u_warpRings.value = v);
        
        // Caustics parameters
        const causticsFolder = gui.addFolder('Caustics');
        causticsFolder.add(params, 'causticScale', 1, 8).onChange(v => uniforms.u_causticScale.value = v);
        causticsFolder.add(params, 'causticSpeed', 0, 2).onChange(v => uniforms.u_causticSpeed.value = v);
        causticsFolder.add(params, 'causticIntensity', 0.5, 3).onChange(v => uniforms.u_causticIntensity.value = v);
        
        // Galaxy parameters
        const galaxyFolder = gui.addFolder('Galaxy');
        galaxyFolder.add(params, 'galaxyArms', 1, 4, 1).onChange(v => uniforms.u_galaxyArms.value = v);
        galaxyFolder.add(params, 'galaxyTwist', 0.5, 8).onChange(v => uniforms.u_galaxyTwist.value = v);
        galaxyFolder.add(params, 'galaxySpin', 0, 1).onChange(v => uniforms.u_galaxySpin.value = v);
        galaxyFolder.add(params, 'galaxyStars', 1, 3, 1).onChange(v => uniforms.u_galaxyStars.value = v);
        
        // Electric Field parameters
        const electricFieldFolder = gui.addFolder('Electric Field');
        electricFieldFolder.add(params, 'fieldCharges', 2, 8, 1).onChange(v => uniforms.u_fieldCharges.value = v);
        electricFieldFolder.add(params, 'fieldStrength', 0.05, 1).onChange(v => uniforms.u_fieldStrength.value = v);
        electricFieldFolder.add(params, 'fieldSpeed', 0, 2).onChange(v => uniforms.u_fieldSpeed.value = v);
        
        // Stained Glass parameters
        const stainedGlassFolder = gui.addFolder('Stained Glass');
        stainedGlassFolder.add(params, 'glassScale', 1, 10).onChange(v => uniforms.u_glassScale.value = v);
        stainedGlassFolder.add(params, 'glassBevel', 0.01, 0.2).onChange(v => uniforms.u_glassBevel.value = v);
        stainedGlassFolder.add(params, 'glassHue', 0, 1).onChange(v => uniforms.u_glassHue.value = v);
        stainedGlassFolder.add(params, 'glassWarp', 0, 1).onChange(v => uniforms.u_glassWarp.value = v);
        
        // Topographic parameters
        const topographicFolder = gui.addFolder('Topographic');
        topographicFolder.add(params, 'topoScale', 0.5, 5).onChange(v => uniforms.u_topoScale.value = v);
        topographicFolder.add(params, 'topoLevels', 5, 30).onChange(v => uniforms.u_topoLevels.value = v);
        topographicFolder.add(params, 'topoSpeed', 0, 1).onChange(v => uniforms.u_topoSpeed.value = v);
        topographicFolder.add(params, 'topoThickness', 0.01, 0.15).onChange(v => uniforms.u_topoThickness.value = v);
    }
};
