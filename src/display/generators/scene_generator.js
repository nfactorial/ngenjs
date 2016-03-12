/**
 * This generator is used to render the sceen assigned to the active display port.
 */
class SceneGenerator extends GeneratorBase {
    constructor(desc) {
        super(desc);
    }

    onInitialize(displayStage) {
        super.onInitialize(displayStage);
        //
    }

    onRender(renderArgs) {
        this.output[ 0 ].onRender( renderArgs, renderArgs.scene, renderArgs.camera );

        // TODO: Eventually scene and camera will be attached to the display port
        //renderArgs.displayStage.rendeTarget.onRender( renderArgs, renderArgs.displayPort.scene, renderArgs.displayPort.camera );
    }
}

NGEN.generator( 'SceneGenerator', SceneGenerator );
