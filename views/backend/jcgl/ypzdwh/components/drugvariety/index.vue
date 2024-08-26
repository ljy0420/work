<template>
    <div class="ba-table-box layout">
        <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info" show-icon />

        <!-- 表格顶部菜单 -->
        <TableHeader :buttons="['add', 'quickSearch', 'columnDisplay']" quick-search-placeholder="输入关键字">
            <template #addAppend>
                <el-dropdown>
                    <el-button type="text" plain class="ypsz-action">
                        <Icon name="local-setting" style="color: #59a7ff" class="local-icon" />
                        <span class="table-header-operate-text">设置</span>
                    </el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="cckfsz">存储库房</el-dropdown-item>
                            <el-dropdown-item @click="fdjclsz">分段加成率</el-dropdown-item>
                            <el-dropdown-item @click="yfylsz">用法用量</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </template>
        </TableHeader>

        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <Table ref="tableRef" :pagination="false" height="310" @row-click="onRadioClick">
            <template #radiozSlot>
                <el-table-column prop="YPBM" label="选择" width="70" align="center">
                    <template #default="scope">
                        <el-radio v-model="state.rowBm" :label="scope.row.YPBM">&nbsp;</el-radio>
                    </template>
                </el-table-column>
            </template>
            <template #fwdxSlot>
                <el-table-column prop="FWDX" label="服务对象" width="100" align="left">
                    <template #default="scope">
                        <span>{{ renderFwdx(scope.row.FWDX) }}</span>
                    </template>
                </el-table-column>
            </template>
            <template #sfclySlot>
                <el-table-column prop="SFCLY" label="是否拆零用" width="130" align="center">
                    <template #default="scope">
                        <span class="span-color-true" v-if="scope.row.SFCLY == 1">是</span>
                        <span class="span-color-false" v-if="scope.row.SFCLY == 0">否</span>
                    </template>
                </el-table-column>
            </template>
            <template #sfclmSlot>
                <el-table-column prop="SFCLM" label="是否拆零卖" width="130" align="center">
                    <template #default="scope">
                        <span class="span-color-true" v-if="scope.row.SFCLM == 1">是</span>
                        <span class="span-color-false" v-if="scope.row.SFCLM == 0">否</span>
                    </template>
                </el-table-column>
            </template>
        </Table>

        <!-- 表单 -->
        <EditForm
            :zdData="prop.zdData"
            :bxlbArr="prop.bxlbArr"
            :lb="prop.lb"
            :flbm="prop.flbm"
            :xmbm="prop.xmbm"
            :xmmc="prop.xmmc"
            :jxmc="prop.jxmc"
        />
        <!-- 存储库房设置表单 -->
        <CckfForm ref="flag" :selectYpbm="state.rowBm" :ypdata="baTable.table.data" />
        <!-- 分段加成率设置表单 -->
        <FdjclForm ref="flag1" />
        <!-- 用法用量表单 -->
        <YfylForm ref="flag2" :selectYpbm="state.rowBm" :ypdata="baTable.table.data" />
    </div>
</template>

<script setup lang="ts">
import { provide, reactive, ref, watch, nextTick, onMounted } from 'vue'
import baTableClass from '/@/utils/baTable'
import EditForm from './edit.vue'
import CckfForm from './cckf.vue'
import FdjclForm from './fdjcl.vue'
import YfylForm from './yfyl.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/default.vue'
import { defaultOptBtns } from '/@/components/table'
import { baTableApi } from '/@/api/common'

const prop = defineProps(['flbm', 'lb', 'xmbm', 'xmmc', 'jxmc', 'zdData', 'bxlbArr'])

const tableRef = ref()

const flag = ref()
const flag1 = ref()
const flag2 = ref()

const cckfsz = () => {
    flag.value.dialogVisble = true
}

const fdjclsz = () => {
    flag1.value.dialogVisble = true
}

const yfylsz = () => {
    flag2.value.show()
}

const state: {
    rowBm: string //药品编码
} = reactive({
    rowBm: '',
})

const fwdxOptions = [
    { value: 0, label: '无' },
    { value: 1, label: '门诊' },
    { value: 2, label: '住院' },
    { value: 3, label: '门诊和住院' },
]

