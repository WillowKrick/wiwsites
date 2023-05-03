window.addEventListener('load', function () {
	// user sign up
	let signup = $$('.signup');
	if (signup) {
		signup.onclick = function (e) {
			e.preventDefault();
			let email = $$('.account').value;
			let password = $$('.password').value;
			let jumpUrl = 'http://127.0.0.1:5500/active.html';


			ajax({
				type: "post",
				url: basicUrl + "/user/regist",
				data: { email, password, jumpUrl },
				success: function (feedBack) {
					if (feedBack.code != 0) {
						layer.open({ type: 0, content: feedBack.msg });
						return;
					} else {
						setTimeout(() => {
							layer.open({
								type: 0,
								content: '注册成功,去油箱哩激活吧'
							});
						}, 2000);
						location.href = 'login.html';
					}
				}
			});
		}
	}

	//user login in
	let login = $$('.login');
	if (userInfo) {
		location.href = encodeURIComponent(location.href);
	}
	if (login) {
		login.onclick = function (e) {
			e.preventDefault();
			let email = $$('.account').value;
			let password = $$('.password').value;
			ajax(
				{
					type: "post",
					url: basicUrl + "/user/login",
					data: {
						email,
						password
					},
					success: function (feedBack) {
						// 若返非则错误
						console.log(feedBack);
						if (feedBack.code != 0) {
							if (feedBack.data.status != 1) {
								console.log('verify your email first');
							} else {
								console.log(feedBack);
								var index = layer.open({
									type: 0, // page 层类型，其他类型详见「基础属性」
									content: feedBack.msg
								});
							}
						}
						// 前往登录
						setCookie('userInfo', JSON.stringify(feedBack.data), 24 * 3600);
						let back = strToObject(location.search.substring(1)).back;
						if (back) {
							back = decodeURIComponent(back);
						} else {
							back = 'index.html';
						}
						layer.open({
							type: 0, // page 层类型，其他类型详见「基础属性」
							content: '登录成功'
						})
						setTimeout(() => {
							location.href = back;
						}, 3000);
					}
				});
		}
	}
});
