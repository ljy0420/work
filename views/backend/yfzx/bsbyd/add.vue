<template>
    <div class="layout-box">
        <div class="form-top">
            <el-scrollbar>
                <el-form :model="formData" :inline="true" label-width="100px" ref="ruleFormRef" :rules="rules">
                    <el-form-item prop="KDRQ" label="开单时间">
                        <el-date-picker v-model="formData.KDRQ" type="datetime" placeholder="请选择开单时间"
                            :disabled="examineTime != undefined" style="width: 100%" />
                    </el-form-item>
                    <el-form-item prop="SHRQ" label="审核时间">
                        <el-date-picker v-model="examineTime" type="datetime" :disabled="true" placeholder="审核后生成"
                            style="width: 100%" />
                    </el-form-item>
                    <el-form-item label="单据号">
                        <el-input v-model="formData.DJH" type="string" :disabled="true" placeholder="请输入单据号" />
                    </el-form-item>
                    <el-form-item prop="PZRBM" label="批准人">
                        <el-select v-model="formData.PZRBM" placeholder="请选择批准人" filterable clearable style="width: 100%"
                            :disabled="examineTime != undefined" class="PZRBM" @keyup.enter="handleFocus($event, 'SQR')">
                            <el-option v-for="opt in personnelIfon" :key="opt.RYBM" :label="opt.RYXM"
                                :value="opt.RYBM"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="SQR" label="申请人">
                        <el-select v-model="formData.SQR" clearable filterable :disabled="examineTime != undefined"
                            style="width: 100%" placeholder="请选择申请人" @blur="SQRSelect" allow-create class="SQR"
                            @keyup.enter="handleFocus($event, 'CGYBM')">
                            <el-option v-for="opt in personnelIfon" :key="opt.RYBM" :label="opt.RYXM" :value="opt.RYBM" />
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="CGYBM" label="仓管员">
                        <el-select v-model="formData.CGYBM" placeholder="请选择仓管员" :disabled="examineTime != undefined"
                            filterable clearable style="width: 100%" class="CGYBM" @keyup.enter="handleFocus($event, 'specs_frame')">
                            <el-option v-for="opt in personnelIfon" :key="opt.RYBM" :label="opt.RYXM"
                                :value="opt.RYBM"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input v-model="formData.BZ" type="string" placeholder="请输入备注信息" class="specs_frame"
                            :disabled="examineTime != undefined" @keydown.enter="handleKeyDown4($event, 'YPMC')" />
                    </el-form-item>
                </el-form>
            </el-scrollbar>
        </div>
        <div class="yd-card-body">
            <el-table ref="tableref" :data="state.ykData" class="color-table"
                :header-cell-style="{ borderColor: '#e0e0e0' }" :cell-style="{ borderColor: '#e0e0e0' }"
                height="calc(100vh - 300px)">
                <el-table-column prop="PXH" label="行号" align="center" :width="65" class-name="custom-header">
                    <template #default="{ row }">
                        <span>{{ row.PXH }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="药品" align="center" width="150">
                    <el-table-column prop="YPBM" label="编码" align="center" width="100">
                        <template #default="{ row }">
                            <span>{{ row.YPBM }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="YPMC" label="品名" align="center" width="170"
                        v-if="receiptType == 'edit' || receiptType == 'create'">
                        <template #default="scope">
                            <SelectTable :disabled="examineTime != undefined" :agrs="scope.row" :data="ypInfo"
                                :max-height="270" :tableWidth="800" :defaultSelectVal="scope.row.YPBM" :isShowQuery="false"
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
                                ]" :keywords="{ label: 'YPMC', value: 'YPBM' }" :isShowFirstColumn="false"
                                :isShowPagination="false" :isKeyup="true" filterable class="YPMC"
                                @radioChange="singleSelectChange" @blur="handleKeyDown2(scope, 'fysl-class')" />
                        </template>
                    </el-table-column>
                    <el-table-column label="品名" align="center" width="150" v-else>
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
                <el-table-column prop="YKBZ" label="药库包装" align="center" width="70">
                    <template #default="{ row }">
                        <span>{{ row.YKBZ }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="CPPH" label="产品批号" align="center" width="120">
                    <template #default="{ row }">
                        <span>{{ row.CPPH }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="CPPH" label="数量" align="center" width="120">
                    <el-table-column prop="SL" label="大单位数量" align="center" width="85">
                        <template #default="scope">
                            <el-input @change="slhandleChange(scope.row)" oninput="value=value.replace(/[^-?\d]/g,'')"
                                :controls="false" :min="0" class="fysl-class" v-model="scope.row.DDWSL"
                                :disabled="!scope.row.isEdit || examineTime != undefined" style="width: 100%"
                                @keydown.enter="ddwslhandleKeyDown($event, scope, 'fysl-classl')"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="SL" label="小单位数量" align="center" width="85">
                        <template #default="scope">
                            <el-input @change="slhandleChange(scope.row)" oninput="value=value.replace(/[^-?\d]/g,'')"
                                :controls="false" :min="0" class="fysl-classl" v-model="scope.row.XDWSL"
                                :disabled="!scope.row.isEdit || examineTime != undefined" style="width: 100%"
                                @keydown.enter="xdwslhandleKeyDown($event, scope, 'BZ')"></el-input>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column prop="DW" label="单位" align="center" width="60">
                    <template #default="{ row }">
                        <span>{{ row.DW }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="进价" align="center" width="150">
                    <el-table-column prop="JHJ" label="进货价" align="center" width="90">
                        <template #default="{ row }">
                            <span>{{ row.JHJ }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="JHJE" label="进货金额" align="center" width="80">
                        <template #default="{ row }">
                            <span>{{ row.JHJE }}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="零售价" align="center" width="150">
                    <el-table-column prop="LSJ" label="零售价" align="center" width="90">
                        <template #default="{ row }">
                            <span>{{ row.LSJ }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="LSJE" label="零售金额" align="center" width="100">
                        <template #default="{ row }">
                            <span>{{ row.LSJE }}</span>
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
                <el-table-column prop="address" label="批次库存" align="center" width="90">
                    <template #default="{ row }">
                        <span>{{ row.PCKC }}</span>
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
                        <el-input v-model="scope.row.BZ" type="string"
                            :disabled="!scope.row.isEdit || examineTime != undefined" style="width: 100%" class="BZ"
                            @keydown.enter="handleKeyDown1($event, scope, 'YPMC')"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="操作" width="150" fixed="right" align="center">
                    <template #default="scope">
                        <div style="display: flex; justify-content: space-around">
                            <el-button link v-blur type="primary" size="small" round @click="addYk"
                                :disabled="examineTime != undefined">
                                新增
                            </el-button>
                            <el-button link v-blur type="primary" size="small" @click="editYk(scope.row)"
                                :disabled="examineTime != undefined">
                                {{ scope.row.editTxt }}
                            </el-button>
                            <el-popconfirm title="您确定删除这条记录吗?" @confirm="deleteYk(scope.$index)">
                                <template #reference>
                                    <el-button link v-blur type="primary" v-if="state.ykData.length !== 1" size="small"
                                        :disabled="examineTime != undefined">删除</el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                    </template>
                </el-table-column>
                <template #empty>
                    <el-empty description="暂无数据" />
                </template>
            </el-table>
        </div>
        <el-form :model="formData" :inline="true" label-width="90px" ref="ruleFormRef1" :rules="rules" class="bottom-form">
            <el-form-item label="单据类型" prop="DJLX">
                <el-select v-model="formData.DJLX" placeholder="请选择单据类型" clearable style="width: 100%"
                    :disabled="examineTime != undefined">
                    <el-option v-for="opt in djlxOptions" :key="opt.value" :label="opt.label"
                        :value="opt.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="交易类型" prop="JYLX">
                <el-select v-model="formData.JYLX" placeholder="请选择交易类型" clearable style="width: 100%"
                    :disabled="examineTime != undefined">
                    <el-option v-for="opt in jylxOptions" :key="opt.value" :label="opt.label"
                        :value="opt.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开单人" prop="KDRBM">
                <el-select v-model="formData.KDRBM" placeholder="请选择开单人" clearable style="width: 100%"
                    :disabled="examineTime != undefined">
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
            <el-button style="margin-right: 30px; padding: 0 35px" type="primary" @click="onSubmit"
                :disabled="examineTime != undefined">保存</el-button>
            <el-button style="margin-right: 30px; padding: 0 35px" @click="examine" type="primary"
                :disabled="examineTime != undefined">发送审核</el-button>
            <el-button style="margin-right: 30px; padding: 0 35px" type="primary">打印</el-button>
            <el-button plain style="padding: 0 35px" @click="canleBtn">取消</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import SelectTable from '/@/components/select-table/selectTable.vue'
import { getrylist, getxtTime, getYpInfo } from '/@/api/common'
import { ElMessage, ElMessageBox } from 'element-plus'
import { yfSydEdit, yfSydCreate, getSydDetail, getSydList } from '/@/api/backend/yfzx/syd'
import useCurrentInstance from '/@/utils/useCurrentInstance'
import { useNavTabs } from '/@/stores/navTabs'
import { useAdminInfo } from '/@/stores/adminInfo'
import { useRouter, useRoute } from 'vue-router'
import { validateForm } from '/@/utils/common'

defineOptions({
    name: 'yfzx/bsbyd/add',
})

const { proxy } = useCurrentInstance()
const navTabs = useNavTabs()
const ruleFormRef = ref()
const ruleFormRef1 = ref()
const personnelIfon = ref([])
const adminInfo = useAdminInfo()
const ypInfo = ref([])
const isElelect = ref(false)
const router = useRouter()
const route = useRoute()
let cYFBM = route.query.cYFBM
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
    PZRBM: '',
    SHRBM: '',
    CGYBM: '',
    SQR: '',
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
            YKBZ: '',
            CPPH: '',
            LSJ: '',
            JHJ: '',
            DDWSL: 0,
            XDWSL: 0,
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

const SQRSelect = (e: any) => {
    let value = e.target.value // 输入框值
    if (value) {
        // 只有输入才有这个值，下拉框选择的话 这个值为空
        formData.SQR = value
    }
}

const tableref = ref(null)
const ddwslhandleKeyDown = (event: any, scope: any, nextClass: any) => {
    if (event.keyCode === 13) {
        // 按下回车键聚焦到下一个输入框
        if (nextClass) {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${nextClass} .el-input__inner`)
            if (ele) {
                ele.focus()
            }
        }
    }
}
const xdwslhandleKeyDown = (event: any, scope: any, nextClass: any) => {
    if (event.keyCode === 13) {
        // 按下回车键聚焦到下一个输入框
        if (!scope.row.DDWSL && !scope.row.XDWSL) {
            // 如果大单位数量和小单位数量都为空，则提示错误
            ElMessage.error('请输入大单位数量或小单位数量')
            // alert('请输入大单位数量或小单位数量')
            return
        }
        if (nextClass && (scope.row.DDWSL || scope.row.XDWSL)) {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${nextClass} .el-input__inner`)
            if (ele) {
                ele.focus()
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
    let ele = ruleFormRef.value.$el.querySelector(`.PZRBM .el-input__inner`)
    if (ele) {
        ele.focus()
    }
}
const handleKeyDown4 = (event: any, nextClass: any) => {
    if (event.keyCode === 13 && formData.SQR) {
        let ele = tableref.value.$el.querySelector(`.${nextClass} .el-input__inner`)
        if (ele) {
            ele.focus()
        }
    }
}

const handleFocus = (event: any, nextClass: string) => {
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
        lastTab.query.YFBM = cYFBM
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

const slhandleChange = (row) => {
    row.SL = Number(row.DDWSL == null ? 0 : row.DDWSL) * Number(row.YKBZ) + Number(row.XDWSL == null ? 0 : row.XDWSL)
    row.JHJE = (row.SL * Number(row.JHJ)).toFixed(2)
    row.LSJE = (row.SL * Number(row.LSJ)).toFixed(2)
}

const getCureentTime = async () => {
    const res = await getxtTime()
    formData.KDRQ = res.data
    formData.KDRBM = adminInfo.rybm
}

const changeYpinfo = async () => {
    const res = await getYpInfo({ agrs: { YFBM: cYFBM, YWLX: '药房库存明细' } })
    ypInfo.value = res.data
}
getCureentTime()
changeYpinfo()

const singleSelectChange = (row: any, agrs: any) => {
    agrs.YPBM = row.YPBM
    agrs.YPMC = row.YPMC
    agrs.YKBZ = row.YKBZ
    agrs.GG = row.GG
    agrs.DW = row.JBDW
    agrs.CD = row.CD
    agrs.JHJ = row.SCJHJ
    agrs.LSJ = row.SCLSJ
    agrs.PZWH = row.PZWH
    agrs.GJMC = row.GJMC
    agrs.GJBM = row.GJBM
    agrs.GGKC = row.GGKC
    agrs.CPPH = row.CPPH
    agrs.SCRQ = row.SCRQ
    agrs.YXQ = row.YXQ
    agrs.HWMC = row.HWMC
    agrs.KCID = row.YFKCID
    agrs.PCKC = row.JBDWSL
    agrs.DDWSL = 0
    agrs.XDWSL = 0
}

const addYk = () => {
    state.ykData.push({
        PXH: 1 + state.ykData.length,
        YPBM: '',
        YPMC: '',
        GG: '',
        DW: '',
        YKBZ: '',
        CPPH: '',
        DDWSL: 0,
        XDWSL: 0,
        SCRQ: '',
        YXQ: '',
        JHJ: '',
        LSJ: '',
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
const YFBMs = ref()

// 保存
const onSubmit = async () => {
    const formRefs = [ruleFormRef.value, ruleFormRef1.value]
    const valid = await validateForm(formRefs)
    if (valid.every((result) => result)) {
        const validRows = state.ykData.filter((row) => row.YPMC !== '')
        const { ID, DJID, cYFBM } = route.query
        let editdata, r, data, res

        const handleEditSuccess = async (r) => {
            ElMessage.success('修改成功')
            data = {
                agrs: {
                    DJID: r.data.DJID,
                    YFBM: r.data.YFBM,
                    DJH: r.data.DJH,
                },
            }
            res = await getSydDetail(data)
            state.ykData = res.data
            state.ykData.forEach((item) => {
                item.isEdit = true
                item.editTxt = '确认'
            })
        }

        const handleCreateSuccess = async (r) => {
            ElMessage.success('新增成功')
            receiptType = 'edit'
            DJHs.value = r.data.DJH
            DJIDs.value = r.data.DJID
            IDs.value = r.data.ID
            YFBMs.value = r.data.YFBM
            data = {
                agrs: {
                    DJID: r.data.DJID,
                    YFBM: r.data.YFBM,
                    DJH: r.data.DJH,
                },
            }
            res = await getSydDetail(data)
            state.ykData = res.data
            state.ykData.forEach((item) => {
                item.isEdit = true
                item.editTxt = '确认'
            })
            formData.DJH = r.data.DJH
        }

        try {
            if (receiptType === 'edit') {
                editdata = {
                    agrs: {
                        ZB: { ...formData, ID: ID || IDs.value, DJID: DJID || DJIDs.value, YFBM: cYFBM || YFBMs.value },
                        MXB: validRows,
                        LX: '保存',
                    },
                }
                r = await yfSydEdit(editdata)
                await handleEditSuccess(r)
            } else {
                const createdata = {
                    agrs: {
                        ZB: { ...formData, YFBM: cYFBM },
                        MXB: validRows,
                    },
                }
                r = await yfSydCreate(createdata)
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

const examinePeople = ref()
const examineTime = ref()
const examine = async () => {
    const confirmMessage = `发送审核后，这条单据将不能使用，您确定要发送审核吗？`
    const confirmOptions = {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
    }

    const handleExamine = async (data) => {
        let flag = state.ykData.some((item) => !item.ID)
        if (flag) {
            ElMessage.error('新增数据必须先保存再审核')
            return
        }

        const { code, data: responseData } = await yfSydEdit(data)
        if (code === 1) {
            examineTime.value = responseData.SHRQ
            examinePeople.value = responseData.SHRBM
            ElMessage.success('审核成功')
        }
    }

    const showConfirmDialog = (message, options) => {
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
        const { DJID, cYFBM, DJH, ID } = route.query
        const data = {
            agrs: {
                ZB: { DJID, YFBM: cYFBM, DJH, ID },
                LX: '审核',
            },
        }
        try {
            await showConfirmDialog(confirmMessage, confirmOptions)
            await handleExamine(data)
        } catch (error) { }
    } else {
        const data = {
            agrs: {
                ZB: {
                    DJID: DJIDs.value,
                    YFBM: YFBMs.value,
                    DJH: DJHs.value,
                    ID: IDs.value,
                },
                LX: '审核',
            },
        }
        try {
            await showConfirmDialog(confirmMessage, confirmOptions)
            await handleExamine(data)
        } catch (error) { }
    }
}

const rules = reactive({
    SQR: [{ required: true, message: '申领人不能为空', trigger: 'change' }],
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
    const res = await getSydDetail({
        agrs: {
            DJID: route.query.DJID,
            YFBM: route.query.cYFBM,
            DJH: route.query.DJH,
        },
    })
    const r = await getSydList({
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
    formData.SQR = r.data[0].SQR
    formData.PZRBM = r.data[0].PZRBM
    formData.CGYBM = r.data[0].CGYBM
    formData.BZ = r.data[0].BZ
    formData.DJLX = r.data[0].DJLX
    formData.JYLX = r.data[0].JYLX
    formData.KDRBM = r.data[0].KDRBM
    examineTime.value = r.data[0].SHRQ
    examinePeople.value = r.data[0].SHRBM
}

onMounted(() => {
    receiptType = route.query.type
    if (receiptType == 'create') {
        nextTick(() => {
            handleKeyDown3()
        })
    }
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
.fysl-class :deep(.el-input__inner) {
    text-align: center;
}

.fysl-classl :deep(.el-input__inner) {
    text-align: center;
}

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
