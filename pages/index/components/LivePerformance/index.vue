<template>
	<scroll-view scroll-y style="height: calc(100vh - 110rpx)">
		<view class="empty" v-if="!info || !info.status">
			<CustomEmpty  />
		</view>
		<view class="content-mian" v-else>
			<view class="top-title">{{ info.content.title }}</view>
			<view class="flex line-box line-title">
				<view class="date">推荐日期</view>
				<view class="right-box flex flex-1">
					<view class="item flex-1" v-for="value in colums" :key="value.key">{{ value.title }}</view>
				</view>
			</view>
			
			<view class="for-data">
				<view v-for="(item, index) in info.content.list" :key="index" class="flex line-box data-box">
					<view class="date">{{ item.date }}</view>
					<view class="right-box flex-1 flex flex-column">
						 <view class="right-box-item" v-for="(item2, index2) in item.list" :key="index2">
						    <view :class="[
								'item flex-1',
								i == colums.length -1 && getZhangFu(item2[value.key])
							]" v-for="(value,i) in colums" :key="value.title">
								<text v-if="item2[value.key]">{{ item2[value.key] }}</text>
								<text v-else style="color: #666;">-</text>
							</view>
						 </view>
					</view>
				</view>			
			</view>
			
			<CustomEmpty margin="100rpx 0" v-if="info.content.list.length < 2" />
			
			<view class="bv flex justify-center items-center" v-if="info.content.bv">{{ info.content.bv }}</view>
			<view class="tips flex justify-center items-center" v-if="info.content.tips">{{ info.content.tips }}</view>
		</view>
	</scroll-view>
</template>

<script>
import { SelectLivePerformance } from '@/api'

export default {
	props:{
		roomInfo:Object
	},
	data(){
		return {
			info:null,
			colums: [
				{ title: '点评方式', key: 'type' },
				{ title: '推荐时间', key: 'time' },
				{ title: '股票代码', key: 'code' },
				{ title: '股票名称', key: 'name' },
				{ title: '板块题材', key: 'plate' },
				{ title: '最大涨幅', key: 'max' }
			],
		}
	},
	computed:{
		getZhangFu(){
			return text  => {
				return text && text.includes('-') ? 'green-value' : 'red-value';
			}
		}
	},
	created() {
		SelectLivePerformance(this.roomInfo.id).then(({ data }) => {
			if(data){
				data.content = JSON.parse(data.content);
				if(data.content.list && data.content.list.length > 0){
					data.content.list = data.content.list.reverse();
				}
				this.info = data;
				console.info("sssss",data);
			}
		})
	}
}

</script>

<style lang="scss" scoped>
$border:1rpx solid #000;

.red-value{
	color: #F10;
	font-weight: bold;
}

.green-value{
	color: green;
	font-weight: bold;
}

.content-mian{
	text-align: center;
	font-size: 24rpx;
	
	.bv{
		background-color: rgba(54,128,243,.3);
		color: #333;
		height: 60rpx;
		font-weight: bold;
	}
	
	.tips{
		font-size: 20rpx;
		padding: 12rpx 24rpx;
		line-height: 32rpx;
		background-color: $base-color;
		color: #FFF;
	}
	
	.for-data{
		background-color: #f8f8f8;
	}
	
	.line-box{
		font-size: 20rpx;
		border-bottom:$border;
		
		
		.date{
			width: 120rpx;
		}
		
		view{
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
	
	.data-box{
		
		.date{
			height: auto;
		}
		
		.item{
			min-height:80rpx;
			padding: 0 10rpx;
		}
		
		.right-box{
			border-left: $border;
			
			.right-box-item{
				width: 100%;
				
				&:not(:last-child){
					border-bottom:$border;
				}
				
				.item:not(:last-child){
					border-right:$border;
				}
				
			}
		}
	}
	
	.line-title{
		background-color: rgba(54,128,243,.3);
		color: #333;
		height: 80rpx;
	}
	
	.top-title{
		line-height: 80rpx;
		color: #FFF;
		font-weight: bold;
		background-color: $base-color;
		border-top: 1rpx solid rgba(255,255,255,.1);
	}
}
	
.empty{
	padding: 120rpx 0;
}
</style>