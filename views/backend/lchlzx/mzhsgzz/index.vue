<template>
    <div class="container-box">
        <div class="left-box">
            <div class="button">
                <el-button type="text" plain>
                    <Icon name="local-refresh" />
                    <span class="operate-text">刷新</span>
                </el-button>
                <el-dropdown class="button-dropdown">
                    <el-button type="text" plain>
                        <Icon name="local-lgdj" class="btn-svg" />
                        <span class="operate-text">留观管理</span>
                    </el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="lgdj">
                                <Icon name="local-lgdj" color="#59a7ff" class="menu-svg" />
                                <span>留观登记</span>
                            </el-dropdown-item>
                            <el-dropdown-item @click="jslg">
                                <Icon name="local-jslg" color="#59a7ff" class="menu-svg" />
                                <span>结束留观</span>
                            </el-dropdown-item>
                            <el-dropdown-item @click="lgdjb"
                                ><Icon name="local-djb" color="#59a7ff" class="menu-svg" />
                                <span>留观登记本</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <el-button type="text" plain @click="szysBtn">
                    <Icon name="local-bjys" class="btn-svg" />
                    <span class="operate-text">设置样式</span>
                </el-button>
                <el-button type="text" plain>
                    <Icon name="local-dj" class="btn-svg" />
                    <span class="operate-text">三测单</span>
                </el-button>
            </div>
            <div class="search">
                <label>科室类型：</label>
                <el-select v-model="state.kslx" multiple placeholder="请选择" filterable clearable style="width: 75%">
                    <el-option v-for="opt in state.ksData" :key="opt.KSBM" :label="opt.KSMC" :value="opt.KSBM"></el-option>
                </el-select>
            </div>
            <div class="data">
                <el-radio-group v-model="state.dateRangeType" @change="dateRangeChange">
                    <el-radio :label="1">最近7天</el-radio>
                    <el-radio :label="2">最近15天</el-radio>
                    <el-radio :label="3">最近30天</el-radio>
                </el-radio-group>
                <el-form-item label="" style="margin-bottom: 5px">
                    <el-date-picker
                        v-model="state.dateRange"
                        type="datetimerange"
                        range-separator="-"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        format="YYYY-MM-DD HH:mm:ss"
                    />
                </el-form-item>
            </div>
            <div class="br-list">
                <el-tabs v-model="state.activeBrlb">
                    <el-tab-pane label="全部" name="quanbu">
                        <Brlist @rowChange="rowChange" />
                    </el-tab-pane>
                    <el-tab-pane label="留观病人" name="liuguan">
                        <Brlist @rowChange="rowChange" />
                    </el-tab-pane>
                    <el-tab-pane label="未留观病人" name="weiliuguan">
                        <Brlist @rowChange="rowChange" />
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <div class="main-box">
            <div class="br-info">
                <div class="mz-brxx">
                    <div class="item">
                        <span>就诊科室：</span><span>{{ state.currentBrxx.JZKS }}</span>
                    </div>
                    <div class="item">
                        <span>病历号：</span><span>{{ state.currentBrxx.BLH }}</span>
                    </div>
                    <div class="item">
                        <span>病人类型：</span><span>{{ state.currentBrxx.BRLX }}</span>
                    </div>
                    <div class="item">
                        <span>姓名：</span><span>{{ state.currentBrxx.XM }}</span>
                    </div>
                    <div class="item">
                        <span>性别：</span><span>{{ state.currentBrxx.XB }}</span>
                    </div>
                    <div class="item">
                        <span>年龄：</span><span>{{ state.currentBrxx.NL }}</span>
                    </div>
                </div>
                <div class="mz-brxx">
                    <div class="item">
                        <span>联系电话：</span><span>{{ state.currentBrxx.DHHM }}</span>
                    </div>
                    <div class="item">
                        <span>挂号时间：</span><span>{{ state.currentBrxx.GHSJ }}</span>
                    </div>
                    <div class="item">
                        <span>诊断：</span><span>{{ state.currentBrxx.ZD }}</span>
                    </div>
                </div>
            </div>
            <div class="main-content">
                <el-tabs type="border-card" v-model="state.activeBasy">
                    <el-tab-pane label="座位管理" name="zwgl">
                        <Zwgl :tab="state.activeBasy" :brxx="state.currentBrxx" />
                    </el-tab-pane>
                    <el-tab-pane label="处方审核" name="cfsh">
                        <Cfsh :tab="state.activeBasy" />
                    </el-tab-pane>
                    <el-tab-pane label="电子病历" name="dzbl">
                        <Dzbl :tab="state.activeBasy" />
                    </el-tab-pane>
                    <el-tab-pane label="费用补录" name="fybl">
                        <Fybl :tab="state.activeBasy" />
                    </el-tab-pane>
                    <el-tab-pane label="费用记录" name="fyjl">
                        <Fyjl :tab="state.activeBasy" />
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <Lgdj ref="lgdjRef" :brxx="state.currentBrxx" />
        <Jslg ref="jslgRef" :brxx="state.currentBrxx" />
        <Lgdjb ref="lgdjbRef" />
        <Szys ref="szysRef" />
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import Brlist from './brlist.vue'
import Zwgl from './zwgl.vue'
import Cfsh from './cfsh.vue'
import Dzbl from './dzbl.vue'
import Fybl from './fybl.vue'
import Fyjl from './fyjl.vue'
import Lgdj from './lggl/lgdj.vue'
import Jslg from './lggl/jslg.vue'
import Lgdjb from './lggl/lgdjb.vue'
import Szys from './szys.vue'
defineOptions({
    name: 'test/demo',
})

