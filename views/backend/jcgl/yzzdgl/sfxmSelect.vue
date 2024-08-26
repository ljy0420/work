<template>
    <el-select
        ref="selectRef"
        v-model="state.defaultValue"
        popper-class="t-select-table"
        :multiple="multiple"
        v-bind="selectAttr"
        :value-key="keywords.value"
        :filterable="filterable"
        :filter-method="filterMethod || filterMethodHandle"
        v-click-outside="closeBox"
        @visible-change="visibleChange"
        @remove-tag="removeTag"
        @clear="clear"
        @keyup="selectKeyup"
    >
        <template #empty>
            <div class="t-table-select__table" :style="{ width: `${tableWidth}px` }">
                <el-table
                    ref="selectTable"
                    :data="state.tableData"
                    :class="{
                        radioStyle: !multiple,
                        highlightCurrentRow: isRadio,
                        keyUpStyle: isKeyup,
                    }"
                    highlight-current-row
                    border
                    :row-key="getRowKey"
                    @row-click="rowClick"
                    @cell-dblclick="cellDblclick"
                    @selection-change="handlesSelectionChange"
                    v-bind="$attrs"
                >
                    <el-table-column
                        v-if="multiple"
                        type="selection"
                        width="55"
                        align="center"
                        :reserve-selection="reserveSelection"
                        fixed
                    ></el-table-column>
                    <el-table-column type="radio" width="55" :label="radioTxt" fixed align="center" v-if="!multiple && isShowFirstColumn">
                        <template #default="scope">
                            <el-radio
                                v-model="radioVal"
                                :label="scope.$index + 1"
                                @click.stop="radioChangeHandle($event, scope.row, scope.$index + 1)"
                            ></el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-for="(item, index) in columns"
                        :key="index + 'i'"
                        :type="item.type"
                        :label="item.label"
                        :prop="item.prop"
                        :min-width="item['min-width'] || item.minWidth || item.width"
                        :align="item.align || 'center'"
                        :fixed="item.fixed"
                        :show-overflow-tooltip="item.noShowTip"
                        v-bind="{ ...item.bind, ...$attrs }"
                    >
                        <template #default="scope">
                            <!-- render方式 -->
                            <!-- <template v-if="item.render">
                                <render-col :column="item" :row="scope.row" :render="item.render" :index="scope.$index" />
                            </template> -->
                            <!-- 作用域插槽 -->
                            <template v-if="item.slotName">
                                <slot :name="item.slotName" :scope="scope"></slot>
                            </template>
                            <div v-if="!item.render && !item.slotName">
                                <span>{{ scope.row[item.prop] }}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <slot></slot>
                </el-table>
                <div class="t-table-select__page" v-if="isShowPagination">
                    <el-pagination small background layout="prev, pager, next, total" :page-size="props.pageSize" :total="props.total" @current-change="handlesCurrentChange" v-bind="$attrs" />
                </div>
            </div>
        </template>
    </el-select>
</template>
<script lang="ts">
export default {
    name: 'TSelectTable',
}
</script>
<script setup lang="ts">
import { computed, useAttrs, ref, watch, nextTick, reactive, onMounted } from 'vue'
import { ClickOutside as vClickOutside, ElMessage } from 'element-plus'

