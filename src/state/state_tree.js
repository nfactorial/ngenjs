/**
 * This class is used to manage the running state of the application.
 */
class StateTree {
    constructor() {
        this.stateList = [];
        this.stateMap = {};
        this.activeState = null;
        this.pendingState = null;
        this.initArgs = new InitArgs(this);
    }

    /**
     * Creates the game states based on the contents of the supplied data structure.
     * @param data Description of the game-states required by the running title.
     */
    onInitialize( data ) {
        if ( 0 !== this.stateList.length ) {
            throw new Error( 'StateTree::initialize - State tree has already been initialized.' );
        }

        if ( data.states ) {
            let count = data.states.length;

            // Create all the state objects
            for ( let loop = 0; loop < count; ++loop ) {
                let state = new GameState();

                state.onInitialize(data.states[ loop ]);

                this.stateList.push( state );
                this.stateMap[ state.name ] = state;
            }

            // Resolve all children
            for ( let loop = 0; loop < count; ++loop ) {
                this.stateList[ loop ].resolveChildren(this.initArgs);
            }
        }

        this.activeState = this.stateList[ 0 ];
    }


    /**
     * Performs any per-frame processing necessary for the currently active game state.
     * @param updateArgs
     */
    onUpdate(updateArgs) {
        // TODO: States do not have any processing, instead they are containers for systems. We should be
        // invoking 'onUpdate' on the systems marked for update.
        if ( this.activeState ) {
            // TODO: Record performance here
            this.activeState.onUpdate(updateArgs);
        }

        // If a new game state has been requested, switch to the new state. We use a 'while' loop to allow a state
        // to request another state within its onActivate method.
        while ( this.pendingState ) {
            let newState = this.pendingState;
            let oldState = this.activeState;

            this.pendingState = null;

            if (newState != oldState) {
                // At the moment, the first state change will have the oldState as null, however it may be
                // we change it so the old state can never be null.
                if (oldState) {
                    oldState.onDeactivate();
                }

                this.activeState = newState;

                this.pendingState.onActivate();
            }
        }
    }

    /**
     * Requests a state change within the system. State changes do not occur immediately, but take effect at the
     * end of the current frames processing.
     * @param stateName Name of the state which should be switched to.
     */
    changeState(stateName) {
        let requestedState = this.stateMap[stateName];
        if (!requestedState) {
            console.log('State change requested for \'' + stateName + '\' but no such state could be found (ignored).');
        } else {
            this.pendingState = requestedState;
        }
    }
}