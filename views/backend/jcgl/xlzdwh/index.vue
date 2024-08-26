<template>
    <div class="default-main">
        <!-- 左侧大类 -->
        <el-row :gutter="20">
            <el-col :xs="24" :sm="6">
                <div class="ba-table-box">
                    <el-table :data="state.flData" style="width: 100%" :highlight-current-row="true" @cell-click="cellClickHandle">
                        <el-table-column prop="BM" label="选择" width="70" align="center">
                            <template #default="scope">
                                <el-radio v-model="state.tableRadio" :label="scope.row.BM">&nbsp;</el-radio>
                            </template>
                        </el-table-column>
                        <el-table-column prop="MC" label="大类名称" align="center"></el-table-column>
                    </el-table>
                </div>
            </el-col>

            <!-- 表格整体部分 -->
            <el-col :xs="24" :sm="18">
                <div class="ba-table-box">
                    <!-- 提示文字 -->
                    <!-- <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info" show-icon /> -->

                    <!-- 表格顶部菜单 -->
                    <TableHeader :buttons="state.btnArr" quick-search-placeholder="输入关键字" />

                    <!-- 表格 -->
                    <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
                    <Table :pagination="false" max-height="700px" />

                    <!-- 表单 -->
                    <EditForm :fldata="state.flData" />
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { GetDaLeiLB } from '/@/api/backend/jcgl/xlzd'
import EditForm from './edit.vue'
import baTableClass from '/@/utils/baTable'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/index.vue'
import { reactive, provide } from 'vue'
import { defaultOptButtons } from '/@/components/table'
import { baTableApi } from '/@/api/common'

defineOptions({
    name: 'xtgl/xlzdwh',
})

const optButtons = defaultOptButtons(['edit', 'delete'])

const baTable = new baTableClass(
    new baTableApi('/api/v1/xtsjwh/xlzdwh/'),
    {
        column: [
            { label: 'NO', type: 'index', align: 'center' },
            { label: '小类编码', prop: 'XLBM', align: 'left', width: 130 },
            { label: '小类名称', prop: 'XLMC', align: 'left', width: 150 },
            { label: '大类名称', prop: 'DLMC', align: 'left', width: 150 },
            { label: '自编码', prop: 'ZBM', align: 'left', width: 150 },
            { label: '是否默认', prop: 'SFMR', align: 'left', width: 170 },
            { label: '是否可以确费', prop: 'SFKYQF', align: 'left', width: 170 },
            { label: '有效状态', prop: 'YXZT', align: 'left', width: 100, render: 'switch' },
            { label: '套餐打印归属', prop: 'TCDYGSBM', align: 'left', width: 200 },
            { label: '附加项目是否打印必填', prop: 'FJXMSFBT', align: 'left', width: 200 },
            {
                label: '操作',
                align: 'left',
                width: '100',
                render: 'buttons',
                buttons: optButtons,
                fixed: 'right',
            },
        ],
        dblClickNotEditColumn: [undefined, 'YXZT'],
    },
    {
        defaultItems: {
            YXZT: '1',
            SFMR: '否',
            SFKYQF: '否',
            FJXMSFBT: '否',
        },
    }
)

const state: {
    tableRadio: any
    flData: any
    currentFlbm: any
    btnArr: any
} = reactive({
    tableRadio: '',
    flData: [],
    currentFlbm: '',
    btnArr: [],
})

// 左侧大类
GetDaLeiLB().then((res) => {
    state.flData = res.data
})

const cellClickHandle = (row: any) => {
    state.btnArr = ['refresh', 'add', 'edit', 'delete', 'quickSearch', 'columnDisplay']
    baTable.form.defaultItems!.DLBM = row.BM
    baTable.form.defaultItems!.DLMC = row.MC
    state.tableRadio = row.BM
    state.currentFlbm = row.BM
    baTable.form.defaultItems!.BM = row.BM
    baTable.table.filter!.YXZT = '-1'
    baTable.table.filter!.DLBM = state.currentFlbm
    baTable.table.filter!.page = 1
    baTable.table.filter!.size = 20
    baTable.getIndex()
}

provide('baTable', baTable)

baTable.mount()
baTable.getIndex()
</script>

<style scoped lang="scss">
:deep(.ba-table-box) {
    .el-table__header .cell {
        color: var(--el-text-color-primary);
    }
}
</style>
