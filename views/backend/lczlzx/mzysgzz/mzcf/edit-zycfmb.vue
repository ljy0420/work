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
            width="1271px"
        >
            <template #header>
                <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']">
                    {{ '中药处方模板1' }}
                </div>
            </template>
            <div class="top">
                <el-form :model="form" :inline="true" label-width="100px" :rules="rules" ref="ruleFormRef">
                    <el-row :gutter="0" v-if="state.cfInfo.isEdit">
                        <el-col :xs="12" :sm="12">
                            <el-form-item prop="MBMC" label="模板名称:">
                                <el-input v-model="form.MBMC" type="string" placeholder="请输入模板名称" />
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12">
                            <el-form-item prop="MBGS" label="模板归属:">
                                <el-radio-group v-model="checked">
                                    <el-radio v-model="form.MBGS" :label="1">个人模板</el-radio>
                                    <el-radio v-model="form.MBGS" :label="2">科室模板</el-radio>
                                    <el-radio v-model="form.MBGS" :label="3">全院模板</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="0" v-else>
                        <el-col :xs="12" :sm="12">
                            <el-form-item prop="MBMC" label="模板名称:">
                                <span>中药处方模板1</span>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12">
                            <el-form-item prop="MBGS" label="模板归属:">
                                <span>个人模板</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <el-divider class="divider" />
            <div>
                <el-scrollbar max-height="600px">
                    <span class="bz" v-if="state.cfInfo.isEdit"
                        >*除中药处方外，同一处方内最多存在5条记录，仅支持同一处方内设置成组。F6：打开药品名称，F2：医嘱保存。</span
                    >
                    <div class="cf-header">
                        <div class="cf-title">{{ '处方1：中药处方_639180' }}</div>
                        <div class="cf-action">
                            <div class="action-group" v-if="state.cfInfo.isExpand">
                                <el-button type="text" plain @click="onCopy" v-if="state.cfInfo.isEdit">
                                    <Icon name="local-copy" color="#59a7ff" />
                                    <span class="operate-text">复制</span>
                                </el-button>
                                <el-button type="text" :disabled="!state.cfInfo.isCopied" plain @click="onPaste" v-if="state.cfInfo.isEdit">
                                    <Icon name="local-paste" color="#59a7ff" />
                                    <span class="operate-text">粘贴</span>
                                </el-button>
                            </div>

                            <el-button type="text" plain @click="exChange">
                                <Icon name="local-expand1" :class="state.cfInfo.isExpand ? 'expand-icon' : ''" color="#59a7ff" />
                                <span class="operate-text">{{ state.cfInfo.isExpand ? '收起' : '展开' }}</span>
                            </el-button>
                        </div>
                    </div>
                    <div class="cf-items" v-show="state.cfInfo.isExpand">
                        <el-table ref="cfRef" :data="state.csData" highlight-current-row style="width: 100%">
                            <el-table-column prop="YZMC" label="药品名称" width="230">
                                <template #default="scope">
                                    <el-input
                                        v-model="scope.row.YPMC"
                                        type="string"
                                        placeholder="请输入药品名称"
                                        style="width: 100%"
                                        v-if="state.cfInfo.isEdit"
                                    ></el-input>
                                    <span v-else>{{ scope.row.YPMC }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="SL" label="脚注" width="100">
                                <template #default="scope">
                                    <el-input
                                        v-model="scope.row.SL"
                                        type="string"
                                        placeholder="请输入脚注"
                                        style="width: 100%"
                                        v-if="state.cfInfo.isEdit"
                                    ></el-input>
                                    <span v-else>{{ scope.row.SL }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="DW" label="用量" width="100">
                                <template #default="scope">
                                    <el-input
                                        v-model="scope.row.DW"
                                        type="string"
                                        placeholder="请输入用量"
                                        style="width: 100%"
                                        v-if="state.cfInfo.isEdit"
                                    ></el-input>
                                    <span v-else>{{ scope.row.DW }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="PC" label="单位" width="80">
                                <template #default="scope">
                                    <el-input
                                        v-model="scope.row.PC"
                                        type="string"
                                        placeholder="请输入单位"
                                        style="width: 100%"
                                        v-if="state.cfInfo.isEdit"
                                    ></el-input>
                                    <span v-else>{{ scope.row.PC }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column width="60" fixed="right" align="center" v-if="state.cfInfo.isEdit">
                                <template #default="scope">
                                    <el-button link v-blur type="primary" size="small" @click="addRow1">
                                        <Icon name="local-create" style="color: #59a7ff" class="local-icon" />
                                    </el-button>
                                    <el-popconfirm title="您确定删除这条记录吗?" @confirm="deleteRow1(scope.$index)" width="200">
                                        <template #reference>
                                            <el-button link v-blur type="primary" size="small" style="margin-left: 3px">
                                                <Icon name="local-delete" style="color: #808080" class="local-icon" />
                                            </el-button>
                                        </template>
                                    </el-popconfirm>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-form :model="form" :inline="true" label-width="100px" :rules="rules" ref="ruleFormRef">
                            <el-row :gutter="0" class="bottom" v-if="state.cfInfo.isEdit">
                                <el-col :xs="12" :sm="6">
                                    <el-form-item prop="JF" label="煎法:">
                                        <el-select
                                            filterable
                                            v-model="form.JF"
                                            placeholder="请选择煎法"
                                            :disabled="!state.cfInfo.isEdit"
                                            clearable
                                            style="width: 100%"
                                        >
                                            <el-option v-for="opt in state.jfArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="6">
                                    <el-form-item prop="SL" label="水量:">
                                        <el-select
                                            filterable
                                            v-model="form.SL"
                                            placeholder="请选择水量"
                                            :disabled="!state.cfInfo.isEdit"
                                            clearable
                                            style="width: 100%"
                                        >
                                            <el-option v-for="opt in state.slArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="6">
                                    <el-form-item prop="PL" label="频率:">
                                        <el-select
                                            filterable
                                            v-model="form.PL"
                                            placeholder="请选择频率"
                                            :disabled="!state.cfInfo.isEdit"
                                            clearable
                                            style="width: 100%"
                                        >
                                            <el-option v-for="opt in state.plArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="6">
                                    <el-form-item prop="JS" label="剂数:">
                                        <el-input v-model="form.JS" type="string" :disabled="!state.cfInfo.isEdit" placeholder="请输入剂数" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="0" class="bottom" v-else>
                                <el-col :xs="12" :sm="6">
                                    <el-form-item prop="JF" label="煎法:">
                                        <span>温水煎服</span>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="6">
                                    <el-form-item prop="SL" label="水量:">
                                        <span>每次150ml</span>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="6">
                                    <el-form-item prop="PL" label="频率:">
                                        <span>三日一剂</span>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="6">
                                    <el-form-item prop="JS" label="剂数:">
                                        <span>10</span>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                        <el-divider class="divider" />
                        <div class="summary">
                            <span class="zje">总金额：16,,084.75元</span>
                            <span class="xj">小计：91.75元</span>
                        </div>
                    </div>
                    <div class="cf-header">
                        <div class="cf-title">{{ '处方2：中药处方_639181' }}</div>
                        <div class="cf-action">
                            <div class="action-group" v-if="state.cfInfo.isExpand">
                                <el-button type="text" plain @click="onCopy" v-if="state.cfInfo.isEdit">
                                    <Icon name="local-copy" color="#59a7ff" />
                                    <span class="operate-text">复制</span>
                                </el-button>
                                <el-button type="text" :disabled="!state.cfInfo.isCopied" plain @click="onPaste" v-if="state.cfInfo.isEdit">
                                    <Icon name="local-paste" color="#59a7ff" />
                                    <span class="operate-text">粘贴</span>
                                </el-button>
                            </div>

                            <el-button type="text" plain @click="exChange">
                                <Icon name="local-expand1" :class="state.cfInfo.isExpand ? 'expand-icon' : ''" color="#59a7ff" />
                                <span class="operate-text">{{ state.cfInfo.isExpand ? '收起' : '展开' }}</span>
                            </el-button>
                        </div>
                    </div>
                    <div class="cf-items" v-show="state.cfInfo.isExpand">
                        <div class="cf-items" v-show="state.cfInfo.isExpand">
                            <el-table ref="cfRef" :data="state.csData1" highlight-current-row style="width: 100%">
                                <el-table-column prop="YZMC" label="药品名称" width="230">
                                    <template #default="scope">
                                        <el-input
                                            v-model="scope.row.YPMC"
                                            type="string"
                                            placeholder="请输入药品名称"
                                            style="width: 100%"
                                            v-if="state.cfInfo.isEdit"
                                        ></el-input>
                                        <span v-else>{{ scope.row.YPMC }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="SL" label="脚注" width="100">
                                    <template #default="scope">
                                        <el-input
                                            v-model="scope.row.SL"
                                            type="string"
                                            placeholder="请输入脚注"
                                            style="width: 100%"
                                            v-if="state.cfInfo.isEdit"
                                        ></el-input>
                                        <span v-else>{{ scope.row.SL }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="DW" label="用量" width="100">
                                    <template #default="scope">
                                        <el-input
                                            v-model="scope.row.DW"
                                            type="string"
                                            placeholder="请输入用量"
                                            style="width: 100%"
                                            v-if="state.cfInfo.isEdit"
                                        ></el-input>
                                        <span v-else>{{ scope.row.DW }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="PC" label="单位" width="80">
                                    <template #default="scope">
                                        <el-input
                                            v-model="scope.row.PC"
                                            type="string"
                                            placeholder="请输入单位"
                                            style="width: 100%"
                                            v-if="state.cfInfo.isEdit"
                                        ></el-input>
                                        <span v-else>{{ scope.row.PC }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column width="60" fixed="right" align="center" v-if="state.cfInfo.isEdit">
                                    <template #default="scope">
                                        <el-button link v-blur type="primary" size="small" @click="addRow2">
                                            <Icon name="local-create" style="color: #59a7ff" class="local-icon" />
                                        </el-button>
                                        <el-popconfirm title="您确定删除这条记录吗?" @confirm="deleteRow2(scope.$index)" width="200">
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
                        <el-form :model="form" :inline="true" label-width="100px" :rules="rules" ref="ruleFormRef">
                            <el-row :gutter="0" class="bottom" v-if="state.cfInfo.isEdit">
                                <el-col :xs="12" :sm="6">
                                    <el-form-item prop="JF" label="煎法:">
                                        <el-select
                                            filterable
                                            v-model="form.JF"
                                            placeholder="请选择煎法"
                                            :disabled="!state.cfInfo.isEdit"
                                            clearable
                                            style="width: 100%"
                                        >
                                            <el-option v-for="opt in state.jfArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="6">
                                    <el-form-item prop="SL" label="水量:">
                                        <el-select
                                            filterable
                                            v-model="form.SL"
                                            placeholder="请选择水量"
                                            :disabled="!state.cfInfo.isEdit"
                                            clearable
                                            style="width: 100%"
                                        >
                                            <el-option v-for="opt in state.slArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="6">
                                    <el-form-item prop="PL" label="频率:">
                                        <el-select
                                            filterable
                                            v-model="form.PL"
                                            placeholder="请选择频率"
                                            :disabled="!state.cfInfo.isEdit"
                                            clearable
                                            style="width: 100%"
                                        >
                                            <el-option v-for="opt in state.plArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="6">
                                    <el-form-item prop="JS" label="剂数:">
                                        <el-input v-model="form.JS" type="string" :disabled="!state.cfInfo.isEdit" placeholder="请输入剂数" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="0" class="bottom" v-else>
                                <el-col :xs="12" :sm="6">
                                    <el-form-item prop="JF" label="煎法:">
                                        <span>温水煎服</span>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="6">
                                    <el-form-item prop="SL" label="水量:">
                                        <span>每次150ml</span>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="6">
                                    <el-form-item prop="PL" label="频率:">
                                        <span>三日一剂</span>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="6">
                                    <el-form-item prop="JS" label="剂数:">
                                        <span>10</span>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                        <el-divider class="divider" />
                        <div class="summary">
                            <span class="zje">总金额：16,,084.75元</span>
                            <span class="xj">小计：91.75元</span>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
            <template #footer>
                <div class="yd-from-footer" v-if="state.cfInfo.isEdit">
                    <el-button type="primary">保存</el-button>
                    <el-button @click="cancel">取消</el-button>
                </div>
                <div class="yd-from-footer" v-else>
                    <el-button type="primary">调用</el-button>
                    <el-button @click="editChange">编辑</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormItemRule } from 'element-plus'
import { uuid } from '/@/utils/random'
const formRef = ref<FormInstance>()
const checked = ref(1)

const emit = defineEmits(['dataChange', 'delete', 'cflx'])

const props = defineProps({
    cfinfo: {
        type: Object,
        default: () => {
            return {
                bm: uuid(),
                title: '中药处方',
                cflx: 2,
                isEdit: false,
                isExpand: true,
                items: [{}],
            }
        },
    },
})
const form = reactive({
    MBMC: '',
    MBGS: '',
    JF: '',
    SL: '',
    PL: '',
    JS: '',
})
const state: {
    show: any
    cfInfo: any
    psArr: any
    jfArr: any
    slArr: any
    plArr: any
    csData: any
    csData1: any
} = reactive({
    show: false,
    cfInfo: props.cfinfo,
    psArr: [
        { BM: 1, MC: '是' },
        { BM: 0, MC: '否' },
    ],
    jfArr: [{ BM: 1, MC: '温水煎服' }],
    slArr: [{ BM: 1, MC: '每次150ml' }],
    plArr: [{ BM: 1, MC: '三日一剂' }],
    csData: [
        {
            YPMC: '白花蛇舌草（精品）',
            SL: '参考文字',
            DW: '10',
            PC: '次',
        },
        {
            YPMC: '当归（精品）',
            SL: '参考文字',
            DW: '10',
            PC: '次',
        },
        {
            YPMC: '川穹',
            SL: '参考文字',
            DW: '10',
            PC: '次',
        },
        {
            YPMC: '驴胶',
            SL: '参考文字',
            DW: '10',
            PC: '次',
        },
    ],
    csData1: [
        {
            YPMC: '白花蛇舌草（精品）',
            SL: '参考文字',
            DW: '10',
            PC: '次',
        },
    ],
})

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

const exChange = () => {
    state.cfInfo.isExpand = !state.cfInfo.isExpand
}

const table = reactive({
    selection: [],
})

const onSelectionChange = (selection: any) => {
    table.selection = selection
}

const addRow = () => {
    state.cfInfo.items.push({})
}

const addRow1 = () => {
    state.csData.push({})
}
const addRow2 = () => {
    state.csData1.push({})
}
const deleteRow = (index: any) => {
    if (state.cfInfo.items.length === 1) {
        state.cfInfo.items[0] = {}
        emit('delete', state.cfInfo.bm)
        return
    }
    state.cfInfo.items.splice(index, 1)
}
const deleteRow1 = (index: any) => {
    if (state.csData.length === 1) {
        state.csData[0] = {}
        return
    }
    state.csData.splice(index, 1)
}
const deleteRow2 = (index: any) => {
    if (state.csData1.length === 1) {
        state.csData1[0] = {}
        return
    }
    state.csData1.splice(index, 1)
}
const rules = reactive({
    MBMC: [{ required: true, message: '模板名称不能为空', trigger: 'blur' }],
    MBGS: [{ required: true, message: '模板归属不能为空', trigger: 'change' }],
})

const cancel = () => {
    state.show = false
}

const show = () => {
    emit('cflx', state.cfInfo.cflx)
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

.el-button.is-disabled {
    .svg-icon {
        color: #a8abb2 !important;
    }
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
.bz {
    color: red;
    font-size: 14px;
}
.cf-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #f6f6f6;
    padding: 2px 15px 2px 5px;
    margin-top: 10px;
    width: 1200px;
    .cf-action {
        .svg-icon {
            font-size: 14px !important;
        }
        .operate-text {
            margin-left: 3px;
        }
    }
}
.cf-items {
    position: reactive;
    margin-bottom: 10px;
    overflow: hidden;
    width: 1200px;
    .bottom {
        margin-top: 15px;
        margin-left: -50px;
    }
    .summary {
        display: flex;
        justify-content: flex-end;
        margin-top: -10px;
        .zje {
            margin-left: auto;
        }
        .xj {
            margin-left: 50px;
            font-weight: 600;
            text-align: right;
        }
    }
}
.expand-icon {
    transform: rotate(180deg);
}
.top {
    margin-top: 20px;
    margin-left: -20px;
}
.divider {
    margin-top: -5px;
}
</style>
