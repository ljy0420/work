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
                {{ baTable.form.operate == 'Add' ? '添加' : '编辑' }}
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
                    :model="baTable.form.items"
                    label-position="right"
                    :label-width="baTable.form.labelWidth + 'px'"
                    :rules="rules"
                    v-if="!baTable.form.loading"
                >
                    <el-form-item prop="JGMC" label="机构编码">
                        <el-input
                            v-model="baTable.form.items!.JGMC"
                            type="string"
                            placeholder="请输入机构编码"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="JGJB" label="机构级别">
                        <el-input
                            v-model="baTable.form.items!.JGJB"
                            type="string"
                            placeholder="请输入机构级别"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="JGMC" label="机构名称">
                        <el-input
                            v-model="baTable.form.items!.JGMC"
                            type="string"
                            placeholder="请输入机构名称"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="XZQH" label="行政区划">
                        <el-input
                            v-model="baTable.form.items!.XZQH"
                            type="string"
                            placeholder="请输入行政区划"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="ZZJGDM" label="组织机构代码">
                        <el-input
                            v-model="baTable.form.items!.ZZJGDM"
                            type="string"
                            placeholder="请输入组织机构代码"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="JGXZ" label="机构性质">
                        <el-input
                            v-model="baTable.form.items!.JGXZ"
                            type="string"
                            placeholder="请输入机构性质"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="FR" label="法人">
                        <el-input
                            v-model="baTable.form.items!.FR"
                            type="string"
                            placeholder="请输入法人"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="LXDH" label="联系电话">
                        <el-input
                            v-model="baTable.form.items!.LXDH"
                            type="string"
                            placeholder="请输入联系电话"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="JGWZ" label="机构网站">
                        <el-input
                            v-model="baTable.form.items!.JGWZ"
                            type="string"
                            placeholder="请输入机构网站"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="JGWZ" label="机构网站">
                        <el-input
                            v-model="baTable.form.items!.JGWZ"
                            type="string"
                            placeholder="请输入机构网站"
                        ></el-input>
                    </el-form-item>
                    <FormItem
                        label="有效状态"
                        v-model="baTable.form.items!.YXZT"
                        type="radio"
                        :data="{ content: { '0': '禁用', '1': '启用' }, childrenAttr: { border: true } }"
                    />
                    <el-form-item prop="ZBM" label="自编码">
                        <el-input
                            v-model="baTable.form.items!.ZBM"
                            type="string"
                            placeholder="请输入自编码"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="GLJG" label="管理机构">
                        <el-input
                            v-model="baTable.form.items!.GLJG"
                            type="string"
                            placeholder="请输入管理机构"
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
                    <el-form-item prop="SJJG" label="上级机构">
                        <el-input
                            v-model="baTable.form.items!.SJJG"
                            type="string"
                            placeholder="请输入上级机构"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="JBDJ" label="级别等级">
                        <el-input
                            v-model="baTable.form.items!.JBDJ"
                            type="string"
                            placeholder="请输入级别等级"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="JGDZ" label="机构地址">
                        <el-input
                            v-model="baTable.form.items!.JGDZ"
                            type="textarea"
                            placeholder="请输入机构地址"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="ZBZRS" label="总编制人数">
                        <el-input
                            v-model="baTable.form.items!.ZBZRS"
                            type="string"
                            placeholder="请输入总编制人数"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="JGGLY" label="机构管理员">
                        <el-input
                            v-model="baTable.form.items!.JGGLY"
                            type="string"
                            placeholder="请输入机构管理员"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="CSMM" label="初始密码">
                        <el-input
                            v-model="baTable.form.items!.CSMM"
                            type="string"
                            placeholder="请输入初始密码"
                        ></el-input>
                    </el-form-item>
                </el-form>
            </div>
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

const formRef = ref<FormInstance>()
const baTable = inject('baTable') as baTableClass

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    JGMC: [buildValidatorData({ name: 'required', title: '机构名称不能为空.' })],
})

</script>

<style scoped lang="scss">
.ba-input-item-radio :deep(.el-form-item__content) {
    width: 220px;
}
</style>