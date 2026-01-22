<template>
</template>

<script>
export default {
	onLoad(options) {
		debugger;
		uni.reLaunch({
			url:`/pages/index/index?cid=${options.cid || ''}`
		})
	}
}
</script>

<style>
</style>