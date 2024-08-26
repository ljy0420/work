<template>
    <!-- 对话框表单 -->
    <el-dialog class="ba-operate-dialog wcglyz-edit" :close-on-click-modal="false"
        :model-value="['Add', 'Edit'].includes(baTable.form.operate!)" @close="baTable.toggleForm" :destroy-on-close="true"
        align-center id="edit-dialog" width="750px">
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']">
                {{ baTable.form.operate == 'Add' ? '添加' : '编辑' }}
            </div>
        </template>
        <el-scrollbar v-loading="baTable.form.loading" class="ba-table-form-scrollbar">
            <div class="ba-operate-form" :class="'ba-' + baTable.form.operate + '-form'"
                :style="'width: calc(100% - ' + baTable.form.labelWidth! / 2 + 'px)'">
                <el-form :inline="true" ref="formRef" :model="baTable.form.items" label-position="right"
                    :label-width="baTable.form.labelWidth + 'px'" :rules="rules" v-if="!baTable.form.loading">
                    <div style="padding: 5px 15px;">
                        <el-row :gutter="2">
                            <el-col :xs="24" :sm="24">
                                <el-form-item prop="FLBM" label="卫材分类">
                                    <div class="wcfl-select">
                                        <el-cascader v-model="baTable.form.items!.FLBM" :props="defaultProps"
                                            :options="prop.flData" :show-all-levels="true" filterable clearable
                                            popper-class="flbm-tree-cascader" placeholder="请选择" />
                                    </div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="2">
                            <el-col :xs="24" :sm="12">
                                <el-form-item prop="XMBM" label="项目编码">
                                    <el-input v-model="baTable.form.items!.XMBM" :disabled="true" type="string"
                                        placeholder="系统自动生成"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="12">
                                <el-form-item prop="XMMC" label="项目名称">
                                    <el-input v-model="baTable.form.items!.XMMC" type="string" placeholder="请输入项目名称"
                                        @change="mChange"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="2">
                            <el-col :xs="24" :sm="12">
                                <el-form-item prop="JSFS" label="计算方式">
                                    <el-select v-model="baTable.form.items!.JSFS" placeholder="请选择计算方式" filterable clearable
                                        style="width: 100%">
                                        <el-option v-for="opt in jsfsOptions" :key="opt.value" :label="opt.label"
                                            :value="opt.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="12">
                                <el-form-item prop="FWDX" label="服务对象">
                                    <el-select v-model="baTable.form.items!.FWDX" placeholder="请选择服务对象" filterable clearable
                                        style="width: 100%">
                                        <el-option v-for="opt in fwdxOptions" :key="opt.value" :label="opt.label"
                                            :value="opt.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="2">
                            <el-col :xs="24" :sm="12">
                                <el-form-item prop="ZXPL" label="执行频率">
                                    <el-select v-model="baTable.form.items!.ZXPL" placeholder="请选择执行频率" filterable clearable
                                        style="width: 100%">
                                        <el-option v-for="opt in zxplOptions" :key="opt.value" :label="opt.label"
                                            :value="opt.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="12">
                                <el-form-item prop="SYXB" label="适用性别">
                                    <el-select v-model="baTable.form.items!.SYXB" placeholder="请选择适用性别" filterable clearable
                                        style="width: 100%">
                                        <el-option v-for="opt in syxbOptions" :key="opt.value" :label="opt.label"
                                            :value="opt.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="2">
                            <el-col :xs="24" :sm="12">
                                <el-form-item prop="KSSJ" label="开始时间">
                                    <el-date-picker v-model="baTable.form.items!.KSSJ" type="date" placeholder="请选择开始时间"
                                        style="width: 100%" />
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="12">
                                <el-form-item prop="JSSJ" label="结束时间">
                                    <el-date-picker v-model="baTable.form.items!.JSSJ" type="date" placeholder="请选择结束时间"
                                        style="width: 100%" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="2">
                            <el-col :xs="24" :sm="12">
                                <el-form-item prop="WBM" label="五笔码">
                                    <el-input v-model="baTable.form.items!.WBM" type="string"
                                        placeholder="请输入五笔码"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="12">
                                <el-form-item prop="PYM" label="拼音码">
                                    <el-input v-model="baTable.form.items!.PYM" type="string"
                                        placeholder="请输入拼音码"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
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
</template>

<script setup lang="ts">
import { reactive, ref, inject } from 'vue'
import type baTableClass from '/@/utils/baTable'
import type { FormInstance, FormItemRule } from 'element-plus'
import { buildValidatorData } from '/@/utils/validate'
import { getPymWbm } from '/@/api/common'

const formRef = ref<FormInstance>()
const baTable = inject('baTable') as baTableClass
const prop = defineProps(['selectFlbm', 'flData'])

const state: {} = reactive({})

const jsfsOptions = [
    { value: 0, label: '不明确' },
    { value: 1, label: '计量' },
]

const fwdxOptions = [
    { value: 1, label: '门诊' },
    { value: 2, label: '住院' },
    { value: 3, label: '门诊和住院' },
    { value: 4, label: '体检' },
]

const zxplOptions = [
    { value: 0, label: '选频率' },
    { value: 1, label: '一次性' },
]
const syxbOptions = [
    { value: 0, label: '无性别区分' },
    { value: 1, label: '男性' },
    { value: 2, label: '女性' },
]

const defaultProps = {
    label: 'FLMC',
    value: 'FLBM',
    checkStrictly: true
}

const mChange = (value: string) => {
    getPymWbm({ agrs: value }).then((res) => {
        baTable.form.items!.PYM = res.data.PYM
        baTable.form.items!.WBM = res.data.WBM
    })
}

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    XMMC: [buildValidatorData({ name: 'required', message: '项目名称不能为空.' })],
})
// 表单提交
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            let data = {
                agrs: {
                    yzxmzd: {
                        LB: 25,
                        ZXKS: 0,
                        ZXFL: 0,
                        FLBM: prop.selectFlbm,
                        ...baTable.form.items,
                    },
                    sfmx: [],
                    zxks: [],
                    yfyl: [],
                    syks: [],
                },
            }
            baTable.onSubmitData(data)
        } else {
            console.log('error submit!', fields)
        }
    })
}
</script>

<style scoped lang="scss">
.ba-operate-form .el-row {
    .el-col:nth-child(1) {
        :deep(.el-input) {
            width: 208px;
        }
        .wcfl-select {
            display: inline-block;

            :deep(.el-input) {
                width: 523px;
            }
    }
    }

    .el-col:nth-child(2) {
        :deep(.el-input) {
            width: 208px;
        }
    }

    
}
</style>
