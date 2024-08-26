<template>
    <!-- 对话框表单 -->
    <el-dialog
        class="ba-operate-dialog ksb-edit"
        :close-on-click-modal="false"
        :model-value="['Add', 'Edit'].includes(baTable.form.operate!)"
        @close="baTable.toggleForm"
        :destroy-on-close="true"
        align-center
        width="600px"
    >
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">
                {{ baTable.form.operate == 'Add' ? '卡设备信息-新增' : '卡设备信息-修改' }}
            </div>
        </template>
        <el-scrollbar v-loading="baTable.form.loading" class="ba-table-form-scrollbar">
            <div
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
                    <el-form-item prop="CARDTYPE" label="卡类型">
                        <el-select
                            v-model="baTable.form.items!.CARDTYPE"
                            placeholder="请选择卡类型"
                            clearable
                            style="width: 100%;"
                            >
                            <el-option v-for="opt in klxOptions" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="CARDDRIVE" label="卡驱动名称">
                        <el-select
                            v-model="baTable.form.items!.CARDDRIVE"
                            placeholder="请选择卡类型"
                            clearable
                            style="width: 100%;"
                            >
                            <el-option v-for="opt in kqdOptions" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <FormItem
                        label="是否使用"
                        v-model="baTable.form.items!.ENABLESIGN"
                        type="radio"
                        :data="{ content: { '否': '否', '是': '是' }, childrenAttr: { border: true } }"
                    />
                    <el-form-item label="使用范围">
                        <el-checkbox-group v-model="state.syfw">
                            <el-checkbox label="1.门诊挂号" name="SYFW" />
                            <el-checkbox label="2.门诊划价收费" name="SYFW" />
                            <el-checkbox label="3.门诊医生工作站" name="SYFW" />
                            <el-checkbox label="4.入院登记" name="SYFW" />
                            <el-checkbox label="5.门诊药房" name="SYFW" />
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
            </div>
        </el-scrollbar>
        <template #footer>
            <div class="yd-from-footer">
                <el-button v-blur :loading="baTable.form.submitLoading" @click="onSubmit(formRef)" type="primary" class="btn-form-save">
                    {{ baTable.form.operateIds && baTable.form.operateIds.length > 1 ? '保存并编辑下一条' : '保存' }}
                </el-button>
                <el-button @click="baTable.toggleForm('')" class="btn-form-cancel">取消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, inject, watch } from 'vue'
import type baTableClass from '/@/utils/baTable'
import FormItem from '/@/components/formItem/index.vue'
import type { FormInstance, FormItemRule } from 'element-plus'
import { buildValidatorData } from '/@/utils/validate'

const state = reactive({
    syfw: []
})

const klxOptions = [
    { value: '健康卡', label: '健康卡' },
    { value: '诊疗卡', label: '诊疗卡' },
    { value: '身份证', label: '身份证' },
    { value: '医保', label: '医保' },
    { value: '国家医保', label: '国家医保' }
]

const kqdOptions = [
    { value: 'C_驱动_读卡器Base', label: 'C_驱动_读卡器Base' },
    { value: 'C_会同县荣士读卡器驱动', label: 'C_会同县荣士读卡器驱动' },
    { value: 'C_华容县德卡D3驱动', label: 'C_华容县德卡D3驱动' },
    { value: 'C_山东济宁德卡T10驱动', label: 'C_山东济宁德卡T10驱动' },
    { value: 'C_山东济宁神思SS728M05驱动', label: 'C_山东济宁神思SS728M05驱动' },
    { value: 'C_广州龙洞磁条卡', label: 'C_广州龙洞磁条卡' },
    { value: 'C_驱动_SJE金牌磁条', label: 'C_驱动_SJE金牌磁条' },
    { value: 'C_驱动_测试手工输入管理', label: 'C_驱动_测试手工输入管理' },
    { value: 'C_驱动_磁条卡', label: 'C_驱动_磁条卡' },
    { value: 'C_健康卡_默认', label: 'C_健康卡_默认' },
    { value: 'C_身份证_华视身份证CVR_100UC', label: 'C_身份证_华视身份证CVR_100UC' },
    { value: 'C_身份证_湖南多卡合一', label: 'C_身份证_湖南多卡合一' },
    { value: 'C_身份证_医保读卡驱动', label: 'C_身份证_医保读卡驱动' },
    { value: 'C_医保_国家医保', label: 'C_医保_国家医保' }
]

const formRef = ref<FormInstance>()
const baTable = inject('baTable') as baTableClass

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    CARDDRIVE: [buildValidatorData({ name: 'required', message: '卡驱动名称不能为空.' })],
})

watch(
    () => baTable.form.items!.CARDNO,
    () => {
        if(baTable.form.items!.ENABLEMODLE) {
            let arr = baTable.form.items!.ENABLEMODLE.split(',')
            state.syfw = arr
        } else {
            state.syfw = []
        }
    }
)

const onSubmit = (form: any) => {
    if(state.syfw.length>0) {
        let syfw = state.syfw.join(',')
        baTable.form.items!.ENABLEMODLE = syfw
    } else {
        baTable.form.items!.ENABLEMODLE = ''
    }
    if(baTable.form.items!.ENABLESIGN=='是'){
        baTable.form.items!.ENABLESIGN = 'True'
    } else {
        baTable.form.items!.ENABLESIGN = 'False'
    }
    baTable.onSubmit(form)
}

</script>

<style scoped lang="scss">
</style>