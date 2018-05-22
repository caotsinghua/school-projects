<template>
    <div class="detail">
        <header class="header">
            <Row>
                <Col :span="4">
                <div @click="back">
                    <Icon type="ios-arrow-back"></Icon>
                </div>
    
                </Col>
                <Col :span="4" :offset="6">
                <p>商品详情</p>
                </Col>
            </Row>
        </header>
        <div class="poster">
            <img :src="this.item.img" :alt="this.item.name">
        </div>
        <div class="info">
            <p class="name">{{this.item.name}}</p>
            <p class="price">惊爆价:￥{{this.item.price}}</p>
            <Tag type="border" color="blue">{{this.item.type}}</Tag>
            <div class="tags">
                <Tag v-for="(tag,i) in this.item.tags" :key="i">{{tag}}</Tag>
            </div>
        </div>
        <footer>
            <Row type="flex" align="middle">
                <Col :span="4">
                <div class="foot-btn" @click="sellerInfo">
                    <Icon type="android-contact"></Icon>
                    <p>卖家信息</p>
                </div>
                </Col>
                <Col :span="4">
                <div class="foot-btn" @click="toMall">
                    <Icon type="outlet"></Icon>
                    <p>店铺</p>
                </div>
                </Col>
                <Col :span="4">
                <div class="foot-btn" @click="loveit" :class="{'love':love}">
                    <Icon type="star"></Icon>
                    <p>收藏</p>
                </div>
                </Col>
                <Col :span="8" :offset="4">
                <Button type="primary" long size="large" @click="addToCart">加入购物车</Button>
                </Col>
            </Row>
        </footer>
        <Modal v-model="userinfo" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>商家信息</span>
            </p>
            <div style="text-align:center">
                <p>卖家账户名:{{this.item.seller}}</p>
    
            </div>
            <div slot="footer">
                <Button type="success" size='large' @click="contact">联系ta</Button>
                <Button type="error" size="large" @click="close">关闭</Button>
            </div>
        </Modal>
        <div class="spin-container" v-if="loading">
            <Spin fix>
                <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                <div>Loading</div>
            </Spin>
        </div>
    </div>
</template>
<script>
import util from '../../util.js'
export default {
    data() {
        return {
            id: '',
            item: {},
            love: false,
            userinfo: false,
            loading: false
        }
    },
    created() {
        this.getId();
        this.getData();
        
    },
    methods: {
        back() {
            this.$router.back();
        },
        getId() {
            this.id = this.$route.params.id;
        },
        getData() {
            this.loading = true;
            this.$http.get(util.getThingById, {
                params: {
                    id: this.id
                }
            }).then(res => {
     
                if (res.data.success) {
                    let t = res.data.record[0];
                    this.item.id = t.id;
                    this.item.tags = t.tags.split(' ');
                    this.item.price = t['价格'];
                    this.item.seller = t['商家'];
                    this.item.img = t['图片地址'];
                    this.item.name = t['商品名称'];
                    this.item.type = t['类别'];
                    this.loading = false;
                } else {
                    this.$Message.error(res.data.msg);
                    this.$router.back();
                }

            }).catch(err => {
                this.$Message.error(err.message);
            })
        },
        addToCart() {
            let username;
            if (util.readFromLocal().username) {
                username = util.readFromLocal().username;
            } else {
                //用户未登录
                this.$Notice.warning({
                    title: '加入购物车失败',
                    desc: '用户未登录~'
                })
                return;
            }
            let addItem = this.item;
            addItem.username = username;
            addItem.num = 1;
            this.$http.post(util.addToCart, addItem).then(res => {
                if (res.data.success) {
                    this.$Message.success(res.data.msg);
                } else {
                    this.$Message.error(res.data.msg);
                }
            }).catch(err => {
                this.$Message.error(err.message)
            })
        },
        sellerInfo() {
            this.userinfo = true;
        },
        toMall() {
            this.$Message.warning('没有店铺哦~');
        },
        loveit() {
            if (!this.love) {
                this.$Message.success('收藏这个啦');
            } else {
                this.$Message.warning('取消收藏这个啦');
            }
            this.love = !this.love;
        },
        close() {
            this.userinfo = false;
        },
        contact() {
            this.$Message.warning('这个功能没有哦~');
        }
    }
}
</script>
<style lang="scss">
.love {
    color: #5cadff;
}

.detail {
    width: 100%;
    height: 100vh;
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
    .poster {
        width: 100%;
        height: 65%;
        overflow: hidden;
        img {
            width: 100%;
            height: auto;
        }
    }
    .info {
        width: 100%;
        padding: 1rem;
        margin-bottom: 3rem;
        .name {
            font-size: 1.2rem;
            color: #000;
            max-width: 15rem;
        }
        .price {
            font-size: 1rem;
            color: #ff9900;
        }
        .tags {}
    }
    footer {
        position: fixed;
        background: #fff;
        border-top: 1px solid #eee;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 9;
        .foot-btn {
            width: 100%;
            height: 100%;
            padding: 0.5rem 0.1rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            i {
                font-size: 1.2rem;
            }
            border-right: 1px solid #eee;
            transition: .3s;
            &:active {
                background: #eee;
                color: #5cadff;
            }
        }
    }
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
}
</style>
