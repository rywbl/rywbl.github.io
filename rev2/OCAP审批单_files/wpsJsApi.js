/*
 * @Descripttion: 
 * @version: 
 * @Author: kl2018
 * @Date: 2020-11-14 15:11:28
 * @LastEditors: nj2020
 * @LastEditTime: 2021-09-01 15:17:35
 */

window.beforeWpsOnlineEdit = {
  odoc_isOpenWpsJsApi: false,
  pageId: Math.random().toString(36).substring(2),
  editMarkBooks: "",
  showMarkBooks: '',
  ipAddress: window.location.protocol + '//' + window.location.host + (window.ecologyContentPath || ''),
  createDoc: function () {
    var loginId = JSON.parse(localStorage.getItem('login')).loginId;
    var userName = JSON.parse(localStorage.getItem('theme-account')).username
    var templateUrlToken = ''
    jQuery.ajax({
      url: (window.ecologyContentPath || '') + '/ssologin/getToken?type=ecology&loginid=' + loginId,
      type: "GET",
      async: false,
      success: function (msg) {
        templateUrlToken = msg;
      }
    });

    //获取编辑模板的书签对应关系
    window.WfForm.getOdocConfig().docParam.docid == -1 && getBookMarkReact();
    //获取套红模板的书签对应关系
    window.WfForm.getOdocConfig().docParam.isUseTempletNode && getRedBookmarkObj();

    var docParam = mobx.toJS(wfform.getOdocConfig()).docParam;
    var documentTitleField = docParam.documentTitleField;
    if (documentTitleField === -3 || documentTitleField === 0) documentTitleField = -1;
    var fileName = WfForm.getFieldValue("field" + documentTitleField);
    var filePath = '';
    var showMouldRealPath = '';
    var saved = true;
    if (docParam.docid > 0 && docParam.isUseTempletNode && docParam.showMouldId > 0) {
      var redObj = getTaohongPath(docParam.showMouldId, docParam.imagefileId);
      showMouldRealPath = redObj.mouldDownloadLink;
      filePath = redObj.documentDownloadLink;
      saved = false
    } else {
      if (docParam.docid > 0) {
        filePath = getDownloadpath("document", docParam.imagefileId)
      } else if (docParam.editMouldId > 0) {
        filePath = getDownloadpath('editMould', docParam.editMouldId)
        saved = false
      }
    }
    var templateTaskPaneVisible = docParam.isStartNode || docParam.hasUsedTemplet != "1"
    filePath && (filePath = this.ipAddress + filePath + '&filename=' + encodeURIComponent(fileName));
    showMouldRealPath && (showMouldRealPath = this.ipAddress + showMouldRealPath + '&filename=' + encodeURIComponent(fileName));
    var searcParams = docParam;
    searcParams.fileName = fileName; //文件名
    searcParams.showMarkBooks = docParam.isUseTempletNode ? this.showMarkBooks : ''; //套红模板书签对应关系
    searcParams.redTemplateUrl = showMouldRealPath; //
    searcParams.redMarkBooks = 'Content';
    searcParams.loginId = loginId;
    searcParams.selectValue = WfForm.getFieldValue('field' + docParam.showMouldfieldid) == "" ? -1 : WfForm.getFieldValue('field' + docParam.showMouldfieldid);
    searcParams.editMouldfieldidValue = docParam.docid > 0 ? WfForm.getFieldValue('field' + docParam.odocTypeField) : "";
    searcParams.templateTaskPaneVisible = templateTaskPaneVisible;
    searcParams.openRevision = docParam.isCompellentMark == "1";
    searcParams.pageId = beforeWpsOnlineEdit.pageId;
    var templateUrl = "";
    if ((docParam.isStartNode || docParam.isUseTempletNode || docParam.isSignatureNodes)) {
      // templateUrl = this.ipAddress + '/spa/odoc/static/index.html?ssoToken=' + templateUrlToken + '#/main/offical/wpsJsApi?ssoToken=' + templateUrlToken + '&' + new URLSearchParams(searcParams)
      // templateUrl = this.ipAddress + '/spa/odoc/static/index.html?ssoToken=' + templateUrlToken + '#/main/offical/wpsJsApi?ssoToken=' + templateUrlToken + '&' + objectToURL(searcParams)
      templateUrl = window.beforeWpsOnlineEdit.ipAddress + '/odoc/odoc/wpsSelectModule.html?ssoToken=' + templateUrlToken + '&' + objectToURL(searcParams)
    }
    var funcs = [{
      OpenDoc: {
        fileName: filePath,
        // oaUrl: this.ipAddress + '/odoc/odoc/wpsJsApi.html?ssoToken=' + data + '&' + new URLSearchParams(searcParams),
        // oaTaskPaneVisible: false,
        templateUrl: templateUrl,
        templateTaskPaneVisible: templateTaskPaneVisible,
        pageId: beforeWpsOnlineEdit.pageId,
        saved: saved,
        tabControl: {
          btnSaveToServer: !docParam.isUseTempletNode && docParam.isEdit == 1,
          btnOpenLocalWPSYUN: docParam.isEdit == 1,// docParam.docid > 0 ? false :true,
          btnSaveAsFile: docParam.isEdit == 1,
          btnAcceptAllRevisions: docParam.isCleanCopyNodes,
          btnRejectAllRevisions: docParam.isCleanCopyNodes,
          btnClearRevDoc: docParam.isCleanCopyNodes,
          btnPrintDOC: docParam.canPrint,
          btnInsertRedHeader: docParam.isUseTempletNode && docParam.hasUsedTemplet != '1',
          btnInsertRedHeaderCancel: docParam.isUseTempletNode && docParam.hasUsedTemplet == '1',
          btnShowRevision: docParam.isEdit == 1,
        },
        revisionCtrl: {
          bOpenRevision: !docParam.isStartNode && docParam.isCompellentMark == "1",
          bShowRevision: docParam.ishidethetraces != '1'
        },
        userName: userName,
        width: 300,
        editMarkBooks: !docParam.docId ? this.editMarkBooks : '',
        openType: {
          //文档打开方式
          // 文档保护类型，-1：不启用保护模式，0：只允许对现有内容进行修订，
          // 1：只允许添加批注，2：只允许修改窗体域(禁止拷贝功能)，3：只读
          protectType: docParam.isEdit == 1 ? -1 : 3,
          password: "zxcvbnm"
        },
        hasUsedTemplet: docParam.hasUsedTemplet,// 是否已经套过红
      }
    }]
    if (docParam.docid > -1 && docParam.isUseTempletNode) {
      funcs[0] = {
        OnlineEditDoc: funcs[0].OpenDoc
      }
      funcs[0].OnlineEditDoc.insertFileUrl = showMouldRealPath;
      funcs[0].OnlineEditDoc.bkInsertFile = "Content"
      funcs[0].OnlineEditDoc.showMarkBooks = docParam.isUseTempletNode ? this.showMarkBooks : '';
    }
    beforeWpsOnlineEdit.odoc_isOpenWpsJsApi = true;
    window.console && console.log(funcs)
    // _WpsInvoke(funcs) // OpenDoc方法对应于OA助手dispatcher支持的方法名
    odocWpsJsAPiInstall(funcs)
  }
}

