<template>
    <div class="default-main ba-table-box">
        <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info" show-icon />

        <!-- 表格顶部菜单 -->
        <TableHeader :buttons="['refresh', 'add', 'edit', 'delete', 'quickSearch', 'columnDisplay']"
            quick-search-placeholder="输入关键字" />

        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <Table />

        <!-- 表单 -->
        <EditForm />
    </div>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import baTableClass from '/@/utils/baTable'
import EditForm from './edit.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/default.vue'
import { defaultOptBtns } from '/@/components/table'
import { baTableApi } from '/@/api/common'

defineOptions({
    name: 'xtgl/bxlbwh',
})

const optButtons = defaultOptBtns(['edit', 'delete'])

const baTable = new baTableClass(
    new baTableApi('/api/v1/xtsjwh/bxlbwh/'),
    {
        column: [
            { label: 'NO', type: 'index', align: 'center' },
            { label: '报销编码', prop: 'BXBM', align: 'left', width: 130 },
            { label: '报销名称', prop: 'BXMC', align: 'left', width: 200 },
            { label: '报销比例', prop: 'BXBL', align: 'left', width: 130 },
            { label: '拼音码', prop: 'PYM', align: 'left', width: 100 },
            { label: '五笔码', prop: 'WBM', align: 'left', width: 100 },
            { label: '有效状态', prop: 'YXZT', align: 'left', width: 100 },
            {
                label: '操作',
                align: 'left',
                width: '90',
                render: 'buttons',
                buttons: optButtons,
                operator: false,
            },
        ],
        dblClickNotEditColumn: [undefined, 'status'],
    },
    {
        defaultItems: {
            status: '1',
        },
    }
)

provide('baTable', baTable)

baTable.mount()
baTable.getIndex()
</script>

<style scoped lang="scss"></style>
