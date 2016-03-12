"use strict";

/**
 * nGen is a game framework for JavaScript.
 * This framework is intended to be agnostic of rendering engine used, though there is currently
 * some minor tight coupling to Babylon.js, this will be removed in the future.
 *
 * (c)2015 nfactorial
 */
class NgenCore {
    constructor() {
        this.counter = 0;

        this.systemRegistry = new Map();
        this.generatorRegistry = new Map();

        this.paused = false;
        this.displayManager = null;
        this.canvas = null;
        this.renderer = null;
        this.renderScene = null;
        this.element = null;
        this.babylonEngine = null;
        this.updateList = [];
        this.stateTree = null;
        this.timeStamp = 0;
        this.display = {
            width: 0,
            height: 0
        };
        this.renderer = null;
        this.updateArgs = {
            deltaTime: 1.0 / 60,
            camera: null
        };
        this.renderArgs = null;

        // TODO: The followig should be encapsulated within a 'CameraArgs' object?
        this.camera = null;
        this.fieldOfView = 75.0;
        this.near = 1;
        this.far = 1;

        this.Settings = {
            HDR: {}
        };
    }

    /**
     * Registers a new system object with the NGEN game engine.
     * @param name The name to register the object as.
     * @param ctor The constructor function to call when a new instance is created.
     */
    system( name, ctor ) {
        if ( this.systemRegistry.get( name ) ) {
            throw new Error( 'Cannot register system \'' + name + '\', name has already been registered.' );
        }

        if ( !ctor ) {
            throw new Error( 'Cannot register system \'' + name + '\' without a constructor.' );
        }

        this.systemRegistry.set( name, ctor );
    }

    /**
     * Registers a new generator object with the NGEN game system.
     * @param name The name to register the object as.
     * @param ctor The constructor function to call when a new instance is created.
     */
    generator( name, ctor ) {
        if ( this.generatorRegistry.get( name ) ) {
            throw new Error( 'Cannot register generator \'' + name + '\', name has already been registered.' );
        }

        if ( !ctor ) {
            throw new Error( 'Cannot register generator \'' + name + '\' without a constructor.' );
        }

        this.generatorRegistry.set( name, ctor );
    }

    /**
     * Creates a new instance of a registered system object.
     * @param name
     * @returns {*}
     */
    createSystem( name ) {
        const system = this.systemRegistry.get( name );

        if ( !system ) {
            throw new Error( 'Cannot create system \'' + name + '\', system has not been registered.' );
        }

        return new system();
    }

    /**
     * Creates a new instance of a registered generator object..
     * @param name
     * @param desc
     * @returns {*}
     */
    createGenerator( name, desc ) {
        const generator = this.generatorRegistry.get( name );

        if ( !generator ) {
            throw new Error( 'Cannot create generator \'' + name + '\', generator has not been registered.' );
        }

        return new generator( desc );
    }

    /**
     * Registers a scene for rendering by NGEN, currently only one scene may be registered however that may change
     * in the future. Possibly the scene should be associated with the display port rather then with NgenCore.
     * @param scene
     */
    registerScene( scene ) {
        this.renderScene = scene;
    }

    static getTimeStamp() {
        //console.log( 'now = ' + Date.now() );
        //return Date.now();
        //return window.performance.webkitNow();;
        return window.performance && window.performance.now ? window.performance.now() : new Date.now();
    }

    /**
     * Computes the linear interpolation of two points.
     * @param a The starting value to be interpolated.
     * @param b The second value to be interpolated.
     * @param t The interpolation factor (in the [0..1] range.
     * @returns {*} The computed result.
     */
    static lerp( a, b, t ) {
        return a + t * ( b - a );
    }

    /**
     * Rotates a point in-place around the z-axis.
     * @param point {THREE.Vector3} The point to be rotated.
     * @param rotation {Number} The angle (in radians) to be rotated.
     * @returns {THREE.Vector3} The transformed point to allow for chained calls.
     */
    static rotateZ( point, rotation ) {
        const phi = Math.cos( rotation );
        const theta = Math.sin( rotation );

        const nx = point.x * phi - point.y * theta;
        const ny = point.x * theta + point.y * phi;

        point.x = nx;
        point.y = ny;

        return point;
    }

