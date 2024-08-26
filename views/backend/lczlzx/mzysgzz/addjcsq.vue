<template>
    <div>
        <el-dialog
            class="ba-operate-dialog"
            :close-on-click-modal="false"
            :model-value="state.show"
            @close="cancel"
            :destroy-on-close="true"
            align-center
            id="ddbczxks-dialog"
            width="1071px"
        >
            <template #header>
                <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']">
                    {{ '新增检查申请' }}
                </div>
            </template>
            <div class="jcsq-box">
                <el-form ref="formRef" :model="form" label-position="right" label-width="100px" :rules="rules">
                    <el-form-item prop="XMMC" label="项目名称:" class="XMMC">
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
                            :data="state.jcsqData"
                            ref="tableref"
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
                            <el-table-column prop="XMMC" label="项目名称" align="left" width="150">
                                <template #default="{ row }">
                                    <span>{{ row.XMMC }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="JCFF" label="检查方法" align="left" width="230">
                                <template #default="scope">
                                    <el-select
                                        v-model="scope.row.JCFF"
                                        clearable
                                        style="width: 100%"
                                        multiple
                                        placeholder=""
                                        @change="selectChange(scope.row)"
                                    >
                                        <el-option v-for="opt in state.jcffArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"> </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="JJ" label="加急" align="left" width="70">
                                <template #default="scope">
                                    <el-switch v-model="scope.row.JJ"></el-switch>
                                </template>
                            </el-table-column>
                            <el-table-column prop="BZ" label="备注" align="left" width="150">
                                <template #default="scope">
                                    <el-input v-model="scope.row.BZ" type="string" style="width: 100%" class="BZ"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="JE" label="金额(元)" align="left" width="120">
                                <template #default="{ row }">
                                    <span>{{ row.JE }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div v-if="state.isempty" style="margin-top: 10px">
                        <div class="jcsq-box">
                            <el-scrollbar max-height="290px">
                                <el-table
                                    class="ba-data-table w100"
                                    header-cell-class-name="table-header-cell"
                                    :data="state.xzjcsqData"
                                    :default-expand-all="true"
                                >
                                    <el-table-column label="NO" type="expand" width="50">
                                        <template #default="scope">
                                            <el-table
                                                class="ba-data-table w100"
                                                header-cell-class-name="table-header-cell"
                                                :data="scope.row.XM"
                                                :show-header="false"
                                            >
                                                <el-table-column label="NO" type="index" width="50" align="center" />
                                                <el-table-column prop="YZNR" label="医嘱内容" width="200" :show-overflow-tooltip="true" />
                                                <el-table-column prop="ZXKS" label="执行科室" width="120" :show-overflow-tooltip="true">
                                                    <template #default="{ row }">
                                                        <div>{{ row.ZXKS }}</div>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column prop="JCBW" label="检查部位" align="left" width="90">
                                                    <template #default="{ row }">
                                                        <span>{{ row.JCBW }}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column prop="JCFF" label="检查方法" align="left" width="240">
                                                    <template #default="{ row }">
                                                        <el-select
                                                            v-model="row.JCFF"
                                                            clearable
                                                            style="width: 100%"
                                                            multiple
                                                            placeholder=""
                                                            @change="xzselectChange(row)"
                                                        >
                                                            <el-option v-for="opt in state.jcffArr" :key="opt.BM" :label="opt.MC" :value="opt.BM">
                                                            </el-option>
                                                        </el-select>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column prop="JJ" label="加急" width="80" :show-overflow-tooltip="true">
                                                    <template #default="{ row }"> <el-switch v-model="row.JJ"></el-switch> </template>
                                                </el-table-column>
                                                <el-table-column prop="BZ" label="备注" align="left" width="150">
                                                    <template #default="{ row }">
                                                        <el-input v-model="row.BZ"></el-input>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column prop="JE" label="金额(元)" width="150" :show-overflow-tooltip="true">
                                                    <template #default="{ row }">
                                                        <span>{{ row.JE }}</span>
                                                    </template></el-table-column
                                                >
                                                >
                                            </el-table>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="XMMC" label="医嘱内容" width="200" :show-overflow-tooltip="true">
                                        <template #default="scope">
                                            <div class="title-xmmc">{{ scope.row.MC }}</div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="ZXKS" label="执行科室" width="120" :show-overflow-tooltip="true"> </el-table-column>
                                    <el-table-column prop="JCBW" label="检查部位" align="left" width="90"> </el-table-column>
                                    <el-table-column prop="JCFF" label="检查方法" align="left" width="240"> </el-table-column>
                                    <el-table-column prop="JJ" label="加急" width="80" :show-overflow-tooltip="true"> </el-table-column>
                                    <el-table-column prop="BZ" label="备注" align="left" width="150"> </el-table-column>
                                    <el-table-column prop="JE" label="金额(元)" width="150" :show-overflow-tooltip="true"> </el-table-column>
                                </el-table>
                            </el-scrollbar>
                            <div style="margin-top: 10px">
                                <el-row :gutter="0">
                                    <el-col :xs="12" :sm="6" style="margin-left: -30px">
                                        <el-form-item prop="JYBS" label="简要病史:">
                                            <el-input v-model="form.JYBS" type="string" style="width: 200px"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="12" :sm="5">
                                        <el-form-item prop="SQMD" label="申请目的:">
                                            <el-input v-model="form.SQMD" type="string" style="width: 100px"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="12" :sm="1" style="margin-left: -50px">
                                        <el-form-item>
                                            <el-checkbox v-model="checked"></el-checkbox>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="12" :sm="8" style="margin-left: -5px">
                                        <el-form-item>
                                            <span>使用过洋地黄和其他特殊药物</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="12" :sm="4" style="margin-left: -10px">
                                        <el-form-item>
                                            <span>小计:</span>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
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
import { ref, reactive, watch, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormItemRule } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
const checked = ref(false)
const formRef = ref<FormInstance>()
const props = defineProps(['jcsqData'])
const defaultProps = {
    children: 'children',
    label: 'label',
}

const form = reactive({
    XMMC: '', //项目名称
    JYBS: '', //简要病史
    SQMD: '', //申请目的
})
const state: {
    show: boolean
    XMFL: any
    jcsqData: any
    jcffArr: any
    xzjcsqData: any
    isempty: any
    allFLMXData: any
} = reactive({
    show: false,
    jcffArr: [
        { BM: 1, MC: '常规' },
        { BM: 2, MC: '增强' },
        { BM: 3, MC: '参考文字参考文字' },
        { BM: 4, MC: '参考文字' },
    ],
    XMFL: [],
    jcsqData: [],
    xzjcsqData: [],
    isempty: true,
    allFLMXData: [],
})

const handleRowClick = (row: any) => {
    // 当行被点击时，清空state.jcsqData
    state.jcsqData = []
    // 当行被点击时，清空state.xzjcsqData
    state.xzjcsqData = []
    // 创建一个空数组来存储整合后的数据
    const integratedData: any = []
    // 遍历props.jcsqData，提取每个项目的FLMX数据
    props.jcsqData.forEach((item: any) => {
        // 确保FLMX存在且是一个数组
        if (item.FLMX && Array.isArray(item.FLMX)) {
            // 遍历FLMX数组，提取每个条目的JCXMXZ字段
            // 将FLMX数组的内容添加到allFLMXData数组中
            state.allFLMXData.push(...item.FLMX)
            item.FLMX.forEach((flmxItem: any) => {
                if (flmxItem.CZLX === row.BM) {
                    // 进一步检查JCXMXZ是否存在且长度是否大于0
                    if (flmxItem.JCXMXZ && flmxItem.JCXMXZ.length > 0) {
                        // 遍历JCXMXZ数组，从中提取数据
                        flmxItem.JCXMXZ.forEach((jcxmxzItem: any) => {
                            if (jcxmxzItem.JCFF.length > 0) {
                                jcxmxzItem.JCFF.forEach((jcffItem: any) => {
                                    const identifier = flmxItem.XMMC + '_' + (state.jcsqData.length + 1)
                                    const dataItem = {
                                        ID: identifier,
                                        XZ: false,
                                        MC: flmxItem.XMMC,
                                        XMMC: jcxmxzItem.BWMC,
                                        JJ: false,
                                        BZ: '',
                                        // 从JCXMXZ对象中提取的字段
                                        JCFF: jcffItem.JCFFMC ? jcffItem.JCFFMC : '',
                                        JE: jcffItem.JG,
                                    }

                                    // 将整合后的对象添加到数组中
                                    integratedData.push(dataItem)
                                    state.jcsqData = integratedData
                                })
                            } else {
                                const identifier = flmxItem.XMMC + '_' + (state.jcsqData.length + 1)
                                const dataItem = {
                                    ID: identifier,
                                    XZ: false,
                                    MC: flmxItem.XMMC,
                                    XMMC: jcxmxzItem.BWMC,
                                    JJ: false,
                                    BZ: '',
                                    // 从JCXMXZ对象中提取的字段
                                    JCFF: '',
                                    JE: '',
                                }

                                // 将整合后的对象添加到数组中
                                integratedData.push(dataItem)
                                state.jcsqData = integratedData
                            }
                        })
                    }
                }
            })
        }
    })
}

const syncData = (rowData: any) => {
    if (rowData.XZ) {
        const existingItemIndex = state.xzjcsqData.findIndex((item: any) => item.MC === rowData.MC)
        if (existingItemIndex !== -1) {
            const existingJCFFItemIndex = state.xzjcsqData[existingItemIndex].XM.findIndex((item: any) => item.JCFF === rowData.JCFF)
            if (existingJCFFItemIndex !== -1) {
                state.xzjcsqData[existingItemIndex].XM[existingJCFFItemIndex].push({
                    ID: rowData.ID,
                    YZNR: '',
                    ZXKS: '',
                    JCBW: rowData.XMMC,
                    JCFF: rowData.JCFF,
                    JJ: false,
                    BZ: '',
                    JE: rowData.JE,
                })
            } else {
                state.xzjcsqData[existingItemIndex].XM.push({
                    ID: rowData.ID,
                    YZNR: '',
                    ZXKS: '',
                    JCBW: rowData.XMMC,
                    JCFF: rowData.JCFF,
                    JJ: false,
                    BZ: '',
                    JE: rowData.JE,
                })
            }
        } else {
            state.xzjcsqData.push({
                MC: rowData.MC,
                XM: [
                    {
                        ID: rowData.ID,
                        YZNR: '',
                        ZXKS: '',
                        JCBW: rowData.XMMC,
                        JCFF: rowData.JCFF,
                        JJ: false,
                        BZ: '',
                        JE: rowData.JE,
                    },
                ],
            })
        }
    } else {
        const indexToRemove = state.xzjcsqData.findIndex((item: any) => item.MC === rowData.MC)
        if (indexToRemove !== -1) {
            state.xzjcsqData[indexToRemove].XM = state.xzjcsqData[indexToRemove].XM.filter((item: any) => item.ID !== rowData.ID)
            if (state.xzjcsqData[indexToRemove].XM.length === 0) {
                state.xzjcsqData.splice(indexToRemove, 1)
            }
        }
    }
}

const boxChange = (row: any) => {
    // console.log(row)
    syncData(row) // 调用 syncData 方法并传入行数据
}

const selectChange = (row: any) => {
    // 每个项目都有一个唯一的id字段
    const rowId = row.ID // 获取当前变更行的id
    // 更新state.jcsqData中对应项的JCFFMC值
    state.jcsqData.forEach((item: any) => {
        if (item.ID === rowId) {
            item.JCFF = row.JCFF
        }
    })
    // 遍历state.xzjcsqData来更新对应项的JCFF值
    state.xzjcsqData.forEach((group: any) => {
        group.XM.forEach((item: any) => {
            if (item.ID === rowId) {
                // console.log(item)
                item.JCFF = row.JCFF // 更新JCFF值
            }
        })
    })
}

const xzselectChange = (row: any) => {
    state.xzjcsqData.forEach((xzItem: any) => {
        xzItem.XM.forEach((xmItem: any) => {
            let jcsqItem = state.jcsqData.find((jItem: any) => jItem.ID === row.ID)
            if (jcsqItem) {
                // 找到匹配的条目，更新 JCFF
                jcsqItem.JCFF = row.JCFF
            }
        })
    })
}

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
const cancel = () => {
    state.show = false
}

const show = () => {
    const xmflMap = new Map()
    props.jcsqData.forEach((item: any) => {
        // 将每个项目的分类编码（XMFLBM）和分类名称（分类）添加到Map中
        // 这样可以确保即使有重复的分类名称，也只会存储唯一的BM到MC的映射
        xmflMap.set(item.XMFLBM, item.XMFL)
    })

    // 将Map转换为所需的数组格式，用于更新state.XMFL
    state.XMFL = Array.from(xmflMap).map(([XMFLBM, XMFL]) => ({
        BM: XMFLBM, // 直接使用XMFLBM作为BM
        MC: XMFL,
    }))
    // 当弹窗打开时，清空state.jcsqData
    state.jcsqData = []
    // 当弹窗打开时，清空state.xzjcsqData
    state.xzjcsqData = []
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
    flex: 1; /* 表格宽度自适应 */
    border: solid 1px #ebebeb;
}
.vertical-line {
    border-right: 1px solid #eeeeee; /* 设置竖线的样式 */
    height: 300px; /* 设置竖线的高度，与父容器高度相同 */
    margin-left: 10px; /* 设置竖线与左侧内容的间距 */
    margin-right: 20px; /* 设置竖线与右侧内容的间距 */
}
.table {
    margin-top: 20px;
}
.jcsq-box {
    margin-top: 1px;
    height: 270px;
    .title-xmmc {
        color: #000;
        font-weight: 600;
    }
    :deep(.el-table__expanded-cell) {
        padding: 0;
    }
    :deep(.el-table__expand-icon) {
        display: none;
    }
    .jcsqd-item .title {
        color: black;
        padding: 5px 0;
        font-weight: 600;
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
