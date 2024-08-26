<template>
    <div>
        <el-dialog
            class="ba-operate-dialog"
            :close-on-click-modal="false"
            :model-value="state.show"
            @close="onClose"
            :destroy-on-close="true"
            align-center
            width="750px"
        >
            <template #header>
                <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">简易挂号</div>
            </template>
            <el-scrollbar class="ba-table-form-scrollbar">
                <div class="jygh">
                    <el-form ref="formRef" :model="form" label-position="right" label-width="100px" :rules="rules">
                        <el-row :gutter="0">
                            <el-col :xs="12" :sm="12">
                                <el-form-item label="病人姓名:" prop="BRXM">
                                    <el-input v-model="form!.BRXM" type="string" placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="12" :sm="12">
                                <el-form-item prop="XB" label="性别:">
                                    <el-select v-model="form!.XB" filterable clearable style="width: 100%">
                                        <el-option v-for="opt in state.xbArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="0">
                            <el-col :xs="12" :sm="12">
                                <el-form-item label="出生日期:" prop="CSRQ">
                                    <el-date-picker v-model="form!.CSRQ" type="date" placeholder="请选择时间" style="width: 100%" />
                                </el-form-item>
                            </el-col>
                            <el-col :xs="12" :sm="12">
                                <el-form-item label="身份证号:" prop="SFZH">
                                    <el-input v-model="form!.SFZH" type="string" placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="0">
                            <el-col :xs="12" :sm="12">
                                <el-form-item label="挂号类型:" prop="GHLBBM">
                                    <el-select v-model="form!.GHLBBM" filterable clearable style="width: 100%">
                                        <el-option v-for="opt in state.lxArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="12" :sm="12">
                                <el-form-item prop="JZFS" label="就诊方式:">
                                    <el-select v-model="form!.JZFS" filterable clearable style="width: 100%">
                                        <el-option v-for="opt in state.jzfsArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="0">
                            <el-col :xs="12" :sm="12">
                                <el-form-item prop="GHKSBM" label="挂号科室:">
                                    <el-select v-model="form!.GHKSBM" filterable clearable style="width: 100%">
                                        <el-option v-for="opt in state.ghksArr" :key="opt.KSBM" :label="opt.KSMC" :value="opt.KSBM"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="12" :sm="12">
                                <el-form-item prop="SFJZ" label="是否急诊:">
                                    <el-radio-group v-model="form!.SFJZ">
                                        <el-radio label="0">否</el-radio>
                                        <el-radio label="1">是</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </el-scrollbar>
            <template #footer>
                <div class="yd-from-footer">
                    <el-button ref="btnSave" v-blur type="primary" @click="onSubmit(formRef)" class="btn-form-save"> 保存 </el-button>
                    <el-button @click="onClose" class="btn-form-cancel">取消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, watch } from 'vue'
import { ElMessage, type FormInstance, type FormItemRule } from 'element-plus'
import { getMultiZdmx, getKsList } from '/@/api/common'
import { saveJygh, getGhlx } from '/@/api/backend/lczlzx/jygh'
const formRef = ref<FormInstance>()

const form = reactive({
    BRID: '', //病人ID
    BRXM: '', //病人姓名
    XB: '', //性别
    CSRQ: '', //出生日期
    SFZH: '', //身份证号
    GHLXMC: '', //挂号类型名称
    GHLBBM: '', //挂号类别编码
    BRLXBM: '', //病人类型编码:字典明细,分类编码:GB_009000
    JZFS: '', //就诊方式:字典明细,分类编码:GB_009008
    GHKSBM: '', //挂号科室编码
    SFJZ: '', //是否急诊:0否,1是
})

const state: {
    show: any
    loading: any
    xbArr: any
    lxArr: any
    jzfsArr: any
    ghksArr: any
} = reactive({
    show: false,
    loading: false,
    xbArr: [
        { BM: '1', MC: '男' },
        { BM: '2', MC: '女' },
        { BM: '3', MC: '未知性别' },
    ],
    lxArr: [],
    jzfsArr: [],
    ghksArr: [],
})

watch(
    () => state.show,
    () => {
        getGhlx({}).then((res) => {
            state.lxArr = res.data
        })
        getMultiZdmx(['GB_009008']).then((res) => {
            state.jzfsArr = res.data.options
        })
        getKsList().then((res) => {
            state.ghksArr = res.data.options
        })
    }
)

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    BRXM: [{ required: true, message: '病人姓名不能为空', trigger: 'blur' }],
    XB: [{ required: true, message: '性别不能为空', trigger: 'change' }],
    CSRQ: [{ required: true, message: '出生日期不能为空', trigger: 'change' }],
    SFZH: [{ required: true, message: '身份证号不能为空', trigger: 'blur' }],
    GHLBBM: [{ required: true, message: '挂号类型不能为空', trigger: 'change' }],
    JZFS: [{ required: true, message: '就诊方式不能为空', trigger: 'change' }],
    GHKSBM: [{ required: true, message: '挂号科室不能为空', trigger: 'change' }],
    SFJZ: [{ required: true, message: '是否急诊不能为空', trigger: 'change' }],
})

const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid: any, fields: any) => {
        if (valid) {
            for (let i = 0; i < state.lxArr.length; i++) {
                if (state.lxArr[i].BM == form.GHLBBM) {
                    form.GHLXMC = state.lxArr[i].MC
                    break
                }
            }
            let date = new Date(form.CSRQ)
            let year = date.getFullYear()
            let month = (date.getMonth() + 1).toString().padStart(2, '0')
            let day = date.getDate().toString().padStart(2, '0')
            form.CSRQ = `${year}-${month}-${day}`
            let data = {
                agrs: {
                    BRID: '',
                    BRXM: form.BRXM,
                    XB: form.XB,
                    CSRQ: form.CSRQ,
                    SFZH: form.SFZH,
                    GHLXMC: form.GHLXMC,
                    GHLBBM: form.GHLBBM,
                    JZFS: form.JZFS,
                    GHKSBM: form.GHKSBM,
                    SFJZ: form.SFJZ,
                },
            }
            saveJygh(data).then((res: any) => {
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
                    state.show = false
                }
            })
        } else {
            console.log('error submit!', fields)
        }
    })
}

onMounted(() => {})

const onClose = () => {
    state.show = false
}

const show = () => {
    state.show = true
}

defineExpose({ show })
</script>

<style scoped lang="scss">
:deep(.el-dialog__body) {
    height: 300px;
}
.jygh {
    margin-top: 20px;
    margin-left: -20px;
}
</style>
