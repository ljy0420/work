<template>
    <div class="container-box">
        <div class="top-action">
            <el-button type="primary" plain>诊疗卡发卡</el-button>
            <el-button type="success" plain>调取档案</el-button>
            <el-button type="primary" plain>预约取号</el-button>
            <el-button type="danger" plain>退号</el-button>
            <el-button type="warning" plain>转科</el-button>
            <el-button type="info" plain>重打印</el-button>
            <el-button type="warning" plain>清屏</el-button>
            <el-button>关闭</el-button>
        </div>
        <div class="ghxx-box">
            <el-form ref="formRef" :model="form" label-position="right" :rules="rules">
                <div class="form-row">
                    <el-form-item label="" label-width="0px">
                        <el-input v-model="form.KHM" type="string" placeholder="" :rows="3" style="width: 360px">
                            <template #prepend>
                                <el-select v-model="form.KLX" filterable style="width: 100px;">
                                    <el-option v-for="opt in state.kxlArr" :key="opt.BM" :label="opt.MC"
                                        :value="opt.BM"></el-option>
                                </el-select>
                            </template>
                            <template #append>读卡</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <div class="pjd-box">
                            <div class="pjd-title">票据段:</div>
                            <div class="pjd-content pjd">3000 至 4000</div>
                            <div class="pjd-title">当前:</div>
                            <div class="pjd-content">1234</div>
                            <div class="pjd-title">已用:</div>
                            <div class="pjd-content">531张</div>
                            <div class="pjd-title">剩余:</div>
                            <div class="pjd-content">100张</div>
                        </div>
                    </el-form-item>
                </div>
                <div class="form-row">
                    <el-form-item label="病人类型:" label-width="80px">
                        <el-select v-model="form.BRLX" filterable clearable style="width: 200px;">
                            <el-option v-for="opt in state.brlxArr" :key="opt.BM" :label="opt.MC"
                                :value="opt.BM"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="XM" label="姓名:" label-width="80px">
                        <el-input v-model="form.XM" type="string" placeholder="" style="width: 200px"></el-input>
                    </el-form-item>
                    <el-form-item prop="XB" label="性别:" label-width="80px">
                        <el-select v-model="form.XB" filterable clearable style="width: 130px;">
                            <el-option v-for="opt in state.xbArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="CSNY" label="出生年月:" label-width="80px">
                        <el-date-picker v-model="form.CSNY" type="date" placeholder="选择日期" value-format="YYYY-MM-DD"
                            style="width: 170px;" />
                    </el-form-item>
                    <el-form-item label="年龄:" label-width="80px">
                        <el-input v-model="form.NLN" type="string" placeholder=""
                            style="width: 50px;margin-right: 5px;"></el-input><span>岁</span>
                        <el-input v-model="form.NLY" type="string" placeholder=""
                            style="width: 50px;margin-left: 5px;margin-right: 5px;"></el-input><span>月</span>
                    </el-form-item>
                </div>
                <div class="form-row">
                    <el-form-item prop="SFZH" label="身份证号:" label-width="80px">
                        <el-input v-model="form.SFZH" type="string" placeholder="" style="width: 200px"></el-input>
                    </el-form-item>
                    <el-form-item prop="SJH" label="手机号:" label-width="80px">
                        <el-input v-model="form.SJH" type="string" placeholder="" style="width: 200px"></el-input>
                    </el-form-item>
                    <el-form-item label="婚姻状况:" label-width="80px">
                        <el-select v-model="form.HYZK" filterable clearable style="width: 130px;"></el-select>
                    </el-form-item>
                    <el-form-item label="民族:" label-width="80px">
                        <el-select v-model="form.MZ" filterable clearable style="width: 120px;"></el-select>
                    </el-form-item>
                    <el-form-item label="个人属性:" label-width="80px">
                        <el-input v-model="form.GRSX" type="string" :readonly="true" placeholder=""
                            style="width: 200px"></el-input>
                    </el-form-item>
                </div>
                <div class="form-row">
                    <el-form-item label="家庭地址:" label-width="80px">
                        <el-input v-model="form.JTDZ" type="string" placeholder="" style="width: 480px"></el-input>
                    </el-form-item>
                    <el-form-item label="工作单位:" label-width="80px">
                        <el-input v-model="form.GZDW" type="string" placeholder="" style="width: 430px"></el-input>
                    </el-form-item>
                    <el-form-item label="" label-width="20">
                        <el-checkbox v-model="form.BLB" label="病历本"></el-checkbox>
                    </el-form-item>
                </div>
                <div class="form-row">
                    <el-form-item prop="GHKS" label="挂号科室:" label-width="80px">
                        <el-select v-model="form.GHKS" filterable clearable style="width: 200px;">
                            <el-option v-for="opt in state.ghksArr" :key="opt.BM" :label="opt.MC"
                                :value="opt.BM"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="挂号医生:" label-width="80px">
                        <el-select v-model="form.GHYS" filterable clearable style="width: 200px;"></el-select>
                    </el-form-item>
                    <el-form-item label="挂号类型:" label-width="80px">
                        <el-select v-model="form.GHLX" filterable clearable style="width: 200px;"></el-select>
                    </el-form-item>
                    <el-form-item label="就诊模式:" label-width="80px">
                        <el-select v-model="form.JZMS" filterable clearable style="width: 150px;"></el-select>
                    </el-form-item>
                    <el-form-item label="" label-width="20">
                        <el-checkbox v-model="form.JZ" label="急诊"></el-checkbox>
                    </el-form-item>
                    <el-form-item label-width="30px">
                        <el-button type="primary" @click="onGhyl(formRef)">挂 号</el-button>
                    </el-form-item>
                </div>
            </el-form>
            <div class="scghxx">
                <div class="scghxx-box">
                    <div class="title">上次挂号信息</div>
                    <div class="item">
                        <el-form-item prop="BRXM" label="挂号单号:" label-width="80px">
                            <el-input type="string" placeholder="" style="width: 200px"></el-input>
                        </el-form-item>
                    </div>
                    <div class="item">
                        <el-form-item prop="BRXM" label="病人姓名:" label-width="80px">
                            <el-input type="string" placeholder="" style="width: 200px"></el-input>
                        </el-form-item>
                    </div>
                    <div class="item">
                        <el-form-item prop="BRXM" label="病历号:" label-width="80px">
                            <el-input type="string" placeholder="" style="width: 200px"></el-input>
                        </el-form-item>
                    </div>
                </div>
            </div>
        </div>
        <div class="ghjl-box">
            <div class="ghjl-search">
                <div class="form-row">
                    <el-form-item label="时间段:" label-width="80px">
                        <el-date-picker v-model="search.SJD" type="daterange" range-separator="至" start-placeholder="开始时间"
                            end-placeholder="结束时间" value-format="YYYY-MM-DD" :teleported="false" />
                    </el-form-item>
                    <el-form-item label="挂号类型:" label-width="80px">
                        <el-select v-model="search.GHLX" filterable clearable style="width: 200px;"></el-select>
                    </el-form-item>
                    <el-form-item label="操作员:" label-width="80px">
                        <el-select v-model="search.CZY" filterable clearable style="width: 150px;"></el-select>
                    </el-form-item>
                    <el-form-item label="" label-width="20">
                        <el-checkbox v-model="search.TKTBLB" label="退号退病历本"></el-checkbox>
                    </el-form-item>
                    <el-form-item label="" label-width="20">
                        <el-checkbox v-model="search.CDYZPJH" label="重打印占票据号"></el-checkbox>
                    </el-form-item>
                </div>
                <div class="form-row">
                    <el-form-item label="挂号科室:" label-width="80px">
                        <el-select v-model="search.GHKS" filterable clearable style="width: 200px;"></el-select>
                    </el-form-item>
                    <el-form-item label="挂号医生:" label-width="80px">
                        <el-select v-model="search.GHYS" filterable clearable style="width: 200px;"></el-select>
                    </el-form-item>
                    <el-form-item label="检索条件:" label-width="80px">
                        <el-input v-model="search.keywords" style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item label-width="30px">
                        <el-button type="primary" plain>查询</el-button>
                    </el-form-item>
                </div>
            </div>
            <div class="ghjl-list">
                <el-table v-loading="state.loading" class="ba-data-table w100" header-cell-class-name="table-header-cell"
                    :data="state.ghjl" highlight-current-row height="100%">
                    <el-table-column prop="GHDH" label="挂号单号" width="100" />
                    <el-table-column prop="BLH" label="病历号" width="130" />
                    <el-table-column prop="XM" label="姓名" width="100" />
                    <el-table-column prop="BRLX" label="病人类型" width="80" />
                    <el-table-column prop="GHYS" label="挂号医生" width="90" />
                    <el-table-column prop="GHKS" label="挂号科室" width="100" />
                    <el-table-column prop="GHLX" label="挂号类型" width="115" />
                    <el-table-column prop="CZY" label="操作员" width="90" />
                    <el-table-column prop="GHSJ" label="挂号时间" width="160" />
                    <el-table-column prop="THBZ" label="退号标志" width="90" />
                    <el-table-column prop="BLB" label="病历本" width="90" />
                    <el-table-column prop="ZFY" label="总费用" width="100" />
                    <el-table-column prop="KZFJE" label="卡支付金额" width="100" />
                    <el-table-column prop="GHXH" label="挂号序号" width="90" />
                    <el-table-column prop="FKFS" label="付款方式" width="100" />
                    <el-table-column prop="JZZT" label="就诊状态" width="100" />
                </el-table>
            </div>
        </div>
        <Ghjsyl ref="ghjsylRef" :ghInfo="form" @ghConfirm="ghConfirm" />
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import type { FormInstance, FormItemRule } from 'element-plus'
import Ghjsyl from './ghjsyl.vue'

