/**
 * Provides a simple api for rendering 2D elements onto the display.
 * NOTE: This class has no relation to the HTML canvas object, instead it uses the OpenGL renderer.
 *
 * During rendering the canvas object may be accessed at certain points.
 *
 * NOTE: This list represents only initial thoughts and may change during development.
 *
 * pre-ui   - Allows 2D objects to be rendered before the user interface has been rendered.
 * ui       - Allows 2D objects to be rendered that represent the user interface.
 * post-ui  - Allows 2D objects to be rendered that are overlayed over the user interface.
 * system   - The system layer is rendered last and appears above all over layers, should be reserved for system objects only to ensure visibility.
 */
class Canvas {
    constructor() {
        //
    }

    drawLine(x1, y1, x2, y2, color) {
        //

        return this;
    }
}