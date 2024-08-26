<template>
    <div>
        <el-dialog
            class="ba-operate-dialog"
            :close-on-click-modal="false"
            :model-value="state.show"
            @close="cancel"
            :destroy-on-close="true"
            align-center
            id="ddbczxks-dialog"
            width="671px"
        >
            <template #header>
                <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']">
                    {{ '病人处方列表' }}
                </div>
            </template>
            <div class="header">
                <div class="content">
                    <div class="xm">
                        <span>姓名：{{ state.brxm }}</span>
                    </div>
                    <div class="zd">
                        <span>诊断：{{ state.zd }}</span>
                    </div>
                </div>
            </div>
            <div class="main">
                <el-table
                    ref="tableRef"
                    :data="state.tableData"
                    border
                    highlight-current-row
                    @selection-change="onSelectionChange"
                    style="width: 100%"
                    class="ba-data-table w100"
                    header-cell-class-name="table-header-cell"
                    height="calc(100vh - 600px)"
                >
                    <el-table-column prop="XZ" label="选择" width="60" />
                    <el-table-column prop="SQ" label="处方/申请" width="90"></el-table-column>
                    <el-table-column prop="SQH" label="处方/申请号" width="110"> </el-table-column>
                    <el-table-column prop="XMMC" label="项目名称" width="180" />
                    <el-table-column prop="SJ" label="时间" width="150" />
                </el-table>
            </div>
            <template #footer>
                <div class="yd-from-footer">
                    <div class="gxk">
                        <el-checkbox v-model="checked">合并在一起打印</el-checkbox>
                    </div>
                    <div class="btn">
                        <el-button type="primary" @click="print" class="btn-form-print">打印</el-button>
                        <el-button @click="cancel" class="btn-form-cancel">取消</el-button>
                    </div>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormItemRule } from 'element-plus'

const formRef = ref<FormInstance>()
const checked = ref(false)

const state: {
    loading: boolean
    show: boolean
    tableData: any
    brxm: any
    zd: any
} = reactive({
    loading: false,
    show: false,
    tableData: [],
    brxm: '归海一刀',
    zd: '尪痹',
})

const table = reactive({
    selection: [],
})

const onSelectionChange = (selection: any) => {
    table.selection = selection
}

const rules: Partial<Record<string, FormItemRule[]>> = reactive({})

const cancel = () => {
    state.show = false
}

const print = () => {
    console.log('print....')
}

const show = () => {
    state.show = true
}

onMounted(() => {})

defineExpose({
    show,
})
</script>
<style scoped lang="scss">
:deep(.el-dialog__body) {
    height: 450px;
}
:deep(.el-select-tags-wrapper .el-tag) {
    color: #333;
}

:deep(.table1 .el-scrollbar__bar) {
    bottom: -10px;
}

.el-table :deep(.el-table__cell) {
    padding: 5px 5px;
    font-size: 12px;
}
.header {
    margin-top: 10px;
    .content {
        display: flex;
        height: 30px;
        margin-top: 10px;
        .xm {
            display: inline-block;
            font-size: 20px;
            color: red;
            margin-left: 30px;
        }
        .zd {
            display: inline-block;
            font-size: 20px;
            color: red;
            margin-left: 30px;
        }
    }
}
.main {
    margin-left: 30px;
    margin-top: 10px;
    width: 591px;
}
.btn-form-print {
    margin-left: 30px;
    width: 80px;
}

.ba-data-table {
    margin-top: 20px;
}
.yd-from-footer {
    .gxk {
        margin-left: 30px;
        float: left;
    }
    .btn {
        margin-right: 20px;
        float: right;
    }
}
</style>
