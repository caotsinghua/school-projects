<template>
    <div class="navbar">
        <Tabs :value="tabValue"  @on-click="pathTo">
            <Tab-pane :label="tab.label" :name="tab.name" :icon="tab.icon" v-for="(tab,index) in tabs" :key="index"></Tab-pane>
        </Tabs>
    </div>
</template>
<script>
export default {
    data() {
        return {
            tabs: [{
                path: '/',
                name: 'Home',
                label: '首页',
                icon: 'ios-home'
            }, {
                path: '/cart',
                name: 'Cart',
                label: '购物车',
                icon: 'ios-cart'
            }, {
                path: '/me',
                name: 'Me',
                label: '我的',
                icon: 'ios-person'
            }]
        }
    },
    computed:{
        tabValue(){
            return this.$store.getters.getTabValue;
        }
    },
    methods:{
        pathTo(name){//切换路由
            this.$router.push({name:name});
            this.$store.commit('changeTab',name);
        }
    }
}
</script>
<style lang="scss">
.navbar {
    width: 100%;
    position: fixed;
    bottom: 0;
    .ivu-tabs-bar {
        margin: 0;
        background: #fff;
        .ivu-tabs-nav {
            float: none;
            .ivu-tabs-ink-bar {
                left: -16px !important;
            }
            .ivu-tabs-tab {
                width: 33.33%;
                margin-right: 0;
                text-align: center;
            }
        }
    }
}
</style>
