<template>
    <!-- 对话框表单 -->
    <el-dialog
        class="ba-operate-dialog clzd-edit"
        :close-on-click-modal="false"
        :model-value="['Add', 'Edit'].includes(baTable.form.operate!)"
        @close="baTable.toggleForm"
        :destroy-on-close="true"
        align-center
        id="edit-dialog"
        width="950px"
    >
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']">
                {{ baTable.form.operate == 'Add' ? '卫材信息-新增' : '卫材信息-修改' }}
            </div>
        </template>
        <el-scrollbar v-loading="baTable.form.loading" class="ba-table-form-scrollbar">
            <div class="ba-operate-form" :class="'ba-' + baTable.form.operate + '-form'">
                <el-form
                    :inline="true"
                    ref="formRef"
                    :model="baTable.form.items"
                    label-position="right"
                    :label-width="baTable.form.labelWidth + 'px'"
                    :rules="rules"
                    v-if="!baTable.form.loading"
                >
                <div style="padding: 5px 15px;">
                    <el-row :gutter="2">
                        <el-col :xs="24" :sm="8">
                            <el-form-item prop="CLBM" label="材料编码">
                        <el-input v-model="baTable.form.items!.CLBM" :disabled="true" type="string" placeholder="系统自动生成"></el-input>
                    </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="8">
                            <el-form-item prop="CLMC" label="材料名称">
                        <el-input v-model="baTable.form.items!.CLMC" type="string" placeholder="请输入"></el-input>
                    </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="8">
                            <el-form-item prop="MJXQ" label="灭菌效期(月)">
                        <el-input v-model="baTable.form.items!.MJXQ" type="number" placeholder="请输入"></el-input>
                    </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="2">
                        <el-col :xs="24" :sm="8">
                            <el-form-item prop="HYQK" label="货源情况">
                        <el-select v-model="baTable.form.items!.HYQK" placeholder="请选择" filterable clearable style="width: 100%">
                            <el-option v-for="opt in state.hyqkArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                        </el-select>
                    </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="8">
                            <el-form-item prop="JZFL" label="价值分类">
                        <el-select v-model="baTable.form.items!.JZFL" placeholder="请选择" filterable clearable style="width: 100%">
                            <el-option v-for="opt in state.jzflArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                        </el-select>
                    </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="8">
                            <el-form-item prop="CZFL" label="材质分类">
                        <el-select v-model="baTable.form.items!.CZFL" placeholder="请选择" filterable clearable style="width: 100%">
                            <el-option v-for="opt in state.czflArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                        </el-select>
                    </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="2">
                        <el-col :xs="24" :sm="8">
                            <el-form-item prop="ZCYQ" label="贮藏要求">
                        <el-select v-model="baTable.form.items!.ZCYQ" placeholder="请选择" filterable clearable style="width: 100%">
                            <el-option v-for="opt in state.zcyqArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                        </el-select>
                    </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="8">
                            <el-form-item prop="XKZH" label="许可证号">
                        <el-input v-model="baTable.form.items!.XKZH" type="string" placeholder="请输入"></el-input>
                    </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="8">
                            <el-form-item prop="XKZYXQ" label="许可证有效期">
                        <el-date-picker v-model="baTable.form.items!.XKZYXQ" type="date" placeholder="请选择" style="width: 100%" />
                    </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="2">
                        <el-col :xs="24" :sm="8">
                            <el-form-item prop="PZWH" label="批准文号">
                        <el-input v-model="baTable.form.items!.PZWH" type="string" placeholder="请输入"></el-input>
                    </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="8">
                            <el-form-item prop="ZCSB" label="注册商标">
                        <el-input v-model="baTable.form.items!.ZCSB" type="string" placeholder="请输入"></el-input>
                    </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="8">
                            <el-form-item prop="ZCZH" label="注册证号">
                        <el-input v-model="baTable.form.items!.ZCZH" type="string" placeholder="请输入"></el-input>
                    </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="2">
                        <el-col :xs="24" :sm="8">
                            <el-form-item prop="BZDW" label="包装单位">
                        <!-- <el-input v-model="baTable.form.items!.BZDW" type="string" placeholder="请输入"></el-input> -->
                        <el-select v-model="baTable.form.items!.BZDW" placeholder="请选择" filterable clearable>
                                            <el-option v-for="opt in state.jbdwArr" :key="opt.MC" :label="opt.MC" :value="opt.MC"></el-option>
                                        </el-select>
                    </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="8">
                            <el-form-item prop="BZSL" label="包装数量">
                        <el-input v-model="baTable.form.items!.BZSL" type="number" placeholder="请输入"></el-input>
                    </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="8">
                            <el-form-item prop="JL" label="剂量">
                        <el-input v-model="baTable.form.items!.JL" type="number" placeholder="请输入"></el-input>
                    </el-form-item>
                            
                        </el-col>
                    </el-row>
                    <el-row :gutter="2">
                        <el-col :xs="24" :sm="8">
                            <el-form-item prop="JLDW" label="剂量单位">
                        <el-select v-model="baTable.form.items!.JLDW" placeholder="请选择" filterable clearable style="width: 100%" @focus="jldwFocus">
                            <el-option v-for="opt in state.jldwArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                        </el-select>
                    </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="8">
                            <el-form-item prop="ZDJ" label="指导价">
                        <el-input v-model="baTable.form.items!.ZDJ" type="number" placeholder="请输入"></el-input>
                    </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="8">
                            <el-form-item prop="CBJ" label="成本价">
                        <el-input v-model="baTable.form.items!.CBJ" type="number" placeholder="请输入"></el-input>
                    </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="2">
                        <el-col :xs="24" :sm="8">
                            <el-form-item prop="CDLX" label="产地类型">
                        <el-input v-model="baTable.form.items!.CDLX" type="string" placeholder="请输入"></el-input>
                    </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="8">
                            <el-form-item prop="ZCZHMC" label="注册证号名称">
                        <el-input v-model="baTable.form.items!.ZCZSMC" type="string" placeholder="请输入"></el-input>
                    </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="8">
                            <el-form-item prop="ZCZHYXQ" label="注册证号有效期">
                        <el-date-picker v-model="baTable.form.items!.ZCZHYXQ" type="date" placeholder="请选择" style="width: 100%" />
                    </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="2">
                        <el-col :xs="24" :sm="8">
                            <el-form-item prop="CZ" label="材质">
                        <el-input v-model="baTable.form.items!.CZ" type="string" placeholder="请输入"></el-input>
                    </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="8">
                            <el-form-item prop="XH" label="型号">
                        <el-input v-model="baTable.form.items!.XH" type="string" placeholder="请输入"></el-input>
                    </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="8">
                            <el-form-item prop="GLLB" label="管理类别">
                        <el-select v-model="baTable.form.items!.GLLB" placeholder="请选择" filterable clearable style="width: 100%">
                            <el-option v-for="opt in state.gllbArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                        </el-select>
                    </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="2">
                        <el-col :xs="24" :sm="8">
                            <div class="single-chk">
                                    <el-checkbox v-model="baTable.form.items!.WJCL" :true-label="1" :false-label="0" label="无菌材料" class="chk-attr" />
                                    <el-checkbox v-model="baTable.form.items!.YCXCL" :true-label="1" :false-label="0" label="一次性材料" class="chk-attr" />
                                    <el-checkbox v-model="baTable.form.items!.YCL" :true-label="1" :false-label="0" label="原材料" class="chk-attr" />
                                    <el-checkbox v-model="baTable.form.items!.ZZCL" :true-label="1" :false-label="0" label="自制材料" class="chk-attr" />
                                    <el-checkbox v-model="baTable.form.items!.ZBCL" :true-label="1" :false-label="0" label="招标材料" class="chk-attr" />
                                    <el-checkbox v-model="baTable.form.items!.QCGL" :true-label="1" :false-label="0" label="全程管理" class="chk-attr" />
                                    <el-checkbox v-model="baTable.form.items!.LCYY" :true-label="1" :false-label="0" label="临床应用" class="chk-attr" />
                                    <el-checkbox v-model="baTable.form.items!.ZRCL" :true-label="1" :false-label="0" label="植入材料" class="chk-attr" />
                                    <el-checkbox v-model="baTable.form.items!.GZHC" :true-label="1" :false-label="0" label="高值耗材" class="chk-attr" />
                                    <el-checkbox v-model="baTable.form.items!.JRCL" :true-label="1" :false-label="0" label="介入材料" class="chk-attr" />
                                    <el-checkbox v-model="baTable.form.items!.ZDJK" :true-label="1" :false-label="0" label="重点监控" class="chk-attr" />
                                    <el-checkbox v-model="baTable.form.items!.YXZT" :true-label="'0'" :false-label="'1'" label="禁止使用" class="chk-attr" />
                            </div>
                        </el-col>
                    </el-row>
                    
                </div>

                    <!-- <FormItem
                        label="无菌材料"
                        v-model="baTable.form.items!.WJCL"
                        type="radio"
                        :data="{ content: { '0': '否', '1': '是' }, childrenAttr: { border: true } }"
                    />
                    <FormItem
                        label="一次性材料"
                        v-model="baTable.form.items!.YCXCL"
                        type="radio"
                        :data="{ content: { '0': '否', '1': '是' }, childrenAttr: { border: true } }"
                    />
                    <el-form-item prop="YCL" label="原材料">
                        <el-input v-model="baTable.form.items!.YCL" type="number" placeholder="请输入原材料"></el-input>
                    </el-form-item>
                    <el-form-item prop="ZZCL" label="自制材料">
                        <el-input v-model="baTable.form.items!.ZZCL" type="number" placeholder="请输入自制材料"></el-input>
                    </el-form-item>

                    <FormItem
                        label="招标材料"
                        v-model="baTable.form.items!.ZBCL"
                        type="radio"
                        :data="{ content: { '0': '否', '1': '是' }, childrenAttr: { border: true } }"
                    />
                    <FormItem
                        label="全程管理"
                        v-model="baTable.form.items!.QCGL"
                        type="radio"
                        :data="{ content: { '0': '否', '1': '是' }, childrenAttr: { border: true } }"
                    />
                    <el-form-item prop="LCYY" label="临床应用">
                        <el-input v-model="baTable.form.items!.LCYY" type="number" placeholder="请输入临床应用"></el-input>
                    </el-form-item>
                    <FormItem
                        label="植入材料"
                        v-model="baTable.form.items!.ZRCL"
                        type="radio"
                        :data="{ content: { '0': '否', '1': '是' }, childrenAttr: { border: true } }"
                    />

                    <FormItem
                        label="高值耗材"
                        v-model="baTable.form.items!.GZHC"
                        type="radio"
                        :data="{ content: { '0': '否', '1': '是' }, childrenAttr: { border: true } }"
                    />
                    <FormItem
                        label="介入材料"
                        v-model="baTable.form.items!.JRCL"
                        type="radio"
                        :data="{ content: { '0': '否', '1': '是' }, childrenAttr: { border: true } }"
                    />
                    <FormItem
                        label="重点监控"
                        v-model="baTable.form.items!.ZDJK"
                        type="radio"
                        :data="{ content: { '0': '否', '1': '是' }, childrenAttr: { border: true } }"
                    />
                    <FormItem
                        label="有效状态"
                        v-model="baTable.form.items!.YXZT"
                        type="radio"
                        :data="{ content: { '0': '禁用', '1': '启用' }, childrenAttr: { border: true } }"
                    /> -->
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
import FormItem from '/@/components/formItem/index.vue'
import type { FormInstance, FormItemRule } from 'element-plus'
import { buildValidatorData } from '/@/utils/validate'
import { useAdminInfo } from '/@/stores/adminInfo'
import { getGetYzxmzd } from '/@/api/common'
import { getdwzd } from '/@/api/backend/jcgl/wcml'

