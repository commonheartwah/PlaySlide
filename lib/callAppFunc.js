define(function() {
	function setupWebViewJavascriptBridge(callback) {
		if (window.WebViewJavascriptBridge) {
			return callback(WebViewJavascriptBridge);
		}
		if (window.WVJBCallbacks) {
			return window.WVJBCallbacks.push(callback);
		}
		window.WVJBCallbacks = [callback];
		var WVJBIframe = document.createElement('iframe');
		WVJBIframe.style.display = 'none';
		WVJBIframe.src = 'https://__bridge_loaded__';
		document.documentElement.appendChild(WVJBIframe);
		setTimeout(function() {
			document.documentElement.removeChild(WVJBIframe)
		}, 0)
	}
	/**
	 * @func 传入方法名参数
	 * @param  { string } funcName [函数名]
	 */
	var passFunc = function(funcName) {
		setupWebViewJavascriptBridge(function(bridge) {
			bridge.callHandler(funcName, function(responseData) {})
		})
		if (window.android_native) {
			window.android_native[funcName]();
		}
	}
	var uniqueId = 1
	/**
	 * [app log调试]
	 * @param  {[type]} message [description]
	 * @param  {[type]} data    [description]
	 */
	var log = function(message, data) {
		var log = document.getElementById('log')
		var el = document.createElement('div')
		el.className = 'logLine'
		el.innerHTML = uniqueId++ + '. ' + message + ':<br/>' + JSON.stringify(data)
		if (log.children.length) {
			log.insertBefore(el, log.children[0])
		} else {
			log.appendChild(el)
		}
	}
	return {
		passFunc: passFunc,
		appLog: log
	}
})
