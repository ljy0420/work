<template>
    <div class="default-main">
        <el-row :gutter="10">
            <el-col :xs="24" :sm="6">
                <Yzxmfl :lxData="4" @rowClick="onRowClick" @dataChange="fldataChange" :showheader="false" />
            </el-col>
            <el-col :xs="24" :sm="18">
                <div class="ba-table-box">
                    <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info" show-icon />

                    <!-- 表格顶部菜单 -->
                    <TableHeader
                        :buttons="['refresh', 'add', 'edit', 'delete', 'quickSearch', 'columnDisplay']"
                        quick-search-placeholder="输入关键字"
                    />

                    <!-- 表格 -->
                    <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 height="calc(100vh - 200px)" @row-click="onRadioClick" @row-dblclick="dblclick"-->
                    <Table ref="tableRef" height="450" @row-dblclick="dblclick" @row-click="onRadioClick">
                        <template #radiozSlot>
                            <el-table-column prop="XMBM" label="选择" width="70" align="center">
                                <template #default="scope">
                                    <el-radio v-model="state.rowBm" :label="scope.row.XMBM">&nbsp;</el-radio>
                                </template>
                            </el-table-column>
                        </template>
                        <template #fwdxSlot>
                            <el-table-column prop="FWDX" label="服务对象" width="130" align="left">
                                <template #default="scope">
                                    <span v-if="scope.row.FWDX == 0">无</span>
                                    <span v-if="scope.row.FWDX == 1">门诊</span>
                                    <span v-if="scope.row.FWDX == 2">住院</span>
                                    <span v-if="scope.row.FWDX == 3">门诊和住院</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #jsffSlot>
                            <el-table-column prop="JSFS" label="计算方式" width="130" align="left">
                                <template #default="scope">
                                    <span v-if="scope.row.JSFS == 0">人工计算</span>
                                    <span v-if="scope.row.JSFS == 1">自动计算</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #sfdzSlot>
                            <el-table-column prop="SFDZ" label="打折" width="80" align="left">
                                <template #default="scope">
                                    <span v-if="scope.row.SFDZ == 0">否</span>
                                    <span v-if="scope.row.SFDZ == 1">是</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #sfbjSlot>
                            <el-table-column prop="SFBJ" label="变价" width="80" align="left">
                                <template #default="scope">
                                    <span v-if="scope.row.SFBJ == 0">否</span>
                                    <span v-if="scope.row.SFBJ == 1">允许变价</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #jbjjSlot>
                            <el-table-column prop="JBJJ" label="加班加价" width="100" align="left">
                                <template #default="scope">
                                    <span v-if="scope.row.JBJJ == 0">不加价</span>
                                    <span v-if="scope.row.JBJJ == 1">比例加价</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #fyqrSlot>
                            <el-table-column prop="FYQR" label="费用确认" width="100" align="left">
                                <template #default="scope">
                                    <span v-if="scope.row.FYQR == 0">否</span>
                                    <span v-if="scope.row.FYQR == 1">是</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #yxztSlot>
                            <el-table-column prop="YXZT" label="有效状态" width="90" align="left">
                                <template #default="scope">
                                    <span class="span-color-true" v-if="scope.row.YXZT == 1">有效</span>
                                    <span class="span-color-false" v-if="scope.row.YXZT == 0">无效</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #mzzxksSlot>
                            <el-table-column prop="MZZXKS" label="门诊执行科室" width="130" align="left">
                                <template #default="scope">
                                    <span v-if="scope.row.MZZXKS == 0">无明确执行科室</span>
                                    <span v-if="scope.row.MZZXKS == 1">病人科室</span>
                                    <span v-if="scope.row.MZZXKS == 2">病人病区</span>
                                    <span v-if="scope.row.MZZXKS == 3">操作员所在科室</span>
                                    <span v-if="scope.row.MZZXKS == 4">指定科室执行</span>
                                    <span v-if="scope.row.MZZXKS == 6">开单人所在科室</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #zyzxksSlot>
                            <el-table-column prop="ZYZXKS" label="住院执行科室" width="130" align="left">
                                <template #default="scope">
                                    <span v-if="scope.row.ZYZXKS == 0">无明确执行科室</span>
                                    <span v-if="scope.row.ZYZXKS == 1">病人科室</span>
                                    <span v-if="scope.row.ZYZXKS == 2">病人病区</span>
                                    <span v-if="scope.row.ZYZXKS == 3">操作员所在科室</span>
                                    <span v-if="scope.row.ZYZXKS == 4">指定科室执行</span>
                                    <span v-if="scope.row.ZYZXKS == 6">开单人所在科室</span>
                                </template>
                            </el-table-column>
                        </template>
                    </Table>

                    <!-- 门诊诊室对话框 -->
                    <el-dialog v-model="dialogTableVisible" title="调价" style="width: 745px">
                        <el-form :model="addForm" :inline="true">
                            <el-form-item label="原价" label-width="96px">
                                <el-input v-model="addForm.YJ" type="string" disabled placeholder="请输入原价" />
                            </el-form-item>
                            <el-form-item label="现价" label-width="96px">
                                <el-input v-model="addForm.XJ" type="string" placeholder="请输入现价" />
                            </el-form-item>
                            <el-form-item label="变动原因" label-width="96px">
                                <!-- <el-input v-model="addForm.BDYY" type="string" placeholder="请输入变动原因" /> -->
                                <el-select v-model="addForm.BDYY">
                                    <el-option v-for="opt in state.bdyy" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="调价单号" label-width="96px">
                                <el-input v-model="addForm.DH" type="string" placeholder="请输入调价单号" />
                            </el-form-item>
                            <el-form-item label="有效时间" label-width="96px">
                                <el-date-picker v-model="addForm.YXSJ" type="date" placeholder="请选择有效时间" />
                            </el-form-item>
                            <el-form-item label="开始时间" label-width="96px">
                                <el-date-picker v-model="addForm.ZXSJ" type="date" placeholder="请选择开始时间" />
                            </el-form-item>

                            <el-form-item label="调价说明" label-width="96px">
                                <el-input v-model="addForm.TJSM" type="textarea" style="width: 220px" placeholder="请输入调价说明" />
                            </el-form-item>
                        </el-form>

                        <el-table :data="state.mzTable" style="margin-top: 10px" @cell-click="cellClickHandle">
                            <el-table-column label="选择" width="70" align="center">
                                <template #default="scope">
                                    <el-radio v-model="state.tableRadio" :label="scope.row.FLBM">&nbsp;</el-radio>
                                </template>
                            </el-table-column>
                            <el-table-column property="ID" label="唯一号" width="90" />
                            <el-table-column property="YJID" label="原价ID" width="100" />
                            <el-table-column property="XMMC" label="项目名称" width="90" />
                            <el-table-column property="YJ" label="原价" width="90" />
                            <el-table-column property="XJ" label="现价" width="90" />
                            <el-table-column property="BDYY" label="变动原因" width="90">
                                <template #default="scope">
                                    <span v-if="scope.row.BDYY == 1">初始定价</span>
                                    <span v-if="scope.row.BDYY == 2">日常调价</span>
                                </template>
                            </el-table-column>
                            <el-table-column property="TJSM" label="调价说明" width="90"> </el-table-column>
                            <el-table-column property="DH" label="调价单号" width="90"> </el-table-column>
                            <el-table-column property="TJRBM" label="调价人编码" width="100"> </el-table-column>
                            <el-table-column property="ZXSJ" label="执行时间" width="100" />
                            <el-table-column property="YXSJ" label="有效时间" width="100" />
                            <el-table-column property="GXSJ" label="更新时间" width="100" />
                        </el-table>
                        <template #footer>
                            <span class="dialog-footer">
                                <el-button type="primary" @click="saveHand">保存</el-button>
                                <el-button @click="dialogTableVisible = false">关闭</el-button>
                            </span>
                        </template>
                    </el-dialog>

                    <!-- 表单 -->
                    <EditForm
                        :cjxxArr="state.cjxxArr"
                        :bxlbArr="state.bxlbArr"
                        :zdData="state.zdData"
                        :fldata="state.flData"
                        :flDataArr="state.flDataArr"
                        :zxksBotData="state.zxksBotData"
                        :flbm="state.currentFlbm"
                    />
                </div>
                <!-- 关联 -->
                <Sfxmzd
                    :rowBM="state.rowBm"
                    v-if="baTable.table.data!.length > 0 && state.rowBm"
                    :mxtableData="state.zxksBotData"
                    :xfxmRowData="state.currentRowXm"
                    @currentRowData="currentRowData"
                ></Sfxmzd>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref, provide } from 'vue'
