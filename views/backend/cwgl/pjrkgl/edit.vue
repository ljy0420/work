<template>
    <!-- 对话框表单 -->
    <el-dialog
        class="ba-operate-dialog"
        :close-on-click-modal="false"
        :model-value="['Add', 'Edit'].includes(baTable.form.operate!)"
        @close="baTable.toggleForm"
        @open="openvalidate"
        :destroy-on-close="true"
        width="600px"
    >
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">
                {{ baTable.form.operate == 'Add' ? '添加' : '编辑' }}
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
                    :model="baTable.form.items"
                    label-position="right"
                    :label-width="baTable.form.labelWidth + 'px'"
                    :rules="rules"
                    v-if="!baTable.form.loading"
                >
                    <el-form-item prop="DH" label="单号">
                        <el-input
                            v-model="baTable.form.items!.DH"
                            type="string"
                            placeholder="请输入单号"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="QZ" label="前缀">
                        <el-input
                            v-model="baTable.form.items!.QZ"
                            type="string"
                            placeholder="请输入前缀"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="QSZ" label="起始值">
                        <el-input
                            v-model="baTable.form.items!.QSZ"
                            type="number"
                            placeholder="请输入起始值"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="JSZ" label="结束值">
                        <el-input
                            v-model="baTable.form.items!.JSZ"
                            type="number"
                            placeholder="请输入结束值"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="Je" label="金额">
                        <el-input
                            v-model="baTable.form.items!.JE"
                            type="number"
                            placeholder="请输入金额"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="BGRBM" label="保管人">
                        <el-select
                          ref="RefBGR"
                          v-model="baTable.form.items!.BGRBM"
                          placeholder="请选择保管人"
                          style="width: 250px"
                          filterable 
                        >
                          <el-option
                            v-for="item in prop.RYZL"
                            :key="item.RYBM"
                            :label="item.RYXM"
                            :value="item.RYBM"
                          >
                          </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="BZ" label="备注">
                        <el-input
                            v-model="baTable.form.items!.BZ"
                            type="string"
                            placeholder="请输入备注"
                        ></el-input>
                    </el-form-item>
                    <FormItem
                        label="状态"
                        v-model="baTable.form.items!.ZT"
                        type="radio"
                        :data="{ content: { '0': '作废', '1': '入库' }, childrenAttr: { border: true } }"
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
import type { FormInstance, FormItemRule, ElSelect } from 'element-plus'
import { AddPiaoJurkmx } from '/@/api/backend/cwgl/pjrkmx'

type SelectInstance = InstanceType<typeof ElSelect>;

const prop=defineProps(['RYZL','PJLXROW'])
const emit=defineEmits(['savePjrkEdit'])
const formRef = ref<FormInstance>()
const baTable = inject('baTable') as baTableClass

const RefBGR =ref<SelectInstance>()

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
  DH: [{ required: true, message: '单号不能为空' }],
  QZ: [{ required: true, message: '前缀不能为空' }],
  QSZ: [{ required: true, message: '起始值不能为空' }],
  JSZ: [{ required: true, message: '结束值不能为空' }],
})

type pjrkmxgl= {
  DH: string,
  QZ: string,
  PJLXBM: string,
  PJLXMC: string,
  QSZ:number,
  JSZ:number,
  JE:number,
  BGRBM:string,
  BGRXM:string,
  BZ:string
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
          var pjrk:pjrkmxgl={
              DH: baTable.form.items!.DH,
              QZ: baTable.form.items!.QZ,
              PJLXBM:prop.PJLXROW.PJLXBM,
              PJLXMC:prop.PJLXROW.PJLXMC,
              QSZ: Number(baTable.form.items!.QSZ),
              JSZ: Number(baTable.form.items!.JSZ),
              JE: Number(baTable.form.items!.JE),
              BGRBM: baTable.form.items!.BGRBM,
              BGRXM: String(RefBGR.value?.selectedLabel),//prop.RYZL.find((item:any)=> item.RYBM==baTable.form.items!.BGRBM).RYXM,
              BZ: baTable.form.items!.BZ
            }
          AddPiaoJurkmx(pjrk).then((res)=>{
            emit("savePjrkEdit",res)
            baTable.toggleForm('')
          })
        } else {
            console.log('error submit!', fields)
        }
    })
  
}

const openvalidate=()=>{
  if(prop.PJLXROW!.PJLXBM===undefined){
    baTable.toggleForm('')
  }else{
    baTable.form.items!.ZT='1'
  }
}

</script>

<style scoped lang="scss">
</style>