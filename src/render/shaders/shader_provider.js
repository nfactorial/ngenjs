/**
 * This class manages a collection of shaders available within the running title.
 */
class ShaderProvider {
    constructor() {
        this.shaderMap = new Map();
    }

    /**
     * Loads a collection of shaders from the specified JSON data.
     * @param jsonData {String} JSON data containing the shader source code to be loaded.
     */
    loadJSON(jsonData) {
        if ( jsonData ) {
            const count = jsonData.shaders.length;
            for ( let loop = 0; loop < count; ++loop ) {
                const name = jsonData.shaders[ loop ].name;
//                const shader = new Shader( jsonData[ loop ].name, jsonData[ loop ].type, jsonData[ loop ].source.join() );
//                this.shaderMap.set( shader.name, shader );
                this.shaderMap.set( name, jsonData.shaders[ loop ].source.join( '\n' ) );
            }
        }
    }

    /**
     * Retrieves the shader associated with a specified name.
     * @param name {String} Name of the shader to be retrieved.
     * @returns {V} The shader associated with the specified name, if one could not be found this method returns undefined.
     */
    getShader(name) {
        if ( !this.shaderMap.get( name ) ) {
            console.log( 'Unable to find ' + name );
        }

        return this.shaderMap.get( name );
    }

}

NGEN.system( 'ShaderProvider', ShaderProvider );
