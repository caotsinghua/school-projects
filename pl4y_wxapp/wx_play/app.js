//app.js
const saveInfoIntoLocalStorage = require('utils/util.js').saveInfoIntoLocalStorage;
const getInfoFromLocalStorage = require('utils/util.js').getInfoFromLocalStorage;
const apis=require('config/apis.js')
App({
  onLaunch: function () {
  },
  globalData: {
    userInfo: {},//用户信息
    userLocation:{}//用户地址
  },
  saveLocationToApp(location){
    //保存地址信息到globalData
    this.globalData.userLocation = location;
  },
  saveUserInfoToApp(userInfo){
    this.globalData.userInfo=userInfo;
  }
})