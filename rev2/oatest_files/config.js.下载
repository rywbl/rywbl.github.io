(function(){
  function success(result) {
    if (result.api_status && window.localStorage) {
      if (result._data) {
        var val = result._data;
        var oldEcodeStaticCacheVersion = window.localStorage['ecodeStaticCacheVersion'];
        var oldInitJs = window.localStorage['ecodeInitJs'];
        window.localStorage['ecodeStaticCacheVersion'] = result.fixedVersion;
        var key = 'ecode_params';
        if (typeof val === 'object') {
          try {
              window.localStorage[key] = JSON.stringify(val);
          }catch(e) {
              window.localStorage[key] = "";
          }
        } else {
          window.localStorage[key] = val;
        }
      }
      var oldEcodeBlockCode = window.localStorage['ecodeBlockCode'];
      window.localStorage['ecodeInitCss'] = result.initCss;
      window.localStorage['ecodeInitJs'] = result.initJs;
      window.localStorage['ecodeBlockCode'] = result.blockCode;
      window.localStorage["ecodeDefaultInitJs"] = result.defaultJs;
      if (oldEcodeStaticCacheVersion == '0' && result.fixedVersion != '0') { // ecode缓存首次禁用的时候自动刷新
        window.location.reload();           
      }
      if (result.initJs && oldInitJs !== result.initJs) {
        window.location.reload();
      }
      if(result.blockCode && (result.blockCode + "") != oldEcodeBlockCode) {
        window.location.reload();
      }
    }
  }
  if(!window.csInitIsLoad) {
    var ecologyContentPath = window.ecologyContentPath || '';
    var url = ecologyContentPath + '/api/ecode/sync';
    if(window.jQuery) {
      window.jQuery.ajax({
        url: url,
        dataType:'json',
        success:function(result) {
          success(result);
        }
      });
    } else { // 处理移动端h5页面调试时缓存不刷新的问题
      var fetchObj = {
        credentials: "include",
      };
      window.fetch && window.fetch(url, fetchObj).then(function(result){
        return result.json();
      }).then(function(data) {
        success(data)
      })
    }
    var tail = "";
    window.localStorage['ecodeStaticCache'] = window.location.search.indexOf('initCache') >= 0 ? 'n' : 'y';
    if (!window.localStorage.ecodeStaticCache || (window.localStorage.ecodeStaticCache && window.localStorage.ecodeStaticCache === "y")) {
      if (window.localStorage['ecodeStaticCacheVersion'] && window.localStorage['ecodeStaticCacheVersion'] !== "undefined") {
        tail = "?v=" + window.localStorage['ecodeStaticCacheVersion'];
      } else {
        tail = "?v=" + Math.random().toString().slice(-6);
      }
    }
    var ecodeBlockCode = window.localStorage['ecodeBlockCode'];
    var ecodeDefaultInitJs = window.localStorage["ecodeDefaultInitJs"];
    if(ecodeBlockCode !== "true") {
      document.write("<script type=\"text/javascript\" src=\""+ ecologyContentPath +"/cloudstore/dev/init.js" + tail + "\"></script>");
      document.write("<link rel=\"stylesheet\" href=\""+ ecologyContentPath +"/cloudstore/dev/init.css" + tail + "\" type=\"text/css\" />");
      var initJS = window.localStorage['ecodeInitJs'], initCss = window.localStorage['ecodeInitCss'];
      if (initJS && initJS !== 'undefined') {
        document.write("<script type=\"text/javascript\" src=\""+ ecologyContentPath + initJS + tail + "\"></script>");
      }
      if (initCss && initCss !== 'undefined') {
        document.write("<link rel=\"stylesheet\" href=\""+ ecologyContentPath + initCss+ tail + "\" type=\"text/css\" />");
      }
    } else if(ecodeDefaultInitJs && ecodeDefaultInitJs !== 'undefined') {
      document.write("<script type=\"text/javascript\" src=\""+ ecologyContentPath + ecodeDefaultInitJs + tail + "\"></script>");
    }
    window.csInitIsLoad = true;
  }
})();

