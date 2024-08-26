<template>
    <div class="mz-home-container">
        <div class="mz-home-content">
            <el-scrollbar v-loading="state.loading">
                <div class="mz-home-top">
                    门诊病历
                    <div class="mzbl-action">
                        <el-button type="text" plain>
                            <Icon name="local-save" />
                            <span class="operate-text" @click="submit">保存</span>
                        </el-button>
                        <el-button type="text" plain @click="cwmbBtn">
                            <Icon name="local-save-template" />
                            <span class="operate-text">存为模板</span>
                        </el-button>
                        <el-button type="text" plain>
                            <Icon name="local-print" />
                            <span class="operate-text">打印病历</span>
                        </el-button>
                    </div>
                </div>
                <div class="mz-home-body">
                    <div class="mz-brxx">
                        <div class="item">
                            <span>姓名：</span><span>{{ props.brxx.BRXM }}</span>
                        </div>
                        <div class="item">
                            <span>性别：</span><span>{{ genderOptions.find((option) => option.value === props.brxx.XB)?.label }}</span>
                        </div>
                        <div class="item">
                            <span>出生日期：</span><span>{{ props.brxx.CSRQ }}</span>
                        </div>
                        <div class="item">
                            <span>年龄：</span><span>{{ props.brxx.NL }}</span>
                        </div>
                        <div class="item"><span>接诊科室：</span><span>中医门诊</span></div>
                        <div class="item"><span>门诊时间：</span><span>2023.12.24 10:30</span></div>
                    </div>
                    <div class="mz-blxx">
                        <div class="mz-blxx-main">
                            <div class="first-row">
                                <el-form-item prop="FBRQ" label="发病日期：" label-width="80px">
                                    <el-date-picker type="datetime" v-model="form.FBRQ" placeholder="" style="width: 200px"></el-date-picker>
                                </el-form-item>
                                <el-form-item prop="SYXJB" label="食源性疾病：" label-width="100px">
                                    <el-switch v-model="form.SYXJB"></el-switch>
                                </el-form-item>
                                <el-form-item prop="BGKLX" label="报告卡类型：" label-width="100px">
                                    <el-select v-model="form.BGKLX"></el-select>
                                </el-form-item>
                            </div>
                            <el-form-item prop="ZS" label="主诉：" label-width="80px">
                                <el-input v-model="form.ZS" type="textarea" placeholder="" :rows="3"></el-input>
                            </el-form-item>
                            <el-form-item prop="XBS" label="现病史：" label-width="80px">
                                <el-input v-model="form.XBS" type="textarea" placeholder="" :rows="3"></el-input>
                            </el-form-item>
                            <el-form-item prop="JWS" label="既往史：" label-width="80px">
                                <el-input v-model="form.JWS" type="textarea" placeholder="" :rows="3"></el-input>
                            </el-form-item>
                            <el-form-item prop="GMS" label="过敏史：" label-width="80px">
                                <el-input v-model="form.GMS" type="textarea" placeholder="" :rows="3"></el-input>
                            </el-form-item>
                        </div>
                        <div class="mz-blxx-tgjc">
                            <label class="tgjc-label">体格检查：</label>
                            <div class="tgjc-content">
                                <div class="row">
                                    <div class="tgjc-item">
                                        <el-form-item label="体温:" label-width="50px">
                                            <el-input v-model="form.TW" type="string" placeholder="" :rows="3" style="width: 60px"></el-input>
                                            <span>&nbsp;℃</span>
                                        </el-form-item>
                                    </div>
                                    <div class="tgjc-item">
                                        <el-form-item label="体重:" label-width="50px">
                                            <el-input v-model="form.TZ" type="string" placeholder="" :rows="3" style="width: 60px"></el-input>
                                            <span>&nbsp;(kg)</span>
                                        </el-form-item>
                                    </div>
                                    <div class="tgjc-item">
                                        <el-form-item label="心率:" label-width="50px">
                                            <el-input v-model="form.XL" type="string" placeholder="" :rows="3" style="width: 60px"></el-input>
                                            <span>&nbsp;次/分</span>
                                        </el-form-item>
                                    </div>
                                    <div class="tgjc-item">
                                        <el-form-item label="空腹血糖值:" label-width="90px">
                                            <el-input v-model="form.KFXTZ" type="string" placeholder="" :rows="3" style="width: 60px"></el-input>
                                            <span>&nbsp;mmol/L</span>
                                        </el-form-item>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="tgjc-item">
                                        <el-form-item label="脉搏:" label-width="50px">
                                            <el-input v-model="form.MB" type="string" placeholder="" :rows="3" style="width: 60px"></el-input>
                                            <span>&nbsp;次/分</span>
                                        </el-form-item>
                                    </div>
                                    <div class="tgjc-item">
                                        <el-form-item label="身高:" label-width="50px">
                                            <el-input v-model="form.SG" type="string" placeholder="" :rows="3" style="width: 60px"></el-input>
                                            <span>&nbsp;(cm)</span>
                                        </el-form-item>
                                    </div>
                                    <div class="tgjc-item">
                                        <el-form-item label="呼吸:" label-width="50px">
                                            <el-input v-model="form.HX" type="string" placeholder="" :rows="3" style="width: 60px"></el-input>
                                            <span>&nbsp;次/分</span>
                                        </el-form-item>
                                    </div>
                                    <div class="tgjc-item">
                                        <el-form-item label="餐后血糖值:" label-width="90px">
                                            <el-input v-model="form.CHXTZ" type="string" placeholder="" :rows="3" style="width: 60px"></el-input>
                                            <span>&nbsp;mmol/L</span>
                                        </el-form-item>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="tgjc-item">
                                        <el-form-item label="BP:" label-width="50px">
                                            <el-input v-model="form.BP1" type="string" placeholder="" :rows="3" style="width: 60px"></el-input>
                                            <span>&nbsp;/&nbsp;</span>
                                            <el-input v-model="form.BP2" type="string" placeholder="" :rows="3" style="width: 60px"></el-input>
                                            <span>&nbsp;mmHg</span>
                                        </el-form-item>
                                    </div>
                                    <div class="tgjc-item">
                                        <el-form-item label="体重指数:" label-width="80px">
                                            <el-input v-model="form.TZZS" type="string" placeholder="" :rows="3" style="width: 60px"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="tgjc-item">
                                        <el-form-item label="随机血糖值:" label-width="90px">
                                            <el-input v-model="form.SJXTZ" type="string" placeholder="" :rows="3" style="width: 60px"></el-input>
                                            <span>&nbsp;mmol/L</span>
                                        </el-form-item>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-scrollbar>
        </div>
        <div class="mz-home-fold">
            <el-button type="primary" plain round class="vertical-text-button" @click="toggleTemplateVisibility">{{
                isTemplateVisible ? '隐藏' : '展开'
            }}</el-button>
        </div>
        <div class="mz-home-template" v-if="isTemplateVisible">
            <el-scrollbar>
                <div class="template-header">
                    <div class="title-tag"></div>
                    <div class="title-label">病历模板</div>
                </div>
                <div class="template-search">
                    <el-select v-model="form.MBGS" @change="changeMbgs" clearable>
                        <el-option v-for="opt in state.MBFL" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                    </el-select>
                    <el-input></el-input>
                </div>
                <div class="template-list">
                    <div class="template-item" v-for="item in state.tpList" :key="item.MBBM">
                        <div class="title">
                            {{ item.MBMC }}
                            <el-button type="primary" size="small" style="float: right" @click="dyblmb(item)">调用</el-button>
                        </div>
                        <div class="description" @dblclick="dblclick(item)">
                            {{ item.ZS }}
                        </div>
                    </div>
                </div>
            </el-scrollbar>
        </div>
        <Bjblmb ref="flag" :blmb="state.tpList" :ksData="props.ksData" />
        <Cwmb ref="cwmbRef" />
    </div>
