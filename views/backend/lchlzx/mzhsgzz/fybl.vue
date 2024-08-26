<template>
    <div class="mz-home-container">
        <div class="mz-home-content">
            <div class="mz-home-top">
                <div class="mzcf-action">
                    <el-button type="text" plain>
                        <Icon name="local-refresh" />
                        <span class="operate-text">刷新</span>
                    </el-button>
                    <el-button type="text" plain>
                        <Icon name="local-print" />
                        <span class="operate-text">打印处方单</span>
                    </el-button>
                    <el-button type="text" plain>
                        <Icon name="local-save" />
                        <span class="operate-text">保存</span>
                    </el-button>
                    <el-button type="text" plain>
                        <Icon name="local-refresh" />
                        <span class="operate-text">新增处方</span>
                    </el-button>
                    <el-button type="text" plain>
                        <Icon name="local-jh" />
                        <span class="operate-text">新增记录</span>
                    </el-button>
                    <el-button type="text" plain>
                        <Icon name="local-sjt" />
                        <span class="operate-text">上移</span>
                    </el-button>
                    <el-button type="text" plain>
                        <Icon name="local-xjt" />
                        <span class="operate-text">下移</span>
                    </el-button>
                    <el-button type="text" plain>
                        <Icon name="local-fail" color="#808080" />
                        <span class="operate-text">删除</span>
                    </el-button>
                    <el-button type="text" plain>
                        <Icon name="local-copy" />
                        <span class="operate-text">复制</span>
                    </el-button>
                    <el-button type="text" plain>
                        <Icon name="local-join" color="#59a7ff" />
                        <span class="operate-text">设置成组</span>
                    </el-button>
                    <el-button type="text" plain>
                        <Icon name="local-split" color="#59a7ff" />
                        <span class="operate-text">取消成组</span>
                    </el-button>
                    <el-button type="text" plain>
                        <Icon name="local-drmb" />
                        <span class="operate-text">导入模板</span>
                    </el-button>
                    <el-button type="text" plain>
                        <Icon name="local-bcmb" />
                        <span class="operate-text">保存模板</span>
                    </el-button>
                </div>
            </div>
            <div class="mz-home-body" :style="{ width: templateVisible ? 'calc(100% - 170px)' : '100%' }">
                <div class="main">
                    <div>
                        <span>处方编辑————————F6：打开项目检索 F7打开检验开单 F8打开检查开单</span>
                    </div>
                    <div class="content">
                        <div class="cfbj-top">
                            <el-form>
                                <el-row :gutter="0">
                                    <el-col :xs="12" :sm="5">
                                        <el-form-item prop="XMJS" label="项目检索：">
                                            <el-select v-model="form.XMJS" clearable style="width: 100%">
                                                <el-option v-for="opt in state.xmjsArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="12" :sm="7">
                                        <el-form-item prop="XMMX">
                                            <el-select v-model="form.XMMX" clearable style="width: 100%">
                                                <el-option v-for="opt in state.xmmxArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="12" :sm="2">
                                        <el-button type="primary" plain class="cfbj-padding">刷新</el-button>
                                    </el-col>
                                    <el-col :xs="12" :sm="2">
                                        <el-button type="primary" plain>中医治疗</el-button>
                                    </el-col>
                                    <el-col :xs="12" :sm="2" style="margin-left: 20px">
                                        <el-button type="primary" plain>中医处方</el-button>
                                    </el-col>
                                    <el-col :xs="12" :sm="2" style="margin-left: 20px">
                                        <el-button type="primary" plain>编辑样式</el-button>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="0">
                                    <el-col :xs="12" :sm="12">
                                        <el-form-item prop="YZNR" label="医嘱内容：">
                                            <el-input v-model="form.YZNR" type="string" placeholder="请输入医嘱内容" style="width: 100%"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="12" :sm="3" style="margin-left: 20px">
                                        <el-form-item prop="DJ" label="单价：">
                                            <el-select v-model="form.DJ" clearable style="width: 100%">
                                                <el-option v-for="opt in state.djArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="12" :sm="3" class="cfbj-padding">
                                        <el-form-item prop="XZ" label="性质：">
                                            <el-select v-model="form.XZ" clearable style="width: 100%">
                                                <el-option v-for="opt in state.xzArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="0">
                                    <el-col :xs="12" :sm="4">
                                        <el-form-item prop="DCYL" label="单次用量：">
                                            <el-input v-model="form.DCYL" type="string" placeholder="请输入单次用量" style="width: 100%"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="12" :sm="2" class="cfbj-padding">
                                        <el-select v-model="form.DCYL" clearable style="width: 90%">
                                            <el-option
                                                v-for="opt in state.dcylArr"
                                                :key="opt.BM"
                                                :label="opt.MC"
                                                :value="opt.BM"
                                            ></el-option> </el-select
                                    ></el-col>
                                    <el-col :xs="12" :sm="4">
                                        <el-form-item prop="YZYF" label="医嘱用法：">
                                            <el-select v-model="form.YZYF" clearable style="width: 100%">
                                                <el-option v-for="opt in state.yzyfArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="12" :sm="4" class="cfbj-padding">
                                        <el-form-item prop="YZPL" label="医嘱频率：">
                                            <el-select v-model="form.YZPL" clearable style="width: 100%">
                                                <el-option v-for="opt in state.yzplArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="12" :sm="3" class="cfbj-padding">
                                        <el-form-item prop="DS" label="滴速：">
                                            <el-select v-model="form.DS" clearable style="width: 100%">
                                                <el-option v-for="opt in state.dsArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="12" :sm="3" class="cfbj-padding">
                                        <el-form-item prop="JS" label="剂数：">
                                            <el-input v-model="form.JS" type="string" placeholder="请输入剂数" style="width: 100%"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="0">
                                    <el-col :xs="12" :sm="4">
                                        <el-form-item prop="ZXKS" label="执行科室：">
                                            <el-select v-model="form.ZXKS" clearable style="width: 100%">
                                                <el-option v-for="opt in state.zxksArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="12" :sm="4" class="cfbj-padding">
                                        <el-form-item prop="YSZT" label="医生嘱托：">
                                            <el-input v-model="form.YSZT" type="string" placeholder="请输入医生嘱托" style="width: 100%"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="12" :sm="4" class="cfbj-padding">
                                        <el-form-item prop="KDYS" label="开单医生：">
                                            <el-select v-model="form.KDYS" clearable style="width: 100%">
                                                <el-option v-for="opt in state.kdysArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="12" :sm="3" class="cfbj-padding">
                                        <el-form-item prop="TS" label="天数：">
                                            <el-input v-model="form.TS" type="string" placeholder="请输入天数" style="width: 100%"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="12" :sm="3" class="cfbj-padding">
                                        <el-form-item prop="ZL" label="总量：">
                                            <el-input v-model="form.ZL" type="string" placeholder="请输入总量" style="width: 100%"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="12" :sm="2" class="cfbj-padding">
                                        <el-select v-model="form.ZL" clearable style="width: 100%">
                                            <el-option
                                                v-for="opt in state.zlArr"
                                                :key="opt.BM"
                                                :label="opt.MC"
                                                :value="opt.BM"
                                            ></el-option> </el-select
                                    ></el-col>
                                    <el-col :xs="12" :sm="2">
                                        <el-button type="primary" plain class="cfbj-padding">确认</el-button>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </div>
                        <div>
                            <el-table
                                ref="tableRef"
                                :data="[]"
                                highlight-current-row
                                @selection-change="onSelectionChange"
                                style="width: 100%; margin-top: 10px"
                                class="ba-data-table w100"
                                header-cell-class-name="table-header-cell"
                            >
                                <el-table-column prop="ZT" label="状态" width="60" />
                                <el-table-column prop="CFH" label="处方号" width="80" />
                                <el-table-column prop="YZNR" label="医嘱内容" width="180" align="center"> </el-table-column>
                                <el-table-column prop="JL" label="剂量" width="70" />
                                <el-table-column prop="GYFS" label="给药方式" width="100" />
                                <el-table-column prop="PC" label="频次" width="60" />
                                <el-table-column prop="DS" label="滴速" width="60" />
                                <el-table-column prop="TS" label="天数" width="60" />
                                <el-table-column prop="ZL" label="总量" width="60" />
                                <el-table-column prop="ZJE" label="总金额" width="80" />
                                <el-table-column prop="KFYS" label="开方医生" width="90" />
                                <el-table-column prop="ZT" label="嘱托" width="120" align="center" />
                                <el-table-column prop="ZXKS" label="执行科室" width="90" />
                            </el-table>
                        </div>
                    </div>
                    <div class="fybl-foot">
                        <span class="foot-dj">单价</span>
                        <span class="foot-item">提示：</span>
                        <el-input
                            v-model="form.TISHI"
                            type="string"
                            placeholder="请输入提示"
                            disabled
                            style="width: 200px"
                            class="foot-input"
                        ></el-input>
                        <div class="foot-zje">总金额： 0</div>
                    </div>
                </div>
                <div class="fold">
                    <el-button class="yszsBtn" plain @click="yszsBtn">医生助手</el-button>
                </div>
                <div class="template" v-if="templateVisible">
                    <el-scrollbar>
                        <div class="header">
                            <div class="title">医生助手</div>
                        </div>
                        <div class="list">
                            <div class="list-content">
                                <Cyyp v-if="cyypShow" />
                                <Cyxm v-if="cyxmShow" />
                                <Cymb v-if="cymbShow" />
                            </div>
                            <div class="list-tab">
                                <el-button class="cyyp" plain @click="cyypBtn">常用药品</el-button>
                                <el-button class="cyxm" plain @click="cyxmBtn">常用项目</el-button>
                                <el-button class="cymb" plain @click="cymbBtn">常用模板</el-button>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import Cyyp from './cyyp.vue'
