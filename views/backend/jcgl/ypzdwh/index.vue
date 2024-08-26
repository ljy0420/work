<template>
    <div class="default-main">
        <el-row :gutter="10">
            <el-col :xs="24" :sm="6">
                <div class="table-header ba-scroll-style">
                    <div class="table-search">
                        <el-input v-model="state.quickSearch" class="xs-hidden quick-search"
                            @input="debounce(onSearchInput, 500)()" placeholder="输入关键字搜索" clearable />
                    </div>
                    <el-button v-blur @click="onAction('refresh', { loading: true })" class="table-header-operate"
                        type="primary">
                        <span class="table-header-operate-text">刷新</span>
                    </el-button>
                </div>
                <el-collapse v-model="activeName" accordion class="ypfl-list" @change="yplxChange">
                    <el-collapse-item title="西药" name="1">
                        <YzxmflWh ref="xiyaoRef" :lxData="1" :expecth="360" :showheader="false" @rowClick="onRowClick"
                            @dataChange="fldataChange1" />
                    </el-collapse-item>
                    <el-collapse-item title="成药" name="2">
                        <YzxmflWh ref="chengyaoRef" :lxData="2" :expecth="360" :showheader="false" @rowClick="onRowClick"
                            @dataChange="fldataChange2" />
                    </el-collapse-item>
                    <el-collapse-item title="草药" name="3">
                        <YzxmflWh ref="caoyaoRef" :lxData="3" :expecth="360" :showheader="false" @rowClick="onRowClick"
                            @dataChange="fldataChange3" />
                    </el-collapse-item>
                    <el-collapse-item title="配方颗粒" name="7">
                        <YzxmflWh ref="pfklRef" :lxData="7" :expecth="360" :showheader="false" @rowClick="onRowClick"
                            @dataChange="fldataChange7" />
                    </el-collapse-item>
                </el-collapse>
            </el-col>
            <el-col :xs="24" :sm="18">
                <div class="ba-table-box">
                    <!-- 表格顶部菜单 -->
                    <TableHeader :buttons="['add', 'quickSearch', 'columnDisplay']" quick-search-placeholder="输入关键字" />

                    <!-- 表格 -->
                    <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
                    <Table ref="tableRef" @row-click="onRadioClick" height="calc(100vh - 600px)">
                        <template #radiozSlot>
                            <el-table-column prop="XMBM" label="选择" width="70" align="center">
                                <template #default="scope">
                                    <el-radio v-model="state.rowBm" :label="scope.row.XMBM">&nbsp;</el-radio>
                                </template>
                            </el-table-column>
                        </template>
                        <template #yytcSlot>
                            <el-table-column prop="YYTC" label="用药梯次" width="90" align="left">
                                <template #default="scope">
                                    <span>{{ renderYytc(scope.row.YYTC) }}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #jyflSlot>
                            <el-table-column prop="JYFL" label="基药分类" width="115" align="left">
                                <template #default="scope">
                                    <span>{{ renderJyfl(scope.row.JYFL) }}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #ksssxSlot>
                            <el-table-column prop="KSSSX" label="抗生素属性" width="115" align="left">
                                <template #default="scope">
                                    <span>{{ renderKsssx(scope.row.KSSSX) }}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #mzcfzwSlot>
                            <el-table-column prop="MZCFZW" label="门诊处方职务" width="115" align="left">
                                <template #default="scope">
                                    <span>{{ renderMzcfzw(scope.row.MZCFZW) }}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #zycfzwSlot>
                            <el-table-column prop="ZYCFZW" label="住院处方职务" width="115" align="left">
                                <template #default="scope">
                                    <span>{{ renderMzcfzw(scope.row.ZYCFZW) }}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #cflxSlot>
                            <el-table-column prop="CFLX" label="处方类型" width="115" align="left">
                                <template #default="scope">
                                    <span>{{ renderCflx(scope.row.CFLX) }}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #cybxtkSlot>
                            <el-table-column prop="CYBXTK" label="草药保险条款" width="130" align="left">
                                <template #default="scope">
                                    <span>{{ renderCybxtk(scope.row.CYBXTK) }}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #xySlot>
                            <el-table-column prop="XY" label="新药" width="70" align="center">
                                <template #default="scope">
                                    <span class="span-color-true" v-if="scope.row.XY == 1">是</span>
                                    <span class="span-color-false" v-if="scope.row.XY == 0"></span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #psSlot>
                            <el-table-column prop="PS" label="皮试" width="70" align="center">
                                <template #default="scope">
                                    <span class="span-color-true" v-if="scope.row.PS == 1">是</span>
                                    <span class="span-color-false" v-if="scope.row.PS == 0"></span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #jjySlot>
                            <el-table-column prop="JJY" label="急救药" width="70" align="center">
                                <template #default="scope">
                                    <span class="span-color-true" v-if="scope.row.JJY == '1'">是</span>
                                    <span class="span-color-false" v-if="scope.row.JJY == '0'"></span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #rmSlot>
                            <el-table-column prop="RM" label="溶媒" width="70" align="center">
                                <template #default="scope">
                                    <span class="span-color-true" v-if="scope.row.RM == '1'">是</span>
                                    <span class="span-color-false" v-if="scope.row.RM == '0'"></span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #hxfjypSlot>
                            <el-table-column prop="HXFJYP" label="含兴奋剂" width="100" align="center">
                                <template #default="scope">
                                    <span class="span-color-true" v-if="scope.row.HXFJYP == 1">是</span>
                                    <span class="span-color-false" v-if="scope.row.HXFJYP == 0"></span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #yuanliaoSlot>
                            <el-table-column prop="YUANLIAO" label="原料" width="70" align="center">
                                <template #default="scope">
                                    <span class="span-color-true" v-if="scope.row.YUANLIAO == 1">是</span>
                                    <span class="span-color-false" v-if="scope.row.YUANLIAO == 0"></span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #dsySlot>
                            <el-table-column prop="DSY" label="大输液" width="70" align="center">
                                <template #default="scope">
                                    <span class="span-color-true" v-if="scope.row.DSY == 1">是</span>
                                    <span class="span-color-false" v-if="scope.row.DSY == 0"></span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #zdjkypSlot>
                            <el-table-column prop="ZDJKYP" label="重点监控药品" width="110" align="center">
                                <template #default="scope">
                                    <span class="span-color-true" v-if="scope.row.ZDJKYP == 1">是</span>
                                    <span class="span-color-false" v-if="scope.row.ZDJKYP == 0"></span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #fzyySlot>
                            <el-table-column prop="FZYY" label="辅助用药" width="80" align="center">
                                <template #default="scope">
                                    <span class="span-color-true" v-if="scope.row.FZYY == 1">是</span>
                                    <span class="span-color-false" v-if="scope.row.FZYY == 0"></span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #gjsypSlot>
                            <el-table-column prop="GJSYP" label="高警示药品" width="100" align="center">
                                <template #default="scope">
                                    <span class="span-color-true" v-if="scope.row.GJSYP == 1">是</span>
                                    <span class="span-color-false" v-if="scope.row.GJSYP == 0"></span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #tpzjsSlot>
                            <el-table-column prop="TPZJS" label="糖皮质激素" width="100" align="center">
                                <template #default="scope">
                                    <span class="span-color-true" v-if="scope.row.TPZJS == 1">是</span>
                                    <span class="span-color-false" v-if="scope.row.TPZJS == 0"></span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #zzbyzjSlot>
                            <el-table-column prop="ZZBYZJ" label="质子泵抑制剂" width="110" align="center">
                                <template #default="scope">
                                    <span class="span-color-true" v-if="scope.row.ZZBYZJ == 1">是</span>
                                    <span class="span-color-false" v-if="scope.row.ZZBYZJ == 0"></span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #zyzsjSlot>
                            <el-table-column prop="ZYZSJ" label="中药注射剂" width="100" align="center">
                                <template #default="scope">
                                    <span class="span-color-true" v-if="scope.row.ZYZSJ == 1">是</span>
                                    <span class="span-color-false" v-if="scope.row.ZYZSJ == 0"></span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #cwyySlot>
                            <el-table-column prop="CWYY" label="肠外营养" width="80" align="center">
                                <template #default="scope">
                                    <span class="span-color-true" v-if="scope.row.CWYY == 1">是</span>
                                    <span class="span-color-false" v-if="scope.row.CWYY == 0"></span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #xyzpSlot>
                            <el-table-column prop="XYZP" label="血液制品" width="80" align="center">
                                <template #default="scope">
                                    <span class="span-color-true" v-if="scope.row.XYZP == 1">是</span>
                                    <span class="span-color-false" v-if="scope.row.XYZP == 0"></span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #dxypSlot>
                            <el-table-column prop="DXYP" label="毒性药品" width="80" align="center">
                                <template #default="scope">
                                    <span class="span-color-true" v-if="scope.row.DXYP == 1">是</span>
                                    <span class="span-color-false" v-if="scope.row.DXYP == 0"></span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #fsxypSlot>
                            <el-table-column prop="FSXYP" label="放射性药品" width="100" align="center">
                                <template #default="scope">
                                    <span class="span-color-true" v-if="scope.row.FSXYP == 1">是</span>
                                    <span class="span-color-false" v-if="scope.row.FSXYP == 0"></span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #llcpSlot>
                            <el-table-column prop="LLCP" label="冷链产品" width="80" align="center">
                                <template #default="scope">
                                    <span class="span-color-true" v-if="scope.row.LLCP == 1">是</span>
                                    <span class="span-color-false" v-if="scope.row.LLCP == 0"></span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #yyanjcSlot>
                            <el-table-column prop="YYAQJC" label="用药安全检测" width="110" align="center">
                                <template #default="scope">
                                    <span class="span-color-true" v-if="scope.row.YYAQJC == 1">是</span>
                                    <span class="span-color-false" v-if="scope.row.YYAQJC == 0"></span>
                                </template>
                            </el-table-column>
                        </template>
                    </Table>
                    <!-- 表单 -->
                    <EditForm :zdData="state.zdData" :flData="state.flDataArr" />
                </div>
                <Drugvariety v-if="baTable.table.data!.length > 0 && state.rowBm" :xmbm="state.rowBm" :xmmc="state.xmmc"
                    :flbm="state.selectFlbm" :lb="state.currentLb" :jxmc="state.jxmc" :zdData="state.zdData"
                    :bxlbArr="state.bxlbArr"></Drugvariety>
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
import { baTableApi, getMultiZdmx, getBxlblist } from '/@/api/common'
import { debounce } from '/@/utils/common'
import YzxmflWh from '/@/components/yzxmfl-tree/other.vue'
import Drugvariety from './components/drugvariety/index.vue'