const router = useRouter()
const lgdjRef = ref()
const jslgRef = ref()
const lgdjbRef = ref()
const szysRef = ref()
const filter: {
    dateRange: any
} = reactive({
    dateRange: [],
})

const state: {
    ksData: any
    kslx: string
    brlx: string
    activeBrlb: string
    activeBasy: string
    currentBrxx: any
    dateRange: any
    dateRangeType: any
} = reactive({
    ksData: [],
    kslx: '',
    brlx: '',
    activeBrlb: 'quanbu',
    activeBasy: '',
    currentBrxx: {
        JZKS: '',
        BLH: '',
        BRLX: '',
        XM: '',
        XB: '',
        NL: '',
        LXDH: '',
        GHSJ: '',
        ZD: '',
    },
    dateRange: '',
    dateRangeType: 1,
})

const lgdj = () => {
    if (state.currentBrxx.BLH != '') {
        if (state.currentBrxx.LGZT === '留') {
            ElMessage({
                message: '该病人已经做了留观登记',
                type: 'error',
            })
        } else {
            lgdjRef.value.show()
        }
    }
}

const jslg = () => {
    if (state.currentBrxx.BLH != '') {
        if (state.currentBrxx.LGZT != '留') {
            ElMessage({
                message: '该病人已经做了结束留观',
                type: 'error',
            })
        } else {
            jslgRef.value.show()
        }
    }
}

const lgdjb = () => {
    lgdjbRef.value.show()
}

const szysBtn = () => {
    szysRef.value.show()
}

const rowChange = (row: any) => {
    state.currentBrxx = row
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
}

onMounted(() => {
    state.activeBasy = 'zwgl'
})
</script>

<style lang="scss" scoped>
.container-box {
    margin: 6px;
    background-color: #fff;
    display: flex;
    flex-direction: row;
    height: calc(100vh - 70px);

    .left-box {
        position: relative;
        width: 450px;
        padding: 10px 15px;
        height: 100%;
        display: flex;
        flex-direction: column;
        .button {
            .svg-icon {
                color: #59a7ff !important;
            }
            .operate-text {
                margin-left: 6px;
            }
        }
        .search {
            display: flex;
            align-items: center;
            justify-items: center;
            margin-top: 10px;
            .el-select {
                margin-right: 20px;
                width: 150px;
            }
        }
        .data {
            margin-top: 10px;
        }
        .br-list {
            position: relative;
            margin-top: 10px;

            .el-tabs__content .el-tab-pane {
                width: 100%;
                height: calc(60vh - 100px);
            }

            :deep(.el-tabs__header .el-tabs__nav) {
                display: flex;
                align-items: center;
                justify-content: space-between;
                float: none;

                .el-tabs__item {
                    letter-spacing: 2px;
                }
            }
        }

        .jzz-br-box {
            flex-grow: 1;
            margin-top: 15px;

            .title {
                padding: 5px 0;
                font-weight: 600;
            }

            .jzz-br-list {
                height: calc(40vh - 150px);
            }
        }
    }

    .main-box {
        width: calc(100% - 450px);
        padding: 10px;

        .action {
            min-width: 500px;

            .el-button {
                margin-right: 10px;
            }
        }

        .br-info {
            margin-top: 10px;
            background-color: #f1f1f1;
            padding: 1px 15px;

            .mz-brxx {
                padding: 8px 0;
                font-size: 15px;
                font-weight: 500;
                min-width: 1000px;

                .item {
                    display: inline-block;
                    margin-right: 15px;
                    min-width: 100px;
                }
            }
        }

        .main-content {
            margin-top: 10px;

            :deep(.el-tabs__header .el-tabs__item) {
                color: #666;
            }

            :deep(.el-tabs__header .el-tabs__item.is-active) {
                color: var(--el-color-primary);
            }

            :deep(.el-tabs__content) {
                padding: 5px 15px;
            }

            .el-tabs__content .el-tab-pane {
                width: 100%;
                height: calc(100vh - 280px);
            }
        }
    }
}
.menu-svg {
    margin-right: 10px;
}
.btn-svg {
    margin-left: 10px;
}
</style>
