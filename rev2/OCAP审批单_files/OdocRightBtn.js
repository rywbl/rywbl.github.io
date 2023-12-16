/**
 *  ==========请注意本文件中，请不要使用任何es6的语法============
 */

var OdocRightBtn = (function () {
    var firstTabItem = {};
    var firstTabSelected = false;
    var comsUtil = {
        /**
         *  公文流转组件是否在加载中
         */
        isLoading: true,

        /**
         * 上一次注册的表单拦截事件的下标
         */
        lastEventIndex: -1,

        /**
         * 是否一次提交在处理中，如果未处理完，那么再次提交，是要拦截不处理的
         */
        isHandling: false,

        /**
         * 流程表单加载完成后执行的事件
         */
        pushEvent: function (fn) {
            if (fn && typeof fn == "function") {
                if (WfForm && WfForm.getGlobalStore) {
                    var globalStore = WfForm.getGlobalStore();
                    globalStore.pushJSCompleteEvent(fn);
                } else {     //说明流程的组件还未加载完毕
                    window.setTimeout(function () {
                        $this.pushEvent(fn);
                    }, 300);
                }
            }
        },

        safeExecuteFunc: function (func, funParam) {
            if (func && typeof func == "function") {
                func(funParam);
            }
        },
        /**
         * 验证组件是否已经加载成功，然后执行回调方法
         * @param callback
         */
        checkOdocComs: function (callback) {
            var $this = this;
            if (window.weaOdoc) {     //说明公文模块的组件已经加载
                this.safeExecuteFunc(callback);
            } else {
                if (this.isLoading) {
                    //仍然在加载中，则延时执行
                    window.setTimeout(function () {
                        $this.checkOdocComs(callback);
                    }, 300);
                }
            }
        },
        /**
         * 加载公文流转组件
         */
        loadOdocComs: function (callback) {
            var $this = this;
            if (window.comsMobx && window.comsMobx.WeaTableNew && !window.weaOdoc && window.eventRegister) {
                window.eventRegister.loadModule('f_odoc',
                    function () {
						$this.isLoading = false;
						$this.safeExecuteFunc && $this.safeExecuteFunc(callback);
                        if (window.console) {
                            console.log("公文流转组件加载成功");
                        }
                    },
                    function (res) {
                        if (window.console) {
                            console.log(comsMobx)
                            console.log("公文流转组件加载失败",res);
                        }
                        //可能为异步加载失败，再次尝试
						window.setTimeout(function () {
							$this.loadOdocComs(callback);
						}, 300);
                    }
                );
            } else if($this.isLoading && window.weaOdoc && window.weaOdoc.components && window.weaOdoc.components.OdocComps2Export && window.weaOdoc.store){
                $this.isLoading = false;
                $this.safeExecuteFunc && $this.safeExecuteFunc(callback);
            } else {
                //组件未加载
                if (window.console) {
                    console.log("公文自由流程异步comsMobx组件加载中");
                }
                window.setTimeout(function () {
                    $this.loadOdocComs(callback);
                }, 300);
            }
        },

        /**
         * 渲染组件
         */
        renderOdocComs: function () {
            var OdocComps2Export = window.weaOdoc.components.OdocComps2Export;
            var stores = window.weaOdoc.store;

            var params = {};
            params.globalStore = WfForm.getGlobalStore();
            params.layoutStore = WfForm.getLayoutStore();
            if (stores && stores.odocCompsStore) {
                stores.odocCompsStore.setWorkflowStores(params);
            }

            var divEle = document.createElement("div");
            document.body.appendChild(divEle);
            ReactDOM.render(
                OdocComps2Export,
                divEle
            );
        },

        /**
         *
         */
        clearCheckEvent: function () {
            //说明存在上次注册的事件，先删除上次注册的事件
            if (this.lastEventIndex != -1) {
                var eventList1 = WfForm.eventList[WfForm.OPER_CLOSE];
                var newList = [];
                if (eventList1 != null && eventList1.length > 0) {
                    for (var i = 0; i < eventList1.length; i++) {
                        if (i != this.lastEventIndex) {
                            newList.push(eventList1[i]);
                        }
                    }
                }
                WfForm.eventList[WfForm.OPER_CLOSE] = newList;
                this.lastEventIndex = -1;
            }

            var globalStore = WfForm.getGlobalStore();
            var commonParam = globalStore.commonParam || {};
            var intervenorright = commonParam.intervenorright || -1;
            globalStore.changeSubmitParam({isOdocRequest: "0"});

            if (intervenorright > 0) {
                //nothing to do
            } else {
                //enableIntervenor = 0，使用默认的节点附加操作
                globalStore.changeSubmitParam({enableIntervenor: ""});
            }
        },

        /**
         * 更新流程上一次操作的信息
         * @param requestid
         */
        updateLastOperateInfo: function (requestid, callback) {
            var globalStore = WfForm.getGlobalStore();
            var $this = this;
            var func = function () {
                var OdocEvent = window.weaOdoc.components.OdocEvent;
                if (OdocEvent && OdocEvent.getLastOperateInfo) {
                    OdocEvent.getLastOperateInfo(requestid, function (data) {
                        globalStore.changeSubmitParam(data);
                        $this.safeExecuteFunc(callback);
                    })
                }
            }

            comsUtil.checkOdocComs(func);
        },


        /**
         * 当点击的是流程的流转按钮时，清除为了公文流转而注册的事件
         */
        clear4RequestEvent: function () {
            var clearEventFn = function (callback, funcParams) {
                //点击的不是公文流转的按钮，清除注册的事件
                if (!comsUtil.isOdocEvent(funcParams)) {
                    comsUtil.clearCheckEvent();
                }

                callback();
            }

            //注册流程表单按钮点击的钩子事件
            WfForm.registerCheckEvent(WfForm.OPER_BEFORECLICKBTN, clearEventFn);
        },

        /**
         * 是否点击的公文流转事件
         */
        isOdocEvent: function (menuItem) {
            /**
             *  currentOperateItem的值，老版本存储的rightMenu的type，是个字符串，
             *  修改后的版本存储是rightMenu的item，是Object，要兼容处理
             */
            if (menuItem && typeof menuItem == "object") {
                var menuFun = menuItem.menuFun;
                var menuType = menuItem.type;
                if (menuType.indexOf("BTN_CUSTOMIZE") != -1 && menuFun.indexOf("OdocRightBtn.") != -1) {
                    return true;
                }
            }

            return false;
        },
        /**
         * 保存流程
         * @param callbaclFn
         * @param isSubmit 是否做流程提交操作
         */
        doSaveWorkflow: function (callbackFn, isSubmit) {
            if (this.isHandling) {
                return;
            }

            if (arguments.length == 1) {
                isSubmit = false;
            }

            var globalStore = WfForm.getGlobalStore();
            var layoutStore = WfForm.getLayoutStore();

            var $this = this;
            var checkEvent = function (callback, funcParams) {
                $this.isHandling = true;

                globalStore.setLoading(false);      //流程表单上方的操作提醒关闭
                globalStore.setBtnDisabled(false);      //流程表单的按钮置为可用

                var submitParam = globalStore.submitParam || {};
                var commonParam = globalStore.commonParam || {};
                var urlParams = globalStore.urlParams || {};
                var requestid = submitParam.requestid;
                var workflowid = commonParam.workflowid || -1;

                var f_weaver_belongto_userid = commonParam.f_weaver_belongto_userid || -1;

                //刷新submit_token，避免流程会拦截重复提交
                var submitTokenKey = f_weaver_belongto_userid + "_" + requestid + "_request_submit_token";
                var param = {};
                param[submitTokenKey] = "";
                param.iscreate = "0";     //已经保存过流程，不是创建节点了
                globalStore.changeSubmitParam(param);

                //更新流程的参数
                commonParam.requestid = requestid;
                commonParam.iscreate = "0";
                globalStore.commonParam = commonParam;

                //更新最后一次操作的信息，避免页面会提示“流程数据已更改，请核对后再处理！”
                $this.updateLastOperateInfo(requestid, function () {
                    //callback参数是function，如果需要继续关闭窗口，就请在callbaclFn中执行完异步请求后，调用此方法
                    if (callbackFn && typeof callbackFn == "function") {
                        callbackFn(callback, funcParams);
                    }
                });

                //不执行回调方法，那么表单就不会关闭，达到保存表单不刷新页面，
                //然后执行后续逻辑的目的
                //callback();
            };

            //先清除之前注册的事件
            this.clearCheckEvent();

            //注册保存成功后关闭流程表单的事件
            WfForm.registerCheckEvent(WfForm.OPER_CLOSE, checkEvent);

            //记录下最新加入的事件的下标
            var eventList2 = WfForm.eventList[WfForm.OPER_CLOSE];
            if (eventList2 != null && eventList2.length > 0) {
                this.lastEventIndex = eventList2.length - 1;
            }

            globalStore.changeSubmitParam({isOdocRequest: "1"});

            var commonParam2 = globalStore.commonParam || {};
            var intervenorright = commonParam2.intervenorright || -1;
            if (intervenorright > 0) {
                //nothing to do
            } else {
                //enableIntervenor = 0，不启用标准的节点附加操作
                globalStore.changeSubmitParam({enableIntervenor: "0"});
            }
            //WfForm.rightBtn.doSave_nNew();

            /**
             *  改为提交的目的，是为了保证，公文添加的拦截事件，比如验证套红、正文是否保存等可以生效，
             *  服务端会拦截，将参数修改为保存，以达到仅保存流程，而不流转的目的
             */
            if (isSubmit) {
                WfForm.rightBtn.doSubmitBack();
            } else {
                WfForm.rightBtn.doSave_nNew();
            }
        },

        /**
         * 刷新右键菜单
         */
        reloadRightMenu: function () {
            var globalStore = WfForm.getGlobalStore();
            var urlParams = globalStore.urlParams;
            globalStore.loadRightMenu(urlParams);
        },

        /**
         * 刷新签字意见列表
         */
        reloadLogList: function () {
            var globalStore = WfForm.getGlobalStore();
            var reloadLogListParams = {
                pgnumber: 1,
                atmet: '',
                maxrequestlogid: 0
            };

            globalStore.batchControlVariableMap({
                'isRelaodLogList': true,
                'reloadLogListParams': reloadLogListParams
            });
        },

        /**
         * 刷新流程表单
         */
        reloadFormByCondition: function (requestid) {
            var layoutStore = WfForm.getLayoutStore();
            var detailMap = layoutStore.detailMap || {};
            //有明细表，才需要刷新流程表单
            if (detailMap.size > 0) {
                WfForm.reloadPage({requestid: requestid});
            }

            this.isHandling = false;
        }
    };


    /*******************需要提供调用的内部方法start********************/

    /**
     * 打开公文流转的窗口
     */
    var showOdocTransferDialog0 = function () {
        var callbackFn = function (callback, funcParams) {
            var OdocComsDialogTypes = window.weaOdoc.components.OdocComsDialogTypes;
            var stores = window.weaOdoc.store;

            var params = {};
            var globalStore = WfForm.getGlobalStore();
            var submitParam = globalStore.submitParam || {};
            var requestid = submitParam.requestid;

            params.globalStore = WfForm.getGlobalStore();
            params.layoutStore = WfForm.getLayoutStore();

            /**
             * 提交成功后的回调方法
             * @param isend 是否结束本人处理
             * @param data 成功后的数据
             */
            params.onSuccess = function (isend, data) {
                //关闭窗口
                if (stores && stores.odocCompsStore) {
                    stores.odocCompsStore.setDialogVisible(OdocComsDialogTypes.ODOC_TRANSFER_DIALOG, false);
                }

                if (isend === "1") {
                    //刷新待办列表
                    WfForm.reloadListPage();
                    //关闭流程表单
                    callback();
                } else {        //刷新流程表单
                    WfForm.reloadPage({requestid: requestid});
                }
            }

            /**
             * 关闭时的回调方法
             */
            params.onClose = function () {
                //刷新流程表单
                //WfForm.reloadPage({requestid: requestid});
                comsUtil.reloadFormByCondition(requestid);
                //清除注册的拦截事件
                comsUtil.clearCheckEvent();
            }

            //打开窗口
            if (stores && stores.odocCompsStore) {
                stores.odocCompsStore.setDialogParam(OdocComsDialogTypes.ODOC_TRANSFER_DIALOG, params);
                stores.odocCompsStore.setDialogVisible(OdocComsDialogTypes.ODOC_TRANSFER_DIALOG, true);
            }

            //如果需要关闭流程表单页面，请调用callback方法
            //callback();
        };

        comsUtil.doSaveWorkflow(callbackFn, true);
    }


    var showOdocTransferDialog1 = function () {
        var callbackFn = function (callback, funcParams) {
            var OdocEvent = window.weaOdoc.components.OdocEvent;

            var params = {};
            var globalStore = WfForm.getGlobalStore();
            var submitParam = globalStore.submitParam || {};
            var requestid = submitParam.requestid;

            params.globalStore = WfForm.getGlobalStore();
            params.layoutStore = WfForm.getLayoutStore();

            /**
             * 关闭时的回调方法
             */
            params.onClose = function () {
                //刷新流程表单
                //WfForm.reloadPage({requestid: requestid});
                comsUtil.reloadFormByCondition(requestid);
                //清除注册的拦截事件
                comsUtil.clearCheckEvent();
            }

            //查询后台设置，决定是否需要弹出公文流转的窗口
            if (OdocEvent) {
                OdocEvent.setWorkflowStores(globalStore);
                if (OdocEvent.loadConfig) {
                    OdocEvent.loadConfig(params, callback);
                }
            }
        };

        comsUtil.doSaveWorkflow(callbackFn, true);
    }

    var showOdocWithdrawDialog0 = function () {
        var OdocComsDialogTypes = window.weaOdoc.components.OdocComsDialogTypes;
        var stores = window.weaOdoc.store;

        //打开窗口
        if (stores && stores.odocCompsStore) {
            var globalStore = WfForm.getGlobalStore();
            var submitParam = globalStore.submitParam || {};
            var requestid = submitParam.requestid;
            var params = {};
            params.onClose = function (api_status, res) {
                if (api_status) {
                    var verifyRight = false;
                    if (res && res.verifyRight) {
                        verifyRight = res.verifyRight;
                    }
                    if (verifyRight) {//有权限
                        WfForm.reloadPage({requestid: requestid});
                    } else {//无权限
                        WfForm.rightBtn.doBack()
                    }
                }
            }
            stores.odocCompsStore.setDialogParam(OdocComsDialogTypes.ODOC_WITHDRAW_DIALOG, params);
            stores.odocCompsStore.setDialogVisible(OdocComsDialogTypes.ODOC_WITHDRAW_DIALOG, true);
        }
    }

    var showOdocWithdrawManagerDialog0 = function (menuName) {
        var OdocComsDialogTypes = window.weaOdoc.components.OdocComsDialogTypes;
        var stores = window.weaOdoc.store;

        //打开窗口
        if (stores && stores.odocCompsStore) {
            var globalStore = WfForm.getGlobalStore();
            var submitParam = globalStore.submitParam || {};
            var requestid = submitParam.requestid;
            var params = {menuName: menuName};
            params.onClose = function (api_status, res) {
                if (api_status) {
                    var verifyRight = false;
                    if (res && res.verifyRight) {
                        verifyRight = res.verifyRight;
                    }
                    if (verifyRight) {//有权限
                        WfForm.reloadPage({requestid: requestid});
                    } else {//无权限
                        //返回待办列表
                        WfForm.rightBtn.doBack()
                    }
                }
            }
            stores.odocCompsStore.setDialogParam(OdocComsDialogTypes.ODOC_WITHDRAW_MANAGER_DIALOG, params);
            stores.odocCompsStore.setDialogVisible(OdocComsDialogTypes.ODOC_WITHDRAW_MANAGER_DIALOG, true);
        }
    }
    var showOdocUpdateOperatorDialog = function () {
        var OdocComsDialogTypes = window.weaOdoc.components.OdocComsDialogTypes;
        var stores = window.weaOdoc.store;

        //打开窗口
        if (stores && stores.odocCompsStore) {
            var params = {};
            params.onSuccess = function (data) {
                var globalStore = WfForm.getGlobalStore();
                var urlParams = globalStore.urlParams;
                WfForm.reloadPage(urlParams);
            }
            stores.odocCompsStore.setDialogParam(OdocComsDialogTypes.ODOC_UPDATEOPERATOR_DIALOG, params);
            stores.odocCompsStore.setDialogVisible(OdocComsDialogTypes.ODOC_UPDATEOPERATOR_DIALOG, true);
        }
    }

    //显示填写意见窗口
    var showOdocFillRemarkDialog = function () {
        var OdocComsDialogTypes = window.weaOdoc.components.OdocComsDialogTypes;
        var stores = window.weaOdoc.store;
        var params = {};
        params.onClose = function () {
            comsUtil.clearCheckEvent();
        }
        //打开窗口
        if (stores && stores.odocCompsStore) {
            stores.odocCompsStore.setDialogParam(OdocComsDialogTypes.ODOC_FILL_REMARK_DIALOG, params);
            stores.odocCompsStore.setDialogVisible(OdocComsDialogTypes.ODOC_FILL_REMARK_DIALOG, true);
        }
    }

    //结束本人处理
    var doEndMyRequest = function () {
        var callbackFn = function (callback) {
            var OdocEvent = window.weaOdoc.components.OdocEvent;
            var store = WfForm.getGlobalStore();
            var params = {};
            params.onSuccess = function (fn) {
                //刷新待办列表
                WfForm.reloadListPage();
                //关闭流程表单
                callback();
            }

            params.onClose = function () {
                var submitParam = store.submitParam || {};
                var requestid = submitParam.requestid;
                //刷新流程表单
                // WfForm.reloadPage({requestid: requestid});
                comsUtil.reloadFormByCondition(requestid);
                //清空注册的事件
                comsUtil.clearCheckEvent();
            }

            //执行结束本人处理
            if (OdocEvent && OdocEvent.doEndMyRequest) {
                OdocEvent.setWorkflowStores(store);
                OdocEvent.doEndMyRequest(params);
            }
        }
        comsUtil.doSaveWorkflow(callbackFn, true);
    }


    //流程跟踪
    var doFollowRequest = function (flag) {
        var OdocEvent = window.weaOdoc.components.OdocEvent;
        var store = WfForm.getGlobalStore();

        var reloadMenu = function () {
            comsUtil.reloadRightMenu();
        }

        if (OdocEvent && OdocEvent.doFollowRequest) {
            OdocEvent.setWorkflowStores(store);
            OdocEvent.doFollowRequest(flag, reloadMenu);
        }
    }


    //转文
    var changeOdocType = function () {
        var callbackFn1 = function () {

            var OdocComsDialogTypes = window.weaOdoc.components.OdocComsDialogTypes;
            var stores = window.weaOdoc.store;
            var params = {};
            params.onClose = function () {
                var globalStore = WfForm.getGlobalStore();
                var submitParam = globalStore.submitParam || {};
                var requestid = submitParam.requestid;
                //刷新流程表单
                //WfForm.reloadPage({requestid: requestid});
                comsUtil.reloadFormByCondition(requestid);

                //清空注册的事件
                comsUtil.clearCheckEvent();
            }
            //打开窗口
            if (stores && stores.odocCompsStore) {
                stores.odocCompsStore.setDialogParam(OdocComsDialogTypes.ODOC_CHANGE_ODOC_TYPE_DIALOG, params);
                stores.odocCompsStore.setDialogVisible(OdocComsDialogTypes.ODOC_CHANGE_ODOC_TYPE_DIALOG, true);
            }
        }
        comsUtil.doSaveWorkflow(callbackFn1);
    }
    //追加意见
    var showAppendOdocLogDialog = function () {
        var OdocComsDialogTypes = window.weaOdoc.components.OdocComsDialogTypes;
        var stores = window.weaOdoc.store;

        var params = {};
        params.globalStore = WfForm.getGlobalStore();
        params.layoutStore = WfForm.getLayoutStore();
        //打开窗口
        if (stores && stores.odocCompsStore) {
            params.onClose = function (api_status, res) {
                if (api_status) {
                    comsUtil.reloadLogList();
                }
            }
            stores.odocCompsStore.setDialogParam(OdocComsDialogTypes.ODOC_APPEND_SIGNLOG, params);
            stores.odocCompsStore.setDialogVisible(OdocComsDialogTypes.ODOC_APPEND_SIGNLOG, true);
        }
    }

    //追加意见(个人）
    var showAppendOdocLogSelfDialog = function () {
        var OdocComsDialogTypes = window.weaOdoc.components.OdocComsDialogTypes;
        var stores = window.weaOdoc.store;

        var params = {};
        params.globalStore = WfForm.getGlobalStore();
        params.layoutStore = WfForm.getLayoutStore();
        //打开窗口
        if (stores && stores.odocCompsStore) {
            params.onClose = function (api_status, res) {
                if (api_status) {
                    comsUtil.reloadLogList();
                }
            }
            stores.odocCompsStore.setDialogParam(OdocComsDialogTypes.ODOC_APPEND_SIGNLOG_SELF, params);
            stores.odocCompsStore.setDialogVisible(OdocComsDialogTypes.ODOC_APPEND_SIGNLOG_SELF, true);
        }
    }

    //修改意见
    var showUpdateOdocLogDialog = function () {
        var OdocComsDialogTypes = window.weaOdoc.components.OdocComsDialogTypes;
        var stores = window.weaOdoc.store;

        var params = {};
        params.globalStore = WfForm.getGlobalStore();
        params.layoutStore = WfForm.getLayoutStore();
        //打开窗口
        if (stores && stores.odocCompsStore) {
            params.onClose = function (api_status, res) {
                if (api_status) {
                    comsUtil.reloadLogList();
                }
            }
            params.onSuccess = function () {
                comsUtil.reloadLogList();
            }
            stores.odocCompsStore.setDialogParam(OdocComsDialogTypes.ODOC_UPDATE_SIGNLOG, params);
            stores.odocCompsStore.setDialogVisible(OdocComsDialogTypes.ODOC_UPDATE_SIGNLOG, true);
        }
    }

    function getUrlParams(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.hash.split("?")[1].match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return "";
    }


    //PC端自定义tab页签事件绑定
    var loadOdocCusTabDatas = function () {
        var requestid = getUrlParams("requestid");
        var workflowid = "";
        if (requestid == "") {
            workflowid = getUrlParams("workflowid");
            if (workflowid == "") {
                workflowid = getUrlParams("_workflowid");
            }
        }
        var f_weaver_belongto_userid = getUrlParams("f_weaver_belongto_userid");
        var f_weaver_belongto_usertype = getUrlParams("f_weaver_belongto_usertype");
        var opendoc = getUrlParams("opendoc");
        jQuery.ajax({
            type: "GET",
            url: (window.ecologyContentPath || "") + "/api/odoc/odocMenuOperate/getOdocTabManagerDatas",
            data: {
                requestid: requestid,
                workflowid: workflowid,
                opendoc: opendoc,
                f_weaver_belongto_userid: f_weaver_belongto_userid,
                f_weaver_belongto_usertype: f_weaver_belongto_usertype
            },
            async: false,
            cache: false,
            dataType: 'json',
            success: function (data) {
                if (data.api_status && data.api_status == true) {
                    var customTabs = data.customTabs;
                    var isDefaultOpenOdoc = data.isDefaultOpenOdoc || false;
                    var defaultOpenKey = data.defaultOpenKey || "";
                    if (customTabs.length > 0) {
                        initCusTabDatas(customTabs, isDefaultOpenOdoc, requestid, defaultOpenKey);//有自定义tab则进行页签过滤以及页签切换
                    }

                }
            }
        })

    }

    function initCusTabDatas(customTabs, isDefaultOpenOdoc, requestid, defaultOpenKey) {
        //页签过滤重写
        WfForm.registerAction(WfForm.ACTION_TABCONFIG, function (tabDatas) {
            var oldTabArr = [];
            var notOdocCusTabs = [];//非公文后台表单页签管理添加的页签默认放置最后
            for (var i = 0; i < tabDatas.length; i++) {
                if (tabDatas[i].key.indexOf("custom_iframe") >= 0) {
                    notOdocCusTabs.push(tabDatas[i]);
                } else {
                    oldTabArr.push(tabDatas[i].key);
                }
            }
            if (isDefaultOpenOdoc && !WfForm.getOdocConfig().docParam.isEdit) {
                var index = 0;
              var temp = customTabs.filter(function (item, i) { return item.key == 'odoc' && (index = i) });
                if(temp.length>0){
                    customTabs.splice(index, 1);
                    customTabs.unshift(temp[0])
                }
            }
            return getCusTabDatas(oldTabArr, customTabs, notOdocCusTabs, defaultOpenKey);
        });

        var timer = setInterval(function () {
            try {
                if (isDefaultOpenOdoc == true || requestid == "" || requestid < 1) {//默认打开正文就不做任何处理
                    clearInterval(timer);
                } else if (firstTabItem.key && firstTabItem.key != "" && WfForm.getBaseInfo && WfForm.getBaseInfo().workflowid && WfForm.getBaseInfo().workflowid > 0 && jQuery(".wea-new-top-req-content").length > 0 && jQuery(".custom-tab-iframe").length > 0) {
                    WfForm.getGlobalStore().setTabKey(firstTabItem.key);
                    if (firstTabItem.key == "custom_iframe_haoqian") {
                        var context_height = jQuery(".wea-new-top-req-content").height();
                        jQuery(".wf-append-iframe").css({"display": "block", "height": context_height});
                        jQuery(".custom-tab-iframe").css({display: "none"});
                        if (jQuery(".custom-haoqian-iframe").length <= 0) {
                            jQuery(".wf-append-iframe").append('<iframe class="custom-haoqian-iframe" src="' + firstTabItem.url + '" style="width:100%;height:100%;border:none"></iframe>')
                        } else {
                            jQuery(".custom-haoqian-iframe").css({display: "block"});
                        }
                        clearInterval(timer);
                    } else {
                        if (window.openSignApproval && window.openSignApproval == true) {//如果已打开签批页面，就不要再除非页签切换
                            clearInterval(timer);
                            return;
                        } else if (firstTabItem.tabType == 0) {//第一个页签为标准页签直接切换，否则通过返回的URL进行iframe加载
                            WfForm.switchTab(firstTabItem.key);
                            clearInterval(timer);
                        } else {
                            var url = firstTabItem.url;
                            var context_height = jQuery(".wea-new-top-req-content").height();
                            jQuery(".wf-append-iframe").css({"display": "block", "height": context_height});
                            if (jQuery(".custom-tab-iframe").length > 0) {
                                var lastSrc = jQuery(".custom-tab-iframe")[0].src;
                                jQuery(".custom-tab-iframe")[0].src = url;
                                var newSrc = url.split("?")[0];
                                if (lastSrc.indexOf(newSrc) >= 0) {
                                    jQuery(".custom-tab-iframe")[0].contentWindow.location.reload();
                                }
                                clearInterval(timer);
                            }
                        }
                    }

                }
            } catch (e) {
                clearInterval(timer);
            }
        }, 500)
    }

    function getCusTabDatas(oldTabs, customTabs, notOdocCusTabs, defaultOpenKey) {
        var newCusTabs = [];
        for (var i = 0; i < customTabs.length; i++) {
            var item = customTabs[i];

            if ((item.tabType == 0 && (oldTabs.indexOf(item.key) >= 0 || item.key.indexOf("custom_iframe") >= 0)) || item.tabType != 0) {
                newCusTabs.push(item);
                if (item.key == defaultOpenKey) {
                    firstTabSelected = true;
                    firstTabItem = item;
                }
            }

            if (newCusTabs.length > 0 && firstTabSelected == false) {
                firstTabItem = newCusTabs[0];
            }
        }
        return newCusTabs.concat(notOdocCusTabs);
    }

    var bindCustomTabEvent = function () {
        var OdocEvent = window.weaOdoc.components.OdocEvent;
        var store = WfForm.getGlobalStore();

        if (OdocEvent && OdocEvent.doFollowRequest) {
            OdocEvent.setWorkflowStores(store);
            OdocEvent.bindCustomTabEvent();
        }
    }

    var bindSignApprovalTabEvent = function () {
        var OdocEvent = window.weaOdoc.components.OdocEvent;
        var store = WfForm.getGlobalStore();

        if (OdocEvent && OdocEvent.doFollowRequest) {
            OdocEvent.setWorkflowStores(store);
            OdocEvent.bindSignApprovalTabEvent();
        }
    }

    var doAdjustLog = function () {
        var OdocComsDialogTypes = window.weaOdoc.components.OdocComsDialogTypes;
        var stores = window.weaOdoc.store;

        var params = {};
        params.globalStore = WfForm.getGlobalStore();
        params.layoutStore = WfForm.getLayoutStore();
        //打开窗口
        if (stores && stores.odocCompsStore) {
            stores.odocCompsStore.setDialogParam(OdocComsDialogTypes.ODOC_ADJUST_LOG, params);
            stores.odocCompsStore.setDialogVisible(OdocComsDialogTypes.ODOC_ADJUST_LOG, true);
        }
    }

    //强制归档
    var doForceArchive = function () {
        var OdocEvent = window.weaOdoc.components.OdocEvent;
        var store = WfForm.getGlobalStore();

        var callbaclFn = function () {
            WfForm.reloadListPage();        //刷新流程列表
            try {
                window.top.close();
            } catch (e) {
                window.close();
            }
        }

        if (OdocEvent && OdocEvent.doFollowRequest) {
            OdocEvent.setWorkflowStores(store);
            OdocEvent.doForceArchive(callbaclFn);
        }
    }

    var showAssignRemark = function () {
        var OdocEvent = window.weaOdoc.components.OdocEvent;

        var store = WfForm.getGlobalStore();
        //查询设置，当前用户是否需要显示交办意见的列表窗口
        if (OdocEvent) {
            OdocEvent.setWorkflowStores(store);
            if (OdocEvent.showAssignRemark) {
                OdocEvent.showAssignRemark();
            }
        }
    }

    var odocNumber = function (params) {
        var OdocComsDialogTypes = window.weaOdoc.components.OdocComsDialogTypes;
        var stores = window.weaOdoc.store;

        params = params||{};
        params.globalStore = WfForm.getGlobalStore();
        params.layoutStore = WfForm.getLayoutStore();
        //打开窗口
        if (stores && stores.odocCompsStore) {
            stores.odocCompsStore.setDialogParam(OdocComsDialogTypes.ODOC_NUMBER, params);
            stores.odocCompsStore.setDialogVisible(OdocComsDialogTypes.ODOC_NUMBER, true);
        }
    }


    var doReject0 = function () {
        var callbackFn = function (callback, funcParams) {
            var OdocEvent = window.weaOdoc.components.OdocEvent;

            var params = {};
            var globalStore = WfForm.getGlobalStore();
            var submitParam = globalStore.submitParam || {};
            var requestid = submitParam.requestid;

            params.globalStore = WfForm.getGlobalStore();
            params.layoutStore = WfForm.getLayoutStore();

            /**
             * 关闭时的回调方法
             */
            params.onClose = function () {
                //刷新流程表单
                //WfForm.reloadPage({requestid: requestid});
                comsUtil.reloadFormByCondition(requestid);

                //清除注册的拦截事件
                comsUtil.clearCheckEvent();
            }

            var store = WfForm.getGlobalStore();
            //查询设置，当前用户是否需要显示交办意见的列表窗口
            if (OdocEvent) {
                OdocEvent.setWorkflowStores(store);
                if (OdocEvent.loadRejectConfig) {
                    OdocEvent.loadRejectConfig(params, callback);
                }
            }
        }

        comsUtil.doSaveWorkflow(callbackFn, true);
    }

    // 公文分发
    var odocDispatchDoc = function () {
        var OdocComsDialogTypes = window.weaOdoc.components.OdocComsDialogTypes;
        var stores = window.weaOdoc.store;

        var params = {};
        params.globalStore = WfForm.getGlobalStore();
        params.layoutStore = WfForm.getLayoutStore();
        var baseInfo = WfForm.getBaseInfo();
        params.requestid = baseInfo.requestid;
        params.f_weaver_belongto_userid = baseInfo.f_weaver_belongto_userid;
        params.f_weaver_belongto_usertype = baseInfo.f_weaver_belongto_usertype;
        params.workflowid = baseInfo.workflowid;
        params.nodeid = baseInfo.nodeid;
        //打开窗口
        if (stores && stores.odocCompsStore) {
            var oldParams = stores.odocCompsStore.dialogParam[OdocComsDialogTypes.ODOC_DISPATCH_DOC_DIALOG];
            if (oldParams && typeof oldParams.openModalFun == 'function') {
                oldParams.openModalFun(params);
            } else {
                stores.odocCompsStore.setDialogParam(OdocComsDialogTypes.ODOC_DISPATCH_DOC_DIALOG, params);
                stores.odocCompsStore.setDialogVisible(OdocComsDialogTypes.ODOC_DISPATCH_DOC_DIALOG, true);
            }
        }
    }

    /*******************需要提供调用的内部方法end********************/
    loadOdocCusTabDatas();
    //执行加载公文流转组件
    comsUtil.loadOdocComs(function () {
        comsUtil.renderOdocComs();

        /**
         * 组件加载完成后，需要立即初始化的事件，请调用comsUtil.pushEvent
         */
        comsUtil.pushEvent(function () {
            bindCustomTabEvent();//PC端自定义tab页签事件绑定
            bindSignApprovalTabEvent();//绑定签批页签事件
            showAssignRemark();     //显示交办意见列表的窗口
            comsUtil.clear4RequestEvent();
        });
    });

    return {
        /**
         * 公文流转
         */
        doOdocTransfer: function () {
            comsUtil.checkOdocComs(function () {
                showOdocTransferDialog1();
            })
        },
        /**
         * 撤回
         */
        withdraw: function () {
            comsUtil.checkOdocComs(function () {
                showOdocWithdrawDialog0();
            })
        },
        /**
         * 撤回(管理员）
         */
        withdrawManager: function (menuName) {
            comsUtil.checkOdocComs(function () {
                showOdocWithdrawManagerDialog0(menuName);
            })
        },
        /**
         * 加减签
         */
        updateOperator: function () {
            comsUtil.checkOdocComs(function () {
                showOdocUpdateOperatorDialog();
            })
        },
        /**
         * 追加意见
         */
        appendOdocLog: function () {
            comsUtil.checkOdocComs(function () {
                showAppendOdocLogDialog();
            })
        },
        /**
         * 追加意见（个人）
         */
        appendOdocLogSelf: function () {
            comsUtil.checkOdocComs(function () {
                showAppendOdocLogSelfDialog();
            })
        },
        /**
         * 修改意见
         */
        updateOdocLog: function () {
            comsUtil.checkOdocComs(function () {
                showUpdateOdocLogDialog();
            })
        },
        /**
         * 填写意见
         */
        doSaveRemark: function () {
            comsUtil.checkOdocComs(function () {
                showOdocFillRemarkDialog();
            })
        },
        /**
         * 流程跟踪
         */
        doFollowRequest: function (flag) {
            comsUtil.checkOdocComs(function () {
                doFollowRequest(flag);
            })
        },
        /**
         * 结束本人处理
         */
        doEndMyRequest: function () {
            comsUtil.checkOdocComs(function () {
                doEndMyRequest();
            })
        },
        /**
         * 催办
         */
        doUrge: function () {
            alert("催办待实现!");
        },
        /**
         * 转文
         */
        changeOdocType: function () {
            comsUtil.checkOdocComs(function () {
                changeOdocType();
            })
        },

        /**
         * 强制归档
         */
        doForceArchive: function () {
            comsUtil.checkOdocComs(function () {
                doForceArchive();
            })
        },

        /**
         * 查看调整日志
         */
        viewTransferChangeLog: function () {
            comsUtil.checkOdocComs(function () {
                doAdjustLog();
            })
        },
        /**
         * 公文编号
         */
        odocNumber: function (params) {
            comsUtil.checkOdocComs(function () {
                odocNumber(params);
            })
        },

        /**
         * 退回
         */
        doReject: function () {
            comsUtil.checkOdocComs(function () {
                doReject0();
            })
        },

        /**
         * 公文分发
         */
        doDispatchDoc: function () {
            comsUtil.checkOdocComs(function () {
                odocDispatchDoc();
            })
        }
    }
})(window);

