<template>
    <!-- 对话框表单 -->
    <el-dialog
        class="ba-operate-dialog plxx-edit"
        :close-on-click-modal="false"
        :model-value="['Add', 'Edit'].includes(baTable.form.operate!)"
        @close="baTable.toggleForm"
        :destroy-on-close="true"
        align-center
        width="700px"
    >
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">
                {{ baTable.form.operate == 'Add' ? '频率信息-新增' : '频率信息-修改' }}
            </div>
        </template>
        <el-scrollbar v-loading="baTable.form.loading" class="ba-table-form-scrollbar">
            <div class="yd-edit">
                <el-form
                    :inline="true"
                    ref="formRef"
                    :model="baTable.form.items"
                    label-position="right"
                    :label-width="baTable.form.labelWidth + 'px'"
                    :rules="rules"
                    v-if="!baTable.form.loading"
                >
                <el-form-item prop="PLMC" label="频率名称">
                        <el-input v-model="baTable.form.items!.PLMC" type="string" @change="mChange" placeholder="请输入频率名称"></el-input>
                    </el-form-item>
                    <el-form-item prop="YWMC" label="英文名称">
                        <el-input v-model="baTable.form.items!.YWMC" type="string" placeholder="请输入频率名称"></el-input>
                    </el-form-item>
                    <el-form-item prop="JGDW" label="间隔单位">
                        <el-select v-model="baTable.form.items!.JGDW" placeholder="请选择间隔单位" clearable style="width: 100%" @change="jgdwChange">
                            <el-option v-for="opt in jgdwptions" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="PLJG" label="频率间隔">
                        <el-input v-model="baTable.form.items!.PLJG" type="number" placeholder="请输入频率间隔"></el-input>
                    </el-form-item>
                    <el-form-item prop="PLCS" label="频率次数">
                        <el-input v-model="baTable.form.items!.PLCS" type="number" placeholder="请输入频率次数"></el-input>
                    </el-form-item>
                    <el-form-item prop="SYFW" label="适用范围">
                        <el-select v-model="baTable.form.items!.SYFW" placeholder="请选择适用范围" clearable style="width: 100%">
                            <el-option v-for="opt in syfwOptions" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="PXH" label="排序号">
                        <el-input v-model="baTable.form.items!.PXH" type="number" placeholder="请输入排序号"></el-input>
                    </el-form-item>
                    <!-- <el-form-item prop="PYM" label="拼音码">
                        <el-input
                            v-model="baTable.form.items!.PYM"
                            type="string"
                            placeholder="请输入拼音码"
                        ></el-input>
                    </el-form-item> -->
                    <FormItem
                        label="有效状态"
                        v-model="baTable.form.items!.YXZT"
                        type="radio"
                        :data="{ content: { '0': '禁用', '1': '启用' }, childrenAttr: { border: true } }"
                    />
                </el-form>
                
            </div>
            <!-- <div v-if="baTable.form.items!.PLCS >= 1 && (baTable.form.items!.JGDW == '小时'||baTable.form.items!.JGDW == '天'||baTable.form.items!.JGDW == '周')"></div> -->
            <div style="margin: 5px 36px;">
                    <div style="font-weight: bold;color: #000;font-size: 15px;">时间方案</div>
                    <div style="border: 1px solid #dcdfe6;padding: 10px 15px 10px 15px">
                        <el-table :data="formData.plxxData" border height="270px" class="ba-data-table w100" header-cell-class-name="table-header-cell">
                                <el-table-column prop="XH" label="序号" width="130" align="center">
                                    <template #default="scope">
                                        {{ scope.$index+1 }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="XDSJ" :label="state.currentJgdw" width="170" align="center">
                                    <template #default="scope">
                                        <el-select
                                            v-model="scope.row.XDSJ"
                                            placeholder="请选择"
                                            filterable
                                            style="width: 100%"
                                        >
                                            <el-option
                                                v-for="opt in formData.pljgOptions"
                                                :key="opt.value"
                                                :label="opt.label"
                                                :value="opt.value"
                                            ></el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="JDSJ" label="时间" width="230" align="center">
                                    <template #default="scope">
                                        <div v-if="baTable.form.items!.JGDW=='小时'">
                                            <el-select
                                                v-model="scope.row.JDSJ"
                                                placeholder="请选择时间"
                                                filterable
                                                style="width: 100%"
                                            >
                                                <el-option v-for="opt in 59" :key="opt" :label="opt" :value="opt"></el-option>
                                            </el-select>
                                        </div>
                                        <div v-else>
                                            <el-time-select
                                                v-model="scope.row.JDSJ"
                                                start="00:00"
                                                step="00:10"
                                                end="23:59"
                                                placeholder="请选择时间"
                                            />
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                    </div>
                </div>
        </el-scrollbar>
        <template #footer>
            <div class="yd-from-footer">
                <el-button v-blur :loading="baTable.form.submitLoading" @click="submitForm(formRef)" type="primary" class="btn-form-save">
                    {{ baTable.form.operateIds && baTable.form.operateIds.length > 1 ? '保存并编辑下一条' : '保存' }}
                </el-button>
                <el-button @click="baTable.toggleForm('')" class="btn-form-cancel">取消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, inject, watch } from 'vue'
