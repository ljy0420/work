<template>
    <div>
        <el-radio-group v-model="state.showAll" class="ml-4" @change="showBwChange" style="margin-top: -15px">
            <el-radio label="1" size="large">显示所有部位</el-radio>
            <el-radio label="2" size="large">显示已选部位</el-radio>
        </el-radio-group>
        <el-table class="ba-data-table w100 jcbw-data-table" :data="state.bwjcffData" v-loading="state.bwLoading" border
            height="500px" :span-method="objectSpanMethod" :v-loading="state.bwLoading"
            :cell-style="{ background: '#fff' }">
            <el-table-column prop="FLMC" label="分类" width="100"> </el-table-column>
            <el-table-column prop="BWMC" label="部位" width="170">
                <template #default="scope">
                    <el-checkbox v-model="scope.row.CHECKED" :indeterminate="scope.row.isIndeterminate"
                        @change="bwChange(scope.row)" :key="scope.row.BWBM" :label="scope.row.BWMC">{{ scope.row.BWMC
                        }}</el-checkbox>
                </template>
            </el-table-column>
            <el-table-column prop="MC" label="检查方法">
                <template #default="scope">
                    <el-checkbox-group v-model="scope.row.checkedItems"
                        @change="handleCheckedJcffChange($event, scope.row)">
                        <el-checkbox v-for="opt in scope.row.JCFF" :key="opt.BM" :label="opt.BM"
                            :class="opt.LX == '0' ? 'huchi-check' : 'gongtong-check'">{{ opt.MC }}</el-checkbox>
                    </el-checkbox-group>
                </template>
            </el-table-column>
            <el-table-column prop="BZ" label="备注" width="150" :showOverflowTooltip="true"> </el-table-column>
        </el-table>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, watch, nextTick } from 'vue'
import { getBwGroupInfo } from '/@/api/common'
import { getYzxmsfmx } from '/@/api/backend/jcgl/yzxmzd'
// import SfxmSelect from './sfxmSelect.vue'
import { cloneDeep } from 'lodash-es'

defineOptions({
    name: 'jcgl/yzzdgl/jcbw',
})

const props = defineProps({
    currentXmbm: {
        type: String,
    },
    yxbw: {
        type: Array as unknown as any[],
        default: () => [],
    },
})

const emit = defineEmits(["bwDataChange"]);

const state: {
    showAll: string
    bwjcffOrig: any
    bwjcffData: any //部位检查方法
    sfmxData: any
    jcbwFields: any
    spanArr: any
    currentXmbm: any
    bwLoading: boolean
} = reactive({
    showAll: '1',
    bwjcffOrig: [],
    bwjcffData: [],
    sfmxData: [],
    jcbwFields: ['FLMC', 'BWMC', 'MC', 'BZ'],
    spanArr: [],
    currentXmbm: props.currentXmbm,
    bwLoading: false
})

interface SpanMethodProps {
    row: any
    column: any
    rowIndex: number
    columnIndex: number
}

const showBwChange = (value: any) => {
    if (value == '1') {
        //显示所有
        initBwjcff(state.bwjcffOrig)
    } else {
        //显示所选
        let data = state.bwjcffOrig.filter((ele: any) => ele.CHECKED == true)
        if (data && data.length > 0) {
            initBwjcff(data)
        } else {
            initBwjcff([])
        }
    }
}

watch(
    () => state.sfmxData,
    (val) => {
        // console.log('sfmxData',val);
        emit("bwDataChange", val)
    },
    {
        deep: true,
    }
)

const loadBw = () => {
    getBwGroupInfo({ agrs: {} })
        .then((res) => {
            // console.log(res)
            if (res.data && res.data.length > 0) {
                state.bwjcffOrig = cloneDeep(res.data)
                initBwjcff(state.bwjcffOrig)
                if (state.currentXmbm) {
                    loadSfmx(state.currentXmbm)
                }
            }
            state.bwLoading = false
        })
        .finally(() => {
            state.bwLoading = false
        })
}

/**
 * 初始化部位及检查方法，分类相同的合并单元格
 */
const initBwjcff = (data: any) => {
    getSpanArr(data)
    // console.log(data)
    state.bwjcffData = data
}

/**
 * 加载收费项目
 */
