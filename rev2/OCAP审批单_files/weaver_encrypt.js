var encryptSeparator = "----weaversecurity----";
var __WEAVEREncrypt__ = (function () {
    String.prototype.wec_replaceAll = function (f, e) {
        var reg = new RegExp(f, "g");
        return this.replace(reg, e);
    }
    String.prototype.toHexString = function(){
        var val = "";
        for (var i = 0; i < this.length; i++) {
            if (val == "")
                val = this.charCodeAt(i).toString(16);
            else
                val += this.charCodeAt(i).toString(16);
        }
        val += "0a";
        return val;
    },
    String.prototype.hex2String = function(){
        if (this.length % 2) return '';
        var tmp='';
        for(i=0;i<this.length;i+=2)
        {
            tmp += '%' + this.charAt(i) + this.charAt(i+1);
        }
        var d = decodeURIComponent(tmp);
        if(d.startsWith("{") || d.startsWith("[")){
            try{
                d = JSON.parse(d);
            }catch(e){}
        }
        return d;
    }
    return (function () {
        var AES_UUID = null;
        var RSA_PUB = null;
        var DECRYPT_AES_UUID = null;
        return {
            reload_key:function() {
                if (window.localStorage) {
                    var storage = window.localStorage;
                    DECRYPT_AES_UUID = storage.getItem("__key_rnd__");
                }
            },
            store:function(key){
                if (window.localStorage) {
                    var storage = window.localStorage;
                     storage["__key_rnd__"] = DECRYPT_AES_UUID;
                }
                __WEAVEREncrypt__.consultDecryptKey();

            },
			weaver_decrypt: function(value){
                __WEAVEREncrypt__.reload_key();
                if (!value && !DECRYPT_AES_UUID) return value;
                var key = DECRYPT_AES_UUID;
                //var key = "ab-3duy-0eic-xwr";
                var encodeKey = CryptoJS.enc.Utf8.parse(key);
                var decryptStr = CryptoJS.AES.decrypt(value,encodeKey,{
                    mode: CryptoJS.mode.ECB,
                    padding: CryptoJS.pad.Pkcs7
                }).toString().hex2String();
                return decryptStr;
            },

            weaver_encrypt: function (value) {

                if (!value && !AES_UUID) return value;
                var key = AES_UUID;
                var encodeKey = CryptoJS.enc.Utf8.parse(key);
                value = CryptoJS.enc.Utf8.parse(value);
                var encryptedStr = CryptoJS.AES.encrypt(value, encodeKey, {
                    mode: CryptoJS.mode.ECB,
                    padding: CryptoJS.pad.Pkcs7
                }).toString();
                if (encryptedStr.indexOf("+") !== -1) {
                    encryptedStr = encryptedStr.wec_replaceAll("\\+", "_s-s_");//防止waf 针对特殊字符的拦截
                }
                if (encryptedStr.indexOf("on") !== -1) {
                    encryptedStr = encryptedStr.wec_replaceAll("on", "_s-1_");//防止waf 针对特殊字符的拦截
                }
                if (encryptedStr.indexOf("oN") !== -1) {
                    encryptedStr = encryptedStr.wec_replaceAll("oN", "_s-2_");//防止waf 针对特殊字符的拦截
                }
                if (encryptedStr.indexOf("On") !== -1) {
                    encryptedStr = encryptedStr.wec_replaceAll("On", "_s-3_");//防止waf 针对特殊字符的拦截
                }
                if (encryptedStr.indexOf("ON") !== -1) {
                    encryptedStr = encryptedStr.wec_replaceAll("ON", "_s-4_");//防止waf 针对特殊字符的拦截
                }
                if (encryptedStr.indexOf("=") !== -1) {
                    encryptedStr = encryptedStr.wec_replaceAll("=", "_s-5_");//防止waf 针对特殊字符的拦截
                }
                if (encryptedStr.indexOf("0X") !== -1) {
                    encryptedStr = encryptedStr.wec_replaceAll("0X", "_s-6_");//防止waf 针对特殊字符的拦截
                }
                if (encryptedStr.indexOf("0x") !== -1) {
                    encryptedStr = encryptedStr.wec_replaceAll("0x", "_s-7_");//防止waf 针对特殊字符的拦截
                }
                if (encryptedStr.indexOf("/") !== -1) {
                    encryptedStr = encryptedStr.wec_replaceAll("/", "_s-9_");//防止waf 针对特殊字符的拦截
                }
                return (encryptedStr.toHexString()+"_ec_");
            },

            consultDecryptKey:function(){
                __WEAVEREncrypt__.reload_key();
                key = DECRYPT_AES_UUID;
                // if (key) {
                //     //对密钥进行RSA加密处理
                //     //var encrypt = new JSEncrypt_wev();
                //     if (!RSA_PUB) {
                //         jQuery.ajax({
                //             url: (window.ecologyContentPath||"")+"/rsa/weaver.rsa.GetRsaInfo?ts=" + new Date().getTime(),
                //             type: "get",
                //             async: false,
                //             dataType: "json",
                //             success: function (data) {
                //                 RSA_PUB = data.rsa_pub;
                //             }
                //         });
                //     }
                //     encrypt.setPublicKey(RSA_PUB);
                //     var rsaKey = encrypt.encrypt(key) + "``RSA``";
                //     jQuery.ajax({
                //         url: (window.ecologyContentPath||"")+"/aes/consultKey",
                //         type: "post",
                //         async: false,
                //         data:{
                //             __key_rnd__:  rsaKey
                //         },
                //         dataType: "json",
                //         success: function (data) {
                //             if(window.console){
                //                 console.log(data);
                //             }
                //         }
                //     });
                //     return rsaKey;
                // } else {
                //     return null;
                // }
            },

            getKey: function () {
                var key = AES_UUID;
                if (key) {
                    //对密钥进行RSA加密处理
                    var encrypt = new JSEncrypt_wev();
                    if (!RSA_PUB) {
                        jQuery.ajax({
                            url: (window.ecologyContentPath||"")+"/rsa/weaver.rsa.GetRsaInfo?ts=" + new Date().getTime(),
                            type: "get",
                            async: false,
                            dataType: "json",
                            success: function (data) {
                                RSA_PUB = data.rsa_pub;
                            }
                        });
                    }
                    encrypt.setPublicKey(RSA_PUB);
                    var rsaKey = encrypt.encrypt(key) + "``RSA``";
                    if (rsaKey.indexOf("+") !== -1) {
                        rsaKey = rsaKey.wec_replaceAll("\\+", "_s-s_");//防止waf 针对特殊字符的拦截
                    }
                    if (rsaKey.indexOf("on") !== -1) {
                        rsaKey = rsaKey.wec_replaceAll("on", "_s-1_");//防止waf 针对特殊字符的拦截
                    }
                    if (rsaKey.indexOf("oN") !== -1) {
                        rsaKey = rsaKey.wec_replaceAll("oN", "_s-2_");//防止waf 针对特殊字符的拦截
                    }
                    if (rsaKey.indexOf("On") !== -1) {
                        rsaKey = rsaKey.wec_replaceAll("On", "_s-3_");//防止waf 针对特殊字符的拦截
                    }
                    if (rsaKey.indexOf("ON") !== -1) {
                        rsaKey = rsaKey.wec_replaceAll("ON", "_s-4_");//防止waf 针对特殊字符的拦截
                    }
                    if (rsaKey.indexOf("=") !== -1) {
                        rsaKey = rsaKey.wec_replaceAll("=", "_s-5_");//防止waf 针对特殊字符的拦截
                    }
                    if (rsaKey.indexOf("0X") !== -1) {
                        rsaKey = rsaKey.wec_replaceAll("0X", "_s-6_");//防止waf 针对特殊字符的拦截
                    }
                    if (rsaKey.indexOf("0x") !== -1) {
                        rsaKey = rsaKey.wec_replaceAll("0x", "_s-7_");//防止waf 针对特殊字符的拦截
                    }
                    if (rsaKey.indexOf("`") !== -1) {
                        rsaKey = rsaKey.wec_replaceAll("`", "_s-8_");//防止waf 针对特殊字符的拦截
                    }
                    if (rsaKey.indexOf("/") !== -1) {
                        rsaKey = rsaKey.wec_replaceAll("/", "_s-9_");//防止waf 针对特殊字符的拦截
                    }
                    return rsaKey.toHexString();
                } else {
                    return null;
                }

            },

            initWEAVERCode: function (callback) {
                if (RSA_PUB && AES_UUID) {
                    if (callback) {
                        callback();
                    }
                } else {
                    var uuid = function () {
                        /**
                         * @return {string}
                         */
                        function S4() {
                            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
                        }

                        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4()).substr(0, 16);
                    }

                    AES_UUID = uuid();
                    var length = 16 - AES_UUID.length;

                    if (length > 0) {
                        var tmp;
                        for (var i = 0; i < length; i++) {
                            tmp += "a";
                        }
                        AES_UUID += tmp;
                    }

                    jQuery.ajax({
                        url: (window.ecologyContentPath||"")+"/rsa/weaver.rsa.GetRsaInfo?ts=" + new Date().getTime(),
                        type: "get",
                        async: false,
                        dataType: "json",
                        success: function (data) {
                            RSA_PUB = data.rsa_pub;
                            if (callback) {
                                callback();
                            }
                            if(!DECRYPT_AES_UUID) {
                                DECRYPT_AES_UUID = AES_UUID;
                                __WEAVEREncrypt__.store(DECRYPT_AES_UUID);

                            }
                        }
                    });
                }
            }
        };
    })();
})();


__WEAVEREncrypt__.initWEAVERCode();