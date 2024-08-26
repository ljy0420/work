<template>
    <div class="default-main ba-table-box">
        <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info" show-icon />

        <!-- 表格顶部菜单 -->
        <TableHeader
            :buttons="['refresh', 'add', 'edit', 'delete', 'comSearch', 'quickSearch', 'columnDisplay', 'yxzt']"
            quick-search-placeholder="请输入名称">
            <template #searchBmSlot>
                <el-select v-model="baTable.table.filter!.ssbm" filterable placeholder="请选择所属部门" clearable style="width: 100%" @change="searchBmChange">
                    <el-option v-for="opt in state.bmData" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                </el-select>
            </template>
            <template #searchKslxSlot>
                <el-select v-model="baTable.table.filter!.keshiLX" filterable placeholder="请选择科室类型" clearable style="width: 100%" @change="searchKslxChange">
                    <el-option v-for="opt in state.kslxData" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                </el-select>
            </template>
        </TableHeader>
        <!-- 引入本地iconfont列子
        <span class="iconfont iconjinggai"></span> -->
        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <Table ref="tableRef" height="calc(100vh - 200px)">
            <template #ssbmSlot>
                <el-table-column prop="SSBM" label="所属部门" width="130" align="left">
                    <template #default="scope">
                        <span>{{ renderSsbm(scope.row.SSBM) }}</span>
                    </template>
                </el-table-column>
            </template>
            <template #sjbmSlot>
                <el-table-column prop="SJBM" label="上级科室" width="130" align="left">
                    <template #default="scope">
                        <span>{{ renderSjbm(scope.row.SJBM) }}</span>
                    </template>
                </el-table-column>
            </template>
            <template #sfghSlot>
                <el-table-column prop="SFGH" label="是否挂号" width="90" align="left">
                    <template #default="scope">
                        <span class="span-color-true" v-if="scope.row.SFGH == 1">是</span>
                        <span class="span-color-false" v-if="scope.row.SFGH == 0">否</span>
                    </template>
                </el-table-column>
            </template>
            <template #sfyplySlot>
                <el-table-column prop="SFYPLY" label="药品领用" width="100" align="left">
                    <template #default="scope">
                        <span class="span-color-true" v-if="scope.row.SFYPLY == 1">是</span>
                        <span class="span-color-false" v-if="scope.row.SFYPLY == 0">否</span>
                    </template>
                </el-table-column>
            </template>
            <template #sfwplySlot>
                <el-table-column prop="SFWPLY" label="物品领用" width="100" align="left">
                    <template #default="scope">
                        <span class="span-color-true" v-if="scope.row.SFWPLY == 1">是</span>
                        <span class="span-color-false" v-if="scope.row.SFWPLY == 0">否</span>
                    </template>
                </el-table-column>
            </template>
            <template #sfsblySlot>
                <el-table-column prop="SFSBLY" label="设备领用" width="100" align="left">
                    <template #default="scope">
                        <span class="span-color-true" v-if="scope.row.SFSBLY == 1">是</span>
                        <span class="span-color-false" v-if="scope.row.SFSBLY == 0">否</span>
                    </template>
                </el-table-column>
            </template>
            <!-- 在插槽内，您可以随意发挥，通常使用 el-table-column 组件 -->
            <!-- <template #menzhSlot>
                <el-table-column prop="menzh" label="门诊诊室" width="130" align="center">
                    <template #default="scope">
                        <el-button type="primary" @click="getMzzslbFun(scope.row)">门诊诊室</el-button>
                    </template>
                </el-table-column>
            </template> -->
        </Table>
        <!-- 门诊诊室对话框 -->
        <el-dialog v-model="dialogTableVisible" title="门诊诊室">
            <el-button type="primary" @click="addMz">新增</el-button>
            <el-table :data="state.mzTable" row-key="BM">
                <el-table-column property="BM" label="编码" width="100" />
                <el-table-column property="MC" label="名称" width="130" />
                <el-table-column property="KSBM" label="科室编码" width="100" />
                <el-table-column property="PYM" label="拼音码" width="100" />
                <el-table-column property="WBM" label="五笔码" width="100" />
                <el-table-column property="SFMR" label="是否默认" width="90">
                    <template #default="scope">
                        <span v-if="scope.row.SFMR == 1">是</span>
                        <span v-if="scope.row.SFMR == 0">否</span>
                    </template>
                </el-table-column>
                <el-table-column property="YXZT" label="有效状态" width="90">
                    <template #default="scope">
                        <span v-if="scope.row.YXZT == 1">有效</span>
                        <span v-if="scope.row.YXZT == 0">无效</span>
                    </template>
                </el-table-column>
                <el-table-column property="GHLBBM" label="挂号类别" width="100">
                    <template #default="scope">
                        <span>{{ renderGhlb(scope.row.GHLBBM) }}</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="editMz(scope.row)">编辑</el-button>
                        <el-popconfirm title="您确定删除这条记录吗?" @confirm="deleteMz(scope.row)" confirm-button-type="danger" width="200">
                            <template #reference>
                                <el-button link type="primary" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <!-- 新增or编辑 -->
        <el-dialog v-model="dialogFormVisible" :title="addOrEdit" width="737px">
            <el-form :model="form" :inline="true">
                <!-- <el-form-item label="编码" label-width="96px">
                    <el-input v-model="form.BM" type="string" placeholder="请输入编码" />
                </el-form-item> -->
                <el-form-item label="名称" label-width="96px">
                    <el-input v-model="form.MC" type="string" @change="McChange" placeholder="请输入名称" />
                </el-form-item>
                <el-form-item label="科室编码" label-width="96px" style="display: none">
                    <el-input v-model="form.KSBM" type="string" placeholder="请输入科室编码" />
                </el-form-item>
                <el-form-item label="拼音码" label-width="96px">
                    <el-input v-model="form.PYM" type="string" placeholder="请输入拼音码" />
                </el-form-item>
                <el-form-item label="五笔码" label-width="96px">
                    <el-input v-model="form.WBM" type="string" placeholder="请输入五笔码" />
                </el-form-item>

                <FormItem
                    prop="SFMR"
                    label="是否默认"
                    label-width="96px"
                    v-model="form.SFMR"
                    type="radio"
                    :data="{
                        content: { '0': '否', '1': '是' },
                        childrenAttr: { border: true },
                    }"
                />

                <FormItem
                    prop="YXZT"
                    label="有效状态"
                    label-width="96px"
                    v-model="form.YXZT"
                    type="radio"
                    :data="{
                        content: { '0': '无效', '1': '有效' },
                        childrenAttr: { border: true },
                    }"
                />
                <el-form-item label="挂号类别" label-width="96px">
                    <!-- <el-input v-model="form.GHLBBM" type="string" placeholder="请输入挂号类别编码" /> -->
                    <el-select v-model="form.GHLBBM" placeholder="请选择挂号类别" clearable style="width: 100%">
                        <el-option v-for="opt in state.ghlbData" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="sureHand">确认</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 表单 -->
        <EditForm :ssbm="state.bmData" :kslx="state.kslxData" :sjks="state.sjksData" :bqlb="state.bqlbData" />
    </div>
