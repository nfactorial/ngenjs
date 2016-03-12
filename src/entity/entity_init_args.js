/**
 * Passed to each component during entity initialisation. Allowing them access to the arguments.
 */
class EntityInitArgs {
    constructor() {
        this.world = null;
        this.entity = null;
        this.gameState = null;
    }

    /**
     * Retrieves a named entity from the world.
     * @param name {String} Name of the entity to be retrieved.
     * @returns {Entity} Entity associated with the specified name.
     */
    getEntity( name ) {
        return this.world.getEntity( name );
    }

    /**
     * Retrieves a component from the entity being initialized.
     * @param name {String} Name of the component to be retrieved.
     * @returns {*}
     */
    getComponent( name ) {
        if ( this.entity ) {
            let component = this.entity.getComponent( name );
            if ( !component ) {
                console.log( 'Unable to locate component \'' + name + '\'.' );
            }

            return component;
        }

        return null;
    }

    /**
     * Retrieves an accessible system from the available hierarchy.
     * @param name Name of the system to be retrieved.
     * @returns {*}
     */
    getSystem( name ) {
        if ( this.gameState ) {
            return this.gameState.findSystem( name ).instance;
        }

        return null;
    }
}