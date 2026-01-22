<template>
	<view>
		<view :class="[
			'header',
			`theme-${theme}`,
			!fixed && 'normal',
			!border && 'no-border'
		]" :style="{
			background
		}">
			<u-status-bar />
			<view class="header-main flex justify-center items-center">
				<view v-if="showBack" class="right-back flex items-center" @click="back">
					<image :src="`/static/back-${theme}.png`" mode="widthFix"></image>
				</view>
				<template v-if="!$slots.content">
					<view class="left-slot" v-if="$slots.left">
						<slot name="left"></slot>
					</view>
					<view class="title Medium" @click="$emit('titletap')">{{ title }}</view>
					<view class="right-slot" v-if="$slots.right">
						<slot name="right"></slot>
					</view>
				</template>
				<template v-else>
					<slot name="content" />
				</template>
			</view>
			
		</view>
		<view v-if="fixed && placeholder" class="placeholder" :style="{ height:`${topBarHeight}px` }"></view>
	</view>
</template>

<script>
export default {
	props:{
		title:String,
		showBack:{
			type:Boolean,
			default:true
		},
		placeholder:{
			type:Boolean,
			default:true
		},
		fixed:{
			type:Boolean,
			default:true
		},
		border:{
			type:Boolean,
			default:true
		},
		background:{
			type:String,
			default:"#FFF"
		},
		theme:{
			type:String,
			default:"black"
		}
	},
	data(){
		return {
			topBarHeight:0
		}
	},
	mounted() {
		this.$nextTick(() => {
			this.getHeight();
		})
	},
	methods:{
		
		// 获取高度
		getHeight:function(){
			const query = uni.createSelectorQuery().in(this);
			query.select('.header').boundingClientRect(data => {
				this.topBarHeight = data.height;
				this.$emit('height',data.height);
			}).exec();
		},
		
		back(){
			// uni.navigateBack();
			// 判断当前路由长度
			const pages = getCurrentPages();
			if(pages.length > 1) {
				// #ifdef APP-PLUS
				uni.navigateBack();
				// #endif
				// #ifdef H5
				history.go(-1);
				// #endif
			}
			else{
				uni.reLaunch({
					url:'/pages/index/index'
				});
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.header{
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 99;
	color: #272727;
	transition:background .2s linear;
	
	&.normal{
		position: relative;
	}
	
	.header-main{
		position: relative;
		min-height: 112rpx;
		
		.right-slot{
			position: absolute;
			right: 0;
		}
		
		.left-slot{
			position: absolute;
			left: 0;
		}
		
		.title{
			font-size: 32rpx;
			font-weight: 500;
			color: #000000;
		}
		
		.right-back{
			position: absolute;
			left: 0;
			top:0;
			bottom: 0;
			min-width: 60rpx;
			z-index: 3;
			padding: 0 24rpx;
			
			image{
				width: 40rpx;
			}
		}
	}
}

.no-border{
	border: none;
}

.theme-white{
	color: #FFF;
	
	.header-main{
		.title{
			color: #FFF;
		}
	}
	
}
</style>