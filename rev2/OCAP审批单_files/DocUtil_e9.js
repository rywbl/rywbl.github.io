

var oDocUtil = {
  e: null,
  uploadPDFCanClick: true,
  uuid: null,
  onlySave: null,
  secretLevelValue: null,//保密密级
  secretLevelYears: null,//保密期限
  needReconfirmSecretLevel: true,//需确认正文密级
  showOdocModelAndSensitivelList: false,//正文页签下是否加载范文列表，若加载范文列表，隐藏后显示插件时，需特殊处理插件宽度
  workEventKey: null,
  useWpsViewFile: false,
  wfBonbeforeunload: window.onbeforeunload, //记录原始（流程）方法，避免覆盖原有方法后无法还原

  loadOdocConfig: function () {
    var docInfo = WfForm.getOdocConfig();
    //是否默认打开正文  如果不是执行下面 如果是odocUtil里面已经执行了这里
    if (!(docInfo.docFlag && docInfo.opentextdefaultnode &&
      (!docInfo.openWpsJSAPI && docInfo.extendName.indexOf('doc') > 0) && //判断是否是wpsjsapi打开文件
      docInfo.docParam.docid > 0 && !docInfo.docParam.isTextInFormCanEdit)
      || (docInfo.docFlag && docInfo.docParam.isUseTempletNode)
      || (docInfo.docFlag && docInfo.docParam.docid < 0 && docInfo.docParam.editmouldCount > 1)
      || (docInfo.docFlag && docInfo.docParam.docid > 0 && docInfo.docParam.reSelectMould)) {
      //流程监控增加临时权限判断
      if (docInfo.docParam && !docInfo.docParam.authStr) {
        docInfo.docParam.authStr = wfform.getGlobalStore().commonParam.authStr;
      }
      if (docInfo.docParam && !docInfo.docParam.authSignatureStr) {
        docInfo.docParam.authSignatureStr = wfform.getGlobalStore().commonParam.authSignatureStr;
      }
      if (docInfo.docParam && !docInfo.docParam.f_weaver_belongto_userid) {
        docInfo.docParam.f_weaver_belongto_userid = wfform.getBaseInfo().f_weaver_belongto_userid;
      }
      if (docInfo.docParam && !docInfo.docParam.f_weaver_belongto_usertype) {
        docInfo.docParam.f_weaver_belongto_usertype = wfform.getBaseInfo().f_weaver_belongto_usertype;
      }
      WfForm.changeOdocConfig(docInfo);
      var secifeldid = -1;
      if (secifeldid != docInfo.docParam.secFieldid) {
        secifeldid = "field" + docInfo.docParam.secFieldid;
      }
      //取值
      oDocUtil.loadDocInfoBySecid(secifeldid);
      var formSecifeldid = "field" + docInfo.docParam.secFieldid;
      WfForm.bindFieldChangeEvent(formSecifeldid, function (obj, id, value) {
        oDocUtil.loadDocInfoBySecid(secifeldid);
      });
      //获取编辑模板对应字段选择模板
      var editMouldfieldid = -1;
      if (editMouldfieldid != docInfo.docParam.editMouldFieldid) {
        editMouldfieldid = "field" + docInfo.docParam.editMouldFieldid;
      }
      //获取套红模板对应字段选择模板
      var showMouldfieldid = -1;
      if (showMouldfieldid != docInfo.docParam.showMouldFieldid) {
        showMouldfieldid = "field" + docInfo.docParam.showMouldFieldid;
      }
      oDocUtil.loadMouldInfoByField(editMouldfieldid, docInfo.docParam.isSelectField, showMouldfieldid, docInfo.docParam.isShowSelectField);
      //oDocUtil.getFromFieldValue(new Array([docInfo.docParam.editMouldFieldid]));
      var editOrShowMouldfieldid = "field" + docInfo.docParam.editMouldFieldid + "," + "field" + docInfo.docParam.showMouldFieldid;
      WfForm.bindFieldChangeEvent(editOrShowMouldfieldid, function (obj, id, value) {
        oDocUtil.loadMouldInfoByField(editMouldfieldid, docInfo.docParam.isSelectField, showMouldfieldid, docInfo.docParam.isShowSelectField);
      });
    }

    if (docInfo.docParam.secFieldid != -1) {
      //解决下拉框默认值不加载对应模板的问题
      oDocUtil.loadDocInfoBySecid(secifeldid);
      oDocUtil.getFromFieldValue(new Array([docInfo.docParam.secFieldid]));
      WfForm.bindFieldChangeEvent(secifeldid, function (obj, id, value) {
        oDocUtil.loadDocInfoBySecid(secifeldid);
        oDocUtil.getFromFieldValue(new Array([secifeldid]));
      });
    }
    setTimeout("setTextShowInForm()", 300);
    setTimeout("odocregisterCheckEvent()", 300);
    //在odocUtil.js中替代了
    if (docInfo.opentextdefaultnode === true && docInfo.docParam.docid > 0) {
      setTimeout("WfForm.switchTab('odoc')", 1000);
    }
    oDocUtil.count = 0;
    oDocUtil.countfj = 0;
    if (docInfo.isConvertSuccess == "0") {
      oDocUtil.checkTarget(docInfo.fieldidspan, docInfo.ofdlable);
    }
    if (docInfo.fjConvertSuccess == "1") {
      oDocUtil.checkFJTarget(docInfo.fjfieldidspan, docInfo.fjlable);
    }
  },
  // retrun true 直接切换到这个正文页签
  clickAddOdoc: function (isText, hideBtn, docid, odocfileType) {
    var docInfonew = WfForm.getOdocConfig();
    //是否开启了wpsjsapi 开启了wpsjsapi 走这个方法
    // if (docInfonew.openWpsJSAPI && docInfonew.extendName.indexOf('doc') > 0) {
    //   beforeWpsOnlineEdit.createDoc();
    //   return false;
    // }
    //wpsjsapi 当前文档是否重复打开
    if (window.beforeWpsOnlineEdit && window.beforeWpsOnlineEdit.odoc_isOpenWpsJsApi) {
      antd.message.warn(ecCom.WeaLocaleProvider.getLabel('', '已经打开过wps了,请勿重新打开！'))
      return false;
    }
    //是否开启了 上传pdf、上传ofd、上传word
    var uploadFile = !(docInfonew.uploadPdf || docInfonew.uploadOfd || docInfonew.uploadWord || !docInfonew.reUploadText);
    var currentSecretLevelValue = docInfonew.docParam.secretLevelValue || oDocUtil.secretLevelValue;
    if (uploadFile && (!docInfonew.isOpenClassification || (docInfonew.isOpenClassification && currentSecretLevelValue))) {
      return true;
    }
    //是否填写流程密级
    if (!oDocUtil.haveSecretLevel()) {
      oDocUtil.uploadPDFCanClick = true;
      WfForm.switchTab("form");
      return false;
    }

    //标题字段是否填写
    var documentFieldId = docInfonew.docParam.documentTitleField;
    if (documentFieldId === -3 || documentFieldId === 0) documentFieldId = -1;
    if (isText) {
      if (WfForm.getFieldValue("field" + documentFieldId) === "" && WfForm.getFieldCurViewAttr('field' + + documentFieldId) > 1) {
        antd.message.error("\"" + WfForm.getFieldInfo(documentFieldId).fieldlabel + "\"" + ecCom.WeaLocaleProvider.getLabel(503020, '字段未填写'));
        oDocUtil.uploadPDFCanClick = true;
        WfForm.switchTab("form");
        return false;
      }
      WfForm.switchTab("odoc");
      return true;
    }

    //判断是否出现连续点击的情况
    if (!oDocUtil.uploadPDFCanClick) {
      return false;
    }
    oDocUtil.uploadPDFCanClick = false;

    var req_workflow_odoc = document.getElementsByClassName("req-workflow-odoc")
    if (req_workflow_odoc.length > 0) {
      req_workflow_odoc[0].style.width = "1px";
    }
    if (!window.weaOdoc) {
      window.eventRegister && window.eventRegister.loadModule('f_odoc',
        function () {
          oDocUtil.renderDialog(hideBtn, docid, odocfileType, uploadFile ? 'clickOdocTab' : '');
        },
        function () {
          window.console && console.log("公文模块加载失败");
        }
      );
    } else {
      oDocUtil.renderDialog(hideBtn, docid, odocfileType, uploadFile ? 'clickOdocTab' : '');
    }
  },

  haveSecretLevel: function () {//是否填写了流程密级
    var flag = true;
    var docInfo = WfForm.getOdocConfig();
    if (docInfo.isOpenClassification && docInfo.isOpenClassification == true) {
      //流程密级是否有值
      var secretLevel = WfForm.getFieldValue("field-10");
      if (!secretLevel || secretLevel == "") {
        flag = false;
        antd.message.error(ecCom.WeaLocaleProvider.getLabel(528443, '请先填写流程密级！'));
      }
    }
    return flag;
  },
  uploadDocFile: function (limitType) {
    if (!window.weaOdoc) {
      window.eventRegister && window.eventRegister.loadModule('f_odoc',
        function () {
          var uploadComponent = document.createElement("div");
          uploadComponent.setAttribute("id", "uploadDocComponent");
          uploadComponent.setAttribute("limitType", limitType);
          document.body.appendChild(uploadComponent);
          var UploadFileComp = weaOdoc.components.UploadDocFile;
          ReactDOM.render(
            UploadFileComp,
            document.getElementById("uploadDocComponent")
          )
        },
        function () {
          window.console && console.log("公文模块加载失败");
        }
      );
    } else {
      var uploadComponent = document.createElement("div");
      uploadComponent.setAttribute("id", "uploadDocComponent");
      uploadComponent.setAttribute("limitType", limitType);
      document.body.appendChild(uploadComponent);
      var UploadFileComp = weaOdoc.components.UploadDocFile;
      ReactDOM.render(
        UploadFileComp,
        document.getElementById("uploadDocComponent")
      )
    }
  },
  selectTemplate: function (iseditmould, isPreview) {
    var docInfo = WfForm.getOdocConfig();
    var workflowId = docInfo.docParam.workflowid;//流程id
    var requestId = docInfo.docParam.requestid;//流程requestid
	var systemType = docInfo.docParam.systemType;//是否国产环境
    //选择框目录字段
    /*var secFieldid = docInfo.docParam.secFieldid;
    var selectvalue = -1;
    if(secFieldid == -1){
        selectvalue = -1;
    }else{
        selectvalue = WfForm.getFieldValue('field'+secFieldid)=="" ? -1 : WfForm.getFieldValue('field'+secFieldid);
    }*/
    var selectvalue = docInfo.docParam.showMouldFieldValue;
    var editMouldfieldidValue = "";
    if (docInfo.docParam.docid <= 0) {
      editMouldfieldidValue = WfForm.getFieldValue('field' + docInfo.docParam.odocTypeField);
    }
    if (iseditmould) {
      var editMouldfieldid = docInfo.docParam.editMouldFieldid;
      if (editMouldfieldid == -1) {
        selectvalue = -1;
      } else {
        selectvalue = WfForm.getFieldValue('field' + editMouldfieldid) == "" ? -1 : WfForm.getFieldValue('field' + editMouldfieldid);
        if (docInfo.docParam.isSelectField == 'false' && WfForm.getFieldValue('field' + editMouldfieldid) != "") {
          selectvalue = Number(selectvalue) + 100;
        }
      }
    } else {
      var showMouldfieldid = docInfo.docParam.showMouldFieldid;
      var mouldSelectType = docInfo.docParam.mouldSelectType;
      var selectFieldType = WfForm.getOdocConfig().docParam.selectFieldType;
      if (mouldSelectType == 1) {
        var selectOdocNumberid = docInfo.docParam.selectOdocNumberid;
        if (selectOdocNumberid < 1) {
          var odocNumberTypeField = docInfo.docParam.odocNumberTypeField;
          if (odocNumberTypeField != "") {
            selectOdocNumberid = WfForm.getFieldValue("field" + odocNumberTypeField);
          }
        }
        if (selectOdocNumberid != "" && selectOdocNumberid > 0) {
          selectvalue = (-1) * parseInt(selectOdocNumberid) - 100;
        } else {
          selectvalue = -1;
        }
      } else if (showMouldfieldid == -1) {
        selectvalue = -1;
      } else {
        selectvalue = WfForm.getFieldValue('field' + showMouldfieldid) == "" ? -1 : WfForm.getFieldValue('field' + showMouldfieldid);
        if (docInfo.docParam.isShowSelectField == 'false' && WfForm.getFieldValue('field' + showMouldfieldid) != "") {
          if (selectFieldType == 324) {
            selectvalue = -1 * Number(selectvalue) - 100;
          } else {
            selectvalue = Number(selectvalue) + 100;
          }

        }
      }
    }
    var req_workflow_odoc = document.getElementsByClassName("req-workflow-odoc");
    if (docInfo.docParam.isTextInFormCanEdit && (docInfo.docParam.isTextInForm || docInfo.docParam.isColumnShow == '1') && docInfo.docParam.docid > 0) {
      if (docInfo.docParam.isColumnShow == '1') {
        req_workflow_odoc = document.getElementsByClassName("wf-req-form-odoc-iframe");
      } else {
        req_workflow_odoc = document.getElementById("requestdocInForm");
      }
    }
    if (isPreview && (isPreview == 1)) {

    } else if (req_workflow_odoc.length > 0) {
      try {
        req_workflow_odoc[0].style.width = "1px";
      } catch (e) {
        req_workflow_odoc.style.width = "1px";
      }
    }
    showOrHideWeboffice(0);
    if (window.weaOdoc) {
      if (isPreview && (isPreview == 1 || isPreview == 2)) {//1预览，2预览+选择套红
        var TemplatePreviewDom = document.getElementById("TemplatePreviewComponent");
        var lastSelectValue = window.weaOdoc.store.docTemplateStore.selectvalue;
        window.weaOdoc.store.docTemplateStore.setPropertyNew({
          visible: true,
          selectvalue: selectvalue,
          fullView: isPreview == 1 ? 1 : 0
        })
        if (!TemplatePreviewDom) {
          var TemplatePreviewDiv = document.createElement("div");
          TemplatePreviewDiv.setAttribute("id", "TemplatePreviewComponent");
          document.body.appendChild(TemplatePreviewDiv);
          var TemplatePreviewComp = weaOdoc.components.OdocTemplatePreview;
          ReactDOM.render(
            TemplatePreviewComp,
            document.getElementById("TemplatePreviewComponent")
          )
        } else {
          if (lastSelectValue != selectvalue) {
            window.weaOdoc.store.docTemplateStore.getMouldList();
          }
        }

      } else {
        var openModelDom = document.createElement("div");
        openModelDom.setAttribute("id", "openModelComponent");
        openModelDom.setAttribute("workflowId", workflowId);
        openModelDom.setAttribute("selectvalue", selectvalue);
        openModelDom.setAttribute("iseditmould", iseditmould);
        openModelDom.setAttribute("requestId", requestId);
        openModelDom.setAttribute("editMouldfieldidValue", editMouldfieldidValue);
		openModelDom.setAttribute("systemType", systemType);
        document.body.appendChild(openModelDom);
        var OpenModelComp = weaOdoc.components.OpenModel;
        ReactDOM.render(
          OpenModelComp,
          document.getElementById("openModelComponent")
        )
      }
    } else {
      parent.antd.message.error("公文模块加载失败");
    }
  },

  checkTarget: function (id, ofdlable) {
    window.setTimeout(function () {
      var hasATarget = jQuery("#" + id).find("a").length > 0 ? true : false;
      if (hasATarget) {

        jQuery("#" + id).children().hide();
        jQuery("#" + id).append('<p  style="color:red">' + ofdlable + '</p>');

      } else if (oDocUtil.count < 100) {
        oDocUtil.count++;
        oDocUtil.checkTarget(id, ofdlable);
      }
    }, 100, id, ofdlable);
  },
  checkFJTarget: function (fjid, fjlable) {

    window.setTimeout(function () {
      var ids = fjid.split(",");

      var hasATarget = ids.length > 0 ? true : false;
      if (hasATarget) {
        for (var i = 0; i < ids.length; i++) {
          var jsobj = oDocUtil.getElementByAttr("div", "data-fieldmark", ids[i]);
          var jeqobj = $(jsobj);
          //jeqobj.children().hide();
          jeqobj.append('<p  style="color:red">' + fjlable + '</p>');
        }

      } else if (oDocUtil.countfj < 100) {
        oDocUtil.countfj++;
        oDocUtil.checkFJTarget(fjid, fjlable);
      }

    }, 100, fjid, fjlable);
  },
  getElementByAttr: function (tag, attr, value) {
    var aElements = document.getElementsByTagName(tag);
    var aEle = [];
    for (var i = 0; i < aElements.length; i++) {
      if (aElements[i].getAttribute(attr) == value)
        aEle.push(aElements[i]);
    }
    return aEle;
  },
  //根据文档目录，获取必要的表单上的信息
  loadDocInfoBySecid: function (secifeldid) {
    var secifeldvalue = -1;
    try {
      if (-1 != secifeldid && secifeldid != undefined) {
        secifeldvalue = WfForm.getFieldValue(secifeldid);
      }
    } catch (e) {
    }
    var workflowid = jQuery("#workflowid").val();
    jQuery.ajax({
      type: "POST",
      url: (window.ecologyContentPath || "") + "/odoc/docs/odocCommonAjax.jsp",
      data: {
        workflowid: workflowid,
        selectValue: secifeldvalue,
        requestid: jQuery("#requestid").val(),
        action: "getData"
      },
      cache: false,
      dataType: 'json',
      success: function (returndata) {
        var docInfonew = WfForm.getOdocConfig();
        docInfonew.docParam.secid = returndata.seccategoryid;
        /*docInfonew.docParam.editmouldCount = returndata.editmouldCount;
        docInfonew.docParam.showmouldCount = returndata.showmouldCount;
        docInfonew.docParam.showMouldId = returndata.showMouldId;
        docInfonew.docParam.editMouldId = returndata.editMouldId;
        docInfonew.formFieldList = returndata.formFieldList;*/
        WfForm.changeOdocConfig(docInfonew);
        //TODO
        if (window.console) console.log("setDocParam--", docInfonew);
      }
    });

  },
  //根据模板区分字段，获取编辑、套红模板信息
  loadMouldInfoByField: function (editMouldfieldid, isSelectField, showMouldfieldid, isShowSelectField) {
    var editfieldvalue = -1;
    var selectFieldType = WfForm.getOdocConfig().docParam.selectFieldType;
    if (-1 != editMouldfieldid) {
      editfieldvalue = WfForm.getFieldValue(editMouldfieldid);
      if (isSelectField == 'false' && editfieldvalue != "") {
        editfieldvalue = Number(editfieldvalue) + 100;
      }
    }
    var showfieldvalue = -1;
    if (-1 != showMouldfieldid) {
      showfieldvalue = WfForm.getFieldValue(showMouldfieldid);
      if (isShowSelectField == 'false' && showfieldvalue != "") {
        if (selectFieldType == 324) {
          showfieldvalue = -1 * Number(showfieldvalue) - 100;
        } else {
          showfieldvalue = Number(showfieldvalue) + 100;
        }

      }
    }
    var workflowid = jQuery("#workflowid").val();
    var systemType = WfForm.getOdocConfig().docParam.systemType;

    jQuery.ajax({
      type: "POST",
      url: (window.ecologyContentPath || "") + "/odoc/docs/odocCommonAjax.jsp",
      data: {
        workflowid: workflowid,
        editfieldvalue: editfieldvalue,
        showfieldvalue: showfieldvalue,
        requestid: jQuery("#requestid").val(),
        systemType: systemType,
        selectFieldType: selectFieldType,
        action: "getMouldInfo"
      },
      cache: false,
      dataType: 'json',
      success: function (returndata) {
        var docInfonew = WfForm.getOdocConfig();
        docInfonew.docParam.editmouldCount = returndata.editmouldCount;
        docInfonew.docParam.showmouldCount = returndata.showmouldCount;
        docInfonew.docParam.showMouldId = returndata.showMouldId;
        docInfonew.docParam.editMouldId = returndata.editMouldId;
        docInfonew.formFieldList = returndata.formFieldList;
        if (docInfonew.docParam.isUseTempletNode && docInfonew.docParam.hasUsedTemplet != '1' && docInfonew.docParam.docid > 0 && returndata.showmouldCount > 1 && !(docInfonew.docParam.extendName == ".pdf" || docInfonew.docParam.extendName == ".ofd" || docInfonew.docParam.extendName == ".html") && (docInfonew.docParam.onEditDoc || docInfonew.docParam.useyozoorwps == '0')) {
            docInfonew.docParam.isShowSelectOtherMould = true;
        }else {
            docInfonew.docParam.isShowSelectOtherMould = false;
        }
        WfForm.changeOdocConfig(docInfonew);
        //TODO
        if (window.console) console.log("--loadMouldInfoByField--setDocParam--", docInfonew);
      }
    });

  },
  getFromFieldValue: function (fieldList) {
    var retObj = new Object();
    for (var i = 0; i < fieldList.length; i++) {
      var fieldid = fieldList[i];
      if (fieldid == "-3") {
        var fieldvalue = WfForm.getFieldValue("field-1");
        retObj["requestname"] = fieldvalue;
      } else {
        var fieldvalue = WfForm.getFieldValue("field" + fieldid);
        retObj["field" + fieldid] = fieldvalue;
      }
    }
    retObj["requestname"] = WfForm.getFieldValue("field-1");
    return retObj;
  },
  setDocParam: function () {
    var docInfonew = WfForm.getOdocConfig();
    var documentFieldId = docInfonew.docParam.documentTitleField;
    if (documentFieldId === -3 || documentFieldId === 0) documentFieldId = -1;

    /**
     * 单行文本校验及正文存放目录校验逻辑迁移至formUtil.js
     */

    var formFieldList = docInfonew.formFieldList;
    var fieldTotalList = new Array();
    for (var i = 0; formFieldList && i < formFieldList.length; i++) {
      var fieldid = formFieldList[i];
      if (jQuery.inArray(fieldid, fieldTotalList) >= 0) continue;
      fieldTotalList.push(fieldid);
    }
    //选择框字段
    if (jQuery.inArray(docInfonew.docParam.secFieldid, fieldTotalList) == -1) {
      fieldTotalList.push(docInfonew.docParam.secFieldid);
    }
    //编辑模板字段
    if (jQuery.inArray(docInfonew.docParam.editMouldfieldid, fieldTotalList) == -1) {
      fieldTotalList.push(docInfonew.docParam.editMouldFieldid);
    }
    //套红模板字段
    if (jQuery.inArray(docInfonew.docParam.showMouldFieldid, fieldTotalList) == -1) {
      fieldTotalList.push(docInfonew.docParam.showMouldFieldid);
    }
    //文档标题
    if (jQuery.inArray(docInfonew.docParam.documentTitleField, fieldTotalList) == -1) {
      fieldTotalList.push(docInfonew.docParam.documentTitleField);
    }

    if (window.console) console.log("fieldTotalList", fieldTotalList);
    var fieldTotalObj = oDocUtil.getFromFieldValue(fieldTotalList);
    if (window.console) console.log("fieldTotalObj", fieldTotalObj);
    // for (var fieldInfo in fieldTotalObj) {//不使用过滤
    //     docInfonew.docParam[fieldInfo] = fieldTotalObj[fieldInfo];
    // }
    //保留需要带入URL参数的内容
    docInfonew.nowDocParam = new Object();
    docInfonew.nowDocParam = _.cloneDeep(mobx.toJS(docInfonew.docParam));
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

    //是否需要重新加载url
    docInfonew.needReload = false;
    try {
      if (docInfonew.nowDocParam.hasUsedTemplet != null) {
        docInfonew.lasttimeDocParam.hasUsedTemplet = docInfonew.nowDocParam.hasUsedTemplet;
      }
    } catch (e) { }
    if (!_.isEqual(mobx.toJS(docInfonew.nowDocParam), mobx.toJS(docInfonew.lasttimeDocParam))) {
      docInfonew.needReload = true;
      try {
        //开启默认预览正文，且点了编辑按钮之后，不做重新加载
        if (docInfonew.docParam.useyozoorwps == "1" && docInfonew.docParam.onEditDoc == true) {
          docInfonew.needReload = false;
          //默认预览时，再重新套编辑模板
          jQuery(".req-workflow-odoc")[0].contentWindow.selectEditTemplate2();

        }
      } catch (e) { }

      var odocWin;
      if (jQuery(".req-workflow-odoc").length > 0 && docInfonew.needReload) {
        odocWin = jQuery(".req-workflow-odoc")[0].contentWindow;
        //关闭控件
        try {
          odocWin.onbeforeunload = null;
        } catch (e) {
        }
        try {
          window.onbeforeunload = null;
        } catch (e) {
        }
        try {
          odocWin.document.getElementById("webOffice").contentWindow.document.getElementById("WebOffice").saved = true;
        } catch (e) {
        }
        try {
          odocWin.document.getElementById("webOffice").contentWindow.onbeforeunload = null;
        } catch (e) {
        }
        try {
          odocWin.document.getElementById("webOffice").contentWindow.document.getElementById("WebOffice").WebClose();
        } catch (e) {
        }
        if (window.console) console.log(jQuery(".req-workflow-odoc")[0].src);
        docInfonew.lasttimeDocParam = new Object();
        docInfonew.lasttimeDocParam = _.cloneDeep(mobx.toJS(docInfonew.nowDocParam));
      }
    } else {
      docInfonew.needReload = false;
    }
    //开启排版
    if(docInfonew.needReload == true
        && docInfonew.docParam.manualSmartOfficial == true
        && docInfonew.docParam.clickSmartOfficial == true
    ){
      docInfonew.needReload = false;
    }
    if (window.console) console.log("docInfonew---new", docInfonew);
    WfForm.changeOdocConfig(docInfonew);
    if (docInfonew.needReload) {
      var url = docInfonew.docUrl + "?";
      var count = 0;
      var router = docInfonew.docParam.router;
      if (docInfonew.docParam.isEdit == 1) {
        router = "#/main/document/edit";
      } else {
        router = "#/main/document/detail";
      }
      for (var key in docInfonew.docParam) {
        if (key == "router") continue;
        if (!(docInfonew.docParam[key])) continue;
        if (count > 0) url += "&";
        url += key + "=" + encodeURIComponent(docInfonew.docParam[key]);
        count++;
      }
      var dataJson = _.cloneDeep(mobx.toJS(docInfonew.nowDocParam));
      dataJson.action = 'setUrlParams';
      jQuery.ajax({
        type: "POST",
        url: (window.ecologyContentPath || "") + "/api/odoc/odocWorkflow/setUrlParams?date=" + new Date().getTime(),//new Date() 会导致ajax传参失败
        data: dataJson,
        async: false,
        cache: false,
        dataType: 'json',
        success: function (returndata) {
          retFlag = returndata.success;
          url += "&uuid=" + returndata.uuid;
          oDocUtil.uuid = returndata.uuid;

        }
      });
      url += "&f_weaver_belongto_userid=" + jQuery("#f_weaver_belongto_userid").val() + "&f_weaver_belongto_usertype=" + jQuery("#f_weaver_belongto_usertype").val();
      //若有密级则传给文档属性页
      if (oDocUtil.secretLevelValue && oDocUtil.secretLevelValue != "") {
        url += "&secretLevel=" + encodeURIComponent(oDocUtil.secretLevelValue);
      }
      if (oDocUtil.secretLevelYears && oDocUtil.secretLevelYears != "") {
        url += "&secretValidity=" + encodeURIComponent(oDocUtil.secretLevelYears);
      }
      url += router;
      try {
        jQuery(".req-workflow-odoc")[0].contentWindow.onbeforeunload = null;
      } catch (e) {
      }
      jQuery(".wf-req-odoc").css("margin-top", "10px");
      jQuery(".wf-req-odoc").css("margin-bottom", "10px");
      jQuery(".wf-req-odoc").height(jQuery(".wea-new-top-req-content").height() - 20);
      jQuery(".req-workflow-odoc").height(jQuery(".wf-req-odoc").height());
      if (WfForm.getOdocConfig().docParam.docid < 0) {//启用正文显示在表单可编辑,不加载正文页签下的正文，新建的时候还是要加载正文
        jQuery(".req-workflow-odoc").attr("src", getSecondPath(url));
      } else {
        if (!WfForm.getOdocConfig().docParam.isTextInFormCanEdit) {
          jQuery(".req-workflow-odoc").attr("src", getSecondPath(url));
        }
      }
    }
  },
  setDocParamInForm: function () {
    var docInfonew = WfForm.getOdocConfig();
    if (!docInfonew.docParam.docid) {
      return;
    }
    //判断正文存放目录是否存在
    if (docInfonew.docParam.secid && docInfonew.docParam.secid <= 0) {
      antd.message.error(ecCom.WeaLocaleProvider.getLabel(519301, "正文存放目录未设置"));
      oDocUtil.uploadPDFCanClick = true
      WfForm.switchTab("form");
      return false;
    }
    var formFieldList = docInfonew.formFieldList;
    var fieldTotalList = new Array();
    for (var i = 0; formFieldList && i < formFieldList.length; i++) {
      var fieldid = formFieldList[i];
      if (jQuery.inArray(fieldid, fieldTotalList) >= 0) continue;
      fieldTotalList.push(fieldid);
    }
    //选择框目录字段
    if (jQuery.inArray(docInfonew.docParam.secFieldid, fieldTotalList) == -1) {
      fieldTotalList.push(docInfonew.docParam.secFieldid);
    }
    //编辑模板字段
    if (jQuery.inArray(docInfonew.docParam.editMouldfieldid, fieldTotalList) == -1) {
      fieldTotalList.push(docInfonew.docParam.editMouldFieldid);
    }
    //套红模板字段
    if (jQuery.inArray(docInfonew.docParam.showMouldFieldid, fieldTotalList) == -1) {
      fieldTotalList.push(docInfonew.docParam.showMouldFieldid);
    }
    //正文标题字段
    if (jQuery.inArray(docInfonew.docParam.documentTitleField, fieldTotalList) == -1) {
      fieldTotalList.push(docInfonew.docParam.documentTitleField);
    }
    if (window.console) console.log("fieldTotalList", fieldTotalList);
    var fieldTotalObj = oDocUtil.getFromFieldValue(fieldTotalList);
    if (window.console) console.log("fieldTotalObj", fieldTotalObj);
    // for (var fieldInfo in fieldTotalObj) {//不使用过滤
    //     docInfonew.docParam[fieldInfo] = fieldTotalObj[fieldInfo];
    // }
    //保留需要带入URL参数的内容
    docInfonew.nowDocParam = new Object();
    docInfonew.nowDocParam = _.cloneDeep(mobx.toJS(docInfonew.docParam));
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
    try {
      if (docInfonew.nowDocParam.hasUsedTemplet != null) {
        docInfonew.lasttimeDocParam.hasUsedTemplet = docInfonew.nowDocParam.hasUsedTemplet;
      }
    } catch (e) { }
    if (window.console) console.log("docInfonew---new", docInfonew);
    WfForm.changeOdocConfig(docInfonew);

    var dataJson = _.cloneDeep(mobx.toJS(docInfonew.nowDocParam));
    dataJson.action = 'setUrlParams';
    jQuery.ajax({
      type: "POST",
      url: (window.ecologyContentPath || "") + "/api/odoc/odocWorkflow/setUrlParams?date=" + new Date().getTime(),
      data: dataJson,
      async: false,
      cache: false,
      dataType: 'json',
      success: function (returndata) {
        retFlag = returndata.success;
        oDocUtil.uuid = returndata.uuid;
      }
    });
  },
  odocBtnEvent: function (eventKey) {
    var docInfo = WfForm.getOdocConfig();
    var odocWin = jQuery(".req-workflow-odoc")[0].contentWindow;
    if (docInfo.docParam.isTextInForm && docInfo.docParam.isTextInFormCanEdit) {
      if (docInfo.docParam.isColumnShow == '1') {
        odocWin = jQuery(".wf-req-form-odoc-iframe")[0].contentWindow;
      } else {
        odocWin = jQuery("#requestdocInForm")[0].contentWindow;
      }
    }
    //获取事件参数
    var onclickParam;
    for (var i = 0; i < docInfo.buttons.length; i++) {
      if (docInfo.buttons[i].key == eventKey) {
        onclickParam = docInfo.buttons[i].onclickParam;
        break;
      }
    }
    if (eventKey == 'BTN_SUBBACKNAME' || eventKey == "BTN_SUBNOBACKNAME" || eventKey == "BTN_REJECTNAME" || eventKey == "BTN_SUBMIT") {
      if (window.beforeWpsOnlineEdit && window.beforeWpsOnlineEdit.odoc_isOpenWpsJsApi) {
        if (confirm('是否保存wps内的文件后在提交!')) {
          return false
        }
      }
      if ("BTN_REJECTNAME" != eventKey) {
        if (docInfo.docParam && docInfo.docParam.isUseTempletNode &&
          (!docInfo.openWpsJSAPI && docInfo.extendName.indexOf('doc') > 0) && //判断是否是wpsjsapi打开文件
          docInfo.docParam.hasUsedTemplet != "1" && needTip(docInfo.docParam.docfiletype) && docInfo.docParam.docid > 0) {
          antd.message.error(ecCom.WeaLocaleProvider.getLabel(21252, '请先执行套红操作！'));
          //alert(ecCom.WeaLocaleProvider.getLabel(21252,'请先执行套红操作！'));
          return false;
        }

        if (docInfo.docParam && docInfo.docParam.isMustSignatureNodes && !docInfo.docParam.qysSignNode && !docInfo.openWpsJSAPI && !docInfo.docParam.hasSignatureSucceed && (needTip(docInfo.docParam.docfiletype) || docInfo.docParam.isQysPdfSingleSign) && docInfo.docParam.docid > 0) {
          antd.message.error(ecCom.WeaLocaleProvider.getLabel(130844, '该节点为签章节点，请先签章，再提交！'));
          //alert(ecCom.WeaLocaleProvider.getLabel(130844,'该节点为签章节点，请先签章，再提交！'));
          return false;
        }
        try {
          if (docInfo.docParam.isEdit == 1 && docInfo.docParam && !docInfo.docParam.isSignatureNodes && (docInfo.docParam.onEditDoc || docInfo.docParam.useyozoorwps == '0')) {
            workEventKey = eventKey;
            var senWordsdoType = docInfo.docParam.senWordsdoType;//正文中存在敏感词处理方式：1 不处理 2 弱控：有提示但允许提交流程 3 强控：有提示且不允许提交流程
            if (senWordsdoType > 1) {
              if (docInfo.wpsEditor && !docInfo.isIwebOfficeNodes) {
                jQuery(".req-workflow-odoc")[0].contentWindow.getTempSendWordImagIdData("submit");
              } else {
                var datas = jQuery(".req-workflow-odoc")[0].contentWindow.getTempSendWordImagIdData();
                jQuery(".req-workflow-odoc")[0].contentWindow.checkSenWordsToSave(3, datas);
              }
            } else {
              oDocUtil.submitWorkToSave();
            }
          } else {
            docInfo.docParam.skipCheckDocSaved = true;
            try {
              setWebOfficeSaved();
            } catch (e1) { }
            try {
              setWebOffice2015Saved();
            } catch (e1) { }
            try {
              document.getElementsByClassName("req-workflow-odoc")[0].style.width = "1px";
              showOrHideWeboffice(0);
            } catch (e) { }
            wfform.doRightBtnEvent(eventKey);
          }
        } catch (e) {
          if (window.console) window.console.log("---" + e);
          return false;
        }

      } else {
        try {
          document.getElementsByClassName("req-workflow-odoc")[0].style.width = "1px";
          showOrHideWeboffice(0);
        } catch (e) { }
        wfform.doRightBtnEvent(eventKey);
      }
    } else if (eventKey == "saveDoc") {
      odocWin.onSave();
      setWebOfficeSaved();
      setWebOffice2015Saved();
      //返回表单
    } else if (eventKey == "backToForm") {
      try {
        odocWin.backToForm();
      } catch (e) {
        parent.WfForm.switchTab('form');
      }
      //选择其他编辑模板
    } else if (eventKey == "selectTemplate2") {
      //  odocWin.selectTemplate2();
      oDocUtil.selectTemplate(true)
      //签章
    } else if (eventKey == "CreateSignature") {
      odocWin.CreateSignature(0);
      //契约锁Office单体签章
    } else if (eventKey == "CreateSignature_Sign") {
      odocWin.CreateSignature(0, 1);
      //契约锁Office单体手写签批
    } else if (eventKey == "CreateSignatureSign_SignHandSig") {
      odocWin.CreateSignature(0, 2);
      //契约锁Office单体骑缝章
    } else if (eventKey == "CreateSignature_SignPageSeal") {
      odocWin.CreateSignature(0, 3);
      //签章确认
    } else if (eventKey == "saveIsignatureFun") {
      if (docInfo.docParam.isQysSignNode) {
        odocWin.saveSignOfQys();
      } else {
        odocWin.saveIsignatureFun();
        setWebOfficeSaved();
        setWebOffice2015Saved();
      }
      //保存新版本
    } else if (eventKey == "SaveNewVersion") {
      odocWin.onSave();
      //显示/隐藏痕迹
    } else if (eventKey == "toggleTrace") {
      if (docInfo.docParam.noplugninText) {
        var webOfficeWin = odocWin.document.getElementById('webOffice').contentWindow;
        webOfficeWin.exportRevision();
      } else {
        odocWin.OnMenuClick(101);
      }
      //清稿
    } else if (eventKey == "clearTrace") {

      if (docInfo.docParam.noplugninText) {
        var webOfficeWin = odocWin.document.getElementById('webOffice').contentWindow;
        webOfficeWin.exportAllRevision();
      } else {
        odocWin.OnMenuClick(102);
      }
      //套红确认
    } else if (eventKey == "saveTHTemplate") {
      if (onclickParam != undefined && onclickParam.length == 1) {
        var senWordsdoType = docInfo.docParam.senWordsdoType;//正文中存在敏感词处理方式：1 不处理 2 弱控：有提示但允许提交流程 3 强控：有提示且不允许提交流程
        if (senWordsdoType > 1) {
          odocWin.saveTHTemplate(onclickParam[0], 'saveTHTemplate');
        } else {
          afterTempEditButton(onclickParam[0], 'submit');
        }
      } else {
        if (window.console) console.log("saveTHTemplate " + ecCom.WeaLocaleProvider.getLabel(503024, '方法参数个数不正确'));
      }
      //选择其他模板
    } else if (eventKey == "selectTemplate") {
      if (onclickParam != undefined && onclickParam.length == 2) {
        if (docInfo.docParam.isCountry == false && (docInfo.docParam.wpsView == true || docInfo.docParam.yozoView == true)) {
          oDocUtil.selectTemplate(false, 2);
        } else {
          oDocUtil.selectTemplate(false);
        }

      } else {
        if (window.console) console.log("selectTemplate " + ecCom.WeaLocaleProvider.getLabel(503024, '方法参数个数不正确'));
      }
      //套红取消
    } else if (eventKey == "useTempletCancel") {
      odocWin.useTempletCancel();
      //odocWin.reloadFormMenu();
      //保存
    } else if (eventKey == "saveTHTemplateNoConfirm") {
      if (onclickParam != undefined && onclickParam.length == 1) {
        odocWin.onSave(onclickParam[0]);
        setWebOfficeSaved();
        setWebOffice2015Saved();
      } else {
        if (window.console) console.log("saveTHTemplateNoConfirm " + ecCom.WeaLocaleProvider.getLabel(503024, '方法参数个数不正确'));
      }
      //打印
    } else if (eventKey == "printDoc") {
      odocWin.printDoc();
      //odocWin.OnMenuClick(47);
    } else if (eventKey == "fullScreen") {//全屏查看
      odocWin.fullScreen();
    } else if (eventKey == "uploadPDF") {
      this.clickAddOdoc(false, true, '', 12);
    } else if (eventKey == "replacePDF") {
      odocWin.uploadPDF();
    } else if (eventKey == "uploadOFD") {
      this.clickAddOdoc(false, true, '', 13);
    } else if (eventKey == "replacePDF" || eventKey == "replaceOFD") {
      odocWin.uploadPDF();
    } else if (eventKey == "download") {
      odocWin.filedownload();
    } else if (eventKey == "openLocalFile") { //打开本地文件
      if ((docInfo.wpsEditor || docInfo.yozoEditor) && !docInfo.docParam.isIwebOfficeNodes) { //使用wps无插件 且 非插件编辑节点
        var suffix = "docx,doc";
        if (docInfo.extendName && docInfo.extendName != "") {
          if (docInfo.extendName == ".wps") {
            suffix = "wps";
          }
          oDocUtil.uploadDocFile(suffix);
        }
      } else {
        odocWin.OnMenuClick(1);
      }
    } else if (eventKey == "openversionList") {
      odocWin.openversionfiles();
    } else if (eventKey == "onEditDoc") {
      odocWin.onEditDoc();
    } else if (eventKey == "printMould") {
      odocWin.getWorkFlowPrint();
    } else if (eventKey == "templatePreview") {//套红预览
      // odocWin.templatePreview();
      oDocUtil.selectTemplate(false, 1);
    } else if (eventKey == "odocSupervision") {//公文转督办
      odocWin.odocSupervision();
    } else if (eventKey == "openVersion") {
      //国产环境打开版本
      odocWin.openversionfiles();
    } else if (eventKey == "compareText") {//文档比对
      odocWin.compareText();
    } else if (eventKey == "reTextToModel") {//正文另存为范文
      oDocUtil.showSaveAsModelDialog();
    } else if (eventKey == "odocNumber") {//公文编号
      showOrHideWeboffice(0);
      OdocRightBtn.odocNumber()
    }else if(eventKey == "smartOfficial"){
      odocWin.toSmartOfficial();
    } else if(eventKey == "querenSmartOfficial"){
      odocWin.querenSmartOfficial();
    } else if(eventKey == "cancelSmartOfficial"){
      odocWin.cancelSmartOfficial();
    } else if(eventKey == "saveTemplate"){
      odocWin.saveTemplate();
    } else if(eventKey == "unTemplate"){
      odocWin.unTemplate();
    } else if(eventKey == "saveEditTemplate"){
      odocWin.saveEditTemplate();
    } else if(eventKey == "downloadForEdit"){
      odocWin.filedownload();
    } else if(eventKey == "uploadEditFile"){
      oDocUtil.uploadDocFile("docx");
    } else if(eventKey == "replaceZW4Th"){
      oDocUtil.uploadDocFile("doc,docx");
    }

  },
  setFieldValue: function (fieldid, value, namefieldid) {
    if (namefieldid == "-3") namefieldid = -1;
    WfForm.changeFieldValue("field" + fieldid, {
      value: value,
      specialobj: [
        { id: "" + value, name: WfForm.getFieldValue("field" + namefieldid) }
      ]
    });
  },
  getOfdSignatureCount: function () {
    var retValue = false;
    jQuery.ajax({
      type: "POST",
      url: (window.ecologyContentPath || "") + "/odoc/docs/odocCommonAjax.jsp",
      data: {
        requestid: jQuery("#requestid").val(),
        nodeid: jQuery('#nodeid').val(),
        action: "getGinatureCount",
      },
      async: false,
      cache: false,
      dataType: 'json',
      success: function (returndata) {
        if (returndata.success && returndata.singCount > 0) {
          retValue = true;
        }
      }
    });
    return retValue;
  },

  //打印流程表单数据方法
  getFormWorkFlowPrint: function (nodeid, workflowid, requestid, printMouldid, isIE, requestname, officeType) {
    try {
      if (!isIE){
          var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
          isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
      }
    } catch (e) { }
    //处理标题特殊符号拼接URL地址
    var printRequestname = encodeURIComponent(requestname);
    var win = window.open((window.ecologyContentPath || "") + "/spa/odoc/static/index.html#/main/offical/odocPrintMould?selectValue=" + nodeid + "&workflowid=" + workflowid + "&requestid=" + requestid + "&isIE=" + isIE + "&officeType=" + officeType + "&printMouldid=" + printMouldid + "&requestName=" + printRequestname + "", requestid);
  },

  renderDialog: function (hideBtn, docid, odocfileType, clickType) {
    var uploadComponent = document.createElement("div");
    uploadComponent.setAttribute("id", "uploadComponent");
    // if (hideBtn) {
    //   uploadComponent.setAttribute("docid", docid);
    //   uploadComponent.setAttribute("odocfileType", odocfileType);
    // } else {
    //   uploadComponent.setAttribute("showBtn", "true");
    // }
    // uploadComponent.setAttribute("clickType", clickType);
    document.body.appendChild(uploadComponent);
    var UploadFileComp = weaOdoc.components.uploadFileComp;
    ReactDOM.render(
      React.cloneElement(UploadFileComp, {
        showBtn: !hideBtn,
        odocfileType: odocfileType,
        clickType: clickType,
        ecId: 'odoc_uploadOdoc'
      }),
      document.getElementById("uploadComponent")
    )
  },

  //替换范文方法
  openModelRepText: function (docid, docimagefileid, versionid, extendName) {
    var docInfo = WfForm.getOdocConfig();
    var odocWin = jQuery(".req-workflow-odoc")[0].contentWindow;
    if (docInfo.docParam.isTextInForm && docInfo.docParam.isTextInFormCanEdit) {
      if (docInfo.docParam.isColumnShow == '1') {
        odocWin = jQuery(".wf-req-form-odoc-iframe")[0].contentWindow;
      } else {
        odocWin = jQuery("#requestdocInForm")[0].contentWindow;
      }
    }
    showOrHideWeboffice(1);
    return odocWin.odocModelRepText(docid, docimagefileid, versionid, extendName);
  },

  showSaveAsModelDialog: function () {
    showOrHideWeboffice(0);
    var saveAsModelCom = document.createElement("div");
    saveAsModelCom.setAttribute("id", "saveAsModelCom");
    document.body.appendChild(saveAsModelCom);
    var SaveAsModelCom = weaOdoc.components.saveAsModelCom;
    ReactDOM.render(
      SaveAsModelCom,
      document.getElementById("saveAsModelCom")
    )
  },

  //获取敏感词列表
  getTempSendWordsDatas: function () {
    var docInfo = WfForm.getOdocConfig().docParam;
    var odocWin = jQuery(".req-workflow-odoc")[0].contentWindow;
    if (docInfo.isTextInForm && docInfo.isTextInFormCanEdit) {
      if (docInfo.isColumnShow == '1') {
        odocWin = jQuery(".wf-req-form-odoc-iframe")[0].contentWindow;
      } else {
        odocWin = jQuery("#requestdocInForm")[0].contentWindow;
      }
    }else if (WfForm.getGlobalStore().tabKey != 'odoc'){
      return;
    }
    if (docInfo.wpsEditor && !docInfo.isIwebOfficeNodes) {
      odocWin.getTempSendWordImagIdData('sendWordsList');
    } else {
      var datas = odocWin.getTempSendWordImagIdData();
      if (weaOdoc) {
        weaOdoc.store.odocModelAndSensitiveStore.getSenWordsList(datas);
      }
    }
  },
  //调用前端方法渲染敏感词列表
  getWpsEditorDatas: function (datas) {
    if (weaOdoc) {
      weaOdoc.store.odocModelAndSensitiveStore.getSenWordsList(datas);
    }
  },
  //流程提交调用保存方法时校验敏感词
  submitWorkToSave: function () {
    try {
      var docInfo = WfForm.getOdocConfig();
      docInfo.docParam.skipCheckDocSaved = false;
      try {
        jQuery(".req-workflow-odoc")[0].contentWindow.onSave("submit");
      } catch (e) { }
      try {
        setWebOfficeSaved();
      } catch (e1) { }
      try {
        setWebOffice2015Saved();
      } catch (e1) { }
      try {
        document.getElementsByClassName("req-workflow-odoc")[0].style.width = "1px";
        showOrHideWeboffice(0);
      } catch (e) { }
      wfform.doRightBtnEvent(workEventKey);
    } catch (e) {
      if (window.console) {
        window.console.log("---" + e);
      }
      return;
    }
  }
}


