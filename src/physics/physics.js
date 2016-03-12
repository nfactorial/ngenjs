/**
 * Used to manage the physical representation of the game world.
 * This physics implementation is very simple, we don't need anything complicated
 * for what we're trying to achieve currently. If we want to add more complicated
 * physical properties in the future we will probably use a third-party physics engine.
 */
class Physics extends GameSystem {
    /**
     *
     */
    constructor() {
        super();

        this.objectList = [];
        this.gravity = { x: 0, y: -9.807, z: 0 };
        this.floor = { x: 0, y: 1, z: 0, d: 0 };
    }

    /**
     * Performs any per-frame processing necessary within the physics system.
     * @param updateArgs
     */
    onUpdate(updateArgs) {
        let count = this.objectList.length;
        for ( let loop = 0; loop < count; ++loop ) {
            this.objectList[ loop ].applyForce(this.gravity.x, this.gravity.y, this.gravity.z);
            this.objectList[ loop ].onUpdate(updateArgs);
        }

        // TODO: Resolve collisions, for now we'll just hard code a floor and the box size (really bad!).
        for ( let loop = 0; loop < count; ++loop ) {
            let obj = this.objectList[ loop ];

            // Dot floor normal with object position.
            let d =   obj.position.x*this.floor.x
                + obj.position.y*this.floor.y
                + obj.position.z*this.floor.z
                - this.floor.d;

            // If the object intersects the floor, push it back out
            if ( d < obj.dimensions.height ) {      // Hard coded to height, should be based on orientation
                obj.position.x += this.floor.x * ( obj.dimensions.height - d );
                obj.position.y += this.floor.y * ( obj.dimensions.height - d );
                obj.position.z += this.floor.z * ( obj.dimensions.height - d );

                // Also cut the velocity that is causing the object to penetrate our object
                obj.velocity.x -= this.floor.x*obj.velocity.x;
                obj.velocity.y -= this.floor.y*obj.velocity.y;
                obj.velocity.z -= this.floor.z*obj.velocity.z;
            }
        }
    }

    /**
     * Creates a new physical box primitive within the scene.
     * @param width
     * @param height
     * @param depth
     * @returns {Physics.Primitive}
     */
    createBox(width,height,depth) {
        var primitive = new Physics.Primitive(width, height, depth);
        this.objectList.push( primitive );
        return primitive;
    }
}


/**
 * Base class for all physical primitives.
 * The current implementatino does not simulate angular velocity. So you cannot current apply a force at a particular
 * location on the object. This will be added in the future.
 * @type {Physics.Primitive}
 */
Physics.Primitive = class extends Component {
    constructor(w, h, d) {
        super();

        this.dimensions = { width: w/2, height: h/2, depth: d/2 };
        this.position = new THREE.Vector3( 0.0, 0.0, 0.0 );
        this.velocity = new THREE.Vector3( 0.0, 0.0, 0.0 );
        this.impulse = new THREE.Vector3( 0.0, 0.0, 0.0 );
        this.force = new THREE.Vector3( 0.0, 0.0, 0.0 );
        this.cor = 1.0;     // Coefficient of restitution
        this.damping = 0.8;
    }

    setPosition(x,y,z) {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;

        return this;
    }

    /**
     * Applies a force to the object in world space.
     * @param fx
     * @param fy
     * @param fz
     */
    applyForce(fx, fy, fz) {
        this.force.x += fx;
        this.force.y += fy;
        this.force.z += fz;

        return this;
    }

    /**
     * Applies a force to the object in its local space.
     * @param fx
     * @param fy
     * @param fz
     */
    applyLocalForce(fx,fy,fz) {
        // TODO: Rotate force to objects world space and call applyForce.
        this.force.x += fx;
        this.force.y += fy;
        this.force.z += fz;

        return this;
    }

    /**
     * Applies an impulsive force to the object in world space. An impulsive force directly affects the objects velocity. Impulsive
     * forces are not really physically correct and you should prefer to apply forces with the applyForce when possible.
     * @param ix
     * @param iy
     * @param iz
     */
    applyImpulse(ix,iy,iz) {
        this.impulse.x += ix;
        this.impulse.y += iy;
        this.impulse.z += iz;

        return this;
    }

    /**
     * Applies an impulsive force to the object in local space. An impulsive force directly affects the objects velocity. Impulsive
     * forces are not really physically correct and you should prefer to apply forces with the applyForce when possible.
     * @param ix
     * @param iy
     * @param iz
     */
    applyLocalImpulse(ix,iy,iz) {
        // TODO: Rotate force to objects world space and call applyImpulse
        this.impulse.x += ix;
        this.impulse.y += iy;
        this.impulse.z += iz;

        return this;
    }

    /**
     * Updates the primitives location and velocity.
     * @param updateArgs
     */
    onUpdate(updateArgs) {
        this.velocity.x += this.impulse.x + this.force.x * updateArgs.deltaTime;
        this.velocity.y += this.impulse.y + this.force.y * updateArgs.deltaTime;
        this.velocity.z += this.impulse.z + this.force.z * updateArgs.deltaTime;

        // Apply damping?
        /*        let str = this.velocity.lengthSq();
         if ( str ) {
         str = Math.sqrt(str);
         str = str * str;

         this.velocity.x -= this.velocity.x * str * this.damping * updateArgs.deltaTime;
         this.velocity.y -= this.velocity.y * str * this.damping * updateArgs.deltaTime;
         this.velocity.z -= this.velocity.z * str * this.damping * updateArgs.deltaTime;
         }
         */
        //this.velocity.x -= this.velocity.x * this.damping * updateArgs.deltaTime;
        //this.velocity.y -= this.velocity.y * this.damping * updateArgs.deltaTime;
        //this.velocity.z -= this.velocity.z * this.damping * updateArgs.deltaTime;

        const theta = 1.0 - this.damping * updateArgs.deltaTime;
        this.velocity.multiplyScalar( theta );

        // Clear the forces affecting this object for the next frame.
        this.impulse.x = 0;
        this.impulse.y = 0;
        this.impulse.z = 0;
        this.force.x = 0;
        this.force.y = 0;
        this.force.z = 0;

        // Now apply forces to the objects velocity
        this.position.x += this.velocity.x * updateArgs.deltaTime;
        this.position.y += this.velocity.y * updateArgs.deltaTime;
        this.position.z += this.velocity.z * updateArgs.deltaTime;
    }
};

NGEN.system("Physics", Physics);
