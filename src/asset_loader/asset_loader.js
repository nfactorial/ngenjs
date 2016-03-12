/**
 * Provides support for loading assets into the title.
 */
class AssetLoader extends GameSystem {
    constructor() {
        super();

        this.pending = [];
    }

    /**
     * Requests a particular asset be loaded into memory.
     * @param path URL of the asset to be loaded.
     * @param cb Callback to be invoked when the asset loading has completed.
     */
    loadAsset(path, cb) {
        this.pending.push({
            url: path,
            callback: cb
        });
    }

    /**
     * Performs any per-frame processing required by the AssetLoader object.
     * @param updateArgs
     */
    onUpdate(updateArgs) {
        if ( 0 != this.pending.length && !this.active ) {
            this.active = this.pending[ 0 ];
            this.pending.split(0,1);

            let self = this;

            let xhr = new window.XMLHttpRequest();
            xhr.open('GET', this.active.url, true );
            xhr.onreadystatechange = function() {
                if ( xhr.readyState === 4 ) {
                    self.active.callback( xhr.status, xhr.responseText );
                    xhr.onreadystatechange = null;
                    self.active = null;
                }
            };
        }
    }
}

NGEN.system('AssetLoader', AssetLoader );
