<template>
    <div class="default-main">
        <el-row :gutter="10">
            <el-col :xs="24" :sm="6">
                <div class="ba-table-box">
                    <FlForm @rowClick="flRowClick" />
                </div>
            </el-col>
            <el-col :xs="24" :sm="18">
                <div class="ba-table-box">
                    <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info" show-icon />

                    <!-- 表格顶部菜单 -->
                    <TableHeader
                    :buttons="['refresh', 'add', 'edit', 'delete', 'quickSearch', 'columnDisplay']"
                    quick-search-placeholder="输入关键字"
                    />

                    <!-- 表格 -->
                    <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
                    <Table height="calc(100vh - 200px)" />

                    <!-- 表单 -->
                    <EditForm :fldata="state.flData" />
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { reactive, provide } from 'vue'
import baTableClass from '/@/utils/baTable'
import EditForm from './edit.vue'
import FlForm from './flindex.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/default.vue'
import { getJbxxFl } from '/@/api/backend/jcgl/jbxx'
import { defaultOptBtns } from '/@/components/table'
import { baTableApi } from '/@/api/common'

const state: {
    tableRadio: any,
    flData: any,
    currentFlbm: any
} = reactive({
    tableRadio: '',
    flData: [],
    currentFlbm: ''
})

defineOptions({
    name: 'xtgl/jbxxwh',
})

const optButtons = defaultOptBtns(['edit', 'delete'])

const baTable = new baTableClass(
    new baTableApi('/api/v1/xtsjwh/jbxxwh/'),
    {
        column: [
            // { type: 'selection', align: 'center' },
            { label: 'NO', type: 'index', align: 'center' },
            { label: '疾病编码', prop: 'JBBM', align: 'left', width: 130 },
            { label: '疾病名称', prop: 'JBMC', align: 'left', showOverflowTooltip: true },
            { label: 'ICD码', prop: 'ICDM', align: 'left', width: 200 },
            { label: '拼音码', prop: 'PYM', align: 'left', width: 150 },
            { label: '五笔码', prop: 'WBM', align: 'left', width: 170 },
            { label: '有效状态', prop: 'YXZT', align: 'left', width: 100, render: 'switch' },
            {
                label: '操作',
                align: 'center',
                width: '90',
                render: 'buttons',
                buttons: optButtons,
                fixed: 'right',
            },
        ],
        dblClickNotEditColumn: [undefined, 'YXZT']
    },
    {
        defaultItems: {
            SFCRB: '0',
            SFCY: '0',
            YXZT: '1',
        },
    }
)

const flRowClick = (row: any) => {
    if(row) {
        state.currentFlbm = row.FLBM
    baTable.form.defaultItems!.FLBM = row.FLBM
    baTable.table.filter!.youXiaoZT = '-1'
    baTable.table.filter!.fenLeiBM = state.currentFlbm
    baTable.table.filter!.page = 1
    baTable.table.filter!.size = 20
    baTable.getIndex()
    }
    
}

getJbxxFl().then((res)=>{
    state.flData = res.data
})

provide('baTable', baTable)

baTable.mount()
baTable.getIndex()
</script>

<style scoped lang="scss">
:deep(.ba-table-box){
    .el-table__header .cell{
        color: var(--el-text-color-primary);
    }
}
</style>
