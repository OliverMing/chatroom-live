<template>
	<z-paging 
	ref="paging"
	hide-empty-view
	:refresher-enabled="false"
	:auto="false"
	:bg-color="'#f8f8f8'"
	v-model="list"
	@query="queryList">
		<template #top>
			<view class="search-box flex items-center">
				<view class="search-main flex-1 flex items-center">
					<image src="/static/search-black.png" />
					<input type="text" 
					:focus="true"
					v-model="keywords" 
					placeholder="请输入搜索内容" 
					confirm-type="search"
					@confirm="refresh" />
					<view v-if="keywords" class="del flex items-center justify-center" @click="clearKeywords">
						<image src="/static/del.png"></image>
					</view>
				</view>
				<text class="search-btn" @click="refresh">搜索</text>
			</view>
		</template>
		<view v-for="(item,index) in list" :key="index" style="position: relative;">
			<chat-item 
			:item="item" 
			:keywords="keywords"
			:roleList="roleList" />
		</view>
		
		<u-empty v-if="list.length == 0" marginTop="300rpx" mode="search" text="暂无内容" />
	</z-paging>
</template>

<script>
import { 
	GetChatList,
	GetLiveRoleList
} from '@/api'
import chatItem from '@/pages/index/components/chat-item'

export default {
	components:{
		chatItem
	},
	data() {
		return {
			list:[],
			roleList:[],
			code:null,
			keywords:null,
		}
	},
	onLoad() {
		this.code = uni.getStorageSync('room-code');
		this.getLiveRoleListApi();
	},
	methods: {
		
		clearKeywords(){
			this.keywords = "";
			this.$refs.paging.clear();
		},
		
		refresh(){
			if(!this.keywords) return false;
			uni.showLoading({ mask:true })
			this.$refs.paging.reload();
		},
		
		// 获取角色列表
		getLiveRoleListApi() {
			GetLiveRoleList().then(res => {
				this.roleList = res.data;
			})
		},
		
		queryList(pageNo,pageSize){
			if(!this.keywords) return false;
			GetChatList({
				pageNo,
				pageSize,
				code: this.code,
				keywords:this.keywords || ''
			}).then(({ data }) => {
				uni.hideLoading();
				this.$refs.paging.complete(data);
			}).finally(() => {
				uni.hideLoading();
			})
		}
	}
}
</script>

<style lang="scss" scoped>
page{
	background-color: #f8f8f8;
}

.del{
	padding: 12rpx 18rpx;
	image{
		opacity: .8;
	}
}

.search-box{
	padding: 24rpx 0;
	background-color: #FFF;
	border-top: 1rpx solid rgba(0,0,0,.05);
	box-shadow: 0 0 14rpx rgba(0,0,0,.1);
	
	.search-btn{
		padding: 12rpx 24rpx;
		font-size: 30rpx;
		color: $base-color;
	}
	
	.search-main{
		margin-left:24rpx;
		background-color: #f8f8f8;
		border-radius: 12rpx;
		padding-left: 24rpx;
		
		image{
			width: 34rpx;
			height: 34rpx;
		}
		
		input{
			height:80rpx;
			flex: 1;
			padding-left: 24rpx;
			font-size: 28rpx;
			color: #333;
		}
	}
	
}
</style>