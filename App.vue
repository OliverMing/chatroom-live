<script>
	export default {
		onLaunch: function() {
			uni.$wx = this.$wx;
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
@import "uview-ui/index.scss";
@import "flex.css";
// @import "app.css";

.u-text__value span{
	line-height: 52rpx;
}

.u-tabs__wrapper__nav__item{
	padding: 0 22rpx !important;
}

.uni-audio-default{
	min-width: 400rpx !important;
	margin-bottom: -10rpx;
}
</style>
