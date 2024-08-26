<template>
    <div class="layout-box">
        <div class="form-top">
            <el-scrollbar>
                <el-form :model="formData" :inline="true" label-width="100px" :rules="rules" ref="ruleFormRef">
                    <el-form-item prop="KDRQ" label="开单时间">
                        <el-date-picker v-model="formData.KDRQ" type="datetime"
                            :disabled="examineTime != undefined" placeholder="请选择开单日期"
                            style="width: 100%" />
                    </el-form-item>
                    <el-form-item prop="SHRQ" label="审核时间">
                        <el-date-picker v-model="examineTime" type="datetime" :disabled="true" placeholder="请选择审核日期"
                            style="width: 100%" />
                    </el-form-item>
                    <el-form-item label="单据号">
                        <el-input v-model="formData.DJH" type="string" :disabled="true" placeholder="请输入单据号" />
                    </el-form-item>

                    <el-form-item label="接收库房" prop="JSKFBM">
                        <el-select filterable v-model="formData.JSKFBM" placeholder="请选择"
                            :disabled="examineTime != undefined" style="width: 100%">
                            <el-option v-for="opt in ykyfData" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item prop="SQR" label="申请人">
                        <el-select v-model="formData.SQR" clearable filterable
                            :disabled="examineTime != undefined" style="width: 100%"
                            placeholder="请选择申请人" allow-create class="SQR">
                            <el-option v-for="opt in personnelIfon" :key="opt.RYBM" :label="opt.RYXM" :value="opt.RYBM" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input v-model="formData.BZ" type="string"
                            :disabled="examineTime != undefined" placeholder="请输入备注信息"
                            class="specs_frame" @keydown.enter="handleKeyDown($event, null, 'PM', false)" />
                    </el-form-item>
                </el-form>
            </el-scrollbar>
        </div>
        <div class="yd-card-body">
            <el-form :model="state" :rules="mxRules" ref="mxFormRef">
                <el-table ref="tableref" :data="state.ykData" class="color-table"
                    :header-cell-style="{ borderColor: '#e0e0e0' }" :cell-style="{ borderColor: '#e0e0e0' }"
                    height="calc(100vh - 300px)">
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
                        <el-table-column prop="YPMC" label="品名" align="center" width="170">
                            <template #default="scope">
                                <SelectTable
                                    :disabled="!scope.row.isEdit || examineTime != undefined" :agrs="scope.row"
                                    :data="ypInfo" :max-height="270" :tableWidth="900" :defaultSelectVal="scope.row.YPBM"
                                    :isShowQuery="false" :columns="[
                                        { label: '编码', prop: 'YPBM', width: '130' },
                                        { label: '品名', prop: 'YPMC', width: '150' },
                                        { label: '包装', prop: 'YKBZ', width: '60' },
                                        { label: '规格', prop: 'GG', width: '150' },
                                        { label: '单位', prop: 'YKDW', width: '60' },
                                        { label: '产地', prop: 'CD', width: '200' },
                                        { label: '批准文号', prop: 'PZWH', width: '150' },
                                    ]" :keywords="{ label: 'YPMC', value: 'YPBM' }" :isShowFirstColumn="false"
                                    :isShowPagination="true" :isKeyup="true" :total="ypInfo.length" filterable
                                    @radioChange="singleSelectChange" class="PM" @blur="handleBlur(scope, 'SL')" />
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
                    <el-table-column prop="SL" label="调出数量" align="center" width="80">
                        <template #default="scope">
                            <el-form-item :prop="'ykData.' + scope.$index + '.SL'"
                                :rules="mxRules.SL">
                                <el-input-number @change="slhandleChange(scope.row)" :controls="false" :min="0"
                                    v-model="scope.row.SL" type="number"
                                    :disabled="!scope.row.isEdit || examineTime != undefined" style="width: 100%" class="SL"
                                    @keydown.enter="handleKeyDown($event, scope, 'BZ', false, scope.row.SL, 'SL')"></el-input-number>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="DW" label="单位" align="center" width="60">
                        <template #default="{ row }">
                            <span>{{ row.DW }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="JJ" label="进价" align="center" width="150">
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
                    <el-table-column prop="LSJ" label="零售价" align="center" width="150">
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
                    <el-table-column prop="HWMC" label="货位" align="center" width="130">
                        <template #default="{ row }">
                            <span>{{ row.HWMC }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="GGKC" label="规格库存" align="center" width="90">
                        <template #default="{ row }">
                            <span>{{ row.GGKC }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="PCKC" label="批次库存" align="center" width="90">
                        <template #default="{ row }">
                            <span>{{ row.PCKC }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="GJBM" label="国家医保编码" align="center" width="150">
                        <template #default="{ row }">
                            <span>{{ row.GJBM }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="GJMC" label="国家医保名称" align="center" width="150">
                        <template #default="{ row }">
                            <span>{{ row.GJMC }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="BZ" label="备注" align="center" width="150">
                        <template #default="scope">
                            <el-input v-model="scope.row.BZ" type="string"
                                :disabled="!scope.row.isEdit || examineTime != undefined" style="width: 100%" class="BZ"
                                @keydown.enter="handleKeyDown($event, scope, 'PM', true)"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="操作" width="150" fixed="right" align="center">
                        <template #default="scope">
                            <div style="display: flex; justify-content: space-around">
                                <el-button link v-blur type="primary" size="small"
                                    :disabled="examineTime != undefined" round @click="addYk">
                                    新增
                                </el-button>
                                <el-button link v-blur type="primary" size="small"
                                    :disabled="examineTime != undefined"
                                    @click="editYk(scope.row)">
                                    {{ scope.row.editTxt }}
                                </el-button>
                                <el-popconfirm title="您确定删除这条记录吗?"
                                    :disabled="examineTime != undefined"
                                    @confirm="deleteYk(scope.$index)">
                                    <template #reference>
                                        <el-button link v-blur type="primary" v-if="state.ykData.length !== 1"
                                            :disabled="examineTime != undefined"
                                            size="small">删除</el-button>
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
        <el-form :model="formData" :inline="true" label-width="90px" :rules="rules" ref="ruleFormRefs" class="bottom-form">
            <el-form-item label="单据类型" prop="DJLX">
                <el-select v-model="formData.DJLX" placeholder="请选择单据类型"
                    :disabled="examineTime != undefined" clearable style="width: 100%">
                    <el-option v-for="opt in djlxOptions" :key="opt.value" :label="opt.label"
                        :value="opt.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="交易类型" prop="JYLX">
                <el-select v-model="formData.JYLX" placeholder="请选择交易类型"
                    :disabled="examineTime != undefined" clearable style="width: 100%">
                    <el-option v-for="opt in jylxOptions" :key="opt.value" :label="opt.label"
                        :value="opt.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开单人" prop="KDRBM">
                <el-select v-model="formData.KDRBM" placeholder="请选择开单人"
                    :disabled="examineTime != undefined" clearable style="width: 100%">
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
            <el-button style="margin-right: 30px; padding: 0 35px"
                :disabled="examineTime != undefined" type="primary"
                @click="onSubmit">保存</el-button>
            <el-button style="margin-right: 30px; padding: 0 35px"
                :disabled="receiptType == 'create' && !saveSuccess" @click="examine"
                type="primary">发送审核</el-button>
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
import { ykDcdEdit, ykDcdCreate, getDcdList, getDcdMx, cxYfYk } from '/@/api/backend/yk/dcd'
import { useAdminInfo } from '/@/stores/adminInfo'
import { validateForm } from '/@/utils/common'
import { useRouter, useRoute } from 'vue-router'
import useCurrentInstance from '/@/utils/useCurrentInstance'
import { useNavTabs } from '/@/stores/navTabs'

defineOptions({
    name: 'ykzx/dcd/edit',
})

const { proxy } = useCurrentInstance()
const navTabs = useNavTabs()
const router = useRouter()
const route = useRoute()
const ruleFormRef = ref()
const ruleFormRefs = ref()
const personnelIfon = ref([])
const adminInfo = useAdminInfo()
const ypInfo = ref([])
const ykyfData = ref([])
const saveSuccess = ref(false)

let cKFBM = route.query.cKFBM
let ID = route.query.ID
let receiptType = route.query.type

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
    JSKFBM: '',
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
            GGKC: '',
            DW: '',
            DWBZ: '',
            CPPH: '',
            SL: '',
            JHJ: '',
            JHJE: '',
            LSJ: '',
            LSJE: '',
            SCRQ: '',
            KCID: '',
            PCKC: '',
            YXQ: '',
            CD: '',
            PZWH: '',
            BZ: '',
            GJBM: '',
            GJMC: '',
            isEdit: true,
            editTxt: '确定',
        }
    ],
})

const slhandleChange = (row: any) => {
    row.JHJE = (row.SL * row.JHJ).toFixed(2)
    row.LSJE = (row.LSJ * row.SL).toFixed(2)
}

const tableref = ref(null)
const handleKeyDown = (event: any, scope: any, nextClass: string, nextRow: boolean, val = '', thisClass = '') => {
    if (event.keyCode === 13) {
        // 按下回车键聚焦到下一个输入框
        if (scope) {
            if (nextRow && scope.$index + 1 == state.ykData.length) {
                addYk()
            }
            if (nextRow) {
                nextTick(() => {
                    if (nextClass) {
                        const rowIndex = nextRow && scope.$index + 1 < state.ykData.length ? scope.$index + 1 : scope.$index
                        let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${nextClass} .el-input__inner`)
                        if (ele) {
                            ele.focus()
                        }
                    }
                })
            } else {
                if (nextClass) {
                    const rowIndex = scope.$index
                    if (thisClass) {
                        //需要校验
                        if (val) {
                            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${nextClass} .el-input__inner`)
                            if (ele) {
                                ele.focus()
                            }

                        } else {
                            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${thisClass} .el-input__inner`)
                            if (ele) {
                                ele.blur()
                                nextTick(() => {
                                    ele.focus()
                                })
                            }
                        }
                    } else {
                        //不需要校验，则焦点直接定位到下一个输入框
                        let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${nextClass} .el-input__inner`)
                        if (ele) {
                            ele.focus()
                        }
                    }
                }
            }
        } else {
            if (nextClass) {
                const rowIndex = 0
                let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${nextClass} .el-input__inner`)
                if (ele) {
                    ele.focus()
                }
            }
        }
    }
}

const handleBlur = (scope: any, nextClass: string) => {
    if (scope) {
        if (nextClass) {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${nextClass} .el-input__inner`)
            if (ele) {
                ele.focus()
            }
        }
    }
}

const getCureentTime = async () => {
    const res = await getxtTime()
    formData.KDRQ = res.data
    formData.KDRBM = adminInfo.rybm
    formData.KDRXM = adminInfo.nickname
}

const getYpInfos = () => {
    getYpInfo({ agrs: { KFBM: cKFBM, YWLX: '药库库存明细' } }).then((r: any) => {
        ypInfo.value = r.data
    })
}
getYpInfos()
getCureentTime()

const singleSelectChange = (row: any, agrs: any) => {
    console.log(row)
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
    agrs.PCKC = row.YKPHKC
    agrs.GGKC = row.YKGGKC
    agrs.CPPH = row.CPPH
    agrs.HWMC = row.HWMC
    agrs.KCID = row.YKKCID
    agrs.YXQ = row.YXQ
    agrs.SCRQ = row.SCRQ
    agrs.JHJE = ''
    agrs.LSJE = ''
    agrs.SL = ''
}

const addYk = () => {
    state.ykData.push({
        PXH: 1 + state.ykData.length,
        YPBM: '',
        YPMC: '',
        GG: '',
        GGKC: '',
        DW: '',
        DWBZ: '',
        CPPH: '',
        SL: '',
        JHJ: '',
        JHJE: '',
        LSJ: '',
        LSJE: '',
        SCRQ: '',
        KCID: '',
        PCKC: '',
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
    const formRefs = [ruleFormRef.value, ruleFormRefs.value]
    validateForm(formRefs).then(async (valid) => {
        if (valid.every((result) => result)) {
            const validRows = state.ykData.filter((row: any) => row.YPMC !== '')
            const { ID, DJID, cKFBM } = route.query
            let createdata, editdata, r, data, res

            if (receiptType == 'edit') {
                editdata = {
                    agrs: {
                        ZB: { ...formData, ID: ID || IDs.value, DJID: DJID || DJIDs.value, KFBM: cKFBM || KFBMs.value },
                        MXB: validRows,
                        LX: '保存',
                    },
                }
                const r = await ykDcdEdit(editdata)
                if (r.code == 1) {
                    saveSuccess.value = true
                    ElMessage.success('修改成功')
                    data = {
                        agrs: {
                            DJID: r.data.DJID,
                            KFBM: r.data.KFBM,
                            DJH: r.data.DJH,
                        },
                    }
                    res = await getDcdMx(data)
                    state.ykData = res.data
                    state.ykData.forEach((item: any) => {
                        item.isEdit = true
                        item.editTxt = '确认'
                    })
                } else {
                    ElMessage.error(r.msg)
                }
            } else {
                createdata = {
                    agrs: {
                        ZB: { ...formData, KFBM: cKFBM },
                        MXB: validRows,
                    },
                }
                r = await ykDcdCreate(createdata)
                if (r.code == 1) {
                    saveSuccess.value = true
                    ElMessage.success('新增成功')
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
                    res = await getDcdMx(data)
                    state.ykData = res.data
                    state.ykData.forEach((item: any) => {
                        item.isEdit = true
                        item.editTxt = '确认'
                    })
                    formData.KDRQ = r.data.KDRQ
                    formData.JYLX = r.data.JYLX
                    formData.BZ = r.data.BZ
                    formData.DJLX = r.data.DJLX
                    formData.SHRQ = r.data.SHRQ
                    formData.KDRXM = r.data.KDRXM
                    formData.SHDH = r.data.SHDH
                    formData.DJH = r.data.DJH
                    formData.SQR = r.data.SQR
                    formData.JSKFBM = r.data.JSKFBM
                } else {
                    ElMessage.error(r.msg)
                }
            }
        }
    })
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

    const handleExamine = async (data: any) => {
        let flag = state.ykData.some((item: any) => !item.ID)
        console.log('flag: ', flag)
        if (flag) {
            ElMessage.error('新增数据必须先保存再审核')
            return
        }

        const { code, data: responseData } = await ykDcdEdit(data)
        if (code === 1) {
            examineTime.value = responseData.SHRQ
            examinePeople.value = responseData.SHRBM
            ElMessage.success('审核成功')
            // emit('refresh')
        }
    }

    const showConfirmDialog = (message: any, options: any) => {
        return new Promise((resolve, reject) => {
            ElMessageBox.confirm(message, '提示', options)
                .then(() => {
                    resolve(true)
                })
                .catch(() => {
                    reject(false)
                })
        })
    }

    if (ID) {
        const { DJID, cKFBM, DJH, ID } = route.query
        const data = {
            agrs: {
                ZB: { DJID, KFBM: cKFBM, DJH, ID },
                LX: '审核',
            },
        }
        try {
            let ret = await showConfirmDialog(confirmMessage, confirmOptions)
            if (ret) {
                await handleExamine(data)
            }
        } catch (error) { }
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
            },
        }
        try {
            let ret = await showConfirmDialog(confirmMessage, confirmOptions)
            if (ret) {
                await handleExamine(data)
            }
        } catch (error) { }
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

const rules = reactive({
    KDRQ: [{ required: true, message: '开单时间不能为空', trigger: 'blur' }],
    DJLX: [{ required: true, message: '单据类型不能为空', trigger: 'change' }],
    JYLX: [{ required: true, message: '交易类型不能为空', trigger: 'change' }],
    KDRBM: [{ required: true, message: '交易类型不能为空', trigger: 'change' }],
    SQR: [{ required: true, message: '申请人不能为空', trigger: 'blur' }],
    JSKFBM: [{ required: true, message: '接收库房不能为空', trigger: 'change' }],
})

const validateSL = (rule: any, value: any, callback: any) => {
    if (value === '' || value === 0 || value === undefined) {
        callback(new Error(''))
    } else {
        callback()
    }
}

const mxRules = reactive({
    SL: [{ required: true, validator: validateSL, trigger: 'blur' }],
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

const getlook = async () => {
    const res = await getDcdMx({
        agrs: {
            DJID: route.query.DJID,
            KFBM: route.query.cKFBM,
            DJH: route.query.DJH,
        },
    })
    const r = await getDcdList({
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
    formData.JYLX = r.data[0].JYLX
    formData.BZ = r.data[0].BZ
    formData.DJLX = r.data[0].DJLX
    formData.SHRQ = r.data[0].SHRQ
    formData.SHDH = r.data[0].SHDH
    formData.DJH = r.data[0].DJH
    formData.JSKFBM = r.data[0].JSKFBM
    formData.SQR = r.data[0].SQR
    examineTime.value = r.data[0].SHRQ
    examinePeople.value = r.data[0].SHRBM
}

onMounted(() => {
    receiptType = route.query.type
    if (receiptType != 'create') {
        getlook()
    }
    if (receiptType == 'create') {

    }
    // 获取人员信息
    getrylist({ agrs: {} }).then((r) => {
        personnelIfon.value = r.data.options
    })
    // 获取库房
    cxYfYk({ agrs: 1 }).then((r) => {
        ykyfData.value = r.data
    })
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

:deep(.yd-card-body .el-form-item) {
    margin-bottom: 0;
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

:deep(.el-dialog__body) {
    // padding: 0 10px;
}

.el-form-item :deep(.el-form-item__content) {
    width: 220px;
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
    }
}
</style>
