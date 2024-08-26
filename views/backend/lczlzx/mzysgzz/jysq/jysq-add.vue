<template>
    <div>
        <el-dialog
            class="ba-operate-dialog"
            :close-on-click-modal="false"
            :model-value="state.show"
            @close="cancel"
            :destroy-on-close="true"
            align-center
            width="1071px"
        >
            <template #header>
                <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']">新增检验申请</div>
            </template>
            <div class="jcsq-box">
                <el-form ref="formRef" :model="form" label-position="right" label-width="100px" :rules="rules">
                    <el-form-item prop="XMMC" label="模版名称:" class="XMMC">
                        <el-input
                            v-model="form.XMMC"
                            type="string"
                            placeholder="请输入文字(支持模糊搜索)"
                            :suffix-icon="Search"
                            style="width: 50%"
                        ></el-input>
                    </el-form-item>
                    <div class="container">
                        <div class="menu">
                            <el-table
                                :data="state.XMFL"
                                height="300px"
                                :border="false"
                                :show-header="false"
                                header-cell-class-name="table-header-cell"
                                highlight-current-row
                                @row-click="handleRowClick"
                            >
                                <el-table-column prop="MC" align="left"></el-table-column>
                            </el-table>
                        </div>
                        <div class="vertical-line"></div>
                        <el-table
                            :data="state.jysqData"
                            height="300px"
                            class="ba-data-table w100"
                            header-cell-class-name="table-header-cell"
                            highlight-current-row
                        >
                            <el-table-column prop="XZ" align="left" width="40">
                                <template #default="{ row }">
                                    <el-checkbox v-model="row.XZ" @change="boxChange(row)" />
                                </template>
                            </el-table-column>
                            <el-table-column prop="XMMC" label="项目名称" align="left" width="200">
                                <template #default="{ row }">
                                    <span>{{ row.XMMC }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="BBBW" label="标本" align="left" width="130">
                                <template #default="scope">
                                    <el-select
                                        v-model="scope.row.BBBW"
                                        clearable
                                        style="width: 100%"
                                        placeholder=""
                                        @change="selectChange(scope.row)"
                                    >
                                        <el-option v-for="opt in state.bbbwArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"> </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="JJ" label="加急" align="left" width="70">
                                <template #default="scope">
                                    <el-switch v-model="scope.row.JJ"></el-switch>
                                </template>
                            </el-table-column>
                            <el-table-column prop="BZ" label="备注" align="left" width="120">
                                <template #default="scope">
                                    <el-input v-model="scope.row.BZ" type="string" style="width: 100%" class="BZ"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="JG" label="金额(元)" align="left" width="110">
                                <template #default="{ row }">
                                    <span>{{ row.JG }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div v-if="state.xzjysqData.length > 0" class="jysq-box">
                        <el-table
                            class="ba-data-table w100"
                            header-cell-class-name="table-header-cell"
                            :data="state.xzjysqData"
                            height="300px"
                            :default-expand-all="true"
                        >
                            <el-table-column label="NO" type="expand" width="50">
                                <template #default="scope">
                                    <el-table
                                        class="ba-data-table w100"
                                        header-cell-class-name="table-header-cell"
                                        :data="scope.row.XM"
                                        :show-header="false"
                                        highlight-current-row
                                    >
                                        <el-table-column label="NO" type="index" width="50" align="center" />
                                        <el-table-column prop="XMMC" label="项目名称" align="left" :show-overflow-tooltip="true" />
                                        <el-table-column prop="ZXKS" label="执行科室" width="150" align="left" :show-overflow-tooltip="true" />
                                        <el-table-column prop="BBBW" label="标本" align="left" width="130">
                                            <template #default="{ row }">
                                                <el-select
                                                    v-model="row.BBBW"
                                                    clearable
                                                    style="width: 100%"
                                                    placeholder=""
                                                    @change="xzselectChange(row)"
                                                >
                                                    <el-option v-for="opt in state.bbbwArr" :key="opt.BM" :label="opt.MC" :value="opt.BM">
                                                    </el-option>
                                                </el-select>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="JJ" label="加急" align="left" width="70" :show-overflow-tooltip="true">
                                            <template #default="{ row }">
                                                <el-switch v-model="row.JJ"></el-switch>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="BZ" label="备注" align="left" width="150" :show-overflow-tooltip="true">
                                            <template #default="{ row }">
                                                <el-input v-model="row.BZ" type="string" style="width: 100%" class="BZ"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="JE" label="金额(元)" align="left" width="120" :show-overflow-tooltip="true" />
                                    </el-table>
                                </template>
                            </el-table-column>
                            <el-table-column prop="XMMC" label="项目名称" align="left">
                                <template #default="scope">
                                    <div class="title-xmmc">{{ scope.row.XMMC }}</div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="ZXKS" label="执行科室" align="left" width="150"></el-table-column>
                            <el-table-column prop="BBBW" label="标本" align="left" width="130"> </el-table-column>
                            <el-table-column prop="JJ" label="加急" align="left" width="70"> </el-table-column>
                            <el-table-column prop="BZ" label="备注" align="left" width="150"> </el-table-column>
                            <el-table-column prop="JE" label="金额(元)" align="left" width="120"> </el-table-column>
                        </el-table>
                        <div class="summary">小计：259.41元</div>
                    </div>
                    <div class="empty" v-else>
                        <div class="empty-img"></div>
                    </div>
                </el-form>
            </div>
            <template #footer>
                <div class="yd-from-footer">
                    <el-button v-blur @click="submitForm(formRef)" type="primary" class="btn-form-save">保存</el-button>
                    <el-button @click="cancel" class="btn-form-cancel">取消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { type FormInstance, type FormItemRule } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
const checked = ref(false)
const formRef = ref<FormInstance>()
const props = defineProps(['jysqData'])
const defaultProps = {
    children: 'children',
    label: 'MC',
}

const form = reactive({
    XMMC: '', //项目名称
    JYBS: '', //简要病史
    SQMD: '', //申请目的
})
const state: {
    show: boolean
    XMFL: any
    jysqData: any
    bbbwArr: any
    xzjysqData: any
    allFLMXData: any
    allJYXMXZData: any
    czlx: any
} = reactive({
    show: false,
    bbbwArr: [
        { BM: '01', MC: '血液' },
        { BM: '02', MC: '手指血' },
        { BM: '03', MC: '静脉血' },
        { BM: '21', MC: '化学发光顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶' },
    ],
    XMFL: [],
    jysqData: [],
    xzjysqData: [],
    allFLMXData: [],
    allJYXMXZData: [],
    czlx: '',
})

const rules: Partial<Record<string, FormItemRule[]>> = reactive({})

const submitForm = async (formEl: FormInstance | undefined) => {
    // 借鉴的成员
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
        } else {
            console.log('error submit!', fields)
        }
    })
}