import { ElMessage } from 'element-plus'
import baTableClass from '/@/utils/baTable'
import EditForm from './edit.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/default.vue'
import { getCxjdfl, getCxzljmb, Bczljmb, getCxzlzxks } from '/@/api/backend/jcgl/zlzdwh'
import { defaultOptBtns } from '/@/components/table'
import { baTableApi, getMultiZdmx, getBxlblist, getCjxxlist } from '/@/api/common'
import Yzxmfl from '/@/components/yzxmfl-tree/index.vue'
import Sfxmzd from './components/index.vue'
import { useAdminInfo } from '/@/stores/adminInfo'

const adminInfo = useAdminInfo()
const state: {
    tableRadio: any
    flData: any
    currentFlbm: any
    zdData: any
    lbArr: any
    glbmArr: any
    baglbmArr: any
    bxlbArr: any
    cjxxArr: any
    dwArr: any //单位
    btnArr: any
    tbRow: any
    mzTable: any
    bdyy: any
    rowBm: any
    flDataArr: any
    zxksBotData: any
    currentRowXm: any
} = reactive({
    tableRadio: '',
    flData: [],
    currentFlbm: '',
    zdData: [],
    lbArr: [],
    glbmArr: [],
    baglbmArr: [],
    bxlbArr: [],
    cjxxArr: [],
    dwArr: [],
    btnArr: [],
    rowBm: '',
    tbRow: {},
    mzTable: [],
    flDataArr: [],
    zxksBotData: [],
    bdyy: [
        { value: 1, label: '初始定价' },
        { value: 2, label: '日常调价' },
    ],
    currentRowXm: [],
})

