/**
 * A DisplayResource describes a texture surface that may be used during the rendering of a display port within the title.
 * There are two types of rendered resource used by nGen, shared resources are globally accessible within the renderer
 * whilst display port resources are instantiated per-display port instance and are unique within that display port.
 */
class DisplayResource {
    constructor(desc) {
        if ( !desc ) {
            throw new Error( 'Unable to create DisplayResource without a description.' );
        }

        if ( !desc.name ) {
            throw new Error( 'Unable to create DisplayResource with no specified name.' );
        }

        this.name = desc.name;
        this.width = desc.width ? desc.width : null;
        this.height = desc.height ? desc.height : null;
        this.format = desc.format ? desc.format : null;
        this.scaleX = desc.scaleX ? desc.scaleX : 1.0;
        this.scaleY = desc.scaleY ? desc.scaleY : 1.0;
        this.inherit = desc.inherit ? desc.inherit : null;
        this.parent = null;
        this.threeFormat = null;
        this.texture = null;

        if ( desc.scale ) {
            this.scaleX = desc.scale;
            this.scaleY = desc.scale;
        }
    }

    /**
     * Prepares the resource for use by the application.
     * @param container {DisplayPort|DisplayManager} The display port or display manager the resource belongs to.
     */
    onInitialize(container) {
        if ( this.name !== DisplayResource.BackBufferName ) {
            if ( this.inherit ) {
                this.parent = container.findResource( this.inherit );
                if ( !this.parent ) {
                    throw new Error( 'Couldn\'t find parent resource \'' + this.inherit + '\'.' );
                }

                if ( !this.format ) {
                    this.format = this.parent.format;
                }

                this.width = Math.floor( this.parent.width * this.scaleX );
                this.height = Math.floor( this.parent.height * this.scaleY );
            }

            if ( !this.format ) {
                this.format = DisplayResource.toThreeFormat( this.format );
            }

            if ( !this.format ) {
                throw new Error( 'Unable to initialize resource \'' + this.name + '\', texture format was not specified.' );
            }

            this.texture = new THREE.WebGLRenderTarget( this.width, this.height, {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                generateMipmaps: false,
                format: THREE.RGBFormat, //this.threeFormat,
                stencilBuffer: false
            });
        }
    }

    /**
     * Destroys any GPU resources currently in use by this object.
     */
    dispose() {
        if ( this.texture ) {
            this.texture.dispose();
            this.texture = null;
        }
    }

    /**
     * Called when a scene is to be rendered to this resource.
     * @param renderArgs {RenderArgs} Frame information for the current render.
     * @param scene {THREE.Scene} The scene to be rendered.
     * @param camera {THREE.Camera} The camera to use for rendering.
     */
    onRender(renderArgs, scene, camera ) {
        // TODO: Perhaps have camera supplied, generators don't all use the same camera or scene.
        if ( this.texture ) {
            renderArgs.renderer.render( scene, camera, this.texture );
        } else {
            renderArgs.renderer.render( scene, camera );
        }
    }

    /**
     * Creates a new DisplayResource instance that represents the applications current back-buffer.
     */
    static createBackBuffer() {
        const desc = {
            name: DisplayResource.BackBufferName,
            width: 0,
            height: 0,
            format: 'RGB',
            scaleX: 1.0,
            scaleY: 1.0
        };

        const resource = new DisplayResource( desc );

        // TODO: Initialize data here

        return resource;
    }

    /**
     * Converts a string based texture format to the appropriate THREEjs texture format.
     * @param ngenFormat The string representation of the desired format.
     * @returns {number} The THREEjs texture format version of the supplied string.
     */
    static toThreeFormat(ngenFormat) {
        switch ( ngenFormat ) {
            case 'RGB':
                return THREE.RGBFormat;

            case 'RGBA':
                return THREE.RGBAFormat;
        }

        throw new Error( 'Unknown texture format \'' + ngenFormat + '\'.' );
    }
}

DisplayResource.BackBufferName = 'backbuffer';
