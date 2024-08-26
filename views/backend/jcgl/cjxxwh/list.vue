<template>
    <div class="default-main ba-table-box">
        <!-- 表格顶部菜单 -->
        <TableHeader :buttons="['refresh', 'add', 'edit', 'delete', 'quickSearch', 'columnDisplay']"
            quick-search-placeholder="请输入关键字" />

        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <Table :pagination="false" height="calc(100vh - 139px)" />

        <!-- 表单 -->
        <EditForm />
    </div>
</template>

<script setup lang="ts">
import { provide, reactive } from 'vue'
import baTableClass from '/@/utils/baTable'
import EditForm from './edit.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/default.vue'
import { defaultOptBtns } from '/@/components/table'
import { baTableApi } from '/@/api/common'

const state: {
    DLBM: string
} = reactive({
    DLBM: '2',
})

defineOptions({
    name: 'xtgl/cjxxwh',
})

const optButtons = defaultOptBtns(['edit', 'delete'])

const baTable = new baTableClass(
    new baTableApi('/api/v1/xtsjwh/cjxxwh/'),
    {
        column: [
            { label: 'NO', type: 'index', align: 'center' },
            { label: '厂家编码', prop: 'CJBM', align: 'left', width: 100 },
            { label: '厂家名称', prop: 'CJMC', align: 'left', minWidth: 260, showOverflowTooltip: true },
            { label: '别名', prop: 'BM', align: 'left', width: 150 },
            { label: '联系人', prop: 'LXR', align: 'left', width: 100 },
            { label: '开户银行', prop: 'KHYH', align: 'left', width: 150 },
            { label: '开户账号', prop: 'YHZH', align: 'left', width: 170, showOverflowTooltip: true },
            { label: '联系人电话', prop: 'LXRDH', align: 'left', width: 130 },
            { label: '地址', prop: 'DZ', align: 'left', width: 200 },
            { label: '有效状态', prop: 'YXZT', align: 'left', width: 100, render: 'switch' },
            {
                label: '操作',
                align: 'center',
                width: '90',
                render: 'buttons',
                buttons: optButtons,
                fixed: 'right'
            },
        ],
        dblClickNotEditColumn: [undefined, 'YXZT'],
        pk: 'CJBM',
        filter: { DLBM: state.DLBM }
    },
    {
        defaultItems: {
            YXZT: '1',
        },
        labelWidth: 100
    }
)

const dlbmChange = (value: any) => {
    //console.log(value)
    baTable.form.defaultItems!.DLBM = value
    baTable.table.filter = { DLBM: value }
    if (value === '2') {
        baTable.form.defaultItems!.XLBM = '4'
    } else if (value === '3') {
        baTable.form.defaultItems!.XLBM = '5'
    } else if (value === '4') {
        baTable.form.defaultItems!.XLBM = '8'
    }
    baTable.getIndex()
}

provide('baTable', baTable)

baTable.mount()
baTable.getIndex()
baTable.form.defaultItems!.DLBM = '2'
baTable.form.defaultItems!.XLBM = '4'

</script>

<style scoped lang="scss"></style>
