<template>
	<scroll-view scroll-y class="content">
		<view class="step-box" v-if="list.length > 0">
			<u-steps current="0" direction="column">
				<u-steps-item v-for="(item,index) in list" :key="index" :desc="item.create_time" 
				:title="item.content" /> 
			</u-steps>
		</view>
		
		<CustomEmpty v-else />
		
		<view class="" style="height: 100rpx;">
			
		</view>
	</scroll-view>
</template>

<script>
import { GetLiveRoomEaeryList } from '@/api'
export default {
	props:{
		code:String
	},
	data(){
		return {
			list:[]
		}
	},
	created() {
		this.GetLiveRoomEaeryListApi();
	},
	methods:{
		GetLiveRoomEaeryListApi(){
			GetLiveRoomEaeryList(this.code).then(res => {
				res.data = res.data.sort((a,b) => b.id - a.id);
				this.list = res.data;
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.content{
	
	height: 100%;
	
	.step-box{
		padding: 32rpx;
		padding-left: 24rpx;
	}
}
</style>