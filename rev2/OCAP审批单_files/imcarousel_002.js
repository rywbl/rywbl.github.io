//图片浏览
var IMCarousel = {
	//图片池
	imgpool: {},
	//缓存
	cache: {
		carWidth: 0,
		carHeight: 0,
		imgTrans: null,
		curangle: 0,
		slideLimiter: null,
		imToolTip: null,
		showTipTimer: null
	},
	//设定
	settings: {
		hPadRate: 0.05,
		vPadRate: 0.1,
		hCarPadRate: 0.1,
		vCarPadRate: 0.1,
		scaleRadio: 0.2,
		imgangle: 90,
		languageid: 7
	},
	//事件队列
	handlers: {},
	//处理图片加载失败的情况
	handleLoadError: function (obj, evt) {
		obj.src = (window.ecologyContentPath || "") + '/social/js/imcarousel/image_deleted.png';
		// 防止死循环
		obj.onerror = null;
	},
	//处理url不合法的情况，类似http:www.weaver.com.cn
	formatImgUri: function (imguri) {
		try {
			var tempurl = imguri.toLowerCase();
			tempurl = $.trim(tempurl);
			if (tempurl.indexOf('https:') == 0) {
				if (tempurl.indexOf('https://') != 0) {
					imguri = imguri.replace(/https:/, 'https://');
				}
			} else if (tempurl.indexOf('http:') == 0) {
				if (tempurl.indexOf('http://') != 0) {
					imguri = imguri.replace(/http:/, 'http://');
				}
			}
		} catch (err) {
			// print error
		}
		return imguri;
	},
	//加载轮播图片
	loadImgFromPool: function (imgPool, obj, activeImgId, targetId) {
		var cr = $(obj);
		var imgInner = cr.find('.carousel-inner');
		// imgInner.css({display:'none'});
		var imgIndicator = cr.find('.carousel-indicators');
		var imgControler = cr.find('.carousel-control');
		//清空上一次加载的缓存
		imgInner.empty();
		imgIndicator.empty();
		//client.writeLog(imgPool[targetId], "this is test>>>", imgPool);
		var imguri;
		var cnt = 0;
		var imgMaxW = IMCarousel.cache.carWidth * (1 - IMCarousel.settings.hCarPadRate * 2);
		var imgMaxH = IMCarousel.cache.carHeight * (1 - IMCarousel.settings.vCarPadRate * 2);
		var imgTop = IMCarousel.cache.carHeight * IMCarousel.settings.vCarPadRate;
		var imgLeft = IMCarousel.cache.carWidth * IMCarousel.settings.hCarPadRate;
		var imgids = {};
		if (targetId != undefined) {
			imgids = imgPool[targetId];
		} else {
			imgids = imgPool;
		}
		for (var imgid in imgids) {
			imguri = imgids[imgid];
			//client.writeLog("imguri", imguri);
			if ("remove" == imgid.toLowerCase() || "contains" == imgid.toLowerCase()
				|| "indexof" == imgid.toLowerCase() || "foreach" == imgid.toLowerCase()
				|| "unique" == imgid.toLowerCase() || "removevalues" == imgid.toLowerCase())
				continue;
			imguri = IMCarousel.formatImgUri(imguri);


			var reg = new RegExp("^" + window.ecologyContentPath + "");
			imguri = (/^http/.test(imguri) || reg.test(imguri) || /^data:image/.test(imguri))
				? imguri
				: (window.ecologyContentPath || "") + imguri;

			var img = "<div _imgid='" + imgid + "' class='item'>" +
				"<img show-url=\"" + imguri + "\" " +
				"style='max-width:" + imgMaxW + "px;max-height:" + imgMaxH + "px;' onerror=\"IMCarousel.handleLoadError(this, event)\"/>" +
				"</div>";
			var imgInd = "<li onclick='IMCarousel.slideTo(this)' data-target='#myCarousel' data-slide-to='" + cnt + "'></li>";
			if (activeImgId == imgid) {
				img = "<div _imgid='" + imgid + "' class='item active'>" +
					"<img show-url=\"" + imguri + "\" src=\"" + imguri + "\" " +
					"style='max-width:" + imgMaxW + "px;max-height:" + imgMaxH + "px'/>" +
					"</div>";
				imgInd = "<li onclick='IMCarousel.slideTo(this)' data-target='#myCarousel' data-slide-to='" + cnt + "' class='active'></li>";
			}
			imgInner.append($(img));
			imgIndicator.append(imgInd);
			cnt++;
		}
		//调整图片的显示位置
		IMCarousel.resetActImg(imgInner);
		//重置缓存
		IMCarousel.cache.curangle = 0;
		imgInner.data('finished', true);
		var indexNo = this.getActiveImgIndexNo(obj);
		imgControler.attr('data-index', indexNo);
		this.updateControlBar(imgControler, indexNo);
	},
	//绑定滚轮事件
	bindMouseWheel: function (obj) {
		//判断火狐滚动事件
		var action = /Firefox/i.test(navigator.userAgent) ? "DOMMouseScroll" : "mousewheel";
		$(obj).bind(action, function (event, delta, deltax, deltay) {
			var delta = CarouselUtils.getDeltaValue(event);
			// console.log(delta);
			var dir = delta > 0 ? 'Up' : 'Down', vel = Math.abs(delta);
			if (dir == 'Up') {
				IMCarousel.scaleImg(obj, 'enlarge');
			} else if (dir == 'Down') {
				IMCarousel.scaleImg(obj, 'shrink');
			}
		});
	},
	//调整图片位置
	resetActImg: function (imgInner, currentImg) {
		var active = imgInner.find('.active');
		var img = active.find('img');
		if(currentImg) {
			img = imgInner.find('.item .nextimg');
			currentImg.removeClass('nextimg');
		}
		var imgInnerCord = CarouselUtils.getPageOffset(imgInner);
		var handlers = IMCarousel.handlers;
		// console.log("imgInnerCord:",imgInnerCord);
		//缓存
		imgInner.data('cord', imgInnerCord);
		var oStyle = {
			'left': '50%',
			'top': '50%',
			'margin-left': '-23px',
			'margin-top': '-23px'
		};
		var gif = (window.ecologyContentPath || "") + "/social/images/loading_mb_wev8.gif";
		if (!img[0].complete) {
			CarouselUtils.showLoading(imgInner, oStyle, gif, CarouselUtils.settings.TIMEOUT, function () {
				//client.writeLog('图片加载超时');
				active.css("top", (imgInnerCord.height - img.height()) / 2 + 'px');
				active.data('hascloth', '0');
				active.removeClass('hide');
			});
			active.addClass('hide');
			img[0].onload = function () {
				// console.log("img==>width:" + img.width() + "  img==>height:" + img.height());
				img.css({
					left: (imgInnerCord.width - img.width()) / 2 + 'px',
					top: (imgInnerCord.height - img.height()) / 2 + 'px'
				});
				CarouselUtils.shutLoading();
				active.removeClass('hide');
				img.data('origalCord', { left: img.position().left, top: img.position().top });
				img.parent().css("top", "0");
				//为图片添加拖动效果
				IMCarousel.allotFocusLayer(imgInner, img);
				if (handlers && typeof handlers.onImgLoad == 'function') {
					handlers.onImgLoad();
				}
			};
			img[0].onerror = function (e) {
				CarouselUtils.shutLoading();
				active.removeClass('hide');
				img.attr('src', (window.ecologyContentPath || "") + '/social/js/imcarousel/image_deleted.png');
				img.data('origalCord', { left: img.position().left, top: img.position().top });
				if (handlers && typeof handlers.onImgLoad == 'function') {
					handlers.onImgLoad();
				}
				// 防止死循环
				img[0].onerror = null;
			}
		} else {
			img.css({
				left: (imgInnerCord.width - img.width()) / 2 + 'px',
				top: (imgInnerCord.height - img.height()) / 2 + 'px'
			});
			//img.data('origalCord',{left:img.position().left, top:img.position().top});
			IMCarousel.allotFocusLayer(imgInner, img);
			if (handlers && typeof handlers.onImgLoad == 'function') {
				handlers.onImgLoad();
			}
		}

	},
	//图片居中显示
	makeImgCenter: function (imgInner) {
		var finished = imgInner.data('finished');
		if (finished) {
			imgInner.data('finished', false);
			var imgInnerCord = CarouselUtils.getPageOffset(imgInner);
			var imgs = imgInner.find('img');
			imgs.each(function () {
				var img = $(this);
				var imgpa = img.parent();
				if (imgpa.data('hascloth') && imgpa.data('hascloth') == '0') {
					imgpa.data('hascloth', '1');
				} else {
					imgpa.css('top', '0px');
				}
				img.css({
					left: (imgInnerCord.width - img.width()) / 2 + 'px',
					top: (imgInnerCord.height - img.height()) / 2 + 'px'
				});
			});
			imgInner.data('finished', true);
		}
	},
	//重新计算图片大小
	resizeInnerImgs: function (car) {
		var imgInner = car.find('.carousel-inner');
		var imgMaxW = IMCarousel.cache.carWidth * (1 - IMCarousel.settings.hCarPadRate * 2);
		var imgMaxH = IMCarousel.cache.carHeight * (1 - IMCarousel.settings.vCarPadRate * 2);
		imgInner.find('img').each(function () {
			var img = $(this);
			var actH = img.height();
			var actW = img.width();
			$(this).css('max-width', actW > imgMaxW ? actW : imgMaxW);
			$(this).css('max-height', actH > imgMaxH ? actH : imgMaxH);
		});
	},
	//蒙版伸展
	stretchWrap: function (wrapMb, imgWrap, myCarousel, $windoc) {
		var cw = $windoc[0].clientWidth;
		var ch = $windoc[0].clientHeight;
		$(imgWrap).css('width', cw + 'px');
		$(imgWrap).css('height', ch + 'px');
		$(wrapMb).css('width', cw + 'px');
		$(wrapMb).css('height', ch + 'px');

		var iWidth = cw - cw * IMCarousel.settings.hPadRate * 2;
		var iHeight = ch - ch * IMCarousel.settings.vPadRate * 2;
		IMCarousel.cache.carWidth = iWidth;
		IMCarousel.cache.carHeight = iHeight;
		//将宽高绑定到carousel缓存 1106 by wyw
		myCarousel.attr("_carWidth", iWidth);
		myCarousel.attr("_carHeight", iHeight);
		/*myCarousel.data("carSize", {
			'carWidth': iWidth,
			'carHeight': iHeight
		});
		*/
		myCarousel.css('width', iWidth + 'px');
		myCarousel.css('height', iHeight + 'px');
		myCarousel.css('top', ((ch - iHeight) / 2) + 'px');
		myCarousel.css('left', ((cw - iWidth) / 2) + 'px');
		var carCtrl = myCarousel.find('.carousel-control');
		carCtrl.css('top', (iHeight - carCtrl.height()) / 2);
		var editpane = myCarousel.find('.carousel-fullpane');
		editpane.css({ 'width': iWidth + 'px' });
	},
	//数据传入显示Image Crousel
	showImgScanner4Pool: function (bShow, imgPool, imgId, chatdiv_id, _win, handlers, wrapMbCss) {
		if(typeof window.onImgViewOpen === "function" && bShow) {
			window.onImgViewOpen()
		}else if(typeof window.onImgViewOpen === "function" && !bShow){
			window.onImgViewClose()
		}
		var $windoc = $(window.document.body);
		if (_win) {
			$windoc = $(_win.document.body);
			//解决ESC无效问题，焦点需跳转到对应窗口 1109 by wyw
			_win.focus();
		} else {
			_win = window;
		}
		var mychatImgPagWrap = $windoc.find(".chatImgPagWrap");
		if (mychatImgPagWrap.length == 1) {
			IMCarousel.initImgScanner(bShow, imgPool, imgId, chatdiv_id, $windoc, _win, handlers, wrapMbCss);
		} else {
			// console.log("mychatImgPagWrap length:" + mychatImgPagWrap.length);
			//延时加载插件
			CarouselUtils.cacheLoad((window.ecologyContentPath || "") + "/social/js/drageasy/drageasy.js", {
				success: function () {
					//client.log("延迟加载drageasy.js成功");
				}
			});
			CarouselUtils.cacheLoad((window.ecologyContentPath || "") + "/social/js/bootstrap/js/bootstrap.js", {
				success: function () {
					//client.log("延迟加载bootstrap.js成功");
					$.post((window.ecologyContentPath || "") + "/social/im/SocialImgCarousel.jsp?" + (typeof from === 'undefined' ? '' : 'from=' + from), function (htmldata) {
						mychatImgPagWrap.remove();
						$windoc.find(".mengbanLayer").remove();
						$windoc.append($.trim(htmldata));
						IMCarousel.initImgScanner(bShow, imgPool, imgId, chatdiv_id, $windoc, _win, handlers, wrapMbCss);

					});
				}
			})
		}


	},
	//设定浏览参数
	initImgScanner: function (bShow, imgPool, imgId, chatdiv_id, $windoc, _win, handlers, wrapMbCss) {
		var imgWrap = $windoc.find('.chatImgPagWrap');
		var wrapMb = $windoc.find('.mengbanLayer');
		var selfCtx = this;
		imgWrap.css({
			"position": "fixed",
			"zIndex": "99999",
			"left": 0,
			"top": 0,
			"right": 0,
			"bottom": 0,
			"display": "none"
		});
		var wrapMbCssRes = Object.assign({
			"position": "fixed",
			"zIndex": "99999",
			"left": 0,
			"top": 0,
			"right": 0,
			"bottom": 0,
			"display": "none",
			"opacity": 0.36,
			"background": "#000",
		}, wrapMbCss);
		wrapMb.css(wrapMbCssRes);
		var myCarousel = $(imgWrap).find('#myCarousel');
		//初始化监听函数
		if (typeof handlers == 'object') {
			IMCarousel.handlers = handlers;
		}else if(handlers){
			IMCarousel.settings.languageid = handlers;
		}else {
			if (window["e9_locale"]) {
				IMCarousel.settings.languageid = window["e9_locale"].userLanguage;
			  }
		}
		if (bShow) {
			handlers = handlers || IMCarousel.handlers;
			// 设置语言
			if (handlers && handlers.languageid) {
				IMCarousel.settings.languageid = languageid;
			}

			// 加载多语言配置文件
			CarouselUtils.cacheLoad((window.ecologyContentPath || "") + "/social/js/imcarousel/i18n.js", {
				success: function (jsonData) {

				}
			});

			if (handlers && typeof handlers.beforeOpen == 'function')
				handlers.beforeOpen();
			$windoc.addClass('clearSpacing');
			var imgInner = myCarousel.find('.carousel-inner');
			IMCarousel.stretchWrap(wrapMb, imgWrap, myCarousel, $windoc);
			$windoc.bind('resize', function () {
				IMCarousel.stretchWrap(wrapMb, imgWrap, myCarousel, $windoc);
				IMCarousel.resizeInnerImgs(myCarousel);
				IMCarousel.makeImgCenter(imgInner);
			});
			//如果是一张图片就不显示next 和prev按钮
			var carCtrl = myCarousel.find('.carousel-control');
			var dis = 'block';
			if (chatdiv_id != undefined) {		//hash
				if (imgPool[chatdiv_id]) {
					var len = CarouselUtils.getObjectLen(imgPool[chatdiv_id]);
					if (len <= 1) dis = 'none';
				}
			} else {
				var len = imgPool.length;
				if (len <= 1) dis = 'none';
			}

			carCtrl.css('display', dis);
			//第一次点击没有效果 1109 by wyw
			//$(wrapMb).show();
			//$(imgWrap).fadeIn();

			$(wrapMb).css("display", "block");
			$(imgWrap).css("display", "block");
			if (handlers && typeof handlers.onContainerLoad == 'function')
				handlers.onContainerLoad();
			try {
				myCarousel.carousel('pause');//停止轮播
				// 加载tooltip
				// $windoc.find("[data-toggle='tooltip']").tooltip({'delay':10, 'container': imgWrap});
				this.getImToolTip(window.top.document.body)
				//隐藏tooltip提示
				// selfCtx.hideTip(myCarousel.find('.carousel-control'));
			} catch (err) {
				//client.error("bootstrap.js可能没有加载");
				CarouselUtils.cacheLoad((window.ecologyContentPath || "") + "/social/js/bootstrap/js/bootstrap.js", {
					success: function () {
						//client.log("延迟加载bootstrap.js成功");
						// 加载tooltip
						// $windoc.find("[data-toggle='tooltip']").tooltip({'delay':0});
						// selfCtx.hideTip(myCarousel.find('.carousel-control'));
					}
				})
			}
			// var cr = $(myCarousel);
			// var imgInner = cr.find('.carousel-inner');
			//从图片池加载图片
			IMCarousel.loadImgFromPool(imgPool, myCarousel, imgId, chatdiv_id);
			//如果是页面已加载完的图片，要延迟调用resize()保证居中显示
			_win.setTimeout(function () {
				if (!CarouselUtils.cache.loadTimerId) {
					// imgInner.css({display:'block'});
					$windoc.resize();
				}
			}, 200);
			// if(CarouselUtils.cache.loadTimerId){
			// 	imgInner.css({display:'block'});
			// 	$windoc.resize();
			// }
			$windoc.unbind('.imgscanner');
			//绑定键盘左右键
			$windoc.bind('keyup.imgscanner', function (event) {
				var e = event || _win.event;
				var keynum;
				if (_win.event != undefined)//FOR IE
					keynum = e.keyCode;
				else if (e.keyCode)
					keynum = e.keyCode;
				else if (e.which)
					keynum = e.which;
				if (keynum == 39) {	//右
					//myCarousel.carousel('next');
					var nextBtn = myCarousel.find('.carousel-control[data-slide="next"]');
					if (nextBtn.length > 0) {
						nextBtn.click();
						selfCtx.showTip(nextBtn, 3000);
					}
				} else if (keynum == 37) {		//左
					//myCarousel.carousel('prev');
					var prevBtn = myCarousel.find('.carousel-control[data-slide="prev"]');
					if (prevBtn.length > 0) {
						prevBtn.click();
						selfCtx.showTip(prevBtn, 3000);
					}
				} else if (38 == keynum) {			//上
					var enlargBtn = myCarousel.find('.enlarge');
					if (enlargBtn.length > 0) {
						enlargBtn.click();
					}
				} else if (40 == keynum) {			//下
					var shrinkBtn = myCarousel.find('.shrink');
					if (shrinkBtn.length > 0) {
						shrinkBtn.click();
					}
				} else if (keynum == 27) { //esc
					$windoc.removeClass('clearSpacing');
					$(wrapMb).hide();
					$(imgWrap).hide();
					$windoc.unbind('.imgscanner');
					if (typeof from != 'undefined' && from == 'pc') {
						ImageReviewForPc.close();
					}
				}
			});
		} else {
			$windoc.removeClass('clearSpacing');
			$(wrapMb).hide();
			$(imgWrap).hide();
			$windoc.unbind('.imgscanner');
			handlers = handlers || IMCarousel.handlers;
			if (handlers && typeof handlers.afterClose == 'function')
				handlers.afterClose();
		}
	},
	//显示Image Crousel
	showImgScanner: function (e, bShow, imgUrl, handlers) {
		e = e || window.event;
		var target = $(e.srcElement || e.target);
		var chatdiv_id = $(target.parents('.chatdiv')[0]).attr('id');
		var chatimgpool = [];
		/*下面代码是用来判断是否处于消息记录窗口里 1105 by wyw*/
		if (chatdiv_id == undefined) {
			var dgchatdiv = target.parents('.zDialog_div_content');
			//alert(dgchatdiv.length)
			if (dgchatdiv.length > 0) {
				var imgs = dgchatdiv.find(".chatcontentimg img");
				for (var i = 0; i < imgs.length; ++i) {
					chatimgpool.push($(imgs[i]).attr("_imageurl"));
				}
			}

		} else {
			chatimgpool = IMCarousel.getchatimgpool(chatdiv_id);
		}

		//alert("chatdiv_div:"+chatdiv_id+"imglen:"+chatimgpool.length);
		var imgIndex = chatimgpool.indexOf(imgUrl);
		var _win = window;
		//alert(top.location);
		//alert(location);
		try {
			var _location = window.location;
			var _toplocation = window.top.location;
			//IE 7,8 location undefined
			if (!window.location) {
				_location = document.location;
				_toplocation = window.top.document.location;
			}
			if (_toplocation != _location)
				_win = window.top;
		} catch (err) {
			console.info(err);
		}
		if (typeof from != 'undefined' && from == 'pc') {
			if (bShow) {
				ImageReviewForPc.show(imgIndex, chatimgpool);
			} else {
				ImageReviewForPc.close()
			}
		} else {
			IMCarousel.showImgScanner4Pool(bShow, chatimgpool, imgIndex, undefined, _win, handlers);
		}
	},
	//获取聊天窗口的图片集合
	getchatimgpool: function (chatdivid) {
		var pool = [];
		var chatimgs = $("#" + chatdivid + " .chatcontentimg img");
		for (var i = 0; i < chatimgs.length; ++i) {
			pool.push($(chatimgs[i]).attr("_imageurl"));
		}
		return pool;
	},
	bindImgSize: function (img) {
		img = img[0] || img;
		var w = img.offsetHeight;
		var h = img.offsetWidth;
		if (w != 0 && h != 0 && !$(img).attr('_width') && !$(img).attr('_height')) {
			$(img).attr({
				"_width": w,
				"_height": h
			});
		}
	},
	//为图片添加遮罩层
	allotFocusLayer: function (imgInner, img) {
		var oStyle = CarouselUtils.getPageOffset(img);
		//当直接取页面上图片的src时，图片已经加载完毕，这里img坐标错误
		if (img[0].style.left && oStyle.left == 0) {
			oStyle.left = parseInt(img[0].style.left);
			oStyle.top = parseInt(img[0].style.top);
			img.data('origalCord', { left: oStyle.left, top: oStyle.top });
		}
		var img = $(img);
		var layer = img.next('.transLayer');
		if (layer && layer.length > 0) return;
		else {
			layer = CarouselUtils.getLayer(oStyle, 'transLayer');
			img.after(layer);
			img.bind('mouseenter.overflayer', function (e) {
				IMCarousel.strechToImg(img, layer);
				layer.show();
			});
			layer.bind('mouseleave.outflayer', function (e) {
				layer.hide();
			});
			//alert(imgInner.length);
			var imgInnerCord = CarouselUtils.getPageOffset(imgInner);
			//对于动态加载, 插件可能没有进行预加载
			try {
				layer.dragDrop({ 'follower': img, 'origalCord': oStyle, "imgInnerCord": imgInnerCord });
			} catch (err) {
				//client.error("drageasy.js可能没有成功加载");
				//延时加载插件
				CarouselUtils.cacheLoad((window.ecologyContentPath || "") + "/social/js/drageasy/drageasy.js", {
					success: function () {
						//client.log("延迟加载drageasy.js成功");
						layer.dragDrop({ 'follower': img, 'origalCord': oStyle, "imgInnerCord": imgInnerCord });
					}
				});
			}
			//绑定滚轮
			IMCarousel.bindMouseWheel(layer);
		}
	},
	//遮罩层图片随动
	strechToImg: function (img, shadowLayer) {
		var oStyle = CarouselUtils.getPageOffset(img);
		shadowLayer.css({
			left: oStyle.left,
			top: oStyle.top,
			width: oStyle.width,
			height: oStyle.height
		});
		shadowLayer[0].style.webkitTransform = img[0].style.webkitTransform;
		shadowLayer[0].style.MozTransform = img[0].style.MozTransform;
		shadowLayer[0].style.msTransform = img[0].style.msTransform;
		shadowLayer[0].style.OTransform = img[0].style.OTransform;
		shadowLayer[0].style.transform = img[0].style.transform;
	},
	//显示当前图片序号
	showImgIndexNo: function (obj, direction, indexNo) {
		// console.log("mouseover...");
		var imgCount = IMCarousel.getImgCount(obj);
		if (imgCount <= 1) {
			return;
		}
		var activeImgIndexNo = typeof indexNo === 'undefined' ? this.getActiveImgIndexNo(obj) : indexNo;
		var titleTip = this.getTitleTip(activeImgIndexNo, imgCount, direction);

		$(obj).attr('data-original-title', titleTip);
		this.updateTip(obj, titleTip)
	},
	// 获取titleTip
	getTitleTip: function (indexNo, imgCount, direction) {
		var titleTip = "";
		var isFirst = indexNo == 0;
		var isLast = indexNo + 1 == imgCount;
		// 最后一张
		if (isLast && direction == 'next') {
			titleTip = CarouselUtils.geti18nString('tip0', IMCarousel.settings.languageid);
		} else if (isFirst && direction == 'prev') {
			titleTip = CarouselUtils.geti18nString('tip1', IMCarousel.settings.languageid);
		} else {
			titleTip = (direction == 'next' ? indexNo + 1 : indexNo - 1) + "/" + imgCount;
		}
		return titleTip;
	},
	// 获取imToolTip对象
	getImToolTip: function (context, initOptions) {
		context = context || window.top.document.body
		var container = $('.chatImgPagWrap', context)
		return this.cache.imToolTip = this.cache.imToolTip || new IMToolTip(context, initOptions || { 'container': container });
	},
	// 显示tip
	showTip: function (obj, timeout) {
		this.getImToolTip().show(obj)
		var content = $(obj).attr('data-original-title');
		var selfCtx = this;
		selfCtx.getImToolTip().updatePosition(obj)
		if (typeof timeout === 'number') {
			clearTimeout(this.cache.showTipTimer);
			this.cache.showTipTimer = setTimeout(function () {
				selfCtx.getImToolTip().hide()
			}, timeout);
		}
		return this;
	},
	// 隐藏tip
	hideTip: function (obj) {
		this.getImToolTip().hide()
	},
	// 更新tip
	updateTip: function (obj, content) {
		this.getImToolTip().setContent(content)
	},
	// 更新滑动按钮样式
	updateControlBar: function (obj, indexNo, imgCount) {
		if (typeof indexNo == 'undefined') {
			indexNo = this.getActiveImgIndexNo(obj);
		}
		if (typeof imgCount == 'undefined') {
			imgCount = this.getImgCount(obj);
		}
		var isFirst = indexNo == 0;
		var isLast = indexNo + 1 == imgCount;
		var CarourselObj = $(obj).parents('#myCarousel');
		if (!isFirst) {
			CarourselObj.find('a.left').removeClass('disabled').attr('data-original-title', (indexNo + 1) + '/' + imgCount);
		} else {
			CarourselObj.find('a.left').addClass('disabled').attr('data-original-title', CarouselUtils.geti18nString('tip1', IMCarousel.settings.languageid));
		}
		if (!isLast) {
			CarourselObj.find('a.right').removeClass('disabled').attr('data-original-title', (indexNo + 1) + '/' + imgCount);
		} else {
			CarourselObj.find('a.right').addClass('disabled').attr('data-original-title', CarouselUtils.geti18nString('tip0', IMCarousel.settings.languageid));
		}
	},
	//手动滑动图片
	slideImg: function (obj, direction) {
		// 两次滑动间隔控制
		if (this.cache.slideLimiter) {
			return;
		}
		var self = this;
		self.cache.slideLimiter = setTimeout(function () {
			self.cache.slideLimiter = null;
		}, 600);
		var imgCount = IMCarousel.getImgCount(obj);
		var activeImgIndexNo = this.getActiveImgIndexNo(obj);
		if (imgCount <= 1) {
			return;
		}
		var isFirst = activeImgIndexNo == 0;
		var isLast = activeImgIndexNo + 1 == imgCount;
		if (direction == 'prev' && isFirst || direction == 'next' && isLast) {
			$(obj).addClass('disabled');
			return;
		}
		var newActiveImgIndexNo = activeImgIndexNo;
		if (direction == 'prev' && activeImgIndexNo > 0) {
			newActiveImgIndexNo--;
			$(obj).parents('#myCarousel').find('a.carousel-control').attr('data-index', newActiveImgIndexNo);
		} else if (direction == 'next' && activeImgIndexNo < imgCount) {
			newActiveImgIndexNo++;
			$(obj).parents('#myCarousel').find('a.carousel-control').attr('data-index', newActiveImgIndexNo);
		}
		var car = $(obj).parents('.chatImgPag')[0];
		var img = $(car).find('.carousel-inner .item img');
		var currentImg;
		var currentImgSource;
		if(direction == 'prev' && activeImgIndexNo > 0) {
			currentImg = $(img[activeImgIndexNo - 1]);
			currentImgSource = img[activeImgIndexNo - 1];
			if(!currentImg.attr('src')) currentImg.attr('src', currentImg.attr('show-url'));
		} else if (direction == 'next' && activeImgIndexNo < imgCount){
			currentImg = $(img[activeImgIndexNo + 1]);
			currentImgSource = img[activeImgIndexNo + 1];
			if(!currentImg.attr('src')) currentImg.attr('src', currentImg.attr('show-url'));
		}
		currentImgSource.onload = function() {
			currentImg.addClass('nextimg')
			var imgInner = $(car).find('.carousel-inner')
			IMCarousel.resetActImg(imgInner, currentImg);
		}
		IMCarousel.restoreImg(obj);
		$(obj).parents('#myCarousel').carousel(direction);
		CarouselUtils.stopBubbleEvent(event);
		var layerDiv = $(obj).next('.' + direction + 'Layer');
		this.updateControlBar(obj, newActiveImgIndexNo, imgCount);
		//this.showImgIndexNo(obj, direction, activeImgIndexNo);
		this.updateTip(obj, $(obj).attr('data-original-title'))
		this.hideTip($(obj).siblings('.carousel-control'))
		this.showTip(obj);
	},
	//手动滑动到指定位置
	slideTo: function (obj) {
		var pos = $(obj).attr('data-slide-to');
		IMCarousel.restoreImg(obj);
		$(obj).parents('#myCarousel').carousel(parseInt(pos));
		CarouselUtils.stopBubbleEvent(event);
	},
	//获取图片个数
	getImgCount: function (obj) {
		var o = $(obj).parents('.carousel');
		//client.writeLog(o.length);
		var items = o.find('.carousel-inner').children('.item');
		return items.length;
	},
	//获取当前图片的序号
	getActiveImgIndexNo: function (obj) {
		var car = $(obj).parents('.chatImgPagWrap')[0];
		var indexNo = parseInt($(obj).attr('data-index'));
		// console.log("getActiveImgIndexNo:" + indexNo);
		return isNaN(indexNo) ? $(car).find('.carousel-inner .active').index() : indexNo;
	},
	//找到当前图片
	getActiveImg: function (obj) {
		var car = $(obj).parents('.chatImgPagWrap')[0];
		return $(car).find('.carousel-inner .active img');
	},
	//旋转图片
	rotateImg: function (obj) {
		var actImg = IMCarousel.getActiveImg(obj);
		actImg.addClass('rotatetrans');
		var img = actImg[0];
		/*if(CarouselUtils.cache.curangle >= 360){
			CarouselUtils.cache.curangle -= 360;
		}*/
		var angle = IMCarousel.settings.imgangle;
		var curangle = IMCarousel.cache.curangle;
		if (CarouselUtils.supportCss3("Transform")) {
			img.style.webkitTransform = "rotate(" + (curangle + angle) + "deg)"
			img.style.MozTransform = "rotate(" + (curangle + angle) + "deg)"
			img.style.msTransform = "rotate(" + (curangle + angle) + "deg)"
			img.style.OTransform = "rotate(" + (curangle + angle) + "deg)"
			img.style.transform = "rotate(" + (curangle + angle) + "deg)";
		} else if (document.body.filters) {		//IE??
			var an = (curangle + angle) % 360, rotation = 1;
			if (an > 0 && an <= 90) rotation = 1;
			else if (an > 90 && an <= 180) rotation = 2;
			else if (an > 180 && an < 360) rotation = 3;
			else rotation = 0;
			img.style.filter = "progid:DXImageTransform.Microsoft.BasicImage(rotation=" + rotation + ")";
		}
		if (
			((curangle + angle) / 90) % 2 == 1
		|| ((curangle + angle) / 90) % 2 == -1
		) {
			actImg.attr("_vShow", "1");
		} else {
			actImg.attr("_vShow", "0");
		}
		IMCarousel.cache.curangle += angle;
		IMCarousel.strechToImg($(img), $(img).next('.transLayer'));

	},
	//逆时针旋转图片
	counterRotateImg: function (obj) {
		var actImg = IMCarousel.getActiveImg(obj);
		actImg.addClass('rotatetrans');
		var img = actImg[0];
		/*if(CarouselUtils.cache.curangle >= 360){
			CarouselUtils.cache.curangle -= 360;
		}*/
		var angle = IMCarousel.settings.imgangle;
		var curangle = IMCarousel.cache.curangle;
		if (CarouselUtils.supportCss3("Transform")) {
			img.style.webkitTransform = "rotate(" + (curangle - angle) + "deg)"
			img.style.MozTransform = "rotate(" + (curangle - angle) + "deg)"
			img.style.msTransform = "rotate(" + (curangle - angle) + "deg)"
			img.style.OTransform = "rotate(" + (curangle - angle) + "deg)"
			img.style.transform = "rotate(" + (curangle - angle) + "deg)";
		} else if (document.body.filters) {		//IE??
			var an = (curangle - angle) % 360, rotation = 1;
			if (an > 0 && an <= 90) rotation = 1;
			else if (an > 90 && an <= 180) rotation = 2;
			else if (an > 180 && an < 360) rotation = 3;
			else rotation = 0;
			img.style.filter = "progid:DXImageTransform.Microsoft.BasicImage(rotation=" + rotation + ")";
		}
		if (((curangle - angle) / 90) % 2 == -1
		|| ((curangle - angle) / 90) % 2 == 1) {
			actImg.attr("_vShow", "1");
		} else {
			actImg.attr("_vShow", "0");
		}
		IMCarousel.cache.curangle -= angle;
		IMCarousel.strechToImg($(img), $(img).next('.transLayer'));

	},
	//控制图片大小
	scaleImg: function (obj, opt) {
		var actImg = IMCarousel.getActiveImg(obj);
		var w = actImg.width()
		var h = actImg.height();
		if ('shrink' == opt && w < 100) {  //如果超过范围就忽略
			return;
		}
		if ('enlarge' == opt && w > 10000) {  //如果超过范围就忽略
			return;
		}
		var radio = 1;
		/*消息记录窗口模式下有问题
		var orgTop = parseInt(actImg.css('top'));
		var orgLeft = parseInt(actImg.css('left'));
		*/
		var orgTop = actImg.position().top;
		var orgLeft = actImg.position().left;
		var zoom = { x: (orgLeft + w / 2), y: (orgTop + h / 2) };   //图片中心点的坐标
		if (actImg.attr("_vShow") == '1') {
			zoom = { x: (orgLeft + h / 2), y: (orgTop + w / 2) };   //图片中心点的坐标
		}
		if ('enlarge' == opt) {
			radio = 1 + IMCarousel.settings.scaleRadio;
		} else if ('shrink' == opt) {
			radio = 1 - IMCarousel.settings.scaleRadio;
		}
		var newW = w * radio;
		var newH = h * radio;
		actImg.css({
			'max-width': newW + 'px',
			'max-height': newH + 'px'
		});
		actImg.css({
			left: (zoom.x - newW / 2) + 'px',
			top: (zoom.y - newH / 2) + 'px'
		});
		actImg.attr('width', newW);
		actImg.attr('height', newH);
		/*
		actImg.css({
			"width": newW + "px",
			"height": newH + "px"
		});
		*/
		IMCarousel.strechToImg(actImg, actImg.next('.transLayer'));
	},
	//复制图片
	copyImg: function (obj) {
		var actImg = IMCarousel.getActiveImg(obj);
		var url = actImg.attr('src');

    var reg = new RegExp("^" + window.ecologyContentPath + "");
    url = (/^http/.test(url) || reg.test(url))
      ? url
      : (window.ecologyContentPath || "") + url;
		copyPcImg(url);
	},
	//下载图片
	downloadImg: function (obj) {
		var actImg = IMCarousel.getActiveImg(obj);
		var url = actImg.attr('src');

    var reg = new RegExp("^" + window.ecologyContentPath + "");
    url = (/^http/.test(url) || reg.test(url))
      ? url
			: (window.ecologyContentPath || "") + url;

		var fileid = CarouselUtils.getFileidInUrl(url);
		var filerealpath = CarouselUtils.getFilerealpath(url);
		if (fileid != '') {
			CarouselUtils.downloads(url);
		} else if (filerealpath != '') {
			// CarouselUtils.downloadPortalImgs(url);
			CarouselUtils.downloadPortalImgs((window.ecologyContentPath || "") + '/api/portal/materialLib/downloadFile?fileUrl=' + filerealpath);
		} else if (url.indexOf('base64,') !== -1) {
			var now = new Date();
			var imgName = now.getTime() + '.png';
			CarouselUtils.downloadBase64File(imgName, url);
		} else {
			// CarouselUtils.downloadImgs(url);
			// CarouselUtils.downloads(url);
			// $("#downloadFrame").attr("src","/social/im/SocialIMOperation.jsp?operation=downrongpic&url=" + url);
		}
	},
	restoreImg: function (obj) {
		var car = $(obj).parents('.chatImgPag')[0];
		var img = $(car).find('.carousel-inner .active img');
		var cacheWidth = IMCarousel.cache.carWidth;
		var cacheHeight = IMCarousel.cache.carHeight;
		//有时候取到的值为0,原因未知 1106 by wyw
		if (cacheWidth == 0 || cacheHeight == 0) {
			cacheWidth = $(car).attr("_carWidth");
			cacheHeight = $(car).attr("_carHeight");
		}
		var imgMaxW = cacheWidth * (1 - IMCarousel.settings.hCarPadRate * 2);
		var imgMaxH = cacheHeight * (1 - IMCarousel.settings.vCarPadRate * 2);
		var curangle = IMCarousel.cache.curangle;

		img.removeAttr('width');
		img.removeAttr('height');

		img.css({
			'max-width': imgMaxW + 'px',
			'max-height': imgMaxH + 'px'
		});
		img.removeClass('rotatetrans');
		//消除旋转
		img[0].style.webkitTransform = '';
		img[0].style.MozTransform = '';
		img[0].style.msTransform = '';
		img[0].style.OTransform = '';
		img[0].style.transform = '';
		//重置缓存
		IMCarousel.cache.curangle = 0;
		//清除拖拽
		var oStyle = img.data('origalCord');
		// console.log(oStyle);
		if (oStyle) {
			img.css({
				left: oStyle.left,
				top: oStyle.top
			});
		}
	},
	//屏蔽隐藏选择器
	SelectorMask: [
		'.carousel-indicators', '.carousel-indicators li',
		'.carousel-inner .item img', '.carousel-control',
		'.miniClose', '.carousel-fullpane .control-pane .ctrlbtn',
		'.carousel-fullpane .control-pane', '.transLayer'
	],
	//处理图片浏览时的自动隐藏
	doScannerEscape: function (e, box) {
		//pc版屏蔽该动作
		e = e || window.event;
		if (typeof from != 'undefined' && from == 'pc') {
			CarouselUtils.stopBubbleEvent(e);
			return;
		}
		var obj = e.target || e.srcElement;
		var selector;
		for (var i = 0; i < IMCarousel.SelectorMask.length; ++i) {
			selector = IMCarousel.SelectorMask[i];
			var es = $(box).find(selector);
			for (var j = 0; j < es.length; ++j) {
				if (es[j] == obj) {
					return;
				}
			}
		}
		IMCarousel.showImgScanner(e, 0, '');
		CarouselUtils.stopBubbleEvent(e);
	}
};

