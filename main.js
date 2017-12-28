require.config({
    baseUrl: './lib',
    paths: {
        zepto: 'https://s0.babyfs.cn/op/arch/47/8298180faa7243cea047d85ea3fdd27c/zepto/zepto.min',
        zeptoFx: 'https://s0.babyfs.cn/op/arch/47/8298180faa7243cea047d85ea3fdd27c/zepto/fx',
        map: 'https://s0.babyfs.cn/op/arch/48/75ff3b01638540488ee16b01bcb5333f/map/map',
        starts: 'https://s0.babyfs.cn/op/arch/48/3b41706efce54da781b74741a65fd3ea/starts/starts',
        request: '../RequestData',
        common: 'common',
        myApp: '../app',
        gameCountDown: '../js/gameCountDown'
    }
})

require(['myApp'])
