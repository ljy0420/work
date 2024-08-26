<template>
    <div>
        <el-dialog
            class="ba-operate-dialog"
            :close-on-click-modal="false"
            :model-value="dialogVisble"
            @close="cancel"
            :destroy-on-close="true"
            align-center
            id="ddbczxks-dialog"
            width="800px"
        >
            <template #header>
                <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']">
                    {{ '收费项目执行科室管理' }}
                </div>
            </template>
            <div class="zxks-box">
                <div style="display: flex">
                    <el-form
                        ref="formRef"
                        :inline="true"
                        :model="baTable.form.items"
                        label-position="right"
                        :label-width="baTable.form.labelWidth + 'px'"
                        :rules="rules"
                        v-if="!baTable.form.loading"
                    >
                        <el-form-item prop="MZZXKS" label="门诊执行科室" style="margin-right: 25px">
                            <el-select
                                v-model="baTable.form.items!.MZZXKS"
                                placeholder="无固定执行科室"
                                clearable
                                style="width: 100%"
                                @change="mzzxksChange"
                            >
                                <el-option v-for="opt in state.mzzxksArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="ZYZXKS" label="住院执行科室">
                            <el-select
                                v-model="baTable.form.items!.ZYZXKS"
                                placeholder="病人病区"
                                clearable
                                style="width: 100%"
                                @change="zyzxksChange"
                            >
                                <el-option v-for="opt in state.mzzxksArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                <el-table
                    :data="state.mzzxksData"
                    class="ba-data-table w100"
                    style="margin-top: 10px"
                    height="300px"
                    :highlight-current-row="false"
                    border
                >
                    <el-table-column width="50" type="index" align="center" />
                    <el-table-column prop="BRLY" label="来源" width="120">
                        <template #default="scope">
                            <el-select v-model="scope.row.BRLY" placeholder="请选择" clearable filterable :disabled="!scope.row.isEdit">
                                <el-option
                                    v-for="opt in state.lyArr"
                                    :key="opt.BM"
                                    :label="opt.MC"
                                    :value="opt.BM"
                                    :disabled="opt.disabled"
                                ></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ZXKSBM" label="执行科室" width="150">
                        <template #default="scope">
                            <el-select v-model="scope.row.ZXKSBM" placeholder="请选择" filterable style="width: 100%">
                                <el-option v-for="opt in prop.ksArr" :key="opt.KSBM" :label="opt.KSMC" :value="opt.KSBM"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="KDKSBM" label="服务科室">
                        <template #default="scope">
                            <el-select v-model="scope.row.FWKS" placeholder="请选择" filterable multiple style="width: 100%">
                                <el-option v-for="opt in prop.kdksArr" :key="opt.KSBM" :label="opt.KSMC" :value="opt.KSBM"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="操作" width="90" fixed="right" align="center">
                        <template #default="scope">
                            <el-button
                                link
                                v-blur
                                type="primary"
                                size="small"
                                @click="addMzzxks"
                                v-show="baTable.form.items!.MZZXKS === 4 || baTable.form.items!.ZYZXKS === 4"
                            >
                                <Icon name="local-create" style="color: rgb(14, 141, 77)" class="local-icon" />
                            </el-button>
                            <el-popconfirm title="您确定删除这条记录吗?" @confirm="deleteMzzxks(scope.$index)">
                                <template #reference>
                                    <el-button link v-blur type="primary" size="small" style="margin-left: 3px" v-if="state.mzzxksData.length !== 1">
                                        <Icon name="local-delete" style="color: rgb(245, 75, 33)" class="local-icon" />
                                    </el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="dxk">
                    <span class="title">适用范围</span>
                    <el-radio-group v-model="radio" style="margin-left: 30px">
                        <el-radio v-model="formData.LX" :label="1" style="width: 520px">仅对本项目起作用</el-radio>
                        <el-radio v-model="formData.LX" :label="2" style="width: 520px">应用于床位费分类下的所有项目</el-radio>
                        <el-radio v-model="formData.LX" :label="3">应用于床位类别下的所有项目</el-radio>
                    </el-radio-group>
                </div>
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
import { ref, reactive, watch, onMounted, inject } from 'vue'
import { ElMessage, type FormInstance, type FormItemRule } from 'element-plus'
import type baTableClass from '/@/utils/baTable'
import { ddbczxks } from '/@/api/backend/jcgl/zlzdwh'
import { buildValidatorData } from '/@/utils/validate'
import { useAdminInfo } from '/@/stores/adminInfo'

const adminInfo = useAdminInfo()
const formRef = ref<FormInstance>()
const radio = ref(1)
const dialogVisble = ref(false)
const MZZXKS = ref()
const ZYZXKS = ref()

const prop = defineProps(['rowBM', 'mxtableData', 'index', 'xfxmRowData', 'ksArr', 'kdksArr'])

const formData = reactive({
    LX: 1,
})
const state: {
    lyArr: any
    ksArr: any
    kdksArr: any
    mzzxksData: any
    mzzxksArr: any
} = reactive({
    lyArr: [
        { BM: 1, MC: '门诊' },
        { BM: 2, MC: '住院' },
    ],
    ksArr: [],
    kdksArr: [],
    mzzxksData: [],
    mzzxksArr: [
        { BM: 0, MC: '无明确执行科室' },
        { BM: 1, MC: '病人科室' },
        { BM: 2, MC: '病人病区' },
        { BM: 3, MC: '操作员所在科室' },
        { BM: 4, MC: '指定科室执行' },
        { BM: 6, MC: '开单人所在科室' },
    ],
})

