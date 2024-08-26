<template>
    <div class="default-main">
        <el-row :gutter="10">
            <el-col :xs="24" :sm="6">
                <YzxmflWh :lxData="6" @rowClick="onRowClick" @dataChange="fldataChange" :showheader="false" />
            </el-col>
            <el-col :xs="24" :sm="18">
                <!-- 医嘱 -->
                <Doctorsadvice :selectFlbm="state.selectFlbm" :flData="state.flDataArr" ref="doctorsadvices"></Doctorsadvice>

                <div class="ba-table-box" v-if="yzBm">
                    <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info" show-icon />

                    <!-- 表格顶部菜单 -->
                    <TableHeader :buttons="['refresh', 'add', 'edit', 'delete', 'quickSearch', 'columnDisplay']" quick-search-placeholder="输入关键字" />

                    <!-- 表格 -->
                    <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
                    <Table ref="tableRef" :pagination="false" height="200">
                        <template #hyqkSlot>
                            <el-table-column prop="HYQK" label="货源情况" width="150" align="center">
                                <template #default="scope">
                                    <span>{{ renderHyqk(scope.row.HYQK) }}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #jzflSlot>
                            <el-table-column prop="JZFL" label="价值分类" width="150" align="center">
                                <template #default="scope">
                                    <span>{{ renderJzfl(scope.row.JZFL) }}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #czflSlot>
                            <el-table-column prop="CZFL" label="材质分类" width="150" align="center">
                                <template #default="scope">
                                    <span>{{ renderCzfl(scope.row.CZFL) }}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #zcyqSlot>
                            <el-table-column prop="ZCYQ" label="贮藏要求" width="150" align="center">
                                <template #default="scope">
                                    <span>{{ renderZcyq(scope.row.ZCYQ) }}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #ycxclSlot>
                            <el-table-column prop="YCXCL" label="一次性材料" width="115" align="center">
                                <template #default="scope">
                                    <span class="span-color-true" v-if="scope.row.YCXCL == 1">是</span>
                                    <span class="span-color-false" v-if="scope.row.YCXCL == 0">否</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #yclSlot>
                            <el-table-column prop="YCL" label="原材料" width="100" align="center">
                                <template #default="scope">
                                    <span class="span-color-true" v-if="scope.row.YCL == 1">是</span>
                                    <span class="span-color-false" v-if="scope.row.YCL == 0">否</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #zzclSlot>
                            <el-table-column prop="ZZCL" label="自制材料" width="100" align="center">
                                <template #default="scope">
                                    <span class="span-color-true" v-if="scope.row.ZZCL == 1">是</span>
                                    <span class="span-color-false" v-if="scope.row.ZZCL == 0">否</span>
                                </template>
                            </el-table-column>
                        </template>
                    </Table>

                    <!-- 表单 -->
                    <EditForm :zdData="state.zdData" :selectFlbm="state.selectFlbm" :yzbm="yzBm" />
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { provide, reactive, onMounted, ref, watch } from 'vue'
import baTableClass from '/@/utils/baTable'
import EditForm from './edit.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/default.vue'
import { defaultOptBtns } from '/@/components/table'
import { baTableApi, getMultiZdmx } from '/@/api/common'
import YzxmflWh from '/@/components/yzxmfl-tree/index.vue'
import Doctorsadvice from './components/doctorsadvice/index.vue'

defineOptions({
    name: 'xtgl/ypzdwh',
})

const doctorsadvices = ref(null)
const tableRef = ref()
const state: {
    currentLx: any
    selectFlbm: any
    zdData: any
    flDataArr: any //分类数据
    hyqkArr: any //货源情况
    jzflArr: any //价值分类
    czflArr: any //材质分类
    zcyqArr: any //贮藏要求
    gllbArr: any //管理类别
} = reactive({
    currentLx: '6',
    selectFlbm: '',
    zdData: [],
    flDataArr: [], 
    hyqkArr: [], //货源情况
    jzflArr: [], //价值分类
    czflArr: [], //材质分类
    zcyqArr: [], //贮藏要求
    gllbArr: [], //管理类别
})

const yzBm = ref()
watch(
    () => doctorsadvices.value?.currentRarios,
    (val) => {
        if (val) {
            yzBm.value = val
            getIndex()
        }
    }
)

const optButtons = defaultOptBtns(['edit', 'delete'])

