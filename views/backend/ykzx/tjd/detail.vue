<template>
    <div class="layout-box">
        <div class="form-top">
            <el-scrollbar class="ba-table-form-scrollbar">
                <el-form :model="formData" :inline="true" label-width="100px" ref="ruleFormRef" :rules="rules">
                    <el-form-item prop="KDRQ" label="开单时间">
                        <el-date-picker
                            v-model="formData.KDRQ"
                            type="datetime"
                            placeholder="请选择开单时间"
                            :disabled="true"
                            style="width: 100%"
                        />
                    </el-form-item>
                    <el-form-item prop="SHRQ" label="审核时间">
                        <el-date-picker v-model="examineTime" type="datetime" :disabled="true" placeholder="审核后生成" style="width: 100%" />
                    </el-form-item>
                    <el-form-item label="单据号">
                        <el-input v-model="formData.DJH" type="string" :disabled="true" placeholder="请输入单据号" />
                    </el-form-item>
                    <el-form-item prop="CGYBM" label="仓管员">
                        <el-select
                            v-model="formData.CGYBM"
                            placeholder="请选择仓管员"
                            :disabled="true"
                            clearable
                            style="width: 100%"
                        >
                            <el-option v-for="opt in personnelIfon" :key="opt.RYBM" :label="opt.RYXM" :value="opt.RYBM"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="ZXSJ" label="执行时间">
                        <el-date-picker
                            v-model="formData.ZXSJ"
                            type="datetime"
                            placeholder="请选择执行时间"
                            :disabled="true"
                            style="width: 100%"
                        />
                    </el-form-item>
                    <el-form-item prop="PZRBM" label="批准人">
                        <el-select
                            v-model="formData.PZRBM"
                            placeholder="请选择批准人"
                            clearable
                            style="width: 100%"
                            :disabled="true"
                        >
                            <el-option v-for="opt in personnelIfon" :key="opt.RYBM" :label="opt.RYXM" :value="opt.RYBM"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input
                            v-model="formData.BZ"
                            type="string"
                            placeholder="请输入备注信息"
                            class="specs_frame"
                            :disabled="true"
                        />
                    </el-form-item>
                </el-form>
            </el-scrollbar>
        </div>
        <div class="yd-card-body">
                <el-table
                    ref="tableref"
                    :data="state.ykData"
                    class="color-table"
                    :header-cell-style="{ borderColor: '#e0e0e0' }"
                    :cell-style="{ borderColor: '#e0e0e0' }"
                    height="calc(100vh - 300px)"
                >
                    <el-table-column prop="PXH" label="行号" align="center" :width="65" class-name="custom-header"></el-table-column>
                    <el-table-column prop="YPXX" label="药品" align="center" width="150">
                        <el-table-column prop="YPBM" label="编码" align="center" width="120"></el-table-column>
                        <el-table-column prop="YPMC" label="品名" align="center" width="170"></el-table-column>
                        <el-table-column prop="GG" label="规格" align="center" width="150"></el-table-column>
                    </el-table-column>
                    <el-table-column prop="DWBZ" label="包装" align="center" width="70"></el-table-column>
                    <el-table-column prop="CPPH" label="产品批号" align="center" width="120"></el-table-column>
                    <el-table-column prop="DW" label="单位" align="center" width="60"></el-table-column>
                    <el-table-column label="原价" align="center" width="150">
                        <el-table-column prop="YJHJ" label="进货价" align="center" width="80"></el-table-column>
                        <el-table-column prop="YLSJ" label="零售价" align="center" width="80"></el-table-column>
                    </el-table-column>
                    <el-table-column prop="TJL" label="调价率" align="center" width="80"></el-table-column>
                    <el-table-column label="新价" align="center" width="150">
                        <el-table-column prop="XJHJ" label="进货价" align="center" width="80"></el-table-column>
                        <el-table-column prop="XLSJ" label="零售价" align="center" width="80"></el-table-column>
                    </el-table-column>
                    <el-table-column prop="YKKCSL" label="药库库存数量" align="center" width="100"></el-table-column>
                    <el-table-column prop="YKTJCE" label="药库调价差额" align="center" width="100"></el-table-column>
                    <el-table-column prop="YFKCSL" label="药房库存数量" align="center" width="100"></el-table-column>
                    <el-table-column prop="YFTJCE" label="药房调价差额" align="center" width="100"></el-table-column>
                    <el-table-column prop="KCID" label="库存ID" align="center" width="70"></el-table-column>
                    <el-table-column prop="CD" label="产地" align="center" width="200"></el-table-column>
                    <el-table-column prop="SCRQ" label="生产日期" align="center" width="150"></el-table-column>
                    <el-table-column prop="YXQ" label="有效期" align="center" width="150"></el-table-column>
                    <el-table-column prop="PZWH" label="批准文号" align="center" width="150"></el-table-column>
                    <el-table-column prop="HWMC" label="货位" align="center" width="130"></el-table-column>
                    <el-table-column prop="GJBM" label="国家医保编码" align="center" width="150"></el-table-column>
                    <el-table-column prop="GJMC" label="国家医保名称" align="center" width="150"></el-table-column>
                    <el-table-column prop="BZ" label="备注" align="center" width="150"></el-table-column>
                    <template #empty>
                        <el-empty description="暂无数据" />
                    </template>
                </el-table>
            </div>
        <el-form :model="formData" :inline="true" label-width="90px" ref="ruleFormRef1" :rules="rules" class="bottom-form">
            <el-form-item label="单据类型" prop="DJLX">
                <el-select
                    v-model="formData.DJLX"
                    placeholder="请选择单据类型"
                    clearable
                    style="width: 100%"
                    :disabled="true"
                >
                    <el-option v-for="opt in djlxOptions" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="交易类型" prop="JYLX">
                <el-select
                    v-model="formData.JYLX"
                    placeholder="请选择交易类型"
                    clearable
                    style="width: 100%"
                    :disabled="true"
                >
                    <el-option v-for="opt in jylxOptions" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开单人" prop="KDRBM">
                <el-select
                    v-model="formData.KDRBM"
                    placeholder="请选择开单人"
                    clearable
                    style="width: 100%"
                    :disabled="true"
                >
                    <el-option v-for="opt in personnelIfon" :key="opt.RYBM" :label="opt.RYXM" :value="opt.RYBM"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="审核人">
                <el-select v-model="examinePeople" placeholder="审核后生成" :disabled="true" clearable style="width: 100%">
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
import { getTjdMx, getTjdList } from '/@/api/backend/yk/tjd'
import useCurrentInstance from '/@/utils/useCurrentInstance'
import { useNavTabs } from '/@/stores/navTabs'
import { useAdminInfo } from '/@/stores/adminInfo'
import { useRouter, useRoute } from 'vue-router'

