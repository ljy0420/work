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
                <div class="content">
                    <div class="zd">
                        <span class="font">诊断：</span>
                        <div class="xyzd">
                            <span class="zdlx-tag">西</span><span class="zdlx-font1">主诊:1型糖尿病伴有周围循环并发症;</span
                            ><span class="question-mark">机动车辆和两轮或三轮机动车之间碰撞造成的人员损伤,非交通性的,其他的;</span>
                        </div>
                    </div>
                    <div class="zyzd">
                        <span class="zdlx-tag2">中</span><span class="zdlx-font1">主诊:伤寒;</span
                        ><span class="zdlx-font2">鼻塞;症候;膀胱湿热气滞证;</span>
                    </div>
                </div>
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
    height: 300px;
}
.top {
    margin-top: 30px;
}

.content {
    align-items: center; /* 垂直居中 */
    justify-content: center; /* 水平居中 */
    height: 100px;
    width: 600px;
    margin-left: -20px;
    margin-top: 10px;
    background: #eeeeee;
    .zd {
        display: flex;
        position: relative;
        top: 10px;
        margin-left: 30px;
        width: 530px;
        .font {
            width: 50px;
            margin-right: 60px;
            font-weight: bold;
            color: black;
        }
        .xyzd {
            margin-left: -70px;
            width: 480px;
            .zdlx-tag {
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
        }
    }
    .font,
    .xyzd {
        display: inline-block;
    }
    .zyzd {
        margin-top: 30px;
        margin-left: 70px;
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
    }
}
</style>
