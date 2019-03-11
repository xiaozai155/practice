(function() {
    (function() {
        let docEl = document.documentElement;
        let resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
        let scale = 1 / window.devicePixelRatio;
        let recalc = function () {
            let clientWidth = docEl.clientWidth;
            // let uiWidth = 1080;
            let uiWidth = 360;
            if (!clientWidth) return;
            docEl.style.fontSize = 100 * (clientWidth / uiWidth) + 'px';
        };
        document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=device-width, initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable = no, shrink-to-fit=no');
        if (!document.addEventListener) return;
        window.addEventListener(resizeEvt, recalc, false);
        document.addEventListener('DOMContentLoaded', recalc, false);
    })();

    /**
     * toast 弹出层
     */
    window.toast = function(text, removeDelay = 2200) {
        let $body = $(`
            <div class='util-toast-wrapper'>
                <div class='util-toast'>${text}</div>
            </div>
        `);
    
        let $parent = $(document.body);
        $parent.append($body);
    
        setTimeout(() => $body.addClass('active'), 100);

        setTimeout(() => {
            $body.addClass('disabled');
            setTimeout(() => $body.remove(), 900);
        }, removeDelay);
    }

    /**
     * 解析URL地址
     */
    window.parseURL = function(url) {
        let a = document.createElement('a');
        a.href = url;
        let ret = {
            source: url,
            protocol: a.protocol.replace(':', ''),
            host: a.hostname,
            pathname: a.pathname,
            port: a.port,
            query: a.search,
            search: a.search,
            params: (() => {
                let paramsRet = {};
                let seg = a.search.replace(/^\?/, '').split('&');
                let len = seg.length;
                let i = 0;
                let s;
                for (; i < len; i++) {
                    if (!seg[i]) {
                        continue;
                    }
                    s = seg[i].split('=');
                    paramsRet[s[0]] = s.slice(1).join('=');
                }
                return paramsRet;
            })(),
            file: (a.pathname.match(/\/([^/?#]+)$/i) || ['', ''])[1],
            hash: a.hash.replace('#', ''),
            path: a.pathname.replace(/^([^/])/, '/$1'),
            relative: (a.href.match(/tps?:\/\/[^/]+(.+)/) || ['', ''])[1],
            segments: a.pathname.replace(/^\//, '').split('/'),
        };
        return ret;
    };

    /**
     * 检测代码运行所在的环境
     */
    window.UATest = function(uaText) {
        let android = /Android/.test(uaText);
        let iOS = /(iPad|iPhone|iPod)\s+OS\s([\d_.]+)/.test(uaText);
        let weixin = /MicroMessenger/i.test(uaText);
        let wechat = weixin;
        let uc = /UCBrowser/.test(uaText);
        let pc = !android && !iOS;
    
        let QQ = /QQ\//.test(uaText);
        let QQBrowserCore = /MQQBrowser\//.test(uaText);
        let QQBrowser = QQBrowserCore && !wechat;
        let smzdm = /smzdm/i.test(uaText);
        let baidu = /baidu/i.test(uaText);
        let chrome = (() => {
            if (QQ || uc || smzdm || baidu) {
                return false;
            }
            return /(Chrome\/([\d.]+))|(CriOS\/([\d.]+))/i.test(uaText);
        })();
        let ret = {
            android,
            iOS,
            weixin,
            wechat,
            uc,
            pc,
            get wxminiprogram() {
                // 微信小程序
                let wxUAText = navigator.userAgent;
                return window.__wxjs_environment === 'miniprogram' || /^wechatdevtools/.test(wxUAText) || (wxUAText.match(/MicroMessenger/i) && wxUAText.match(/miniProgram/i));
            },
            QQ,
            QQBrowser, // QQ浏览器
            QQBrowserCore, // QQ浏览器内核
            chrome, // chrome浏览器
        };
        return ret;
    };
    /**
     * url地址参数
     */
    window.args = parseURL(location.href).params;
    /**
     * 检测环境
     */
    window.ua = UATest(window.navigator.userAgent);
    /**
     * 处理 ajax 请求
     * @params {object}
     */
    $.Ajax = function (params, success, error, url) {
        $.ajax({
            type: 'post',
            dataType: 'json',
            contentType: 'application/x-www-form-urlencoded',
            processData: false,
            url: url,
            data: {
                data: JSON.stringify(params)
            },
            success: function (result) {
                var code = result.code;
                var data = result.result;
                var message = result.message || result.description || '网络繁忙';
                var alertText = `${message}`;
                switch (code) {
                    case 0:
                        success(data);
                        break;
                    case 400:
                        toast(alertText);
                        break;
                    case 401:
                    case 402:
                    case 403:
                        location.replace(location.host + '/index.html');
                        break;
                    default:
                        toast(alertText);
                }
            },
            error: function (xhr) {
                if (xhr.status === 401) {
                    toast('需要登入');
                } else {
                    toast('网络繁忙');
                };
            }
        });
    };
})();
