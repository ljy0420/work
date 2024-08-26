<template>
    <!-- 对话框表单 -->
    <el-dialog
        class="ba-operate-dialog ghlx-edit"
        :close-on-click-modal="false"
        :model-value="['Add', 'Edit'].includes(baTable.form.operate!)"
        @close="baTable.toggleForm"
        :destroy-on-close="true"
        align-center
        width="600px"
    >
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">
                {{ baTable.form.operate == 'Add' ? '新增挂号类型关联医生' : '修改挂号类型关联医生' }}
            </div>
        </template>
        <div
            v-loading="baTable.form.loading"
            class="ba-operate-form"
            :class="'ba-' + baTable.form.operate + '-form'"
            :style="'width: calc(100% - ' + baTable.form.labelWidth! / 2 + 'px)'"
        >
            <el-form
                ref="formRef"
                @keyup.enter="baTable.onSubmit(formRef)"
                :model="baTable.form.items"
                label-position="right"
                :label-width="baTable.form.labelWidth + 'px'"
                :rules="rules"
                v-if="!baTable.form.loading"
                style="height: 350px"
            >
                <el-form-item prop="LBBM" label="挂号类别编码">
                    <el-input v-model="baTable.form.items!.LBBM" disabled type="string" placeholder="请输入挂号类别编码"></el-input>
                </el-form-item>
                <el-form-item prop="YSBM" label="医生编码">
                    <el-select v-model="baTable.form.items!.YSBM" placeholder="请选择医生编码" clearable style="width: 100%">
                        <el-option v-for="opt in state.sjData" :key="opt.RYBM" :label="opt.RYXM" :value="opt.RYBM"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="XYS" label="限约数">
                    <el-input v-model="baTable.form.items!.XYS" type="number" placeholder="请输入限约数"></el-input>
                </el-form-item>
                <el-form-item prop="XHS" label="限号数">
                    <el-input v-model="baTable.form.items!.XHS" type="number" placeholder="请输入限号数"></el-input>
                </el-form-item>
                <el-form-item prop="JGGZ" label="警告规则">
                    <el-select v-model="baTable.form.items!.JGGZ" placeholder="请选择警告规则" clearable style="width: 100%">
                        <el-option v-for="opt in state.jggzData" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <div :style="'width: calc(100% - ' + baTable.form.labelWidth! / 1.8 + 'px)'">
                <el-button round @click="baTable.toggleForm('')">取消</el-button>
                <el-button v-blur round :loading="baTable.form.submitLoading" @click="baTable.onSubmit(formRef)" type="primary">
                    {{ baTable.form.operateIds && baTable.form.operateIds.length > 1 ? '保存并编辑下一条' : '保存' }}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, inject, watch } from 'vue'
import type baTableClass from '/@/utils/baTable2'
import type { FormInstance, FormItemRule } from 'element-plus'
import { getPymWbm } from '/@/api/common'

const prop = defineProps(['ysData', 'rowBm'])

const state: {
    sjData: any //上级分类数据
    jggzData: any
} = reactive({
    sjData: [], // prop.ysData,
    jggzData: [
        { value: 0, label: '无' },
        { value: 1, label: '到限号数时提示' },
        { value: 2, label: '挂号就提示' },
        { value: 3, label: '满号禁止' },
    ],
})

const formRef = ref<FormInstance>()
const baTable = inject('baTable') as baTableClass

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    FLBM: [{ required: true, message: '分类编码不能为空' }],
    FLMC: [{ required: true, message: '分类名称不能为空' }],
})

watch(
    () => baTable.form.operate,
    () => {
        state.sjData = prop.ysData
        baTable.form.items!.LBBM = prop.rowBm
    }
)

const sjbmCurrentChange = (data: any, node: any) => {
    console.log(node)
    baTable.form.items!.JB = node.level + 1
}
</script>

<style scoped lang="scss">
</style>