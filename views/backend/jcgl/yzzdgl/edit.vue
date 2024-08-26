<template>
    <!-- 对话框表单 -->
    <el-dialog class="ba-operate-dialog yzzd-edit" :close-on-click-modal="false" :destroy-on-close="true"
        :model-value="['Add', 'Edit'].includes(baTable.form.operate!)" @close="baTable.toggleForm" align-center
        width="930px">
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']">
                {{ baTable.form.operate == 'Add' ? '医嘱项目-新增' : '医嘱项目-修改' }}
            </div>
        </template>
        <el-scrollbar v-loading="baTable.form.loading" class="ba-table-form-scrollbar">
            <div class="ba-operate-form" :class="'ba-' + baTable.form.operate + '-form'">
                <div style="padding: 5px 15px;">
                    <div class="xmfl">
                        <el-form ref="formRef1" :model="baTable.form.items" label-position="right"
                            :label-width="baTable.form.labelWidth + 'px'" :rules="rules1">
                            <el-row :gutter="2">
                                <el-col :xs="24" :sm="15">
                                    <el-form-item prop="FLBM" label="项目分类">
                                        <div class="xmfl-select">
                                            <el-cascader v-model="baTable.form.items!.FLBM" :props="defaultProps"
                                                :options="prop.flData" :show-all-levels="true" filterable clearable
                                                popper-class="flbm-tree-cascader" placeholder="请选择" />
                                        </div>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="9">
                                    <el-form-item prop="LB" label="诊疗类别">
                                        <el-select v-model="baTable.form.items!.LB" filterable placeholder="请选择诊疗类别"
                                            clearable @change="lbChange">
                                            <el-option v-for="opt in state.lbArr" :key="opt.BM"
                                                :label="opt.BM + '.' + opt.MC" :value="opt.BM"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                    <el-tabs v-model="state.activeTab" type="border-card">
                        <el-tab-pane name="xmsx" label="项目属性">
                            <div class="xmsx">
                                <el-form ref="formRef" :inline="true" :model="baTable.form.items" label-position="right"
                                    :label-width="baTable.form.labelWidth + 'px'" :rules="rules"
                                    v-if="!baTable.form.loading">
                                    <el-row :gutter="2">
                                        <el-col :xs="24" :sm="16">
                                            <el-row :gutter="2">
                                                <el-col :xs="24" :sm="12">
                                                    <el-form-item prop="XMBM" label="项目编码">
                                                        <el-input v-model="baTable.form.items!.XMBM" type="string"
                                                            :disabled="true" placeholder="系统自动生成"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :xs="24" :sm="12">
                                                    <el-form-item prop="CZLX" :label="state.czlxMc" v-show="state.czlxShow">
                                                        <el-select v-model="baTable.form.items!.CZLX" @change="czlxChange"
                                                            placeholder="请选择" filterable clearable>
                                                            <el-option v-for="opt in state.czlxArr" :key="opt.BM"
                                                                :label="opt.BM + '.' + opt.MC" :value="opt.BM"></el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row :gutter="2">
                                                <el-col :xs="24" :sm="24">
                                                    <el-form-item prop="XMMC" label="项目名称">
                                                        <el-input v-model="baTable.form.items!.XMMC" type="string"
                                                            @change="mChange" placeholder="请输入"
                                                            style="width:453px"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row :gutter="2">
                                                <el-col :xs="24" :sm="12">
                                                    <el-form-item prop="PYM" label="拼音码">
                                                        <el-input v-model="baTable.form.items!.PYM" type="string"
                                                            placeholder="请输入"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :xs="24" :sm="12">
                                                    <el-form-item prop="WBM" label="五笔码">
                                                        <el-input v-model="baTable.form.items!.WBM" type="string"
                                                            placeholder="请输入"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        </el-col>
                                        <el-col :xs="24" :sm="8">
                                            <div style="padding-left:25px;"
                                                v-show="baTable.form.items!.LB == '1' || baTable.form.items!.LB == '4'">
                                                <!-- <div>默认标本和采集管</div> -->
                                                <div>{{ state.bbbwMc }}</div>
                                                <div class="bbbw-ssbm">
                                                    <el-form-item prop="BBBW" label="标本"
                                                        v-show="baTable.form.items!.LB == '1'">
                                                        <div class="bbbw-select">
                                                            <el-select v-model="baTable.form.items!.BBBW" placeholder="请选择"
                                                                filterable clearable>
                                                                <el-option v-for="opt in prop.jybb" :key="opt.BM"
                                                                    :label="opt.BM + '.' + opt.MC"
                                                                    :value="opt.BM"></el-option>
                                                            </el-select>
                                                        </div>
                                                    </el-form-item>
                                                    <el-form-item prop="SGBM" label="试管"
                                                        v-show="baTable.form.items!.LB == '1'">
                                                        <div class="sgbm-select">
                                                            <el-select v-model="baTable.form.items!.SGBM" placeholder="请选择"
                                                                filterable clearable>
                                                                <el-option v-for="opt in state.sgbmArr" :key="opt.BM"
                                                                    :label="opt.BM + '.' + opt.MC"
                                                                    :value="opt.BM"></el-option>
                                                            </el-select>
                                                        </div>
                                                    </el-form-item>
                                                    <!-- <el-form-item prop="SSBM" label="手术"
                                                        v-show="baTable.form.items!.LB == '4'">
                                                        <div class="ssbm-select">
                                                            <SelectTable :data="state.sszdData"
                                                                :pageSize="Number(state.pageSize)"
                                                                :total="Number(state.total)" :max-height="270"
                                                                :tableWidth="500"
                                                                :columns="[{ label: '编码', prop: 'BM', width: '150' }, { label: '名称', prop: 'MC', width: '170' }]"
                                                                :keywords="{ label: 'MC', value: 'BM', pym: 'PYM', wbm: 'WBM' }"
                                                                :isShowFirstColumn="false" :isShowPagination="true"
                                                                :isKeyup="true" @radioChange="singleSelectChange"
                                                                @page-change="pageChange" @keySearch="keySearch" />
                                                        </div>
                                                    </el-form-item> -->
                                                    <FormItem label="手术" v-show="baTable.form.items!.LB == '4'"
                                                        v-model="baTable.form.items!.SSBM" type="zdSelect" prop="SSBM"
                                                        :input-attr="{
                                                            pk: 'BM',
                                                            field: 'MC',
                                                            'remote-url': '/api/v1/common/getsszd',
                                                            placeholder: '请选择',
                                                            onRow: ssChange
                                                        }" />
                                                </div>
                                            </div>

                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="2">
                                        <el-col :xs="24" :sm="8">
                                            <el-form-item prop="ZXPL" label="执行频率">
                                                <el-select filterable clearable v-model="baTable.form.items!.ZXPL"
                                                    placeholder="请选择" :disabled="state.zxplDisable">
                                                    <el-option v-for="opt in state.zxplArr" :key="opt.BM"
                                                        :label="opt.BM + '.' + opt.MC" :value="opt.BM"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :xs="24" :sm="8">
                                            <el-form-item prop="ZXFL" label="执行分类"
                                                v-show="baTable.form.items!.LB == 3 && (baTable.form.items!.CZLX == '1' || baTable.form.items!.CZLX == '2')">
                                                <el-select filterable clearable v-model="baTable.form.items!.ZXFL"
                                                    placeholder="请选择" :disabled="state.zxflDisable" style="width: 100%">
                                                    <el-option v-for="opt in state.zxflArr" :key="opt.BM"
                                                        :label="opt.BM + '.' + opt.MC" :value="opt.BM"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :xs="24" :sm="8">
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="2">
                                        <el-col :xs="24" :sm="8">
                                            <el-form-item prop="JSFS" label="计算方式">
                                                <el-select filterable clearable v-model="baTable.form.items!.JSFS"
                                                    placeholder="请选择" :disabled="state.jsfsDisable">
                                                    <el-option v-for="opt in state.jsfsArr" :key="opt.BM"
                                                        :label="opt.BM + '.' + opt.MC" :value="opt.BM"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :xs="24" :sm="8">
                                            <el-form-item prop="JSDW" label="计算单位">
                                                <!-- <el-input v-model="baTable.form.items!.JSDW" type="string"
                                                    placeholder="请输入"></el-input> -->
                                                <el-select filterable clearable v-model="baTable.form.items!.JSDW"
                                                    placeholder="请选择">
                                                    <el-option v-for="opt in state.jsdwArr" :key="opt.BM" :label="opt.MC"
                                                        :value="opt.MC"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :xs="24" :sm="8">
                                            <el-form-item v-show="state.showJsgz" prop="JSGZ" label="计算规则">
                                                <el-select filterable clearable v-model="baTable.form.items!.JSGZ"
                                                    placeholder="请选择" style="width: 100%">
                                                    <el-option v-for="opt in state.jsgzArr" :key="opt.BM"
                                                        :label="opt.BM + '.' + opt.MC" :value="opt.BM"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="2">
                                        <el-col :xs="24" :sm="8">
                                            <el-form-item prop="SYXB" label="适用性别">
                                                <el-select filterable clearable v-model="baTable.form.items!.SYXB"
                                                    placeholder="请选择" style="width: 100%">
                                                    <el-option v-for="opt in state.syxbArr" :key="opt.BM"
                                                        :label="opt.BM + '.' + opt.MC" :value="opt.BM"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :xs="24" :sm="16">
                                            <div style="padding-left:30px">
                                                <el-checkbox v-model="baTable.form.items!.ZXAP" :true-label="1"
                                                    :false-label="0" label="需要执行安排" />
                                                <el-checkbox v-model="baTable.form.items!.DDYY" :true-label="1"
                                                    :false-label="0" label="允许单独应用" :disabled="state.ddyyDisable" />
                                                <el-checkbox v-model="baTable.form.items!.ZXBJ" :true-label="1"
                                                    :false-label="0" label="允许床旁或术中执行"
                                                    v-if="baTable.form.items!.LB == '2'" />
                                            </div>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="2">
                                        <el-col :xs="24" :sm="12">
                                            <el-form-item prop="CKMLID" label="参考项目">
                                                <div class="ckxm-select">
                                                    <el-select filterable clearable v-model="baTable.form.items!.CKMLID"
                                                        placeholder="请选择" style="width: 100%">
                                                        <el-option v-for="opt in state.ckxmArr" :key="opt.BM"
                                                            :label="opt.MC" :value="opt.BM"></el-option>
                                                    </el-select>
                                                </div>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :xs="24" :sm="12">
                                            <el-form-item prop="LRXL" label="录入限量">
                                                <el-input v-model="baTable.form.items!.LRXL" type="string" placeholder="请输入"
                                                    style="width:100px"></el-input>
                                            </el-form-item>
                                            <el-checkbox v-model="baTable.form.items!.ZHXM" :true-label="1" :false-label="0"
                                                label="组合项目" style="margin-left:15px"
                                                v-if="baTable.form.items!.LB == '1'" />
                                        </el-col>
                                        <!-- <el-col :xs="24" :sm="8">
                                            <el-form-item prop="ZHXM" label="组合项目" v-show="baTable.form.items!.LB == '1'">
                                                <el-select filterable clearable v-model="baTable.form.items!.ZHXM"
                                                    placeholder="请选择组合项目" style="width: 100%">
                                                    <el-option v-for="opt in state.zhxmArr" :key="opt.BM"
                                                        :label="opt.BM + '.' + opt.MC" :value="opt.BM"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col> -->
                                    </el-row>
                                </el-form>
                            </div>
                            <div class="xmsx-syfw">
                                <div class="title">适用范围</div>
                                <div class="body">
                                    <el-form-item prop="FWDX" label="服务对象">
                                        <el-radio-group v-model="baTable.form.items!.FWDX" style="margin-left:15px">
                                            <el-radio v-for="opt in state.fwdxArr" :key="opt.BM" :label="opt.BM"
                                                :value="opt.BM">{{ opt.MC }}</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="适用科室">
                                        <el-checkbox-group v-model="state.sykslb" style="margin-left:15px">
                                            <el-checkbox style="width: 76px" v-for="opt in state.ksArr" :key="opt.KSBM"
                                                :label="opt.KSBM">{{ opt.KSMC }}</el-checkbox>
                                        </el-checkbox-group>
                                    </el-form-item>
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane name="zxks" label="执行科室">
                            <ZxksTb :currentXmbm="state.currentXmbm" :ks="state.ksArr" :kdks="state.kdksArr"
                                :mzzxks="baTable.form.items!.MZZXKS" :zyzxks="baTable.form.items!.ZYZXKS"
                                @zxksDataChange="zxksDataChange" @mzzxksChange="mzzxksChange"
                                @zyzxksChange="zyzxksChange" />
                        </el-tab-pane>
                        <el-tab-pane name="jcbw" label="检查部位" v-if="baTable.form.items!.LB == '2'">
                            <JcbwTb :currentXmbm="state.currentXmbm" @bwDataChange="bwDataChange" />
                        </el-tab-pane>
                        <el-tab-pane name="plsz" label="频率设置" v-if="state.showPlsz">
                            <ZxplTb :currentXmbm="state.currentXmbm" @yfylDataChange="yfylDataChange" />
                        </el-tab-pane>
                        <el-tab-pane name="sfmx" label="收费明细">
                            <JcSfmxTb :currentXmbm="state.currentXmbm" :sfmx="state.bwjcffData" :lb="baTable.form.items!.LB" v-if="baTable.form.items!.LB == '2'" />
                            <SfmxTb :currentXmbm="state.currentXmbm" :lb="baTable.form.items!.LB" @sfmx-change="sfmxChange" v-else />
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </el-scrollbar>
        <template #footer>
            <div class="yd-from-footer">
                <el-button v-blur :loading="baTable.form.submitLoading" @click="submitForm(formRef)" type="primary"
                    class="btn-form-save" :disabled="baTable.form.items!.SCBZ=='1'">
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
import { buildValidatorData } from '/@/utils/validate'
import type { FormInstance, FormItemRule } from 'element-plus'
import FormItem from '/@/components/formItem/index.vue'
import { ElNotification } from 'element-plus'
import { getPymWbm, getKsList, getSfxmzdList } from '/@/api/common'
import { getYzxmSyks } from '/@/api/backend/jcgl/yzxmzd'
import ZxksTb from './zxks.vue'
import JcbwTb from './jcbw.vue'
import ZxplTb from './zxpl.vue'
import SfmxTb from './sfmx.vue'
import JcSfmxTb from './sfmx-jc.vue'
import { useAdminInfo } from '/@/stores/adminInfo'

