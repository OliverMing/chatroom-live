<template>
	<view @click="hideWrite">
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
			
			<view class="comment">
				<text class="title">留言</text>
				<view class="input-box flex items-center" v-if="!showPageWrite" @click.stop="showPageWrite = true">
					<u--image :src="userInfo.headimgurl" width="60rpx" height="60rpx" radius="6rpx" />
					<view class="comment-input flex-1">
						<text>写留言</text>
					</view>
				</view>
				<MessageBoardWrite v-else />
			</view>
			
			<!-- 留言列表 -->
			<MessageBoardList />
			
		</view>
		
		<view class="footer flex justify-between items-center">
			<template v-if="!showBottomWrite">
				<view class="flex items-center">
					<u--image :src="info.cover" width="60rpx" height="60rpx" radius="200rpx" mode="aspectFill" />
					<view class="flex">
						<text class="room-name">{{ info.author }}</text>
						<span class="flag"></span>
					</view>
				</view>
				
				<view class="flex justify-end items-center">
					<view class="model-item flex items-center justify-center flex-column">
						<view class="cover-box flex items-center justify-center">
							<u--image src="/static/zan.png" width="34rpx" height="34rpx" />
						</view>
						<text>赞</text>
					</view>
					
					<view class="model-item flex items-center justify-center flex-column">
						<view class="cover-box flex items-center justify-center">
							<u--image src="/static/share.png" width="34rpx" height="34rpx" />
						</view>
						<text>分享</text>
					</view>
					
					<view class="model-item flex items-center justify-center flex-column">
						<view class="cover-box flex items-center justify-center">
							<u--image src="/static/shoucang.png" width="34rpx" height="34rpx" />
						</view>
						<text>推荐</text>
					</view>
					
					<view class="model-item flex items-center justify-center flex-column" @click.stop="openWrite">
						<view class="cover-box flex items-center justify-center">
							<u--image src="/static/liuyan.png" width="34rpx" height="34rpx" />
						</view>
						<text>写留言</text>
					</view>
				</view>
			</template>
			<!-- 留言输入框 -->
			<MessageBoardWrite v-else />
		</view>
	</view>
</template>

<script>
import {
	queryVipCourseDetails
} from '@/api';
import { mapState } from 'vuex'
import MessageBoardWrite from './MessageBoardWrite'
import MessageBoardList from './MessageBoardList'

export default {
	data() {
		return {
			info:null,
			style: {
			  // 字符串的形式
			  img:"margin-top:16rpx;width:100%",
			  span: "font-size: 30rpx",
			},
			
			showBottomWrite:false,
			showPageWrite:false
		};
	},
	components:{
		MessageBoardWrite,
		MessageBoardList
	},
	computed:{
		...mapState(["roomInfo","userInfo"])
	},
	onLoad({ id }) {
		uni.showLoading({
			mask:true
		});
		this.queryDetails(id);
	},
	methods: {
		
		hideWrite(){
			this.showBottomWrite = this.showPageWrite = false;
		},
		
		openWrite(){
			this.showBottomWrite = true;
			this.showPageWrite = false;
		},
		
		// 格式化阅读数
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

.footer{
	position: fixed;
	z-index: 500;
	background-color: #FFF;
	border-top: 1rpx solid rgba(0, 0, 0, .1);
	left: 0;
	bottom: 0;
	right: 0;
	padding: 24rpx 32rpx;
	padding-right: 20rpx;
	
	.model-item{
		font-size: 20rpx;
		text-align: center;
		
		.cover-box{
			width: 80rpx;
			height: 40rpx;
		}
	}
	
	.flag{
		display: block;
		background-image: url(https://res.wx.qq.com/op_res/nLnAiLrrETuU96Aym1ZDNjhMga6Fe1hiYp332DlZsT_u4THJyu8XegVlG723G5FblhAwxLO31iFVMkzq62jS3w);
		width: 28rpx;
		height: 28rpx;
		margin-left: 4rpx;
		background-size:cover;
		background-position: center;
		background-repeat: no-repeat;
	}
	
	.room-name{
		padding-left:16rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: #333;
	}
}

.container{
	// border-top: 1px solid #f0f0f0;
	padding:180rpx 32rpx;
	padding-top: 0;
	
	.comment{
		border-top: 1px solid rgba(0,0,0,.05);
		margin-top: 50rpx;
		padding-top: 32rpx;
		
		.title{
			font-weight: bold;
			font-size: 28rpx;
		}
		
		.input-box{
			margin-top: 42rpx;
			
			.comment-input{
				margin-left: 16rpx;
				padding:24rpx;
				background-color: rgba(0,0,0,.035);
				border-radius: 10rpx;
				font-size: 26rpx;
				color: rgba(0,0,0,.3);
			}
		}
		
	}
	
	
	
	.read-box{
		margin-top:36rpx;
		font-size: 26rpx;
		color: rgba(0,0,0,.4);
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