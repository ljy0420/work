<template>
    <div class="default-main ba-table-box">
        <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info" show-icon />

        <!-- 表格顶部菜单 -->
        <TableHeader :buttons="['refresh', 'add', 'edit', 'delete', 'quickSearch', 'columnDisplay']" quick-search-placeholder="输入关键字" />

        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <Table ref="tableRef" max-height="calc(100vh - 200px)">
            <template #lszSlot>
                <el-table-column prop="LSZ" label="隶属组" width="100" align="left">
                    <template #default="scope">
                        <span>{{ renderLsz(scope.row.LSZ) }}</span>
                    </template>
                </el-table-column>
            </template>
            <template #xbdmSlot>
                <el-table-column prop="XBDM" label="性别" width="100" align="left">
                    <template #default="scope">
                        <span>{{ renderXbdm(scope.row.XBDM) }}</span>
                    </template>
                </el-table-column>
            </template>
            <template #mzSlot>
                <el-table-column prop="MZ" label="民族" width="100" align="left">
                    <template #default="scope">
                        <span>{{ renderMz(scope.row.MZ) }}</span>
                    </template>
                </el-table-column>
            </template>
            <template #zcSlot>
                <el-table-column prop="ZC" label="职称" width="100" align="left">
                    <template #default="scope">
                        <span>{{ renderZc(scope.row.ZC) }}</span>
                    </template>
                </el-table-column>
            </template>
            <template #sfjzysSlot>
                <el-table-column prop="SFJZYS" label="是否接诊医生" width="130" align="left">
                    <template #default="scope">
                        <span class="span-color-true" v-if="scope.row.SFJZYS == 1">是</span>
                        <span class="span-color-false" v-else-if="scope.row.SFJZYS == 0">否</span>
                        <span v-else>{{ scope.row.SFJZYS }}</span>
                    </template>
                </el-table-column>
            </template>
            <template #zwSlot>
                <el-table-column prop="ZW" label="职务" width="100" align="left">
                    <template #default="scope">
                        <span>{{ renderZw(scope.row.ZW) }}</span>
                    </template>
                </el-table-column>
            </template>
            <template #csrqSlot>
                <el-table-column prop="CSRQ" label="出生日期" width="100" align="left">
                    <template #default="scope">
                        <span>{{ renderRq(scope.row.CSRQ) }}</span>
                    </template>
                </el-table-column>
            </template>
            <template #cjgzrqSlot>
                <el-table-column prop="CJGZRQ" label="参加工作日期" width="130" align="left">
                    <template #default="scope">
                        <span>{{ renderRq(scope.row.CJGZRQ) }}</span>
                    </template>
                </el-table-column>
            </template>
        </Table>

        <!-- 表单 -->
        <EditForm :zdData="state.zdData" :ksData="state.ksData" />
    </div>
</template>

<script setup lang="ts">
import { provide, onMounted, ref, reactive, watch } from 'vue'
import baTableClass from '/@/utils/baTable'
import EditForm from './edit.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/default.vue'
import { defaultOptBtns } from '/@/components/table'
import { baTableApi, getMultiZdmx, getKsList } from '/@/api/common'

defineOptions({
    name: 'xtgl/ryzlwh',
})

const state: {
    zdData: any
    ksData: any
    ksMap: any //科室数据
    lszArr: any //隶属组
    ryxbArr: any //人员性别
    mzArr: any //民族
    zcArr: any //职称
    zwArr: any //职务
} = reactive({
    zdData: [],
    ksData: [],
    ksMap: {},
    lszArr: [],
    ryxbArr: [],
    mzArr: [],
    zcArr: [],
    zwArr: [],
})

const tableRef = ref()

const optButtons = defaultOptBtns(['edit', 'delete'])

const baTable = new baTableClass(
    new baTableApi('/api/v1/xtsjwh/ryzlwh/'),
    {
        column: [
            { label: 'NO', type: 'index', align: 'center' },
            { label: '国家编码', prop: 'GJBM', align: 'left', width: 100, showOverflowTooltip: true },
            { label: '人员编码', prop: 'RYBM', align: 'left', width: 130 },
            { label: '人员姓名', prop: 'RYXM', align: 'left', width: 100 },
            { label: '隶属组', prop: 'LSZ', align: 'left', width: 100, render: 'slot', slotName: 'lszSlot' },
            { label: '人员科室', prop: 'RYKS', align: 'left', width: 150, showOverflowTooltip: true },
            { label: '主管科室', prop: 'ZGKSMC', align: 'left', width: 100 },
            { label: '年龄', prop: 'NL', align: 'left', width: 70 },
            { label: '身份证号', prop: 'SFZH', align: 'left', width: 200 },
            { label: '出生日期', prop: 'CSRQ', align: 'left', width: 170, render: 'slot', slotName: 'csrqSlot' },
            { label: '性别', prop: 'XBDM', align: 'left', width: 70, render: 'slot', slotName: 'xbdmSlot' },
            { label: '民族', prop: 'MZ', align: 'left', width: 100, render: 'slot', slotName: 'mzSlot' },
            { label: '参加工作日期', prop: 'CJGZRQ', align: 'left', width: 130, render: 'slot', slotName: 'cjgzrqSlot' },
            { label: '办公室电话', prop: 'BGSDHHM', align: 'left', width: 110 },
            { label: '手机号码', prop: 'SJHM', align: 'left', width: 110 },
            { label: '职称', prop: 'ZC', align: 'left', width: 130, render: 'slot', slotName: 'zcSlot' },
            { label: '是否接诊医生', prop: 'SFJZYS', align: 'left', width: 130, render: 'slot', slotName: 'sfjzysSlot' },
            { label: '口令', prop: 'KL', align: 'left', width: 100 },
            { label: '职务', prop: 'ZW', align: 'left', width: 100, render: 'slot', slotName: 'zwSlot' },
            { label: '有效状态', prop: 'YXZT', align: 'left', width: 100, render: 'customSwitch' },
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
            SFCZY: '0',
            SFJZYS: '0',
            SFCJGLY: '0',
            YXZT: '1',
            SFDDZYYS: '0',
            SFBDWFP: '0',
        },
        labelWidth: 130,
    }
)

