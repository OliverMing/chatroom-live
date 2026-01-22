<template>
	<view class="main" v-if="item">
		<view class="top-safe"
		:style="{ paddingTop:`${ws.safeAreaInsets.top}px` }">
			<view class="header"></view>
		</view>
		<image class="code" src="/static/top1.png" mode="widthFix"></image>
		<view class="ercode-main">
			<view class="circle circle-left"></view>
			<view class="circle circle-right"></view>
			
			<view class="ercode-fat flex justify-center">
				<view class="ercode-box">
					<image :src="item.url"  class="ercode" @click="previewImage" />
				</view>
				
			</view>
			
			<view class="tips flex justify-center">长按上方二维码 添加专属助理</view>
			<view class="small-tips">
				<view>若无法添加，请点击查看大图长按识别</view>
				<view>或者截图保存二维码，在微信中识别</view>
			</view>
		</view>
	</view>
</template>

<script>
const ws = uni.getSystemInfoSync();
import { Login,GetErcodeRatioMiniProgramUserInfoAsync } from '@/api'
import { baseUrl } from '@/config'

export default {
	data(){
		return {
			ws,
			item:null
		}
	},
	onLoad() {
		uni.showLoading({
			mask:true
		})
		this.login();
	},
	methods:{
		login(){
			uni.login({
				success:e=> {
					GetErcodeRatioMiniProgramUserInfoAsync(e.code).then(({ data }) => {
						// 获取用户的专属客服
						data.customer.url = `${ baseUrl }/${data.customer.url}`;				
						this.item = data.customer;
						uni.hideLoading();
						console.info(this.item);
					})
				}
			})
		},
		
		previewImage(){
			uni.previewImage({
				urls:[this.item.url]
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.main{
	height: 100vh;
	background-color: #fd3b39;
	
	.ercode-main{
		padding: 48rpx 0;
		background-color: #FFF;
		margin: 0 32rpx;
		margin-top: -10rpx;
		position: relative;
		border-radius: 0 0 24rpx 24rpx;
		
		.small-tips{
			font-size: 24rpx;
			color: #888;
			padding: 32rpx;
			padding-bottom: 0;
			text-align: center;
		}
		
		.tips{
			text-align: center;
			padding: 32rpx 0 48rpx;
			margin: 0 32rpx;
			font-weight: bold;
			font-size: 36rpx;
			border-bottom: 2rpx solid #eee;
		}
		
		.ercode-fat{
			.ercode-box{
				border: 8rpx solid #fee4c9;
				width: 420rpx;
				height: 420rpx;
				
				.ercode{
					width: 100%;
					height: 100%;
				}
			}
		}
		
		
		
		.circle{
			position: absolute;
			top: -25rpx;
			width: 50rpx;
			height: 50rpx;
			background-color: #fd3b39;
			z-index: 1;
			border-radius: 50%;
		}
		
		.circle-left{
			left: -25rpx;
		}
		
		.circle-right{
			right: -25rpx;
		}
	}
		
	.top-safe{
		background-color: #fb201f;
	}
	
	.header{
		height: 80rpx;
	}
	
	.code{
		width: 100%;
	}
}
</style>