</template>
<script setup lang="ts">
import { nextTick } from 'process'
import { ref, reactive, onMounted, watch } from 'vue'
import { getBlmb } from '/@/api/backend/lczlzx/blmb'
import { useAdminInfo } from '/@/stores/adminInfo'
import { bcblzdxx } from '/@/api/backend/lczlzx/blzdxx'
import Bjblmb from './bjblmb.vue'
import { ElMessage } from 'element-plus'
import Cwmb from './mzsy/cwmb.vue'

const props = defineProps(['tab', 'brxx', 'ksData', 'zdxx', 'zdxz', 'zdList'])
const flag = ref()
const cwmbRef = ref()
const adminInfo = useAdminInfo()
const isTemplateVisible = ref(false) // 默认不显示模板
const state: {
    loading: boolean
    tpList: any //模板列表
    BLMB: any
    MBFL: any
    BRXX: any
    ZDXX: any
    zdList: any
} = reactive({
    loading: false,
    tpList: [],
    BLMB: '',
    MBFL: [
        { label: '个人模板', value: 1 },
        { label: '科室模板', value: 2 },
        { label: '全院模板', value: 3 },
    ],
    BRXX: [],
    ZDXX: [],
    zdList: [],
})

const genderOptions = [
    { value: '1', label: '男' },
    { value: '2', label: '女' },
    { value: '3', label: '未知' },
]

