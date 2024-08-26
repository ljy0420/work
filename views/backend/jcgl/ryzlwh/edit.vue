<template>
    <!-- 对话框表单 -->
    <el-dialog
        class="ba-operate-dialog ryzl-edit"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        id="edit-dialog"
        :model-value="['Add', 'Edit'].includes(baTable.form.operate!)"
        @close="baTable.toggleForm"
        align-center
        :fullscreen="state.fullscreen"
        width="70vw"
    >
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">
                <span>{{ baTable.form.operate == 'Add' ? '医护人员资料-新增' : '医护人员资料-修改' }}</span>
                <div class="right" @click="changeFullscreen">
                    <Icon name="el-icon-FullScreen" size="16" style="color: #333" />
                </div>
            </div>
        </template>
        <el-scrollbar v-loading="baTable.form.loading" class="ba-table-form-scrollbar">
            <div class="yd-input-round">
                <el-form
                    ref="formRef"
                    :inline="true"
                    :model="baTable.form.items"
                    label-position="right"
                    :label-width="baTable.form.labelWidth + 'px'"
                    :rules="rules"
                    v-if="!baTable.form.loading"
                >
                    <div class="yd-card">
                        <div class="yd-card-header">
                            <div class="title">
                                <div class="left"></div>
                                <span>基本信息</span>
                            </div>
                        </div>
                        <div class="yd-card-body">
                            <el-form-item prop="RYBM" label="人员编码">
                                <el-input v-model="baTable.form.items!.RYBM" type="string" placeholder="请输入人员编码" clearable :disabled="baTable.form.operate=='Edit'"></el-input>
                            </el-form-item>
                            <el-form-item prop="RYXM" label="人员姓名">
                                <el-input
                                    v-model="baTable.form.items!.RYXM"
                                    @change="mChange"
                                    type="string"
                                    placeholder="请输入人员姓名"
                                    clearable
                                ></el-input>
                            </el-form-item>
                            <el-form-item prop="LSZ" label="隶属组">
                                <el-select v-model="baTable.form.items!.LSZ" placeholder="请选择隶属组" filterable clearable style="width: 100%">
                                    <el-option v-for="opt in state.lszArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                </el-select>
                            </el-form-item>

                            <div style="display: block" class="ssks-box">
                                <el-form-item prop="RYKSBM" label="所属科室">
                                    <el-select
                                        v-model="state.kslxlb"
                                        @change="ryksChange"
                                        multiple
                                        placeholder="请选择所属科室"
                                        filterable
                                        clearable
                                        style="width: 100%"
                                    >
                                        <el-option v-for="opt in prop.ksData" :key="opt.KSBM" :label="opt.KSMC" :value="opt.KSBM"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <!-- <el-form-item prop="ZGKS" label="主管科室">
                                <el-select v-model="baTable.form.items!.ZGKS" filterable placeholder="请选择主管科室" clearable style="width: 100%">
                                    <el-option v-for="opt in state.zgksArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                </el-select>
                            </el-form-item> -->
                            <el-form-item prop="ZGKS" label="主管科室">
                                <el-select v-model="baTable.form.items!.ZGKS" placeholder="请选择主管科室" filterable clearable style="width: 100%">
                                    <el-option v-for="opt in state.zgksArr" :key="opt.KSBM" :label="opt.KSMC" :value="opt.KSBM"></el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item prop="KL" label="登录口令">
                                <el-input
                                    v-model="baTable.form.items!.KL"
                                    type="password"
                                    placeholder="请输入登录口令"
                                    clearable
                                    show-password
                                ></el-input>
                            </el-form-item>
                            <el-form-item prop="XBDM" label="人员性别">
                                <el-select v-model="baTable.form.items!.XBDM" placeholder="请选择人员性别" filterable clearable style="width: 100%">
                                    <el-option v-for="opt in state.ryxbArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="MZ" label="民族">
                                <el-select v-model="baTable.form.items!.MZ" placeholder="请选择民族" filterable clearable style="width: 100%">
                                    <el-option v-for="opt in state.mzArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="SFZJZL" label="证件类型">
                                <el-select v-model="baTable.form.items!.SFZJZL" placeholder="请选择证件类型" filterable clearable style="width: 100%">
                                    <el-option v-for="opt in state.zjlxArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="SFZH" label="证件号码">
                                <el-input v-model="baTable.form.items!.SFZH" type="string" placeholder="请输入证件号码" clearable></el-input>
                            </el-form-item>
                            <el-form-item prop="CSRQ" label="出生日期">
                                <el-date-picker v-model="baTable.form.items!.CSRQ" type="date" placeholder="请选择出生日期" style="width: 100%" />
                            </el-form-item>
                            <el-form-item prop="HKSZD" label="户口所在地">
                                <el-input v-model="baTable.form.items!.HKSZD" type="string" placeholder="请输入户口所在地" clearable></el-input>
                            </el-form-item>
                            <el-form-item prop="XLDM" label="学历">
                                <el-select v-model="baTable.form.items!.XLDM" placeholder="请选择学历" filterable clearable style="width: 100%">
                                    <el-option v-for="opt in state.xlArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="ZC" label="职称">
                                <el-select v-model="baTable.form.items!.ZC" placeholder="请选择职称" filterable clearable style="width: 100%">
                                    <el-option v-for="opt in state.zcArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                </el-select>
                            </el-form-item>
                            <FormItem
                                prop="SFCZY"
                                label="是否操作员"
                                v-model="baTable.form.items!.SFCZY"
                                type="radio"
                                :data="{
                                    content: { '0': '否', '1': '是' },
                                    childrenAttr: { border: true },
                                }"
                            />
                            <FormItem
                                prop="SFCJGLY"
                                label="是否超级管理员"
                                v-model="baTable.form.items!.SFCJGLY"
                                type="radio"
                                :data="{
                                    content: { '0': '否', '1': '是' },
                                    childrenAttr: { border: true },
                                }"
                            />
                            <el-form-item prop="PYM" label="拼音码">
                                <el-input v-model="baTable.form.items!.PYM" type="string" placeholder="请输入拼音码"></el-input>
                            </el-form-item>
                            <el-form-item prop="WBM" label="五笔码">
                                <el-input v-model="baTable.form.items!.WBM" type="string" placeholder="请输入五笔码"></el-input>
                            </el-form-item>
                            <el-form-item prop="GJBM" label="国家编码">
                                <el-input v-model="baTable.form.items!.GJBM" type="string" placeholder="请输入国家编码" clearable></el-input>
                            </el-form-item>

                            <FormItem
                                prop="YXZT"
                                label="有效状态"
                                v-model="baTable.form.items!.YXZT"
                                type="radio"
                                :data="{ content: { '0': '无效', '1': '有效' }, childrenAttr: { border: true } }"
                            />
                            <FormItem
                                prop="SFJZYS"
                                label="是否接诊医生"
                                v-model="baTable.form.items!.SFJZYS"
                                type="radio"
                                :data="{
                                    content: { '0': '否', '1': '是' },
                                    childrenAttr: { border: true },
                                }"
                            />
                            <el-form-item prop="ZW" label="职务">
                                <el-select v-model="baTable.form.items!.ZW" placeholder="请选择职务" filterable clearable style="width: 100%">
                                    <el-option v-for="opt in state.zhiWuArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="CJGZRQ" label="入职时间">
                                <el-date-picker v-model="baTable.form.items!.CJGZRQ" type="date" placeholder="请选择入职时间" style="width: 100%" />
                            </el-form-item>
                            <el-form-item prop="HYZK" label="婚姻状况">
                                <el-select v-model="baTable.form.items!.HYZK" placeholder="请选择婚姻状况" filterable clearable style="width: 100%">
                                    <el-option v-for="opt in state.hyzkArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                </el-select>
                            </el-form-item>
                            <div style="display: block">
                                <FormItem label="电子签名" type="image" v-model="state.dzqmfj" />
                            </div>
                            <el-form-item label="医生权限">
                                <el-checkbox-group v-model="state.ysqx">
                                    <el-checkbox v-for="opt in state.ysqxArr" :key="opt.QXBM" :label="opt.QXMC">{{ opt.QXMC }}</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="yd-card">
                        <div class="yd-card-header">
                            <div class="title">
                                <div class="left"></div>
                                <span>其他信息</span>
                            </div>
                        </div>
                        <div class="yd-card-body">
                            <el-form-item prop="YSZYZSBM" label="医师执业证书编码">
                                <el-input
                                    v-model="baTable.form.items!.YSZYZSBM"
                                    type="string"
                                    placeholder="请输入医师执业证书编码"
                                    clearable
                                ></el-input>
                            </el-form-item>
                            <el-form-item prop="YSZYLBDM" label="医师执业类别">
                                <el-select
                                    v-model="baTable.form.items!.YSZYLBDM"
                                    filterable
                                    placeholder="请选择医师执业类别"
                                    clearable
                                    style="width: 100%"
                                >
                                    <el-option v-for="opt in state.yszylbArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="DRLX" label="调入类型">
                                <el-select v-model="baTable.form.items!.DRLX" placeholder="请选择调入类型" filterable clearable style="width: 100%">
                                    <el-option v-for="opt in state.drlxArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="YSZYFWDM" label="医师执业范围">
                                <el-select
                                    v-model="baTable.form.items!.YSZYFWDM"
                                    filterable
                                    placeholder="请选择医师执业范围"
                                    clearable
                                    style="width: 100%"
                                >
                                    <el-option v-for="opt in state.yszyfwArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                </el-select>
                            </el-form-item>
                            <FormItem
                                prop="SFDDZYYS"
                                label="是否多点执业医师"
                                v-model="baTable.form.items!.SFDDZYYS"
                                type="radio"
                                :data="{
                                    content: { '0': '否', '1': '是' },
                                    childrenAttr: { border: true },
                                }"
                            />
                            <el-form-item prop="BGSDHHM" label="办公室号码">
                                <el-input v-model="baTable.form.items!.BGSDHHM" type="string" placeholder="请输入办公室号码" clearable></el-input>
                            </el-form-item>
                            <el-form-item prop="EDWLBDM" label="第二执业单位类别">
                                <el-select
                                    v-model="baTable.form.items!.EDWLBDM"
                                    filterable
                                    placeholder="请选择第二执业单位类别"
                                    clearable
                                    style="width: 100%"
                                >
                                    <el-option v-for="opt in state.dezydwlbArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="SDWLBDM" label="第三执业单位类别">
                                <el-select
                                    v-model="baTable.form.items!.SDWLBDM"
                                    filterable
                                    placeholder="请选择第二执业单位类别"
                                    clearable
                                    style="width: 100%"
                                >
                                    <el-option v-for="opt in state.dszydwlbArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="DRSJ" label="调入时间">
                                <el-date-picker v-model="baTable.form.items!.DRSJ" type="date" placeholder="请选择调入时间" style="width: 100%" />
                            </el-form-item>
                            <el-form-item prop="XZYWZWDM" label="行政/业务职务">
                                <el-select
                                    v-model="baTable.form.items!.XZYWZWDM"
                                    placeholder="请选择行政/业务职务"
                                    filterable
                                    clearable
                                    style="width: 100%"
                                >
                                    <el-option v-for="opt in state.xzywzwArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="ZYJSZGMC" label="专业技术资格名称">
                                <el-select
                                    v-model="baTable.form.items!.ZYJSZGMC"
                                    placeholder="请选择专业技术资格名称"
                                    filterable
                                    clearable
                                    style="width: 100%"
                                >
                                    <el-option v-for="opt in state.zyjszgArr" :key="opt.MC" :label="opt.MC" :value="opt.MC"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="SJHM" label="手机号码">
                                <el-input v-model="baTable.form.items!.SJHM" type="string" placeholder="请输入手机号码" clearable></el-input>
                            </el-form-item>
                            <el-form-item prop="ZYJSZW" label="专业技术职务">
                                <el-select
                                    v-model="baTable.form.items!.ZYJSZW"
                                    placeholder="请选择专业技术职务"
                                    filterable
                                    clearable
                                    style="width: 100%"
                                >
                                    <el-option v-for="opt in state.zyjszwArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                </el-select>
                            </el-form-item>
                            <FormItem
                                prop="SFBDWFP"
                                label="是否本单位返聘"
                                v-model="baTable.form.items!.SFBDWFP"
                                type="radio"
                                :data="{
                                    content: { '0': '否', '1': '是' },
                                    childrenAttr: { border: true },
                                }"
                            />
                            <el-form-item prop="XWDM" label="学位">
                                <el-select v-model="baTable.form.items!.XWDM" placeholder="请选择学位" filterable clearable style="width: 100%">
                                    <el-option v-for="opt in state.xwArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="SXZYMC" label="所学专业名称">
                                <el-select
                                    v-model="baTable.form.items!.SXZYMC"
                                    placeholder="请选择所学专业名称"
                                    filterable
                                    clearable
                                    style="width: 100%"
                                >
                                    <el-option v-for="opt in state.sxzymcArr" :key="opt.MC" :label="opt.MC" :value="opt.MC"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="CSZYDM" label="从事专业">
                                <el-select v-model="baTable.form.items!.CSZYDM" placeholder="请选择从事专业" filterable clearable style="width: 100%">
                                    <el-option v-for="opt in state.cszyArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="EMAIL" label="Email">
                                <el-input v-model="baTable.form.items!.EMAIL" type="string" placeholder="请输入Email" clearable></el-input>
                            </el-form-item>
                            <el-form-item prop="ZZZT" label="在职状态">
                                <el-select v-model="baTable.form.items!.ZZZT" placeholder="请选择在职状态" filterable clearable style="width: 100%">
                                    <el-option v-for="opt in state.zzztArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="ZZMM" label="政治面貌">
                                <el-select v-model="baTable.form.items!.ZZMM" placeholder="请选择政治面貌" filterable clearable style="width: 100%">
                                    <el-option v-for="opt in state.zzmmArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="BYYX" label="毕业院校">
                                <el-input v-model="baTable.form.items!.BYYX" type="string" placeholder="请输入毕业院校" clearable></el-input>
                            </el-form-item>
                            <el-form-item prop="ZKTC1" label="专科特长1">
                                <el-input v-model="baTable.form.items!.ZKTC1" type="string" placeholder="请输入专科特长1" clearable></el-input>
                            </el-form-item>
                            <el-form-item prop="ZKTC2" label="专科特长2">
                                <el-input v-model="baTable.form.items!.ZKTC2" type="string" placeholder="请输入专科特长2" clearable></el-input>
                            </el-form-item>
                            <el-form-item prop="ZKTC3" label="专科特长3">
                                <el-input v-model="baTable.form.items!.ZKTC3" type="string" placeholder="请输入专科特长3" clearable></el-input>
                            </el-form-item>
                            <el-form-item prop="GRJJ" label="个人简介">
                                <el-input
                                    v-model="baTable.form.items!.GRJJ"
                                    placeholder="请输入个人简介"
                                    clearable
                                    type="textarea"
                                    :rows="5"
                                ></el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <div style="height: 50px"></div>
                    <!-- <el-card header="基本信息">
                    </el-card>
                    <el-card header="其他信息">        
                    </el-card> -->
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
import { getPymWbm } from '/@/api/common'
import { getDzqmUrl, getYsqx, saveYsqx } from '/@/api/backend/jcgl/ryzl'
import { useAdminInfo } from '/@/stores/adminInfo'

