# maptalks.minedata

[![Greenkeeper badge](https://badges.greenkeeper.io/sakitam-gis/maptalks.minedata.svg)](https://greenkeeper.io/)


A plugin to add [minedata](http://www.minedata.cn/index)
 as a layer for [maptalks.js](https://github.com/maptalks/maptalks.js).

## Examples

* [demo](https://sakitam-gis.github.io/maptalks.minedata/demo/)

## Install
  
* Install with npm: ```npm install @sakitam-gis/maptalks.minedata```. 
* Use unpkg CDN: ```https://unpkg.com/@sakitam-gis/maptalks.minedata/dist/maptalks.minedata.min.js```

## Usage

As a plugin, `maptalks.minedata` must be loaded after `maptalks.js` 
and `minedata` in browsers.

```html
<div id="map"></div>
<script src="../lib/minemap.js"></script>
<script src="../node_modules/maptalks/dist/maptalks.js"></script>
<script src="../dist/maptalks.minedata.js"></script>
<script type="text/javascript">
    minemap.accessToken = '25cc55a69ea7422182d00d6b7c0ffa93';
    minemap.solution = 2365;
    var baseLayer = new maptalks.MineLayer('tile',{
        glOptions : {
            'style' : '//minedata.cn/service/solu/style/id/2365'
        }
    }).on('layerload', function () {
        // start();
    });

    var map = new maptalks.Map('map', {
        center: [116.46,39.92],
        zoom: 16,
        baseLayer: baseLayer
    });
</script>
```

## Supported Browsers

IE 11, Chrome, Firefox, other modern and mobile browsers support WebGL.

## API Reference

```MineLayer``` is a subclass of [maptalks.Layer](https://maptalks.github.io/docs/api/Layer.html) and inherits all the methods of its parent.

### `Constructor`

```javascript
new maptalks.MineLayer(id, options)
```

* id **String** layer id
* options **Object** options
    * glOptions **Object** MineLayer creation options defined in [minedata](http://www.minedata.cn/develop)
    * other options defined in [maptalks.Layer](https://maptalks.github.io/docs/api/Layer.html)

### `getGlMap()`

get minedata map instance used by the layer

**Returns** `Map`

### `toJSON()`

export the layer's JSON.

```javascript
var json = MineLayer.toJSON();
```

**Returns** `Object`

## Contributing

We welcome any kind of contributions including issue reportings, pull requests, documentation corrections, feature requests and any other helps.

## Develop

The only source file is ```index.js```.

It is written in ES6, transpiled by [babel](https://babeljs.io/) and tested with [mocha](https://mochajs.org) and [expect.js](https://github.com/Automattic/expect.js).

### Scripts

* Install dependencies
```shell
$ npm install
```

* Watch source changes and generate runnable bundle repeatedly
```shell
$ gulp watch
```

* Tests
```shell
$ npm test
```

* Watch source changes and run tests repeatedly
```shell
$ gulp tdd
```

* Package and generate minified bundles to dist directory
```shell
$ gulp minify
```

* Lint
```shell
$ npm run lint
```
