/**
 * This generator is used to render the sceen assigned to the active display port.
 */
class BrightPassGenerator extends GeneratorBase {
    constructor(desc) {
        super(desc);

        // Seems very heavy weight to have to create a scene, camera and quad for every generator.
        // This is what the THREE examples do, but we can probably do better in the future once it's working.
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
    }

    onInitialize(displayStage) {
        super.onInitialize(displayStage);

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                texture: { type: 't', value: this.input[ 0 ].texture },
                exposure: { type: 'f', value: 0.18 },
                exposureBias: { type: 'f', value: 2.0 },
                bloomThreshold: { type: 'f', value: 0.2 },
                W: { type: 'f', value: 11.2 }
            },
            depthWrite: false,
            depthTest: false,
            transparent: true,
            vertexShader: [
                'varying vec2 vTex;',
                '',
                'void main() {',
                ' gl_Position = vec4( position.x, position.y, 0.0, 1.0 );',
                ' vTex = uv;',
                '}'
            ].join( '\n' ),
            fragmentShader: [
                'uniform sampler2D texture;',
                'uniform float exposureBias;',
                'uniform float exposure;',
                'uniform float bloomThreshold;',
                '',
                'varying vec2 vTex;',
                '',
                'float A = 0.15;',
                'float B = 0.50;',
                'float C = 0.10;',
                'float D = 0.20;',
                'float E = 0.02;',
                'float F = 0.30;',
                'uniform float W;',
                '//float W = 0.5;//11.2;',
                '',
                'vec3 filmicTonemap( vec3 x ) {',
                '  return ( ( x * ( A * x + C * B ) + D * E ) / ( x * ( A * x + B ) + D * F ) ) - E / F;',
                '}',
                '',
                'float calcLuminance(vec3 color) {',
                '  return max( dot( color, vec3( 0.212656, 0.715158, 0.072185 ) ), 0.0001 );	// sRGB',
                '}',
                '',
                'vec3 calcExposedColor(vec3 color, float avgLuminance, float threshold, out float outExposure) {',
                ' avgLuminance = max(avgLuminance, 0.001);',
                ' float keyValue = exposure;',
                ' float linearExposure = ( keyValue / avgLuminance);',
                ' outExposure = log2(max(linearExposure, 0.0001));',
                ' //outExposure -= threshold;',
                ' return exp2(outExposure) * color;',
                '}',
                '',
                'void main() {',
                ' vec3 color = texture2D( texture, vTex ).xyz;',
                ' color = 16.0 * color;  // Hardcoded exposure constant',
                '',
                ' float avgLuminance = 0.2;',
                ' float exposure = 0.0;',
                ' float pixelLuminance = calcLuminance( color );',
                ' color = calcExposedColor(color, avgLuminance, bloomThreshold, exposure );',
                ' color = filmicTonemap( exposureBias * color );',
                ' vec3 whiteScale = 1.0 / filmicTonemap( vec3( W ) );',
                ' color *= whiteScale;',
                ' color = color - vec3( bloomThreshold );//min( color, vec3( 1.0 ) );',
                ' if ( dot( color, vec3( 0.333 ) ) <= 0.001 ) {',
                '   color = vec3( 0.0 );',
                ' }',
                '',
                ' gl_FragColor = vec4( color, 1.0 );',
                ' //gl_FragColor = vec4( vTex.x, vTex.y, 1.0, 1.0 );',
                '}'
            ].join( '\n' )
        });

        this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), this.material );

        this.scene.add( this.quad );
    }

    onRender(renderArgs) {
        this.material.uniforms.W.value = NGEN.Settings.HDR.BloomW;
        this.material.uniforms.bloomThreshold.value = NGEN.Settings.HDR.BloomThreshold;
        this.material.uniforms.exposure.value = NGEN.Settings.HDR.Exposure;
        this.material.uniforms.exposureBias.value = NGEN.Settings.HDR.ExposureBias;

        renderArgs.renderer.autoClearColor = false;
        this.output[ 0 ].onRender( renderArgs, this.scene, this.camera );
        renderArgs.renderer.autoClearColor = true;

        // TODO: Eventually scene and camera will be attached to the display port
        //renderArgs.displayStage.rendeTarget.onRender( renderArgs, renderArgs.displayPort.scene, renderArgs.displayPort.camera );
    }
}

NGEN.generator( 'BrightPass', BrightPassGenerator );

NGEN.Settings.HDR.BloomW = 2;
NGEN.Settings.HDR.BloomThreshold = 0.9;
NGEN.Settings.HDR.ExposureBias = 2.0;


class Cell {
    constructor() {
        this.x = 0.0;
        this.z = 0.0;
        this.type = Cell.SOLID;
        this.y = Number.POSITIVE_INFINITY;
        this.height = Number.POSITIVE_INFINITY;
    }
}