const form = reactive({
    FBRQ: '',
    SYXJB: false,
    BGKLX: '',
    ZS: '',
    XBS: '',
    JWS: '',
    GMS: '',
    TW: '',
    TZ: '',
    XL: '',
    KFXTZ: '',
    MB: '',
    SG: '',
    HX: '',
    CHXTZ: '',
    BP1: '',
    BP2: '',
    TZZS: '',
    SJXTZ: '',
    MBGS: undefined,
})

const dyblmb = (item: any) => {
    form.ZS = item.ZS
    form.XBS = item.XBS
    form.JWS = item.JWS
    form.TW = item.TIWEN
    form.TZ = item.TZ
    form.XL = item.XL
    form.MB = item.MB
    form.SG = item.SG
    form.HX = item.HX
    form.TZZS = item.TZZS
    form.SYXJB = item.SYXJB
}

const dblclick = (item: any) => {
    flag.value.show()
    nextTick(() => {
        flag.value.init(item)
    })
}

const cwmbBtn = () => {
    cwmbRef.value.show()
}

const toggleTemplateVisibility = () => {
    isTemplateVisible.value = !isTemplateVisible.value
}

const changeMbgs = () => {
    if (form.MBGS == 1) {
        let data = {
            agrs: {
                MBFL: form.MBGS,
                CJYSBM: adminInfo.rybm,
            },
        }
        getBlmb(data).then((res) => {
            state.tpList = res.data
        })
    }
    if (form.MBGS == 2) {
        let data = {
            agrs: {
                MBFL: form.MBGS,
                CJKSBM: props.ksData,
            },
        }
        getBlmb(data).then((res) => {
            state.tpList = res.data
        })
    }
    if (form.MBGS == 3) {
        let data = {
            agrs: {
                MBFL: form.MBGS,
            },
        }
        getBlmb(data).then((res) => {
            state.tpList = res.data
        })
    }
}
watch(
    () => props.tab,
    (value) => {
        if (value === 'mzhome') {
            state.loading = true
            setTimeout(() => {
                state.loading = false
            }, 1000)
        }
    }
)
watch(
    () => props.zdList,
    (val) => {
        if (val) {
            // form.FBRQ = props.zdList.FBRQ
            // form.SYXJB = props.zdList.SYXJB
            // form.ZS = props.zdList.ZS
            // form.XBS = props.zdList.XBS
            // form.JWS = props.zdList.JWS
            if (props.zdList.List_ZD.length >= 1) {
                form.FBRQ = props.zdList.FBRQ
                form.SYXJB = props.zdList.SYXJB
                form.ZS = props.zdList.ZS
                form.XBS = props.zdList.XBS
                form.JWS = props.zdList.JWS
            } else {
                form.FBRQ = ''
                form.SYXJB = false
                form.ZS = ''
                form.XBS = ''
                form.JWS = ''
            }
        }
    }
)

