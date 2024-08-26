<template>
    <!-- 通用搜索 -->
    <transition name="el-zoom-in-bottom" mode="out-in">
        <Search v-show="props.buttons.includes('comSearch') && baTable.table.showComSearch">
            <template v-for="(slot, idx) in $slots" :key="idx" #[idx]>
                <slot :name="idx"></slot>
            </template>
        </Search>
    </transition>

    <!-- 操作按钮组 -->
    <div v-bind="$attrs" class="table-header ba-scroll-style">
        <!-- <div>1</div>
        <div>2</div> -->
        <div class="table-search">
            <slot name="quickSearchPrepend"></slot>
            <el-input v-if="props.buttons.includes('quickSearch')" v-model="state.quickSearch"
                class="xs-hidden quick-search" @input="debounce(onSearchInput, 500)()"
                :placeholder="quickSearchPlaceholder ? quickSearchPlaceholder : t('Search')" clearable>
                <template #append>
                    <el-button type="text" plain @click="debounce(onSearchInput, 500)()">
                        <Icon name="local-find" />
                    </el-button>
                </template>
            </el-input>
        </div>
        <div class="table-action">
            <slot name="addPrepend"></slot>
            <el-tooltip v-if="props.buttons.includes('add') && auth('add')" :content="t('Add')" placement="top">
                <el-button v-blur @click="onAction('add')" type="text" plain>
                    <Icon name="local-create" />
                    <span class="table-header-operate-text">新增</span>
                </el-button>
            </el-tooltip>
            <slot name="addAppend"></slot>
            <el-dropdown v-if="props.buttons.includes('columnDisplay')" :max-height="380" :hide-on-click="false">
                <el-button type="text" plain>
                    <Icon name="local-zdsz" class="local-icon" />
                    <span class="table-header-operate-text">字段配置</span>
                </el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item v-for="(item, idx) in columnDisplay" :key="idx">
                            <el-checkbox v-if="item.prop" @change="onChangeShowColumn($event, item.prop!)"
                                :checked="!item.show" :model-value="item.show" size="small" :label="item.label" />
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <slot name="rightAppend"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, computed, inject } from 'vue'
import { debounce, auth } from '/@/utils/common'
import type baTableClass from '/@/utils/baTable'
import Search from '/@/components/table/search/index.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const baTable = inject('baTable') as baTableClass

interface Props {
    buttons: HeaderOptButton[]
    quickSearchPlaceholder?: string
}
const props = withDefaults(defineProps<Props>(), {
    buttons: () => {
        return ['refresh', 'add', 'edit', 'delete', 'quickSearch', 'columnDisplay']
    },
    quickSearchPlaceholder: '',
})

const state = reactive({
    quickSearch: '',
    yxzt: '-1'
})

const columnDisplay = computed(() => {
    let columnDisplayArr = []
    for (let item of baTable.table.column) {
        item.type === 'selection' || item.render === 'buttons' || item.enableColumnDisplayControl === false ? '' : columnDisplayArr.push(item)
    }
    return columnDisplayArr
})

const enableBatchOpt = computed(() => (baTable.table.selection!.length > 0 ? true : false))

const onAction = (event: string, data: anyObj = {}) => {
    baTable.onTableHeaderAction(event, data)
}

const onSearchInput = () => {
    baTable.onTableHeaderAction('quick-search', { yxzt: state.yxzt, keyword: state.quickSearch })

}

const onChangeShowColumn = (value: string | number | boolean, field: string) => {
    baTable.onTableHeaderAction('change-show-column', { field: field, value: value })
}
</script>

<style scoped lang="scss">
.table-header {
    position: relative;
    overflow-x: auto;
    box-sizing: border-box;
    display: flex;
    // align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 100%;
    background-color: var(--ba-bg-color-overlay);
    border: 1px solid var(--ba-border-color);
    border-bottom: none;
    padding: 13px 15px;
    font-size: 14px;

    .table-header-operate-text {
        margin-left: 6px;
    }

    .svg-icon {
        color: #59A7FF !important;
    }

    :deep(.el-input-group__append) {
        background-color: #fff;

        .el-button {
            display: flex;
            justify-content: center;
        }
    }
}

.mlr-12 {
    margin-left: 12px;
}

.mlr-12+.el-button {
    margin-left: 12px;
}

.table-search {
    .quick-search {
        width: 360px;
    }
}

.table-action {
    .el-button {
        margin-left: 12px;
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

    .el-button+.el-button {
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