import type baTableClass from '/@/utils/baTable'
import FormItem from '/@/components/formItem/index.vue'
import type { FormInstance, FormItemRule } from 'element-plus'
import { ElMessage } from 'element-plus'
import { buildValidatorData } from '/@/utils/validate'
import { getPymWbm } from '/@/api/common'
import { getPlsjfa } from '/@/api/backend/jcgl/plsj'

const formRef = ref<FormInstance>()
const baTable = inject('baTable') as baTableClass

const state: {
    currentJgdw: string
} = reactive({
    currentJgdw: ''
})

const jgdwptions = [
    { value: '分钟', label: '分钟' },
    { value: '小时', label: '小时' },
    { value: '天', label: '天' },
    { value: '周', label: '周' },
]

const syfwOptions = [
    { value: 1, label: '西医' },
    { value: 2, label: '中医' },
    { value: 3, label: '固定' },
]

const jgdwOptions = ref('')
const jgdwChange = (val: string) => {
    jgdwOptions.value = val
    state.currentJgdw = val
}

// 执行方案data
const formData = reactive({
    plxxData: [
        {
            XH: 1, //序号
            XDSJ: '', //相对时间
            JDSJ: '' //绝对时间
        },
    ],
    pljgOptions: [{ value: 1, label: '1' }],
})

watch(
    () => baTable.form.items!.PLCS,
    (val) => {
        formData.plxxData = []
        //     debugger
        for (let i = 0; i < Number(val); i++) {
            console.log(formData.plxxData, 'formData.plxxData')
            formData.plxxData.push({
                XH: i+1,
                XDSJ: '',
                JDSJ: ''
            })
        }
    }
)
const weekOptions = () => {
    let pljgArr: any = []
    for (let i = 0; i < 7; i++) {
        switch (i) {
            case 0:
                pljgArr.push({ value: i + 1, label: '一' })
                break
            case 1:
                pljgArr.push({ value: i + 1, label: '二' })
                break
            case 2:
                pljgArr.push({ value: i + 1, label: '三' })
                break
            case 3:
                pljgArr.push({ value: i + 1, label: '四' })
                break
            case 4:
                pljgArr.push({ value: i + 1, label: '五' })
                break
            case 5:
                pljgArr.push({ value: i + 1, label: '六' })
                break
            case 6:
                pljgArr.push({ value: i + 1, label: '日' })
                break
        }
    }
    formData.pljgOptions = pljgArr
}

