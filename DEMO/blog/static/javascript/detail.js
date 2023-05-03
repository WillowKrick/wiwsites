window.addEventListener('load', () => {
	let id = Number(strToObject(location.search.substring(1)).id);

	if (isNaN(id) || id <= 0) location.href = 'index.html';
	ajax({
		url: basicUrl + `/article/detail`,
		data: { id },
		success: function (reply) {
			console.log(reply);
			let { data: article } = reply;
			$$('.title>p').innerHTML = article.title;
			$$('.addtime').innerHTML = formatTime(article.addtime);
			$$('.category').innerHTML = article.category.name;
			$$('.category').href = `caty.html?cat=` + article.category.id;
			$$('.author').innerHTML = article.author.id;
			$$('.content').innerHTML = article.content;
			$$('.agree').innerHTML = article.hasLike ? '手滑了' : '点赞';
		}
	});
	$$('.agree').addEventListener('click', () => {
		if (!userInfo) {
			location.href = 'login.html?back=' + encodeURIComponent(location.href);
			return;
		}
		ajax({
			url: basicUrl + '/article/like',
			data: { id },
			success: function (reply) {
				$$('.agree').innerHTML = $$('.agree').innerHTML == '点赞' ? '手滑了' : '点赞';
			}
		});
	});
});