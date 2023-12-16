(function(){
  if (window.location.pathname === '/spa/custom/static4mobile/index.html') {
    var reg = /(\w|\d){32}_[^/]+/;
    window.addEventListener("hashchange", function(e) {
      var newURL = e.newURL;
      var oldURL = e.oldURL;
      var newMatch = newURL.match(reg);
      var oldMatch = oldURL.match(reg);
      if (newMatch && newMatch && newMatch[0] !== oldMatch[0]) {
        setTimeout(function() { window.onWeaverMobileLoad() }, 0);
      }
    });
  }
  if (window.ecodeSDK||!window.csInitIsLoad) { //ecodeSDK加载过或者config还在缓存状态没标记的情况
    return ;
  }
  var str = '';
  if (!window.localStorage.ecodeStaticCache || (window.localStorage.ecodeStaticCache && window.localStorage.ecodeStaticCache === "y")) {
    if (window.localStorage['ecodeStaticCacheVersion'] && window.localStorage['ecodeStaticCacheVersion'] !== "undefined") {
      str = "?v=" + window.localStorage['ecodeStaticCacheVersion'];
    } else {
      str = "?v=" + Math.random().toString().slice(-6);
    }
  }

  function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

  window.ecodeSDK = {
    isIE: function() {
      return (!!window.ActiveXObject || "ActiveXObject" in window);
    },
    load: function (params) {
      var id = params.id;
      var noCss = params.noCss;
      if (ecodeSDK.isIE() && noCss !== false) { 
        noCss = true;
      }
      var tail = str;
      var arr = ['/cloudstore/release/' + id + '/index.js' + tail];
      if (window.ecologyContentPath) {
        arr = [window.ecologyContentPath + '/cloudstore/release/' + id + '/index.js' + tail];
      } 
      if (!noCss) {
        if (window.ecologyContentPath) {
          arr.push('css!' + window.ecologyContentPath + '/cloudstore/release/' + id + '/index.css' + tail);
        } else {
          arr.push('css!/cloudstore/release/' + id + '/index.css' + tail);
        }
      }
      // if(ecodeSDK.isIE()) {
      //   if (!ecodeSDK.loadjs.isDefined(id)) {
      //     ecodeSDK.loadjs(arr, id, {
      //       success:function () {
      //         typeof params.cb === 'function' && params.cb();
      //       },
      //       error: function () {
      //         if (!noCss) {
      //           typeof params.cb === 'function' && params.cb();
      //         }
      //       }
      //     });
      //   } else {
      //     typeof params.cb === 'function' && params.cb();
      //   }
      // }
      // else {
      if (!ecodeSDK.loadjs.isDefined(id)) {
        ecodeSDK.loadjs(arr, id);
      }
      ecodeSDK.loadjs.ready(id, params.cb);
      // }
    },
    render: function (params) {
      var domId = params.domId;
      var id = params.id;
      var name = params.name;
      var props = params.props;
      var noCss = params.noCss;
      ecodeSDK.load({
        id:id,
        noCss:noCss,
        cb:function () {
          var Com = ecodeSDK.getCom(id, name);
          ReactDOM.render(React.createElement(Com, props), document.getElementById(domId), params.cb);
        }
      });
    },
    comMap: {},
    setCom:function(id, name, Com) {
      if (!this.comMap[id]) this.comMap[id] = {};
      this.comMap[id][name] = Com;
    },
    getCom:function(id, name) {
      if (!this.comMap[id]) this.comMap[id] = {};
      return this.comMap[id][name];
    },
    getAsyncCom:function(params) {

      function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

      function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

      function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

      function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

      function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

      function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

      function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

      function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

      function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

      function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

      function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

      var _mobxReact = mobxReact,
          observer = _mobxReact.observer;
      var newProps = params.props || {};
      newProps.params = params.params;
      newProps.noCss = params.noCss;
      newProps.isPage = params.isPage;
      newProps.comId = params.name;
      newProps.moduleId = params.appId;
      var Async___Com = ecodeSDK.getCom(newProps.moduleId, newProps.comId + 'Async___Com');

      if (!Async___Com) {
        var _class;

        var AsyncCom = observer(_class =
            /*#__PURE__*/
            function (_React$Component) {
              _inherits(AsyncCom, _React$Component);

              function AsyncCom(props) {
                var _this;

                _classCallCheck(this, AsyncCom);

                _this = _possibleConstructorReturn(this, _getPrototypeOf(AsyncCom).call(this, props));
                var moduleId = props.moduleId,
                    comId = props.comId;
                _this.state = {
                  isLoad: false,
                  Com: null,
                  moduleId: moduleId,
                  comId: comId
                };
                return _this;
              }

              _createClass(AsyncCom, [{
                key: "getSnapshotBeforeUpdate",
                value: function getSnapshotBeforeUpdate(prevProps, prevState) {
                  var _this2 = this;

                  if (prevProps.moduleId !== this.props.moduleId || prevProps.comId !== this.props.comId) {
                    var _this$props = this.props,
                        moduleId = _this$props.moduleId,
                        comId = _this$props.comId;
                    this.setState({
                      isLoad: false,
                      moduleId: moduleId,
                      comId: comId,
                      Com: null
                    }, function () {
                      _this2.doLoad();
                    });
                  }
                }
              }, {
                key: "doLoad",
                value: function doLoad() {
                  var _this3 = this;

                  var _this$state = this.state,
                      isLoad = _this$state.isLoad,
                      moduleId = _this$state.moduleId,
                      comId = _this$state.comId;
                  var noCss = this.props.noCss;

                  if (!isLoad) {
                    ecodeSDK.load({
                      id: moduleId,
                      noCss: noCss,
                      cb: function cb() {
                        var Com = ecodeSDK.getCom(moduleId, comId);

                        if (Com != null) {
                          _this3.setState({
                            isLoad: true,
                            Com: Com
                          });
                        }
                      }
                    });
                  }
                }
              }, {
                key: "componentDidMount",
                value: function componentDidMount() {
                  this.doLoad();
                }
              }, {
                key: "render",
                value: function render() {
                  var _this$state2 = this.state,
                      isLoad = _this$state2.isLoad,
                      Com = _this$state2.Com,
                      moduleId = _this$state2.moduleId,
                      comId = _this$state2.comId;
                  if (!isLoad || moduleId !== this.props.moduleId || comId !== this.props.comId) return React.createElement("div", null);
                  return React.createElement(Com, _extends({}, this.props, this.state));
                }
              }]);

              return AsyncCom;
            }(React.Component)) || _class;

        Async___Com = AsyncCom;
        ecodeSDK.setCom(newProps.moduleId, newProps.comId + 'Async___Com', Async___Com);
      }

      if (newProps.isPage) {
        var Async___ComRoot = ecodeSDK.getCom(newProps.moduleId, newProps.comId + 'Async___ComRoot');

        if (!Async___ComRoot) {
          var _class2;

          var AsyncComRoot = observer(_class2 =
              /*#__PURE__*/
              function (_React$Component2) {
                _inherits(AsyncComRoot, _React$Component2);

                function AsyncComRoot() {
                  _classCallCheck(this, AsyncComRoot);

                  return _possibleConstructorReturn(this, _getPrototypeOf(AsyncComRoot).apply(this, arguments));
                }

                _createClass(AsyncComRoot, [{
                  key: "render",
                  value: function render() {
                    return React.createElement(Async___Com, _extends({}, this.props, newProps));
                  }
                }]);

                return AsyncComRoot;
              }(React.Component)) || _class2;

          Async___ComRoot = AsyncComRoot;
          ecodeSDK.setCom(newProps.moduleId, newProps.comId + 'Async___ComRoot', Async___ComRoot);
        }
        return Async___ComRoot;
      }
      return React.createElement(Async___Com, newProps);
    },
    rewritePortalLoginQueue: [],
    rewritePortalThemeQueue: [],
    rewritePortalCusEleQueue: [],
    rewritePortalCusEleHeaderQueue: [],
    rewritePortalCusEleToolbarQueue: [],
    rewritePortalCusEleTabQueue: [],
    rewritePortalCusEleSettingQueue: [],
    rewriteRouteQueue: [],
    rewriteMobileRouteQueue: [],
    onWeaverMobileLoadQueue: [],
    checkPath:function(params) {
      var path = params.path;
      var appId = params.appId;
      var name = params.name;
      var node = params.node;
      var Route = params.Route;
      var nextState = params.nextState;
      if (!Route) return false;
      if (!Route.location) return false;
      if (!nextState) return false;
      var _path = Route.location.pathname;
      var _node = nextState.path;
      return (path + "/" + appId+"_"+name) == _path && (node == _node||node+"/:uuid" == _node);
    },
    checkMobilePath:function(params) {
      var path = params.path;
      var appId = params.appId;
      var name = params.name;
      var props = params.props;
      var state = params.state;
      if (!props) return false;
      if (!state) return false;
      if (!state.match) return false;
      var _path = props.path;
      var _appId = state.match.params.uuid;
      return _path == path && _appId == appId+"_"+name;
    },
    imp:function(obj) {
      return obj;
    },
    exp:function() {

    },
    ecodeQueueSort:function(arr) {
      var len = arr.length;
      for (var i = 0; i < len; i++) {
        for (var j = 0; j < len - 1 - i; j++) {
          if (arr[j].order > arr[j+1].order) {
            var temp = arr[j+1];
            arr[j+1] = arr[j];
            arr[j] = temp;
          }
        }
      }
      return arr;
    },
    overwritePropsFnQueueMap: {},
    overwritePropsFnQueueInit: function() {
      if(!window.pcComponentsConfig) window.pcComponentsConfig = {};
      var map = ecodeSDK.overwritePropsFnQueueMap;
      for(k in map) {
        if(!window.pcComponentsConfig[k]) window.pcComponentsConfig[k] = {};
        window.pcComponentsConfig[k]['overwritePropsFn'] = function (newProps,name) {
          var objMap = map[name];
          if(objMap&&objMap.queue) {
            var arr = objMap.queue;
            arr = ecodeSDK.ecodeQueueSort(arr);
            for (var j = 0; j < arr.length; j++) {
              var obj = arr[j];
              if (obj && typeof obj.fn == "function") {
                var result = obj.fn(newProps,name);
                if(result) {
                  newProps = result;
                }
              }
            }
            return newProps;
          }
        }
      }
    },
    overwritePropsFnQueueMapSet:function (k,v) {
      if(!ecodeSDK.overwritePropsFnQueueMap[k])
        ecodeSDK.overwritePropsFnQueueMap[k] = {queue:[]};
      var map = ecodeSDK.overwritePropsFnQueueMap[k];
      map.queue.push(v);
      ecodeSDK.overwritePropsFnQueueMap[k] = map;
      ecodeSDK.overwritePropsFnQueueInit();
    },
    overwriteClassFnQueueMap: {},
    overwriteClassFnQueueInit: function() {
      if(!window.pcComponentsConfig) window.pcComponentsConfig = {};
      var map = ecodeSDK.overwriteClassFnQueueMap;
      for(k in map) {
        if(!window.pcComponentsConfig[k]) window.pcComponentsConfig[k] = {};
        window.pcComponentsConfig[k]['overwriteClassFn'] = function (Com, newProps, name) {
          var objMap = map[name];
          if(objMap&&objMap.queue) {
            var arr = objMap.queue;
            arr = ecodeSDK.ecodeQueueSort(arr);
            var newResult = {
              com:Com,
              props:newProps
            };
            for (var j = 0; j < arr.length; j++) {
              var obj = arr[j];
              if (obj && typeof obj.fn == "function") {
                var result = obj.fn(Com, newProps, name);
                if (result) {
                  newResult = result;
                }
              }
            }
            return newResult;
          }
        }
      }
    },
    overwriteClassFnQueueMapSet:function (k,v) {
      if(!ecodeSDK.overwriteClassFnQueueMap[k])
        ecodeSDK.overwriteClassFnQueueMap[k] = {queue:[]};
      var map = ecodeSDK.overwriteClassFnQueueMap[k];
      map.queue.push(v);
      ecodeSDK.overwriteClassFnQueueMap[k] = map;
      ecodeSDK.overwriteClassFnQueueInit();
    },
    overwriteMobilePropsFnQueueMap: {},
    overwriteMobilePropsFnQueueInit: function() {
      if(!window.mobileComponentsConfig) window.mobileComponentsConfig = {};
      var map = ecodeSDK.overwriteMobilePropsFnQueueMap;
      for(k in map) {
        if(!window.mobileComponentsConfig[k]) window.mobileComponentsConfig[k] = {};
        window.mobileComponentsConfig[k]['overwritePropsFn'] = function (newProps,name) {
          name = name==""?k:name;
          var objMap = map[name];
          if(objMap&&objMap.queue) {
            var arr = objMap.queue;
            arr = ecodeSDK.ecodeQueueSort(arr);
            for (var j = 0; j < arr.length; j++) {
              var obj = arr[j];
              if (obj && typeof obj.fn == "function") {
                var result = obj.fn(newProps,name);
                if(result) {
                  newProps = result;
                }
              }
            }
            return newProps;
          }
        }
      }
    },
    overwriteMobilePropsFnQueueMapSet:function (k,v) {
      if(!ecodeSDK.overwriteMobilePropsFnQueueMap[k])
        ecodeSDK.overwriteMobilePropsFnQueueMap[k] = {queue:[]};
      var map = ecodeSDK.overwriteMobilePropsFnQueueMap[k];
      map.queue.push(v);
      ecodeSDK.overwriteMobilePropsFnQueueMap[k] = map;
      ecodeSDK.overwriteMobilePropsFnQueueInit();
    },
    overwriteMobileClassFnQueueMap: {},
    overwriteMobileClassFnQueueInit: function() {
      if(!window.mobileComponentsConfig) window.mobileComponentsConfig = {};
      var map = ecodeSDK.overwriteMobileClassFnQueueMap;
      for(k in map) {
        if(!window.mobileComponentsConfig[k]) window.mobileComponentsConfig[k] = {};
        window.mobileComponentsConfig[k]['overwriteClassFn'] = function (Com,newProps,name) {
          name = name==""?k:name;
          var objMap = map[name];
          if(objMap&&objMap.queue) {
            var newResult = {
              com:Com,
              props:newProps
            };
            var arr = objMap.queue;
            arr = ecodeSDK.ecodeQueueSort(arr);
            for (var j = 0; j < arr.length; j++) {
              var obj = arr[j];
              if (obj && typeof obj.fn == "function") {
                var result = obj.fn(Com,newProps,name);
                if(result) {
                  newResult = result;
                }
              }
            }
            return newResult;
          }
        }
      }
    },
    overwriteMobileClassFnQueueMapSet:function (k,v) {
      if(!ecodeSDK.overwriteMobileClassFnQueueMap[k])
        ecodeSDK.overwriteMobileClassFnQueueMap[k] = {queue:[]};
      var map = ecodeSDK.overwriteMobileClassFnQueueMap[k];
      map.queue.push(v);
      ecodeSDK.overwriteMobileClassFnQueueMap[k] = map;
      ecodeSDK.overwriteMobileClassFnQueueInit();
    },
    checkLPath:function(url) {
      var pathname = window.location.pathname;
      var hash = window.location.hash;
      return (pathname+hash).indexOf(url)==0&&url!="";
    },
    findPropData:function(props, key) {
      var value = '';

      if (props && props.children && _instanceof(props.children, Array)) {
        for (var i = 0; i < props.children.length && value === ''; i++) {
          var tmpValue = ecodeSDK.findPropData(props.children[i].props, key);

          if (tmpValue && tmpValue !== '') {
            value = tmpValue;
          }
        }
      } else if (props && props.children && _instanceof(props.children, Object)) {
        var _tmpValue = ecodeSDK.findPropData(props.children.props, key);

        if (_tmpValue && _tmpValue !== '') {
          value = _tmpValue;
        }
      } else if (props && props[key]) {
        var _tmpValue2 = props[key];

        if (_tmpValue2 && _tmpValue2 !== '') {
          value = _tmpValue2;
        }
      }

      return value;
    },
    rewriteApiDataQueue: null,
    rewriteApiDataQueueInit: function() {
      window.rewriteApiData = function (_url, params, data) {
        var res = null;
        for (var i = 0; i< ecodeSDK.rewriteApiDataQueue.length; i++) {
          res = ecodeSDK.rewriteApiDataQueue[i].fn(_url, params, res || data);
        }
        return res || data;
      }
    },
    rewriteApiDataQueueSet: function(v) {
      if (v && typeof v.fn === 'function') {
        if (!ecodeSDK.rewriteApiDataQueue) ecodeSDK.rewriteApiDataQueue = [];
        ecodeSDK.rewriteApiDataQueue.push(v);
        ecodeSDK.rewriteApiDataQueueInit();
      }
    },
    rewriteApiParamsQueue: null,
    rewriteApiParamsQueueInit: function() {
      if (!window.e9ssoPCConfig) {
        window.e9ssoPCConfig = {
          inUse: true,
          callapi_params_handler: null,
        }
      }
      window.e9ssoPCConfig.callapi_params_handler = function (
          _url,
          method,
          params,
          type,
          _fetchParams
      ) {
        var res = {};
        var resAll = {};
        function getFd(values, deep) {
          var fd = "";
          for (var p in values) {
            var target = values[p];
            if (typeof target === "function") {
              continue;
            }
            if (deep && typeof target === "object") {
              fd += getFd(target, deep);
            } else if (p == "jsonstr" && typeof target === "object") {
              var item = JSON.stringify(target);
              fd += p + "=" + item.replace(/\\/g, "") + "&";
            } else {
              // 处理undefined null数据to 空串
              target = target == undefined ? "" : target;
              var item = encodeURIComponent(target);
              fd += p + "=" + item + "&";
            }
          }
          return fd;
        };
        for (var i = 0; i< ecodeSDK.rewriteApiParamsQueue.length; i++) {
          res = ecodeSDK.rewriteApiParamsQueue[i].fn.fn(
            (resAll[_url] && resAll[_url].url) || _url,
            (resAll[_url] && resAll[_url].method) || method,
            (resAll[_url] && resAll[_url].params) || params,
            (resAll[_url] && resAll[_url].type) || type,
            (resAll[_url] && resAll[_url].fetchParams) || _fetchParams
          );
          resAll[_url] = res;
        }
        var resultParams = res || {};
        if(resultParams.fetchParams) {
          var clonefetchParams = resultParams.fetchParams.params || {};
          if ((JSON.stringify(clonefetchParams) != "{}") && method.toUpperCase() !== "GET") {
            resultParams.fetchParams.body = getFd(clonefetchParams, false);
          }
        }
        var result = {
          url: resultParams.url || _url,
          method: resultParams.method || method,
          params: resultParams.params || params,
          type: resultParams.type || type,
          fetchParams: resultParams.fetchParams,
        };
        return result;
      }
    },
    rewriteApiParamsQueueSet: function(v, order) {
      if (v && typeof v.fn === 'function') {
        if (!ecodeSDK.rewriteApiParamsQueue) {
          ecodeSDK.rewriteApiParamsQueue = [];
        }
        ecodeSDK.rewriteApiParamsQueue.push({
          fn: v,
          order: order || 1,
        });
        ecodeSDK.rewriteApiParamsQueue = ecodeSDK.ecodeQueueSort(ecodeSDK.rewriteApiParamsQueue);
        ecodeSDK.rewriteApiParamsQueueInit();
      }
    },
    rewriteMobileApiParamsQueue: null,
    rewriteMobileApiParamsQueueInit: function() {
      if (!window.e9ssoMobileConfig) {
        window.e9ssoMobileConfig = {
          inUse: true,
          callapi_params_handler: null,
          customInit: function () {
            return new Promise(function (resolve) {resolve();});
          }
        }
      }
      window.e9ssoMobileConfig.callapi_params_handler = function (
          _url, method, params, includeCredentials, useJson, _fetchParams
      ) {
        var res = {};
        var resAll = {};
        for (var i = 0; i< ecodeSDK.rewriteMobileApiParamsQueue.length; i++) {
          res = ecodeSDK.rewriteMobileApiParamsQueue[i].fn.fn(
            (resAll[_url] && resAll[_url].url) || _url,
            (resAll[_url] && resAll[_url].method) || method,
            (resAll[_url] && resAll[_url].params) || params,
            (resAll[_url] && resAll[_url].includeCredentials) || includeCredentials,
            (resAll[_url] && resAll[_url].useJson) || useJson,
            (resAll[_url] && resAll[_url].fetchParams) || _fetchParams
          );
          resAll[_url] = res;
        }
        var resultParams = res || {};
        var result = {
          url: resultParams.url || _url,
          method: resultParams.method || method,
          params: resultParams.params || params,
          includeCredentials: resultParams.includeCredentials || includeCredentials,
          useJson: resultParams.useJson || useJson,
          fetchParams: resultParams.fetchParams,
        };
        return result;
      }
    },
    rewriteMobileApiParamsQueueSet: function(v, order) {
      if (v && typeof v.fn === 'function') {
        if (!ecodeSDK.rewriteMobileApiParamsQueue) {
          ecodeSDK.rewriteMobileApiParamsQueue = [];
        }
        ecodeSDK.rewriteMobileApiParamsQueue.push({
          fn: v,
          order: order || 1,
        });
        ecodeSDK.rewriteMobileApiParamsQueue = ecodeSDK.ecodeQueueSort(ecodeSDK.rewriteMobileApiParamsQueue);
        ecodeSDK.rewriteMobileApiParamsQueueInit();
      }
    },
    getJSONObj: function(key) {
      if (!window.localStorage[key]) return null;
      try {
          return JSON.parse(window.localStorage[key]);
      }
      catch(e) {
        return {}
      }
    },
    getEcodeParams: function(keys) {
      if (keys && keys instanceof Array) {
        var len = keys.length;
        var result = '';
        for(var i=0; i < len; i++) {
          var key = keys[i];
          if (key && i === 0) {
            result = ecodeSDK.getJSONObj(keys[i]);
          } else if (key && result && result[key]) {
            result = result[key] || '';
          }
        }
        return result;
      }
      return '';
    }
  }

  ecodeSDK.overwritePropsFnQueueInit();

  ecodeSDK.overwriteClassFnQueueInit();

  ecodeSDK.overwriteMobilePropsFnQueueInit();

  ecodeSDK.overwriteMobileClassFnQueueInit();

  window.onWeaverMobileLoad = function () {
    for (var i = 0; i < ecodeSDK.onWeaverMobileLoadQueue.length; i++) {
      var fn = ecodeSDK.onWeaverMobileLoadQueue[i];
      if (typeof fn == "function") {
        fn();
      }
    }
  }
  window.rewriteRoute = function (Com, Route, nextState) {
    var NewCom = null;
    ecodeSDK.rewriteRouteQueue = ecodeSDK.ecodeQueueSort(ecodeSDK.rewriteRouteQueue);
    for (var i = 0; i < ecodeSDK.rewriteRouteQueue.length&&NewCom==null; i++) {
      var obj = ecodeSDK.rewriteRouteQueue[i];
      if (obj && typeof obj.fn == "function") {
        var ThisCom = obj.fn({Com:Com, Route:Route, nextState:nextState});
        if (ThisCom != null) {
          NewCom = ThisCom;
        }
      }
    }
    return NewCom==null?Com:NewCom;
  };
  window.rewriteMobileRoute = function (Com, props, state, context) {
    ecodeSDK.rewriteMobileRouteQueue = ecodeSDK.ecodeQueueSort(ecodeSDK.rewriteMobileRouteQueue);
    for (var i = 0; i < ecodeSDK.rewriteMobileRouteQueue.length; i++) {
      var obj = ecodeSDK.rewriteMobileRouteQueue[i];
      if (obj && typeof obj.fn == "function") {
        var ThisCom = obj.fn({Com:Com, props:props, state:state, context:context},props);
        if (ThisCom != null) Com = ThisCom;
      }
    }
    return Com;
  }
  window.rewritePortalCusEleSetting = function (props, options) {
    ecodeSDK.rewritePortalCusEleSettingQueue = ecodeSDK.ecodeQueueSort(ecodeSDK.rewritePortalCusEleSettingQueue);
    var Com = null;
    for (var i = 0; i < ecodeSDK.rewritePortalCusEleSettingQueue.length; i++) {
      var obj = ecodeSDK.rewritePortalCusEleSettingQueue[i];
      if (obj && typeof obj.fn == "function") {
        var ThisCom = obj.fn({props:props, options:options});
        if (ThisCom != null) Com = ThisCom;
      }
    }
    return Com;
  }
  window.rewritePortalCusEle = function (props, options) {
    ecodeSDK.rewritePortalCusEleQueue = ecodeSDK.ecodeQueueSort(ecodeSDK.rewritePortalCusEleQueue);
    var Com = null;
    for (var i = 0; i < ecodeSDK.rewritePortalCusEleQueue.length; i++) {
      var obj = ecodeSDK.rewritePortalCusEleQueue[i];
      if (obj && typeof obj.fn == "function") {
        var ThisCom = obj.fn({props:props, options:options});
        if (ThisCom != null) Com = ThisCom;
      }
    }
    return Com;
  }
  window.rewritePortalLogin = function (props, options) {
    ecodeSDK.rewritePortalLoginQueue = ecodeSDK.ecodeQueueSort(ecodeSDK.rewritePortalLoginQueue);
    var Com = null;
    for (var i = 0; i < ecodeSDK.rewritePortalLoginQueue.length; i++) {
      var obj = ecodeSDK.rewritePortalLoginQueue[i];
      if (obj && typeof obj.fn == "function") {
        var ThisCom = obj.fn({props:props, options:options});
        if (ThisCom != null) Com = ThisCom;
      }
    }
    return Com;
  }
  window.rewritePortalTheme = function (props, options) {
    ecodeSDK.rewritePortalThemeQueue = ecodeSDK.ecodeQueueSort(ecodeSDK.rewritePortalThemeQueue);
    var Com = null;
    for (var i = 0; i < ecodeSDK.rewritePortalThemeQueue.length; i++) {
      var obj = ecodeSDK.rewritePortalThemeQueue[i];
      if (obj && typeof obj.fn == "function") {
        var ThisCom = obj.fn({props:props, options:options});
        if (ThisCom != null) Com = ThisCom;
      }
    }
    return Com;
  }
  window.rewritePortalEleHeader = function (props, options) {
    ecodeSDK.rewritePortalCusEleHeaderQueue = ecodeSDK.ecodeQueueSort(ecodeSDK.rewritePortalCusEleHeaderQueue);
    var Com = null;
    for (var i = 0; i < ecodeSDK.rewritePortalCusEleHeaderQueue.length; i++) {
      var obj = ecodeSDK.rewritePortalCusEleHeaderQueue[i];
      if (obj && typeof obj.fn == "function") {
        var ThisCom = obj.fn({props:props, options:options});
        if (ThisCom != null) Com = ThisCom;
      }
    }
    return Com;
  }
  window.rewritePortalEleToolbar = function (props, options) {
    ecodeSDK.rewritePortalCusEleToolbarQueue = ecodeSDK.ecodeQueueSort(ecodeSDK.rewritePortalCusEleToolbarQueue);
    var Com = null;
    for (var i = 0; i < ecodeSDK.rewritePortalCusEleToolbarQueue.length; i++) {
      var obj = ecodeSDK.rewritePortalCusEleToolbarQueue[i];
      if (obj && typeof obj.fn == "function") {
        var ThisCom = obj.fn({props:props, options:options});
        if (ThisCom != null) Com = ThisCom;
      }
    }
    return Com;
  }
  window.rewritePortalEleTab = function (props, options) {
    ecodeSDK.rewritePortalCusEleTabQueue = ecodeSDK.ecodeQueueSort(ecodeSDK.rewritePortalCusEleTabQueue);
    var Com = null;
    for (var i = 0; i < ecodeSDK.rewritePortalCusEleTabQueue.length; i++) {
      var obj = ecodeSDK.rewritePortalCusEleTabQueue[i];
      if (obj && typeof obj.fn == "function") {
        var ThisCom = obj.fn({props:props, options:options});
        if (ThisCom != null) Com = ThisCom;
      }
    }
    return Com;
  }
  ecodeSDK.loadjs = function () {
    var a = function () {
    }, c = {}, u = {}, f = {};

    function o(e, n) {
      if (e) {
        var t = f[e];
        if (u[e] = n, t) for (; t.length;) t[0](e, n), t.splice(0, 1)
      }
    }

    function l(e, n) {
      e.call && (e = {success: e}), n.length ? (e.error || a)(n) : (e.success || a)(e)
    }

    function h(t, r, s, i) {
      var c, o, e = document, n = s.async, u = (s.numRetries || 0) + 1, f = s.before || a,
          l = t.replace(/^(css|img)!/, "");
      i = i || 0, /(^css!|\.css$)/.test(t) ? ((o = e.createElement("link")).rel = "stylesheet", o.href = l, (c = "hideFocus" in o) && o.relList && (c = 0, o.rel = "preload", o.as = "style")) : /(^img!|\.(png|gif|jpg|svg)$)/.test(t) ? (o = e.createElement("img")).src = l : ((o = e.createElement("script")).src = t, o.async = void 0 === n || n), !(o.onload = o.onerror = o.onbeforeload = function (e) {
        var n = e.type[0];
        if (c) try {
          o.sheet.cssText.length || (n = "e")
        } catch (e) {
          18 != e.code && (n = "e")
        }
        if ("e" == n) {
          if ((i += 1) < u) return h(t, r, s, i)
        } else if ("preload" == o.rel && "style" == o.as) return o.rel = "stylesheet";
        r(t, n, e.defaultPrevented)
      }) !== f(t, o) && e.head.appendChild(o)
    }

    function t(e, n, t) {
      var r, s;
      if (n && n.trim && (r = n), s = (r ? t : n) || {}, r) {
        if (r in c) throw"LoadJS";
        c[r] = !0
      }

      function i(n, t) {
        !function (e, r, n) {
          var t, s, i = (e = e.push ? e : [e]).length, c = i, o = [];
          for (t = function (e, n, t) {
            if ("e" == n && o.push(e), "b" == n) {
              if (!t) return;
              o.push(e)
            }
            --i || r(o)
          }, s = 0; s < c; s++) h(e[s], t, n)
        }(e, function (e) {
          l(s, e), n && l({success: n, error: t}, e), o(r, e)
        }, s)
      }

      if (s.returnPromise) return new Promise(i);
      i()
    }

    return t.ready = function (e, n) {
      return function (e, t) {
        e = e.push ? e : [e];
        var n, r, s, i = [], c = e.length, o = c;
        for (n = function (e, n) {
          n.length && i.push(e), --o || t(i)
        }; c--;) r = e[c], (s = u[r]) ? n(r, s) : (f[r] = f[r] || []).push(n)
      }(e, function (e) {
        l(n, e)
      }), t
    }, t.done = function (e) {
      o(e, [])
    }, t.reset = function () {
      c = {}, u = {}, f = {}
    }, t.isDefined = function (e) {
      return e in c
    }, t
  }();
})();