watch(
    () => baTable.form.items!.PLJG,
    (val) => {
        if (val) {
            let jgdw = baTable.form.items!.JGDW
            if (jgdw == '周') {
                weekOptions()
            } else {
                let pljgArr: any = []
                for (let i = 0; i < Number(val); i++) {
                    pljgArr.push({ value: i + 1, label: (i + 1).toString() })
                }
                formData.pljgOptions = pljgArr
            }
        }
    }
)

watch(
    () => baTable.form.items!.JGDW,
    (val) => {
        formData.plxxData.forEach((item: any) => {
            item.XDSJ = ''
            item.JDSJ = ''
        })
        if (val == '周') {
            baTable.form.items!.PLJG = 1
            weekOptions()
        } else {
            let pljg = baTable.form.items!.PLJG
            if (pljg) {
                let pljgArr: any = []
                for (let i = 0; i < Number(pljg); i++) {
                    pljgArr.push({ value: i + 1, label: (i + 1).toString() })
                }
                formData.pljgOptions = pljgArr
            }
        }
    }
)

watch(
    () => baTable.form.items!.PLBM,
    (val)=>{
        if(val && baTable.form.operate == 'Edit') {
            state.currentJgdw = baTable.form.items!.JGDW
            getPlsjfa({agrs:val}).then((res)=>{
                if(res.data.length>0){
                    let plsjData: any = []
                    for(let i=0; i < res.data.length; i++) {
                        formData.plxxData[i].XH = res.data[i].XH
                        if(baTable.form.items!.JGDW == "小时"){
                            let arr = res.data[i].SJFA.split(':')
                            plsjData.push({ XH:res.data[i].XH, XDSJ:arr[0], JDSJ:arr[1] })
                        }else{
                            let arr = res.data[i].SJFA.split('/')
                            plsjData.push({ XH:res.data[i].XH, XDSJ:arr[0], JDSJ:arr[1] })
                        }
                    }
                    formData.plxxData = plsjData
                }
            })
        }
    }
)

const mChange = (value: string) => {
    getPymWbm({agrs:value}).then((res)=>{
        baTable.form.items!.PYM = res.data.PYM
    })
}

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    PLMC: [buildValidatorData({ name: 'required', message: '频率名称不能为空.' })],
    JGDW: [buildValidatorData({ name: 'required', message: '间隔单位不能为空.' })],
    PLJG: [buildValidatorData({ name: 'required', message: '频率间隔不能为空.' })],
    PLCS: [buildValidatorData({ name: 'required', message: '频率次数不能为空.' })],
})

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            let plsjArr: any = []
            formData.plxxData.forEach((item: any) => {
                if(item.XH && item.XDSJ && item.JDSJ){
                    if(baTable.form.items!.JGDW == '小时') {
                        plsjArr.push({ XH:item.XH, SJFA:item.XDSJ+':'+item.JDSJ })
                    } else {
                        plsjArr.push({ XH:item.XH, SJFA:item.XDSJ+'/'+item.JDSJ })
                    }
                }
            })
            if(plsjArr.length != baTable.form.items!.PLCS){
                ElMessage.error('频率时间方案数据未填写完整.')
                return
            }
            let plfaArr = { plsj:plsjArr }
            let data = {
                agrs: { ...baTable.form.items, ...plfaArr }
            }
            baTable.onSubmitData(data, (res: any) => {
                if (res.code == 1) {
                    ElMessage.success('保存成功')
                }
            })
        } else {
            console.log('error submit!', fields)
        }
    })
}

</script>

<style scoped lang="scss">
.yd-card-header {
    padding: 13px 10px;
    background-color: #fff;
    margin-bottom: 1px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f5f5f5;
    margin-bottom: 10px;
    .title {
        color: #000;
        font-size: 17px;
        margin-right: 20px;
    }
    .title .left {
        display: inline-block;
        background-color: #409eff;
        width: 5px;
        height: 12px;
        margin-right: 10px;
    }
}
.yd-edit {
    padding: 20px 15px 5px 15px;
    :deep(.el-input){
        width: 190px;
    }
}

.ba-input-item-radio :deep(.el-form-item__content) {
    width: 190px;
}
</style>
