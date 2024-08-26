<template>
    <div>
        <el-input ref="inputRef" class="mc-input" v-model="inputStr" v-bind="inputAttr" @input="changeInfo" @focus="keyFocus"
            placeholder="">
            <template #suffix>
                <Icon name="local-find" color="#409eff" />
            </template>
        </el-input>
        <el-dialog @close="onClose" width="900px" :model-value="state.show"
            class="yd-operate-dialog" :append-to-body="true" :destroy-on-close="true" align-center @keyup="onKeyUp">
            <template #header>
                <div class="title" v-drag="['.yd-operate-dialog', '.el-dialog__header']">
                    选择药品
                </div>
            </template>
            <div class="table-search">
                <el-input ref="keywordsRef" v-model="state.quickSearch" class="xs-hidden quick-search" @input="debounce(onSearchInput, 500)()"
                    placeholder="输入 编码/品名/拼音码/五笔码 进行查询" clearable>
                    <template #suffix>
                        <Icon name="local-find" color="#409eff" />
                    </template>
                </el-input>
            </div>
            <el-table ref="tableRef" :data="state.tableData" v-loading="state.loading" stripe class="ba-data-table w100"
                height="calc(520px - 115px)" header-cell-class-name="table-header-cell" highlight-current-row
                @row-click="onRowClick" v-bind="$attrs">
                <el-table-column v-for="(item, index) in columns" :key="index + 'i'" :type="item.type" :label="item.label"
                    :prop="item.prop" :min-width="item['min-width'] || item.minWidth || item.width"
                    :align="item.align || 'center'" :fixed="item.fixed" :show-overflow-tooltip="item.showOverflowTooltip"
                    v-bind="{ ...item.bind, ...$attrs }">
                    <template #default="scope">
                        <template v-if="item.slotName">
                            <slot :name="item.slotName" :scope="scope"></slot>
                        </template>
                        <div v-if="!item.render && !item.slotName">
                            <span>{{ scope.row[item.prop] }}</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="table-pagination">
                <el-pagination :currentPage="state.page" :page-size="state.size" :page-sizes="pageSizes" :background="false"
                    layout="->, total, sizes, prev, pager, next, jumper" :total="state.total"
                    @size-change="onTableSizeChange" @current-change="onTableCurrentChange"></el-pagination>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch, nextTick,useAttrs } from 'vue'
import { debounce } from '/@/utils/common'
import { baTableApi } from '/@/api/common'

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    conditions: {
        type: Object,
        default: () => {
            return {}
        },
    },
    agrs: {
        type: Object,
        default: () => {
            return {}
        },
    },
    // 表头数据
    columns: {
        type: Array as unknown as any[],
        default: () => [
            { label: '编码', prop: 'YPBM', width: '130', showOverflowTooltip: true },
            { label: '品名', prop: 'YPMC', width: '150', showOverflowTooltip: true },
            { label: '包装', prop: 'YKBZ', width: '60', showOverflowTooltip: true },
            { label: '规格', prop: 'GG', width: '150', showOverflowTooltip: true },
            { label: '单位', prop: 'YKDW', width: '60', showOverflowTooltip: true },
            { label: '产地', prop: 'CD', width: '200', showOverflowTooltip: true },
            { label: '批准文号', prop: 'PZWH', width: '150', showOverflowTooltip: true },
        ],
    },
    filter: {
        type: Object,
        default: () => {
            return {
                mc: 'YPMC',
                bm: 'YPBM',
                pym: 'PYM',
                wbm: 'WBM',
            }
        },
    },
    remoteSearch: {
        type: Boolean,
        default: true
    }
})
const inputAttr = computed(() => {
    return {
        clearable: false,
        ...useAttrs(),
    }
})

const emits = defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'choice', value: TableRow, agrs: any): void
}>()
const inputRef: any = ref<HTMLElement | null>(null)
const keywordsRef: any = ref<HTMLElement | null>(null)
const inputStr = ref('')
const tableRef = ref()
const nowIndex = ref(-1)
const state = reactive({
    show: false,
    loading: false,
    tableData: [],
    bakData: [],
    page: 1,
    size: 20,
    total: 0,
    quickSearch: '',
})
const api = new baTableApi('/api/v1/ykzx/yplzgl/')

const keyFocus = () => {
    state.show = true
}

const onKeyUp = (e: any) => {
    console.log(e)
    if (state.tableData.length === 0) return
    switch (e.keyCode) {
        case 40: // 下键
            if (state.tableData[nowIndex.value * 1 + 1] !== undefined) {
                tableRef.value.setCurrentRow(state.tableData[nowIndex.value * 1 + 1])
                nowIndex.value = nowIndex.value * 1 + 1
            } else {
                nowIndex.value = 0
                tableRef.value.setCurrentRow(state.tableData[0])
            }
            break
        case 39: //右键
            tableRef.value.setCurrentRow(-1)
            nowIndex.value = -1
            break
        case 38: // 上键
            if (state.tableData[nowIndex.value * 1 - 1] !== undefined && nowIndex.value > 0) {
                tableRef.value.setCurrentRow(state.tableData[nowIndex.value * 1 - 1])
                nowIndex.value = nowIndex.value * 1 - 1
            } else {
                nowIndex.value = 0
                tableRef.value.setCurrentRow(state.tableData[0])
                keywordsRef.value?.focus()
            }
            break
        case 37: //左键
            tableRef.value.setCurrentRow(-1)
            nowIndex.value = -1
            break
        case 13: // 回车
            //emits('choice', state.tableData[nowIndex.value])
            onRowClick(state.tableData[nowIndex.value])
            break
    }
}

