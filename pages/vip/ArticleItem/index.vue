<template>
	<view class="" @click="jumpDetail">
		<view class="item-box" v-if="item.cover">
			<u-image :src="item.cover" width="100%" height="400rpx" mode="aspcetFill"></u-image>
			<view class="title">
				{{ item.title }}
			</view>
		</view>
		
		<view class="no-cover flex items-center" v-else>
			<view class="flex-1">{{ item.title }}</view>
			<image :src="channel.imgUrl" mode="aspectFill"></image>
		</view>
	</view>
</template>

<script>
export default {
	props:{
		item:Object,
		channel:Object
	},
	data() {
		return {
			
		};
	},
	methods: {
		jumpDetail(){
			uni.navigateTo({
				url:`/pages/vip/detail?id=${this.item.id}`
			})
		}
	},
	created() {
		
	}
}
</script>

<style lang="scss" scoped>

.no-cover{
	padding: 20rpx;
	background-color:#ecedef;
	font-size:28rpx;
	
	image{
		width: 100rpx;
		height: 100rpx;
		border-radius: 10rpx;
		margin-left: 10rpx;
	}
}

.item-box{
	position: relative;
	&::after{
		content: "";
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 100rpx;
		background: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.4) 100%);
	}
	
	.title{
		position: absolute;
		left: 0;
		right: 0;
		bottom: 24rpx;
		color: #fff;
		font-size:26rpx;
		padding: 0 16rpx;
		z-index: 9;
		// 两行
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
}
</style>