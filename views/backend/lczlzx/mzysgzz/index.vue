<template>
    <div class="container-box">
        <div class="left-box">
            <div class="search">
                <label>科室类型：</label>
                <el-select v-model="state.kslx" placeholder="请选择" filterable clearable @change="ksChange">
                    <el-option v-for="opt in state.ksData" :key="opt.KSBM" :label="opt.KSMC" :value="opt.KSBM"></el-option>
                </el-select>
                <el-checkbox false-label="null" :true-label="1" v-model="state.brlx">只看我的病人</el-checkbox>
            </div>
            <div class="br-list">
                <el-tabs v-model="state.activeBrlb" @tab-change="changeTab">
                    <el-tab-pane label="候诊" name="houzhen">
                        <div class="hz-br-box">
                            <Brlist @rowChange="rowChange" :ksData="state.kslx" :hzList="state.hzListData" />
                        </div>

                        <div class="jzz-br-box">
                            <div class="title">就诊中（2人）</div>
                            <div class="jzz-br-list">
                                <BrlistJzz @rowChange="rowChange" :jzList="state.jzListData" />
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="已诊" name="yizhen">
                        <BrlistYz @rowChange="rowChange" @filter-change="filterChange" :yzList="state.yzListData" />
                    </el-tab-pane>
                    <el-tab-pane label="留观" name="liuguan">
                        <BrlistLg @rowChange="rowChange" @filter-change1="filterChange1" :lgList="state.lgListData" />
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <div class="main-box">
            <div class="action">
                <el-button type="primary" plain @click="Jyghbtn">简易挂号</el-button>
                <el-button type="primary" plain>转住院</el-button>
                <el-button type="primary" plain>转留观</el-button>
                <el-button type="primary">完成接诊</el-button>
                <el-button>退出</el-button>
            </div>
            <div class="br-info">
                <div class="mz-brxx">
                    <div class="item">
                        <span>姓名：</span><span v-if="state.currentBrxx.BRXM">{{ state.BRXX.BRXM }}</span>
                    </div>
                    <div class="item">
                        <span>性别：</span><span>{{ genderOptions.find((option) => option.value === state.BRXX.BRXB)?.label }}</span>
                    </div>
                    <div class="item">
                        <span>年龄：</span><span>{{ state.BRXX.NL }}</span>
                    </div>
                    <div class="item">
                        <span>证件号码：</span><span>{{ state.BRXX.ZJHM }}</span>
                    </div>
                    <div class="item">
                        <span>电话：</span><span>{{ state.BRXX.DH }}</span>
                    </div>
                    <div class="item">
                        <span>人员类别：</span><span>{{ state.BRXX.RYLB }}</span>
                    </div>
                </div>
                <div class="mz-brxx" v-if="fold === false">
                    <div class="item">
                        <span>民族：</span><span>{{ state.BRXX.MZ }}</span>
                    </div>
                    <div class="item">
                        <span>住址：</span><span>{{ state.BRXX.ZZ }}</span>
                    </div>
                    <div class="item">
                        <span>过敏史：</span><span>{{ state.BRXX.GMS }}</span>
                    </div>
                </div>
                <div class="fold-content" v-if="fold === true && state.jbmc.length === 0"></div>
                <div class="mz-brxx" v-if="state.jbmc.length > 0">
                    <div class="item" v-for="(jbmc, index) in state.jbmc" :key="index">
                        <span>诊断 {{ index + 1 }} ：</span><span>{{ jbmc }}</span>
                    </div>
                </div>
                <div class="brinfo-action">
                    <el-button link type="primary" @click="onLrzd">录入诊断</el-button>
                    <el-button link type="primary" @click="Bjdabtn">编辑档案</el-button>
                </div>
            </div>
            <div class="mz-brxx-fold">
                <el-button type="text" plain @click="foldBtn">
                    <Icon name="local-arrowdown" :class="fold ? '' : 'fold-icon'" />
                </el-button>
            </div>
            <div class="main-content">
                <el-tabs type="border-card" v-model="state.activeBasy" @tab-change="changeTab1">
                    <el-tab-pane label="门诊首页" name="mzhome">
                        <MzHome
                            :tab="state.activeBasy"
                            :brxx="state.currentBrxx"
                            :zdxx="state.ZDXX"
                            :zdxz="state.zdxz"
                            :zdList="state.zdList"
                            :ksData="state.kslx"
                        />
                    </el-tab-pane>
                    <el-tab-pane label="门诊处方" name="mzcf">
                        <Mzcf :tab="state.activeBasy" />
                    </el-tab-pane>
                    <el-tab-pane label="电子病历" name="dzbl">
                        <Dzbl :tab="state.activeBasy" />
                    </el-tab-pane>
                    <el-tab-pane label="检验申请" name="jysq">
                        <Jysq :tab="state.activeBasy" :jysqData="state.jysqData" />
                    </el-tab-pane>
                    <el-tab-pane label="检查申请" name="jcsq">
                        <Jcsq :tab="state.activeBasy" :jcsqData="state.jcsqData" />
                    </el-tab-pane>
                    <el-tab-pane label="病历夹" name="blj">
                        <Blj :tab="state.activeBasy" />
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <Bjda ref="bjdaRef" />
        <Lrzd ref="lrzdRef" @zdConfirm="zdConfirm" @zdxz="zdxz" :lrzdList="state.lrzdList" :zdxz="state.zdxz" />
        <Jygh ref="jyghRef" />
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getKsList } from '/@/api/common'
import Brlist from './brlist.vue'
import BrlistJzz from './brlist-jzz.vue'
import BrlistYz from './brlist-yz.vue'
import BrlistLg from './brlist-lg.vue'
import MzHome from './mzsy.vue'
import Mzcf from './mzcf.vue'
import Dzbl from './dzbl.vue'
import Jysq from './jysq.vue'
import Jcsq from './jcsq.vue'
import Blj from './blj.vue'
import Bjda from './bjda.vue'
import Lrzd from './lrzd.vue'
import Jygh from './jygh.vue'
import { useAdminInfo } from '/@/stores/adminInfo'
import { getJzlb } from '/@/api/backend/lczlzx/brlist'
import { getJckdxm } from '/@/api/backend/lczlzx/jcsq'
import { getJykdxm } from '/@/api/backend/lczlzx/jysq'
import { cxblzdxx } from '/@/api/backend/lczlzx/blzdxx'
defineOptions({
    name: 'test/demo',
})

