<template>
    <div class="layout-box">
        <div class="form-top">
            <el-scrollbar>
                <el-form :model="formData" :inline="true" label-width="100px" :rules="rules" ref="ruleFormRef">
                    <el-form-item prop="KDRQ" label="开单日期">
                        <el-date-picker v-model="formData.KDRQ" type="datetime" :disabled="true" placeholder="请选择开单日期"
                            style="width: 100%" />
                    </el-form-item>
                    <el-form-item prop="SHRQ" label="审核日期">
                        <el-date-picker v-model="examineTime" type="datetime" :disabled="true" placeholder="请选择审核日期"
                            style="width: 100%" />
                    </el-form-item>
                    <el-form-item label="单据号">
                        <el-input v-model="formData.DJH" type="string" :disabled="true" placeholder="请输入单据号" />
                    </el-form-item>
                    <el-form-item prop="CGRBM" label="采购员">
                        <el-select v-model="formData.CGRBM" placeholder="请选择采购员" :disabled="true" clearable
                            style="width: 100%">
                            <el-option v-for="opt in personnelIfon" :key="opt.RYBM" :label="opt.RYXM"
                                :value="opt.RYBM"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="CGYBM" label="仓管员">
                        <el-select v-model="formData.CGYBM" :disabled="true" placeholder="请选择仓管员" clearable
                            style="width: 100%">
                            <el-option v-for="opt in personnelIfon" :key="opt.RYBM" :label="opt.RYXM"
                                :value="opt.RYBM"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="供应商" prop="GYSBM">
                        <el-select filterable v-model="formData.GYSBM" :disabled="true" placeholder="请选择供应商" clearable
                            style="width: 100%">
                            <el-option v-for="opt in gysData" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="GYSLXR" label="供应商联系人">
                        <el-input v-model="formData.GYSLXR" type="string" :disabled="true" placeholder="请输入供应商联系人" />
                    </el-form-item>
                    <el-form-item prop="FPHM" label="发票号">
                        <el-input v-model="formData.FPHM" type="string" :disabled="true" placeholder="请输入发票号" />
                    </el-form-item>

                    <el-form-item label="备注">
                        <el-input v-model="formData.BZ" type="string" :disabled="true" placeholder="请输入备注信息"
                            class="specs_frame" />
                    </el-form-item>
                </el-form>
            </el-scrollbar>
        </div>
        <div class="yd-card-body">
            <el-table ref="tableref" :data="state.ykData" class="color-table"
                :header-cell-style="{ borderColor: '#e0e0e0' }" :cell-style="{ borderColor: '#e0e0e0' }"
                height="calc(100vh - 300px)">
                <el-table-column prop="PXH" label="行号" align="center" :width="65"
                    class-name="custom-header"></el-table-column>
                <el-table-column prop="YPXX" label="药品" align="center" width="150">
                    <el-table-column prop="YPBM" label="编码" align="center" width="120"></el-table-column>
                    <el-table-column prop="YPMC" label="品名" align="center" width="170"></el-table-column>
                    <el-table-column prop="GG" label="规格" align="center" width="150"></el-table-column>
                </el-table-column>
                <el-table-column prop="DWBZ" label="包装" align="center" width="70"></el-table-column>
                <el-table-column prop="CPPH" label="产品批号" align="center" width="150"></el-table-column>
                <el-table-column prop="SL" label="数量" align="center" width="80"></el-table-column>
                <el-table-column prop="DW" label="单位" align="center" width="60"></el-table-column>
                <el-table-column prop="JJXX" label="进价" align="center" width="150">
                    <el-table-column prop="JHJ" label="进货价" align="center" width="90"></el-table-column>
                    <el-table-column prop="JHJE" label="进货金额" align="center" width="80"></el-table-column>
                </el-table-column>
                <el-table-column prop="ZKL" label="加成率" align="center" width="90"></el-table-column>
                <el-table-column prop="LSJXX" label="零售价" align="center" width="150">
                    <el-table-column prop="LSJ" label="零售价" align="center" width="90"></el-table-column>
                    <el-table-column prop="LSJE" label="零售金额" align="center" width="100"></el-table-column>
                </el-table-column>
                <el-table-column prop="CD" label="产地" align="center" width="200"></el-table-column>
                <el-table-column prop="SCRQ" label="生产日期" align="center" width="150"></el-table-column>
                <el-table-column prop="YXQ" label="有效期" align="center" width="150"></el-table-column>
                <el-table-column prop="GGKC" label="规格库存" align="center" width="90"></el-table-column>
                <el-table-column prop="PHKC" label="批号库存" align="center" width="90"></el-table-column>
                <el-table-column prop="PZWH" label="批准文号" align="center" width="150"></el-table-column>
                <el-table-column prop="HWBM" label="货位" align="center" width="130">
                    <template #default="scope">
                        <el-cascader ref="hwref" style="width: 100%" :disabled="true" v-model="scope.row.HWBM"
                            :props="defaultProps" :options="groupOptions" :show-all-levels="false" filterable
                            placeholder="请选择" class="HWBM" />
                    </template>
                </el-table-column>
                <el-table-column prop="CGFS" label="采购类型" align="center" width="120">
                    <template #default="scope">
                        <el-select v-model="scope.row.CGFS" :disabled="true" clearable style="width: 100%" placeholder=""
                            class="CGFS">
                            <el-option v-for="opt in cgfsOptions" :key="opt.value" :label="opt.label" :value="opt.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="BZQK" label="包装情况" align="center" width="120">
                    <template #default="scope">
                        <el-select v-model="scope.row.BZQK" :disabled="true" clearable style="width: 100%" placeholder=""
                            class="BZQK">
                            <el-option v-for="opt in bzqkOptions" :key="opt.value" :label="opt.label" :value="opt.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="ZLQK" label="质量情况" align="center" width="100">
                    <template #default="scope">
                        <el-select v-model="scope.row.ZLQK" :disabled="true" clearable style="width: 100%" placeholder=""
                            class="ZLQK">
                            <el-option v-for="opt in zlqkOptions" :key="opt.value" :label="opt.label" :value="opt.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="CLQK" label="处理情况" align="center" width="100">
                    <template #default="scope">
                        <el-select v-model="scope.row.CLQK" :disabled="true" clearable style="width: 100%" placeholder=""
                            class="CLQK">
                            <el-option v-for="opt in clqkOptions" :key="opt.value" :label="opt.label" :value="opt.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="YSJG" label="验收结果" align="center" width="100">
                    <template #default="scope">
                        <el-select v-model="scope.row.YSJG" :disabled="true" clearable style="width: 100%" placeholder=""
                            class="YSJG">
                            <el-option v-for="opt in ysjgOptions" :key="opt.value" :label="opt.label" :value="opt.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="CYTJ" label="储运条件" align="center" width="150"></el-table-column>
                <el-table-column prop="TMH" label="条码号" align="center" width="150"></el-table-column>
                <el-table-column prop="SCJHJ" label="上次进货价" align="center" width="100"></el-table-column>
                <el-table-column prop="JHJCE" label="本次与上次进货价差额" align="center" width="160"></el-table-column>
                <el-table-column prop="GJBM" label="国家医保编码" align="center" width="150"></el-table-column>
                <el-table-column prop="GJMC" label="国家医保名称" align="center" width="150"></el-table-column>
                <el-table-column prop="BZ" label="备注" align="center" width="150"></el-table-column>
                <template #empty>
                    <el-empty description="暂无数据" />
                </template>
            </el-table>
        </div>
        <el-form :model="formData" :inline="true" label-width="90px" ref="ruleFormRefs" :rules="rules" class="bottom-form">
            <el-form-item label="单据类型" prop="DJLX">
                <el-select v-model="formData.DJLX" placeholder="请选择单据类型" clearable style="width: 100%" :disabled="true">
                    <el-option v-for="opt in djlxOptions" :key="opt.value" :label="opt.label"
                        :value="opt.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="随货单据号">
                <el-input v-model="formData.SHDH" type="string" placeholder="请输入随货单据号" :disabled="true" />
            </el-form-item>
            <el-form-item label="交易类型" prop="JYLX">
                <el-select v-model="formData.JYLX" placeholder="请选择交易类型" clearable style="width: 100%" :disabled="true">
                    <el-option v-for="opt in jylxOptions" :key="opt.value" :label="opt.label"
                        :value="opt.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开单人" prop="KDRBM">
                <el-select v-model="formData.KDRBM" placeholder="请选择开单人" clearable style="width: 100%" :disabled="true">
                    <el-option v-for="opt in personnelIfon" :key="opt.RYBM" :label="opt.RYXM" :value="opt.RYBM"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="审核人">
                <el-select v-model="examinePeople" placeholder="" :disabled="true" clearable style="width: 100%">
                    <el-option v-for="opt in personnelIfon" :key="opt.RYBM" :label="opt.RYXM" :value="opt.RYBM"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="yd-from-footer btn-box">
            <el-button style="margin-right: 30px; padding: 0 35px" type="primary">打印</el-button>
            <el-button plain style="padding: 0 35px" @click="canleBtn">取消</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { getrylist, getxtTime, getgyslist } from '/@/api/common'
