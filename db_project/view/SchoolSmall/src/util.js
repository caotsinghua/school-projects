export default {
  login: 'http://localhost:3000/api/login',
  register: 'http://localhost:3000/api/register',
  //商品管理
  getAllThing: 'http://localhost:3000/api/things',
  getThingByType: 'http://localhost:3000/api/getthingByType', //query: type=类别
  getThingByName: 'http://localhost:3000/api/getthingByName', //query: username=类别
  getThingById: 'http://localhost:3000/api/getthing', //query:id=123
  addThing: 'http://localhost:3000/api/addthing',
  updateThing: 'http://localhost:3000/api/updatething',
  ////表单格式
  // let ex={
  //     id:theid,
  //     name:'',
  //     price:'',
  //     seller:'',
  //     imgurl:'',
  //     tips:''//必须以空格分开,
  //     type:''
  // }
  deleteThing: 'http://localhost:3000/api/deletething', //post : id=13

  //用户管理
  getUsers: 'http://localhost:3000/admin/users',
  getUser: 'http://localhost:3000/admin/user', //根据用户名获取用户信息
  deleteUser: 'http://localhost:3000/admin/deleteuser', //post 删除用户
  addUser: 'http://localhost:3000/admin/adduser',
  //post 添加用户 {username,password,isAdmin,isSeller}
  updateUser: 'http://localhost:3000/admin/updateuser',
  //post 修改用户 {username,password,isAdmin,isSeller,currentName}
  beSeller:'http://localhost:3000/admin/beseller',//post username
  setMoney:'http://localhost:3000/admin/setMoney',//post money username

  //购物车相关
  getCart: 'http://localhost:3000/api/cart',//get username
  addToCart: 'http://localhost:3000/api/tocart',//post id&name&price&num&username
  deleteFromCart: 'http://localhost:3000/api/deletecart',//post id&username

  //订单相关
  getOrders:'http://localhost:3000/api/getOrder',//get username
  getOrderById:'http://localhost:3000/api/getOrderById',//get ordernum
  addOrder:'http://localhost:3000/api/addOrder',
  finishOrder:'http://localhost:3000/api/finishOrder',
  // {
  //   username:'',
  //   ordernum:'',
  //   orderthings:[
  //     {
  //        id:'',
            // seller,num,name,price
  //     }
  //   ]
  // }
  saveToLocal(user) { //存用户信息到本地

    localStorage.username = user.username;
    localStorage.isAdmin = user.isAdmin;
    localStorage.isSeller = user.isSeller;
  },
  readFromLocal() { //从本地读取用户信息
    let user = {
      username: localStorage.username,
      isAdmin: localStorage.isAdmin,
      isSeller: localStorage.isSeller
    }
    return user;
  },
  logOut() { //登出，从本地删除信息
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isSeller');
  },
  trim: function (str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
  }
}
