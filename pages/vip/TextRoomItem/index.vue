<template>
	<view class="item" v-if="roomInfo">
		
		<view class="label">
			VIP文字课程
		</view>
		
		<view class="content">
			<view class="flex items-center">
				<u--image :src="roomInfo.vip_room_avatar" width="100rpx" height="100rpx" radius="80rpx" />
				<view class="flex-1 right-info">
					<view class="title">{{ roomInfo.room_name }}</view>
					<view class="sub-title">{{ roomInfo.vip_room_desc }}</view>
				</view>
				<view class="into-btn" @click="into">立即进入</view>
			</view>
			
			<view class="end-time">
				VIP到期时间：{{ userInfo.vipEndTime }}
			</view>
		</view>
	</view>
	<CustomEmpty v-else />
</template>

<script>
export default {
	methods:{
		into(){
			uni.navigateTo({
				url:`/pages/index/index?vip=1`
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.item{
	margin: 32rpx;
	background-color: #FFF;
	border-radius: 16rpx;
	box-shadow: 0rpx 8rpx 28rpx rgba(0,0,0,.1);
	overflow-x: hidden;
	
	.label{
		padding: 12rpx 24rpx;
		margin-bottom: 12rpx;
		background:linear-gradient(to right, $base-color, #a2c5fd);
		font-size: 24rpx;
		color: #FFF;
	}
	
	.content{
		padding: 24rpx;
		padding-bottom: 32rpx;
		
		.end-time{
			font-size: 20rpx;
			color: #6e6e6e;
			background-color: #d6deeb;
			width: max-content;
			padding: 8rpx 24rpx;
			margin-top:24rpx;
			border-radius: 6rpx;
		}
		
		.into-btn{
			padding: 8rpx 24rpx;
			background-color: $base-color;
			border-radius: 80rpx;
			color: #FFF;
			font-size: 24rpx;
		}
		
		.right-info{
			padding-left: 24rpx;
			
			.title{
				font-size: 28rpx;
				font-weight: 500;
			}
			.sub-title{
				margin-top: 8rpx;
				font-size: 24rpx;
				color: #000;
				opacity: .5;
			}
		}
	}
}
</style>