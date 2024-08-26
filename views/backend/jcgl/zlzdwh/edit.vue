<template>
    <!-- 对话框表单 -->
    <el-dialog
        class="ba-operate-dialog zlzd-edit"
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
                {{ baTable.form.operate == 'Add' ? '诊疗字典-新增' : '诊疗字典-修改' }}
            </div>
        </template>
        <el-scrollbar v-loading="baTable.form.loading" class="ba-table-form-scrollbar">
            <div class="ba-operate-form" :class="'ba-' + baTable.form.operate + '-form'">
                <el-form
                    ref="formRef"
                    :inline="true"
                    :model="baTable.form.items"
                    label-position="right"
                    :label-width="baTable.form.labelWidth + 'px'"
                    :rules="rules"
                    v-if="!baTable.form.loading"
                >
                    <div style="padding: 1px">
                        <el-row :gutter="2">
                            <el-col :xs="24" :sm="15">
                                <el-form-item prop="FLBM" label="项目分类">
                                    <div class="xmfl-select">
                                        <el-cascader
                                            v-model="baTable.form.items!.FLBM"
                                            :props="defaultProps"
                                            :options="prop.flDataArr"
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
                                <el-form-item prop="LB" label="项目类别">
                                    <el-select v-model="baTable.form.items!.LB" filterable placeholder="请选择" clearable style="width: 100%">
                                        <el-option v-for="opt in state.lbArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="2">
                            <el-col :xs="24" :sm="15">
                                <el-form-item prop="XMBM" label="项目编码">
                                    <el-input
                                        :disabled="true"
                                        style="width: 450px"
                                        v-model="baTable.form.items!.XMBM"
                                        type="string"
                                        placeholder="系统自动生成"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="9">
                                <el-form-item prop="FWDX" label="服务对象">
                                    <el-select v-model="baTable.form.items!.FWDX" filterable placeholder="请选择" clearable style="width: 100%">
                                        <el-option v-for="opt in fwdxOptions" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="2">
                            <el-col :xs="24" :sm="15">
                                <el-form-item prop="XMMC" label="项目名称">
                                    <el-input
                                        v-model="baTable.form.items!.XMMC"
                                        @change="mChange"
                                        type="string"
                                        placeholder="请输入"
                                        style="width: 450px"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="9">
                                <el-form-item prop="MCSY" label="名称缩写">
                                    <el-input v-model="baTable.form.items!.MCSY" type="string" placeholder="请输入"></el-input>
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
                                <div class="wbm-input">
                                    <el-form-item prop="WBM" label="五笔码">
                                        <el-input v-model="baTable.form.items!.WBM" type="string" placeholder="请输入"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :xs="24" :sm="9">
                                <el-form-item prop="ZBM" label="自编码">
                                    <el-input v-model="baTable.form.items!.ZBM" type="string" placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row :gutter="2">
                            <el-col :xs="24" :sm="15">
                                <div style="display: flex">
                                    <el-form-item prop="DWMC" label="单位名称">
                                        <!-- <el-input v-model="baTable.form.items!.DWMC" type="string" placeholder="请输入单位名称"></el-input> -->
                                        <el-select v-model="baTable.form.items!.DWMC" filterable placeholder="请选择" clearable style="width: 100%">
                                            <el-option v-for="opt in state.dwArr" :key="opt.MC" :label="opt.MC" :value="opt.MC"></el-option>
                                        </el-select>
                                    </el-form-item>

                                    <el-checkbox
                                        v-model="baTable.form.items!.SFDZ"
                                        :true-label="1"
                                        :false-label="0"
                                        label="打折"
                                        style="margin-right: 4px"
                                    />
                                    <el-checkbox
                                        v-model="baTable.form.items!.SFBJ"
                                        :true-label="1"
                                        :false-label="0"
                                        label="变价"
                                        style="margin-right: 4px"
                                    />
                                    <el-checkbox
                                        v-model="baTable.form.items!.JBJJ"
                                        :true-label="1"
                                        :false-label="0"
                                        label="加班加价"
                                        style="margin-right: 4px"
                                    />
                                    <el-checkbox v-model="baTable.form.items!.FYQR" :true-label="1" :false-label="0" label="费用确认" />
                                </div>
                            </el-col>
                            <el-col :xs="24" :sm="9">
                                <el-form-item prop="SRXMBM" label="收入项目编码">
                                    <el-tree-select
                                        v-model="baTable.form.items!.SRXMBM"
                                        :data="state.srxmbmArr"
                                        check-strictly
                                        filterable
                                        :render-after-expand="false"
                                        :props="{ label: 'MC', value: 'BM' }"
                                        style="width: 100%"
                                    >
                                    </el-tree-select>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row :gutter="2">
                            <el-col :xs="24" :sm="7">
                                <el-form-item prop="CBJ" label="成本价">
                                    <el-input v-model="baTable.form.items!.CBJ" type="number" placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="8">
                                <el-form-item prop="DJ" label="当前售价">
                                    <el-input v-model="baTable.form.items!.DJ" type="number" placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="9">
                                <el-form-item prop="SJGLBM" label="收据归类">
                                    <el-select v-model="baTable.form.items!.SJGLBM" filterable placeholder="请选择" clearable style="width: 100%">
                                        <el-option v-for="opt in state.glbmArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row :gutter="2">
                            <el-col :xs="24" :sm="7">
                                <el-form-item prop="ZDJ" label="最低价">
                                    <el-input v-model="baTable.form.items!.ZDJ" type="number" placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="8">
                                <el-form-item prop="SBWJJ" label="首部位加价">
                                    <el-input v-model="baTable.form.items!.SBWJJ" type="number" placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="9">
                                <el-form-item prop="CWGLBM" label="财务归类">
                                    <el-select v-model="baTable.form.items!.CWGLBM" filterable placeholder="请选择" clearable style="width: 100%">
                                        <el-option v-for="opt in state.glbmArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row :gutter="2">
                            <el-col :xs="24" :sm="7">
                                <el-form-item prop="ZGJ" label="最高价">
                                    <el-input v-model="baTable.form.items!.ZGJ" type="number" placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="8">
                                <el-form-item prop="JSFS" label="计算方式">
                                    <el-radio-group v-model="baTable.form.items!.JSFS">
                                        <el-radio :label="0" size="large">人工计算</el-radio>
                                        <el-radio :label="1" size="large">自动计算</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="9">
                                <el-form-item prop="YWGLBM" label="业务归类">
                                    <el-select v-model="baTable.form.items!.YWGLBM" filterable placeholder="请选择" clearable style="width: 100%">
                                        <el-option v-for="opt in state.glbmArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row :gutter="2">
                            <el-col :xs="24" :sm="7">
                                <el-form-item prop="YBLB" label="医保类别">
                                    <el-select v-model="baTable.form.items!.YBLB" filterable placeholder="请选择" @change="yblbChange" clearable style="width: 100%">
                                        <el-option v-for="opt in prop.bxlbArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="8">
                                <el-form-item prop="YBZFBL" label="医保自费比例">
                                    <el-input v-model="baTable.form.items!.YBZFBL" type="string" placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="9">
                                <el-form-item prop="ZKGLBM" label="折扣归类">
                                    <el-select v-model="baTable.form.items!.ZKGLBM" filterable placeholder="请选择" clearable style="width: 100%">
                                        <el-option v-for="opt in state.glbmArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="2">
                            <el-col :xs="24" :sm="7">
                                <el-form-item prop="GSLB" label="工伤类别">
                                    <el-select v-model="baTable.form.items!.GSLB" filterable placeholder="请选择" clearable @change="gslbChange" style="width: 100%">
                                        <el-option v-for="opt in prop.bxlbArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="8">
                                <el-form-item prop="GSZFBL" label="工伤自费比例">
                                    <el-input v-model="baTable.form.items!.GSZFBL" type="string" placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="9">
                                <el-form-item prop="QTGLBM" label="其他归类">
                                    <el-select v-model="baTable.form.items!.QTGLBM" filterable placeholder="请选择" clearable style="width: 100%">
                                        <el-option v-for="opt in state.glbmArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row :gutter="2">
                            <el-col :xs="24" :sm="15">
                                <el-form-item prop="XMNH" label="项目内涵">
                                    <el-input v-model="baTable.form.items!.XMNH" style="width: 450px" type="string" placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="9">
                                <el-form-item prop="BAGLBM" label="病案归类">
                                    <el-select v-model="baTable.form.items!.BAGLBM" filterable placeholder="请选择" clearable style="width: 100%">
                                        <el-option v-for="opt in state.baglbmArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="2">
                            <el-col :xs="24" :sm="24">
                                <el-form-item prop="CWNR" label="除外项目">
                                    <el-input v-model="baTable.form.items!.CWXM" style="width: 745px" type="string" placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col> </el-col>
                        </el-row>

                        <el-row :gutter="2">
                            <el-col :xs="24" :sm="12">
                                <el-form-item prop="GJMC" label="国家名称">
                                    <el-input v-model="baTable.form.items!.GJMC" style="width: 285px" type="string" placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="12">
                                <el-form-item prop="GJBM" label="国家编码">
                                    <el-input v-model="baTable.form.items!.GJBM" style="width: 288px" type="string" placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col> </el-col>
                        </el-row>

                        <el-row :gutter="2">
                            <el-col :xs="24" :sm="12">
                                <el-form-item prop="SXMMC" label="省 名 称">
                                    <el-input v-model="baTable.form.items!.SXMMC" style="width: 285px" type="string" placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="12">
                                <el-form-item prop="SXMBM" label="省 编 码">
                                    <el-input v-model="baTable.form.items!.SXMBM" style="width: 288px" type="string" placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col> </el-col>
                        </el-row>
                        <el-row :gutter="2">
                            <el-col :xs="24" :sm="9" style="padding-left: 25px">
                                <el-form-item prop="MZZXKS" label="门诊执行科室">
                                    <el-select
                                        v-model="baTable.form.items!.MZZXKS"
                                        placeholder="请选择"
                                        clearable
                                        style="width: 100%"
                                        @change="mzzxksChange"
                                    >
                                        <el-option v-for="opt in state.mzzxksArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="15">
                                <div style="display: flex">
                                    <el-form-item prop="ZYZXKS" label="住院执行科室">
                                        <el-select
                                            v-model="baTable.form.items!.ZYZXKS"
                                            placeholder="请选择"
                                            clearable
                                            style="width: 100%"
                                            @change="zyzxksChange"
                                        >
                                            <el-option v-for="opt in state.mzzxksArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-checkbox v-model="baTable.form.items!.CYYZ" :true-label="1" :false-label="0" label="出院验证" />
                                    <el-checkbox v-model="baTable.form.items!.YXZT" :true-label="'1'" :false-label="'0'" label="允许使用" />
                                </div>
                            </el-col>
                            <el-col :xs="24"> </el-col>
                        </el-row>
                    </div>
                    <!-- copy de  -->
                </el-form>
                <div style="margin: 0 30px 20px 20px">
                    <el-table class="edit-data-table" :data="state.mzzxksData" border max-height="300px">
                        <el-table-column type="index" width="50" align="center" />
                        <el-table-column prop="KDKSBM" label="来源" width="120">
                            <template #default="scope">
                                <el-select v-model="scope.row.BRLY" clearable placeholder="请选择" filterable :disabled="!scope.row.isEdit">
                                    <el-option
                                        v-for="opt in state.lyArr"
                                        :key="opt.BM"
                                        :label="opt.MC"
                                        :value="opt.BM"
                                        :disabled="opt.disabled"
                                    ></el-option>
                                </el-select>
                            </template>
                        </el-table-column>

                        <el-table-column prop="ZXKSBM" label="执行科室" width="150">
                            <template #default="scope">
                                <el-select v-model="scope.row.ZXKSBM" clearable placeholder="请选择" filterable style="width: 100%" :disabled="!scope.row.isEdit">
                                    <el-option v-for="opt in state.ksArr" :key="opt.KSBM" :label="opt.KSMC" :value="opt.KSBM"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="KDKSBM" label="服务科室">
                            <template #default="scope">
                                <el-select v-model="scope.row.FWKS" clearable placeholder="请选择(可多选)" filterable multiple style="width: 100%" :disabled="!scope.row.isEdit">
                                    <el-option v-for="opt in state.kdksArr" :key="opt.KSBM" :label="opt.KSMC" :value="opt.KSBM"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="" label="操作" width="90" fixed="right" align="center">
                            <template #default="scope">
                                <el-button link v-blur type="primary" size="small" @click="addMzzxks" v-show="baTable.form.items!.MZZXKS === 4 || baTable.form.items!.ZYZXKS === 4">
                                    <Icon name="local-create" style="color: rgb(14, 141, 77)" class="local-icon" />
                                </el-button>
                                <el-popconfirm title="您确定删除这条记录吗?" @confirm="deleteMzzxks(scope.$index)">
                                    <template #reference>
                                        <el-button
                                            link
                                            v-blur
                                            type="primary"
                                            size="small"
                                            style="margin-left: 3px"
                                            v-if="state.mzzxksData.length !== 1"
                                        >
                                            <Icon name="local-delete" style="color: rgb(245, 75, 33)" class="local-icon" />
                                        </el-button>
                                    </template>
                                </el-popconfirm>
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
import { reactive, ref, inject, watch, onMounted } from 'vue'
import type baTableClass from '/@/utils/baTable'
import FormItem from '/@/components/formItem/index.vue'
import type { FormInstance, FormItemRule } from 'element-plus'
import { ElMessage } from 'element-plus'
import { buildValidatorData } from '/@/utils/validate'
import { getCxzlzxks, getCxjdfl } from '/@/api/backend/jcgl/zlzdwh'
import { getPymWbm, getKsList, getSrxmzdList } from '/@/api/common'
import { useAdminInfo } from '/@/stores/adminInfo'

