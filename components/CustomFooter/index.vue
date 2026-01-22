<template>
	<view>
		<view v-if="showEmptyPerch" :style="{height:`${bottomHeight}px`}"></view>
		<view 
		:class="[
			'footer-main',
			shadow && 'box-shadow'
		]"
		:style="{ 
			background,
			padding,
			paddingBottom
		}">
			<slot />
			<view class="" :style="{height:`${safeBottom}px`}">
				
			</view>
			<!-- <u-safe-bottom v-if="showSafe"></u-safe-bottom> -->
		</view>
	</view>
</template>

<script>
export default {
	model:{
		prop:"footer",
		event:"change"
	},
	props:{
	   // 背景颜色
	   background:{
		   type:String,
		   default:"transparent"
	   },
	   padding:{
		   type:String,
		   default:"32upx"
	   },
	   // 是否显示阴影
	   shadow:Boolean,
	   // 是否显示安全底部区域
	   showSafe:{
		   type:Boolean,
		   default:true
	   },
	   showEmptyPerch:{
		   type:Boolean,
		   default:true
	   }
	},
	data(){
		return {
			safeBottom:0,
			bottomHeight:0,
		}
	},
	computed:{
		paddingBottom(){
			let h = 0;
			if(this.showSafe){
				h = this.safeBottom ? 0 : this.padding;
			}
			return h;
		}
	},
	created() {
		const t = uni.$u.sys();
		this.safeBottom = t.safeAreaInsets.bottom;
	},
	mounted() {
		setTimeout(() => {
			this.getHeight();
		},100)
	},
	methods:{
		// 获取底部高度
		getHeight:function(){
			const query = uni.createSelectorQuery().in(this);
			query.select('.footer-main').boundingClientRect(data => {
				this.bottomHeight = data.height;
				this.$emit("change",data.height);
			}).exec();
		}
	}
}
</script>

<style lang="scss" scoped>
.footer-main{position: fixed;bottom: 0;left: 0;right: 0;z-index: 9;}
.box-shadow{box-shadow: 0 -4upx 8upx rgba(0,0,0,.1);}
</style>