function handleRowClick(row: any) {
    // 当行被点击时，清空state.jysqData
    state.jysqData = []
    // 当行被点击时，清空state.xzjysqData
    state.xzjysqData = []
    // 创建一个空数组来存储整合后的数据
    const integratedData: any = []
    // 遍历props.jysqData，提取每个项目的FLMX数据
    props.jysqData.forEach((item: any) => {
        // 确保FLMX存在且是一个数组
        if (item.FLMX && Array.isArray(item.FLMX)) {
            // 遍历FLMX数组，提取每个条目的JYXMXZ字段
            // 将FLMX数组的内容添加到allFLMXData数组中
            state.allFLMXData.push(...item.FLMX)
            item.FLMX.forEach((flmxItem: any) => {
                if (flmxItem.CZLX === row.BM) {
                    // 进一步检查JYXMXZ是否存在且长度是否大于0
                    if (flmxItem.JYXMXZ && flmxItem.JYXMXZ.length > 0) {
                        // 遍历JYXMXZ数组，从中提取数据
                        flmxItem.JYXMXZ.forEach((jyxmxzItem: any) => {
                            const identifier = item.XMFL + '_' + (state.jysqData.length + 1)

                            // 在这里构建一个新的对象，包含从FLMX和JYXMXZ中提取的字段
                            const dataItem = {
                                ID: identifier,
                                XZ: false,
                                MC: item.XMFL,
                                BBBW: flmxItem.BBBW,
                                JJ: false,
                                BZ: '',
                                // 从JYXMXZ对象中提取的字段
                                XMMC: jyxmxzItem.XMMC ? jyxmxzItem.XMMC : null,
                                JG: jyxmxzItem.JG ? jyxmxzItem.JG : null,
                            }

                            // 将整合后的对象添加到数组中
                            integratedData.push(dataItem)
                            state.jysqData = integratedData
                        })
                    } else {
                        const identifier = item.XMFL + '_' + (state.jysqData.length + 1)
                        const dataItem = {
                            ID: identifier,
                            XZ: false,
                            MC: item.XMFL,
                            BBBW: flmxItem.BBBW,
                            JJ: false,
                            BZ: '',
                            // 从JYXMXZ对象中提取的字段
                            XMMC: '',
                            JG: '',
                        }

                        // 将整合后的对象添加到数组中
                        integratedData.push(dataItem)
                        state.jysqData = integratedData
                    }
                }
            })
        }
    })
}