doctopdfandsubmitReturn = function (returnvalue, pdfDocId, DecryptpdfDocId) {
  var docInfonew = WfForm.getOdocConfig();
  if (!docInfonew.TexttoPDF) return;
  if (returnvalue == 1 && docInfonew.TexttoPDF != null && docInfonew.TexttoPDF.isTexttoPDF === "1" && docInfonew.TexttoPDF.operationtype === 1) {
    var titleField = docInfonew.TexttoPDF.documentTitleField;
    if (titleField == -3) {
      titleField == -1
    }
    //将生成的PDF字段赋值给表单字段
    if (pdfDocId > 0) {
      oDocUtil.setFieldValue(docInfonew.TexttoPDF.pdffieldid, pdfDocId, titleField);
    }
    if (DecryptpdfDocId > 0) {
      oDocUtil.setFieldValue(docInfonew.TexttoPDF.decryptpdffieldid, DecryptpdfDocId, titleField);
    }
    //转换失败后，不再执行转PDF的动作
    docInfonew.TexttoPDF = null;
    WfForm.changeOdocConfig(docInfonew);
    WfForm.doSubmit();
  } else {
      if(0==docInfonew.docParam.systemType){
          //Label125968
          if (confirm(ecCom.WeaLocaleProvider.getLabel(125968, '正文转PDF异常，是否依然提交流程？'))) {
              docInfonew.TexttoPDF = null;
              WfForm.changeOdocConfig(docInfonew);
              WfForm.doSubmit();
          } else {
              return;
          }
      }else{
          docInfonew.TexttoPDF = null;
          WfForm.changeOdocConfig(docInfonew);
          WfForm.doSubmit();
      }
  }
}