const adminInfo = useAdminInfo()

const prop = defineProps(['zdData', 'ksData'])

const state: {
    fullscreen: boolean
    kslxlb: any
    ryxbArr: any //人员性别
    zgksArr: any //主管科室
    lszArr: any //隶属组
    mzArr: any //民族
    zjlxArr: any //证件类型
    zcArr: any //职称
    xlArr: any //学历
    zhiWuArr: any //职务
    hyzkArr: any //婚姻状况
    yszylbArr: any //医师执业类别
    drlxArr: any //调入类型
    yszyfwArr: any //医师执业范围
    dezydwlbArr: any //第二执业单位类别
    dszydwlbArr: any //第三执业单位类别
    xzywzwArr: any //行政业务职务
    zyjszgArr: any //专业技术资格名称
    zyjszwArr: any //专业技术职务
    xwArr: any //学位
    sxzymcArr: any //所学专业名称
    cszyArr: any //从事专业
    zzztArr: any //在职状态
    zzmmArr: any //政治面貌
    dzqmfj: string
    ysqx: any
    ysqxArr: any
} = reactive({
    fullscreen: false,
    kslxlb: [],
    ryxbArr: [],
    zgksArr: [],
    lszArr: [],
    mzArr: [],
    zjlxArr: [],
    zcArr: [],
    xlArr: [],
    zhiWuArr: [],
    hyzkArr: [],
    yszylbArr: [],
    drlxArr: [],
    yszyfwArr: [],
    dezydwlbArr: [],
    dszydwlbArr: [],
    xzywzwArr: [],
    zyjszgArr: [],
    zyjszwArr: [],
    xwArr: [],
    sxzymcArr: [],
    cszyArr: [],
    zzztArr: [],
    zzmmArr: [],
    dzqmfj: '',
    ysqx: [],
    ysqxArr: [
        { QXBM: '15', QXMC: '允许开立麻醉类药品' },
        { QXBM: '16', QXMC: '允许开立精神类药品' },
        { QXBM: '17', QXMC: '允许开立精神二类药品' },
        { QXBM: '26', QXMC: '允许非限制使用抗生素处方' },
        { QXBM: '27', QXMC: '允许限制使用抗生素处方' },
        { QXBM: '28', QXMC: '允许特殊使用抗生素处方' },
    ],
})