class TestMap {
    constructor( cellsWide, cellsDeep ) {
        this.cellSize = 1.0;
        this.baseY = 0.0;
        this.cellsWide = cellsWide;
        this.cellsDeep = cellsDeep;
        this.cells = [];
        this.invalidCell = new Cell();

        const halfX = ( cellsWide * this.cellSize  ) / 2;
        const halfZ = ( cellsDeep * this.cellSize ) / 2;

        for ( let z = 0; z < cellsDeep; ++z ) {
            for ( let x = 0; x < cellsWide; ++x ) {
                const cell = new Cell();

                cell.x = x * this.cellSize - halfX + this.cellSize / 2;
                cell.z = z * this.cellSize - halfZ + this.cellSize / 2;
            }
        }
    }

    getCell(x,z) {
        if ( x >= 0 && x < this.cellsWide ) {
            if ( z >= 0 && z < this.cellsDeep ) {
                return this.cells[ z * this.cellsWide + x ];
            }
        }

        return this.invalidCell;
    }

    getCellType(x,z) {
        if ( x >= 0 && x < this.cellsWide ) {
            if ( z >= 0 && z < this.cellsDeep ) {
                return this.cells[ z * this.cellsWide + x ].type;
            }
        }

        return this.invalidCell.type;
    }

    buildGeometry(mesh) {
        for ( let z = 0; z < this.cellsDeep; ++z ) {
            for ( let x = 0; x < this.cellsWide; ++x ) {
                this.buildCellGeometry(mesh,x,z);
            }
        }
    }

    buildCellGeometry(mesh,x,z) {
        const cell = this.getCell(x,z);

        if ( cell.type === Cell.EMPTY ) {
            const halfSize = this.cellSize / 2;

            if ( this.getCellType(x-1,z) === Cell.SOLID ) {
                const baseVertex = mesh.getPointCount();

                const x = cell.x - halfSize;

                mesh.addPoint( x, py, pz );
                mesh.addPoint( x, py, pz );
                mesh.addPoint( x, ny, pz );
                mesh.addPoint( x, ny, nz );

                // Build west wall
                mesh.addQuad( baseVertex + 0, baseVertex + 1, baseVertex + 2, baseVertex + 3 );
            }

            if ( this.getCellType(x,z-1) === Cell.SOLID ) {
                const baseVertex = mesh.getPointCount();

                const z = cell.z - halfSize;

                mesh.addPoint( nx, ny, z );
                mesh.addPoint( nx, ny, z );
                mesh.addPoint( nx, ny, z );
                mesh.addPoint( nx, ny, z );

                // Build north wall
                mesh.addQuad( baseVertex + 0, baseVertex + 1, baseVertex + 2, baseVertex + 3 );
            }

            if ( this.getCellType(x+1,z) === Cell.SOLID ) {
                const baseVertex = mesh.getPointCount();

                const x = cell.x + halfSize;

                mesh.addPoint( x, py, pz );
                mesh.addPoint( x, py, pz );
                mesh.addPoint( x, ny, pz );
                mesh.addPoint( x, ny, nz );

                // Build east wall
                mesh.addQuad( baseVertex + 0, baseVertex + 1, baseVertex + 2, baseVertex + 3 );
            }

            if ( this.getCellType(x,z+1) === Cell.SOLID ) {
                const baseVertex = mesh.getPointCount();

                const z = cell.z + halfSize;

                mesh.addPoint( nx, ny, z );
                mesh.addPoint( nx, ny, z );
                mesh.addPoint( nx, ny, z );
                mesh.addPoint( nx, ny, z );

                // Build south wall
                mesh.addQuad( baseVertex + 0, baseVertex + 1, baseVertex + 2, baseVertex + 3 );
            }

            // Add floor
            const floorBaseVertex = mesh.getPointCount();

            const floorx = cell.x - halfSize;
            const floory = cell.y;
            const floorz = cell.z - halfSize;

            mesh.addPoint( floorx, floory, floorz );
            mesh.addPoint( floorx + this.cellSize, floory, floorz );
            mesh.addPoint( floorx + this.cellSize, floory, floorz + this.cellSize );
            mesh.addPoint( floorx, floory, floorz + this.cellSize );

            mesh.addQuad( floorBaseVertex + 0, floorBaseVertex + 1, floorBaseVertex + 2, floorBaseVertex + 3 );

            // TODO: Add Ceiling
        }
    }
}


Cell.SOLID      = 0;
Cell.EMPTY      = 1;

class MapGenerator {
    constructor() {
        this.map = null;
        this.mesh = null;
    }

    generate( cellsWide, cellsDeep ) {
        this.map = new TestMap( cellsWide, cellsDeep );
        this.mesh = new Mesh();

        const startX = 1;
        const startZ = 1;
        const endX = cellsWide - 1;
        const endZ = cellsDeep - 1;

        for ( let z = startZ; z < endZ; ++z ) {
            for ( let x = startX; x < endX; ++x ) {
                const cell = this.map.getCell( x, z );

                cell.type = Cell.EMPTY;
                cell.y = 0.0;
            }
        }

        this.map.buildGeometry( this.mesh );
    }
}

