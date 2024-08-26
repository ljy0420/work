<template>
    <div>
        <Table ref="tableRef" :pagination="false" :height="'calc(100vh - ' + expecth + 'px)'" :show-header="showheader"
            @row-click="onRowClick" :emptyShowAdd="true" :expand-row-keys="state.expRowKeys">
            <template #flmcSlot>
                <el-table-column prop="FLMC" label="分类名称" align="left">
                    <template #default="scope">
                        {{ scope.row.FLBM }}-{{ scope.row.FLMC }}
                        <div class="row-action" v-if="scope.row.FLBM == state.currentFlbm">
                            <el-dropdown>
                                <el-button link v-blur type="primary" size="small">
                                    <Icon name="local-create" style="color: #59A7FF" class="local-icon" />
                                </el-button>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item @click="addBrother(scope.row)">新增同级</el-dropdown-item>
                                        <el-dropdown-item @click="addChild(scope.row)">新增子级</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                            <el-button link v-blur type="primary" size="small" @click="onAction('edit')">
                                <Icon name="local-edit" style="color: #59A7FF" class="local-icon" />
                            </el-button>
                            <el-popconfirm title="您确定删除当前节点吗?" width="200" @confirm="batchDelete(scope.row)"
                                @onConfirm="batchDelete(scope.row)">
                                <template #reference>
                                    <el-button link v-blur type="primary" size="small">
                                        <Icon name="local-remove" style="color: #aaa" class="local-icon" />
                                    </el-button>
                                </template>
                            </el-popconfirm>
                            <!-- <el-tooltip content="新增" placement="top">
                                <el-button link v-blur type="primary" size="small" @click="onAction('add')">
                                    <Icon name="local-create" style="color: #59A7FF" class="local-icon" />
                                </el-button>
                            </el-tooltip>
                            <el-tooltip content="修改" placement="top">
                                <el-button link v-blur type="primary" size="small" @click="onAction('edit')">
                                    <Icon name="local-edit" style="color: #59A7FF" class="local-icon" />
                                </el-button>
                            </el-tooltip>
                            <el-tooltip content="删除" placement="top">
                                <el-button link v-blur type="primary" size="small" @click="batchDelete(scope.row)">
                                    <Icon name="local-remove" style="color: #aaa" class="local-icon" />
                                </el-button>
                            </el-tooltip> -->
                        </div>
                    </template>
                </el-table-column>
            </template>
        </Table>
        <EditForm :flData="state.flData" />
    </div>
</template>

<script setup lang="ts">
import { ref, provide, reactive, onMounted, watch, nextTick } from 'vue'
import baTableClass from '/@/utils/baTable'
import EditForm from './edit.vue'
import Table from '/@/components/table/index.vue'
import { baTableApi } from '/@/api/common'

const prop = defineProps({
    lxData: {
        type: [String, Number],
    },
    expecth: {
        type: Number,
        default: 150
    },
    showheader: {
        type: Boolean,
        default: true
    }
})

const tableRef = ref()

const emit = defineEmits(["rowClick", "dataChange"]);

const state: {
    flData: any
    currentFlbm: string
    quickSearch: string
    expRowKeys: any
} = reactive({
    flData: [],
    currentFlbm: '',
    quickSearch: '',
    expRowKeys: []
})

const addBrother = (row: any) => {
    baTable.form.defaultItems!.SJBM = row.SJBM
    baTable.onTableHeaderAction('add', {})
}

const addChild = (row: any) => {
    baTable.form.defaultItems!.SJBM = row.FLBM
    baTable.onTableHeaderAction('add', {})
}

const batchDelete = (row: any) => {
    let rows = []
    if (!Array.isArray(row)) {
        rows = getAllRows([row], [])
    } else {
        rows = getAllRows(row, [])
    }
    baTable.onTableHeaderAction('batch-delete', rows)
}

const onAction = (event: string, data: anyObj = {}) => {
    baTable.onTableHeaderAction(event, data)
}

const onSearchInput = (kewords: string) => {
    baTable.onTableHeaderAction('filter', { keyword: kewords })
}

const getAllRows = (row: any, result: any[]) => {
    for (const i in row) {
        result.push({
            JGBM: row[i].JGBM,
            FLBM: row[i].FLBM,
            FLMC: row[i].FLMC,
            PYM: row[i].PYM,
            SJBM: row[i].SJBM,
            LX: row[i].LX,
            GXSJ: row[i].GXSJ,
            SCBZ: row[i].SCBZ,
            JB: row[i].JB
        });
        if (row[i].children && row[i].children.length > 0) {
            //存在子节点就递归
            getAllRows(row[i].children, result);
        }
    }
    return result;
}

const afterIndex = ({ res }: { res: ApiResponse }) => {
    state.currentFlbm = ''
    if (res.code == 1) {
        emit('dataChange', res.data)
        if(res.data && res.data.length > 0) {
            state.expRowKeys.push(res.data[0].FLBM)
            if('children' in res.data[0] && typeof(res.data[0].children)==='object') {
                if(res.data[0].children.length < 10) {
                    state.expRowKeys.push(res.data[0].children[0].FLBM)
                }
            }
        } else {
            state.expRowKeys = []
        }
    } else {
        emit('dataChange', [])
    }
}

const baTable = new baTableClass(
    new baTableApi('/api/v1/xtsjwh/yzxmflwh/'),
    {
        expandAll: false,
        column: [
            { label: '分类名称', prop: 'FLMC', align: 'left', render: 'slot', slotName: 'flmcSlot' },
        ],
        pk: 'FLBM',
        dblClickNotEditColumn: [undefined],
        dragSortLimitField: 'SJBM'
    },
    {
        defaultItems: {
            LX: prop.lxData
        },
        labelWidth: 80
    },
    {},
    {
        getIndex: afterIndex
    }
)

provide('baTable', baTable)

const getIndex = () => {
    baTable.table.filter!.leiXing = prop.lxData
    baTable.getIndex()?.then(() => {
        if (baTable.table.data && baTable.table.data.length > 0) {
            state.flData = baTable.table.data
        }
    })
}

const onRowClick = (row: any) => {
    baTable.table.selection?.splice(0, 1);
    baTable.table.selection?.push(row)
    state.currentFlbm = row.FLBM
    emit('rowClick', row)
}

onMounted(() => {
    baTable.mount()
    getIndex()
})

watch(
    () => prop.lxData,
    (newVal) => {
        if (newVal) {
            nextTick(() => {
                getIndex()
            })
        }
    }
)

defineExpose({ onAction, onSearchInput })

</script>

<style scoped lang="scss">
:deep(.el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf) {
    border-bottom: none;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell) {
    background: #fff
}

/** 替换树形展开图标(方式1) */
:deep(.el-table .el-table__expand-icon) {
    background-image: url('/@/assets/icons/collapse.svg');
    background-position: center;
    background-size: 100%;
    background-repeat: no-repeat;

    svg {
        display: none;
    }
}

.el-table .row-action {
    position: absolute;
    right:7px;
    top:0;
    height:100%;
    display:flex;
    width:85px;
    background:#e7f1f5;
    padding-left: 5px
}

/** 替换树形展开图标(方式2) */
// :deep(.el-table .el-table__expand-icon>.el-icon){
// 	display:none !important;
// }
// :deep(.el-table .el-table__expand-icon) {
//   content: url('/@/assets/icons/collapse.svg') !important;
// }
</style>