const baTable = new baTableClass(
    new baTableApi('/api/v1/xtsjwh/clzd/'),
    {
        column: [
            { label: 'NO', type: 'index', align: 'center' },
            { label: '材料编码', prop: 'CLBM', align: 'left', width: 130 },
            { label: '材料名称', prop: 'CLMC', align: 'left', width: 200 },
            { label: '灭菌效期', prop: 'MJXQ', align: 'left', width: 100 },
            { label: '一次性材料', prop: 'YCXCL', align: 'left', width: 100, render: 'slot', slotName: 'ycxclSlot' },
            { label: '原材料', prop: 'YCL', align: 'left', width: 100, render: 'slot', slotName: 'yclSlot' },
            { label: '材质分类', prop: 'CZFL', align: 'left', width: 200, render: 'slot', slotName: 'czflSlot' },
            { label: '贮藏要求', prop: 'ZCYQ', align: 'left', width: 200, render: 'slot', slotName: 'zcyqSlot' },
            { label: '自制材料', prop: 'ZZCL', align: 'left', width: 100, render: 'slot', slotName: 'zzclSlot' },
            { label: '货源情况', prop: 'HYQK', align: 'left', width: 200, render: 'slot', slotName: 'hyqkSlot' },
            { label: '价值分类', prop: 'JZFL', align: 'left', width: 200, render: 'slot', slotName: 'jzflSlot' },
            { label: '有效状态', prop: 'YXZT', align: 'left', width: 100, render: 'switch' },
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
            WJCL: '0',
            YCXCL: '0',
            ZBCL: '0',
            QCGL: '0',
            ZRCL: '0',
            GZHC: '0',
            JRCL: '0',
            ZDJK: '0',
            YXZT: '1',
        },
        labelWidth: 115
    }
)
// 左侧分类
const onRowClick = (row: any) => {
    state.selectFlbm = row.FLBM
    doctorsadvices.value.currentRarios = ''
    yzBm.value = ''
}
const getIndex = () => {
    baTable.table.filter = { yxzt: '-1', fenLeiBM: state.selectFlbm, YZXMBM: yzBm.value }
    baTable.getIndex()
}
// 货源情况
const renderHyqk = (bm: string) => {
    let ret = bm
    if (state.hyqkArr.length > 0) {
        for (let i = 0; i < state.hyqkArr.length; i++) {
            if (state.hyqkArr[i].BM == bm) {
                ret = state.hyqkArr[i].MC
                break
            }
        }
    }
    return ret
}
//价值分类
const renderJzfl = (bm: string) => {
    let ret = bm
    if (state.jzflArr.length > 0) {
        for (let i = 0; i < state.jzflArr.length; i++) {
            if (state.jzflArr[i].BM == bm) {
                ret = state.jzflArr[i].MC
                break
            }
        }
    }
    return ret
}
//材质分类
const renderCzfl = (bm: string) => {
    let ret = bm
    if (state.czflArr.length > 0) {
        for (let i = 0; i < state.czflArr.length; i++) {
            if (state.czflArr[i].BM == bm) {
                ret = state.czflArr[i].MC
                break
            }
        }
    }
    return ret
}
//贮藏要求
const renderZcyq = (bm: string) => {
    let ret = bm
    if (state.zcyqArr.length > 0) {
        for (let i = 0; i < state.zcyqArr.length; i++) {
            if (state.zcyqArr[i].BM == bm) {
                ret = state.zcyqArr[i].MC
                break
            }
        }
    }
    return ret
}

const fldataChange = (data: any) => {
    state.flDataArr = data
    state.selectFlbm = ''
    baTable.form.defaultItems!.FLBM = ''
    baTable.table.selection = []
    getIndex()
}

provide('baTable', baTable)

onMounted(() => {
    baTable.table.ref = tableRef.value
    baTable.mount()
    getMultiZdmx(['GB_100006,GB_009018,GB_100007,GB_100008,GB_100009,GB_009012']).then((res) => {
        state.zdData = res.data.options
        state.hyqkArr = state.zdData.filter((ele: any) => ele.FLBM == 'GB_100006')
        state.jzflArr = state.zdData.filter((ele: any) => ele.FLBM == 'GB_009018')
        state.czflArr = state.zdData.filter((ele: any) => ele.FLBM == 'GB_100007')
        state.zcyqArr = state.zdData.filter((ele: any) => ele.FLBM == 'GB_100008')
        state.gllbArr = state.zdData.filter((ele: any) => ele.FLBM == 'GB_100009')
    })
})
</script>

<style scoped lang="scss">
.span-color-true {
    color: rgb(49, 132, 226);
}
.span-color-false {
    color: #808080;
}
</style>
