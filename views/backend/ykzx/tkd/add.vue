<template>
    <div class="layout-box">
        <div class="form-top">
            <el-form :model="formData" :inline="true" label-width="100px" :rules="rules" ref="ruleFormRef">
                <el-form-item prop="KDRQ" label="开单时间">
                    <el-date-picker v-model="formData.KDRQ" type="datetime" placeholder="请选择开单日期"
                        style="width: 100%" />
                </el-form-item>
                <el-form-item prop="SHRQ" label="审核时间">
                    <el-date-picker v-model="examineTime" type="datetime" :disabled="true" placeholder="请选择审核日期"
                        style="width: 100%" />
                </el-form-item>

                <el-form-item label="单据号">
                    <el-input v-model="formData.DJH" type="string" :disabled="true" placeholder="请输入单据号" />
                </el-form-item>

                <el-form-item prop="JSRBM" label="接收人">
                    <el-select filterable v-model="formData.JSRBM" placeholder="请选择接收人" clearable style="width: 100%"
                        class="JSRBM" @keyup.enter="handleFocus('KSBM')">
                        <el-option v-for="opt in personnelIfon" :key="opt.RYBM" :label="opt.RYXM"
                            :value="opt.RYBM"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="申请部门" prop="KSBM">
                    <el-select filterable v-model="formData.KSBM" placeholder="请选择" style="width: 100%"
                        @change="changeYpinfo" class="KSBM" @keyup.enter="handleFocus('SQR')">
                        <el-option v-for="opt in ykyfData" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="QLR" label="申请人">
                    <!-- <el-popover placement="bottom" :width="200" trigger="click" popper-class="ba-popover">
                        <template #reference>
                            <el-input v-model="formData.QLR" type="string"
                                :disabled="examineTime != undefined" placeholder="请输入申请人"
                                @click="handleInputClick" />
                        </template>
                        <el-table @cell-click="handleCellClick" :data="personnelIfon" height="200"
                            :row-class-name="tableRowClassName" :cell-style="{ border: '0' }"
                            :header-cell-style="{ border: '0', background: 'transparent' }">
                            <el-table-column width="150" prop="RYXM" />
                        </el-table>
                    </el-popover> -->
                    <el-select v-model="formData.QLR" clearable filterable style="width: 100%"
                        placeholder="请选择申请人" @blur="sqrBlur" allow-create class="SQR"
                        @keyup.enter="handleFocus('specs_frame')">
                        <el-option v-for="opt in personnelIfon" :key="opt.RYBM" :label="opt.RYXM" :value="opt.RYBM" />
                    </el-select>
                </el-form-item>

                <el-form-item label="备注">
                    <el-input v-model="formData.BZ" type="string" placeholder="请输入备注信息"
                        class="specs_frame" @keydown.enter="handleKeyDown($event, null, 'PM', false, formData.BZ)" />
                </el-form-item>
            </el-form>
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
                                <span v-if="mode === '2'">{{ scope.row.YPMC }}</span>
                                <SelectTable v-else :agrs="scope.row" :data="ypInfo" :max-height="270" :tableWidth="800"
                                    :defaultSelectVal="scope.row.YPBM" :isShowQuery="false" :columns="[
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
                                    ]" :keywords="{ label: 'YPMC', value: 'YPBM', key: 'YFKCID' }"
                                    :isShowFirstColumn="false" :isShowPagination="false" :isKeyup="true" filterable
                                    @radioChange="singleSelectChange" class="PM" @blur="handleBlur(scope, 'SL')" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="GG" label="规格" align="center" width="150">
                            <template #default="{ row }">
                                <span>{{ row.GG }}</span>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column prop="BMKCID" label="库存ID" align="center" width="70">
                        <template #default="{ row }">
                            <span>{{ row.BMKCID }}</span>
                        </template>
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
                    <el-table-column prop="SL" label="数量" align="center" width="80">
                        <template #default="scope">
                            <el-form-item :prop="'ykData.' + scope.$index + '.SL'"
                                :rules="mxRules.SL">
                                <el-input-number @change="slhandleChange(scope.row)" :controls="false" :min="0"
                                    v-model="scope.row.SL" type="number"
                                    :disabled="!scope.row.isEdit || examineTime != undefined" class="SL" style="width: 100%"
                                    @keydown.enter="handleKeyDown($event, scope, 'BZ', false, scope.row.SL, 'SL')"></el-input-number>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="DW" label="单位" align="center" width="60">
                        <template #default="{ row }">
                            <span>{{ row.DW }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="jinjia" label="进价" align="center" width="150">
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
                    <el-table-column prop="address" label="零售价" align="center" width="150">
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

                    <el-table-column prop="YKSL" label="库房库存" align="center" width="90">
                        <template #default="{ row }">
                            <span>{{ row.YKSL }}</span>
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
                                @keydown.enter="handleKeyDown($event, scope, 'PM', true, scope.row.BZ)"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="操作" width="150" fixed="right" align="center">
                        <template #default="scope">
                            <div style="display: flex; justify-content: space-around">
                                <el-button link v-blur type="primary" size="small"
                                    :disabled="mode === '2' || JYLX === '1'" round @click="addYk">
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
        <el-form :model="formData" :inline="true" label-width="90px" ref="ruleFormRefs" :rules="rules" class="bottom-form">
            <el-form-item label="单据类型" prop="DJLX">
                <el-select v-model="formData.DJLX" placeholder="请选择单据类型" clearable style="width: 100%">
                    <el-option v-for="opt in djlxOptions" :key="opt.value" :label="opt.label"
                        :value="opt.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="交易类型" prop="JYLX">
                <el-select v-model="formData.JYLX" placeholder="请选择交易类型" clearable style="width: 100%">
                    <el-option v-for="opt in jylxOptions" :key="opt.value" :label="opt.label"
                        :value="opt.value"></el-option>
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
        </el-form>
        <div class="yd-from-footer btn-box">
            <el-button style="margin-right: 30px; padding: 0 35px" type="primary"
                @click="onSubmit">保存</el-button>
            <el-button style="margin-right: 30px; padding: 0 35px"
                :disabled="(receiptType == 'create' && !saveSuccess)" @click="examine"
                type="primary">发送审核</el-button>
            <el-button style="margin-right: 30px; padding: 0 35px" type="primary">打印</el-button>
            <el-button plain style="padding: 0 35px" @click="canleBtn">取消</el-button>
        </div>
        <Yyckd ref="yyckdRef" :kfbm="cKFBM" @selectedMx="selectedMx" @cancel="cancelCreateTkd"></Yyckd>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, nextTick } from 'vue'
