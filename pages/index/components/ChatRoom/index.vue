<template>
	<view>
		<template v-if="msgCurrent != 3">
			<!-- for循环渲染聊天记录列表 -->
			<view v-for="(item,index) in list" :key="index" style="position: relative;">
				<view style="transform: scaleY(-1);">
					<chat-item :item="item" :roleList="roleList" @handler="handler"></chat-item>
					<view class="flex justify-center items-center tips" v-if="index == 0">
						—— 股市有风险，入市需谨慎 ——
					</view>
				</view>
			</view>
			<view v-if="list.length == 0" style="transform: scaleY(-1);">
				<CustomEmpty margin="300rpx 0" />
			</view>
		</template>
		<view v-else style="transform: scaleY(-1);">
			<CustomEmpty margin="300rpx 0" />
		</view>
	</view>
</template>

<script>
export default {
	props:{
		list:Array
	}
	data(){
		
	}
}
</script>

<style>
</style>