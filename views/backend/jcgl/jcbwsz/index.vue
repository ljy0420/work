<template>
    <div class="default-main">
        <el-row :gutter="10">
            <el-col :xs="24" :sm="6">
                <div class="ba-table-box">
                    <Jcbwfl @rowClick="onRowClick" @dataChange="bwflChange" />
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
                    <Table :pagination="false" height="calc(100vh - 150px)" />

                    <!-- 表单 -->
                    <EditForm :flData="state.flData" :selectFlbm="state.selectFlbm" />
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { reactive, provide } from 'vue'
import baTableClass from '/@/utils/baTable'
import EditForm from './edit.vue'
// import EditFlForm from './edit-fl.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/default.vue'
import Jcbwfl from './components/jcbwfl.vue'
import { defaultOptBtns } from '/@/components/table'
import { baTableApi } from '/@/api/common'

const state: {
    flData: any
    selectFlbm: any
} = reactive({
    flData: [],
    selectFlbm: '',
})

defineOptions({
    name: 'xtgl/xtcdwh',
})

// 左侧分类
const onRowClick = (row: any) => {
    state.selectFlbm = row.FLBM
    baTable.form.defaultItems!.FLBM = row.FLBM
    getIndex()
}

const optButtons = defaultOptBtns(['edit', 'delete'])

const getIndex = () => {
    baTable.table.filter = { yxzt: '', flbm: state.selectFlbm }
    baTable.getIndex()
}

const baTable = new baTableClass(new baTableApi('/api/v1/xtsjwh/bwxx/'), {
    column: [
        { label: 'NO', type: 'index', align: 'center' },
        { label: '部位编码', prop: 'BWBM', align: 'left', width: 130 },
        { label: '分类编码', prop: 'FLBM', align: 'left', width: 100 },
        { label: '部位名称', prop: 'BWMC', align: 'left', width: 170 },
        { label: '备注', prop: 'BZ', align: 'left', showOverflowTooltip: true },
        {
            label: '操作',
            align: 'center',
            width: '90',
            render: 'buttons',
            buttons: optButtons,
            fixed: 'right',
        },
    ],
},
{
    defaultItems: {
        SCBZ: '0',
    },
    labelWidth: 60
}
)

provide('baTable', baTable)

baTable.mount()

const bwflChange = (data: any) => {
    state.flData = data
    state.selectFlbm = ''
    baTable.form.defaultItems!.FLBM = ''
    getIndex()
}

</script>

<style scoped lang="scss">
.el-table__header-wrapper :deep(.el-table__header) {
    width: 389px;
}

</style>
