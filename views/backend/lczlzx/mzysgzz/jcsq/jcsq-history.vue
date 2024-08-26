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
                    {{ '调用历史检验' }}
                </div>
            </template>
            <div class="jcsq-box">
                <el-form ref="formRef" :model="form" label-position="right" label-width="100px" :rules="rules">
                    <div class="container">
                        <div class="menu">
                            <div class="select">
                                <el-radio-group v-model="state.dateRangeType" @change="dateRangeChange">
                                    <el-radio :label="1">最近7天</el-radio>
                                    <el-radio :label="2">最近15天</el-radio>
                                    <el-radio :label="3">最近30天</el-radio>
                                </el-radio-group>
                                <el-form-item label="" class="data">
                                    <el-date-picker
                                        v-model="state.dateRange"
                                        type="datetimerange"
                                        range-separator="-"
                                        start-placeholder="开始时间"
                                        end-placeholder="结束时间"
                                        format="YYYY-MM-DD HH:mm:ss"
                                    />
                                </el-form-item>
                                <div class="box">
                                    <span style="margin-top: 5px">患者姓名：</span>
                                    <el-input v-model="state.keywords" placeholder="请输入文字(支持模糊搜索)" class="search"></el-input>
                                    <el-button type="primary">查询</el-button>
                                </div>
                            </div>

                            <div class="list">
                                <el-table
                                    v-loading="state.loading"
                                    class="ba-data-table w100"
                                    header-cell-class-name="table-header-cell"
                                    :data="state.jzList"
                                    highlight-current-row
                                    height="100%"
                                >
                                    <el-table-column prop="JZKS" label="就诊科室" width="120" />
                                    <el-table-column prop="JZYS" label="就诊医生" width="120" />
                                    <el-table-column prop="JZSJ" label="就诊时间" width="160" />
                                </el-table>
                            </div>
                        </div>
                        <div class="vertical-line"></div>
                        <div class="main">
                            <div>
                                <el-scrollbar max-height="560px">
                                    <el-table
                                        class="ba-data-table w100"
                                        header-cell-class-name="table-header-cell"
                                        :data="state.jcsqHistory"
                                        :default-expand-all="true"
                                    >
                                        <el-table-column type="expand" width="50">
                                            <template #default="scope">
                                                <el-table
                                                    class="ba-data-table w100"
                                                    header-cell-class-name="table-header-cell"
                                                    :data="scope.row.XM"
                                                    :show-header="false"
                                                >
                                                    <el-table-column type="index" width="50" align="center" />
                                                    <el-table-column prop="JCBW" label="检查部位" align="left" width="300">
                                                        <template #default="{ row }">
                                                            <span>{{ row.JCBW }}</span>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column prop="JCFF" label="检查方法" align="left" width="240">
                                                        <template #default="{ row }">
                                                            <el-select v-model="row.JCFF" clearable style="width: 100%" multiple placeholder="">
                                                                <el-option v-for="opt in state.jcffArr" :key="opt.BM" :label="opt.MC" :value="opt.BM">
                                                                </el-option>
                                                            </el-select>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column prop="JJ" label="加急" width="80" :show-overflow-tooltip="true">
                                                        <template #default="{ row }"> <el-switch v-model="row.JJ"></el-switch> </template>
                                                    </el-table-column>
                                                    <el-table-column prop="BZ" label="备注" align="left" width="200">
                                                        <template #default="{ row }">
                                                            <el-input v-model="row.BZ"></el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column prop="JE" label="金额(元)" width="150" :show-overflow-tooltip="true">
                                                        <template #default="{ row }">
                                                            <span>{{ row.JE }}</span>
                                                        </template></el-table-column
                                                    >
                                                    >
                                                </el-table>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="XMMC" label="检查部位" width="300" :show-overflow-tooltip="true">
                                            <template #default="scope">
                                                <div class="title-xmmc">{{ scope.row.MC }}</div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="JCFF" label="检查方法" align="left" width="240"> </el-table-column>
                                        <el-table-column prop="JJ" label="加急" width="80" :show-overflow-tooltip="true"> </el-table-column>
                                        <el-table-column prop="BZ" label="备注" align="left" width="200"> </el-table-column>
                                        <el-table-column prop="JE" label="金额(元)" width="150" :show-overflow-tooltip="true"> </el-table-column>
                                    </el-table>
                                </el-scrollbar>
                            </div>
                            <div class="foot">
                                <el-row :gutter="0">
                                    <el-col :xs="12" :sm="7" class="form-item">
                                        <el-form-item prop="JYBS" label="简要病史:">
                                            <el-input v-model="form.JYBS" type="string" style="width: 200px"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="12" :sm="7" class="form-item">
                                        <el-form-item prop="SQMD" label="申请目的:">
                                            <el-input v-model="form.SQMD" type="string" style="width: 200px"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="12" :sm="1" class="form-checked">
                                        <el-form-item>
                                            <el-checkbox v-model="checked"></el-checkbox>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="12" :sm="9" class="form-item">
                                        <el-form-item>
                                            <span>使用过洋地黄和其他特殊药物</span>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </div>
                </el-form>
            </div>

            <template #footer>
                <div class="yd-from-footer">
                    <el-button v-blur @click="submitForm(formRef)" type="primary" class="btn-form-save">保存</el-button>
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
const checked = ref(false)
const defaultProps = {
    children: 'children',
    label: 'label',
}

