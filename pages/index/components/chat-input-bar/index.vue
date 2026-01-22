<!-- z-paging聊天输入框 -->

<template>
	<view class="chat-input-bar-container">
		<view class="chat-input-bar">
			<view class="sixin" @click="jumpChat" v-if="!single">
				<image class="imgs" src="/static/sixin1.png"></image>
			</view>
			<view class="chat-input-container">
				<!-- :adjust-position="false"必须设置，防止键盘弹窗自动上顶，交由z-paging内部处理 -->
				<input :focus="focus" class="chat-input" :style="{ textAlign:disabled ? 'center' : 'left' }"
					v-model="msg" :adjust-position="false" confirm-type="send" type="text"
					:placeholder="disabled ? '当前聊天室处于禁言状态，但仍可向老师提问' : '发起提问'" @confirm="sendClick" :disabled="disabled" />
			</view>
			<!-- 表情图标（如果不需要切换表情面板则不用写） -->
			<template v-if="!disabled">
				<view class="emoji-container">
					<image class="emoji-img" :src="`/static/${emojiType || 'emoji'}.png`" @click="emojiChange"></image>
				</view>
				<view class="emoji-container">
					<image class="emoji-img" src="/static/img.png" @click="chooseFile"
						style="width: 52rpx;height: 52rpx;"></image>
				</view>
			</template>
			<!-- <view class="chat-input-send" @click="sendClick">
				<text class="chat-input-send-text">发送</text>
			</view> -->
		</view>
		<!--  表情面板，这里使用height控制隐藏显示是为了有高度变化的动画效果（如果不需要切换表情面板则不用写） -->
		<view class="emoji-panel-container" :style="[{height: emojiType === 'keyboard' ? '400rpx' : '0px'}]">
			<scroll-view scroll-y style="height: 100%;flex: 1;">
				<view class="emoji-panel">
					<text class="emoji-panel-text" v-for="(item, index) in emojisArr" :key="index"
						@click="emojiClick(item)">
						{{item}}
					</text>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {
		baseUrl
	} from "@/config";
	export default {
		name: "chat-input-bar",
		props: {
			disabled: Boolean,
			single:Boolean
		},
		data() {
			return {
				msg: '',

				// 表情数组（如果不需要切换表情面板则不用写）
				emojisArr: [
					"😀",
					"😃",
					"😄",
					"😁",
					"😆",
					"😅",
					"🤣",
					"😂",
					"🙂",
					"🙃",
					"😉",
					"😊",
					"😇",
					"😍",
					"🤩",
					"😘",
					"😗",
					"😚",
					"😙",
					"😋",
					"😛",
					"😜",
					"🤪",
					"😝",
					"🤑",
					"🤗",
					"🤭",
					"🤫",
					"🤔",
					"🤐",
					"🤨",
					"😐",
					"😑",
					"😶",
					"😏",
					"😒",
					"🙄",
					"😬",
					"🤥",
					"😌",
					"😔",
					"😪",
					"🤤",
					"😴",
					"😷",
					"🤒",
					"🤕",
					"🤢",
					"🤮",
					"🤧",
					"😵",
					"🤯",
					"🤠",
					"😎",
					"🤓",
					"🧐",
					"😕",
					"😟",
					"🙁",
					"😮",
					"😯",
					"😲",
					"😳",
					"😦",
					"😧",
					"😨",
					"😰",
					"😥",
					"😢",
					"😭",
					"😱",
					"😖",
					"😣",
					"😞",
					"😓",
					"😩",
					"😫",
					"😤",
					"😡",
					"😠",
					"🤬",
					"😈",
					"👿",
					"💀",
					"💩",
					"🤡",
					"👹",
					"👺",
					"👻",
					"👽",
					"👾",
					"🤖",
					"😺",
					"😸",
					"😹",
					"😻",
					"😼",
					"😽",
					"🙀",
					"😿",
					"😾",
					"💋",
					"👋",
					"🤚",
					"🖐",
					"✋",
					"🖖",
					"👌",
					"🤞",
					"🤟",
					"🤘",
					"🤙",
					"👈",
					"👉",
					"👆",
					"🖕",
					"👇",
					"👍",
					"👎",
					"✊",
					"👊",
					"🤛",
					"🤜",
					"👏",
					"🙌",
					"👐",
					"🤲",
					"🤝",
					"🙏",
					"💅",
					"🤳",
					"💪",
					"👂",
					"👃",
					"🧠",
					"👀",
					"👁",
					"👅",
					"👄",
					"👶",
					"🧒",
					"👦",
					"👧",
					"🧑",
					"👱",
					"👨",
					"🧔",
					"👱‍",
					"👨‍",
					"👨‍",
					"👨‍",
					"👨‍",
					"👩",
					"👱‍",
					"👩‍",
					"👩‍",
					"👩‍",
					"👩‍",
					"🧓",
					"👴",
					"👵",
					"🙍",
					"🙍‍",
					"🙍‍",
					"🙎",
					"🙎‍",
					"🙎‍",
					"🙅",
					"🙅‍",
					"🙅‍",
					"🙆",
					"🙆‍",
					"🙆‍",
					"💁",
					"💁‍",
					"💁‍",
					"🙋",
					"🙋‍",
					"🙋‍",
					"🙇",
					"🙇‍",
					"🙇‍",
					"🤦",
					"🤦‍",
					"🤦‍",
					"🤷",
					"🤷‍",
					"🤷‍",
					"👨‍⚕️",
					"👩‍⚕️",
					"👨‍🎓",
					"👩‍🎓",
					"👨‍🏫",
					"👩‍🏫",
					"👨‍⚖️",
					"👩‍⚖️",
					"👨‍🌾",
					"👩‍🌾",
					"👨‍🍳",
					"👩‍🍳",
					"👨‍🔧",
					"👩‍🔧",
					"👨‍🏭",
					"👩‍🏭",
					"👨‍💼",
					"👩‍💼",
					"👨‍🔬",
					"👩‍🔬",
					"👨‍💻",
					"👩‍💻",
					"👨‍🎤",
					"👩‍🎤",
					"👨‍🎨",
					"👩‍🎨",
					"👨‍✈️",
					"👩‍✈️",
					"👨‍🚀",
					"👩‍🚀",
					"👨‍🚒",
					"👩‍🚒",
					"👮",
					"👮‍♂️",
					"👮‍♀️",
					"🕵",
					"🕵️‍♂️",
					"🕵️‍♀️",
					"💂",
					"💂‍",
					"💂‍",
					"👷",
					"👷‍",
					"👷‍",
					"🤴",
					"👸",
					"👳",
					"👳‍",
					"👳‍",
					"👲",
					"🧕",
					"🤵",
					"👰",
					"🤰",
					"🤱",
					"👼",
					"🎅",
					"🤶",
					"🧙",
					"🧙‍",
					"🧙‍",
					"🧚",
					"🧚‍",
					"🧚‍",
					"🧛",
					"🧛‍",
					"🧛‍",
					"🧜",
					"🧜‍",
					"🧜‍",
					"🧝",
					"🧝‍",
					"🧝‍",
					"🧞",
					"🧞‍",
					"🧞‍",
					"🧟",
					"🧟‍",
					"🧟‍",
					"💆",
					"💆‍",
					"💆‍",
					"💇",
					"💇‍",
					"💇‍",
					"🚶",
					"🚶‍",
					"🚶‍",
					"🏃",
					"🏃‍",
					"🏃‍",
					"💃",
					"🕺",
					"🕴",
					"👯",
					"👯‍",
					"👯‍",
					"🧖",
					"🧖‍",
					"🧖‍",
					"🧘",
					"👭",
					"👫",
					"👬",
					"💏",
					"👨‍",
					"👩‍",
					"💑",
					"👨‍",
					"👩‍",
					"👪",
					"👨‍👩‍👦",
					"👨‍👩‍👧",
					"👨‍👩‍👧‍👦",
					"👨‍👩‍👦‍👦",
					"👨‍👩‍👧‍👧",
					"👨‍👨‍👦",
					"👨‍👨‍👧",
					"👨‍👨‍👧‍👦",
					"👨‍👨‍👦‍👦",
					"👨‍👨‍👧‍👧",
					"👩‍👩‍👦",
					"👩‍👩‍👧",
					"👩‍👩‍👧‍👦",
					"👩‍👩‍👦‍👦",
					"👩‍👩‍👧‍👧",
					"👨‍👦",
					"👨‍👦‍👦",
					"👨‍👧",
					"👨‍👧‍👦",
					"👨‍👧‍👧",
					"👩‍👦",
					"👩‍👦‍👦",
					"👩‍👧",
					"👩‍👧‍👦",
					"👩‍👧‍👧",
					"🗣",
					"👤",
					"👥",
					"👣",
					"🌂",
					"☂",
					"👓",
					"🕶",
					"👔",
					"👕",
					"👖",
					"🧣",
					"🧤",
					"🧥",
					"🧦",
					"👗",
					"👘",
					"👙",
					"👚",
					"👛",
					"👜",
					"👝",
					"🎒",
					"👞",
					"👟",
					"👠",
					"👡",
					"👢",
					"👑",
					"👒",
					"🎩",
					"🎓",
					"🧢",
					"⛑",
					"💄",
					"💍",
					"💼"
				],
				focus: false,
				// 当前表情/键盘点击后的切换类型，为空字符串代表展示表情logo但是不展示不展示表情面板（如果不需要切换表情面板则不用写）
				emojiType: '',
			};
		},
		methods: {
			
			jumpChat(){
				uni.navigateTo({
					url:'/pages/single/index'
				})
			},
			
			// 更新了键盘高度（如果不需要切换表情面板则不用写）
			updateKeyboardHeightChange(res) {
				if (res.height > 0) {
					// 键盘展开，将emojiType设置为emoji
					this.emojiType = 'emoji';
				}
			},
			// 用户尝试隐藏键盘，此时如果表情面板在展示中，应当隐藏表情面板，如果是键盘在展示中不用处理，z-paging内部已经处理（如果不需要切换表情面板则不用写）
			hidedKeyboard() {
				if (this.emojiType === 'keyboard') {
					this.emojiType = '';
				}
			},
			// 点击了切换表情面板/键盘（如果不需要切换表情面板则不用写）
			emojiChange() {
				if (this.disabled) return false;

				this.$emit('emojiTypeChange', this.emojiType);
				if (this.emojiType === 'keyboard') {
					// 点击了键盘，展示键盘
					this.focus = true;
				} else {
					// 点击了切换表情面板
					this.focus = false;
					// 隐藏键盘
					uni.hideKeyboard();
				}
				this.emojiType = (!this.emojiType || this.emojiType === 'emoji') ? 'keyboard' : 'emoji';
			},
			// 点击了某个表情，将其插入输入内容中（如果不需要切换表情面板则不用写）
			emojiClick(text) {
				this.msg += text;
			},

			// 点击了发送按钮
			sendClick() {
				if (!this.msg.length) return;
				this.$emit('send', this.msg);
				this.msg = '';
			},

			chooseFile() {
				if (this.disabled) return false;
				uni.chooseImage({
					count: 1,
					success: res => {
						const filePath = res.tempFilePaths[0];
						this.uploadFile(filePath);
					}
				})
			},

			uploadFile(filePath) {
				uni.uploadFile({
					url: `${baseUrl}/Live/Upload`, // 后端接口路径  
					filePath,
					name: 'file', // 文件字段名称  
					success: (res) => {
						const data = JSON.parse(res.data);
						if (data.success) {
							const url = `${baseUrl + data.filePath}`;
							this.$emit('send', url);
						} else {
							uni.showToast({
								title: '上传失败',
								icon: 'none'
							});
						}
					},
					fail: () => {
						uni.showToast({
							title: '上传失败',
							icon: 'none'
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.chat-input-bar {
		display: flex;
		flex-direction: row;
		align-items: center;
		border-top: solid 1px #eee;
		background-color: #FFF;
		padding: 24rpx 32rpx;
		padding-left: 0;
		box-shadow: 0 -8rpx 16rpx rgba(0,0,0,0.05);
	}
	
	.sixin{
		padding: 12rpx 24rpx;
		padding-right: 0;
		
		.imgs{
			width: 45rpx;
			height: 45rpx;
			margin-top: 8rpx;
		}
	}

	.chat-input-container {
		margin-left: 24rpx;
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		padding: 20rpx;
		background-color: #f5f5f5;
		border-radius: 10rpx;
	}

	.chat-input {
		flex: 1;
		font-size: 28rpx;
	}

	.emoji-container {
		width: 54rpx;
		height: 54rpx;
		margin: 10rpx 0rpx 10rpx 20rpx;
	}

	.emoji-img {
		width: 54rpx;
		height: 54rpx;
	}

	.chat-input-send {
		background-color: #007AFF;
		margin: 10rpx 10rpx 10rpx 20rpx;
		border-radius: 10rpx;
		width: 110rpx;
		height: 60rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
	}

	.chat-input-send-text {
		color: white;
		font-size: 26rpx;
	}

	.emoji-panel-container {
		background-color: #f8f8f8;
		overflow: hidden;
		transition-property: height;
		transition-duration: 0.15s;
		/* #ifndef APP-NVUE */
		will-change: height;
		/* #endif */
	}

	.emoji-panel {
		font-size: 30rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
		/* padding-right: 10rpx;
		padding-left: 15rpx; */
		padding-bottom: 10rpx;
	}

	.emoji-panel-text {
		font-size: 50rpx;
		margin-left: 15rpx;
		margin-top: 20rpx;
	}
</style>