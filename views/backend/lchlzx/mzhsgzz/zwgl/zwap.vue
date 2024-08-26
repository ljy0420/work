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
                    {{ '安排座位' }}
                </div>
            </template>
            <div class="top">
                <div class="top-content">
                    <el-form :model="form" label-width="100px" :rules="rules" ref="ruleFormRef">
                        <el-row :gutter="0">
                            <el-col :xs="12" :sm="12">
                                <el-form-item prop="BRXM" label="病人姓名：">
                                    <el-input
                                        v-model="form.BRXM"
                                        type="string"
                                        placeholder="请输入病人名称"
                                        style="width: 180px"
                                        :disabled="props.brxx.XM != ''"
                                    />
                                </el-form-item>
                            </el-col>
                            <el-col :xs="12" :sm="12">
                                <el-form-item prop="ZWMC" label="座位名称：">
                                    <el-input v-model="form.ZWMC" type="string" placeholder="请输入座位名称" style="width: 180px">
                                        <template #append> <el-button :icon="More" /> </template
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </div>
            <template #footer>
                <div class="yd-from-footer">
                    <el-button type="primary" @submit="submitForm(formRef)" class="save">保存</el-button>
                    <el-button @click="cancel">取消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormItemRule } from 'element-plus'
import { More } from '@element-plus/icons-vue'
const props = defineProps(['brxx'])
const formRef = ref<FormInstance>()
const form = reactive({
    BRXM: '',
    ZWMC: '',
})
const state: {
    show: boolean
    zwmcArr: any
} = reactive({
    show: false,
    zwmcArr: [],
})

const rules = reactive({
    BRXM: [{ required: true, message: '病人姓名不能为空', trigger: 'blur' }],
    ZWMC: [{ required: true, message: '座位名称不能为空', trigger: 'change' }],
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
    form.BRXM = props.brxx.XM
    state.show = true
}

onMounted(() => {})

defineExpose({
    show,
})
</script>
<style scoped lang="scss">
:deep(.el-dialog__body) {
    height: 150px;
}
.top {
    height: 70px;
    border: 1px solid #eeeeee;
    margin-top: 20px;
    .top-content {
        margin-top: 10px;
    }
}
.save {
    margin-right: 20px;
}
</style>