var scriptDom1 = document.createElement('script');
scriptDom1.src = (window.ecologyContentPath || '') + '/odoc/odoc/js/formdata.js'
var scriptDom2 = document.createElement('script');
scriptDom2.src = (window.ecologyContentPath || '') + '/odoc/odoc/js/common.js'
document.body.appendChild(scriptDom1)
document.body.appendChild(scriptDom2)


function _WpsInvoke(funcs) {
  var bUseHttps = window.location.protocol.indexOf('https') > 1;
  var info = {};
  info.funcs = funcs;
  var func = bUseHttps ? WpsInvoke.InvokeAsHttps : WpsInvoke.InvokeAsHttp
  func(WpsInvoke.ClientType.wps, // 组件类型
    "WpsOAAssist", // 插件名，与wps客户端加载的加载的插件名对应
    "dispatcher", // 插件方法入口，与wps客户端加载的加载的插件代码对应，详细见插件代码
    info, // 传递给插件的数据
    function (result) { // 调用回调，status为0为成功，其他是错误
      if (result.status) {
        if (bUseHttps && result.status == 100) {
          WpsInvoke.AuthHttpesCert('请在稍后打开的网页中，点击"高级" => "继续前往"，完成授权。')
          return;
        }
        alert(result.message)
      } else {
        showresult(result.response)
      }
    })
}

function showresult(resultData) {
  var json = eval('(' + resultData + ')')
  switch (json.message) {
    case "GetDocStatus": {
      var docstatus = json.docstatus
      if (typeof docstatus != "undefined") {
        var str = "文档保存状态：" +
          docstatus.saved +
          "\n文档字数：" +
          docstatus.words +
          "\n文档页数：" + docstatus.pages
        alert(str)
      }
    }
  }
}