import Cyxm from './cyxm.vue'
import Cymb from './cymb.vue'
const props = defineProps(['tab'])
const templateVisible = ref(false)
const cyypShow = ref(false)
const cyxmShow = ref(false)
const cymbShow = ref(false)
const state: {
    loading: boolean
    xmjsArr: any
    xmmxArr: any
    djArr: any
    xzArr: any
    dcylArr: any
    yzyfArr: any
    yzplArr: any
    dsArr: any
    zxksArr: any
    kdysArr: any
    zlArr: any
    activeBasy: any
} = reactive({
    loading: false,
    xmjsArr: [],
    xmmxArr: [],
    djArr: [],
    xzArr: [
        { BM: 1, MC: '正常' },
        { BM: 2, MC: '自备药' },
    ],
    dcylArr: [],
    yzyfArr: [],
    yzplArr: [],
    dsArr: [],
    zxksArr: [
        { BM: 1, MC: '中药房' },
        { BM: 2, MC: '西药房' },
        { BM: 3, MC: 'B超室' },
        { BM: 4, MC: '化验室' },
        { BM: 5, MC: '放射科' },
    ],
    kdysArr: [],
    zlArr: [],
    activeBasy: 'cyxm',
})

const form = reactive({
    XMJS: '',
    XMMX: '',
    YZNR: '',
    DJ: '',
    XZ: '',
    DCYL: '',
    YZYF: '',
    YZPL: '',
    DS: '',
    JS: '',
    ZXKS: '',
    YSZT: '',
    KDYS: '',
    ZL: '',
    TS: '',
    TISHI: '',
})

