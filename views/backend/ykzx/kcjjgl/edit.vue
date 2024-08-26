<template>
    <!-- 对话框表单 -->
    <el-dialog
        class="ba-operate-dialog"
        :close-on-click-modal="false"
        :model-value="['Add', 'Edit'].includes(baTable.form.operate!)"
        @close="baTable.toggleForm"
        :destroy-on-close="true"
        align-center
        width="1000px"
    >
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">
                {{ baTable.form.operate == 'Add' ? '添加' : '编辑' }}
            </div>
        </template>
        <el-scrollbar v-loading="baTable.form.loading" class="ba-table-form-scrollbar">
            <div>
                <el-form
                    :inline="true"
                    ref="formRef"
                    @keyup.enter="baTable.onSubmit(formRef)"
                    :model="baTable.form.items"
                    label-position="right"
                    :label-width="baTable.form.labelWidth + 'px'"
                    :rules="rules"
                    v-if="!baTable.form.loading"
                >
                </el-form>
                <el-form-item prop="KFBM" label="库房编码">
                    <el-input v-model="baTable.form.items!.KFBM" type="string" placeholder="请输入库房编码"></el-input>
                </el-form-item>
                <el-form-item prop="YPBM" label="药品编码">
                    <el-input v-model="baTable.form.items!.YPBM" type="string" placeholder="请输入药品编码"></el-input>
                </el-form-item>
                <el-form-item prop="SX" label="上限">
                    <el-input v-model="baTable.form.items!.SX" type="number" placeholder="请输入上限"></el-input>
                </el-form-item>
                <el-form-item prop="XX" label="下限">
                    <el-input v-model="baTable.form.items!.XX" type="number" placeholder="请输入药品下限"></el-input>
                </el-form-item>
                <el-form-item prop="HWBM" label="货位编码">
                    <el-input v-model="baTable.form.items!.HWBM" type="string" placeholder="请输入货位编码"></el-input>
                </el-form-item>
                <el-form-item prop="HWMC" label="货位名称">
                    <el-input v-model="baTable.form.items!.HWMC" type="string" placeholder="请输入货位名称"></el-input>
                </el-form-item>
                <FormItem
                    label="禁售"
                    v-model="baTable.form.items!.JS"
                    type="radio"
                    :data="{ content: { '0': '否', '1': '是' }, childrenAttr: { border: true } }"
                />
                <FormItem
                    label="禁购"
                    v-model="baTable.form.items!.JW"
                    type="radio"
                    :data="{ content: { '0': '否', '1': '是' }, childrenAttr: { border: true } }"
                />
            </div>
        </el-scrollbar>
        <template #footer>
            <div :style="'width: calc(100% - ' + baTable.form.labelWidth! / 1.8 + 'px)'">
                <el-button round @click="baTable.toggleForm('')">取消</el-button>
                <el-button v-blur round :loading="baTable.form.submitLoading" @click="submitForm(formRef)" type="primary">
                    {{ baTable.form.operateIds && baTable.form.operateIds.length > 1 ? '保存并编辑下一条' : '保存' }}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, inject, watch } from 'vue'
import type baTableClass from '/@/utils/baTable'
import FormItem from '/@/components/formItem/index.vue'
import type { FormInstance, FormItemRule } from 'element-plus'

const formRef = ref<FormInstance>()
const baTable = inject('baTable') as baTableClass

const state: {
    currentJgdw: string
} = reactive({
    currentJgdw: '',
})
</script>

<style scoped lang="scss"></style>
