/**
 * Represents a state within the running title. A game state contains a list of system objects that are accessible
 * from the state, within a state its immediate system objects and those system objects within its parent hierarchy
 * are accessible.
 */
class GameState {
    constructor() {
        this.name = null;
        this.children = null;
        this.parent = null;
        this.updateNames = [];
        this.updateList = [];
        this.systemMap = new Map();
    }

    /**
     * Prepares the game state with its basics settings as specified in the supplied description.
     * @param desc Description of the game state being initialized.
     */
    onInitialize(desc) {
        if ( !desc ) {
            throw new Error( 'GameState.onInitialize - A game state description must be provided.' );
        }

        if ( !desc.name ) {
            throw new Error( 'GameState.onInitialize - A valid name must be supplied for a new GameState.' );
        }

        this.name = desc.name;

        if ( desc.systems ) {
            let count = desc.systems.length;
            for ( let loop = 0; loop < count; ++loop ) {
                const systemType = desc.systems[ loop ].type || desc.systems[ loop ].name,
                    systemName = desc.systems[ loop ].name || desc.systems[ loop ].type;

                let instance = NGEN.createSystem( systemType );
                if ( instance ) {
                    this.systemMap.set( systemName, { name: systemName, type: systemType, perf: 0, instance: instance } );
                } else {
                    console.log( 'Failed to create system \'' + desc.systems[ loop ].name + '\' of type \'' + desc.systems[ loop ].type + '\'.' );
                }
            }
        }

        if ( desc.update ) {
            let count = desc.update.length;
            for ( let loop = 0; loop < count; ++loop ) {
                this.updateNames.push( desc.update[ loop ] );
            }
        }
    }


    /**
     *
     * @param initArgs (InitArgs)
     */
    resolveChildren(initArgs) {
        // TODO: Need to convert list of child names to state references.

        this.getUpdateList( this.updateList );

        initArgs.gameState = this;

        this.systemMap.forEach( e => e.instance.onInitialize(initArgs) );
    }


    /**
     * Determines whether or not this game state contains any child states.
     * @returns {boolean} True if this game state contains children otherwise false.
     */
    get hasChildren() {
        return ( null != this.children && 0 != this.children.length );
    }

    /**
     * Adds all systems in the game states update list to the supplied array.
     * @param list
     */
    getUpdateList( list ) {
        if ( this.parent ) {
            this.parent.getUpdateList( list );
        }

        let count = this.updateNames.length;
        for ( let loop = 0; loop < count; ++loop ) {
            let sys = this.findSystem( this.updateNames[ loop ] );
            if ( sys ) {
                list.push( sys );
            } else {
                console.log( 'Unable to locate update system \'' + this.updateNames[ loop ] + '\'.' );
            }
        }
    }

    /**
     * Locates a system object associated with the specified name.
     * @param name Name of the system to be located, this is not the class name but the instance name.
     * @returns {GameSystem} The game system associated with the specified name or null if one could not be found.
     */
    findSystem(name) {
        const system = this.systemMap.get( name );
        if ( system ) {
            return system;
        }

        return this.parent ? this.parent.findSystem(name) : null;
    }


    /**
     * Called each frame when any per-frame processing may take place.
     * @param updateArgs
     */
    onUpdate(updateArgs) {
        // The update list contains all systems to be updated when we are in this state, so there's no need to
        // pass the update call to our parent object.
        let count = this.updateList.length;
        for ( let loop = 0; loop < count; ++loop ) {
            // TODO: Record performance here
            this.updateList[ loop ].perf = NgenCore.getTimeStamp();
            this.updateList[ loop ].instance.onUpdate(updateArgs);
            this.updateList[ loop ].perf = NgenCore.getTimeStamp() - this.updateList[ loop ].perf;
        }
    }

    /**
     * This update method is performed when the title is taking performance information.
     * @param updateArgs
     */
    onPerfUpdate(updateArgs) {

    }

    sendPerformanceInformation( uri ) {
        //
    }
}
