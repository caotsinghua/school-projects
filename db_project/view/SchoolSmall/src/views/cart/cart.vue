<template>
    <div class="cart">
        <header class="header">
            <Row>
                <Col :span="4" :offset="10">
                <p class="title">购物车({{items.length}})</p>
                </Col>
                <Col :span="4" :offset="6">
                <a href="javascript:;" class="edit" @click="edit" v-if="!isEdit">编辑</a>
                <a href="javascript:;" class="edit" @click="save" v-else>保存</a>
                </Col>
    
            </Row>
        </header>
        <main class="main">
            <ul class="items-ul">
                <p v-if="items.length==0" style="text-align:center;">购物车空空如也~</p>
                <Checkbox-group v-model="checkAllGroup" @on-change="checkAllGroupChange">
                    <li class="items-li" v-for="(item,index) in items" :key="index">
                        <Row type="flex" align="middle">
                            <Col :span="4">
                            <Checkbox :label="index"></Checkbox>
                            </Col>
                            <Col :span="6">
                            <div class="poster">
                                <img :src="item.img">
                            </div>
                            </Col>
                            <Col :span="8" :offset="2">
                            <div class="item-info">
                                <p class="name">{{item.name}}</p>
                                <span class="price">￥{{item.price}}</span>
                                <Input-number :max="10000" :min="1" v-model="item.num" :disabled="!isEdit" @on-change="numChange"></Input-number>
                            </div>
                            </Col>
                            <Col :span="4">
                            <Button type="error" @click="deleteItem(index)">删除</Button>
                            </Col>
                        </Row>
                    </li>
    
                </Checkbox-group>
    
            </ul>
    
        </main>
        <footer class="cart-foot">
            <Row>
                <Col :span="18">
                <div class="left">
                    <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
                    <div class="info">
                        <span class="total">合计: ￥{{sum}}</span>
                        <span class="yunfei">不含运费</span>
                    </div>
                </div>
    
                </Col>
                <Col :span="6">
                <Button type="primary" long size="large" :disabled="isEdit||checkAllGroup.length==0" @click="submitOrder">提交订单</Button>
                </Col>
            </Row>
        </footer>
    </div>
</template>
<script>
import util from '../../util.js'
export default {
    data() {
        return {
            items: [],
            checkAllGroup: [],
            indeterminate: false,
            checkAll: false,
            isEdit: false,
            sum: 0,
            username: ''
        }
    },
    created() {
        this.username = util.readFromLocal().username;
        this.getCartInfo(this.username);
    },
    methods: {
        edit() {
            this.isEdit = true;

        },
        save() {
            this.isEdit = false;
        },
        deleteItem(index) {
            let delInfo = {
                id: this.items[index].id,
                username: this.username
            }

            this.$http.post(util.deleteFromCart, delInfo).then(res => {
                if (res.data.success) {
                    this.$Message.success('删除成功');
                    this.getCartInfo(this.username);//刷新购物车
                   
                } else {
                    this.$Message.error(res.data.msg);
                }
                 
            }).catch(err => {
                
                this.$Message.error(err.message);
            })
        },
        getCartInfo(username) {
            //获取购物车信息
            this.$http.get(util.getCart, {
                params: {
                    username: username
                }
            }).then(res => {

                if (res.data.success) {
                    let record = res.data.record;
                    let data = [];
                    record.forEach(item => {
                        let t = {};
                        t.id = item.id;
                        t.name = item['商品名称'];
                        t.username = item['用户名'];
                        t.img = item['图片地址'];
                        t.num = item['数量'];
                        t.price = item['价格'];
                        t.seller = item['商家'];
                        data.push(t);
                    })
                    this.items = data;
                    this.getTotal(this.checkAllGroup);
                   
                } else {
                    this.$Message.error(res.data.msg);
                }
            }).catch(err => {
                // console.log(err);
                // this.$Message.error(err.message);
            })
        },
        handleCheckAll() {
            if (this.indeterminate) {
                this.checkAll = false;
            } else {
                this.checkAll = !this.checkAll;
            }
            this.indeterminate = false;

            if (this.checkAll) {
                let t = [];
                this.items.forEach((item, index) => {
                    t.push(index);
                })
                this.checkAllGroup = t;
            } else {
                this.checkAllGroup = [];
            }
            this.getTotal(this.checkAllGroup);
        },
        checkAllGroupChange(data) {
            //选中一个标签时计算总额
            this.getTotal(data);
            if (data.length === this.items.length) {
                this.indeterminate = false;
                this.checkAll = true;
            } else if (data.length > 0) {
                this.indeterminate = true;
                this.checkAll = false;
            } else {
                this.indeterminate = false;
                this.checkAll = false;
            }
        },
        getTotal(data) {
           
            this.sum = 0;
            //根据选中的index值来计算
            if (data.length > 0) {
                data.forEach(t => {
                    this.sum += parseFloat(this.items[t].price) * this.items[t].num;
                })
            }
        },
        numChange(value) {
            this.getTotal(this.checkAllGroup);
        },
        submitOrder(){
            let checkThingsIndex=this.checkAllGroup;
            let username=this.username;
            let ordernum=new Date().getTime();//只能精确到秒
            let orderthings=[];
            let order={};
            order.ordernum=ordernum;
            order.username=username;
            order.orderthings=orderthings;
            checkThingsIndex.forEach(item=>{
                order.orderthings.push(this.items[item]);
            })
            
         
            
            this.$http.post(util.addOrder,order).then(res=>{
                if(res.data.success){
                    this.$Message.success(res.data.msg);
                }else{
                    this.$Message.error(res.data.msg);
                }
            }).catch(err=>{
                this.$Message.error(err.message)
            })
        }
    }
}
</script>
<style lang="scss">
.cart {
    width: 100%;
    height: 100vh;
    background: rgb(250, 250, 250);
    .header {
        position: sticky;
        top: 0;
        width: 100%;
        z-index: 9;
        padding: 0.7rem 1rem;
        background: #5cadff;
        border-bottom: 1px solid #eee;
        .title {
            text-align: center;
            color: #fff;
        }
        .edit {
            color: #fff;
        }
    }
    .items-ul {
        padding: 1rem 0;
        margin-bottom: 5rem;
        .items-li {
            background: #fff;
            padding: 0.5rem;
            margin-bottom: 0.5rem;
            .ivu-checkbox+span {
                display: none;
            }
            .poster {
                width: 100%;
                height: 5rem;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .item-info {
                display: flex;
                min-height: 5rem;
                flex-direction: column;
                justify-content: center;
                .name {
                    font-size: 1.1rem;
                }
                .price {
                    font-size: .8rem;
                    color: #ed3f14;
                }
            }
        }
    }
    .cart-foot {
        position: fixed;
        height: 3rem;
        bottom: 2.2rem;
        left: 0;
        right: 0;
        background: #fff;
        .left {
            padding: 0 1rem;
            display: flex;
            justify-content: space-between;
            height: 3rem;
            align-items: center;
            .info {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                .yunfei {
                    font-size: 0.6rem;
                }
                .total {
                    font-size: 1rem;
                    color: #ff9900;
                }
            }
        }
    }
}
</style>