import SelectTable from '/@/components/select-table/selectTable.vue'
import { getrylist, getxtTime, getYpInfo } from '/@/api/common'
import { ElMessage, ElMessageBox } from 'element-plus'
import { validateForm } from '/@/utils/common'
import { getTkdList, ykTkdEdit, ykTkdCreate, ykTkdMx, cxYfYk } from '/@/api/backend/yk/tkd'
import { useAdminInfo } from '/@/stores/adminInfo'
import { useRouter, useRoute } from 'vue-router'
import useCurrentInstance from '/@/utils/useCurrentInstance'
import { useNavTabs } from '/@/stores/navTabs'
import Yyckd from './yyckd.vue'

defineOptions({
    name: 'ykzx/tkd/add',
})

const { proxy } = useCurrentInstance()
const navTabs = useNavTabs()
const router = useRouter()
const route = useRoute()
const ruleFormRef = ref()
const ruleFormRefs = ref()
const personnelIfon = ref([])
const ypInfo = ref([])
const adminInfo = useAdminInfo()
const ykyfData = ref([])
const saveSuccess = ref(false)

let cKFBM = route.query.cKFBM
let ID = route.query.ID
let receiptType = route.query.type
let mode = route.query.mode
let JYLX = route.query.JYLX

const yyckdRef = ref()

const formData = reactive({
    CGRBM: '',
    KDRQ: '',
    BZ: '',
    JYLX: 0,
    DJLX: 0,
    SHRQ: '',
    KDRXM: '',
    KDRBM: '',
    SHDH: '',
    DJH: '',
    JSRBM: '',
    KSBM: '',
    QLR: '',
    CKDJH: ''
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
            SL: '',
            ZKL: '',
            JHJ: '',
            JHJE: '',
            LSJ: '',
            LSJE: '',
            SCRQ: '',
            YXQ: '',
            JHJCE: '',
            CD: '',
            PZWH: '',
            TMH: '',
            SCJHJ: '',
            BZ: '',
            GJBM: '',
            GJMC: '',
            isEdit: true,
            editTxt: '确定',
        }
    ]
})

