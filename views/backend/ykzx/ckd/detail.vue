<template>
    <div class="layout-box">
        <div class="form-top">
            <el-scrollbar>
                <el-form :model="formData" :inline="true" label-width="100px" ref="ruleFormRef" :rules="rules">
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

                    <el-form-item label="请领部门" prop="KSBM">
                        <el-select filterable v-model="formData.KSBM" placeholder="请选择" :disabled="true" clearable
                            style="width: 100%">
                            <el-option v-for="opt in ykyfData" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="QLR" label="请领人">
                        <el-input v-model="formData.QLR" type="string" :disabled="true" placeholder="请输入申请人" />
                    </el-form-item>
                    <el-form-item label="批准人">
                        <el-select v-model="formData.PZRBM" placeholder="请选择" :disabled="true" clearable
                            style="width: 100%">
                            <el-option v-for="opt in personnelIfon" :key="opt.RYBM" :label="opt.RYXM"
                                :value="opt.RYBM"></el-option>
                        </el-select>
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
                <el-table-column prop="PXH" label="行号" align="center" :width="65" class-name="custom-header"></el-table-column>
                <el-table-column prop="YPXX" label="药品" align="center" width="150">
                    <el-table-column prop="YPBM" label="编码" align="center" width="120"></el-table-column>
                    <el-table-column prop="YPMC" label="品名" align="center" width="170"></el-table-column>
                    <el-table-column prop="GG" label="规格" align="center" width="150"></el-table-column>
                </el-table-column>
                <el-table-column prop="DWBZ" label="包装" align="center" width="60"></el-table-column>
                <el-table-column prop="CPPH" label="产品批号" align="center" width="150"
                    v-if="JHDJHs != undefined || receiptType == 'order' || receiptType == 'create'">
                    <template #default="{ row }">
                        {{ row.CPPH }}
                    </template>
                </el-table-column>
                <el-table-column prop="QLSL" label="请领数量" align="center" width="80"
                    v-if="QLDJH != undefined || receiptType == 'qldOrder'">
                    <template #default="{ row }">
                        {{ row.QLSL }}
                    </template>
                </el-table-column>
                <el-table-column prop="GGKC" label="规格库存" align="center" width="80"
                    v-if="QLDJH != undefined || receiptType == 'qldOrder'">
                    <template #default="{ row }">
                        {{ row.GGKC }}
                    </template>
                </el-table-column>
                <el-table-column prop="PCKC" label="批次库存" align="center" width="80"
                    v-if="JHDJHs != undefined || receiptType == 'order' || receiptType == 'create'">
                    <template #default="{ row }">
                        {{ row.PCKC }}
                    </template>
                </el-table-column>
                <el-table-column prop="FYSL" label="库房数量" align="center" width="100"></el-table-column>
                <el-table-column prop="DW" label="单位" align="center" width="60"></el-table-column>
                <el-table-column prop="JBDWSL" label="基本单位数量" align="center" width="100"></el-table-column>
                <el-table-column prop="JBDW" label="基本单位" align="center" width="70"></el-table-column>
                <el-table-column prop="JJXX" label="进价" align="center" width="150">
                    <el-table-column prop="JHJ" label="进货价" align="center" width="90"></el-table-column>
                    <el-table-column prop="JHJE" label="进货金额" align="center" width="80"></el-table-column>
                </el-table-column>
                <el-table-column prop="LSJXX" label="零售价" align="center" width="150">
                    <el-table-column prop="LSJ" label="零售价" align="center" width="90"></el-table-column>
                    <el-table-column prop="LSJE" label="零售金额" align="center" width="100"></el-table-column>
                </el-table-column>
                <el-table-column prop="CD" label="产地" align="center" width="200"></el-table-column>
                <el-table-column prop="SCRQ" label="生产日期" align="center" width="150"></el-table-column>
                <el-table-column prop="YXQ" label="有效期" align="center" width="150"></el-table-column>
                <el-table-column prop="PZWH" label="批准文号" align="center" width="150"></el-table-column>
                <el-table-column prop="HWMC" label="货位" align="center" width="130"></el-table-column>
                <el-table-column prop="TMH" label="条码号" align="center" width="150"></el-table-column>
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
                <el-select v-model="formData.DJLX" placeholder="请选择单据类型"
                    :disabled="true" clearable style="width: 100%">
                    <el-option v-for="opt in djlxOptions" :key="opt.value" :label="opt.label"
                        :value="opt.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="发货人" prop="FHRBM">
                <el-select v-model="formData.FHRBM" placeholder="请选择发货人"
                    :disabled="true" clearable style="width: 100%">
                    <el-option v-for="opt in personnelIfon" :key="opt.RYBM" :label="opt.RYXM" :value="opt.RYBM"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="交易类型" prop="JYLX">
                <el-select v-model="formData.JYLX" placeholder="请选择交易类型"
                    :disabled="true" clearable style="width: 100%">
                    <el-option v-for="opt in jylxOptions" :key="opt.value" :label="opt.label"
                        :value="opt.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开单人">
                <el-select v-model="formData.KDRBM" placeholder="请选择开单人"
                    :disabled="true" clearable style="width: 100%">
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
import { getrylist, getxtTime } from '/@/api/common'
import { ElMessage } from 'element-plus'
import { ykChdMx, getChdList, cxYfYk, dyJhdMx } from '/@/api/backend/yk/chd'
import { useAdminInfo } from '/@/stores/adminInfo'
import { useRouter, useRoute } from 'vue-router'
import useCurrentInstance from '/@/utils/useCurrentInstance'
import { useNavTabs } from '/@/stores/navTabs'