const onSearchInput = () => {
    if (props.remoteSearch) {
        getIndex()
    }
    else {
        if (state.bakData && state.bakData.length > 0) {
            let val = state.quickSearch
            const tableData = JSON.parse(JSON.stringify(state.bakData))
            if (tableData && tableData.length > 0) {
                state.tableData = tableData.filter((item: any) => {
                    if (Object.hasOwn(item, props.filter.pym) && !Object.hasOwn(item, props.filter.wbm)) {
                        if (item[props.filter.mc].includes(val) || item[props.filter.bm].includes(val) || item[props.filter.pym].includes(val)) {
                            return item
                        }
                    } else if (!Object.hasOwn(item, props.filter.pym) && Object.hasOwn(item, props.filter.wbm)) {
                        if (item[props.filter.mc].includes(val) || item[props.filter.bm].includes(val) || item[props.filter.wbm].includes(val)) {
                            return item
                        }
                    } else if (Object.hasOwn(item, props.filter.pym) && Object.hasOwn(item, props.filter.wbm)) {
                        if (
                            item[props.filter.mc].includes(val) ||
                            item[props.filter.bm].includes(val) ||
                            item[props.filter.pym].includes(val) ||
                            item[props.filter.wbm].includes(val)
                        ) {
                            return item
                        }
                    } else {
                        if (item[props.filter.mc].includes(val) || item[props.filter.bm].includes(val)) {
                            return item
                        }
                    }
                })
            }
        }
    }
}

const getIndex = () => {
    state.loading = true
    api.requestData('index', { agrs: { ...props.conditions, page: state.page, size: state.size, keywords: state.quickSearch } }).then((res: any) => {
        state.tableData = res.data
        if (!props.remoteSearch) {
            state.bakData = res.data
        }
        if (res.count == 0) {
            state.total = res.data.length
        } else {
            state.total = res.count
        }
    }).finally(() => {
        state.loading = false
    })
}

const onTableSizeChange = (val: number) => {
    state.size = val
    getIndex()
}

const onTableCurrentChange = (val: number) => {
    state.page = val
    getIndex()
}

const onRowClick = (row: TableRow) => {
    tableRef.value.setCurrentRow(-1)
    nowIndex.value = -1
    state.show = false
    emits('choice', row, props.agrs)
}

const onClose = () => {
    state.show = false
    keywordsRef.value.focus()
}

const pageSizes = computed(() => {
    let defaultSizes = [20, 30, 50, 100, 200]
    if (state.size) {
        if (!defaultSizes.includes(state.size)) {
            defaultSizes.push(state.size)
        }
    }
    return defaultSizes
})

onMounted(() => {
    inputStr.value = props.modelValue
})

watch(
    () => state.show,
    (newVal) => {
        if (newVal) {
            nextTick(() => {
                keywordsRef.value.focus()
                getIndex()
            })
        } else {
            state.quickSearch = ''
        }
    }
)

watch(
    ()=> props.modelValue,
    () => {
        inputStr.value = props.modelValue
    }
)

const changeInfo = (val: string) => {
    emits('update:modelValue', val)
}

</script>

<style scoped lang="scss">
.mc-input {
    width: 100%;
    // :deep(.el-input__wrapper) {
    //     box-shadow: none;
    // }
}
.ba-data-table :deep(.el-button + .el-button) {
    margin-left: 6px;
}

.ba-data-table :deep(.table-header-cell) .cell {
    color: var(--el-text-color-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.ba-data-table :deep(.el-table__header th.el-table__cell.is-leaf) {
    background-color: rgb(232, 232, 232);

    .cell {
        font-weight: bold;
    }
}

.ba-data-table :deep(.el-table__body .current-row > td.el-table__cell) {
    background-color: #e7f1f5 !important;

    .cell {
        color: #000;
    }
}

.ba-data-table :deep(.el-table__body tr:hover > td) {
    background-color: #e7f1f5;

    .cell {
        color: #000;
    }
}

.ba-data-table :deep(.el-table-fixed-column--right) {
    .cell {
        padding: 0 2px;
    }
}

.table-pagination {
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    background-color: var(--ba-bg-color-overlay);
    padding: 13px 15px;
}

.table-search {
    padding: 10px 0px;

    .quick-search {
        width: 390px;
    }
}
:deep(.el-dialog__body) {
    height: 520px;
    padding: 0px 20px 5px;
}
</style>
