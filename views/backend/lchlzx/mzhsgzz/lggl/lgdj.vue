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
                    {{ '留观登记' }}
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
                                <el-form-item prop="LGDJ" label="留观登记：">
                                    <el-select v-model="form.LGDJ" clearable style="width: 150px" disabled>
                                        <el-option v-for="opt in state.lgdjArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="0" v-if="props.brxx.XM != ''">
                            <el-col :xs="12" :sm="12">
                                <el-form-item prop="ZWXZ" label="座位选择：">
                                    <el-input v-model="form.ZWXZ" type="string" style="width: 180px" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </div>
            <template #footer>
                <div class="yd-from-footer">
                    <el-button type="primary" @submit="submitForm(formRef)">确定</el-button>
                    <el-button @click="cancel">关闭</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormItemRule } from 'element-plus'
const props = defineProps(['brxx'])
const formRef = ref<FormInstance>()
const form = reactive({
    BRXM: '',
    LGDJ: 1,
    ZWXZ: '',
})
const state: {
    show: boolean
    lgdjArr: any
} = reactive({
    show: false,
    lgdjArr: [
        { BM: 1, MC: '留观' },
        { BM: 2, MC: '留观结束' },
    ],
})

const rules = reactive({
    BRXM: [{ required: true, message: '病人姓名不能为空', trigger: 'blur' }],
    LGDJ: [{ required: true, message: '留观登记不能为空', trigger: 'change' }],
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
    console.log(props.brxx)

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
    height: 200px;
}
.top {
    height: 110px;
    border: 1px solid #eeeeee;
    margin-top: 20px;
    .top-content {
        margin-top: 10px;
    }
}
</style>
