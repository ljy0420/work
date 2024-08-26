<template>
    <!-- 对话框表单 -->
    <el-dialog
        class="ba-operate-dialog"
        :close-on-click-modal="false"
        :model-value="['Add', 'Edit'].includes(baTable.form.operate!)"
        @close="baTable.toggleForm"
        :destroy-on-close="true"
        width="800px"
        style="height: 350px;"
    >
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">
                {{ baTable.form.operate == 'Add' ? '添加' : '编辑' }}
            </div>
        </template>
        <el-scrollbar v-loading="baTable.form.loading" class="ba-table-form-scrollbar" >
            <div
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
                >
                    <el-form-item prop="PJLXMC" label="票据类型名称">
                        <el-input
                            v-model="baTable.form.items!.PJLXMC"
                            type="string"
                            placeholder="请输入票据类型名称"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="BZ" label="备注">
                        <el-input
                            v-model="baTable.form.items!.BZ"
                            type="string"
                            placeholder="请输入备注"
                        ></el-input>
                    </el-form-item>
                    <FormItem
                        label="业务类型"
                        v-model="baTable.form.items!.YWID"
                        type="checkbox"
                        :data="{ content: { '1': '挂号', '2': '门诊收费','3': '预交金','4': '出院结算' }, childrenAttr: { border: true } }"
                    />
                </el-form>
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
import { reactive, ref, inject } from 'vue'
import type baTableClass from '/@/utils/baTable'
import FormItem from '/@/components/formItem/index.vue'
import type { FormInstance, FormItemRule } from 'element-plus'
import { type } from 'os'
import { number } from 'echarts'
import { AddPiaoJulx } from '/@/api/backend/cwgl/pjlxyy'

const prop = defineProps(['items'])
const emit = defineEmits(['savePjlxEdit'])
const formRef = ref<FormInstance>()
const baTable = inject('baTable') as baTableClass

type pjlxwhgl= {
  JGBM: string,
  YWID: number,
  PJLXBM:string,
  PJLXMC:string,
  BZ:string
}

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
  //PJLXBM: [{ required: true, message: '票据类型编码不能为空' }],
  PJLXMC: [{ required: true, message: '请输入票据类型名称' }]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
          var arr:pjlxwhgl[]=[]
          for(var s in baTable.form.items!.YWID){
            var pjlx:pjlxwhgl={
              JGBM: '',
              YWID: Number(s),
              PJLXBM: baTable.form.items!.PJLXBM,
              PJLXMC: baTable.form.items!.PJLXMC,
              BZ: baTable.form.items!.BZ
            }
            arr.push(pjlx)
          }
          
          AddPiaoJulx(arr).then((res)=>{
            emit("savePjlxEdit",res)
            baTable.toggleForm('')
          })
        } else {
            console.log('error submit!', fields)
        }
    })
  
}

</script>

<style scoped lang="scss">
</style>