import { ElMessage } from 'element-plus'
import { getJhdInfo, getJhdList, dyDhdDetail } from '/@/api/backend/yk/jhd'
import { cxhwzd } from '/@/api/backend/jcgl/hwgl'
import { useAdminInfo } from '/@/stores/adminInfo'
import { useRouter, useRoute } from 'vue-router'
import useCurrentInstance from '/@/utils/useCurrentInstance'
import { useNavTabs } from '/@/stores/navTabs'

defineOptions({
    name: 'ykzx/jhd/detail',
})

const { proxy } = useCurrentInstance()
const navTabs = useNavTabs()
const router = useRouter()
const route = useRoute()
const ruleFormRef = ref()
const ruleFormRefs = ref()
const personnelIfon = ref([])
const adminInfo = useAdminInfo()
const gysData = ref([])
const DHDJH = ref()
let cKFBM = route.query.cKFBM
let ID = route.query.ID
let receiptType = route.query.type

const formData = reactive({
    GYSBM: '',
    CGRBM: '',
    CGYBM: '',
    KDRQ: '',
    BZ: '',
    JYLX: 0,
    DJLX: 0,
    GYSLXR: '',
    FPHM: '',
    SHRQ: '',
    KDRXM: '',
    KDRBM: '',
    SHDH: '',
    DJH: '',
})

