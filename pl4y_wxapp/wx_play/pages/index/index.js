//index.js
//获取应用实例
const app = getApp()
const utils=require('../../utils/util.js')
const apis=require('../../config/apis.js')
//任务图标
const markerImg='/resource/images/task.png';
const studyIconPath ='/resource/images/study.png';
const sportsIconPath = '/resource/images/sports.png'
//中心点
const centerMarker = {
  id: 0,
  longitude:'',
  latitude:'',
  iconPath:'/resource/images/flag.png',
  width: 36,
  height: 36
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentLocation:{
    },
    markers:[],
    controls:[
      {
        id:1,
        iconPath:'/resource/images/location2.png',
        position:{
          left:30,
          top:wx.getSystemInfoSync().windowHeight-120,
          width: 48,
          height: 48
        },
        clickable:true
      },
      {
        id: 2,
        iconPath: '/resource/images/post2.png',
        position: {
          left:wx.getSystemInfoSync().windowWidth-78,
          top: wx.getSystemInfoSync().windowHeight - 120,
          width: 48,
          height: 48
        },
        clickable: true
      }
    ]
  },
  // 获取位置
  getMyLocation(){
    let _this = this;
    let getSuccess=false;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        const { longitude, latitude } = res;
        _this.setData({//设置地图坐标
          currentLocation: {
            longitude, latitude
          }
          
        })
        // 保存当前地址到app
        app.saveLocationToApp(_this.data.currentLocation);
        centerMarker.latitude =latitude;
        centerMarker.longitude=longitude;
        getSuccess=true;
      },
      fail: function (res) {
        console.log(res)
        wx.showToast({
          title: "获取地址失败",
          image: '/resource/images/error.png'
        })
        getSuccess=false;
      },
      complete: function (res) {
        //如果地址查询失败，如果未授权则重新发起权限请求
      }
           
    })
  },
  handleMarkerTap(e){
    if(e.markerId==0)return;
    wx.navigateTo({
      url: '/pages/detail/detail?markerId=' + e.markerId,
      fail: function(res) {
        wx.showToast({
          title: '跳转失败',
          image: '/resource/images/error.png',
        })
      }
    })
  },
  controlLocation(){
    this.getMyLocation();
  },
  controlPost(){
    wx.navigateTo({
      url: '/pages/postTask/postTask'
    })
  },
  controlMe(){
    wx.navigateTo({
      url: '/pages/me/me'
    })
  },
  handleControlTap(e){
    let controlId=e.controlId;
    switch(controlId){
      case 1:this.controlLocation(controlId);break;
      case 2: this.controlPost(controlId); break;
      case 3: this.controlMe(controlId); break;
      default:console.log('controlId wrong');break;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // //获取地址信息
    // this.getMyLocation();
    // this.getRecentMarkers()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.map=wx.createMapContext('mainMap');
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let openid = utils.getOpenId();
    wx.getUserInfo({
      success(res) {
       
        let userInfo = {
          avatarUrl: res.userInfo.avatarUrl,
          openid: openid,
          
        }
        apis.getUserInfoByOpenid(openid).then(res=>{
          
          if(res.success){
            userInfo.id=res.user.id;
            app.globalData.userInfo = userInfo;
          }
        })
        
      }
    })
    //获取地址信息
    this.getMyLocation();
    this.getRecentMarkers();
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  getRecentMarkers(){
    let _this=this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        const { longitude, latitude } = res;

        apis.getRecentTasks(latitude, longitude).then(res => {
          let centerM=_this.data.markers[0]||centerMarker;//如果data中没有，说明是初始化
          let markers=[centerM];
          for (let u = 0; u < res.tasks.length;u++){
            if(!res.tasks[u].passed){
              markers.push(res.tasks[u])//只添加未完成的活动
            }
          }
          //从第二个开始便利，第一个是中心点
          for(let i=1;i<markers.length;i++){
            let item=markers[i];
            
            markers[i]= {
              ...item, iconPath:markerImg,
              width: 36,
              height: 36
            }
            if (item.type == '学习') {
              markers[i].iconPath=studyIconPath;
            }
            if(item.type=='运动'){
              markers[i].iconPath = sportsIconPath;
            }
          }
          
          _this.setData({
            markers
          })
        }).catch(e=>{
          console.log(e)
        })
      },
      fail: function (res) {
        console.log(res)
        wx.showToast({
          title: "获取地址失败",
          image: '/resource/images/error.png'
        })
        getSuccess = false;
      }

    })
    
  },
  handleMapMove(e){
    let _this=this;
    if(e.type=='begin'){

    }
    if(e.type=='end'){
      const map=this.map;
      map.getCenterLocation({
        success: function (res) {
          let {longitude,latitude}=res;
          map.translateMarker({
            markerId:0,
            duration:500,
            destination:{
              longitude, latitude
            },
            animationEnd:function(){
              _this.data.markers[0].longitude=longitude;
              _this.data.markers[0].latitude = latitude;
              apis.getRecentTasks(latitude, longitude).then(res => {
                let centerM = _this.data.markers[0];
                let markers = [centerM];
                // console.log(_this.data.markers[0])
                for (let u = 0; u < res.tasks.length; u++) {
                  if (!res.tasks[u].passed) {
                    markers.push(res.tasks[u])//只添加未完成的活动
                  }
                }
                //从第二个开始便利，第一个是中心点
                for (let i = 1; i < markers.length; i++) {
                  let item = markers[i];

                  markers[i] = {
                    ...item, iconPath: markerImg,
                    width: 36,
                    height: 36
                  }
                  if (item.type == '学习') {
                    markers[i].iconPath = studyIconPath;
                  }
                  if (item.type == '运动') {
                    markers[i].iconPath = sportsIconPath;
                  }
                }

                _this.setData({
                  markers
                })
              }).catch(e => {
                console.log(e)
              })
            }
          })
        }
      })
    }
  }
})