<template>
    <!-- 对话框表单 -->
    <el-dialog
        class="ba-operate-dialog yppz-edit"
        :close-on-click-modal="false"
        :model-value="['Add', 'Edit'].includes(baTable.form.operate!)"
        @close="baTable.toggleForm"
        :destroy-on-close="true"
        align-center
        id="edit-dialog"
        width="900px"
    >
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']">
                {{ baTable.form.operate == 'Add' ? '药品品种-新增' : '药品品种-修改' }}
            </div>
        </template>
        <el-scrollbar v-loading="baTable.form.loading" class="ba-table-form-scrollbar">
            <div
                class="ba-operate-form"
                :class="'ba-' + baTable.form.operate + '-form'"
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
                <div style="padding: 5px 15px;">
                    <el-row :gutter="2">
                        <el-col :xs="24" :sm="15">
                            <el-form-item prop="FLBM" label="药品分类">
                                <!-- <el-input v-model="baTable.form.items!.YPFL" :disabled="true" type="string" placeholder="请输入" style="width: 450px"></el-input> -->
                                <div class="ypfl-select">
                                    <el-cascader
                                        v-model="baTable.form.items!.FLBM"
                                        :props="defaultProps"
                                        :options="prop.flData"
                                        :show-all-levels="true"
                                        filterable
                                        clearable
                                        popper-class="flbm-tree-cascader"
                                        placeholder="请选择"
                                    />
                                </div>
                            </el-form-item> 
                        </el-col>
                        <el-col :xs="24" :sm="9">
                            <el-form-item prop="JYFL" label="基药分类">
                                <div class="fl-select">
                                    <el-select v-model="baTable.form.items!.JYFL" placeholder="请选择" filterable clearable>
                                        <el-option v-for="opt in state.jyflArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                    </el-select>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="2">
                        <el-col :xs="24" :sm="15">
                            <el-form-item prop="XMBM" label="药品编码">
                                <el-input v-model="baTable.form.items!.XMBM" :disabled="true" type="string" placeholder="请输入" style="width: 450px"></el-input>
                            </el-form-item> 
                        </el-col>
                        <el-col :xs="24" :sm="9">
                            <el-form-item prop="DLFLMC" label="毒理分类">
                                <!-- <el-input v-model="baTable.form.items!.DLFLMC" type="string" placeholder="请输入"></el-input> -->
                                <div class="fl-select">
                                    <el-select v-model="baTable.form.items!.DLFLMC" placeholder="请选择" filterable clearable>
                                        <el-option v-for="opt in state.dlflArr" :key="opt.MC" :label="opt.MC" :value="opt.MC"></el-option>
                                    </el-select>
                                </div>
                                
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="2">
                        <el-col :xs="24" :sm="15">
                            <el-form-item prop="XMMC" label="药品名称">
                                <el-input v-model="baTable.form.items!.XMMC" @change="mChange" type="string" placeholder="请输入" style="width: 450px"></el-input>
                            </el-form-item> 
                        </el-col>
                        <el-col :xs="24" :sm="9">
                            <el-form-item prop="JZFLMC" label="价值分类">
                                <!-- <el-input v-model="baTable.form.items!.JZFLMC" type="string" placeholder="请输入"></el-input> -->
                                <div class="fl-select">
                                    <el-select v-model="baTable.form.items!.JZFLMC" placeholder="请选择" filterable clearable>
                                        <el-option v-for="opt in state.jzflArr" :key="opt.MC" :label="opt.MC" :value="opt.MC"></el-option>
                                    </el-select>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="2">
                        <el-col :xs="24" :sm="7">
                            <el-form-item prop="PYM" label="拼音码">
                                <el-input v-model="baTable.form.items!.PYM" type="string" placeholder="请输入"></el-input>
                            </el-form-item> 
                        </el-col>
                        <el-col :xs="24" :sm="8">
                            <el-form-item prop="WBM" label="五笔码">
                                <el-input v-model="baTable.form.items!.WBM" type="string" placeholder="请输入"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="9">
                            <el-form-item prop="YYTC" label="用药梯次">
                                <el-select v-model="baTable.form.items!.YYTC" placeholder="请选择" filterable clearable>
                                    <el-option v-for="opt in yytcOptions" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="2">
                        <el-col :xs="24" :sm="7">
                            <el-form-item prop="YLMC" label="药理名称">
                                <!-- <el-input v-model="baTable.form.items!.YLMC" type="string" placeholder="请输入"></el-input> -->
                                <el-select v-model="baTable.form.items!.YLMC" placeholder="请选择" filterable clearable>
                                    <el-option v-for="opt in state.ylmcArr" :key="opt.MC" :label="opt.MC" :value="opt.MC"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="8">
                            <el-form-item prop="JXMC" label="药品剂型">
                                <!-- <el-input v-model="baTable.form.items!.JXMC" type="string" placeholder="请输入"></el-input> -->
                                <el-select v-model="baTable.form.items!.JXMC" placeholder="请选择" filterable clearable>
                                    <el-option v-for="opt in state.jxmcArr" :key="opt.MC" :label="opt.MC" :value="opt.MC"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="9">
                            <el-form-item prop="KSSSX" label="抗生素属性">
                                <el-select v-model="baTable.form.items!.KSSSX" placeholder="请选择" filterable clearable>
                                    <el-option v-for="opt in state.ksssxArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="2">
                        <el-col :xs="24" :sm="7">
                            <el-form-item prop="MZCFZW" label="门诊处方职务">
                                <!-- <el-input v-model="baTable.form.items!.MZCFZW" type="string" placeholder="请输入"></el-input> -->
                                <el-select v-model="baTable.form.items!.MZCFZW" placeholder="请选择" filterable clearable>
                                    <el-option v-for="opt in state.mzcfzwArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="8">
                            <el-form-item prop="ZYCFZW" label="住院处方职务">
                                <!-- <el-input v-model="baTable.form.items!.MZCFZW" type="string" placeholder="请输入"></el-input> -->
                                <el-select v-model="baTable.form.items!.ZYCFZW" placeholder="请选择" filterable clearable>
                                    <el-option v-for="opt in state.mzcfzwArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="9">
                            <el-form-item prop="CFLX" label="处方类型">
                                <el-select v-model="baTable.form.items!.CFLX" placeholder="请选择" filterable clearable>
                                    <el-option v-for="opt in cflxOptions" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="2">
                        <el-col :xs="24" :sm="7">
                            <el-form-item prop="ZCYQ" label="贮藏要求">
                                <el-input v-model="baTable.form.items!.ZCYQ" type="string" placeholder="请输入"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="8">
                            <el-form-item prop="CYBXTK" label="草药保险条款">
                                <el-select v-model="baTable.form.items!.CYBXTK" placeholder="请选择" filterable clearable>
                                    <el-option v-for="opt in cybxtkOptions" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="9">
                            <div style="padding-left: 45px;overflow: hidden;">
                                <el-checkbox v-model="baTable.form.items!.KZLYW" :true-label="1" :false-label="0" label="肿瘤药" style="margin-right: 6px;" />
                                <el-select v-model="baTable.form.items!.KZLYWSX" placeholder="请选择" filterable clearable :disabled="baTable.form.items!.KZLYW!=1">
                                    <el-option v-for="opt in state.kzlywsxArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                </el-select>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row :gutter="2">
                        <el-col :xs="24" :sm="24">
                            <div style="border: 1px solid #dcdfe6;margin: 0px 0px 0px 30px;width: 795px;padding: 10px 35px 10px 35px;">
                                <el-checkbox v-model="baTable.form.items!.JJY" :true-label="'1'" :false-label="'0'" label="急救药" class="chk-attr" />
                                <el-checkbox v-model="baTable.form.items!.RM" :true-label="'1'" :false-label="'0'" label="溶媒" class="chk-attr" />
                                <el-checkbox v-model="baTable.form.items!.XY" :true-label="1" :false-label="0" label="新药" class="chk-attr" />
                                <el-checkbox v-model="baTable.form.items!.PS" :true-label="1" :false-label="0" label="皮试" class="chk-attr" />
                                <el-checkbox v-model="baTable.form.items!.HXFJYP" :true-label="1" :false-label="0" label="含兴奋剂" class="chk-attr" />
                                <el-checkbox v-model="baTable.form.items!.YUANLIAO" :true-label="1" :false-label="0" label="原料" class="chk-attr" />
                                <el-checkbox v-model="baTable.form.items!.DSY" :true-label="1" :false-label="0" label="大输液" class="chk-attr" />
                                <el-checkbox v-model="baTable.form.items!.ZDJKYP" :true-label="1" :false-label="0" label="重点监控药品" class="chk-attr" />
                                <el-checkbox v-model="baTable.form.items!.FZYY" :true-label="1" :false-label="0" label="辅助用药" class="chk-attr" />
                                <el-checkbox v-model="baTable.form.items!.GJSYP" :true-label="1" :false-label="0" label="高警示药品" class="chk-attr" />
                                <el-checkbox v-model="baTable.form.items!.TPZJS" :true-label="1" :false-label="0" label="糖皮质激素" class="chk-attr" />
                                <el-checkbox v-model="baTable.form.items!.ZZBYZJ" :true-label="1" :false-label="0" label="质子泵抑制剂" class="chk-attr" />
                                <el-checkbox v-model="baTable.form.items!.ZYZSJ" :true-label="1" :false-label="0" label="中药注射剂" class="chk-attr" />
                                <el-checkbox v-model="baTable.form.items!.CWYY" :true-label="1" :false-label="0" label="肠外营养" class="chk-attr" />
                                <el-checkbox v-model="baTable.form.items!.XYZP" :true-label="1" :false-label="0" label="血液制品" class="chk-attr" />
                                <el-checkbox v-model="baTable.form.items!.DXYP" :true-label="1" :false-label="0" label="毒性药品" class="chk-attr" />
                                <el-checkbox v-model="baTable.form.items!.FSXYP" :true-label="1" :false-label="0" label="放射性药品" class="chk-attr" />
                                <el-checkbox v-model="baTable.form.items!.LLCP" :true-label="1" :false-label="0" label="冷链产品" class="chk-attr" />
                                <el-checkbox v-model="baTable.form.items!.YYAQJC" :true-label="1" :false-label="0" label="用药安全检测" class="chk-attr" />
                            </div>
                        </el-col>
                    </el-row>
                </div>
                </el-form>
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
import type { FormInstance, FormItemRule } from 'element-plus'
import { buildValidatorData } from '/@/utils/validate'
import { getPymWbm } from '/@/api/common'

