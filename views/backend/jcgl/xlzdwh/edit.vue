<template>
    <!-- 对话框表单 -->
    <el-dialog
        class="ba-operate-dialog"
        :close-on-click-modal="false"
        :model-value="['Add', 'Edit'].includes(baTable.form.operate!)"
        @close="baTable.toggleForm"
        :destroy-on-close="true"
        width="600px"
    >
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">
                {{ baTable.form.operate == 'Add' ? '小类字典-新增' : '小类字典-修改' }}
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
                    <el-form-item prop="DLMC" label="大类名称">
                        <el-input v-model="baTable.form.items!.DLMC" type="string" placeholder="请输入大类名称"></el-input>
                    </el-form-item>
                    <el-form-item prop="XLMC" label="小类名称">
                        <el-input v-model="baTable.form.items!.XLMC" type="string" @change="mChange" placeholder="请输入小类名称"></el-input>
                    </el-form-item>
                    <el-form-item prop="PYM" label="拼音码">
                        <el-input v-model="baTable.form.items!.PYM" type="string" placeholder="请输入拼音码"></el-input>
                    </el-form-item>
                    <el-form-item prop="WBM" label="五笔码">
                        <el-input v-model="baTable.form.items!.WBM" type="string" placeholder="请输入五笔码"></el-input>
                    </el-form-item>
                    <el-form-item prop="ZBM" label="自编码">
                        <el-input v-model="baTable.form.items!.ZBM" type="string" placeholder="请输入自编码"></el-input>
                    </el-form-item>

                    <el-form-item prop="YJSQLX" label="医技申请类型">
                        <el-select v-model="baTable.form.items!.YJSQLX" placeholder="请选择疾医技申请类型" clearable style="width: 100%">
                            <el-option v-for="opt in yjlxOptions" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item prop="DJDYGS" label="单据打印归属">
                        <el-select v-model="baTable.form.items!.DJDYGS" placeholder="请选择单据打印归属" clearable style="width: 100%">
                            <el-option v-for="opt in djlxOptions" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                        </el-select>
                    </el-form-item>

                    <FormItem
                        label="有效状态"
                        v-model="baTable.form.items!.YXZT"
                        type="radio"
                        :data="{ content: { '0': '禁用', '1': '启用' }, childrenAttr: { border: true } }"
                    />

                    <FormItem
                        label="是否默认"
                        v-model="baTable.form.items!.SFMR"
                        type="radio"
                        :data="{ content: { 是: '是', 否: '否' }, childrenAttr: { border: true } }"
                    />
                    <FormItem
                        label="是否可以确费"
                        v-model="baTable.form.items!.SFKYQF"
                        type="radio"
                        :data="{ content: { 是: '是', 否: '否' }, childrenAttr: { border: true } }"
                    />
                    <FormItem
                        label="附加项目是否打印必填"
                        v-model="baTable.form.items!.FJXMSFBT"
                        type="radio"
                        :data="{ content: { 是: '是', 否: '否' }, childrenAttr: { border: true } }"
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

const yjlxOptions = [
    { value: '1', label: '化验' },
    { value: '2', label: '检查' },
    { value: '3', label: '治疗' },
    { value: '4', label: '手术' },
    { value: '0', label: '无' },
]

const djlxOptions = [
    { value: '1', label: 'CT' },
    { value: '2', label: '放射' },
    { value: '3', label: '心电图' },
    { value: '4', label: '超声' },
]

const formRef = ref<FormInstance>()
const baTable = inject('baTable') as baTableClass

const mChange = (value: string) => {
    getPymWbm({ agrs: value }).then((res) => {
        baTable.form.items!.PYM = res.data.PYM
        baTable.form.items!.WBM = res.data.WBM
    })
}

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    DLMC: [buildValidatorData({ name: 'required', title: '大类名称不能为空.' })],
    XLMC: [buildValidatorData({ name: 'required', title: '小类名称不能为空.' })],
})
</script>

<style scoped lang="scss"></style>
