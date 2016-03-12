/**
 * This generator is used to render the sceen assigned to the active display port.
 */
class LinearScaleGenerator extends GeneratorBase {
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
                texture: { type: 't', value: this.input[ 0 ].texture }
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
                '',
                'varying vec2 vTex;',
                '',
                'void main() {',
                ' gl_FragColor = vec4( texture2D( texture, vTex ).xyz, 1.0 );',
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

NGEN.generator( 'LinearScale', LinearScaleGenerator );
