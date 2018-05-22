

// 本地缓存
function saveInfoIntoLocalStorage(key,data){
  //同步保存
  wx.setStorageSync(key, data)
}
//从缓存获取信息
function getInfoFromLocalStorage(key) {
  //同步
  try {
    let value = wx.getStorageSync(key)
    if(value){
      return {
        success: true,
        value
      }
    }else{
      return { success: false, errMsg: '没有'+key}
    }
  } catch (e) {
    // Do something when catch error
    return {success:false,errMsg:e.message}
  }
}
function getOpenId(){
  let session=getInfoFromLocalStorage('sessionInfo');
  if(session.success){
    return session.value.sessionValue.split('==')[1];
  }else{
    return '';
  }
}
module.exports={
  saveInfoIntoLocalStorage,
  getInfoFromLocalStorage,
  getOpenId
}