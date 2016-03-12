/**
 * Simple object to contain variables associated with the frame being rendered.
 *
 *  time {Number} Contains the current time within the game title.
 *  scene {Scene} Contains the current scene object being rendered.
 *  renderer {WebGLRenderer} Contains the GPU rendering object.
 *  displayPort {DisplayPort} Contains the display port currently being rendered.
 *  displayStage {DisplayStage} Contains the display stage being rendered.
 *  displayManager {DisplayManager} Contains the display manager for the current rendered frame.
 *
 *  Some of these variables may be null depending on where in the rendered frame we are.
 */
class RenderArgs {
    constructor() {
        this.time = 0;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.displayPort = null;
        this.displayStage = null;
        this.displayManager = null;
    }
}