defineOptions({
    name: 'xtgl/zlzdwh',
})

const tableRef = ref()
const mxtableData = ref([])
const addForm = reactive({
    YJ: '',
    XJ: '',
    BDYY: '',
    DH: '',
    YXSJ: '',
    ZXSJ: '',
    TJSM: '',
})

const dblclick = (row: any) => {
    //state.rowBm = row.XMBM
    // state.currentRowXm = row
    //console.log('state.rowBm: ', state.rowBm)
}

const onRadioClick = (row: any) => {
    state.rowBm = row.XMBM
    state.currentRowXm = row
    baTable.table.selection?.splice(0, 1)
    baTable.table.selection?.push(row)
    getZxksData(row.XMBM)
}

const optButtons = defaultOptBtns(['edit', 'delete'])
// const optBtns: OptButton[] = [
//     {
//         render: 'tipButton',
//         name: 'info',
//         text: '调价',
//         type: 'success',
//         icon: '',
//         disabledTip: false,
//         click: (row: TableRow) => {
//             getTjFun(row)
//         },
//     },
//     ...optButtons,
// ]

let dialogTableVisible = ref(false)

const currentRowData = (row: any) => {
    baTable.form.items = state.currentRowXm
    baTable.form.operate = 'Edit'
    // state.zxksBotData = row
    // console.log('state.zxksBotData: ', state.zxksBotData)
}

function getTjFun(row: any) {
    console.log('row', row)

    // 点门诊诊室按钮
    state.tbRow = row

    getCxzljmb({ jgbm: adminInfo.jgbm, agrs: { XMBM: row.XMBM } }).then((res) => {
        if (res.code == 1) {
            state.mzTable = res.data
        }
    })
    dialogTableVisible.value = true
}