(function(){
  if (!window.weaJs) {
    window.weaJs = {
      getFrameParams: function () {
        var url = window.location.href;
        var urlParams = url.slice(url.lastIndexOf('?') + 1).split('&');
        var params = {};
        // urlParams.forEach(element => {
        //   var datas = element.split('=');
        //   params[datas[0]] = datas[1];
        // });
        urlParams.forEach(function (element) {
          var datas = element.split('=');
          params[datas[0]] = datas[1];
        });
        return params;
      },
      callApi: function (options) {
        if (Object.prototype.toString.call(options) === '[object Object]') {
          if (window.sso_callApi) {
            // mobile
            return window.sso_callApi(options);
          } else if (window.ecCom && window.ecCom.WeaTools) {
            // pc
            var url = options.url || '';
            var method = options.method || 'GET';
            var params = options.params || {};
            var deep = options.deep || false;
            var checkCode = options.checkCode !== false;
            var type = options.type || 'json';
            return window.ecCom.WeaTools.callApi(url, method, params, type, deep, checkCode);
          }
        }
      },
      alert: function(content) {
        if (typeof content === 'string') {
          if (window.antd && window.antd.Modal) {
            // pc
            window.antd.Modal.info({ content: content });
          } else {
            // mobile 0601之后包会调用移动端组件
            window.alert(content);
          }
        }
      },
      showDialog: function(url, params) {
        if (window.ecCom && window.ecCom.WeaTools) {
          // pc
          var options = { url: url };
          if (Object.prototype.toString.call(params) === '[object Object]') {
            for (var key in params) {
              if (params.hasOwnProperty(key)) {
                options[key] = params[key];
              }
            }
          }
          var dialog = window.ecCom.WeaTools.createDialog(options);
          dialog.show();
          return dialog;
        } else {
          // mobile 0601之后包会调用移动端路由页面组件
          var frameView = window.document.createElement("div");
          var closeDom = window.document.createElement("div");
          frameView.style.position = "fixed";
          frameView.style.background = "#fff";
          frameView.style.width = "100%";
          frameView.style.height = "100%";
          frameView.style.top = 0;
          frameView.style.left = 0;
          frameView.style.zIndex = 998;
          frameView.innerHTML = '<iframe style="border:none;height:100%;width:100%" src="' + url + '"></iframe>';
          closeDom.className = 'wea-js-showDialog-close';

          if (!document.getElementById('weaJsShowDialogCloseStyle')) {
            var closeStyle = window.document.createElement("style");
            closeStyle.id = 'weaJsShowDialogCloseStyle';
            closeStyle.innerHTML = '.wea-js-showDialog-close{position:absolute;right:3px;top:3px;width:30px;height:30px;background:#ccc;opacity:.6;border-radius:50%;cursor:pointer}.wea-js-showDialog-close:hover{opacity:1}.wea-js-showDialog-close:after,.wea-js-showDialog-close:before{position:absolute;content:"";width:20px;height:4px;background:#fff;top:13px;left:5px;transform: rotate(-45deg);}.wea-js-showDialog-close:before{transform:rotate(45deg)}';
            window.document.head.appendChild(closeStyle);
          }
          window.document.body.appendChild(frameView);
          frameView.appendChild(closeDom);
          var result = {
            destory: function () {
              try {
                window.document.body.removeChild(frameView);
              } catch (error) {}
            }
          }
          closeDom.onclick = function(e) {
            result.destory();
            e.preventDefault();
          }
          return result;
        }
      },
      Custom: function() {

        function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

        function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

        function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

        function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

        function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

        function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

        function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

        function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

        function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

        var WeaCustom =
        /*#__PURE__*/
        function (_React$Component) {
          _inherits(WeaCustom, _React$Component);

          function WeaCustom() {
            _classCallCheck(this, WeaCustom);

            return _possibleConstructorReturn(this, _getPrototypeOf(WeaCustom).apply(this, arguments));
          }

          _createClass(WeaCustom, [{
            key: "render",
            value: function render() {
              return this.props.children;
            }
          }]);

          return WeaCustom;
        }(React.Component);
        return WeaCustom;
      },
      Con: function() {

        function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

        function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

        function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

        function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

        function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

        function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

        function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

        function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

        function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

        var WeaCon =
        /*#__PURE__*/
        function (_React$Component) {
          _inherits(WeaCon, _React$Component);

          function WeaCon() {
            _classCallCheck(this, WeaCon);

            return _possibleConstructorReturn(this, _getPrototypeOf(WeaCon).apply(this, arguments));
          }

          _createClass(WeaCon, [{
            key: "render",
            value: function render() {
              return this.props.children;
            }
          }]);

          return WeaCon;
        }(React.Component);
        return WeaCon;
      },
    };
  }
})();

