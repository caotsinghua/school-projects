<template>
    <div class="thing-manager">
        <header class="header">
            <Row>
                <Col :span="4">
                <div @click="back">
                    <Icon type="ios-arrow-back"></Icon>
                </div>
    
                </Col>
                <Col :span="4" :offset="6">
                <p>商品管理</p>
                </Col>
            </Row>
        </header>
        <main>
            <ul class="userlist">
                <li class="title">
                    <Row type="flex" align="middle">
                        <Col :span="5">
                        <p>id</p>
                        </Col>
                        <Col :span="5">
                        <p>商品名</p>
                        </Col>
                        <Col :span="5">
                        <p>价格</p>
                        </Col>
                        <Col :span="5">
                        <p>卖家</p>
                        </Col>
                        <Col :span="4">
                        <p>操作</p>
                        </Col>
                    </Row>
                </li>
                <Row v-if="isloading">
                    <Col class="demo-spin-col" :span="8" :offset="8">
                    <Spin fix>
                        <Icon type="load-c" size="large" class="demo-spin-icon-load"></Icon>
                        <div>Loading</div>
                    </Spin>
                    </Col>
                </Row>
                <p v-show="things.length==0" style="text-align:center;margin-top:1rem;">暂无商品</p>
                <li class="user-li" v-for="(thing,index) in things" :key="index">
                    <Row type="flex" align="middle">
                        <Col :span="5">
                        <p>{{thing.id}}</p>
                        </Col>
                        <Col :span="5">
                        <p>{{thing.name}}</p>
                        </Col>
                        <Col :span="5">
                        <p>{{thing.price}}</p>
                        </Col>
                        <Col :span="5">
                        <p>{{thing.seller}}</p>
                        </Col>
                        <Col :span="4">
                        <Button type="primary" @click="updateThing(index)">修改</Button>
                        <Button type="error" @click="deleteThing(index)">删除</Button>
                        </Col>
                    </Row>
                </li>
            </ul>
        </main>
        <footer>
            <div class="foot">
                <Button type="primary" long @click="addThing">添加商品</Button>
            </div>
        </footer>
        <Back-top :height="20" :bottom="40" :right="10">
            <div class="top"><Icon type="chevron-up"></Icon></div>
        </Back-top>
        <Modal v-model="modal_addthing" width="360">
            <p slot="header" style="text-align:center">
                <Icon type="information-circled"></Icon>
                <span>添加商品</span>
            </p>
            <div>
                <Form ref="addthingForm" :model="addthingForm" label-position="left" :label-width="80" :rules="rule">
                    <Form-item label="商品名" prop="name">
                        <Input v-model="addthingForm.name"></Input>
                    </Form-item>
                    <Form-item label="价格" prop="price">
                        <Input v-model="addthingForm.price"></Input>
                    </Form-item>
                    <Form-item label="图片地址" prop="img">
                        <Input v-model="addthingForm.img"></Input>
                    </Form-item>
                    <Form-item label="标签" prop="tags">
                        <Input v-model="addthingForm.tags" placeholder="不同标签用空格隔开"></Input>
                    </Form-item>
                    <Form-item label="类别" prop="type">
                        <Select v-model="addthingForm.type">
                            <Option value="图书">图书</Option>
                            <Option value="数码">数码</Option>
                            <Option value="学习">学习</Option>
                            <Option value="日用">日用</Option>
                            <Option value="其他">其他</Option>
                        </Select>
                    </Form-item>
                </Form>
            </div>
            <div slot="footer">
                <Button type="success" @click="add('addthingForm')">确定</Button>
                <Button type="error" @click="cancle('addthingForm')">取消</Button>
            </div>
        </Modal>
        <Modal v-model="modal_updatething" width="360">
            <p slot="header" style="text-align:center">
                <Icon type="information-circled"></Icon>
                <span>修改商品信息</span>
            </p>
            <div>
                <Form ref="updateForm" :model="updateForm" label-position="left" :label-width="80" :rules="rule">
                    <Form-item label="商品名" prop="name">
                        <Input v-model="updateForm.name"></Input>
                    </Form-item>
                    <Form-item label="价格" prop="price">
                        <Input v-model="updateForm.price"></Input>
                    </Form-item>
                    <Form-item label="图片地址" prop="img">
                        <Input v-model="updateForm.img"></Input>
                    </Form-item>
                    <Form-item label="标签" prop="tags">
                        <Input v-model="updateForm.tags" placeholder="不同标签用空格隔开"></Input>
                    </Form-item>
                    <Form-item label="类别" prop="type">
                        <Select v-model="updateForm.type">
                            <Option value="图书">图书</Option>
                            <Option value="数码">数码</Option>
                            <Option value="学习">学习</Option>
                            <Option value="日用">日用</Option>
                            <Option value="其他">其他</Option>
                        </Select>
                    </Form-item>
                </Form>
            </div>
            <div slot="footer">
                <Button type="success" @click="update('updateForm')">确定</Button>
                <Button type="error" @click="cancle('updateForm')">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import util from '../../util.js'

