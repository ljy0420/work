<template>
    <el-dialog
        class="ba-operate-dialog"
        :close-on-click-modal="false"
        :model-value="visible"
        @close="ssflEditColse"
        :destroy-on-close="true"
        align-center
        width="600px"
    >
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">
                {{ prop.opt === 'Edit' ? '修改' : '新增' }}
            </div>
        </template>
        <div class="ba-operate-form ba-edit-form" :style="'width: calc(100% - ' + 100 / 2 + 'px)'">
            <el-form ref="formRef" :model="prop.rowdata" label-position="right" :label-width="'100px'" :rules="rules">
                <el-form-item prop="FLMC" label="分类名称">
                    <el-input type="string" v-model="prop.rowdata!.FLMC" @change="mChange" placeholder="请输入分类名称"></el-input>
                </el-form-item>
                <el-form-item prop="FLBM" label="分类编码">
                    <el-input type="string" v-model="prop.rowdata!.FLBM" placeholder="请输入分类编码"></el-input>
                </el-form-item>
                <el-form-item prop="SJBM" label="上级编码">
                    <el-select v-model="prop.rowdata!.SJBM" placeholder="请选择上级编码" clearable style="width: 100%">
                        <el-option v-for="opt in fbOptions" :key="opt.FLBM" :label="opt.SJBM" :value="opt.SJBM"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="PYM" label="拼音码">
                    <el-input type="string" v-model="prop.rowdata!.PYM" placeholder="请输入拼音码"></el-input>
                </el-form-item>
                <el-form-item prop="WBM" label="五笔码">
                    <el-input type="string" v-model="prop.rowdata!.WBM" placeholder="请输入五笔码"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <div class="yd-from-footer">
                <el-button v-blur type="primary" @click="submitForm(formRef)" class="btn-form-save"> 保存 </el-button>
                <el-button @click="cancelHandle" class="btn-form-cancel">取消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { FormInstance, FormItemRule } from 'element-plus'
import { addFenLei, editFenLei } from '/@/api/backend/jcgl/jcbwsz'
import { getPymWbm } from '/@/api/common'

const formRef = ref<FormInstance>()

const prop = defineProps(['visible', 'opt', 'fldata', 'rowdata'])

const emit = defineEmits(['closeFlEdit', 'saveFlEdit'])

const ssflEditColse = (e: any) => {
    emit('closeFlEdit', e)
}

const cancelHandle = (e: any) => {
    emit('closeFlEdit', e)
}

let fbOptions: any = []
watch(
    () => prop.visible,
    (val) => {
        if (val) {
            fbOptions = prop.fldata
        }
    }
)

const mChange = (value: string) => {
    getPymWbm({ agrs: value }).then((res) => {
        prop.rowdata!.PYM = res.data.PYM
        prop.rowdata!.WBM = res.data.WBM
    })
}

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    FLBM: [{ required: true, message: '分类编码不能为空', trigger: 'blur' }],
    FLMC: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }],
})
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            if (prop.opt === 'Add') {
                addFenLei(prop.rowdata).then((res) => {
                    emit('saveFlEdit', res)
                })
            } else if (prop.opt === 'Edit') {
                editFenLei(prop.rowdata).then((res) => {
                    emit('saveFlEdit', res)
                })
            }
        } else {
            console.log('error submit!', fields)
        }
    })
}
</script>
<style scoped lang="scss"></style>
