<template>
    <div class="ba-table-box layout">
        <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info" show-icon />

        <!-- 表格顶部菜单 -->
        <TableHeader :buttons="['refresh', 'add', 'edit', 'delete', 'quickSearch', 'columnDisplay']" quick-search-placeholder="输入关键字" />

        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <Table ref="tableRef" height="400" @row-click="onRowClick">
            <template #radiozSlot>
                <el-table-column prop="FLBM" label="选择" width="70" align="center">
                    <template #default="scope">
                        <el-radio v-model="currentRarios" :label="scope.row.XMBM">&nbsp;</el-radio>
                    </template>
                </el-table-column>
            </template>
            <template #kssjSlot>
                <el-table-column prop="KSSJ" label="开始时间" width="150" align="center">
                    <template #default="scope">
                        <span>{{ renderSj(scope.row.KSSJ) }}</span>
                    </template>
                </el-table-column>
            </template>
            <template #jssjSlot>
                <el-table-column prop="JSSJ" label="结束时间" width="150" align="center">
                    <template #default="scope">
                        <span>{{ renderSj(scope.row.JSSJ) }}</span>
                    </template>
                </el-table-column>
            </template>
        </Table>

        <!-- 表单 -->
        <EditForm :zdData="state.zdData" :selectFlbm="prop.selectFlbm" :flData="prop.flData" />
    </div>
</template>

<script setup lang="ts">
import { provide, reactive, ref, watch, onMounted } from 'vue'
import baTableClass from '/@/utils/baTable'
import EditForm from './edit.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/default.vue'
import { defaultOptBtns } from '/@/components/table'
import { baTableApi } from '/@/api/common'

defineOptions({
    name: 'xtgl/ypzdwh',
})

const prop = defineProps(['selectFlbm','flData'])

const tableRef = ref()
const state: {
    selectFlbm: any
    zdData: any
    btnArr: any
} = reactive({
    selectFlbm: '',
    zdData: [],
    btnArr: [],
})

const currentRarios = ref('')
const onRowClick = (row: any) => {
    currentRarios.value = row.XMBM
}

watch(
    () => prop.selectFlbm,
    (val) => {
        baTable.form.defaultItems!.FLBM = val
        getIndex()
    }
)

const getIndex = () => {
    baTable.table.filter = { yxzt: '-1', fenLeiBM: prop.selectFlbm }
    baTable.getIndex()?.then(()=>{
        if(baTable.table.data && baTable.table.data!.length > 0) { 
            baTable.table.ref?.getRef()?.setCurrentRow(baTable.table.data[0])
            baTable.table.selection?.splice(0, 1);
            baTable.table.selection?.push(baTable.table.data![0])
            onRowClick(baTable.table.data![0])
        } else {
            baTable.table.selection = []
        }
    })
}

const renderSj = (bm: string) => {
    let ret = bm
    return ret?.substring(0, 10)
}

const optButtons = defaultOptBtns(['edit', 'delete'])

const baTable = new baTableClass(
    new baTableApi('/api/v1/xtsjwh/yzxmzdwh/'),
    {
        column: [
            // { type: 'selection', align: 'center', render: 'slot', slotName: 'radiozSlot' },
            { label: 'NO', type: 'index', align: 'center' },
            { label: '编码', prop: 'XMBM', align: 'left', width: 130 },
            { label: '项目名称', prop: 'XMMC', align: 'left', width: 150 },
            { label: '诊疗类别', prop: 'LB', align: 'left', width: 130 },
            { label: '分类编码', prop: 'FLBM', align: 'left', width: 130 },
            { label: '计算方式', prop: 'JSFS', align: 'left', width: 130 },
            { label: '开始时间', prop: 'KSSJ', align: 'left', render: 'slot', slotName: 'kssjSlot' },
            { label: '结束时间', prop: 'JSSJ', align: 'left', render: 'slot', slotName: 'jssjSlot' },
            { label: '五笔码', prop: 'WBM', align: 'left', width: 130 },
            { label: '拼音码', prop: 'PYM', align: 'left', width: 130 },
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
            SCBZ: '0'
        },
        labelWidth: 100
    }
)

provide('baTable', baTable)

onMounted(() => {
    baTable.table.ref = tableRef.value
    baTable.mount()
})

defineExpose({ currentRarios })
</script>

<style scoped lang="scss">
.layout {
    margin-bottom: 20px;
}
</style>