defineOptions({
    name: 'xtgl/ypzdwh',
})

const tableRef = ref()
const xiyaoRef = ref()
const chengyaoRef = ref()
const caoyaoRef = ref()
const pfklRef = ref()
const activeName = ref('1')

const state: {
    lxData: any
    currentLx: any //当前选择的类型
    selectFlbm: any //分类编码
    zdData: any
    bxlbArr: any
    flDataArr: any, //分类数据
    xyflArr: any,
    cyflArr: any,
    cyaoflArr: any,
    pfklflArr: any,
    currentLb: string //当前所属类别
    rowBm: string //项目编码
    jxmc: string //剂型名称
    xmmc: string //项目名称
    jyflArr: any //基药分类
    mzcfzwArr: any //门诊处方职务
    ksssxArr: any //抗生素属性
    kzlywsxArr: any //抗肿瘤药物属性
    quickSearch: string
} = reactive({
    lxData: [
        { BM: '1', MC: '西药' },
        { BM: '2', MC: '成药' },
        { BM: '3', MC: '草药' },
        { BM: '7', MC: '配方颗粒' },
    ],
    currentLx: '1',
    selectFlbm: '',
    zdData: [],
    bxlbArr: [],
    flDataArr: [],
    xyflArr: [],
    cyflArr: [],
    cyaoflArr: [],
    pfklflArr: [],
    currentLb: '21',
    rowBm: '',
    jxmc: '',
    xmmc: '',
    jyflArr: [],
    mzcfzwArr: [],
    ksssxArr: [],
    kzlywsxArr: [],
    quickSearch: ''
})

