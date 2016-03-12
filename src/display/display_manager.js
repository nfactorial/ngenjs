/**
 * The display manager maintains a list of display resources that are shared between all display ports.
 * It also contains a list of display port definitions, allowing the title to create an instance of one.
 * The display manager always has a display resource named 'backbuffer' which describes the current display surface
 * for the title.
 */
class DisplayManager {
    constructor() {
        this.resourceMap = new Map();
        this.portDefinitions = new Map();
        this.displayPorts = [];
        this.backBuffer = DisplayResource.createBackBuffer();

        this.resourceMap.set( this.backBuffer.name, this.backBuffer );

        // NOTE: Might be better if we embed 'drawFullscreenTri' or something within our own renderer wrapper.

        var fullscreenVerts = new THREE.BufferAttribute( new Float32Array( 3 * 3 ), 3 );    // TODO: 2D only needs two float [x,y]

        this.fullscreenTri = new THREE.BufferGeometry();
        this.fullscreenTri.addAttribute( 'position', fullscreenVerts );

        // TODO: This triangle currently fits the top left of the display (for debugging) eventually it should extend
        //       so that the triangle covers the entire display.
        fullscreenVerts.array[ 0 ]  = -1.0;
        fullscreenVerts.array[ 1 ]  = -1.0;
        fullscreenVerts.array[ 2 ]  =  0.0;

        fullscreenVerts.array[ 3 ]  =  1.0;
        fullscreenVerts.array[ 4 ]  = -1.0;
        fullscreenVerts.array[ 5 ]  =  0.0;

        fullscreenVerts.array[ 6 ]  = -1.0;
        fullscreenVerts.array[ 7 ]  =  1.0;
        fullscreenVerts.array[ 8 ]  =  0.0;
    }

    setDisplaySize(width, height) {
        this.backBuffer.width = width;
        this.backBuffer.height = height;

        // TODO: Resources need to be re-created if dimensions have changed.
    }

    onInitialize() {
        this.resourceMap.forEach( e => e.onInitialize( this ) );
    }

    /**
     * Destroys any GPU resources currently in use by the application.
     */
    dispose() {
        // First dispose all resource in use by any display ports.
        const portCount = this.displayPorts.length;
        for ( let loop = 0; loop < portCount; ++loop ) {
            this.displayPorts[ loop ].dispose();
        }

        // Next dispose of any resources in use by the shared display resources
        this.resourceMap.forEach( e => e.dispose() );
    }

    /**
     * Registers a new display configuration with the display manager.
     * @param config Description of the display that is to be made available.
     */
    registerConfig(config) {
        if ( config ) {
            if ( config.resources ) {
                // Register shared resources, note that the actual GPU resources are not created at this point.
                let count = config.resources.length;
                for ( let loop = 0; loop < count; ++loop ) {
                    const def = config.resources[ loop ];
                    if ( this.resourceMap.get( def.name ) ) {
                        console.log( 'Unable to create resource \'' + def.name + '\', name already in use.' );
                    } else {
                        const resource = new DisplayResource( def );
                        if ( resource ) {
                            this.resourceMap.set( resource.name, resource );
                        }
                    }
                }
            }

            if ( config.displayPorts ) {
                // Register the display port definitions that are available for use within the application.
                let count = config.displayPorts.length;
                for ( let loop = 0; loop < count; ++loop ) {
                    const def = config.displayPorts[ loop ];
                    if ( this.portDefinitions[ def.name ] ) {
                        console.log( 'Unable to register display port \'' + def.name + '\', name already in use.' );
                    } else {
                        const port = new DisplayPortDefinition( def );
                        if ( port ) {
                            this.portDefinitions.set( def.name, port );
                        }
                    }
                }
            }
        } else {
            console.log( 'DisplayManager.registerConfig - Cannot process null configuration.' );
        }
    }

    /**
     * Attempts to locate a display resource that has been associated with a specified name.
     * @param name The name of the resource to be retrieved.
     * @returns {*} The resource associated with the specified name if one could not be found this method returns null.
     */
    findResource(name) {
        if ( !name ) {
            throw new Error( 'DisplayManager - Unable to locate display resource without a valid name.' );
        }

        const resource = this.resourceMap.get( name );
        if ( !resource ) {
            console.log( 'Unable to locate resource \'' + name + '\'.' );
            return null;
        }

        return this.resourceMap.get( name );
    }

    /**
     * Renders all display ports that are currently enabled.
     * @param renderArgs {RenderArgs} Description of the frame currently being rendered.
     */
    onRender(renderArgs) {
        this.displayPorts.forEach( e => e.onRender(renderArgs) );
    }

    /**
     * Creates a display port using a specified description.
     * @param name {String} Name of the display port definition to be created.
     * @returns {DisplayPort} A new instance of the specified display port, if the definition could not be found this method returns undefined.
     */
    createDisplayPort(name) {
        const def = this.portDefinitions.get( name );
        if ( !def ) {
            console.log( 'Unable to create display port \'' + name + '\', definition could not be found.' );
            return undefined;
        }

        console.log( 'Creating display port ' + name );

        const displayPort = def.create( this, name );
        this.displayPorts.push( displayPort );

        displayPort.onInitialize();

        return displayPort;
    }
}