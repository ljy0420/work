<template>
    <!-- 操作按钮组 -->
    <div v-bind="$attrs" class="table-header ba-scroll-style">
        <slot name="refreshPrepend"></slot>
        <el-tooltip v-if="props.buttons.includes('refresh')" content="刷新" placement="top">
            <el-button v-blur @click="onAction('refresh', { loading: true })" class="table-header-operate" type="info">
                <Icon name="fa fa-refresh" />
            </el-button>
        </el-tooltip>
        <slot name="refreshAppend"></slot>
        <el-tooltip v-if="props.buttons.includes('add')" content="新增" placement="top">
            <el-button v-blur @click="onAction('add')" class="table-header-operate" type="primary">
                <Icon name="fa fa-plus" />
            </el-button>
        </el-tooltip>
        <el-tooltip v-if="props.buttons.includes('edit')"  content="修改" placement="top">
            <el-button v-blur @click="onAction('edit')" :disabled="!enableBatchOpt" class="table-header-operate" type="primary">
                <Icon name="fa fa-pencil" />
            </el-button>
        </el-tooltip>
        <el-popconfirm
            v-if="props.buttons.includes('delete')"
            @confirm="batchDelete"
            confirm-button-text="删除"
            cancel-button-text="取消"
            confirmButtonType="danger"
            title="您确定删除选中的记录？"
            :disabled="!enableBatchOpt"
            width="200"
        >
            <template #reference>
                <div class="mlr-12">
                    <el-tooltip content="删除选中的记录" placement="top">
                        <el-button v-blur :disabled="!enableBatchOpt" class="table-header-operate" type="danger">
                            <Icon name="fa fa-trash" />
                        </el-button>
                    </el-tooltip>
                </div>
            </template>
        </el-popconfirm>

        <!-- slot -->
        <slot></slot>

        <!-- 右侧搜索框和工具按钮 -->
        <div class="table-search">
            <slot name="quickSearchPrepend"></slot>
            <el-input
                v-if="props.buttons.includes('quickSearch')"
                v-model="state.quickSearch"
                class="xs-hidden quick-search"
                @input="debounce(onSearchInput, 500)()"
                placeholder="输入关键字搜索"
                clearable
            />
            
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, computed, inject } from 'vue'
import { debounce } from '/@/utils/common'
import type baTableClass from '/@/utils/baTable'

const baTable = inject('baTable') as baTableClass

interface Props {
    buttons: HeaderOptButton[]
    quickSearchPlaceholder?: string,
    localFilter?: boolean
}
const props = withDefaults(defineProps<Props>(), {
    buttons: () => {
        return ['refresh', 'add', 'edit', 'delete']
    },
    quickSearchPlaceholder: '',
    localFilter: true
})

const state = reactive({
    quickSearch: ''
})

const enableBatchOpt = computed(() => (baTable.table.selection!.length > 0 ? true : false))

const onAction = (event: string, data: anyObj = {}) => {
    baTable.onTableHeaderAction(event, data)
}

const onSearchInput = () => {
    if(props.localFilter) {
        baTable.onTableHeaderAction('filter', { keyword: state.quickSearch })
    } else {
        baTable.onTableHeaderAction('quick-search', { keyword: state.quickSearch })
    }
}

const batchDelete = () => {
    if(baTable.table.selection && baTable.table.selection.length>0) {
        // console.log(baTable.table.selection)
        let rows = []
        baTable.table.selection.forEach((row: any) => {
            const rdata = JSON.parse(JSON.stringify(row));
            if('children' in rdata && typeof(rdata.children)==='object'){
                //移除子节点
                row['children']=[]
            }
            rows.push(row)
        })
        if(rows.length > 0) {
            baTable.onTableHeaderAction('batch-delete', rows)
        }
    }
}

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
    border: 1px solid var(--ba-border-color);
    border-bottom: none;
    padding: 13px 15px;
    font-size: 14px;
    .table-header-operate{
        height: 32px;
        width: 32px;
        text-align: center;
    }
    .table-header-operate-text {
        margin-left: 6px;
    }
}

.mlr-12 {
    margin-left: 12px;
}
.mlr-12 + .el-button {
    margin-left: 6px;
}
.table-search {
    width: 170px;
    display: flex;
    margin-left: auto;
    .quick-search {
        width: auto;
    }
}
.table-search-button-group {
    display: flex;
    margin-left: 12px;
    border: 1px solid var(--el-border-color);
    border-radius: var(--el-border-radius-round);
    overflow: hidden;
    button:focus,
    button:active {
        background-color: var(--ba-bg-color-overlay);
    }
    button:hover {
        background-color: var(--el-color-info-light-7);
    }
    .table-search-button-item {
        height: 30px;
        border: none;
        border-radius: 0;
    }
    .el-button + .el-button {
        margin: 0;
    }
    .right-border {
        border-right: 1px solid var(--el-border-color);
    }
}

html.dark {
    .table-search-button-group {
        button:focus,
        button:active {
            background-color: var(--el-color-info-dark-2);
        }
        button:hover {
            background-color: var(--el-color-info-light-7);
        }
        button {
            background-color: #898a8d;
            el-icon {
                color: white !important;
            }
        }
    }
}
</style>