const formRef = ref<FormInstance>()
const baTable = inject('baTable') as baTableClass
const prop = defineProps(['zdData', 'flData'])

const state: {
    jxmcArr: any //剂型名称
    ylmcArr: any //药理名称
    dlflArr: any //毒理分类
    jzflArr: any //价值分类
    jyflArr: any //基药分类
    mzcfzwArr: any //门诊处方职务
    ksssxArr: any //抗生素属性
    kzlywsxArr: any //抗肿瘤药物属性
} = reactive({
    jxmcArr: [],
    ylmcArr: [],
    dlflArr: [],
    jzflArr: [],
    jyflArr: [],
    mzcfzwArr: [],
    ksssxArr: [],
    kzlywsxArr: []
})

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    JXMC: [buildValidatorData({ name: 'required', message: '剂型名称不能为空.' })],
    FWDX: [buildValidatorData({ name: 'required', message: '服务对象不能为空.' })],
    XMMC: [buildValidatorData({ name: 'required', message: '药品名称不能为空.' })]
})

watch(
    () => baTable.form.operate,
    () => {
        state.jyflArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_009050')
        state.jxmcArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_009011')
        state.ylmcArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_009015')
        state.dlflArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_009017')
        state.jzflArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_009018')
        state.mzcfzwArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_009046')
        let mzcfzwDefault = state.mzcfzwArr.find((ele: any) => ele.BM === '0')
        if(!mzcfzwDefault) {
            state.mzcfzwArr.unshift({ FLBM:'GB_009046', BM:'0', MC:'不限' })
        }
        state.ksssxArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_KSF9090')
        state.kzlywsxArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_KZLYWSX001')
        let kzlywsxDefault = state.kzlywsxArr.find((ele: any) => ele.BM === '0')
        if(!kzlywsxDefault) {
            state.kzlywsxArr.unshift({ FLBM:'GB_KZLYWSX001', BM:'0', MC:'未限定' })
        }
    }
)

