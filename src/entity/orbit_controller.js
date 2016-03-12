/**
 * Provides input control for a camera that orbits a location in 3D space.
 */
class OrbitController extends Component {
    constructor() {
        super();

        this.halfPI = Math.PI / 2.0;
        this.origin = new THREE.Vector3( 0.0, 0.0, 0.0 );

        this.distance = 10.0;

        this.geometry = null;
        this.camera = null;

        this.keyboardHandler = null;
        this.mouseHandler = null;

        this.movement = new THREE.Vector3();
        this.matrix = new THREE.Matrix4();
    }

    /**
     * Called by the framework when we are ready to be used by the title.
     * @param initArgs {EntityInitArgs} The EntityInitArgs for the entity being initialized.
     */
    onInitialize(initArgs) {
        super.onInitialize(initArgs);

        this.camera = initArgs.getComponent( 'Camera' );

        this.keyboardHandler = initArgs.getSystem( 'KeyboardHandler' );
        this.mouseHandler = initArgs.getSystem( 'MouseHandler' );
    }

    /**
     * Applies the current movement to the players character.
     * @param updateArgs
     */
    onUpdate(updateArgs) {
        if ( this.camera && this.mouseHandler ) {
            if ( this.mouseHandler.isPressed( MouseHandler.LeftButton ) ) {
                const deltaY = OrbitController.INVERT_Y ? -this.mouseHandler.getDeltaY() : this.mouseHandler.getDeltaY();

                this.camera.rotationY -= Math.PI * 2 * this.mouseHandler.getDeltaX() * OrbitController.MOUSE_SENSITIVITY * updateArgs.deltaTime;
                this.camera.rotationX += Math.PI * 2 * deltaY * OrbitController.MOUSE_SENSITIVITY * updateArgs.deltaTime;

                this.camera.rotationX = Math.max( -this.halfPI, this.camera.rotationX );
                this.camera.rotationX = Math.min(  this.halfPI, this.camera.rotationX );
            }
        }
    }
}

// Eventually these properties will be exposed in the editor, for now they're globally accessible variables so they
// can be modified via the Javascript console.
OrbitController.TWO_PI     = Math.PI * 2;
OrbitController.INVERT_Y   = false;
OrbitController.MOUSE_SENSITIVITY = 0.1;
