/**
 * 
 * @param {String || Dom} 分页导航容器
 * @param {Object} 分页导航的配置
 */

function Page(element, option, cb) {
	this.cb = cb;
	// 元素否?
	if (!(element instanceof HTMLElement) && !(document.querySelector(element))) {
		//必字符串哉!
		throw new Error('汝之不慎!此为dom或选择器也');
	}
	// 设属性记录器之dom对象
	this.element = (element instanceof HTMLElement) ? element : document.querySelector(element);

	this.config = {
		data: {
			total: 0,
			singlePage: 10,
			url: '',
			query: {}
		},
		language: {
			head: '<<',
			preview: '<',
			list: '',
			next: '>',
			tail: '>>',
		}
	}
	//合并用户参数
	this.mergeConfig(option);
	// 总页数
	this.totalPage = Math.ceil(this.config.data.total / this.config.data.singlePage);
	// 所在页
	this.pageNow = 1;
	// 刷新/创建分页
	this.powerUp();
	// 处理分页栏点击事件
	this.dealEvent();
}
// deal with the click event 
Page.prototype.dealEvent = function () {
	this.element.addEventListener('click', e => {
		let eTarget = e.target.className;
		eTarget == 'tail' && (this.pageNow = this.totalPage) && this.powerUp();
		eTarget == 'next' && (this.pageNow < this.totalPage) && (this.pageNow++) && this.powerUp();
		eTarget == 'preview' && (this.pageNow > 1) && (this.pageNow--) && this.powerUp();
		eTarget == 'head' && (this.pageNow = 1) && this.powerUp();
		e.target.tagName == 'P' && (this.pageNow = e.target.innerHTML - 0) && this.powerUp();
		if (e.target.tagName == 'BUTTTON') {
			let indx = parseInt(this.element.querySelector('input').value);
			if (isNaN(indx) || indx > this.totalPage || indx < 0) {
				alert('你输了啥哎嗨嗨哟');
				this.element.querySelector('input').value = '';
			} else {
				this.pageNow = indx;
				this.powerUp();
			}
		}
	});
}
// 开启！
Page.prototype.powerUp = function () {
	// construct the option Object send to server 
	let query = {
		...this.config.data.query,
		page: this.pageNow,
		pageSize: this.config.data.singlePage
	}
	// send ajax request 
	ajax({
		url: this.config.data.url,
		data: query,
		success: reply => {
			this.totalPage = Math.ceil(reply.count / this.config.data.singlePage);
			console.log('you changed your page,now the page is:' + this.pageNow);
			// clear content already exist
			this.element.innerHTML = '';
			// create outer div container 
			this.createOutSideTag();
			// create nuber tag 
			this.createNumberTag();
			// create redirect tag 
			this.createRedirect();
			// finish data switch 
			Object.prototype.toString.call(this.cb) == '[object Function]' && this.cb(reply.data);
		}
	});

}

// 创建跳转方法
Page.prototype.createRedirect = function () {
	// 生成输入框
	let inputDom = document.createElement('input');
	inputDom.className = 'number';
	this.element.appendChild(inputDom);
	let buttonDom = document.createElement('buttton');
	buttonDom.innerHTML = '重定向';
	this.element.appendChild(buttonDom);

}

// 创建分页（规则）
Page.prototype.createNumberTag = function () {
	if (this.totalPage <= 5) {
		this.createNumberTagsByRange(1, this.totalPage);
		return
	}
	if (this.pageNow <= 3) {
		this.createNumberTagsByRange(1, 5);
	} else if (this.pageNow >= this.totalPage - 2) {
		this.createNumberTagsByRange(this.totalPage - 4, this.totalPage);
	} else {
		this.createNumberTagsByRange(this.pageNow - 2, this.pageNow + 2);
	}
}

// 以方圆建以数字标签
Page.prototype.createNumberTagsByRange = function (min, max) {
	// 取dom以加父级
	let parent = this.element.querySelector('.list');

	for (let idx = min; idx <= max; idx++) {

		let pDD = document.createElement('p');

		pDD.innerHTML = idx;

		//循环创建标签添加特殊样式
		idx == this.pageNow && pDD.classList.add('active');

		parent.appendChild(pDD);
	}
}

//建以外层div容器
Page.prototype.createOutSideTag = function () {
	for (let key in this.config.language) {
		let dvdDom = document.createElement('div');
		dvdDom.className = key;
		dvdDom.innerHTML = this.config.language[key];
		this.element.appendChild(dvdDom);
	}
}
// 原型加以合参之法
Page.prototype.mergeConfig = function (option) {
	// 使所传配置与默认合并之
	for (let key in this.config) {
		// 每历之, key指data或language字符串
		// key现指属性传递邪?若值undefined则为否!
		if (option[key] != undefined) {

			// 证key所对属性已传,再历下维传否
			for (let attrName in this.config[key]) {
				// 以key表data, 每历attrName表total和 singlePage字符串
				// 验用者传attrName之属性,传之覆,未传默之 
				(option[key][attrName] != undefined) && (this.config[key][attrName] = option[key][attrName]);
			}
		}
	}
}
