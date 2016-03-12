class WorldBase extends GameSystem {
    constructor() {
        super();

        this.entityMap = new Map();
        this.activeObjects = [];

        this.entityInitArgs = new EntityInitArgs();
    }

    onInitialize(initArgs) {
        this.initializeEntities(initArgs);
    }

    /**
     * Called by the framework when it is time to perform any per-frame processing.
     * @param updateArgs Support methods and properties for use during update.
     */
    onUpdate(updateArgs) {
        // TODO: Objects are not updated like this (they're updated by their controlling system object)
        let count = this.activeObjects.length;
        for ( var loop = 0; loop < count; ++loop ) {
            this.activeObjects[ loop ].onUpdate(updateArgs);
        }
    }

    /**
     * Retrieves an Entity object that has been associated with a specified name.
     * @param name {String} Name of the entity to be retrieved.
     * @returns {Entity} The entity associated with the specified name, if one could not be found this method returns undefined.
     */
    getEntity(name) {
        return this.entityMap.get( name );
    }

    /**
     * Adds a new entity to the world and associates it with a specified name.
     * @param name {String} Name to be associated with the entity.
     * @param entity {Entity} The entity to be added to the scene.
     */
    addEntity(name, entity) {
        if ( !name ) {
            throw new Error( 'Unable to add entity to world without a valid name.' );
        }

        if ( !entity ) {
            throw new Error( 'Null entity cannot be added to world.' );
        }


        if ( this.entityMap.get( name ) ) {
            throw new Error( 'Unable to add entity \'' + name + '\', name already in use.' );
        }

        this.entityMap.set( name, entity );
    }

    /**
     * Invokes the onInitialize method for all entities contained within the World object.
     * @param initArgs
     */
    initializeEntities(initArgs) {
        this.entityInitArgs.world = this;
        this.entityInitArgs.gameState = initArgs.gameState;

        this.entityMap.forEach( e => {
            this.entityInitArgs.entity = e;
        e.onInitialize( this.entityInitArgs )
    });
    }
}


class EditorWorld extends WorldBase {
    constructor() {
        super();

        this.camera = null;
        this.geometryProvider = null;
        this.particleProvider = null;
    }

    onInitialize(initArgs) {
        this.geometryProvider = initArgs.getSystem( 'GeometryProvider' );
        this.particleProvider = initArgs.getSystem( 'ParticleSystemProvider' );

        const entity = new Entity();

        let x = 30.0 + ( Math.random() * 5.0 - 5.0 );
        let z = 30.0 + ( Math.random() * 5.0 - 5.0 );

        entity.addComponent( 'Geometry', this.geometryProvider.createGeometry({
            shape: 'ConstructionPlane',
            //color: 0xFFBB22222,
            color: 0xFFFF22222,
            width: 2.0,
            height: 2.0,
            depth: 2.0
        }));

        this.addEntity( 'constructionPlane', entity );

        this.createController(initArgs);
        this.createTest(initArgs);

        // TEMP
        NGEN.scene.add( this.particleProvider.getParticleSystem( 'Test' ).mesh );

        super.onInitialize(initArgs);
    }

    /**
     * Called by the framework when it is time to perform any per-frame processing.
     * @param updateArgs Support methods and properties for use during update.
     */
    onUpdate(updateArgs) {
        super.onUpdate(updateArgs);

        // TEMP
        this.camera.getCameraArgs( updateArgs.camera );
    }

    createController(initArgs) {
        // TODO: Eventually components will be created via a system object factory method.
        // TODO: So, we will call <system object>.createComponent( 'PlayerController' ) instead of creating it directly.
        // TODO: Further than that, our components will be specified in the definition file, so they will not be hard-coded like this.

        var entity = new Entity();

        entity.addComponent( 'Controller', new OrbitController() );   // TODO: Player controller copies physics position to render object
        entity.addComponent( 'Camera', new CameraComponent() );

        //this.activeObjects.push( tempEntity );
        this.activeObjects.push( entity.getComponent( 'Controller' ) );
        this.activeObjects.push( entity.getComponent( 'Camera' ) );

        this.camera = entity.getComponent( 'Camera' );    // TEMP

        this.addEntity( 'controller', entity );
    }

    createTest(initArgs) {
        this.particleProvider.createPointParticleSystem( 'Test' );

        var entity = new Entity();

        entity.addComponent( 'Emitter', this.particleProvider.getParticleSystem( 'Test' ).createEmitter() );

        this.addEntity( 'emitter', entity );
    }

    initializeEntities(initArgs) {
        this.entityInitArgs.world = this;
        this.entityInitArgs.gameState = initArgs.gameState;

        this.entityMap.forEach( e => {
            this.entityInitArgs.entity = e;
        e.onInitialize( this.entityInitArgs )
    });
    }
}

/**
 * This object is used to manage all the dynamic objects in the current game world.
 */
class World extends GameSystem {
    constructor() {
        super();

        this.entityMap = new Map();
        this.activeObjects = [];
        this.physics = null;
        this.camera = null;
        this.particleProvider = null;
        this.geometryProvider = null;
        this.entityInitArgs = new EntityInitArgs();
    }

    /**
     * Called by the framework once all system objects have been created and the game is ready to begin play.
     * @param initArgs Object providing initialization support methods.
     */
    onInitialize(initArgs) {
        this.physics = initArgs.getSystem('Physics');       // TODO: This will eventually be obtained from configuration
        this.geometryProvider = initArgs.getSystem( 'GeometryProvider' );
        this.particleProvider = initArgs.getSystem( 'ParticleSystemProvider' );

        this.createParticles(initArgs);

        // These are temporary functions, eventually they will be defined within a scene json file.
        this.createPlayer(initArgs);
        this.createMonsters(initArgs);
        this.createLargeMonsters(initArgs);
        this.createTest(initArgs);

        this.initializeEntities(initArgs);
    }

