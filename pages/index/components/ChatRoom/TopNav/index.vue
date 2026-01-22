<template>
	<view class="scroll-msg" style="padding-bottom: 10rpx;background-color: #3680f3;">
		<u-notice-bar v-if="roomInfo.notice_message" :text="roomInfo.notice_message" bgColor="rgba(0,0,0,0)" color="#FFF"></u-notice-bar>
		<u-tabs 
		style="border-top: 1rpx solid rgba(255,255,255,.1);"
		:scrollable="false"
		:current="msgCurrent" 
		:list="chatMessageNavList"
		:activeStyle="{ color:'#FFF',fontWeight:500 }"
		:inactiveStyle="{ color:'rgba(255,255,255,.6)' }" 
		lineColor="#FFF" 
		@click="msgCurrent = $event.index"></u-tabs>
	</view>
</template>

<script>
export default {
	props:{
		roomInfo:{
			type:Object,
			default:{
				
			}
		}
	},
	data(){
		return {
			msgCurrent:1,//消息类型索引
			chatMessageNavList:[
				{ name:'只看老师', },
				{ name:'全部', },
				{ name:'我的消息', },
				{ name:'文件下载' },
			],
		}
	}
}
</script>

<style>
</style>