defineOptions({
    name: 'test/demo',
})

const formRef = ref<FormInstance>()
const ghjsylRef = ref()

const form = reactive({
    KLX: '1',
    KHM: '',
    PJD: '',
    DQ: '',
    YY: '',
    SY: '',
    BRLX: '5', //病人类型
    XM: '', //姓名
    XB: '', //性别
    CSNY: '', //出生年月
    NLN: '', //年龄(岁)
    NLY: '', //年龄(月)
    SFZH: '', //身份证号
    SJH: '', //手机号
    HYZK: '', //婚姻状况
    MZ: '', //民族
    GRSX: '', //个人属性
    JTDZ: '', //家庭地址
    GZDW: '', //工作单位
    BLB: false, //病历本
    GHKS: '', //挂号科室
    GHYS: '', //挂号医生
    GHLX: '', //挂号类型
    JZMS: '', //就诊模式
    JZ: false
})

const search = reactive({
    SJD: '',
    GHLX: '',
    CZY: '',
    GHKS: '',
    GHYS: '',
    TKTBLB: true,
    CDYZPJH: false,
    keywords: ''
})

const state = reactive({
    loading: false,
    kxlArr: [
        { "BM": "1", "MC": "医保" },
        { "BM": "2", "MC": "国家医保" },
        { "BM": "3", "MC": "健康卡" },
        { "BM": "4", "MC": "身份证" },
    ],
    brlxArr: [
        { "BM": "1", "MC": "合同" },
        { "BM": "2", "MC": "三无" },
        { "BM": "3", "MC": "农合" },
        { "BM": "4", "MC": "工伤" },
        { "BM": "5", "MC": "现金" },
        { "BM": "6", "MC": "医保" },
    ],
    xbArr: [
        { "BM": "1", "MC": "男" },
        { "BM": "2", "MC": "女" },
        { "BM": "3", "MC": "未知性别" },
    ],
    ghksArr: [
        { "BM": "1", "MC": "急诊科" },
        { "BM": "2", "MC": "门诊" },
        { "BM": "3", "MC": "皮肤科" },
    ],
    ghjl: [
        {
            GHDH: '123',
            BLH: '12544315',
            XM: '张三',
            BRLX: '医保',
            GHYS: '刘医生',
            GHKS: '皮肤科',
            GHLX: '普通门诊挂号',
            CZY: 'Mike',
            GHSJ: '2024-01-08 10:12:32',
            THBZ: '是',
            BLB: '1',
            ZFY: '10.00',
            KZFJE: '5.00',
            GHXH: 12,
            FKFS: '现金+卡',
            JZZT: '待就诊'
        },
        {
            GHDH: '124',
            BLH: '12544316',
            XM: '李四',
            BRLX: '医保',
            GHYS: '刘医生',
            GHKS: '皮肤科',
            GHLX: '普通门诊挂号',
            CZY: 'Mike',
            GHSJ: '2024-01-08 10:15:16',
            THBZ: '是',
            BLB: '1',
            ZFY: '10.00',
            KZFJE: '5.00',
            GHXH: 12,
            FKFS: '现金+卡',
            JZZT: '待就诊'
        }
    ]
})

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    XM: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
    XB: [{ required: true, message: '性别不能为空', trigger: 'change' }],
    CSNY: [{ required: true, message: '出生年月不能为空', trigger: 'change' }],
    SFZH: [{ required: true, message: '身份证号不能为空', trigger: 'blur' }],
    SJH: [{ required: true, message: '手机号不能为空', trigger: 'blur' }],
    GHKS: [{ required: true, message: '挂号科室不能为空', trigger: 'change' }],
})

