window.addEventListener('load', () => {
	const categoryId = Number(strToObject(location.search.substring(1)).cat);
	if (isNaN(categoryId) || categoryId <= 0) {
		location.href = 'index.html';
		return;
	}

	let ops = {
		data: {
			url: basicUrl + '/article/list',
			query: {
				categoryId
			},
			pageSize: 2
		}
	}

	new Page($$(".paginate"), ops, reply => {
		let html = '';
		console.log(reply);
		reply.forEach(itm => {
			html +=
				`<div class="layui-col-md12">
					<div class="main list"><div class="subject">
						<a href="javascript:;" class="caty">[PHP]</a>
						<a href="javascript:;">${itm.title}</a>
						<em>${formatTime(itm.addtime)}发布</em></div>
						<div class="content layui-row">
							<div class="layui-col-md4 list-img">
								<a href="detail.html?id=${itm.id}&cat=${itm.categoryId}"><img width='200' src="${itm.coverImg}"></a>
							</div>
							<div class="layui-col-md8">
								<div class="list-text">${itm.description}</div>
							</div>
						</div>
					</div>
				</div>`
		});
		$$('.box').innerHTML = html;
	});
});