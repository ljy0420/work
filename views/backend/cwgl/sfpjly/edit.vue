<template>
    <!-- 对话框表单 -->
    <el-dialog
        class="ba-operate-dialog"
        :close-on-click-modal="false"
        :model-value="['Add', 'Edit'].includes(baTable.form.operate!)"
        @close="baTable.toggleForm"
        @open="openValidate"
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
                    <el-form-item prop="DH" label="领用单号">
                        <el-input
                            v-model="baTable.form.items!.DH"
                            type="string"
                            placeholder="请输入领用单号"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="QZ" label="前缀">
                        <el-input
                            v-model="baTable.form.items!.QZ"
                            :disabled="baTable.form.items!.RKMXID != undefined"
                            type="string"
                            placeholder="请输入票据前缀"
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
                    <el-form-item prop="CD" label="长度">
                        <el-input
                            v-model="baTable.form.items!.CD"
                            type="number"
                            placeholder="请输入长度"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="LYRBM" label="领用人">
                        <el-select
                          ref="RefLYR"
                          v-model="baTable.form.items!.LYRBM"
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
                    <el-form-item prop="RKMXID" label="选择库存票据">
                        <el-select
                          ref="RefRKMX"
                          v-model="baTable.form.items!.RKMXID"
                          placeholder="请选择库存票据"
                          style="width: 250px"
                          filterable 
                          @change="PJKCChange"
                        >
                          <el-option
                            v-for="item in prop.PJKC"
                            :key="item.ID"
                            :label="item.DH"
                            :value="item.ID"
                          >
                          </el-option>
                        </el-select>
                        <el-form-item v-show="baTable.form.items!.RKMXID != undefined">
                          <el-label>当前库存票据的票段：<el-tag>{{state.pjkcRow.QSZ}}-{{state.pjkcRow.JSZ}}</el-tag>历史领用记录：</el-label>
                          <el-tag v-for="item in state.pjlyjlData" :key="item.ID">{{item.QSZ}}-{{item.JSZ}}</el-tag>
                        </el-form-item>
                    </el-form-item>
                    <el-form-item prop="BZ" label="备注">
                        <el-input
                            v-model="baTable.form.items!.BZ"
                            type="string"
                            placeholder="请输入备注"
                        ></el-input>
                    </el-form-item>
                    <FormItem
                        label="使用方式"
                        v-model="baTable.form.items!.SYFS"
                        type="radio"
                        :data="{ content: { '0': '个人', '1': '共用' }, childrenAttr: { border: true } }"
                    />
                    <FormItem
                        label="性质"
                        v-model="baTable.form.items!.XZ"
                        type="radio"
                        :data="{ content: { '0': '普通', '1': '收据' }, childrenAttr: { border: true } }"
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
import { AddPiaoJulyjl, GetPiaoJulyjl } from '/@/api/backend/cwgl/pjlyjl'

type SelectInstance = InstanceType<typeof ElSelect>;
const formRef = ref<FormInstance>()
const baTable = inject('baTable') as baTableClass

const prop=defineProps(['RYZL','PJLXROW','PJKC'])
const emit=defineEmits(['savePjlyEdit'])
const RefLYR =ref<SelectInstance>()
const RefRKMX =ref<SelectInstance>()

const state:{
  pjkcRow: any,
  pjlyjlData: any
}=reactive({
  pjkcRow: {},
  pjlyjlData:[]
})

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
  DH: [{ required: true, message: '单号不能为空' }],
  QZ: [{ required: true, message: '前缀不能为空' }],
  QSZ: [{ required: true, message: '起始值不能为空' }],
  JSZ: [{ required: true, message: '结束值不能为空' }],
  LYRBM: [{ required: true, message: '领用人不能为空' }]
})

type pjlyjlgl= {
  QZ: string,
  PJLXBM: string,
  PJLXMC: string,
  QSZ:number,
  JSZ:number,
  CD:number,
  LYRBM:string,
  LYRXM:string,
  PH:string,
  FPDM:string,
  SYFS:number,
  XZ:number,
  RKMXID:number,
  SYSX:number,
  BZ:string
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
          var pjly:pjlyjlgl={
              QZ: baTable.form.items!.QZ,
              PJLXBM:prop.PJLXROW.PJLXBM,
              PJLXMC:prop.PJLXROW.PJLXMC,
              QSZ: Number(baTable.form.items!.QSZ),
              JSZ: Number(baTable.form.items!.JSZ),
              CD: Number(baTable.form.items!.CD),
              LYRBM: baTable.form.items!.LYRBM,
              LYRXM: String(RefLYR.value?.selectedLabel),//prop.RYZL.find((item:any)=> item.RYBM==baTable.form.items!.BGRBM).RYXM,
              PH: baTable.form.items!.PH,
              FPDM: baTable.form.items!.FPDM,
              SYFS: Number(baTable.form.items!.SYFS),
              XZ: Number(baTable.form.items!.XZ),
              RKMXID: Number(baTable.form.items!.RKMXID),
              SYSX: Number(baTable.form.items!.SYSX),
              BZ: baTable.form.items!.BZ
            }
            AddPiaoJulyjl(pjly).then((res)=>{
            emit("savePjlyEdit",res)
            baTable.toggleForm('')
          })
        } else {
            console.log('error submit!', fields)
        }
    })
  
}

const openValidate=()=>{
  if(prop.PJLXROW!.PJLXBM===undefined){
    baTable.toggleForm('')
  }
  if(baTable.form.operate == 'Add'){
    baTable.form.items!.XZ='0'
    baTable.form.items!.SYFS='0'
  }
}

const PJKCChange=()=>{
  state.pjkcRow=(prop.PJKC.find((item:any)=>item.ID==baTable.form.items!.RKMXID))
  baTable.form.items!.QZ=state.pjkcRow.QZ
  GetPiaoJulyjl({RKMXID: state.pjkcRow.ID}).then((res)=>{
    state.pjlyjlData=res.data
  })
}

</script>

<style scoped lang="scss">
</style>