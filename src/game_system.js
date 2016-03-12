/**
 * Base class for all system objects within a running title.
 */
class GameSystem {
    constructor() {
    }

    /**
     * Called by the framework once all system objects have been created and the game is ready to begin play.
     * @param initArgs Object providing initialization support methods.
     */
    onInitialize(initArgs) {
        //
    }

    /**
     * Called by the framework when it is time to shutdown.
     */
    onShutdown() {
        //
    }

    /**
     * Called by the framework when it is time to perform any per-frame processing.
     * @param updateArgs Support methods and properties for use during update.
     */
    onUpdate(updateArgs) {
        //
    }
}