const router = useRouter()
const jyghRef = ref()
const bjdaRef = ref()
const lrzdRef = ref()
const adminInfo = useAdminInfo()
const fold = ref(false)
const state: {
    ksData: any
    kslx: string
    brlx: string
    activeBrlb: string
    activeBasy: string
    currentBrxx: any
    hzListData: any
    jzListData: any
    yzListData: any
    lgListData: any
    yzDate: any
    lgDate: any
    BRXX: any
    ZDXX: any
    zdxz: any
    jbmc: any
    zdList: any
    lrzdList: any
    jcsqData: any
    jysqData: any
} = reactive({
    ksData: [],
    kslx: '',
    brlx: '',
    activeBrlb: 'houzhen',
    activeBasy: '',
    currentBrxx: {
        BRXM: '',
        SJLY: '',
        DJSJ: '',
        GHLXMC: '',
        MZBLH: '',
        JZID: '',
        XB: '',
        NL: '',
        ZJHM: '',
        SFZH: '',
        RYLB: '',
        MZ: '',
        ZZ: '',
        GMS: '',
        ZD: '',
    },
    hzListData: [],
    jzListData: [],
    yzListData: [],
    lgListData: [],
    yzDate: [],
    lgDate: [],
    BRXX: [],
    ZDXX: [],
    zdxz: '',
    jbmc: [],
    zdList: [],
    lrzdList: [],
    jcsqData: [],
    jysqData: [],
})

const genderOptions = [
    { value: '1', label: '男' },
    { value: '2', label: '女' },
    { value: '3', label: '未知' },
]

const foldBtn = () => {
    fold.value = !fold.value
}

const Jyghbtn = () => {
    jyghRef.value.show()
}

const Bjdabtn = () => {
    bjdaRef.value.show()
}

const onLrzd = () => {
    lrzdRef.value.show()
}

const rowChange = (row: any) => {
    state.currentBrxx = row
}

const filterChange = (filter: any) => {
    state.yzDate = filter.dateRange
}
const filterChange1 = (filter: any) => {
    state.lgDate = filter.dateRange
}

const zdConfirm = (value: any) => {
    state.ZDXX = value
}

const zdxz = (value: any) => {
    state.zdxz = value
}

