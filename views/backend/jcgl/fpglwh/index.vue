<template>
    <div class="default-main ba-table-box">
        <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info" show-icon />

        <!-- 表格顶部菜单 -->
        <TableHeader :buttons="['refresh', 'add', 'edit', 'delete', 'quickSearch', 'columnDisplay']" quick-search-placeholder="输入关键字" />

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
import { useAdminInfo } from '/@/stores/adminInfo'

defineOptions({
    name: 'xtgl/fpglwh',
})
const adminInfo = useAdminInfo()

const optButtons = defaultOptBtns(['edit', 'delete'])

const baTable = new baTableClass(
    new baTableApi('/api/v1/xtsjwh/zldjgl/'),
    {
        column: [
            { label: 'NO', type: 'index', align: 'center' },
            { label: '单据编码', prop: 'DJBM', align: 'left', width: 150 },
            { label: '单据名称', prop: 'DJMC', align: 'left', width: 130 },
            { label: '备注', prop: 'BZ', align: 'left', width: 150 },
            {
                label: '操作',
                align: 'center',
                width: '90',
                render: 'buttons',
                buttons: optButtons,
            },
        ],
        dblClickNotEditColumn: [undefined],
    },
    {
        defaultItems: {
            YXZT: '1',
            JGBM: adminInfo.jgbm,
        },
    }
)

provide('baTable', baTable)

baTable.mount()
baTable.getIndex()
</script>

<style scoped lang="scss"></style>
