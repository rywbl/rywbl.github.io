var __WEAVEREncryptCtrl__ = (function () {
    return (function () {
        var status = null;
        var unEncryptedUrls = null;
        var cryptoAlg = false;
        return {
            getststus : function(){
                return status;
            },

            getUnEncryptedUrls: function () {
                if(unEncryptedUrls){
                    return unEncryptedUrls;
                }
            },

            consultDecryptKey:function(){
				try{
					return __WEAVEREncrypt__.consultDecryptKey();
				}catch(e){}
            },

            getKey: function () {
                if(status){
                    if(cryptoAlg){
                        return __WEAVEREncryptSM4__.getKey();
                    }else {
                        return __WEAVEREncrypt__.getKey();
                    }
                }

            },


            decrypt : function (value) {
               // if(status){
                   var oriValue = __WEAVEREncrypt__.weaver_decrypt(value);
                //}
                if(!!oriValue)value = oriValue;
                return value;
            },

            encrypt : function (value) {
                if(status){
                    if(cryptoAlg){
                        value = __WEAVEREncryptSM4__.weaver_encrypt(value);
                    }else {
                        value = __WEAVEREncrypt__.weaver_encrypt(value);
                    }
                }
                return value;
            },

            initWEAVEREncryptCtrl: function (callback) {
                if (status && unEncryptedUrls) {
                    if (callback) {
                        callback();
                    }
                } else {
                    jQuery.ajax({
                        url: (window.ecologyContentPath||"") + "/api/encryptedTrans/isEnableEncryptedTrans",
                        type: "GET",
                        async: false,
                        dataType: "json",
                        success: function (data) {
                            status = data.status;
                            cryptoAlg = data.cryptoAlg;
                        }
                    });

                    jQuery.ajax({
                        url: (window.ecologyContentPath||"") +  "/api/encryptedTrans/getUnencryptedUrlList",
                        type: "get",
                        async: false,
                        dataType: "text",
                        success: function (data) {
                            unEncryptedUrls = data;
                        }
                    });

                    if (callback) {
                        callback();
                    }
                }
            }
        };
    })();
})();


__WEAVEREncryptCtrl__.initWEAVEREncryptCtrl();