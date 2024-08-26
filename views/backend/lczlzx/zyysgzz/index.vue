<template>
    <div class="container-box">
        <div class="left-box">
            <div class="search">
                <label>科室类型：</label>
                <el-select v-model="state.kslx" multiple placeholder="请选择" filterable clearable>
                    <el-option v-for="opt in state.ksData" :key="opt.KSBM" :label="opt.KSMC" :value="opt.KSBM"></el-option>
                </el-select>
                <el-checkbox false-label="null" :true-label="1" v-model="state.brlx">只看我的病人</el-checkbox>
            </div>
            <div class="br-list">
                <el-tabs v-model="state.activeBrlb">
                    <el-tab-pane label="候诊" name="houzhen">
                        <Brlist @rowChange="rowChange" />
                    </el-tab-pane>
                    <el-tab-pane label="已诊" name="yizhen">
                        <Brlist @rowChange="rowChange" />
                    </el-tab-pane>
                    <el-tab-pane label="留观" name="liuguan">
                        <Brlist @rowChange="rowChange" />
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div class="jzz-br-box">
                <div class="title">就诊中（2人）</div>
                <div class="jzz-br-list">
                    <Brlist @rowChange="rowChange" />
                </div>
            </div>
        </div>
        <div class="main-box">
            <div class="action">
                <el-button type="primary" plain>新增病人</el-button>
                <el-button type="primary" plain>转住院</el-button>
                <el-button type="primary" plain>转留观</el-button>
                <el-button type="primary">完成接诊</el-button>
                <el-button>退出</el-button>
            </div>
            <div class="br-info">
                <div class="mz-brxx">
                    <div class="item"><span>姓名：</span><span>{{ state.currentBrxx.XM }}</span></div>
                    <div class="item"><span>性别：</span><span>{{ state.currentBrxx.XB }}</span></div>
                    <div class="item"><span>年龄：</span><span>{{ state.currentBrxx.NL }}</span></div>
                    <div class="item"><span>证件号码：</span><span>{{ state.currentBrxx.ZJHM }}</span></div>
                    <div class="item"><span>电话：</span><span>{{ state.currentBrxx.DHHM }}</span></div>
                    <div class="item"><span>人员类别：</span><span>{{ state.currentBrxx.RYLB }}</span></div>
                </div>
                <div class="mz-brxx">
                    <div class="item"><span>民族：</span><span>{{ state.currentBrxx.MZ }}</span></div>
                    <div class="item"><span>住址：</span><span>{{ state.currentBrxx.ZZ }}</span></div>
                    <div class="item"><span>过敏史：</span><span>{{ state.currentBrxx.GMS }}</span></div>
                </div>
                <div class="mz-brxx">
                    <div class="item"><span>诊断：</span><span>{{ state.currentBrxx.ZD }}</span></div>
                </div>
            </div>
            <div class="main-content">
                <el-tabs type="border-card" v-model="state.activeBasy">
                    <el-tab-pane label="门诊首页" name="mzhome">
                        <MzHome :tab="state.activeBasy" :brxx="state.currentBrxx" />
                    </el-tab-pane>
                    <el-tab-pane label="门诊处方" name="mzcf">
                        <Mzcf :tab="state.activeBasy" />
                    </el-tab-pane>
                    <el-tab-pane label="电子病历" name="dzbl">
                        <Dzbl :tab="state.activeBasy" />
                    </el-tab-pane>
                    <el-tab-pane label="检验申请" name="jysq">
                        <Jysq :tab="state.activeBasy" />
                    </el-tab-pane>
                    <el-tab-pane label="检查申请" name="jcsq">
                        <Jcsq :tab="state.activeBasy" />
                    </el-tab-pane>
                    <el-tab-pane label="病历夹" name="blj">
                        <Blj :tab="state.activeBasy" />
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import Brlist from './brlist.vue'
import MzHome from './zysy.vue'
import Mzcf from './mzcf.vue'
import Dzbl from './dzbl.vue'
import Jysq from './jysq.vue'
import Jcsq from './jcsq.vue'
import Blj from './blj.vue'

defineOptions({
    name: 'test/demo',
})

const router = useRouter()

const state: {
    ksData: any
    kslx: string
    brlx: string
    activeBrlb: string,
    activeBasy: string,
    currentBrxx: any
} = reactive({
    ksData: [],
    kslx: '',
    brlx: '',
    activeBrlb: 'houzhen',
    activeBasy: '',
    currentBrxx: {
        XM: '',
        HY: '',
        YYSJ: '',
        GHLX: '',
        BLH: '',
        XB: '',
        NL: '',
        ZJHM: '',
        DHHM: '',
        RYLB: '',
        MZ: '',
        ZZ: '',
        GMS: '',
        ZD: ''
    }
})

const rowChange = (row: any) => {
    state.currentBrxx = row
}

onMounted(() => {
    state.activeBasy = 'mzhome'
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
                height: calc(60vh - 100px)
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
                height: calc(100vh - 320px)
            }
        }
    }
}</style>