const table = reactive({
    selection: [],
})

const cyypBtn = () => {
    cyxmShow.value = false
    cymbShow.value = false
    cyypShow.value = true
}

const cyxmBtn = () => {
    cyypShow.value = false
    cymbShow.value = false
    cyxmShow.value = true
}

const cymbBtn = () => {
    cyypShow.value = false
    cyxmShow.value = false
    cymbShow.value = true
}

const yszsBtn = () => {
    templateVisible.value = !templateVisible.value
}

const onSelectionChange = (selection: any) => {
    table.selection = selection
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
    display: flex;
    flex-direction: row;
    .mz-home-content {
        flex: 1;
        height: 100%;
        width: calc(100% - 170px);
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
            flex: 1;
            display: flex;
            width: 100%;
            margin-top: 10px;
            width: 100%;
            .main {
                flex-grow: 1;
                width: 100%;
                .content {
                    margin-top: 10px;
                    width: 100%;
                    height: 500px;
                    border: 1px solid #eeeeee;
                    .cfbj-top {
                        margin-top: 10px;
                        margin-left: 10px;
                        .cfbj-padding {
                            margin-left: 10px;
                        }
                    }
                }
                .fybl-foot {
                    margin-top: 10px;
                    position: relative;
                    bottom: 5px;
                    .foot-dj {
                        display: inline-block;
                    }
                    .foot-item {
                        margin-left: 30px;
                        color: red;
                        display: inline-block;
                    }
                    .foot-input {
                        display: inline-block;
                    }
                    .foot-zje {
                        position: absolute;
                        top: 5px;
                        right: 80px;
                        display: inline-block;
                        border: 1px solid #eeeeee;
                    }
                }
            }
            .fold {
                position: fixed;
                top: 310px;
                right: -25px;
                .yszsBtn {
                    transform: rotate(90deg);
                    height: 20px;
                    width: 70px;
                }
            }
            .template {
                flex-grow: 0 1 auto;
                height: 100%;
                margin-left: 10px;
                margin-top: -20px;
                .header {
                    margin-top: 5px;
                    display: flex;
                    padding: 10px 0;
                    font-size: 15px;
                    .title {
                        display: inline-block;
                        font-weight: 600;
                    }
                }
                .list {
                    position: relative;
                    width: 150px;
                    height: 520px;
                    .list-tab {
                        position: absolute;
                        bottom: 0px;
                        display: flex;
                        flex-direction: column;
                        .cyyp {
                            margin: 0;
                            margin-bottom: 5px;
                            width: 150px;
                        }
                        .cyxm {
                            margin: 0;
                            margin-bottom: 5px;
                            width: 150px;
                        }
                        .cymb {
                            margin: 0;
                            width: 150px;
                        }
                    }
                }
            }
        }
    }
}
.expand-icon {
    transform: rotate(180deg);
}
</style>
