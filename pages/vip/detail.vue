<template>
	<view>
		<CustomHeader title="" :border="false" />
		<view class="container" v-if="info">
			<view class="top-info">
				<view class="title">{{ info.title }}</view>
				<view class="flex-1 subsection">
					<text class="yuanchuang">原创</text>
					<text class="doctor" v-if="info.author">{{ info.author }}</text>
					<text class="time">{{ info.create_time }}</text>
					<text class="ip" v-if="info.address">{{ info.address }}</text>
				</view>
			</view>
			
			<u-parse :content="info.content" :tagStyle="style"></u-parse>
			
			<view class="read-box">
				阅读 {{ formatCount(info.read_count || 0) }}
			</view>
			
			<view class="comment-input">
				<input placeholder="留言" />
			</view>
		</view>
	</view>
</template>

<script>
import {
	queryVipCourseDetails
} from '@/api';

export default {
	data() {
		return {
			info:null,
			style: {
			  // 字符串的形式
			  img:"margin-top:16rpx;width:100%",
			  span: "font-size: 30rpx",
			},
		};
	},
	onLoad({ id }) {
		uni.showLoading({
			mask:true
		});
		this.queryDetails(id);
	},
	methods: {
		
		formatCount(count){
			// 转换成万
			if(count > 10000){
				return (count / 10000).toFixed(1) + '万';
			}
			return count;
		},
		
		queryDetails(id){
			queryVipCourseDetails(id).then(res => {
				if(res.data){
					this.info = res.data;
					uni.hideLoading();
				}else{
					uni.showToast({
						title: "暂无数据",
						icon: 'none'
					})
				}
			})
		}
	},
};
</script>

<style lang="scss" scoped>
.container{
	// border-top: 1px solid #f0f0f0;
	padding:68rpx 32rpx;
	padding-top: 0;
	
	.read-box{
		margin-top:36rpx;
		font-size: 26rpx;
		color: #666;
	}
	
	.top-info{
		margin-bottom: 32rpx;
		
		.subsection{
			font-size: 26rpx;
			color: #666;
			margin-top: 24rpx;
			
			.yuanchuang{
				background-color: #ededed;
				padding: 4rpx 12rpx;
				margin-right: 18rpx;
				font-size: 22rpx;
				border-radius: 3rpx;
			}
			
			.doctor{
				color: #0b387d;
				padding-right: 18rpx;
			}
			
			.time{
				padding-right: 18rpx;
			}
		}
		
		.title{
			font-weight: 500;
			font-size: 34rpx;
			text-align: justify;
		}
	}
	
	
}
</style>