const getZxksData = (xmbm: string) => {
    getCxzlzxks({ jgbm: adminInfo.jgbm, agrs: xmbm }).then((res) => {
        console.log('getZxksData', res)
        let arr: any = []
        res.data.forEach((item: any) => {
            arr.push({ BRLY: item.BRLY, FWKS: item.FWKS, ZXKSBM: item.ZXKSBM, isEdit: false, editTxt: '编辑' })
        })
        state.zxksBotData = arr
    })
}

const baTable = new baTableClass(
    new baTableApi('/api/v1/xtsjwh/zlzdwh/'),
    {
        expandAll: false,
        showComSearch: false,
        column: [
            // { type: 'selection', align: 'center', render: 'slot', slotName: 'radiozSlot' },
            { label: 'NO', type: 'index', align: 'center' },
            { label: '类别', prop: 'LBMC', align: 'left', width: 100 },
            { label: '项目编码', prop: 'XMBM', align: 'left', width: 130 },
            { label: '项目名称', prop: 'XMMC', align: 'left', width: 130 },
            { label: '服务对象', prop: 'FWDX', align: 'left', width: 100, render: 'slot', slotName: 'fwdxSlot' },
            { label: '单位', prop: 'DWMC', align: 'left', width: 100 },
            { label: '成本价', prop: 'CBJ', align: 'left', width: 70 },
            { label: '当前售价', prop: 'DJ', align: 'left', width: 100 },
            { label: '首部位加价', prop: 'SBWJJ', align: 'left', width: 100 },
            { label: '最低价', prop: 'ZDJ', align: 'left', width: 80 },
            { label: '最高价', prop: 'ZGJ', align: 'left', width: 80 },
            { label: '计算方式', prop: 'JSFS', align: 'left', width: 100, render: 'slot', slotName: 'jsffSlot' },
            { label: '打折', prop: 'SFDZ', align: 'left', width: 70, render: 'slot', slotName: 'sfdzSlot' },
            { label: '变价', prop: 'SFBJ', align: 'left', width: 70, render: 'slot', slotName: 'sfbjSlot' },
            { label: '加班加价', prop: 'JBJJ', align: 'left', width: 100, render: 'slot', slotName: 'jbjjSlot' },
            { label: '费用确认', prop: 'FYQR', align: 'left', width: 80, render: 'slot', slotName: 'fyqrSlot' },
            { label: '医保类别', prop: 'YBLBMC', align: 'left', width: 100 },
            { label: '医保自付比例', prop: 'YBZFBL', align: 'left', width: 120 },
            { label: '工伤类别', prop: 'GSLBMC', align: 'left', width: 100 },
            { label: '工伤自付比例', prop: 'GSZFBL', align: 'left', width: 120 },
            { label: '收入项目', prop: 'SRXMMC', align: 'left', width: 100 },
            { label: '收据归类', prop: 'SJGLMC', align: 'left', width: 100 },
            { label: '财务归类', prop: 'CWGLMC', align: 'left', width: 100 },
            { label: '业务归类', prop: 'YWGLMC', align: 'left', width: 100 },
            { label: '折扣归类', prop: 'ZKGLMC', align: 'left', width: 100 },
            { label: '病案归类', prop: 'BAGLMC', align: 'left', width: 130 },
            { label: '门诊执行科室', prop: 'MZZXKS', align: 'left', width: 130, render: 'slot', slotName: 'mzzxksSlot' },
            { label: '住院执行科室', prop: 'ZYZXKS', align: 'left', width: 130, render: 'slot', slotName: 'zyzxksSlot' },
            { label: '有效状态', prop: 'YXZT', align: 'left', width: 130, render: 'slot', slotName: 'yxztSlot' },
            { label: '国家编码', prop: 'GJBM', align: 'left', width: 100 },
            { label: '国家名称', prop: 'GJMC', align: 'left', width: 130 },
            { label: '省编码', prop: 'SXMBM', align: 'left', width: 100 },
            { label: '省名称', prop: 'SXMMC', align: 'left', width: 130 },
            {
                label: '操作',
                align: 'center',
                width: '90',
                render: 'buttons',
                buttons: optButtons,
                // buttons: optBtns,
                fixed: 'right',
            },
        ],
        dblClickNotEditColumn: [undefined, 'YXZT'],
    },
    {
        defaultItems: {
            SFDZ: 0,
            FYQR: 0,
            SFBJ: 0,
            JSFS: 0,
            YXZT: '1',
        },
        labelWidth: 115,
    }
)

