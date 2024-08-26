<template>
    <div class="layout-box">
        <div class="form-top">
            <el-scrollbar>
                <el-form :model="formData" :inline="true" :rules="rules" label-width="100px" ref="ruleFormRef">
                    <el-form-item prop="KDRQ" label="开单日期">
                        <el-date-picker
                            v-model="formData.KDRQ"
                            type="datetime"
                            :disabled="true"
                            placeholder="请选择开单日期"
                            style="width: 100%"
                        />
                    </el-form-item>
                    <el-form-item prop="SHRQ" label="审核日期">
                        <el-date-picker v-model="examineTime" type="datetime" :disabled="true" placeholder="审核日期" style="width: 100%" />
                    </el-form-item>
                    <el-form-item label="单据号">
                        <el-input v-model="formData.DJH" type="string" :disabled="true" placeholder="请输入单据号" />
                    </el-form-item>
                    <el-form-item label="供应商" prop="GYSBM">
                        <el-select
                            filterable
                            v-model="formData.GYSBM"
                            placeholder="请选择供应商"
                            :disabled="true"
                            clearable
                            style="width: 100%"
                        >
                            <el-option v-for="opt in gysData" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="CGRBM" label="采购员">
                        <el-select
                            v-model="formData.CGRBM"
                            placeholder="请选择"
                            :disabled="true"
                            clearable
                            style="width: 100%"
                        >
                            <el-option v-for="opt in personnelIfon" :key="opt.RYBM" :label="opt.RYXM" :value="opt.RYBM"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="批准人">
                        <el-select
                            v-model="formData.PZRBM"
                            placeholder="请选择"
                            :disabled="true"
                            clearable
                            style="width: 100%"
                        >
                            <el-option v-for="opt in personnelIfon" :key="opt.RYBM" :label="opt.RYXM" :value="opt.RYBM"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="备注">
                        <el-input
                            v-model="formData.BZ"
                            type="string"
                            :disabled="true"
                            placeholder="请输入"
                            class="specs_frame"
                        />
                    </el-form-item>
                </el-form>
            </el-scrollbar>
        </div>
        <div class="yd-card-body">
            <el-table
                ref="tableref"
                :data="state.ykData"
                stripe
                style="width: 100%"
                class="color-table"
                :header-cell-style="{ borderColor: '#e0e0e0' }"
                :cell-style="{ borderColor: '#e0e0e0' }"
                height="calc(100vh - 300px)"
            >
                <el-table-column prop="PXH" label="行号" align="center" width="65"></el-table-column>
                <el-table-column prop="YPBM" label="编码" align="center" width="120"></el-table-column>
                <el-table-column prop="YPXX" label="药品" align="center" width="150">
                    <el-table-column prop="YPMC" label="品名" align="center" width="170"></el-table-column>
                    <el-table-column prop="GG" label="规格" align="center" width="150"></el-table-column>
                </el-table-column>
                <el-table-column prop="DW" label="单位" align="center" width="60"></el-table-column>
                <el-table-column prop="SL" label="数量" align="center" width="80">
                </el-table-column>
                <el-table-column prop="jinjia" label="进价" align="center" width="150">
                    <el-table-column prop="JHJ" label="进货价" align="center" width="90">
                    </el-table-column>
                    <el-table-column prop="JHJE" label="进货金额" align="center" width="80">
                    </el-table-column>
                </el-table-column>
                <el-table-column prop="ZKL" label="加成率" align="center" width="90">
                </el-table-column>
                <el-table-column prop="LSJXX" label="零售价" align="center" width="150">
                    <el-table-column prop="LSJ" label="零售价" align="center" width="90"></el-table-column>
                    <el-table-column prop="LSJE" label="零售金额" align="center" width="100"></el-table-column>
                </el-table-column>
                <el-table-column prop="CD" label="产地" align="center" width="200"></el-table-column>
                <el-table-column prop="PZWH" label="批准文号" align="center" width="170"></el-table-column>
                <el-table-column prop="BZ" label="备注" align="center" width="210"></el-table-column>
                <template #empty>
                    <el-empty description="暂无数据" />
                </template>
            </el-table>
        </div>
        <el-form :model="formData" :inline="true" label-width="90px" ref="ruleFormRefs" :rules="rules" class="bottom-form">
            <el-form-item label="单据类型" prop="DJLX">
                <el-select
                    v-model="formData.DJLX"
                    placeholder="请选择单据类型"
                    :disabled="true"
                    clearable
                    style="width: 100%"
                >
                    <el-option v-for="opt in djlxOptions" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="计划类型" prop="JHLX">
                <el-select
                    v-model="formData.JHLX"
                    placeholder="请选择计划类型"
                    :disabled="true"
                    clearable
                    style="width: 100%"
                >
                    <el-option v-for="opt in jhlxOptions" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="交易类型" prop="JYLX">
                <el-select
                    v-model="formData.JYLX"
                    placeholder="请选择交易类型"
                    :disabled="true"
                    clearable
                    style="width: 100%"
                >
                    <el-option v-for="opt in jylxOptions" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开单人">
                <el-select
                    v-model="formData.KDRBM"
                    placeholder="请选择开单人"
                    :disabled="true"
                    clearable
                    style="width: 100%"
                >
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
import { getgyslist, getrylist, getxtTime } from '/@/api/common'
import { useAdminInfo } from '/@/stores/adminInfo'
import { dhdmx, getdhd, getywcl } from '/@/api/backend/jcgl/dhd'
import { useRouter, useRoute } from 'vue-router'
import useCurrentInstance from '/@/utils/useCurrentInstance'
import { useNavTabs } from '/@/stores/navTabs'