const yytcOptions = [
    { value: 1, label: '首选' },
    { value: 2, label: '次选' },
    { value: 3, label: '备用' },
]

const cflxOptions = [
    { value: 0, label: '未限定' },
    { value: 1, label: '处方药' },
    { value: 2, label: '甲类非处方药' },
    { value: 3, label: '乙类非处方药' },
    { value: 4, label: '非处方药' },
    { value: 5, label: '其他用药' },
]
const cybxtkOptions = [
    { value: 0, label: '无' },
    { value: 1, label: '中草药不可报' },
    { value: 2, label: '中草药复方可报' },
    { value: 3, label: '中草药单方可报' },
]

const optButtons = defaultOptBtns(['edit', 'delete'])

const onRadioClick = (row: any) => {
    state.rowBm = row.XMBM
    state.selectFlbm = row.FLBM
    state.currentLb = row.LB
    state.jxmc = row.JXMC
    state.xmmc = row.XMMC
    baTable.table.selection?.splice(0, 1);
    baTable.table.selection?.push(row)
}
const baTable = new baTableClass(
    new baTableApi('/api/v1/xtsjwh/yppz/'),
    {
        column: [
            { label: 'NO', type: 'index', align: 'center' },
            { label: '项目编码', prop: 'XMBM', align: 'left', width: 100 },
            { label: '药品分类', prop: 'FLMC', align: 'left', width: 150, showOverflowTooltip: true },
            { label: '药品名称', prop: 'XMMC', align: 'left', width: 150, showOverflowTooltip: true },
            { label: '剂型名称', prop: 'JXMC', align: 'left', width: 130 },
            { label: '药理名称', prop: 'YLMC', align: 'left', width: 100 },
            { label: '毒理分类', prop: 'DLFLMC', align: 'left', width: 90 },
            { label: '价值分类', prop: 'JZFLMC', align: 'left', width: 90 },
            { label: '用药梯次', prop: 'YYTC', align: 'left', width: 90, render: 'slot', slotName: 'yytcSlot' },
            { label: '基药分类', prop: 'JYFL', align: 'left', width: 115, render: 'slot', slotName: 'jyflSlot' },
            { label: '抗生素属性', prop: 'KSSSX', align: 'left', width: 115, render: 'slot', slotName: 'ksssxSlot' },
            { label: '门诊处方职务', prop: 'MZCFZW', align: 'left', width: 115, render: 'slot', slotName: 'mzcfzwSlot' },
            { label: '住院处方职务', prop: 'ZYCFZW', align: 'left', width: 115, render: 'slot', slotName: 'zycfzwSlot' },
            { label: '处方类型', prop: 'CFLX', align: 'left', width: 115, render: 'slot', slotName: 'cflxSlot' },
            { label: '贮藏要求', prop: 'ZCYQ', align: 'left', width: 130, showOverflowTooltip: true },
            { label: '草药保险条款', prop: 'CYBXTK', align: 'left', width: 115, render: 'slot', slotName: 'cybxtkSlot' },
            { label: '拼音码', prop: 'PYM', align: 'left', width: 100, showOverflowTooltip: true },
            { label: '五笔码', prop: 'WBM', align: 'left', width: 100, showOverflowTooltip: true },
            { label: '急救药', prop: 'JJY', align: 'left', width: 70, render: 'slot', slotName: 'jjySlot' },
            { label: '溶媒', prop: 'RM', align: 'left', width: 70, render: 'slot', slotName: 'rmSlot' },
            { label: '新药', prop: 'XY', align: 'left', width: 70, render: 'slot', slotName: 'xySlot' },
            { label: '皮试', prop: 'PS', align: 'left', width: 70, render: 'slot', slotName: 'psSlot' },
            { render: 'slot', slotName: 'hxfjypSlot' },
            { render: 'slot', slotName: 'yuanliaoSlot' },
            { render: 'slot', slotName: 'dsySlot' },
            { render: 'slot', slotName: 'zdjkypSlot' },
            { render: 'slot', slotName: 'fzyySlot' },
            { render: 'slot', slotName: 'gjsypSlot' },
            { render: 'slot', slotName: 'tpzjsSlot' },
            { render: 'slot', slotName: 'zzbyzjSlot' },
            { render: 'slot', slotName: 'zyzsjSlot' },
            { render: 'slot', slotName: 'cwyySlot' },
            { render: 'slot', slotName: 'xyzpSlot' },
            { render: 'slot', slotName: 'dxypSlot' },
            { render: 'slot', slotName: 'fsxypSlot' },
            { render: 'slot', slotName: 'llcpSlot' },
            { render: 'slot', slotName: 'yyanjcSlot' },
            {
                label: '操作',
                align: 'center',
                width: '90',
                render: 'buttons',
                buttons: optButtons,
                fixed: 'right'
            },
        ],
        dblClickNotEditColumn: [undefined],
        pk: 'XMBM'
    },
    {
        defaultItems: {
            JYFL: '1',
            DLFLMC: '普通药',
            JZFLMC: '普通',
            YYTC: 1,
            KSSSX: '0',
            CFLX: 1,
            MZCFZW: '0',
            ZYCFZW: '0',
            XY: 0,
            PS: 0,
            YUANLIAO: 0,
            HXFJYP: 0,
            DSY: 0,
            YYAQJC: 0,
            KZLYW: 0,
            ZDJKYP: 0,
            FZYY: 0,
            GJSYP: 0,
            TPZJS: 0,
            ZZBYZJ: 0,
            ZYZSJ: 0,
            CWYY: 0,
            XYZP: 0,
            DXYP: 0,
            FSXYP: 0,
            LLCP: 0
        },
        labelWidth: 115
    }
)

