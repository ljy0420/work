<template>
    <div class="list-box">
        <div class="filter">
            <el-form v-model="form">
                <el-form-item prop="XMMC" label="项目名称：">
                    <el-input v-model="form.XMMC" placeholder="请输入项目名称" />
                </el-form-item>
            </el-form>
        </div>
        <div class="container">
            <el-table
                v-loading="state.loading"
                class="ba-data-table w100"
                header-cell-class-name="table-header-cell"
                :data="state.cyxmArr"
                highlight-current-row
                height="100%"
            >
                <el-table-column prop="LX" label="类型" width="60" />
                <el-table-column prop="XMMC" label="项目名称" width="200" />
                <el-table-column prop="SL" label="数量" width="60" />
                <el-table-column prop="DW" label="单位" width="60" />
                <el-table-column prop="YF" label="用法" width="80" />
                <el-table-column prop="PL" label="频率" width="60" />
            </el-table>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'

const state: {
    loading: boolean
    keywords: string
    cyxmArr: any
} = reactive({
    loading: false,
    keywords: '',
    cyxmArr: [
        { LX: '套餐', XMMC: 'C—反应蛋白测定(CRP)_各种免疫学方法、单扩法', SL: '1', DW: '', YF: '', PL: '' },
        { LX: '套餐', XMMC: '化学方法', SL: '1', DW: '', YF: '', PL: '' },
        { LX: '套餐', XMMC: '化学方法', SL: '1', DW: '', YF: '', PL: '' },
        { LX: '诊疗', XMMC: 'Ⅱ级护理', SL: '1', DW: '', YF: '', PL: '' },
    ],
})
const form = reactive({
    XMMC: '',
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
    }
}
.ba-data-table {
    font-size: 12px;
}
</style>
