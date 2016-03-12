/**
 * Contains a collection of particle systems active within the running title.
 */
class ParticleSystemProvider extends GameSystem {
    constructor() {
        super();

        this.particleSystems = new Map();
    }

    /**
     * Prepares the system object for use by the application.
     * @param initArgs
     */
    onInitialize(initArgs) {
        //
    }

    /**
     * Deletes all particle systems within the provider and any associated GPU resources.
     */
    onShutdown() {
        this.particleSystems.forEach( e => e.dispose() );
        this.particleSystems.clear();
    }

    /**
     * Called each frame when we may perform any necessary per-frame processing.
     * @param updateArgs {UpdateArgs} Miscellaneous variables for the current update frame.
     */
    onUpdate(updateArgs) {
        this.particleSystems.forEach( e => e.onUpdate(updateArgs));
    }

    /**
     * Retreives a particle system with a specified name.
     * @param name {String} Name of the particle system to be retrieved.
     * @returns {ParticleSystem} The particle system associated with the specified name, if one could not be found returns undefined.
     */
    getParticleSystem(name) {
        return this.particleSystems.get( name );
    }

    /**
     * Creates a new particle system and makes it available for use by the running title.
     * @param name
     */
    createPointParticleSystem(name) {
        let system = new PointParticleSystem();

        this.particleSystems.set( name, system );

        return system;
    }

    createLineParticleSystem(name) {
        let system = new LineParticleSystem();

        this.particleSystems.set( name, system );

        return system;
    }
}

NGEN.system( 'ParticleSystemProvider', ParticleSystemProvider );
