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
            width="1371px"
        >
            <template #header>
                <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']">
                    {{ '检验结果对比' }}
                </div>
            </template>
            <div class="jysq-box">
                <el-form ref="formRef" :model="form" label-position="right" label-width="100px" :rules="rules">
                    <div class="container">
                        <div class="menu">
                            <div class="select">
                                <el-radio-group v-model="state.dateRangeType" @change="dateRangeChange">
                                    <el-radio :label="1">最近180天</el-radio>
                                    <el-radio :label="2">最近360天</el-radio>
                                    <el-radio :label="3">全部</el-radio>
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
                                    <span style="margin-top: 5px">项目名称：</span>
                                    <el-input v-model="state.keywords" placeholder="请输入文字(支持模糊搜索)" class="search"></el-input>
                                    <el-button type="primary">查询</el-button>
                                </div>
                            </div>

                            <div class="list">
                                <div class="divider"></div>
                                <el-tree :data="state.treeData" :props="treeProps" class="tree-with-divider" default-expand-all>
                                    <template #default="{ node, data }">
                                        <span v-if="node.level === 2" :style="{ backgroundColor: getNodeColor(data) }" class="color-box"></span>
                                        {{ node.label }}
                                    </template></el-tree
                                >
                            </div>
                        </div>
                        <div class="vertical-line"></div>
                        <div class="main">
                            <div class="top">
                                <div class="title">
                                    <div class="mx">病历号：2023102658</div>
                                    <div class="mx">患者姓名：轩辕朱安安</div>
                                    <div class="mx">项目名称：白细胞数</div>
                                </div>
                                <div class="content"></div>
                            </div>
                        </div>
                    </div>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormItemRule } from 'element-plus'

const formRef = ref<FormInstance>()
const checked = ref(false)
const treeProps = {
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
    treeData: any
    currentBrid: any
} = reactive({
    loading: false,
    keywords: '',
    dateRange: '',
    dateRangeType: 1,
    show: false,
    treeData: [
        {
            BM: '01',
            label: '项目分类',
            children: [
                {
                    BM: '04',
                    label: '分类一',
                    color: '#ff0066',
                    children: [{ label: '血管紧张素II(Angiotensin II)，化学发光法' }, { label: '嗜水气单胞菌/豚鼠气单胞菌/温和气单胞菌' }],
                },
                {
                    BM: '05',
                    label: '分类二',
                    color: '#eeee00',
                    children: [],
                },
                {
                    BM: '06',
                    label: '分类三',
                    color: '#ff9966',
                    children: [
                        { label: '乙型肝炎病毒脱氧核糖核酸(HBV-DNA)定量' },
                        { label: '铜绿假单胞菌 ATCC 27853 ' },
                        { label: '抗线粒体抗体-M2(AMA-M2)' },
                        { label: '人乳头瘤病毒(HPV)低危型(10种)' },
                        { label: 'N-端脑钠利肽前体(NT-ProBNP)' },
                    ],
                },
                {
                    BM: '07',
                    label: '分类四',
                    color: '#f0f0f0',
                    children: [{ label: '白细胞数' }, { label: '红细胞数' }, { label: '血红蛋白浓度' }],
                },
                {
                    BM: '08',
                    label: '分类五',
                    color: '#3cb371',
                    children: [],
                },
                {
                    BM: '09',
                    label: '分类六',
                    color: '#9900ff',
                    children: [],
                },
            ],
        },
    ],
    currentBrid: 0,
})

const filter: {
    dateRange: any
} = reactive({
    dateRange: [],
})

const onRowClick = (row: any) => {
    state.currentBrid = row.SQDH
}

const getNodeColor = (data: any) => {
    return data.color || '#000' // 其他节点按照data中的color字段设置颜色
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
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
        state.dateRange = [start, end]
    } else if (value == 2) {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 360)
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
    height: 700px;
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
        height: 600px;
        width: 460px;
        .select {
            height: 150px;
            background: var(--ba-border-color);
            .data {
                width: 540px;
                margin-bottom: 5px;
                margin-left: -90px;
                margin-top: 20px;
            }
            .box {
                display: flex;
                margin-top: 20px;
                .search {
                    margin-right: 10px;
                    width: 310px;
                }
            }
        }
        .list {
            margin-top: 10px;
        }
        /* 设置菜单宽度 */
        :deep(.el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf) {
            border-bottom: none;
        }
    }
    .main {
        margin-top: 20px;
        width: 840px;
    }
}

.vertical-line {
    border-right: 1px solid #eeeeee; /* 设置竖线的样式 */
    height: 660px; /* 设置竖线的高度，与父容器高度相同 */
    margin-top: 20px;
    margin-left: 20px; /* 设置竖线与左侧内容的间距 */
    margin-right: 20px; /* 设置竖线与右侧内容的间距 */
}
.jysq-box {
    margin-top: 1px;
    height: 270px;
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
.top {
    height: 650px;
    width: 741px;
    .title {
        margin-left: 20px;
        height: 20px;
        width: 720px;
        .mx {
            display: inline-block;
            margin-right: 10px;
            font-weight: bold;
            color: black;
        }
    }
    .title::before {
        content: '';
        position: absolute;
        margin-left: -20px;
        width: 4px;
        height: 18px;
        background-color: #1c90ff;
    }
    .content {
        height: 620px;
        width: 831px;
        margin-top: 10px;
        background: #eeeeee;
    }
}
.tree-with-divider {
    height: 450px;
    font-size: 14px;
}
:deep(.tree-with-divider .el-tree-node:not([aria-level='2'])::after) {
    content: '';
    display: block;
    position: absolute;
    margin-bottom: 424px;
    left: 0;
    bottom: -1px;
    width: 100%;
    height: 1px;
    background-color: #eeeeee; /* 设置下划线的颜色 */
}
.color-box {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 5px;
}
</style>