watch(
    () => props.zdxx,
    (val) => {
        if (val) {
            let arr: any = []
            let i = 1
            props.zdxx.forEach((item: any) => {
                arr.push({
                    BRID: props.brxx.BRID,
                    JZID: props.brxx.JZID,
                    MZBLH: props.brxx.MZBLH,
                    ZDCX: i,
                    ZDXZ: props.zdxz,
                    JBMC: item.JBMC,
                    JBBM: item.ICDM,
                    ZDBS: item.ZZ,
                    JL: item.YS,
                })
                i++
            })
            state.zdList = arr
        }
    }
)

const submit = () => {
    let data = {
        agrs: {
            BRID: props.brxx.BRID,
            JZID: props.brxx.JZID,
            MZBLH: props.brxx.MZBLH,
            CJKSBM: props.ksData,
            ZS: form.ZS,
            XBS: form.XBS,
            List_ZD: state.zdList,
        },
    }

    bcblzdxx(data).then((res) => {
        if (res.code != 1) {
            ElMessage({
                type: 'error',
                message: '保存失败',
            })
        } else {
            ElMessage({
                type: 'success',
                message: '保存成功',
            })
        }
    })
}
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
            position: relative;
            height: 50px;
            width: 100%;
            text-align: center;
            line-height: 50px;
            font-size: 20px;
            border-bottom: 3px solid #f1f1f1;
            .mzbl-action {
                display: inline-block;
                position: absolute;
                right: 15px;
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
            .mz-brxx {
                padding: 10px 0;
                font-size: 15px;
                font-weight: 600;
                border-bottom: 1px solid #f1f1f1;
                min-width: 900px;
                .item {
                    display: inline-block;
                    margin-right: 15px;
                    min-width: 70px;
                }
            }
            .mz-blxx {
                margin-top: 10px;
                .mz-blxx-main {
                    .el-form-item {
                        margin-bottom: 10px;
                    }
                    .first-row {
                        display: flex;
                        .el-form-item {
                            margin-right: 20px;
                        }
                    }
                }
                .mz-blxx-tgjc {
                    display: flex;
                    min-width: 900px;
                    .el-form-item {
                        margin-bottom: 1px;
                    }
                    .tgjc-label {
                        width: 80px;
                    }
                    .tgjc-content {
                        flex-grow: 1;
                        background-color: #f1f1f1;
                        padding: 5px 15px;
                        .row {
                            padding: 5px 0;
                            display: flex;
                            .tgjc-item {
                                margin-right: 15px;
                                min-width: 170px;
                            }
                        }
                    }
                }
            }
        }
    }
    .mz-home-fold {
        .vertical-text-button {
            position: fixed; /* 固定定位 */
            top: 60%; /* 距离顶部50% */
            right: -20px; /* 距离右侧10% */
            border: none !important; /* 强制去除边框 */
            transform: translateY(-50%); /* 垂直居中 */
            writing-mode: vertical-lr; /* 文字垂直排列 */
            color: #409eff; /* 文字颜色 */
            background-color: #f0faff; /* 点击后的背景颜色 */
            height: 80px;
            width: 30px;
            padding-top: 25px;
            padding-right: 30px;
            letter-spacing: 15px; /* 增加字母间距 */
        }
        .vertical-text-button:active {
            background-color: #f0faff; /* 点击后的背景颜色 */
        }
    }
    .mz-home-template {
        flex: 0 1 auto;
        height: 100%;
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
                    margin-top: 5px;
                }
            }
        }
    }
}
</style>
