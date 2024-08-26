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
            width="1500px"
        >
            <template #header>
                <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']">
                    {{ '调用历史检验' }}
                </div>
            </template>
            <div class="jysq-box">
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
                                <el-scrollbar max-height="650px">
                                    <el-table
                                        class="ba-data-table w100"
                                        header-cell-class-name="table-header-cell"
                                        :data="state.jcsqHistory"
                                        :default-expand-all="true"
                                    >
                                        <el-table-column label="NO" type="expand" width="50">
                                            <template #default="scope">
                                                <el-table
                                                    class="ba-data-table w100"
                                                    header-cell-class-name="table-header-cell"
                                                    :data="scope.row.XM"
                                                    :show-header="false"
                                                >
                                                    <el-table-column label="NO" type="index" width="50" align="center" />
                                                    <el-table-column prop="XMMC" label="项目名称" align="left" width="340">
                                                        <template #default="{ row }">
                                                            <span>{{ row.XMMC }}</span>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column prop="BB" label="标本" align="left" width="240">
                                                        <template #default="{ row }">
                                                            <el-select v-model="row.BB" clearable style="width: 100%" placeholder="">
                                                                <el-option v-for="opt in state.bbArr" :key="opt.BM" :label="opt.MC" :value="opt.BM">
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
                                                    <el-table-column prop="JE" label="金额(元)" width="110" :show-overflow-tooltip="true">
                                                        <template #default="{ row }">
                                                            <span>{{ row.JE }}</span>
                                                        </template></el-table-column
                                                    >
                                                    >
                                                </el-table>
                                            </template>
                                        </el-table-column>

                                        <el-table-column prop="MC" label="项目名称" width="340" :show-overflow-tooltip="true">
                                            <template #default="scope">
                                                <div :style="{ backgroundColor: getColorBoxColor(scope.row) }" class="color-box"></div>

                                                <div class="title-xmmc">{{ scope.row.MC }}</div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="BB" label="标本" align="left" width="240"> </el-table-column>
                                        <el-table-column prop="JJ" label="加急" width="80" :show-overflow-tooltip="true"> </el-table-column>
                                        <el-table-column prop="BZ" label="备注" align="left" width="200"> </el-table-column>
                                        <el-table-column prop="JE" label="金额(元)" width="110" :show-overflow-tooltip="true"> </el-table-column>
                                    </el-table>
                                </el-scrollbar>
                            </div>
                        </div>
                    </div>
                </el-form>
            </div>

            <template #footer>
                <div class="yd-from-footer">
                    <el-button v-blur @click="submitForm(formRef)" type="primary" class="btn-form-save">发送</el-button>
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
    bbArr: any
    jzList: any
    jcsqHistory: any
} = reactive({
    loading: false,
    keywords: '',
    dateRange: '',
    dateRangeType: 1,
    show: false,
    bbArr: [
        { BM: 1, MC: '血液' },
        { BM: 2, MC: '十二指肠引流液' },
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
            MC: '分类一',
            XM: [
                { XMMC: '高压血五项', BB: 4, JJ: true, BZ: '', JE: '52.35' },
                { XMMC: '三十个字参考文字参考文字参考文字参考文字参考文字参考参考文字', BB: 1, JJ: false, BZ: '', JE: '10,580.56' },
                { XMMC: 'C-反应蛋白测定(CRP)_各种免疫学方法、单扩法', BB: 2, JJ: false, BZ: '', JE: '52.35' },
            ],
        },
        {
            MC: '分类三',
            XM: [
                { XMMC: '参考文字参考文字', BB: 4, JJ: true, BZ: '', JE: '65.2' },
                { XMMC: '三十个字参考文字参考文字参考文字参考文字参考文字参考参考文字 ', BB: 1, JJ: false, BZ: '', JE: '987' },
                { XMMC: '参考文字', BB: 2, JJ: false, BZ: '', JE: '12.46' },
                { XMMC: '参考文字参考文字参考文字参考文字参考文字', BB: 4, JJ: false, BZ: '参考文字参考文字参考', JE: '103.85' },
                { XMMC: '参考文字参考文字参考文字', BB: 3, JJ: false, BZ: '', JE: '1560.9' },
            ],
        },
        {
            MC: '分类五',
            XM: [{ XMMC: '参考文字参', BB: 4, JJ: true, BZ: '', JE: '52.35' }],
        },
        {
            MC: '分类六',
            XM: [
                { XMMC: '参考文字参', BB: 4, JJ: true, BZ: '', JE: '45.7' },
                { XMMC: '三十个字参考文字参考文字参考文字参考文字参考文字参考参考文字 ', BB: 1, JJ: false, BZ: '', JE: '387.6' },
                { XMMC: '参考文字参考文字参考文字参考文字参考文字参', BB: 2, JJ: false, BZ: '', JE: '10.5' },
            ],
        },
        {
            MC: '分类七',
            XM: [{ XMMC: '', BB: '', JJ: false, BZ: '', JE: '' }],
        },
    ],
})

const filter: {
    dateRange: any
} = reactive({
    dateRange: [],
})

const getColorBoxColor = (row: any) => {
    const colors = ['#ff0066', '#ff9966', '#3cb371', '#9900ff', '#66ccff'] // 定义多个不同的颜色
    const rowIndex = state.jcsqHistory.indexOf(row) // 获取当前行在数据中的索引
    return colors[rowIndex % colors.length] // 根据当前行的索引返回对应的颜色
}

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
        width: 1030px;
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
.jysq-box {
    margin-top: 1px;
    height: 270px;
    .color-box {
        display: inline-block;
        width: 14px;
        height: 14px;
        margin-right: 10px;
    }
    .title-xmmc {
        display: inline-block;
        color: #000;
        font-weight: 600;
    }
    :deep(.el-table__expanded-cell) {
        padding: 0;
    }
    :deep(.el-table__expand-icon) {
        display: none;
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
:deep(.el-radio__input) {
    display: none;
}
</style>
