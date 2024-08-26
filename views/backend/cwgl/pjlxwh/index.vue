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
        <Table :pagination="false" max-height="750px"  />

        <!-- 表单 -->
        <EditForm :items="baTable.table.data" @savePjlxEdit="savePJLXEditCall"/>
    </div>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import baTableClass from '/@/utils/baTable'
import EditForm from './edit.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/index.vue'
import { defaultOptButtons } from '/@/components/table'
import { baTableApi } from '/@/api/common'

defineOptions({
    name: 'cwgl/pjlxwh',
})

const optButtons = defaultOptButtons(['edit', 'delete'])

const baTable = new baTableClass(
    new baTableApi('/api/v1/cwgl/Pjlxyy/'),
    {
        column: [
            { type: 'selection', align: 'center' },
            { label: '票据类型编码', prop: 'PJLXBM', align: 'center',  width: 130 },
            { label: '票据类型名称', prop: 'PJLXMC', align: 'center', width: 300 },
            { label: '业务类型', prop: 'YWMC', align: 'center', width: 300 },
            { label: '备注', prop: 'BZ', align: 'center', width: 300 },
            {
                label: '操作',
                align: 'center',
                width: '100',
                render: 'buttons',
                buttons: optButtons,
                fixed: 'right',
            },
        ],
        dblClickNotEditColumn: [undefined, 'YXZT'],
        pk:"PJLXBM"
    },
    {
        defaultItems: {
            PXH: 0,
            YXZT: '1',
        },
    }
)

const savePJLXEditCall = () => {
  baTable.getIndex()
}

provide('baTable', baTable)

baTable.mount()
baTable.getIndex()

</script>

<style scoped lang="scss"></style>
