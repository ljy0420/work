<template>
    <div class="layout-box">
        摆药单
        <el-button @click="add">新增</el-button>
        <el-button @click="edit">修改</el-button>
        <el-button @click="detail">详情</el-button>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

defineOptions({
    name: 'yfzx/byd',
})

const router = useRouter()

onMounted(() => {
    
})

const add = () => {
    router.push({
        path: '/admin/yfzx/byd/add',
        query: {
            id: 0,
            type: 'add',
        },
    })
}

const edit = () => {
    router.push({
        path: '/admin/yfzx/byd/edit',
        query: {
            id: 1,
            type: 'edit',
        },
    })
}

const detail = () => {
    router.push({
        path: '/admin/yfzx/byd/detail',
        query: {
            id: 1,
            type: 'detail',
        },
    })
}
</script>

<style lang="scss" scoped>
.layout-box {
    padding: 6px;
}
</style>