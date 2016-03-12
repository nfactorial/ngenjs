
class CameraComponent extends Component {
    constructor() {
        super();

        this.physics = null;
        this.distance = 7.0;
        this.rotationY = 0.0;
        this.rotationX = 0.0;
        this.direction = { x: 0, y: 0, z: 0 };
        this.position = { x: 0, y: 0, z: 1 };
        this.delta = { x: 0, y: 0, z: 0 };
        this.fieldOfView = 75.0;
        this.nearPlane = 1.0;
        this.farPlane = 1000.0;
        this.up = new THREE.Vector3( 0.0, 1.0, 0.0 );
        this.target = new THREE.Vector3( 0.0, 0.0, 0.0 );
        this.targetOffset = new THREE.Vector3( 0.0, 1.0, 0.0 );
        this.matrix = new THREE.Matrix4();
        this.orientation = new THREE.Quaternion();
    }

    onInitialize(initArgs) {
        super.onInitialize(initArgs);

        this.physics = initArgs.getComponent('Physics');
    }

    onUpdate(updateArgs) {
        this.direction.x = Math.sin( this.rotationY ) * Math.cos( this.rotationX );
        this.direction.y = Math.sin( this.rotationX );
        this.direction.z = Math.cos( this.rotationY ) * Math.cos( this.rotationX );

        if ( this.physics ) {
            this.position.x = this.physics.position.x + this.direction.x * this.distance;
            this.position.y = this.physics.position.y + this.direction.y * this.distance;
            this.position.z = this.physics.position.z + this.direction.z * this.distance;

            this.position.y += 3;

            this.target.copy( this.physics.position );
            this.target.add( this.targetOffset );
        } else {
            this.position.x = this.direction.x * 10.0;
            this.position.y = this.direction.y * 10.0;
            this.position.z = this.direction.z * 10.0;
        }

        //this.matrix.lookAt( this.physics.position, this.position, this.up );
        this.matrix.lookAt( this.position, this.target, this.up );
        this.orientation.setFromRotationMatrix( this.matrix );
    }

    getCameraArgs(cameraArgs) {
        cameraArgs.fov = this.fieldOfView;
        cameraArgs.near = this.nearPlane;
        cameraArgs.far = this.farPlane;

        cameraArgs.position.x = this.position.x;
        cameraArgs.position.y = this.position.y;
        cameraArgs.position.z = this.position.z;

        cameraArgs.rotation.setFromQuaternion( this.orientation );
    }
}