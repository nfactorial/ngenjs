/**
 * This generator is used to render the sceen assigned to the active display port.
 *
 * Useful references for implementation:
 * http://www.xnainfo.com/content.php?content=28
 * https://mynameismjp.wordpress.com/2010/04/30/a-closer-look-at-tone-mapping/
 * http://kalogirou.net/2006/05/20/how-to-do-good-bloom-for-hdr-rendering/
 */
class HdrGenerator extends GeneratorBase {
    constructor(desc) {
        super(desc);

        // Seems very heavy weight to have to create a scene, camera and quad for every generator.
        // This is what the THREE examples do, but we can probably do better in the future once it's working.
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
    }

    onInitialize(displayStage) {
        super.onInitialize(displayStage);

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                texture: { type: 't', value: this.input[ 0 ].texture },
                bloomTexture: { type: 't', value: this.input[ 1 ].texture },
                bloomStrength: { type: 'f', value: 2.0 },
                exposure: { type: 'f', value: 0.18 },
                exposureBias: { type: 'f', value: 2.0 },
                W: { type: 'f', value: 11.2 }
            },
            depthWrite: false,
            depthTest: false,
            transparent: true,
            vertexShader: [
                'varying vec2 vTex;',
                '',
                'void main() {',
                ' gl_Position = vec4( position.x, position.y, 0.0, 1.0 );',
                ' vTex = uv;',
                '}'
            ].join( '\n' ),
            fragmentShader: [
                'uniform sampler2D texture;',
                'uniform sampler2D bloomTexture;',
                '',
                'uniform float bloomStrength;',
                'uniform float exposure;',
                'uniform float exposureBias;',
                '',
                'varying vec2 vTex;',
                '',
                'float A = 0.15;',
                'float B = 0.50;',
                'float C = 0.10;',
                'float D = 0.20;',
                'float E = 0.02;',
                'float F = 0.30;',
                'uniform float W;',
                '//float W = 2.0;//11.2;',
                '',
                'vec3 filmicTonemap( vec3 x ) {',
                ' return ( ( x * ( A * x + C * B ) + D * E ) / ( x * ( A * x + B ) + D * F ) ) - E / F;',
                '}',
                '',
                'float calcLuminance( vec3 color ) {',
                ' return max( dot( color, vec3( 0.212656, 0.715158, 0.072185 ) ), 0.0001 );	// sRGB',
                '}',
                '',
                'vec3 calcExposedColor(vec3 color, float avgLuminance, float threshold, out float outExposure) {',
                ' avgLuminance = max(avgLuminance, 0.001);',
                ' float keyValue = exposure;',
                ' float linearExposure = ( keyValue / avgLuminance);',
                ' outExposure = log2(max(linearExposure, 0.0001));',
                ' outExposure -= threshold;',
                ' return exp2(outExposure) * color;',
                '}',
                '',
                'vec3 toneMap(vec3 color, float avgLuminance, float threshold, out float exposure) {',
                ' float pixelLuminance = calcLuminance(color);',
                ' color = calcExposedColor(color, avgLuminance, threshold, exposure);',
                ' vec3 whiteScale = 1.0 / filmicTonemap( vec3( W ) );',
                '',
                ' color = filmicTonemap(exposureBias * color);',
                ' return color * whiteScale;',
                '}',
                '',
                'vec4 composite( vec2 texCoord ) {',
                ' float avgLuminance = 0.2;',
                ' float exposure = 0.0;',
                '',
                ' vec3 color = texture2D( texture, texCoord ).xyz;',
                ' color = 16.0 * color;  // Hardcoded exposure constant',
                '',
                ' color = toneMap( color, avgLuminance, 0.0, exposure );',
                '',
                ' vec3 bloomColor = bloomStrength * texture2D( bloomTexture, texCoord ).xyz;',
                '',
                ' return vec4( bloomColor + color, 1.0 );',
                '}',
                '',
                'void main() {',
                ' gl_FragColor = composite( vTex );',
                '}'
            ].join( '\n' )
        });

        this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), this.material );

        this.scene.add( this.quad );
    }

    onRender(renderArgs) {
        this.material.uniforms.W.value = NGEN.Settings.HDR.W;
        this.material.uniforms.exposure.value = NGEN.Settings.HDR.Exposure;
        this.material.uniforms.bloomStrength.value = NGEN.Settings.HDR.BloomStrength;
        this.material.uniforms.exposureBias.value = NGEN.Settings.HDR.ExposureBias;

        renderArgs.renderer.autoClearColor = false;
        this.output[ 0 ].onRender( renderArgs, this.scene, this.camera );
        renderArgs.renderer.autoClearColor = true;

        // TODO: Eventually scene and camera will be attached to the display port
        //renderArgs.displayStage.rendeTarget.onRender( renderArgs, renderArgs.displayPort.scene, renderArgs.displayPort.camera );
    }
}

NGEN.generator( 'HdrGenerator', HdrGenerator );

NGEN.Settings.HDR.W = 11.2;
NGEN.Settings.HDR.Exposure = 0.18;
NGEN.Settings.HDR.BloomStrength = 2.0;
