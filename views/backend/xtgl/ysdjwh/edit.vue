<template>
    <!-- 对话框表单 -->
    <el-dialog
        class="ba-operate-dialog"
        :close-on-click-modal="false"
        :model-value="['Add', 'Edit'].includes(baTable.form.operate!)"
        @close="baTable.toggleForm"
        :destroy-on-close="true"
        align-center
        width="600px"
    >
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">
                {{ baTable.form.operate == 'Add' ? '样式登记-新增' : '样式登记-修改' }}
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
                    <el-form-item prop="YSLX" label="样式类型">
                        <el-select v-model="baTable.form.items!.YSLX" filterable placeholder="请选择样式类型" clearable style="width: 100%">
                            <el-option v-for="opt in yslxOptions" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="YSMC" label="样式名称">
                        <el-input
                            v-model="baTable.form.items!.YSMC"
                            type="string"
                            placeholder="请输入名称"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="SM" label="说明">
                        <el-input
                            v-model="baTable.form.items!.SM"
                            type="string"
                            placeholder="请输入说明"
                        ></el-input>
                    </el-form-item>

                    <FormItem
                        label="状态"
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

const yslxOptions = [
    { value: 1, label: 'fastReport' },
    { value: 2, label: 'xtraReoprt' },
    { value: 3, label: 'gridviewXML' },
    { value: 4, label: 'Stimulsoft Reports' },
]

const formRef = ref<FormInstance>()
const baTable = inject('baTable') as baTableClass

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    YSMC: [{ required: true, message: '名称不能为空' }]
})

</script>

<style scoped lang="scss"></style>