function handleOaMessage(message) {
  if (!message) {
    return;
  }

  var datas = JSON.parse(message);
  // setTimeout(function () {
  //   _WpsInvoke({}, false, undefined, true)
  // }, 4000)
  if (!datas.datas || (datas.datas.pageId != beforeWpsOnlineEdit.pageId)) {
    return;
  }
  switch (datas.action) {
    case 'save':
      getSaveDocId(datas.datas);
      break;
    case 'close':
      beforeWpsOnlineEdit.odoc_isOpenWpsJsApi = false;
      break;
    case 'update':
      var docInfo = window.WfForm.getOdocConfig();
      docInfo.docParam.imagefileId = datas.datas.imagefileid;
      window.WfForm.changeOdocConfig(docInfo);
      break;
    default:
  }
}

function getSaveDocId(datas) {
  beforeWpsOnlineEdit.odoc_isOpenWpsJsApi = false;
  var docinfo = mobx.toJS(wfform.getOdocConfig());
  if (datas.api_status) {
    wfform.changeFieldValue("field" + docinfo.docParam.docFieldId, {
      value: datas.docid,
      specialobj: [
        { id: datas.docid, name: datas.docname }
      ]
    });
    if (docinfo.docParam.isSignatureNodes) {
      docinfo.docParam.hasSignatureSucceed = true;
    }
    wfform.changeOdocConfig(window.WfForm.getOdocConfig());
    wfform.doSave();
  }
}

function getEditBookmarkObj(editMouldId, paranJsonStr) {
  var bookmarkJson = "";
  jQuery.ajax({
    url: (window.ecologyContentPath || '') + "/odoc/odoc/iWebOfficeOperation.jsp",
    type: "POST",
    async: false,
    data: {
      mouldid: editMouldId,
      paramMap: paranJsonStr,
      operation: "getEditBookmarkObj"
    },
    dataType: "json",
    success: function (msg) {
      bookmarkJson = msg.bookmarkJson;
    }
  });
  return bookmarkJson;
}

function wpsOperatFunc() {
  var editMouldRealPath = WfForm.getOdocConfig().docParam.editMouldRealPath;
  // var showMouldRealPath = WfForm.getOdocConfig().docParam.showMouldRealPath;
  var isEdit = WfForm.getOdocConfig().docParam.isEdit;
  var docRealPath = WfForm.getOdocConfig().docParam.docRealPath;
  if (docRealPath) {
    window.wps && wpsOnlineEdit.openLocalFile(docRealPath)
  } else if (editMouldRealPath) {
    window.wps && wpsOnlineEdit.openLocalFile(editMouldRealPath)
    // } else if (showMouldRealPath) { 
    //   wpsOnlineEdit.useTemplet(showMouldRealPath);
  }
  if (isEdit == "0") {
    window.wps && wpsOnlineEdit.onProtect("zxcvbnm")
  }
}

function getBookMarkReact() {
  var docParam = WfForm.getOdocConfig().docParam;
  var editMouldId = docParam.editMouldId;
  var bookmarkJsonStr = ''
  if (editMouldId > 0) {
    var languageId = localStorage.getItem('languageidweaver') || '7';
    var uuid = setUrlParams();
    var paraStr = getUrlParams(uuid);
    var paraJson = JSON.parse(paraStr);
    paraJson["languageId"] = languageId;
    paraJson["requestId"] = docParam.requestid;
    paraJson["workflowId"] = docParam.workflowid;
    var paranJsonStr = JSON.stringify(paraJson);
    if (paraStr == "") {
      window.top.alert("获取表单参数失败");
    }
    bookmarkJsonStr = getEditBookmarkObj(editMouldId, paranJsonStr);
  }
  //获取编辑模板的书签对应关系
  beforeWpsOnlineEdit.editMarkBooks = (bookmarkJsonStr && JSON.stringify(bookmarkJsonStr)) || '';
}