const adminInfo = useAdminInfo()

const prop = defineProps(['zdData', 'flbm', 'jclx', 'jylx', 'jybb', 'flData', 'xmbm'])

const state: {
    activeTab: string,
    lbArr: any, //诊疗类别
    czlxArr: any, //操作类型
    czlxMc: string, //操作类型名称
    bbbwMc: string, //标本部位
    czlxShow: boolean, //操作类型是否显示
    sszdData: any[], //手术字典
    pageSize: Number,
    total: Number,
    ssKeywords: string,
    currentLb: string, //当前选择的类别
    jylxArr: any, //检验类型
    jybbArr: any, //检验标本
    sgbmArr: any, //试管编码
    jclxArr: any, //检查类型
    zlczxzArr: any, //治疗处置性质
    ssgmArr: any, //手术规模
    mzlxArr: any, //麻醉类型
    hlxmlxArr: any, //护理项目类型
    zxplArr: any, //执行频率
    zxflArr: any, //执行分类
    jsfsArr: any, //计算方式
    jsdwArr: any, //计算单位
    syxbArr: any, //适用性别
    jsgzArr: any, //计算规则
    ckxmArr: any, //参考项目
    fwdxArr: any, //服务对象
    zxksArr: any, //执行科室
    zhxmArr: any, //组合项目
    tsbjArr: any, //特殊标记
    jsfsDisable: boolean, //计算方式是否禁用
    zxplDisable: boolean, //执行频率是否禁用
    zxflDisable: boolean,
    ddyyDisable: boolean, //单独应用是否禁用
    brlyArr: any, //病人来源
    ksArr: any, //科室
    kdksArr: any, //开单科室
    zxksData: any, //执行科室数据
    bwjcffData: any, //部位检查方法
    sfxmData: any[], //收费项目select数据源
    sykslb: any,
    yfylData: any, //用法用量
    showPlsz: boolean, //显示频率设置
    showJsgz: boolean, //显示计算规则
    currentXmbm: string //当前项目编码
} = reactive({
    activeTab: 'xmsx',
    lbArr: [],
    czlxArr: [],
    czlxMc: '操作类型',
    bbbwMc: '标本部位',
    czlxShow: true,
    pageSize: 100,
    total: 0,
    ssKeywords: '',
    sszdData: [],
    currentLb: '',
    jylxArr: [],
    jybbArr: prop.jybb,
    sgbmArr: [],
    jclxArr: [],
    zlczxzArr: [],
    ssgmArr: [],
    mzlxArr: [],
    hlxmlxArr: [],
    zxplArr: [
        { BM: 0, MC: '可选频率' },
        { BM: 1, MC: '一次性' },
        { BM: 2, MC: '持续性' }
    ],
    zxflArr: [
        { BM: 0, MC: '其他' },
        { BM: -1, MC: '普通' },
        { BM: 1, MC: '输液单' },
        { BM: 2, MC: '注射单' },
        { BM: 3, MC: '皮试单' },
        { BM: 4, MC: '口服单' },
        { BM: 5, MC: '治疗单' },
        { BM: 6, MC: '输血单' },
        { BM: 7, MC: '护理单' },
        { BM: 8, MC: '外用药' },
        { BM: 9, MC: '其他' },
    ],
    jsfsArr: [
        { BM: 0, MC: '不明确' },
        { BM: 1, MC: '计量' },
        { BM: 2, MC: '计时' },
        { BM: 3, MC: '计次' },
    ],
    jsdwArr: [],
    syxbArr: [
        { BM: 0, MC: '无性别区分' },
        { BM: 1, MC: '男性' },
        { BM: 2, MC: '女性' }
    ],
    jsgzArr: [
        { BM: 0, MC: '正常计算' },
        { BM: 1, MC: '取整计算' },
    ],
    ckxmArr: [],
    fwdxArr: [
        { BM: 1, MC: '门诊' },
        { BM: 2, MC: '住院' },
        { BM: 3, MC: '门诊和住院' },
        { BM: 4, MC: '体检' }
    ],
    zxksArr: [
        { BM: 0, MC: '不跟踪执行的医嘱' },
        { BM: 1, MC: '由病人科室执行' },
        { BM: 2, MC: '由病人病区执行' },
        { BM: 3, MC: '操作员所在科室' },
        { BM: 4, MC: '指定科室执行' },
        { BM: 5, MC: '医院外执行' },
        { BM: 6, MC: '开单人所在科室' }
    ],
    zhxmArr: [
        { BM: 0, MC: '否' },
        { BM: 1, MC: '检验组合' },
        { BM: 2, MC: '体检项目' },
        { BM: 3, MC: '检查组合' },
        { BM: 4, MC: '治疗组合' },
    ],
    tsbjArr: [],
    jsfsDisable: false,
    zxplDisable: false,
    zxflDisable: false,
    ddyyDisable: false,
    brlyArr: [
        { BM: '1', MC: '门诊', disabled: true },
        { BM: '2', MC: '住院', disabled: true },
    ],
    ksArr: [],
    kdksArr: [],
    zxksData: [{ BRLY: '', KDKSBM: '', ZXKSBM: '', isEdit: false, editTxt: '确定' }],
    bwjcffData: [],
    sfxmData: [],
    sykslb: [],
    yfylData: [],
    showPlsz: false,
    showJsgz: false,
    currentXmbm: ''
})

