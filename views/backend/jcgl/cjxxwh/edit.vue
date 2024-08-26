<template>
    <!-- 对话框表单 -->
    <el-dialog
        class="ba-operate-dialog cjxx-edit"
        :close-on-click-modal="false"
        :model-value="['Add', 'Edit'].includes(baTable.form.operate!)"
        @close="baTable.toggleForm"
        :destroy-on-close="true"
        align-center
        width="800px"
    >
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">
                {{ baTable.form.operate == 'Add' ? '厂家信息-新增' : '厂家信息-修改' }}
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
                    :inline="true"
                    :model="baTable.form.items"
                    label-position="right"
                    :label-width="baTable.form.labelWidth + 'px'"
                    :rules="rules"
                    v-if="!baTable.form.loading"
                >
                    <el-form-item prop="CJMC" label="厂家名称">
                        <el-input
                            v-model="baTable.form.items!.CJMC"
                            type="string"
                            @change="mChange"
                            placeholder="请输入厂家名称"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="小类名称">
                        <el-select
                            v-model="baTable.form.items!.XLBM"
                            placeholder="请选择小类"
                            clearable>
                            <el-option v-for="opt in state.options" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="BM" label="别名">
                        <el-input
                            v-model="baTable.form.items!.BM"
                            type="string"
                            placeholder="请输入别名"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="DZ" label="地址">
                        <el-input
                            v-model="baTable.form.items!.DZ"
                            type="string"
                            placeholder="请输入地址"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="KHYH" label="开户银行">
                        <el-input
                            v-model="baTable.form.items!.KHYH"
                            type="string"
                            placeholder="请输入开户银行"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="YHZH" label="银行账号">
                        <el-input
                            v-model="baTable.form.items!.YHZH"
                            type="string"
                            placeholder="请输入银行账号"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="YB" label="邮编">
                        <el-input
                            v-model="baTable.form.items!.YB"
                            type="string"
                            placeholder="请输入邮编"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="LXR" label="联系人">
                        <el-input
                            v-model="baTable.form.items!.LXR"
                            type="string"
                            placeholder="请输入联系人"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="LXRDH" label="联系电话">
                        <el-input
                            v-model="baTable.form.items!.LXRDH"
                            type="string"
                            placeholder="请输入联系电话"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="YWFW" label="业务范围">
                        <el-input
                            v-model="baTable.form.items!.YWFW"
                            type="string"
                            placeholder="请输入业务范围"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="YWSP" label="业务水平">
                        <el-input
                            v-model="baTable.form.items!.YWSP"
                            type="string"
                            placeholder="请输入业务水平"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="BZ" label="备注">
                        <el-input
                            v-model="baTable.form.items!.BZ"
                            type="string"
                            placeholder="请输入备注"
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
                    <el-form-item prop="ZBM" label="自编码">
                        <el-input
                            v-model="baTable.form.items!.ZBM"
                            type="string"
                            placeholder="请输入自编码"
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
                <el-button ref="btnSave" v-blur :loading="baTable.form.submitLoading" @click="baTable.onSubmit(formRef)" type="primary" class="btn-form-save">
                    保存
                </el-button>
                <el-button @click="baTable.toggleForm('')" class="btn-form-cancel">取消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, inject, watch, nextTick } from 'vue'
import type baTableClass from '/@/utils/baTable'
import FormItem from '/@/components/formItem/index.vue'
import { getXiaoLei } from '/@/api/backend/jcgl/cjxx'
import type { FormInstance, FormItemRule } from 'element-plus'
import { buildValidatorData } from '/@/utils/validate'
import { getPymWbm } from '/@/api/common'
import { useMagicKeys } from '@vueuse/core'

const formRef = ref<FormInstance>()
const baTable = inject('baTable') as baTableClass

const btnSave = ref<HTMLElement | null>(null)

const state: {
    options: any
} = reactive({
    options: []
})

const keys = useMagicKeys()
const CtrlEnter = keys['Ctrl+Enter']

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    CJMC: [buildValidatorData({ name: 'required', message: '厂家名称不能为空.' })],
})

const mChange = (value: string) => {
    //console.log(value)
    getPymWbm({agrs:value}).then((res)=>{
        baTable.form.items!.PYM = res.data.PYM
        baTable.form.items!.WBM = res.data.WBM
    })
}

onMounted(() => {
    getXiaoLei().then((res)=>{
        state.options = res.data.options
    })
})

watch(CtrlEnter, (v) => {
    if(v) {
        nextTick(()=>{
            btnSave.value.ref.click()
        })
    }
})

</script>

<style scoped lang="scss">
.ba-operate-dialog :deep(.el-dialog__body){
    height: 60vh;
}
</style>