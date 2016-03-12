/**
 * This class is used to manage all input arriving from the keyboard.
 */
class MouseHandler extends GameSystem {
    constructor() {
        super();

        this.eventReceived = false;

        this.controller = null;
        this.clientX = 0.0;
        this.clientY = 0.0;
        this.deltaX = 0.0;
        this.deltaY = 0.0;
        this.x = 0.0;
        this.y = 0.0;

        this.leftDown = false;
        this.middleDown = false;
        this.rightDown = false;

        var self = this;
        $(document.body).on( 'mousedown', function(e) {
            self.onMouseDown(e);
        });

        $(document.body).on( 'mouseup', function(e) {
            self.onMouseUp(e);
        });

        $(document.body).on( 'mouseleave', function(e) {
            self.onMouseLeave(e);
        });

        $(document.body).on( 'mouseenter', function(e) {
            self.onMouseEnter(e);
        });

        $(document.body).on( 'mousemove', function(e) {
            self.onMouseMove(e);
        });

        $( 'body' ).on( 'contextmenu', function(e) { return false; } );
    }

    onUpdate(updateArgs) {
        if ( this.eventReceived ) {
            this.deltaX = this.clientX - this.x;
            this.deltaY = this.clientY - this.y;
        } else {
            this.deltaX = 0.0;
            this.deltaY = 0.0;
        }

        this.x = this.clientX;
        this.y = this.clientY;
    }

    onMouseUp(e) {
        if ( e.button === 0 ) {
            this.leftDown = false;
        } else if ( e.button === 1 ) {
            this.middleDown = false;
        } else if ( e.button === 2 ) {
            this.rightDown = false;
        }
    }

    onMouseDown(e) {
        if ( e.button === 0 ) {
            this.leftDown = true;
        } else if ( e.button === 1 ) {
            this.middleDown = true;
        } else if ( e.button === 2 ) {
            this.rightDown = true;
        }

        //if ( e.preventDefault ) {
        //    e.preventDefault();
        //}
    }

    onMouseLeave(e) {
        this.clientX = e.clientX;
        this.clientY = e.clientY;

        this.leftDown = false;
        this.rightDown = false;
        this.middleDown = false;
    }

    onMouseEnter(e) {
        this.clientX = e.clientX;
        this.clientY = e.clientY;
    }

    onMouseMove(e) {
        this.clientX = e.clientX;
        this.clientY = e.clientY;
        this.eventReceived = true;

        //if ( e.preventDefault ) {
        //    e.preventDefault();
        //}
    }

    getDeltaX() {
        return this.deltaX;
    }

    getDeltaY() {
        return this.deltaY;
    }

    isPressed(mouseButton) {
        switch ( mouseButton ) {
            case MouseHandler.LeftButton:
                return this.leftDown;

            case MouseHandler.RightButton:
                return this.rightDown;

            case MouseHandler.MiddleButton:
                return this.middleDown;
        }

        return false;
    }
}

MouseHandler.LeftButton = 0;
MouseHandler.MiddleButton = 1;
MouseHandler.RightButton = 2;

NGEN.system( 'MouseHandler', MouseHandler );