//套红确认后，回调方法
function afterTempEditButton (onclickParam, type) {
  var docInfo = WfForm.getOdocConfig();
  var odocWin = jQuery(".req-workflow-odoc")[0].contentWindow;
  if (docInfo.docParam.isTextInForm && docInfo.docParam.isTextInFormCanEdit) {
    if (docInfo.docParam.isColumnShow == '1') {
      odocWin = jQuery(".wf-req-form-odoc-iframe")[0].contentWindow;
    } else {
      odocWin = jQuery("#requestdocInForm")[0].contentWindow;
    }
  }
  odocWin.saveTHTemplate(onclickParam[0], type);
  odocWin.afterTempleteEditButton(true);
  setWebOfficeSaved();
  setWebOffice2015Saved();
}

//封装未保存正文时提示信息的方法
function isSaveText (callback) {
  var docInfo = WfForm.getOdocConfig();
  try {
    if (!usePreview() && (jQuery(".req-workflow-odoc")[0] && jQuery(".req-workflow-odoc")[0].contentDocument
      && jQuery(".req-workflow-odoc")[0].contentDocument.getElementById("webOffice") && jQuery(".req-workflow-odoc")[0].contentDocument.getElementById("webOffice").contentDocument
      && ((jQuery(".req-workflow-odoc")[0].contentDocument.getElementById("webOffice").contentDocument.getElementById("WebOffice")
        && jQuery(".req-workflow-odoc")[0].contentDocument.getElementById("webOffice").contentDocument.getElementById("WebOffice").modify)
        || getWebOffice2015IsModify() == "true")
      && ((jQuery("#requestdocInForm").length > 0 && docInfo.docParam.isTextInFormCanEdit) ? ((jQuery("#requestdocInForm")[0].contentDocument.getElementById("webOffice").contentDocument.getElementById("WebOffice")
        && jQuery("#req-workflow-odoc")[0].contentDocument.getElementById("webOffice").contentDocument.getElementById("WebOffice").modify)
        || getWebOffice2015IsModifyInForm() == "true") : true)) && (typeof (docInfo.docParam.skipCheckDocSaved) == 'undefined' || !docInfo.docParam.skipCheckDocSaved)
    ) {
      if (window.confirm(ecCom.WeaLocaleProvider.getLabel(19006, '文档还没保存，真的要离开吗？'))) {
        callback();
      } else {
        WfForm.switchTab('odoc');
        showOrHideWeboffice(1);
        return;
      }
    } else {
      callback();
    }
  } catch (e) {
    callback();
  }
}

