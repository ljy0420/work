<template>
    <div class="mz-home-container">
        <div class="mz-home-content">
            <el-scrollbar v-loading="state.loading">
                <div class="mz-home-top">
                    <div class="mzcf-action">
                        <el-dropdown class="button-dropdown">
                            <el-button type="text" plain>
                                <Icon name="local-print" />
                                <span class="operate-text">打印</span>
                            </el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="dydxBtn">打印多项</el-dropdown-item>
                                    <el-dropdown-item>申请单</el-dropdown-item>
                                    <el-dropdown-item>输液卡</el-dropdown-item>
                                    <el-dropdown-item>注射单</el-dropdown-item>
                                    <el-dropdown-item>雾化单</el-dropdown-item>
                                    <el-dropdown-item>治疗单</el-dropdown-item>
                                    <el-dropdown-item>费用清单</el-dropdown-item>
                                    <el-dropdown-item>诊断证明</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                        <el-dropdown class="button-dropdown">
                            <el-button type="text" plain>
                                <Icon name="local-create" />
                                <span class="operate-text">新增处方</span>
                            </el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="addXycf">西药处方</el-dropdown-item>
                                    <el-dropdown-item @click="addZycf">中药处方</el-dropdown-item>
                                    <el-dropdown-item @click="addZyzl">中医治疗</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                        <el-button type="text" plain @click="onHistory">
                            <Icon name="local-history" />
                            <span class="operate-text">历史处方</span>
                        </el-button>
                        <el-button type="text" plain>
                            <Icon name="local-save-template" />
                            <span class="operate-text" @click="cwmbBtn">存为模板</span>
                        </el-button>
                        <el-button type="text" plain>
                            <Icon name="local-zsk" />
                            <span class="operate-text">知识库</span>
                        </el-button>
                        <el-button type="text" plain>
                            <Icon name="local-gmy" />
                            <span class="operate-text">过敏史</span>
                        </el-button>
                        <el-button type="text" plain>
                            <Icon name="local-expand1" class="expand-icon" />
                            <span class="operate-text">一键收起</span>
                        </el-button>
                        <el-button type="primary" class="button-emit"> 发送 </el-button>
                    </div>
                </div>
                <div class="mz-home-body">
                    <span class="bz">*除中药处方外，同一处方内最多存在5条记录，仅支持同一处方内设置成组。F6：打开药品名称，F2：医嘱保存。</span>
                    <div class="empty" v-if="state.cfList.length == 0">
                        <div class="empty-img"></div>
                    </div>
                    <div v-else>
                        <div style="margin-right: 10px; margin-bottom: 20px" v-for="item in state.cfList" :key="item.bm">
                            <Xycf v-if="item.cflx == 1" :cfinfo="item" @delete="deleteCf" />
                            <Zycf v-if="item.cflx == 2" :cfinfo="item" @delete="deleteCf" />
                            <Zyzl v-if="item.cflx == 3" :cfinfo="item" @delete="deleteCf" />
                        </div>
                    </div>
                </div>
            </el-scrollbar>
        </div>
        <div class="mz-home-template">
            <el-scrollbar>
                <div class="template-header">
                    <div class="title-tag"></div>
                    <div class="title-label">处方模板</div>
                </div>
                <div class="template-search">
                    <el-select v-model="form.MBGS" clearable>
                        <el-option v-for="opt in state.MBFL" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                    </el-select>
                    <el-input></el-input>
                </div>
                <div class="template-list">
                    <div class="template-item" v-for="item in state.tpList" :key="item.MBBM">
                        <div class="title">
                            {{ item.MBMC }}
                            <el-button type="primary" size="small" style="float: right" @click="dyBtn(item)">调用</el-button>
                        </div>
                        <div class="description" @dblclick="dblBtn(item)">
                            {{ item.MBMS }}
                        </div>
                    </div>
                </div>
            </el-scrollbar>
        </div>
        <EditXycfmb ref="flag" @cflx="xyCflx" />
        <EditZycfmb ref="flag1" @cflx="zyCflx" />
        <Dydx ref="dydxRef" />
        <History ref="historyRef" />
        <Cwmb ref="cwmbRef" />
    </div>
</template>
<script setup lang="ts">
import { nextTick } from 'process'
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { uuid } from '/@/utils/random'
import Xycf from './mzcf/xycf.vue'
import Zycf from './mzcf/zycf.vue'
import Zyzl from './mzcf/zyzl.vue'
import EditXycfmb from './mzcf/edit-xycfmb.vue'
import EditZycfmb from './mzcf/edit-zycfmb.vue'
import Dydx from './mzcf/dydx.vue'
import History from './mzcf/history.vue'
import Cwmb from './mzcf/cwmb.vue'
const props = defineProps(['tab'])
const flag = ref()
const flag1 = ref()
const dydxRef = ref()
const historyRef = ref()
const cwmbRef = ref()
const state: {
    loading: boolean
    cfList: any
    tpList: any //模板列表
    MBFL: any
    CFLX: any
} = reactive({
    loading: false,
    cfList: [],
    tpList: [
        {
            BM: '01',
            MBMC: '模版1',
            MBMS: '药品：参考文字参考文字参考文字参考文字参考文字参考文字参考文字参考文字参考文字参考文字参考文字参考文字...',
        },
        {
            BM: '02',
            MBMC: '模版2',
            MBMS: '药品：参考文字参考文字参考文字参考文字参考文字参考文字参考文字参考文字参考文字参考文字参考文字参考文字...',
        },
        {
            BM: '03',
            MBMC: '西药处方模版1',
            MBMS: '药品：参考文字参考文字参考文字参考文字参考文字参考文字参考文字参考文字参考文字参考文字参考文字参考文字...',
            CFLX: 1,
        },
        {
            BM: '04',
            MBMC: '中药处方模板1',
            MBMS: '药品：参考文字参考文字参考文字参考文字参考文字参考文字参考文字参考文字参考文字参考文字参考文字参考文字...',
            CFLX: 2,
        },
        {
            BM: '05',
            MBMC: '参考文字参考文字1',
            MBMS: '药品：参考文字参考文字参考文字参考文字参考文字参考文字参考文字参考文字参考文字参考文字参考文字参考文字...',
        },
        {
            BM: '06',
            MBMC: '模版6',
            MBMS: '药品：参考文字参考文字参考文字参考文字参考文字参考文字参考文字参考文字参考文字参考文字参考文字参考文字...',
        },
    ],
    MBFL: [
        { label: '个人', value: 1 },
        { label: '科室', value: 2 },
        { label: '全院', value: 3 },
    ],
    CFLX: 2,
})