const formRef = ref<FormInstance>()
const formRef1 = ref<FormInstance>()
const baTable = inject('baTable') as baTableClass

const defaultProps = {
    label: 'FLMC',
    value: 'FLBM',
    checkStrictly: true
}

const mChange = (value: string) => {
    getPymWbm({ agrs: value }).then((res) => {
        baTable.form.items!.PYM = res.data.PYM
        baTable.form.items!.WBM = res.data.WBM
    })
}

const lbChange = () => {
    //console.log('lb', value)
    baTable.form.items!.CZLX = ''
    formItemSet()
}

const ssChange = (val: any) => {
    console.log('ssChange',val)
}

/**
 * 加载开单和执行科室
 */
getKsList().then((res) => {
    state.ksArr = res.data.options
    let kdks: any = []
    res.data.options.forEach((item: any) => {
        if (item.KSLX != '11.病区') {
            kdks.push(item)
        }
    })
    state.kdksArr = kdks
})

/**
 * 获取收费项目列表
 * @param lb 
 */
getSfxmzdList({ agrs: { leiBie: '2' } }).then((res) => {
    state.sfxmData = res.data.options
})

const zxksDataChange = (data: any) => {
    state.zxksData = data
}

const mzzxksChange = (value: any) => {
    baTable.form.items!.MZZXKS = value
}

