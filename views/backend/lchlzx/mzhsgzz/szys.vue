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
            width="1001px"
        >
            <template #header>
                <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']">
                    {{ '设置样式' }}
                </div>
            </template>
            <div class="header">
                <div class="content">
                    <el-form class="cx">
                        <el-row :gutter="0">
                            <el-col :xs="12" :sm="9">
                                <el-form-item prop="KSDW" label="快速定位：">
                                    <el-input v-model="form.KSDW" type="string" placeholder="请输入快速定位"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="12" :sm="1" class="cxBtn">
                                <el-button type="text" plain>
                                    <Icon name="local-djb" />
                                    <span class="operate-text">应用</span>
                                </el-button>
                            </el-col>
                            <el-col :xs="12" :sm="1" class="cxBtn">
                                <el-button type="text" plain>
                                    <Icon name="local-sjt" />
                                    <span class="operate-text">上移</span>
                                </el-button>
                            </el-col>
                            <el-col :xs="12" :sm="1" class="cxBtn">
                                <el-button type="text" plain>
                                    <Icon name="local-xjt" />
                                    <span class="operate-text">下移</span>
                                </el-button>
                            </el-col>
                            <el-col :xs="12" :sm="10" class="cxBtn">
                                <el-checkbox v-model="form.GLYCX" class="glycx">过滤隐藏项</el-checkbox>
                            </el-col>
                        </el-row>
                    </el-form>
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
                    height="calc(100vh - 550px)"
                >
                    <el-table-column prop="LM" label="列名" width="120" />
                    <el-table-column prop="XSWB" label="显示文本" width="120" />
                    <el-table-column prop="YXBJ" label="允许编辑" width="100">
                        <template #default="scope">
                            <el-checkbox v-model="scope.row.YXBJ" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="LKD" label="列宽度" width="100" />
                    <el-table-column prop="SFZSY" label="是否自适应" width="100">
                        <template #default="scope">
                            <el-checkbox v-model="scope.row.SFZSY" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="LXSFS" label="列显示方式" width="100" />
                    <el-table-column prop="YXPL" label="允许排列" width="100" />
                    <el-table-column prop="SFKJ" label="是否可见" width="100">
                        <template #default="scope">
                            <el-checkbox v-model="scope.row.SFKJ" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="SX" label="顺序" width="100" />
                </el-table>
            </div>
            <div class="foot">
                <div class="foot-title">控件全局样式</div>
                <el-form class="foot-form">
                    <el-row :gutter="0">
                        <el-col :xs="12" :sm="6" class="item">
                            <el-form-item prop="MHGD" label="每行高度：">
                                <el-input v-model="form.MHGD" type="string" placeholder="请输入每行高度" style="width: 100%"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="8" class="item">
                            <el-form-item prop="LTDQFS" label="列头对齐方式：">
                                <el-select v-model="form.LTDQFS" clearable style="width: 100%">
                                    <el-option v-for="opt in state.ltdqfsArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="6" class="checkbox-container">
                            <span class="checkbox-label">是否允许拖曳改变列宽：</span>
                            <el-checkbox v-model="form.GBLK"></el-checkbox>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <template #footer>
                <div class="yd-from-footer">
                    <el-button @click="cancel" class="btn-form-cancel">关闭</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormItemRule } from 'element-plus'

const formRef = ref<FormInstance>()

const form = reactive({
    KSDW: '',
    GLYCX: false,
    MHGD: '23',
    LTDQFS: 2,
    GBLK: false,
})
const state: {
    loading: boolean
    show: boolean
    tableData: any
    ltdqfsArr: any
} = reactive({
    loading: false,
    show: false,
    tableData: [
        { LM: 'BS', XSWB: '', YXBJ: true, LKD: '20', SFZSY: false, LXSFS: '', YXPX: false, SFKJ: true, SX: '0' },
        { LM: 'ZXZT', XSWB: '状态', YXBJ: true, LKD: '45', SFZSY: false, LXSFS: '', YXPX: false, SFKJ: true, SX: '1' },
        { LM: 'MZBLH', XSWB: '门诊病历号', YXBJ: false, LKD: '76', SFZSY: false, LXSFS: '', YXPX: false, SFKJ: true, SX: '2' },
        { LM: 'BRXM', XSWB: '病人姓名', YXBJ: false, LKD: '64', SFZSY: false, LXSFS: '', YXPX: false, SFKJ: true, SX: '3' },
        { LM: 'XB', XSWB: '性别', YXBJ: false, LKD: '42', SFZSY: false, LXSFS: '', YXPX: false, SFKJ: true, SX: '4' },
        { LM: 'NL', XSWB: '名称', YXBJ: false, LKD: '55', SFZSY: false, LXSFS: '', YXPX: false, SFKJ: true, SX: '5' },
        { LM: 'KSMC', XSWB: '科室名称', YXBJ: false, LKD: '65', SFZSY: false, LXSFS: '', YXPX: false, SFKJ: true, SX: '6' },
        { LM: 'GHSJ', XSWB: '挂号时间', YXBJ: false, LKD: '132', SFZSY: false, LXSFS: '', YXPX: false, SFKJ: true, SX: '7' },
    ],
    ltdqfsArr: [
        { BM: 1, MC: '左对齐' },
        { BM: 2, MC: '居中对齐' },
        { BM: 3, MC: '右对齐' },
    ],
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

const show = () => {
    state.show = true
}

onMounted(() => {})

defineExpose({
    show,
})
</script>
<style scoped lang="scss">
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
        align-items: center; /* 垂直居中 */
        justify-content: center; /* 水平居中 */
        height: 30px;
        margin-top: 10px;
        .cx {
            width: 100%;
            margin-top: 20px;
            .cxBtn {
                margin-left: 20px;
                .svg-icon {
                    color: #59a7ff !important;
                }
                .operate-text {
                    margin-left: 6px;
                }
                .glycx {
                    margin-left: 300px;
                }
            }
        }
    }
}
.main {
    margin-left: 10px;
    margin-top: 10px;
    width: 941px;
}
.foot {
    margin-left: 10px;
    margin-top: 10px;
    width: 941px;
    height: 30px;
    border-top: 1px solid #eeeeee;
    .foot-title {
        display: block;
        margin-left: 20px;
        width: 85px;
        top: -10px;
        background: white;
        position: relative;
    }
    .foot-form {
        .item {
            margin-left: 20px;
        }
        .checkbox-container {
            display: flex;
            align-items: center;
            margin-left: 20px;
            margin-bottom: 20px;
            .checkbox-label {
                margin-bottom: 2px;
                margin-right: 10px; /* 调整多选框和文字之间的间距 */
            }
        }
    }
}
.btn-form-print {
    margin-left: 30px;
    width: 80px;
}

.ba-data-table {
    margin-top: 20px;
}
</style>
