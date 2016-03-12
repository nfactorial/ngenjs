/**
 * Implements a particle system that represents particles as liens.
 * NOTE: Currently lines always face along the z-axis, however this will be improved in the future.
 */
class LineParticleSystem extends ParticleSystem {
    constructor() {
        super();

        this.center = new THREE.Vector3( 0.0, 1.0, 0.0 );
        this.calc = new THREE.Vector3();
        this.delta = new THREE.Vector3();

        // If using THREE.BufferGeometry, class contains a drawRange variable that contains start and count variables

        //this.texture = THREE.ImageUtils.loadTexture( 'game/textures/particles/glow_1.jpg' );
        //this.texture = THREE.ImageUtils.loadTexture( 'game/textures/particles/cloud_2.png' );
        //this.texture = THREE.ImageUtils.loadTexture( 'game/textures/particles/fire_1.jpg' );
        this.texture = THREE.ImageUtils.loadTexture( 'game/textures/particles/fire_2.jpg' );
        //this.texture = THREE.ImageUtils.loadTexture( 'game/textures/particles/blue_ring.jpg' );
        //this.texture = THREE.ImageUtils.loadTexture( 'game/textures/particles/flash_1.png' );
        //this.texture = THREE.ImageUtils.loadTexture( 'game/textures/particles/tracer_sprite.jpg' );
        //this.texture = THREE.ImageUtils.loadTexture( 'game/textures/particles/Particle_Cloud.png' );

        // TODO: Index buffer for collection of quads can be shared across the entire application. Rather than one per particle system

        this.indices = new Uint16Array( this.maxParticles * 6 );         // Two triangles per quad, 3 indices per triangle
        this.uvs = new Float32Array( this.maxParticles * 8 );
        this.positions = new Float32Array( this.maxParticles * 4 * 3 );

        for ( let loop = 0; loop < this.maxParticles; ++loop ) {
            this.indices[ loop * 6 + 0 ] = loop * 4 + 0;
            this.indices[ loop * 6 + 1 ] = loop * 4 + 1;
            this.indices[ loop * 6 + 2 ] = loop * 4 + 3;

            this.indices[ loop * 6 + 3 ] = loop * 4 + 1;
            this.indices[ loop * 6 + 4 ] = loop * 4 + 2;
            this.indices[ loop * 6 + 5 ] = loop * 4 + 3;

            this.uvs[ loop * 8 + 0 ] = 0.0;
            this.uvs[ loop * 8 + 1 ] = 0.0;

            this.uvs[ loop * 8 + 2 ] = 1.0;
            this.uvs[ loop * 8 + 3 ] = 0.0;

            this.uvs[ loop * 8 + 4 ] = 1.0;
            this.uvs[ loop * 8 + 5 ] = 1.0;

            this.uvs[ loop * 8 + 6 ] = 0.0;
            this.uvs[ loop * 8 + 7 ] = 1.0;
        }

        // Custom colors coming in the future

        this.geometry = new THREE.BufferGeometry();
        this.geometry.addAttribute( 'position', new THREE.BufferAttribute( this.positions, 3 ) );
        this.geometry.addAttribute( 'uvs', new THREE.BufferAttribute( this.uvs, 2 ) );
        this.geometry.setIndex( new THREE.BufferAttribute( this.indices, 1 ) );

        this.geometry.drawRange.count = 0;

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                texture: { type: 't', value: this.texture }
            },
            vertexShader: NGEN.shaderProvider.getShader( 'line_particle_vs' ),
            fragmentShader: NGEN.shaderProvider.getShader( 'line_particle_ps' ),
            depthWrite: false,
            depthTest: true,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        this.mesh = new THREE.Mesh( this.geometry, this.material );
    }

    rotateZ(baseIndex, count, rotation) {
        const phi = Math.cos( rotation );
        const theta = Math.sin( rotation );

        for ( let loop = 0; loop < count; ++loop ) {
            const x = this.positions[ baseIndex + 0 ];
            const y = this.positions[ baseIndex + 1 ];

            this.positions[ baseIndex + 0 ] = x * phi - y * theta;
            this.positions[ baseIndex + 1 ] = x * theta + y * phi;
        }
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
                particle.force.aadd( this.gravity );

                particle.velocity.x += particle.force.x * updateArgs.deltaTime;
                particle.velocity.y += particle.force.y * updateArgs.deltaTime;
                particle.velocity.z += particle.force.z * updateArgs.deltaTime;

                particle.position.x += particle.velocity.x * updateArgs.deltaTime;
                particle.position.y += particle.velocity.y * updateArgs.deltaTime;
                particle.position.z += particle.velocity.z * updateArgs.deltaTime;

                particle.force.set( 0,0,0 );

                ++loop;
            }
        }

        // Create geometry for our lines
        const count = this.particleCount;
        for ( let loop = 0; loop < count; ++loop ) {
            const particle = this.particles[ loop ];

            this.delta.subVectors( particle.end, particle.start );

            const rotation = Math.atan2( this.delta.y, this.delta.x );
            const length = this.delta.length();

            const t = particle.age / particle.maxAge;

            this.positions[ loop * 3 + 0 ] = particle.position.x;
            this.positions[ loop * 3 + 1 ] = particle.position.y;
            this.positions[ loop * 3 + 2 ] = particle.position.z;

            this.rotateZ( loop * 4, 4, rotation );
            //const clr = NgenCore.lerp( particle.startAlpha, particle.endAlpha, t );
        }

        this.geometry.attributes.position.needsUpdate = true;

        //this.geometry.verticesNeedUpdate = true;
        //this.geometry.colorsNeedUpdate = true;
        this.geometry.setDrawRange( 0, this.particleCount * 6 );    // * 6 for number of indices?
    }
}
