<template>
	<u-popup :closeOnClickOverlay="false" round="16" mode="bottom" :show="show" @close="show = false">
		<view class="main-box">
			<view class="title">核实房间号</view>
			<view class="flex justify-center">
				<u-code-input size="calc(105rpx)" space="10rpx" v-model="value" maxlength="6" @finish="getChatRoom"></u-code-input>
				<!-- <view class="get-box">点击获取</view> -->
			</view>
			<view class="submit">
				<u-button 
				loadingSize="12"
				:loading="loading" style="height: 90rpx;" text="确定" type="primary" shape="circle" @click="getChatRoom"></u-button>
			</view>
			<view class="tips flex justify-center">
				如果还没有房间号，请联系您的客服
			</view>
		</view>
	</u-popup>
</template>

<script>
import { GetChatRoom } from '@/api'
import { mapState } from 'vuex'

export default {
	data(){
		return {
			ws:uni.getSystemInfoSync(),
			loading:false,
			show:false,
			value:""
		}
	},
	created() {
		const code = uni.getStorageSync('room-code');
		if(!code){
			this.open();
		}else{
			uni.showLoading({ mask:true });
			this.value = code;
			this.getChatRoom(true);
		}
	},
	computed: {
		...mapState(['userInfo'])
	},
	methods:{
		
		open(){
			this.show = true;
		},
		
		getChatRoom(isCache){
			if(!this.value) return uni.showToast({ title:"请输入房间号", icon:"none" });
			this.loading = true;
			// 获取聊天室
			GetChatRoom(this.value,this.userInfo.id).then(({ data }) => {
				if(!isCache) uni.hideLoading();
				uni.setStorageSync('room-code',this.value);
				this.show = this.loading = false;
				this.value = "";
				this.$emit('refresh',data);
				uni.setStorageSync("roomInfo",data);
				this.$store.commit('SET_VALUE', {
					key: "roomInfo",
					value:data
				});
			}).catch(err => {
				uni.showToast({ title: err.data.message, icon: 'none' });
				this.loading = false;
				this.show = true;
				this.value = "";
				uni.removeStorageSync('room-code');
				uni.removeStorageSync("roomInfo");
				this.$store.commit('SET_VALUE', {
					key: "roomInfo",
					value:null
				});
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.main-box{
	padding: 0 32rpx;
	
	.title{
		text-align: center;
		padding: 32rpx;
		font-weight: bold;
		font-size: 32rpx;
	}
	
	.get-box{
		padding: 20rpx 0;
		font-size: 28rpx;
		color: #3680f3;
	}
	
	.submit{margin-top: 20rpx}
	
	.tips{
		font-size: 24rpx;
		padding: 32rpx 0;
		color:rgba(0,0,0,.5);
	}
}
</style>