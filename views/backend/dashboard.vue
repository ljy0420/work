<template>
    <DefaultDashboard />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import DefaultDashboard from './home/index.vue'

defineOptions({
    name: 'dashboard',
})

onMounted(() => {
    
})

</script>

<style scoped lang="scss">
</style>
