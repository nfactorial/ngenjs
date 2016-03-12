/**
 * This generator is used to render the sceen assigned to the active display port.
 */
class CopyGenerator extends GeneratorBase {
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
/*          //www.geeks3d.com/20100909/shader-library-blur-post-processing-filter-in-glsl
            fragmentShader: [
                'uniform sampler2D texture;',
                '',
                'varying vec2 vTex;',
                '',
                'void main() {',
                ' vec3 tc = vec3( 1.0, 0.0, 0.0 );',
                ' vec3 pixcol = texture2D( texture, vTex ).xyz;',
                ' vec3 colors[ 3 ];',
                ' colors[ 0 ] = vec3( 0.0, 0.0, 1.0 );',
                ' colors[ 1 ] = vec3( 1.0, 1.0, 0.0 );',
                ' colors[ 2 ] = vec3( 1.0, 0.0, 0.0 );',
                ' float lum = ( pixcol.r + pixcol.g + pixcol.b ) / 3.0;',
                ' if ( lum < 0.5 ) {',
                '   tc = mix( colors[ 0 ], colors[ 1 ], vec3( lum * 0.5 ) ) / 0.5;',
                ' } else {',
                '   tc = mix( colors[ 1 ], colors[ 2 ], vec3( lum - 1.0 * 0.5 ) ) / 0.5;',
                '}',
                ' //int ix = ( lum < 0.5 ) ? 0 : 1;',
                ' //tc = mix( colors[ ix ], colors[ ix + 1 ], vec3( ( lum - float( ix ) * 0.5 ) ) ) / 0.5;',
                ' gl_FragColor = vec4( tc, 1.0 );',
                '}'
            ].join( '\n' )
*/
            fragmentShader: [
                'uniform sampler2D texture;',
                '',
                'varying vec2 vTex;',
                '',
                'void main() {',
                ' gl_FragColor = texture2D( texture, vTex );',
                ' //gl_FragColor = vec4( vTex.x, vTex.y, 1.0, 1.0 );',
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

NGEN.generator( 'SimpleCopy', CopyGenerator );
