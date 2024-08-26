<template>
    <div>
        <div class="cf-main">
            <div class="cf-header" @mouseover="showButton" @mouseleave="startHideButton">
                <div class="cf-title">{{ state.cfInfo.title }}</div>
                <div class="title-btn" v-if="showBtn">
                    <el-dropdown>
                        <el-button type="text" plain @mouseenter="cancelHideTimer">
                            <Icon name="local-directory" />
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu @mouseenter="cancelHideTimer" @mouseleave="hideButton">
                                <el-dropdown-item>
                                    <Icon name="local-copy" color="#59a7ff" class="menu-svg" />
                                    <span>复制在下面</span>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <Icon name="local-save-template" color="#59a7ff" class="menu-svg" />
                                    <span>存为模板（单）</span>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <Icon name="local-remove" color="#59a7ff" class="menu-svg" />
                                    <span>删除处方</span>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
                <div class="cf-action">
                    <div class="action-group" v-if="!props.hideact && state.cfInfo.isExpand">
                        <el-button type="text" plain @click="onCopy">
                            <Icon name="local-copy" color="#59a7ff" />
                            <span class="operate-text">复制</span>
                        </el-button>
                        <el-button type="text" :disabled="!state.cfInfo.isCopied" plain @click="onPaste">
                            <Icon name="local-paste" color="#59a7ff" />
                            <span class="operate-text">粘贴</span>
                        </el-button>
                        <el-button type="text" v-if="!state.cfInfo.isEdit" plain @click="editChange">
                            <Icon name="local-edit" color="#59a7ff" />
                            <span class="operate-text">编辑</span>
                        </el-button>
                        <el-button type="text" v-if="state.cfInfo.isEdit" plain @click="editChange">
                            <Icon name="local-fail" color="#808080" />
                            <span class="operate-text" style="color: #808080">取消</span>
                        </el-button>
                        <el-button type="text" plain @click="onSave">
                            <Icon name="local-save" color="#59a7ff" />
                            <span class="operate-text">保存</span>
                        </el-button>
                    </div>
                    <el-button type="text" v-if="!props.hideact" plain @click="onPrint">
                        <Icon name="local-print" color="#59a7ff" />
                        <span class="operate-text">打印处方</span>
                    </el-button>
                    <el-button type="text" plain @click="exChange">
                        <Icon name="local-expand1" :class="state.cfInfo.isExpand ? 'expand-icon' : ''" color="#59a7ff" />
                        <span class="operate-text">{{ state.cfInfo.isExpand ? '收起' : '展开' }}</span>
                    </el-button>
                </div>
            </div>
            <div class="cf-items" v-show="state.cfInfo.isExpand">
                <el-table ref="cfRef" :data="state.cfInfo.items" highlight-current-row style="width: 100%">
                    <el-table-column type="selection" width="42" />
                    <el-table-column prop="STATE" label="状态" width="70" v-if="!props.hideact" />
                    <el-table-column prop="GJBM" label="国家编码" width="130" />
                    <el-table-column prop="YZMC" label="医嘱名称(药品名称+规格)" width="230">
                        <template #default="scope">
                            <SelectYpxx
                                v-model="scope.row.YZMC"
                                :agrs="scope.row"
                                v-if="state.cfInfo.isEdit"
                                :conditions="{ YWLX: '药品字典' }"
                                @choice="onChoiceYp"
                            />
                            <span v-else>{{ scope.row.YZMC }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="SL" label="数量" width="100">
                        <template #default="scope">
                            <el-input
                                v-model="scope.row.SL"
                                type="string"
                                placeholder="请输入"
                                style="width: 100%"
                                v-if="state.cfInfo.isEdit"
                            ></el-input>
                            <span v-else>{{ scope.row.SL }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="DW" label="单位" width="100">
                        <template #default="scope">
                            <el-select v-model="scope.row.DW" clearable v-if="state.cfInfo.isEdit" placeholder="">
                                <el-option v-for="opt in state.dwArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"> </el-option>
                            </el-select>
                            <span v-else>{{ scope.row.DW }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="PC" label="频次" width="80">
                        <template #default="scope">
                            <el-select v-model="scope.row.PC" clearable v-if="state.cfInfo.isEdit" placeholder="">
                                <el-option v-for="opt in state.pcArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"> </el-option>
                            </el-select>
                            <span v-else>{{ scope.row.PC }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="TS" label="天数" width="80">
                        <template #default="scope">
                            <el-input
                                v-model="scope.row.TS"
                                type="string"
                                placeholder="请输入"
                                style="width: 100%"
                                v-if="state.cfInfo.isEdit"
                            ></el-input>
                            <span v-else>{{ scope.row.TS }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ZXKS" label="执行科室" width="100">
                        <template #default="scope">
                            <el-select v-model="scope.row.ZXKS" clearable v-if="state.cfInfo.isEdit" placeholder="">
                                <el-option v-for="opt in state.zxksArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"> </el-option>
                            </el-select>
                            <span v-else>{{ scope.row.ZXKS }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="JE" label="金额(元)" width="100" />
                    <el-table-column prop="ZT" label="嘱托" min-width="150">
                        <template #default="scope">
                            <el-input
                                v-model="scope.row.ZT"
                                type="string"
                                placeholder="请输入"
                                style="width: 100%"
                                v-if="state.cfInfo.isEdit"
                            ></el-input>
                            <span v-else>{{ scope.row.ZT }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" align="center" width="60" v-if="!props.hideact">
                        <template #default="scope">
                            <el-button link v-blur type="primary" size="small" @click="addRow">
                                <Icon name="local-create" style="color: #59a7ff" class="local-icon" />
                            </el-button>
                            <el-popconfirm title="您确定删除这条记录吗?" @confirm="deleteRow(scope.$index)" width="200">
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
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, watch, nextTick } from 'vue'
import { uuid } from '/@/utils/random'
import SelectYpxx from '/@/components/yfzx/select-ypxx.vue'
const props = defineProps({
    cfinfo: {
        type: Object,
        default: () => {
            return {
                bm: uuid(),
                title: '中医治疗',
                cflx: 3,
                isEdit: true,
                isCopied: false,
                isExpand: true,
                items: [{}],
            }
        },
    },
    hideact: {
        type: Boolean,
        default: false,
    },
})
const emit = defineEmits(['dataChange', 'delete'])

const cfRef = ref()
const showBtn = ref(false)
const hideTimer = ref()
const state: {
    cfInfo: any
    dwArr: any //单位
    pcArr: any //频次
    zxksArr: any //执行科室
} = reactive({
    cfInfo: props.cfinfo,
    dwArr: [],
    pcArr: [],
    zxksArr: [],
})

const showButton = () => {
    showBtn.value = true
}

const hideButton = () => {
    showBtn.value = false
}
const startHideButton = () => {
    hideTimer.value = setTimeout(() => {
        showBtn.value = false
    }, 200)
}

const cancelHideTimer = () => {
    if (hideTimer.value) {
        clearTimeout(hideTimer.value)
        hideTimer.value = null
    }
}

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

const onPrint = () => {
    console.log('print...')
}

const onSave = () => {
    state.cfInfo.isEdit = !state.cfInfo.isEdit
}

const exChange = () => {
    state.cfInfo.isExpand = !state.cfInfo.isExpand
}

const addRow = () => {
    state.cfInfo.items.push({})
}

const deleteRow = (index: any) => {
    if (state.cfInfo.items.length === 1) {
        state.cfInfo.items[0] = {}
        emit('delete', state.cfInfo.bm)
        return
    }
    state.cfInfo.items.splice(index, 1)
}

const onChoiceYp = (row: any, agrs: any) => {
    agrs.GJBM = row.GJBM
    agrs.YZMC = row.YPMC + row.GG
}
</script>

<style lang="scss" scoped>
:deep(.el-table .cell) {
    padding: 0 5px;
    height: 100%;
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

.cf-main {
    width: 98%;
    margin-left: 20px;
    .cf-header {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #f6f6f6;
        padding: 2px 15px 2px 5px;
        margin-top: 10px;
        .title-btn {
            position: absolute;
            left: -20px;
            top: 0;
            z-index: 1;
            .svg-icon {
                color: #409eff !important;
                margin-top: 10px;
            }
        }
        .cf-action {
            .svg-icon {
                font-size: 14px !important;
            }

            .operate-text {
                margin-left: 3px;
            }
        }
    }
}
.cf-items {
    margin-bottom: 10px;
}

.expand-icon {
    transform: rotate(180deg);
}
.menu-svg {
    margin-right: 10px;
}
</style>