const adminInfo = useAdminInfo()

const prop = defineProps(['fldata', 'flbm', 'zdData', 'bxlbArr', 'cjxxArr', 'flDataArr', 'zxksBotData'])

const state: {
    lbArr: any
    dwArr: any //单位
    glbmArr: any
    baglbmArr: any
    zxksData: any //执行科室数据
    mzzxksData: any //门诊执行科室
    zyzxksData: any //住院执行科室
    brlyArr: any //病人来源
    ksArr: any //科室数据
    kdksArr: any //开单科室
    mzzxksArr: any
    lyArr: any
    ydxsbzArr: any
    srxmbmArr: any
    xmflArr: []
} = reactive({
    lbArr: [],
    dwArr: [],
    glbmArr: [],
    baglbmArr: [],
    zxksData: [],
    mzzxksData: [{ BRLY: '', KDKSBM: '', ZXKSBM: '', isEdit: false, editTxt: '确定' }],
    zyzxksData: [],
    brlyArr: [
        { BM: 0, MC: '' },
        { BM: 1, MC: '门诊' },
        { BM: 2, MC: '住院' },
    ],
    ksArr: [],
    kdksArr: [],
    mzzxksArr: [
        { BM: 0, MC: '无明确执行科室' },
        { BM: 1, MC: '病人科室' },
        { BM: 2, MC: '病人病区' },
        { BM: 3, MC: '操作员所在科室' },
        { BM: 4, MC: '指定科室执行' },
        { BM: 6, MC: '开单人所在科室' },
    ],
    lyArr: [
        { BM: 1, MC: '门诊', disabled: true },
        { BM: 2, MC: '住院', disabled: true },
    ],
    ydxsbzArr: [
        { BM: 0, MC: '无' },
        { BM: 1, MC: '忽略零库存' },
        { BM: 2, MC: '自备药' },
        { BM: 3, MC: '外延药品' },
    ],
    srxmbmArr: [],
    xmflArr: [],
})

