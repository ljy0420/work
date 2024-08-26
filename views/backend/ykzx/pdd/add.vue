<template>
    <div class="layout-box">
        <div class="form-top">
            <el-scrollbar>
                <el-form :model="formData" :inline="true" label-width="100px" :rules="rules" ref="ruleFormRef">
                    <el-form-item prop="KDRQ" label="开单时间">
                        <el-date-picker v-model="formData.KDRQ" type="datetime" placeholder="请选择开单日期" style="width: 100%" />
                    </el-form-item>
                    <el-form-item prop="SHRQ" label="审核时间">
                        <el-date-picker v-model="examineTime" type="datetime" :disabled="true" placeholder="请选择审核日期" style="width: 100%" />
                    </el-form-item>
                    <el-form-item label="单据号">
                        <el-input v-model="formData.DJH" type="string" :disabled="true" placeholder="请输入单据号" />
                    </el-form-item>
                    <el-form-item prop="CGYBM" label="仓管员">
                        <el-select
                            filterable
                            v-model="formData.CGYBM"
                            placeholder="请选择仓管员"
                            clearable
                            style="width: 100%"
                            class="CGYBM"
                            @keyup.enter="handleKeyDown5($event, 'PDRBM')"
                        >
                            <el-option v-for="opt in personnelIfon" :key="opt.RYBM" :label="opt.RYXM" :value="opt.RYBM"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="盘点时间" prop="PDSJ">
                        <el-date-picker v-model="formData.PDSJ" type="datetime" placeholder="请选择盘点日期" style="width: 100%" />
                    </el-form-item>
                    <el-form-item prop="PDRBM" label="盘点人">
                        <el-select
                            filterable
                            v-model="formData.PDRBM"
                            placeholder="请选择盘点人"
                            clearable
                            style="width: 100%"
                            class="PDRBM"
                            @keyup.enter="handleKeyDown5($event, 'specs_frame')"
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
                            @keydown.enter="handleKeyDown4($event, 'YPMC')"
                        />
                    </el-form-item>
                </el-form>
            </el-scrollbar>
        </div>
        <div class="yd-card-body">
            <el-form :model="state" :rules="rules1" ref="ruleFormRef2">
                <el-table
                    ref="tableref"
                    :data="state.ykData"
                    class="color-table"
                    :header-cell-style="{ borderColor: '#e0e0e0' }"
                    :cell-style="{ borderColor: '#e0e0e0' }"
                    height="calc(100vh - 300px)"
                >
                    <el-table-column prop="PXH" label="行号" align="center" :width="65" class-name="custom-header">
                        <template #default="{ row }">
                            <span>{{ row.PXH }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="药品" align="center" width="150">
                        <el-table-column prop="YPBM" label="编码" align="center" width="120">
                            <template #default="{ row }">
                                <span>{{ row.YPBM }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="YPMC"
                            label="品名"
                            align="center"
                            width="170"
                            v-if="receiptType == 'edit' || receiptType == 'create' || receiptType == 'oder'"
                        >
                            <template #default="scope">
                                <SelectTable
                                    :disabled="examineTime != undefined"
                                    :agrs="scope.row"
                                    :data="ypInfo"
                                    :max-height="270"
                                    :tableWidth="800"
                                    :defaultSelectVal="scope.row.YPBM"
                                    :isShowQuery="false"
                                    :columns="[
                                        { label: '类别', prop: 'LBMC', width: '90' },
                                        { label: '编码', prop: 'YPBM', width: '130' },
                                        { label: '品名', prop: 'YPMC', width: '150' },
                                        { label: '规格', prop: 'GG', width: '150' },
                                        { label: '单位', prop: 'YKDW', width: '60' },
                                        { label: '包装', prop: 'YKBZ', width: '60' },
                                        { label: '库存ID', prop: 'YKKCID', width: '70' },
                                        { label: '库存数量', prop: 'YKKCSL', width: '100' },
                                        { label: '药房库存数量', prop: 'YFKCSL', width: '110' },
                                        { label: '零售价', prop: 'SCLSJ', width: '70' },
                                        { label: '进货价', prop: 'SCJHJ', width: '70' },
                                        { label: '国家编码', prop: 'GJBM', width: '120' },
                                        { label: '国家名称', prop: 'GJMC', width: '150' },
                                        { label: '产地', prop: 'CD', width: '200' },
                                        { label: '批准文号', prop: 'PZWH', width: '170' },
                                        { label: '产品批号', prop: 'CPPH', width: '150' },
                                        { label: '生产日期', prop: 'SCRQ', width: '155' },
                                        { label: '有效期', prop: 'YXQ', width: '155' },
                                        { label: '所属货位', prop: 'HWMC', width: '100' },
                                    ]"
                                    :keywords="{ label: 'YPMC', value: 'YPBM', key: 'YKKCID' }"
                                    :isShowFirstColumn="false"
                                    :isShowPagination="false"
                                    :isKeyup="true"
                                    filterable
                                    @radioChange="singleSelectChange"
                                    class="YPMC"
                                    @blur="handleKeyDown2(scope, 'fysl-class')"
                                />
                            </template>
                        </el-table-column>
                        <el-table-column prop="GG" label="品名" align="center" width="150" v-else>
                            <template #default="{ row }">
                                <span>{{ row.YPMC }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="GG" label="规格" align="center" width="150">
                            <template #default="{ row }">
                                <span>{{ row.GG }}</span>
                            </template>
                        </el-table-column>
                    </el-table-column>

                    <el-table-column prop="DWBZ" label="包装" align="center" width="70">
                        <template #default="{ row }">
                            <span>{{ row.DWBZ }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="CPPH" label="产品批号" align="center" width="150">
                        <template #default="{ row }">
                            <span>{{ row.CPPH }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="数量" align="center" width="80">
                        <el-table-column prop="ZMS" label="账面" align="center" width="60">
                            <template #default="{ row }">
                                <span>{{ row.ZMS }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="PDS" label="盘点" align="center" width="60">
                            <template #default="scope">
                                <el-form-item style="height: 15px" :prop="'ykData.' + scope.$index + '.PDS'" :rules="rules1.PDS">
                                    <el-input
                                        v-model.number="scope.row.PDS"
                                        style="width: 100%"
                                        :disabled="!scope.row.isEdit || examineTime != undefined"
                                        oninput="value=value.replace(/[^\d]/g,'')"
                                        @change="shandleChange(scope.row)"
                                        class="fysl-class"
                                        @keydown.enter="handleKeyDown($event, scope, 'BZ', 'fysl-class')"
                                    ></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="YKS" label="盈亏" align="center" width="80">
                            <template #default="{ row }">
                                <span>{{ row.SLYK }}</span>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column prop="DW" label="单位" align="center" width="60">
                        <template #default="{ row }">
                            <span>{{ row.DW }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="jinjia" label="进价" align="center" width="180">
                        <el-table-column prop="JHJ" label="进货价" align="center" width="90">
                            <template #default="{ row }">
                                <span>{{ row.JHJ }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="ZMJHJE" label="账面金额" align="center" width="80">
                            <template #default="{ row }">
                                <span>{{ row.ZMJHJE }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="PDJHJE" label="盘点金额" align="center" width="80">
                            <template #default="{ row }">
                                <span>{{ row.PDJHJE }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="YKJHJE" label="盈亏金额" align="center" width="80">
                            <template #default="{ row }">
                                <span>{{ row.JHJYK }}</span>
                            </template>
                        </el-table-column>
                    </el-table-column>

                    <el-table-column prop="address" label="零售价" align="center" width="180">
                        <el-table-column prop="LSJ" label="零售价" align="center" width="90">
                            <template #default="{ row }">
                                <span>{{ row.LSJ }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="ZMLSJE" label="账面金额" align="center" width="80">
                            <template #default="{ row }">
                                <span>{{ row.ZMLSJE }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="PDLSJE" label="盘点金额" align="center" width="80">
                            <template #default="{ row }">
                                <span>{{ row.PDLSJE }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="YKLSJE" label="盈亏金额" align="center" width="80">
                            <template #default="{ row }">
                                <span>{{ row.LSJYK }}</span>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column prop="CD" label="产地" align="center" width="200">
                        <template #default="{ row }">
                            <span>{{ row.CD }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="SCRQ" label="生产日期" align="center" width="150">
                        <template #default="{ row }">
                            <span>{{ row.SCRQ }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="YXQ" label="有效期" align="center" width="150">
                        <template #default="{ row }">
                            <span>{{ row.YXQ }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="PZWH" label="批准文号" align="center" width="150">
                        <template #default="{ row }">
                            <span>{{ row.PZWH }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="货位" align="center" width="130">
                        <template #default="{ row }">
                            <span>{{ row.HWMC }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="address" label="国家医保编码" align="center" width="150">
                        <template #default="{ row }">
                            <span>{{ row.GJBM }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="国家医保名称" align="center" width="150">
                        <template #default="{ row }">
                            <span>{{ row.GJMC }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="BZ" label="备注" align="center" width="150">
                        <template #default="scope">
                            <el-input
                                v-model="scope.row.BZ"
                                type="string"
                                :disabled="!scope.row.isEdit || examineTime != undefined"
                                style="width: 100%"
                                class="BZ"
                                @keydown.enter="handleKeyDown1($event, scope, 'YPMC')"
                            ></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="操作" width="150" fixed="right" align="center">
                        <template #default="scope">
                            <div style="display: flex; justify-content: space-around">
                                <el-button
                                    link
                                    v-blur
                                    type="primary"
                                    size="small"
                                    :disabled="examineTime != undefined"
                                    round
                                    @click="addYk"
                                >
                                    新增
                                </el-button>
                                <el-button
                                    link
                                    v-blur
                                    type="primary"
                                    size="small"
                                    :disabled="examineTime != undefined"
                                    @click="editYk(scope.row)"
                                >
                                    {{ scope.row.editTxt }}
                                </el-button>
                                <el-popconfirm
                                    title="您确定删除这条记录吗?"
                                    :disabled="examineTime != undefined"
                                    @confirm="deleteYk(scope.$index)"
                                >
                                    <template #reference>
                                        <el-button
                                            link
                                            v-blur
                                            type="primary"
                                            v-if="state.ykData.length !== 1"
                                            :disabled="examineTime != undefined"
                                            size="small"
                                            >删除</el-button
                                        >
                                    </template>
                                </el-popconfirm>
                            </div>
                        </template>
                    </el-table-column>
                    <template #empty>
                        <el-empty description="暂无数据" />
                    </template>
                </el-table>
            </el-form>
        </div>
        <el-form :model="formData" :inline="true" label-width="90px" ref="ruleFormRef1" :rules="rules" class="bottom-form">
            <el-form-item label="单据类型" prop="DJLX">
                <el-select v-model="formData.DJLX" placeholder="请选择单据类型" clearable style="width: 100%">
                    <el-option v-for="opt in djlxOptions" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="交易类型" prop="JYLX">
                <el-select v-model="formData.JYLX" placeholder="请选择交易类型" clearable style="width: 100%">
                    <el-option v-for="opt in jylxOptions" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开单人" prop="KDRBM">
                <el-select v-model="formData.KDRBM" placeholder="请选择开单人" clearable style="width: 100%">
                    <el-option v-for="opt in personnelIfon" :key="opt.RYBM" :label="opt.RYXM" :value="opt.RYBM"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="审核人">
                <el-select v-model="examinePeople" placeholder="" :disabled="true" clearable style="width: 100%">
                    <el-option v-for="opt in personnelIfon" :key="opt.RYBM" :label="opt.RYXM" :value="opt.RYBM"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <div style="margin-left: 30px">
                    <el-checkbox v-model="checked" :true-label="1" :false-label="0" size="large">未盘点项目自动清理</el-checkbox>
                </div>
            </el-form-item>
        </el-form>
        <div class="yd-from-footer btn-box">
            <el-button style="margin-right: 30px; padding: 0 35px" type="primary" @click="onSubmit">保存</el-button>
            <el-button style="margin-right: 30px; padding: 0 35px" @click="examine" type="primary">发送审核</el-button>
            <el-button style="margin-right: 30px; padding: 0 35px" type="primary">打印</el-button>
            <el-button plain style="padding: 0 35px" @click="canleBtn">取消</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import SelectTable from '/@/components/select-table/selectTable.vue'
import { getrylist, getxtTime } from '/@/api/common'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ykPddEdit, ykPddCreate, getPddMx, scPdmx, kcsljc, getYpInfo, getPddList } from '/@/api/backend/yk/pdd'
import { useAdminInfo } from '/@/stores/adminInfo'
import useCurrentInstance from '/@/utils/useCurrentInstance'
import { useNavTabs } from '/@/stores/navTabs'
import { useRouter, useRoute } from 'vue-router'
import { validateForm } from '/@/utils/common'

defineOptions({
    name: 'ykzx/pdd/add',
})

const { proxy } = useCurrentInstance()
const navTabs = useNavTabs()
const ruleFormRef = ref()
const ruleFormRef1 = ref()
const personnelIfon = ref([])
const adminInfo = useAdminInfo()
const ypInfo = ref([])
const router = useRouter()
const route = useRoute()
const checked = ref(0)
// 获取路由传递的参数
let cKFBM = route.query.cKFBM
let ID = route.query.ID
let receiptType = route.query.type

const formData = reactive({
    PDSJ: '',
    PDRBM: '',
    PZRBM: '',
    KDRQ: '',
    CGYBM: '',
    BZ: '',
    JYLX: 0,
    DJLX: 0,
    KDRXM: '',
    KDRBM: '',
    PDLX: '',
    DJH: '',
    SHDH: '',
    PDRXM: '',
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
            ZMS: '',
            PDS: '',
            SLYK: '',
            JHJ: '',
            ZMJHJE: '',
            PDJHJE: '',
            JHJYK: '',
            LSJ: '',
            ZMLSJE: '',
            PDLSJE: '',
            LSJYK: '',
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
// 盘点数相关计算
const shandleChange = (row: any) => {
    row.SLYK = (row.PDS - row.ZMS).toFixed(2)
    row.ZMJHJE = (row.ZMS * row.JHJ).toFixed(2)
    row.ZMLSJE = (row.ZMS * row.LSJ).toFixed(2)
    row.PDJHJE = (row.PDS * row.JHJ).toFixed(2)
    row.PDLSJE = (row.PDS * row.LSJ).toFixed(2)
    row.JHJYK = (row.PDJHJE - row.ZMJHJE).toFixed(2)
    row.LSJYK = (row.PDLSJE - row.ZMLSJE).toFixed(2)
}

const tableref = ref(null)
const handleKeyDown = (event: any, scope: any, nextClass: any, thisClass: any) => {
    if (event.keyCode === 13) {
        // 按下回车键聚焦到下一个输入框
        if (nextClass && scope.row.PDS) {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${nextClass} .el-input__inner`)
            if (ele) {
                ele.focus()
            }
        } else {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${thisClass} .el-input__inner`)
            if (ele) {
                ele.blur()
                nextTick(() => {
                    ele.focus()
                })
            }
        }
    }
}
const handleKeyDown1 = (event: any, scope: any, nextClass: any) => {
    if (event.keyCode === 13) {
        if (state.ykData.length - scope.$index === 1) {
            addYk()
        }
        nextTick(() => {
            const rowIndex = scope.$index + 1
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${nextClass} .el-input__inner`)
            if (ele) {
                ele.focus()
            }
        })
    }
}
const handleKeyDown2 = (scope: any, nextClass: any) => {
    if (nextClass && scope.row.YPMC) {
        const rowIndex = scope.$index
        let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${nextClass} .el-input__inner`)
        if (ele) {
            ele.focus()
        }
    }
}
const handleKeyDown3 = () => {
    let ele = ruleFormRef.value.$el.querySelector(`.CGYBM .el-input__inner`)
    if (ele) {
        ele.focus()
    }
}
const handleKeyDown4 = (event: any, nextClass: any) => {
    if (event.keyCode === 13) {
        let ele = tableref.value.$el.querySelector(`.${nextClass} .el-input__inner`)
        if (ele) {
            ele.focus()
        }
    }
}

const handleKeyDown5 = (event: any, nextClass: any) => {
    if (event.keyCode === 13) {
        let ele = ruleFormRef.value.$el.querySelector(`.${nextClass} .el-input__inner`)
        if (ele) {
            ele.focus()
        }
    }
}

const toLastTab = () => {
    const lastTab = navTabs.state.tabsView.slice(-1)[0]
    if (lastTab) {
        lastTab.query.KFBM = cKFBM
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
// 获取当前时间
const getCureentTime = async () => {
    const res = await getxtTime()
    formData.KDRQ = res.data
    formData.KDRBM = adminInfo.rybm
    formData.PDSJ = res.data
}
// 获取药品信息
const getYpInfos = () => {
    getYpInfo({ agrs: { KFBM: cKFBM ? cKFBM : route.query.KFBM, YWLX: '药库库存明细' } }).then((r: any) => {
        ypInfo.value = r.data
    })
}
getYpInfos()
getCureentTime()

const singleSelectChange = (row: any, agrs: any) => {
    agrs.YPBM = row.YPBM
    agrs.YPMC = row.YPMC
    agrs.DWBZ = row.YKBZ
    agrs.GG = row.GG
    agrs.DW = row.YKDW
    agrs.CD = row.CD
    agrs.JHJ = row.SCJHJ
    agrs.LSJ = row.SCLSJ
    agrs.PZWH = row.PZWH
    agrs.GJMC = row.GJMC
    agrs.GJBM = row.GJBM
    agrs.GLBM = row.GLBM
    agrs.CPPH = row.CPPH
    agrs.HWMC = row.HWMC
    agrs.KCID = row.YKKCID
    agrs.YXQ = row.YXQ
    agrs.SCRQ = row.SCRQ
    agrs.ZMJHJE = row.ZMJHJE
    agrs.PDJHJE = row.PDJHJE
    agrs.JHJYK = row.JHJYK
    agrs.ZMLSJE = row.ZMLSJE
    agrs.PDLSJE = row.PDLSJE
    agrs.LSJYK = row.LSJYK
    agrs.ZMS = row.YKKCSL
    agrs.PDS = row.PDS
    agrs.SLYK = row.SLYK
}

const addYk = () => {
    state.ykData.push({
        PXH: 1 + state.ykData.length,
        YPBM: '',
        YPMC: '',
        GG: '',
        DW: '',
        DWBZ: '',
        CPPH: '',
        ZMS: '',
        PDS: '',
        SLYK: '',
        JHJ: '',
        ZMJHJE: '',
        PDJHJE: '',
        JHJYK: '',
        LSJ: '',
        ZMLSJE: '',
        PDLSJE: '',
        LSJYK: '',
        SCRQ: '',
        YXQ: '',
        CD: '',
        PZWH: '',
        BZ: '',
        GJBM: '',
        GJMC: '',
        isEdit: true,
        editTxt: '确定',
    })
}

const editYk = (row: any) => {
    if (row.isEdit) {
        row.editTxt = '编辑'
    } else {
        row.editTxt = '确认'
    }
    row.isEdit = !row.isEdit
}

const deleteYk = (index: any) => {
    state.ykData.splice(index, 1)
}

const DJHs = ref()
const DJIDs = ref()
const IDs = ref()
const KFBMs = ref()

// 保存
const onSubmit = async () => {
    const formRefs = [ruleFormRef.value, ruleFormRef1.value]
    const valid = await validateForm(formRefs)
    if (valid.every((result) => result)) {
        const validRows = state.ykData.filter((row: any) => row.YPMC !== '')
        const { ID, DJID, cKFBM } = route.query
        let editdata, r, data, res

        const handleEditSuccess = async (r: any) => {
            ElMessage.success('修改成功')
            data = {
                agrs: {
                    DJID: r.data.DJID,
                    KFBM: r.data.KFBM,
                    DJH: r.data.DJH,
                },
            }
            res = await getPddMx(data)
            state.ykData = res.data
            state.ykData.forEach((item: any) => {
                item.isEdit = true
                item.editTxt = '确认'
            })
        }

        const handleCreateSuccess = async (r: any) => {
            ElMessage.success('新增成功')
            receiptType = 'edit'
            DJHs.value = r.data.DJH
            DJIDs.value = r.data.DJID
            IDs.value = r.data.ID
            KFBMs.value = r.data.KFBM
            data = {
                agrs: {
                    DJID: r.data.DJID,
                    KFBM: r.data.KFBM,
                    DJH: r.data.DJH,
                },
            }
            res = await getPddMx(data)
            state.ykData = res.data
            state.ykData.forEach((item: any) => {
                item.isEdit = true
                item.editTxt = '确认'
            })
            formData.KDRQ = r.data.KDRQ
            formData.DJH = r.data.DJH
            formData.CGYBM = r.data.CGYBM
            formData.PDRBM = r.data.PDRBM
            formData.PDSJ = r.data.PDSJ
            formData.PZRBM = r.data.PZRBM
            formData.BZ = r.data.BZ
            formData.DJLX = r.data.DJLX
            formData.JYLX = r.data.JYLX
            formData.KDRBM = r.data.KDRBM
            formData.PDRXM = r.data.PDRXM
        }

        try {
            if (receiptType === 'edit') {
                editdata = {
                    agrs: {
                        ZB: { ...formData, ID: ID || IDs.value, DJID: DJID || DJIDs.value, KFBM: cKFBM || KFBMs.value },
                        MXB: validRows,
                        LX: '保存',
                    },
                }
                r = await ykPddEdit(editdata)
                await handleEditSuccess(r)
            } else {
                const createdata = {
                    agrs: {
                        ZB: { ...formData, KFBM: cKFBM ? cKFBM : route.query.KFBM },
                        MXB: validRows,
                    },
                }

                r = await ykPddCreate(createdata)
                if (r.code === 1 && r.msg === '保存成功') {
                    receiptType = 'edit'
                }
                await handleCreateSuccess(r)
            }
        } catch (error) {
            console.error(error)
        }
    }
}
// 审核
const examinePeople = ref()
const examineTime = ref()
const examine = async () => {
    const confirmMessage = `发送审核后，这条单据将不能使用，您确定要发送审核吗？`
    const confirmOptions = {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
    }

    const handleExamine = async (data: any) => {
        let flag = state.ykData.some((item: any) => !item.ID)
        console.log('flag: ', flag)
        if (flag) {
            ElMessage.error('新增数据必须先保存再审核')
            return
        }
        // 审核前账面库存数量检查
        const { ID, DJID, DJH } = route.query
        let shdata = {
            agrs: {
                ZB: {
                    ID,
                    DJID,
                    DJH,
                },
            },
        }
        const res = await kcsljc(shdata)
        if (res.code == 1) {
            const { code, data: responseData } = await ykPddEdit(data)
            if (code === 1) {
                examineTime.value = responseData.SHRQ
                examinePeople.value = responseData.SHRBM
                ElMessage.success('审核成功')
            }
        }
    }

    const showConfirmDialog = (message: any, options: any) => {
        return new Promise((resolve, reject) => {
            ElMessageBox.confirm(message, '提示', options)
                .then(() => {
                    resolve()
                })
                .catch(() => {
                    reject()
                })
        })
    }

    if (ID) {
        const { DJID, cKFBM, DJH, ID } = route.query
        const data = {
            agrs: {
                ZB: { DJID, KFBM: cKFBM, DJH, ID },
                LX: '审核',
                // 未盘点项目自动清理
                YWLX: checked.value,
            },
        }
        try {
            await showConfirmDialog(confirmMessage, confirmOptions)
            await handleExamine(data)
        } catch (error) {}
    } else {
        const data = {
            agrs: {
                ZB: {
                    DJID: DJIDs.value,
                    KFBM: KFBMs.value,
                    DJH: DJHs.value,
                    ID: IDs.value,
                },
                LX: '审核',
                // 未盘点项目自动清理
                YWLX: checked.value,
            },
        }
        try {
            await showConfirmDialog(confirmMessage, confirmOptions)
            await handleExamine(data)
        } catch (error) {}
    }
}

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
// 生成盘点明细
const scpdmx = async () => {
    formData.JYLX = 1
    formData.BZ = ''
    formData.PDRBM = ''
    formData.DJH = ''
    formData.KDRBM = ''
    const res = await scPdmx({
        agrs: {
            KFBM: route.query.cKFBM,
            YWLX: route.query.YWLX,
            ListBM: route.query.ListBM,
            Date: route.query.Date,
        },
    })
    state.ykData = res.data
    state.ykData.forEach((item: any) => {
        item.isEdit = true
        item.editTxt = '确认'
    })
}
// 查看盘点明细
const getlook = async () => {
    const res = await getPddMx({
        agrs: {
            DJID: route.query.DJID,
            KFBM: route.query.cKFBM,
            DJH: route.query.DJH,
        },
    })
    const r = await getPddList({
        agrs: {
            ID,
        },
    })
    state.ykData = res.data
    state.ykData.forEach((item: any) => {
        item.isEdit = true
        item.editTxt = '确认'
    })
    formData.KDRQ = r.data[0].KDRQ
    formData.DJH = r.data[0].DJH
    formData.CGYBM = r.data[0].CGYBM
    formData.PDSJ = r.data[0].PDSJ
    formData.PDRBM = r.data[0].PDRBM
    formData.PZRBM = r.data[0].PZRBM
    formData.BZ = r.data[0].BZ
    formData.DJLX = r.data[0].DJLX
    formData.JYLX = r.data[0].JYLX
    formData.KDRBM = r.data[0].KDRBM
    formData.PDRXM = r.data[0].PDRXM
    // formData.SHRQ = r.data[0].SHRQ
    // formData.SHRBM = r.data[0].SHRBM
    examineTime.value = r.data[0].SHRQ
    examinePeople.value = r.data[0].SHRBM
}

onMounted(() => {
    receiptType = route.query.type
    if (receiptType == 'create') {
        handleKeyDown3()
    }
    if (receiptType != 'create' && receiptType != 'oder') {
        getlook()
    }
    if (receiptType == 'oder') {
        scpdmx()
    }
    // 获取人员信息
    getrylist({ agrs: {} }).then((r) => {
        personnelIfon.value = r.data.options
    })
})
const validatePDS = (rule: any, value: any, callback: any) => {
    if (value === '' || value === 0 || value === undefined) {
        callback(new Error(''))
    } else {
        callback()
    }
}

// 校验规则
const rules = reactive({
    PDSJ: [{ required: true, message: '盘点时间不能为空', trigger: 'blur' }],
    PDRBM: [{ required: true, message: '盘点时间不能为空', trigger: 'change' }],
    KDRQ: [{ required: true, message: '开单时间不能为空', trigger: 'blur' }],
    KDRBM: [{ required: true, message: '开单人姓名不能为空', trigger: 'blur' }],
    DJLX: [{ required: true, message: '单据类型不能为空', trigger: 'change' }],
    JYLX: [{ required: true, message: '交易类型不能为空', trigger: 'change' }],
})
const rules1 = reactive({
    PDS: [{ required: true, validator: validatePDS, trigger: 'blur' }],
})
</script>

<style lang="scss" scoped>
// .ba-popover
:deep(.el-table__inner-wrapper::before) {
    content: none;
}

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

:deep(.el-checkbox.el-checkbox--large .el-checkbox__label) {
    font-size: 16px;
    color: red;
}
.fysl-class :deep(.el-input__inner) {
    text-align: center;
}
</style>
