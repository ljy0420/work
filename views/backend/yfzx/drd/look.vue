<template>
    <div class="layout-box">
        <div class="form-top">
            <el-scrollbar>
                <el-form :model="formData" :inline="true" label-width="100px">
                    <el-form-item prop="KDRQ" label="开单时间">
                        <el-date-picker v-model="formData.KDRQ" type="datetime" :disabled="true" placeholder="请选择开单日期" style="width: 100%" />
                    </el-form-item>
                    <el-form-item prop="SHRQ" label="审核时间">
                        <el-date-picker v-model="formData.SHRQ" type="datetime" :disabled="true" placeholder="请选择审核日期" style="width: 100%" />
                    </el-form-item>
                    <el-form-item label="单据号">
                        <el-input v-model="formData.DJH" type="string" :disabled="true" placeholder="请输入单据号" />
                    </el-form-item>
                    <el-form-item label="批准人">
                        <el-select v-model="formData.PZRBM" placeholder="请选择" :disabled="true" clearable style="width: 100%">
                            <el-option v-for="opt in personnelIfon" :key="opt.RYBM" :label="opt.RYXM" :value="opt.RYBM"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="调出药房" prop="JSYFBM">
                        <el-select filterable v-model="formData.LYYFBM" placeholder="请选择" :disabled="true" style="width: 100%">
                            <el-option v-for="opt in ykyfData" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="SQR" label="申请人">
                        <el-select v-model="formData.SQR" placeholder="请选择申请人" clearable style="width: 100%" :disabled="true">
                            <el-option v-for="opt in personnelIfon" :key="opt.RYBM" :label="opt.RYXM" :value="opt.RYBM"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input v-model="formData.BZ" type="string" :disabled="true" placeholder="请输入备注信息" class="specs_frame" />
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
                <el-table-column prop="KCID" label="库存ID" align="center" width="70"></el-table-column>
                <el-table-column prop="YKBZ" label="药库包装" align="center" width="70"></el-table-column>
                <el-table-column prop="CPPH" label="产品批号" align="center" width="150"></el-table-column>
                <el-table-column prop="SL" label="数量" align="center" width="80"></el-table-column>
                <el-table-column prop="DW" label="单位" align="center" width="60"></el-table-column>
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
                <el-table-column prop="GGKC" label="规格库存" align="center" width="90"></el-table-column>
                <el-table-column prop="PCKC" label="批号库存" align="center" width="90"></el-table-column>
                <el-table-column prop="GJBM" label="国家医保编码" align="center" width="150"></el-table-column>
                <el-table-column prop="GJMC" label="国家医保名称" align="center" width="150"></el-table-column>
                <el-table-column prop="BZ" label="备注" align="center" width="150"></el-table-column>
                <template #empty>
                    <el-empty description="暂无数据" />
                </template>
            </el-table>
        </div>
        <el-form :model="formData" :inline="true" label-width="90px" class="bottom-form">
            <el-form-item label="单据类型">
                <el-select v-model="formData.DJLX" placeholder="请选择单据类型" :disabled="true" clearable style="width: 100%">
                    <el-option v-for="opt in djlxOptions" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="交易类型">
                <el-select v-model="formData.JYLX" placeholder="请选择交易类型" :disabled="true" clearable style="width: 100%">
                    <el-option v-for="opt in jylxOptions" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开单人">
                <el-select v-model="formData.KDRBM" placeholder="请选择开单人" :disabled="true" clearable style="width: 100%">
                    <el-option v-for="opt in personnelIfon" :key="opt.RYBM" :label="opt.RYXM" :value="opt.RYBM"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="审核人">
                <el-select v-model="formData.SHRBM" placeholder="" :disabled="true" clearable style="width: 100%">
                    <el-option v-for="opt in personnelIfon" :key="opt.RYBM" :label="opt.RYXM" :value="opt.RYBM"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="DCDJH" label="来源单据号">
                <el-input v-model="formData.DCDJH" type="string" :disabled="true" placeholder="请输入申请人" />
            </el-form-item>
        </el-form>
        <!-- 按钮部分 -->
        <div class="yd-from-footer btn-box">
            <el-button style="margin-right: 30px; padding: 0 35px" type="primary">打印</el-button>
            <el-button plain style="padding: 0 35px" @click="canleBtn">取消</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { getrylist } from '/@/api/common'
import { getDrdMx, cxYfYk, getDrdList } from '/@/api/backend/yfzx/drd'
import useCurrentInstance from '/@/utils/useCurrentInstance'
import { useNavTabs } from '/@/stores/navTabs'
import { useRouter, useRoute } from 'vue-router'

defineOptions({
    name: 'yfzx/drd/detail',
})

const { proxy } = useCurrentInstance()
const navTabs = useNavTabs()
const ykyfData = ref([])
const personnelIfon = ref([])
const router = useRouter()
const route = useRoute()
let pageType = route.query.type
let ID = route.query.ID

const formData = reactive({
    KDRQ: '',
    BZ: '',
    JYLX: 0,
    DJLX: 0,
    SHRQ: '',
    KDRBM: '',
    SHDH: '',
    DJH: '',
    JSYFBM: '',
    SQR: '',
    PZRBM: '',
    SHRBM: '',
    LYYFBM: '',
    DCDJH: '',
})

const state: {
    ykData: any
} = reactive({
    ykData: [],
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
// 获取调入单明细
const getlook = async () => {
    const res = await getDrdMx({
        agrs: {
            DJID: route.query.DJID,
            YFBM: route.query.YFBM,
            DJH: route.query.DJH,
        },
    })
    const r = await getDrdList({
        agrs: {
            ID,
        },
    })
    state.ykData = res.data
    formData.KDRQ = r.data[0].KDRQ
    formData.SHRQ = r.data[0].SHRQ
    formData.DJH = r.data[0].DJH
    formData.PZRBM = r.data[0].PZRBM
    formData.LYYFBM = r.data[0].LYYFBM
    formData.SQR = r.data[0].SQR
    formData.BZ = r.data[0].BZ
    formData.DJLX = r.data[0].DJLX
    formData.JYLX = r.data[0].JYLX
    formData.KDRBM = r.data[0].KDRBM
    formData.SHRBM = r.data[0].SHRBM
    formData.DCDJH = r.data[0].DCDJH
}

const toLastTab = () => {
    const lastTab = navTabs.state.tabsView.slice(-1)[0]
    if (lastTab) {
        router.push(lastTab)
    } else {
        router.push('/admin')
    }
}
// 取消返回上一级
const canleBtn = () => {
    navTabs.closeTab(route)
    proxy.eventBus.emit('onTabViewClose', route)
    if (navTabs.state.activeRoute?.path === route.path) {
        toLastTab()
    } else {
        navTabs.setActiveRoute(navTabs.state.activeRoute!)
    }
}

onMounted(() => {
    pageType = route.query.type
    if (pageType) {
        getlook()
    }
    // 获取人员信息
    getrylist({ agrs: {} }).then((r) => {
        personnelIfon.value = r.data.options
    })
    // 获取药房
    cxYfYk({ agrs: 2 }).then((r) => {
        ykyfData.value = r.data
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