/**
 * 工具类
 * @type
 */
var CarouselUtils = {
	cache: {},
	settings: {
		TIMEOUT: 2147483647
	},
	i18nMap: {
		'tip0': {
			'7': '已经是最后一张',
			'8': 'Reach the last',
			'9': '已經是最後一張'
		},
		'tip1': {
			'7': '已经是第一张',
			'8': 'Reach the first',
			'9': '已經是第一張'
		}
	},
	// 阻止冒泡
	stopBubbleEvent: function (e) {
		e = e || event;
		if (e && e.stopPropagation) {
			e.stopPropagation();
		} else if (window.event) {
			// 针对 IE
			window.event.cancelBubble = true;
		}
	},
	//加载js到缓存
	cacheLoad: function (url, handlers, dataType) {
		jQuery.ajax({
			url: url,
			dataType: dataType ? dataType : "script",
			cache: true,
			success: handlers.success
		});
	},
	//获取delta
	getDeltaValue: function (event) {
		var delta = 0;
		if (!event) event = window.event;
		if (event.wheelDelta) {
			delta = event.wheelDelta / 120;
			if (window.opera) delta = -delta;
			} else if (!isNaN(event.detail)) {
					// 处理jquery版本升级导致的鼠标滚轮问题，暂时注释这一段 zhujing-20200113
			    delta = -(event.detail || 0)/3;
		} else {
			event = event.originalEvent;
			if (!isNaN(event.wheelDelta)) {
				delta = event.wheelDelta / 120;
			}
			//DOMMouseScroll for Firefox
			else if (!isNaN(event.detail)) {
				delta = -(event.detail || 0) / 3;
			}
		}
		return delta;
	},
	//获取元素在网页中的相对位置
	getPageOffset: function (oj) {
		if (oj instanceof jQuery) {
			oj = oj[0];
		}
		var pos = oj.getBoundingClientRect();
		// console.log("pos:",pos);
		return {
			'width': oj.offsetWidth,
			'height': oj.offsetHeight,
			'left': oj.offsetLeft,
			'top': oj.offsetTop
		};
	},
	//显示加载效果
	showLoading: function (oBox, oStyle, gif, iDuration, fnCallback) {
		if (!gif) gif = (window.ecologyContentPath || "") +"/social/images/loading_small_wev8.gif";
		var imgwrapdiv = $("<div id='cloading'></div>");
		var img = $("<img src='" + gif + "'/>");
		imgwrapdiv.css({
			"position": "fixed",
			"zIndex": "10000",
			"display": "block",
			"textAlign": "center"
		});
		imgwrapdiv.css(oStyle);
		imgwrapdiv.append(img);
		imgwrapdiv.appendTo($(oBox));
		var self = this;
		self.cache.loadTimerId = window.setTimeout(function () {
			self.shutLoading();
			self._docallback(fnCallback);
		}, iDuration);
	},
	//处理回调
	_docallback: function (fn) {
		if (fn && fn instanceof Function) {
			fn();
		}
	},
	//关闭加载效果
	shutLoading: function () {
		var loadingdiv = $("#cloading");
		if (loadingdiv.length == 0) {
			loadingdiv = $(window.top.document.body).find("#cloading");
		}
		loadingdiv.css('display', 'none').remove();
		window.clearTimeout(this.cache.loadTimerId);
		this.cache.loadTimerId = null;
	},
	//获取数据对象的长度
	getObjectLen: function (obj) {
		var cnt = 0;
		if (typeof obj == 'object') {
			for (var i in obj) {
				if (i != 'remove')
					cnt++;
			}
		}
		return cnt;
	},
	//根据模板获取层
	getLayer: function (oStyle, classname) {
		var left = oStyle.left;
		var top = oStyle.top;
		var width = oStyle.width;
		var height = oStyle.height;
		var div = $("<div class=\"" + classname + "\"></div>");
		div.css({
			'left': left,
			'top': top,
			'width': width,
			'height': height
		});
		return div;

	},
	//判断是否支持css3
	supportCss3: function (style) {
		var prefix = ['webkit', 'Moz', 'ms', 'o'],
			i,
			humpString = [],
			htmlStyle = document.documentElement.style,
			_toHumb = function (string) {
				return string.replace(/-(\w)/g, function ($0, $1) {
					return $1.toUpperCase();
				});
			};

		for (i in prefix)
			humpString.push(_toHumb(prefix[i] + '-' + style));

		humpString.push(_toHumb(style));

		for (i in humpString)
			if (humpString[i] in htmlStyle) return true;

		return false;
	},
	//获取fileid
	getFileidInUrl: function (url) {
		var tag = "fileid=";
		var start = url.indexOf(tag);
		if (start == -1)
			return '';
		var len = url.length, pos = start + tag.length, charary = [];
		while (pos < len) {
			if (url.charAt(pos) == '&') {
				break;
			}
			charary.push(url.charAt(pos));
			pos++;
		}
		return charary.join('');
	},
	//获取门户图片地址
	getFilerealpath: function (url) {
		var portalTag = "page/resource/userfile/image";
		var start = url.indexOf(portalTag);
		if (start == -1)
			return '';
		var len = url.length, pos = start, charary = [];
		while (pos < len) {
			if (url.charAt(pos) == '&') {
				break;
			}
			charary.push(url.charAt(pos));
			pos++;
		}
		return charary.join('');
	},
	downloadBase64File: function(fileName, content) {
		var aLink = document.createElement('a');
		var content = content.replace(/[\r\n]/g, "");
		var blob = this.base64ToBlob(content); //new Blob([content]);
		var evt = document.createEvent("HTMLEvents");
		evt.initEvent("click", true, true);//initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
		aLink.download = fileName;
		aLink.href = URL.createObjectURL(blob);
		// aLink.dispatchEvent(evt);
		//aLink.click()
		aLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));//兼容火狐
	},
	//base64转Blob
	base64ToBlob: function (base64Data) {
		var byteString;
		if (base64Data.split(',')[0].indexOf('base64') >= 0) {
			var base64 = base64Data.split(',')[1];
			if (base64.indexOf('%') !== -1) {
				base64 = decodeURIComponent(base64)
			}
			byteString = atob(base64);
		} else {
			byteString = unescape(base64Data.split(',')[1]);
		}
		var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
		var ia = new Uint8Array(byteString.length);
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		return new Blob([ia], { type: mimeString });
		// let parts = code.split(';base64,');
		// let contentType = parts[0].split(':')[1];
		// let raw = atob(parts[1]);
		// let rawLength = raw.length;

		// let uInt8Array = new Uint8Array(rawLength);

		// for (let i = 0; i < rawLength; ++i) {
		//   uInt8Array[i] = raw.charCodeAt(i);
		// }
		// return new Blob([uInt8Array], {type: contentType});
	},
	// 默认的下载的方法
	downloads: function (url) {
		if (!url) return;
		var downloadFrm = $("#downloadFrame");
		if (downloadFrm.length == 0) {
			downloadFrm = $("#downloadFrame", window.top.document);
		}
		if (downloadFrm.length == 0) {
			downloadFrm = $("<iframe id='downloadFrame' style='display: none;'></iframe>");
			$(document.body).append(downloadFrm);
		}
		if (downloadFrm.length > 0) {
			// downloadFrm.attr("src","/weaver/weaver.file.FileDownload?fileid="+fileid+"&download=1");
			if (url.indexOf('&download=') == -1) {
				url = url + '&download=1';
			}

			var reg = new RegExp("^" + window.ecologyContentPath + "");
			url = (/^http/.test(url) || reg.test(url))
				? url
				: (window.ecologyContentPath || "") + url;

			downloadFrm.attr("src", url);
		}
	},
	//下载门户图片
	downloadPortalImgs: function (url) {
		if (!url) return;
		var downloadFrm = $("#downloadFrame");
		if (downloadFrm.length == 0) {
			downloadFrm = $("#downloadFrame", window.top.document);
		}
		if (downloadFrm.length == 0) {
			downloadFrm = $("<iframe id='downloadFrame' style='display: none;'></iframe>");
			$(document.body).append(downloadFrm);
		}
		if (downloadFrm.length > 0) {
			var reg = new RegExp("^" + window.ecologyContentPath + "");
			url = (/^http/.test(url) || reg.test(url))
				? url
				: (window.ecologyContentPath || "") + url;
			downloadFrm.attr("src", url);
		}
	},
	downloadImgs: function (url) {
		// var $form = $('<form method="GET"></form>');
		// $form.attr('action', url);
		// $form.appendTo($('body'));
		// $form.submit();
			var reg = new RegExp("^" + window.ecologyContentPath + "");
			url = (/^http/.test(url) || reg.test(url))
				? url
				: (window.ecologyContentPath || "") + url;
		var a = document.createElement('a');
		a.setAttribute('href', url);
		a.setAttribute('download', 'test');
		a.click();
	},
	// 获取多语言配置
	geti18nString: function (key, languageid) {
		if (this.i18nMap[key]) {
			return this.i18nMap[key][languageid];
		} else {
			return key;
		}
	}
};

