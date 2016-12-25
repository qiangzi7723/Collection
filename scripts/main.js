// 整份代码写的太零散了，要找时间把代码分离到几个模块中
// 轮播插件作为一份
// 页面切换可以作为一份
// 数据绑定和初始化页面也可以分离

$(function() {
    // 全局变量

    var rem = parseInt($('html').css('fontSize'));
    var event_tap;
    if ('ontouchstart' in document.documentElement || (window.navigator.maxTouchPoints && window.navigator.maxTouchPoints >= 1)) {
        event_tap = 'tap';
    } else {
        event_tap = 'click';
    }
    //配置图片
    var config = {
        swiper: ['images/swiper_zhu.png', 'images/swiper_xin.png', 'images/swiper_nian.png', 'images/swiper_kuai.png', 'images/swiper_le.png', 'images/swiper_zhu.png'],
        bar: ['images/bar_zhu.png', 'images/bar_xin.png', 'images/bar_nian.png', 'images/bar_kuai.png', 'images/bar_le.png', 'images/bar_zhu.png'],
        mask: ['images/mask_zhu.png', 'images/mask_xin.png', 'images/mask_nian.png', 'images/mask_kuai.png', 'images/mask_le.png', 'images/mask_zhu.png']
    };
    // 配置当前已经集到了的字
    var collectionIndex = [1, 0, 6, 1, 0, 1];



    var leng = config.bar.length;

    var Collection = function() {

    };

    Collection.prototype.init = function() {
        this.initSelector();
        this.prevent();
        this.configData();
        this.newSlide();
        this.bindSlide();
        this.configHighLight();
        this.bindPageEvent();
    };

    Collection.prototype.initSelector = function() {
        this.gameDiv = $('#game_div');
        this.mainPage = this.gameDiv.find('.main-page');
        this.mainPageMe = this.mainPage.find('.me');
        this.mainPageOther = this.mainPage.find('.other');

        this.maskPage = this.gameDiv.find('.mask-mask');

        this.conditionPage = this.gameDiv.find('.condition-page');
        this.awardPage = this.gameDiv.find('.award-page');
        this.publicPage = this.gameDiv.find('.collection-public-platform');
    };

    // 执行页面切换时的遮罩，防止切换页面过程中用户点击
    Collection.prototype.maskHover = function() {
        this.maskPage.show();
        setTimeout(function() {
            this.maskPage.hide();
        }.bind(this), 800);
    };

    // 页面切换时执行的动画class新增以及删除 
    Collection.prototype.animateClass = function(element, className, isHide) {
        element.addClass(className);
        setTimeout(function() {
            element.removeClass(className);
            if (isHide) {
                element.hide();
            }
        }, 800);
    }

    Collection.prototype.bindPageEvent = function() {
        var self = this;

        /**
         * 绑定主页面事件
         * 我的事件
         */
        // 绑定点击集字动态按钮显示集字动态页面
        var conditionPageShow = this.mainPage.find('.condition');
        conditionPageShow.on(event_tap, function() {
            self.maskHover();
            self.conditionPage.show();
            self.animateClass(self.conditionPage, 'fadeInDown');
        });
        // 绑定集字动态页面的关闭事件
        var conditionPageClose = this.conditionPage.find('.close-icon');
        conditionPageClose.on(event_tap, function() {
            self.maskHover();
            self.animateClass(self.conditionPage, 'fadeOutUp', true);
        });

        // 绑定兑奖中心按钮的显示兑奖中心页面
        var awardPageShow = this.mainPageMe.find('.award');
        awardPageShow.on(event_tap, function() {
            self.maskHover();
            self.awardPage.show();
            self.animateClass(self.awardPage, 'fadeInDown');
        });
        // 绑定兑奖中心页面的关闭按钮事件
        var awardPageClose = this.awardPage.find('.close-icon');
        awardPageClose.on(event_tap, function() {
            self.maskHover();
            self.animateClass(self.awardPage, 'fadeOutUp', true);
        });



        /**
         * 绑定主页面事件
         * 其他人视角的事件
         */
        // 绑定我要集字事件
        var launchBtn = this.mainPageOther.find('.launch');
        launchBtn.on(event_tap, function() {
            self.maskHover();
            self.publicPage.show();
            self.animateClass(self.publicPage, 'fadeInDown');
        });
        // 绑定公众号页面查看他人进度事件－即关闭当前页面
        var launchBack = this.publicPage.find('.watch-condition');
        launchBack.on(event_tap, function() {
            self.maskHover();
            self.animateClass(self.publicPage, 'fadeOutUp', true);
        })
    };

    // 配置高亮选项
    Collection.prototype.configHighLight = function() {
        var index;
        for (var i = 0, len = collectionIndex.length; i < len; i++) {
            if (collectionIndex[i] > 0) {
                index = i;
                break;
            }
        }
        var num = Math.floor(index / 5);
        var i = index % 5;
        $('.bar-container .swiper-slide').eq(num).find('span').eq(i).find('i').addClass('select');
    };

    //初始化时阻止默认事件 
    Collection.prototype.prevent = function() {
        (function() {
            var agent = navigator.userAgent.toLowerCase(); //检测是否是ios
            var iLastTouch = null; //缓存上一次tap的时间
            if (agent.indexOf('iphone') >= 0 || agent.indexOf('ipad') >= 0) {
                document.body.addEventListener('touchend', function(event) {
                    var iNow = new Date()
                        .getTime();
                    iLastTouch = iLastTouch || iNow + 1 /** 第一次时将iLastTouch设为当前时间+1 */ ;
                    var delta = iNow - iLastTouch;
                    if (delta < 500 && delta > 0) {
                        event.preventDefault();
                        return false;
                    }
                    iLastTouch = iNow;
                }, false);
            }

        })();

        document.ontouchmove = function(e) {
            e.preventDefault();
        }
    };

    // 根据数据，配置页面内容
    Collection.prototype.configData = function() {
        var self = this;
        // 配置顶部时间以及集齐人数的文字
        var timeText = '<p class="timeText">还剩：2016年12月18日00分00秒</p>';
        var totalText = '<p class="totalText">总计99999人集齐了所有字</p>';
        $('#game_div header').prepend(totalText).prepend(timeText);
        // 配置大图
        var swiper_wrapper = $('#game_div .swiper .swiper-wrapper');
        for (var i = 0, len = config.swiper.length; i < len; i++) {
            if (!collectionIndex[i]) continue;
            var slide = $('<div class="swiper-slide"></div>');
            slide.attr('data-index', i);
            // 多起一层div存放图片，因为图片跟slide放在同一个style里面在手机下变换样式的时候会闪 
            var element = $('<div></div>');
            element.css('background-image', 'url(' + config.swiper[i] + ')');
            slide.append(element);
            swiper_wrapper.append(slide);
        }

        // 配置下面的列表小图
        var bar;
        var bar_container = $('#game_div .bar-container');
        // 长度大于5需要做轮播
        var swiper_wrapper = $('.bar-container .swiper-wrapper');
        for (var i = 0; i < leng; i++) {
            if (i % 5 == 0) {
                bar = $('<div class="bar swiper-slide"></div>');
                swiper_wrapper.append(bar);
            }
            var element = $('<span><i></i></span>');
            element.attr('data-index', i);
            if (collectionIndex[i]) {
                if (collectionIndex[i] > 1) {
                    element.append('<div>x' + collectionIndex[i] + '</div>')
                }
                element.css('background-image', 'url(' + config.bar[i] + ')');
            } else {
                element.css('background-image', 'url(' + config.mask[i] + ')');
            }
            bar.append(element);
        }
        $('#game_div .bar-container .swiper-wrapper').width(Math.ceil(leng / 5) * 3 * rem);
        if (leng > 5) {
            $('#game_div .bow').show();
        }
        // 初始化轮播
        this.newBarSlide();
    };

    Collection.prototype.newBarSlide = function() {
        this.barSwiper = new Swiper('.bar-container .swiper-container', {
            initialSlide: 0,
            slidesPerView: 'auto',
            centeredSlides: true,
            spaceBetween: 0,
            onlyExternal: true,
        });
        this.bindBarSlide();
    };

    Collection.prototype.bindBarSlide = function() {
        var self = this;
        $('#game_div .left-bow').on(event_tap, function() {
            var oldIndex = this.barSwiper.activeIndex;
            this.barSwiper.slidePrev();
            var newIndex = this.barSwiper.activeIndex;
            if (oldIndex != newIndex) {
                // 如果两者不相等说明当前的轮播滑动有效
                // this.swiper.slideTo(newIndex * 5);
            }
        }.bind(this));
        $('#game_div .right-bow').on(event_tap, function() {
            var oldIndex = this.barSwiper.activeIndex;
            this.barSwiper.slideNext();
            var newIndex = this.barSwiper.activeIndex;
            if (oldIndex != newIndex) {
                // 如果两者不相等说明当前的轮播滑动有效
                // this.swiper.slideTo(newIndex * 5);
            }
        }.bind(this));
        // 绑定分页器事件
        var pagination = $('#game_div .bar-container span');
        pagination.on(event_tap, function() {
            // 此处的分页器逻辑可以进行优化
            var index = $(this).attr('data-index');
            if (collectionIndex[index]) {
                var swiper_slide = $('.swiper .swiper-slide');
                var bar_slide = $('.bar-container .swiper-slide');
                swiper_slide.forEach(function(value, i, arr) {
                    if ($(value).attr('data-index') == index) {
                        self.swiper.slideTo(i);
                        // 高亮
                        var num = Math.floor(index / 5);
                        var i = index % 5;
                        bar_slide.find('i').removeClass('select');
                        bar_slide.eq(num).find('span').eq(i).find('i').addClass('select');
                        return;
                    }
                });
            }
        });
    };

    // 初始化slide插件
    Collection.prototype.newSlide = function() {
        var self = this;
        var slide = $('.swiper .swiper-slide');
        // 初始的索引
        var initIndex = 0;
        this.swiper = new Swiper('.swiper .swiper-container', {
            pagination: '.swiper-pagination',
            initialSlide: initIndex,
            slidesPerView: 'auto',
            centeredSlides: true,
            paginationClickable: true,
            spaceBetween: -50,
            onSlideChangeStart: function(swiper) {
                self.bindChangeHighLight(swiper);
                var index = swiper.activeIndex;
                slide.eq(index).css({
                    'transform': 'scale(1)',
                    '-webkit-transform': 'scale(1)',
                    'transition': 'transform 0.3s',
                    '-webkit-transition': 'transform 0.3s'
                }).siblings().css({
                    'transform': 'scale(0.51)',
                    '-webkit-transform': 'scale(0.51)',
                    'transition': 'transform 0.3s',
                    '-webkit-transition': 'transform 0.3s'
                });
                // self.barSwiper.slideTo(Math.floor(index / 5));
            },
            onInit: function() {
                slide.eq(initIndex).css({
                    'transform': 'scale(1)',
                    '-webkit-transform': 'scale(1)',
                    'transition': 'transform 0',
                    '-webkit-transition': 'transform 0'
                }).siblings().css({
                    'transform': 'scale(0.51)',
                    '-webkit-transform': 'scale(0.51)',
                    'transition': 'transform 0',
                    '-webkit-transition': 'transform 0'
                })
            },
        });
    };

    Collection.prototype.bindChangeHighLight = function(swiper) {
        var slide = $('.swiper .swiper-slide');
        var index = swiper.activeIndex;
        var slideNow = slide.eq(index);
        var dataIndex = slideNow.attr('data-index');
        var bar_slide = $('.bar-container .swiper-slide');
        var num = Math.floor(dataIndex / 5);
        var i = dataIndex % 5;
        bar_slide.find('i').removeClass('select');
        bar_slide.eq(num).find('span').eq(i).find('i').addClass('select');
    };



    // 绑定slide事件
    Collection.prototype.bindSlide = function() {
        var self = this;

    };


    var collection = new Collection();
    collection.init();

});