function setUrlParams() {
  var docInfonew = WfForm.getOdocConfig();
  var formFieldList = docInfonew.formFieldList;
  var fieldTotalList = new Array();
  //编辑模板字段
  for (var i = 0; formFieldList && i < formFieldList.length; i++) {
    var fieldid = formFieldList[i];
    if (jQuery.inArray(fieldid, fieldTotalList) >= 0) continue;
    fieldTotalList.push(fieldid);
  }
  //选择框目录字段
  if (jQuery.inArray(docInfonew.docParam.secFieldid, fieldTotalList) == -1) fieldTotalList.push(docInfonew.docParam.secFieldid);
  //文档标题
  if (jQuery.inArray(docInfonew.docParam.secFieldid, fieldTotalList) == -1) {
    fieldTotalList.push(docInfonew.docParam.secFieldid);
  }

  //选择框目录字段
  if (jQuery.inArray(docInfonew.docParam.documentTitleField, fieldTotalList) == -1) fieldTotalList.push(docInfonew.docParam.documentTitleField);

  var fieldTotalObj = oDocUtil.getFromFieldValue(fieldTotalList);

  //保留需要带入URL参数的内容
  docInfonew.nowDocParam = new Object();
  docInfonew.nowDocParam = _.clone(docInfonew.docParam);
  for (var fieldInfo in fieldTotalObj) {//不使用过滤
    docInfonew.nowDocParam[fieldInfo] = fieldTotalObj[fieldInfo];
  }
  //模板书签对应字段
  var formFieldList = docInfonew.formFieldList;
  var formFieldObj = oDocUtil.getFromFieldValue(formFieldList ? formFieldList : []);
  //模板书签对应，不需要带入URL参数中，但是需要记录变化
  for (var fieldInfo in formFieldObj) {
    docInfonew.nowDocParam[fieldInfo] = formFieldObj[fieldInfo];
  }
  var dataJson = _.clone(docInfonew.nowDocParam);
  dataJson.action = 'setUrlParams';
  var rtn;
  jQuery.ajax({
    type: "POST",
    url: (window.ecologyContentPath || '') + "/odoc/docs/odocCommonAjax.jsp?date=" + new Date(),
    data: dataJson,
    async: false,
    cache: false,
    dataType: 'json',
    success: function (returndata) {
      rtn = returndata.uuid;
    }
  });
  return rtn;
}

function getUrlParams(uuid) {
  var rtn;
  jQuery.ajax({
    type: "POST",
    url: (window.ecologyContentPath || '') + "/odoc/docs/odocCommonAjax.jsp?date=" + new Date(),
    data: { uuid: uuid, action: "getUrlParams" },
    async: false,
    cache: false,
    dataType: 'json',
    success: function (msg) {
      if (msg.status == true) {
        rtn = msg.urlparams || "";
      }
    }
  });
  return rtn;
}

function getRedBookmarkObj(showMouldId, docId) {
  var docParam = WfForm.getOdocConfig().docParam;
  var showMouldId = docParam.showMouldId;
  var docid = docParam.docid;
  var bookmarkJson = '';
  jQuery.ajax({
    url: (window.ecologyContentPath || '') + "/odoc/odoc/iWebOfficeOperation.jsp",
    type: "POST",
    async: false,
    data: {
      mouldid: showMouldId,
      id: docid,
      operation: "getBookmarkObj"
    },
    dataType: "json",
    success: function (msg) {
      bookmarkJson = msg.bookmarkJson;
    }
  });
  beforeWpsOnlineEdit.showMarkBooks = (bookmarkJson && JSON.stringify(bookmarkJson)) || '';
}


// prop_type showMould 显示模板 editMould 编辑模板 document 普通文档
// prop_fileId ： imagefileid
function getDownloadpath(prop_type, prop_fileId) {
  var downloadLink = "";
  jQuery.ajax({
    type: "POST",
    url: (window.ecologyContentPath || '') + "/odoc/docs/odocSetUserInfoAjax.jsp?date=" + new Date().getTime(),
    data: { action: "setUserInfo" },
    async: false,
    cache: false,
    dataType: 'json',
    success: function (msg) {
      if (msg.success == true) {
        if (prop_type && prop_type != "" && prop_fileId && prop_fileId != "") {
          downloadLink = (window.ecologyContentPath || '') + "/weaver/weaver.file.FileDownloadForNews?uuid=" + msg.uuid + "&fileid=" + prop_fileId + "&type=" + prop_type + "&fromWpsJsAPI=1";
        } else if (prop_fileId && prop_fileId != "") {
          downloadLink = (window.ecologyContentPath || '') + "/weaver/weaver.file.FileDownloadForNews?uuid=" + msg.uuid + "&fileid=" + prop_fileId + "&type=document" + "&fromWpsJsAPI=1";
        }
      } else {
        if (window.console) {
          window.console.log("getDownloadLink:获取用户信息失败,没有权限打开文档");
        }
      }
    },
    error: function () {
      if (window.console) {
        window.console.log("getDownloadLink:发送ajax请求失败");
      }
    }
  });
  return downloadLink;
}