const getCXkss = () => {
    MZZXKS.value = prop.xfxmRowData.MZZXKS
    ZYZXKS.value = prop.xfxmRowData.ZYZXKS
}

const mzzxksChange = () => {
    mzztChange()
}

const zyzxksChange = () => {
    mzztChange()
}

const mzztChange = () => {
    if (state.mzzxksData && state.mzzxksData.length > 0) {
        state.mzzxksData.forEach((item: any) => {
            item.isEdit = true
        })
    }
    if (baTable.form.items!.MZZXKS == 4 && baTable.form.items!.ZYZXKS == 4) {
        state.lyArr.forEach((item: any) => {
            item.disabled = false
        })
    } else if (baTable.form.items!.MZZXKS == 4 && baTable.form.items!.ZYZXKS != 4) {
        state.lyArr.forEach((item: any) => {
            item.disabled = true
            if (item.BM == 1) {
                item.disabled = false
            } else {
                item.disabled = true
            }
        })
    } else if (baTable.form.items!.MZZXKS != 4 && baTable.form.items!.ZYZXKS == 4) {
        state.lyArr.forEach((item: any) => {
            item.disabled = true
            if (item.BM == 1) {
                item.disabled = true
            } else {
                item.disabled = false
            }
        })
    } else {
        state.lyArr.forEach((item: any) => {
            item.disabled = true
        })
        if (state.mzzxksData && state.mzzxksData.length > 0) {
            state.mzzxksData.forEach((item) => {
                item.isEdit = false
            })
        }
    }
}

/**
 * 新增门诊执行科室
 */
const addMzzxks = () => {
    state.mzzxksData.push({ BRLY: '', KDKSBM: '', ZXKSBM: '', isEdit: true, editTxt: '确定' })
}

/**
 * 删除门诊执行科室
 * @param rowIndex
 */
const deleteMzzxks = (rowIndex: any) => {
    state.mzzxksData.splice(rowIndex, 1)
}

watch(
    () => prop.index,
    (val) => {
        if (val == 1) {
        }
    }
)

watch(
    () => prop.mxtableData,
    (val) => {
        state.mzzxksData = val
    }
)

watch(
    () => prop.xfxmRowData,
    (val) => {
        if (val) {
            console.log('prop.xfxmRowData', prop.xfxmRowData)
            MZZXKS.value = val.MZZXKS
            ZYZXKS.value = val.ZYZXKS
        }
    }
)

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    MZZXKS: [buildValidatorData({ name: 'required', title: '门诊执行科室不能为空.' })],
    ZYZXKS: [buildValidatorData({ name: 'required', title: '住院执行科室不能为空.' })],
})

const submitForm = async (formEl: FormInstance | undefined) => {
    // 借鉴的成员
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            formData.LX = radio.value
            let zxksItems: any = []
            if (state.mzzxksData && state.mzzxksData.length > 0) {
                state.mzzxksData.forEach((item: any) => {
                    if (item.ZXKSBM) {
                        if (item.FWKS && item.FWKS.length > 0) {
                            item.FWKS.forEach((kdksbm: any) => {
                                console.log(item.BRLY)
                                zxksItems.push({ XMBM: prop.rowBM, BRLY: item.BRLY, ZXKSBM: item.ZXKSBM, KDKSBM: kdksbm })
                            })
                        }
                    }
                })
            }

            let data = {
                jgbm: adminInfo.jgbm,
                agrs: {
                    LX: formData.LX,
                    mode: { XMBM: prop.rowBM, MZZXKS: baTable.form.items!.MZZXKS, ZYZXKS: baTable.form.items!.ZYZXKS },
                    ListT2: zxksItems,
                },
            }
            ddbczxks(data).then((res: any) => {
                if (res.code != 1) {
                    ElMessage({
                        type: 'error',
                        message: '保存失败',
                    })
                } else {
                    ElMessage({
                        type: 'success',
                        message: '保存成功',
                    })
                    dialogVisble.value = false
                }
            })
        } else {
            console.log('error submit!', fields)
        }
    })
}
const cancel = () => {
    dialogVisble.value = false
}

const baTable = inject('baTable') as baTableClass

onMounted(() => {
    getCXkss()
    //getCXks()
    //getCXkss()
})

defineExpose({
    dialogVisble,
})
</script>
<style scoped lang="scss">
.zxks-box {
    display: flex;
    flex-direction: column;
    padding: 10px 20px 0;
    .el-form-item {
        margin-bottom: 0px;
    }
}
.dxk {
    border: 1px solid #cdcdcd;
    margin-top: 20px;

    .title {
        display: block;
        margin-left: 25px;
        width: 60px;
        top: -10px;
        background: white;
        position: relative;
    }
}

:deep(.el-dialog__body) {
    height: 600px;
}

.ba-data-table :deep(.table-header-cell) .cell {
    color: var(--el-text-color-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

:deep(.el-select-tags-wrapper .el-tag) {
    color: #333;
}
</style>