const renderFwdx = (bm: number) => {
    let ret = bm.toString()
    if (fwdxOptions.length > 0) {
        for (let i = 0; i < fwdxOptions.length; i++) {
            if (fwdxOptions[i].value == bm) {
                ret = fwdxOptions[i].label
                break
            }
        }
    }
    return ret
}

const getIndex = () => {
    baTable.table.filter = { yxzt: '-1', YZXMBM: prop.xmbm }
    baTable.getIndex()
}

const onRadioClick = (row: any) => {
    state.rowBm = row.YPBM
    baTable.table.selection?.splice(0, 1)
    baTable.table.selection?.push(row)
}

onMounted(() => {
    baTable.mount()
    getIndex()
})

watch(
    () => prop.xmbm,
    (val) => {
        if (val) {
            nextTick(() => {
                getIndex()
            })
        } else {
            baTable.table.data = []
        }
    }
)

const afterIndex = ({ res }: { res: ApiResponse }) => {
    state.rowBm = ''
    baTable.table.selection?.splice(0, 1)
}

const optButtons = defaultOptBtns(['edit', 'delete'])

const baTable = new baTableClass(
    new baTableApi('/api/v1/xtsjwh/ypzdwh/'),
    {
        column: [
            // { type: 'selection', align: 'center' },
            // { type: 'selection', align: 'center', render: 'slot', slotName: 'radiozSlot' },
            { label: 'NO', type: 'index', align: 'center' },
            // { label: '药品名称', prop: 'YPMC', align: 'left', width: 150, showOverflowTooltip: true },
            { label: '商品名', prop: 'SPM', align: 'left', width: 150, showOverflowTooltip: true },
            { label: '规格', prop: 'GG', align: 'left', width: 130, showOverflowTooltip: true },
            { label: '产地', prop: 'CD', align: 'left', width: 200, showOverflowTooltip: true },
            { label: '服务对象', prop: 'FWDX', align: 'left', width: 100, render: 'slot', slotName: 'fwdxSlot' },
            { label: '成本价', prop: 'CBJ', align: 'left', width: 100 },
            { label: '采购限价', prop: 'CGXJ', align: 'left', width: 100 },
            { label: '当前售价', prop: 'LSJ', align: 'left', width: 100 },
            { label: '加成率', prop: 'JCL', align: 'left', width: 70 },
            { label: '归类名称', prop: 'GLMC', align: 'left', width: 100 },
            { label: '医保类别', prop: 'YBLBMC', align: 'left', width: 100 },
            { label: '工伤类别', prop: 'GSLBMC', align: 'left', width: 100 },
            { label: '剂量', prop: 'JL', align: 'left', width: 70 },
            { label: '剂量单位', prop: 'JLDW', align: 'left', width: 80, showOverflowTooltip: true },
            { label: '剂量系数', prop: 'JLXS', align: 'left', width: 80 },
            { label: '基本单位', prop: 'JBDW', align: 'left', width: 80 },
            { label: '药库单位', prop: 'YKDW', align: 'left', width: 80 },
            { label: '药库包装', prop: 'YKBZ', align: 'left', width: 80 },
            { label: '门诊单位', prop: 'MZDW', align: 'left', width: 80 },
            { label: '门诊包装', prop: 'MZBZ', align: 'left', width: 80 },
            { label: '住院单位', prop: 'ZYDW', align: 'left', width: 80 },
            { label: '住院包装', prop: 'ZYBZ', align: 'left', width: 80 },
            { label: '是否拆零用', prop: 'SFCLY', align: 'left', width: 90, render: 'slot', slotName: 'sfclySlot' },
            { label: '是否拆零卖', prop: 'SFCLM', align: 'left', width: 90, render: 'slot', slotName: 'sfclmSlot' },
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
            SFCLY: 0,
            SFCLM: 0,
            YXZT: '1',
            GJPTY: 0,
            JTZJ: 0,
            CJYP: 0,
            FYWZ: 0,
            ZFCB: 0,
            BACGYP: 0,
            FLPZ: 0,
            ZXYP: 0,
            ZBYP: 0,
        },
        labelWidth: 100,
    },
    {},
    {
        getIndex: afterIndex,
    }
)

provide('baTable', baTable)
</script>

<style scoped lang="scss">
.layout {
    margin-top: 10px;
}

.ypsz-action {
    margin-left: 12px;
}
</style>
