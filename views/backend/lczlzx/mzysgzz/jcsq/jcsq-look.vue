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
                    {{ '查看结果' }}
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
                                    <span style="margin-top: 5px">医嘱内容：</span>
                                    <el-input v-model="state.keywords" placeholder="请输入文字(支持模糊搜索)" class="search"></el-input>
                                    <el-button type="primary">查询</el-button>
                                </div>
                            </div>
                            <div class="btn-menu">
                                <el-button type="text" plain>
                                    <Icon name="local-print" />
                                    <span class="operate-text">批量打印</span>
                                </el-button>
                                <el-button type="text" plain>
                                    <Icon name="local-preview" />
                                    <span class="operate-text">批量打印预览</span>
                                </el-button>
                            </div>
                            <div class="list">
                                <el-table
                                    v-loading="state.loading"
                                    class="ba-data-table w100"
                                    header-cell-class-name="table-header-cell"
                                    :data="state.resultList"
                                    highlight-current-row
                                    height="100%"
                                    @row-click="onRowClick"
                                >
                                    <el-table-column prop="XZ" align="left" width="30">
                                        <template #default="{ row }">
                                            <el-checkbox v-model="row.XZ" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="SQDH" label="申请单号" width="80" />
                                    <el-table-column prop="YZNR" label="医嘱内容" width="240" />
                                    <el-table-column prop="ZT" label="状态" width="80">
                                        <template #default="{ row }">
                                            <div v-if="row.ZT === 0" class="status-wbg">未报告</div>
                                            <div v-else-if="row.ZT === 1" class="status-ycy">已采样</div>
                                            <div v-else-if="row.ZT === 2" class="status-ydy">已打印</div>
                                            <div v-else-if="row.ZT === 3" class="status-ybg">已报告</div>
                                            <div v-else-if="row.ZT === 4" class="status-yqs">已签收</div>
                                            <div v-else class="status-ydj">已登记</div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column width="30" fixed="right" align="center">
                                        <template #default="scope">
                                            <el-dropdown placement="left" v-if="scope.row.SQDH == state.currentBrid">
                                                <el-button type="text" plain>
                                                    <Icon name="local-more" style="color: #59a7ff" class="local-icon" />
                                                </el-button>
                                                <template #dropdown>
                                                    <el-dropdown-menu>
                                                        <el-dropdown-item>打印预览</el-dropdown-item>
                                                        <el-dropdown-item>打印</el-dropdown-item>
                                                    </el-dropdown-menu>
                                                </template>
                                            </el-dropdown>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            <div class="menu-foot">
                                <el-button type="primary">打印预览</el-button>
                                <el-button type="primary">打印</el-button>
                            </div>
                        </div>
                        <div class="vertical-line"></div>
                        <div class="main">
                            <div class="jcbg" v-if="false">
                                <span class="title">二十八字参考文字参考文字参考文字参考文字参考文字检查报告</span>
                                <div class="content"></div>
                                <el-button type="primary" class="btn-main">打印结果</el-button>
                            </div>
                            <div class="empty" v-if="true">
                                <div class="empty-img"></div>
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
    resultList: any
    currentBrid: any
} = reactive({
    loading: false,
    keywords: '',
    dateRange: '',
    dateRangeType: 1,
    show: false,
    resultList: [
        { XZ: false, SQDH: '739181', YZNR: '胸部彩色多普勒常规检查（含肺...   ', ZT: 1 },
        { XZ: false, SQDH: '739105', YZNR: '泌尿系统彩色多普勒常规（含双...', ZT: 0 },
        { XZ: false, SQDH: '739123', YZNR: '胃肠道彩色多普勒常规检查', ZT: 2 },
        { XZ: false, SQDH: '739166', YZNR: '参考文字参考文字参考文字参考...', ZT: 3 },
        { XZ: false, SQDH: '739184', YZNR: '参考文字参考文字参考文字', ZT: 4 },
        { XZ: false, SQDH: '739100', YZNR: '参考文字参考文字参考文字参考...', ZT: 5 },
        { XZ: false, SQDH: '739119', YZNR: '参考文字参考文字', ZT: 3 },
        { XZ: false, SQDH: '739172', YZNR: '参考文字参考文字参考文字参考...', ZT: 3 },
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
.XMMC {
    margin-left: -26px;
    margin-top: 20px;
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
        .btn-menu {
            margin-top: 10px;
            .svg-icon {
                color: #59a7ff !important;
            }
            .operate-text {
                margin-left: 6px;
            }
        }
        .list {
            margin-top: 10px;
        }
        .menu-foot {
            margin-top: 10px;
            float: right;
        }
        /* 设置菜单宽度 */
        :deep(.el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf) {
            border-bottom: none;
        }
    }
    .main {
        margin-top: 20px;
        width: 750px;
    }
}

.color-table {
    height: 300px;
    flex: 1; /* 表格宽度自适应 */
    border: solid 1px #ebebeb;
}
.vertical-line {
    border-right: 1px solid #eeeeee; /* 设置竖线的样式 */
    height: 660px; /* 设置竖线的高度，与父容器高度相同 */
    margin-top: 20px;
    margin-left: 20px; /* 设置竖线与左侧内容的间距 */
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
.jcbg {
    height: 650px;
    width: 741px;
    .title {
        margin-left: 200px;
    }
    .content {
        height: 580px;
        width: 741px;
        margin-top: 10px;
        background: #eeeeee;
    }
    .btn-main {
        margin-top: 10px;
        margin-left: 350px;
    }
}
.empty {
    height: 650px;
    width: 741px;
    .empty-img {
        position: absolute;
        margin-top: 180px;
        margin-left: 300px;
        height: 200px;
        width: 200px;
        background: url(/@/assets/images/empty-2.png) no-repeat center center/cover;
    }

    .empty-img::after {
        content: '暂无内容';
        position: absolute;
        bottom: -1px;
        left: 65px;
        padding: 8px;
        color: #afafaf;
        font-size: 14px;
    }
}
.status-wbg {
    width: 53px;
    height: 18px;
    line-height: 17px;
    border-radius: 4px;
    background-color: rgb(243, 240, 240);
    font-size: 12px;
    text-align: center;
    font-family: Roboto;
}
.status-ydy {
    width: 53px;
    height: 18px;
    line-height: 17px;
    border-radius: 4px;
    background-color: rgb(186, 238, 220);
    color: rgb(31, 202, 82);
    font-size: 12px;
    text-align: center;
    font-family: Roboto;
}

.status-ydj {
    width: 53px;
    height: 18px;
    line-height: 17px;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 1);
    color: rgba(76, 167, 249, 1);
    font-size: 12px;
    text-align: center;
    font-family: Roboto;
    border: 1px solid rgba(76, 167, 249, 1);
}

.status-ycy {
    width: 53px;
    height: 18px;
    line-height: 17px;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 1);
    color: rgba(255, 164, 0, 1);
    font-size: 12px;
    text-align: center;
    font-family: Roboto;
    border: 1px solid rgba(255, 164, 0, 1);
}

.status-yqs {
    width: 53px;
    height: 18px;
    line-height: 17px;
    border-radius: 4px;
    background-color: rgba(228, 147, 41, 0.164);
    color: rgb(250, 192, 1);
    font-size: 12px;
    text-align: center;
    font-family: Roboto;
}

.status-ybg {
    width: 53px;
    height: 18px;
    line-height: 17px;
    border-radius: 4px;
    background-color: rgba(76, 167, 249, 0.11);
    color: rgba(76, 167, 249, 1);
    font-size: 12px;
    text-align: center;
    font-family: Roboto;
}
</style>