defineOptions({
    name: 'ykzx/tjd/detail',
})

const { proxy } = useCurrentInstance()
const navTabs = useNavTabs()
const ruleFormRef = ref()
const ruleFormRef1 = ref()
const personnelIfon = ref([])
const adminInfo = useAdminInfo()
const router = useRouter()
const route = useRoute()
const examinePeople = ref()
const examineTime = ref()

let cKFBM = route.query.cKFBM
let ID = route.query.ID
let receiptType = route.query.type

const formData = reactive({
    KDRQ: '',
    BZ: '',
    JYLX: 0,
    DJLX: 0,
    SHRQ: '',
    KDRBM: '',
    DJH: '',
    CGYBM: '',
    ZXSJ: '',
    PZRBM: '',
    SHRBM: '',
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
            TJL: 0,
            YJHJ: '',
            YLSJ: '',
            XJHJ: '',
            XLSJ: '',
            YKKCSL: '',
            YKTJCE: '',
            YFKCSL: '',
            YFTJCE: '',
            SCRQ: '',
            YXQ: '',
            CD: '',
            PZWH: '',
            BZ: '',
            GJBM: '',
            GJMC: '',
            isEdit: true,
            editTxt: '确定',
        },
    ],
})

const tableref = ref(null)

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

getCureentTime()

const rules = reactive({
    ZXSJ: [{ required: true, message: '执行时间不能为空', trigger: 'blur' }],
    KDRQ: [{ required: true, message: '开单时间不能为空', trigger: 'blur' }],
    KDRBM: [{ required: true, message: '开单人姓名不能为空', trigger: 'blur' }],
    DJLX: [{ required: true, message: '单据类型不能为空', trigger: 'change' }],
    JYLX: [{ required: true, message: '交易类型不能为空', trigger: 'change' }],
})

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

const getlook = async () => {
    const res = await getTjdMx({
        agrs: {
            DJID: route.query.DJID,
            KFBM: route.query.cKFBM,
            DJH: route.query.DJH,
        },
    })
    const r = await getTjdList({
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
    formData.CGYBM = r.data[0].CGYBM
    formData.ZXSJ = r.data[0].ZXSJ
    formData.PZRBM = r.data[0].PZRBM
    formData.BZ = r.data[0].BZ
    formData.DJLX = r.data[0].DJLX
    formData.JYLX = r.data[0].JYLX
    formData.KDRBM = r.data[0].KDRBM
    examineTime.value = r.data[0].SHRQ
    examinePeople.value = r.data[0].SHRBM
}

onMounted(() => {
    receiptType = route.query.type
    if (receiptType != 'create') {
        getlook()
    }
    // 获取人员信息
    getrylist({ agrs: {} }).then((r) => {
        personnelIfon.value = r.data.options
    })
})
</script>

<style lang="scss" scoped>
:deep(.bottom-row) {
    color: #409eff;
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
    .color-table {
        border: solid 1px #ebebeb;
    }
    .yd-card-body {
        padding: 5px 10px;
    }
    .bottom-form {
        margin-top: 6px;
        min-width: 1300px;
    }
}
</style>
