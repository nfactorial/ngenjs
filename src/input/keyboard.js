/**
 * This class is used to manage all input arriving from the keyboard.
 */
class KeyboardHandler extends GameSystem {
    constructor() {
        super();

        this.controller = null;
        this.keyState = [];

        for ( let loop = 0; loop < 256; ++loop ) {
            this.keyState.push({
                isPressed: false
            });
        }

        var self = this;
        $(document.body).on( 'keydown', function(e) {
            self.onKeyDown(e);
        });

        $(document.body).on( 'keyup', function(e) {
            self.onKeyUp(e);
        });
    }

    onKeyUp(e) {
        //console.log( 'KeyUp');

        if ( e.keyCode < 0 || e.keyCode >= this.keyState.length ) {
            throw new Error( 'Key press was an unknown character code!' );
        }

        this.keyState[ e.keyCode ].isPressed = false;
    }

    onKeyDown(e) {
        //console.log( 'Key pressed = ' + e + '.' );
        //console.log( e );

        if ( e.keyCode < 0 || e.keyCode >= this.keyState.length ) {
            throw new Error( 'Key press was an unknown character code!' );
        }

        this.keyState[ e.keyCode ].isPressed = true;
    }

    isPressed(keyCode) {
        return this.keyState[ keyCode ].isPressed;
    }
}

NGEN.system( 'KeyboardHandler', KeyboardHandler );