const onAction = (event: string, data: anyObj = {}) => {
    switch (state.currentLx) {
        case "1": xiyaoRef.value.onAction(event, data); break;
        case "2": chengyaoRef.value.onAction(event, data); break;
        case "3": caoyaoRef.value.onAction(event, data); break;
        case "7": pfklRef.value.onAction(event, data); break;
    }
}

const onSearchInput = () => {
    switch (state.currentLx) {
        case "1": xiyaoRef.value.onSearchInput(state.quickSearch); break;
        case "2": chengyaoRef.value.onSearchInput(state.quickSearch); break;
        case "3": caoyaoRef.value.onSearchInput(state.quickSearch); break;
        case "7": pfklRef.value.onSearchInput(state.quickSearch); break;
    }
}

const renderYytc = (bm: number) => {
    let ret = bm.toString()
    if (yytcOptions.length > 0) {
        for (let i = 0; i < yytcOptions.length; i++) {
            if (yytcOptions[i].value == bm) {
                ret = yytcOptions[i].label
                break
            }
        }
    }
    return ret
}

const renderJyfl = (bm: string) => {
    let ret = bm
    if (state.jyflArr.length > 0) {
        for (let i = 0; i < state.jyflArr.length; i++) {
            if (state.jyflArr[i].BM == bm) {
                ret = state.jyflArr[i].MC
                break
            }
        }
    }
    return ret
}

