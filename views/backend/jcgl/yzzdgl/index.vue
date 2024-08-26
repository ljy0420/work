<template>
    <div class="default-main">
        <el-row :gutter="10">
            <el-col :xs="24" :sm="6">
                <YzxmflWh :lxData="5" @rowClick="onRowClick" @dataChange="fldataChange" :showheader="false" />
            </el-col>
            <el-col :xs="24" :sm="18">
                <div class="ba-table-box">
                    <TableHeader :buttons="['refresh', 'add', 'edit', 'delete', 'quickSearch', 'columnDisplay']" quick-search-placeholder="输入关键字" />

                    <Table ref="tableRef" :pagination="true" height="calc(100vh - 210px)" @row-click="rowClick">
                        <template #lbSlot>
                            <el-table-column prop="LB" label="诊疗类别" width="80" align="center">
                                <template #default="scope">
                                    <span>{{ renderLb(scope.row.LB) }}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #fwdxSlot>
                            <el-table-column prop="FWDX" label="服务对象" width="100" align="center">
                                <template #default="scope">
                                    <span>{{ renderFwdx(scope.row.FWDX) }}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #czlxSlot>
                            <el-table-column prop="CZLX" label="操作类型" width="150" align="center" :show-overflow-tooltip="true">
                                <template #default="scope">
                                    <span>{{ renderCzlx(scope.row) }}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #bbbwSlot>
                            <el-table-column prop="BBBW" label="标本部位" width="100" align="center" :show-overflow-tooltip="true">
                                <template #default="scope">
                                    <span>{{ renderBbbw(scope.row) }}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #zxplSlot>
                            <el-table-column prop="ZXPL" label="执行频率" width="100" align="center">
                                <template #default="scope">
                                    <span>{{ renderZxpl(scope.row.ZXPL) }}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #jsfsSlot>
                            <el-table-column prop="JSFS" label="计算方式" width="100" align="center">
                                <template #default="scope">
                                    <span>{{ renderJsfs(scope.row.JSFS) }}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #jsgzSlot>
                            <el-table-column prop="JSGZ" label="计算规则" width="100" align="center">
                                <template #default="scope">
                                    <span>{{ renderJsgz(scope.row.JSGZ) }}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #zxflSlot>
                            <el-table-column prop="ZXFL" label="执行分类" width="100" align="center">
                                <template #default="scope">
                                    <span>{{ renderZxfl(scope.row.ZXFL) }}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #zxbjSlot>
                            <el-table-column prop="ZXBJ" label="执行标记" width="100" align="center">
                                <template #default="scope">
                                    <span>{{ renderZxbj(scope.row.ZXBJ) }}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #scbzSlot>
                            <el-table-column prop="SCBZ" label="是否删除" width="80" align="center">
                                <template #default="scope">
                                    <span class="span-color-true" v-if="scope.row.SCBZ == 1">是</span>
                                    <span class="span-color-false" v-else-if="scope.row.SCBZ == 0">否</span>
                                    <span v-else>{{ scope.row.SCBZ }}</span>
                                </template>
                            </el-table-column>
                        </template>
                    </Table>

                    <!-- 表单 -->
                    <EditForm :zdData="state.zdData" :flData="state.flDataArr" :flbm="state.selectFlbm" :jclx="state.jclxArr" :jylx="state.jylxArr" :jybb="state.jybbArr" :xmbm="state.currentXmbm" />
                </div>
            </el-col>
        </el-row>
        
    </div>
</template>

<script setup lang="ts">
import { provide, ref, onMounted, reactive } from 'vue'
import baTableClass from '/@/utils/baTable'
import EditForm from './edit.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/default.vue'
import { defaultOptBtns } from '/@/components/table'
import { baTableApi, getMultiZdmx, getYzxmjclx, getYzxmjylx, getYzxmjybb } from '/@/api/common'
import YzxmflWh from '/@/components/yzxmfl-tree/index.vue'

const state: {
    currentLx: any,
    selectFlbm: any,
    zdData: any,
    lbArr: any,
    jclxArr: any,
    jylxArr: any,
    jybbArr: any,
    flDataArr: any, //分类数据
    currentXmbm: any,
} = reactive({
    currentLx: '5',
    selectFlbm: '',
    zdData: [],
    lbArr: [],
    jclxArr: [],
    jylxArr: [],
    jybbArr: [],
    flDataArr: [],
    currentXmbm: ''
})

