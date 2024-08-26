<template>
    <div class="default-main ba-table-box">
        <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info" show-icon />

        <!-- 表格顶部菜单 -->
        <TableHeader
            :buttons="['refresh', 'add', 'edit', 'delete', 'unfold', 'quickSearch', 'columnDisplay']"
            quick-search-placeholder="通过名称模糊搜索"
        />
        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <Table ref="tableRef" :pagination="false" height="calc(100vh - 139px)" />

        <!-- 表单 -->
        <EditForm />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, provide } from 'vue'
import EditForm from './edit.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/index.vue'
import { defaultOptButtons } from '/@/components/table'
import { baTableApi } from '/@/api/common'
import baTableClass from '/@/utils/baTable'

defineOptions({
    name: 'xtgl/xtcdwh',
})

const tableRef = ref()
const baTable = new baTableClass(
    new baTableApi('/api/v1/xtsjwh/xtcdwh/'),
    {
        expandAll: false,
        dblClickNotEditColumn: [undefined, 'keepalive', 'status'],
        column: [
            { label: 'NO', type: 'index', align: 'center' },
            { label: '菜单名称', prop: 'title', align: 'left', width: '200' },
            { label: '图标', prop: 'icon', align: 'left', width: '60', render: 'icon', default: 'fa fa-circle-o' },
            { label: '路由名称', prop: 'name', align: 'left', width: '270' ,showOverflowTooltip: true },
            {
                label: '功能类型',
                prop: 'type',
                align: 'left',
                width: '130',
                render: 'tag',
                custom: { menu: 'danger', menu_dir: 'success', button: 'info' },
                replaceValue: { menu: '菜单', menu_dir: '模块', button: '功能' },
            },
            { label: '前端组件', prop: 'component', align: 'left' },
            { label: '缓存', prop: 'keepalive', align: 'left', width: '80', render: 'switch' },
            { label: '状态', prop: 'status', align: 'left', width: '80', render: 'switch' },
            { label: '更新时间', prop: 'gxsj', align: 'left', width: '160', render: 'datetime' },
            {
                label: '操作',
                align: 'left',
                width: '130',
                render: 'buttons',
                buttons: defaultOptButtons()
            },
        ],
        dragSortLimitField: 'pid',
    },
    {
        defaultItems: {
            type: 'menu',
            menu_type: 'tab',
            extend: 'none',
            keepalive: 0,
            status: '1',
            icon: 'fa fa-circle-o',
            hide_in_menu: false,
        },
        labelWidth: 100
    },
    {
        getIndex: () => {
            baTable.table.expandAll = baTable.table.filter?.keywords ? true : false
        },
        // 获得编辑数据后
        requestEdit: () => {
            if (baTable.form.items && !baTable.form.items.icon) baTable.form.items.icon = 'fa fa-circle-o'
        },
    }
)

provide('baTable', baTable)

onMounted(() => {
    baTable.table.ref = tableRef.value
    baTable.mount()
    baTable.getIndex()?.then(() => {
        baTable.dragSort()
    })
})
</script>

<style scoped lang="scss"></style>
