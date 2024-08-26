<template>
    <div>
        <el-dialog class="ba-operate-dialog" :close-on-click-modal="false" :model-value="state.show" @close="cancel"
            :destroy-on-close="true" align-center width="1200px">
            <template #header>
                <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']">
                    历史处方
                </div>
            </template>
            <div class="lscf-box">
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
                                    <el-date-picker v-model="state.dateRange" type="datetimerange" range-separator="-"
                                        start-placeholder="开始时间" end-placeholder="结束时间" format="YYYY-MM-DD HH:mm:ss" />
                                </el-form-item>
                                <div class="box">
                                    <span style="margin-top: 5px">患者姓名：</span>
                                    <el-input v-model="state.keywords" placeholder="请输入文字(支持模糊搜索)"
                                        class="search"></el-input>
                                    <el-button type="primary">查询</el-button>
                                </div>
                            </div>
                            <div class="list">
                                <el-table v-loading="state.loading" class="ba-data-table w100"
                                    header-cell-class-name="table-header-cell" :data="state.jzList"
                                    highlight-current-row height="100%">
                                    <el-table-column prop="JZKS" label="就诊科室" width="120" />
                                    <el-table-column prop="JZYS" label="就诊医生" width="120" />
                                    <el-table-column prop="JZSJ" label="就诊时间" width="160" />
                                </el-table>
                            </div>
                        </div>
                        <div class="vertical-line"></div>
                        <div class="main">
                            <div style="margin-right: 10px; margin-bottom: 20px" v-for="item in state.cfList"
                                :key="item.bm">
                                <Xycf v-if="item.cflx == 1" :cfinfo="item" :hideact="true" />
                                <Zycf v-if="item.cflx == 2" :cfinfo="item" :hideact="true" />
                                <Zyzl v-if="item.cflx == 3" :cfinfo="item" :hideact="true" />
                            </div>
                        </div>
                    </div>
                </el-form>
            </div>

            <template #footer>
                <div class="yd-from-footer">
                    <el-button v-blur type="primary" class="btn-form-save">去粘贴</el-button>
                    <el-button @click="cancel" class="btn-form-cancel">取消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormItemRule } from 'element-plus'
import { uuid } from '/@/utils/random'
import Xycf from './xycf.vue'
import Zycf from './zycf.vue'
import Zyzl from './zyzl.vue'

const formRef = ref<FormInstance>()

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
    jzList: any
    cfList: any
} = reactive({
    loading: false,
    keywords: '',
    dateRange: '',
    dateRangeType: 1,
    show: false,
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
    cfList: [
        {
            bm: uuid(),
            title: '西药处方',
            cflx: 1,
            isEdit: false,
            isCopied: false,
            isExpand: true,
            items: [{ ID: uuid() }],
        },
        {
            bm: uuid(),
            title: '西药处方',
            cflx: 1,
            isEdit: false,
            isCopied: false,
            isExpand: true,
            items: [{ ID: uuid() }],
        }
    ]
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


const cancel = () => {
    state.show = false
}

const show = () => {
    state.show = true
}

onMounted(() => {
    dateRangeChange(1)
})

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

.container {
    display: flex;

    .menu {
        margin-top: 20px;
        height: 300px;
        width: 400px;

        .select {
            padding: 5px 6px;
            background: #f9f9f9;

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
        width: 730px;
    }
}

.vertical-line {
    border-right: 1px solid #eeeeee;
    /* 设置竖线的样式 */
    height: 640px;
    /* 设置竖线的高度，与父容器高度相同 */
    margin-top: 20px;
    margin-left: 10px;
    /* 设置竖线与左侧内容的间距 */
    margin-right: 20px;
    /* 设置竖线与右侧内容的间距 */
}

.lscf-box {
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
}
</style>
