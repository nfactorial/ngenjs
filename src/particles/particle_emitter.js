/**
 * A ParticleEmitter is an object that emits particles within a parent particle system, an emitter has a position
 * and orientation.
 *
 * QUERY: Should ParticleEmitter be a component?
 */
class ParticleEmitter extends Component {
    constructor(particleSystem) {
        super();

        this.motionDistance = 2.0;
        this.moveTimer = 0.0;       // TODO: Should be inside a motion controller component of some kind

        this.particleSystem = particleSystem;
        this.timer = 0.0;
        this.parent = null;
        this.enabled = true;
        this.targetEpsilon = 0.2;
        this.targetPosition = new THREE.Vector3(0,3,0);
        this.position = new THREE.Vector3(0,3,0);
        this.offset = new THREE.Vector3(2,2,0);
        this.orientation = new THREE.Quaternion()
        this.emitPerSecond = 120;

        //
        // Falling sparks
/*        this.posRangeX = new Range( -20, 20 );
        this.posRangeY = new Range( 10, 10 );
        this.posRangeZ = new Range( -20, 20 );
        this.velRangeX = new Range( -1, 1);
        this.velRangeY = new Range( -5, -1 );
        this.velRangeZ = new Range( -1, 1 );
        //this.startSize = new Range( 0.1, 0.5 );
        this.startSize = new Range( 0.0, 0.0 );
        //this.endSize = new Range( 2, 4 );
        this.endSize = new Range( 128, 128 );
        this.maxAge = new Range( 3, 5 );
        this.startAlphaRange = new Range( 0.4, 0.8 );
        this.endAlphaRange = new Range( 0, 0 );
*/
        // Glow
/*        this.startAlphaRange = new Range( 0.08, 0.1 );
        this.endAlphaRange = new Range( 0, 0.0 );
        this.angleRangeA = new Range( -Math.PI, Math.PI );
        this.angleRangeB = new Range( -Math.PI, Math.PI );
        this.radiusRange = new Range( 0.3, 0.6 );
        this.strengthRange = new Range( 1.0, 4 );
        this.startSize = new Range( 0.1, 0.1 );
        this.endSize = new Range( 8, 8 );
        this.maxAge = new Range( 3, 5 );
*/
        // Jet
        this.startAlphaRange = new Range( 0.2, 0.3 );
        this.endAlphaRange = new Range( 0, 0.0 );
        this.angleRangeA = new Range( -Math.PI / 32, Math.PI / 32 );
        this.angleRangeB = new Range( -Math.PI / 32, Math.PI / 32 );
        this.radiusRange = new Range( 0.3, 0.6 );
        this.strengthRange = new Range( 1, 4 );
        this.startSize = new Range( 4, 8 );
        this.endSize = new Range( 0, 0 );
        this.maxAge = new Range( 0.3, 0.6 );
    }

    onInitialize(initArgs) {
        const player = initArgs.getEntity( 'player' );
        if ( player ) {
            this.parent = player.getComponent( 'Physics' );
        }
    }

    /**
     * Called each frame, allowing new particles to be emitted.
     * @param updateArgs
     */
    onUpdate(updateArgs) {
        if ( this.parent ) {
            this.targetPosition.addVectors( this.parent.position, this.offset );
        } else {
            this.targetPosition.copy( this.offset );
        }

        const delta = 0.2;

        this.moveTimer += updateArgs.deltaTime;
        this.position.set( Math.cos( this.moveTimer * 2 ), 0.0, Math.sin( this.moveTimer * 2 ) );
        this.position.y += Math.sin( this.moveTimer * 8 ) * delta;

        this.position.multiplyScalar( this.motionDistance );
        this.position.add( this.offset );
        //this.position.addVectors( this.parent.position, this.offset );
        this.particleSystem.position.set( this.position.x, this.position.y, this.position.z );

        if ( this.enabled ) {
            this.timer += updateArgs.deltaTime;

            const d = 1.0 / this.emitPerSecond;
            while ( this.timer > d ) {
                this.spawnGlow();
                //this.spawnNormal();
                this.timer -= d;
            }
        }
    }