const form = reactive({
    XMMC: '', //项目名称
    JYBS: '', //简要病史
    SQMD: '', //申请目的
})
const state: {
    loading: boolean
    keywords: string
    dateRange: any
    dateRangeType: any
    show: boolean
    jcffArr: any
    jzList: any
    jcsqHistory: any
} = reactive({
    loading: false,
    keywords: '',
    dateRange: '',
    dateRangeType: 1,
    show: false,
    jcffArr: [
        { BM: 1, MC: '常规' },
        { BM: 2, MC: '增强' },
        { BM: 3, MC: '参考文字参考文字' },
        { BM: 4, MC: '参考文字' },
    ],
    jzList: [
        { JZKS: '外科门诊', JZYS: '刘大大', JZSJ: '2023-10-07  09:00:17' },
        { JZKS: '中医科', JZYS: '胡小小', JZSJ: '2023-10-07  09:20:31' },
        { JZKS: '内科 ', JZYS: '张三', JZSJ: '2023-10-07  09:40:58' },
        { JZKS: '化验科', JZYS: '胡允', JZSJ: '2023-10-07  10:00:25' },
        { JZKS: '骨科', JZYS: '李赫', JZSJ: '2023-10-07  10:20:49' },
        { JZKS: '外科', JZYS: '轩辕朱安安', JZSJ: '2023-10-07  10:40:06' },
        { JZKS: '外科门诊', JZYS: '段问薇', JZSJ: '2023-10-07  11:00:34' },
        { JZKS: '中医科', JZYS: '庞慧', JZSJ: '2023-10-07  11:20:22' },
    ],
    jcsqHistory: [
        {
            MC: '彩超申请单_彩色多普勒胸部超声检查',
            XM: [
                { JCBW: '肺', JCFF: [1, 2], JJ: true, BZ: '参考文字参考文字参考', JE: '52.35' },
                { JCBW: '胸腔', JCFF: [1, 2], JJ: false, BZ: '', JE: '10,580.56' },
                { JCBW: '纵膈', JCFF: [1], JJ: false, BZ: '', JE: '52.35' },
            ],
        },
        {
            MC: '彩超申请单_彩色多普勒膀胱残余尿量超声测定',
            XM: [
                { JCBW: '参考文字参考文字', JCFF: [1, 2], JJ: true, BZ: '', JE: '65.2' },
                { JCBW: '参考文字参考文字参考文字', JCFF: [1], JJ: false, BZ: '', JE: '987' },
                { JCBW: '参考文字', JCFF: [1, 2], JJ: true, BZ: '', JE: '12.46' },
                { JCBW: '参考文字参考', JCFF: [1], JJ: false, BZ: '参考文字参考文字参考', JE: '103.85' },
                { JCBW: '参考文字参考文字参考', JCFF: [1], JJ: false, BZ: '', JE: '1560.9' },
            ],
        },
        {
            MC: 'CT申请单_参考文字参考文字',
            XM: [
                { JCBW: '参考文字参', JCFF: [2], JJ: true, BZ: '', JE: '45.7' },
                { JCBW: '参考文字参考文字参考文字', JCFF: [1], JJ: false, BZ: '', JE: '387.6' },
                { JCBW: '参考文字参考文字', JCFF: [1, 2], JJ: false, BZ: '', JE: '10.5' },
                { JCBW: '参考文字参考', JCFF: [1, 2], JJ: false, BZ: '参考文字参考文字参考', JE: '598.3' },
            ],
        },
    ],
})