defineOptions({
    name: 'jcgl/yzzdgl',
})

const tableRef = ref()

const optButtons = defaultOptBtns(['edit', 'delete'])
optButtons[1].display = (row) => {
    return row.SCBZ != '1'
}

const baTable = new baTableClass(
    new baTableApi('/api/v1/xtsjwh/yzxmzdwh/'),
    {
        column: [
            { label: 'NO', type: 'index', align: 'center' },
            { label: '编码', prop: 'XMBM', align: 'left', width: 100 },
            { label: '名称', prop: 'XMMC', align: 'left', width: 170, showOverflowTooltip: true },
            { label: '诊疗类别', prop: 'LB', align: 'left', width: 100, render: 'slot', slotName: 'lbSlot' },
            { label: '操作类型', prop: 'CZLX', align: 'left', width: 150, render: 'slot', slotName: 'czlxSlot' },
            { label: '标本部位', prop: 'BBBW', align: 'left', width: 100, render: 'slot', slotName: 'bbbwSlot' },
            { label: '服务对象', prop: 'FWDX', align: 'left', width: 100, render: 'slot', slotName: 'fwdxSlot' },
            { label: '执行频率', prop: 'ZXPL', align: 'left', width: 100, render: 'slot', slotName: 'zxplSlot' },
            { label: '执行分类', prop: 'ZXFL', align: 'left', width: 130, render: 'slot', slotName: 'zxflSlot' },
            { label: '计算方式', prop: 'JSFS', align: 'left', width: 100, render: 'slot', slotName: 'jsfsSlot' },
            { label: '计算单位', prop: 'JSDW', align: 'left', width: 90, showOverflowTooltip: true },
            { label: '计算规则', prop: 'JSGZ', align: 'left', width: 100, render: 'slot', slotName: 'jsgzSlot' },
            { label: '执行标记', prop: 'ZXBJ', align: 'left', width: 100, render: 'slot', slotName: 'zxbjSlot' },
            { label: '是否删除', prop: 'SCBZ', align: 'left', width: 100, render: 'slot', slotName: 'scbzSlot' },
            {
                label: '操作',
                align: 'center',
                width: '130',
                render: 'buttons',
                buttons: optButtons,
                fixed: 'right',
            },
        ],
        pk: 'XMBM',
        dblClickNotEditColumn: [undefined],
        filter: { yxzt:'-1' },
        deleteWithPk: false
    },
    {
        defaultItems: {
            LB: '1',
            FWDX: 1,
            ZXPL: 1,
            JSFS: 3,
            DDYY: 1,
            SYXB: 0,
            SCBZ: '0',
        },
        labelWidth: 100
    }
)

const fldataChange = (data: any) => {
    state.flDataArr = data
    state.selectFlbm = '-1'
    baTable.form.defaultItems!.FLBM = ''
    baTable.table.selection = []
    getIndex()
}

const renderLb = (bm: string) => {
    let ret = bm
    if(state.lbArr.length>0) {
        for (let i = 0; i < state.lbArr.length; i++) {
            if (state.lbArr[i].BM == bm) {
                ret = state.lbArr[i].MC
                break
            }
        }
    }
    return ret
}

const renderFwdx = (bm: number) => {
    let ret = ''
    switch(bm) {
        case 1: ret='门诊'; break
        case 2: ret='住院'; break
        case 3: ret='门诊和住院'; break
        case 4: ret='体检'; break
    }
    return ret
}

