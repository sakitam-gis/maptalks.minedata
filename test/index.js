describe('index', function () {
    var container, map;
    beforeEach(function () {
        minemap.accessToken = '25cc55a69ea7422182d00d6b7c0ffa93';
        minemap.solution = 2365;
        container = document.createElement('div');
        container.style.width = '400px';
        container.style.height = '300px';
        document.body.appendChild(container);
        map = new maptalks.Map(container, {
            center: [116.46,39.92],
            zoom: 5
        });
    });

    afterEach(function () {
        map.remove();
        maptalks.DomUtil.removeDomNode(container);
    });

    it('create mineLayer', function (done) {
        var baseLayer = new maptalks.MineLayer('tile',{
            glOptions : {
                'style' : '//minedata.cn/service/solu/style/id/2365'
            }
        }).on('layerload', function () {
            done()
        });
        map.addLayer(baseLayer);
    });
});
