<template>
    <div>
        <TableHeader
            :buttons="['refresh', 'add', 'edit', 'delete', 'quickSearch']"
            quick-search-placeholder="输入关键字"
        />

        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <!-- <Table :pagination="false" max-height="calc(100vh - 139px)" @row-click="onRowClick" /> -->
        <Table ref="tableRef" :pagination="false" height="calc(100vh - 139px)" @current-change="onRowClick" />

        <!-- 表单 -->
        <EditForm />
    </div>
</template>

<script setup lang="ts">
import { ref, provide, reactive, onMounted, nextTick } from 'vue'
import baTableClass from '/@/utils/baTable'
import EditForm from './fledit.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/other.vue'
import { baTableApi } from '/@/api/common'

const emit = defineEmits(["rowClick"]);

const state: {
    flData: any,
} = reactive({
    flData: []
})

const tableRef = ref()
const baTable = new baTableClass(
    new baTableApi('/api/v1/xtsjwh/ssxxwh/ssfl/'),
    {
        expandAll: true,
        column: [
            { type: 'selection', align: 'center' },
            // { label: '分类编码', prop: 'FLBM', align: 'left', showOverflowTooltip: true },
            { label: '分类名称', prop: 'FLMC', align: 'left', showOverflowTooltip: true }
        ],
        pk: 'FLBM',
        dblClickNotEditColumn: [undefined],
        dragSortLimitField: 'SJBM'
    },
    {
        defaultItems:{
            SCBZ: '0'
        },
        labelWidth: 100
    }
)

provide('baTable', baTable)

const getIndex = () => {
    baTable.getIndex()?.then(() => {
        if(baTable.table.data && baTable.table.data.length>0) {
            state.flData = baTable.table.data
            nextTick(() => {
                baTable.table.ref.getRef()?.setCurrentRow(baTable.table.data[0])
            })
        }
    })
}

const onRowClick = (row: any) => {
    emit('rowClick', row)
}

onMounted(() => {
    baTable.table.ref = tableRef.value
    baTable.mount()
    getIndex()
})

</script>

<style scoped lang="scss"></style>
