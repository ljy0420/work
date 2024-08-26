<template>
    <div>
        <el-dialog
            @close="emits('update:modelValue', false)"
            width="60%"
            :model-value="modelValue"
            class="ba-upload-select-dialog"
            :title="t('utils.Select File')"
            :append-to-body="true"
            :destroy-on-close="true"
            top="4vh"
        >
            <TableHeader
                :buttons="['refresh', 'quickSearch', 'columnDisplay']"
                quick-search-placeholder="输入关键字"
            >
                <el-tooltip content="选择" placement="top">
                    <el-button
                        @click="onChoice"
                        :disabled="baTable.table.selection!.length > 0 ? false : true"
                        v-blur
                        class="table-header-operate"
                        type="primary"
                    >
                        <Icon name="fa fa-check" />
                        <span class="table-header-operate-text">选择</span>
                    </el-button>
                </el-tooltip>
                <div class="ml-10" v-if="limit !== 0">
                    还可以选择
                    <span class="selection-count">{{ limit - baTable.table.selection!.length }}</span>
                    项
                </div>
            </TableHeader>

            <Table ref="tableRef" @selection-change="onSelectionChange" />
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, provide, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/index.vue'
import baTableClass from '/@/utils/baTable'
import { previewRenderFormatter } from '/@/views/backend/routine/attachment'
import { baTableApi } from '/@/api/common'

interface Props {
    type?: 'image' | 'file'
    limit?: number
    modelValue: boolean
    returnFullUrl?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    type: 'file',
    limit: 0,
    modelValue: false,
    returnFullUrl: false,
})

const emits = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'choice', value: string[]): void
}>()

const tableRef = ref()
const { t } = useI18n()
const state = reactive({
    ready: false,
    tableSelectable: true,
})

const optBtn: OptButton[] = [
    {
        render: 'tipButton',
        name: 'choice',
        text: '选择',
        type: 'primary',
        icon: 'fa fa-check',
        class: 'table-row-choice',
        disabledTip: false,
        click: (row: TableRow) => {
            const elTableRef = tableRef.value.getRef()
            elTableRef.clearSelection()
            let files: string[] = []
            files.push(row.URL)
            emits('choice', files)
        },
    },
]
const baTable = new baTableClass(new baTableApi('/api/v1/attachment/'), {
    column: [
        {
            type: 'selection',
            selectable: (row: TableRow) => {
                if (props.limit == 0) return true
                if (baTable.table.selection) {
                    for (const key in baTable.table.selection) {
                        if (row.id == baTable.table.selection[key].id) {
                            return true
                        }
                    }
                }
                return state.tableSelectable
            },
            align: 'center',
            operator: false,
        },
        {
            label: '原始名称',
            prop: 'FJMC',
            align: 'center',
            showOverflowTooltip: true
        },
        {
            label: '预览',
            prop: 'SUFFIX',
            align: 'center',
            renderFormatter: previewRenderFormatter,
            render: 'image',
            operator: false,
        },
        {
            label: '类型',
            prop: 'FJLX',
            align: 'center'
        },
        {
            label: '大小',
            prop: 'FJDX',
            align: 'center',
            formatter: (row: TableRow, column: TableColumn, cellValue: string) => {
                var size = parseFloat(cellValue)
                var i = Math.floor(Math.log(size) / Math.log(1024))
                return parseInt((size / Math.pow(1024, i)).toFixed(i < 2 ? 0 : 2)) * 1 + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i]
            }
        },
        {
            label: '更新时间',
            prop: 'GXSJ',
            align: 'center',
            render: 'datetime',
            width: 160
        },
        {
            label: '操作',
            align: 'center',
            width: '100',
            render: 'buttons',
            buttons: optBtn,
        },
    ]
})

provide('baTable', baTable)

const getIndex = () => {
    baTable.table.ref = tableRef.value
    baTable.table.filter!.size = 20
    baTable.getIndex()?.then(() => {
        baTable.initSort()
    })
    state.ready = true
}

const onChoice = () => {
    if (baTable.table.selection?.length) {
        let files: string[] = []
        for (const key in baTable.table.selection) {
            files.push(baTable.table.selection[key].URL)
        }
        console.log(files)
        emits('choice', files)
        const elTableRef = tableRef.value.getRef()
        elTableRef.clearSelection()
    }
}

const onSelectionChange = (selection: TableRow[]) => {
    if (props.limit == 0) return
    if (selection.length > props.limit) {
        const elTableRef = tableRef.value.getRef()
        elTableRef.toggleRowSelection(selection[selection.length - 1], false)
    }
    state.tableSelectable = !(selection.length >= props.limit)
}

onMounted(() => {
    baTable.mount()
})

watch(
    () => props.modelValue,
    (newVal) => {
        if (newVal && !state.ready) {
            nextTick(() => {
                getIndex()
            })
        }
    }
)
</script>

<style>
.ba-upload-select-dialog .el-dialog__body {
    padding: 10px 20px;
}
.table-header-operate-text {
    margin-left: 6px;
}
.ml-10 {
    margin-left: 10px;
}
.selection-count {
    color: var(--el-color-primary);
    font-weight: bold;
}
</style>