const form = reactive({
    ZS: '',
    XBS: '',
    JWS: '',
    GMS: '',
    MBGS: '',
})

const xyCflx = (data: any) => {
    state.CFLX = data
}

const zyCflx = (data: any) => {
    state.CFLX = data
}

const dydxBtn = () => {
    dydxRef.value.show()
}

const cwmbBtn = () => {
    cwmbRef.value.show()
}

const dyBtn = (item: any) => {
    if (item.CFLX === 1) {
        flag.value.show()
    } else if (item.CFLX === 2) {
        flag1.value.show()
    } else {
        flag.value.show()
    }
}

const dblBtn = (item: any) => {
    if (item.CFLX === 1) {
        flag.value.show()
    } else if (item.CFLX === 2) {
        flag1.value.show()
    } else {
        flag.value.show()
    }
}

const addXycf = () => {
    state.cfList.push({
        bm: uuid(),
        title: '西药处方',
        cflx: 1,
        isEdit: true,
        isCopied: false,
        isExpand: true,
        items: [{ ID: uuid() }],
    })
}

const addZycf = () => {
    state.cfList.push({
        bm: uuid(),
        title: '中药处方',
        cflx: 2,
        isEdit: true,
        isCopied: false,
        isExpand: true,
        items: [{ ID: uuid() }],
    })
}

const addZyzl = () => {
    state.cfList.push({
        bm: uuid(),
        title: '中医治疗',
        cflx: 3,
        isEdit: true,
        isCopied: false,
        isExpand: true,
        items: [{ ID: uuid() }],
    })
}

const deleteCf = (bm: string) => {
    let index = state.cfList.findIndex((item: any) => item.bm == bm)
    if (index != -1) {
        state.cfList.splice(index, 1)
    }
}

const onHistory = () => {
    historyRef.value.show()
}

watch(
    () => props.tab,
    (value) => {
        if (value === 'mzcf') {
            state.loading = true
            setTimeout(() => {
                state.loading = false
            }, 1000)
        }
    }
)

onMounted(() => {})
</script>

<style lang="scss" scoped>
.mz-home-container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    .mz-home-content {
        height: 100%;
        width: calc(100% - 230px);
        display: flex;
        flex-direction: column;
        .mz-home-top {
            display: inline-block;
            position: relative;
            height: 50px;
            width: 100%;
            text-align: center;
            line-height: 50px;
            font-size: 20px;
            border-bottom: 3px solid #f1f1f1;
            box-sizing: border-box;
            .mzcf-action {
                float: left;
                .button-dropdown {
                    margin-top: 11px;
                    margin-right: 6px;
                }
                .button-emit {
                    width: 80px;
                    margin-left: 220px;
                }
                .svg-icon {
                    color: #59a7ff !important;
                }
                .operate-text {
                    margin-left: 6px;
                }
            }
        }
        .mz-home-body {
            flex-grow: 1;
            width: 100%;
            .bz {
                color: red;
                font-size: 14px;
            }
            .empty {
                margin-left: -120px;
                margin-top: 100px;
                background: #f8f8f8;
                .empty-img {
                    position: absolute;
                    margin-top: 40px;
                    margin-left: 440px;
                    height: 200px;
                    width: 200px;
                    background: url(/@/assets/images/empty-2.png) no-repeat center center/cover;
                }

                .empty-img::after {
                    content: '请新增处方或选择处方模板';
                    position: absolute;
                    bottom: -10px;
                    left: 5px;
                    padding: 8px;
                    color: #afafaf;
                    font-size: 14px;
                }
            }
        }
    }

    .mz-home-template {
        height: 100%;
        width: 230px;
        margin-left: 10px;
        .template-header {
            margin-top: 5px;
            display: flex;
            padding: 10px 0;
            font-size: 15px;
            .title-tag {
                display: inline-block;
                background-color: #4499f9;
                width: 5px;
                margin-right: 6px;
            }
            .title-label {
                display: inline-block;
                font-weight: 600;
            }
        }

        .template-search {
            display: flex;
            .el-select {
                width: 100px;
            }
            .el-input {
                margin-left: 5px;
                flex: 1;
            }
        }

        .template-list {
            padding-top: 1px;
            .template-item {
                margin-top: 10px;
                display: flex;
                flex-direction: column;
                border: 1px solid #f1f1f1;
                padding: 5px 10px;
                .title {
                    font-weight: 600;
                    border-bottom: 1px solid #f1f1f1;
                }
                .description {
                    // width: 260px;
                    margin-top: 5px;
                }
            }
        }
    }
}
.expand-icon {
    transform: rotate(180deg);
}
</style>
