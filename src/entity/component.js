/**
 * Base class for all entity components within the engine.
 */
class Component {
    constructor() {

    }

    /**
     * Called by the framework once all components are available for access.
     * @param initArgs {EntityInitArgs}
     */
    onInitialize(initArgs) {

    }

    /**
     * Temporary method, components are not to be updated like this. They will exist within a component
     * provider (which will be a system oject). Those objects will be expected to update their contained components.
     * @param updateArgs
     */
    onUpdate(updateArgs) {
        //
    }
}