const mChange = (value: string) => {
    getPymWbm({ agrs: value }).then((res) => {
        baTable.form.items!.PYM = res.data.PYM
        baTable.form.items!.WBM = res.data.WBM
    })
}

const defaultProps = {
    label: 'FLMC', 
    value: 'FLBM',
    checkStrictly: true
}

const cflxOptions = [
    { value: 0, label: '未限定' },
    { value: 1, label: '处方药' },
    { value: 2, label: '甲类非处方药' },
    { value: 3, label: '乙类非处方药' },
    { value: 4, label: '非处方药' },
    { value: 5, label: '其他用药' },
]
const cybxtkOptions = [
    { value: 0, label: '无' },
    { value: 1, label: '中草药不可报' },
    { value: 2, label: '中草药复方可报' },
    { value: 3, label: '中草药单方可报' },
]

const yytcOptions = [
    { value: 1, label: '首选' },
    { value: 2, label: '次选' },
    { value: 3, label: '备用' },
]

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            //console.log(baTable.form.items)
            if(Array.isArray(baTable.form.items!.FLBM) && baTable.form.items!.FLBM.length>0) {
                baTable.form.items!.FLBM = baTable.form.items!.FLBM[baTable.form.items!.FLBM.length-1]
            }
            let data = {
                agrs: baTable.form.items
            }
            baTable.onSubmitData(data, (res: any) => {
                if (res.code == 1) {
                }
            })
        } else {
            console.log('error submit!', fields)
        }
    })
}
</script>

<style scoped lang="scss">
.ba-operate-form .el-row{

.el-col:nth-child(1){
    :deep(.el-input){
        width: 170px;
    }
    :deep(.el-form-item__label){
        width: 90px !important;
    }
    .ypfl-select{
        display: inline-block;
        :deep(.el-input){
            width: 450px;
        }
    }
}
.el-col:nth-child(2){
    :deep(.el-input){
        width: 180px;
    }
    .fl-select{
        display: inline-block;
        :deep(.el-input){
            width: 190px;
        }
    }
}
.el-col:nth-child(3){
    :deep(.el-input){
        width: 190px;
    }
}
.el-checkbox{
    color: #000;
}
.el-checkbox.chk-attr{
    width: 150px;
}
}
</style>
