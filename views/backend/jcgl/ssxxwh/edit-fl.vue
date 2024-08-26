<template>
    <el-dialog 
    class="ba-operate-dialog ssfl-edit" 
    :close-on-click-modal="false" 
    :model-value="visible" 
    @close="ssflEditColse"
    :destroy-on-close="true" 
    align-center
    width="600px">
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">
                {{ prop.opt === 'Edit'? '手术分类-修改':'手术分类-新增' }}
            </div>
        </template>
        <el-scrollbar class="ba-table-form-scrollbar">
            <div class="ba-operate-form ba-edit-form" :style="'width: calc(100% - ' + 100 / 2 + 'px)'">
            <el-form ref="formRef" :model="prop.rowdata" label-position="right" :label-width="'100px'" :rules="rules">
                <el-form-item prop="FLMC" label="分类名称">
                    <el-input type="string" v-model="prop.rowdata!.FLMC" @change="mChange" placeholder="请输入分类名称"></el-input>
                </el-form-item>
                <el-form-item prop="FLBM" label="分类编码">
                    <el-input type="string" v-model="prop.rowdata!.FLBM" placeholder="请输入分类编码"></el-input>
                </el-form-item>
                <el-form-item prop="PYM" label="拼音码">
                    <el-input type="string" v-model="prop.rowdata!.PYM" placeholder="请输入拼音码"></el-input>
                </el-form-item>
                <el-form-item prop="WBM" label="五笔码">
                    <el-input type="string" v-model="prop.rowdata!.WBM" placeholder="请输入五笔码"></el-input>
                </el-form-item>
                <FormItem
                        label="是否常用"
                        v-model="prop.rowdata!.SFCY"
                        type="radio"
                        :data="{ content: { '1': '是', '0': '否' }, childrenAttr: { border: true } }"
                    />
                <FormItem
                        label="是否删除"
                        v-model="prop.rowdata!.SCBZ"
                        type="radio"
                        :data="{ content: { '0': '否', '1': '是' }, childrenAttr: { border: true } }"
                    />
            </el-form>
        </div>
        </el-scrollbar>
        <template #footer>
            <div class="yd-from-footer">
                <el-button v-blur type="primary" @click="submitForm(formRef)" class="btn-form-save">
                    保存
                </el-button>
                <el-button @click="cancelHandle" class="btn-form-cancel">取消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">

import { reactive, ref } from 'vue'
import FormItem from '/@/components/formItem/index.vue'
import type { FormInstance, FormItemRule } from 'element-plus'
import { addFenLei, editFenLei } from '/@/api/backend/jcgl/ssxx'
import { getPymWbm } from '/@/api/common'

const formRef = ref<FormInstance>()

const prop = defineProps(['visible','opt','fldata','rowdata'])

const emit = defineEmits(["closeFlEdit","saveFlEdit"]);

const ssflEditColse = (e: any) => {
    emit('closeFlEdit', e)
}

const cancelHandle = (e: any) => {
    emit('closeFlEdit', e)
}

const mChange = (value: string) => {
    getPymWbm({agrs:value}).then((res)=>{
        prop.rowdata!.PYM = res.data.PYM
        prop.rowdata!.WBM = res.data.WBM
    })
}

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    FLBM: [{ required: true, message: '分类编码不能为空', trigger: 'blur' }],
    FLMC: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }]
})

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            if(prop.opt==='Add'){
                addFenLei(prop.rowdata).then((res)=>{
                    emit('saveFlEdit', res)
                })
            }else if(prop.opt==='Edit'){
                editFenLei(prop.rowdata).then((res)=>{
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