watch(
    () => baTable.table.data,
    () => {
        if (baTable.table.data) {
            for (let i = 0; i < baTable.table.data.length; i++) {
                if (baTable.table.data[i].ZGKS) {
                    baTable.table.data[i].ZGKSMC = state.ksMap[baTable.table.data[i].ZGKS]
                }
            }
        }
    }
)

const renderLsz = (bm: string) => {
    let ret = bm
    if (state.lszArr.length > 0) {
        for (let i = 0; i < state.lszArr.length; i++) {
            if (state.lszArr[i].BM == bm) {
                ret = state.lszArr[i].MC
                break
            }
        }
    }
    return ret
}

const renderXbdm = (bm: string) => {
    let ret = bm
    if (state.ryxbArr.length > 0) {
        for (let i = 0; i < state.ryxbArr.length; i++) {
            if (state.ryxbArr[i].BM == bm) {
                ret = state.ryxbArr[i].MC
                break
            }
        }
    }
    return ret
}

const renderMz = (bm: string) => {
    let ret = bm
    if (state.mzArr.length > 0) {
        for (let i = 0; i < state.mzArr.length; i++) {
            if (state.mzArr[i].BM == bm) {
                ret = state.mzArr[i].MC
                break
            }
        }
    }
    return ret
}

const renderZc = (bm: string) => {
    let ret = bm
    if (state.zcArr.length > 0) {
        for (let i = 0; i < state.zcArr.length; i++) {
            if (state.zcArr[i].BM == bm) {
                ret = state.zcArr[i].MC
                break
            }
        }
    }
    return ret
}

const renderZw = (bm: string) => {
    let ret = bm
    if (state.zwArr.length > 0) {
        for (let i = 0; i < state.zwArr.length; i++) {
            if (state.zwArr[i].BM == bm) {
                ret = state.zwArr[i].MC
                break
            }
        }
    }
    return ret
}

const renderRq = (value: string) => {
    let ret = value
    if(value && value.length>10){
        return ret.substring(0, 10)
    }
}

provide('baTable', baTable)

baTable.table.filter!.page = 1
baTable.table.filter!.size = 20

onMounted(() => {
    baTable.table.ref = tableRef.value
    baTable.mount()
    getMultiZdmx([
        'GB_00101,GB_0001,GB_009038,GB_009040,GB_009041,GB_009042,GB_009044,GB_009045,GB_009046,GB_00100,GB_0007,GB_009036,GB_009037,GB_009039,GB_009047,GB_009052,GB_0098,GB_执业资格,GB_0099,GB_000402,GB_009004',
    ])
        .then((res) => {
            state.zdData = res.data.options
            state.lszArr = state.zdData.filter((ele: any) => ele.FLBM == 'GB_0098')
            state.ryxbArr = state.zdData.filter((ele: any) => ele.FLBM == 'GB_0001')
            state.mzArr = state.zdData.filter((ele: any) => ele.FLBM == 'GB_000402')
            state.zcArr = state.zdData.filter((ele: any) => ele.FLBM == 'GB_00101')
            state.zwArr = state.zdData.filter((ele: any) => ele.FLBM == 'GB_009045')
            baTable.getIndex()?.then(() => {
                if (baTable.table.data) {
                    let tbData = baTable.table.data
                    getKsList().then((res) => {
                        // console.log(res)
                        state.ksData = res.data.options
                        for (let i = 0; i < state.ksData.length; i++) {
                            state.ksMap[state.ksData[i].KSBM] = state.ksData[i].KSMC
                        }
                        for (let i = 0; i < tbData.length; i++) {
                            if (tbData[i].ZGKS) {
                                tbData[i].ZGKSMC = state.ksMap[tbData[i].ZGKS]
                            }
                        }
                    })
                }
            })
        })
        .catch((err) => {
            console.log(err)
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