const state: {
    ykData: any
} = reactive({
    ykData: [
        {
            PXH: 1,
            YPBM: '',
            YPMC: '',
            GG: '',
            DW: '',
            DWBZ: '',
            CPPH: '',
            SL: '',
            ZKL: '',
            JHJ: '',
            JHJE: '',
            HWBM: '',
            LSJ: '',
            LSJE: '',
            SCRQ: '',
            YXQ: '',
            CD: '',
            PZWH: '',
            CGFS: [],
            BZQK: 0,
            ZLQK: 0,
            CLQK: 0,
            YSJG: 0,
            TMH: '',
            SCJHJ: '',
            BZ: '',
            GJBM: '',
            JHJCE: '',
            GJMC: '',
            isEdit: true,
            editTxt: '确定',
        },
    ],
})

const getCureentTime = async () => {
    const res = await getxtTime()
    formData.KDRQ = res.data
    formData.KDRBM = adminInfo.rybm
}

const groupOptions = ref([])
const defaultProps = {
    checkStrictly: true,
    emitPath: false,
    multiple: false,
    label: 'HWMC',
    value: 'HWBM',
}
const getYpInfos = () => {
    cxhwzd({ agrs: { KFBM: cKFBM, YWLX: 'Tree' } }).then((r) => {
        groupOptions.value = r.data
    })
    getgyslist({ agrs: { DLBM: '2' } }).then((r) => {
        gysData.value = r.data.options
    })
}
getYpInfos()
getCureentTime()

const rules = reactive({
    GYSBM: [{ required: true, message: '供应商不能为空', trigger: 'change' }],
    CGRBM: [{ required: true, message: '采购员不能为空', trigger: 'change' }],
    KDRQ: [{ required: true, message: '开单时间不能为空', trigger: 'blur' }],
    DJLX: [{ required: true, message: '单据类型不能为空', trigger: 'change' }],
    JYLX: [{ required: true, message: '交易类型不能为空', trigger: 'change' }],
    SCRQ: [{ required: true, message: '交易类型不能为空', trigger: 'change' }],
    YXQ: [{ required: true, message: '交易类型不能为空', trigger: 'change' }],
})

// 获取 el-table
const tableref = ref(null)
const hwref = ref(null)

const examinePeople = ref()
const examineTime = ref()

// 单据类型
const djlxOptions = [
    { value: 0, label: '普通' },
    { value: 1, label: '采购计划生成' },
    { value: 2, label: '阳关采购平台对接' },
]
// 交易类型
const jylxOptions = [
    { value: 0, label: '手工输入' },
    { value: 1, label: '系统生成' },
    { value: 2, label: '外部导入' },
]
// 采购方式
const cgfsOptions = [
    { value: 0, label: '招标' },
    { value: 1, label: '议标' },
    { value: 2, label: '评标' },
    { value: 3, label: '实价' },
    { value: 4, label: '批价' },
    { value: 5, label: '自制' },
    { value: 6, label: '扣前' },
    { value: 7, label: '扣后' },
]

// 包装情况
const bzqkOptions = [
    { value: 0, label: '包装完好' },
    { value: 1, label: '包装破损' },
    { value: 2, label: '包装损坏' },
]
// 质量情况
const zlqkOptions = [
    { value: 0, label: '合格' },
    { value: 1, label: '不合格' },
]
// 处理情况
const clqkOptions = [
    { value: 0, label: '入库' },
    { value: 1, label: '退库' },
]