const renderCzlx = (row: any) => {
    let ret = row.CZLX
    switch(row.LB) {
        case '1':
            if(state.jylxArr.length>0){
                ret = state.jylxArr.find((item:any)=>item.BM==row.CZLX)?.MC
            }
            break
        case '2':
            if(state.jclxArr.length>0){
                ret = state.jclxArr.find((item:any)=>item.BM==row.CZLX)?.MC
            }
            break
        case '3':
            let zlczxz = state.zdData.filter((ele:any) => ele.FLBM=='GB_100003')
            if(zlczxz && zlczxz.length>0) {
                ret = zlczxz.find((item:any)=>item.BM==row.CZLX)?.MC
            }
            break
        case '4':
            let ssgm = state.zdData.filter((ele:any) => ele.FLBM=='GB_009150')
            if(ssgm && ssgm.length>0) {
                ret = ssgm.find((item:any)=>item.BM==row.CZLX)?.MC
            }
            break
        case '5':
            let mzlx = state.zdData.filter((ele:any) => ele.FLBM=='GB_000006')
            if(mzlx && mzlx.length>0) {
                ret = mzlx.find((item:any)=>item.BM==row.CZLX)?.MC
            }
            break
        case '6':
            let hlxmlx = state.zdData.filter((ele:any) => ele.FLBM=='GB_100004')
            if(hlxmlx && hlxmlx.length>0) {
                ret = hlxmlx.find((item:any)=>item.BM==row.CZLX)?.MC
            }
            break
    }
    return ret
}

const renderBbbw = (row: any) => {
    let ret = row.BBBW
    switch(row.LB) {
        case '1':
            if(state.jybbArr.length>0){
                ret = state.jybbArr.find((item:any)=>item.BM==row.BBBW)?.MC
            }
            break
        case '2': break
        case '3': break
        case '4': break
        case '5': break
        case '6': break
    }
    return ret
}

const renderZxpl = (bm: number) => {
    let ret = ''
    switch(bm) {
        case 0: ret='可选频率'; break
        case 1: ret='一次性'; break
        case 2: ret='持续性'; break
    }
    return ret
}

const renderJsfs = (bm: number) => {
    let ret = ''
    switch(bm) {
        case 0: ret='不明确'; break
        case 1: ret='计量'; break
        case 2: ret='计时'; break
        case 3: ret='计次'; break
    }
    return ret
}

const renderZxfl = (bm: number) => {
    let ret = ''
    switch(bm) {
        case -1: ret='普通'; break
        case 0: ret='其他'; break
        case 1: ret='输液单'; break
        case 2: ret='注射单'; break
        case 3: ret='皮试单'; break
        case 4: ret='口服单'; break
        case 5: ret='治疗单'; break
        case 6: ret='输血单'; break
        case 7: ret='护理单'; break
        case 8: ret='外用药'; break
        case 9: ret='其他'; break
    }
    return ret
}

const renderJsgz = (bm: number) => {
    let ret = ''
    switch(bm) {
        case 0: ret='正常计算'; break
        case 1: ret='取整计算'; break
    }
    return ret
}

const renderZxbj = (bm: any) => {
    let ret = ''
    switch(bm) {
        case 0: ret='否'; break
        case 1: ret='是'; break
    }
    return ret
}

const onRowClick = (row: any) => {
    state.selectFlbm = row.FLBM
    baTable.form.defaultItems!.FLBM = row.FLBM
    getIndex()
}

const rowClick = (row: any) => {
    state.currentXmbm = row.XMBM
}

const getIndex = () => {
    baTable.table.filter!.page = 1
    baTable.table.filter!.size = 20
    baTable.table.filter!.yxzt = '-1'
    baTable.table.filter!.fenLeiBM = state.selectFlbm
    baTable.getIndex()
}

baTable.table.filter!.page = 1
baTable.table.filter!.size = 20
provide('baTable', baTable)

onMounted(() => {
    baTable.table.ref = tableRef.value
    baTable.mount()
    getMultiZdmx(['GB_100001','GB_100003','GB_009150','GB_000006','GB_100004', 'GB_009012', 'GB_100002']).then((res)=>{
        state.zdData = res.data.options
        state.lbArr = state.zdData.filter((ele:any) => ele.FLBM=='GB_100001')
    })
    getYzxmjclx({agrs:{keywords:''}}).then((res)=>{
        state.jclxArr = res.data.options
    })
    getYzxmjylx({agrs:{keywords:''}}).then((res)=>{
        state.jylxArr = res.data.options
    })
    getYzxmjybb({ agrs: { keywords: '' } }).then((res) => {
        state.jybbArr = res.data.options
    })
})

</script>

<style scoped lang="scss">
:deep(.ba-table-box){
    .el-table__header .cell{
        color: var(--el-text-color-primary);
    }
}
.span-color-true {
    color: #FF0000;
}
.span-color-false {
    color: #808080;
}
</style>