const syncData = (rowData: any) => {
    // const identifier = rowData.MC + '_' + rowData.ID

    if (rowData.XZ) {
        const existingItemIndex = state.xzjysqData.findIndex((item: any) => item.XMMC === rowData.MC)
        if (existingItemIndex !== -1) {
            // 如果在相同的 MC 下存在的数据，则添加新数据
            state.xzjysqData[existingItemIndex].XM.push({
                ID: rowData.ID,
                XMMC: rowData.XMMC,
                BBBW: rowData.BBBW,
                JJ: rowData.JJ,
                BZ: rowData.BZ,
                JE: rowData.JG,
            })
        } else {
            state.xzjysqData.push({
                XMMC: rowData.MC,
                XM: [
                    {
                        ID: rowData.ID,
                        XMMC: rowData.XMMC,
                        BBBW: rowData.BBBW,
                        JJ: rowData.JJ,
                        BZ: rowData.BZ,
                        JE: rowData.JG,
                    },
                ],
            })
        }
    } else {
        const indexToRemove = state.xzjysqData.findIndex((item: any) => item.XMMC === rowData.MC)
        if (indexToRemove !== -1) {
            const bbbwIndexToRemove = state.xzjysqData[indexToRemove].XM.findIndex((item: any) => item.BBBW === rowData.BBBW)
            if (bbbwIndexToRemove !== -1) {
                // 如果在相同的 MC 和 BBBW 下存在数据，则删除该数据
                state.xzjysqData[indexToRemove].XM.splice(bbbwIndexToRemove, 1)
                if (state.xzjysqData[indexToRemove].XM.length === 0) {
                    state.xzjysqData.splice(indexToRemove, 1)
                }
            }
        }
    }
}

const boxChange = (row: any) => {
    syncData(row) // 调用 syncData 方法并传入行数据
}

const selectChange = (row: any) => {
    // console.log(row.ID)

    // 每个项目都有一个唯一的id字段
    const rowId = row.ID // 获取当前变更行的id
    // 更新state.jysqData中对应项的BBBW值
    state.jysqData.forEach((item: any) => {
        if (item.ID === rowId) {
            item.BBBW = row.BBBW
        }
    })
    // 遍历state.xzjysqData来更新对应项的BBBW值
    state.xzjysqData.forEach((group: any) => {
        group.XM.forEach((item: any) => {
            if (item.ID === rowId) {
                item.BBBW = row.BBBW // 更新BBBW值
            }
        })
    })
}

