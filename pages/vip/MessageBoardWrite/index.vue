<template>
	<view class="main" @click.stop="() => { return false; }">
		<view class="flex items-center top-info">
			<u--image :src="userInfo.headimgurl" width="50rpx" height="50rpx" radius="4rpx" mode="aspectFill" />
			<text>{{ userInfo.nickname }}</text>
		</view>
		<view class="text-area">
			<textarea v-model="content" :focus="focus" cols="30" rows="10" placeholder="写留言"></textarea>
			<view class="btn-box">
				<view :class="[
					'send',
					!content && 'opacity-50'
				]">发送</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			content:null,
			focus:true
		};
	},
	methods: {
		blur(){
			debugger;
		}
	}
};
</script>

<style lang="scss" scoped>

.main{
	width: 100%;
	margin-top: 24rpx;
	
	.text-area{
		background-color: #f5f5f5;
		// padding: 24rpx;
		height: 300rpx;
		border-radius: 10rpx;
		margin-top: 20rpx;
		position: relative;
		border: 1rpx solid transparent;
		
		.btn-box{
			position: absolute;
			bottom: 20rpx;
			right: 20rpx;
			z-index: 10;
			
			.send{
				width: 140rpx;
				background-color: #27c050;
				color: #fff;
				text-align: center;
				line-height: 58rpx;
				border-radius: 6rpx;
				font-size: 28rpx;
			}
			
			.opacity-50{
				opacity: .5;
			}
		}
		
		textarea{
			padding: 16rpx;
			height: 100%;
			width: 100%;
			font-size: 28rpx;
			color: #333;
		}
	}
	
	.top-info{
		text{
			padding-left: 10rpx;
			font-size: 28rpx;
			color: #666;
		}
	}
}


</style>