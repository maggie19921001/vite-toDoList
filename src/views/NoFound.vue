<template>
    <h1>404 not found</h1>
</template>
<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
onMounted(()=>{
    setTimeout(()=>{
        router.push('/')
    },3000)
})
</script>