define(['callAppFunc', 'zepto', 'zeptoFx', 'common', 'starts'], function(callAppFunc, zepto, zeptoFx, common, starts) {
	// 禁止用户缩放
	common.noScale()

	// 调用app方法 旋转横屏
  callAppFunc.passFunc('setScreenHoriz')

    var countDownStart = function(responseData, type) {

      var myWidth = document.body.clientWidth;
      // alert(myWidth)

        var MEDnumber = 0;
        var MEDCountDownData = null;
        //获取dom元素
        var bgAudio = document.getElementById('bgAudio');
        var A1 = document.getElementById("audio01");
        var A2 = document.getElementById("audio02");
        var clickLimit = false;
        var myHeight = 0;

        // 定义数组
        var arr_audioSrc = new Array;
        var arr_aImgSrc = new Array;
        var arr_aText = new Array;
        var num01 = 0;
        var num02 = 0;
        var num03 = 0;

        //实例化公用的方法--交互相关
        var utils = new common.Utils('home-page', responseData);

        //获取每一页数据的下标,并且提取数字
    		var key = utils.pageIndex().join('').replace(/[^0-9]/g, '').split('');

        //地图相关获取 qid type totalPage
        window.qid = utils.mapInterception();
        window.type = type;
        window.totalPage = responseData.public.gameTimes;

        //调用点击游戏封面，封面消失函数
        utils.cover()

        // 监测是否微信端
        function isWeixin() {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                $("body").attr("class","wx");
            } else {
                $("body").attr("class","app");
            }
        }

        //调用检测用户横竖屏函数
        utils.detectionScreen(function() {
            isWeixin()
            $('.rule').show()
            Initialization()
            optionClickEvent()
        })

        //截取路径字符串,判断当前是第几个游戏
        var xIndex = utils.urlSplice().xIndex;
        var xTotal = utils.urlSplice().xTotal;
        $('.rule').click(function() {
            if (window.qid) {
                try {
                    MtaH5.clickStat('gameTemp', {
                        'map': window.tem_id + ',' + window.tem_ins_id
                    })
                } catch (e) {
                    console.log(e);
                }
            } else {
                try {
                    MtaH5.clickStat('gameTemp', {
                        'single': window.tem_id + ',' + window.tem_ins_id
                    })
                } catch (e) {
                    console.log(e);
                }
            }
            myHeight = $(".slide").height();
            $(".slideK").height(myHeight + "px");
            $('.mack1').hide()
            $('.rule').hide()
            bgAudio.src = 'https://s0.babyfs.cn/op/arch/1/a4c7449d350348b1b7916a5dc2fb61ee/music1/bgm07.mp3'
            bgAudio.play();
            A1.src = 'https://s0.babyfs.cn/op/arch/1/e18883f669a644cf88b927de05e3802c/music0/openAudio.mp3';
            A1.play();
            // click事件
            $("#audio01").bind("ended", function() {
                $("#audio01").unbind("ended");
                clickLimit = true;
                optionClickEvent();
                A1.src = arr_audioSrc[0];
                console.log(A1.src)
                A1.play();
            })
        })

        // Initialization
        function Initialization(obj) {
            window.rightCount = 0;

            arr_audioSrc = [];
            arr_aImgSrc = [];
            arr_aText = [];
            var strHtml = '<div class="slideK">\
          <img class="slide" src="https://s0.babyfs.cn/op/arch/47/e261ff3c9a8d473e90668a7e860fc9f7/play_slide02/slide.png">\
          <p class="play-slide"><img src="https://s0.babyfs.cn/op/arch/47/7dd79c7ca89240a6b8541e1d654dd191/play_slide01/playSlide.png"></p>\
          <img class="role-stand" src="https://s0.babyfs.cn/op/arch/47/7dd79c7ca89240a6b8541e1d654dd191/play_slide01/slideFinish.png">\
          <p class="text" id="text"><span></span></p>\
          <div class="danny-move">\
              <p class="danny"></p>\
              <p class="shadow"></p>\
          </div>\
          <p class="bridge">\
              <img src="https://s0.babyfs.cn/op/arch/47/e261ff3c9a8d473e90668a7e860fc9f7/play_slide02/bridgeBox.png">\
              <img src="https://s0.babyfs.cn/op/arch/47/e261ff3c9a8d473e90668a7e860fc9f7/play_slide02/bridgeBox.png">\
              <img src="https://s0.babyfs.cn/op/arch/47/e261ff3c9a8d473e90668a7e860fc9f7/play_slide02/bridgeBox.png">\
          </p>\
          <div class="option-layer">\
              <div class="optionK">\
                  <ul class="option-box option-box01">\
                      <li class="option-box-li01" dataNum="0"><img src=""></li>\
                      <li class="option-box-li02" dataNum="0"><img src=""></li>\
                      <li class="option-box-li03" dataNum="0"><img src=""></li>\
                  </ul>\
                  <ul class="option-box option-box02">\
                      <li class="option-box-li01" dataNum="0"><img src=""></li>\
                      <li class="option-box-li02" dataNum="0"><img src=""></li>\
                      <li class="option-box-li03" dataNum="0"><img src=""></li>\
                  </ul>\
                  <ul class="option-box option-box03">\
                      <li class="option-box-li01" dataNum="0"><img src=""></li>\
                      <li class="option-box-li02" dataNum="0"><img src=""></li>\
                      <li class="option-box-li03" dataNum="0"><img src=""></li>\
                  </ul>\
              </div>\
          </div>\
          </div>';
            $("#content").html(strHtml);
            $('.content').css("background-image", "url(https://s0.babyfs.cn/op/arch/47/7dd79c7ca89240a6b8541e1d654dd191/play_slide01/bg.png)");
            console.log(key);
            MEDCountDownData = responseData[key[MEDnumber]];
            // 调取数据
            dataObtain(MEDCountDownData);

            // 暂存游戏规则相关 不同页数不同的自定义分数值
            mapScore(window.type, MEDCountDownData)
            // 暂存游戏规则相关 不同页数不同的自定义分数值
        }

        // 调取数据
        function dataObtain(MEDCountDownData) {
            function randomSort(a, b) {
                return Math.random() > 0.5 ? -1 : 1;
            }
            var arr01 = [0, 1, 2];
            var arr02 = [2, 0, 1];
            var arr03 = [1, 2, 0];
            arr01.sort(randomSort);
            arr02.sort(randomSort);
            arr03.sort(randomSort);
            // 调取json全部数据
            for (var item in MEDCountDownData.aText) {
                arr_aText.push(MEDCountDownData.aText[item]);
            }
            for (var item in MEDCountDownData.audioSrc) {
                arr_audioSrc.push(MEDCountDownData.audioSrc[item]);
            }
            for (var item in MEDCountDownData.aImgSrc) {
                arr_aImgSrc.push(MEDCountDownData.aImgSrc[item]);
            }

            // 选项随机赋值
            for (var i = 0; i < arr01.length; i++) {
                $(".option-box01 li img").eq(i).attr("src", arr_aImgSrc[arr01[i]]);
                if (arr01[i] == 0) {
                    num01 = i;
                    $(".option-box01 li").eq(i).attr("dataNum", "1");
                }
            }
            for (var i = 0; i < arr02.length; i++) {
                $(".option-box02 li img").eq(i).attr("src", arr_aImgSrc[arr02[i]]);
                if (arr02[i] == 1) {
                    num02 = i;
                    $(".option-box02 li").eq(i).attr("dataNum", "1");
                }
            }
            for (var i = 0; i < arr03.length; i++) {
                $(".option-box03 li img").eq(i).attr("src", arr_aImgSrc[arr03[i]]);
                if (arr03[i] == 2) {
                    num03 = i;
                    $(".option-box03 li").eq(i).attr("dataNum", "1");
                }
            }

            $('.mack').hide()
        }

        // optionClickEvent
        function optionClickEvent() {
            $("#text span").html(arr_aText[0]);
            A1.src = arr_audioSrc[0];
            console.log(A1.src)
            // A1.play()
            $("#text span").click(function() {
                A1.play();
            })

            function success01() {
                A2.src = "https://s0.babyfs.cn/op/arch/1/65da6abc28f04c4195a166b017588243/music/right2.mp3";
                A2.play();
            }

            function wrong01() {
                A2.src = "https://s0.babyfs.cn/op/arch/1/a4c7449d350348b1b7916a5dc2fb61ee/music1/wrong1.mp3";
                A2.play();
            }

            // box01
            if (clickLimit) {
                $(".option-box01 li").click(function() {
                    var dataNum = $(this).attr("dataNum");
                    if (dataNum == 1) {
                        $(".option-box01 li").unbind("click");
                        var num = $(this).index();
                        setTimeout(function() {
                            $(".bridge img:nth-child(1)").show();
                            $(".danny-move").animate({
                                "left": "28%"
                            }, 1000);
                        }, 900);
                        success01();

                        if (num == 0) {
                            $(this).animate({
                                "margin-top": "-1.5rem",
                                "margin-left": "1.4rem",
                                "width": "1.5rem",
                                "height": "1.41rem"
                            }, 1000, function() {
                                $(this).hide();
                                setTimeout(function() {
                                    optionBox02();
                                }, 1000);
                            })
                        } else if (num == 1) {
                            $(this).animate({
                                "margin-top": "-1.8rem",
                                "margin-left": "-1.65rem",
                                "width": "1.5rem",
                                "height": "1.41rem"
                            }, 1000, function() {
                                $(this).hide();
                                setTimeout(function() {
                                    optionBox02();
                                }, 1000);
                            })
                        } else if (num == 2) {
                            $(this).animate({
                                "margin-top": "-1.8rem",
                                "margin-left": "-4.4rem",
                                "width": "1.5rem",
                                "height": "1.41rem"
                            }, 1000, function() {
                                $(this).hide();
                                setTimeout(function() {
                                    optionBox02();
                                }, 1000);
                            })
                        }
                    } else {
                        wrong01();
                        $(this).addClass("wrong-animate");
                        setTimeout(function() {
                            $(".option-box li").removeClass("wrong-animate");
                        }, 1000)
                    }
                })
            }

            // box02
            function optionBox02() {
                $(".option-box01").removeClass("toInRight");
                $(".option-box01").addClass("toOutLeft");
                $(".option-box02").addClass("toInRight").show();
                $("#text span").html(arr_aText[1]);
                A1.src = arr_audioSrc[1];
                A1.play();

                $(".option-box02 li").click(function() {
                    var dataNum = $(this).attr("dataNum");
                    if (dataNum == 1) {
                        $(".option-box02 li").unbind("click");
                        var num = $(this).index();
                        setTimeout(function() {
                            $(".bridge img:nth-child(2)").show();
                            $(".danny-move").animate({
                                "left": "40%"
                            }, 1000);
                        }, 900);
                        success01();

                        if (num == 0) {
                            $(this).animate({
                                "margin-top": "-1.8rem",
                                "margin-left": "2.8rem",
                                "width": "1.5rem",
                                "height": "1.41rem"
                            }, 1000, function() {
                                $(this).hide();
                                setTimeout(function() {
                                    optionBox03();
                                }, 1000);
                            })
                        } else if (num == 1) {
                            $(this).animate({
                                "margin-top": "-1.8rem",
                                "margin-left": "-0.35rem",
                                "width": "1.5rem",
                                "height": "1.41rem"
                            }, 1000, function() {
                                $(this).hide();
                                setTimeout(function() {
                                    optionBox03();
                                }, 1000);
                            })
                        } else if (num == 2) {
                            $(this).animate({
                                "margin-top": "-1.8rem",
                                "margin-left": "-3rem",
                                "width": "1.5rem",
                                "height": "1.41rem"
                            }, 1000, function() {
                                $(this).hide();
                                setTimeout(function() {
                                    optionBox03();
                                }, 1000);
                            })
                        }
                    } else {
                        wrong01();
                        $(this).addClass("wrong-animate");
                        setTimeout(function() {
                            $(".option-box li").removeClass("wrong-animate");
                        }, 1000)
                    }
                })
            }
            // box03
            function optionBox03() {
                $(".option-box02").removeClass("toInRight");
                $(".option-box02").addClass("toOutLeft");
                $(".option-box03").addClass("toInRight").show();
                $("#text span").html(arr_aText[2]);
                A1.src = arr_audioSrc[2];
                A1.play();

                $(".option-box03 li").click(function() {
                    var dataNum = $(this).attr("dataNum");
                    if (dataNum == 1) {
                        success01();
                        $(".option-box03 li").unbind("click");
                        var num = $(this).index();
                        setTimeout(function() {
                            $(".bridge img:nth-child(3)").show();
                            $(".danny-move").animate({
                                "left": "52%"
                            }, 1000);
                        }, 900);

                        function success03() {
                            setTimeout(function() {
                                A2.src = "https://s0.babyfs.cn/op/arch/1/e18883f669a644cf88b927de05e3802c/music0/dannyLaugh01.mp3";
                                A2.play();
                                $(".option-box03").removeClass("toInRight");
                                $(".option-box03").addClass("toOutLeft");
                                $(".danny-move").hide();
                                $(".play-slide").show();
                                setTimeout(function() {
                                    $(".play-slide").hide();
                                    $(".role-stand").show();
                                }, 2800);
                                manyPage();
                            }, 1000);
                        }
                        if (num == 0) {
                            $(this).animate({
                                "margin-top": "-1.8rem",
                                "margin-left": "3.9rem",
                                "width": "1.5rem",
                                "height": "1.41rem"
                            }, 1000, function() {
                                $(this).hide();
                                success03();
                            })
                        } else if (num == 1) {
                            $(this).animate({
                                "margin-top": "-1.8rem",
                                "margin-left": "1.1rem",
                                "width": "1.5rem",
                                "height": "1.41rem"
                            }, 1000, function() {
                                $(this).hide();
                                success03();
                            })
                        } else if (num == 2) {
                            $(this).animate({
                                "margin-top": "-1.8rem",
                                "margin-left": "-2rem",
                                "width": "1.5rem",
                                "height": "1.41rem"
                            }, 1000, function() {
                                $(this).hide();
                                success03();
                            })
                        }
                    } else {
                        wrong01();
                        $(this).addClass("wrong-animate");
                        setTimeout(function() {
                            $(".option-box li").removeClass("wrong-animate");
                        }, 1000)
                    }
                })
            }

        }

        // repeat
        function manyPage() {
            setTimeout(function() {
                var gameTimes = responseData.public.gameTimes;
                // 地图相关判断总页数是不是只有一页
                if (gameTimes == 1) {
                    window.page = 1
                } else {
                    window.page = MEDnumber + 1
                }
                // 正确计数的赋值
                window.correctCount = 1;
                // 地图相关判断总页数是不是只有一页

                if (MEDnumber < gameTimes - 1) {
                    // $(".shadePage").show();
                    MEDnumber++;
                    Initialization();
                    $(".slideK").height(myHeight + "px");
                    optionClickEvent();
                    A1.play();
                    // 判断如果是来自地图 游戏结束后传分
                    if (window.qid) {
                        submitScore(window.qid, window.type, window.page, window.totalPage, window.perScore, window.correctCount, window.totalScore)
                    }
                    // 判断如果是来自地图 游戏结束后传分
                } else {
                    $('.modalBox,.mack1').show()
                    if (xIndex == xTotal) {
                        A1.src = "https://s0.babyfs.cn/op/arch/1/1a11e45e0cb9410482cd6d7c76dbe693/paopao/finish0.mp3";
                        A1.play();
                        bgAudio.src = '';
                        // 判断如果是来自地图 游戏结束后传分
                        if (window.qid) {
                            submitScore(window.qid, window.type, window.page, window.totalPage, window.perScore, window.correctCount, window.totalScore)
                        } else {
                            var num = 2; //0代表一个星星、1代表两个星星、2代表三个星星
                            var gamePage = true; //true代表最后一页并且是最后一个游戏，false代表是最后一页但不是最后一个游戏。
                            var checkPoint = false; //true代表最后一个关卡，false代表不是最后一个关卡
                            var singleLink = true; //非集训营和地图单个链接游戏结束
                            setTimeout(function() {
                                A1.src = "https://s0.babyfs.cn/op/arch/1/1a11e45e0cb9410482cd6d7c76dbe693/paopao/finish0.mp3";
                                A1.play();
                                bgAudio.src = '';
                                window.starRating('modalBox', num, gamePage, checkPoint, singleLink)
                                window.buttonClick(1)
                            }, 500)
                        }
                    } else {
                        var num = 2; //0代表一个星星、1代表两个星星、2代表三个星星
                        var gamePage = false; //true代表最后一页并且是最后一个游戏，false代表是最后一页但不是最后一个游戏。
                        var checkPoint = false; //true代表最后一个关卡，false代表不是最后一个关卡
                        setTimeout(function() {
                            A1.src = "https://s0.babyfs.cn/op/arch/1/1a11e45e0cb9410482cd6d7c76dbe693/paopao/finish0.mp3";
                            A1.play();
                            bgAudio.src = '';
                            window.starRating('modalBox', num, gamePage, checkPoint)
                            window.buttonClick(0)
                        }, 500)
                    }
                }
            }, 5000);
        }

        window.buttonClick = function(checkPoint) {
            //onceMore
            $('.again').click(function() {
                // 判断如果是来自地图 且是最后一道题
                if (window.qid && xIndex == xTotal) {
                    parent.replayAll()
                } else {
                    window.location.reload();
                    parent.replayThis()
                }
                // 判断如果是来自地图 且是最后一道题
            })

            //下一页
            $('.next').click(function() {
                if (checkPoint) {
                    if (window.qid) {
                        // 跳到下一个关卡
                        goNextTask()
                    }
                } else {
                    if (window.qid) {
                        // 判断如果是来自地图 游戏结束后传分
                        submitScore(window.qid, window.type, window.page, window.totalPage, window.perScore, window.correctCount, window.totalScore)
                    } else {
                        // 是来自集训营课程 游戏结束后调用父方法进行下个游戏
                        parent.handleGoing(xIndex)
                    }
                }
            })

            //返回主页
            $('.home').click(function() {
                parent.location.reload()
            })
        }

    }

    return {
        countDownStart: countDownStart
    }
})