const props = defineProps({
    // 选择值
    value: {
        type: [String, Number, Array],
    },
    data: {
        type: Array as unknown as any[],
        default: () => []
    },
    agrs: {
        type: Object,
        default: () => {
            return {}
        },
    },
    pageSize: {
        type: Number,
        default: 100
    },
    total: {
        type: Number,
        default: 0
    },
    // 表头数据
    columns: {
        type: Array as unknown as any[],
        default: () => [],
    },
    // 单选文案
    radioTxt: {
        type: String,
        default: '单选',
    },
    // 是否显示搜索条件
    isShowQuery: {
        type: Boolean,
        default: false,
    },
    // 单选框--是否开启点击整行选中
    rowClickRadio: {
        type: Boolean,
        default: true,
    },
    // 是否显示首列
    isShowFirstColumn: {
        type: Boolean,
        default: true,
    },
    // 是否过滤
    filterable: {
        type: Boolean,
        default: true,
    },
    remote: {
        type: Boolean,
        default: true,
    },
    // 是否支持翻页选中
    reserveSelection: {
        type: Boolean,
        default: true,
    },
    // 是否显示分页
    isShowPagination: {
        type: Boolean,
        default: false,
    },
    // 是否自定义过滤
    filterMethod: {
        type: Function,
    },
    remoteMethod: {
        type: Function
    },
    // 下拉数据指向的label/value
    keywords: {
        type: Object,
        default: () => {
            return {
                label: 'label',
                value: 'value',
            }
        },
    },
    // 单选是否开启键盘事件
    isKeyup: {
        type: Boolean,
        default: false,
    },
    // 多选
    multiple: {
        type: Boolean,
        default: false,
    },
    // table宽度
    tableWidth: {
        type: Number,
        default: 550,
    },
    // 设置默认选中项--keywords.value值（单选是String, Number类型；多选时是数组）
    defaultSelectVal: {
        type: [String, Number, Array],
    },
})
const selectAttr = computed(() => {
    return {
        clearable: true,
        ...useAttrs(),
    }
})
const isDefaultSelectVal = ref(true) // 是否已经重新选择了
const forbidden = ref(true) // 判断单选选中及取消选中
const isRadio = ref(false)
const isPagination = ref(false) // 分页点击不隐藏下拉框
const radioVal = ref('')
const state: any = reactive({
    defaultSelectValue: props.defaultSelectVal, // 默认选中
    tableData: props.data, // table数据
    defaultValue: props.value,
    ids: [], // 多选id集合
    tabularMap: {}, // 存储下拉tale的所有name
    keywords: ''
})
// 获取ref
const selectRef: any = ref<HTMLElement | null>(null)
const selectTable: any = ref<HTMLElement | null>(null)
// const tQueryConditionRef: any = ref<HTMLElement | null>(null)
const nowIndex = ref(-1)
watch(
    () => props.data,
    (val) => {
        // console.log(111, val)
        state.tableData = val
        nextTick(() => {
            state.tableData &&
                state.tableData.length > 0 &&
                state.tableData.forEach((item:any) => {
                    state.tabularMap[item[props.keywords.value]] = item[props.keywords.label]
                })
            // findLabel()
        })
    },
    { deep: true }
)
watch(
    () => props.value,
    (val) => {
        // console.log(111, val)
        state.tableData = val
        nextTick(() => {
            // 多选
            if (props.multiple) {
                state.defaultValue = Array.isArray(props.value) ? props.value : typeof props.value === 'string' ? props.value.split(',') : []
                state.defaultValue = (state.defaultValue || []).map((item:any) => {
                    return item
                })
            } else {
                state.defaultValue = props.value ? { [props.keywords.value]: props.value } : ''
            }
            findLabel()
        })
    },
    { deep: true }
)
watch(
    () => props.defaultSelectVal,
    (val) => {
        // console.log('props.defaultSelectVal---watch', val)
        state.defaultSelectValue = val
        if (val && isDefaultSelectVal.value) {
            defaultSelect(val)
        }
        if(!val) {
            state.defaultValue = {}
        }
    },
    { deep: true }
)
onMounted(() => {
    // 设置默认选中项（单选）
    if (state.defaultSelectValue && isDefaultSelectVal.value) {
        defaultSelect(state.defaultSelectValue)
    }
})
// el-select点击了空白区域
const closeBox = () => {
    //console.log('点击了空白区域')
}
// 单选键盘事件
const selectKeyup = (e:any) => {
    if (!props.multiple) {
        if (!props.isKeyup) return
        if (state.tableData.length === 0) return
        switch (e.keyCode) {
            case 40: // 下键
                if (state.tableData[nowIndex.value * 1 + 1] !== undefined) {
                    selectTable.value.setCurrentRow(state.tableData[nowIndex.value * 1 + 1])
                    nowIndex.value = nowIndex.value * 1 + 1
                } else {
                    nowIndex.value = 0
                    selectTable.value.setCurrentRow(state.tableData[0])
                }
                break
            case 38: // 上键
                if (state.tableData[nowIndex.value * 1 - 1] !== undefined && nowIndex.value > 0) {
                    selectTable.value.setCurrentRow(state.tableData[nowIndex.value * 1 - 1])
                    nowIndex.value = nowIndex.value * 1 - 1
                } else {
                    nowIndex.value = 0
                    selectTable.value.setCurrentRow(state.tableData[0])
                }
                break
            case 13: // 回车
                rowClick(state.tableData[nowIndex.value])
                break
        }
    }
}
// 赋值
const findLabel = () => {
    nextTick(() => {
        if (props.multiple) {
            // if (selectRef.value) {
            selectRef.value.selected?.forEach((item:any) => {
                item.currentLabel = item.value
                // this.tableData.map(val => {
                //   if (val[this.keywords.label] === item.value) {
                //     item.value = val[this.keywords.value]
                //   }
                // })
            })
            // }
        } else {
            // if (selectRef.value) {
            selectRef.value.selectedLabel = (state.defaultValue && state.defaultValue[props.keywords.label]) || ''
            // }
            if (!isPagination.value) {
                blur()
            }
        }
    })
}
// 抛出事件
const emits = defineEmits(['page-change', 'selectionChange', 'radioChange', 'selectClear'])
// 当前页码
const handlesCurrentChange = (val:any) => {
    if (props.multiple) {
        if (!props.reserveSelection) {
            clear()
        }
    } else {
        clear()
    }
    isPagination.value = true
    emits('page-change', val)
}

