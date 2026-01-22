<template>
	<view class="video-main">
		<div :class="[
			'artplayer-app',
			`artplayer-app-${index}`
		]"></div>
		<view class="title two-line">
			{{ item.title }}
		</view>
	</view>
</template>

<script>
import Artplayer from 'artplayer';

export default {
	props:{
		item:Object,
		index:Number
	},
	data() {
		return {};
	},
	created() {
		setTimeout(() => {
			this.init();
		},1000)
	},
	methods: {
		init(){
			var art = new Artplayer({
				id: `.artplayer-app-${this.index}`, 
			    container: `.artplayer-app-${this.index}`, 
			    url: this.item.url,
				poster:this.item.cover || '',
				theme:'#3680f3',
				// autoSize:true,
				autoMini:true,
				playbackRate:true,
				screenshot: true,
				setting:true,
				pip:true,
				backdrop:true,
				fullscreen:true,
				miniProgressBar:true
			});
		}
	}
};
</script>

<style lang="scss" scoped>

.video-main{
	margin-bottom: 24rpx;
	// padding-bottom: 0;
	
	.title{
		font-size: 28rpx;
		color: #444#333;
		margin-top: 16rpx;
		line-height: 40rpx;
		// 两行省略号
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	
	.artplayer-app {
	    width: 100%;
	    height: 360rpx;
		background-color: #ddd;
		border-radius: 16rpx;
	}
	
}


</style>