function getTaohongPath(showMouldId, documentId) {
  var rtn = new Object();
  if (showMouldId <= 0 || documentId <= 0) {
    return rtn;
  }
  jQuery.ajax({
    type: "POST",
    url: (window.ecologyContentPath || '') + "/odoc/docs/odocSetUserInfoAjax.jsp?date=" + new Date().getTime(),
    data: { action: "setUserInfo", isBatch: "1" },
    async: false,
    cache: false,
    dataType: 'json',
    success: function (msg) {
      if (msg.success == true) {
        rtn.mouldDownloadLink = (window.ecologyContentPath || '') + "/weaver/weaver.file.FileDownloadForNews?uuid=" + msg.uuid + "&fileid=" + showMouldId + "&type=showMould&fromWpsJsAPI=1";
        rtn.documentDownloadLink = (window.ecologyContentPath || '') + "/weaver/weaver.file.FileDownloadForNews?uuid=" + msg.uuid2 + "&fileid=" + documentId + "&type=document&fromWpsJsAPI=1";
      } else {
        if (window.console) {
          window.console.log("getDownloadLink:获取用户信息失败,没有权限打开文档");
        }
      }
    },
    error: function () {
      if (window.console) {
        window.console.log("getDownloadLink:发送ajax请求失败");
      }
    }
  });
  return rtn;
}

function objectToURL(data) {
  window.console && console.log(data)
  var result = [];
  for (var key in data) {
    var value = data[key];
    result.push(key + '=' + encodeURIComponent(value));
  }
  return result.join('&');
}


function odocWpsJsAPiInstall(funcs) {
  window.loadjs.isDefined("useLocalWPSApp") ? window.loadjs.ready('useLocalWPSApp', function () {
    _WpsInvoke(funcs)
  }) : window.loadjs([(window.ecologyContentPath || '') + '/odoc/odoc/js/wps_sdk.js'], 'useLocalWPSApp', function () {
    var ipAddress = window.location.protocol + '//' + window.location.host + (window.ecologyContentPath || '');
    var curList = [
      { "name": "WpsOAAssist", "addonType": "wps", "online": "true", "url": ipAddress + '/odoc/odoc/WpsOAAssist/' }
    ]
    var localList = [];
    var publishIndex = 0;
    var publishUnIndex = 0;
    /*获取用户本地全部加载项的接口是必须要的，这个接口做了判断， 
    ** 如果58890端口未启动，会先去启动这个端口
    */

    //加载项安装函数
    function installWpsAddin() {
      WpsAddonMgr.getAllConfig(function (e) {
        if (e.response.indexOf("null") >= 0 || !e.response) {
          if (curList.length > 0) {
            installWpsAddinOne();
          }
        } else {//本地有加载项，先卸载原有加载项，然后再安装
          localList = JSON.parse(e.response)
          unInstallWpsAddinOne()
        }
      })
    }
    //安装单个加载项
    function installWpsAddinOne() {
      WpsAddonMgr.enable(curList[publishIndex], function (e) {
        if (e.status) {
          window.console && window.console.log(e.msg)
        } else {
          window.console && window.console.log("安装成功")
        }
        publishIndex++;
        if (publishIndex < curList.length) {
          installWpsAddinOne();
        } else {
          _WpsInvoke(funcs)
        }
      })
    }

    //卸载单个加载项
    function unInstallWpsAddinOne() {
      WpsAddonMgr.disable(localList[publishUnIndex], function (e) {
        if (e.status) {
          window.console && console.log(e.msg)
        } else {
          window.console && console.log("卸载成功")
        }
        publishUnIndex++;
        if (publishUnIndex < localList.length) {
          unInstallWpsAddinOne();
        } else {
          if (curList.length > 0) {
            installWpsAddinOne();
          }
        }
      })
    }
    //页面加载完成后，自动安装
    installWpsAddin()
  })
}


//放在最后  方便查找
$(function () {
  var timer = setInterval(function () {
    if (window.WfForm && window.WfForm.getOdocConfig().docFlag != null) {
      clearInterval(timer);
      var docInfo = WfForm.getOdocConfig();
      if (docInfo.openWpsJSAPI && docInfo.extendName.indexOf('doc') > -1) {
        // openWpsJsApi();
        WpsInvoke.RegWebNotify(WpsInvoke.ClientType.wps, "WpsOAAssist", handleOaMessage);
      }
    }
  }, 2000)
});