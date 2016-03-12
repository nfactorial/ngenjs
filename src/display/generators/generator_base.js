/**
 * Base class for all generators available within NGEN.
 */
class GeneratorBase {
    constructor(desc) {
        this.input = [];
        this.output = [];

        this.inputNames = [];
        this.outputNames = [];

        if ( desc.input ) {
            desc.input.forEach( e => this.inputNames.push( e ) );
        }

        if ( desc.output ) {
            desc.output.forEach( e => this.outputNames.push( e ) );
        }
    }

    /**
     * Discards all GPU resources referenced by this generator.
     */
    dispose() {
        this.input = [];
        this.output = [];
    }

    /**
     * Prepares the generator for use by the application.
     * @param displayStage {DisplayStage} The DisplayStage which contains the generator.
     */
    onInitialize(displayStage) {
        this.inputNames.forEach( e => this.input.push( displayStage.findResource( e ) ) );
        this.outputNames.forEach( e => this.output.push( displayStage.findResource( e ) ) );
    }

    /**
     * Renders the output of the generator.
     * @param renderArgs {RenderArgs}
     */
    onRender(renderArgs) {
    }
}