const zyzxksChange = (value: any) => {
    baTable.form.items!.ZYZXKS = value
}

const bwDataChange = (data: any) => {
    state.bwjcffData = data
}

const yfylDataChange = (data: any) => {
    state.yfylData = data
}

const sfmxChange = (data: any) => {
    state.bwjcffData = data
}

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    XMMC: [buildValidatorData({ name: 'required', message: '项目名称不能为空.' })]
})

const rules1: Partial<Record<string, FormItemRule[]>> = reactive({
    FLBM: [buildValidatorData({ name: 'required', message: '项目分类不能为空.' })],
    LB: [buildValidatorData({ name: 'required', message: '诊疗类别不能为空.' })],
})

watch(
    () => baTable.form.operate,
    () => {
        //state.lbArr = prop.zdData.filter((ele:any) => ele.FLBM=='GB_100001')
        let lbList: any = []
        if (prop.zdData && prop.zdData.length > 0) {
            prop.zdData.forEach((item: any) => {
                if (item.FLBM == 'GB_100001') {
                    if (!(item.BM == '21' || item.BM == '22' || item.BM == '23' || item.BM == '24' || item.BM == '25')) {
                        lbList.push(item)
                    }
                }
            })
            state.jsdwArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_009012')
        }
        state.lbArr = lbList
        state.sykslb = []
        state.zxksData = [{ BRLY: '', KDKSBM: '', ZXKSBM: '', isEdit: false, editTxt: '确定' }]
        state.bwjcffData = []
        if (baTable.form.operate == 'Add') {
            state.currentXmbm = ''
            state.activeTab = 'xmsx'
        } else if (baTable.form.operate == 'Edit') {
            state.currentXmbm = baTable.form.items!.XMBM
            baTable.form.items!.SSBM = baTable.form.items!.BBBW
            state.activeTab = 'xmsx'
            //console.log('执行科室')
            getYzxmSyks({ agrs: baTable.form.items!.XMBM }).then((res) => {
                console.log(res)
                if (res.data && res.data.length > 0) {
                    res.data.forEach((item: any) => {
                        state.sykslb.push(item.KSBM)
                    })
                } else {
                    state.sykslb = []
                }
            })
        }
    }
)

// watch(
//     baTable.form.items!.XMBM,
//     () => {
//         if (baTable.form.operate == 'Edit') {
//             baTable.form.items!.SSBM = baTable.form.items!.BBBW
//         }
//     },
//     { deep: true }
// )

