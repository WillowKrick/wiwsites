const basicUrl = 'http://edublog.phpclub.org.cn';
let userInfo = getCookie('userInfo') ? JSON.parse(getCookie('userInfo')) : null;

window.addEventListener('load', () => {
	let categoryId = strToObject(location.search.substring(1)).cat ?? 0;
	$$('.navigator') && ajax({
		url: basicUrl + '/system/category',
		data: {},
		success: function (feedback) {
			let html = `<li class="layui-nav-item ${categoryId == 0 ? 'layui-this' : ''}">
			<a href="index.html" >首页</a></li>`;
			feedback.data.forEach(itm => {
				html += `<li class="layui-nav-item ${categoryId == itm.id ? 'layui-this' : ''}">
				<a href="caty.html?cat=${itm.id}">${itm.name}<span class="">
				</span></a></li>`
			});
			$$('.navigator').innerHTML = html + `<span class="layui-nav-bar"></span>`
		}
	});
	let html = '';
	html = `<a href="./login.html">Log in<a/>`;
	if (userInfo) {
		html = `<a href="javascript:;"><img src="${userInfo.headimg ? userInfo.headimg : 'https://img0.baidu.com/it/u=3620010257,3904026948&fm=253'}" class="layui-nav-img">${userInfo.nickname ? userInfo.nickname : '用户_' + userInfo.id}</a>
<dl class="layui-nav-child">
<dd><a href="post.html">发布文章</a></dd>
<dd><a href="javascript:;">信息修改</a></dd>
<dd><a class="logout" href="javascript:;">退了</a></dd>
</dl>`
	}
	$$('.userInfo') && ($$('.userInfo').innerHTML = html);
});

// 实现退出功能，清除cookie并刷新页面
$$('.userInfo') && $$('.userInfo').addEventListener('click', e => {
	if (e.target.className == 'logout') {
		removeCookie('userInfo');
		let srch = location.search ? location.search : '';
		location.href = location.pathname.substring(1) + srch;
	}
});

function formatTime(time) {
	let t = new Date(time * 1000);
	return `${t.getFullYear()}-${t.getMonth() + 1}-${t.getDate()} ${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`;
}


/**
 * 
 * @param {String} key 
 * @param {String} value 
 * @param {Number} expires 
 */
function setCookie(key, value, expires = 0) {
	let expsn = '';
	if (expsn != 0) {
		let dt = new Date;
		dt.setTime(dt.getTime() + expires * 1000);
		expsn = `;expires=` + dt.toUTCString;
	}
	document.cookie = `${key}=${value};path=/;${expsn}`;
}

function getCookie(key) {
	return strToObject(document.cookie, '; ')[key]
}

function strToObject(str, firstChar = "&", secChar = "=") {
	let res = {};
	str.split(firstChar).forEach(itm => {
		let keyValue = itm.split(secChar);
		res[keyValue[0]] = keyValue[1];
	});
	return res;
}

function removeCookie(key) { setCookie(key, '', -1); }


/**
 * 
 * @param {Object} ops 
 */
function ajax(ops) {
	// 1、设置默认配置
	const cofig = {
		type: "get",
		url: "",
		data: '',
		dataType: "json",
		headers: {
			"Content-Type": "application/json"
		},
		success: function () { }
	}
	// 2、掺树火并
	for (let key in cofig) {
		if (ops[key] != undefined) {
			if (key == 'headers') {
				Object.assign(cofig.headers, ops.headers);
			} else {
				cofig[key] = ops[key];
			}
		}
	}
	// 3、掺树验证
	// 3.1 验证秦球类型，并修正大小写
	const alowRkstType = ['get', 'post', 'put', 'delete'];
	cofig.type = cofig.type.toLowerCase();
	if (!alowRkstType.includes(cofig.type)) {
		throw new Error('type掺树仅支持' + alowRkstType);
	}

	// 3.2验证请求统一资源定位地址
	if (!cofig.url.startsWith('https://') && !cofig.url.startsWith('http://')) {
		throw new Error('协议头不传是吧，自己看着办');
	}

	// 3.3 验证请求竖锯类型 
	let dataType = Object.prototype.toString.call(cofig.data).slice(8, -1);
	if (dataType != 'String' && dataType != 'Object') {
		throw new Error('你自己抬起头来，好好看看想想自己传了什么鬼东西');
	}

	//3.4 验证请求偷
	if (Object.prototype.toString.call(cofig.headers) != '[object Object]') {
		throw new Error("朱鹤你程伟现逮人中的蛋头贵！");
	}

	// 3.5验证肥雕函数
	if (Object.prototype.toString.call(cofig.success) != '[object Function]') {
		throw new Error('俏佳人们，懂不懂函数是什么啊');
	}

	// 4.获取Ajax对象
	let xhr = new XMLHttpRequest;
	// 5.打开连接
	let url = cofig.url;
	if (cofig.type == "get" || cofig.type == "delete") {
		url += "?" + ((dataType == 'String') ? cofig.data : objectToStr(cofig.data))
	}
	xhr.open(cofig.type, url);
	// 6.设置请求头
	for (let key in cofig.headers) {
		xhr.setRequestHeader(key, cofig.headers[key]);
	}
	if (userInfo) {
		xhr.setRequestHeader('Authorization', userInfo.token);
	}
	// 7.send request 
	let requestBody = '';
	if (cofig.type == 'post' || cofig.type == 'put') {
		if (dataType == 'String') {
			requestBody = cofig.data;

		} else {
			requestBody = (cofig.headers['Content-Type'] == 'application/json') ? JSON.stringify(cofig.data) : objectToStr(cofig.data);
		}
	}

	xhr.send(requestBody);
	xhr.onload = function () {
		let response = cofig.dataType == 'json' ? JSON.parse(xhr.responseText) : xhr.responseText;
		cofig.success(response);
	}
}
/**
 * 实现将对象转换为字符串
 * @param {Object} obj 
 * @param {String} sepa1 
 * @param {String} sepa2 
 */
function objectToStr(obj, sepa1 = '&', sepa2 = '=') {
	let res = '';
	Object.keys(obj).forEach(itm => res += `${itm}${sepa2}${obj[itm]
		}${sepa1}`);
	return res.slice(0, -1);
}




/**
 * 生成随机函数
 * @param {Number} min 开始数字
 * @param {Number} max 结束数字
 * @returns 
 */
function mkRd(max, min) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
* 获取dom对象
* @param {String} selector 
*/
function $$(selector, isMore) {
	return isMore ? document.querySelectorAll(selector) : document.querySelector(selector);
}

/**
* 兼容性获取样式
* @param {String} selector 
* @param {String} styleName 
*/
function getStyle(selector, styleName) {
	try {
		return window.getComputedStyle($$(selector))[styleName];
	} catch (error) {
		return $$(selector).currentStyle[styleName];
	}
}

/**
* 批量设置样式
* @param {String} selector 选择器字符串
* @param {Object} options 样式对应的信息 样式名称做属性 样式值作为属性值
*/
function setStyle(selector, options) {
	var dom = $$(selector);
	for (var key in options) {
		dom.style[key] = options[key];
	}
}


