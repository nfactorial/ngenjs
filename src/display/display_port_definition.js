/**
 * A display port describes a renderable view within the title. Each display port is defined by a JSON
 * description, which also specifies the resources necessary for the display port to be correctly rendered.
 * Each display port belongs to a display manager, the display manager may contain further resources that
 * are shared between display ports.
 */
class DisplayPortDefinition {
    constructor(desc) {
        if ( !desc) {
            throw new Error( 'Cannot create display port definition without a description.');
        }

        if ( !desc.name ) {
            throw new Error( 'Cannot create display port definition without a name.' );
        }

        this.name = desc.name;
        this.resources = [];
        this.stages = [];

        if ( desc.resources ) {
            let count = desc.resources.length;
            for ( let loop = 0; loop < count; ++loop ) {
                this.resources.push( desc.resources[ loop ] );
            }
        }

        if ( desc.stages ) {
            let count = desc.stages.length;
            for ( let loop = 0; loop < count; ++loop ) {
                this.stages.push( desc.stages[ loop ] );
            }
        }
    }

    /**
     * Creates a new DisplayPort instance using this definition.
     * @param displayManager {DisplayManager} The display manager the port will belong to.
     * @returns {DisplayPort} A new DisplayPort instance based on this definition.
     */
    create(displayManager) {
        return new DisplayPort(displayManager, this);
    }
}