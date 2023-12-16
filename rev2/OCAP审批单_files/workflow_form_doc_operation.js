var workflow_form_doc_operation = (function() {
	function create_kmdoc(json_params, cell_back) {
		var secid = json_params.secid ? json_params.secid : "";
		var wfid = json_params.wfid;
		// 根据是否有目录ID，判断是进文档新建页面，还是进目录选择页面

		window.__createDocFn = function(o){
			var fieldvalueobj  = WfForm.getFieldValueObj("field"+json_params.docfileid)||{};
			var old_docids  =  fieldvalueobj.value||'';
			var old_docspecialobj  = fieldvalueobj.specialobj||[];
			old_docspecialobj.push({id:o.docid,name:o.docSubject})
			var new_fieldvalueobj  = {
				value:old_docspecialobj.length > 0 ? old_docids+','+o.docid : o.docid,
				specialobj:old_docspecialobj
			};
			WfForm.changeFieldValue("field"+json_params.docfileid,new_fieldvalueobj);
			WfForm.recordNewDocid(o.docid);
		};

		//var _jsp = "DocAdd.jsp";
		//if(!isIE()) {
		//	_jsp = "DocAddForCK.jsp"
		//}
		
		//_jsp = "DocList.jsp";
		
		//openFullWindow("/docs/docs/" + _jsp + "?hasTab=1&_secid=" + secid + "&workflowid=" + wfid + "&isOpenNewWind=0");
		
		try{
			var secids = secid.split(",");
			secid = secids[secids.length - 1];
		}catch(e){}
		
		var otherParmas = "";
		//密级
		if(json_params._secretLevel){
			otherParmas += "&_secretLevel=" + json_params._secretLevel;
		}
		
		if(secid && secid>0){
			openFullWindow("/spa/document/index.jsp?secid=" + secid + "&isEdit=1&moudleFrom=workflow&workflowid=" + wfid + "&isOpenNewWind=0" + otherParmas);
		}else{
			openFullWindow("/spa/document/static/index.html#/main/document/add?openNewWindow=0&moudleFrom=workflow" + otherParmas);
		}
	}

	function show_kmdoc(json_params, cell_back) {
		var docid = json_params.docid;
		var requestid = json_params.requestid;
		openFullWindow("/spa/document/index.jsp?id=" + docid + (requestid && requestid != "" ? ("&isrequest=1&requestid=" + requestid) : ""));
	}

	function show_odoc(json_params, cell_back) {}

	function create_odoc(json_params, cell_back) {}

	function isIE() {
		return(document.all && window.ActiveXObject && !window.opera) ? true : false;
	}

	function openFullWindow(url) {
		var width = screen.availWidth - 10;
		var height = screen.availHeight - 50;
		var szFeatures = "top=0,";
		szFeatures += "left=0,";
		szFeatures += "width=" + width + ",";
		szFeatures += "height=" + height + ",";
		szFeatures += "directories=no,";
		szFeatures += "status=yes,toolbar=no,location=no,";
		szFeatures += "menubar=no,";
		szFeatures += "scrollbars=yes,";
		szFeatures += "resizable=yes";
		window.open(url, "", szFeatures);
	}

	return {
		showDoc: function(json_params, cell_back) {
			// 参数说明
			// json_params：{ wfid: , docid: , type: , ...:  }
			// cell_back：回调函数
			var type = json_params.type;
			// 如果是公文，调用公文函数
			if(type == 0) {
				show_odoc(json_params, cell_back);
			}
			// 如果是文档，调用文档函数
			else {
				show_kmdoc(json_params, cell_back);
			}
		},
		createDoc: function(json_params, cell_back) {
			// 参数说明
			// json_params：{ wfid: , secid: , type: , ...:  }
			// cell_back：回调函数
			var type = json_params.type;
			// 如果是公文，调用公文函数
			if(type == 0) {
				create_odoc(json_params, cell_back);
			}
			// 如果是文档，调用文档函数
			else {
				create_kmdoc(json_params, cell_back);
			}
		}
	}
})();