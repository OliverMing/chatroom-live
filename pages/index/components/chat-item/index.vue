<!-- z-paging聊天item -->

<template>
	<view class="chat-item">
		<view :class="{'chat-container':true,'chat-location-me':isMe}">
			<view class="chat-icon-container">
				<image class="chat-icon" :src="headimgurl" mode="aspectFill" @click="$emit('handler',item)" />
			</view>
			<view class="chat-content-container">
				<text :class="{'chat-user-name':true,'chat-location-me':isMe}">
					<text v-if="item.userInfo.role_id" class="label" :style="{ backgroundColor: getRole(item.userInfo.role_id,'color')}">{{ getRole(item.userInfo.role_id,'name') }}</text>
					{{ item.userInfo.nickname }}
				</text>
				<view class="chat-time">{{item.create_time}}</view>
				<view class="chat-text-container-super" :style="[{justifyContent:isMe?'flex-end':'flex-start'}]">
					<view :class="{
						'chat-text-container':true,
						'chat-text-container-me':isMe,
						'chat-text-container-quote':item.quote,
						'chat-image':isImageUrl(item.content)}">
						<image @click="previewImage(item.content)" v-if="isImageUrl(item.content)" :src="item.content" mode="widthFix" 
						style="max-width: 504rpx;height: auto;"></image>
						
						<div v-else-if="isVideo(item.content)">
							<video :src="item.content" style="width:520rpx;height:350rpx;object-fit: contain"></video>
						</div>
						<div v-else-if="isAudio(item.content)">
							<audio :src="item.content" controls></audio>
						</div>
						<text v-else :class="{'chat-text':true,'chat-text-me':isMe}">
							<u-parse :content="getHightContent(item.content)" @longpress="copy"></u-parse>
						</text>
						<!-- <u-parse :content="item.content"></u-parse> -->
						
						<view class="risk_tips" v-if="item.userInfo.risk_tips">
							{{ item.userInfo.risk_tips }}
						</view>
						
					</view>
				</view>
				
				<view class="quote" v-if="item.quote" @click="openQuote">
					<span v-if="isImageUrl(item.quote)">[图片]</span>
					<span v-else-if="isVideo(item.quote)">[视频]</span>
					<u-parse :content="item.quote" v-else></u-parse>
				</view>
				
				
				
			</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex'
import { baseUrl } from "@/config";

export default {
	name:"chat-item",
	props: {
		item: Object,
		roleList:Array,
		keywords:String
	},
	computed:{
		...mapState(["userInfo"]),
		
		
		getHightContent(){
			return e => {
				if(this.keywords){
					// 转义查询字符，防止特殊字符引起错误
					const escapedQuery = this.keywords.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
					const regex = new RegExp(escapedQuery, 'ig'); // 不区分大小写的全局匹配
					return e.replace(regex, match => `<span style="color: #3680f3;padding:0 6rpx">${match}</span>`);
				}
				return e;
			}
		},
		
		isMe(){
			let isme = false;
			if(this.item){
				return this.item.userInfo.id == this.userInfo.id;
			}
			return isme;
		},
		// 头像
		headimgurl(){
			return this.item.userInfo.headimgurl ? `${ this.item.userInfo.headimgurl.includes('//') ? '' :  `${baseUrl}/`}${this.item.userInfo.headimgurl}` :'/static/default.png'
		},
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
		getRole(){
			return(id,key) => {
				let str = "";
				if(this.roleList.length > 0){
					const item = this.roleList.find(e => e.id == id);
					str = item?.[key] ?? "";
				}
				return str;
			}
		}
	},
	data() {
		return {

		};
	},
	methods:{
		
		openQuote(){
			uni.$emit('quote',this.item.quote)
		},
		
		previewImage(url){
			uni.previewImage({
				urls:[url]
			})
		}
	}
}
</script>

<style lang="scss" scoped>
	
	.risk_tips{
		font-size: 24rpx;
		color: #888;
		margin-top: 12rpx;
		max-width: 540rpx;
		background-color: #eee;
		padding:12rpx;
		margin: -18rpx;
		margin-top: 18rpx;
		border-top: 2rpx solid #DDD;
	}
	
	.quote{
		font-size: 20rpx;
		background-color: rgba(0,0,0,.05);
		border-radius: 6rpx;
		margin-top: 12rpx;
		padding: 6rpx 10rpx;
		width: max-content;
		max-width: 300rpx;
		color: rgba(0,0,0,.6);
		/* 一行省略 */
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	
	.chat-item {
		display: flex;
		flex-direction: column;
		padding: 20rpx;
	}
	.chat-time {
		padding: 0rpx 0rpx 12rpx;
		font-size: 24rpx;
		color: #888;
	}
	.chat-container {
		display: flex;
		flex-direction: row;
	}
	.chat-location-me {
		flex-direction: row-reverse;
		text-align: right;
	}
	.chat-icon-container {
		margin-top: 12rpx;
	}
	.chat-icon{
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		border: 2rpx solid #eee;
		background-color: #eeeeee;
	}
	.chat-content-container {
		margin: 0rpx 15rpx;
	}
	.chat-user-name{
		font-size: 26rpx;
		color: #000;
		font-weight: bold;
	}
	.chat-text-container {
		text-align: left;
		color: #333;
		background-color: #FFF;
		border-radius: 8rpx;
		padding: 18rpx;
		margin-top: 12rpx;
		/* #ifndef APP-NVUE */
		max-width: 540rpx;
		/* #endif */
	}
	.chat-text-container-me {
		background-color: #007AFF;
	}
	
	.chat-text-container-quote {
		background-color: #eef6fe;
		/* color: #FFF; */
		
		.chat-text-me {
			color: #444 !important;
		}
	}
	
	.chat-image{
		// background-color: transparent;
	}
	
	.chat-text-container-super {
		display: flex;
		flex-direction: row;
	}
	.chat-text {
		font-size: 28rpx;
		line-height:44rpx;
		/* #ifndef APP-NVUE */
		word-break: break-all;
		/* #endif */
	}
	.chat-text-me {
		color: white;
	}
	
	.label{
		padding: 6rpx 16rpx;
		margin-right: 12rpx;
		font-size: 20rpx;
		color: rgba(255,255,255,.9);
		border-radius: 8rpx;
	}
</style>