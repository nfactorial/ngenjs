/**
 * Represents a renderable mesh component within the game.
 */
class MeshComponent extends Component {
    constructor(mesh) {
        super();

        this.mesh = mesh;
    }

    /**
     * Called by the framework when it's time for us to initialize ourselves.
     * @param entity {Entity} The entity to which we belong.
     */
    onInitialize(entity) {
        super.onInitialize(entity);
        console.log( 'adding mesh to scene');
        NGEN.scene.add(this.mesh);
    }

    /**
     * Assigns a position to the rendered geometry.
     * @param x {Number} Distance along the x axis.
     * @param y {Number} Distance along the y axis.
     * @param z {Number} Distance along the z axis.
     */
    setPosition( x, y, z ) {
        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.position.z = z;
    }
}