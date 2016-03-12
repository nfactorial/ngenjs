/**
 * This class is supplied to each system when it may prepare itself for use by the title.
 */
class InitArgs {
    constructor(stateTree) {
        if ( stateTree ) {
            this.name = null;
            this.stateTree = stateTree;
            this.gameState = null;
        } else {
            throw new Error( 'No StateTree was passed to InitArgs constructor.' );
        }
    }

    /**
     * Retrieves the system object within the state tree with a specified name.
     * NOTE: Eventually, the systems will be tied to the active state to prevent states accessing systems that
     * do not exist within their hierarchy. For now, we allow any system to be retrieved but states should
     * ensure they don't access objects outside their hierarchy to remain future proof.
     * @param systemName Name of the system to be retrieved.
     * @returns {GameSystem} Reference to the named system object, if it could not be found this method returns null.
     */
    getSystem(systemName) {
        return this.gameState.findSystem(systemName).instance;
    }
}
