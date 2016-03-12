/**
 * Represents a single particle system within the running title. A particle system provides many small
 * elements that interact with the scene and are typically used to represent special effects.
 */
class PointParticleSystem extends ParticleSystem {
    constructor() {
        super();

        this.center = new THREE.Vector3( 0.0, 1.0, 0.0 );
        this.calc = new THREE.Vector3();

        // If using THREE.BufferGeometry, class contains a drawRange variable that contains start and count variables

        //this.texture = THREE.ImageUtils.loadTexture( 'game/textures/particles/glow_1.jpg' );
        //this.texture = THREE.ImageUtils.loadTexture( 'game/textures/particles/cloud_2.png' );
        //this.texture = THREE.ImageUtils.loadTexture( 'game/textures/particles/fire_1.jpg' );
        this.texture = THREE.ImageUtils.loadTexture( 'game/textures/particles/fire_2.jpg' );    // This one
        //this.texture = THREE.ImageUtils.loadTexture( 'game/textures/particles/blue_ring.jpg' );
        //this.texture = THREE.ImageUtils.loadTexture( 'game/textures/particles/flash_1.png' );
        //this.texture = THREE.ImageUtils.loadTexture( 'game/textures/particles/tracer_sprite.jpg' );
        //this.texture = THREE.ImageUtils.loadTexture( 'game/textures/particles/Particle_Cloud.png' );

        this.positions = new Float32Array( this.maxParticles * 3 );   // x,y,z per particle
        this.sizes = new Float32Array( this.maxParticles );           // size per particle
        this.colors = new Float32Array( this.maxParticles * 3 );            // Color of each particle
        //this.colors = new Uint32Array( this.maxParticles );            // Color of each particle

        this.geometry = new THREE.BufferGeometry();
        this.geometry.addAttribute( 'position', new THREE.BufferAttribute( this.positions, 3 ) );
        this.geometry.addAttribute( 'customColor', new THREE.BufferAttribute( this.colors, 3 ) );
        //this.geometry.addAttribute( 'color', new THREE.BufferAttribute( this.colors, 1 ) );
        this.geometry.addAttribute( 'size', new THREE.BufferAttribute( this.sizes, 1 ) );

        this.geometry.drawRange.count = 0;

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                texture: { type: 't', value: this.texture }
            },
            vertexShader: NGEN.shaderProvider.getShader( 'point_particle_vs' ),
            fragmentShader: NGEN.shaderProvider.getShader( 'point_particle_ps' ),
            depthWrite: false,
            depthTest: true,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        /*        this.material = new THREE.PointsMaterial({
         vertexColors: THREE.VertexColors,
         depthWrite: false,
         depthTest: true,
         transparent: true,
         blending: THREE.AdditiveBlending,
         map: this.texture
         });
         */
        this.mesh = new THREE.Points( this.geometry, this.material );
    }

    /**
     * Called each frame when it is time to perform any per-frame processing.
     * @param updateArgs
     */
    onUpdate(updateArgs) {
        super.onUpdate(updateArgs);

        for ( let loop = 0; loop < this.particleCount; ) {
            const particle = this.particles[ loop ];

            particle.age += updateArgs.deltaTime;
            if ( particle.age >= particle.maxAge ) {
                this.particles[ loop ] = this.particles[ --this.particleCount ];
                this.particles[ this.particleCount ] = particle;
            } else {
                particle.force.x += this.gravity.x;
                particle.force.y += this.gravity.y;
                particle.force.z += this.gravity.z;

                // TODO: Apply other forces also
                /*this.calc.subVectors( this.position, particle.position );
                 let d = this.calc.lengthSq();
                 if ( d ) {
                 d = 1.0 / Math.min( 1.0, Math.sqrt( d ) / 8.0 );   // 3.0 = max_dist
                 this.calc.multiplyScalar( d * 4 );

                 particle.force.add( this.calc );
                 }*/

                particle.velocity.x += particle.force.x * updateArgs.deltaTime;
                particle.velocity.y += particle.force.y * updateArgs.deltaTime;
                particle.velocity.z += particle.force.z * updateArgs.deltaTime;

                particle.position.x += particle.velocity.x * updateArgs.deltaTime;
                particle.position.y += particle.velocity.y * updateArgs.deltaTime;
                particle.position.z += particle.velocity.z * updateArgs.deltaTime;

                particle.force.x = 0;
                particle.force.y = 0;
                particle.force.z = 0;

                ++loop;
            }
        }

        // Copy particles into geometry
        const count = this.particleCount;
        //const positions = this.geometry.attributes.position.array;
        for ( let loop = 0; loop < count; ++loop ) {
            const particle = this.particles[ loop ];
            const t = particle.age / particle.maxAge;

            this.positions[ loop * 3 + 0 ] = particle.position.x;
            this.positions[ loop * 3 + 1 ] = particle.position.y;
            this.positions[ loop * 3 + 2 ] = particle.position.z;
            this.sizes[ loop ] = NgenCore.lerp( particle.startSize, particle.endSize, t );
            const clr = NgenCore.lerp( particle.startAlpha, particle.endAlpha, t );

            //this.colors[ loop ] = 0x88888888;
            this.colors[ loop * 3 + 0 ] = clr;
            this.colors[ loop * 3 + 1 ] = clr;
            this.colors[ loop * 3 + 2 ] = clr;
        }

        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.customColor.needsUpdate = true;
        this.geometry.attributes.size.needsUpdate = true;
        //this.geometry.verticesNeedUpdate = true;
        //this.geometry.colorsNeedUpdate = true;
        this.geometry.setDrawRange( 0, this.particleCount );
    }
}