    createParticles(initArgs) {
        this.particleProvider.createPointParticleSystem( 'Test' );
        this.particleProvider.createLineParticleSystem( 'Test2' );
    }

    /**
     * Development function that spawns the player on the map.
     * @param initArgs
     */
    createPlayer(initArgs) {
        // TODO: Eventually components will be created via a system object factory method.
        // TODO: So, we will call <system object>.createComponent( 'PlayerController' ) instead of creating it directly.
        // TODO: Further than that, our components will be specified in the definition file, so they will not be hard-coded like this.

        var entity = new Entity();

        entity.addComponent( 'Physics', this.physics.createBox( 1, 2, 1 ) );
        entity.addComponent( 'Geometry', this.geometryProvider.createGeometry({
            shape: 'Box',
            width: 1,
            height: 2,
            depth: 1
        }));
        entity.addComponent( 'Controller', new PlayerController() );   // TODO: Player controller copies physics position to render object
        entity.addComponent( 'Camera', new CameraComponent() );
        // Temporary - create ground
        entity.addComponent( 'Ground', this.geometryProvider.createGeometry({
            shape: 'Ground',
            width: 300,
            height: 300
        }));

        //this.activeObjects.push( tempEntity );
        this.activeObjects.push( entity.getComponent( 'Controller' ) );
        this.activeObjects.push( entity.getComponent( 'Camera' ) );

        this.camera = entity.getComponent( 'Camera' );    // TEMP

        this.addEntity( 'player', entity );
    }

    createTest(initArgs) {
        var entity = new Entity();

        entity.addComponent( 'Emitter', this.particleProvider.getParticleSystem( 'Test' ).createEmitter() );

        this.addEntity( 'emitter', entity );
    }

    /**
     * Development function that spawns a set of small monsters on the map.
     * @param initArgs
     */
    createMonsters(initArgs) {
        for ( let loop = 0; loop < 4; ++loop ) {
            let entity = new Entity();

            let dist = Math.random() * 2.0 + 5.0;
            let angle = Math.random() * Math.PI * 2;

            let x = 30.0 + Math.cos( angle ) * dist;
            let z = 30.0 + Math.sin( angle ) * dist;

            entity.addComponent( 'Physics', this.physics.createBox( 0.5, 0.5, 0.5 ) )
                .setPosition( x, 0.0, z );
            entity.addComponent( 'Geometry', this.geometryProvider.createGeometry( {
                shape: 'Monster',
                color: 0xFF662222,
                width: 0.5,
                height: 0.5,
                depth: 0.5
            } ) );
            entity.addComponent( 'Controller', new MonsterController() );

            this.activeObjects.push( entity.getComponent( 'Controller' ) );

            this.addEntity( 'smonster' + loop, entity );
        }
    }

    /**
     * Development function that spawns a set of large monsters on the map.
     * @param initArgs
     */
    createLargeMonsters(initArgs) {
        let entity = new Entity();

        let x = 30.0 + ( Math.random() * 5.0 - 5.0 );
        let z = 30.0 + ( Math.random() * 5.0 - 5.0 );

        entity.addComponent( 'Physics', this.physics.createBox( 2.0, 2.0, 2.0 ) )
            .setPosition(x, 0.0, z );
        entity.addComponent( 'Geometry', this.geometryProvider.createGeometry({
            shape: 'Monster',
            //color: 0xFFBB22222,
            color: 0xFFFF22222,
            width: 2.0,
            height: 2.0,
            depth: 2.0
        }));
        entity.addComponent( 'Controller', new MonsterController() ).canJump = false;

        this.activeObjects.push( entity.getComponent( 'Controller' ) );

        this.addEntity( 'lmonster', entity );
    }

    initializeEntities(initArgs) {
        this.entityInitArgs.world = this;
        this.entityInitArgs.gameState = initArgs.gameState;

        this.entityMap.forEach( e => {
            this.entityInitArgs.entity = e;
        e.onInitialize( this.entityInitArgs )
    });

        // TEMP
        NGEN.scene.add( this.particleProvider.getParticleSystem( 'Test' ).mesh );
    }

    /**
     * Adds a new entity to the world and associates it with a specified name.
     * @param name {String} Name to be associated with the entity.
     * @param entity {Entity} The entity to be added to the scene.
     */
    addEntity(name, entity) {
        if ( !name ) {
            throw new Error( 'Unable to add entity to world without a valid name.' );
        }

        if ( !entity ) {
            throw new Error( 'Null entity cannot be added to world.' );
        }


        if ( this.entityMap.get( name ) ) {
            throw new Error( 'Unable to add entity \'' + name + '\', name already in use.' );
        }

        this.entityMap.set( name, entity );
    }

    /**
     * Retrieves an Entity object that has been associated with a specified name.
     * @param name {String} Name of the entity to be retrieved.
     * @returns {Entity} The entity associated with the specified name, if one could not be found this method returns undefined.
     */
    getEntity(name) {
        return this.entityMap.get( name );
    }

    /**
     * Called by the framework when it is time to perform any per-frame processing.
     * @param updateArgs Support methods and properties for use during update.
     */
    onUpdate(updateArgs) {
        // TODO: Objects are not updated like this (they're updated by their controlling system object)
        let count = this.activeObjects.length;
        for ( var loop = 0; loop < count; ++loop ) {
            this.activeObjects[ loop ].onUpdate(updateArgs);
        }

        // TEMP
        this.camera.getCameraArgs( updateArgs.camera );
    }
}

NGEN.system("EditorWorld", EditorWorld);
NGEN.system("World", World);
