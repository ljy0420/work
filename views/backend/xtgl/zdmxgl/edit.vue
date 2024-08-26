<template>
    <div>
        <el-dialog class="ba-operate-dialog" :close-on-click-modal="false"
            :model-value="['Add', 'Edit'].includes(baTable.form.operate!)" @close="baTable.toggleForm"
            :destroy-on-close="true" align-center width="600px">
            <template #header>
                <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">
                    {{ baTable.form.operate == 'Add' ? '字典信息-新增' : '字典信息-修改' }}
                </div>
            </template>
            <el-scrollbar v-loading="baTable.form.loading" class="ba-table-form-scrollbar">
                <div class="ba-operate-form yd-input-round" :class="'ba-' + baTable.form.operate + '-form'"
                    :style="'width: calc(100% - ' + baTable.form.labelWidth! / 2 + 'px)'">
                    <el-form ref="formRef" :model="baTable.form.items" label-position="right"
                        :label-width="baTable.form.labelWidth + 'px'" :rules="rules" v-if="!baTable.form.loading">
                        <el-row :gutter="2">
                            <el-col :xs="24" :sm="12">
                                <el-form-item prop="BM" label="编码">
                                    <el-input v-model="baTable.form.items!.BM" type="string" placeholder="请输入编码"
                                        :disabled="baTable.form.operate == 'Edit'"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="12">
                                <el-form-item prop="MC" label="名称">
                                    <el-input v-model="baTable.form.items!.MC" type="string" @change="mChange"
                                        placeholder="请输入名称"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="2">
                            <el-col :xs="24" :sm="12">
                                <el-form-item prop="PYM" label="拼音码">
                                    <el-input v-model="baTable.form.items!.PYM" type="string"
                                        placeholder="请输入拼音码"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="12">
                                <el-form-item prop="WBM" label="五笔码">
                                    <el-input v-model="baTable.form.items!.WBM" type="string"
                                        placeholder="请输入五笔码"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="2">
                            <el-col :xs="24" :sm="12">
                                <el-form-item prop="ZBM" label="自编码">
                                    <el-input v-model="baTable.form.items!.ZBM" type="string"
                                        placeholder="请输入自编码"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="12">
                                <el-form-item prop="GBM" label="国标码">
                                    <el-input v-model="baTable.form.items!.GBM" type="string"
                                        placeholder="请输入国标码"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="2">
                            <el-col :xs="24" :sm="12">
                                <el-form-item prop="PXH" label="排序号">
                                    <el-input v-model="baTable.form.items!.PXH" type="number"
                                        placeholder="请输入排序号"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="12">
                                <FormItem label="是否默认" v-model="baTable.form.items!.SFMR" type="radio"
                                    :data="{ content: { '0': '否', '1': '是' }, childrenAttr: { border: true } }" />
                            </el-col>
                        </el-row>
                        <el-form-item prop="BZ" label="备注">
                            <el-input v-model="baTable.form.items!.BZ" type="string" placeholder="请输入备注"></el-input>
                        </el-form-item>
                        <el-row :gutter="2">
                            <el-col :xs="24" :sm="12"></el-col>
                            <el-col :xs="24" :sm="12"></el-col>
                        </el-row>
                        <FormItem label="状态" v-model="baTable.form.items!.YXZT" type="radio"
                            :data="{ content: { '0': '禁用', '1': '启用' }, childrenAttr: { border: true } }" />
                    </el-form>
                </div>
            </el-scrollbar>
            <template #footer>
                <div class="yd-from-footer">
                    <el-button v-blur :loading="baTable.form.submitLoading" @click="submitForm(formRef)" type="primary"
                        class="btn-form-save">
                        {{ baTable.form.operateIds && baTable.form.operateIds.length > 1 ? '保存并编辑下一条' : '保存' }}
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
import FormItem from '/@/components/formItem/index.vue'
import type { FormInstance, FormItemRule } from 'element-plus'
import { getPymWbm } from '/@/api/common'

const formRef = ref<FormInstance>()
const baTable = inject('baTable') as baTableClass

const mChange = (value: string) => {
    getPymWbm({ agrs: value }).then((res) => {
        baTable.form.items!.PYM = res.data.PYM
        baTable.form.items!.WBM = res.data.WBM
    })
}

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    MC: [{ required: true, message: '名称不能为空' }],
    BM: [{ required: true, message: '编码不能为空' }]
})

const submitForm = async (formEl: FormInstance | undefined) => {
    // 借鉴的成员
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            baTable.form.items!.BM = baTable.form.items!.BM.trim()
            //console.log(baTable.form.items)
            baTable.onSubmit(formEl)
        } else {
            console.log('error submit!', fields)
        }
    })
}

</script>

<style scoped lang="scss">
:deep(.el-dialog__body) {
    height: 390px;
}
</style>