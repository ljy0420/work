<template>
    <div>
        <el-dialog
            class="ba-operate-dialog"
            :close-on-click-modal="false"
            :model-value="state.show"
            @close="onClose"
            :destroy-on-close="true"
            align-center
            width="1000px"
        >
            <template #header>
                <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">编辑资料</div>
            </template>
            <el-scrollbar class="ba-table-form-scrollbar">
                <div class="ba-operate-form">
                    <el-form ref="formRef" :model="form" label-position="right" label-width="100px" :rules="rules">
                        <div class="title1">基本信息</div>
                        <div class="jbxx">
                            <el-row :gutter="0">
                                <el-col :xs="12" :sm="6">
                                    <el-form-item label="姓名:" prop="XM">
                                        <el-input v-model="form!.XM" type="string" placeholder="请输入"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="6">
                                    <el-form-item label="性别:" prop="XB">
                                        <el-select v-model="form!.XB" filterable clearable style="width: 130px">
                                            <el-option v-for="opt in state.xbArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="5">
                                    <el-form-item label="证件类型:" prop="ZJLX">
                                        <el-select v-model="form!.ZJLX" filterable clearable style="width: 130px">
                                            <el-option v-for="opt in state.kxlArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="1">
                                    <el-button type="info" style="margin-left: 5px">读卡</el-button>
                                </el-col>
                                <el-col :xs="12" :sm="6">
                                    <el-form-item label="证件号码:" prop="ZJHM">
                                        <el-input v-model="form!.ZJHM" type="string" placeholder="请输入"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="0" class="row">
                                <el-col :xs="12" :sm="6">
                                    <el-form-item label="电话:" prop="DH">
                                        <el-input v-model="form!.DH" type="string" placeholder="请输入"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="6">
                                    <el-form-item label="民族:" prop="MZ">
                                        <el-select v-model="form!.MZ" filterable clearable style="width: 130px">
                                            <el-option v-for="opt in state.mzArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="12">
                                    <el-form-item label="证件类型:" prop="YBZJLX">
                                        <el-select v-model="form!.YBZJLX" filterable clearable style="width: 100%">
                                            <el-option v-for="opt in state.ybzjlxArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="0" class="row">
                                <el-col :xs="12" :sm="6">
                                    <el-form-item label="年龄:" prop="NL">
                                        <el-input v-model="form!.NL" type="string" placeholder="       岁       月       日"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="18">
                                    <el-form-item label="住址:" prop="ZZ">
                                        <el-input v-model="form!.ZZ" type="string" placeholder="请输入"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="title1">其他信息</div>
                        <div class="jbxx">
                            <el-row :gutter="0">
                                <el-col :xs="12" :sm="6">
                                    <el-form-item label="医疗卡号:" prop="YLKH">
                                        <el-input v-model="form!.YLKH" type="string" placeholder="请输入"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="6">
                                    <el-form-item label="籍贯:" prop="JG">
                                        <el-input v-model="form!.JG" type="string" placeholder="请输入"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="6">
                                    <el-form-item label="接诊科室:" prop="JZKS">
                                        <el-select v-model="form!.JZKS" filterable clearable style="width: 130px">
                                            <el-option v-for="opt in state.jzksArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="6">
                                    <el-form-item label="婚姻状况:" prop="HYZK">
                                        <el-select v-model="form!.HYZK" filterable clearable style="width: 150px">
                                            <el-option v-for="opt in state.hyzkArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="0" class="row">
                                <el-col :xs="12" :sm="6">
                                    <el-form-item label="诊疗卡号:" prop="ZLKH">
                                        <el-input v-model="form!.ZLKH" type="string" placeholder="请输入"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="6">
                                    <el-form-item label="职业:" prop="ZY">
                                        <el-input v-model="form!.ZY" type="string" placeholder="请输入"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="12">
                                    <el-form-item label="工作单位:" prop="GZDW">
                                        <el-input v-model="form!.GZDW" type="string" placeholder="请输入"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="title1">联系人/陪同人信息</div>
                        <div class="jbxx">
                            <el-row :gutter="0">
                                <el-col :xs="12" :sm="6">
                                    <el-form-item label="姓名:" prop="LXRXM">
                                        <el-input v-model="form!.LXRXM" type="string" placeholder="请输入"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="6">
                                    <el-form-item label="电话:" prop="LXRDH">
                                        <el-input v-model="form!.LXRDH" type="string" placeholder="请输入"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="5">
                                    <el-form-item label="证件类型:" prop="LXRZJLX">
                                        <el-select v-model="form!.LXRZJLX" filterable clearable style="width: 130px">
                                            <el-option v-for="opt in state.kxlArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="1">
                                    <el-button type="info" style="margin-left: 5px">读卡</el-button>
                                </el-col>
                                <el-col :xs="12" :sm="6">
                                    <el-form-item label="证件号码:" prop="LXRZJHM">
                                        <el-input v-model="form!.LXRZJHM" type="string" placeholder="请输入"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="title1">联系人/陪同人信息</div>
                        <div class="jbxx">
                            <el-row :gutter="0">
                                <el-col :xs="12" :sm="12">
                                    <el-form-item label="学校:" prop="XX">
                                        <el-input v-model="form!.LXRXX" type="string" placeholder="请输入"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="6">
                                    <el-form-item label="家长姓名:" prop="LXRJZXM">
                                        <el-input v-model="form!.LXRJZXM" type="string" placeholder="请输入"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="6">
                                    <span></span>
                                </el-col>
                            </el-row>
                        </div>
                    </el-form>
                </div>
            </el-scrollbar>
            <template #footer>
                <div class="yd-from-footer">
                    <el-button ref="btnSave" v-blur type="primary" @click="onSubmit(formRef)" class="btn-form-save"> 保存 </el-button>
                    <el-button @click="onClose" class="btn-form-cancel">取消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import type { FormInstance, FormItemRule } from 'element-plus'