// 默认选中（且只能默认选中第一页的数据）
const defaultSelect = (defaultSelectVal:any) => {
    if (typeof defaultSelectVal === 'object' && props.multiple) {
        let multipleList: any = []
        defaultSelectVal.map((val:any) => {
            state.tableData.forEach((row: any) => {
                if (val === row[props.keywords.value]) {
                    multipleList.push(row)
                }
            })
        })
        setTimeout(() => {
            state.defaultValue = multipleList.map((item:any) => item[props.keywords.label])
            multipleList.forEach((row:any) => {
                const arr = state.tableData.filter((item:any) => item[props.keywords.value] === row[props.keywords.value])
                if (arr.length > 0) {
                    selectTable.value.toggleRowSelection(arr[0], true)
                }
            })
            selectRef.value.selected.forEach((item:any) => {
                item.currentLabel = item.value
            })
        }, 0)
    } else {
        let row:any, index:any
        state.tableData.map((val:any, i:any) => {
            if (val[props.keywords.value] === defaultSelectVal) {
                row = val
                index = i
            }
        })
        radioVal.value = index + 1
        state.defaultValue = row
        setTimeout(() => {
            selectRef.value.selectedLabel = row[props.keywords.label]
        }, 0)
    }
}
// 复选框(多选)
const handlesSelectionChange = (val:any) => {
    // console.log('复选框', val)
    isDefaultSelectVal.value = false
    state.defaultValue = val.map((item:any) => item[props.keywords.label])
    state.ids = val.map((item:any) => item[props.keywords.value])
    emits('selectionChange', val, state.ids)
}
// 搜索后表格勾选不取消
const getRowKey = (row:any) => {
    return row[props.keywords.value]
}
// 搜索过滤
const filterMethodHandle = (val:any) => {
    if (!props.filterable) return
    if (!props.data) return
    const tableData = JSON.parse(JSON.stringify(props.data))
    if (tableData && tableData.length > 0) {
        if (!props.multiple) {
            if (val) {
                radioVal.value = ''
            } else {
                tableData.map((item:any, index:any) => {
                    if (item.id === state.defaultValue?.id) {
                        radioVal.value = index + 1
                    }
                })
            }
        }
        state.tableData = tableData.filter((item:any) => {
            if (item[props.keywords.label].includes(val)) {
                return item
            }
        })
    }
}

