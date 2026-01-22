<template>
	<view 
	class="no-data flex justify-center items-center flex-column"
	:style="{ margin }">
		<u--image src="/static/nodata.png" :width="size" height="auto" mode="widthFix"></u--image>
		<view class="no-text" v-if="showTitle">{{ text }}</view>
	</view>
</template>

<script>
export default {
	props:{
		showTitle:{
			type:Boolean,
			default:true
		},
		margin:{
			type:String,
			default:'280rpx 0'
		},
		text:{
			type:String,
			default:'暂无数据'
		},
		size:{
			type:String,
			default:'320rpx'
		}
	}
}
</script>

<style lang="scss" scoped>
.no-data{
	font-weight: 400;
	font-size: 24rpx;
	color: #666666;
	line-height: 28rpx;
	
	.no-text{
		padding-top: 28rpx;
	}
}
</style>