const formRef = ref<FormInstance>()
const baTable = inject('baTable') as baTableClass

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    RYBM: [buildValidatorData({ name: 'required', message: '人员编码不能为空.' })],
    RYXM: [buildValidatorData({ name: 'required', message: '人员姓名不能为空.' })],
    LSZ: [buildValidatorData({ name: 'required', message: '隶属组不能为空.' })],
    YXZT: [buildValidatorData({ name: 'required', message: '有效状态不能为空.' })],
    KL: [buildValidatorData({ name: 'required', message: '口令不能为空.' })],
})

watch(
    () => baTable.form.operate,
    () => {
        state.ryxbArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_0001')
        //state.zgksArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_009004')
        state.lszArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_0098')
        state.mzArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_000402')
        state.zjlxArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_009038')
        state.zcArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_00101')
        state.xlArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_0099')
        state.zhiWuArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_009045')
        state.hyzkArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_0007')
        state.yszylbArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_009040')
        state.drlxArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_009052')
        state.yszyfwArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_009041')
        state.dezydwlbArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_009042')
        state.dszydwlbArr = state.dezydwlbArr
        state.xzywzwArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_009044')
        state.zyjszgArr = state.zhiWuArr
        state.zyjszwArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_009046')
        state.xwArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_009047')
        state.sxzymcArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_00100')
        state.cszyArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_009039')
        state.zzztArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_009036')
        state.zzmmArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_009037')
        if (baTable.form.items!.RYKSBM) {
            let arr = baTable.form.items!.RYKSBM.split(',')
            state.kslxlb = arr
            //console.log('state.kslxlb', state.kslxlb)
            state.zgksArr = prop.ksData.filter((ele: any) => arr.includes(ele.KSBM))
        } else {
            state.kslxlb = []
            state.zgksArr = []
        }
        if (baTable.form.operate == 'Edit') {
            getDzqmUrl({ agrs: { JGBM: baTable.form.items!.JGBM, RYBM: baTable.form.items!.RYBM } }).then((res) => {
                state.dzqmfj = res.data
            })
        } else {
            state.dzqmfj = ''
        }
        if (baTable.form.items!.RYBM) {
            getYsqx({ agrs: baTable.form.items!.RYBM }).then((res) => {
                if (res.data) {
                    let qxarr: any = []
                    res.data.forEach((ele: any) => {
                        qxarr.push(ele.QXMC)
                    })
                    state.ysqx = qxarr
                } else {
                    state.ysqx = []
                }
            })
        } else {
            state.ysqx = []
        }
    }
)