defineOptions({
    name: 'ykzx/dhd/detail',
})

const { proxy } = useCurrentInstance()
const navTabs = useNavTabs()
const router = useRouter()
const route = useRoute()
const adminInfo = useAdminInfo()
const ruleFormRef = ref()
const ruleFormRefs = ref()
const personnelIfon = ref([])
const gysData = ref([])
const examinePeople = ref()
const examineTime = ref()

let cKFBM = route.query.cKFBM
let ID = route.query.ID
let receiptType = route.query.type
let modeRadio = route.query.modeRadio
let GYS = route.query.GYS

const formData = reactive({
    GYSBM: '',
    CGRBM: '',
    PZRBM: '',
    KDRQ: '',
    BZ: '',
    DJLX: 0,
    JYLX: 0,
    JHLX: 0,
    KDRBM: '',
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
            SL: '',
            ZKL: '',
            JHJ: '',
            JHJE: '',
            LSJ: '',
            LSJE: '',
            CD: '',
            PZWH: '',
            BZ: '',
            isEdit: true,
            editTxt: '确定',
        },
    ],
})

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

const getCureentTime = async () => {
    const res = await getxtTime()
    formData.KDRQ = res.data
    formData.KDRBM = adminInfo.rybm
}

const getYpInfos = () => {
    getgyslist({ agrs: { DLBM: '2' } }).then((r) => {
        gysData.value = r.data.options
    })
}
getYpInfos()
getCureentTime()

// 获取 el-table
const tableref = ref(null)

const rules = reactive({
    GYSBM: [{ required: true, message: '供应商不能为空', trigger: 'change' }],
    KDRQ: [{ required: true, message: '开单时间不能为空', trigger: 'blur' }],
    DJLX: [{ required: true, message: '单据类型不能为空', trigger: 'change' }],
    JYLX: [{ required: true, message: '交易类型不能为空', trigger: 'change' }],
    JHLX: [{ required: true, message: '计划类型不能为空', trigger: 'change' }],
    CGRBM: [{ required: true, message: '采购人不能为空', trigger: 'change' }],
})