watch(
    () => baTable.form.items!.LB,
    (value) => {
        state.currentLb = value
        state.czlxShow = true
        if (value) {
            if (value === '1') {
                state.czlxMc = '检验类型'
                //检验类型 JCXM_YZXMJYLX
                state.czlxArr = prop.jylx
                //标本部位：JCXM_YZXMJYBB
                // state.bbbwMc = '检验标本'
                state.bbbwMc = '默认标本和采集管'
                //getJybbList('')
            } else if (value === '2') {
                state.czlxMc = '检查类型'
                //检查类型 JCXM_YZXMJCLX
                state.czlxArr = prop.jclx
                //标本部位：JCXM_BW
                state.bbbwMc = '默认标本'
            } else if (value === '3') {
                state.czlxMc = '处置性质'
                //治疗处置性质 GB_100003
                state.bbbwMc = '默认标本'
                state.czlxArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_100003')
            } else if (value === '4') {
                state.czlxMc = '手术规模'
                state.bbbwMc = '手术标准编码'
                //手术规模 GB_009150
                state.czlxArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_009150')
                //标本部位：JCXM_SSZD
                //getSszdList(1, '')
            } else if (value === '5') {
                state.czlxMc = '麻醉类型'
                state.bbbwMc = '默认标本'
                //麻醉类型 GB_000006
                state.czlxArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_000006')
            } else if (value === '6') {
                state.czlxMc = '项目类型'
                state.bbbwMc = '默认标本'
                //护理项目类型 GB_100004
                state.czlxArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_100004')
            } else if (value === '14') {
                state.czlxMc = '特殊标记'
                state.czlxArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_100002')
            } else {
                state.czlxMc = '操作类型'
                state.bbbwMc = '默认标本'
                state.czlxArr = []
                state.total = 0
                state.czlxShow = false
            }
            formItemInit()
        } else {
            state.czlxMc = '操作类型'
            state.czlxArr = []
            state.total = 0
        }
        if(value != '2' && state.activeTab == 'jcbw') {
            state.activeTab = 'xmsx'
        }
    }
)

/**
 * 操作类型改变时
 */
const czlxChange = () => {
    formItemSet()
}