const xzselectChange = (row: any) => {
    state.xzjysqData.forEach((xzItem: any) => {
        xzItem.XM.forEach((xmItem: any) => {
            let jysqItem = state.jysqData.find((jItem: any) => jItem.ID === row.ID)
            if (jysqItem) {
                // 找到匹配的条目，更新 BBBW
                jysqItem.BBBW = row.BBBW
            }
        })
    })
}
const cancel = () => {
    state.show = false
}

const show = () => {
    const xmflMap = new Map()
    props.jysqData.forEach((item: any) => {
        // 将每个项目的分类编码（XMFLBM）和分类名称（分类）添加到Map中
        // 这样可以确保即使有重复的分类名称，也只会存储唯一的BM到MC的映射
        xmflMap.set(item.XMFLBM, item.XMFL)
    })

    // 将Map转换为所需的数组格式，用于更新state.XMFL
    state.XMFL = Array.from(xmflMap).map(([XMFLBM, XMFL]) => ({
        BM: XMFLBM, // 直接使用XMFLBM作为BM
        MC: XMFL,
    }))
    // 当弹窗打开时，清空state.jysqData
    state.jysqData = []
    // 当弹窗打开时，清空state.xzjysqData
    state.xzjysqData = []
    state.show = true
}

onMounted(() => {})

defineExpose({
    show,
})
</script>
<style scoped lang="scss">
:deep(.el-dialog__body) {
    height: 750px;
}

:deep(.el-select-tags-wrapper .el-tag) {
    color: #333;
}

:deep(.table1 .el-scrollbar__bar) {
    bottom: -10px;
}

:deep(.ba-data-table.el-table .el-table__cell) {
    padding: 3px 0;
}

.XMMC {
    margin-left: -26px;
    margin-top: 20px;
}

.container {
    display: flex;
}

.menu {
    height: 300px;
    width: 320px;

    /* 设置菜单宽度 */
    :deep(.el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf) {
        border-bottom: none;
    }
}

.color-table {
    height: 300px;
    flex: 1;
    /* 表格宽度自适应 */
    border: solid 1px #ebebeb;
}

.vertical-line {
    border-right: 1px solid #eeeeee;
    /* 设置竖线的样式 */
    height: 300px;
    /* 设置竖线的高度，与父容器高度相同 */
    margin-left: 10px;
    /* 设置竖线与左侧内容的间距 */
    margin-right: 20px;
    /* 设置竖线与右侧内容的间距 */
}

.table {
    margin-top: 20px;
}

.jysq-box {
    margin-top: 10px;

    .title-xmmc {
        color: #000;
        font-weight: 600;
    }

    :deep(.ba-data-table.el-table .el-table__expanded-cell) {
        padding: 0;
    }

    :deep(.el-table__expand-icon) {
        display: none;
    }

    .summary {
        padding: 10px 5px;
        font-weight: 600;
        text-align: right;
    }
}

:deep(.table1 .el-table__empty-text) {
    display: none;
}

:deep(.table1 .el-table__empty-block) {
    display: none;
}

.ba-data-table {
    /* 设置表格容器的宽度 */
    width: 100%;
}

.empty {
    margin-left: -20px;
    margin-top: 20px;
    height: 290px;
    width: 1071px;
    background: #f8f8f8;

    .empty-img {
        position: absolute;
        margin-top: 40px;
        margin-left: 440px;
        height: 200px;
        width: 200px;
        background: url(/@/assets/images/empty-2.png) no-repeat center center/cover;
    }

    .empty-img::after {
        content: '暂无内容';
        position: absolute;
        bottom: -1px;
        left: 65px;
        padding: 8px;
        color: #afafaf;
        font-size: 14px;
    }
}
</style>
