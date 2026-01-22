import { baseUrl } from "@/config";
import {
	GetLiveShareConfigByChannel
} from '@/api'
					
const share = {
	title:'申睿智胜实战课堂',
	desc:'课堂所有服务均为免费，先验证实力，看到实力可以直接跟上内部订阅合作，享受专业投顾老师全程指导',
	link:'https://wechat.mk-ytx.cn/im',
	imgUrl:window.origin + '/srzs_logo.jpg'
}

export default{
    initWxConfig(firstInit = false,callback) {
        return new Promise((resolve,reject) => {
           let url = encodeURIComponent(window.location.href);
           uni.request({
           	url:`${baseUrl}/Anp/getWehcatConfig?pathurl=${url}`,
           	success:({ data }) => {
           		let apiList = [
           		    'updateAppMessageShareData',                    
           		    'updateTimelineShareData',
           		    'hideMenuItems'  // 隐藏菜单项
           		];
           		let { appId,nonceStr,timestamp,signature } = data.data;
           		let info = {
           		    debug: false,
           		    appId,
           		    nonceStr,
           		    timestamp,
           		    signature,
           		    jsApiList: apiList,
           		};
				
           		uni.$wx.config(info);
           		
           		uni.$wx.error(err => { 
           			console.log(err);
           		});
           		
           		uni.$wx.ready(res => {
           		    diyParamsBySahre()
           		    // 隐藏复制链接菜单项
           		    uni.$wx.hideMenuItems({
           		        menuList: [
           		            'menuItem:copyUrl',        // 复制链接
           		            'menuItem:openWithSafari', // 在Safari中打开
           		            'menuItem:copy',           // 复制（通用）
           		            'menuItem:selectAll',      // 全选
           		            'menuItem:readMode',       // 阅读模式
           		            'menuItem:originPage'      // 原网页
           		        ],
           		        success: function(res) {
           		            console.log('隐藏菜单项成功', res);
           		        },
           		        fail: function(err) {
           		            console.log('隐藏菜单项失败', err);
           		        }
           		    });
           		    resolve();
           		});
           	}
           });
        })
    },
}

// 自定义分享信息
const diyParamsBySahre = () => {
	const channel = uni.getStorageSync('channel');
	if(!channel){
		uni.$wx.updateAppMessageShareData(share);
		uni.$wx.updateTimelineShareData(share);
	}else{
		// 去查询数据库里的分享链接以及文案
		GetLiveShareConfigByChannel(channel).then(({ data }) => {
			const info = {
				title:data.title,
				desc:data.desc,
				link:`${data.link}?channel=${data.channel}`,
				imgUrl:data.imgUrl
			}
			uni.$wx.updateAppMessageShareData(info);
			uni.$wx.updateTimelineShareData(info);
			uni.setNavigationBarTitle({
				title:data.title
			});
		}).catch(() => {
			uni.$wx.updateAppMessageShareData(share);
			uni.$wx.updateTimelineShareData(share);
		})
	}
}