const adminInfo = useAdminInfo()
const formRef = ref<FormInstance>()
const baTable = inject('baTable') as baTableClass

const prop = defineProps(['zdData', 'selectFlbm', 'yzbm'])
const state: {
    hyqkArr: any //货源情况
    jzflArr: any //价值分类
    czflArr: any //材质分类
    zcyqArr: any //贮藏要求
    gllbArr: any //管理类别
    yzxmbmArr: any
    jbdwArr: any //基本单位
    jldwArr: any
} = reactive({
    hyqkArr: [],
    jzflArr: [],
    czflArr: [],
    zcyqArr: [],
    gllbArr: [],
    yzxmbmArr: [],
    jbdwArr: [],
    jldwArr: [],
})

// 医嘱项目字典
const yzFocus = async () => {
    const res = await getGetYzxmzd({ agrs: { leiBieBM: '25' } })
    state.yzxmbmArr = res.data.options
}
// 剂量单位
const jldwFocus = async () => {
    const res = await getdwzd({ agrs: {} })
    state.jldwArr = res.data
}

watch(
    () => baTable.form.operate,
    () => {
        state.jbdwArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_009012')
        state.hyqkArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_100006')
        state.jzflArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_009018')
        state.czflArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_100007')
        state.zcyqArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_100008')
        state.gllbArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_100009')
    }
)

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    CLMC: [buildValidatorData({ name: 'required', message: '材料名称不能为空.' })],
    MJXQ: [buildValidatorData({ name: 'required', message: '灭菌效期不能为空.' })],
    HYQK: [buildValidatorData({ name: 'required', message: '货源情况不能为空.' })],
    JZFL: [buildValidatorData({ name: 'required', message: '价值分类不能为空.' })],
    BZDW: [buildValidatorData({ name: 'required', message: '包装单位不能为空.' })],
    BZSL: [buildValidatorData({ name: 'required', message: '包装数量不能为空.' })],
})
// 表单提交
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            let data = {
                agrs: {
                    clzd: { JGBM: adminInfo.jgbm, ...baTable.form.items, FLBM: prop.selectFlbm, YZXMBM: prop.yzbm },
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
// .ba-input-item-radio :deep(.el-form-item__content) {
//     width: 220px;
// }
.ba-operate-form .el-row {

.el-col:nth-child(1) {
    :deep(.el-input) {
        width: 180px;
    }

    :deep(.el-form-item__label) {
        width: 90px !important;
    }
}

.el-col:nth-child(2) {
    :deep(.el-input) {
        width: 180px;
    }

    :deep(.el-form-item__label) {
        width: 100px !important;
    }
}

.el-col:nth-child(3) {
    :deep(.el-input) {
        width: 170px;
    }
}
.single-chk{
        border: 1px solid #dcdfe6;
        margin: 0px 0px 0px 30px;
        width: 840px;
        padding: 5px 35px 5px 35px;
    }
.el-checkbox {
    color: #000;
}

.el-checkbox.chk-attr {
    width: 130px;
}
}
</style>