const formItemSet = () => {
    const lb = baTable.form.items!.LB
    const czlx = baTable.form.items!.CZLX
    state.ddyyDisable = false
    state.showJsgz = false
    if (lb) {
        switch (lb) {
            case '1': {
                //检验
                baTable.form.items!.ZXPL = 1
                baTable.form.items!.JSFS = 3
                baTable.form.items!.ZXFL = 0
                baTable.form.items!.DDYY = 1
                state.zxplDisable = true
                state.jsfsDisable = true
            } break;
            case '2': {
                //检查
                baTable.form.items!.ZXPL = 1
                baTable.form.items!.JSFS = 3
                baTable.form.items!.ZXFL = 0
                baTable.form.items!.DDYY = 1
                state.zxplDisable = false
                state.jsfsDisable = true
            } break;
            case '3': {
                //治疗
                if (czlx == '0') {
                    baTable.form.items!.ZXPL = 1
                    baTable.form.items!.JSFS = 3
                    baTable.form.items!.ZXFL = 0
                    baTable.form.items!.DDYY = 1
                    state.zxplDisable = false
                    state.jsfsDisable = true
                    state.ddyyDisable = false
                } else if (czlx == '1') {
                    //过敏试验
                    baTable.form.items!.ZXPL = 1
                    baTable.form.items!.JSFS = 3
                    baTable.form.items!.ZXFL = 3
                    baTable.form.items!.DDYY = 1
                    state.zxplDisable = true
                    state.jsfsDisable = true
                    state.zxflDisable = true
                    state.ddyyDisable = false
                } else if (czlx == '2') {
                    baTable.form.items!.ZXPL = 0
                    baTable.form.items!.JSFS = 3
                    baTable.form.items!.ZXFL = 0
                    baTable.form.items!.DDYY = 0
                    state.zxplDisable = true
                    state.zxflDisable = false
                    state.ddyyDisable = true
                    state.showJsgz = true
                } else if (czlx == '3') {
                    baTable.form.items!.ZXPL = 0
                    baTable.form.items!.JSFS = 3
                    baTable.form.items!.ZXFL = 0
                    baTable.form.items!.DDYY = 0
                    state.zxplDisable = true
                    state.zxflDisable = false
                    state.ddyyDisable = true
                    state.showJsgz = true
                } else if (czlx == '4') {
                    baTable.form.items!.ZXPL = 0
                    baTable.form.items!.JSFS = 3
                    baTable.form.items!.ZXFL = 0
                    baTable.form.items!.DDYY = 0
                    state.zxplDisable = true
                    state.zxflDisable = false
                    state.ddyyDisable = true
                    state.showJsgz = true
                } else if (czlx == '5') {
                    baTable.form.items!.ZXPL = 0
                    baTable.form.items!.JSFS = 3
                    baTable.form.items!.ZXFL = 0
                    baTable.form.items!.DDYY = 0
                    state.zxplDisable = false
                    state.zxflDisable = false
                    state.ddyyDisable = false
                    state.showJsgz = true
                }
                else {
                    baTable.form.items!.ZXPL = 1
                    baTable.form.items!.JSFS = 0
                    baTable.form.items!.ZXFL = 0
                    baTable.form.items!.DDYY = 0
                    state.zxplDisable = false
                    state.zxflDisable = false
                    state.ddyyDisable = false
                    state.showJsgz = false
                }
            } break;
            case '4': {
                //手术
                baTable.form.items!.ZXPL = 1
                baTable.form.items!.JSFS = 3
                baTable.form.items!.ZXFL = 0
                baTable.form.items!.DDYY = 1
                state.zxplDisable = true
                state.jsfsDisable = true
            } break;
            case '5': {
                //麻醉
                baTable.form.items!.ZXPL = 1
                baTable.form.items!.JSFS = 3
                baTable.form.items!.ZXFL = 0
                baTable.form.items!.DDYY = 0
                state.zxplDisable = true
                state.jsfsDisable = true
                state.ddyyDisable = true
            } break;
            case '6': {
                //护理
                baTable.form.items!.ZXPL = 2
                baTable.form.items!.JSFS = 0
                baTable.form.items!.ZXFL = 0
                baTable.form.items!.DDYY = 1
                state.jsfsDisable = true
                if (czlx == '0') {
                    state.zxplDisable = false
                } else if (czlx == '1') {
                    state.zxplDisable = true
                } else {
                    state.zxplDisable = false
                }
            } break;
            case '7': {
                //膳食
                baTable.form.items!.ZXPL = 2
                baTable.form.items!.JSFS = 0
                baTable.form.items!.ZXFL = 0
                baTable.form.items!.DDYY = 1
                state.zxplDisable = true
                state.jsfsDisable = true
            } break;
            case '8': {
                //输血
                baTable.form.items!.ZXPL = 1
                baTable.form.items!.JSFS = 1
                baTable.form.items!.ZXFL = 0
                baTable.form.items!.DDYY = 1
                state.zxplDisable = false
                state.jsfsDisable = false
            } break;
            case '9': {
                //输氧
                baTable.form.items!.ZXPL = 2
                baTable.form.items!.JSFS = 0
                baTable.form.items!.ZXFL = 0
                baTable.form.items!.DDYY = 1
                state.zxplDisable = false
                state.jsfsDisable = false
            } break;
            case '10': {
                //材料
                baTable.form.items!.ZXPL = 0
                baTable.form.items!.JSFS = 1
                baTable.form.items!.ZXFL = 0
                baTable.form.items!.DDYY = 1
                state.zxplDisable = false
                state.jsfsDisable = false
                state.showJsgz = true
            } break;
            case '11': {
                //挂号
                baTable.form.items!.ZXPL = 1
                baTable.form.items!.JSFS = 0
                baTable.form.items!.ZXFL = 0
                baTable.form.items!.DDYY = 0
                state.zxplDisable = false
                state.jsfsDisable = false
            } break;
            case '12': {
                //床位
                baTable.form.items!.ZXPL = 1
                baTable.form.items!.JSFS = 0
                baTable.form.items!.ZXFL = 0
                baTable.form.items!.DDYY = 0
                state.zxplDisable = false
                state.jsfsDisable = false
            } break;
            case '13': {
                //诊查
                baTable.form.items!.ZXPL = 1
                baTable.form.items!.JSFS = 0
                baTable.form.items!.ZXFL = 0
                baTable.form.items!.DDYY = 0
                state.zxplDisable = false
                state.jsfsDisable = false
            } break;
            case '14': {
                //其他
                if (czlx == '0') {
                    baTable.form.items!.ZXPL = 1
                    baTable.form.items!.JSFS = 3
                    state.zxplDisable = false
                    state.jsfsDisable = false
                } else if (czlx == '1') {
                    baTable.form.items!.ZXPL = 1
                    baTable.form.items!.JSFS = 3
                    state.zxplDisable = true
                    state.jsfsDisable = true
                } else if (czlx == '2') {
                    baTable.form.items!.ZXPL = 1
                    baTable.form.items!.JSFS = 3
                    state.zxplDisable = true
                    state.jsfsDisable = true
                } else if (czlx == '3') {
                    baTable.form.items!.ZXPL = 1
                    baTable.form.items!.JSFS = 3
                    state.zxplDisable = true
                    state.jsfsDisable = true
                } else if (czlx == '4') {
                    baTable.form.items!.ZXPL = 2
                    baTable.form.items!.JSFS = 3
                    state.zxplDisable = true
                    state.jsfsDisable = true
                } else if (czlx == '5') {
                    baTable.form.items!.ZXPL = 1
                    baTable.form.items!.JSFS = 3
                    state.zxplDisable = true
                    state.jsfsDisable = true
                } else if (czlx == '6') {
                    baTable.form.items!.ZXPL = 1
                    baTable.form.items!.JSFS = 3
                    state.zxplDisable = true
                    state.jsfsDisable = true
                } else if (czlx == '7') {
                    baTable.form.items!.ZXPL = 1
                    baTable.form.items!.JSFS = 3
                    state.zxplDisable = true
                    state.jsfsDisable = true
                } else if (czlx == '8') {
                    baTable.form.items!.ZXPL = 1
                    baTable.form.items!.JSFS = 3
                    state.zxplDisable = true
                    state.jsfsDisable = true
                } else if (czlx == '9') {
                    baTable.form.items!.ZXPL = 2
                    baTable.form.items!.JSFS = 0
                    state.zxplDisable = true
                    state.jsfsDisable = true
                } else if (czlx == '10') {
                    baTable.form.items!.ZXPL = 2
                    baTable.form.items!.JSFS = 0
                    state.zxplDisable = true
                    state.jsfsDisable = true
                } else if (czlx == '11') {
                    baTable.form.items!.ZXPL = 1
                    baTable.form.items!.JSFS = 3
                    state.zxplDisable = true
                    state.jsfsDisable = true
                } else if (czlx == '12') {
                    baTable.form.items!.ZXPL = 2
                    baTable.form.items!.JSFS = 0
                    state.zxplDisable = true
                    state.jsfsDisable = true
                } else if (czlx == '14') {
                    baTable.form.items!.ZXPL = 2
                    baTable.form.items!.JSFS = 0
                    state.zxplDisable = true
                    state.jsfsDisable = true
                } else {
                    baTable.form.items!.ZXPL = 1
                    baTable.form.items!.JSFS = 0
                    state.zxplDisable = false
                    state.jsfsDisable = false
                }
                baTable.form.items!.ZXFL = 0
                baTable.form.items!.DDYY = 1
            } break;
            default: {
                baTable.form.items!.ZXPL = 1
                baTable.form.items!.JSFS = 0
                baTable.form.items!.ZXFL = 0
                baTable.form.items!.DDYY = 0
                state.zxplDisable = false
                state.jsfsDisable = false
            } break;
        }
    }
}