const mChange = (value: string) => {
    getPymWbm({ agrs: value }).then((res) => {
        baTable.form.items!.PYM = res.data.PYM
        baTable.form.items!.WBM = res.data.WBM
    })
}

const ryksChange = (value: any) => {
    if (value && value.length > 0) {
        state.zgksArr = prop.ksData.filter((ele: any) => value.includes(ele.KSBM))
    } else {
        state.zgksArr = []
    }
}

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            let kszl: any = []
            if (state.kslxlb.length > 0) {
                let kslx = state.kslxlb.join(',')
                let ryks: any = []
                baTable.form.items!.RYKSBM = kslx
                for (let i = 0; i < state.kslxlb.length; i++) {
                    let obj = prop.ksData.find((item: any) => item.KSBM === state.kslxlb[i])
                    if (obj) {
                        ryks.push(obj.KSMC)
                        kszl.push({ JGBM: adminInfo.jgbm, RYBM: adminInfo.rybm, KSBM: obj.KSBM })
                    }
                }
                if (ryks.length > 0) {
                    baTable.form.items!.RYKS = ryks.join(',')
                }
            } else {
                baTable.form.items!.RYKS = ''
                baTable.form.items!.RYKSBM = ''
            }
            if (state.dzqmfj) {
                let lastIdx = state.dzqmfj.lastIndexOf('/')
                let endIdx = state.dzqmfj.lastIndexOf('.')
                let fjid = ''
                if (endIdx > 0) {
                    fjid = state.dzqmfj.substring(lastIdx + 1, endIdx)
                } else {
                    fjid = state.dzqmfj.substring(lastIdx)
                }
                baTable.form.items!.DZQMFJID = fjid
            }
            baTable.form.items!.JGBM = adminInfo.jgbm
            let opt = baTable.form.operate === 'Add' ? '新增' : '修改'
            let data = {
                agrs: {
                    baoCunLX: opt,
                    ryzl: baTable.form.items,
                    kslb: kszl,
                },
            }
            //console.log(state.ysqx)
            baTable.onSubmitData(data, (res: any) => {
                if (res.code == 1) {
                    if (state.ysqx.length > 0) {
                        let qxData: any = []
                        state.ysqx.forEach((ele: any) => {
                            let obj = state.ysqxArr.find((item: any) => item.QXMC === ele)
                            if (obj) {
                                qxData.push({ JGBM: adminInfo.jgbm, RYBM: baTable.form.items!.RYBM, QXBM: obj.QXBM, QXMC: ele })
                            }
                        })
                        if (qxData.length > 0) {
                            saveYsqx({ agrs: qxData }).then((res) => {
                                console.log(res)
                            })
                        }
                    }
                }
            })
        } else {
            console.log('error submit!', fields)
        }
    })
}

const changeFullscreen = () => {
    state.fullscreen = !state.fullscreen
}
</script>

<style scoped lang="scss">
:deep(.el-select-tags-wrapper .el-tag) {
    color: #333;
}
.ba-input-item-radio :deep(.el-form-item__content) {
    width: 220px;
}
.el-textarea {
    width: 580px;
}
.el-dialog__header .title {
    margin-right: 60px;
    font-size: 17px;
    display: flex;
    justify-content: space-between;
    .right {
        position: absolute;
        right: 60px;
        height: 23px;
        width: 30px;
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: center;
    }
}
.yd-card {
    margin: 5px 20px 10px 20px;
}
.yd-card-header {
    padding: 13px 10px;
    background-color: #fff;
    margin-bottom: 1px;
    display: flex;
    // justify-content:space-between;
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
.yd-card-body {
    padding: 10px;
}
.ssks-box :deep(.el-input) {
    width: 603px;
}
</style>