const fileData = (lx: number, time: any) => {
    if (lx == 1) {
        let data = {
            agrs: {
                LX: 1,
                GHKSBM: state.kslx,
                JZKSBM: state.kslx,
                JZYSBM: adminInfo.rybm,
            },
        }
        getJzlb(data).then((res) => {
            state.hzListData = res.data.HZBR
            state.jzListData = res.data.JZBR
        })
    }
    if (lx == 2) {
        let data = {
            agrs: {
                LX: lx,
                GHKSBM: state.kslx,
                JZKSBM: state.kslx,
                JZYSBM: adminInfo.rybm,
                time: time,
            },
        }
        getJzlb(data).then((res) => {
            state.yzListData = res.data.YZBR
        })
    }
    if (lx == 3) {
        let data = {
            agrs: {
                LX: lx,
                GHKSBM: state.kslx,
                JZKSBM: state.kslx,
                JZYSBM: adminInfo.rybm,
                time: time,
            },
        }
        getJzlb(data).then((res) => {
            state.lgListData = res.data.LGBR
        })
    }
}

const fileData1 = (tab: any) => {
    if (tab == 'jysq') {
        getJykdxm({}).then((res) => {
            state.jysqData = res.data
        })
    }
    if (tab == 'jcsq') {
        getJckdxm({}).then((res) => {
            state.jcsqData = res.data
        })
    }
}

const changeTab = (value: any) => {
    if (value == 'houzhen') {
        fileData(1, '')
    }
    if (value == 'yizhen') {
        fileData(2, state.yzDate)
    }
    if (value == 'liuguan') {
        fileData(3, state.lgDate)
    }
}
const changeTab1 = (value: any) => {
    if (value == 'jcsq') {
        fileData1('jcsq')
    }
    if (value == 'jysq') {
        fileData1('jysq')
    }
}

const ksChange = () => {
    if (state.activeBrlb == 'houzhen') {
        fileData(1, '')
    }
    if (state.activeBrlb == 'yizhen') {
        fileData(2, state.yzDate)
    }
    if (state.activeBrlb == 'liuguan') {
        fileData(3, state.lgDate)
    }
}

watch(
    () => state.currentBrxx,
    (val) => {
        if (val) {
            cxblzdxx({ agrs: { MZBLH: state.currentBrxx.MZBLH, JZID: state.currentBrxx.JZID } }).then((res) => {
                state.BRXX = res.data.BRXX[0]
                if (res.data.DATA.length >= 1) {
                    state.zdList = res.data.DATA[0]

                    let arr: any = []
                    let arr1: any = []
                    if (state.zdList.List_ZD.length >= 1) {
                        state.zdList.List_ZD.forEach((item: any) => {
                            state.zdxz = item.ZDXZ
                            arr1.push({
                                JBMC: item.JBMC,
                            })
                            arr.push({
                                ICDM: item.JBBM,
                                JBMC: item.JBMC,
                                ZZ: item.ZDBS,
                                YS: item.JL,
                            })
                        })
                        state.jbmc = arr1.map((item: any) => item.JBMC)
                        // console.log(state.jbmc)
                        state.lrzdList = arr
                    } else {
                        state.jbmc = ''
                        state.lrzdList = []
                    }
                }
            })
        }
    }
)

onMounted(() => {
    state.activeBasy = 'mzhome'
    getKsList().then((res: any) => {
        state.ksData = res.data.options
    })
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

        .search {
            display: flex;
            align-items: center;
            justify-items: center;

            .el-select {
                margin-right: 20px;
                width: 150px;
            }
        }

        .br-list {
            position: relative;
            margin-top: 5px;

            .el-tabs__content .el-tab-pane {
                width: 100%;
                height: calc(100vh - 180px);
            }

            :deep(.el-tabs__header) {
                margin: 0 0 5px;
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

        .hz-br-box {
            height: calc(60vh - 100px);
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
            position: relative;
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

            .brinfo-action {
                position: absolute;
                right: 10px;
                bottom: 10px;

                .el-button {
                    border-radius: 0;
                    border-bottom: 1px solid #409eff;
                }
            }
        }
        .fold-content {
            height: 36px;
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
                height: calc(100vh - 320px);
            }
        }
    }
}
.mz-brxx-fold {
    position: fixed;
    top: 214px;
    right: 27px;
    margin-top: -74px;
    .svg-icon {
        color: #409eff !important;
    }
    .fold-icon {
        transform: rotate(180deg);
    }
}
</style>
