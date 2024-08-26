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
            width="1000px"
        >
            <template #header>
                <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']">
                    {{ state.mbxx.MBMC }}
                </div>
            </template>
            <div class="blmb-box">
                <el-form ref="formRef" :model="state.mbxx" label-position="right" label-width="100px" :rules="rules">
                    <div class="header">
                        <el-row :gutter="0" style="margin-top: 20px">
                            <el-col :xs="12" :sm="12" style="margin-left: -20px">
                                <el-form-item prop="MBMC" label="模板名称:">
                                    <el-input v-model="state.mbxx.MBMC" type="string" placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="12" :sm="12">
                                <el-form-item prop="MBGS" label="模板归属:">
                                    <el-radio-group v-model="state.mbxx.MBFL">
                                        <el-radio v-model="form.MBGS" :label="1">个人模板</el-radio>
                                        <el-radio v-model="form.MBGS" :label="2">科室模板</el-radio>
                                        <el-radio v-model="form.MBGS" :label="3">全院模板</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                    <el-divider style="margin-top: 10px" />
                    <div>
                        <el-scrollbar>
                            <div>
                                <div>
                                    <el-checkbox v-model="checked1" label="诊断" class="zt" />
                                    <el-button type="primary" link @click="onLrzd" class="btn">录入诊断</el-button>
                                </div>
                                <div class="content">
                                    <span class="zdlx-tag">西</span><span class="zdlx-font1">主诊:1型糖尿病伴有周围循环并发症;</span
                                    ><span class="question-mark">机动车辆和两轮或三轮机动车之间碰撞造成的人员损伤,非交通性的,其他的;</span
                                    ><span class="zdlx-tag2">中</span><span class="zdlx-font1">主诊:伤寒;</span
                                    ><span class="zdlx-font2">鼻塞;症候;膀胱湿热气滞证;</span>
                                </div>
                            </div>
                            <div>
                                <div class="title1">
                                    <el-checkbox v-model="checked2" label="主诉" class="zt" />
                                </div>
                                <div class="content1">
                                    <el-row :gutter="0">
                                        <el-col :xs="12" :sm="24">
                                            <el-form-item prop="ZS" style="margin-left: -50px">
                                                <el-input v-model="state.mbxx.ZS" type="textarea" placeholder="" :rows="3"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                            <div>
                                <div class="title2">
                                    <el-checkbox v-model="checked3" label="现病史" class="zt" />
                                </div>
                                <div class="content1">
                                    <el-row :gutter="0">
                                        <el-col :xs="12" :sm="24">
                                            <el-form-item prop="XBS" style="margin-left: -50px">
                                                <el-input v-model="state.mbxx.XBS" type="textarea" placeholder="" :rows="3"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                            <div>
                                <div class="title2">
                                    <el-checkbox v-model="checked4" label="既往史" class="zt" />
                                </div>
                                <div class="content1">
                                    <el-row :gutter="0">
                                        <el-col :xs="12" :sm="24">
                                            <el-form-item prop="JWS" style="margin-left: -50px">
                                                <el-input v-model="state.mbxx.JWS" type="textarea" placeholder="" :rows="3"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                            <div>
                                <div class="title2">
                                    <el-checkbox v-model="checked5" label="过敏史" class="zt" />
                                </div>
                                <div class="content1">
                                    <el-row :gutter="0">
                                        <el-col :xs="12" :sm="24">
                                            <el-form-item prop="GMS" style="margin-left: -50px">
                                                <el-input v-model="state.mbxx.GMS" type="textarea" placeholder="" :rows="3"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                        </el-scrollbar>
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
        <Lrzd ref="lrzdRef" />
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormItemRule } from 'element-plus'
import { saveBlmb } from '/@/api/backend/lczlzx/blmb'
import { useAdminInfo } from '/@/stores/adminInfo'
import Lrzd from './lrzd.vue'
const formRef = ref<FormInstance>()
const lrzdRef = ref()
const checked1 = ref(false)
const checked2 = ref(false)
const checked3 = ref(false)
const checked4 = ref(false)
const checked5 = ref(false)
const props = defineProps(['blmb', 'ksData'])
const adminInfo = useAdminInfo()

const form = reactive({
    MBMC: '', //模板名称
    MBGS: '', //模板归属
    ZS: '', //主诉
    XBS: '', //现病史
    JWS: '', //既往史
    GMS: '', //过敏史
})
const state: {
    show: boolean
    mbxx: any
    blzdmb: any
} = reactive({
    show: false,
    mbxx: null,
    blzdmb: [],
})
const onLrzd = () => {
    lrzdRef.value.show()
}

watch(
    () => state.show,
    (val) => {
        if (val) {
            state.mbxx = props.blmb
        }
    }
)

const validateMBGS = (rule: any, value: any, callback: any) => {
    value = state.mbxx.MBFL
    if (value != 1 && value != 2 && value != 3) {
        callback(new Error(''))
    } else {
        callback()
    }
}

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    MBMC: [{ required: true, message: '模板名称不能为空', trigger: 'blur' }],
    MBGS: [{ required: true, validator: validateMBGS, trigger: 'blur' }],
})

const submitForm = async (formEl: FormInstance | undefined) => {
    // 借鉴的成员
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            const num = parseInt(state.mbxx.MBFL)
            let data = {
                agrs: {
                    MBMC: state.mbxx.MBMC,
                    CJKSBM: props.ksData,
                    CJYSBM: adminInfo.rybm,
                    ZS: state.mbxx.ZS,
                    XBS: state.mbxx.XBS,
                    JWS: state.mbxx.JWS,
                    MBFL: num,
                },
            }
            saveBlmb(data).then((res: any) => {
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
const cancel = () => {
    state.show = false
}

const show = () => {
    state.show = true
}
const init = (data: any) => {
    state.mbxx = data
}

onMounted(() => {})

defineExpose({
    show,
    init,
})
</script>
<style scoped lang="scss">
:deep(.el-dialog__body) {
    height: 750px;
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
.zt {
    margin-left: 10px;
    color: black;
    font-weight: bold;
}
.btn {
    margin-left: 18px;
    margin-bottom: 6px;
    border-bottom: 1px solid #1c90ff;
    border-radius: 0;
}
.content {
    margin-left: 20px;
    display: flex;
    align-items: center; /* 垂直居中 */
    justify-content: center; /* 水平居中 */
    height: 30px;
    background-color: #eeeeee;
    background-position: top 20px;
    margin-top: 10px;
}
.zdlx-tag,
.zdlx-font1,
.zdlx-font2,
.question-mark {
    display: inline-block;
    vertical-align: middle; /* 垂直居中 */
}
.zdlx-tag {
    margin-left: 10px;
    font-size: 12px;
    background-color: #7299bc;
    color: #fff;
    padding: 2px;
}
.zdlx-tag2 {
    font-size: 12px;
    background-color: #7299bc;
    color: #fff;
    padding: 2px;
}
.zdlx-font1 {
    margin-left: 5px;
    font-size: 12px;
    color: #add8e6;
}
.zdlx-font2 {
    margin-left: 5px;
    font-size: 12px;
    color: black;
}
.question-mark {
    color: black;
}

.question-mark::before {
    content: '?';
    display: inline-block;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    text-align: center;
    background-color: white;
    color: red;
    border: 1px solid red;
    margin-right: 3px;
}
.title1 {
    margin-top: 15px;
}
.title2 {
    margin-top: 5px;
}
.content1 {
    margin-left: -30px;
}
</style>
