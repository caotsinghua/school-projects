<template>
    <div class="index" mode="out-in">
        <transition name="fade" mode="out-in" enter-active-class="animated slideInRight">
            <router-view></router-view>
        </transition>
    
        <me-navbar></me-navbar>
    </div>
</template>
<script>
import navbar from '../../components/navbar'
export default {
    data() {
        return {
          
        }
    },
    components: {
        'me-navbar': navbar
    }
}
</script>
<style lang="scss">
.slide-fade-enter-active {
    transition: all 1s linear;
}

.slide-fade-leave-active {
    transition: all 1s linear;
}

.slide-fade-enter,
.slide-fade-leave-to {
    transform: translateX(100%);
}

.slide-fade-enter-to {
    transform: translateX(0%);
}

.index {
    background: rgb(250, 250, 250);
    
}
</style>
