/**
 * This class provides Geometry components for use by the running title.
 */
class GeometryComponentProvider extends GameSystem {
    constructor() {
        super();

        this.conuter = 0;
    }

    /**
     * Creates a geometry object that can be rendered by the framework.
     * @param desc
     */
    createGeometry( desc ) {
        if ( !desc.shape ) {
            throw new Error( 'Cannot create geometry object without a geometry shape.' );
        }

        switch ( desc.shape ) {
            case 'Box':
                this.counter++; // Just so webstorm doesn't complain about the function not being static
                return GeometryComponentProvider.createBoxGeometry( desc );

            case 'Ground':      // Temporary for testing purposes
                return GeometryComponentProvider.createGroundGeometry( desc );

            case 'Sphere':
                break;

            case 'Mesh':
                break;

            case 'Monster':
                return GeometryComponentProvider.createMonsterGeometry( desc );

            case 'ConstructionPlane':
                return GeometryComponentProvider.createConstructionPlane( desc );

            default:
                throw new Error( 'Unable to create unknown geometry shape \'' + desc.type + '\'.' );
        }
    }

    /**
     * Creates a Geometry component that represents a construction plane.
     * @param desc Description of the mesh to be created.
     */
    static createConstructionPlane( desc ) {
        const geometry = new THREE.BufferGeometry();

        const count = 4 * 10;
        const delta = 1.0;
        const base = -( count / 2 ) * delta;
        const l = count * delta;

        // Line geometry demo
        // http://threejs.org/examples/#webgl_buffergeometry_lines

        const positions = new Float32Array( count * 4 * 3 );
        //const colors = new Float32Array( count * 4 * 2 );

        let index = 0;
        for ( let i = 0; i < count; ++i ) {
            const pos = base + i * delta;

            positions[ index++ ] = pos;
            positions[ index++ ] = base;
            positions[ index++ ] = 0.0;

            positions[ index++ ] = pos;
            positions[ index++ ] = base + l;
            positions[ index++ ] = 0.0;

            positions[ index++ ] = base;
            positions[ index++ ] = pos;
            positions[ index++ ] = 0.0;

            positions[ index++ ] = base + l;
            positions[ index++ ] = pos;
            positions[ index++ ] = 0.0;
        }

        geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        geometry.computeBoundingSphere();

        const material = new THREE.LineBasicMaterial({
            color: 0x40404040
        });
        const mesh = new THREE.LineSegments( geometry, material );

        mesh.rotation.x = -Math.PI / 2;

        return new MeshComponent( mesh );
    }

    /**
     * Creates a Geometry component that represents a rendered mesh in the world.
     * @param desc Description of the mesh to be created.
     * @returns {Mesh|*|i}
     */
    static createBoxGeometry( desc ) {
        let texture = THREE.ImageUtils.loadTexture( 'game/textures/at_symbol_white-512.png' );
        //let texture = THREE.ImageUtils.loadTexture( 'game/textures/m_symbol_white-512.png' );

        let geometry = new THREE.BoxGeometry( desc.width, desc.height, desc.depth );
        let material = new THREE.MeshPhongMaterial({
            color: new THREE.Color( 0.4, 0.4, 0.4 ),
            metal: true,
            specular: 0x05050505,
            emissive: 0xFF222299,
            emissiveMap: texture
        });

        let mesh = new THREE.Mesh( geometry, material );
        mesh.castShadow = desc.castShadow === undefined ? true : desc.castShadow;
        mesh.receiveShadow = desc.receiveShadow === undefined ? true : desc.receiveShadow;

        if ( desc.position ) {
            mesh.position.x = desc.position.x;
            mesh.position.y = desc.position.y;
            mesh.position.z = desc.position.z;
        }

        // TODO: Add mesh to scene
        return new MeshComponent(mesh);
    }

    /**
     * Creates a Geometry component that represents a rendered mesh in the world.
     * @param desc Description of the mesh to be created.
     * @returns {Mesh|*|i}
     */
    static createMonsterGeometry( desc ) {
        let texture = THREE.ImageUtils.loadTexture( 'game/textures/m_symbol_white-512.png' );

        let monsterColor = desc.color || 0xFF662222;

        let geometry = new THREE.BoxGeometry( desc.width, desc.height, desc.depth );
        let material = new THREE.MeshPhongMaterial({
            color: new THREE.Color( 0.4, 0.4, 0.4 ),
            metal: true,
            shininess: 30.0,
            //specular: 0x05050505,
            emissive: monsterColor,
            emissiveMap: texture
        });

        let mesh = new THREE.Mesh( geometry, material );
        mesh.castShadow = desc.castShadow === undefined ? true : desc.castShadow;
        mesh.receiveShadow = desc.receiveShadow === undefined ? true : desc.receiveShadow;

        if ( desc.position ) {
            mesh.position.x = desc.position.x;
            mesh.position.y = desc.position.y;
            mesh.position.z = desc.position.z;
        }

        // TODO: Add mesh to scene
        return new MeshComponent(mesh);
    }

    /**
     * Creates a Geometry component that represents a rendered mesh in the world.
     * @param desc Description of the mesh to be created.
     * @returns {Mesh|*|i}
     */
    static createGroundGeometry( desc ) {
        let texture = THREE.ImageUtils.loadTexture( 'game/textures/cracked_ground.jpg' );

        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 64, 64 );

        let geometry = new THREE.PlaneBufferGeometry( desc.width, desc.height );
        let material = new THREE.MeshBasicMaterial({
            color: new THREE.Color( 0.05, 0.05, 0.05 ),
            map: texture
        });
        /*        let material = new THREE.MeshPhongMaterial({
         color: new THREE.Color( 0.3, 0.3, 0.3 ),
         specular: new THREE.Color( 0.0, 0.0, 0.0 ),//0,//0x01010101,
         map: texture
         });
         */
        let mesh = new THREE.Mesh( geometry, material );
        mesh.castShadow = desc.castShadow === undefined ? true : desc.castShadow;
        mesh.receiveShadow = desc.receiveShadow === undefined ? true : desc.receiveShadow;

        mesh.rotation.x = -Math.PI / 2;

        if ( desc.position ) {
            mesh.position.x = desc.position.x;
            mesh.position.y = desc.position.y;
            mesh.position.z = desc.position.z;
        }

        // TODO: Add mesh to scene
        return new MeshComponent(mesh);
    }
}

// TODO: Maybe componentProvider instead of .system?
NGEN.system( 'GeometryProvider', GeometryComponentProvider );
