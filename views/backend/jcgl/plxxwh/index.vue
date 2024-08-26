<template>
    <div class="default-main ba-table-box">
        <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info" show-icon />

        <!-- 表格顶部菜单 -->
        <TableHeader :buttons="['refresh', 'add', 'edit', 'delete', 'quickSearch', 'columnDisplay']" quick-search-placeholder="输入关键字" />

        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <Table :pagination="false" height="calc(100vh - 140px)" />

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
import { useAdminInfo } from '/@/stores/adminInfo'

defineOptions({
    name: 'xtgl/plxxwh',
})

const adminInfo = useAdminInfo()

const optButtons = defaultOptBtns(['edit', 'delete'])

const baTable = new baTableClass(
    new baTableApi('/api/v1/xtsjwh/plxxwh/'),
    {
        column: [
            { label: 'NO', type: 'index', align: 'center' },
            { label: '频率编码', prop: 'PLBM', align: 'left', width: 150 },
            { label: '频率名称', prop: 'PLMC', align: 'left' },
            { label: '频率次数', prop: 'PLCS', align: 'left', width: 150 },
            { label: '频率间隔', prop: 'PLJG', align: 'left', width: 150 },
            { label: '适用范围', prop: 'SYFW', align: 'left', width: 150 },
            { label: '间隔单位', prop: 'JGDW', align: 'left', width: 150 },
            { label: '排序号', prop: 'PXH', align: 'left', width: 130 },
            { label: '有效状态', prop: 'YXZT', align: 'left', width: 150, render: 'switch' },
            {
                label: '操作',
                align: 'center',
                width: '90',
                render: 'buttons',
                buttons: optButtons,
                operator: false,
            },
        ],
        // dblClickNotEditColumn: [undefined, 'status'],
        dblClickNotEditColumn: [undefined, 'YXZT'],
    },
    {
        defaultItems: {
            // status: '1',
            YXZT: '1',
            JGBM: adminInfo.jgbm,
        },
        labelWidth:100
    }
)

provide('baTable', baTable)

baTable.mount()
baTable.getIndex()
</script>

<style scoped lang="scss"></style>
