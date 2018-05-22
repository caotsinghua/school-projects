<template>
    <div class="order">
        <header class="header">
            <Row>
                <Col :span="4">
                <div @click="back">
                    <Icon type="ios-arrow-back"></Icon>
                </div>
    
                </Col>
                <Col :span="4" :offset="6">
                <p>我的订单</p>
                </Col>
            </Row>
        </header>
        <main>
            <ul class="list">
                <li class="title">
                    <Row>
                        <Col :span="12">
                        <p>订单号</p>
                        </Col>
                        <Col :span="10">
                        <p>状态</p>
                        </Col>
                    </Row>
                </li>
                <li class="order-item" v-for="(order,index) in orders" :key="index" @click="more(index)">
                    <Row type="flex" align="middle">
                        <Col :span="12">
                        <p>{{order.ordernum}}</p>
                        </Col>
                        <Col :span="10">
                        <Tag :color="order.finished?'green':'red'">{{order.finished?'已完成':'未完成'}}</Tag>
                        <Button type="success" size="small" v-if="!order.finished" @click.prev.stop="checkout(index)">展开后付款</Button>
                        </Col>
                        <Col :span="2">
                        <div class="more">
                            <Icon type="chevron-down"></Icon>
                        </div>
                        </Col>
                    </Row>
                    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                        <div class="items" v-if="order.show">
                            <Row v-for="(item,i) in order.orderItems" :key="i">
                                <Col :span="12">
                                <p>商品名:
                                    <span>{{item.name}}</span>
                                </p>
                                </Col>
                                <Col :span="4">
                                <p>数量:{{item.num}}</p>
                                </Col>
                                <Col :span="8">
                                <p>总价:
                                    <span>{{item.num*item.price}}</span>
                                </p>
                                </Col>
                            </Row>
                        </div>
                    </transition>
                </li>
            </ul>
        </main>
    </div>
</template>
<script>
import util from '../../util.js'
export default {
    data() {
        return {
            username: '',
            leftmoney: '',
            orders: [],
        }
    },
    created() {
        if (util.readFromLocal().username) {
            this.username = util.readFromLocal().username;
        }
        this.leftmoney = this.$route.params.leftmoney;
        this.getData();
    },
    methods: {
        getData() {
            if (this.username) {
                this.$http.get(util.getOrders, {
                    params: {
                        username: this.username
                    }
                }).then(res => {

                    if (res.data.success) {
                        let t = [];
                        res.data.record.forEach(item => {
                            let k = item;
                            k.show = false;
                            t.push(k);
                        })
                        this.orders = t;
                    } else {
                        this.$Message.error(res.data.msg);
                    }
                }).catch(err => {

                    this.$Message.error(err.message);
                })
            } else {
                this.$Message.error('未登录!');
                this.$router.push('/login');
            }
        },
        back() {
            this.$router.back();
        },
        more(index) {
            let ordernum = this.orders[index].ordernum;

            this.$http.get(util.getOrderById, {
                params: {
                    ordernum: ordernum
                }
            }).then(res => {
                if (res.data.success) {
                    this.orders[index].orderItems = res.data.record;
                } else {
                    this.$Message.error(res.data.msg);
                }
                this.orders[index].show = !this.orders[index].show;
            }).catch(err => {
                this.$Message.error(err.message);
            })
        },
        checkout(index) {

            let sum = parseFloat(this.leftmoney);

            this.orders[index].orderItems.forEach(item => {
                sum -= item.price * item.num;
            })
            if(sum<0){
                this.$Message.error('余额不足!');
                return;
            }
            this.$http.post(util.setMoney, {
                username: this.username,
                money: sum
            }).then(res => {
                if (res.data.success) {
                   
                    //修改订单状态
                    this.$http.post(util.finishOrder, {
                        ordernum:this.orders[index].ordernum
                    }).then(res=>{
                        if(res.data.success){
                             this.$Message.success('付款成功');
                             this.getData();
                        }else{
                             this.$Message.error(res.data.msg)
                        }
                    })
                } else {
                    this.$Message.error(res.data.msg)
                }
            }).catch(err => {
                this.$Message.error(err.message)
            })


        }
    }
}
</script>
<style lang="scss">
.order {
    width: 100%;
    min-height: 100vh;
    background: rgb(250, 250, 250);
    .header {
        width: 100%;
        height: 3rem;
        background: #5cadff;
        color: #fff;
        position: sticky;
        top: 0;
        left: 0;
        right: 0;
        z-index: 9;
        i {
            font-size: 1.3rem;
            line-height: 3rem;
            padding-left: 1rem;
        }
        p {
            line-height: 3rem;
        }
    }
    main {
        .list {
            width: 100%;
            .title {
                padding: 0.5rem 1rem;
                border-bottom: 1px solid #eee;
                color: rgb(92, 173, 255);
            }
            .order-item {
                padding: 1rem;
                border-bottom: 1px solid #eee;
            }
        }
    }
}
</style>