(function() {


var config = {
  enable: true,
  // 启用所有
  base: {
    videoPlugMobile: {
      // mobile视频插件
      enable: true
    },
    videoPlugMobileUsed: {
      // 调用mobile视频插件
      enable: true
    }
  }
};
ecodeSDK.setCom('12b57552cd8b4706950b82fb9f6607fe', 'config', config);
/* 
路径：
视频会议插件/config/视频会议mobile/config.js(5025fd7700fa4f1abfc25c5d5b9a0bac)
*/
})();
(function() {

/* 
路径：
X西安奕斯伟硅片技术有限公司/config/人力浏览按钮组织架构和全部人员/config.js(9b9e02c8d03f47c3bb0d9c6a04792baf)
*/
})();
(function() {


var config = {
  tabs: [{
    "editable": false,
    "moudledata": "{\"displaySetting\":{\"groups\":[{\"options\":[{\"showname\":\"分部\",\"name\":\"subcompany\",\"label\":\"141\",\"key\":\"subcompany\"},{\"showname\":\"部门\",\"name\":\"department\",\"label\":\"124\",\"key\":\"department\"},{\"showname\":\"岗位\",\"name\":\"jobtitle\",\"label\":\"6086\",\"key\":\"jobtitle\"},{\"showname\":\"编号\",\"name\":\"workcode\",\"label\":\"714\",\"key\":\"workcode\"}],\"groupname\":\"人员信息\",\"value\":\"subcompany,department\"},{\"options\":[{\"showname\":\"应出勤天数\",\"name\":\"workdays\",\"label\":\"27999\",\"key\":\"workdays\"},{\"showname\":\"实际出勤天数\",\"name\":\"attendancedays\",\"label\":\"28000\",\"key\":\"attendancedays\"},{\"showname\":\"标准工时\",\"name\":\"standardworkmins\",\"label\":\"-81502\",\"key\":\"standardworkmins\"},{\"showname\":\"确认情况\",\"name\":\"confirmType\",\"label\":\"-81594\",\"key\":\"confirmType\"},{\"showname\":\"确认时间\",\"name\":\"confirmDate\",\"label\":\"-81595\",\"key\":\"confirmDate\"},{\"showname\":\"考勤月份\",\"name\":\"popkqDate\",\"label\":\"-81596\",\"key\":\"popkqDate\"},{\"showname\":\"上班工时\",\"name\":\"workhours\",\"label\":\"-81503\",\"key\":\"workhours\"},{\"showname\":\"加班工时\",\"name\":\"overhours\",\"label\":\"-81504\",\"key\":\"overhours\"},{\"showname\":\"实际打卡时长\",\"name\":\"signmins\",\"label\":\"511275\",\"key\":\"signmins\"},{\"showname\":\"出勤班次\",\"name\":\"attendanceSerial\",\"label\":\"390054\",\"key\":\"attendanceSerial\"},{\"showname\":\"法定节假日加班工时\",\"name\":\"holidaymins\",\"label\":\"-81505\",\"key\":\"holidaymins\"},{\"showname\":\"考勤日历\",\"name\":\"kqCalendar\",\"label\":\"386476\",\"key\":\"kqCalendar\"},{\"showname\":\"旷工时长\",\"name\":\"absenteeismdays\",\"label\":\"-81591\",\"key\":\"absenteeismdays\"}],\"groupname\":\"考勤统计信息\",\"value\":\"workdays,attendancedays,confirmDate,popkqDate,kqCalendar,confirmType\"},{\"options\":[{\"showname\":\"迟到\",\"name\":\"beLate\",\"label\":\"20081\",\"key\":\"beLate\"},{\"showname\":\"严重迟到\",\"name\":\"graveBeLate\",\"label\":\"500546\",\"key\":\"graveBeLate\"},{\"showname\":\"早退\",\"name\":\"leaveEearly\",\"label\":\"20082\",\"key\":\"leaveEearly\"},{\"showname\":\"严重早退\",\"name\":\"graveLeaveEarly\",\"label\":\"500547\",\"key\":\"graveLeaveEarly\"},{\"showname\":\"旷工\",\"name\":\"absenteeism\",\"label\":\"20085\",\"key\":\"absenteeism\"},{\"showname\":\"漏签\",\"name\":\"forgotCheck\",\"label\":\"20086\",\"key\":\"forgotCheck\"}],\"groupname\":\"考勤异常记录\",\"value\":\"\"},{\"options\":[{\"showname\":\"请假\",\"name\":\"leave\",\"label\":\"670\",\"key\":\"leave\"},{\"showname\":\"加班\",\"name\":\"overtime\",\"label\":\"6151\",\"key\":\"overtime\"},{\"showname\":\"出差\",\"name\":\"businessLeave\",\"label\":\"20084\",\"key\":\"businessLeave\"},{\"showname\":\"公出\",\"name\":\"officialBusiness\",\"label\":\"24058\",\"key\":\"officialBusiness\"}],\"groupname\":\"考勤类型\",\"value\":\"\"}]},\"typeselect\":{\"typeselect\":\"3\"},\"viewScope\":{\"viewScope\":\"0\"},\"status\":{\"status\":\"8\"}}",
    // "title": "新汇总报表",
    "key": "1"
  }],
  dialog: [{
    "editable": false,
    "moudledata": "{\"displaySetting\":{\"groups\":[{\"options\":[{\"showname\":\"分部\",\"name\":\"subcompany\",\"label\":\"141\",\"key\":\"subcompany\"},{\"showname\":\"部门\",\"name\":\"department\",\"label\":\"124\",\"key\":\"department\"},{\"showname\":\"岗位\",\"name\":\"jobtitle\",\"label\":\"6086\",\"key\":\"jobtitle\"},{\"showname\":\"编号\",\"name\":\"workcode\",\"label\":\"714\",\"key\":\"workcode\"}],\"groupname\":\"人员信息\",\"value\":\"subcompany,department\"},{\"options\":[{\"showname\":\"应出勤天数\",\"name\":\"workdays\",\"label\":\"27999\",\"key\":\"workdays\"},{\"showname\":\"实际出勤天数\",\"name\":\"attendancedays\",\"label\":\"28000\",\"key\":\"attendancedays\"},{\"showname\":\"标准工时\",\"name\":\"standardworkmins\",\"label\":\"-81502\",\"key\":\"standardworkmins\"},{\"showname\":\"确认情况\",\"name\":\"confirmType\",\"label\":\"-81594\",\"key\":\"confirmType\"},{\"showname\":\"确认时间\",\"name\":\"confirmDate\",\"label\":\"-81595\",\"key\":\"confirmDate\"},{\"showname\":\"考勤月份\",\"name\":\"popkqDate\",\"label\":\"-81596\",\"key\":\"popkqDate\"},{\"showname\":\"上班工时\",\"name\":\"workhours\",\"label\":\"-81503\",\"key\":\"workhours\"},{\"showname\":\"加班工时\",\"name\":\"overhours\",\"label\":\"-81504\",\"key\":\"overhours\"},{\"showname\":\"实际打卡时长\",\"name\":\"signmins\",\"label\":\"511275\",\"key\":\"signmins\"},{\"showname\":\"出勤班次\",\"name\":\"attendanceSerial\",\"label\":\"390054\",\"key\":\"attendanceSerial\"},{\"showname\":\"法定节假日加班工时\",\"name\":\"holidaymins\",\"label\":\"-81505\",\"key\":\"holidaymins\"},{\"showname\":\"考勤日历\",\"name\":\"kqCalendar\",\"label\":\"386476\",\"key\":\"kqCalendar\"},{\"showname\":\"旷工时长\",\"name\":\"absenteeismdays\",\"label\":\"-81591\",\"key\":\"absenteeismdays\"}],\"groupname\":\"考勤统计信息\",\"value\":\"workdays,attendancedays,confirmDate,popkqDate,kqCalendar,confirmType\"},{\"options\":[{\"showname\":\"迟到\",\"name\":\"beLate\",\"label\":\"20081\",\"key\":\"beLate\"},{\"showname\":\"严重迟到\",\"name\":\"graveBeLate\",\"label\":\"500546\",\"key\":\"graveBeLate\"},{\"showname\":\"早退\",\"name\":\"leaveEearly\",\"label\":\"20082\",\"key\":\"leaveEearly\"},{\"showname\":\"严重早退\",\"name\":\"graveLeaveEarly\",\"label\":\"500547\",\"key\":\"graveLeaveEarly\"},{\"showname\":\"旷工\",\"name\":\"absenteeism\",\"label\":\"20085\",\"key\":\"absenteeism\"},{\"showname\":\"漏签\",\"name\":\"forgotCheck\",\"label\":\"20086\",\"key\":\"forgotCheck\"}],\"groupname\":\"考勤异常记录\",\"value\":\"\"},{\"options\":[{\"showname\":\"请假\",\"name\":\"leave\",\"label\":\"670\",\"key\":\"leave\"},{\"showname\":\"加班\",\"name\":\"overtime\",\"label\":\"6151\",\"key\":\"overtime\"},{\"showname\":\"出差\",\"name\":\"businessLeave\",\"label\":\"20084\",\"key\":\"businessLeave\"},{\"showname\":\"公出\",\"name\":\"officialBusiness\",\"label\":\"24058\",\"key\":\"officialBusiness\"}],\"groupname\":\"考勤类型\",\"value\":\"\"}]},\"typeselect\":{\"typeselect\":\"3\"},\"viewScope\":{\"viewScope\":\"0\"},\"status\":{\"status\":\"8\"}}",
    "key": "21"
  }]
};
ecodeSDK.setCom('dc0652580c404601af941a7d3812d228', 'config', config);
/* 
路径：
用户弹窗确认界面/用户弹窗确认界面/config/config.js(e00cb838030840cfa9209307a8702174)
*/
})();
(function() {


var config = {
  departHide: ["deptResourceInfo"],
  //部门需隐藏的字段名
  subCompanytHide: ["subcomResourceInfo"] //部门需隐藏的字段名

};
ecodeSDK.setCom('9306496761374d65825fbd5b9d273473', 'config', config);
/* 
路径：
组织架构隐藏和部门分部链接取消/config/组织架构隐藏和部门分部链接取消/config.js(bbba166f6b7e43f9b0328e592be261da)
*/
})();
(function() {


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var config = ecodeSDK.getCom('9306496761374d65825fbd5b9d273473', 'config');
var isadmin = false;
jQuery().ready(function () {
  window.weaJs.callApi({
    url: '/api/organizationcustom/check/checkIsAdmin',
    method: 'GET'
  }).then(function (res) {
    // console.log('res',res)
    if (res.status == '1') {
      if (res.isadmin == "false") {
        isadmin = false;
      } else {
        isadmin = true;
      }
    }
  });
});
ecodeSDK.overwritePropsFnQueueMapSet('WeaLeftRightLayout', {
  //组件名
  fn: function fn(newProps) {
    //newProps代表组件参数
    //进行位置判断
    var _window$location = window.location,
        hash = _window$location.hash,
        href = _window$location.href;
    console.log('left==', newProps);

    if (href.indexOf('#/main/hrm/addressBook') !== -1 || hash.startsWith("#/main/hrm/addressbook")) {
      if (newProps.ecId.indexOf("_WeaLeftRightLayout@7muhhb") == -1) return;
      window.weaJs.callApi({
        url: '/api/organizationcustom/check/checkIsAdmin',
        method: 'GET'
      }).then(function (res) {
        //console.log('res',res)
        if (res.status == '1') {
          if (res.isadmin == "false") {
            isadmin = false;
          } else {
            isadmin = true;
          }
        }
      });
      newProps.showLeft = isadmin;
      newProps.showBtn = isadmin;
    }
  },
  order: 1,
  //排序字段，如果存在同一个页面复写了同一个组件，控制顺序时使用
  desc: '左侧组织架构隐藏'
});
ecodeSDK.overwritePropsFnQueueMapSet('WeaBrowser', {
  //组件名
  fn: function fn(newProps) {
    //newProps代表组件参数
    //newProps.type == '4' || newProps.type =='164' 
    if (newProps.type == '57' || newProps.type == '194') {
      //隐藏分部
      if (!isadmin) {
        newProps.linkUrl = "";
      }
    }
  },
  order: 1,
  //排序字段，如果存在同一个页面复写了同一个组件，控制顺序时使用
  desc: '浏览按钮部门分部链接取消'
});
ecodeSDK.overwritePropsFnQueueMapSet('WeaTab', {
  //组件名
  fn: function fn(newProps) {
    //newProps代表组件参数
    var hash = window.location.hash;

    var _weaJs$getFrameParams = weaJs.getFrameParams(),
        type = _weaJs$getFrameParams.type;

    if (!hash.startsWith("#/hrmengine/organization")) return;
    console.log('weat', newProps);

    if (type == "department" || type == "subcompany") {
      if (!isadmin) {
        newProps.datas = newProps.datas.filter(function (i) {
          return i.key === '1';
        });
      }
    }
  },
  order: 1,
  //排序字段，如果存在同一个页面复写了同一个组件，控制顺序时使用
  desc: '部门详情页隐藏部分页签'
});
ecodeSDK.overwritePropsFnQueueMapSet('WeaNewScroll', {
  //组件名
  fn: function fn(newProps) {
    //newProps代表组件参数
    //进行位置判断
    var _location = location,
        hash = _location.hash;
    if (isadmin) return;

    if (hash.indexOf("#/main/hrm/card/cardInfo") !== -1) {
      if (document.querySelector('.orgInfo')) {// 获取包含<a>标签的DOM元素
        // let orgInfoDiv = document.querySelector('.orgInfo');
        // // 获取所有<a>标签
        // let anchorTags = orgInfoDiv.querySelectorAll('a');
        // // 遍历每个<a>标签并将其替换为其文本内容
        // anchorTags.forEach(function(anchor) {
        //   let text = anchor.textContent;
        //   anchor.outerHTML = text;
        // });
      }
    }

    if (!newProps.children || newProps.children.props == null || newProps.children.props.className == null || _typeof(newProps.children.props.className) == undefined && _.isEmpty(newProps.children.props.className)) return;

    if (!newProps.children.props && !_.isEmpty(newProps.children.props.className) && newProps.children.props.className.indexOf("wea-popover-hrm-info") !== -1) {
      if (newProps.children && newProps.children.props && newProps.children.props.children) {
        var temp = newProps.children.props.children;
        arr = temp.map(function (i, index) {
          if (i.props.children && i.props.children.length > 1 && index == 1) {
            i.props.children[1].props = {
              children: i.props.children[1].props.children,
              title: i.props.children[1].props.title
            };
            i.props.children[1].type = "span";
          }

          return i;
        });
        newProps.children.props.children = arr;
      }
    }
  },
  order: 1,
  //排序字段，如果存在同一个页面复写了同一个组件，控制顺序时使用
  desc: '浏览按钮部门分部链接取消'
});
ecodeSDK.overwritePropsFnQueueMapSet('Table', {
  //组件名
  fn: function fn(newProps) {
    //newProps代表组件参数
    //进行位置判断
    var _window$location2 = window.location,
        hash = _window$location2.hash,
        href = _window$location2.href; // if(href.indexOf('#/main/hrm/addressBook') !== -1 || hash.startsWith("#/main/hrm/addressbook")){
    //   if(newProps.ecId.indexOf('_WeaTable@8r6p9a') == -1)return;

    if (newProps.columns && newProps.columns.length !== 0) {
      if (!isadmin) {
        newProps.columns = newProps.columns.map(function (i) {
          // if(i.dataIndex == "departmentid"){
          //   i.render = (text, record) => {
          //     return <span  dangerouslySetInnerHTML={{__html:  record.departmentidspan ? record.departmentidspan.replace(/<a\s[^>]*>(.*?)<\/a>/g, '$1'): record.departmentid && record.departmentid.replace(/<a\s[^>]*>(.*?)<\/a>/g, '$1')}}></span>
          //   }
          // }
          if (i.dataIndex == "subcompanyid1") {
            i.render = function (text, record) {
              return React.createElement("span", {
                dangerouslySetInnerHTML: {
                  __html: typeof record.subcompanyid1span == "string" ? record.subcompanyid1span.replace(/<a\s[^>]*>(.*?)<\/a>/g, '$1') : typeof record.subcompanyid1 == "string" && record.subcompanyid1.replace(/<a\s[^>]*>(.*?)<\/a>/g, '$1')
                }
              });
            };
          }

          if (i.dataIndex == "orgid") {
            i.render = function (text, record) {
              return React.createElement("span", {
                dangerouslySetInnerHTML: {
                  __html: typeof record.orgidspan == "string" ? record.orgidspan.replace(/<a[^>]*>(.*?)<\/a>/g, '$1') : record.orgid && typeof record.orgid == "string" && record.orgid.replace(/<a[^>]*>(.*?)<\/a>/g, '$1')
                }
              });
            };
          }

          return i;
        });
      }
    } // }

  },
  order: 1,
  //排序字段，如果存在同一个页面复写了同一个组件，控制顺序时使用
  desc: '表格部门分部链接取消'
});
ecodeSDK.rewriteApiDataQueueSet({
  fn: function fn(url, params, data) {
    var _window$location3 = window.location,
        hash = _window$location3.hash,
        href = _window$location3.href;
    if (!hash.startsWith("#/hrmengine/organization")) return;

    if (url.indexOf('/api/hrm/organization/getDepartmentFormFieldView') >= 0) {
      if (data && data.formField) {
        data.formField[0].items = data.formField[0].items.filter(function (i) {
          return !config.departHide.includes(i.domkey[0]);
        });
      }
    } else if (url.indexOf('/api/hrm/organization/getSubCompanyFormFieldView') >= 0) {
      if (data && data.formField) {
        data.formField[0].items = data.formField[0].items.filter(function (i) {
          return !config.subCompanytHide.includes(i.domkey[0]);
        });
      }
    }

    return data;
  },
  desc: '分部部门信息字段显隐'
});
/* 
路径：
组织架构隐藏和部门分部链接取消/组织架构隐藏和部门分部链接取消/register.js(e39588fc79e7470e8e0fc4687c192b92)
*/
})();
(function() {


var IsPC = function IsPC() {
  var userAgentInfo = navigator.userAgent;
  var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
  var flag = true;

  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }

  return flag;
};

if (IsPC()) {
  window.doCheckSecondaryVerify4ec = function () {
    var reqParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      mouldCode: 'HRM',
      itemCode: 'SALARY'
    };

    var _callback = arguments.length > 1 ? arguments[1] : undefined;

    var divId = 'ecode_check_secondary_verify_div';

    if (reqParams.value) {
      divId = 'ecode_desensitization_div';
    }

    var exist = document.getElementById(divId) != null;

    if (!exist) {
      var div = document.createElement("div");
      div.id = divId;
      document.body.appendChild(div);
    }

    var acParams = {
      appId: 'fb3cf1bfb0a04204acfdd6f567d2a8ba',
      name: divId == 'ecode_check_secondary_verify_div' ? 'CheckDialog' : 'DesensitizationDialog',
      //模块名称
      isPage: false,
      //是否是路由页面
      noCss: true,
      //是否禁止单独加载css，通常为了减少css数量，css默认前置加载
      props: {
        date: new Date().getTime(),
        ecId: divId,
        reqParams: reqParams,
        callback: function callback(d) {
          _callback && _callback(d);
        } //组件参数

      }
    };
    var Com = ecodeSDK.getAsyncCom(acParams);
    ReactDOM.render(Com, document.getElementById(divId));
  };

  window.setShare4ec = function () {
    var reqParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      mouldCode: 'HRM',
      itemCode: 'SALARY'
    };

    var _callback2 = arguments.length > 1 ? arguments[1] : undefined;

    var divId = 'ecode_share_setting_div';
    var exist = document.getElementById(divId) != null;

    if (!exist) {
      var div = document.createElement("div");
      div.id = divId;
      document.body.appendChild(div);
    }

    var acParams = {
      appId: 'fb3cf1bfb0a04204acfdd6f567d2a8ba',
      name: 'ShareDialog',
      //模块名称
      isPage: false,
      //是否是路由页面
      noCss: true,
      //是否禁止单独加载css，通常为了减少css数量，css默认前置加载
      props: {
        date: new Date().getTime(),
        ecId: divId,
        reqParams: reqParams,
        callback: function callback(d) {
          _callback2 && _callback2(d);
        } //组件参数

      }
    };
    var Com = ecodeSDK.getAsyncCom(acParams);
    ReactDOM.render(Com, document.getElementById(divId));
  };
}