// 判断顶层页面对象是否存在
if (!window.top.IMCarousel) {
	window.top.IMCarousel = IMCarousel;
}

// 判断顶层页面对象是否存在
if (!window.top.CarouselUtils) {
	window.top.CarouselUtils = CarouselUtils;
}
/*
 * 一个可以代替title显示简易版
 *
 */
var IMToolTip = function (context, options) {
	var _options = {
		'placement': 'top',
		'template': '<div id="im-tooltip-div" class="im-tooltip"><div class="im-tooltip-arrow"></div><div class="im-tooltip-inner"></div></div>'
	}
	this.options = $.extend({}, _options, options)
	this.context = context;
	this.init();
}

IMToolTip.prototype = {
	init: function () {
		var $eles = $("[data-toggle='tooltip']", this.context);
		var self = this;
		var template = this.options.template;
		var $tip = $(template)
		var $tipdiv = $("#im-tooltip-div", this.context);
		if ($tipdiv.length == 0) {
			this.$tip = this.options.container ? $tip.appendTo(this.options.container) : $tip.appendTo($(this.context))
		}
		$eles.each(function () {
			this.addEventListener('mouseenter', function () { self.show(this) })
			this.addEventListener('mouseleave', function () { self.hide() })
			self.fixTitle(this)
		});
	},
	fixTitle: function (ele) {
		var $e = $(ele);
		if ($e.attr('title') || typeof ($e.attr('data-original-title')) != 'string') {
			$e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
		}
	},
	getTip: function () {
		return this.$tip = this.$tip || $("#im-tooltip-div", this.context);
	},
	updatePosition: function (ele) {
		var $e = $(ele)
		var $tip = this.getTip();
		var pos = $.extend({}, (typeof ele.getBoundingClientRect == 'function') ? ele.getBoundingClientRect() : {
			width: ele.offsetWidth
			, height: ele.offsetHeight
		}, $e.offset())

		var actualWidth = $tip[0].offsetWidth
		// 不需要多行显示
		var actualHeight = $tip[0].offsetHeight > 32 ? 32 : $tip[0].offsetHeight;
		var tp = {};
		switch (this.options.placement) {
			case 'bottom':
				tp = { top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2 }
				break
			case 'top':
				tp = { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 }
				break
			case 'left':
				tp = { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth }
				break
			case 'right':
				tp = { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }
				break
		}
		// 边缘检测
		if (tp.top < 0) {
			tp.top = tp.top + actualHeight + pos.height;
		}
		if (tp.left < 0) {
			tp.left = tp.left + actualWidth + pos.width;
		}
		var maxWidth = this.context.clientWidth;
		var maxHeight = this.context.clientHeight;
		if (tp.left + actualWidth > maxWidth) {
			tp.left = tp.left - actualWidth - pos.width;
		}
		if (tp.top + actualHeight > maxHeight) {
			tp.top = tp.top - actualHeight - pos.height;
		}
		this.getTip().css(tp);
	},
	show: function (ele) {
		var $ele = $(ele);
		var self = this;
		var title = $ele.attr('data-original-title');
		this.getTip().find('.im-tooltip-inner').text(title)
		this.getTip().show(10, function () {
			self.updatePosition(ele)
		})

	},
	hide: function () {
		this.getTip().hide()
	},
	setContent: function (content) {
		this.getTip().find('.im-tooltip-inner').text(content)
	}
}
