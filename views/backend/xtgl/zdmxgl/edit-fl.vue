<template>
    <el-dialog 
    class="ba-operate-dialog zdmxfl-edit" 
    :close-on-click-modal="false" 
    :model-value="visible" 
    @close="zdflEditColse"
    :destroy-on-close="true" 
    align-center
    width="600px">
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">
                {{ prop.opt === 'Edit'? '字典分类-修改' : '字典分类-新增' }}
            </div>
        </template>
        <div class="ba-operate-form ba-edit-form yd-input-round" :style="'width: calc(100% - ' + 100 / 2 + 'px)'">
            <el-form ref="formRef" :model="prop.rowdata" label-position="right" :label-width="'100px'" :rules="rules">
                <el-form-item prop="SJBM" label="上级分类">
                    <el-tree-select 
                    v-model="prop.rowdata!.SJBM"
                    :data="fldata"
                    check-strictly
                    filterable
                    :render-after-expand="false"
                    :props="{label:'FLMC',value:'FLBM'}"
                    style="width: 100%;">
                    </el-tree-select>
                </el-form-item>
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
                        label="状态"
                        v-model="prop.rowdata!.YXZT"
                        type="radio"
                        :data="{ content: { '0': '禁用', '1': '启用' }, childrenAttr: { border: true } }"
                    />
            </el-form>
        </div>
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
import { addFenLei, editFenLei } from '/@/api/backend/xtgl/zdmx'
import { getPymWbm } from '/@/api/common'

const formRef = ref<FormInstance>()

const prop = defineProps(['visible','opt','fldata','rowdata'])

const emit = defineEmits(["closeFlEdit","saveFlEdit"]);

const zdflEditColse = (e: any) => {
    emit('closeFlEdit', e)
}

const cancelHandle = (e: any) => {
    emit('closeFlEdit', e)
}

const mChange = (value: string) => {
    //console.log(value)
    getPymWbm({agrs:value}).then((res)=>{
        prop.rowdata!.PYM = res.data.PYM
        prop.rowdata!.WBM = res.data.WBM
    })
}

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    SJBM: [{ required: true, message: '上级分类不能为空', trigger: 'change' }],
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