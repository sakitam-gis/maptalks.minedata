import * as maptalks from 'maptalks';

const options = {
    'renderer': 'dom',
    'container': 'back',
    'glOptions': {
        'style': '//minedata.cn/service/solu/style/id/2365'
    }
};

export class MineLayer extends maptalks.Layer {
    /**
     * Reproduce a MineLayer from layer's profile JSON.
     * @param  {Object} json - layer's profile JSON
     * @return {MineLayer}
     * @static
     * @private
     * @function
     */
    static fromJSON(json) {
        if (!json || json['type'] !== 'MineLayer') {
            return null;
        }
        return new MineLayer(json['id'], json['options']);
    }

    getGlMap() {
        const renderer = this._getRenderer();
        if (renderer) {
            return renderer.glmap;
        }
        return null;
    }

    /**
     * Export the MineLayer's JSON.
     * @return {Object} layer's JSON
     */
    toJSON() {
        return {
            'type': this.getJSONType(),
            'id': this.getId(),
            'options': this.config()
        };
    }
}

MineLayer.mergeOptions(options);

MineLayer.registerJSONType('MineLayer');

MineLayer.registerRenderer('dom', class {

    constructor(layer) {
        this.layer = layer;
    }

    getMap() {
        if (!this.layer) {
            return null;
        }
        return this.layer.getMap();
    }

    show() {
        if (this._container) {
            this.render();
            this._show();
        }
    }

    hide() {
        if (this._container) {
            this._hide();
            this.clear();
        }
    }

    remove() {
        delete this.layer;
        if (this.glmap) {
            this.glmap.remove();
        }
        if (this._container) {
            maptalks.DomUtil.removeDomNode(this._container);
        }
        delete this._container;
        delete this.glmap;
    }

    clear() {
        if (this._container) {
            this._container.innerHTML = '';
        }
    }

    setZIndex(z) {
        this._zIndex = z;
        if (this._container) {
            this._container.style.zIndex = z;
        }
    }

    needToRedraw() {
        const map = this.getMap();
        const renderer = map._getRenderer();
        return map.isInteracting() || renderer && renderer.isViewChanged();
    }

    render() {
        if (!this._container) {
            this._createLayerContainer();
        }
        if (!this.glmap) {
            const map = this.getMap();
            const center = map.getCenter();
            const options = maptalks.Util.extend({}, this.layer.options['glOptions'], {
                container: this._container,
                center: new minemap.LngLat(center.x, center.y),
                zoom: map.getZoom() - 1
            });
            this.glmap = new minemap.Map(options);
            this.glmap.on('load', () => {
                this.layer.fire('layerload');
            });
        }
        this._syncMap();
    }

    drawOnInteracting() {
        const map = this.getMap();
        if (!this.glmap || !map) {
            return;
        }
        this._syncMap();
    }

    getEvents() {
        return {
            'resize': this.onResize
        };
    }

    onResize() {
        this._resize();
    }

    _createLayerContainer() {
        const container = this._container = maptalks.DomUtil.createEl('div', 'maptalks-minelayer');
        container.style.cssText = 'position:absolute;';
        this._resize();
        if (this._zIndex) {
            container.style.zIndex = this._zIndex;
        }
        const parent = this.layer.options['container'] === 'front' ? this.getMap()._panels['frontStatic'] : this.getMap()._panels['backStatic'];
        parent.appendChild(container);
    }

    _resize() {
        const container = this._container;
        if (!container) {
            return;
        }
        const size = this.getMap().getSize();
        container.style.width = size['width'] + 'px';
        container.style.height = size['height'] + 'px';
        if (this.glmap) {
            this.glmap.resize();
        }

    }

    _show() {
        this._container.style.display = '';
    }

    _hide() {
        this._container.style.display = 'none';
    }

    _syncMap() {
        const map = this.getMap();
        if (!this.glmap || !map) {
            return;
        }
        const center = map.getCenter();
        const cameraOptions = {
            'center': new minemap.LngLat(center.x, center.y),
            'zoom': getMapZoom(map.getResolution()),
            'bearing': map.getBearing(),
            'pitch': map.getPitch()
        };
        this.glmap.jumpTo(cameraOptions);
    }
});

const MAX_RES = 2 * 6378137 * Math.PI / (256 * Math.pow(2, 20));

function getMapZoom(res) {
    return 19 - Math.log(res / MAX_RES) / Math.LN2;
}