const loadSfmx = (xmbm: string) => {
    getYzxmsfmx({ agrs: xmbm }).then((res) => {
        //console.log('收费项目', res)
        if (res.data && res.data.length > 0) {
            // state.sfmxData = res.data
            const sfmx: any = []
            res.data.forEach((ele: any) => {
                if (ele.BWBM) { 
                    sfmx.push(ele)
                }
            })
            state.sfmxData = sfmx
            checkBwff()
        } else {
            state.sfmxData = []
        }
    })
}

/**
 * 选中已设置的部位及检查方法
 */
const checkBwff = () => {
    const bwMap : any = {}
    state.sfmxData.forEach((ele: any) => {
        if (ele.BWBM) {
            if (bwMap[ele.BWBM] && bwMap[ele.BWBM].length > 0) {
                bwMap[ele.BWBM].push(ele.JCFFBM)
            } else {
                bwMap[ele.BWBM] = []
                bwMap[ele.BWBM].push(ele.JCFFBM)
            }
            const bw = state.bwjcffOrig.find((bw: any) => bw.BWBM == ele.BWBM)
            if(bw) {
                ele.BWMC = bw.BWMC
                const jcff = bw.JCFF.find((jcff: any) => jcff.BM == ele.JCFFBM)
                if(jcff) {
                    ele.JCFFMC = jcff.MC
                }
            }
        }
    })
    state.bwjcffOrig.forEach((item: any) => {
        if (bwMap[item.BWBM] && bwMap[item.BWBM].length > 0) {
            item.CHECKED = true
            item.isIndeterminate = bwMap[item.BWBM].length > 0 && bwMap[item.BWBM].length < item.JCFF.length
            item.checkedItems = bwMap[item.BWBM]
        }
    })
}

/**
 * 部位选择切换
 */
const bwChange = (row: any) => {
    let jcffs : any = []
    if (row.JCFF && row.JCFF.length > 0) {
        row.JCFF.forEach((item: any) => {
            jcffs.push(item.BM)
        })
    }
    row.checkedItems = row.CHECKED ? jcffs : []
    row.isIndeterminate = false
    makeJcff()
}

/**
 * 检查方法选择切换
 */
const handleCheckedJcffChange = (value: any, row: any) => {
    const checkedCount = value.length
    // row.CHECKED = checkedCount === row.JCFF.length
    row.CHECKED = checkedCount > 0 ? true : false
    row.isIndeterminate = checkedCount > 0 && checkedCount < row.JCFF.length
    makeJcff()
}

const makeJcff = () => {
    const checkedBw = state.bwjcffOrig.filter((ele: any) => ele.CHECKED == true)
    //console.log(checkedBw)
    const jcffItems: any = []
    if (checkedBw && checkedBw.length > 0) {
        checkedBw.forEach((item: any) => {
            const jcffs = item.JCFF.filter((ele: any) => item.checkedItems.includes(ele.BM))
            if (jcffs && jcffs.length > 0) {
                jcffs.forEach((jcff: any) => {
                    const sfmx = state.sfmxData.find((mx: any) => mx.BWBM === jcff.BWBM && mx.JCFFBM === jcff.BM)
                    if (sfmx) {
                        jcffItems.push({
                            SFXMBM: sfmx.SFXMBM,
                            SFXMMC: sfmx.SFXMMC,
                            JG: sfmx.JG,
                            SFSL: sfmx.SFSL,
                            GX: sfmx.GX,
                            CSXM: sfmx.CSXM,
                            FYXZ: sfmx.FYXZ,
                            BWBM: sfmx.BWBM,
                            BWMC: jcff.BWMC,
                            JCFFBM: sfmx.JCFFBM,
                            JCFFMC: jcff.MC,
                            MZSFFS: sfmx.MZSFFS,
                            ZYSFFS: sfmx.ZYSFFS,
                            ZXKSFS: sfmx.ZXKSFS,
                            ZSFXM: sfmx.ZSFXM,
                            JSFYBS: sfmx.JSFYBS,
                            BRLY: sfmx.BRLY
                        })
                    } else {
                        jcffItems.push({
                            SFXMBM: '',
                            JG: '',
                            SFSL: '',
                            GX: 1,
                            CSXM: 0,
                            FYXZ: 2,
                            BWBM: jcff.BWBM,
                            BWMC: jcff.BWMC,
                            JCFFBM: jcff.BM,
                            JCFFMC: jcff.MC,
                            MZSFFS: 0,
                            ZYSFFS: 0,
                            ZXKSFS: 0,
                            ZSFXM: 0,
                            JSFYBS: 0,
                            BRLY: 0
                        })
                    }
                })
            }
        })
    }
    state.sfmxData = jcffItems
}