</template>

<script setup lang="ts">
import { provide, onMounted, ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import baTableClass from '/@/utils/baTable'
import FormItem from '/@/components/formItem/index.vue'
import EditForm from './edit.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/index.vue'
import { defaultOptButtons } from '/@/components/table'
import { getMzzslb, mzzsAdd, mzzsEdit, mzzsDel } from '/@/api/backend/jcgl/kszl'
import { baTableApi, getPymWbm } from '/@/api/common'
import { getZdmx, getGhlbList } from '/@/api/common'
import { useAdminInfo } from '/@/stores/adminInfo'

const adminInfo = useAdminInfo()

defineOptions({
    name: 'xtgl/kszlwh',
})

const state: {
    bmData: any
    kslxData: any
    sjksData: any
    bqlbData: any
    mzTable: any
    tbRow: any
    ghlbData: any
} = reactive({
    bmData: [],
    kslxData: [],
    sjksData: [],
    bqlbData: [],
    mzTable: [
        // {
        //     BM: '000002',
        //     GHLBBM: '112',
        //     JGBM: '532922',
        //     KSBM: '000274',
        //     MC: '诊室2',
        //     PYM: 'PYM',
        //     SFMR: 1,
        //     WBM: 'WBM',
        //     YXZT: 0,
        // },
    ], // 门诊诊室
    tbRow: {},
    ghlbData: [],
})

const form = reactive({
    BM: '',
    GHLBBM: '',
    JGBM: '',
    KSBM: '',
    MC: '',
    PYM: '',
    SFMR: 1,
    WBM: '',
    YXZT: 1,
})

const optButtons = defaultOptButtons(['weigh-sort', 'edit'])
const optBtns: OptButton[] = [
    {
        render: 'tipButton',
        name: 'mzzs',
        text: '诊室',
        type: 'warning',
        icon: 'fa fa-plus-square',
        class: 'table-row-mzzs-edit',
        disabledTip: false,
        click: (row: TableRow) => {
            //console.log(row)
            getMzzslbFun(row)
        },
    },
    ...optButtons,
]

let dialogTableVisible = ref(false) // 门诊诊室是否显示
let dialogFormVisible = ref(false) // 新增或编辑的弹框
let addOrEdit = ref('新增')
let operate = ref('add') // add edit
const tableRef = ref()

const baTable = new baTableClass(
    new baTableApi('/api/v1/xtsjwh/kszlwh/'),
    {
        expandAll: false,
        showComSearch: false,
        dblClickNotEditColumn: [undefined, 'YXZT'],
        column: [
            { label: 'NO', type: 'index', align: 'center' },
            { label: '科室编码', prop: 'KSBM', align: 'left', width: 100 },
            { label: '科室名称', prop: 'KSMC', align: 'left', width: 130 },
            { label: '上级编码', prop: 'SJBM', align: 'left', width: 100, render: 'slot', slotName: 'sjbmSlot' },
            {
                label: '所属部门',
                prop: 'SSBM',
                align: 'left',
                render: 'slot',
                slotName: 'ssbmSlot',
                filterName: 'ssbm',
                // comSearchRender: 'select',
                // replaceValue: state.bmData
                // comSearchRender: 'remoteSelect',
                // remote: { pk: 'BM', field: 'MC', remoteUrl: '/api/v1/common/getzdmx', params: { flbm: 'GB_009002' } },
                comSearchRender: 'slot',
                comSearchSlotName: 'searchBmSlot'
            },
            { label: '是否挂号', prop: 'SFGH', align: 'left', render: 'slot', slotName: 'sfghSlot' },
            { label: '是否药品领用', prop: 'SFYPLY', align: 'left', render: 'slot', slotName: 'sfyplySlot' },
            { label: '是否物资领用', prop: 'SFWPLY', align: 'left', render: 'slot', slotName: 'sfwplySlot' },
            { label: '是否设备领用', prop: 'SFSBLY', align: 'left', render: 'slot', slotName: 'sfsblySlot' },
            {
                label: '科室类型',
                prop: 'KSLX',
                align: 'left',
                showOverflowTooltip: true,
                filterName: 'keshiLX',
                // comSearchRender: 'remoteSelect',
                // remote: { pk: 'BM', field: 'MC', remoteUrl: '/api/v1/common/getzdmx', params: { flbm: 'GB_009004' } },
                comSearchRender: 'slot',
                comSearchSlotName: 'searchKslxSlot'
            },
            // { label: '挂号金额', prop: 'GHJE', align: 'center', operator: false },
            { label: '有效状态', prop: 'YXZT', align: 'left', width: 100, render: 'switch' },
            // { label: '更新时间', prop: 'GXSJ', width: 170, render: 'datetime', operator: 'RANGE' },
            { label: '排序号', prop: 'PXH', align: 'left', width: 100 },
            // { label: 'menzh', prop: 'menzh', render: 'slot', align: 'center', slotName: 'menzhSlot', width: 100 },
            {
                label: '操作',
                align: 'left',
                width: '150',
                // operator: false,
                render: 'buttons',
                buttons: optBtns,
                fixed: 'right',
            },
        ],
        pk: 'KSBM',
    },
    {
        defaultItems: {
            SJBM: '0',
            YXZT: '1',
            SFGH: '1',
            SFYPLY: '1',
            SFWPLY: '1',
            SFSBLY: '1',
            PXH: 0,
        },
    }
)

const renderSsbm = (bm: string) => {
    let ret = bm
    for (let i = 0; i < state.bmData.length; i++) {
        if (state.bmData[i].BM == bm) {
            ret = state.bmData[i].MC
            break
        }
    }
    return ret
}

const renderSjbm = (bm: string) => {
    let ret = bm
    for (let i = 0; i < state.sjksData.length; i++) {
        if (state.sjksData[i].KSBM == bm) {
            ret = state.sjksData[i].KSMC
            break
        }
    }
    if (bm == '0') {
        ret = '无'
    }
    return ret
}

const sureHand = () => {
    form.KSBM = state.tbRow.KSBM
    if (operate.value == 'add') {
        mzzsAdd({ jgbm: adminInfo.jgbm, agrs: { ...form } }).then((res) => {
            console.log(res)
            if (res.code == 1) {
                ElMessage({
                    message: '新增成功',
                    type: 'success',
                })
                dialogFormVisible.value = false
                getMzzslbFun(state.tbRow)
            }
        })
    }
    if (operate.value == 'edit') {
        mzzsEdit({ jgbm: adminInfo.jgbm, agrs: { ...form } }).then((res) => {
            console.log(res)
            if (res.code == 1) {
                ElMessage({
                    message: '修改成功',
                    type: 'success',
                })
                dialogFormVisible.value = false
                getMzzslbFun(state.tbRow)
            }
        })
    }
}

function deleteMz(row: any) {
    // 删除门诊诊室
    if (!row.BM) {
        ElMessage({
            message: '不存在编码',
            type: 'warning',
        })
        return
    }
    mzzsDel({ jgbm: adminInfo.jgbm, agrs: { BM: row.BM } }).then((res) => {
        if (res.code == 1) {
            ElMessage({
                message: '删除成功',
                type: 'success',
            })
            getMzzslbFun(state.tbRow)
        }
    })
}

function getMzzslbFun(row: any) {
    // 点门诊诊室按钮
    state.tbRow = row
    //console.log('row', row)
    getMzzslb({ jgbm: adminInfo.jgbm, agrs: { JGBM: adminInfo.jgbm, KSBM: row.KSBM } }).then((res) => {
        if (res.code == 1) {
            state.mzTable = res.data
        }
    })
    dialogTableVisible.value = true
}

function addMz() {
    // 新增门诊诊室
    dialogFormVisible.value = true
    addOrEdit.value = '新增'
    operate.value = 'add'
    form.BM = ''
    form.GHLBBM = ''
    form.JGBM = ''
    form.KSBM = ''
    form.MC = ''
    form.PYM = ''
    form.SFMR = 1
    form.WBM = ''
    form.YXZT = 1
}

function editMz(row: any) {
    dialogFormVisible.value = true
    addOrEdit.value = '修改'
    operate.value = 'edit'
    form.BM = row.BM
    form.GHLBBM = row.GHLBBM
    form.JGBM = row.JGBM
    form.KSBM = row.KSBM
    form.MC = row.MC
    form.PYM = row.PYM
    form.SFMR = row.SFMR
    form.WBM = row.WBM
    form.YXZT = row.YXZT
}

const McChange = (value: string) => {
    // 门诊里面带出拼音码，五比码
    getPymWbm({ agrs: value })
        .then((res) => {
            form.PYM = res.data.PYM
            form.WBM = res.data.WBM
        })
        .catch((err) => {
            console.log(err)
        })
}

/**
 * 获取挂号类别
 */
getGhlbList({}).then((res) => {
    state.ghlbData = res.data.options
})

const searchBmChange = (value: string) => {
    if(value) {
        baTable.table.filter!.ssbm = value
    } else {
        baTable.table.filter!.ssbm = ''
    }
}

const searchKslxChange = (value: string) => {
    if(value) {
        baTable.table.filter!.keshiLX = value
    } else {
        baTable.table.filter!.keshiLX = ''
    }
}

const renderGhlb = (bm: string) => {
    let ret = bm
    ret = state.ghlbData.find((ele: any) => ele.BM == bm)?.MC
    return ret
}

baTable.table.filter!.page = 1
baTable.table.filter!.size = 20
provide('baTable', baTable)

// baTable.mount()
onMounted(() => {
    baTable.table.ref = tableRef.value
    baTable.mount()
    //获取所属部门
    getZdmx('GB_009002').then((res) => {
        state.bmData = res.data.options
        // console.log('state.bmData', state.bmData)
        baTable.getIndex()?.then(() => {
            baTable.dragSort()
            //console.log(baTable.table.data)
            if (baTable.table.data) {
                let kslb: any = []
                let bqlb: any = []
                kslb.push({ KSBM: '0', KSMC: '请选择上级科室' })
                for (let i = 0; i < baTable.table.data.length; i++) {
                    let item = baTable.table.data[i]
                    if(item.YXZT != 1) {
                        //无效状态的科室不作为编辑页中select的上级科室和所属病区的数据源
                        continue;
                    }
                    if (item.KSLX == '11.病区') {
                        bqlb.push({ KSBM: item.KSBM, KSMC: item.KSMC })
                    } else {
                        kslb.push({ KSBM: item.KSBM, KSMC: item.KSMC })
                    }
                }
                state.sjksData = kslb
                state.bqlbData = bqlb
                // console.log('state.bqlbData', state.bqlbData)
            }
        })
    })
    //获取科室类型
    getZdmx('GB_009004').then((res) => {
        state.kslxData = res.data.options
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
