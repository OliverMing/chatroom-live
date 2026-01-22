<template>
	<view>
		<view v-if="userInfo && roomInfo && showCommonChatRoom">
			<template v-if="!userInfo.is_black">
				<z-paging ref="paging" :auto="false" 
				v-model="dataList" :use-chat-record-mode="!current"
					:loading-more-enabled="!current" 
					bgColor="rgba(0,0,0,.04)"
					:refresher-enabled="!current" hide-empty-view safe-area-inset-bottom
					bottom-bg-color="#f8f8f8" @query="queryList" @keyboardHeightChange="keyboardHeightChange"
					@hidedKeyboard="hidedKeyboard">
					<template #top>

						<view class="header">
							<view :style="{height:`${ws.safeAreaInsets.top}px`}"></view>
							
							
							<view class="flex items-center">
								<view class="back" v-if="isVipInto" @click="back">
									<image src="/static/back-white.png" style="width: 35rpx;height: 35rpx;"></image>
								</view>
								
								<view class="" style="position: relative;">
									<view class="socket-status-box">
										<view
											:class="['socket-status', isConnected ? 'socket-status-online' : 'socket-status-offline']">
										</view>
									</view>
									<u-tabs :current="current" :list="navList"
									:activeStyle="{ color:'#fff',fontWeight:900,fontSize:'32rpx' }"
									:inactiveStyle="{ color:'rgba(255,255,255,.6)' }" lineColor="#fff" @click="current = $event.index"></u-tabs>
								</view>
									
								<view class="right-box flex justify-center items-center">
									<image src="/static/search.png" @click="jumpSearch"></image>
									<template v-if="!isVipInto">
										<image src="/static/setting.png" @click="showSetting = true"></image>
										<image class="avatar" :src="userInfo.headimgurl" mode="aspectFill" @click="jumpVip"></image>
									</template>
								</view>
							</view>
						</view>
						
						<!-- <CustomHeader v-else
						:title="roomInfo.room_name"
						:fixed="false"
						:placeholder="false"
						theme="white"
						background="#3680f3">
						  <view slot="right">
							  <view
							  	:class="['socket-status', isConnected ? 'socket-status-online' : 'socket-status-offline']">
							  </view>
						  </view>
						</CustomHeader> -->
		
						<view class="scroll-msg" style="padding-bottom: 10rpx;background-color: #3680f3;" v-if="!current">
							<u-notice-bar v-if="roomInfo.notice_message" :text="roomInfo.notice_message" bgColor="rgba(0,0,0,0)" color="#FFF"></u-notice-bar>
							<u-tabs 
							style="border-top: 1rpx solid rgba(255,255,255,.1);"
							:scrollable="false"
							:current="msgCurrent" :list="chatMessageNavList"
							:activeStyle="{ color:'#FFF',fontWeight:500 }"
							:inactiveStyle="{ color:'rgba(255,255,255,.6)' }" 
							lineColor="#FFF" 
							@click="msgCurrent = $event.index"></u-tabs>
						</view>
		
						<template v-if="roomInfo.id && current">
							<LivePerformance :roomInfo="roomInfo" v-if="current == 1" />
							<EaeryDayBenefit :code="roomInfo.code" v-else-if="current == 2" />
						</template>
						
					</template>
					<template v-if="current == 0">
						<template v-if="msgCurrent != 3">
							<!-- for循环渲染聊天记录列表 -->
							<view v-for="(item,index) in dataList" :key="index" style="position: relative;">
								<view style="transform: scaleY(-1);">
									<chat-item :item="item" :roleList="roleList" @handler="handler"></chat-item>
									<view class="flex justify-center items-center tips" v-if="index == 0">
										—— 股市有风险，入市需谨慎 ——
									</view>
								</view>
							</view>
						</template>
						<view v-else style="transform: scaleY(-1);">
							<FileList :list="dataList" />
						</view>
						<view v-if="dataList.length == 0" style="transform: scaleY(-1);">
							<CustomEmpty margin="300rpx 0" />
						</view>
					</template>
		
					<!-- <u-empty marginTop="300rpx" mode="search" text="暂无内容,敬请期待" v-else /> -->
		
					<!-- 底部聊天输入框 -->
					<template v-if="!current && msgCurrent != 3" #bottom>
						<chat-input-bar ref="inputBar" @send="doSend" :disabled="roomInfo.forbit_chat == 1" />
					</template>
				</z-paging>
				<!-- 右侧按钮组 -->
		
				
				<!-- 用户操作 -->
				<u-action-sheet :actions="actionList" title="操作" cancelText="取消" :show="showAction"
					:closeOnClickAction="false" @close="showAction = false" @select="selectClick"></u-action-sheet>
		
				<!-- 设置 -->
				<u-action-sheet :actions="settingList" title="设置" cancelText="取消" :show="showSetting"
					@close="showSetting = false" @select="selectSetting"></u-action-sheet>
			</template>
		
			<!-- 黑名单用户 -->
			<view class="flex justify-center items-center flex-column limit-box" v-else>
				<u-empty mode="permission" text="你已被限制进入本群组" textSize="18"></u-empty>
			</view>
		</view>
		<!-- 如果没有邀请码或者已过期则谈起填写 -->
		<InviteCodeMode v-if="userInfo && showCommonChatRoom" ref="inviteCodeMode" @refresh="setRoomInfo" />
		<!-- 引用预览 -->
		<PrevQuote />
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import {
		navList
	} from '@/config'
	import {
		Login,
		LoginByCid,
		GetChatList,
		GetliveChatFileList,
		InsertChat,
		GetLiveRoleList,
		SetUserBlackStatus,
		IsHaveNewMessage,
		GetLiveChildrenUrl
	} from '@/api'
	import chatInputBar from './components/chat-input-bar'
	import chatItem from './components/chat-item'
	import InviteCodeMode from './components/InviteCodeMode'
	import LivePerformance from './components/LivePerformance'
	import EaeryDayBenefit from './components/EaeryDayBenefit'
	import FileList from  './components/FileList'
	import PrevQuote from  './components/PrevQuote'
	import wx from '@/utils/wx'
	import socketService from '@/utils/socket'
	import moment from 'moment'

	export default {
		data() {
			return {
				dataList: [],
				current: 0, //当前索引
				msgCurrent:1,//消息类型索引
				
				isVipInto:false, // 是否VIP进入
				ws: uni.getSystemInfoSync(),
				navList,
				stockCurrent: 0,
				stockNav: [{
						name: "关注中"
					},
					{
						name: "取消的"
					},
					{
						name: "查看全部"
					}
				],
				chatMessageNavList:[
					{ name:'只看老师', },
					{ name:'全部消息', },
					{ name:'我的消息', },
					{ name:'文件下载' },
				],
				roleList: [],
				cid: null,
				channel:'',
				handlerItemUserInfo: null,
				showAction: false,
				actionList: [{
					name: '拉入黑名单',
					loading: false
				}],
				showSetting: false,
				settingList: [{
						name: '刷新房间',
						fn: "refreshRoom"
					},
					{
						name: '退出房间',
						color: '#d44a40',
						fn: "offLine"
					}
				],
				
				showCommonChatRoom:false, // 是否显示群聊组件
				isConnected: false, // WebSocket连接状态
			}
		},
		components: {
			chatInputBar,
			chatItem,
			InviteCodeMode,
			LivePerformance,
			EaeryDayBenefit,
			FileList,
			PrevQuote
		},
		computed: {
			...mapState(['userInfo'])
		},
		watch:{
			msgCurrent(val){
				this.$refs.paging.reload();
			}
		},
		onLoad(options) {
			if(options.channel){
				// 分享配置的参数
				this.channel = options.channel;
				uni.setStorageSync('channel',options.channel);
			}

			if(options.vip){
				this.isVipInto = this.showCommonChatRoom = true;
				const viproom = uni.getStorageSync('roomInfo');
				this.setRoomInfo(viproom);
			}else  if (options.cid) {
				this.cid = options.cid;
				this.getUserInfo();
			} else {
				this.initLogin(options);
			}
			this.getLiveRoleListApi();
			wx.initWxConfig(true);
			this.initSocketListeners();
		},
		onUnload() {
			this.removeSocketListeners();
			socketService.closeWebSocket(true);
			this.isConnected = false;
		},
		methods: {
			
			back(){
				uni.navigateBack()
			},
			
			jumpVip(){
				if(!this.userInfo.vipRoomId){
					return uni.showToast({
						title:"请先成为订阅用户",
						icon:"none"
					})
				}
				
				const vipEndTime = moment(this.userInfo.vipEndTime);
				const now = moment();
				if(vipEndTime.isBefore(now)){
					return uni.showToast({
						title:"服务已到期，请联系客服",
						icon:"none"
					})
				}
				
				uni.navigateTo({
					url:'/pages/vip/index'
				})
				
			},
			
			jumpSearch(){
				uni.navigateTo({
					url:'/pages/search/index'
				})
			},

			// 初始化 / 移除 socket 事件监听（页面侧用 uni.$on 接收）
			initSocketListeners() {
				uni.$on('socket-open', this.handleSocketOpen);
				uni.$on('socket-close', this.handleSocketClose);
				uni.$on('group', this.handleSocketMessage);
			},

			removeSocketListeners() {
				uni.$off('socket-open', this.handleSocketOpen);
				uni.$off('socket-close', this.handleSocketClose);
				uni.$off('group', this.handleSocketMessage);
			},

			handleSocketOpen() {
				this.isConnected = true;
			},

			handleSocketClose() {
				this.isConnected = false;
			},

			// 页面侧的 socket 消息处理，通过 uni.$on 接收
			handleSocketMessage(params) {
				if (!params) return;
				if (params.fn) {
					// 拉黑、禁言之类的
					switch (params.fn) {
						case "forbit_chat":
							this.roomInfo.forbit_chat = params.data;
							break;
						case "black":
							this.offLine();
							const u = this.userInfo;
							u.is_black = 1;
							this.$store.commit('SET_VALUE', {
								key: "userInfo",
								value: u
							});
							break;
					}
				} else {
					// 如果后台审核的自己的消息则跳过
					if(params.userInfo.id == this.userInfo.id) return;
					this.$refs.paging && this.$refs.paging.addChatRecordData(params);
				}
			},
			
			
			// 根据cid获取用户信息
			getUserInfo() {
				LoginByCid(this.cid).then(({ data }) => {
					uni.hideLoading();
					this.$store.commit('SET_VALUE', {
						key: "userInfo",
						value: data
					})
					uni.setStorageSync('userInfo', data);
					this.isVipJump();
				})
			},
			
			// 判断如果是Vip则直接跳转VIP页面
			isVipJump(){
				// 判断如果是合作用户则这直接跳转VIP页面
				if(!this.userInfo) return false;
				if(this.userInfo.vipRoomId){
					// 需要判断vip用户到期时间是否小于当前时间
					const vipEndTime = moment(this.userInfo.vipEndTime);
					const now = moment();
					if(vipEndTime.isBefore(now)){
						// 会员到期后需要删除
						this.deleteRoomInfo();
					}else{
						uni.redirectTo({
							url:'/pages/vip/index'
						})
					}
					return false;
				}
				this.deleteRoomInfo();
			},
			
			deleteRoomInfo(){
				// 会员到期后需要删除
				const rooms = uni.getStorageSync('roomInfo');
				if(rooms.is_vip_room){
					uni.removeStorageSync("roomInfo");
					uni.removeStorageSync("room-code");
					this.$store.commit('SET_VALUE', {
						key: "roomInfo",
						value: null
					})
				}
				this.showCommonChatRoom = true;
			},

			// 点击用户头像操作
			handler(item) {
				// if (this.userInfo.role_id != 0 && item.userInfo.role_id == 0) {
				// 	this.handlerItemUserInfo = item.userInfo;
				// 	this.actionList[0].name = item.userInfo.is_black ? '解除黑名单' : '拉入黑名单';
				// 	this.showAction = true;
				// }
			},

			// 刷新房间
			refreshRoom() {
				location.reload();
			},

			selectSetting(e) {
				this.showSetting = false;
				setTimeout(() => {
					this[e.fn]();
				}, 300)
			},

			selectClick(e) {
				e.loading = true;
				const {
					chat_id,
					is_black
				} = this.handlerItemUserInfo;
				const status = is_black == 1 ? 0 : 1;
				SetUserBlackStatus(chat_id, status).then(() => {
					e.loading = false;
					this.showAction = false;
					this.$refs.paging.reload();
				})
			},

			// 获取角色列表
			getLiveRoleListApi() {
				GetLiveRoleList().then(res => {
					this.roleList = res.data;
				})
			},

			initLogin(options) {
				if (!this.userInfo) {
					if (!options.code) {
						// #ifdef H5
						let local = encodeURIComponent(window.location.href);
						const urls = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9e6666dfb7c0165d&redirect_uri=${local}&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect`;
						location.href = urls
						// #endif
					} else {
						uni.showLoading({ mask: true })
						Login(options.code).then(({
							data
						}) => {
							uni.hideLoading();
							this.cid = data.chat_id;
							// 跳转二级域名并附带cid以及渠道
							this.jumpChindrenDomin();
							// if (data.openid || data.id) {
							// 	this.$store.commit('SET_VALUE', {
							// 		key: "userInfo",
							// 		value: data
							// 	})
							// 	uni.setStorageSync('userInfo', data);
							// 	this.cid = data.chat_id;
							// 	this.isVipJump();
							// } else location.href = `//${window.location.hostname}`;
						})
						wx.initWxConfig(true);
					}
				}else{
					this.cid = this.userInfo.chat_id;
					// 跳转二级域名并附带cid以及渠道
					this.jumpChindrenDomin();
					// this.getUserInfo()
				}
			},
			
			// 二级域名跳转
			jumpChindrenDomin(){
				GetLiveChildrenUrl().then(({ data }) => {
					if(data && data.url){
						window.location.href = `${data.url}?channel=${this.channel}&cid=${this.cid}`
					}
				}).catch(() => {
					this.getUserInfo()
				})
			},

			offLine() {
				socketService.closeWebSocket(true);
				uni.removeStorageSync('room-code');
				uni.removeStorageSync('userInfo');
				this.current = 0;
				uni.removeStorageSync("roomInfo");
				this.$store.commit('SET_VALUE', {
					key: "roomInfo",
					value:null
				});
				this.dataList = [];
				this.$refs.inviteCodeMode.open();
			},

			// 获取到了房间信息
			setRoomInfo(e) {
				this.$nextTick(() => {
					this.$refs.paging.reload();
					socketService.connectWebSocket({
						userInfo: this.userInfo,
						roomInfo: this.roomInfo
					});
				})
			},
			
			queryList(pageNo, pageSize) {
				if (pageNo == 1) uni.showLoading({ mask: true });
				
				let oid = 0;
				if(this.msgCurrent == 0) oid = this.roomInfo.creators;
				else if(this.msgCurrent == 2) oid = this.userInfo.openid;
				const params = {
					pageNo,
					pageSize,
					code: this.roomInfo.code,
					oid
				}
				
				const fn = this.msgCurrent == 3 ? GetliveChatFileList : GetChatList;
				fn(params).then(({
					data
				}) => {
					uni.hideLoading();
					this.$refs.paging.complete(data.records || data || []);
				}).catch(() => {
					this.$refs.paging.complete(false);
				})
			},
			// 监听键盘高度改变，请不要直接通过uni.onKeyboardHeightChange监听，否则可能导致z-paging内置的键盘高度改变监听失效（如果不需要切换表情面板则不用写）
			keyboardHeightChange(res) {
				this.$refs.inputBar.updateKeyboardHeightChange(res);
			},
			// 用户尝试隐藏键盘，此时如果表情面板在展示中，应当通知chatInputBar隐藏表情面板（如果不需要切换表情面板则不用写）
			hidedKeyboard() {
				this.$refs.inputBar.hidedKeyboard();
			},
			
			// 发送新消息
			doSend(content) {
				if (this.userInfo.is_black) {
					uni.showToast({
						title: "你已被限制发送消息",
						icon: 'none'
					})
				} else {
					uni.showLoading({
						title: '发送中...',
						mask: true
					});
					InsertChat({
						code: this.roomInfo.code,
						content,
						openid: this.userInfo.openid || this.userInfo.id
					}).then(({
						data
					}) => {
						uni.hideLoading();
						this.$refs.paging.addChatRecordData(data);
						
						// 如果当前用户有消息上屏权限则直接发送ws
						if(this.userInfo.msg_screen){
							const params = {
								...data,
								type: 'group',
								userId: this.roomInfo.creators
							}
							
							uni.sendSocketMessage({
								data: JSON.stringify(params)
							});
						}
						
						// 发送消息到后台管理哪里去。
						const params = {
							...data,
							type: 'single',
							userId: this.roomInfo.creators
						}
						uni.sendSocketMessage({
							data: JSON.stringify(params)
						});
						
					});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	.back{
		padding: 10rpx 0 10rpx 32rpx;
		
		image{
			margin-top: 10rpx;
		}
	}
	
	.socket-status-box {
		position: absolute;
		top: 0rpx;
		left: 58rpx;
	}

	.socket-status {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		margin-right: 20px;

		&-online {
			background-color: #52c41a;
			// 动画效果
			animation: online 1s infinite;
		}

		&-offline {
			background-color: #f5222d;
		}
	}

	@keyframes online {
		0% {
			box-shadow: 0 0 0 0 rgba(82, 196, 26, 0.7);
		}

		70% {
			box-shadow: 0 0 0 10px rgba(82, 196, 26, 0);
		}
	}

	.limit-box {
		height: 100vh;
	}

	.header {
		background-color: #3680f3;
		font-size: 20rpx;
		padding: 20rpx 20rpx 10rpx 0;
		color: white;
		position: relative;
	}

	.tips {
		font-size: 24rpx;
		color: #ccc;
		padding: 30rpx 0;
	}

	.stock-nav {
		padding: 20rpx;
		background-color: #f1f1f1;
	}

	.item-box {
		padding: 6rpx 14rpx;
		border: 1rpx solid #c2d5f3;
		border-radius: 6rpx;
		font-size: 28rpx;
		color: #555;
		margin-right: 32rpx;
	}

	.active {
		background-color: rgba(54, 128, 243, .2);
		color: #3680f3;
	}
	
	.right-box{
		position: absolute;
		right: 0;
		top: 0;
		bottom: 0;
		
		image {
			width: 36rpx;
			height: 36rpx;
			margin-right: 32rpx;
		}
		
		.avatar{
			width: 70rpx;
			height: 70rpx;
			border-radius: 50%;
		}
		
	}
	
	
</style>