const fldataChange = (data: any) => {
    state.flDataArr = data
    state.currentFlbm = ''
    baTable.form.defaultItems!.FLBM = ''
    getIndex()
}

const onRowClick = (row: any) => {
    // state.rowBm = row.XMBM
    state.currentFlbm = row.FLBM
    state.tableRadio = row.FLBM
    state.rowBm = ''
    state.btnArr = ['refresh', 'add', 'edit', 'delete', 'quickSearch', 'columnDisplay']
    baTable.form.defaultItems!.FLBM = row.FLBM
    baTable.table.filter!.fenLeiBM = state.currentFlbm
    getIndex()
}

const getIndex = () => {
    baTable.table.filter!.page = 1
    baTable.table.filter!.size = 20
    baTable.getIndex()?.then((res: any) => {
        mxtableData.value = baTable.table.data
    })
}

const cellClickHandle = (row: any) => {
    //克隆当前行数据
    const rdata = JSON.parse(JSON.stringify(row))

    addForm.YJ = rdata.YJ
    addForm.XJ = rdata.XJ
    addForm.BDYY = rdata.BDYY
    addForm.DH = rdata.DH
    addForm.YXSJ = rdata.YXSJ
    addForm.ZXSJ = rdata.ZXSJ
    addForm.TJSM = rdata.TJSM
}

const saveHand = () => {
    Bczljmb({
        jgbm: adminInfo.jgbm,
        agrs: {
            baoCunLX: '修改',
            mode: {
                XMBM: state.tbRow.XMBM,
                YJ: addForm.YJ,
                XJ: addForm.XJ,
                BDYY: addForm.BDYY,
                TJSM: addForm.TJSM,
                DH: addForm.DH,
                ZXSJ: addForm.ZXSJ,
            },
        },
    }).then((res) => {
        if (res.code == 1) {
            ElMessage.success('调价成功')
            dialogTableVisible.value = false
        }
    })
}

//左侧分类列表
getCxjdfl({ jgbm: adminInfo.jgbm }).then((res) => {
    state.flData = res.data
})

getCxzljmb({ jgbm: adminInfo.jgbm, agrs: {} }).then((res) => {
    // 查询诊疗价目表
    console.log('res-', res)
})

getBxlblist({ agrs: {} }).then((res) => {
    // 获取报销类别
    if (res.code == 1) {
        state.bxlbArr = res.data.options
    }
})

getCjxxlist({ agrs: {} }).then((res) => {
    // 获取厂家字典
    if (res.code == 1) {
        state.cjxxArr = res.data.options
    }
})

provide('baTable', baTable)

onMounted(() => {
    baTable.table.ref = tableRef.value
    baTable.mount()
    getMultiZdmx(['GB_100001', 'GB_009001', 'GB_009001_01', 'GB_009012'])
        .then((res) => {
            state.zdData = res.data.options
            state.lbArr = state.zdData.filter((ele: any) => ele.FLBM == 'GB_100001')
            state.glbmArr = state.zdData.filter((ele: any) => ele.FLBM == 'GB_009001')
            state.baglbmArr = state.zdData.filter((ele: any) => ele.FLBM == 'GB_009001_01')
            state.dwArr = state.zdData.filter((ele: any) => ele.FLBM == 'GB_009012')
        })
        .catch((err) => {
            console.log(err)
        })
})
</script>

<style scoped lang="scss">
:deep(.ba-table-box) {
    .el-table__header .cell {
        color: var(--el-text-color-primary);
    }
}
</style>
