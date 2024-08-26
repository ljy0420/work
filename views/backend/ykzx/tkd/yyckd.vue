<template>
    <el-dialog v-model="state.show" title="调用出库单" width="60%" class="ba-operate-dialog jhdyy-edit" draggable
        :close-on-click-modal="false" @close="onClose">
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']">
                调用出库单
            </div>
        </template>
        <el-scrollbar class="ba-table-form-scrollbar">
            <div class="yyckd-box">
                <div v-if="!showCkdMx" class="ckd-list-container">
                    <div class="ckd-search">
                        <el-form :model="dialogformData" :inline="true" label-width="75px" ref="ruleFormRef">
                            <el-form-item>
                                <el-date-picker v-model="dialogformData.TIME" type="daterange" :teleported="false"
                                    :editable="false" format="YYYY-MM-DD " value-format="YYYY-MM-DD" range-separator="—"
                                    end-placeholder="结束时间" start-placeholder="开始时间" />
                            </el-form-item>
                            <el-form-item>
                                <el-select v-model="dateOption" placeholder="请选择" @change="dataChange" class="date-select">
                                    <el-option v-for="item in dateData" :key="item.value" :label="item.label"
                                        :value="item.value" />
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-input v-model="dialogformData.keywords" placeholder="订单号/企业/联系人/采购员" class="kw-input"
                                    clearable>
                                    <template #prefix>
                                        <Icon name="el-icon-Search" size="16" color="var(--el-input-icon-color)" />
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="getCkdsList">
                                    查询
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <el-table ref="tableref" :data="jhdtableData" :header-row-class-name="'custom-header'" stripe
                        style="width: 100%" height="510px" class="ba-data-table w100" @row-click="ckdhandleRowClick"
                        @row-dblclick="ckdRowDbclick" highlight-current-row>
                        <el-table-column prop="XMBM" label="选择" width="70" align="center">
                            <template #default="scope">
                                <el-radio v-model="jhdRadio" :label="scope.row.ID">&nbsp;</el-radio>
                            </template>
                        </el-table-column>
                        <el-table-column prop="KDRQ" label="开单日期" align="center" width="150"> </el-table-column>
                        <el-table-column prop="DJH" label="单据号" align="center" width="130">
                            <template #default="scope">
                                <span :style="{ color: scope.row.ID === jhdRadio ? 'red' : '' }">{{ scope.row.DJH }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="MDYF" label="请领部门" align="center" width="115">
                            <template #default="scope">
                                <span :style="{ color: scope.row.ID === jhdRadio ? 'red' : '' }">{{ scope.row.MDYF }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="KDRXM" label="开单人" align="center" width="90"> </el-table-column>
                        <el-table-column prop="CGRXM" label="采购人" align="center" width="90">
                            <template #default="scope">
                                <span :style="{ color: scope.row.ID === jhdRadio ? 'red' : '' }">{{ scope.row.CGRXM
                                }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="PZRXM" label="批准人" align="center" width="90">
                            <template #default="scope">
                                <span :style="{ color: scope.row.ID === jhdRadio ? 'red' : '' }">{{ scope.row.PZRXM
                                }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="CGYXM" label="仓管员" align="center" width="90">
                            <template #default="scope">
                                <span :style="{ color: scope.row.ID === jhdRadio ? 'red' : '' }">{{ scope.row.CGYXM
                                }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="GJZE" label="进货金额" align="center" width="100">
                            <template #default="scope">
                                <span :style="{ color: scope.row.ID === jhdRadio ? 'red' : '' }">{{ scope.row.GJZE }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="LSZE" label="零售金额" align="center" width="100">
                            <template #default="scope">
                                <span :style="{ color: scope.row.ID === jhdRadio ? 'red' : '' }">{{ scope.row.LSZE }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" align="center" width="90">
                            <template #default="{ row }">
                                <div @click="lookDetail(row)"
                                    :style="{ color: row.ID === jhdRadio ? 'red' : '', cursor: row.ID ? 'pointer' : 'pointer' }">
                                    查看明细
                                </div>
                            </template>
                        </el-table-column>

                        <template #empty>
                            <el-empty description="暂无数据" />
                        </template>
                    </el-table>
                    <div class="ss-pagination">
                        <el-pagination v-model:current-page="dialogformData.page" v-model:page-size="dialogformData.size"
                            :page-sizes="[20, 30, 50, 100]" :background="false" align="center"
                            layout="total, sizes, prev, pager, next, jumper" :total="dialogformData.count"
                            @size-change="jhdhandleSizeChange" @current-change="jhdhandleCurrentChange" />
                    </div>
                </div>
                <div v-else class="ckd-mx-container">
                    <div class="ckdmx-search">
                        <el-form-item label="检索：">
                            <el-input v-model="dialogformData.mxKeywords" placeholder="请输入" class="kw-input" clearable>
                                <template #prefix>
                                    <Icon name="el-icon-Search" size="16" color="var(--el-input-icon-color)" />
                                </template>
                            </el-input>
                        </el-form-item>
                    </div>
                    <el-table ref="ckdmxRef" :data="jhdmxData" class="color-table"
                        :header-cell-style="{ borderColor: '#e0e0e0' }"
                        :cell-style="{ borderColor: '#e0e0e0', background: 'transparent' }" height="560px">
                        <el-table-column type="selection" width="55" align="center" />
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
                                    <span>{{ scope.row.YPMC }}</span>
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
                        <el-table-column prop="SL" label="库房数量" align="center" width="80">
                            <template #default="{ row }">
                                <span>{{ row.FYSL }}</span>
                            </template>
                        </el-table-column>

                        <el-table-column prop="DW" label="单位" align="center" width="60">
                            <template #default="{ row }">
                                <span>{{ row.DW }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="JBDWSL" label="基本单位数量" align="center" width="100">
                            <template #default="{ row }">
                                <span>{{ row.JBDWSL }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="JBDW" label="基本单位" align="center" width="100">
                            <template #default="{ row }">
                                <span>{{ row.JBDW }}</span>
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
                        <el-table-column prop="TMH" label="条码号" align="center" width="150">
                            <template #default="{ row }">
                                <span>{{ row.TMH }}</span>
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
                            <template #default="{ row }">
                                <span>{{ row.BZ }}</span>
                            </template>
                        </el-table-column>

                        <template #empty>
                            <el-empty description="暂无数据" />
                        </template>
                    </el-table>
                </div>
            </div>
        </el-scrollbar>
        <template #footer>
            <div class="yd-from-footer">
                <el-button class="btn-form-cancel" @click="onCancel">{{ state.cancelBtn }}</el-button>
                <el-button class="btn-form-save" type="primary" :disabled="!jhdRadio" @click="onConfirm">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getChdList, ykChdMx } from '/@/api/backend/yk/chd'
import { dyCkdmx } from '/@/api/backend/yk/tkd'

const prop = defineProps(['kfbm'])
const emit = defineEmits(['selectedMx','cancel'])

const showCkdMx = ref(false)
const dateOption = ref('0')
const jhdtableData = ref([])
const jhdRadio = ref()
const djid = ref() //单据id
const djh = ref() //单据号
const jhdmxData = ref([])

const ckdmxRef = ref()

const dialogformData = reactive({
    TIME: [],
    keywords: '',
    KFBM: '',
    ZT: 2,
    page: 1,
    size: 20,
    count: 0,
    mxKeywords: ''
})

const state: {
    show: boolean,
    cancelBtn: string
} = reactive({
    show: false,
    cancelBtn: '取消'
})

const dateData = [
    { value: '0', label: '近一月' },
    { value: '1', label: '近三月' },
    { value: '2', label: '近半年' },
    { value: '3', label: '近一年' },
]

watch(
    () => state.show,
    (val) => {
        if (val) {
            const endDate = new Date()
            const startDate = new Date()
            startDate.setMonth(startDate.getMonth() - 1)
            dialogformData.TIME = [formatDate(startDate), formatDate(endDate)]
            dialogformData.KFBM = prop.kfbm
            getCkdsList()
        }
    }
)

const formatDate = (date: any) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

const dataChange = (val: number) => {
    const endDate = new Date()
    const startDate = new Date()
    if (val == 0) {
        startDate.setMonth(startDate.getMonth() - 1)
    } else if (val == 1) {
        startDate.setMonth(startDate.getMonth() - 3)
    } else if (val == 2) {
        startDate.setMonth(startDate.getMonth() - 6)
    } else if (val == 3) {
        startDate.setFullYear(startDate.getFullYear() - 1)
    }
    dialogformData.TIME = [formatDate(startDate), formatDate(endDate)]
    getCkdsList()
}

const getCkdsList = async () => {
    const res = await getChdList({ agrs: { ...dialogformData } })
    jhdtableData.value = res.data
    dialogformData.count = res.count
}

const ckdhandleRowClick = (row: any) => {
    jhdRadio.value = row.ID
    djid.value = row.DJID
    djh.value = row.DJH
}

const ckdRowDbclick = (row: any) => {
    jhdRadio.value = row.ID
    djid.value = row.DJID
    djh.value = row.DJH
    lookDetail(row)
}

// 出库单分页
const jhdhandleCurrentChange = (v: any) => {
    dialogformData.page = v
    getCkdsList()
}

const jhdhandleSizeChange = (v: any) => {
    dialogformData.size = v
    getCkdsList()
}

const lookDetail = async (row: any) => {
    djid.value = row.DJID
    djh.value = row.DJH
    const res = await ykChdMx({ agrs: { DJH: row.DJH, DJID: row.DJID, KFBM: prop.kfbm } })
    jhdmxData.value = res.data
    showCkdMx.value = true;
    state.cancelBtn = "返回";
}

const onConfirm = () => {
    if (showCkdMx.value) {
        const selectedRows = ckdmxRef.value?.getSelectionRows()
        const selectedIds = selectedRows.map((row) => row.ID)
        let data = {
            agrs: {
                DJLX: '出库单',
                DJID: djid.value,
                KFBM: prop.kfbm,
                DJH: djh.value,
                ListID: selectedIds,
                YWLX: 2,
            },
        }
        dyCkdmx(data).then((res: any) => {
            let datas = { data: res.data.data, djh: res.data.DJH, ksbm: res.data.KSBM }
            if (res.code == 1) {
                emit('selectedMx', datas)
                state.show = false
            } else {
                ElMessage.error('操作失败，稍后再试')
            }
        })

    } else {
        let data = {
            agrs: {
                DJLX: '出库单',
                DJID: djid.value,
                KFBM: prop.kfbm,
                DJH: djh.value,
                YWLX: 1,
            },
        }
        dyCkdmx(data).then((res: any) => {
            if (res.code == 1) {
                // jhdmxDetail.value = res.data.data
                // ckdjh.value = res.data.DJH
                // bmKsbm.value = res.data.KSBM
                let datas = { data: res.data.data, djh: res.data.DJH, ksbm: res.data.KSBM }
                emit('selectedMx', datas)
                state.show = false
            } else {
                ElMessage.error('操作失败，稍后再试')
            }
        })
    }

}

const onCancel = () => {
    if (showCkdMx.value) {
        showCkdMx.value = false
        state.cancelBtn = "取消"
    } else {
        state.show = false
        emit('cancel','')
    }
}

const onClose = () => {
    
}

const show = () => {
    state.show = true;
}

defineExpose({ show })

</script>

<style scoped lang="scss">
.yyckd-box {
    padding: 10px 15px;

    .ckd-list-container {
        .ckd-search {
            padding: 5px;

            .date-select :deep(.el-input) {
                width: 100px;
            }
        }

        .ss-pagination {
            display: flex;
            justify-content: center;
            margin-top: 5px;
        }
    }

    .ckd-mx-container {
        .ckdmx-search .el-form-item {
            margin-bottom: 10px
        }

        .ckdmx-search .el-input {
            width: 300px;
        }
    }
}
</style>