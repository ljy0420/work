<template>
    <div class="default-main ba-table-box">
        <!-- 表格顶部菜单 -->
        <TableHeader
            :buttons="['refresh', 'add', 'edit', 'delete', 'quickSearch', 'columnDisplay']"
            quick-search-placeholder="输入关键字"
        />

        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <Table height="calc(100vh - 200px)">
            <template #yslxSlot>
                <el-table-column prop="YSLX" label="样式类型" width="150" align="center">
                    <template #default="scope">
                        <span v-if="scope.row.YSLX == 1">fastReport</span>
                        <span v-if="scope.row.YSLX == 2">xtraReoprt</span>
                        <span v-if="scope.row.YSLX == 3">gridviewXML</span>
                        <span v-if="scope.row.YSLX == 4">Stimulsoft Reports</span>
                    </template>
                </el-table-column>
            </template>
        </Table>

        <!-- 表单 -->
        <EditForm />
    </div>
</template>

<script setup lang="ts">
import { reactive,provide } from 'vue'
import baTableClass from '/@/utils/baTable'
import EditForm from './edit.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/default.vue'
import { defaultOptButtons } from '/@/components/table'
import { baTableApi } from '/@/api/common'
import { useRouter } from 'vue-router'

defineOptions({
    name: 'xtgl/ysdjwh',
})

const state: {
    visible: boolean,
    djid: string,
} = reactive({
    visible: false,
    djid: ''
})

const router = useRouter()

/**
 * 用params传参：不可以用path，需要用name（路由名称）；用query传参，则path、name都可以。
1.useRouter是全局路由，useRoute是当前文件路由。
2.如果传的参数是对象，数组，函数最好转成JSON格式，不转传过去的参数会变成object。
 */

const optButtons = defaultOptButtons(['edit'])
const optBtns: OptButton[] = [
    {
        render: 'tipButton',
        name: 'designer',
        text: '设置样式',
        type: 'warning',
        icon: 'fa fa-file-text-o',
        class: 'tb-row-ysdj-edit',
        disabledTip: false,
        click: (row: TableRow) => {
            state.visible = true
            state.djid = row.DJID
            router.push({path:'/admin/xtgl/reports',query:{id:row.DJID}})
            //使用 History API 方式传递和接收, 在跳转前的页面使用 state 参数：a跳转b
            // const params = { id: row.DJID }
            // router.push({name:'xtgl/reports', state: { params }})
        },
        disabled: (row: TableRow) => {
            return row.YSLX==4?false:true
        }
    },
    ...optButtons,
]

const baTable = new baTableClass(
    new baTableApi('/api/v1/xtsjwh/ysdjwh/'),
    {
        column: [
            { label: 'NO', type: 'index', align: 'center' },
            { label: '登记ID', prop: 'DJID', align: 'left', width: 300 },
            { label: '样式类型', prop: 'YSLX', align: 'left', width: 170, render: 'slot', slotName: 'yslxSlot' },
            { label: '样式名称', prop: 'YSMC', align: 'left', width: 200 },
            { label: '说明', prop: 'SM', align: 'left', width: 300 },
            { label: '有效状态', prop: 'YXZT', align: 'left', render: 'switch', width: 150 },
            { label: '更新时间', prop: 'GXSJ', align: 'left', width: 170 },
            {
                label: '操作',
                align: 'left',
                width: '150',
                render: 'buttons',
                buttons: optBtns,
                fixed: 'right'
            },
        ],
        dblClickNotEditColumn: [undefined, 'YXZT'],
    },
    {
        defaultItems: {
            YXZT: '1',
        },
    }
)

baTable.table.filter!.page = 1
baTable.table.filter!.size = 20

provide('baTable', baTable)

baTable.mount()
baTable.getIndex()
</script>

<style scoped lang="scss"></style>
