import { http } from './http';

//用户登录
export const Login = code => {
	// #ifdef H5
	return http({
		url:'/Live/GetWeChatUserInfoAsync',
		methods:"POST",
		data:{
			code
		}
	})
	// #endif
	
	// #ifdef MP-WEIXIN
	return http({
		url:'/Live/GetMiniProgramUserInfoAsync',
		methods:"POST",
		data:{
			code
		}
	})
	// #endif
}

// 小程序授权后返回了用户信息cid到iframe
export const LoginByCid = cid => {
	return http({
		url:`/Live/LoginByCid?cid=${cid}`,
		methods:"POST"
	})
}

// 根据邀请码获取聊天室 
export const GetChatRoom = (code,userId) => {
	return http({
		url:`/Live/GetChatRoom?code=${code}&userId=${userId}`,
		methods:"GET",
		showToast:false
	})
}

// 获取聊天列表
export const GetChatList = data => {
	return http({
		url:`/Live/GetChatList`,
		methods:"POST",
		data
	})
}

// 获取单聊列表
export const GetSingleChatList = data => {
	return http({
		url:`/Live/GetSingleChatList`,
		methods:"POST",
		data
	})
}

// 添加q群聊天消息
export const InsertChat = data => {
	return http({
		url:`/Live/InsertChat`,
		methods:"POST",
		data
	})
}

// 添加私信消息
export const InsertSingleChat = data => {
	return http({
		url:`/Live/InsertSingleChat`,
		methods:"POST",
		data
	})
}

// 获取用户信息 
export const GetErcodeRatioMiniProgramUserInfoAsync = code => {
	return http({
		url:`/Admin/GetErcodeRatioMiniProgramUserInfoAsync?channel=mini&code=${code}`,
		methods:"POST"
	})
}

// 获取聊天室角色列表
export const GetLiveRoleList = () => {
	return http({
		url:`/Admin/GetLiveRoleList`,
		methods:"GET"
	})
}

// 设置用户黑名单状态
export const SetUserBlackStatus = (id,status) => {
	return http({
		url:`/Admin/SetUserBlackStatus?chat_id=${id}&is_black=${status}`,
		methods:"POST"
	})
}

// 查询战绩回顾
export const SelectLivePerformance = (id) => {
	return http({
		url:`/Admin/SelectLivePerformance?id=${id}`,
		methods:"GET"
	})
}

// 查询最新消息
export const IsHaveNewMessage = (id,code) => {
	return http({
		url:`/Live/IsHaveNewMessage?id=${id}&room_code=${code}`,
		methods:"GET",
		showToast:false
	})
}

// 获取每日福利推送列表
export const GetLiveRoomEaeryList = (code) => {
	return http({
		url:`/Admin/GetLiveRoomEaeryList?code=${code}`,
		methods:"GET"
	})
}

// 获取每日福利推送列表
export const GetSystemUserInfo = (id) => {
	return http({
		url:`/Live/GetSystemUserInfo?id=${id}`,
		methods:"GET"
	})
}

// 获取会员房间信息
export const GetVipChatRoomInfo = vipRoomId => {
	return http({
		url:`/Live/GetVipChatRoomInfo?vipRoomId=${vipRoomId}`,
		methods:"GET"
	})
}

// 获取分享配置信息
export const GetLiveShareConfigByChannel = channel => {
	return http({
		url:`/Live/GetLiveShareConfigByChannel?channel=${channel}`,
		methods:"GET",
		showToast:false
	})
}


// 获取聊天室文件
export const GetliveChatFileList = data => {
	return http({
		url:`/Live/GetliveChatFileList`,
		methods:"POST",
		data
	})
}

// 获取二级跳转域名
export const GetLiveChildrenUrl = data => {
	return http({
		url:`/Admin/GetLiveChildrenUrl`,
		methods:"POST",
		data,
		showToast:false
	})
}

// 获取聊天文件列表
export const GetChatFileTypeList = () => {
	return http({
		url:`/Admin/GetChatFileTypeList`,
		methods:"POST"
	})
}

// 获取VIP聊天室文件
export const GetVipCourseList = data => {
	return http({
		url:`/Live/GetVipCourseList`,
		methods:"POST",
		data
	})
}

// 获取VIP聊天室课程详情
export const queryVipCourseDetails = id => {
	return http({
		url:`/Live/queryVipCourseDetails?id=${id}`,
		methods:"POST"
	})
}

//  获取聊天室分享配置列表
export const GetLiveShareConfigList = () => {
	return http({
		url:`/Admin/GetLiveShareConfigList`,
		methods:"POST"
	})
}

// ReadVipFile
export const ReadVipFile = data => {
	return http({
		url:`/Live/ReadVipFile`,
		methods:"POST",
		data
	})
}