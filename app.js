define(['zepto', 'gameCountDown', 'request', 'map', 'preload', 'common'], function(zepto, gameCountDown, request, map, preload, common) {
    // 地图
    // map.map()

    //自定义数据流
    var MEDcountDownData = {
        "1": {
        	"aText": {
        		"element01": "pear",
                "element02": "apple",
                "element03": "peach"
        	},
        	"audioSrc": {
        		"element01": "https://t.babyfs.cn/test/ck/test20171116/pear.mp3",
                "element02": "https://t.babyfs.cn/test/ck/test20171116/apple.mp3",
                "element03": "https://t.babyfs.cn/test/ck/test20171116/peach.mp3"
        	},
        	"aImgSrc": {
        		"element01": "https://i.s.babyfs.cn/61648b7e096a4c6584bcfa9debb700ea.png",
                "element02": "https://i.s.babyfs.cn/cbe43bbf1001451c9579f0ffb082b2f4.png",
                "element03": "https://i.s.babyfs.cn/e92f622588724beea5f68a0cc84cc7c7.png"
        	}
        },
        "2": {
        	"aText": {
        		"element01": "peach",
                "element02": "pear",
                "element03": "apple"
        	},
        	"audioSrc": {
        		"element01": "https://t.babyfs.cn/test/ck/test20171116/peach.mp3",
                "element02": "https://t.babyfs.cn/test/ck/test20171116/pear.mp3",
                "element03": "https://t.babyfs.cn/test/ck/test20171116/apple.mp3"
        	},
        	"aImgSrc": {
        		"element01": "https://i.s.babyfs.cn/e92f622588724beea5f68a0cc84cc7c7.png",
                "element02": "https://i.s.babyfs.cn/61648b7e096a4c6584bcfa9debb700ea.png",
                "element03": "https://i.s.babyfs.cn/cbe43bbf1001451c9579f0ffb082b2f4.png"
        	}
        },
        "public": {
        	"gameTimes": 2
        }
    };

    var RESPONSEDATA = MEDcountDownData;
    var staticState = [
        "https://s0.babyfs.cn/op/arch/47/7dd79c7ca89240a6b8541e1d654dd191/play_slide01/bg.png",
        "https://s0.babyfs.cn/op/arch/47/7dd79c7ca89240a6b8541e1d654dd191/play_slide01/duck.png",
        "https://s0.babyfs.cn/op/arch/47/7dd79c7ca89240a6b8541e1d654dd191/play_slide01/slideFinish.png",
        "https://s0.babyfs.cn/op/arch/47/7dd79c7ca89240a6b8541e1d654dd191/play_slide01/playSlide.png",
        "https://s0.babyfs.cn/op/arch/47/7dd79c7ca89240a6b8541e1d654dd191/play_slide01/run.png",
        "https://s0.babyfs.cn/op/arch/47/7dd79c7ca89240a6b8541e1d654dd191/play_slide01/shadow.png",
        "https://s0.babyfs.cn/op/arch/47/e261ff3c9a8d473e90668a7e860fc9f7/play_slide02/slide.png",
        "https://s0.babyfs.cn/op/arch/47/e261ff3c9a8d473e90668a7e860fc9f7/play_slide02/box.png",
        "https://s0.babyfs.cn/op/arch/47/e261ff3c9a8d473e90668a7e860fc9f7/play_slide02/bridgeBox.png"
    ];

    preload.mainGame(RESPONSEDATA, '', function(num2, theImages) {
  		//调用 图片预加载 的方法。
  		theImages.concat(staticState)
  		common.preload(theImages, function() {
  			document.getElementById('loading').style.display = 'none';
  			gameCountDown.countDownStart(RESPONSEDATA, '');
  		})
  	})

  	/**
  	 * iframe通信得到的数据
  	 */
  	window.addEventListener('message', function(event) {
  		if (event.data) {
  			preload.mainGame(event.data, '', function(num2, theImages) {
  				//调用 图片预加载 的方法。
  				theImages.concat(staticState)
  				common.preload(theImages, function() {
  					document.getElementById('loading').style.display = 'none';
  					gameCountDown.countDownStart(event.data);
  				})
  			})
  		} else {
  			console.log('event.data 不存在')
  		}
  	});

  	/**
  	 * callback
  	 */
  	var callback = function(res) {
  		// 模板id 模板实例id
  		window.tem_id = res.data.entity.templateId
  		window.tem_ins_id = res.data.entity.id
  		preload.mainGame(event.data, res.data.entity.type, function(num2, theImages) {
  			theImages.concat(staticState)
  			common.preload(theImages, function() {
  				document.getElementById('loading').style.display = 'none';
  				gameCountDown.countDownStart(res.data.parsed.data, res.data.entity.type);
  			})
  		})
  	}

  	/**
  	 *
  	 */
  	// var baseUrl = 'http://192.168.0.5/api/evaluation/get_tem_ins'
  	var baseUrl = 'https://m.babyfs.cn/api/evaluation/get_tem_ins'
  	var reg = /\?tem_ins_id=/
  	var str = String(window.location)
  	if (reg.test(str)) {
  		var index = str.match(reg).index
  		var _getUrl = baseUrl + str.slice(index, str.length)
  		request.fetchData(_getUrl, callback)
  	}
  });
