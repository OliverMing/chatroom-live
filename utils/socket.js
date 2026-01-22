import { socketUrl } from '@/config';

let socketTask = null; // WebSocket实例
let isConnected = false; // WebSocket连接状态

// 心跳 & 重连参数
let heartbeatTimer = null;
const heartbeatInterval = 24000;
let reconnectTimer = null;
const reconnectDelay = 5000;
let manualClose = false;

// 最近一次连接参数，用于重连
let lastOptions = null;

function connectWebSocket(options) {
	if (!options || !options.userInfo || !options.roomInfo) return;
	const { userInfo, roomInfo } = options;
	if (isConnected || !userInfo.id || !roomInfo.code) return;

	manualClose = false;
	lastOptions = { userInfo, roomInfo };

	if (socketTask) {
		try {
			socketTask.close();
		} catch (e) {}
	}

	const { id, nickname, headimgurl, parentId } = userInfo;

	socketTask = uni.connectSocket({
		url: `${socketUrl}/?userId=${id}&code=${roomInfo.code}&nickname=${nickname || ''}&headimgurl=${headimgurl || ''}&parentId=${parentId || ''}`
	});

	registerSocketHandlers();
}

function registerSocketHandlers() {
	// 打开
	uni.offSocketOpen && uni.offSocketOpen(onSocketOpen);
	uni.onSocketOpen(onSocketOpen);

	// 消息
	uni.offSocketMessage && uni.offSocketMessage(onSocketMessage);
	uni.onSocketMessage(onSocketMessage);

	// 关闭
	uni.offSocketClose && uni.offSocketClose(onSocketClose);
	uni.onSocketClose(onSocketClose);

	// 错误
	uni.offSocketError && uni.offSocketError(onSocketError);
	uni.onSocketError(onSocketError);
}

function onSocketOpen() {
	console.log('WebSocket连接已打开！');
	isConnected = true;
	startHeartbeat();
	clearReconnectTimer();
	// 通知页面
	uni.$emit('socket-open');
}

function onSocketMessage(res) {
	let params = null;
	try {
		params = JSON.parse(res.data);
	} catch (e) {
		console.error('WebSocket 消息解析失败：', e, res);
		return;
	}

	if (params.type === 'pong') {
		console.info('心跳检测正常');
		return;
	}

    // 对外统一通过事件分发
    if(params.type == 'single'){
        uni.$emit('single', params);
    }else if(params.type == 'group'){
        uni.$emit('group', params);
    }
}

function onSocketClose() {
	console.log('WebSocket连接已关闭！');
	handleSocketClose();
}

function onSocketError(err) {
	console.error('WebSocket连接打开失败，请检查：', err);
	handleSocketClose();
}

function handleSocketClose() {
	isConnected = false;
	clearHeartbeat();
	socketTask = null;

	// 通知页面
	uni.$emit('socket-close');

	if (!manualClose) {
		scheduleReconnect();
	}
}

function startHeartbeat() {
	clearHeartbeat();
	heartbeatTimer = setInterval(() => {
		sendHeartbeat();
	}, heartbeatInterval);
	sendHeartbeat();
}

function sendHeartbeat() {
	if (!isConnected || !lastOptions || !lastOptions.userInfo) return;
	const { userInfo } = lastOptions;
	try {
		uni.sendSocketMessage({
			data: JSON.stringify({
				type: 'ping',
				id: userInfo.id,
				nickName: userInfo.nickname,
				timestamp: Date.now()
			})
		});
	} catch (error) {
		console.error('心跳发送失败', error);
	}
}

function clearHeartbeat() {
	if (heartbeatTimer) {
		clearInterval(heartbeatTimer);
		heartbeatTimer = null;
	}
}

function scheduleReconnect() {
	clearReconnectTimer();
	if (!lastOptions) return;
	reconnectTimer = setTimeout(() => {
		console.log('尝试重连WebSocket');
		connectWebSocket(lastOptions);
	}, reconnectDelay);
}

function clearReconnectTimer() {
	if (reconnectTimer) {
		clearTimeout(reconnectTimer);
		reconnectTimer = null;
	}
}

function closeWebSocket(isManual = true) {
	manualClose = !!isManual;
	clearHeartbeat();
	clearReconnectTimer();
	try {
		uni.closeSocket();
	} catch (e) {}
	if (socketTask) {
		try {
			socketTask.close();
		} catch (e) {}
		socketTask = null;
	}
	isConnected = false;
}

function getSocketStatus() {
	return {
		isConnected,
		socketTask
	};
}

export default {
	connectWebSocket,
	closeWebSocket,
	getSocketStatus
};


