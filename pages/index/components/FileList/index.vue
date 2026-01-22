<template>
	<scroll-view scroll-y class="container">
		<view class="flex items-center item" v-for="(item,index) in list" :key="item.id">
			<u-image :src="`/static/file/icon_file_${getFileType(item.url)}.png`" width="50rpx" height="65rpx" />
			<view class="flex-1 right-info">
				<view class="">{{ item.file_name }}</view>
				<view class="size">{{ item.file_size }}</view>
			</view>
			<view class="download" @click="download(item.url)">下载</view>
		</view>
	</scroll-view>
</template>

<script>
export default {
	props:{
		list:Array
	},
	data(){
		return {
			
		}
	},
	methods:{
		
		download(url){
			
			if(!url.includes('http')) url = `http:${url}`;
			
			// 检测是否是微信浏览器（H5环境）
			// #ifdef H5
			const ua = navigator.userAgent.toLowerCase();
			const isWeixin = ua.indexOf('micromessenger') !== -1;
			
			if (isWeixin) {
				// 微信浏览器中，提示用户并在外部浏览器打开，同时复制URL
				uni.showModal({
					title: '提示',
					content: '请在外部浏览器打开',
					showCancel: false,
					confirmText: '复制链接',
					success: (res) => {
						if (res.confirm) {
							// 复制URL到剪贴板
							uni.setClipboardData({
								data: url,
								success: () => {
									uni.showToast({
										title: '链接已复制',
										icon: 'success'
									});
								},
								fail: () => {
									uni.showToast({
										title: '复制失败',
										icon: 'none'
									});
								}
							});
						}
					}
				});
				return;
			}
			// #endif
			
			// 非微信浏览器，直接下载
			// #ifdef H5
			// H5环境下，直接打开链接或使用a标签下载
			const link = document.createElement('a');
			link.href = url;
			link.download = ''; // 让浏览器决定文件名
			link.target = '_blank';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			// #endif
			
			// #ifndef H5
			// 非H5环境（小程序、App等），使用uni.downloadFile
			uni.showLoading({
				title: '下载中...'
			});
			
			uni.downloadFile({
				url: url,
				success: (res) => {
					uni.hideLoading();
					if (res.statusCode === 200) {
						// 下载成功，打开文件
						uni.openDocument({
							filePath: res.tempFilePath,
							success: () => {
								uni.showToast({
									title: '下载成功',
									icon: 'success'
								});
							},
							fail: () => {
								uni.showToast({
									title: '打开文件失败',
									icon: 'none'
								});
							}
						});
					} else {
						uni.showToast({
							title: '下载失败',
							icon: 'none'
						});
					}
				},
				fail: (err) => {
					uni.hideLoading();
					uni.showToast({
						title: '下载失败',
						icon: 'none'
					});
					console.error('下载失败:', err);
				}
			});
			// #endif
		},
		
		// 获取文件类型
		getFileType(fileName) {
		  if (!fileName) return ''
		  const ext = fileName.split('.').pop().toLowerCase()
		  const typeMap = {
			'jpg': 'img',
			'jpeg': 'img',
			'png': 'img',
			'gif': 'img',
			'pdf': 'pdf',
			'doc': 'word',
			'docx': 'word',
			'xls': 'excel',
			'xlsx': 'excel',
			'txt': 'txt',
			'mp4': 'video',
			'avi': 'video',
			'mov': 'video',
			'mp3': 'audio',
			'wav': 'audio',
			'exe':'exe',
			'ppt':'ppt'
		  }
		  return typeMap[ext] || 'other'
		},
	}
}
</script>

<style lang="scss" scoped>
.container{
	padding: 0 32rpx;
	
	.item{
		padding: 32rpx 0;
		border-bottom: 1rpx solid #f8f8f8;
		// margin-bottom: 32rpx;
		
		.right-info{
			padding-left: 24rpx;
			font-size: 28rpx;
			
			.size{
				font-size: 24rpx;
				color: #888;
			}
		}
		
		.download{
			font-size: 24rpx;
			padding: 10rpx 20rpx;
			background-color: $base-color;
			color: #FFF;
			border-radius: 6rpx;
			margin-left: 24rpx;
		}
	}
	
}
</style>