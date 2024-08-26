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
import { provide, reactive } from 'vue'
import baTableClass from '/@/utils/baTable'
import EditForm from './edit.vue'
import FlForm from './flindex.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/default.vue'
import { defaultOptBtns } from '/@/components/table'
import { baTableApi } from '/@/api/common'
import { getSsxxFl } from '/@/api/backend/jcgl/ssxx'

const state: {
    tableRadio: any,
    flData: any,
    currentFlbm: any,
    flKeywords: string,
    flOpt: string,
    showFlEdit: boolean,
    rowdata: anyObj,
} = reactive({
    tableRadio: '',
    flData: [],
    currentFlbm: '',
    flKeywords: '',
    flOpt: '',
    showFlEdit: false,
    rowdata: {},
})

defineOptions({
    name: 'xtgl/ssxxwh',
})

const optButtons = defaultOptBtns(['edit', 'delete'])

const baTable = new baTableClass(
    new baTableApi('/api/v1/xtsjwh/ssxxwh/'),
    {
        column: [
            { label: 'NO', type: 'index', align: 'center' },
            { label: '国家编码', prop: 'SSBM', align: 'left', width: 130 },
            { label: '国家名称', prop: 'SSMC', align: 'left', width: 300 },
            { label: '手术编码', prop: 'SSBM', align: 'left', width: 130 },
            { label: '手术名称', prop: 'SSMC', align: 'left', width: 300 },
            { label: '拼音码', prop: 'PYM', align: 'left', width: 160 },
            { label: '五笔码', prop: 'WBM', align: 'left', width: 190 },
            { label: '国标码', prop: 'GBM', align: 'left', width: 130 },
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
        dblClickNotEditColumn: [undefined, 'YXZT'],
        filter: { fenLeiBM: '3', yxzt: '1', page: 1, size: 20 }
    },
    {
        defaultItems: {
            YXZT: '1',
            SFCY: '否'
        },
    }
)

getSsxxFl().then((res)=>{
    state.flData = res.data
})

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
.ssfl-table-header{
    padding: 16px 15px;
    background-color: #fff;
    margin-bottom: 1px;
    display: flex;
    align-items: center;
    .left-panel{
        width: 80%;
    }
}
</style>
