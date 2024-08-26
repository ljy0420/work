<template>
    <div>
        <TableHeader :buttons="['refresh', 'add', 'edit', 'delete', 'quickSearch']" quick-search-placeholder="输入关键字" />

        <Table :pagination="false" height="calc(100vh - 150px)" @row-click="onRowClick" :expand-row-keys="state.expRowKeys" />

        <!-- 表单 -->
        <EditForm :fldata="state.flData" />
    </div>
</template>

<script setup lang="ts">
import { provide, reactive, onMounted } from 'vue'
import baTableClass from '/@/utils/baTable'
import EditForm from './fledit.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/other.vue'
import { baTableApi } from '/@/api/common'

const emit = defineEmits(["rowClick", "dataChange"]);

const state: {
    flData: any,
    expRowKeys: any
} = reactive({
    flData: [],
    expRowKeys: []
})

const afterIndex = ({ res }: { res: ApiResponse }) => {
    if(res.code == 1) {
        emit('dataChange', res.data)
        if(res.data && res.data.length > 0) {
            state.expRowKeys.push(res.data[0].FLBM)
        } else {
            state.expRowKeys = []
        }
    } else {
        emit('dataChange', [])
    }
}

const baTable = new baTableClass(
    new baTableApi('/api/v1/xtsjwh/zdmxgl/zdfl/'),
    {
        expandAll: false,
        column: [
            { type: 'selection', align: 'center' },
            { label: '分类编码', prop: 'FLBM', align: 'left', showOverflowTooltip: true },
            { label: '分类名称', prop: 'FLMC', align: 'left', showOverflowTooltip: true }
        ],
        pk: 'FLBM',
        dblClickNotEditColumn: [undefined],
        dragSortLimitField: 'SJBM'
    },
    {
        defaultItems:{
            YXZT: '1'
        },
        labelWidth: 80
    },
    {},
    {
        getIndex: afterIndex
    }
)

provide('baTable', baTable)

const getIndex = () => {
    baTable.table.filter = '-1'
    baTable.getIndex()?.then(() => {
        if(baTable.table.data && baTable.table.data.length>0) {
            state.flData = baTable.table.data
        }
    })
}

const onRowClick = (row: any) => {
    emit('rowClick', row)
}

onMounted(() => {
    baTable.mount()
    getIndex()
})

</script>

<style scoped lang="scss"></style>