const slhandleChange = (row: any) => {
    row.JHJE = (row.SL * row.JHJ).toFixed(2)
    row.LSJE = (row.LSJ * row.SL).toFixed(2)
}

const changeYpinfo = async (val: string) => {
    const res = await getYpInfo({ agrs: { KFBM: cKFBM, YWLX: '药房库存明细', YFBM: val } })
    ypInfo.value = res.data
}

const selectedMx = (data: any) => {
    formData.KSBM = data.ksbm
    formData.CKDJH = data.djh
    changeYpinfo(data.ksbm)
    state.ykData = data.data
    state.ykData.forEach((item: any) => {
        item.isEdit = true
        item.editTxt = '确认'
    })
}

const sqrBlur = (e: any) => {
    let value = e.target.value
    if (value) {
        formData.QLR = value
    }
}

const tableref = ref(null)
const handleKeyDown = (event: any, scope: any, nextClass: string, nextRow: boolean, val: any, thisClass = '') => {
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

getCureentTime()

const singleSelectChange = (row: any, agrs: any) => {
    agrs.YPBM = row.YPBM
    agrs.YPMC = row.YPMC
    agrs.DWBZ = row.YKBZ
    agrs.GG = row.GG
    agrs.DW = row.YKDW
    agrs.CD = row.CD
    agrs.PZWH = row.PZWH
    agrs.GJMC = row.GJMC
    agrs.GJBM = row.GJBM
    agrs.JHJ = row.SCJHJ
    agrs.LSJ = row.SCLSJ
    agrs.TMH = row.TXM
    agrs.PHKC = row.PHKC
    agrs.KCGG = row.GGKC
    agrs.HWBM = row.HWBM
    agrs.BMKCID = row.YFKCID
    agrs.KCID = row.YKKCID
    agrs.YXQ = row.YXQ
    agrs.SCRQ = row.SCRQ
    agrs.CPPH = row.CPPH
    agrs.YKSL = row.YKSL
    agrs.HWMC = row.HWMC
    agrs.SL = ''
    agrs.JHJE = ''
    agrs.LSJE = ''
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
        HWBM: '',
        SL: '',
        ZKL: '',
        JHJ: '',
        JHJE: '',
        LSJ: '',
        LSJE: '',
        SCRQ: '',
        YXQ: '',
        JHJCE: '',
        CD: '',
        PZWH: '',
        TMH: '',
        SCJHJ: '',
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

const updateData = async (r) => {
    saveSuccess.value = true
    ElMessage.success('保存成功')
    DJHs.value = r.data.DJH
    DJIDs.value = r.data.DJID
    IDs.value = r.data.ID
    KFBMs.value = r.data.KFBM
    let data = {
        agrs: {
            DJID: r.data.DJID,
            KFBM: r.data.KFBM,
            DJH: r.data.DJH,
        },
    }
    let res = await ykTkdMx(data)
    state.ykData = res.data
    state.ykData.forEach((item) => {
        item.isEdit = true
        item.editTxt = '确认'
    })

    formData.KDRQ = r.data.KDRQ
    formData.CGRBM = r.data.CGRBM
    formData.JYLX = r.data.JYLX
    formData.BZ = r.data.BZ
    formData.DJLX = r.data.DJLX
    formData.SHRQ = r.data.SHRQ
    formData.KDRXM = r.data.KDRXM
    formData.SHDH = r.data.SHDH
    formData.DJH = r.data.DJH
    formData.JSRBM = r.data.JSRBM
    formData.QLR = r.data.QLR
    formData.KSBM = r.data.KSBM
}

// 保存
const onSubmit = async () => {
    const formRefs = [ruleFormRef.value, ruleFormRefs.value]
    validateForm(formRefs).then(async (valid) => {
        if (valid.every((result) => result)) {
            // const { ID, DJID, KFBM } = drawerData.value.drugInfo
            const validRows = state.ykData.filter((row: any) => row.YPMC !== '')
            const { ID, DJID, cKFBM } = route.query
            let createdata, editdata, r
            if (receiptType == 'edit') {
                editdata = {
                    agrs: {
                        ZB: { ...formData, ID: ID || IDs.value, DJID: DJID || DJIDs.value, KFBM: cKFBM || KFBMs.value },
                        MXB: validRows,
                        LX: '保存',
                    },
                }
                r = await ykTkdEdit(editdata)
                //emit('refresh')
                ElMessage.success('修改成功')
                let data = {
                    agrs: {
                        DJID: r.data.DJID,
                        KFBM: r.data.KFBM,
                        DJH: r.data.DJH,
                    },
                }
                let res = await ykTkdMx(data)
                state.ykData = res.data
                state.ykData.forEach((item: any) => {
                    item.isEdit = true
                    item.editTxt = '确认'
                })
            } else if (receiptType == 'create') {
                createdata = {
                    agrs: {
                        ZB: { ...formData, KFBM: cKFBM?.toString() },
                        MXB: validRows,
                    },
                }
                r = await ykTkdCreate(createdata)
                if (r.code == 1) {
                    await updateData(r)
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

    const handleExamine = async (data) => {
        let flag = state.ykData.some((item) => !item.ID)
        if (flag) {
            ElMessage.error('新增数据必须先选择药品后保存再审核')
            return
        }

        const { code, data: responseData } = await ykTkdEdit(data)
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
    cancelCreateTkd()
}

/**
 * 取消创建退库单
 */
const cancelCreateTkd = () => {
    navTabs.closeTab(route)
    proxy.eventBus.emit('onTabViewClose', route)
    if (navTabs.state.activeRoute?.path === route.path) {
        toLastTab()
    } else {
        navTabs.setActiveRoute(navTabs.state.activeRoute!)
    }
}

const rules = reactive({
    KDRQ: [{ required: true, message: '开单时间不能为空', trigger: 'blur' }],
    DJLX: [{ required: true, message: '单据类型不能为空', trigger: 'change' }],
    JYLX: [{ required: true, message: '交易类型不能为空', trigger: 'change' }],
    KSBM: [{ required: true, message: '请领部门不能为空', trigger: 'change' }],
    JSRBM: [{ required: true, message: '接收人不能为空', trigger: 'change' }],
    QLR: [{ required: true, message: '申请人不能为空', trigger: 'blur' }],
    KDRBM: [{ required: true, message: '开单人不能为空', trigger: 'change' }],
})

const validateSL = (rule: any, value: any, callback: any) => {
    if (value === '' || value === null || value === 0 || value === undefined) {
        callback(new Error(''))
    } else {
        callback()
    }
}

const mxRules = reactive({
    SL: [{ required: true, validator: validateSL, trigger: 'blur' }],
})

const getlook = async () => {
    const res = await ykTkdMx({
        agrs: {
            DJID: route.query.DJID,
            KFBM: route.query.cKFBM,
            DJH: route.query.DJH,
        },
    })
    const r = await getTkdList({
        agrs: {
            ID,
        },
    })
    state.ykData = res.data
    state.ykData.forEach((item: any) => {
        item.isEdit = true
        item.editTxt = '确认'
    })
    await changeYpinfo(r.data[0].KSBM)
    formData.KSBM = r.data[0].KSBM
    formData.KDRQ = r.data[0].KDRQ
    formData.CGRBM = r.data[0].CGRBM
    if (!mode) {
        formData.JYLX = r.data[0].JYLX
    }
    formData.BZ = r.data[0].BZ
    formData.DJLX = r.data[0].DJLX
    formData.JSRBM = r.data[0].JSRBM
    formData.QLR = r.data[0].QLR
    formData.SHRQ = r.data[0].SHRQ
    formData.KDRXM = r.data[0].KDRXM
    formData.SHDH = r.data[0].SHDH
    formData.DJH = r.data[0].DJH
    examineTime.value = r.data[0].SHRQ
    examinePeople.value = r.data[0].SHRBM
}

const handleFocus = (nextClass: string) => {
    let ele = ruleFormRef.value.$el.querySelector(`.${nextClass} .el-input__inner`)
    if (ele) {
        ele.focus()
    }
}

onMounted(() => {
    receiptType = route.query.type
    if (receiptType != 'create') {
        getlook()
    }
    if (receiptType == 'create') {
        handleFocus('JSRBM')
    }
    if (mode == '1') {
        formData.JYLX = 0
    } else if (mode == '2') {
        formData.JYLX = 1
    }
    // 获取人员信息
    getrylist({ agrs: {} }).then((r) => {
        personnelIfon.value = r.data.options
    })
    cxYfYk({ agrs: 2 }).then((r: any) => {
        ykyfData.value = r.data
    })
    if (mode == '2') {
        setTimeout(() => {
            yyckdRef.value.show()
        }, 500)
        nextTick(() => {

        })
    }
})

</script>

<style lang="scss" scoped>
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