//签入正文
function odocCheckIn () {
  var docInfo = WfForm.getOdocConfig();
  //保存流程时，若正文被当前操作者签出，则签入正文
  if (docInfo.docParam.id > 0) {
    jQuery.post((window.ecologyContentPath || "") + "/odoc/odoc/iWebOfficeOperation.jsp", { id: docInfo.docParam.id, operation: 'docCheckIn' }, function (data) { });
  }
}

//正文转PFD
function odocTextToPDF () {
  var docInfo = WfForm.getOdocConfig();
  var retFlag = true;
  if (docInfo.docParam.docfiletype == 12 && docInfo.TexttoPDF != null && docInfo.TexttoPDF.isTexttoPDF === "1" && docInfo.TexttoPDF.operationtype === 1 && docInfo.docParam.docid > 0) {
    jQuery.ajax({
      type: "GET",
      url: (window.ecologyContentPath || "") + "/odoc/docs/odocCommonAjax.jsp?date=" + new Date().getTime(),
      data: {
        workflowid: docInfo.TexttoPDF.workflowid,
        docid: docInfo.docParam.docid,
        requestid: docInfo.TexttoPDF.requestid,
        nodeid: docInfo.TexttoPDF.nodeid,
        fromFlowDocsubmit: 1,
        action: "updateDocToPdf"
      },
      async: false,
      cache: false,
      dataType: 'json',
      success: function (returndata) {
        retFlag = returndata.success;
        if (window.console)
          console.log("===returndata.fieldValue:" + returndata.fieldValue + "===returndata.PdfName:" + returndata.PdfName);
        if (retFlag) {
          WfForm.changeFieldValue("field" + returndata.fieldId, {
            value: returndata.fieldValue,
            specialobj: [
              { id: "" + returndata.fieldValue, name: returndata.PdfName }
            ]
          });
        } else {
          if (confirm(ecCom.WeaLocaleProvider.getLabel(125968, '正文转PDF异常，是否依然提交流程？'))) {
            retFlag = true;
          } else {
            retFlag = false;
          }
        }
      }
    });
  }
  return retFlag;
}