const fwdxOptions = [
    { value: 0, label: '无' },
    { value: 1, label: '门诊' },
    { value: 2, label: '住院' },
    { value: 3, label: '门诊和住院' },
]

const formRef = ref<FormInstance>()
const baTable = inject('baTable') as baTableClass

const mChange = (value: string) => {
    getPymWbm({ agrs: value }).then((res) => {
        baTable.form.items!.PYM = res.data.PYM
        baTable.form.items!.WBM = res.data.WBM
    })
}

const yblbChange = (value: string) => {
    if (value && prop.bxlbArr.length > 0) {
        baTable.form.items!.YBLBMC = prop.bxlbArr.find((ele: any) => ele.BM == value)?.MC
    }
}

const gslbChange = (value: string) => {
    if (value && prop.bxlbArr.length > 0) {
        baTable.form.items!.GSLBMC = prop.bxlbArr.find((ele: any) => ele.BM == value)?.MC
    }
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
    console.log('state.kdksArr: ', state.kdksArr)
})

getSrxmzdList({ agrs: { BM: '' } }).then((res) => {
    state.srxmbmArr = res.data
})

const mzzxksChange = (value: number) => {
    mzztChange()
}
// const mz = ref()
// const zy = ref()
const zyzxksChange = (value: number) => {
    mzztChange()
}