// 验收情况
const ysjgOptions = [
    { value: 0, label: '合格' },
    { value: 1, label: '不合格' },
]

const toLastTab = () => {
    const lastTab = navTabs.state.tabsView.slice(-1)[0]
    if (lastTab) {
        lastTab.query.KFBM = cKFBM
        router.push(lastTab)
    } else {
        router.push('/admin')
    }
}

const canleBtn = () => {
    navTabs.closeTab(route)
    proxy.eventBus.emit('onTabViewClose', route)
    if (navTabs.state.activeRoute?.path === route.path) {
        toLastTab()
    } else {
        navTabs.setActiveRoute(navTabs.state.activeRoute!)
    }
}

const getlook = async () => {
    const res = await getJhdInfo({
        agrs: {
            DJID: route.query.DJID,
            cKFBM: route.query.cKFBM,
            DJH: route.query.DJH,
        },
    })
    const r = await getJhdList({
        agrs: {
            ID,
        },
    })
    state.ykData = res.data
    state.ykData.forEach((item) => {
        item.isEdit = true
        item.editTxt = '确认'
    })
    formData.KDRQ = r.data[0].KDRQ
    formData.DJH = r.data[0].DJH
    formData.GYSBM = r.data[0].GYSBM
    formData.GYSLXR = r.data[0].GYSLXR
    formData.CGRBM = r.data[0].CGRBM
    formData.CGYBM = r.data[0].CGYBM
    formData.SHDH = r.data[0].SHDH
    formData.BZ = r.data[0].BZ
    formData.DJLX = r.data[0].DJLX
    formData.JYLX = r.data[0].JYLX
    formData.KDRBM = r.data[0].KDRBM
    formData.FPHM = r.data[0].FPHM
    examineTime.value = r.data[0].SHRQ
    examinePeople.value = r.data[0].SHRBM
}
const receiptgenerate = async () => {
    let data = {
        agrs: {
            DJLX: '订货单',
            DJID: route.query.DJID,
            KFBM: route.query.cKFBM,
            DJH: route.query.DJH,
            YWLX: receiptType == 'generate' ? 1 : 2,
            ListID: receiptType == 'allGenerate' ? JSON.parse(route.query.ListID) : [],
        },
    }
    const res = await dyDhdDetail(data)

    if (res.code === 1) {
        if (res.data.data.length !== 0) {
            state.ykData = res.data.data
            DHDJH.value = res.data.DJH
            state.ykData.forEach((item) => {
                item.isEdit = true
                item.editTxt = '确认'
                item.BZQK = 0
                item.ZLQK = 0
                item.CLQK = 0
                item.YSJG = 0
            })
        }
    } else {
        ElMessage.error('操作失败，稍后再试')
    }
}

onMounted(() => {
    receiptType = route.query.type
    if (receiptType != 'create' && receiptType != 'generate' && receiptType != 'allGenerate') {
        getlook()
    } else if (receiptType == 'generate' || receiptType == 'allGenerate') {
        receiptgenerate()
    }
    // 获取人员信息
    getrylist({ agrs: {} }).then((r) => {
        personnelIfon.value = r.data.options
    })
})
</script>

<style lang="scss" scoped>
:deep(.el-table .cell) {
    padding: 0;
}

:deep(.el-form-item__error) {
    display: none;
}

:deep(.el-table thead) {
    color: #000;
}

:deep(.el-form--inline .el-form-item) {
    margin-right: 5px;
    margin-bottom: 5px;
}

.el-dialog__header :deep(.el-dialog__headerbtn) {
    size: 14px;
}

:deep(.el-table__header) {
    line-height: 40px;
}

.el-table :deep(.el-table__cell) {
    padding: 5px 5px;
    font-size: 14px;
}

.none-input :deep(.el-input__wrapper) {
    box-shadow: none;
    background: transparent;
}

.none-input :deep(.el-input__inner) {
    text-align: center;
}

:deep(.el-dialog) {
    margin-top: 80px;
}

.specs_frame :deep(.el-input__inner) {
    width: 525px;
}

.layout-box {
    height: calc(100vh - 100px);
    background-color: #fff;
    margin: 10px 6px;
    padding-top: 10px;

    .form-top {
        height: 80px;
        max-height: 80px;
        width: 100%;
        .el-form {
            min-width: 1300px;
        }
        .el-form-item :deep(.el-form-item__content) {
            width: 220px;
        }
    }

    .btn-box {
        margin-top: 10px;
    }

    .color-table {
        border: solid 1px #ebebeb;
    }

    .yd-card-body {
        padding: 5px 10px;
    }

    .bottom-form {
        margin-top: 6px;
        min-width: 1300px;
        :deep(.el-input) {
            width: 160px;
        }
    }
}
</style>