function odocregisterCheckEvent () {

  //Label23043

  var docInfo = WfForm.getOdocConfig();
  var __onbeforeunload = window.onbeforeunload;
  var isSignatureNodes = docInfo.docParam.isSignatureNodes;
  var isUseTempletNode = docInfo.docParam.isUseTempletNode;
  var senWordsdoType = docInfo.docParam.senWordsdoType;//正文中存在敏感词处理方式：1 不处理 2 弱控：有提示但允许提交流程 3 强控：有提示且不允许提交流程
  window.onbeforeunload = function (e) {
    //关闭页面时正文保存确认
    try {
      if (!usePreview() && jQuery(".req-workflow-odoc")[0] && jQuery(".req-workflow-odoc")[0].contentDocument
        && jQuery(".req-workflow-odoc")[0].contentDocument.getElementById("webOffice") && jQuery(".req-workflow-odoc")[0].contentDocument.getElementById("webOffice").contentDocument
        && ((jQuery(".req-workflow-odoc")[0].contentDocument.getElementById("webOffice").contentDocument.getElementById("WebOffice")
          && jQuery(".req-workflow-odoc")[0].contentDocument.getElementById("webOffice").contentDocument.getElementById("WebOffice").modify)
          || getWebOffice2015IsModify() == "true")
        && ((jQuery("#requestdocInForm").length > 0 && docInfo.docParam.isTextInFormCanEdit) ? ((jQuery("#requestdocInForm")[0].contentDocument.getElementById("webOffice").contentDocument.getElementById("WebOffice")
          && jQuery("#req-workflow-odoc")[0].contentDocument.getElementById("webOffice").contentDocument.getElementById("WebOffice").modify)
          || getWebOffice2015IsModifyInForm() == "true") : true)
      ) {
        return ecCom.WeaLocaleProvider.getLabel(19006, '文档还没保存，真的要离开吗？');
      } else {
        return __onbeforeunload(e);
      }
    } catch (e) {

    }
  }
  if (docInfo != null && docInfo.docFlag) {
    //意见征询		
    WfForm.registerCheckEvent(WfForm.OPER_ASKOPINION, function (callback) {

      if (docInfo.docParam && docInfo.docParam.isEdit == 1 && (docInfo.docParam.isTextInForm || docInfo.docParam.isColumnShow == '1') && docInfo.docParam.isTextInFormCanEdit && oDocUtil.onlySave != '1' && (docInfo.docParam.onEditDoc || docInfo.docParam.useyozoorwps == '0')) {
        if (WfForm.getOdocConfig().docParam.senWordsdoType > 1) {
          workEventKey = callback;
          sendWordsInForm("form_save", 4);
        } else {
		  try{
			  var win;
			  if (WfForm.getOdocConfig().docParam.isColumnShow == '1') {
				win = jQuery(".wf-req-form-odoc-iframe")[0].contentWindow;
			  } else {
				win = jQuery("#requestdocInForm")[0].contentWindow;
			  }
			  if(win.saveBackForm) win.saveBackForm = false;
		  }catch(e2){}
          odocCheckIn();
          onSaveInForm('inForm');
          isSaveText(callback);
        }
      } else {
        odocCheckIn();
        isSaveText(callback);
      }

    });
    //批注
    WfForm.registerCheckEvent(WfForm.OPER_REMARK, function (callback) {

      try {
        if (docInfo.docParam && docInfo.docParam.isEdit == 1 && (docInfo.docParam.isTextInForm || docInfo.docParam.isColumnShow == '1') && docInfo.docParam.isTextInFormCanEdit && oDocUtil.onlySave != '1' && (docInfo.docParam.onEditDoc || docInfo.docParam.useyozoorwps == '0')) {
          if (WfForm.getOdocConfig().docParam.senWordsdoType > 1) {
            workEventKey = callback;
            sendWordsInForm("form_save", 4);
          } else {
            onSaveInForm('inForm');
            isSaveText(callback);
          }
        } else {
          isSaveText(callback);
        }
      } catch (e) {
        callback();
      }

    });
    WfForm.registerCheckEvent(WfForm.OPER_REJECT, function (callback) {
      //退回流程时，若正文被当前操作者签出，则签入正文
      if (docInfo.docParam && docInfo.docParam.isEdit == 1 && (docInfo.docParam.isTextInForm || docInfo.docParam.isColumnShow == '1') && docInfo.docParam.isTextInFormCanEdit && oDocUtil.onlySave != '1' && (docInfo.docParam.onEditDoc || docInfo.docParam.useyozoorwps == '0')) {
        if (WfForm.getOdocConfig().docParam.senWordsdoType > 1) {
          workEventKey = callback;
          sendWordsInForm("form_save", 4);
        } else {
          odocCheckIn();
          onSaveInForm('inForm');
          isSaveText(callback);
        }
      } else {
        odocCheckIn();
        isSaveText(callback);
      }

    });
    //  保存流程时提示保存正文
    WfForm.registerCheckEvent(WfForm.OPER_SAVE, function (callback) {
      if (WfForm.getOdocConfig().openWpsJSAPI && beforeWpsOnlineEdit.odoc_isOpenWpsJsApi) {
        if (confirm('是否保存wps内的文件后在提交!')) {
          return false;
        }
      }

      if (docInfo.docParam && docInfo.docParam.isEdit == 1 && (docInfo.docParam.isTextInForm || docInfo.docParam.isColumnShow == '1') && docInfo.docParam.isTextInFormCanEdit && oDocUtil.onlySave != '1' && (docInfo.docParam.onEditDoc || docInfo.docParam.useyozoorwps == '0')) {
        if (WfForm.getOdocConfig().docParam.senWordsdoType > 1) {
          workEventKey = callback;
          sendWordsInForm("form_save", 4);
        } else {
          odocCheckIn();
          onSaveInForm('inForm');
          isSaveText(callback);
        }
      } else {
        odocCheckIn();
        isSaveText(callback);
      }

    });
    //提交流程时提示保存正文
    WfForm.registerCheckEvent(WfForm.OPER_SUBMIT, function (callback) {

      window.addEventListener('beforeunload', function () {
        if (window.opener && window.opener.isOdocOpenWF) {
          window.opener.getOdocWFList();
        }
      })

      var retFlag = true;
      if (docInfo == null || docInfo.docParam == null) {
        callback();
      }
      if (window.beforeWpsOnlineEdit && window.beforeWpsOnlineEdit.odoc_isOpenWpsJsApi) {
        if (confirm('是否保存wps内的文件后在提交!')) {
          return false
        }
      }
      if (docInfo.docParam && docInfo.docParam.isUseTempletNode && docInfo.docParam.hasUsedTemplet != "1" && needTip(docInfo.docParam.docfiletype) && docInfo.docParam.docid > 0) {
        hideNextFlowPage();
        //Label21252
        antd.message.error(ecCom.WeaLocaleProvider.getLabel(21252, '请先执行套红操作！'));
        if (!(docInfo.docParam.isTextInFormCanEdit && (docInfo.docParam.isTextInForm || docInfo.docParam.isColumnShow == '1'))) {
          WfForm.switchTab("odoc");
        }
        retFlag = false;
        return false;
      }
      if (docInfo.docParam.isMustSignatureNodes && !docInfo.docParam.qysSignNode && !oDocUtil.getOfdSignatureCount() && !docInfo.docParam.hasSignatureSucceed && (needTip(docInfo.docParam.docfiletype) || docInfo.docParam.isQysPdfSingleSign) && docInfo.docParam.docid > 0) {
        hideNextFlowPage();
        antd.message.error(ecCom.WeaLocaleProvider.getLabel(130844, '该节点为签章节点，请先签章，再提交！'));
        retFlag = false;
        return false;
      }
      //Label23043
      if (docInfo.docParam.isSignatureNodes && !docInfo.docParam.qysSignNode && !oDocUtil.getOfdSignatureCount() && !docInfo.docParam.hasSignatureSucceed && (needTip(docInfo.docParam.docfiletype) || docInfo.docParam.isQysPdfSingleSign) && docInfo.docParam.docid > 0) {
        showOrHideWeboffice(0);
        var res = !window.confirm(ecCom.WeaLocaleProvider.getLabel(23043, '该节点为签章节点，您未执行签章操作，是否确定提交？'))
        if (res) {
          setTimeout(function () {
            showOrHideWeboffice(1);
            WfForm.switchTab('odoc');
          })
          retFlag = false;
          return false;
        }
      }
      if (!docInfo.docParam.openyozo && !docInfo.docParam.openWpsToPdf && needTip(docInfo.docParam.docfiletype) && docInfo.TexttoPDF != null && docInfo.TexttoPDF.isTexttoPDF === "1" && docInfo.TexttoPDF.operationtype === 1 && docInfo.docParam.docid > 0) {
        //WfForm.doLoading(true);
        if(0==docInfo.docParam.systemType){
            var savePdfIframe = document.createElement('iframe');
            savePdfIframe.id = "savePdfIframe";
            savePdfIframe.name = "savePdfIframe";
            savePdfIframe.style.display = "block";
            savePdfIframe.style.width = "1px";
            savePdfIframe.style.height = "1px";
            document.getElementById("container").appendChild(savePdfIframe);
            if (docInfo.office2015 === "1") {
                savePdfIframe.src = (window.ecologyContentPath || "") + "/odoc/odoc/weboffice2015/OfficeToPDF.jsp?id=" + docInfo.docParam.docid + "&requestid=" + docInfo.TexttoPDF.requestid + "&workflowid=" + docInfo.TexttoPDF.workflowid + "&nodeid=" + docInfo.TexttoPDF.nodeid + "&fromFlowDocsubmit=1";
            } else {
                savePdfIframe.src = (window.ecologyContentPath || "") + "/odoc/odoc/OfficeToPDF.jsp?docid=" + docInfo.docParam.docid + "&workflowid=" + docInfo.TexttoPDF.workflowid + "&requestid=" + docInfo.TexttoPDF.requestid + "&nodeid=" + docInfo.TexttoPDF.nodeid + "&fromFlowDocsubmit=1";
            }
            retFlag = false;
            return false;
        }
      }

      if (docInfo.docParam && docInfo.docParam.isEdit == 1 && (docInfo.docParam.onEditDoc || docInfo.docParam.useyozoorwps == '0')) {
        if (!usePreview() && (jQuery(".req-workflow-odoc")[0] && jQuery(".req-workflow-odoc")[0].contentDocument
            && jQuery(".req-workflow-odoc")[0].contentDocument.getElementById("webOffice") && jQuery(".req-workflow-odoc")[0].contentDocument.getElementById("webOffice").contentDocument
            && ((jQuery(".req-workflow-odoc")[0].contentDocument.getElementById("webOffice").contentDocument.getElementById("WebOffice")
                && jQuery(".req-workflow-odoc")[0].contentDocument.getElementById("webOffice").contentDocument.getElementById("WebOffice").modify)
                || getWebOffice2015IsModify() == "true")) && (typeof (docInfo.docParam.skipCheckDocSaved) == 'undefined' || !docInfo.docParam.skipCheckDocSaved)
        ) {
            if (!window.confirm(ecCom.WeaLocaleProvider.getLabel(19006, '文档还没保存，真的要离开吗？'))) {
                WfForm.switchTab('odoc');
                showOrHideWeboffice(1);
                retFlag = false;
                return false;
            }
        }
      }

      if (docInfo.docParam && docInfo.docParam.isEdit == 1 && (docInfo.docParam.isTextInForm || docInfo.docParam.isColumnShow == '1') && docInfo.docParam.isTextInFormCanEdit && oDocUtil.onlySave != '1' && (docInfo.docParam.onEditDoc || docInfo.docParam.useyozoorwps == '0')) {
        if (WfForm.getOdocConfig().docParam.senWordsdoType > 1) {//判断敏感词
          workEventKey = callback;
          sendWordsInForm("form_Submit", 5);
        } else {
          odocCheckIn();
          onSaveInForm('inForm');
          retFlag = odocTextToPDF();
          if (retFlag) callback(); //继续提交需调用callback，不调用代表阻断
        }
      } else {
        odocCheckIn();
        retFlag = odocTextToPDF();
        if (retFlag) callback(); //继续提交需调用callback，不调用代表阻断
      }

    });


    WfForm.bindFieldChangeEvent('field' + wfform.getOdocConfig().docFieldId, function (obj, id, value) {
      try {
        if (value === '' && value != wfform.getOdocConfig().docParam.docid) {
          window.setTimeout(function () {
            var nodeType = wfform.getOdocConfig().docParam.nodeType;
            if ((wfform.getOdocConfig().docParam.docid > -1 && nodeType == '0') || nodeType != '0') {
              var namefieldid = wfform.getOdocConfig().docParam.documentTitleField;
              if (namefieldid == "-3") namefieldid = -1;
              WfForm.changeFieldValue(id, {
                value: wfform.getOdocConfig().docParam.docid,
                specialobj: [
                  { id: "" + wfform.getOdocConfig().docParam.docid, name: WfForm.getFieldValue("field" + namefieldid) }
                ]
              });
            }
          }, 0);
        }
      } catch (e) {
        if (window.console) console.log("docUtil_e9,bindFieldChangeEvent exception:", e);
      }

    })
  }

}
window.onWeaDialogOpen = function () {
  setTimeout(function () {
    var tabKey = WfForm.getGlobalStore().tabKey;
    var docInfo = WfForm.getOdocConfig();
    if ("form" == tabKey) {
      if (docInfo.docParam && docInfo.docParam.isTextInFormCanEdit) {
        showOrHideTextInForm(true);
      }
    } else if ("odoc" == tabKey) {
      showOrHideTextInForm(true);
    }
  }, 100);


};
window.onWeaDialogClose = function () {
  var count = 0;
  for (var i = 0; i < jQuery(".ant-modal .ant-modal-content").length; i++) {
    if (jQuery(jQuery(".ant-modal .ant-modal-content")[i]).css("visibility") == 'visible') { count++; }
  }
  //取dialog显示的情况做判断，如果展示的dialog的数量大于1，那就不调用展示控件的逻辑
  if (count <= 1) {
    var tabKey = WfForm.getGlobalStore().tabKey;
    var docInfo = WfForm.getOdocConfig();
    if ("form" == tabKey) {
      if (docInfo.docParam && docInfo.docParam.isTextInFormCanEdit) {
        showOrHideTextInForm(false);
      }
    } else if ("odoc" == tabKey) {
      showOrHideTextInForm(false);
    }
  }
  if ("odoc" == tabKey) {
    showOrHideWeboffice(1);
  }
};

