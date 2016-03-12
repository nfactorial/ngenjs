/**
 * This generator is used to render the sceen assigned to the active display port.
 */
class BlurHorzGenerator extends GeneratorBase {
    constructor(desc) {
        super(desc);

        // Seems very heavy weight to have to create a scene, camera and quad for every generator.
        // This is what the THREE examples do, but we can probably do better in the future once it's working.
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
    }

    onInitialize(displayStage) {
        super.onInitialize(displayStage);

        const texelSize = 1.0 / this.input[ 0 ].width;

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                texture: { type: 't', value: this.input[ 0 ].texture },
                texelSize: { type: 'v4', value: new THREE.Vector4( texelSize, 0.0, 0.0, 0.0 ) }
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
                'uniform vec4 texelSize;',
                '',
                'varying vec2 vTex;',
                '',
                'float bloomSigma = 2.0;',
                '',
                'float calcGaussianWeight( int sampleDist, float sigma ) {',
                ' float g = 1.0 / sqrt( 2.0 * 3.14159 * sigma * sigma );',
                ' return ( g * exp( -float( sampleDist * sampleDist ) / ( 2.0 * sigma * sigma ) ) );',
                '}',
                '',
                'vec3 blur( vec2 texCoord, vec2 texScale, float sigma ) {',
                ' vec3 color = vec3( 0.0 );',
                ' for ( int i = -6; i <= 6; ++i ) {',
                '   float weight = calcGaussianWeight( i, sigma );',
                '   vec2 blurTex = texCoord + ( float( i ) * texelSize.xy ) * texScale;',
                '   vec3 sample = texture2D( texture, blurTex ).xyz;',
                '   color += sample * vec3( weight );',
                ' }',
                ' return color;',
                '}',
                '',
                'void main() {',
                ' gl_FragColor = vec4( blur( vTex, vec2( 2.0, 0.0 ), bloomSigma ), 1.0 );',
                '}'
            ].join( '\n' )
        });

        this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), this.material );

        this.scene.add( this.quad );
    }

    onRender(renderArgs) {
        renderArgs.renderer.autoClearColor = false;
        this.output[ 0 ].onRender( renderArgs, this.scene, this.camera );
        renderArgs.renderer.autoClearColor = true;

        // TODO: Eventually scene and camera will be attached to the display port
        //renderArgs.displayStage.rendeTarget.onRender( renderArgs, renderArgs.displayPort.scene, renderArgs.displayPort.camera );
    }
}

NGEN.generator( 'BlurHorz', BlurHorzGenerator );
