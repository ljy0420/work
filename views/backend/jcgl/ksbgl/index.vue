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
    name: 'xtgl/ksbgl',
})

const optButtons = defaultOptBtns(['edit', 'delete'])

const baTable = new baTableClass(
    new baTableApi('/api/v1/xtsjwh/ksbgl/'),
    {
        column: [
            { label: 'NO', type: 'index', align: 'center' },
            { label: '卡类型', prop: 'CARDTYPE', align: 'left', width: 130 },
            { label: '卡驱动名称', prop: 'CARDDRIVE', align: 'left', width: 300 },
            { label: '是否使用', prop: 'ENABLESIGN', align: 'left', width: 100 },
            { label: '使用范围', prop: 'ENABLEMODLE', align: 'left', showOverflowTooltip: true },
            {
                label: '操作',
                align: 'center',
                width: '90',
                render: 'buttons',
                buttons: optButtons,
                fixed: 'right',
            },
        ],
        dblClickNotEditColumn: [undefined],
        pk: 'CARDNO'
    },
    {
        defaultItems: {
            ENABLESIGN: '是',
        },
    }
)

provide('baTable', baTable)

baTable.mount()
baTable.getIndex()
</script>

<style scoped lang="scss"></style>
