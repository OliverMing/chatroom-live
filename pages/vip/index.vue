<template>
	<z-paging
	ref="paging"
	hide-empty-view 
	safe-area-inset-bottom
	v-model="list"
	@query="queryList">
	   <template slot="top">
		<CustomHeader title="我的VIP服务"
		:placeholder="false"

		:showBack="showBack"
		theme="white"
		background="rgba(0,0,0,0)" 
		@height="topHeight = $event" />
		<view class="top-info" :style="{paddingTop:`${topHeight}px`}">
			<view class="userinfo flex items-center">
				<image class="avatar" :src="userInfo.headimgurl" mode="aspectFill"></image>
				<view class="flex-1 right-info">
					<view class="flex items-center">
						<text>{{ userInfo.nickname }}</text>
						<image v-if="studyTime" src="/static/vip.png" mode="widthFix" class="vip-logo"></image>
					</view>
					<view class="time">学习时长：{{ studyTime }}天</view>
				</view>
			</view>
		</view>
		<view class="tabs-box">
			<u-tabs keyName="label"
			:current="current"
			:list="navList" 
			@change="changeCurrent"></u-tabs>
		</view>
	   </template>
	   
	   <template v-if="navList.length > 0">
	   	  <!-- 文字课 -->
	   	  <TextRoomItem :roomInfo="roomInfo"  v-if="!current" />
	   	  <!-- 其他课 -->
	   	  <template v-else>
	   	  		   <view class="items-box" 
				   v-for="(item,index) in list" :key="index" @click="readHandler(item)">
	   	  			   <component 
	   	  			   :is="componentsArray[current]"
	   	  			   :index="index" 
	   	  			   :item="item"
					   :channel="getConfig" />
	   	  		   </view>
				   
	   	  		   <!-- 无数据 -->
	   	  		   <CustomEmpty v-if="list.length == 0" />
	   	  </template>
	   </template>
	  
	</z-paging>
</template>

<script>
import moment from 'moment';
import TextRoomItem from './TextRoomItem'
import VideoItem from './VideoItem'
import ArticleItem from './ArticleItem'
import FileItem from './FileItem'

import { 
	GetVipChatRoomInfo,
	GetChatFileTypeList,
	GetVipCourseList,
	GetLiveShareConfigList,
	ReadVipFile
} from '@/api'
import wx from '@/utils/wx'

export default {
	components:{
		TextRoomItem,
		VideoItem,
		FileItem,
		ArticleItem
	},
	data(){
		return {
			showBack:false, // 获取路由长度
			topHeight:0,
			current:0,
			list:[],
			navList: [],
			shareConfigList:[], // 分享配置
			componentsArray:{
				1:"VideoItem",
				2:"ArticleItem",
				3:"ArticleItem",
				4:"FileItem",
				5:"ArticleItem"
			}
			// componentsArray:{
			// 	1:"VideoItem",
			// 	2:"TheoryItem",
			// 	3:"ArticleItem",
			// 	4:"ResearchItem",
			// 	5:"StrategiesItem"
			// }
		}
	},
	watch:{
		current(val){
			uni.showLoading({ mask:true });
			this.$refs.paging.reload();
		}
	},
	computed:{
		studyTime(){
			const days = moment().diff(moment(this.userInfo.vipStartTime), 'days')
			return days > 0 ? days : 0;
		},
		
		getConfig(){
			if(this.roomInfo){
				const item = this.shareConfigList.find(e => e.id == this.roomInfo.channel_id);
				return item || {}
			}
			return {};
		}
		
	},
	onLoad() {
		uni.showLoading({
			mask:true
		});
		// 获取当前页面栈
		const pages = getCurrentPages()
		this.showBack = pages.length > 1;
		if(this.userInfo.vipRoomId){
			this.getVipChatRoomInfoApi();
		}
		wx.initWxConfig(true);
		this.getChatFileTypeList();
		this.getLiveShareConfigList();
	},
	methods:{
		
		readHandler(e){
			ReadVipFile({
				id:e.id,
				userId:this.userInfo.id
			})
		},
		
		getLiveShareConfigList(){
			GetLiveShareConfigList().then(({ data }) => {
				this.shareConfigList = data;
			})
		},
		
		// 获取栏目类型
		getChatFileTypeList(){
			GetChatFileTypeList().then(({ data }) => {
				this.navList = data.sort((a,b) => a.sort - b.sort);
			})
		},
		
		// 分页触发
		queryList(pageId,pageSize){
			if(this.current == 0){
				this.getVipChatRoomInfoApi();
				this.$refs.paging.complete([]);
			}else {
				this.queryListApi(pageId,pageSize);
			}
		},
		
		// 获取课程列表
		queryListApi(pageId,pageSize){
			GetVipCourseList({
				pageId,
				pageSize,
				code:this.roomInfo.code,
				type:this.navList[this.current].id
			}).then(({ data }) => {
				this.$refs.paging.complete(data);
				uni.hideLoading();
			}).catch(() => {
				this.$refs.paging.complete([]);
			})
		},
		
		getVipChatRoomInfoApi(){
			GetVipChatRoomInfo(this.userInfo.vipRoomId).then(({ data }) => {
				if(data){
					uni.setStorageSync("roomInfo",data);
					uni.setStorageSync("room-code",data.code);
					this.$store.commit('SET_VALUE', {
						key: "roomInfo",
						value:data
					});
				}
				uni.hideLoading();
			}).catch(() => {
				uni.removeStorageSync("roomInfo");
				uni.removeStorageSync("room-code");
				this.$store.commit('SET_VALUE', {
					key: "roomInfo",
					value:null
				});
			})
		},
		
		changeCurrent(e){
			this.current = e.index;
		}
	}
}
</script>

<style lang="scss" scoped>
page{
	background-color: #f8f8f8;
}

.items-box{
	padding: 0 32rpx;
	padding-top: 24rpx;
}

.tabs-box{
	background-color: #FFF;
	padding-bottom: 10rpx;
}
	
.top-info{
	background: $base-color;
	position: relative;
	padding-bottom: 32rpx;
	
	.userinfo{
		padding: 24rpx 32rpx;
		
		.right-info{
			padding-left: 24rpx;
			font-size: 32rpx;
			color: #FFF;
			font-weight: bold;
			
			.vip-logo{
				width: 100rpx;
				margin-left: 12rpx;
			}
			
			.time{
				opacity: .7;
				font-weight: normal;
				font-size: 28rpx;
				margin-top: 12rpx;
			}
		}
		
		.avatar{
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
		}
	}
}
</style>