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
            width="600px"
        >
            <template #header>
                <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']">
                    {{ '存为模板' }}
                </div>
            </template>
            <div class="top">
                <el-form :model="form" label-width="100px" :rules="rules" ref="ruleFormRef">
                    <el-form-item prop="MBMC" label="模板名称:">
                        <el-input v-model="form.MBMC" type="string" placeholder="请输入模板名称" style="width: 80%" />
                    </el-form-item>
                    <el-form-item prop="MBGS" label="模板归属:">
                        <el-radio-group v-model="checked">
                            <el-radio v-model="form.MBGS" :label="1">个人模板</el-radio>
                            <el-radio v-model="form.MBGS" :label="2">科室模板</el-radio>
                            <el-radio v-model="form.MBGS" :label="3">全院模板</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <div class="yd-from-footer">
                    <el-button type="primary" @submit="submitForm(formRef)">保存</el-button>
                    <el-button @click="cancel">取消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormItemRule } from 'element-plus'

const formRef = ref<FormInstance>()
const checked = ref(1)
const form = reactive({
    MBMC: '',
    MBGS: '',
})
const state: {
    show: boolean
} = reactive({
    show: false,
})

// const validateMBGS = (rule: any, value: any, callback: any) => {
//     console.log(value)

//     if (value === '' || value === 0 || value === undefined) {
//         callback(new Error(''))
//     } else {
//         callback()
//     }
// }

const rules = reactive({
    MBMC: [{ required: true, message: '模板名称不能为空', trigger: 'blur' }],
    MBGS: [{ required: true, message: '模板归属不能为空', trigger: 'change' }],
})

const submitForm = async (formEl: FormInstance | undefined) => {
    // 借鉴的成员
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
        }
    })
}

const cancel = () => {
    state.show = false
}

const show = () => {
    state.show = true
}

onMounted(() => {})

defineExpose({
    show,
})
</script>
<style scoped lang="scss">
:deep(.el-dialog__body) {
    height: 200px;
}
.top {
    margin-top: 30px;
}
</style>