export default {
    data() {
        return {
            isAdmin: false,
            username: '',
            things: [],
            modal_addthing: false,
            modal_updatething: false,
            isloading: false,
            addthingForm: {
                name: '',
                price: '',
                tags: '',
                img: 'https://avatars1.githubusercontent.com/u/15075816?v=3&s=460',
                type: ''
            },
            updateForm: {
                name: '',
                price: '',
                tags: '',
                img: 'https://avatars1.githubusercontent.com/u/15075816?v=3&s=460',
                type: ''
            },
            rule: {
                name: [{ required: true, message: '商品名不能为空', trigger: 'blur' }],
                price: [{ required: true, message: '价格不能为空', trigger: 'blur' }],//只能输入数字
                tags: [{ required: true, message: '标签不能为空', trigger: 'blur' }],
                img: [{ required: true, message: '图片不能为空', trigger: 'blur' }],
                type: [{ required: true, message: '类别不能为空', trigger: 'blur' }]
            }

        }
    },
    created() {
        this.isAdmin = util.readFromLocal().isAdmin;
        this.username = util.readFromLocal().username;
        this.getThings();
    },
    methods: {
        back() {
            this.$router.back();
        },
        addThing() {
            this.modal_addthing = true;
        },
        add(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let id = new Date().getTime().toString();
                    id=util.trim(id);
                    
                    let thing = this.addthingForm;
                    thing.seller = this.username;
                    thing.id = id;
                    this.$http.post(util.addThing, thing).then(res => {
                        if (res.data.success) {
                            this.$Message.success("添加商品成功!");
                            this.$refs[name].resetFields();
                            this.modal_addthing = false;
                            this.getThings();//刷新商品信息
                        } else {
                            this.$Message.error(res.data.msg);
                        }
                    }).catch(err => {
                        this.$Message.error(err.message);
                    })
                } else {
                    this.$Message.error('表单验证失败!');
                }
            })
        },
        cancle(name) {
            this.$refs[name].resetFields();
            this.modal_addthing = false;
            this.modal_updatething = false;
        },
        deleteThing(index) {
            let delId = this.things[index].id;
            this.$http.post(util.deleteThing, { id: delId }).then(res => {
                if (res.data.success) {
                    this.$Message.success(res.data.msg);
                    this.getThings();//刷新数据
                } else {
                    this.$Message.error(res.data.msg);
                }
            }).catch(err => {
                this.$Message.error(err.message);
            })
        },
        delete() {

        },
        updateThing(index) {
            this.modal_updatething = true;
            this.updateForm = this.things[index];

        },
        update(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$http.post(util.updateThing, this.updateForm).then(res => {
                        if (res.data.success) {
                            this.$Message.success("修改成功");
                            this.modal_updatething = false;
                            this.$refs[name].resetFields();
                            this.getThings();
                        } else {
                            this.$Message.error(res.data.msg);
                        }
                    }).catch(err => {
                        this.$Message.error(err.message)
                    })
                } else {
                    this.$Message.error('表单验证未通过')
                }

            })

        },
        getThings() {//获取商品信息
            this.isloading = true;
           
            if (this.isAdmin=='true') {
                //获取全部信息
                
                this.$http.get(util.getAllThing).then(res => {
                    if (res.data.success == false) {
                        this.$Message.error(res.data.msg);
                    } else {
                        let record = res.data.recordset;

                        this.things = [];

                        record.forEach(thing => {
                            let t = {};
                            t.id = thing.id;
                            t.name = thing['商品名称'];
                            t.seller = thing['商家'];
                            t.price = thing['价格'];
                            t.tags = thing['tags'];
                            t.type = thing['类别'];
                            t.img = thing['图片地址'];
                            this.things.push(t);
                        })
                    }
                    this.isloading = false;
                }).catch(err => {
                    this.$Message.error(err.message)
                    this.isloading = false;
                })
            } else {
                //获取商家的商品
                this.$http.get(util.getThingByName, {
                    params: {
                        username: this.username
                    }
                }).then(res => {
                    if (res.data.success == false) {
                        this.$Message.error(res.data.msg);
                    } else {
                        let record = res.data.recordset;
                        this.things = [];
                        let t = {};
                        record.forEach(thing => {
                            t.id = thing.id;
                            t.name = thing['商品名称'];
                            t.seller = thing['商家'];
                            t.price = thing['价格'];
                            this.things.push(t);
                        })
                    }
                    this.isloading = false;

                }).catch(err => {
                    this.$Message.error(err.message)
                    this.isloading = false;
                })
            }
        }
    }
}
</script>
<style lang="scss">
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
    background: rgb(250, 250, 250);
}

.thing-manager {
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
    main {
        margin-bottom: 2rem;
        .userlist {
            .title {
                padding: 0.5rem 1rem;
                background: #5cadff;
                color: #fff;
                text-align: center;
                position: sticky;
                top:3rem;
                left: 0;
                right: 0;
                z-index: 9;
            }
            .user-li {
                text-align: center;
                padding: 0.5rem 1rem;
                background: #fff;
                margin-bottom: 0.5rem;
            }
        }
    }
    footer {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
    }
}
</style>
