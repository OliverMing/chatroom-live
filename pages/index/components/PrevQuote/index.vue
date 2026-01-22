<template>
	<u-popup
	:show="show"
	:closeOnClickOverlay="false" 
	bgColor="transparent" 
	@touchmove.stop.prevent>
		<view class="full-box flex items-center justify-center" @click="show = false">
			<image v-if="isImageUrl(content)" :src="content" mode="widthFix"
			style="max-width: 460rpx;height: auto;"></image>
			
			<div v-else-if="isVideo(content)">
				<video :src="content" style="width:520rpx;height:350rpx;object-fit: contain"></video>
			</div>
			<div v-else-if="isAudio(content)">
				<audio :src="content" controls></audio>
			</div>
			<text v-else>
				<u-parse :content="content" @longpress="copy"></u-parse>
			</text>
		</view>
	</u-popup>
</template>

<script>
export default {
	data(){
		return {
			show:false,
			content:null,
		}
	},
	computed:{
		// 正则表达式来匹配图片链接
		isImageUrl(){
			return e => {
				const regex = /\.(jpeg|jpg|png|gif|bmp|svg|webp)$/i; // 可选的后缀名，忽略大小写
				return regex.test(e);  
			}
		},
		// 正则表达式来匹配视频链接
		isVideo(){
			return e => {
				const regex = /\.(mp4|mov|avi|flv|m4v)$/i; // 可选的后缀名，忽略大小写
				return regex.test(e);
			}  
		},
		// 判断如果是语音，则播放
		isAudio(){
			return e => {
				const regex = /\.(mp3|wav|ogg|m4a|aac|flac|wma|ape|mka|opus|m3u8|webm)$/i; // 可选的后缀名，忽略大小写
				return regex.test(e);
			}  
		},
	},
	created() {
		uni.$on('quote',e => {
			this.content = e;
			this.show = true;
		})
	},
	destroyed() {
		uni.$off("quote")
	},
	methods:{
		
	}
}
</script>

<style lang="scss" scoped>
.full-box{
	height: 100vh;
	background-color: #FFF;
	padding: 0 32rpx;
	font-size: 28rpx;
	color: #000;
}
</style>