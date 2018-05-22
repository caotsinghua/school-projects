// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import router from './router'
import axios from 'axios'
import Iview from 'iview'
Vue.config.productionTip = false

import 'iview/dist/styles/iview.css';  
import '../static/css/animate.css'


axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
Vue.prototype.$http=axios;

Vue.use(Iview)
Vue.use(Vuex)
/* eslint-disable no-new */
let store=new Vuex.Store({
  state:{
    tabValue:'Home'
  },
  mutations:{
    changeTab(state,value){
      state.tabValue=value;
    }
  },
  getters:{
    getTabValue:state=>{
      return state.tabValue;
    }
  }
})
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