const defaultProps = {
    label: 'FLMC',
    value: 'FLBM',
    checkStrictly: true,
}

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    LB: [buildValidatorData({ name: 'required', title: '类别不能为空.' })],
    XMMC: [buildValidatorData({ name: 'required', title: '项目名称不能为空.' })],
    FWDX: [buildValidatorData({ name: 'required', title: '服务对象不能为空.' })],
    DWMC: [buildValidatorData({ name: 'required', title: '单位名称不能为空.' })],
    YXZT: [buildValidatorData({ name: 'required', title: '有效状态不能为空.' })],
    BAGLBM: [buildValidatorData({ name: 'required', title: '病案归类编码不能为空.' })],
    SRXMBM: [buildValidatorData({ name: 'required', title: '收入项目编码不能为空.' })],
    JSFS: [buildValidatorData({ name: 'required', title: '计算方式不能为空.' })],
    FLBM: [buildValidatorData({ name: 'required', title: '项目分类不能为空.' })],
    MZZXKS: [buildValidatorData({ name: 'required', title: '门诊执行科室不能为空.' })],
    ZYZXKS: [buildValidatorData({ name: 'required', title: '住院执行科室不能为空.' })],
})

const mzztChange = () => {
    if (state.mzzxksData && state.mzzxksData.length > 0) {
        state.mzzxksData.forEach((item: any) => {
            item.isEdit = true
        })
    }
    if (baTable.form.items!.MZZXKS == 4 && baTable.form.items!.ZYZXKS == 4) {
        state.lyArr.forEach((item: any) => {
            item.disabled = false
        })
    } else if (baTable.form.items!.MZZXKS == 4 && baTable.form.items!.ZYZXKS != 4) {
        state.lyArr.forEach((item: any) => {
            item.disabled = true
            if (item.BM == 1) {
                item.disabled = false
            } else {
                item.disabled = true
            }
        })
    } else if (baTable.form.items!.MZZXKS != 4 && baTable.form.items!.ZYZXKS == 4) {
        state.lyArr.forEach((item: any) => {
            item.disabled = true
            if (item.BM == 1) {
                item.disabled = true
            } else {
                item.disabled = false
            }
        })
    } else {
        state.lyArr.forEach((item: any) => {
            item.disabled = true
        })
        if (state.mzzxksData && state.mzzxksData.length > 0) {
            state.mzzxksData.forEach((item: any) => {
                item.isEdit = false
            })
        }
    }
}