function needTip (docfiletype) {
  if (docfiletype == 12 || docfiletype == 1 || docfiletype == 13) {//pdf正文或者html正文或者OFD正文
    return false;
  } else {
    return true;
  }
}


function usePreview () {
  var odocWin;
  if (jQuery(".req-workflow-odoc").length > 0) {
    odocWin = jQuery(".req-workflow-odoc")[0].contentWindow;
  }
  try {
    return odocWin.usePreview();
  } catch (e) {
    return false;
  }
}

function showOrHideTextInForm (isHide) {
  try {
    var docInfonew = WfForm.getOdocConfig();
    var office2015 = docInfonew.office2015;
    var wpsEditor = docInfonew.wpsEditor;
    var yozoEditor = docInfonew.yozoEditor;
    var docfiletype = docInfonew.docParam.docfiletype;
    var iWebPDF2018 = docInfonew.docParam.iWebPDF2018;
    var iWebPDF = docInfonew.docParam.iWebPDF;
    var agent = navigator.userAgent.toLowerCase();
    var isWindows = agent.indexOf("windows") >= 0;
    if ((wpsEditor != true && yozoEditor != true && (((office2015 == '1' && isWindows) || (!isWindows)) && (docfiletype == '3' || docfiletype == '6' || docfiletype == '7'))) ||
      ((iWebPDF2018 == true || iWebPDF == true) && docfiletype == '12')) {
		var tabKey = WfForm.getGlobalStore().tabKey;
	    if(tabKey=='odoc'){
			win = jQuery(".req-workflow-odoc");
		}else{
		  if (docInfonew.docParam.isTextInForm) {
			if (docInfonew.docParam.isColumnShow == '1') {
			  win = jQuery(".wf-req-form-odoc-iframe");
			} else {
			  win = jQuery("#requestdocInForm");
			}
		  } else {
			win = jQuery(".req-workflow-odoc");
		  }			
		}
      if (isHide) {
        win.css("width", "1");
        try {
          //Chrome
          win[0].contentWindow.getIwebOfficeObj().obj.HidePlugin(parseInt(0));
        } catch (e) {
        }
        try {
          //IE
          win[0].contentWindow.getIwebOfficeObj().obj.Hide(parseInt(0));
        } catch (e) {
        }
		
		try {
          jQuery(".wf-req-form-odoc-iframe")[0].contentDocument.getElementById("webOffice").style.width="1px";
        } catch (e) {
        }
      } else {
        if (oDocUtil.showOdocModelAndSensitivelList && docInfonew.docParam.isColumnShow == '1') {//正文显示在表单可编辑，且有范文敏感词列表，特殊处理插件宽度
          var formShowIframeWidth = jQuery(".wf-req-form-odoc").width();
          formShowIframeWidth = ((formShowIframeWidth - 51) / formShowIframeWidth) * 100 + "%";
          win.css("width", formShowIframeWidth);
        } else {
          win.css("width", "100%");
        }

        try {
          //Chrome
          win[0].contentWindow.getIwebOfficeObj().obj.HidePlugin(parseInt(1));
        } catch (e) {
        }
        try {
          //IE
          win[0].contentWindow.getIwebOfficeObj().obj.Hide(parseInt(1));
        } catch (e) {
        }
		
		try {
          jQuery(".wf-req-form-odoc-iframe")[0].contentDocument.getElementById("webOffice").style.width="100%";
        } catch (e) {
        }
      }
    }
  } catch (e) { }
}
function IEVersion () {
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
  var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
  var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
  if (isIE) {
    var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
    reIE.test(userAgent);
    var fIEVersion = parseFloat(RegExp["$1"]);
    if (fIEVersion == 7) {
      return 7;
    } else if (fIEVersion == 8) {
      return 8;
    } else if (fIEVersion == 9) {
      return 9;
    } else if (fIEVersion == 10) {
      return 10;
    } else {
      return 6;//IE版本<=7
    }
  } else if (isEdge) {
    return 'edge';//edge
  } else if (isIE11) {
    return 11; //IE11
  } else {
    return -1;//不是ie浏览器
  }
}
//仅供正文显示在表单功能调用，不适用于一文双屏
function setTextShowInForm () {
  var docInfonew = WfForm.getOdocConfig();
  var srcurl = WfForm.getOdocConfig().srcUrl;
  var docfiletype = docInfonew.docParam.docfiletype;
  var isEdit = docInfonew.docParam.isEdit;
  var url = "/odoc/odoc/index_odoc4formShow.jsp?";
  var isTextInForm = docInfonew.docParam.isTextInForm;
  var isColumnShow = docInfonew.docParam.isColumnShow;
  var isTextInFormCanEdit = docInfonew.docParam.isTextInFormCanEdit;
  //启用了一文双屏功能时，初始化页面参数，生成uuid
  if (isTextInFormCanEdit || isColumnShow == '1') {
    oDocUtil.setDocParamInForm();
      /*WfForm.getOdocConfig().srcUrl = getSecondPath(srcurl) + "&uuid=" + oDocUtil.uuid;*/
    //一文双屏且可编辑时,展示范文和敏感词列表,暂不考虑正文显示在表单不分栏
    // const docParam = docInfonew.docParam;
    // var showModelAndSensitive = (docParam.isEdit == '1' && (docParam.reTextToModel == '1' || docParam.textShowSenWords == '1')) ? true : false;
    // if (showModelAndSensitive && isColumnShow == '1') {
    //   jQuery(".wf-req-form-odoc-iframe").css({ width: 'calc(100% - 75px)' });
    //   jQuery(".wf-req-form-odoc").append("<div id='modelAndSensitiveDiv'></div>");
    //   jQuery("#modelAndSensitiveDiv").css({ position: 'absolute', top: 0, height: '100%', 'z-index': 999, });
    //   if (docParam.documentTextPosition == "r") {
    //     jQuery("#modelAndSensitiveDiv").css({ left: '15px' });
    //     jQuery(".wf-req-form-odoc-iframe").css({ "margin-left": "75px" });
    //   } else {
    //     jQuery("#modelAndSensitiveDiv").css({right: '15px' });
    //   }
    //   var odocModelAndSensitiveComponent = weaOdoc.components.odocModelAndSensitiveComponent;
    //   ReactDOM.render(
    //     odocModelAndSensitiveComponent,
    //     document.getElementById("modelAndSensitiveDiv")
    //   )
    // }
  }
  //没有开启正文显示在表单或者启用了一文双屏功能，或没有开启预览，则不将正文显示在表单
  if (!isTextInForm || isColumnShow == '1' || wfform.getGlobalStore().commonParam.isprint == '1') {
    return;
  }
  //正文显示在表单可编辑且一文双屏未启用 且文档类型是doc,docx,wps时
  if ((isTextInFormCanEdit && isColumnShow == '0') && (docfiletype == '3' || docfiletype == '7' || docfiletype == '6' || docfiletype == '12' || docfiletype == '13')) {
    var isSignatureNodes = docInfonew.docParam.isSignatureNodes;
    var isUseTempletNode = docInfonew.docParam.isUseTempletNode;
    //签章节点或者套红节点时置为可编辑状态，必定调用编辑页面
    if (isSignatureNodes || isUseTempletNode) {
      isEdit = '1';
    }
    //正文可编辑时跳转的页面都要有编辑按钮或者保存按钮
    if (isEdit == '1') {
      //非ie浏览器使用iweboffice2003预览的情况，调用预览页面,无编辑按钮
      //if(docInfonew.office2015!="1"&&!docInfonew.wpsEditor&&IEVersion()=="-1"&&docfiletype!="12"&&docfiletype!="13"){
      //正文不可编辑时直接跳预览页面无编辑按钮
      url = "/odoc/odoc/index_odoc4formShowContent.jsp?requestdocInForm=1&uuid=" + oDocUtil.uuid + "&";
      /*}else{
        //未启用预览功能，跳转控件或者无插件页面
        if(docInfonew.docParam.useyozoorwps!='1'){
          url = "/odoc/odoc/index_odoc_router.jsp?requestdocInForm=1&uuid="+oDocUtil.uuid+"&";
        }else{
          //就算启用了预览服务，套红和签章的节点也一定要跳转控件或者无插件页面
          if(isSignatureNodes || isUseTempletNode){
            url = "/odoc/odoc/index_odoc_router.jsp?requestdocInForm=1&uuid="+oDocUtil.uuid+"&";
          }else{//启用了预览服务，普通的节点且是可编辑的情况下，跳转带编辑按钮的预览页面
            url = "/odoc/odoc/index_odoc4formShowContent.jsp?requestdocInForm=1&uuid="+oDocUtil.uuid+"&";
          }
        }
      }*/
    } else {
      url = "/odoc/odoc/index_odoc4formShowContent.jsp?requestdocInForm=1&uuid=" + oDocUtil.uuid + "&";
    }
  }
  var count = 0;
  for (var key in docInfonew.docParam) {
    if (key == "router") continue;
    if (count > 0) url += "&";
    url += key + "=" + encodeURIComponent(docInfonew.docParam[key]);
    count++;
  }
  try {
    jQuery("#requestdocInForm")[0].contentWindow.onbeforeunload = null;
  } catch (e) {
  }
  if (window.console) console.log(jQuery("#field" + docInfonew.docParam.docFieldId));
  if (jQuery("#requestdocInForm").length <= 0) {
    if (jQuery("#ODocIframe").length <= 0) {
      jQuery("#field" + docInfonew.docParam.docFieldId).closest("tr").after("<tr><td colspan='100'><iframe id = requestdocInForm /></td></tr>");
    } else {
      try {
        jQuery("#ODocIframe").html("<iframe id = requestdocInForm />");
        jQuery("#ODocIframe").css("display", "");
        jQuery("#ODocIframe").parent().parent().css("display", "");
      } catch (e) {
      }
    }
  }
  url = srcurl;
  jQuery("#requestdocInForm").css("width", "100%");
  jQuery("#requestdocInForm").css("height", "650px");
  jQuery("#requestdocInForm").attr("src", getSecondPath(url));
  jQuery("#requestdocInForm").show();
}
function onSaveOnly (isSub) {
  oDocUtil.onlySave = '1';
  if (isSub) {
    window.WfForm.doSave();
  }
}
function onSaveInForm (key) {
  var docInfo = WfForm.getOdocConfig();
  var isSignatureNodes = docInfo.docParam.isSignatureNodes;
  var isUseTempletNode = docInfo.docParam.isUseTempletNode;
  try {
    var win;
    //签章节点不调用   签章节点同时是套红节点调用
    if (!isSignatureNodes || isUseTempletNode) {
      if (WfForm.getOdocConfig().docParam.isColumnShow == '1') {
        win = jQuery(".wf-req-form-odoc-iframe")[0].contentWindow;
      } else {
        win = jQuery("#requestdocInForm")[0].contentWindow;
      }
      win.onSave(key);
    }
  } catch (e) {

  }
}

