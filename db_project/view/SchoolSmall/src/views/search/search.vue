<template>
    <div class="search">
        <header class="header">
            <Row>
                <Col :span="4">
                <div @click="back">
                    <Icon type="ios-arrow-back"></Icon>
                </div>
    
                </Col>
                <Col :span="4" :offset="6">
                <p>搜索结果</p>
                </Col>
            </Row>
        </header>
        <main>
            <p v-if="items.length==0" style="text-align:center;padding-top:3rem;">没有查找到相关信息~</p>
            <my-items :items="items"></my-items>
        </main>
    </div>
</template>
<script>
import util from '../../util.js'
import myitems from '../../components/items'
export default {
    data(){
        return {
            keyword:'',
            allItems:[],
            items:[]
        }
    },
    components:{
        'my-items':myitems
    },
    created(){
        this.getAllThing()
        
    },
    methods:{
        getAllThing(){
            this.keyword=this.$route.query.keyword;
            this.$http.get(util.getAllThing).then(res=>{
              
                if(res.data.hasOwnProperty('success')&&res.data.success==false){
                    this.$Message.error(res.data.msg);
                }else{
                    let record=res.data.recordset;
                    record.forEach(item=>{
                        let t={};
                        t.id=item.id;
                        t.tags=item.tags.split(' ');
                        t.price=item['价格'];
                        t.seller=item['商家'];
                        t.name=item['商品名称'];
                        t.img=item['图片地址'];
                        t.type=item['类别'];
                        this.allItems.push(t);
                        
                    })
                    this.search();
                }
            }).catch(err=>{
                this.$Message.error(err.message);
            })
        },
        search(){
            
            this.allItems.forEach(item=>{
                
                if(item.name.indexOf(this.keyword)!=-1){
                    
                    this.items.push(item);
                }
            })
            console.log(this.items);
        },
        back(){
            this.$router.back();
        }
    }
}
</script>
<style lang="scss">
.search {
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
        .login {
            width: 2rem;
            height: 2rem;

            i {
                font-size: 1rem;
                text-align: center;
                line-height: 2rem;
                display: block;
                margin: 0 auto;
                color: rgb(73, 180, 234);
            }
        }
    }
}
</style>