watch(
    () => baTable.form.operate,
    (val) => {
        if (val) {
            let storage = []
            storage = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_100001')
            state.lbArr = storage.filter((item: any) => item.BM != 21 && item.BM != 22 && item.BM != 23 && item.BM != 24 && item.BM != 25)
            state.glbmArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_009001')
            state.baglbmArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_009001_01')
            state.dwArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_009012')
        }

        if (baTable.form.operate == 'Edit' && prop.zxksBotData.length !== 0) {
            state.mzzxksData = prop.zxksBotData
            mzztChange()
        } else {
            state.mzzxksData = [{ BRLY: '', KDKSBM: '', ZXKSBM: '', isEdit: false, editTxt: '确定' }]
        }
    }
)

/**
 * 新增门诊执行科室
 */
const addMzzxks = () => {
    state.mzzxksData.push({ BRLY: '', KDKSBM: '', ZXKSBM: '', isEdit: true, editTxt: '确定' })
}

/**
 * 删除门诊执行科室
 * @param rowIndex
 */
const deleteMzzxks = (rowIndex: any) => {
    state.mzzxksData.splice(rowIndex, 1)
}

const submitForm = async (formEl: FormInstance | undefined) => {
    // 借鉴的成员
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            if(Array.isArray(baTable.form.items!.FLBM) && baTable.form.items!.FLBM.length>0) {
                baTable.form.items!.FLBM = baTable.form.items!.FLBM[baTable.form.items!.FLBM.length-1]
            }

            state.zxksData = []
            state.mzzxksData.forEach((item: any) => {
                state.zxksData.push(item)
            })
            let zxksItems: any = []
            state.zxksData.forEach((item: any) => {
                if (item.BRLY && item.ZXKSBM) {
                    if (item.FWKS && item.FWKS.length > 0) {
                        item.FWKS.forEach((ksbm: any) => {
                            zxksItems.push({
                                JGBM: adminInfo.jgbm,
                                XMBM: baTable.form.items!.XMBM,
                                BRLY: item.BRLY,
                                KDKSBM: ksbm,
                                ZXKSBM: item.ZXKSBM,
                            })
                        })
                    } else {
                        zxksItems.push({
                            JGBM: adminInfo.jgbm,
                            XMBM: baTable.form.items!.XMBM,
                            BRLY: item.BRLY,
                            KDKSBM: '',
                            ZXKSBM: item.ZXKSBM,
                        })
                    }
                }
            })
            // if (state.zxksData.length != zxksItems.length) {
            //     ElMessage.error('执行科室数据未填写完整.')
            //     return
            // }
            //类别名称赋值
            baTable.form.items!.LBMC = state.lbArr.find((ele: any) => ele.BM == baTable.form.items!.LB).MC
            baTable.form.items!.JGBM = adminInfo.jgbm

            let opt = baTable.form.operate === 'Add' ? '新增' : '修改'
            let data = {
                agrs: {
                    baoCunLX: opt,
                    zlzd: baTable.form.items,
                    zxks: zxksItems,
                },
            }
            // console.log(data)
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
:deep(.el-checkbox__label) {
    color: #000;
}
:deep(.el-radio-group) {
    width: 190px;
}
:deep(.el-radio) {
    margin-right: 10px;
}
:deep(.el-radio.el-radio--large) {
    height: 33px;
}
.ba-operate-form .el-row {
    .el-col:nth-child(1) {
        :deep(.el-input) {
            width: 170px;
        }
        :deep(.el-form-item__label) {
            width: 90px !important;
        }
        .xmfl-select {
            display: inline-block;
            :deep(.el-input) {
                width: 450px;
            }
        }
    }
    .el-col:nth-child(2) {
        :deep(.el-input) {
            width: 175px;
        }
        .fl-select {
            display: inline-block;
            :deep(.el-input) {
                width: 190px;
            }
        }
    }
    .el-col:nth-child(3) {
        :deep(.el-input) {
            width: 180px;
        }
    }
    .el-col {
        &:last-child {
            :deep(.el-input) {
                width: 180px !important;
            }
        }
    }
}

:deep(.el-form-item__error) {
    display: none;
}
.el-form--inline .el-form-item {
    margin-bottom: 6px;
}

.yd-card-body {
    padding: 10px;
}
.operate-text {
    margin-left: 3px;
}
</style>
