<template>
    <div class="layout-box">
        <h3>计划开发中...</h3>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

defineOptions({
    name: 'test/demo',
})

onMounted(() => {

})

</script>

<style lang="scss" scoped>
.layout-box {
    margin: 6px;
    background-color: #fff;
    padding: 20px;
    height: calc(100vh - 100px);
}
</style>