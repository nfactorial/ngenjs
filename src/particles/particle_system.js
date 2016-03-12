/**
 * Base class for all particle systems supported by NGEN.
 *
 * Interesting links:
 * http://www.slideshare.net/proyZ/relics-fx-system
 * http://simonschreibt.de/gat/company-of-heroes-shaded-smoke/
 */
class ParticleSystem {
    constructor() {
        this.name = null;
        this.enabled = true;
        this.gravity = new THREE.Vector3(0.0,0.0,0.0);
        this.position = new THREE.Vector3( 0, 0, 0 );
        this.maxParticles = 512;
        this.particleCount = 0;
        this.particles = [];
        this.emitters = [];
        this.mesh = null;

        for ( let loop = 0; loop < this.maxParticles; ++loop ) {
            this.particles.push( new Particle() );
        }
    }

    /**
     * Releases all GPU resources associated with this particle system.
     */
    dispose() {
        this.clear();
    }

    /**
     * Destroys all particles that are currently live within the particle system.
     */
    clear() {
        this.particleCount = 0;
        this.geometry.drawRange.count = 0;
    }

    /**
     * Called each frame when it is time to perform any per-frame processing.
     * @param updateArgs
     */
    onUpdate(updateArgs) {
        this.emitters.forEach( e => e.onUpdate(updateArgs) );
    }

    createEmitter() {
        // TODO: Also need to be able to delete emitters
        let emitter = new ParticleEmitter( this );
        this.emitters.push( emitter );

        return emitter;
    }

    /**
     * Attempts to emit a new particle within the particle system.
     * @returns {Particle} The particle emitted within the particle system, if no particles are available this method returns null.
     */
    emitParticle() {
        if ( this.particleCount < this.maxParticles ) {
            let particle = this.particles[ this.particleCount++ ];
            particle.reset();
            return particle;
        }

        return null;
    }
}
