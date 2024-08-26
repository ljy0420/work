<template>
    <div class="default-main ba-table-box">
        <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info"
            show-icon />

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
    import TableHeader from '/@/components/table/header/index.vue'
    import { defaultOptButtons } from '/@/components/table'
    import { baTableApi } from '/@/api/common'
    import { useAdminInfo } from '/@/stores/adminInfo'

    const adminInfo = useAdminInfo()

    defineOptions({
        name: 'xtgl/yzxmjylx',
    })

    const optButtons = defaultOptButtons(['edit', 'delete'])

    const baTable = new baTableClass(
        new baTableApi('/api/v1/xtsjwh/yzxmjylx/'),
        {
            column: [
                { type: 'selection', align: 'center', operator: false },
                { label: '机构编码', prop: 'JGBM', align: 'left', width: 130 },
                { label: '编码', prop: 'BM', align: 'left', width: 100 },
                { label: '名称', prop: 'MC', align: 'left', width: 200 },
                { label: '拼音码', prop: 'PYM', align: 'left', width: 100 },
                { label: '管码', prop: 'GM', align: 'left', width: 100 },
                { label: '默认标志', prop: 'MRBZ', align: 'left', width: 100 },

                {
                    label: '操作',
                    align: 'left',
                    width: '100',
                    render: 'buttons',
                    buttons: optButtons,
                    operator: false,
                },
            ],
            pk: 'BM',
            //用户信息
            filter: { jgbm: adminInfo.jgbm, bm: '' }
        },
        {
            // 默认值
            defaultItems: {
                MRBZ: '0',
                JGBM: adminInfo.jgbm
            },
            labelWidth:80
        }
    )

    provide('baTable', baTable)

    baTable.mount()
    baTable.getIndex()
</script>

<style scoped lang="scss"></style>
