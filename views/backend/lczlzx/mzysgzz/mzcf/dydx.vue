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
            width="1271px"
        >
            <template #header>
                <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']">
                    {{ '打印多项' }}
                </div>
            </template>
            <div class="header">
                <div class="content">
                    <span class="font">患者姓名：轩辕朱安安</span>
                    <span class="font">诊断：</span>
                    <span class="zdlx-tag">西</span><span class="zdlx-font1">主诊:1型糖尿病伴有周围循环并发症;</span
                    ><span class="question-mark">机动车辆和两轮或三轮机动车之间碰撞造成的人员损伤,非交通性的,其他的;</span
                    ><span class="zdlx-tag2">中</span><span class="zdlx-font1">主诊:伤寒;</span
                    ><span class="zdlx-font2">鼻塞;症候;膀胱湿热气滞证;</span>
                </div>
            </div>
            <div class="main">
                <el-table
                    ref="tableRef"
                    :data="state.tableData"
                    highlight-current-row
                    @selection-change="onSelectionChange"
                    style="width: 100%"
                    class="ba-data-table w100"
                    header-cell-class-name="table-header-cell"
                >
                    <el-table-column type="selection" width="30" />
                    <el-table-column prop="DYXM" label="打印项目" width="100" />
                    <el-table-column prop="SQDH" label="处方/申请单号" width="120"></el-table-column>
                    <el-table-column prop="DJMC" label="单据名称" width="150"> </el-table-column>
                    <el-table-column prop="SJ" label="时间" width="170" />
                    <el-table-column prop="CFJE" label="处方金额" width="110" />
                    <el-table-column prop="ZD" label="诊断" width="340">
                        <template #default="scope">
                            <el-select v-model="scope.row.ZD" clearable style="width: 100%">
                                <el-option v-for="opt in state.zdArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"> </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="SFDJH" label="收费单据号" width="150" />
                </el-table>
            </div>
            <template #footer>
                <div class="yd-from-footer">
                    <el-button type="primary" class="btn-form-previewprint">打印预览</el-button>
                    <el-button type="primary" class="btn-form-print">打印</el-button>
                    <el-button @click="cancel" class="btn-form-cancel">取消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormItemRule } from 'element-plus'

const formRef = ref<FormInstance>()

const form = reactive({})
const state: {
    loading: boolean
    show: boolean
    zdArr: any
    tableData: any
} = reactive({
    loading: false,
    show: false,
    zdArr: [
        { BM: 1, MC: '机动车辆和两轮或三轮机动车之间碰撞造成的人员损伤，非交通性，其他的  ' },
        { BM: 2, MC: '伤寒' },
        { BM: 3, MC: '四十四字参考文字参考文字参考文字参考文字参考文字参考' },
        { BM: 4, MC: '参考文字参考文字参考文字参考文字参考文字参考参考文字参考文字参考文字参考文字参考文字参考' },
        { BM: 5, MC: '参考文字参考文字参考文字' },
        { BM: 6, MC: '参考文字参考文字参考文字参考文字参考文字参考' },
        { BM: 7, MC: '参考文字参考文字' },
        { BM: 8, MC: '参考文字参考文字参考文字参考文字参考文字参考参考文字' },
    ],
    tableData: [
        { DYXM: '申请单', SQDH: '6230568', DJMC: '西成药处方', SJ: '2022-11-18 00:08:01', CFJE: '12,992.56', ZD: 1, SFDJH: 'SF19490982231   ' },
        { DYXM: '申请单', SQDH: '6213580', DJMC: '中药处方单', SJ: '2023-12-24 00:06:52', CFJE: '305.86', ZD: 2, SFDJH: 'SF19333312231' },
        { DYXM: '输液卡', SQDH: '6237268', DJMC: '参考文字参考文字', SJ: '2023-11-13 16:16:28', CFJE: '1,462', ZD: 3, SFDJH: 'SF19289999000' },
        { DYXM: '注射单', SQDH: '6213541', DJMC: '参考文字参考文字', SJ: '2022-01-12 10:16:37', CFJE: '810.23', ZD: 4, SFDJH: 'SF19876782134' },
        { DYXM: '雾化单', SQDH: '6210156', DJMC: '参考文字参考文字', SJ: '2022-04-07 14:43:46', CFJE: '30,990', ZD: 5, SFDJH: 'SF19113212388' },
        { DYXM: '治疗单', SQDH: '6237299', DJMC: '参考文字参考文字', SJ: '2022-03-13 13:12:49', CFJE: '965', ZD: 6, SFDJH: 'SF19434129071' },
        { DYXM: '雾化单', SQDH: '6213580', DJMC: '参考文字参考文字', SJ: '2022-09-13 20:56:06', CFJE: '262.5', ZD: 7, SFDJH: 'SF19612348970' },
        {
            DYXM: '费用清单',
            SQDH: '6205904',
            DJMC: '参考文字参考文字',
            SJ: '2023-02-06 03:43:52',
            CFJE: '1360,143.25',
            ZD: 8,
            SFDJH: 'SF19578012123',
        },
        { DYXM: '诊断证明', SQDH: '6210053', DJMC: '参考文字参考文字', SJ: '2022-01-19 06:14:04', CFJE: '977', ZD: '', SFDJH: 'SF19729922849' },
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

:deep(.ba-data-table.el-table .el-table__cell) {
    padding: 3px 0;
}
.header {
    margin-top: 10px;
    .content {
        display: flex;
        align-items: center; /* 垂直居中 */
        justify-content: center; /* 水平居中 */
        height: 30px;
        margin-top: 10px;
    }
    .font {
        margin-right: 60px;
        font-weight: bold;
        color: black;
    }
    .font,
    .zdlx-tag,
    .zdlx-font1,
    .zdlx-font2,
    .question-mark {
        display: inline-block;
    }

    .zdlx-tag {
        margin-left: -60px;
        font-size: 12px;
        background-color: #7299bc;
        color: #fff;
        padding: 2px;
    }
    .zdlx-tag2 {
        font-size: 12px;
        background-color: #7299bc;
        color: #fff;
        padding: 2px;
    }
    .zdlx-font1 {
        margin-left: 5px;
        font-size: 12px;
        color: #add8e6;
    }
    .zdlx-font2 {
        margin-left: 5px;
        font-size: 12px;
        color: black;
    }
    .question-mark {
        color: black;
    }

    .question-mark::before {
        content: '?';
        display: inline-block;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        text-align: center;
        background-color: white;
        color: red;
        border: 1px solid red;
        margin-right: 3px;
    }
}
.main {
    margin-left: 30px;
    margin-top: 10px;
    width: 1171px;
}
.btn-form-print {
    margin-left: 30px;
    width: 80px;
}
</style>
