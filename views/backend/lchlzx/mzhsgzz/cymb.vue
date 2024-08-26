<template>
    <div class="list-box">
        <div class="filter">
            <el-form v-model="form">
                <el-form-item prop="MBGS">
                    <el-radio-group v-model="checked" class="group" size="small">
                        <el-radio class="item" :label="1" size="small">院级</el-radio>
                        <el-radio class="item" :label="2" size="small">科级</el-radio>
                        <el-radio class="item" :label="3" size="small">个人</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="MBMC" label="模板名称：">
                    <el-input v-model="form.MBMC" placeholder="请输入模板名称" />
                </el-form-item>
            </el-form>
        </div>
        <div class="container">
            <div class="container-title">模板名称</div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
const checked = ref(1)
const state: {
    loading: boolean
    keywords: string
} = reactive({
    loading: false,
    keywords: '',
})
const form = reactive({
    MBMC: '',
})

onMounted(() => {
    state.loading = true
    setTimeout(() => {
        state.loading = false
    }, 1000)
})
</script>

<style lang="scss" scoped>
.list-box {
    display: flex;
    flex-direction: column;
    position: relative;
    height: 100%;

    .container {
        height: calc(100% - 40px);
        margin-top: 10px;
        border: 1px solid black;
    }
}
:deep(.el-radio) {
    margin-right: 6px;
    font-size: 12px;
}
</style>
