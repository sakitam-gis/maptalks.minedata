/*!
 * maptalks.minedata v0.0.1
 * LICENSE : MIT
 * (c) 2016-2018 maptalks.org
 */
/*!
 * requires maptalks@^0.40.4 
 */
import { DomUtil, Layer, Util } from 'maptalks';

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var options = {
    'renderer': 'dom',
    'container': 'back',
    'glOptions': {
        'style': '//minedata.cn/service/solu/style/id/2365'
    }
};

var MineLayer = function (_maptalks$Layer) {
    _inherits(MineLayer, _maptalks$Layer);

    function MineLayer() {
        _classCallCheck(this, MineLayer);

        return _possibleConstructorReturn(this, _maptalks$Layer.apply(this, arguments));
    }

    MineLayer.fromJSON = function fromJSON(json) {
        if (!json || json['type'] !== 'MineLayer') {
            return null;
        }
        return new MineLayer(json['id'], json['options']);
    };

    MineLayer.prototype.getGlMap = function getGlMap() {
        var renderer = this._getRenderer();
        if (renderer) {
            return renderer.glmap;
        }
        return null;
    };

    MineLayer.prototype.toJSON = function toJSON() {
        return {
            'type': this.getJSONType(),
            'id': this.getId(),
            'options': this.config()
        };
    };

    return MineLayer;
}(Layer);

MineLayer.mergeOptions(options);

MineLayer.registerJSONType('MineLayer');

MineLayer.registerRenderer('dom', function () {
    function _class(layer) {
        _classCallCheck(this, _class);

        this.layer = layer;
    }

    _class.prototype.getMap = function getMap() {
        if (!this.layer) {
            return null;
        }
        return this.layer.getMap();
    };

    _class.prototype.show = function show() {
        if (this._container) {
            this.render();
            this._show();
        }
    };

    _class.prototype.hide = function hide() {
        if (this._container) {
            this._hide();
            this.clear();
        }
    };

    _class.prototype.remove = function remove() {
        delete this.layer;
        if (this.glmap) {
            this.glmap.remove();
        }
        if (this._container) {
            DomUtil.removeDomNode(this._container);
        }
        delete this._container;
        delete this.glmap;
    };

    _class.prototype.clear = function clear() {
        if (this._container) {
            this._container.innerHTML = '';
        }
    };

    _class.prototype.setZIndex = function setZIndex(z) {
        this._zIndex = z;
        if (this._container) {
            this._container.style.zIndex = z;
        }
    };

    _class.prototype.needToRedraw = function needToRedraw() {
        var map = this.getMap();
        var renderer = map._getRenderer();
        return map.isInteracting() || renderer && renderer.isViewChanged();
    };

    _class.prototype.render = function render() {
        var _this2 = this;

        if (!this._container) {
            this._createLayerContainer();
        }
        if (!this.glmap) {
            var map = this.getMap();
            var center = map.getCenter();
            var _options = Util.extend({}, this.layer.options['glOptions'], {
                container: this._container,
                center: new minemap.LngLat(center.x, center.y),
                zoom: map.getZoom() - 1
            });
            this.glmap = new minemap.Map(_options);
            this.glmap.on('load', function () {
                _this2.layer.fire('layerload');
            });
        }
        this._syncMap();
    };

    _class.prototype.drawOnInteracting = function drawOnInteracting() {
        var map = this.getMap();
        if (!this.glmap || !map) {
            return;
        }
        this._syncMap();
    };

    _class.prototype.getEvents = function getEvents() {
        return {
            'resize': this.onResize
        };
    };

    _class.prototype.onResize = function onResize() {
        this._resize();
    };

    _class.prototype._createLayerContainer = function _createLayerContainer() {
        var container = this._container = DomUtil.createEl('div', 'maptalks-minelayer');
        container.style.cssText = 'position:absolute;';
        this._resize();
        if (this._zIndex) {
            container.style.zIndex = this._zIndex;
        }
        var parent = this.layer.options['container'] === 'front' ? this.getMap()._panels['frontStatic'] : this.getMap()._panels['backStatic'];
        parent.appendChild(container);
    };

    _class.prototype._resize = function _resize() {
        var container = this._container;
        if (!container) {
            return;
        }
        var size = this.getMap().getSize();
        container.style.width = size['width'] + 'px';
        container.style.height = size['height'] + 'px';
        if (this.glmap) {
            this.glmap.resize();
        }
    };

    _class.prototype._show = function _show() {
        this._container.style.display = '';
    };

    _class.prototype._hide = function _hide() {
        this._container.style.display = 'none';
    };

    _class.prototype._syncMap = function _syncMap() {
        var map = this.getMap();
        if (!this.glmap || !map) {
            return;
        }
        var center = map.getCenter();
        var cameraOptions = {
            'center': new minemap.LngLat(center.x, center.y),
            'zoom': map.getZoom() - 1,
            'bearing': map.getBearing(),
            'pitch': map.getPitch()
        };
        this.glmap.jumpTo(cameraOptions);
    };

    return _class;
}());

export { MineLayer };

typeof console !== 'undefined' && console.log('maptalks.minedata v0.0.1, requires maptalks@^0.40.4.');
