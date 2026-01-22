export default {
	// 用户信息详情
	userInfo: uni.getStorageSync('userInfo') || null,
	// 房间信息
	roomInfo: uni.getStorageSync('roomInfo') || null,
}