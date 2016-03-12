/**
 * A RenderStageGenerator is an object that performs rendering operations within the title.
 * A generator may render geometry, or produce a texture or some other render operation.
 */
class ShaderGenerator extends GeneratorBase {
    constructor(desc) {
        super( desc );

        // Seems very heavy weight to have to create a scene, camera and quad for every generator.
        // This is what the THREE examples do, but we can probably do better in the future once it's working.
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );

        this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null );

        this.scene.add( this.quad );
    }

    onInitialize(displayStage) {
        super.onInitialize(displayStage);
        //
    }

    onRender(renderArgs) {
        //renderArgs.displayStage.renderTarget.onRender( renderArgs, this.scene, this.camera );

        //renderArgs.displayStage.renderTarget.onRender( renderArgs, renderArgs.scene, renderArgs.displayPort.camera );
    }
}

NGEN.generator( 'ShaderGenerator', ShaderGenerator );
