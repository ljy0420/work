<template>
    <div>
        <el-dialog
            class="ba-operate-dialog"
            :close-on-click-modal="false"
            :model-value="dialogVisble"
            @close="cancel"
            :destroy-on-close="true"
            align-center
            id="cckf-dialog"
            width="800px"
        >
            <template #header>
                <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']">
                    {{ '药品存储库房设置' }}
                </div>
            </template>
            <el-scrollbar class="ba-table-form-scrollbar">
                <div class="ba-operate-form">
                    <el-form ref="formRef" :model="formData" label-position="left" label-width="80" :rules="rules">
                        <el-form-item prop="XMBM" label="指定药品">
                            <el-select v-model="formData.XMBM" placeholder="请选择" filterable style="width: 100%" @change="change">
                                <el-option
                                    v-for="opt in prop.ypdata"
                                    :key="opt.YPBM"
                                    :label="'[' + opt.YPBM + ']' + opt.YPMC + '(' + opt.GG + ')'"
                                    :value="opt.YPBM"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-table
                            class="ba-data-table w100"
                            header-cell-class-name="table-header-cell"
                            :data="state.cckfData"
                            highlight-current-row
                            height="300px"
                            border
                        >
                            <el-table-column type="index" align="center" />
                            <el-table-column label="选择" prop="XZ" width="55px" align="center">
                                <template #default="scope">
                                    <div>
                                        <el-checkbox v-model="scope.row.XZ"></el-checkbox>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="存储药房" prop="CCKF" width="120px" align="center"></el-table-column>
                            <el-table-column label="服务科室" prop="FWKS" align="left">
                                <template #default="scope">
                                    <el-select
                                        v-model="scope.row.FWKS"
                                        placeholder="请选择(可多选)"
                                        filterable
                                        clearable
                                        multiple
                                        style="width: 100%"
                                    >
                                        <el-option v-for="opt in state.ksArr" :key="opt.KSBM" :label="opt.KSMC" :value="opt.KSBM"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="dxk">
                            <span class="title">应用于</span>
                            <el-radio-group v-model="radio" style="margin-left: 30px">
                                <el-radio v-model="formData.LX" :label="1" style="width: 220px">仅应用于本规格的药品</el-radio>
                                <el-radio v-model="formData.LX" :label="2" style="width: 220px">应用于本品种下所有药品</el-radio>
                                <el-radio v-model="formData.LX" :label="3">应用于本类别下所有药品</el-radio>
                                <el-radio v-model="formData.LX" :label="4" style="width: 600px">应用于同剂型的所有药品</el-radio>
                                <el-radio v-model="formData.LX" :label="5" style="width: 220px">应用于同级的所有药品</el-radio>
                                <el-radio v-model="formData.LX" :label="6">应用于本分类的所有药品</el-radio>
                            </el-radio-group>
                        </div>
                    </el-form>
                </div>
            </el-scrollbar>
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
import { ref, reactive, watch } from 'vue'
import { ElMessage, type FormInstance, type FormItemRule } from 'element-plus'
import { getYpzxks, saveYpzxks } from '/@/api/backend/jcgl/ypxxwh'
import { buildValidatorData } from '/@/utils/validate'
import { getKsList } from '/@/api/common'
import { useAdminInfo } from '/@/stores/adminInfo'

const adminInfo = useAdminInfo()

const radio = ref(1)
const dialogVisble = ref(false)

const formRef = ref<FormInstance>()
const prop = defineProps(['selectYpbm', 'ypdata'])

const change = () => {
    loadYpzxks()
}

const loadYpzxks = () => {
    // 获取执行科室
    getYpzxks({ agrs: { XMBM: formData.XMBM } }).then((res) => {
        if (res.code == 1) {
            state.cckfData = res.data
        }
    })
}

const formData = reactive({
    ypdata: [],
    LX: 1,
    cckfData: [],
    XMBM: '',
})
const state: {
    cckfData: any //存储库房数据
    ksArr: any //科室
} = reactive({
    cckfData: [],
    ksArr: [],
})

watch(
    () => prop.ypdata,
    (val) => {
        if (val) {
            if (prop.ypdata && prop.ypdata.length > 0) {
                formData.XMBM = prop.ypdata[0].YPBM
                loadYpzxks()
            }
        }
    }
)

watch(
    () => prop.selectYpbm,
    (val) => {
        if (val) {
            formData.XMBM = val
            loadYpzxks()
        }
    }
)

/**
 * 加载开单和执行科室
 */
getKsList().then((res) => {
    state.ksArr = res.data.options
})

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    LX: [buildValidatorData({ name: 'required', message: '保存类型不能为空.' })],
    XMBM: [buildValidatorData({ name: 'required', message: '项目编码不能为空.' })],
})

const submitForm = async (formEl: FormInstance | undefined) => {
    // 借鉴的成员
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            formData.LX = radio.value
            let zxksItems: any = []
            if (state.cckfData && state.cckfData.length > 0) {
                state.cckfData.forEach((item: any) => {
                    if (item.ZXKSBM && item.XZ) {
                        if (item.FWKS && item.FWKS.length > 0) {
                            item.FWKS.forEach((kdksbm: any) => {
                                zxksItems.push({ XMBM: formData.XMBM, BRLY: '', ZXKSBM: item.ZXKSBM, KDKSBM: kdksbm })
                            })
                        }
                    }
                })
            }
            let data = {
                jgbm: adminInfo.jgbm,
                agrs: {
                    LX: formData.LX,
                    mode: {
                        XMBM: formData.XMBM,
                    },
                    list: zxksItems,
                },
            }
            saveYpzxks(data).then((res: any) => {
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

defineExpose({
    dialogVisble,
})
</script>
<style scoped lang="scss">
.dxk {
    border: 1px solid #cdcdcd;
    margin-top: 20px;

    .title {
        display: block;
        margin-left: 20px;
        width: 45px;
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

// :deep(.el-input-group__prepend){
//     background: white;
//     border: none;
//     box-shadow: 0 0 0px;
// }
// :deep(.el-checkbox.el-checkbox--large .el-checkbox__inner){
//     width: 24px;
//     height: 24px;
// }
// :deep(.el-checkbox__input.is-checked .el-checkbox__inner::after){
//     margin-top: 4px;
//     margin-left: 6px;
// }
// :deep(.ba-data-table .el-table__header th.el-table__cell.is-leaf .cell){
//     color: black;
// }
</style>
