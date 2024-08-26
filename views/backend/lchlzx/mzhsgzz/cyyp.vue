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
                :data="state.cyypArr"
                highlight-current-row
                height="100%"
            >
                <el-table-column prop="XMMC" label="项目名称" width="200" />
                <el-table-column prop="SL" label="数量" width="60" />
                <el-table-column prop="DW" label="单位" width="60" />
                <el-table-column prop="JS" label="剂数" width="60" />
                <el-table-column prop="TS" label="天数" width="60" />
                <el-table-column prop="YF" label="用法" width="80" />
                <el-table-column prop="PL" label="频率" width="60" />
                <el-table-column prop="DS" label="滴速" width="60" />
            </el-table>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'

const state: {
    loading: boolean
    keywords: string
    cyypArr: any
} = reactive({
    loading: false,
    keywords: '',
    cyypArr: [
        { XMMC: '养血清脑颗粒4G*15袋', SL: '1', DW: '', JS: '1', TS: '1', YF: '', PL: 'bid', DS: '' },
        { XMMC: '注射用头孢他啶1G', SL: '1', DW: '', JS: '1', TS: '1', YF: '静脉输液', PL: 'qd', DS: '' },
        { XMMC: '0.8%氯化钠注射液250ml', SL: '1', DW: '', JS: '1', TS: '1', YF: '静脉输液', PL: 'qd', DS: '' },
        { XMMC: '维生素A50片', SL: '2', DW: '', JS: '1', TS: '1', YF: '口服', PL: 'bid', DS: '' },
        { XMMC: '阿莫西林颗粒15mg*24粒*盒', SL: '9', DW: '', JS: '1', TS: '1', YF: '口服', PL: 'tid', DS: '' },
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
