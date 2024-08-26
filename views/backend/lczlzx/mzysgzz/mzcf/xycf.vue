<template>
    <div>
        <div class="cf-main">
            <div class="cf-header" @mouseover="showButton" @mouseleave="startHideButton">
                <div class="cf-title">{{ state.cfInfo.title }}</div>
                <div class="title-btn" v-if="showBtn">
                    <el-dropdown>
                        <el-button type="text" plain @mouseenter="cancelHideTimer">
                            <Icon name="local-directory" />
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu @mouseenter="cancelHideTimer" @mouseleave="hideButton">
                                <el-dropdown-item>
                                    <Icon name="local-copy" color="#59a7ff" class="menu-svg" />
                                    <span>复制在下面</span>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <Icon name="local-save-template" color="#59a7ff" class="menu-svg" />
                                    <span>存为模板（单）</span>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
                <div class="cf-action">
                    <div class="action-group" v-if="!props.hideact && state.cfInfo.isExpand">
                        <el-button type="text" plain @click="onCopy">
                            <Icon name="local-copy" color="#59a7ff" />
                            <span class="operate-text">复制</span>
                        </el-button>
                        <el-button type="text" :disabled="!state.cfInfo.isCopied" plain @click="onPaste">
                            <Icon name="local-paste" color="#59a7ff" />
                            <span class="operate-text">粘贴</span>
                        </el-button>
                        <el-button type="text" plain @click="onSplit" :disabled="table.selection.length > 1 ? false : true">
                            <Icon name="local-split" color="#59a7ff" />
                            <span class="operate-text">拆组</span>
                        </el-button>
                        <el-button type="text" plain @click="onMerge" :disabled="table.selection.length > 1 ? false : true">
                            <Icon name="local-join" color="#59a7ff" />
                            <span class="operate-text">成组</span>
                        </el-button>
                        <el-button type="text" v-if="!state.cfInfo.isEdit" plain @click="editChange">
                            <Icon name="local-edit" color="#59a7ff" />
                            <span class="operate-text">编辑</span>
                        </el-button>
                        <el-button type="text" v-if="state.cfInfo.isEdit" plain @click="editChange">
                            <Icon name="local-fail" color="#808080" />
                            <span class="operate-text" style="color: #808080">取消</span>
                        </el-button>
                        <el-button type="text" plain @click="onSave">
                            <Icon name="local-save" color="#59a7ff" />
                            <span class="operate-text">保存</span>
                        </el-button>
                    </div>
                    <el-button type="text" v-if="!props.hideact" plain @click="onPrint">
                        <Icon name="local-print" color="#59a7ff" />
                        <span class="operate-text">打印处方</span>
                    </el-button>
                    <el-button type="text" plain @click="exChange">
                        <Icon name="local-expand1" :class="state.cfInfo.isExpand ? 'expand-icon' : ''" color="#59a7ff" />
                        <span class="operate-text">{{ state.cfInfo.isExpand ? '收起' : '展开' }}</span>
                    </el-button>
                </div>
            </div>

            <div class="cf-items" v-show="state.cfInfo.isExpand">
                <el-table
                    ref="cfRef"
                    :data="state.cfInfo.items"
                    row-key="ID"
                    highlight-current-row
                    default-expand-all
                    :span-method="objectSpanMethod"
                    @select="onSelect"
                    @selection-change="onSelectionChange"
                    style="width: 100%"
                    class="w100"
                >
                    <el-table-column width="20">
                        <template #default>
                            <div class="group-cell">&nbsp;</div>
                        </template>
                    </el-table-column>
                    <el-table-column type="selection" width="42" />
                    <el-table-column prop="STATE" label="状态" width="70" v-if="!props.hideact" />
                    <el-table-column prop="GJBM" label="国家编码" width="100"></el-table-column>
                    <el-table-column prop="PS" label="皮试" width="90">
                        <template #default="scope">
                            <el-select v-model="scope.row.PS" clearable v-if="state.cfInfo.isEdit">
                                <el-option v-for="opt in state.psArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"> </el-option>
                            </el-select>
                            <span v-else>{{ scope.row.PS }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="YZMC" label="医嘱名称(药品名称+规格)" width="230">
                        <template #default="scope">
                            <SelectYpxx
                                v-model="scope.row.YZMC"
                                :agrs="scope.row"
                                v-if="state.cfInfo.isEdit"
                                :conditions="{ YWLX: '药品字典' }"
                                @choice="onChoiceYp"
                            />
                            <span v-else>{{ scope.row.YZMC }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="DCJL" label="单次剂量" width="80">
                        <template #default="scope">
                            <el-input
                                v-model="scope.row.DCJL"
                                type="string"
                                placeholder="请输入"
                                style="width: 100%"
                                v-if="state.cfInfo.isEdit"
                            ></el-input>
                            <span v-else>{{ scope.row.DCJL }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="DW" label="单位" width="70">
                        <template #default="scope">
                            <el-select v-model="scope.row.DW" clearable v-if="state.cfInfo.isEdit" placeholder="">
                                <el-option v-for="opt in state.dwArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"> </el-option>
                            </el-select>
                            <span v-else>{{ scope.row.DW }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="GYTJ" label="给药途径" width="100">
                        <template #default="scope">
                            <el-select v-model="scope.row.GYTJ" clearable v-if="state.cfInfo.isEdit" placeholder="">
                                <el-option v-for="opt in state.gytjArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"> </el-option>
                            </el-select>
                            <span v-else>{{ scope.row.GYTJ }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="PC" label="频次" width="80">
                        <template #default="scope">
                            <el-select v-model="scope.row.PC" clearable v-if="state.cfInfo.isEdit" placeholder="">
                                <el-option v-for="opt in state.pcArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"> </el-option>
                            </el-select>
                            <span v-else>{{ scope.row.PC }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="DS" label="滴速" width="80">
                        <template #default="scope">
                            <el-select v-model="scope.row.DS" clearable v-if="state.cfInfo.isEdit" placeholder="">
                                <el-option v-for="opt in state.dsArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"> </el-option>
                            </el-select>
                            <span v-else>{{ scope.row.DS }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="TS" label="天数" width="80">
                        <template #default="scope">
                            <el-input
                                v-model="scope.row.TS"
                                type="string"
                                placeholder="请输入"
                                style="width: 100%"
                                v-if="state.cfInfo.isEdit"
                            ></el-input>
                            <span v-else>{{ scope.row.TS }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="JE" label="金额(元)" width="100" />
                    <el-table-column prop="ZT" label="嘱托" min-width="150">
                        <template #default="scope">
                            <el-input
                                v-model="scope.row.ZT"
                                type="string"
                                placeholder="请输入"
                                style="width: 100%"
                                v-if="state.cfInfo.isEdit"
                            ></el-input>
                            <span v-else>{{ scope.row.ZT }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ZXKS" label="执行科室" min-width="130">
                        <template #default="scope">
                            <el-select v-model="scope.row.ZXKS" clearable v-if="state.cfInfo.isEdit" placeholder="">
                                <el-option v-for="opt in state.zxksArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"> </el-option>
                            </el-select>
                            <span v-else>{{ scope.row.ZXKS }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="60" fixed="right" align="center" v-if="!props.hideact">
                        <template #default="scope">
                            <el-button link v-blur type="primary" size="small" @click="addRow">
                                <Icon name="local-create" style="color: #59a7ff" class="local-icon" />
                            </el-button>
                            <el-popconfirm title="您确定删除这条记录吗?" @confirm="deleteRow(scope.$index)" width="200">
                                <template #reference>
                                    <el-button link v-blur type="primary" size="small" style="margin-left: 3px">
                                        <Icon name="local-delete" style="color: #808080" class="local-icon" />
                                    </el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed, nextTick } from 'vue'
import { uuid } from '/@/utils/random'
import { cloneDeep } from 'lodash-es'
import SelectYpxx from '/@/components/yfzx/select-ypxx.vue'

const props = defineProps({
    cfinfo: {
        type: Object,
        default: () => {
            return {
                bm: uuid(),
                title: '西药处方',
                cflx: 1,
                isEdit: true,
                items: [{ ID: uuid(), children: [] }],
            }
        },
    },
    hideact: {
        type: Boolean,
        default: false,
    },
})
const emit = defineEmits(['dataChange', 'delete'])

const cfRef = ref()
const showBtn = ref(false)
const hideTimer = ref()
const state: {
    cfInfo: any
    colCount: any
    spanArr: any
    psArr: any //皮试
    dwArr: any //单位
    gytjArr: any //给药途径
    pcArr: any //频次
    dsArr: any //滴速
    zxksArr: any //执行科室
} = reactive({
    cfInfo: props.cfinfo,
    colCount: 0,
    spanArr: [],
    psArr: [
        { BM: 1, MC: '是' },
        { BM: 0, MC: '否' },
    ],
    dwArr: [],
    gytjArr: [],
    pcArr: [],
    dsArr: [],
    zxksArr: [],
})

const showButton = () => {
    showBtn.value = true
}

const hideButton = () => {
    showBtn.value = false
}
const startHideButton = () => {
    hideTimer.value = setTimeout(() => {
        showBtn.value = false
    }, 200)
}

const cancelHideTimer = () => {
    if (hideTimer.value) {
        clearTimeout(hideTimer.value)
        hideTimer.value = null
    }
}

const table = reactive({
    selection: [],
})

interface SpanMethodProps {
    row: any
    column: any
    rowIndex: number
    columnIndex: number
}

const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: SpanMethodProps) => {
    return state.spanArr[rowIndex * 16 + columnIndex]
}

const onSelectionChange = (selection: any) => {
    table.selection = selection
}

const onSelect = (rows: any, row: any) => {
    console.log(row)
}

const onCopy = () => {
    console.log('copy...')
    state.cfInfo.isCopied = true
}

const onPaste = () => {
    console.log('paste...')
    state.cfInfo.isCopied = false
}

const editChange = () => {
    state.cfInfo.isEdit = !state.cfInfo.isEdit
}

const onChoiceYp = (row: any, agrs: any) => {
    agrs.GJBM = row.GJBM
    agrs.YZMC = row.YPMC + row.GG
    agrs.DCJL = row.JL
    agrs.DW = row.JLDW
    agrs.JE = row.LSJ
}

const onSplit = () => {
    let selectionIds: any = []
    if (table.selection.length > 1) {
        for (let i = 0; i < table.selection.length; i++) {
            selectionIds.push(table.selection[i]!.ID)
        }
    }

    let tableData = cloneDeep(state.cfInfo.items)
    var splitRows = tableData.filter((item: any) => selectionIds.includes(item.ID))
    if (splitRows && splitRows.length > 0) {
        splitRows.forEach((item: any) => {
            item.GROUPID = ''
            item.children = []
        })
    }
    getSpanArr(tableData)
    state.cfInfo.items = tableData
    resetGroupCellHeight()
}

const onMerge = () => {
    let selectionIds: any = []
    if (table.selection.length > 1) {
        for (let i = 0; i < table.selection.length; i++) {
            selectionIds.push(table.selection[i]!.ID)
        }
    }
    let tableData = cloneDeep(state.cfInfo.items)
    let mergeRow = tableData.find((item: any) => item.ID === selectionIds[0])
    let otherRows = tableData.filter((item: any) => selectionIds.includes(item.ID))
    if (otherRows && otherRows.length > 0) {
        mergeRow.children = []
        mergeRow.GROUPID = mergeRow.ID
        otherRows.forEach((item: any) => {
            item.GROUPID = mergeRow.ID
        })
    }

    getSpanArr(tableData)
    state.cfInfo.items = tableData
    resetGroupCellHeight()
}

const resetGroupCellHeight = () => {
    nextTick(() => {
        const cells = cfRef.value.$el.querySelectorAll('.el-table .el-table__row .el-table__cell:nth-child(1)')
        if (cells) {
            cells.forEach((cell: any) => {
                let rowspan = cell.attributes['rowspan'].value
                if (rowspan > 1) {
                    cell.style.height = '30px'
                    cell.style.padding = '20px 0'
                    const c = cell.querySelector('.group-cell')
                    console.log(c)

                    if (c) {
                        c.style.display = 'inline-block'
                        // c.style.height = 30 * rowspan + 'px';
                    }
                } else {
                    const c = cell.querySelector('.group-cell')
                    if (c) {
                        c.style.display = 'none'
                    }
                }
            })
        }
    })
}

/**
 * 分析合并行数据
 */
const getSpanArr = (tbData: any) => {
    const cols = Array.from(cfRef.value.$el.querySelectorAll('.el-table__header col'))
    for (let i = 0; i < tbData.length; i++) {
        let row = i
        if (row === 0) {
            for (let j = 0; j < cols.length; j++) {
                state.spanArr[i * cols.length + j] = {
                    rowspan: 1,
                    colspan: 1,
                }
            }
        } else {
            for (let j = 0; j < cols.length; j++) {
                if (j == 0) {
                    if (tbData[row]['GROUPID'] && tbData[row]['GROUPID'] === tbData[row - 1]['GROUPID']) {
                        let beforeItem = state.spanArr[(row - 1) * cols.length + j]
                        state.spanArr[row * cols.length + j] = {
                            rowspan: 1 + beforeItem.rowspan, // 合并几行
                            colspan: 1, // 合并几列,这里只是跨行合并,不跨列合并,所以用的1
                        }
                        beforeItem.rowspan = 0
                        beforeItem.colspan = 0
                    } else {
                        state.spanArr[row * cols.length + j] = {
                            rowspan: 1,
                            colspan: 1,
                        }
                    }
                } else {
                    state.spanArr[row * cols.length + j] = {
                        rowspan: 1,
                        colspan: 1,
                    }
                }
            }
        }
    }
    let stack = []
    for (let i = 0; i < cols.length; i++) {
        for (let j = 0; j < tbData.length; j++) {
            if (j === 0) {
                if (state.spanArr[j * cols.length + i].rowspan === 0) {
                    stack.push(state.spanArr[j * cols.length + i])
                }
            } else {
                if (state.spanArr[j * cols.length + i].rowspan === 0) {
                    stack.push(state.spanArr[j * cols.length + i])
                } else {
                    stack.push(state.spanArr[j * cols.length + i])
                    while (stack.length > 0) {
                        let pop = stack.pop()
                        let len = stack.length
                        state.spanArr[(j - len) * cols.length + i] = pop
                    }
                }
            }
        }
    }
}

const onPrint = () => {
    console.log('print...')
}

const onSave = () => {
    state.cfInfo.isEdit = !state.cfInfo.isEdit
}

const exChange = () => {
    state.cfInfo.isExpand = !state.cfInfo.isExpand
}

const addRow = () => {
    state.cfInfo.items.push({ ID: uuid() })
}

const deleteRow = (index: any) => {
    if (state.cfInfo.items.length === 1) {
        state.cfInfo.items[0] = {}
        emit('delete', state.cfInfo.bm)
        return
    }
    state.cfInfo.items.splice(index, 1)
}

onMounted(() => {
    const cols = Array.from(cfRef.value.$el.querySelectorAll('.el-table__header col'))
    state.colCount = cols.length
})
</script>

<style lang="scss" scoped>
.el-button.is-disabled {
    .svg-icon {
        color: #a8abb2 !important;
    }
}

:deep(.el-table .cell) {
    padding: 0 5px;
    height: 100%;
}

.el-table .group-cell {
    display: none;
    margin-left: 3px;
    width: 3px;
    height: 100%;
    border-top: 1px solid #000;
    border-left: 1px solid #000;
    border-bottom: 1px solid #000;
}

:deep(.el-table-fixed-column--right) {
    .cell {
        padding: 0 2px;
    }
}

:deep(.el-table__header .cell) {
    color: #000;
}

.action-group {
    display: inline-block;
    margin-right: 12px;
}

.cf-main {
    width: 98%;
    margin-left: 20px;

    .cf-header {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #f6f6f6;
        padding: 2px 15px 2px 5px;
        margin-top: 10px;
        .title-btn {
            position: absolute;
            left: -20px;
            top: 0;
            z-index: 1;
            .svg-icon {
                color: #409eff !important;
                margin-top: 10px;
            }
        }
        .cf-action {
            .svg-icon {
                font-size: 14px !important;
            }

            .operate-text {
                margin-left: 3px;
            }
        }
    }
}
.cf-items {
    position: reactive;
    margin-bottom: 10px;
    overflow: hidden;
}

.expand-icon {
    transform: rotate(180deg);
}
.menu-svg {
    margin-right: 10px;
}
</style>
