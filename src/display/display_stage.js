/**
 * A display stage represents a block of rendering instructions for a particular stage within a rendered frame.
 * A display stage contains a list of 'generator' objects, these objects are executed in-turn when the stage is
 * to be rendered.
 */
class DisplayStage {
    constructor(desc) {
        if ( !desc ) {
            throw new Error( 'Unable to create display stage without a valid definition.' );
        }

        if ( !desc.name ) {
            throw new Error( 'Unable to create display stage without a valid name.' );
        }

        this.name = name;
        this.enabled = desc.enabled === undefined ? true : desc.enabled;
        this.displayPort = null;
        this.depthTarget = null;
        this.renderTarget = null;
        this.target = desc.target || null;
        this.depthWrite = desc.depthWrite ? desc.depthWrite : true;
        this.depthRead = desc.depth ? desc.depth : true;    // Should be in the generator?
        this.generators = [];

        if ( desc.generators ) {
            desc.generators.forEach( e => {
                const generator = NGEN.createGenerator( e.type, e );
                if ( generator ) {
                    this.generators.push( generator );
                } else {
                    console.log( 'Unable to create generator \'' + desc.generators[ loop ].type + '\'.' );
                }
            });
        }
    }

    /**
     * Destroys any GPU resources allocated by this DisplayStage.
     */
    dispose() {
        this.generators.forEach( e => e.dispose() );
    }

    /**
     * Called when we may obtain the resources we have access to. Resources are generally not available during
     * construction, they may also be disposed and re-created at run-time.
     * @param displayPort {DisplayPort} The display port to which we belong.
     */
    onInitialize(displayPort) {
        this.displayPort = displayPort;
        this.renderTarget = this.target ? displayPort.findResource( this.target ) : displayPort.findResource( DisplayResource.BackBufferName );

        this.generators.forEach( e => e.onInitialize(this) );
    }

    findResource(name) {
        return this.displayPort.findResource(name);
    }

    /**
     * Called each frame when it is time to render our content.
     * @param renderArgs [RenderArgs} Miscellaneous support parameters for the rendered frame.
     */
    onRender(renderArgs) {
        if ( this.enabled ) {
            this.generators.forEach( e => e.onRender( renderArgs ) );
        }
    }
}