// 单据类型
const djlxOptions = [
    { value: 0, label: '普通' },
    { value: 1, label: '采购计划生成' },
    { value: 2, label: '阳关采购平台对接' },
]
// 计划类型
const jhlxOptions = [
    { value: 0, label: '周计划' },
    { value: 1, label: '月度计划' },
    { value: 2, label: '季度计划' },
    { value: 3, label: '年度计划' },
]
// 交易类型
const jylxOptions = [
    { value: 0, label: '手工输入' },
    { value: 1, label: '系统生成' },
    { value: 2, label: '外部导入' },
]

const getlook = async () => {
    const res = await dhdmx({
        agrs: {
            DJID: route.query.DJID,
            cKFBM: route.query.cKFBM,
            DJH: route.query.DJH,
        },
    })
    const r = await getdhd({
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
    formData.CGRBM = r.data[0].CGRBM
    formData.BZ = r.data[0].BZ
    formData.DJLX = r.data[0].DJLX
    formData.JHLX = r.data[0].JHLX
    formData.JYLX = r.data[0].JYLX
    formData.KDRBM = r.data[0].KDRBM
    formData.GYSBM = r.data[0].GYSBM
    formData.PZRBM = r.data[0].PZRBM
    examineTime.value = r.data[0].SHRQ
    examinePeople.value = r.data[0].SHRBM
}

const rulesGenerate = async () => {
    modeRadio = route.query.modeRadio

    const handleReceipt = async (data) => {
        const res = await getywcl(data)
        if (res.code === 1 && res.data.length != 0) {
            state.ykData = res.data
            state.ykData.forEach((item) => {
                item.isEdit = true
                item.editTxt = '确认'
            })
        }
    }

    switch (Number(modeRadio)) {
        case 3:
            formData.GYSBM = String(GYS)
            break
        case 6:
        case 9:
            const data1 = {
                agrs: {
                    YWLX: Number(modeRadio) == 6 ? '下限' : '上限',
                    KFBM: route.query.cKFBM,
                    TIME: route.query.TIME,
                },
            }
            try {
                await handleReceipt(data1)
            } catch (error) {}
            break
        case 10:
        case 11:
            const data2 = {
                agrs: {
                    YWLX: Number(modeRadio) == 10 ? '库存消耗总量' : '仓库出库总量',
                    KFBM: route.query.cKFBM,
                    TIME: route.query.TIME,
                },
            }
            try {
                await handleReceipt(data2)
            } catch (error) {}
            break
        default:
            break
    }
    formData.GYSBM = String(GYS)
}

onMounted(() => {
    receiptType = route.query.type
    if (receiptType != 'create') {
        getlook()
    } else if (receiptType == 'create') {
        rulesGenerate()
    }
    // 获取人员信息
    getrylist({ agrs: {} }).then((r) => {
        personnelIfon.value = r.data.options
    })
})
</script>

<style lang="scss" scoped>
:deep(.el-dialog__title) {
    color: #fff;
}
:deep(.el-form-item__error) {
    display: none;
}
:deep(.el-table thead) {
    color: #000;
}
:deep(.el-table .cell) {
    padding: 0;
}
:deep(.el-dialog__header) {
    color: rgba(255, 255, 255, 1);
    font-size: 14px;
    padding: 10px;
    text-align: center;
    background: #4499f9;
    margin-right: 0;
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
    }
    .search-box {
        margin: 20px 0 10px;
        .zw-table-search {
            background: #f9f9f9;
            border: 1px solid #eaeaea;
            margin-bottom: 18px;
            box-sizing: border-box;
            padding: 10px 10px 0;
            :deep(.el-form-item) {
                margin-bottom: 10px;

                .el-select {
                    width: 100%;
                }
            }
        }
        .chat_form {
            .el-col {
                &:last-child {
                    text-align: right;
                }
            }
        }
    }
    .ss-pagination {
        margin-top: 30px;
        display: flex;
        justify-content: flex-end;
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
