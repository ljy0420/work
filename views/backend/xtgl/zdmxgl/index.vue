<template>
    <div class="default-main">
        <el-row :gutter="10">
            <el-col :xs="24" :sm="6">
                <div class="ba-table-box">
                    <FlForm @rowClick="flRowClick" @dataChange="fldataChange" />
                </div>
            </el-col>
            <el-col :xs="24" :sm="18">
                <div class="ba-table-box">
                    <!-- 表格顶部菜单 -->
                    <TableHeader :buttons="state.btnArr" quick-search-placeholder="输入关键字" />

                    <!-- 表格 -->
                    <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
                    <Table ref="tableRef" :pagination="false" height="calc(100vh - 139px)" />

                    <!-- 表单 -->
                    <EditForm />
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { ref,onMounted,reactive,provide } from 'vue'
import baTableClass from '/@/utils/baTable'
import EditForm from './edit.vue'
import FlForm from './flindex.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/default.vue'
import { defaultOptButtons } from '/@/components/table'
import { baTableApi } from '/@/api/common'

const state: {
    fldata: any,
    btnArr: any,
    currentFlbm: any,
    expandKeys: any,
} = reactive({
    fldata: [],
    btnArr: ['quickSearch', 'columnDisplay'],
    currentFlbm: '0',
    expandKeys: ['GB']
})

defineOptions({
    name: 'xtgl/xtcdwh',
})

const tableRef = ref()

const baTable = new baTableClass(
    new baTableApi('/api/v1/xtsjwh/zdmxgl/'),
    {
        column: [
            { label: 'NO', type: 'index', align: 'center' },
            { label: '分类编码', prop: 'FLBM', align: 'left', width: 100 },
            { label: '编码', prop: 'BM', align: 'left', width: 130 },
            { label: '名称', prop: 'MC', align: 'left', minWidth: 190, showOverflowTooltip: true },
            { label: '拼音码', prop: 'PYM', align: 'left', width: 130  },
            { label: '五笔码', prop: 'WBM', align: 'left', width: 130  },
            { label: '有效状态', prop: 'YXZT', align: 'left', width: 130 , render: 'switch' },
            { label: '更新时间', prop: 'GXSJ', align: 'left', width: 170 },
            { label: '排序号', prop: 'PXH', align: 'left', width: 100  },
            {
                label: '操作',
                align: 'left',
                width: '100',
                render: 'buttons',
                buttons: defaultOptButtons(),
                fixed: 'right',
            },
        ],
        pk: 'BM',
        dblClickNotEditColumn: [undefined, 'YXZT'],
        filter:{ youXiaoZT:'-1', fenLeiBM:'0' }
    },
    {
        defaultItems: {
            YXZT: '1',
            SFMR: '1'
        },
        labelWidth: 70
    }
)

const fldataChange = (data: any) => {
    state.fldata = data
    state.currentFlbm = ''
    state.btnArr = ['quickSearch', 'columnDisplay']
    baTable.table.filter = { fenLeiBM:state.currentFlbm, youXiaoZT:'-1' }
    baTable.getIndex()?.then(() => {
        baTable.dragSort()
    })
}

const flRowClick = (row: any) => {
    state.currentFlbm = row.FLBM
    state.btnArr = ['add', 'quickSearch', 'columnDisplay']
    baTable.form.defaultItems!.FLBM = row.FLBM
    baTable.table.filter = { fenLeiBM:state.currentFlbm, youXiaoZT:'-1' }
    baTable.getIndex()?.then(() => {
        baTable.dragSort()
    })
}

provide('baTable', baTable)

onMounted(() => {
    baTable.table.ref = tableRef.value
    baTable.mount()
    // baTable.getIndex()?.then(() => {
    //     baTable.dragSort()
    // })
})
</script>

<style scoped lang="scss">
.table-container{
    width: 100% ;
    padding-bottom: 10px; 
    box-sizing: border-box; 
    height:calc(100vh - 200px)
}
.table-container2{
    width: 100% ;
    padding-bottom: 10px; 
    box-sizing: border-box; 
    height:calc(100vh - 150px)
}

:deep(.ba-table-box){
    .el-table__header .cell{
        color: var(--el-text-color-primary);
    }
}
.zdfl-table-header{
    padding: 13px 15px;
    background-color: #fff;
    margin-bottom: 1px;
    display: flex;
    justify-content:space-between;
    align-items: center;
    .left-panel{
        width: 80%;
    }
}
</style>
