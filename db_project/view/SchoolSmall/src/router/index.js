import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/index/index';
import Home from '@/views/home/home';
import Me from '@/views/me/me';
import Cart from '@/views/cart/cart';
import Login from '@/views/login/login'
import Register from '@/views/register/register'
import NotFound from '@/views/notfound/notfound'
import UserManager from '@/views/manager/userManager'
import ThingManager from '@/views/manager/thingManager'
import Detail from '@/views/detail/detail'
import Search from '@/views/search/search'
import Order from '@/views/order/order'
import iView from 'iview'
Vue.use(Router)

let title = function (title) {
  title = title ? title + ' - Home' : 'SchoolSmall';
  window.document.title = title;
};

let router = new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'Index',
    component: Index,
    redirect: { name: 'Home' },
    children: [{
      path: '/home',
      name: 'Home',
      component: Home,
    }, {
      path: '/cart',
      name: 'Cart',
      component: Cart,
    }, {
      path: '/me',
      name: 'Me',
      component: Me,
    }]
  },{
    path:'/login',
    name:'Login',
    component:Login
  },{
    path:'/register',
    name:'Register',
    component:Register
  },{
    path:'/usermanager',
    name:'UserManager',
    component:UserManager
  },{
    path:'/thingmanager',
    name:'ThingManager',
    component:ThingManager
  },{
    path:'/detail/:id',
    name:'Detail',
    component:Detail
  },{
    path:'/search',
    name:'Search',
    component:Search
  },{
    path:'/order',
    name:'Order',
    component:Order
  },{
      path:'*',
      name:'NotFound',
      component:NotFound
    }]
})
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  title(to.meta.title);
  next();
});

router.afterEach(() => {
  iView.LoadingBar.finish();
  window.scrollTo(0, 0);
});
export default router;