const formItemInit = () => {
    const lb = baTable.form.items!.LB
    const czlx = baTable.form.items!.CZLX
    state.ddyyDisable = false
    state.showJsgz = false
    if (lb) {
        switch (lb) {
            case '1': {
                //检验
                state.zxplDisable = true
                state.jsfsDisable = true
            } break;
            case '2': {
                //检查
                state.zxplDisable = false
                state.jsfsDisable = true
            } break;
            case '3': {
                //治疗
                if (czlx == '0') {
                    state.zxplDisable = false
                    state.jsfsDisable = true
                    state.ddyyDisable = false
                } else if (czlx == '1') {
                    //过敏试验
                    state.zxplDisable = true
                    state.jsfsDisable = true
                    state.zxflDisable = true
                    state.ddyyDisable = false
                } else if (czlx == '2') {
                    state.zxplDisable = true
                    state.zxflDisable = false
                    state.ddyyDisable = true
                    state.showJsgz = true
                } else if (czlx == '3') {
                    state.zxplDisable = true
                    state.zxflDisable = false
                    state.ddyyDisable = true
                    state.showJsgz = true
                } else if (czlx == '4') {
                    state.zxplDisable = true
                    state.zxflDisable = false
                    state.ddyyDisable = true
                    state.showJsgz = true
                } else if (czlx == '5') {
                    state.zxplDisable = false
                    state.zxflDisable = false
                    state.ddyyDisable = false
                    state.showJsgz = true
                }
                else {
                    state.zxplDisable = false
                    state.zxflDisable = false
                    state.ddyyDisable = false
                    state.showJsgz = false
                }
            } break;
            case '4': {
                //手术
                state.zxplDisable = true
                state.jsfsDisable = true
            } break;
            case '5': {
                //麻醉
                state.zxplDisable = true
                state.jsfsDisable = true
                state.ddyyDisable = true
            } break;
            case '6': {
                //护理
                state.jsfsDisable = true
                if (czlx == '0') {
                    state.zxplDisable = false
                } else if (czlx == '1') {
                    state.zxplDisable = true
                } else {
                    state.zxplDisable = false
                }
            } break;
            case '7': {
                //膳食
                state.zxplDisable = true
                state.jsfsDisable = true
            } break;
            case '8': {
                //输血
                state.zxplDisable = false
                state.jsfsDisable = false
            } break;
            case '9': {
                //输氧
                state.zxplDisable = false
                state.jsfsDisable = false
            } break;
            case '10': {
                //材料
                state.zxplDisable = false
                state.jsfsDisable = false
                state.showJsgz = true
            } break;
            case '11': {
                //挂号
                state.zxplDisable = false
                state.jsfsDisable = false
            } break;
            case '12': {
                //床位
                state.zxplDisable = false
                state.jsfsDisable = false
            } break;
            case '13': {
                //诊查
                state.zxplDisable = false
                state.jsfsDisable = false
            } break;
            case '14': {
                //其他
                if (czlx == '0') {
                    state.zxplDisable = false
                    state.jsfsDisable = false
                } else if (czlx == '1') {
                    state.zxplDisable = true
                    state.jsfsDisable = true
                } else if (czlx == '2') {
                    state.zxplDisable = true
                    state.jsfsDisable = true
                } else if (czlx == '3') {
                    state.zxplDisable = true
                    state.jsfsDisable = true
                } else if (czlx == '4') {
                    state.zxplDisable = true
                    state.jsfsDisable = true
                } else if (czlx == '5') {
                    state.zxplDisable = true
                    state.jsfsDisable = true
                } else if (czlx == '6') {
                    state.zxplDisable = true
                    state.jsfsDisable = true
                } else if (czlx == '7') {
                    state.zxplDisable = true
                    state.jsfsDisable = true
                } else if (czlx == '8') {
                    state.zxplDisable = true
                    state.jsfsDisable = true
                } else if (czlx == '9') {
                    state.zxplDisable = true
                    state.jsfsDisable = true
                } else if (czlx == '10') {
                    state.zxplDisable = true
                    state.jsfsDisable = true
                } else if (czlx == '11') {
                    state.zxplDisable = true
                    state.jsfsDisable = true
                } else if (czlx == '12') {
                    state.zxplDisable = true
                    state.jsfsDisable = true
                } else if (czlx == '14') {
                    state.zxplDisable = true
                    state.jsfsDisable = true
                } else {
                    state.zxplDisable = false
                    state.jsfsDisable = false
                }
            } break;
            default: {
                state.zxplDisable = false
                state.jsfsDisable = false
            } break;
        }
    }
}

