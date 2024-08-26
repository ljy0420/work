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
                    {{ '西药处方模板1' }}
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
                                <span>西药处方模板1</span>
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
                        <div class="cf-title">{{ '处方4：西药处方_239183' }}</div>
                        <div class="cf-action">
                            <div class="action-group" v-if="state.cfInfo.isExpand">
                                <el-button
                                    type="text"
                                    plain
                                    @click="onSplit"
                                    :disabled="table.selection.length > 1 ? false : true"
                                    v-if="state.cfInfo.isEdit"
                                >
                                    <Icon name="local-split" color="#59a7ff" />
                                    <span class="operate-text">拆组</span>
                                </el-button>
                                <el-button
                                    type="text"
                                    plain
                                    @click="onMerge"
                                    :disabled="table.selection.length > 1 ? false : true"
                                    v-if="state.cfInfo.isEdit"
                                >
                                    <Icon name="local-join" color="#59a7ff" />
                                    <span class="operate-text">成组</span>
                                </el-button>
                            </div>

                            <el-button type="text" plain @click="exChange">
                                <Icon name="local-expand1" :class="state.cfInfo.isExpand ? 'expand-icon' : ''" color="#59a7ff" />
                                <span class="operate-text">{{ state.cfInfo.isExpand ? '收起' : '展开' }}</span>
                            </el-button>
                        </div>
                    </div>
                    <div class="cf-items" v-show="state.cfInfo.isExpand">
                        <el-table ref="cfRef" :data="state.csData" highlight-current-row @selection-change="onSelectionChange" style="width: 100%">
                            <el-table-column type="selection" width="30" />
                            <el-table-column prop="STATE" label="状态" width="70" />
                            <el-table-column prop="GJBM" label="国家编码" width="130"></el-table-column>
                            <el-table-column prop="PS" label="皮试" width="90">
                                <template #default="scope">
                                    <el-select v-model="scope.row.PS" clearable v-if="state.cfInfo.isEdit">
                                        <el-option v-for="opt in state.psArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"> </el-option>
                                    </el-select>
                                    <span v-else>{{ scope.row.PS }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="YZMC" label="医嘱名称(药品名称+规格)" width="400">
                                <template #default="scope">
                                    <el-input
                                        v-model="scope.row.YZMC"
                                        type="string"
                                        placeholder="请输入医嘱名称"
                                        style="width: 100%"
                                        v-if="state.cfInfo.isEdit"
                                    ></el-input>
                                    <span v-else>{{ scope.row.YZMC }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="DCJL" label="单次剂量" width="100">
                                <template #default="scope">
                                    <el-input
                                        v-model="scope.row.DCJL"
                                        type="string"
                                        placeholder="请输入单次剂量"
                                        style="width: 100%"
                                        v-if="state.cfInfo.isEdit"
                                    ></el-input>
                                    <span v-else>{{ scope.row.DCJL }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="GYTJ" label="给药途径" width="100">
                                <template #default="scope">
                                    <el-input
                                        v-model="scope.row.GYTJ"
                                        type="string"
                                        placeholder="请输入给药途径"
                                        style="width: 100%"
                                        v-if="state.cfInfo.isEdit"
                                    ></el-input>
                                    <span v-else>{{ scope.row.GYTJ }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="PC" label="频次" width="80">
                                <template #default="scope">
                                    <el-input
                                        v-model="scope.row.PC"
                                        type="string"
                                        placeholder="请输入频次"
                                        style="width: 100%"
                                        v-if="state.cfInfo.isEdit"
                                    ></el-input>
                                    <span v-else>{{ scope.row.PC }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="DS" label="滴速" width="100">
                                <template #default="scope">
                                    <el-input
                                        v-model="scope.row.DS"
                                        type="string"
                                        placeholder="请输入滴速"
                                        style="width: 100%"
                                        v-if="state.cfInfo.isEdit"
                                    ></el-input>
                                    <span v-else>{{ scope.row.DS }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="TS" label="天数" width="80">
                                <template #default="scope">
                                    <el-input
                                        v-model="scope.row.TS"
                                        type="string"
                                        placeholder="请输入天数"
                                        style="width: 100%"
                                        v-if="state.cfInfo.isEdit"
                                    ></el-input>
                                    <span v-else>{{ scope.row.TS }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="JE" label="金额(元)" width="100">
                                <template #default="scope">
                                    <el-input
                                        v-model="scope.row.JE"
                                        type="string"
                                        placeholder="请输入金额"
                                        style="width: 100%"
                                        v-if="state.cfInfo.isEdit"
                                    ></el-input>
                                    <span v-else>{{ scope.row.JE }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="ZT" label="嘱托" min-width="180">
                                <template #default="scope">
                                    <el-input
                                        v-model="scope.row.ZT"
                                        type="string"
                                        placeholder="请输入嘱托"
                                        style="width: 100%"
                                        v-if="state.cfInfo.isEdit"
                                    ></el-input>
                                    <span v-else>{{ scope.row.ZT }}</span>
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

                        <div class="summary">
                            <span class="zje">总金额：16,,084.75元</span>
                            <span class="xj">小计：91.75元</span>
                        </div>
                        <el-divider class="divider" />
                    </div>
                    <div class="cf-header">
                        <div class="cf-title">{{ '处方5：西药处方_239184' }}</div>
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
                                <el-button
                                    type="text"
                                    plain
                                    @click="onSplit"
                                    :disabled="table.selection.length > 1 ? false : true"
                                    v-if="state.cfInfo.isEdit"
                                >
                                    <Icon name="local-split" color="#59a7ff" />
                                    <span class="operate-text">拆组</span>
                                </el-button>
                                <el-button
                                    type="text"
                                    plain
                                    @click="onMerge"
                                    :disabled="table.selection.length > 1 ? false : true"
                                    v-if="state.cfInfo.isEdit"
                                >
                                    <Icon name="local-join" color="#59a7ff" />
                                    <span class="operate-text">成组</span>
                                </el-button>
                            </div>

                            <el-button type="text" plain @click="exChange">
                                <Icon name="local-expand1" :class="state.cfInfo.isExpand ? 'expand-icon' : ''" color="#59a7ff" />
                                <span class="operate-text">{{ state.cfInfo.isExpand ? '收起' : '展开' }}</span>
                            </el-button>
                        </div>
                    </div>
                    <div class="cf-items" v-show="state.cfInfo.isExpand">
                        <el-table ref="cfRef" :data="state.csData1" highlight-current-row @selection-change="onSelectionChange" style="width: 100%">
                            <el-table-column type="selection" width="30" />
                            <el-table-column prop="STATE" label="状态" width="70" />
                            <el-table-column prop="GJBM" label="国家编码" width="130"></el-table-column>
                            <el-table-column prop="PS" label="皮试" width="90">
                                <template #default="scope">
                                    <el-select v-model="scope.row.PS" clearable v-if="state.cfInfo.isEdit">
                                        <el-option v-for="opt in state.psArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"> </el-option>
                                    </el-select>
                                    <span v-else>{{ scope.row.PS }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="YZMC" label="医嘱名称(药品名称+规格)" width="400">
                                <template #default="scope">
                                    <el-input
                                        v-model="scope.row.YZMC"
                                        type="string"
                                        placeholder="请输入医嘱名称"
                                        style="width: 100%"
                                        v-if="state.cfInfo.isEdit"
                                    ></el-input>
                                    <span v-else>{{ scope.row.YZMC }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="DCJL" label="单次剂量" width="100">
                                <template #default="scope">
                                    <el-input
                                        v-model="scope.row.DCJL"
                                        type="string"
                                        placeholder="请输入单次剂量"
                                        style="width: 100%"
                                        v-if="state.cfInfo.isEdit"
                                    ></el-input>
                                    <span v-else>{{ scope.row.DCJL }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="GYTJ" label="给药途径" width="100">
                                <template #default="scope">
                                    <el-input
                                        v-model="scope.row.GYTJ"
                                        type="string"
                                        placeholder="请输入给药途径"
                                        style="width: 100%"
                                        v-if="state.cfInfo.isEdit"
                                    ></el-input>
                                    <span v-else>{{ scope.row.GYTJ }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="PC" label="频次" width="80">
                                <template #default="scope">
                                    <el-input
                                        v-model="scope.row.PC"
                                        type="string"
                                        placeholder="请输入频次"
                                        style="width: 100%"
                                        v-if="state.cfInfo.isEdit"
                                    ></el-input>
                                    <span v-else>{{ scope.row.PC }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="DS" label="滴速" width="100">
                                <template #default="scope">
                                    <el-input
                                        v-model="scope.row.DS"
                                        type="string"
                                        placeholder="请输入滴速"
                                        style="width: 100%"
                                        v-if="state.cfInfo.isEdit"
                                    ></el-input>
                                    <span v-else>{{ scope.row.DS }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="TS" label="天数" width="80">
                                <template #default="scope">
                                    <el-input
                                        v-model="scope.row.TS"
                                        type="string"
                                        placeholder="请输入天数"
                                        style="width: 100%"
                                        v-if="state.cfInfo.isEdit"
                                    ></el-input>
                                    <span v-else>{{ scope.row.TS }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="JE" label="金额(元)" width="100">
                                <template #default="scope">
                                    <el-input
                                        v-model="scope.row.JE"
                                        type="string"
                                        placeholder="请输入金额"
                                        style="width: 100%"
                                        v-if="state.cfInfo.isEdit"
                                    ></el-input>
                                    <span v-else>{{ scope.row.JE }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="ZT" label="嘱托" min-width="180">
                                <template #default="scope">
                                    <el-input
                                        v-model="scope.row.ZT"
                                        type="string"
                                        placeholder="请输入嘱托"
                                        style="width: 100%"
                                        v-if="state.cfInfo.isEdit"
                                    ></el-input>
                                    <span v-else>{{ scope.row.ZT }}</span>
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

                        <div class="summary">
                            <span class="zje">总金额：16,,084.75元</span>
                            <span class="xj">小计：36.25元</span>
                        </div>
                        <el-divider class="divider" />
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
                title: '西药处方',
                cflx: 1,
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
            STATE: '',
            PS: '',
            YZMC: '0.8%氯化钠注射液250ml  ',
            DCJL: '250ml      ml',
            GYTJ: '静脉输液',
            PC: '早晚1次',
            DS: '120gtt/min',
            TS: '1',
            JE: '3.6',
            ZT: '参考文字参考文字参考',
        },
        {
            STATE: '',
            PS: '',
            YZMC: '头孢克肟分散片54MG*24片',
            DCJL: '50mg       片',
            GYTJ: '口服',
            PC: '早晚1次',
            DS: '',
            TS: '2',
            JE: '23.75',
            ZT: '参考文字参',
        },
        {
            STATE: '',
            PS: '',
            YZMC: '生理氯化钠注射液（冲洗）（塑）（生理盐水）500ml：4.5g',
            DCJL: '250ml      ml',
            GYTJ: '注射液',
            PC: '早晚1次',
            DS: '10ml/h',
            TS: '3',
            JE: '8.9',
            ZT: '参考文字参考文',
        },
        {
            STATE: '',
            PS: '',
            YZMC: '盐酸左氧氟沙星氯化钠注射液100ml*1瓶',
            DCJL: '100ml      ml',
            GYTJ: '注射液',
            PC: '早晚1次',
            DS: '10ml/h',
            TS: '2',
            JE: '31.7',
            ZT: '参考文',
        },
        {
            STATE: '',
            PS: '',
            YZMC: '甲硝锉芬布洛芬胶囊10粒*1盒',
            DCJL: '50mg      粒',
            GYTJ: '胶囊',
            PC: '早晚1次',
            DS: '',
            TS: '1',
            JE: '23.8',
            ZT: '参考文字参考',
        },
    ],
    csData1: [
        {
            STATE: '',
            PS: '',
            YZMC: '0.8%氯化钠注射液250ml',
            DCJL: '250ml      ml',
            GYTJ: '静脉输液  ',
            PC: '早晚1次',
            DS: '120gtt/min',
            TS: '1',
            JE: '3.6',
            ZT: '参考文字参考',
        },
        {
            STATE: '',
            PS: '',
            YZMC: '头孢克肟分散片54MG*24片',
            DCJL: '50mg       片',
            GYTJ: '口服',
            PC: '早晚1次',
            DS: '',
            TS: '1',
            JE: '23.75',
            ZT: '参考文',
        },
        {
            STATE: '',
            PS: '',
            YZMC: '生理氯化钠注射液（冲洗）（塑）（生理盐水）500ml：4.5g',
            DCJL: '250ml      ml',
            GYTJ: '注射液',
            PC: '早晚1次',
            DS: '10ml/h',
            TS: '1',
            JE: '8.9',
            ZT: '参考',
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

const onSplit = () => {
    console.log('split...')
}

const onMerge = () => {
    console.log('merge...')
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
        margin-top: 20px;
        margin-left: -50px;
    }
    .summary {
        display: flex;
        justify-content: flex-end;
        margin-top: 15px;
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
    margin-top: 15px;
}
</style>
