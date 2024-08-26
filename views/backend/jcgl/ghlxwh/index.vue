<template>
    <div class="default-main ba-table-box">
        <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info" show-icon />

        <!-- 表格顶部菜单 -->
        <TableHeader :buttons="['refresh', 'add', 'edit', 'delete', 'quickSearch', 'columnDisplay']" quick-search-placeholder="输入关键字" />

        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <Table ref="tableRef" @row-click="onRowClick">
            <!-- <el-table-column prop="FLBM" label="选择" width="70" align="center">
                <template #default="scope">
                    <el-radio v-model="state.tableRadio" :label="scope.row.FLBM">&nbsp;</el-radio>
                </template>
            </el-table-column> -->

            <template #lxSlot>
                <el-table-column prop="LX" label="挂号类型" width="150" align="center">
                    <template #default="scope">
                        <span>{{ renderLx(scope.row.LX) }}</span>
                    </template>
                </el-table-column>
            </template>
            <template #jszcSlot>
                <el-table-column prop="JSZC" label="技术职称" width="150" align="center">
                    <template #default="scope">
                        <span>{{ renderJszc(scope.row.JSZC) }}</span>
                    </template>
                </el-table-column>
            </template>
        </Table>

        <Assodoc :rowBm="state.rowBm" v-if="state.rowBm" style="margin-top: 40px" />

        <!-- 表单 -->
        <EditForm :zdData="state.zdData" :yzxmData="state.yzxmData" :ksList="state.ksList" :ryList="state.ryList" />
    </div>
</template>

<script setup lang="ts">
import { provide, onMounted, ref, reactive } from 'vue'
import baTableClass from '/@/utils/baTable'
import EditForm from './edit.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/default.vue'
import { defaultOptBtns } from '/@/components/table'
import { baTableApi, getMultiZdmx, getGetYzxmzd, getKsList, getrylist } from '/@/api/common'
import Assodoc from '/@/components/assodoc/index.vue'
import { useAdminInfo } from '/@/stores/adminInfo'

const adminInfo = useAdminInfo()

defineOptions({
    name: 'xtsjwh/ghlxwh',
})

const tableRef = ref()

const state: {
    zdData: any
    yzxmData: any
    ksList: any
    ryList: any
    lxArr: any
    jszcArr: any
    rowBm: string
} = reactive({
    zdData: [],
    yzxmData: [],
    ksList: [],
    ryList: [],
    lxArr: [],
    jszcArr: [],
    rowBm: '',
})

const optButtons = defaultOptBtns(['edit', 'delete'])

const baTable = new baTableClass(
    new baTableApi('/api/v1/xtsjwh/ghlxwh/'),
    {
        column: [
            { label: 'NO', type: 'index', align: 'center' },
            { label: '编码', prop: 'BM', align: 'left', width: 130 },
            { label: '名称', prop: 'MC', align: 'left', minWidth: 130, showOverflowTooltip: true },
            { label: '挂号类型', prop: 'LX', align: 'left', width: 130, render: 'slot', slotName: 'lxSlot' },
            { label: '医嘱项目编码', prop: 'YZXMBM', align: 'left', width: 130 },
            { label: '科室名称', prop: 'KSMC', align: 'left', width: 130 },
            { label: '医生姓名', prop: 'YSXM', align: 'left', width: 130 },
            { label: '技术职称', prop: 'JSZC', align: 'left', width: 130, render: 'slot', slotName: 'jszcSlot' },
            { label: '拼音码', prop: 'PYM', align: 'left', width: 100 },
            { label: '五笔码', prop: 'WBM', align: 'left', width: 100 },
            { label: '开始时间', prop: 'KSSJ', align: 'left', width: 170 },
            { label: '结束时间', prop: 'JSSJ', align: 'left', width: 170 },
            {
                label: '操作',
                align: 'center',
                width: '90',
                render: 'buttons',
                buttons: optButtons,
                fixed: 'right',
            },
        ],
        dblClickNotEditColumn: [undefined, 'status'],
    },
    {
        defaultItems: {
            status: '1',
        },
    }
)

const renderLx = (bm: string) => {
    let ret = bm
    for (let i = 0; i < state.lxArr.length; i++) {
        if (state.lxArr[i].BM == bm) {
            ret = state.lxArr[i].MC
            break
        }
    }
    return ret
}

const renderJszc = (bm: string) => {
    let ret = bm
    for (let i = 0; i < state.jszcArr.length; i++) {
        if (state.jszcArr[i].BM == bm) {
            ret = state.jszcArr[i].MC
            break
        }
    }
    return ret
}

const onRowClick = (row: any) => {
    state.rowBm = row.BM
}

onMounted(() => {
    baTable.table.ref = tableRef.value
    baTable.mount()
    getMultiZdmx(['GB_100010', 'GB_00101'])
        .then((res) => {
            state.zdData = res.data.options
            state.lxArr = state.zdData.filter((ele: any) => ele.FLBM == 'GB_100010')
            state.jszcArr = state.zdData.filter((ele: any) => ele.FLBM == 'GB_00101')
        })
        .catch((err) => {
            console.log(err)
        })

    getGetYzxmzd({ jgbm: adminInfo.jgbm, agrs: { leiBieBM: 11 } }).then((res) => {
        state.yzxmData = res.data.options
    })

    getKsList().then((res) => {
        state.ksList = res.data.options
    })

    getrylist({ agrs: { liShuZ: 1 } }).then((res) => {
        state.ryList = res.data.options
    })
})

provide('baTable', baTable)

baTable.mount()
baTable.getIndex()
</script>

<style scoped lang="scss"></style>
