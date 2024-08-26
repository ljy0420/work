<template>
    <div>
        <el-dialog
        class="ba-operate-dialog hwgl-eidt"
        :close-on-click-modal="false"
        :model-value="['Add', 'Edit'].includes(baTable.form.operate!)"
        @close="baTable.toggleForm"
        :destroy-on-close="true"
        width="720px"
    >
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']">
                {{ baTable.form.operate == 'Add' ? '货位-新增' : '货位-修改' }}
            </div>
        </template>
        <el-scrollbar v-loading="baTable.form.loading" class="ba-table-form-scrollbar">
            <div
                class="ba-operate-form"
                :class="'ba-' + baTable.form.operate + '-form'"
                :style="'width: calc(100% - ' + baTable.form.labelWidth! / 2 + 'px)'"
            >
                <el-form
                    ref="formRef"
                    :inline="true"
                    :model="baTable.form.items"
                    label-position="right"
                    :label-width="baTable.form.labelWidth + 'px'"
                    :rules="rules"
                    v-if="!baTable.form.loading"
                >
                <el-form-item label="货位库房">
                    <el-select v-model="baTable.form.items!.KFBM" filterable placeholder="请选择货位库房" clearable style="width: 100%">
                        <el-option v-for="opt in prop.yfykArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="货位编码">
                    <el-input v-model="baTable.form.items!.HWBM" disabled type="string" placeholder="请输入货位编码"></el-input>
                </el-form-item>
                <el-form-item label="货位名称" prop="HWMC">
                    <el-input v-model="baTable.form.items!.HWMC" type="string" @change="mChange" style="width: 537px" placeholder="请输入货位名称"></el-input>
                </el-form-item>
                <el-form-item label="拼音码">
                    <el-input v-model="baTable.form.items!.PYM" type="string" placeholder="请输入拼音码"></el-input>
                </el-form-item>
                <el-form-item label="五笔码">
                    <el-input v-model="baTable.form.items!.WBM" type="string" placeholder="请输入五笔码"></el-input>
                </el-form-item>
                <el-form-item label="排序号" prop="PXH">
                    <el-input v-model="baTable.form.items!.PXH" type="string" placeholder="请输入排序号"></el-input>
                </el-form-item>
                <el-form-item label="上级编码">
                    <el-cascader
                        style="width: 100%"
                        v-model="baTable.form.items!.SJBM"
                        :props="defaultProps"
                        :options="prop.tableData"
                        :show-all-levels="false"
                        filterable
                        placeholder="请选择"
                    />
                </el-form-item>
                </el-form>
            </div>
        </el-scrollbar>
        <template #footer>
            <div class="yd-from-footer">
                <el-button v-blur :loading="baTable.form.submitLoading" @click="submitForm(formRef)" type="primary" class="btn-form-save">
                    保存
                </el-button>
                <el-button @click="baTable.toggleForm('')" class="btn-form-cancel">取消</el-button>
            </div>
        </template>
    </el-dialog>
    </div>
    
</template>

<script setup lang="ts">
import { reactive, ref, inject } from 'vue'
import type baTableClass from '/@/utils/baTable'
import type { FormInstance, FormItemRule } from 'element-plus'
import { buildValidatorData } from '/@/utils/validate'
import { getPymWbm } from '/@/api/common'

const formRef = ref<FormInstance>()
const baTable = inject('baTable') as baTableClass

const prop = defineProps(['yfykArr', 'tableData'])

const defaultProps = {
    checkStrictly: true,
    emitPath: false,
    multiple: false,
    label: 'HWMC',
    value: 'HWBM',
}

const mChange = (value: string) => {
    getPymWbm({agrs:value}).then((res)=>{
        baTable.form.items!.PYM = res.data.PYM
        baTable.form.items!.WBM = res.data.WBM
    })
}

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    PXH: [buildValidatorData({ name: 'required', title: '排序号不能为空.' })],
    HWMC: [buildValidatorData({ name: 'required', title: '货位名称不能为空.' })],
})

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            baTable.form.items!.HWBM = baTable.form.items!.HWBM.trim()
            baTable.onSubmit(formEl)
        } else {
            console.log('error submit!', fields)
        }
    })
}

</script>

<style scoped lang="scss">
:deep(.el-dialog__body) {
    height: 300px;
}
</style>