    /**
     * Called each frame when any per-frame processing should be evaluated.
     * @param updateArgs
     */
    onUpdate(updateArgs) {
        if ( !this.paused ) {
            let count = NGEN.updateList.length;
            for ( var loop = 0; loop < count; ++loop ) {
                this.updateList[ loop ].onUpdate( updateArgs );
            }

            if ( this.stateTree ) {
                this.stateTree.onUpdate( updateArgs );
            }
        }
    }

    /**
     * Called each frame when it's time to render the titles display.
     */
    onRender() {
        // TODO: Scene will eventually come from the game state
        this.renderArgs.scene = this.scene;
        this.renderArgs.camera = this.camera;

        this.displayManager.onRender( this.renderArgs );
    }

    /**
     * Prepares nGen for use by the running application.
     * @param canvas The canvas surface to be rendered to.
     */
    initialize( canvas ) {
        this.stateTree = new StateTree();

        // Add resize handler
        window.addEventListener( 'resize', function() {
            NGEN.babylonEngine.resize();
        });

        this.canvas = canvas;
        this.displayManager = new DisplayManager();
        this.babylonEngine = new BABYLON.Engine( canvas, true );

        this.updateArgs.deltaTime = 1.0 / 60.0;
        this.updateArgs.changeState = function( stateName ) {
            NGEN.stateTree.changeState( stateName );
        };

        this.babylonEngine.runRenderLoop( function() {
            var count = NGEN.updateList.length;
            for ( var loop = 0; loop < count; ++loop ) {
                NGEN.updateList[ loop ].onUpdate( NGEN.updateArgs );
            }

            if ( NGEN.stateTree ) {
                NGEN.stateTree.onUpdate( NGEN.updateArgs );
            }

            if ( NGEN.renderScene ) {
                NGEN.renderScene.render();
            }
        });
    }

    /**
     * This initialize method is used to prepare NGEN for use with THREE.js, eventually both initialize methods
     * will be combined into a single one that is configured by the application definition, but that isn't availale
     * yet.
     * @param element
     * @param width
     * @param height
     */
    initializeThree( element, width, height ) {
        this.display.width = width;
        this.display.height= height;
        this.renderArgs = new RenderArgs();
        this.displayManager = new DisplayManager();
        this.shaderProvider = new ShaderProvider();

        this.displayManager.setDisplaySize( width, height );

        this.element = element;
        this.stateTree = new StateTree();
        this.scene = new THREE.Scene();     // TODO: Should be inside the 'World' object
        this.camera = new THREE.PerspectiveCamera( this.fieldOfView, width / height, 1, 1000 );
        this.camera.position.y = 28;
        this.camera.position.z = 38;

        this.renderer = new THREE.WebGLRenderer({ antialias: false });
        this.renderer.gammeInput = false;
        this.renderer.gammaOutput = false;
        this.renderer.setSize(this.display.width, this.display.height);
        this.renderer.setClearColor(0x00000000, 1);

        this.renderArgs.renderer = this.renderer;

        // TEMP: Need a light to see stuff at the moment...
        var light = new THREE.DirectionalLight(0xffffff, 0.4);//12);
        light.color.setHSL(0.3, 0.6, 0.95);
        light.position.set(2, 1.75, 2);
        light.position.multiplyScalar(50);
        this.scene.add(light);

        this.element.appendChild(this.renderer.domElement);

        // TODO: Check if fat arrow works, instead of using a closure
        var self = this;
        /*        window.addEventListener('resize', function() {
         self.display.width = window.innerWidth;
         self.display.height= window.innerHeight;
         if ( self.camera ) {
         self.camera.aspect = self.display.width / self.display.height;
         self.camera.updateProjectionMatrix();
         }
         });
         */
        var internalUpdate = function() {
            if ( !self.timeStamp ) {
                self.timeStamp = NgenCore.getTimeStamp();
            } else {
                var now = NgenCore.getTimeStamp();
                self.updateArgs.deltaTime = ( now - self.timeStamp ) / 1000;
                self.updateArgs.camera = self.camera;
                self.timeStamp = now;

                if ( self.updateArgs.deltaTime < 0.5 ) {
                    self.updateArgs.timer += self.updateArgs.deltaTime;
                    self.onUpdate( self.updateArgs );
                    self.onRender();
                }
            }

            requestAnimationFrame( internalUpdate );
        };

        requestAnimationFrame(internalUpdate);
    }
}


var NGEN = new NgenCore();
