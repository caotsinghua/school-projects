<template>
    <div class="user-manager">
        <header class="header">
            <Row>
                <Col :span="4">
                <div @click="back">
                    <Icon type="ios-arrow-back"></Icon>
                </div>
    
                </Col>
                <Col :span="4" :offset="6">
                <p>用户管理</p>
                </Col>
            </Row>
        </header>
        <main>
            <ul class="userlist">
                <li class="title">
                    <Row type="flex" align="middle">
                        <Col :span="5">
                        <p>用户名</p>
                        </Col>
                        <Col :span="5">
                        <p>密码</p>
                        </Col>
                        <Col :span="5">
                        <p>管理员</p>
                        </Col>
                        <Col :span="5">
                        <p>商家</p>
                        </Col>
                        <Col :span="4">
                        <p>操作</p>
                        </Col>
                    </Row>
                </li>
                <li class="user-li" v-for="(user,index) in users" :key="index">
                    <Row type="flex" align="middle">
                        <Col :span="5">
                        <p>{{user.username}}</p>
                        </Col>
                        <Col :span="5">
                        <p>{{user.password}}</p>
                        </Col>
                        <Col :span="5">
                        <p>{{user.isAdmin}}</p>
                        </Col>
                        <Col :span="5">
                        <p>{{user.isSeller}}</p>
                        </Col>
                        <Col :span="4">
                        <Button type="primary" @click="openModal2(index)">修改</Button>
                        <Button type="error" @click="openModal(index)">删除</Button>
                        </Col>
                    </Row>
                </li>
            </ul>
        </main>
        <footer>
            <div class="foot">
                <Button type="primary" long @click="addUser">添加用户</Button>
            </div>
        </footer>
        <Back-top :height="200" :bottom="40" :right="10">
            <div class="top"><Icon type="chevron-up"></Icon></div>
        </Back-top>
        <Modal v-model="modal_adduser" width="360">
            <p slot="header" style="text-align:center">
                <Icon type="information-circled"></Icon>
                <span>添加用户</span>
            </p>
            <div>
                <Form ref="addform" :model="addform" label-position="left" :label-width="80" :rules="rule">
                    <Form-item label="用户名" prop="username">
                        <Input v-model="addform.username"></Input>
                    </Form-item>
                    <Form-item label="密码" prop="password">
                        <Input v-model="addform.password"></Input>
                    </Form-item>
                    <Form-item label="管理员?" prop="isAdmin">
                        <Select v-model="addform.isAdmin">
                            <Option value="true">是</Option>
                            <Option value="false">否</Option>
                        </Select>
                    </Form-item>
                    <Form-item label="商家?" prop="isSeller">
                        <Select v-model="addform.isSeller">
                            <Option value="true">是</Option>
                            <Option value="false">否</Option>
                        </Select>
                    </Form-item>
    
                </Form>
            </div>
            <div slot="footer">
                <Button type="success" :loading="modal_loading" @click="add('addform')">确定</Button>
                <Button type="error" @click="cancle('addform')">取消</Button>
            </div>
        </Modal>
        <Modal v-model="real_delete_modal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>删除确认</span>
            </p>
            <div style="text-align:center">
                <p>是否继续删除？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long @click="deleteUser">删除</Button>
            </div>
        </Modal>
        <Modal v-model="modal_update" width="360">
            <p slot="header" style="text-align:center">
                <Icon type="information-circled"></Icon>
                <span>修改用户信息</span>
            </p>
            <div>
                <Form ref="updateForm" :model="updateForm" label-position="left" :label-width="80" :rules="rule">
                    <Form-item label="用户名" prop="username">
                        <Input v-model="updateForm.username"></Input>
                    </Form-item>
                    <Form-item label="密码" prop="password">
                        <Input v-model="updateForm.password"></Input>
                    </Form-item>
                    <Form-item label="管理员?" prop="isAdmin">
                        <Select v-model="updateForm.isAdmin">
                            <Option value="true">是</Option>
                            <Option value="false">否</Option>
                        </Select>
                    </Form-item>
                    <Form-item label="商家?" prop="isSeller">
                        <Select v-model="updateForm.isSeller">
                            <Option value="true">是</Option>
                            <Option value="false">否</Option>
                        </Select>
                    </Form-item>
                    <Form-item label="余额" prop="leftmoney">
                        <Input v-model="updateForm.leftmoney"></Input>
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
import apis from '../../util.js'
let trim=function(){
    return this.replace(/(^\s*)|(\s*$)/g, ""); 
}
export default {
    data() {
        return {
            users: [],
            modal_adduser: false,
            modal_update: false,
            modal_loading: false,
            real_delete_modal: false,
            delIndex: -1,
            updateIndex: -1,
            addform: {
                username: '',
                password: '',
                isAdmin: '',
                isSeller: ''
            },
            updateForm: {
                username: '',
                password: '',
                isAdmin: '',
                isSeller: '',
                leftmoney:''
            },
            rule: {
                username: [{ required: true, message: '用户名呢？', trigger: 'blur' }],
                password: [{ required: true, message: '密码呢？', trigger: 'blur' },
                { min: 3, max: 15, message: '密码3-15位', trigger: 'blur' }],
                isAdmin: [{ required: true, message: '是管理员吗？', trigger: 'blur' }],
                isSeller: [{ required: true, message: '是商家吗？', trigger: 'blur' }],
                leftmoney:[{ required: true, message: '余额设置多少', trigger: 'blur' }]
            }
        }
    },
    created() {
        this.getUsers();
    },
    methods: {
        back() {
            this.$router.back();
        },
        getUsers() {
            this.users = [];//清空所有用户
            this.$http.get(apis.getUsers).then(res => {

                if (res.data.success == false) {
                    this.$Message.error(res.data.msg);
                } else {
                    let record = res.data.recordset;
                    record.forEach(user => {
                        let t = {};
                        t.username = user['用户名'];
                        t.password = user['密码'];
                        t.isAdmin = user['管理员'];
                        t.isSeller = user['商家'];
                        t.leftmoney=user['余额'];
                        this.users.push(t);
                    })
                }
            }).catch(err => {
                this.$Message.error(err.message);
            })
        },
        openModal(index) {
            this.delIndex = index;
            this.real_delete_modal = true;
        },
        openModal2(index) {
            this.updateIndex = index;//修改更改的id
            this.updateForm.username=this.users[index].username;
             this.updateForm.password=this.users[index].password.trim();
            this.updateForm.isAdmin=this.users[index].isAdmin?'true':'false';
            this.updateForm.isSeller=this.users[index].isSeller?'true':'false';
             this.updateForm.leftmoney=this.users[index].leftmoney;
            this.modal_update=true;
        },
        deleteUser() {
            if (this.delIndex == -1) {
                this.$Message.error('选错了把！');
                return;
            }
            let deleName = this.users[this.delIndex].username;

            if (deleName == apis.readFromLocal().username) {
                this.$Message.error('不能删除自己！');
                return;
            }
            this.$http.post(apis.deleteUser, { username: deleName }).then(res => {

                if (res.data.success) {
                    this.$Message.success(`删除用户${deleName}成功`);
                    this.getUsers();//重新获取用户数据
                    this.real_delete_modal = false;
                } else {
                    this.$Notice.error({
                        title: '删除失败',
                        desc: res.data.msg
                    });
                }

            }).catch(err => {
                this.$Message.error(err.message);
            })
        },
        addUser() {//打开modal
            this.modal_adduser = true;

        },
        update(name) {
            let form=this.updateForm;
            form.currentName=this.users[this.updateIndex].username;//加入修改的信息的username
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$http.post(apis.updateUser, form).then(res => {
                        if (res.data.success) {
                            this.$Message.success(res.data.msg);
                            this.modal_loading = false;
                            this.$refs[name].resetFields();
                            this.modal_update=false;
                            //更新数据
                            this.getUsers();
                        } else {
                            this.$Message.warning(res.data.msg);
                            this.modal_loading = false;
                        }

                    }).catch(err => {
                        this.$Message.error(err.message);
                        this.modal_loading = false;
                    })
                    //  this.$Message.success('验证成功!');

                } else {
                    this.$Message.error('表单验证失败!');
                }
            })
        },
        add(name) {
            this.modal_loading = true;
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$http.post(apis.addUser, this.addform).then(res => {
                        if (res.data.success) {
                            this.$Message.success(res.data.msg);
                            this.modal_loading = false;
                            this.$refs[name].resetFields();
                            this.modal_adduser = false;
                            this.getUsers();
                        } else {
                            this.$Message.warning(res.data.msg);
                            this.modal_loading = false;
                        }

                    }).catch(err => {
                        this.$Message.error(err.message);
                        this.modal_loading = false;
                    })
                    //  this.$Message.success('验证成功!');

                } else {
                    this.$Message.error('表单验证失败!');
                }
            })
        },
        cancle(name) {
            this.modal_adduser = false;
            this.$refs[name].resetFields();
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
.user-manager {
    width: 100%;
    height: 100vh;
    background: rgb(250, 250, 250);
    .header {
        width: 100%;
        height: 3rem;
        background: #5cadff;
        color: #fff;
         position: sticky;
                top:0;
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
