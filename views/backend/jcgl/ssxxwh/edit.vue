<template>
    <!-- 对话框表单 -->
    <el-dialog
        class="ba-operate-dialog ssxx-edit"
        :close-on-click-modal="false"
        :model-value="['Add', 'Edit'].includes(baTable.form.operate!)"
        @close="baTable.toggleForm"
        :destroy-on-close="true"
        align-center
        width="600px"
    >
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">
                {{ baTable.form.operate == 'Add' ? '手术信息-新增' : '手术信息-修改' }}
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
                    v-if="!baTable.form.loading">
                    
                    <el-form-item prop="SSBM" label="手术编码">
                        <el-input
                            v-model="baTable.form.items!.SSBM"
                            type="string"
                            placeholder="请输入手术编码"
                        ></el-input>
                    </el-form-item> 
                    <el-form-item prop="SSMC" label="手术名称">
                        <el-input
                            v-model="baTable.form.items!.SSMC"
                            type="string"
                            @change="mChange"
                            placeholder="请输入手术名称"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="FLBM" label="手术分类">
                        <el-select
                            v-model="baTable.form.items!.FLBM"
                            placeholder="请选择手术分类"
                            clearable
                            style="width: 100%;"
                            >
                            <el-option v-for="opt in prop.fldata" :key="opt.FLBM" :label="opt.FLMC" :value="opt.FLBM"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="GBM" label="国标码">
                        <el-input
                            v-model="baTable.form.items!.GBM"
                            type="string"
                            placeholder="请输入国标码"
                        ></el-input>
                    </el-form-item> 
                    <el-form-item prop="PYM" label="拼音码">
                        <el-input
                            v-model="baTable.form.items!.PYM"
                            type="string"
                            placeholder="请输入拼音码"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="WBM" label="五笔码">
                        <el-input
                            v-model="baTable.form.items!.WBM"
                            type="string"
                            placeholder="请输入五笔码"
                        ></el-input>
                    </el-form-item> 
                     <FormItem
                        label="是否常用"
                        v-model="baTable.form.items!.SFCY"
                        type="radio"
                        :data="{ content: { '是': '是', '否': '否' }, childrenAttr: { border: true } }"
                    />
                     <FormItem
                        label="有效状态"
                        v-model="baTable.form.items!.YXZT"
                        type="radio"
                        :data="{ content: { '0': '禁用', '1': '启用' }, childrenAttr: { border: true } }"
                    />
                </el-form>
            </div>
        </el-scrollbar>
        <template #footer>
            <div class="yd-from-footer">
                <el-button v-blur :loading="baTable.form.submitLoading" @click="baTable.onSubmit(formRef)" type="primary" class="btn-form-save">
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

const prop = defineProps(['fldata'])

const formRef = ref<FormInstance>()
const baTable = inject('baTable') as baTableClass

const mChange = (value: string) => {
    getPymWbm({agrs:value}).then((res)=>{
        baTable.form.items!.PYM = res.data.PYM
        baTable.form.items!.WBM = res.data.WBM
    })
}

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    SSBM: [buildValidatorData({ name: 'required', message: '手术编码不能为空' })],
    SSMC: [buildValidatorData({ name: 'required', message: '手术名称不能为空' })],
})

</script>

<style scoped lang="scss">
</style>