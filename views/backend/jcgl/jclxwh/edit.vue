<template>
    <!-- 对话框表单 -->
    <el-dialog class="ba-operate-dialog jcxl-edit" :close-on-click-modal="false"
        :model-value="['Add', 'Edit'].includes(baTable.form.operate!)" @close="baTable.toggleForm" :destroy-on-close="true"
        width="500px"  align-center>
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']">
                {{ baTable.form.operate == 'Add' ? '检查类型-新增' : '检查类型-修改' }}
            </div>
        </template>
        <el-scrollbar v-loading="baTable.form.loading" class="ba-table-form-scrollbar">
            <div class="ba-operate-form yd-input-round" :class="'ba-' + baTable.form.operate + '-form'"
                :style="'width: calc(100% - ' + baTable.form.labelWidth! / 2 + 'px)'">
                <el-form ref="  " :model="baTable.form.items" label-position="right"
                    :label-width="baTable.form.labelWidth + 'px'" :rules="rules" v-if="!baTable.form.loading">
                    <!-- <el-form-item prop="JGBM" label="机构编码">
                        <el-input v-model="baTable.form.items!.JGBM" type="string" placeholder="请输入机构编码"></el-input>
                    </el-form-item> -->
                    <el-form-item prop="BM" label="编码">
                        <el-input v-model="baTable.form.items!.BM" type="string" placeholder="请输入编码"></el-input>
                    </el-form-item>
                    <el-form-item prop="MC" label="名称">
                        <el-input v-model="baTable.form.items!.MC" type="string" @change="mChange"
                            placeholder="请输入名称"></el-input>
                    </el-form-item>
                    <el-form-item prop="PYM" label="拼音码">
                        <el-input v-model="baTable.form.items!.PYM" type="string" placeholder="请输入拼音码"></el-input>
                    </el-form-item>
                    <FormItem label="建病案:" v-model="baTable.form.items!.JBA" type="radio"
                        :data="{ content: { '0': '否', '1': '是' }, childrenAttr: { border: true } }" />
                </el-form>
            </div>
        </el-scrollbar>
        <template #footer>
            <div class="yd-from-footer">
                <el-button v-blur :loading="baTable.form.submitLoading" @click="baTable.onSubmit(formRef)" type="primary"
                    class="btn-form-save">
                    {{ baTable.form.operateIds && baTable.form.operateIds.length > 1 ? '保存并编辑下一条' : '保存' }}
                </el-button>
                <el-button @click="baTable.toggleForm('')" class="btn-form-cancel">取消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, inject } from 'vue'
import type baTableClass from '/@/utils/baTable'
import FormItem from '/@/components/formItem/index.vue'
import type { FormInstance, FormItemRule } from 'element-plus'
import { buildValidatorData } from '/@/utils/validate'
import { getPymWbm } from '/@/api/common'

const formRef = ref<FormInstance>()
const baTable = inject('baTable') as baTableClass

const mChange = (value: string) => {
    //console.log(value)
    getPymWbm({ agrs: value }).then((res) => {
        baTable.form.items!.PYM = res.data.PYM
    })
}

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    JGBM: [buildValidatorData({ name: 'required', message: '报销名称不能为空.' })],
    BM: [buildValidatorData({ name: 'required', message: '编码不能为空.' })],
    MC: [buildValidatorData({ name: 'required', message: '名称不能为空.' })],

})

</script>

<style scoped lang="scss"></style>