defineOptions({
    name: 'ykzx/ckd/detail',
})

const { proxy } = useCurrentInstance()
const navTabs = useNavTabs()
const router = useRouter()
const route = useRoute()
const ykyfData = ref([])
const ruleFormRef = ref()
const ruleFormRefs = ref()
const personnelIfon = ref([])
const adminInfo = useAdminInfo()
const examinePeople = ref()
const examineTime = ref()
const JHDJH = ref()
const QLKSBM = ref()
let cKFBM = route.query.cKFBM
let KFBM = route.query.KFBM
let ID = route.query.ID
let receiptType = route.query.type
let receiptDjlx = route.query.allType
let QLDJH = route.query.QLDJH
let JHDJHs = route.query.JHDJH

const formData = reactive({
    KDRQ: '',
    BZ: '',
    JYLX: 0,
    DJLX: 0,
    SHRQ: '',
    KDRXM: '',
    KDRBM: '',
    SHDH: '',
    DJH: '',
    QLR: '',
    PZRBM: '',
    KSBM: '',
    FHRBM: '',
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
            HWBM: '',
            ZKL: '',
            JHJ: '',
            JHJE: '',
            FYSL: '',
            JBWD: '',
            LSJ: '',
            LSJE: '',
            QLSL: '',
            SCRQ: '',
            YXQ: '',
            CD: '',
            PZWH: '',
            TMH: '',
            SCJHJ: '',
            BZ: '',
            GJBM: '',
            GJMC: '',
            isEdit: true,
            editTxt: '确定',
        },
    ],
})

const tableref = ref(null)

const getCureentTime = async () => {
    const res = await getxtTime()
    formData.KDRQ = res.data
    formData.KDRBM = adminInfo.rybm
}

const toLastTab = () => {
    const lastTab = navTabs.state.tabsView.slice(-1)[0]
    if (lastTab) {
        lastTab.query.KFBM = KFBM
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

getCureentTime()


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

const rules = reactive({
    KSBM: [{ required: true, message: '请领部门不能为空', trigger: 'blur' }],
    FHRBM: [{ required: true, message: '收货人不能为空', trigger: 'blur' }],
    KDRQ: [{ required: true, message: '开单时间不能为空', trigger: 'blur' }],
    QLR: [{ required: true, message: '请领人不能为空', trigger: 'blur' }],
    DJLX: [{ required: true, message: '单据类型不能为空', trigger: 'change' }],
    JYLX: [{ required: true, message: '交易类型不能为空', trigger: 'change' }],
})

const getlook = async () => {
    const res = await ykChdMx({
        agrs: {
            DJID: route.query.DJID,
            KFBM: route.query.KFBM,
            DJH: route.query.DJH,
        },
    })
    const r = await getChdList({
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
    formData.SHDH = r.data[0].SHDH
    formData.BZ = r.data[0].BZ
    formData.DJLX = r.data[0].DJLX
    formData.JYLX = r.data[0].JYLX
    formData.PZRBM = r.data[0].PZRBM
    formData.KSBM = r.data[0].KSBM
    formData.FHRBM = r.data[0].FHRBM
    formData.QLR = r.data[0].QLR
    formData.KDRBM = r.data[0].KDRBM
    examineTime.value = r.data[0].SHRQ
    examinePeople.value = r.data[0].SHRBM
}

const receiptgenerate = async () => {
    let data = {
        agrs: {
            DJLX: receiptType === 'order' ? '进货单' : '请领单',
            DJID: route.query.DJID,
            KFBM: route.query.cKFBM,
            DJH: route.query.DJH,
            YWLX: receiptDjlx === 'one' ? 1 : 2,
            ListID: receiptDjlx === 'two' ? JSON.parse(route.query.ListID) : [],
        },
    }
    const res = await dyJhdMx(data)
    if (res.code === 1) {
        if (res.data.data.length !== 0) {
            state.ykData = res.data.data
            JHDJH.value = res.data.DJH
            QLKSBM.value = res.data.QLKSBM
            state.ykData.forEach((item) => {
                item.isEdit = true
                item.editTxt = '确认'
            })
        }
    } else {
        ElMessage.error('操作失败，稍后再试')
    }
}

onMounted(() => {
    receiptType = route.query.type
    if (receiptType != 'create' && receiptType != 'order' && receiptType != 'qldOrder') {
        getlook()
    } else if (receiptType == 'order' || receiptType == 'qldOrder') {
        receiptgenerate()
    }
    // 获取人员信息
    getrylist({ agrs: {} }).then((r) => {
        personnelIfon.value = r.data.options
    })
    // 获取库房
    cxYfYk({ agrs: 2 }).then((r) => {
        ykyfData.value = r.data
    })
})
</script>

<style lang="scss" scoped>
:deep(.el-table__inner-wrapper::before) {
    content: none;
}

:deep(.bottom-row) {
    color: #409eff;
}

.jbdw-class :deep(.el-input__inner) {
    text-align: center;
}

.fysl-class :deep(.el-input__inner) {
    text-align: center;
}

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
        overflow-x: auto;
        .el-form {
            min-width: 1300px;
        }
        .el-form-item :deep(.el-form-item__content) {
            width: 220px;
        }
    }

    .btn-box {
        margin-top: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
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