/**
 * 分析合并行数据
 */
const getSpanArr = (tbData: any) => {
    for (let i = 0; i < tbData.length; i++) {
        let row = i
        if (row === 0) {
            // i 表示行 j表示列
            for (let j = 0; j < state.jcbwFields.length; j++) {
                state.spanArr[i * state.jcbwFields.length + j] = {
                    rowspan: 1,
                    colspan: 1,
                }
            }
        } else {
            for (let j = 0; j < state.jcbwFields.length; j++) {
                // 当前和上一次的一样
                // 1. 合并所有列的相同数据单元格
                if (state.jcbwFields[j] == 'FLMC' || state.jcbwFields[j] == 'BWMC') {
                    if (tbData[row][state.jcbwFields[j]] === tbData[row - 1][state.jcbwFields[j]]) {
                        let beforeItem = state.spanArr[(row - 1) * state.jcbwFields.length + j]
                        state.spanArr[row * state.jcbwFields.length + j] = {
                            rowspan: 1 + beforeItem.rowspan, // 合并几行
                            colspan: 1, // 合并几列,这里只是跨行合并,不跨列合并,所以用的1
                        }
                        beforeItem.rowspan = 0
                        beforeItem.colspan = 0
                    } else {
                        // rowspan 和 colspan 都为1表格此单元格不合并
                        state.spanArr[row * state.jcbwFields.length + j] = {
                            rowspan: 1,
                            colspan: 1,
                        }
                    }
                } else {
                    state.spanArr[row * state.jcbwFields.length + j] = {
                        rowspan: 1,
                        colspan: 1,
                    }
                }
            }
        }
    }
    let stack = []
    for (let i = 0; i < state.jcbwFields.length; i++) {
        for (let j = 0; j < tbData.length; j++) {
            if (j === 0) {
                if (state.spanArr[j * state.jcbwFields.length + i].rowspan === 0) {
                    stack.push(state.spanArr[j * state.jcbwFields.length + i])
                }
            } else {
                if (state.spanArr[j * state.jcbwFields.length + i].rowspan === 0) {
                    stack.push(state.spanArr[j * state.jcbwFields.length + i])
                } else {
                    stack.push(state.spanArr[j * state.jcbwFields.length + i])
                    while (stack.length > 0) {
                        let pop = stack.pop()
                        let len = stack.length
                        state.spanArr[(j - len) * state.jcbwFields.length + i] = pop
                    }
                }
            }
        }
    }
}

const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: SpanMethodProps) => {
    return state.spanArr[rowIndex * state.jcbwFields.length + columnIndex]
}

onMounted(() => {
    state.bwLoading = true
    nextTick(() => {
        loadBw()
    })
})
</script>

<style scoped lang="scss">
.jcbw-data-table {
    .el-checkbox {
        height: 25px;
        margin-right: 10px;

        :deep(.el-checkbox__label) {
            padding-left: 3px;
        }
    }

    :deep(.el-table__row .el-table__cell) {
        padding: 3px 0;
    }

    .huchi-check :deep(.el-checkbox__inner) {
        border-radius: 50% !important;
        border-color: #e6c045;
    }

    .huchi-check :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
        border-color: var(--el-checkbox-checked-bg-color);
    }

    .huchi-check :deep(.el-checkbox__input.is-disabled .el-checkbox__inner) {
        border-color: var(--el-checkbox-disabled-border-color);
    }

    .gongtong-check :deep(.el-checkbox__inner) {
        border-color: #808080;
    }

    .gongtong-check :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
        border-color: var(--el-checkbox-checked-bg-color);
    }

    .gongtong-check :deep(.el-checkbox__input.is-disabled .el-checkbox__inner) {
        border-color: var(--el-checkbox-disabled-border-color);
    }
}

.span-color-true {
    color: #ff0000;
}

.span-color-false {
    color: #808080;
}
</style>