/* 
路径：
人力资源/官方插件/二次验证密码4EC_V2/register.js(f11b5e099a634f7b9efb21c67b072ae7)
*/
})();
(function() {


function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var enable = true;
var _this = null; //注册组件

var WaitWeaverMobileLoad = function WaitWeaverMobileLoad(newProps) {
  var WaitWeaverMobileLoadObj = ecodeSDK.getCom('d12f07c3ea244b3dbffb89160ad38f50', 'MobileFormPageObj');
  if (WaitWeaverMobileLoadObj) return React.createElement(WaitWeaverMobileLoadObj, newProps);

  var WaitWeaverMobileLoad =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(WaitWeaverMobileLoad, _React$Component);

    function WaitWeaverMobileLoad(props) {
      var _this2;

      _classCallCheck(this, WaitWeaverMobileLoad);

      _this2 = _possibleConstructorReturn(this, _getPrototypeOf(WaitWeaverMobileLoad).call(this, props));
      _this2.state = {
        isLoad: false
      };
      _this = _assertThisInitialized(_this2);
      return _this2;
    }

    _createClass(WaitWeaverMobileLoad, [{
      key: "setIsLoad",
      value: function setIsLoad(b) {
        this.setState({
          isLoad: b
        });
      }
    }, {
      key: "render",
      value: function render() {
        if (!this.state.isLoad) return React.createElement("div", {
          className: 'AAAA'
        });
        var _window$location = window.location,
            hash = _window$location.hash,
            pathname = _window$location.pathname;
        var acParams = {
          appId: 'd12f07c3ea244b3dbffb89160ad38f50',
          name: 'MeetingVideoMobileApplication',
          //模块名称
          isPage: true,
          //是否是路由页面
          noCss: true //是否禁止单独加载css，通常为了减少css数量，css默认前置加载

        };
        var acParams2 = {
          appId: 'd12f07c3ea244b3dbffb89160ad38f50',
          name: 'MobileSimplePage',
          //模块名称
          isPage: true,
          //是否是路由页面
          noCss: true //是否禁止单独加载css，通常为了减少css数量，css默认前置加载

        };
        var NewCom = ecodeSDK.getAsyncCom(acParams);
        var NewCom2 = ecodeSDK.getAsyncCom(acParams2);
        var _ReactRouterDom = ReactRouterDom,
            Route = _ReactRouterDom.Route;
        return hash.startsWith('#/cs/app/d12f07c3ea244b3dbffb89160ad38f50_MeetingVideoMobileApplication') ? React.createElement(Route, {
          name: "app",
          path: "/cs/app/:uuid",
          component: NewCom
        }) : React.createElement(Route, {
          name: "app",
          path: "/cs/app/:uuid",
          component: NewCom2
        });
      }
    }]);

    return WaitWeaverMobileLoad;
  }(React.Component);

  WaitWeaverMobileLoadObj = WaitWeaverMobileLoad;
  ecodeSDK.setCom('d12f07c3ea244b3dbffb89160ad38f50', 'MobileFormPageObj', WaitWeaverMobileLoadObj);
  return React.createElement(WaitWeaverMobileLoadObj, newProps);
};

ecodeSDK.onWeaverMobileLoadQueue.push(function () {
  _this && _this.setIsLoad(true);
});
ecodeSDK.overwriteMobileClassFnQueueMapSet('FloatingTouch', {
  fn: function fn(Com, newProps) {
    if (!enable) return;
    var _window$location2 = window.location,
        hash = _window$location2.hash,
        pathname = _window$location2.pathname;
    if (pathname.indexOf('/spa/custom/static4mobile/index.html') == -1) return;
    if (!hash.startsWith('#/cs/app/d12f07c3ea244b3dbffb89160ad38f50_MeetingVideoMobileApplication') && !hash.startsWith('#/cs/app/d12f07c3ea244b3dbffb89160ad38f50_MobileSimplePage')) return;
    if (newProps._noOverwrite) return;
    return {
      com: WaitWeaverMobileLoad,
      props: newProps
    };
  }
});

/* 
路径：
视频会议插件/视频会议应用/register.js(ab859e1da714419c9ead19ea8dba3539)
*/
})();
(function() {


var _this = void 0;

var enable = true;
var config = ecodeSDK.getCom('95ccf8f75057482eb69c3f75fe4b2b0c', 'config'); //注册和绑定新页面前端实现接口

ecodeSDK.rewriteRouteQueue.push({
  fn: function fn(params) {
    if (!enable) return;
    if (config && config.base && config.base.videoPlugPC && !config.base.videoPlugPC.enable) return;
    var Com = params.Com,
        Route = params.Route,
        nextState = params.nextState;
    var cpParams = {
      path: 'main/cs/app',
      //路由地址
      appId: '95ccf8f75057482eb69c3f75fe4b2b0c',
      name: 'videoMeetingSetting',
      //具体页面应用id
      node: 'app',
      //渲染的路由节点，这里渲染的是app这个节点
      Route: Route,
      nextState: nextState
    };
    var cpParams_myVideoMeeting = {
      path: 'main/cs/app',
      //路由地址
      appId: '95ccf8f75057482eb69c3f75fe4b2b0c',
      name: 'myVideoMeeting',
      //具体页面应用id
      node: 'app',
      //渲染的路由节点，这里渲染的是app这个节点
      Route: Route,
      nextState: nextState
    };
    var cpParams_single = {
      path: 'main/cs/app',
      //路由地址
      appId: '95ccf8f75057482eb69c3f75fe4b2b0c',
      name: 'VideoMeetingInfoSingle',
      //具体页面应用id
      node: 'app',
      //渲染的路由节点，这里渲染的是app这个节点
      Route: Route,
      nextState: nextState
    };

    if (ecodeSDK.checkPath(cpParams)) {
      var acParams = {
        appId: cpParams.appId,
        name: cpParams.name,
        //模块名称
        props: params,
        //参数
        isPage: true,
        //是否是路由页面
        noCss: true //是否禁止单独加载css，通常为了减少css数量，css默认前置加载
        //异步加载模块95ccf8f75057482eb69c3f75fe4b2b0c下的子模块Page1

      };
      return ecodeSDK.getAsyncCom(acParams);
    }

    if (ecodeSDK.checkPath(cpParams_myVideoMeeting)) {
      var _acParams = {
        appId: cpParams_myVideoMeeting.appId,
        name: cpParams_myVideoMeeting.name,
        //模块名称
        props: params,
        //参数
        isPage: true,
        //是否是路由页面
        noCss: true //是否禁止单独加载css，通常为了减少css数量，css默认前置加载
        //异步加载模块95ccf8f75057482eb69c3f75fe4b2b0c下的子模块Page1

      };
      return ecodeSDK.getAsyncCom(_acParams);
    }

    if (ecodeSDK.checkPath(cpParams_single)) {
      var _acParams2 = {
        appId: cpParams_single.appId,
        name: cpParams_single.name,
        //模块名称
        props: params,
        //参数
        isPage: true,
        //是否是路由页面
        noCss: true //是否禁止单独加载css，通常为了减少css数量，css默认前置加载
        //异步加载模块95ccf8f75057482eb69c3f75fe4b2b0c下的子模块Page1

      };
      return ecodeSDK.getAsyncCom(_acParams2);
    }

    return null;
  },
  order: 2,
  desc: '这是一新页面报表型列表（带查询）字段多的时候滚动方式的参考案例'
}); // 自定义视频button组件 --- start

var MeetingVideoPluginFn = function MeetingVideoPluginFn(props, Com) {
  var acParams = {
    appId: '95ccf8f75057482eb69c3f75fe4b2b0c',
    name: 'meetingVideoNewComPlugin',
    //模块名称
    isPage: false,
    //是否是路由页面
    noCss: true,
    //是否禁止单独加载css，通常为了减少css数量，css默认前置加载
    props: props
  };
  return ecodeSDK.getAsyncCom(acParams);
};

ecodeSDK.overwriteClassFnQueueMapSet('Tag', {
  fn: function fn(Com, newProps) {
    if (!enable) return;
    if (config && config.base && config.base.videoPlugPC && !config.base.videoPlugPC.enable) return;
    if (newProps._uuid !== '3a96f99f-81be-447b-b7a5-a3999db3dd72') return;
    return {
      com: MeetingVideoPluginFn.bind(_this, newProps, Com),
      props: newProps
    };
  }
}); // 自定义视频button组件 --- end

/*
版本要求：kb1906以上
配置路由地址：
/main/cs/app/3ad6b348ff354b01984cd6afaea54a8a_videoMeetingSetting
/main/cs/app/3ad6b348ff354b01984cd6afaea54a8a_myVideoMeeting
浏览器访问地址：
/wui/index.html#/main/cs/app/3ad6b348ff354b01984cd6afaea54a8a_videoMeetingSetting
/wui/index.html#/main/cs/app/3ad6b348ff354b01984cd6afaea54a8a_myVideoMeeting
*/

/* 
路径：
视频会议插件/视频会议插件pc/视频会议pc/register.js(59feb8511a584e298611cce6e507c60f)
*/
})();
(function() {


var _this2 = void 0;

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var enable = true;
var config = ecodeSDK.getCom('12b57552cd8b4706950b82fb9f6607fe', 'config');
var NewMeetingVideoPlugin = null;

var MeetingVideoMobilePluginFn = function MeetingVideoMobilePluginFn(props, Com) {
  if (!NewMeetingVideoPlugin) {
    var acParams = {
      appId: '12b57552cd8b4706950b82fb9f6607fe',
      name: 'MeetingVideoNewComPlugin',
      //模块名称
      isPage: false,
      //是否是路由页面
      noCss: true,
      //是否禁止单独加载css，通常为了减少css数量，css默认前置加载
      props: props
    };
    return ecodeSDK.getAsyncCom(acParams);
  }

  return NewMeetingVideoPlugin;
};

ecodeSDK.overwriteMobileClassFnQueueMapSet('Tag', {
  fn: function fn(Com, newProps, name) {
    if (!enable) return;
    if (config && config.base && config.base.videoPlugMobile && !config.base.videoPlugMobile.enable) return;
    if (newProps._uuid !== '3a96f99f-81be-447b-b7a5-a3999db3dd72') return;
    return {
      com: MeetingVideoMobilePluginFn.bind(_this2, newProps, Com),
      props: newProps
    };
  }
}); ////////////////////////

var _this = null;

var waitWmLoad = function waitWmLoad(props, params) {
  var acParams = {
    appId: '12b57552cd8b4706950b82fb9f6607fe',
    name: 'MobileSimplePage',
    //模块名称
    params: params,
    //参数
    isPage: true,
    //是否是路由页面
    noCss: true //是否禁止单独加载css，通常为了减少css数量，css默认前置加载
    //异步加载12b57552cd8b4706950b82fb9f6607fe下的子模块MobilePage1

  };

  var WaitWeaverMobileLoad =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(WaitWeaverMobileLoad, _React$Component);

    function WaitWeaverMobileLoad(props) {
      var _this3;

      _classCallCheck(this, WaitWeaverMobileLoad);

      _this3 = _possibleConstructorReturn(this, _getPrototypeOf(WaitWeaverMobileLoad).call(this, props));
      _this3.state = {
        isLoad: false
      };
      _this = _assertThisInitialized(_this3);
      return _this3;
    }

    _createClass(WaitWeaverMobileLoad, [{
      key: "setIsLoad",
      value: function setIsLoad(b) {
        this.setState({
          isLoad: b
        });
      }
    }, {
      key: "render",
      value: function render() {
        if (!this.state.isLoad) return React.createElement("div", null);
        var NewCom = ecodeSDK.getAsyncCom(acParams);
        return React.createElement(NewCom, null);
      }
    }]);

    return WaitWeaverMobileLoad;
  }(React.Component);

  return WaitWeaverMobileLoad;
};

ecodeSDK.onWeaverMobileLoadQueue.push(function () {
  _this && _this.setIsLoad(true);
}); //注册和绑定新页面前端实现接口

ecodeSDK.rewriteMobileRouteQueue.push({
  fn: function fn(params) {
    var Com = params.Com,
        props = params.props,
        state = params.state,
        context = params.context;
    var mpParams = {
      path: '/cs/app/:uuid',
      //路由地址
      appId: '12b57552cd8b4706950b82fb9f6607fe',
      name: 'MobileSimplePage',
      //路由名称
      props: props,
      state: state
    };

    if (ecodeSDK.checkMobilePath(mpParams)) {
      return waitWmLoad(props, params);
    }

    return null;
  },
  order: 10,
  desc: 'Demo简单页面'
}); //////////////////////////////

/* 
路径：
视频会议插件/视频会议插件mobile/视频会议mobile/register.js(9fd6dc6cb6f94b44a68bffc0ad1715f7)
*/
})();
(function() {


function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var enable = true;
var config = ecodeSDK.getCom('12b57552cd8b4706950b82fb9f6607fe', 'config');

var getNewVersion = function getNewVersion(version) {
  return version >= "9.00.2006.00";
};

ecodeSDK.overwriteMobileClassFnQueueMapSet('TabPage', {
  // 此处仅请求当前版本信息
  fn: function fn(Com, newProps, name) {
    if (config && config.base && config.base.videoPlugMobileUsed && !config.base.videoPlugMobileUsed.enable) return;
    var _window$location = window.location,
        hash = _window$location.hash,
        pathname = _window$location.pathname;

    if (pathname === '/spa/meeting/static4mobile/index.html') {
      var options = {
        method: 'GET',
        url: '/api/portal/systemInfo/getVersion',
        params: {
          ismobile: 1
        }
      };
      var _WeaverMobile = WeaverMobile,
          Tools = _WeaverMobile.Tools;

      if (Tools.callApi && !localStorage.currentWeaverVersion) {
        Tools.callApi(options).then(function (res) {
          localStorage.setItem('currentWeaverVersion', res.data.cversion);
          setTimeout(function () {
            // 每隔12小时清除数据
            localStorage.removeItem('currentWeaverVersion');
          }, 12 * 60 * 60 * 1000);
        });
      }
    }
  }
}); ////////// 新版本调用方式 - start

ecodeSDK.overwriteMobilePropsFnQueueMapSet('ActionSheet', {
  fn: function fn(newProps) {
    if (!enable) return;
    if (config && config.base && config.base.videoPlugMobileUsed && !config.base.videoPlugMobileUsed.enable) return;
    if (!getNewVersion(localStorage.currentWeaverVersion)) return;
    var hash = window.location.hash;

    if (hash === '#/calendar/detail/index' && newProps.config) {
      var _WeaverMobile2 = WeaverMobile,
          Tag = _WeaverMobile2.Tag;

      if (newProps.config.defProps && newProps.config.defProps.previewMeetingResultInfo && newProps.config.defProps.previewMeetingResultInfo.isShowVideoBtn) {
        if (Array.isArray(newProps.config.options) && newProps.config.defProps && newProps.config.defProps.type === 'view' && newProps.config.defProps.meetingId !== '') {
          if (!newProps.config.options.some(function (res) {
            return res.key === 'meetingVideo';
          })) {
            var meetingId = newProps.config.defProps.meetingId;
            var arr = [].concat(_toConsumableArray(newProps.config.options), [{
              key: 'meetingVideo',
              content: React.createElement(Tag, {
                _uuid: "3a96f99f-81be-447b-b7a5-a3999db3dd72",
                meetingId: meetingId,
                buttonProps: {
                  style: {
                    color: 'inherit'
                  }
                }
              }),
              onClick: function onClick() {}
            }]);
            newProps.config.options = arr;
          }
        }
      }
    }
  }
});
ecodeSDK.overwriteMobilePropsFnQueueMapSet('RouteLayout.ButtonGroup', {
  fn: function fn(newProps) {
    if (!enable) return;
    if (config && config.base && config.base.videoPlugMobileUsed && !config.base.videoPlugMobileUsed.enable) return;
    if (!getNewVersion(localStorage.currentWeaverVersion)) return;
    var hash = window.location.hash;

    if (hash === '#/calendar/detail/index' && newProps.defProps && newProps.defProps.store && newProps.defProps.store.type === 'view' && newProps.defProps.store.meetingId != '') {
      if (newProps.defProps && newProps.defProps.store && newProps.defProps.store.previewMeetingResultInfo && newProps.defProps.store.previewMeetingResultInfo.isShowVideoBtn) {
        var _WeaverMobile3 = WeaverMobile,
            Tag = _WeaverMobile3.Tag;
        Array.isArray(newProps.data) && newProps.data.unshift({
          key: 'meetingVideo',
          text: React.createElement(Tag, {
            _uuid: "3a96f99f-81be-447b-b7a5-a3999db3dd72",
            meetingId: newProps.defProps.store.meetingId,
            buttonProps: {}
          }),
          onClick: function onClick() {},
          type: ''
        });
      }
    }
  }
}); ////////// 新版本调用方式 - end
////////// 旧版本调用方式 - start

ecodeSDK.overwriteMobileClassFnQueueMapSet('TabPage', {
  fn: function fn(Com, newProps, name) {
    if (!enable) return;
    if (config && config.base && config.base.videoPlugMobileUsed && !config.base.videoPlugMobileUsed.enable) return;
    if (getNewVersion(localStorage.currentWeaverVersion)) return;

    if (ecodeSDK.checkLPath('/spa/meeting/static4mobile/index.html#/calendar/detail/index')) {
      if (newProps.className === "preview-meeting-tabs") {
        if (newProps._noOverwrite) return;
        var acParams = {
          appId: '12b57552cd8b4706950b82fb9f6607fe',
          name: 'MeetingMobileFlex',
          //模块名称
          isPage: false,
          //是否是路由页面
          noCss: true,
          //是否禁止单独加载css，通常为了减少css数量，css默认前置加载
          props: newProps
        };
        return {
          com: function com() {
            return ecodeSDK.getAsyncCom(acParams);
          },
          props: newProps
        };
      }
    }
  }
}); ////////// 旧版本调用方式 - end

/* 
路径：
视频会议插件/调用视频会议插件mobile/视频会议mobile/register.js(9e955a95f518426dbb7acb3c80f51a04)
*/
})();
(function() {


var enable = true;
var config = ecodeSDK.getCom('95ccf8f75057482eb69c3f75fe4b2b0c', 'config');

var getNewVersion = function getNewVersion(version) {
  return version >= "9.00.2006.00";
};

ecodeSDK.overwritePropsFnQueueMapSet('WeaTop', {
  // 此处仅请求当前版本信息
  fn: function fn(newProps, name) {
    var hash = window.location.hash;

    if (hash.indexOf('meeting') > -1) {
      var _ecCom = ecCom,
          WeaTools = _ecCom.WeaTools;

      if (WeaTools && WeaTools.callApi && !localStorage.currentWeaverVersion) {
        WeaTools.callApi('/api/portal/systemInfo/getVersion', 'GET', {}).then(function (res) {
          localStorage.setItem('currentWeaverVersion', res.data.cversion);
          setTimeout(function () {
            // 每隔12小时清除数据
            localStorage.removeItem('currentWeaverVersion');
          }, 12 * 60 * 60 * 1000);
        });
      }
    }
  }
});
ecodeSDK.overwritePropsFnQueueMapSet('WeaDialog', {
  fn: function fn(newProps, name) {
    if (!enable) return;
    if (config && config.base && config.base.videoPlugPCUsed && !config.base.videoPlugPCUsed.enable) return;
    if (!newProps) return;
    if (newProps._noOverWirite) return;
    newProps._noOverWirite = true;

    if (ecodeSDK.checkLPath('/wui/index.html#/main/meeting/calView') || ecodeSDK.checkLPath('/spa/meeting/static/index.html#/main/meeting/CalView') || ecodeSDK.checkLPath('/wui/index.html#/main/meeting/monitor') || ecodeSDK.checkLPath('/spa/meeting/static/index.html#/main/meeting/monitor') || ecodeSDK.checkLPath('/wui/index.html#/main/meeting/search') || ecodeSDK.checkLPath('/spa/meeting/static/index.html#/main/meeting/search') || ecodeSDK.checkLPath('/wui/index.html#/main/meeting/roomPlan') || ecodeSDK.checkLPath('/spa/meeting/static/index.html#/main/meeting/roomPlan')) {
      if (newProps.className === "meetingDialog") {
        var _antd = antd,
            Tag = _antd.Tag;
        var meetingid = '';

        if (window.weaMeeting && window.weaMeeting.store.meetingDialog && window.weaMeeting.store.meetingDialog.dialogStatus) {
          meetingid = window.weaMeeting.store.meetingDialog.dialogStatus.meetingId;
          var _mobx = mobx,
              toJS = _mobx.toJS;

          var _toJS = toJS(window.weaMeeting.store.meetingDialog.previewMeetingResultInfo),
              isShowVideoBtn = _toJS.isShowVideoBtn;

          if (!getNewVersion(localStorage.currentWeaverVersion)) {
            isShowVideoBtn = true;
          }

          if (isShowVideoBtn && window.weaMeeting.store.meetingDialog.dialogStatus.type === 'preview' && !(newProps.buttons && (newProps.buttons[1] && newProps.buttons[1].key && newProps.buttons[1].key.indexOf('decision') > -1 || newProps.buttons[2] && newProps.buttons[2].key && newProps.buttons[2].key.indexOf('decision') > -1))) {
            var setDialogState = window.weaMeeting.store.meetingDialog.setDialogState;
            newProps.buttons && Array.isArray(newProps.buttons) && newProps.buttons.unshift(React.createElement(Tag, {
              _uuid: "3a96f99f-81be-447b-b7a5-a3999db3dd72",
              buttonProps: {
                style: {
                  marginRight: 10
                }
              },
              meetingId: meetingid,
              fromMould: 'MEETING',
              onChange: function onChange() {
                setDialogState({
                  saveLoading: true
                });
                setTimeout(function () {
                  setDialogState({
                    saveLoading: false
                  });
                }, 500);
              }
            }));
            newProps.moreBtn && newProps.moreBtn.datas && Array.isArray(newProps.moreBtn.datas) && newProps.moreBtn.datas.unshift({
              key: 'video-meeting',
              icon: React.createElement("i", {
                className: "icon-coms02-coms-Video"
              }),
              content: React.createElement(Tag, {
                _uuid: "3a96f99f-81be-447b-b7a5-a3999db3dd72",
                type: "rightMenu",
                buttonProps: {
                  style: {
                    marginRight: 10
                  }
                },
                meetingId: meetingid,
                fromMould: 'MEETING',
                onChange: function onChange() {
                  setDialogState({
                    saveLoading: true
                  });
                  setTimeout(function () {
                    setDialogState({
                      saveLoading: false
                    });
                  }, 500);
                }
              })
            });
          }
        }
      }
    }
  }
});
ecodeSDK.overwritePropsFnQueueMapSet('WeaRightMenu', {
  fn: function fn(newProps, name) {
    if (!enable) return;
    if (config && config.base && config.base.videoPlugPCUsed && !config.base.videoPlugPCUsed.enable) return;
    if (!newProps) return;

    if (ecodeSDK.checkLPath('/wui/index.html#/main/meeting/calView') || ecodeSDK.checkLPath('/spa/meeting/static/index.html#/main/meeting/CalView') || ecodeSDK.checkLPath('/wui/index.html#/main/meeting/monitor') || ecodeSDK.checkLPath('/spa/meeting/static/index.html#/main/meeting/monitor') || ecodeSDK.checkLPath('/wui/index.html#/main/meeting/search') || ecodeSDK.checkLPath('/spa/meeting/static/index.html#/main/meeting/search') || ecodeSDK.checkLPath('/wui/index.html#/main/meeting/roomPlan') || ecodeSDK.checkLPath('/spa/meeting/static/index.html#/main/meeting/roomPlan') || ecodeSDK.checkLPath('/wui/index.html#/main/meeting/dialogsingle') || ecodeSDK.checkLPath('/spa/meeting/static/index.html#/main/meeting/dialogsingle')) {
      var isPreview = false;
      var isSingle = false;
      Array.isArray(newProps.children) && newProps.children.map(function (res) {
        if (res.ref === 'preview') {
          isPreview = true;
        }
      });
      if (ecodeSDK.checkLPath('/wui/index.html#/main/meeting/dialogsingle') || ecodeSDK.checkLPath('/spa/meeting/static/index.html#/main/meeting/dialogsingle')) isSingle = true;

      if (isPreview || isSingle) {
        var _mobx2 = mobx,
            toJS = _mobx2.toJS;

        var _toJS2 = toJS(window.weaMeeting.store.meetingDialog.previewMeetingResultInfo),
            isShowVideoBtn = _toJS2.isShowVideoBtn;

        if (!getNewVersion(localStorage.currentWeaverVersion)) {
          isShowVideoBtn = true;
        }

        var _antd2 = antd,
            Tag = _antd2.Tag;
        var meetingid = window.weaMeeting.store.meetingDialog.dialogStatus.meetingId || '';
        isShowVideoBtn && newProps.datas && Array.isArray(newProps.datas) && newProps.datas.unshift({
          key: 'video-meeting',
          icon: React.createElement("i", {
            className: "icon-coms02-coms-Video"
          }),
          content: React.createElement(Tag, {
            _uuid: "3a96f99f-81be-447b-b7a5-a3999db3dd72",
            type: "rightMenu",
            buttonProps: {
              style: {
                marginRight: 10
              }
            },
            meetingId: meetingid,
            fromMould: 'MEETING'
          })
        });
      }
    }
  }
});
ecodeSDK.overwritePropsFnQueueMapSet('WeaTop', {
  fn: function fn(newProps, name) {
    if (!enable) return;
    if (config && config.base && config.base.videoPlugPCUsed && !config.base.videoPlugPCUsed.enable) return;
    if (!newProps) return;

    if (ecodeSDK.checkLPath('/wui/index.html#/main/meeting/dialogsingle') || ecodeSDK.checkLPath('/spa/meeting/static/index.html#/main/meeting/dialogsingle')) {
      var meetingid = '';

      if (window.weaMeeting && window.weaMeeting.store.meetingDialog && window.weaMeeting.store.meetingDialog.dialogStatus) {
        meetingid = window.weaMeeting.store.meetingDialog.dialogStatus.meetingId;
        var _mobx3 = mobx,
            toJS = _mobx3.toJS;

        var _toJS3 = toJS(window.weaMeeting.store.meetingDialog.previewMeetingResultInfo),
            isShowVideoBtn = _toJS3.isShowVideoBtn;

        if (!getNewVersion(localStorage.currentWeaverVersion)) {
          isShowVideoBtn = true;
        }

        if (isShowVideoBtn && window.weaMeeting.store.meetingDialog.dialogStatus.type === 'preview') {
          var _antd3 = antd,
              Tag = _antd3.Tag;
          Array.isArray(newProps.buttons) && newProps.buttons.unshift(React.createElement(Tag, {
            _uuid: "3a96f99f-81be-447b-b7a5-a3999db3dd72",
            buttonProps: {
              style: {
                marginRight: 10
              }
            },
            meetingId: meetingid,
            fromMould: 'MEETING'
          }));
          Array.isArray(newProps.buttons) && newProps.buttons.forEach(function (v, index) {
            if (v.props && v.props.className === "meeting-single-container" && v.props.datas) {
              v.props.datas.unshift({
                key: 'video-meeting',
                icon: React.createElement("i", {
                  className: "icon-coms02-coms-Video"
                }),
                content: React.createElement(Tag, {
                  _uuid: "3a96f99f-81be-447b-b7a5-a3999db3dd72",
                  type: "rightMenu",
                  buttonProps: {
                    style: {
                      marginRight: 10
                    }
                  },
                  meetingId: meetingid,
                  fromMould: 'MEETING'
                })
              });
            }
          });
        }
      }
    }
  }
});

/* 
路径：
视频会议插件/视频会议pc/调用视频会议插件pc/register.js(6a9108d3039345b9b82217bc84ba4bf1)
*/
})();
(function() {


function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

window.e9ModuleConfigCustomF = [].concat(_toConsumableArray(window.e9ModuleConfigCustomF || []), [{
  title: '人力引擎',
  name: 'b_hrm',
  page: '/spa/hrm/engine.html',
  lib: ['/spa/hrm/static4engine/engine.css?v=1566843608120', '/spa/hrm/static4engine/engine.js?v=1566843608120']
}, {
  title: '考勤后台',
  name: 'b_attendance',
  page: '/spa/hrm/staticAttendance4engine/engine.html',
  lib: ['/spa/hrm/staticAttendance4engine/engine.css?v=1606964265500', '/spa/hrm/staticAttendance4engine/engine.js?v=1606964265500']
}]);
window.e9LibsConfigCustomF = [].concat(_toConsumableArray(window.e9LibsConfigCustomF || []), [['b_hrm', 'weaHrmEngine', 'hrmengine'], ['b_attendance', 'weaHrmAttendanceEngine', 'attendance']]);

/* 
路径：
矩阵菜单/解决矩阵样式/index.js(c480372ed54c433e92235be8ae15c8f0)
*/
})();
(function() {


var isadmin = false;
jQuery().ready(function () {
  window.weaJs.callApi({
    url: '/api/organizationcustom/check/checkIsAdmin',
    method: 'GET'
  }).then(function (res) {
    if (res.status == '1') {
      if (res.isadmin == "false") {
        isadmin = false;
      } else {
        isadmin = true;
      }
    }
  });
});
ecodeSDK.overwriteMobilePropsFnQueueMapSet('BrowserHrm', {
  fn: function fn(newProps) {
    // if(!ecodeSDK.checkLPath('/spa/workflow/static4mobileform/index.html')) return;
    if (newProps.type == 1 || newProps.type == 17) {
      if (newProps.tabs && newProps.tabs.length && !isadmin) {
        var newTabs = newProps.tabs.filter(function (ele) {
          return ele.name != '组织结构';
        });
        var obj = {
          key: '10',
          name: '全部人员',
          url: newProps.type == 1 ? '/api/public/browser/data/1?cmd=search' : newProps.type == 17 ? '/api/public/browser/data/17?cmd=search' : '',
          dataParams: {
            cmd: 'search'
          },
          browserProps: {
            showAccount: false
          }
        };
        newTabs.push(obj);
        newProps.tabs = newTabs;
      }

      return newProps;
    }
  },
  order: 1,
  desc: '浏览按钮人力、多人力去掉组织架构添加全部人员'
});
ecodeSDK.overwritePropsFnQueueMapSet('WeaBrowser', {
  fn: function fn(newProps) {
    // if(!(ecodeSDK.checkLPath('/spa/workflow/static4form/index.html') || ecodeSDK.checkLPath('/spa/hrm/index_mobx.html#/main/hrm/operateGroup'))) return;
    var _ecCom = ecCom,
        WeaLocaleProvider = _ecCom.WeaLocaleProvider;
    var getLabel = WeaLocaleProvider.getLabel;

    if (newProps.type == 1 || newProps.type == 17) {
      if (!newProps.tabs) {
        newProps.tabs = [{
          name: getLabel(24515, "最近"),
          key: "1"
        }, {
          name: getLabel(18511, "同部门"),
          key: "2"
        }, {
          name: getLabel(15089, "我的下属"),
          key: "3"
        }, {
          name: getLabel(18770, "组织结构"),
          key: "4"
        }, {
          name: getLabel(81554, "常用组"),
          key: "5"
        }];
      }

      if (newProps.tabs && newProps.tabs.length && !isadmin) {
        var newTabs = newProps.tabs.filter(function (ele) {
          return ele.name != '组织结构';
        });
        var obj = {
          key: '10',
          name: '全部人员',
          url: newProps.type == 1 ? '/api/public/browser/data/1?cmd=search' : newProps.type == 17 ? '/api/public/browser/data/17?cmd=search' : '',
          dataParams: {
            cmd: 'search'
          },
          browserProps: {
            showAccount: false
          }
        };
        newTabs.push(obj);
        newProps.tabs = newTabs;
      }

      return newProps;
    }
  },
  order: 1,
  desc: '浏览按钮人力、多人力去掉组织架构添加全部人员'
});
/* 
路径：
X西安奕斯伟硅片技术有限公司/人力浏览按钮组织架构和全部人员/register.js(8c447dda3e544bceaaaac8c538d0889d)
*/
})();
(function() {


// 异步引入resources中的资源，/cloudstore/release/{appId}/resources，以signature_pad为例
ecodeSDK.loadjs(['/cloudstore/release/0a118d1bdcae4641830801b2561c4f87/resources/moment.js']);
ecodeSDK.loadjs(['/cloudstore/release/0a118d1bdcae4641830801b2561c4f87/resources/lodash.js']);
ecodeSDK.rewriteRouteQueue.push({
  fn: function fn(params) {
    var Com = params.Com,
        Route = params.Route,
        nextState = params.nextState;
    var cpParams = {
      path: 'main/cs/app',
      //路由地址
      appId: '0a118d1bdcae4641830801b2561c4f87',
      name: 'pageSimple',
      //具体页面应用id
      node: 'app',
      //渲染的路由节点，这里渲染的是app这个节点
      Route: Route,
      nextState: nextState
    };

    if (ecodeSDK.checkPath(cpParams)) {
      //判断地址是否是要注入的地址
      var acParams = {
        appId: cpParams.appId,
        name: cpParams.name,
        //模块名称
        props: params,
        //参数
        isPage: true,
        //是否是路由页面
        noCss: true //是否禁止单独加载css，通常为了减少css数量，css默认前置加载
        //异步加载模块0a118d1bdcae4641830801b2561c4f87下的子模块pageSimple

      };
      return ecodeSDK.getAsyncCom(acParams);
    }

    return null; //这里一定要返回空，不然会干扰到其它新页面
  },
  order: 10,
  desc: 'Demo简单页面'
}); // /spa/custom/static/index.html#/main/cs/app/0a118d1bdcae4641830801b2561c4f87_pageSimple?_key=36hb3r

/* 
路径：
考勤页面(谢)/考勤页面/init.js(aebaac3a29594b2c9663861a84402dee)
*/
})();
(function() {


// 可以看到安全级别的人员
var safety = ['1', '7851', '7400', '171', '8436', '8651'];
ecodeSDK.overwritePropsFnQueueMapSet('WeaSearchGroup', {
  //组件名
  fn: function fn(newProps) {
    // 获取人员id
    var uid = JSON.parse(localStorage.getItem("theme-account")).userid; //  权限限制

    if (safety.includes(uid)) return;
    var hash = window.location.hash;
    if (!hash.includes('#/main/hrm/card/cardSystemInfo')) return;

    if (newProps.title == "系统信息" && newProps.children.props.children[0].props.children) {
      newProps.children.props.children[0].props.children = newProps.children.props.children[0].props.children.filter(function (item) {
        return !(item.props.label == '安全级别');
      });
    }

    return newProps; //修改之后返回数据
  },
  order: 1,
  desc: '人员信息下——系统信息——安全级别隐藏'
});
/* 
路径：
安全级别隐藏/系统安全级别隐藏/register.js(6d0b7be471ba4261a07363c622654f6a)
*/
})();
(function() {


var IsPC = function IsPC() {
  var userAgentInfo = navigator.userAgent;
  var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
  var flag = true;

  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }

  return flag;
};

if (!IsPC()) {
  window.doCheckSecondaryVerify4em = function () {
    var reqParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      mouldCode: 'HRM',
      itemCode: 'SALARY'
    };

    var _callback = arguments.length > 1 ? arguments[1] : undefined;

    var divId = 'ecode_check_secondary_verify_div';
    var exist = document.getElementById(divId) != null;

    if (!exist) {
      var div = document.createElement("div");
      div.id = divId;
      document.body.appendChild(div);
    }

    var acParams = {
      appId: 'b9f0034a415442b1af912a93d14fd0a7',
      name: 'CheckDialog',
      //模块名称
      isPage: false,
      //是否是路由页面
      noCss: true,
      //是否禁止单独加载css，通常为了减少css数量，css默认前置加载
      props: {
        date: new Date().getTime(),
        reqParams: reqParams,
        callback: function callback(d) {
          _callback && _callback(d);
        } //组件参数

      }
    };
    var Com = ecodeSDK.getAsyncCom(acParams);
    ReactDOM.render(Com, document.getElementById(divId));
  };

  window.setShare4em = function () {
    var reqParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      mouldCode: 'HRM',
      itemCode: 'SALARY'
    };

    var _callback2 = arguments.length > 1 ? arguments[1] : undefined;

    var divId = 'ecode_share_setting_div';
    var exist = document.getElementById(divId) != null;

    if (!exist) {
      var div = document.createElement("div");
      div.id = divId;
      document.body.appendChild(div);
    }

    var acParams = {
      appId: 'b9f0034a415442b1af912a93d14fd0a7',
      name: 'ShareDialog',
      //模块名称
      isPage: false,
      //是否是路由页面
      noCss: true,
      //是否禁止单独加载css，通常为了减少css数量，css默认前置加载
      props: {
        date: new Date().getTime(),
        reqParams: reqParams,
        callback: function callback(d) {
          _callback2 && _callback2(d);
        } //组件参数

      }
    };
    var Com = ecodeSDK.getAsyncCom(acParams);
    ReactDOM.render(Com, document.getElementById(divId));
  };
}

/* 
路径：
人力资源/官方插件/二次验证密码4EM_V2/register.js(936112d92e5d4cebb948e7834591ee83)
*/
})();
