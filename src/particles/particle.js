/**
 * Represents a single particle within a particle system.
 */
class Particle {
    constructor() {
        this.age = 0;
        this.maxAge = 0;
        this.endSize = 0;
        this.startSize = 0;
        this.startAlpha = 0;
        this.endAlpha = 0;
        this.position = new THREE.Vector3();
        this.force = new THREE.Vector3();
        this.velocity = new THREE.Vector3();
    }

    /**
     * Ensures all internal variables are at their default setting.
     */
    reset() {
        this.age = 0;
        this.maxAge = 0;
        this.endSize = 0;
        this.startSize = 0;
        this.startAlpha = 0;
        this.endAlpha = 0;
        this.position.set( 0,0,0 );
        this.force.set( 0,0,0 );
        this.velocity.set(0,0,0);
    }
}