    spawnGlow() {
        const particle = this.particleSystem.emitParticle();
        if ( particle ) {
            const angleA = this.angleRangeA.random();
            const angleB = this.angleRangeB.random();
            const r = this.radiusRange.random();
            const strength = this.strengthRange.random();

            const theta = Math.cos( angleB );

            //particle.position.x = Math.cos( angleA ) * theta;
            //particle.position.y = Math.sin( angleB );
            //particle.position.z = Math.sin( angleA ) * theta;
            //particle.position.multiplyScalar( r );

            particle.position.set( this.position.x, this.position.y, this.position.z );

            particle.velocity.x = Math.cos( angleA ) * theta;
            particle.velocity.y = Math.sin( angleB );
            particle.velocity.z = Math.sin( angleA ) * theta;
            particle.velocity.multiplyScalar( strength );

            particle.startAlpha = this.startAlphaRange.random();
            particle.endAlpha = this.endAlphaRange.random();

            particle.startSize = this.startSize.random();
            particle.endSize = this.endSize.random();

            particle.maxAge = this.maxAge.random();

            // TODO: Calculate starting position
            // TODO: Calculate starting velocity
            // TODO: Calculate starting size
            // TODO: Calculate max age

            // TODO: Rotate particle position using emitter orientation and position

            particle.position.add( this.position );       // Translate to particle system space based on emitter position

            //particle.
        }
    }

    spawnNormal() {
        const particle = this.particleSystem.emitParticle();
        if ( particle ) {
            // TEMP: Generate some particles for testing
            particle.position.x = this.posRangeX.random();
            particle.position.y = this.posRangeY.random();
            particle.position.z = this.posRangeZ.random();

            particle.velocity.x = this.velRangeX.random();
            particle.velocity.y = this.velRangeY.random();
            particle.velocity.z = this.velRangeZ.random();

            particle.startAlpha = this.startAlphaRange.random();
            particle.endAlpha = this.endAlphaRange.random();

            particle.startSize = this.startSize.random();
            particle.endSize = this.endSize.random();

            particle.maxAge = this.maxAge.random();

            // TODO: Calculate starting position
            // TODO: Calculate starting velocity
            // TODO: Calculate starting size
            // TODO: Calculate max age

            // TODO: Rotate particle position using emitter orientation and position

            particle.position.add( this.position );       // Translate to particle system space based on emitter position

            //particle.
        }
    }

    emitCone() {
        const particle = this.particleSystem.emitParticle();
        if ( particle ) {
            const strength = this.strengthRange.random();
            const angleA = this.angleRangeA.random();
            const angleB = this.angleRangeB.random();

            const theta = Math.cos( angleB );

            particle.position.set( this.position.x, this.position.y, this.position.z );
            particle.velocity.set( Math.cos( angleA ) * theta, Math.sin( angleB ), Math.sin( angleA ) * theta );
            particle.velocity.multiplyScalar( strength );

            particle.startSize = this.startSize.random();
            particle.endSize = this.endSize.random();
            particle.startAlpha = this.startAlpha.random();
            particle.endAlpha = this.endAlpha.random();
            particle.maxAge = this.maxAge.random();
        }
    }

    // gamedevelopment.tutsplus.com/tutorials/how-to-generate-shockingly-good-2d-lightning-effects-gamedev-2681
    generateSprites() {
        this.lines.forEach( e => {
            this.tangent.subVectors( e.end, e.start );
            const rotation = Math.atan2( this.tangent.y, this.tangent.x );

            this.addSprite( e.start, rotation, center );
        });
    }

    addSprite(halfLength, halfHeight, rotation, center) {
        const baseVertex = this.vertexCount;

        // Point A
        this.vertices[ baseVertex +  0 ] = -halfLength;  // x
        this.vertices[ baseVertex +  1 ] =  halfHeight;  // y
        this.vertices[ baseVertex +  2 ] = 0.0;          // z

        // Point B
        this.vertices[ baseVertex +  3 ] =  halfLength;  // x
        this.vertices[ baseVertex +  4 ] =  halfHeight;  // y
        this.vertices[ baseVertex +  5 ] = 0.0;          // z

        // Point C
        this.vertices[ baseVertex +  6 ] =  halfLength;  // x
        this.vertices[ baseVertex +  7 ] = -halfHeight;  // y
        this.vertices[ baseVertex +  8 ] = 0.0;          // z

        // Point D
        this.vertices[ baseVertex +  9 ] = -halfLength;  // x
        this.vertices[ baseVertex + 10 ] = -halfHeight;  // y
        this.vertices[ baseVertex + 11 ] = 0.0;          // z

        // TODO: Rotate points based on rotation parameter

        // TODO: Generate other three vertices

        // Shift vertices into local space
        this.vertices[ baseVertex + 0 ] = center.x;
        this.vertices[ baseVertex + 1 ] = center.y;
        this.vertices[ baseVertex + 2 ] = center.z;

        this.vertexCount += 4;
    }

    emitLine() {
        //
    }
}