//正文显示表单时，敏感词校验
function sendWordsInForm (key, type) {
  var docInfo = WfForm.getOdocConfig();
  var isSignatureNodes = docInfo.docParam.isSignatureNodes;
  var isUseTempletNode = docInfo.docParam.isUseTempletNode;
  try {
    var win;
    //签章节点不调用   签章节点同时是套红节点调用
    if (!isSignatureNodes || isUseTempletNode) {
      if (WfForm.getOdocConfig().docParam.isColumnShow == '1') {
        win = jQuery(".wf-req-form-odoc-iframe")[0].contentWindow;
      } else {
        win = jQuery("#requestdocInForm")[0].contentWindow;
      }
      if (docInfo.wpsEditor && !docInfo.isIwebOfficeNodes) {
        win.getTempSendWordImagIdData(key);
      } else {
        var datas = win.getTempSendWordImagIdData();
        win.checkSenWordsToSave(type, datas);
      };
    } else {
      isSaveText(workEventKey);
    }
  } catch (e) {

  }
}
//正文显示在表单保存流程时，敏感词确认保存时，回调方法
function onSavetextInForm (type) {
  odocCheckIn();
  onSaveInForm(type);
  isSaveText(workEventKey);
}
//正文显示在表单提交流程时，敏感词确认保存时，回调方法
function onSubmittextInForm (type) {
  odocCheckIn();
  onSaveInForm(type);
  var retFlag = odocTextToPDF();
  if (retFlag) workEventKey(); //继续提交需调用callback，不调用代表阻断
}


/** 获取iweboffice控件文档保存状态 */
function getWebOfficeIsModify () {
  var isModify = false;
  try {
    //2015
    if (jQuery(".req-workflow-odoc")[0].contentWindow.getIwebOfficeObj()
      && jQuery(".req-workflow-odoc")[0].contentWindow.getIwebOfficeObj().obj) {
      isModify = jQuery(".req-workflow-odoc")[0].contentWindow.getIwebOfficeObj().obj.IsModify(1);
    }
  } catch (e) { }
  try {
    //2003
    if (jQuery(".req-workflow-odoc")[0] && jQuery(".req-workflow-odoc")[0].contentDocument
      && jQuery(".req-workflow-odoc")[0].contentDocument.getElementById("webOffice") && jQuery(".req-workflow-odoc")[0].contentDocument.getElementById("webOffice").contentDocument
      && jQuery(".req-workflow-odoc")[0].contentDocument.getElementById("webOffice").contentDocument.getElementById("WebOffice")) {
      isModify = jQuery(".req-workflow-odoc")[0].contentDocument.getElementById("webOffice").contentDocument.getElementById("WebOffice").modify;
    }
  } catch (e) { }
  return isModify;
}
/**  隐藏、显示正文插件2015页面0隐藏1展示  **/
function showOrHideWebOffice2015 (type) {
  try {
    if (jQuery(".req-workflow-odoc")[0].contentWindow.getIwebOfficeObj()
      && jQuery(".req-workflow-odoc")[0].contentWindow.getIwebOfficeObj().obj) {
      try {
        //Chrome
        jQuery(".req-workflow-odoc")[0].contentWindow.getIwebOfficeObj().obj.HidePlugin(parseInt(type));
      } catch (e) {
      }
      try {
        //IE
        jQuery(".req-workflow-odoc")[0].contentWindow.getIwebOfficeObj().obj.Hide(parseInt(type));
      } catch (e) {
      }
    }
  } catch (e1) { }

  try {
    if (jQuery("#requestdocInForm")[0].contentWindow.getIwebOfficeObj()
      && jQuery("#requestdocInForm")[0].contentWindow.getIwebOfficeObj().obj) {
      try {
        //Chrome
        jQuery("#requestdocInForm")[0].contentWindow.getIwebOfficeObj().obj.HidePlugin(parseInt(type));
      } catch (e) {
      }
      try {
        //IE
        jQuery("#requestdocInForm")[0].contentWindow.getIwebOfficeObj().obj.Hide(parseInt(type));
      } catch (e) {
      }
    }
  } catch (e1) { }

  if (type === 1) {
    setTimeout(function () {
      try {
        jQuery(".req-workflow-odoc")[0].contentWindow.jQuery(".ant-tabs-tab-inner")[1].click();
      } catch (e) {
        try {
          jQuery(".wf-req-form-odoc-iframe")[0].contentWindow.jQuery(".ant-tabs-tab-inner")[1].click();
        } catch (e) {
            try {
                jQuery("#requestdocInForm")[0].contentWindow.jQuery(".ant-tabs-tab-inner")[1].click();
            } catch (e) { }
        }
      }
      try {
        jQuery(".req-workflow-odoc")[0].contentWindow.jQuery(".ant-tabs-tab-inner")[0].click();
      } catch (e) {
        try {
          jQuery(".wf-req-form-odoc-iframe")[0].contentWindow.jQuery(".ant-tabs-tab-inner")[0].click();
        } catch (e) {
            try {
                jQuery("#requestdocInForm")[0].contentWindow.jQuery(".ant-tabs-tab-inner")[0].click();
            } catch (e) { }
        }
      }
    }, 1);
  }
}

function showOrHideWeboffice (type) {
  if (type == "0") {
    var req_workflow_odoc = document.getElementsByClassName("req-workflow-odoc")
    if (req_workflow_odoc.length > 0) {
      req_workflow_odoc[0].style.width = "1px";
    }
    WfForm.getOdocConfig().needReload = false;
    //不展示插件时还原关闭浏览器时触发原有方法
    window.onbeforeunload=oDocUtil.wfBonbeforeunload;
  } else {
    var req_workflow_odoc = document.getElementsByClassName("req-workflow-odoc")
    if (req_workflow_odoc.length > 0) {
      var wrapperWidth = jQuery(".wf-req-odoc").width();
      if (wrapperWidth < 1275)
        wrapperWidth = 1275
      if (oDocUtil.showOdocModelAndSensitivelList) {//若加载范文列表，隐藏后显示插件时，需特殊处理插件宽度
        var OdocModelAndSensitivelListWidth = jQuery(".OdocModelAndSensitivelList").width();
        wrapperWidth -= OdocModelAndSensitivelListWidth;
        setTimeout(function () {
          var req_form_odoc_iframe = document.getElementsByClassName("wf-req-form-odoc-iframe");
          var formShowIframeWidth = jQuery(".wf-req-form-odoc").width();
          formShowIframeWidth = ((formShowIframeWidth - 51) / formShowIframeWidth) * 100 + "%";
          if (req_form_odoc_iframe.length > 0) {
            req_form_odoc_iframe[0].style.width = formShowIframeWidth;
          }
        }, 100);
      }
      req_workflow_odoc[0].style.width = wrapperWidth + "px";
    }
  }
  showOrHideWebOffice2015(type);
}