const formRef = ref<FormInstance>()

const form = reactive({
    XM: '', //姓名
    XB: '', //性别
    ZJLX: '', //证件类型
    ZJHM: '', //证件号码
    DH: '', //电话
    MZ: '', //民族
    YBZJLX: '', //医保证件类型
    NL: '', //年龄
    ZZ: '', //住址
    YLKH: '', //医疗卡号
    JG: '', //籍贯
    JZKS: '', //接诊科室
    HYZK: '', //婚姻状况
    ZLKH: '', //诊疗卡号
    ZY: '', //职业
    GZDW: '', //工作单位
    LXRXM: '', //联系人/陪同人姓名
    LXRDH: '', //联系人/陪同人电话
    LXRZJLX: '', //联系人/陪同人证件类型
    LXRZJHM: '', //联系人/陪同人证件号码
    LXRXX: '', //联系人学校
    LXRJZXM: '', //联系人家长姓名
})

const state = reactive({
    show: false,
    loading: false,
    mzArr: [
        { BM: '1', MC: '汉族' },
        { BM: '2', MC: '满族' },
        { BM: '3', MC: '藏族' },
        { BM: '4', MC: '苗族' },
        { BM: '5', MC: '侗族' },
        { BM: '6', MC: '傣族' },
    ],
    hyzkArr: [
        { BM: '1', MC: '未婚' },
        { BM: '2', MC: '已婚' },
        { BM: '3', MC: '丧偶' },
    ],
    ybzjlxArr: [
        { BM: '1', MC: '医保·居民(未成年)' },
        { BM: '2', MC: '市医保' },
        { BM: '3', MC: '单病种住院' },
    ],
    kxlArr: [
        { BM: '1', MC: '医保' },
        { BM: '2', MC: '国家医保' },
        { BM: '3', MC: '健康卡' },
        { BM: '4', MC: '身份证' },
    ],
    xbArr: [
        { BM: '1', MC: '男' },
        { BM: '2', MC: '女' },
        { BM: '3', MC: '未知性别' },
    ],
    jzksArr: [
        { BM: '1', MC: '急诊科' },
        { BM: '2', MC: '门诊' },
        { BM: '3', MC: '皮肤科' },
    ],
})

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    XM: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
    XB: [{ required: true, message: '性别不能为空', trigger: 'change' }],
    ZJLX: [{ required: true, message: '证件类型不能为空', trigger: 'change' }],
    ZJHM: [{ required: true, message: '证件号码不能为空', trigger: 'blur' }],
    DH: [{ required: true, message: '电话不能为空', trigger: 'blur' }],
    MZ: [{ required: true, message: '民族不能为空', trigger: 'change' }],
    YBZJLX: [{ required: true, message: '医保证件类型不能为空', trigger: 'change' }],
    NL: [{ required: true, message: '年龄不能为空', trigger: 'blur' }],
})

const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid: any, fields: any) => {
        if (valid) {
        } else {
            console.log('error submit!', fields)
        }
    })
}

onMounted(() => {})

const onClose = () => {
    state.show = false
}

const show = () => {
    state.show = true
}

defineExpose({ show })
</script>

<style scoped lang="scss">
.title1 {
    padding-left: 15px;
    position: relative;
    color: black;
    font-weight: bold;
}

.title1::before {
    content: '';
    position: absolute;
    left: 0px;
    top: 1px;
    width: 4px;
    height: 100%;
    background-color: #1c90ff;
}
.el-form-item {
    margin-bottom: 10px;
}

:deep(.el-dialog__body) {
    height: 550px;
}
.jbxx {
    margin-top: 10px;
    margin-left: -30px;
}
.row {
    margin-top: 10px;
}
</style>
