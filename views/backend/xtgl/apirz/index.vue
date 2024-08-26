<template>
    <div class="default-main ba-table-box">
        <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info" show-icon />

        <!-- 表格顶部菜单 -->
        <TableHeader
            :buttons="['refresh', 'quickSearch', 'columnDisplay']"
            quick-search-placeholder="输入关键字"
        />

        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <Table max-height="calc(100vh - 200px)">
            <template #codeSlot>
                <el-table-column prop="CODE" label="状态" width="100" align="center">
                    <template #default="scope">
                        <el-tag type="success" v-if="scope.row.CODE==1">正常</el-tag>
                        <el-tag type="danger" v-if="scope.row.CODE!=1">异常</el-tag>
                    </template>
                </el-table-column>
            </template>
        </Table>

        <Info />
    </div>
</template>

<script setup lang="ts">
import { concat, cloneDeep } from 'lodash-es'
import { provide } from 'vue'
import baTableClass from '/@/utils/baTable'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/index.vue'
import { defaultOptButtons } from '/@/components/table'
import { baTableApi } from '/@/api/common'
import Info from './info.vue'
import { buildJsonToElTreeData } from '/@/utils/common'

defineOptions({
    name: 'xtgl/apirz',
})

let optButtons: OptButton[] = [
    {
        render: 'tipButton',
        name: 'info',
        title: 'Info',
        text: '',
        type: 'primary',
        icon: 'fa fa-search-plus',
        class: 'table-row-edit',
        disabledTip: false,
        click: (row: TableRow) => {
            infoButtonClick(row)
        },
    },
]

optButtons = concat(optButtons, defaultOptButtons(['delete']))

const baTable = new baTableClass(
    new baTableApi('/api/v1/xtsjwh/apirz/'),
    {
        column: [
            // { type: 'selection', align: 'center' },
            { label: 'NO', type: 'index', align: 'center' },
            { label: '操作员编码', prop: 'CZYBM', align: 'left', width: 130 },
            { label: '操作员名称', prop: 'CZYMC', align: 'left', width: 130 },
            { label: '功能名称', prop: 'CZMC', align: 'left', width: 230, showOverflowTooltip: true },
            { label: 'API地址', prop: 'URL', align: 'left', width: 270 },
            { label: '客户端IP', prop: 'IP', align: 'left', width: 150, render: 'tag' },
            { label: '服务端IP', prop: 'SERVERIP', align: 'left', width: 150, render: 'tag' },
            { label: '操作时间', prop: 'CJSJ', align: 'left', width: 170 },
            { 
                label: '状态', 
                prop: 'CODE', 
                align: 'left', 
                width: 100, 
                render: 'slot',
                slotName: 'codeSlot'
            },
            { label: 'UserAgent', prop: 'USERAGENT', align: 'left', width: 360, showOverflowTooltip: true },
            {
                label: '操作',
                align: 'center',
                width: '60',
                render: 'buttons',
                buttons: optButtons,
                fixed: 'right',
            },
        ],
        dblClickNotEditColumn: [undefined],
        pk: 'RZID'
    },
    {},
    {
        onTableDblclick: ({ row }) => {
            infoButtonClick(row)
            return false
        },
    }
)

baTable.table.filter!.page = 1
baTable.table.filter!.size = 20
baTable.mount()
baTable.getIndex()

provide('baTable', baTable)

/** 点击查看详情按钮响应 */
const infoButtonClick = (row: TableRow) => {
    if (!row) return
    // 数据来自表格数据,未重新请求api,深克隆,不然可能会影响表格
    let rowClone = cloneDeep(row)
    rowClone.PARAM = rowClone.PARAM ? [{ label: '点击展开', children: buildJsonToElTreeData(JSON.parse(rowClone.PARAM)) }] : []
    baTable.form.extend!['info'] = rowClone
    baTable.form.operate = 'Info'
}
</script>

<style scoped lang="scss"></style>
