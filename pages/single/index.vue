<template>
	<z-paging 
	:auto="false"
	ref="chats"
	v-model="dataList" 
	loading-more-enabled
	use-chat-record-mode
	refresher-enabled 
	hide-empty-view 
	safe-area-inset-bottom
	bottom-bg-color="#f8f8f8" 
	@query="queryList" 
	@keyboardHeightChange="keyboardHeightChange"
	@hidedKeyboard="hidedKeyboard">
	
	   <template #top>
	   	  <CustomHeader title="私信" :fixed="false" :placeholder="false"  />
	   </template>
	
		<!-- for循环渲染聊天记录列表 -->
		<view v-for="(item,index) in dataList" :key="index" style="position: relative;">
			<view style="transform: scaleY(-1);">
				<chat-item :item="item"></chat-item>
			</view>
		</view>
		
		<view v-if="dataList.length == 0" style="transform: scaleY(-1);">
			<CustomEmpty margin="300rpx 0" />
		</view>
	
		<!-- 底部聊天输入框 -->
		<template #bottom>
			<chat-input-bar single ref="inputBar" @send="doSend" />
		</template>
	</z-paging>
</template>

<script>
import { GetSingleChatList,InsertSingleChat,GetSystemUserInfo } from '@/api'
import chatInputBar from '@/pages/index/components/chat-input-bar'
import chatItem from '@/pages/index/components/chat-item'

export default {
	components:{
		chatInputBar,
		chatItem
	},
	data() {
		return {
			dataList: [],
			herInfo:{}, // 对方信息
		}
	},
	onLoad() {
		uni.$on('single', this.handleSocketMessage);
		
		// this.roomInfo.creators
		// 获取当前房间的用户信息
		GetSystemUserInfo(this.roomInfo.creators).then(({ data }) => {
			this.herInfo = data;
			this.$refs.chats.reload();
		})
	},
	onUnload() {
		uni.$off('group', this.handleSocketMessage);
	},
	methods:{

		// 页面侧的 socket 消息处理，通过 uni.$on 接收
		handleSocketMessage(params) {
			this.$refs.chats && this.$refs.chats.addChatRecordData(params);
		},
		
		// 监听键盘高度改变，请不要直接通过uni.onKeyboardHeightChange监听，否则可能导致z-paging内置的键盘高度改变监听失效（如果不需要切换表情面板则不用写）
		keyboardHeightChange(res) {
			this.$refs.inputBar.updateKeyboardHeightChange(res);
		},
		
		// 用户尝试隐藏键盘，此时如果表情面板在展示中，应当通知chatInputBar隐藏表情面板（如果不需要切换表情面板则不用写）
		hidedKeyboard() {
			this.$refs.inputBar.hidedKeyboard();
		},
		
		queryList(pageNo, pageSize) {
			if (pageNo == 1) uni.showLoading({ mask: true });
		
			const params = {
				pageNo,
				pageSize,
				userId:this.userInfo.id
			}
		
			GetSingleChatList(params).then(({ data }) => {
				data.forEach(e => {
					if(e.formId != this.userInfo.id){
						e.userInfo = {
							...e.userInfo,
							...{
								nickname:this.herInfo.chatroom_name || '老师助理',
								headimgurl:this.herInfo.head_img
							}
						};
					}
				})
				uni.hideLoading();
				this.$refs.chats.complete(data);
			}).catch(() => {
				this.$refs.chats.complete(false);
			})
		},
		
		// 发送新消息
		doSend(content) {
			uni.showLoading({ title: '发送中...', mask: true });
			InsertSingleChat({
				formId: this.userInfo.id,
				toId:this.roomInfo.creators,
				content
			}).then(({
				data
			}) => {
				uni.hideLoading();
				this.$refs.chats.addChatRecordData(data);
				
				const params = {
					...data,
					type: 'single',
					userId: this.roomInfo.creators
				}
				
				uni.sendSocketMessage({
					data: JSON.stringify(params)
				});
			})
		}
	}
}
</script>

<style>
</style>