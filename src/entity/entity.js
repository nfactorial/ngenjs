/**
 * Describes an Entity that exists within a game world.
 * Entities consist of multiple components, a component is a sub-object that is managed by a system.
 * Entities are not updated directly, instead individual systems are updated by the framework and they contain
 * the update logic for their contained components.
 */
class Entity {
    constructor() {
        this.componentMap = new Map();
    }

    /**
     * Prepares the contained components for use by the running title.
     */
    onInitialize(initArgs) {
        this.componentMap.forEach( e => e.onInitialize(initArgs) );
    }

    /**
     * Temporary method, entities are not to be updated like this. Their components will exist within a component
     * provider (which will be a system oject). Those objects will be expected to update their contained components.
     * @param updateArgs
     */
    onUpdate(updateArgs) {
        this.componentMap.forEach( e => e.onUpdate( updateArgs ) );
    }

    getComponent( name ) {
        return this.componentMap.get( name );
    }

    /**
     * Adds a new component to the entity.
     * @param name {String} The name the component is to be associated with.
     * @param component {Component} The component object to be added to the entity.
     * @returns {Component} Reference to the Component object that was added.
     */
    addComponent( name, component ) {
        if ( !name ) {
            throw new Error( 'Cannot add component without a valid name.' );
        }

        if ( null == component ) {
            throw new Error( 'Component object must be valid.' );
        }

        if ( this.componentMap.get( name ) ) {
            throw new Error( 'Cannot add component \'' + name + '\', name has already been registered.' );
        }

        this.componentMap.set( name, component );

        return component;
    }
}