const renderKsssx = (bm: string) => {
    let ret = bm
    if (bm && state.ksssxArr.length > 0) {
        ret = state.ksssxArr.find((ele: any) => ele.BM == bm).MC
    }
    return ret
}

const renderCflx = (value: any) => {
    return cflxOptions.find((ele: any) => ele.value == value)?.label
}

const renderMzcfzw = (bm: string) => {
    let ret = bm
    if (bm && state.mzcfzwArr.length > 0) {
        ret = state.mzcfzwArr.find((ele: any) => ele.BM == bm).MC
    }
    return ret
}

const renderZycfzw = (bm: string) => {
    let ret = bm
    if (bm && state.mzcfzwArr.length > 0) {
        ret = state.mzcfzwArr.find((ele: any) => ele.BM == bm).MC
    }
    return ret
}

const renderCybxtk = (value: any) => {
    return cybxtkOptions.find((ele: any) => ele.value == value)?.label
}

const renderKzlywsx = (bm: string) => {
    let ret = bm
    if (bm && state.kzlywsxArr.length > 0) {
        ret = state.kzlywsxArr.find((ele: any) => ele.BM == bm).MC
    }
    return ret
}

const onRowClick = (row: any) => {
    //console.log(row)
    state.selectFlbm = row.FLBM
    baTable.form.defaultItems!.FLBM = row.FLBM
    getIndex()
}

const yplxChange = (value: any) => {
    if(value) {
        state.currentLx = value
    } else {
        state.activeName = state.currentLx
        state.rowBm = ''
        state.xmmc = ''
        state.jxmc = ''
        state.selectFlbm = ''
        baTable.form.defaultItems!.FLBM = ''
        baTable.table.selection = []
    }
    switch (value) {
        case "1": state.flDataArr = state.xyflArr; break;
        case "2": state.flDataArr = state.cyflArr; break;
        case "3": state.flDataArr = state.cyaoflArr; break;
        case "7": state.flDataArr = state.pfklflArr; break;
    }
    getIndex()
}

const fldataChange1 = (data: any) => {
    state.xyflArr = data
    state.rowBm = ''
    state.xmmc = ''
    state.jxmc = ''
    state.selectFlbm = ''
    baTable.form.defaultItems!.FLBM = ''
    baTable.table.selection = []
}

const fldataChange2 = (data: any) => {
    state.cyflArr = data
    state.rowBm = ''
    state.xmmc = ''
    state.jxmc = ''
    state.selectFlbm = ''
    baTable.form.defaultItems!.FLBM = ''
    baTable.table.selection = []
}