/**  隐藏、显示正文插件页面0隐藏1展示  delay 是否延迟加载，解决confirm情况同步执行**/
function showOrHideWeboffice (type, delay) {
  if (delay) {
    setTimeout(function () {
      excute(type)
    }, 0)
  } else {
    excute(type)
  }

  function excute (type) {
    var docInfo = WfForm.getOdocConfig();
    if (type == "0") {
      var req_workflow_odoc = document.getElementsByClassName("req-workflow-odoc");
      if (req_workflow_odoc.length > 0) {
        req_workflow_odoc[0].style.width = "1px";
      }
      if(docInfo.docParam.isTextInFormCanEdit && docInfo.docParam.isTextInForm && !docInfo.docParam.wpsEditor){
          if(docInfo.docParam.isColumnShow == "1"){
              jQuery(".wf-req-form-odoc-iframe").width('1px');
          }else{
              jQuery("#requestdocInForm").width('1px');
          }
      }
      WfForm.getOdocConfig().needReload = false;
      //不展示插件时还原关闭浏览器时触发原有方法
      window.onbeforeunload=oDocUtil.wfBonbeforeunload;
    } else {

      var req_workflow_odoc = document.getElementsByClassName("req-workflow-odoc");
      if (req_workflow_odoc.length > 0) {
          var wrapperWidth = jQuery(".wf-req-odoc").width();
          if (wrapperWidth < 1275)
              wrapperWidth = 1275;
          if (oDocUtil.showOdocModelAndSensitivelList) {//若加载范文列表，隐藏后显示插件时，需特殊处理插件宽度
              var OdocModelAndSensitivelListWidth = jQuery(".OdocModelAndSensitivelList").width();
              wrapperWidth -= OdocModelAndSensitivelListWidth;
              setTimeout(function () {
                  var req_form_odoc_iframe = document.getElementsByClassName("wf-req-form-odoc-iframe");
                  var formShowIframeWidth = jQuery(".wf-req-form-odoc").width();
                  formShowIframeWidth = ((formShowIframeWidth - 51) / formShowIframeWidth) * 100 + "%";
                  if (req_form_odoc_iframe.length > 0) {
                      req_form_odoc_iframe[0].style.width = formShowIframeWidth;
                  }
                  if (jQuery("#requestdocInForm")[0]) {
                      jQuery("#requestdocInForm").css("width", "100%");
                  }
              }, 100);
          }else {
              setTimeout(function () {
                  if(docInfo.docParam.isTextInFormCanEdit && docInfo.docParam.isTextInForm && !docInfo.docParam.wpsEditor){
                    if(docInfo.docParam.isColumnShow == "1"){
                        var req_form_odoc_iframe = document.getElementsByClassName("wf-req-form-odoc-iframe");
                        if (req_form_odoc_iframe.length > 0) {
                            req_form_odoc_iframe[0].style.width = "99%";
                        }
                    }else {
                        jQuery("#requestdocInForm").css("width", "100%");
                    }
                  }
              }, 100);
          }

          req_workflow_odoc[0].style.width = wrapperWidth + "px";
      }

    }
    showOrHideWebOffice2015(type);
  }

}

/** 保存后，更新插件变更状态 */
function setWebOfficeSaved () {

  if (jQuery(".req-workflow-odoc")[0] && jQuery(".req-workflow-odoc")[0].contentDocument
    && jQuery(".req-workflow-odoc")[0].contentDocument.getElementById("webOffice") && jQuery(".req-workflow-odoc")[0].contentDocument.getElementById("webOffice").contentDocument
    && jQuery(".req-workflow-odoc")[0].contentDocument.getElementById("webOffice").contentDocument.getElementById("WebOffice")) {
    jQuery(".req-workflow-odoc")[0].contentDocument.getElementById("webOffice").contentDocument.getElementById("WebOffice").modify = false;
  }
}

/** 2015插件保存后，更新插件变更状态 */
function setWebOffice2015Saved () {
  try {
    if (jQuery(".req-workflow-odoc")[0].contentWindow.getIwebOfficeObj()
      && jQuery(".req-workflow-odoc")[0].contentWindow.getIwebOfficeObj().obj) {
      jQuery(".req-workflow-odoc")[0].contentWindow.getIwebOfficeObj().obj.IsModify(0);
    }
  } catch (e) {

  }
}

/** 2015插件未保存提示 */
function getWebOffice2015IsModify () {
  var isModify = "false";
  try {
    if (jQuery(".req-workflow-odoc")[0].contentWindow.getIwebOfficeObj()
      && jQuery(".req-workflow-odoc")[0].contentWindow.getIwebOfficeObj().obj
      && jQuery(".req-workflow-odoc")[0].contentWindow.getIwebOfficeObj().obj.IsModify(1)) {
      isModify = "true";
    }
  } catch (e) {}

    try {
        isModify = jQuery(".req-workflow-odoc")[0].contentWindow.document.getElementById("webOffice").contentWindow.isChange();
    } catch (e) { }

    return isModify;
}

/** 保存后，更新插件变更状态 */
function setWebOfficeSavedInForm () {
  if (WfForm.getOdocConfig().docParam.isColumnShow == '1') {
    if (jQuery(".wf-req-form-odoc-iframe")[0] && jQuery(".wf-req-form-odoc-iframe")[0].contentDocument
      && jQuery(".wf-req-form-odoc-iframe")[0].contentDocument.getElementById("webOffice") && jQuery(".wf-req-form-odoc-iframe")[0].contentDocument.getElementById("webOffice").contentDocument
      && jQuery(".wf-req-form-odoc-iframe")[0].contentDocument.getElementById("webOffice").contentDocument.getElementById("WebOffice")) {
      jQuery(".wf-req-form-odoc-iframe")[0].contentDocument.getElementById("webOffice").contentDocument.getElementById("WebOffice").modify = false;
    }
  } else {
    if (jQuery("#requestdocInForm")[0] && jQuery("#requestdocInForm")[0].contentDocument
      && jQuery("#requestdocInForm")[0].contentDocument.getElementById("webOffice") && jQuery("#requestdocInForm")[0].contentDocument.getElementById("webOffice").contentDocument
      && jQuery("#requestdocInForm")[0].contentDocument.getElementById("webOffice").contentDocument.getElementById("WebOffice")) {
      jQuery("#requestdocInForm")[0].contentDocument.getElementById("webOffice").contentDocument.getElementById("WebOffice").modify = false;
    }
  }
}

/** 2015插件保存后，更新插件变更状态 */
function setWebOffice2015SavedInForm () {
  try {
    if (WfForm.getOdocConfig().docParam.isColumnShow == '1') {
      if (jQuery(".wf-req-form-odoc-iframe")[0].contentWindow.getIwebOfficeObj()
        && jQuery(".wf-req-form-odoc-iframe")[0].contentWindow.getIwebOfficeObj().obj) {
        jQuery(".wf-req-form-odoc-iframe")[0].contentWindow.getIwebOfficeObj().obj.IsModify(0);
      }
    } else {
      if (jQuery("#requestdocInForm")[0].contentWindow.getIwebOfficeObj()
        && jQuery("#requestdocInForm")[0].contentWindow.getIwebOfficeObj().obj) {
        jQuery("#requestdocInForm")[0].contentWindow.getIwebOfficeObj().obj.IsModify(0);
      }
    }
  } catch (e) {

  }
}

/** 2015插件未保存提示 */
function getWebOffice2015IsModifyInForm () {
  var isModify = "false";
  try {
    if (WfForm.getOdocConfig().docParam.isColumnShow == '1') {
      if (jQuery(".wf-req-form-odoc-iframe")[0].contentWindow.getIwebOfficeObj()
        && jQuery(".wf-req-form-odoc-iframe")[0].contentWindow.getIwebOfficeObj().obj
        && jQuery(".wf-req-form-odoc-iframe")[0].contentWindow.getIwebOfficeObj().obj.IsModify(1)) {
        isModify = "true";
      }
    } else {
      if (jQuery("#requestdocInForm")[0].contentWindow.getIwebOfficeObj()
        && jQuery("#requestdocInForm")[0].contentWindow.getIwebOfficeObj().obj
        && jQuery("#requestdocInForm")[0].contentWindow.getIwebOfficeObj().obj.IsModify(1)) {
        isModify = "true";
      }
    }
  } catch (e) {}
    try {
        isModify = jQuery(".req-workflow-odoc")[0].contentWindow.document.getElementById("webOffice").contentWindow.isChange();
    } catch (e) { }

    return isModify;
}

window.uploadLoacalFile = function (imagefileId, suffix) {
  if (imagefileId && imagefileId > 0) {
    var docInfo = WfForm.getOdocConfig();
    var isCompellentMark = docInfo.docParam.isCompellentMark;
	var workflowid = docInfo.docParam.workflowid;
    var isCancelCheck = docInfo.docParam.isCancelCheck;
    var isHideTheTraces = docInfo.docParam.isHideTheTraces;
    if ((docInfo.docParam.isStartNode && !docInfo.docParam.saveRevision) || docInfo.docParam.isUseTempletNode) {
      isCompellentMark = '0';
    }
    var odocIframeWin;
    try {
      odocIframeWin = getOdocIframeWindow();
    } catch (e) {
      odocIframeWin = jQuery(".req-workflow-odoc")[0].contentWindow;
    }
    //是否排版过
    var isSmarted = odocIframeWin.isSmarted();
    if(isSmarted == true){
      var hasTemplate = docInfo.docParam.hasUsedTemplet;
      if(docInfo.docParam.isUseTempletNode == true){
        hasTemplate = '1';
      }
      jQuery.ajax({
        url: (window.ecologyContentPath || '') + '/api/odoc/odocFile/saveAsNewVesion',
        type:'POST',
        data:{
            docId:docInfo.docParam.docid,
            imagefileId:imagefileId,
            suffix: suffix,
            hasTemplate: hasTemplate
        },
        dataType:'json',
        success: function(msg){
            if(msg.api_status == true){
              odocIframeWin.document.getElementById("webOffice").src = (window.ecologyContentPath || "") + "/odoc/odoc/index_odoc4formShow.jsp?id="+docInfo.docParam.docid+"&useYozoOrWpsShow=true";
            }else {
              if(window.console){
                window.console.log(msg.api_msg);
              }
            }
        }
      });
    }else if (docInfo.wpsEditor) {
      /*
       *上传文档不自动排版
      if (docInfo.docParam.autoSmartOfficial == true
          && docSupportedForSmartOfficial('.' + suffix)
      ) {
        jQuery.ajax({
          url: '/api/odoc/odocFile/smartOfficial',
          async: false,
          type: 'POST',
          dataType: 'json',
          data: {
			workflowId: workflowid,  
            imagefileId: imagefileId,
            extendName: '.' + suffix,
          },
          success: function (rtn) {
            if (rtn.status == true) {
              imagefileId = rtn.rtnImagefileId;
              suffix = rtn.extendName.substring(1)
            }
          }
        });
      }
      */
      odocIframeWin.document.getElementById("webOffice").src = (window.ecologyContentPath || "") + '/docs/e9/weboffice_wps.jsp?fromOdoc=1&mFileType=.' + suffix + '&fileid=' + imagefileId + '&isCompellentMark=' + isCompellentMark + '&isCancelCheck=' + isCancelCheck;
    } else if (docInfo.yozoEditor) {
      odocIframeWin.document.getElementById("webOffice").src = (window.ecologyContentPath || "") + '/docs/e9/weboffice.jsp?fromOdoc=1&mFileType=.' + suffix + '&fileid=' + imagefileId + '&isCompellentMark=' + isCompellentMark + '&isCancelCheck=' + isCancelCheck + '&isHideTheTraces=' + isHideTheTraces;
    }
    odocIframeWin.document.getElementById("extendName").value = '.' + suffix;
  }
}

//文件格式是否支持智能排版
function docSupportedForSmartOfficial(extendName){
  if(".docx" == extendName){
    return true;
  }else{
    return false;
  }
}

function getOdocIframeWindow () {
  var docInfo = WfForm.getOdocConfig();
  if (docInfo.docParam.isTextInFormCanEdit && docInfo.docParam.isTextInForm && docInfo.docParam.isColumnShow == '0') {
    return jQuery("#requestdocInForm")[0].contentWindow;
  } else if (docInfo.docParam.isTextInFormCanEdit && docInfo.docParam.isColumnShow == '1') {
    return jQuery(".wf-req-form-odoc-iframe")[0].contentWindow;
  } else {
    return jQuery(".req-workflow-odoc")[0].contentWindow;
  }

}

function hideNextFlowPage () {
  try {
    jQuery('.ant-message-notice').remove();
    wfform.getGlobalStore().controlDialogVisible('select_nextflow', false);
  } catch (e) { }
}

function getSecondPath (url) {
  var ecologyContentPath = window.ecologyContentPath || "";//二级路径
  if (ecologyContentPath != "" && url && url != "") {
    if (url.indexOf("/") == 0 && url.indexOf(ecologyContentPath) != 0) {
      url = ecologyContentPath + url;
    } else if (url.indexOf("http") == 0) {
      var origin = window.location.origin;
      if (!origin) {
        origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
      }
      if (url.indexOf(origin) == 0 && url.indexOf(origin + ecologyContentPath) != 0) {
        url = url.replace(origin, origin + ecologyContentPath);
      }
    }
  }
  return url;
}
var refreshFormText = false;
function reloadTextInForm(){
	try{
		if(refreshFormText){
		jQuery(".req-workflow-odoc")[0].contentWindow.reloadTextInForm();
		refreshFormText = false;
		}
	}catch(e){}
}
//放在最后  方便查找
$(function () {
  var timer = setInterval(function () {
    if (window.WfForm && window.WfForm.getOdocConfig().docFlag != null) {
      clearInterval(timer);
      if (WfForm.getOdocConfig().docFlag) {
        if (!window.weaOdoc) {
          window.eventRegister && window.eventRegister.loadModule('f_odoc',
            function () {
              if (window.console) console.log("公文模块加载成功");
            },
            function () {
              if (window.console) console.log("公文模块加载失败");
            }
          );
        }
      }
    }
  }, 2000)
});