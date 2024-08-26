<template>
    <div class="default-main ba-table-box">
        <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info" show-icon />

        <!-- 表格顶部菜单 -->
        <TableHeader
            :buttons="['refresh', 'add', 'edit', 'delete', 'quickSearch', 'columnDisplay']"
            quick-search-placeholder="输入关键字"
        />

        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <Table :pagination="false" height="calc(100vh - 139px)" />

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
    name: 'xtgl/dsxxwh',
})


const optButtons = defaultOptBtns(['edit', 'delete'])

const baTable = new baTableClass(
    new baTableApi('/api/v1/xtsjwh/dsxxwh/'),
    {
        column: [
            { label: 'NO', type: 'index', align: 'center' },
            { label: '编码', prop: 'BM', align: 'left',  width: 200 },
            { label: '名称', prop: 'MC', align: 'left',  width: 300, showOverflowTooltip: true },
            { label: '排序号', prop: 'PXH', align: 'left', width: 200 },
            { label: '有效状态', prop: 'YXZT', align: 'left', render: 'switch' },
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
    },
    {
        defaultItems: {
            PXH: 0,
            YXZT: '1',
        },
    }
)

provide('baTable', baTable)

baTable.mount()
baTable.getIndex()
</script>

<style scoped lang="scss"></style>