const fldataChange3 = (data: any) => {
    state.cyaoflArr = data
    state.rowBm = ''
    state.xmmc = ''
    state.jxmc = ''
    state.selectFlbm = ''
    baTable.form.defaultItems!.FLBM = ''
    baTable.table.selection = []
}

const fldataChange7 = (data: any) => {
    state.pfklflArr = data
    state.rowBm = ''
    state.xmmc = ''
    state.jxmc = ''
    state.selectFlbm = ''
    baTable.form.defaultItems!.FLBM = ''
    baTable.table.selection = []
}

const getIndex = () => {
    baTable.table.filter = { yxzt: '-1', FLBM: state.selectFlbm, LX: state.currentLx }
    baTable.getIndex()?.then(() => {
        if (baTable.table.data && baTable.table.data!.length > 0) {
            state.rowBm = baTable.table.data![0].XMBM
            state.xmmc = baTable.table.data![0].XMMC
            state.jxmc = baTable.table.data![0].JXMC
            baTable.table.ref?.getRef()?.setCurrentRow(baTable.table.data[0])
            baTable.table.selection?.splice(0, 1);
            baTable.table.selection?.push(baTable.table.data![0])
        } else {
            state.rowBm = ''
            state.xmmc = ''
            state.jxmc = ''
            baTable.table.selection = []
        }
    })
}

getBxlblist({ agrs: {} }).then((res) => {
    // 获取报销类别
    if (res.code == 1) {
        state.bxlbArr = res.data.options
    }
})

onMounted(() => {
    baTable.form.defaultItems!.LB = state.currentLb
    baTable.table.ref = tableRef.value
    baTable.mount()
    getMultiZdmx(['GB_009001', 'GB_009001_01', 'GB_009013', 'GB_009012', 'GB_009011', 'GB_009015', 'GB_KSF9090', 'GB_100005', 'GB_009050', 'GB_009017', 'GB_009018', 'GB_009046', 'GB_KZLYWSX001', 'GB_009032', 'GB_009033', 'GB_CGSX001', 'GB_YHFS'])
        .then((res) => {
            state.zdData = res.data.options
            state.jyflArr = state.zdData.filter((ele: any) => ele.FLBM == 'GB_009050')
            state.mzcfzwArr = state.zdData.filter((ele: any) => ele.FLBM == 'GB_009046')
            state.ksssxArr = state.zdData.filter((ele: any) => ele.FLBM == 'GB_KSF9090')
            state.kzlywsxArr = state.zdData.filter((ele: any) => ele.FLBM == 'GB_KZLYWSX001')
            getIndex()
        })
        .catch((err) => {
            console.log(err)
        })
})

baTable.table.filter!.page = 1
baTable.table.filter!.size = 20
provide('baTable', baTable)

baTable.mount()
</script>

<style scoped lang="scss">
.table-header {
    position: relative;
    overflow-x: auto;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 100%;
    background-color: var(--ba-bg-color-overlay);
    border-bottom: 1px solid var(--ba-border-color);
    padding: 13px 15px;
    font-size: 14px;

    .table-header-operate-text {
        margin-left: 6px;
    }
}

.table-search {
    display: flex;
    margin-right: 10px;

    .quick-search {
        width: 270px;
    }
}

:deep(.el-collapse .el-collapse-item__header) {
    padding-left: 25px;
    font-size: 15px;
    font-weight: bold;

    .el-collapse-item__arrow {
        // margin: 0 auto 0 -50px
        position: absolute;
        left: 10px;
        background-image: url('/@/assets/icons/collapse.svg');
        background-position: center;
        background-size: 100%;
        background-repeat: no-repeat;

        svg {
            display: none;
        }
    }

    .title-action {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        height: 1em;
        line-height: 1em;
        margin: 0 10px 0 auto;
    }
}

:deep(.el-collapse .el-collapse-item__content) {
    padding-bottom: 0px;
}

.span-color-true {
    color: rgb(49, 132, 226);
}

.span-color-false {
    color: #808080;
}

.row-detail-container {
    padding: 5px 20px 5px 130px;
    width: 1000px;
    min-width: 500px;
    max-width: 100%;

    .row-item {
        display: inline-block;
        margin-right: 15px;
        padding: 5px 0px;
        overflow: hidden;

        span:nth-child(2) {
            color: #409eff;
        }
    }

    .yppz-attr {
        .el-checkbox {
            width: 130px;
        }
    }
}</style>
