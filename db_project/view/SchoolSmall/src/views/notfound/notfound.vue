<template>
    <h1 class="title">当前页面不存在！！！即将进入登陆页面</h1>
</template>
<script>
    export default{
        data(){
            return{

            }
        },
        beforeRouteEnter: (to, from, next) => {
           next();
           setTimeout(()=>{
               next('/login')
           },2000)
        }
    }
</script>
<style lang="scss" scoped>
    .title{
        text-align: center;
        margin-top: 2rem;
    }
</style>