const filter: {
    dateRange: any
} = reactive({
    dateRange: [],
})

function formatDate(date: any) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

const dateRangeChange = (value: any) => {
    const end = new Date()
    const start = new Date()
    if (value == 1) {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        state.dateRange = [start, end]
    } else if (value == 2) {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 15)
        state.dateRange = [start, end]
    } else if (value == 3) {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        state.dateRange = [start, end]
    }
    const startTime = state.dateRange[0]
    const endTime = state.dateRange[1]
    // 将开始时间和结束时间转换为 "yyyy-mm-dd" 格式
    const startDate = formatDate(startTime)
    const endDate = formatDate(endTime)
    filter.dateRange = [startDate, endDate]
    // emit('filterChange1', filter)
}

const rules: Partial<Record<string, FormItemRule[]>> = reactive({})

const submitForm = async (formEl: FormInstance | undefined) => {
    // 借鉴的成员
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
        } else {
            console.log('error submit!', fields)
        }
    })
}
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
:deep(.el-dialog__body) {
    height: 750px;
}

:deep(.el-select-tags-wrapper .el-tag) {
    color: #333;
}
:deep(.table1 .el-scrollbar__bar) {
    bottom: -10px;
}
.XMMC {
    margin-left: -26px;
    margin-top: 20px;
}
.container {
    display: flex;
    .menu {
        margin-top: 20px;
        height: 300px;
        width: 400px;
        .select {
            height: 150px;
            background: var(--ba-border-color);
            .data {
                margin-bottom: 5px;
                margin-left: -100px;
                margin-top: 20px;
            }
            .box {
                display: flex;
                margin-top: 20px;
                .search {
                    margin-right: 10px;
                    width: 240px;
                }
            }
        }
        .list {
            margin-top: 20px;
        }
        /* 设置菜单宽度 */
        :deep(.el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf) {
            border-bottom: none;
        }
    }
    .main {
        margin-top: 20px;
        width: 800px;
    }
}

.color-table {
    height: 300px;
    flex: 1; /* 表格宽度自适应 */
    border: solid 1px #ebebeb;
}
.vertical-line {
    border-right: 1px solid #eeeeee; /* 设置竖线的样式 */
    height: 640px; /* 设置竖线的高度，与父容器高度相同 */
    margin-top: 20px;
    margin-left: 10px; /* 设置竖线与左侧内容的间距 */
    margin-right: 20px; /* 设置竖线与右侧内容的间距 */
}
.table {
    margin-top: 20px;
}
.jcsq-box {
    margin-top: 1px;
    height: 270px;
    .title-xmmc {
        color: #000;
        font-weight: 600;
    }
    :deep(.el-table__expanded-cell) {
        padding: 0;
    }
    :deep(.el-table__expand-icon) {
        display: none;
    }
    .jcsqd-item .title {
        color: black;
        padding: 5px 0;
        font-weight: 600;
    }
    .summary {
        padding: 10px 5px;
        font-weight: 600;
        text-align: right;
    }
}
:deep(.table1 .el-table__empty-text) {
    display: none;
}
:deep(.table1 .el-table__empty-block) {
    display: none;
}
.ba-data-table {
    /* 设置表格容器的宽度 */
    width: 100%;
}
.foot {
    background: #eeeeee;
    margin-top: 10px;
    .form-item {
        margin-left: -20px;
        margin-top: 16px;
    }
    .form-checked {
        margin-left: -20px;
        margin-right: 10px;
        margin-top: 16px;
    }
}
:deep(.el-radio__input) {
    display: none;
}
</style>
