window.addEventListener('load', () => {

	if (!userInfo) {
		let url = 'login.html?back=' + encodeURIComponent(location.href);
		location.href = url;
	}
	ajax({
		url: basicUrl + `/system/category`,
		success: function (feedback) {
			// console.log(feedback);
			let html = `<option value="0">选择发布的分类</option>`;
			feedback.data.forEach(itm => {
				html += `<option value="${itm.id}">${itm.name}</option>`
			});
			$$('.category').innerHTML = html;
			var form = layui.form;
			form.render();
		}
	});

	$$('.post').addEventListener('click', e => {
		e.preventDefault();
		let data = {
			title: $$(".title").value,
			categoryId: $$(".category").value - 0,
			coverImg: $$(".coverImg").value,
			content: editor.getHtml(),
			description: $$(".description").value,

		}
		ajax({
			type: 'post',
			url: basicUrl + '/article/publish',
			data,
			success: function (reply) {
				console.log(reply);
			}
		});
		console.log(data);
	});
});