const ghConfirm = () => {

}

const onGhyl = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            ghjsylRef.value.show()
        } else {
            console.log('error submit!', fields)
        }
    })
}

onMounted(() => {

})

</script>

<style lang="scss" scoped>
.container-box {
    margin: 6px;
    height: calc(100vh - 100px);
    display: flex;
    flex-direction: column;

    .form-row {
        display: flex;
        align-items: center;

        .form-item {
            margin-right: 15px;
            min-width: 170px;
        }
    }

    .el-form-item {
        margin-bottom: 10px;
    }

    .top-action {
        padding: 10px 15px;
        background-color: #fff;
    }

    .ghxx-box {
        margin-top: 5px;
        padding: 10px 15px;
        background-color: #fff;
        display: flex;
        flex-direction: row;
        min-width: 1300px;

        .pjd-box {
            margin-left: 20px;
            height: 100%;
            display: flex;
            align-items: center;
            background-color: #f1f1f1;

            .pjd-title {
                font-size: 15px;
                width: 70px;
                text-align: right;
                padding: 0 10px;
                font-weight: 600;
            }

            .pjd-content {
                min-width: 130px;
            }

            .pjd {
                width: 200px;
            }
        }

        .scghxx {
            margin-left: 30px;

            .scghxx-box {
                padding-bottom: 10px;
                border: 1px solid #dcdfe6;

                .title {
                    padding: 10px;
                    margin-bottom: 10px;
                    font-weight: 600;
                    border-bottom: 1px solid #dcdfe6;
                }

                .item {
                    margin-right: 10px;
                }
            }
        }
    }

    .ghjl-box {
        margin-top: 5px;
        padding: 10px 15px;
        background-color: #fff;
        height: 100%;

        .ghjl-search {
            border-bottom: 1px solid #f1f1f1;
        }

        .ghjl-list {
            height: calc(100% - 80px);
        }
    }
}
</style>