<template>
    <!-- 对话框表单 -->
    <el-dialog
        class="ba-operate-dialog jcbwfl-edit"
        :close-on-click-modal="false"
        :model-value="['Add', 'Edit'].includes(baTable.form.operate!)"
        @close="baTable.toggleForm"
        :destroy-on-close="true"
        align-center
        width="600px"
    >
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">
                {{ baTable.form.operate == 'Add' ? '新增分类' : '修改分类' }}
            </div>
        </template>
        <div
            v-loading="baTable.form.loading"
            class="ba-operate-form yd-input-round"
            :class="'ba-' + baTable.form.operate + '-form'"
            :style="'width: calc(100% - ' + baTable.form.labelWidth! / 2 + 'px)'"
        >
            <el-form
                ref="formRef"
                :model="baTable.form.items"
                label-position="right"
                :label-width="baTable.form.labelWidth + 'px'"
                :rules="rules"
                v-if="!baTable.form.loading"
            >
                <el-form-item prop="SJBM" label="上级分类">
                    <el-tree-select 
                    v-model="baTable.form.items!.SJBM"
                    :data="state.sjData"
                    check-strictly
                    filterable
                    :render-after-expand="false"
                    :props="{label:'FLMC',value:'FLBM'}"
                    style="width: 100%;">
                    </el-tree-select>
                </el-form-item>
                <el-form-item prop="FLBM" label="分类编码">
                    <el-input v-model="baTable.form.items!.FLBM" type="string" placeholder="请输入分类编码" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item prop="FLMC" label="分类名称">
                    <el-input v-model="baTable.form.items!.FLMC" @change="mChange" type="string" placeholder="请输入分类名称"></el-input>
                </el-form-item>
                <el-form-item prop="PYM" label="拼音码">
                    <el-input v-model="baTable.form.items!.PYM" type="string" placeholder="请输入拼音码"></el-input>
                </el-form-item>
                <el-form-item prop="WBM" label="五笔码">
                    <el-input v-model="baTable.form.items!.WBM" type="string" placeholder="请输入五笔码"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <div class="yd-from-footer">
                <el-button v-blur :loading="baTable.form.submitLoading" @click="submitForm(formRef)" type="primary" class="btn-form-save">
                    保存
                </el-button>
                <el-button @click="baTable.toggleForm('')" class="btn-form-cancel">取消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, inject, watch } from 'vue'
import type baTableClass from '/@/utils/baTable'
import type { FormInstance, FormItemRule } from 'element-plus'
import { getPymWbm } from '/@/api/common'

const prop = defineProps(['flData'])

const state: {
    sjData: any //上级分类数据
} = reactive({
    sjData: prop.flData,
})

const formRef = ref<FormInstance>()
const baTable = inject('baTable') as baTableClass

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    FLMC: [{ required: true, message: '分类名称不能为空' }],
})

watch(
    () => baTable.form.operate,
    () => {
        state.sjData = baTable.table.data
    }
)

const mChange = (value: string) => {
    getPymWbm({ agrs: value }).then((res) => {
        baTable.form.items!.PYM = res.data.PYM
        baTable.form.items!.WBM = res.data.WBM
    })
}

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            if(!baTable.form.items!.SJBM) {
                baTable.form.items!.SJBM = '0'
            }
            let data = {
                agrs: baTable.form.items
            }
            baTable.onSubmitData(data, (res: any) => {
                if (res.code == 1) {
                }
            })
        } else {
            console.log('error submit!', fields)
        }
    })
}

</script>

<style scoped lang="scss"></style>