// 表格显示隐藏回调
const visibleChange = (visible:any) => {
    // console.log('表格显示隐藏回调', visible)
    if (visible) {
        if (props.defaultSelectVal && isDefaultSelectVal.value) {
            defaultSelect(props.defaultSelectVal)
        }
        initTableData()
    } else {
        findLabel()
        filterMethodHandle('')
    }
}
// 获取表格数据
const initTableData = () => {
    // 表格默认赋值
    nextTick(() => {
        if (props.multiple) {
            state.defaultValue.forEach((row:any) => {
                const arr = state.tableData.filter((item:any) => item[props.keywords.value] === row[props.keywords.value])
                if (arr.length > 0) {
                    selectTable.value.toggleRowSelection(arr[0], true)
                }
            })
        } else {
            if(state.tableData){
                const arr = state.tableData.filter(
                    (item:any) => item[props.keywords.value] === state.defaultValue && state.defaultValue[props.keywords.value]
                )
                selectTable.value.setCurrentRow(arr[0])
            }
        }
    })
}
// 复制内容
const copyDomText = (val:any) => {
    // 获取需要复制的元素以及元素内的文本内容
    const text = val
    // 添加一个input元素放置需要的文本内容
    const input = document.createElement('input')
    input.value = text
    document.body.appendChild(input)
    // 选中并复制文本到剪切板
    input.select()
    document.execCommand('copy')
    // 移除input元素
    document.body.removeChild(input)
}
// 双击复制单元格内容
const cellDblclick = (row:any, column:any) => {
    try {
        copyDomText(row[column.property])
        ElMessage.success('复制成功')
    } catch (e) {
        ElMessage.error('复制失败')
    }
}
// 点击单选框单元格触发事件
const radioChangeHandle = (event:any, row:any, index:any) => {
    event.preventDefault()
    isDefaultSelectVal.value = false
    radioClick(row, index)
}
// forbidden取值
const isForbidden = () => {
    forbidden.value = false
    setTimeout(() => {
        forbidden.value = true
    }, 0)
}
// 单选抛出事件radioChange
const radioClick = (row:any, index:any) => {
    forbidden.value = !!forbidden.value
    // if (radioVal.value) {
    //     if (radioVal.value === index) {
    //         console.log(radioVal.value,index)
    //         console.log('取消勾选')
    //         radioVal.value = ''
    //         isForbidden()
    //         state.defaultValue = {}
    //         emits('radioChange', {}, null) // 取消勾选就把回传数据清除
    //         blur()
    //     } else {
    //         isForbidden()
    //         radioVal.value = index
    //         state.defaultValue = row
    //         emits('radioChange', row, row[props.keywords.value])
    //         blur()
    //     }
    // } else {
    //     isForbidden()
    //     radioVal.value = index
    //     state.defaultValue = row
    //     emits('radioChange', row, row[props.keywords.value])
    //     blur()
    // }
    isForbidden()
    radioVal.value = index
    state.defaultValue = row
    emits('radioChange', row, props.agrs)
    blur()
}
// 单击行
const rowClick = async (row:any) => {
    if (!props.rowClickRadio) return
    if (!props.multiple) {
        let rowIndex:any
        // eslint-disable-next-line no-unused-expressions
        props.data?.forEach((item:any, index:any) => {
            if (item[props.keywords.value] === row[props.keywords.value]) {
                // console.log('index', index)
                rowIndex = index
            }
        })
        // await this.radioClick(row, rowIndex + 1)
        // isDefaultSelectVal.value = false
        await radioClick(row, rowIndex + 1)
        if (radioVal.value) {
            isRadio.value = true
        } else {
            isRadio.value = false
        }
    }
}
// tags删除后回调
const removeTag = (tag:any) => {
    const row = state.tableData.find((item:any) => item[props.keywords.label] === tag)
    selectTable.value.toggleRowSelection(row, false)
}
// 清空后的回调
const clear = () => {
    if (props.multiple) {
        selectTable.value.clearSelection()
    } else {
        // 取消高亮
        selectTable.value.setCurrentRow(-1)
        nowIndex.value = -1
        radioVal.value = ''
        forbidden.value = false
    }
    selectClear(props.agrs)
}

const selectClear = (agrs: any) => {
    emits('selectClear', agrs)
}
// 触发select隐藏
const blur = () => {
    selectRef.value.blur()
}
// 触发select显示
const focus = () => {
    selectRef.value.focus()
}
// 暴露方法出去
defineExpose({ focus, blur })
</script>

<style lang="scss">
.t-select-table {
    .t-table-select__page {
        padding: 10px;
    }
}
</style>
