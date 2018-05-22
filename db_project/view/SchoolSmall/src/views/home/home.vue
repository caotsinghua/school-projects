<template>
    <div class="home">
        <header class="header">
            <Row type="flex" align="middle">
                <Col :span="6">
                <p class="logo">
                    <Icon type="outlet"></Icon> 小商场</p>
                </Col>
                <Col :span="15" :offset="1">
                <Input v-model="searchMsg" icon="ios-search" placeholder="查询商品..." @on-enter="search" @on-click="search"></Input>
                </Col>
                <Col :span="2">
                    <div class="login" @click="login"><Icon type="log-in"></Icon></div>
                </Col>
            </Row>
        </header>
        <div class="main">
            <Tabs size="small" @on-click="getData">
                <Tab-pane label="图书">
                    <my-items  :items="items1"></my-items>
                </Tab-pane>
                <Tab-pane label="数码">
                    <my-items  :items="items2"></my-items>
                </Tab-pane>
                <Tab-pane label="学习">
                    <my-items  :items="items3"></my-items>
                </Tab-pane>
                <Tab-pane label="日用">
                    <my-items  :items="items4"></my-items>
                </Tab-pane>
                <Tab-pane label="其他">
                    <my-items  :items="items5"></my-items>
                </Tab-pane>
            </Tabs>
        </div>
        <Back-top :height="200" :bottom="40" :right="10">
            <div class="top"><Icon type="chevron-up"></Icon></div>
        </Back-top>
        <div class="spin-container" v-if="loading">
            <Spin fix>
                <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                <div>Loading</div>
            </Spin>
        </div>
    </div>
</template>
<script>
import items from '../../components/items'
import util from '../../util.js'
export default {
    data() {
        return {
            searchMsg: '',
            items1:[],
            items2:[],
            items3:[],
            items4:[],
            items5:[],
            loading:false
        }
    },
    components:{
        'my-items':items
    },
    created(){
        this.getData(0);//只获取第一种类
    },
    methods:{
        getData(name){
            this.loading=true;
            switch(name){
                case 0:this.getData0('图书','items1');break;
                case 1:this.getData0('数码','items2');break;
                case 2:this.getData0('学习','items3');break;
                case 3:this.getData0('日用','items4');break;
                case 4:this.getData0('其他','items5');break;
            }
            this.loading=false;
        },
        getData0(type,itemname){
            this.$http.get(util.getThingByType,{
                params:{
                    type:type
                }
            }).then(res=>{
                let record=res.data.recordset;
                this[itemname]=[];
                record.forEach(thing=>{
                    let t={}
                    t.id=thing.id;
                    t.img=thing['图片地址'];
                    t.tags=thing['tags'].split(' ');
                    t.name=thing['商品名称'];
                    t.price=thing['价格'];
                    t.seller=thing['商家'];
                    this[itemname].push(t);
                })
            }).catch(err=>{
                this.$Message.error(err.message)
            })
        },
        login(){
            this.$router.push('/login')
        },
        search(){
            this.$router.push({
                name:'Search',
                query:{
                    keyword:this.searchMsg
                }
            })
        }
    }
}
</script>
<style lang="scss">
.spin-container {

        .demo-spin-icon-load {
            animation: ani-demo-spin 1s linear infinite;
        }
        @keyframes ani-demo-spin {
            from {
                transform: rotate(0deg);
            }
            50% {
                transform: rotate(180deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
        .demo-spin-col {
            height: 100px;
            position: relative;
            border: 1px solid #eee;
        }
    }
.home {
    width: 100%;
    min-height: 100vh;
    background: rgb(250, 250, 250);
    
    .header {
        position: sticky;
        top: 0;
        width: 100%;
        z-index: 9;
        padding: 0.7rem 0 0.7rem 1rem;
        background: #fff;
        border-bottom: 1px solid #eee;
        .logo {
            font-size: 1rem;
            color: rgb(73, 180, 234);
        }
        .login{
            width: 2rem;
            height:2rem;
            
            i{
                font-size: 1rem;
                text-align: center;
                line-height: 2rem;
                display: block;
                margin: 0 auto;
                color: rgb(73, 180, 234);
            }
        }
    }
    .main{
        margin-bottom: 3rem;
       
    }
    .top{
        padding: 10px;
        width: 3rem;
        height: 3rem;
        background:rgb(0, 153, 229);
        text-align: center;
        border-radius: 50%;
        i{
            padding: 0;
        }
        z-index: 9;
    }
}
</style>
