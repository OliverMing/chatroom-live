import { baseUrl } from "@/config";
let header = { "content-type": "application/x-www-form-urlencoded;charset=UTF-8" };

const http = options => {
	const { method,url,data = null,showToast = true } = options;
	return new Promise((resolve, reject) => {
		 uni.request({
			url:url.includes('http') ? url : baseUrl + url,
			header,
			data,
			method,
			success: function (res) {
				setTimeout(() => {
					if (res.data.state == 'success') {
						resolve(res.data);
					} else {
						reject(res);
						if(showToast) {
							uni.showToast({ title: res.data.message, icon: 'none' });
						}
					}
				}, 300);
			},
			fail: (err) => {
				uni.showToast({
					title: '请求超时，请检查网络',
					icon: 'none',
				});
				reject(err)
			}
		});
	})
}

module.exports.http = http;