/**
 * A display port describes a renderable view within the title. Each display port is defined by a JSON
 * description, which also specifies the resources necessary for the display port to be correctly rendered.
 * Each display port belongs to a display manager, the display manager may contain further resources that
 * are shared between display ports.
 */
class DisplayPort {
    /**
     * Prepares the display port for use by the application.
     * @param displayManager {DisplayManager}
     * @param definition {DisplayPortDefinition}
     */
    constructor(displayManager, definition) {
        if ( !displayManager ) {
            throw new Error( 'Cannot create display port without a valid display manager.');
        }

        if ( displayManager instanceof DisplayManager === false ) {
            throw new Error( 'DisplayManager must be of correct type.' );
        }

        this.scene = null;
        this.camera = null;
        this.enabled = true;
        this.displayManager = displayManager;
        this.resourceMap = new Map();
        this.stageList = [];

        definition.resources.forEach( e => {
            const resource = new DisplayResource( e );
            this.resourceMap.set( resource.name, resource );
        });

        definition.stages.forEach( e => {
            const stage = new DisplayStage( e );
            this.stageList.push( stage );
        });
    }

    /**
     *
     */
    onInitialize() {
        this.resourceMap.forEach( e => e.onInitialize( this ) );

        this.stageList.forEach( e => e.onInitialize( this ) );
    }

    /**
     * Attempts to locate a display resource that has been associated with a specified name.
     * @param name The name of the resource to be retrieved.
     * @returns {*} The resource associated with the specified name if one could not be found this method returns null.
     */
    findResource(name) {
        if ( !name ) {
            throw new Error( 'DisplayPort - Unable to locate display resource without a valid name.' );
        }

        const resource = this.resourceMap.get( name );
        if ( resource ) {
            return resource;
        }

        return this.displayManager.findResource( name );
    }

    /**
     * Release any and all GPU resources currently in use.
     */
    dispose() {
        this.resourceMap.forEach( e => e.dispose() );
    }

    /**
     * Called each frame when it is time to render our content.
     * @param renderArgs {RenderArgs} Miscellaneous support parameters for the rendered frame.
     */
    onRender(renderArgs) {
        if ( this.enabled ) {
            renderArgs.displayPort = this;

            const stageCount = this.stageList.length;
            for ( let loop = 0; loop < stageCount; ++loop ) {
                renderArgs.displayStage = this.stageList[ loop ];
                renderArgs.displayStage.onRender( renderArgs );
            }
            renderArgs.displayStage = null;
            renderArgs.displayPort = null;
        }
    }
}