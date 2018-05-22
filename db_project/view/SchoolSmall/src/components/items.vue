<template>
    <div class="items">
        <ul class="items-ul">
            <p v-if="items.length==0" style="text-align:center;">暂无商品</p>
            <li v-for="(item,index) in items" :key="index" class="item-wrap" @click="showDetail(index)">
                <Card>
                    <div class="poster">
                        <img :src="item.img" :alt="item.name">
                        <p class="name">{{item.name}}</p>
                    </div>
                    <div class="card-footer">
                        <div class="tips">
                            <Tag v-for="(tag,i) in item.tags">{{tag}}</Tag>
                        </div>
                        <p class="price">价格:￥{{item.price}}</p>
                        <Button type="primary" long @click.prev.stop="addToCart(index)">加入购物车</Button>
                    </div>
                </Card>
            </li>
        </ul>
    </div>
</template>
<script>
import util from '../util.js'
export default {
    data() {
        return {}
    },
    props: {
        items: {
            type: Array,
            required: true
        }
    },
    methods:{
        addToCart(index){//加入购物车
            let username;
            if(util.readFromLocal().username){
                username=util.readFromLocal().username;
            }else{
                //用户未登录
                this.$Notice.warning({
                    title:'加入购物车失败',
                    desc:'用户未登录~'
                })
                return;
            }
            let addItem=this.items[index];
            addItem.username=username;
            addItem.num=1;
            this.$http.post(util.addToCart,addItem).then(res=>{
                if(res.data.success){
                    this.$Message.success(res.data.msg);
                }else{
                    this.$Message.error(res.data.msg);
                }
            }).catch(err=>{
                this.$Message.error(err.message)
            })

        },
        showDetail(index){
            let id=this.items[index].id;
            this.$router.push({
                name:'Detail',
                params:{
                    id:id
                }
            })
        }
    }
    
}
</script>
<style lang="scss">
.items-ul {
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    .item-wrap {
        width: 50%;
        padding: 0.25rem;
        .ivu-card-body {
            padding: 0;
            .poster {
                height: 6rem;
                width: 100%;
                overflow: hidden;
                position: relative;
                img {
                    width: 100%;
                    height:auto;
                }
                .name{
                    position: absolute;
                    bottom: 0;
                    left:0;
                    right: 0;
                    text-align: center;
                    background: rgba(0, 0, 0, 0.3);
                    color: #fff;
                }
            }
            .card-footer{
                display: flex;
                flex-direction: column;
                height: 6.5rem;
                justify-content: space-between;
                padding: 0.5rem;
                .price{
                    color: #2d8cf0;
                }
            }
        }
    }
}
</style>
