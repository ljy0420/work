<template>
    <div>
        <!-- 表格顶部菜单 -->
        <TableHeader :buttons="['refresh', 'add', 'edit', 'delete', 'quickSearch']" quick-search-placeholder="输入关键字" />

        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <!-- <Table ref="tableRef" :pagination="false" max-height="calc(100vh - 139px)" @row-click="onRowClick" /> -->
        <Table ref="tableRef" :pagination="false" height="calc(100vh - 150px)" @row-click="onRowClick">
            <template #flmcSlot>
                <el-table-column prop="FLMC" label="分类名称" align="left" :show-overflow-tooltip="true">
                    <template #default="scope">
                        {{ scope.row.FLBM }}-{{ scope.row.FLMC }}
                    </template>
                </el-table-column>
            </template>
        </Table>

        <!-- 表单 -->
        <EditForm :flData="state.flData" />
    </div>
</template>

<script setup lang="ts">
import { provide, reactive, onMounted, watch, nextTick, ref } from 'vue'
import baTableClass from '/@/utils/baTable'
import EditForm from './edit.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/other.vue'
import { baTableApi } from '/@/api/common'

const prop = defineProps(['lxData'])

const emit = defineEmits(['rowClick','dataChange'])

const state: {
    flData: any
} = reactive({
    flData: [],
})
const tableRef = ref()

const afterIndex = ({ res }: { res: ApiResponse }) => {
    if(res.code == 1) {
        emit('dataChange', res.data)
    } else {
        emit('dataChange', [])
    }
}

const baTable = new baTableClass(
    new baTableApi('/api/v1/xtsjwh/bwfl/'),
    {
        expandAll: true,
        column: [
            { type: 'selection', align: 'center', width: 30 },
            { label: '分类名称', prop: 'FLMC', align: 'left', showOverflowTooltip: true, render: 'slot', slotName: 'flmcSlot' },
            // { label: '分类编码', prop: 'FLBM', align: 'left', width: 100 },
        ],
        pk: 'FLBM',
        dblClickNotEditColumn: [undefined],
        dragSortLimitField: 'SJBM',
    },
    {
        defaultItems: {
            LX: prop.lxData,
        },
        // labelWidth: 100,
    },
    {},
    {
        getIndex: afterIndex
    }
)

provide('baTable', baTable)

const getIndex = () => {
    baTable.table.filter!.leiXing = prop.lxData
    baTable.getIndex()?.then(() => {
        if (baTable.table.data && baTable.table.data.length > 0) {
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

watch(
    () => prop.lxData,
    (newVal) => {
        if (newVal) {
            nextTick(() => {
                getIndex()
            })
        }
    }
)
</script>

<style scoped lang="scss"></style>
