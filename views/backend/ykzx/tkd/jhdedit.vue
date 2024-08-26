<template>
    <div class="layout-box">
        <el-dialog
            v-model="drawerData.jhdmxdialog"
            :title="drawerData.title"
            width="95%"
            class="ba-operate-dialog"
            custom-class="my-dialog"
            draggable
            center
            :close-on-click-modal="false"
            @close="handleDialogClose"
        >
            <template #header>
                <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">{{ drawerData.title }}</div>
            </template>

            <el-scrollbar class="ba-table-form-scrollbar form-top">
                <el-form :model="formData" :inline="true" label-width="100px" :rules="rules" ref="ruleFormRef">
                    <el-form-item prop="CGRBM" label="检索">
                        <el-select v-model="formData.bm" placeholder="请选择" clearable class="yp-select" @change="changeSelect" filterable>
                            <el-option v-for="opt in prop.jhdmxDate" :key="opt.YPBM" :label="opt.YPMC + opt.GG" :value="opt.YPBM">
                                <div style="display: flex; justify-content: space-between">
                                    <span> {{ opt.YPMC }}</span>
                                    <span> {{ opt.GG }}</span>
                                </div>
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div>
                    <div class="yd-card-body">
                        <el-table
                            ref="tableref"
                            :data="prop.jhdmxDate"
                            class="color-table"
                            :header-cell-style="{ borderColor: '#e0e0e0' }"
                            :cell-style="{ borderColor: '#e0e0e0', background: 'transparent' }"
                            height="500"
                            :row-class-name="tableRowClassName"
                        >
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
                            <!-- <el-table-column prop="ZKL" label="加成率" align="center" width="90">
                                <template #default="{ row }">
                                    <span>{{ row.ZKL }}</span>
                                </template>
                            </el-table-column> -->
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
                <!-- 按钮部分 -->
                <div class="btn-box">
                    <el-button style="margin-right: 30px; padding: 0 35px" type="primary" @click="onSubmit">保存</el-button>
                    <el-button plain style="padding: 0 35px" @click="handleDialogClose">取消</el-button>
                </div>
            </el-scrollbar>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watchEffect, watch } from 'vue'
import { dyCkdmx } from '/@/api/backend/yk/tkd'
import { ElMessage } from 'element-plus'

const prop = defineProps(['kfbm', 'ypInfo', 'jhdmxDate', 'djh', 'djid', 'groupOption'])
const emit = defineEmits(['DetailsEdit'])
const ruleFormRef = ref()
const tableref = ref()
const formData = reactive({
    bm: '',
})

const tableRowClassName = ({ row }: { row: any }) => {
    if (formData.bm == row.YPBM) {
        return 'yellow-background'
    } else {
        return ''
    }
}

const drawerData = ref({
    title: '出库单明细',
    jhdmxdialog: false,
    direction: 'rtl',
    drugInfo: {},
    type: '',
    controlType: 'create',
})

// 通过编码去找相同点 利用table自带的方法setScrollTop定位且改变背景颜色
const changeSelect = (selectedBM) => {
    const index = prop.jhdmxDate.findIndex((item) => item.YPBM === selectedBM)
    if (index !== -1) {
        const table = tableref.value
        // 43是每行的高度 高度没变化的情况下可以写死
        const scrollTop = index * 43
        table.setScrollTop(scrollTop)
    }
}

const groupOptions = ref([])
const defaultProps = {
    checkStrictly: true,
    emitPath: false,
    multiple: false,
    label: 'HWMC',
    value: 'HWBM',
}

watch(
    () => prop.groupOption,
    async (val) => {
        if (val) {
            groupOptions.value = val
        }
    }
)

// 保存
const onSubmit = async () => {
    const selectedRows = tableref.value?.getSelectionRows()
    const selectedIds = selectedRows.map((row) => row.ID)
    let data = {
        agrs: {
            DJLX: '出库单',
            DJID: prop.djid,
            KFBM: prop.kfbm,
            DJH: prop.djh,
            ListID: selectedIds,
            YWLX: 2,
        },
    }
    const res = await dyCkdmx(data)
    let datas = { data: res.data.data, djh: res.data.DJH, ksbm: res.data.KSBM }
    if (res.code == 1) {
        emit('DetailsEdit', datas)
    } else {
        ElMessage.error('操作失败，稍后再试')
    }
}

watchEffect(async () => {
    if (drawerData.value.jhdmxdialog) {
        if (prop.jhdmxDate.length != 0) {
            tableref.value?.toggleAllSelection()
        }
    }
})

const handleDialogClose = () => {
    drawerData.value.jhdmxdialog = false
}

defineExpose({
    drawerData,
})
</script>

<style lang="scss" scoped>
:deep(.yellow-background) {
    background: rgb(233, 239, 253);
}

.yp-select :deep(.el-input) {
    width: 300px;
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
:deep(.el-dialog__body) {
    overflow-y: hidden;
    overflow-x: hidden;
    height: calc(100vh - 300px);
    padding: 0 20px;
}

.el-form-item :deep(.el-form-item__content) {
    width: 220px;
}
.layout-box {
    .form-top {
        margin-top: 10px;
        padding: 10px;
    }
    .btn-box {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 6px 20px;
        margin-top: 10px;
    }
    .color-table {
        border: solid 1px #ebebeb;
    }
    .yd-card-body {
        padding: 5px 10px;
    }
}
</style>
