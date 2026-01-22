<template>
	<view class="list-main">
		<view class="item flex j" v-for="(item,index) in 1">
			<u--image src="/static/srzs_logo.jpg" width="60rpx" height="60rpx" radius="6rpx" />
			<view class="right-box flex-1">
				<view>
					<text>{{ userInfo.nickname }}</text>
					<text class="time">8小时前</text>
				</view>
				<view class="content">
					可以的，一键下单预约，就有顺丰小哥上门取送洗衣物，送往中央工厂专业洗护，洗净后直接寄回，全程包邮~
				</view>
			</view>
		</view>
	</view>
</template>

<script>
</script>

<style lang="scss" scoped>
.list-main{
	padding-top: 48rpx;
	
	.item{
		margin-bottom: 48rpx;
		
		.right-box{
			padding-left: 18rpx;
			color: #888;
			font-size: 26rpx;
			
			.content{
				color: #333;
				margin-top: 10rpx;
				line-height: 42rpx;
			}
			
			.time{
				padding-left: 20rpx;
			}
		}
	}
	
	
}
</style>