watch(
    () => baTable.form.items!.ZXPL,
    (val) => {
        if (val === 0) {
            state.showPlsz = true
            if (baTable.form.items!.LB == '2') {
                state.showJsgz = true
                baTable.form.items!.JSGZ = 0
            } else if (baTable.form.items!.LB == '8') {
                state.showJsgz = true
                baTable.form.items!.JSGZ = ''
            }
        } else if (val === 1) {
            state.showPlsz = false
            if (baTable.form.items!.LB == '2') {
                state.showJsgz = false
                baTable.form.items!.JSGZ = ''
            } else if (baTable.form.items!.LB == '8') {
                state.showJsgz = false
                baTable.form.items!.JSGZ = ''
            }
        } else {
            state.showPlsz = false
            if (baTable.form.items!.LB == '2') {
                state.showJsgz = false
                baTable.form.items!.JSGZ = ''
            } else if (baTable.form.items!.LB == '8') {
                state.showJsgz = false
                baTable.form.items!.JSGZ = ''
            }
        }
    },
    { deep: true }
)

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            baTable.form.items!.JGBM = adminInfo.jgbm
            // baTable.form.items!.FLBM = prop.flbm
            if(Array.isArray(baTable.form.items!.FLBM) && baTable.form.items!.FLBM.length>0) {
                baTable.form.items!.FLBM = baTable.form.items!.FLBM[baTable.form.items!.FLBM.length-1]
            }
            if (baTable.form.items!.LB == '1'){
                if(baTable.form.items!.CZLX==='' || baTable.form.items!.CZLX===null || baTable.form.items!.CZLX===undefined) {
                    ElNotification({
                        type: 'error',
                        message: '检验类型不能为空.',
                    })
                    return;
                }
                if(baTable.form.items!.BBBW==='' || baTable.form.items!.BBBW===null || baTable.form.items!.BBBW===undefined) {
                    ElNotification({
                        type: 'error',
                        message: '标本不能为空.',
                    })
                    return;
                }
            }
            if (baTable.form.items!.LB == '2'){
                if(baTable.form.items!.CZLX==='' || baTable.form.items!.CZLX===null || baTable.form.items!.CZLX===undefined) {
                    ElNotification({
                        type: 'error',
                        message: '检查类型不能为空.',
                    })
                    return;
                }
            }
            if (baTable.form.items!.LB == '3'){
                if(baTable.form.items!.CZLX==='' || baTable.form.items!.CZLX===null || baTable.form.items!.CZLX===undefined) {
                    ElNotification({
                        type: 'error',
                        message: '处置性质不能为空.',
                    })
                    return;
                }
            } 
            if (baTable.form.items!.LB == '4') {
                if(baTable.form.items!.CZLX==='' || baTable.form.items!.CZLX===null || baTable.form.items!.CZLX===undefined) {
                    ElNotification({
                        type: 'error',
                        message: '手术规模不能为空.',
                    })
                    return;
                }
                baTable.form.items!.BBBW = baTable.form.items!.SSBM
                if(baTable.form.items!.BBBW==='' || baTable.form.items!.BBBW===null || baTable.form.items!.BBBW===undefined) {
                    ElNotification({
                        type: 'error',
                        message: '手术编码不能为空.',
                    })
                    return;
                }
            }
            if (baTable.form.items!.LB == '5'){
                if(baTable.form.items!.CZLX==='' || baTable.form.items!.CZLX===null || baTable.form.items!.CZLX===undefined) {
                    ElNotification({
                        type: 'error',
                        message: '麻醉类型不能为空.',
                    })
                    return;
                }
            }
            if (baTable.form.items!.LB == '6'){
                if(baTable.form.items!.CZLX==='' || baTable.form.items!.CZLX===null || baTable.form.items!.CZLX===undefined) {
                    ElNotification({
                        type: 'error',
                        message: '项目类型不能为空.',
                    })
                    return;
                }
            }
            if(baTable.form.items!.MZZXKS === '' || baTable.form.items!.MZZXKS === null || baTable.form.items!.MZZXKS === undefined) {
                ElNotification({
                    type: 'error',
                    message: '门诊执行科室不能为空.',
                })
                state.activeTab = 'zxks'
                return
            }
            if(baTable.form.items!.ZYZXKS === '' || baTable.form.items!.ZYZXKS === null || baTable.form.items!.ZYZXKS === undefined) {
                ElNotification({
                    type: 'error',
                    message: '住院执行科室不能为空.',
                })
                state.activeTab = 'zxks'
                return
            }

            let sfxmArr: any = [];
            if (state.bwjcffData && state.bwjcffData.length > 0) {
                state.bwjcffData.forEach((item: any) => {
                    sfxmArr.push({
                        JGBM: adminInfo.jgbm,
                        YZXMBM: baTable.form.items!.XMBM,
                        SFXMBM: item.SFXMBM,
                        SFSL: item.SFSL,
                        GX: item.GX,
                        CSXM: 0,
                        FYXZ: 2,
                        BWBM: item.BWBM,
                        JCFFBM: item.JCFFBM,
                        MZSFFS: 0,
                        ZYSFFS: 0,
                        ZXKSFS: 0,
                        ZSFXM: 0,
                        JSFYBS: 0,
                        BRLY: 0
                    })
                })
            }

            let zxksItems: any = []
            if (state.zxksData && state.zxksData.length > 0) {
                state.zxksData.forEach((item: any) => {
                    if (item.BRLY && item.ZXKSBM) {
                        zxksItems.push({
                            JGBM: adminInfo.jgbm,
                            XMBM: baTable.form.items!.XMBM,
                            BRLY: item.BRLY,
                            KDKSBM: item.KDKSBM,
                            ZXKSBM: item.ZXKSBM
                        })
                    }
                })
            }
            let syksItems: any = []
            if (state.sykslb) {
                state.sykslb.forEach((item: any) => {
                    if (item) {
                        syksItems.push({
                            JGBM: adminInfo.jgbm,
                            XMBM: baTable.form.items!.XMBM,
                            KSBM: item
                        })
                    }
                })
            }
            let yfylItems: any = []
            if (state.yfylData && state.yfylData.length > 0) {
                state.yfylData.forEach((item: any) => {
                    yfylItems.push({
                        JGBM: adminInfo.jgbm,
                        XMBM: baTable.form.items!.XMBM,
                        XZ: item.XZ,
                        YFBM: item.YFBM,
                        PLBM: item.PLBM
                    })
                })
            }
            let data = {
                agrs: {
                    yzxmzd: baTable.form.items,
                    sfmx: sfxmArr,
                    zxks: zxksItems,
                    yfyl: yfylItems,
                    syks: syksItems
                }
            }
            // console.log(data)
            baTable.onSubmitData(data)
        } else {
            console.log('error submit!', fields)
        }
    })
}

</script>

<style scoped lang="scss">
.ba-operate-form {
    :deep(.el-tabs__header .el-tabs__item) {
        color: #000;
    }

    .xmfl .el-row {
        .el-col:nth-child(1) {
            :deep(.el-form-item__label) {
                width: 75px !important;
            }
        }

        .xmfl-select {
            display: inline-block;

            :deep(.el-input) {
                width: 430px;
            }
        }
    }

    .xmsx .el-row {
        :deep(.el-input) {
            width: 180px;
        }

        :deep(.el-form-item__label) {
            width: 90px !important;
        }

        .bbbw-select {
            display: inline-block;

            :deep(.el-input) {
                width: 180px;
            }
        }

        .sgbm-select {
            display: inline-block;

            :deep(.el-input) {
                width: 180px;
            }
        }

        .ssbm-select {
            display: inline-block;

            :deep(.el-input) {
                width: 180px;
            }
        }

        .ckxm-select {
            display: inline-block;

            :deep(.el-input) {
                width: 320px;
            }
        }
    }

    .bbbw-ssbm {
        border: 1px solid #dcdfe6;
        width: 245px;
        height: 100px;
        padding: 10px 1px;

        .el-form-item :deep(.el-form-item__label) {
            width: 50px !important;
        }
    }

    .el-checkbox {
        color: #000;
    }

    .el-radio {
        color: #000;
    }
}

.edit-data-table :deep(.el-table__row .el-table__cell) {
    padding: 0px;
}

.xmsx-syfw {
    .title {
        font-weight: bold;
        color: #000;
        font-size: 15px;
    }

    .body {
        border: 1px solid #dcdfe6;
        padding: 10px 15px 10px 15px;
        height: 200px;

        :deep(.el-form-item) {
            margin-bottom: 10px;
        }
    }
}

// .zxks-tab .el-form-item {
//     margin-bottom: 10px;
// }

.el-form--inline .el-form-item {
    margin-bottom: 10px;
}

:deep(.el-form-item__error) {
    display: none;
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

.operate-text {
    margin-left: 3px;
}
</style>
