/**
 * This class manages a collection of materials available within the running title.
 */
class MaterialProvider extends GameSystem {
    constructor() {
        super();

        this.materialMap = new Map();
    }

    /**
     * Retrieves the shader associated with a specified name.
     * @param name {String} Name of the shader to be retrieved.
     * @returns {V} The shader associated with the specified name, if one could not be found this method returns undefined.
     */
    getMaterial(name) {
        return this.materialMap.get( name );
    }

    /**
     * Loads a material definition file from the specified URL. Once complete, the supplied callback is invoked.
     * @param url {String} Location of the JSON document to be loaded.
     * @param callback {Function} Method to be invoked once loading has completed, the callback should take a single 'error' parameter. If no error was encountered this parameter will be undefined.
     */
    loadJSON(url, callback) {
        var self = this;
        $.getJSON( url, function( data ) {
                // TODO: Load materials
            })
            .fail( function() {
                if ( callback ) {
                    callback( 'Failed' );
                }
            });
    }
}

NGEN.system( 'MaterialProvider', MaterialProvider );
