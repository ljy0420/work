<template>
    <!-- 对话框表单 -->
    <el-dialog
        class="ba-operate-dialog ypzd-edit"
        :close-on-click-modal="false"
        :model-value="['Add', 'Edit'].includes(baTable.form.operate!)"
        @close="baTable.toggleForm"
        :destroy-on-close="true"
        align-center
        id="edit-dialog"
        width="1000px"
    >
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']">
                {{ baTable.form.operate == 'Add' ? '药品规格信息-新增' : '药品规格信息-修改' }}
            </div>
        </template>
        <el-scrollbar v-loading="baTable.form.loading" class="ba-table-form-scrollbar">
            <div class="ba-operate-form yd-input-round" :class="'ba-' + baTable.form.operate + '-form'">
                <el-form
                    ref="formRef"
                    :inline="true"
                    :model="baTable.form.items"
                    label-position="right"
                    :label-width="baTable.form.labelWidth + 'px'"
                    :rules="rules"
                    v-if="!baTable.form.loading"
                >
                <div style="padding: 0 15px;">
                    <div style="padding: 0px 0px 10px 0px;color: #000;font-size: 15px;">
                        <span>药品编码：</span>
                        <span>{{ prop.xmbm }}</span>
                        <span style="margin-left: 20px;">药品名称：</span>
                        <span>{{ prop.xmmc }}</span>
                        <span style="margin-left: 20px;">剂型：</span>
                        <span>{{ prop.jxmc }}</span>
                    </div>
                    <div style="font-weight: bold;color: #000;font-size: 15px;">基本信息</div>
                    <div style="border: 1px solid #dcdfe6;padding: 10px 15px 10px 0px">
                        <el-row :gutter="2">
                            <el-col :xs="24" :sm="7">
                                <el-form-item prop="YPBM" label="规格编码">
                                    <el-input v-model="baTable.form.items!.YPBM" :disabled="true" type="string" placeholder="系统自动生成"></el-input>
                                </el-form-item> 
                            </el-col>
                            <el-col :xs="24" :sm="8">
                                <el-form-item prop="FWDX" label="服务对象">
                                    <el-select v-model="baTable.form.items!.FWDX" placeholder="请选择" filterable clearable>
                                        <el-option v-for="opt in fwdxOptions" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="9">
                                <el-form-item prop="SPM" label="商品名称">
                                    <el-input v-model="baTable.form.items!.SPM" @change="mChange" type="string" placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="2">
                            <el-col :xs="24" :sm="15">
                                <el-form-item prop="GG" label="规格">
                                    <el-input v-model="baTable.form.items!.GG" type="string" placeholder="请输入" style="width: 507px;"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="9">
                                <el-form-item prop="ZBM" label="自 编 码">
                                    <el-input v-model="baTable.form.items!.ZBM" type="string" placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="2">
                            <el-col :xs="24" :sm="15">
                                <el-form-item prop="CD" label="产地">
                                    <div class="cd-select">
                                        <SelectExt
                                        :data="state.cdArr"
                                        :defaultSelectVal="baTable.form.items!.CD"
                                        :pageSize="1000"
                                        :total="1000"
                                        :max-height="270" 
                                        :tableWidth="500"
                                        :columns="[{label:'编码',prop:'BM',align:'center',width:115},{label:'名称',prop:'MC',align:'left'}]"
                                        :keywords="{ label: 'MC', value: 'MC', key: 'BM', wbm: 'WBM', pym: 'PYM' }"
                                        :isShowFirstColumn="false"
                                        :isShowPagination="false"
                                        :isKeyup="true"
                                        filterable
                                        @radioChange="cdSelectChange"
                                        @selectClear="cdSelectClear"
                                        />
                                    </div>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="9">
                                <el-form-item prop="PZWH" label="批准文号">
                                    <el-input v-model="baTable.form.items!.PZWH" type="string" placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="2">
                            <el-col :xs="24" :sm="7">
                                <el-form-item prop="JSHL" label="计算含量">
                                    <el-input v-model="baTable.form.items!.JSHL" type="string" placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="8">
                                <el-form-item prop="DDD" label="DDD值">
                                    <el-input v-model="baTable.form.items!.DDD" type="string" placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="9">
                                <el-form-item prop="N_DDD" label="DDD系数">
                                    <el-input v-model="baTable.form.items!.N_DDD" type="string" placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="2">
                            <el-col :xs="24" :sm="7">
                                <el-form-item prop="PYM" label="拼 音 码">
                                    <el-input v-model="baTable.form.items!.PYM" type="string" placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="8">
                                <el-form-item prop="WBM" label="五 笔 码">
                                    <el-input v-model="baTable.form.items!.WBM" type="string" placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="9">
                                <el-form-item prop="TXM" label="条 形 码">
                                    <el-input v-model="baTable.form.items!.TXM" type="string" placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="2">
                            <el-col :xs="24" :sm="7">
                                <el-form-item prop="ZJFS" label="制剂方式">
                                    <!-- <el-input v-model="baTable.form.items!.ZJFS" type="string" placeholder="请输入"></el-input> -->
                                    <el-select v-model="baTable.form.items!.ZJFS" placeholder="请选择" filterable clearable>
                                        <el-option v-for="opt in state.zjfsArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="8">
                                <el-form-item prop="JKFS" label="进口方式">
                                    <!-- <el-input v-model="baTable.form.items!.JKFS" type="string" placeholder="请输入"></el-input> -->
                                    <el-select v-model="baTable.form.items!.JKFS" placeholder="请选择" filterable clearable>
                                        <el-option v-for="opt in state.jkfsArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="9">
                                <el-form-item prop="JL" label="默认剂量">
                                    <el-input v-model="baTable.form.items!.JL" type="string" placeholder="请输入" style="width: 100px"></el-input>
                                    <div class="dw-select" style="margin-left: 5px;">
                                        <el-select v-model="baTable.form.items!.JLDW" placeholder="请选择" filterable clearable>
                                            <el-option v-for="opt in state.jldwArr" :key="opt.MC" :label="opt.MC" :value="opt.MC"></el-option>
                                        </el-select>
                                    </div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="2">
                            <el-col :xs="24" :sm="7">
                                <el-form-item prop="CGSX" label="采购属性">
                                    <!-- <el-input v-model="baTable.form.items!.CGSX" type="string" placeholder="请输入"></el-input> -->
                                    <el-select v-model="baTable.form.items!.CGSX" placeholder="请选择" filterable clearable>
                                        <el-option v-for="opt in state.cgsxArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="8">
                                <el-form-item prop="YHFS" label="养护方式">
                                    <!-- <el-input v-model="baTable.form.items!.YHFS" type="string" placeholder="请输入"></el-input> -->
                                    <el-select v-model="baTable.form.items!.YHFS" placeholder="请选择" filterable clearable>
                                        <el-option v-for="opt in state.yhfsArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="9" style="white-space:nowrap;overflow: hidden;text-overflow:ellipsis;">
                                <el-form-item prop="JBDW" label="基本单位">
                                    <div class="dw-select">
                                        <el-select v-model="baTable.form.items!.JBDW" placeholder="请选择" filterable clearable>
                                            <el-option v-for="opt in state.jbdwArr" :key="opt.MC" :label="opt.MC" :value="opt.MC"></el-option>
                                        </el-select>
                                    </div>
                                    <div class="dwbz">
                                        <span>(</span>
                                        <span v-show="baTable.form.items!.JBDW">1</span>
                                        <span>{{baTable.form.items!.JBDW}}</span>
                                        <span>=</span>
                                        <el-input v-model="baTable.form.items!.JLXS" :disabled="!baTable.form.items!.JBDW" type="string" placeholder="请输入" style="width:65px"></el-input>
                                        <span style="padding-left: 3px;">{{baTable.form.items!.JLDW}}</span>
                                        <span>)</span>
                                    </div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="2">
                            <el-col :xs="24" :sm="15">
                                <div class="single-chk">
                                    <el-checkbox v-model="baTable.form.items!.GJPTY" :true-label="1" :false-label="0" label="国家谈判药" class="chk-attr" />
                                    <el-checkbox v-model="baTable.form.items!.JTZJ" :true-label="1" :false-label="0" label="集团制剂" class="chk-attr" />
                                    <el-checkbox v-model="baTable.form.items!.CJYP" :true-label="1" :false-label="0" label="集采药品" class="chk-attr" />
                                    <el-checkbox v-model="baTable.form.items!.FYWZ" :true-label="1" :false-label="0" label="防疫物资" class="chk-attr" />
                                    <el-checkbox v-model="baTable.form.items!.ZFCB" :true-label="1" :false-label="0" label="政府储备" class="chk-attr" />
                                    <el-checkbox v-model="baTable.form.items!.BACGYP" :true-label="1" :false-label="0" label="备案采购药品" class="chk-attr" />
                                    <el-checkbox v-model="baTable.form.items!.FLPZ" :true-label="1" :false-label="0" label="非两票制" class="chk-attr" />
                                    <el-checkbox v-model="baTable.form.items!.ZBYP" :true-label="1" :false-label="0" label="中标药品" class="chk-attr" />
                                    <el-checkbox v-model="baTable.form.items!.YXZT" :true-label="'0'" :false-label="'1'" label="禁止使用" class="chk-attr" />
                                </div>
                            </el-col>
                            <el-col :xs="24" :sm="9">
                                <el-form-item prop="ZYDW" label="住院单位">
                                    <div class="dw-select">
                                        <el-select v-model="baTable.form.items!.ZYDW" placeholder="请选择" filterable clearable>
                                            <el-option v-for="opt in state.jbdwArr" :key="opt.MC" :label="opt.MC" :value="opt.MC"></el-option>
                                        </el-select>
                                    </div>
                                    <div class="dwbz">
                                        <span>(</span>
                                        <span v-show="baTable.form.items!.ZYDW">1</span>
                                        <span>{{baTable.form.items!.ZYDW}}</span>
                                        <span>=</span>
                                        <el-input v-model="baTable.form.items!.ZYBZ" :disabled="!baTable.form.items!.ZYDW" type="string" placeholder="请输入" style="width:65px"></el-input>
                                        <span style="padding-left: 3px;">{{baTable.form.items!.JBDW}}</span>
                                        <span>)</span>
                                    </div>
                                </el-form-item>
                                <el-form-item prop="MZDW" label="门诊单位">
                                    <div class="dw-select">
                                        <el-select v-model="baTable.form.items!.MZDW" placeholder="请选择" filterable clearable>
                                            <el-option v-for="opt in state.jbdwArr" :key="opt.MC" :label="opt.MC" :value="opt.MC"></el-option>
                                        </el-select>
                                    </div>
                                    <div class="dwbz">
                                        <span>(</span>
                                        <span v-show="baTable.form.items!.MZDW">1</span>
                                        <span>{{baTable.form.items!.MZDW}}</span>
                                        <span>=</span>
                                        <el-input v-model="baTable.form.items!.MZBZ" :disabled="!baTable.form.items!.MZDW" type="string" placeholder="请输入" style="width:65px"></el-input>
                                        <span style="padding-left: 3px;">{{baTable.form.items!.JBDW}}</span>
                                        <span>)</span>
                                    </div>
                                </el-form-item>
                                <el-form-item prop="YKDW" label="药库单位">
                                    <div class="dw-select">
                                        <el-select v-model="baTable.form.items!.YKDW" placeholder="请选择" filterable clearable>
                                            <el-option v-for="opt in state.jbdwArr" :key="opt.MC" :label="opt.MC" :value="opt.MC"></el-option>
                                        </el-select>
                                    </div>
                                    <div class="dwbz">
                                        <span>(</span>
                                        <span v-show="baTable.form.items!.YKDW">1</span>
                                        <span>{{baTable.form.items!.YKDW}}</span>
                                        <span>=</span>
                                        <el-input v-model="baTable.form.items!.YKBZ" :disabled="!baTable.form.items!.YKDW" type="string" placeholder="请输入" style="width:65px"></el-input>
                                        <span style="padding-left: 3px;">{{baTable.form.items!.JBDW}}</span>
                                        <span>)</span>
                                    </div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="2">
                            <el-col :xs="24" :sm="3">
                                <div style="margin-left: 30px;"><el-checkbox v-model="baTable.form.items!.ZXYP" :true-label="1" :false-label="0" label="中选药品" @change="zxypChange" /></div>
                            </el-col>
                            <el-col :xs="24" :sm="12">
                                <el-form-item label="中选时间">
                                        <el-date-picker
                                            :disabled="baTable.form.items!.ZXYP==0"
                                            v-model="zxsjValue"
                                            type="daterange"
                                            range-separator="至"
                                            start-placeholder="开始时间"
                                            end-placeholder="结束时间"
                                            value-format="YYYY-MM-DD"
                                            :teleported="false"
                                            />
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="9">
                                <el-form-item prop="FYLX" label="发药类型">
                                    <el-select v-model="baTable.form.items!.FYLX" placeholder="请选择" filterable clearable style="width: 200px">
                                        <el-option v-for="opt in state.fylxArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                    <div style="font-weight: bold;color: #000;margin-top: 15px;font-size: 15px;">药价信息</div>
                    <div style="border: 1px solid #dcdfe6;padding: 10px 15px 10px 0px">
                        <el-row :gutter="2">
                            <el-col :xs="24" :sm="7">
                                <el-form-item prop="YBLB" label="医保类别">
                                    <el-select v-model="baTable.form.items!.YBLB" placeholder="请选择" filterable clearable style="width: 100%" @change="yblbChange">
                                        <el-option v-for="opt in prop.bxlbArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="8">
                                <el-form-item prop="YBZFBL" label="医保自费比例">
                                    <el-input-number v-model="baTable.form.items!.YBZFBL" type="number" :controls="false" :min="0" :precision="2" :step="0.1" placeholder="请输入"></el-input-number>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="9">
                                <el-form-item prop="GLBM" label="发票归类">
                                    <el-select v-model="baTable.form.items!.GLBM" placeholder="请选择" filterable clearable style="width: 100%" @change="glbmChange">
                                        <el-option v-for="opt in state.glbmArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="2">
                            <el-col :xs="24" :sm="7">
                                <el-form-item prop="GSLB" label="工伤类别">
                                    <el-select v-model="baTable.form.items!.GSLB" placeholder="请选择" filterable clearable style="width: 100%" @change="gslbChange">
                                        <el-option v-for="opt in prop.bxlbArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="8">
                                <el-form-item prop="GSZFBL" label="工伤自费比例">
                                    <el-input-number v-model="baTable.form.items!.GSZFBL" type="number" :controls="false" :min="0" :precision="2" :step="0.1" placeholder="请输入"></el-input-number>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="9">
                                <el-form-item prop="BAGLBM" label="病案归类">
                                    <el-select v-model="baTable.form.items!.BAGLBM" placeholder="请选择病案归类" filterable clearable style="width: 100%">
                                        <el-option v-for="opt in state.baglbmArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :xs="24" :sm="7">
                                <el-form-item prop="CBJ" label="成本价格">
                                    <el-input-number v-model="baTable.form.items!.CBJ" type="number" :controls="false" :min="0" :precision="2" :step="0.1" placeholder="请输入"></el-input-number>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="8">
                                <el-form-item prop="JCL" label="加 成 率">
                                    <el-input-number v-model="baTable.form.items!.JCL" type="number" :controls="false" :min="0" :precision="2" :step="0.1" placeholder="请输入" @change="jclChange"></el-input-number>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="9">
                                <el-form-item prop="LSJ" label="当前售价">
                                    <el-input-number v-model="baTable.form.items!.LSJ" type="number" :controls="false" :min="0" :precision="2" :step="0.1" placeholder="请输入"></el-input-number>
                                </el-form-item>
                            </el-col>  
                        </el-row>
                        <el-row>
                            <el-col :xs="24" :sm="7">
                                <el-form-item prop="CGXJ" label="采购限价">
                                    <el-input-number v-model="baTable.form.items!.CGXJ" type="number" :controls="false" :min="0" :precision="2" :step="0.1" placeholder="请输入"></el-input-number>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                    <!-- <div style="font-weight: bold;color: #000;margin-top: 15px;">其他信息</div>
                    <div style="border: 1px solid #dcdfe6;padding: 10px 0px">
                        <el-row>
                            <el-col :xs="24" :sm="8">
                                <FormItem
                        prop="SFCLY"
                        label="是否拆零用"
                        v-model="baTable.form.items!.SFCLY"
                        type="radio"
                        :data="{
                            content: { '0': '否', '1': '是' },
                            childrenAttr: { border: true },
                        }"
                    />
                            </el-col>
                            <el-col :xs="24" :sm="8">
                                <FormItem
                        prop="SFCLM"
                        label="是否拆零卖"
                        v-model="baTable.form.items!.SFCLM"
                        type="radio"
                        :data="{
                            content: { '0': '否', '1': '是' },
                            childrenAttr: { border: true },
                        }"
                    />
                            </el-col>
                            <el-col :xs="24" :sm="8">
                                <el-form-item prop="GJMC" label="国家名称">
                                    <el-input v-model="baTable.form.items!.GJMC" type="string" placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :xs="24" :sm="8">
                                <el-form-item prop="GJBM" label="国家编码">
                                    <el-input v-model="baTable.form.items!.GJBM" type="string" placeholder="请输入"></el-input>
                                </el-form-item> 
                            </el-col>
                        </el-row>
                    </div> -->
                </div>
                <div style="height: 20px;"></div>
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
import { ElMessage } from 'element-plus'
import { buildValidatorData } from '/@/utils/validate'
import { getPymWbm, getCjxxlist } from '/@/api/common'
import SelectExt from '/@/components/select-ext/index.vue'

const formRef = ref<FormInstance>()
const baTable = inject('baTable') as baTableClass
const prop = defineProps(['zdData', 'bxlbArr', 'lb', 'flbm', 'xmbm', 'xmmc', 'jxmc'])

const state: {
    cdArr: any //产地
    glbmArr: any
    baglbmArr: any
    fylxArr: any
    jldwArr: any
    jbdwArr: any
    zjfsArr: any //制剂方式
    jkfsArr: any //进口方式
    cgsxArr: any //采购属性
    yhfsArr: any //养护方式
} = reactive({
    cdArr: [],
    glbmArr: [],
    baglbmArr: [],
    fylxArr: [],
    jldwArr: [],
    jbdwArr: [],
    zjfsArr: [],
    jkfsArr: [],
    cgsxArr: [],
    yhfsArr: []
})

const zxsjValue = ref('') //中选时间

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    SPM: [buildValidatorData({ name: 'required', message: '商品名不能为空.' })],
    FWDX: [buildValidatorData({ name: 'required', message: '服务对象不能为空.' })],
    CD: [buildValidatorData({ name: 'required', message: '产地不能为空.' })],
    PZWH: [buildValidatorData({ name: 'required', message: '批准文号不能为空.' })],
    JL: [buildValidatorData({ name: 'required', message: '剂量不能为空.' })],
    JBDW: [buildValidatorData({ name: 'required', message: '基本单位不能为空.' })],
    MZDW: [buildValidatorData({ name: 'required', message: '门诊单位不能为空.' })],
    ZYDW: [buildValidatorData({ name: 'required', message: '住院单位不能为空.' })],
    YKDW: [buildValidatorData({ name: 'required', message: '药库单位不能为空.' })],
    FYLX: [buildValidatorData({ name: 'required', message: '发药类型不能为空.' })],
    GLBM: [buildValidatorData({ name: 'required', message: '发票归类不能为空.' })],
    BAGLBM: [buildValidatorData({ name: 'required', message: '病案归类不能为空.' })]
})

watch(
    () => baTable.form.operate,
    () => {
        state.jldwArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_009013')
        state.jbdwArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_009012')
        state.fylxArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_100005')
        state.glbmArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_009001')
        state.baglbmArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_009001_01')
        state.zjfsArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_009032')
        state.jkfsArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_009033')
        state.cgsxArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_CGSX001')
        state.yhfsArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_YHFS')
        baTable.form.items!.LB = prop.lb
        if(baTable.form.operate == 'Edit') {
            if(baTable.form.items!.ZXYP === 1 && baTable.form.items!.ZXKSSJ && baTable.form.items!.ZXJSSJ) {
                let zxsj: any = [baTable.form.items!.ZXKSSJ, baTable.form.items!.ZXJSSJ]
                zxsjValue.value = zxsj
            } else {
                zxsjValue.value = ''
            }
        }
    }
)

const mChange = (value: string) => {
    getPymWbm({ agrs: value }).then((res) => {
        baTable.form.items!.PYM = res.data.PYM
        baTable.form.items!.WBM = res.data.WBM
    })
}

const glbmChange = (value: any) => {
    if(value) {
        baTable.form.items!.GLMC = state.glbmArr.find((ele: any) => ele.BM == value).MC
    } else {
        baTable.form.items!.GLMC = ''
    }
}

const yblbChange = (value: any) => {
    if(value) {
        baTable.form.items!.YBLBMC = prop.bxlbArr.find((ele: any) => ele.BM == value).MC
    } else {
        baTable.form.items!.YBLBMC = ''
    }
}

const gslbChange = (value: any) => {
    if(value) {
        baTable.form.items!.GSLBMC = prop.bxlbArr.find((ele: any) => ele.BM == value).MC
    } else {
        baTable.form.items!.GSLBMC = ''
    }
}

const jclChange = (value: any) => {
    console.log('jcl',value)
    if(value > 1) {
        ElMessage({
            message: '您输入的加成率大于1，请核对.',
            type: 'warning',
        })
    }
}

/**
 * 产地选择
 * @param row 
 */
const cdSelectChange = (row: any) => {
    baTable.form.items!.CD = row.MC
}

/**
 * 产地清空
 */
const cdSelectClear = () => {
    baTable.form.items!.CD = ''
}

/**
 * 中选药品未选中时，清空中选时间
 * @param value 
 */
const zxypChange = (value: any) => {
    if(value !== 1) {
        zxsjValue.value = ''
    }
}

getCjxxlist({agrs:{DLBM:'2',yxzt:'1'}}).then((res)=>{
    state.cdArr = res.data.options
})

const fwdxOptions = [
    { value: 0, label: '无' },
    { value: 1, label: '门诊' },
    { value: 2, label: '住院' },
    { value: 3, label: '门诊和住院' },
]

const submitForm = async (formEl: FormInstance | undefined) => {
    // 借鉴的成员
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            let opt = baTable.form.operate === 'Add' ? '新增' : '修改'
            baTable.form.items!.FLBM = prop.flbm
            baTable.form.items!.LB = prop.lb
            baTable.form.items!.YZXMBM = prop.xmbm
            baTable.form.items!.YPMC = prop.xmmc
            if(Array.isArray(zxsjValue.value) && zxsjValue.value.length > 0 && baTable.form.items!.ZXYP == 1) {
                baTable.form.items!.ZXKSSJ = zxsjValue.value[0]
                baTable.form.items!.ZXJSSJ = zxsjValue.value[1]
            } else {
                baTable.form.items!.ZXKSSJ = null
                baTable.form.items!.ZXJSSJ = null
            }
            let data = {
                agrs: {
                    baoCunLX: opt,
                    mode: baTable.form.items
                }
            }
            //console.log(data)
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
.el-form--inline .el-form-item{
    margin-bottom: 6px;
}
.ba-operate-form .el-row{

    .el-col:nth-child(1){
        :deep(.el-input){
            width: 170px;
        }
        :deep(.el-input-number) {
            width: 170px;
            .el-input__inner {
                text-align: left;
            }
        }
        .cd-select{
            display: inline-block;
            :deep(.el-input){
                width: 507px;
            }
        }
        :deep(.el-form-item__label){
            width: 90px !important;
        }
    }
    .el-col:nth-child(2){
        :deep(.el-input){
            width: 230px;
        }
        :deep(.el-input-number) {
            width: 230px;
            .el-input__inner {
                text-align: left;
            }
        }
        .dw-select{
            display: inline-block;
            :deep(.el-input){
                width: 100px;
            }
        }
    }
    .el-col:nth-child(3){
        :deep(.el-input){
            width: 230px;
        }
        :deep(.el-input-number) {
            width: 230px;
            .el-input__inner {
                text-align: left;
            }
        }
        .dw-select{
            display: inline-block;
            :deep(.el-input){
                width: 100px;
            }
        }
    }
    .single-chk{
        border: 1px solid #dcdfe6;
        margin: 0px 0px 0px 30px;
        width: 566px;
        padding: 5px 35px 5px 35px;
    }
    .el-checkbox{
        color: #000;
    }
    .el-checkbox.chk-attr{
        width: 130px;
    }
    .dwbz {
        display: inline-block;
        padding-left: 3px;
        white-space:nowrap;
        overflow: hidden;
        text-overflow:ellipsis;
        width: 130px;
    }
}

:deep(.el-radio){
    margin-right: 5px;
}
:deep(.el-form-item__error){
    display: none;
}

.ba-input-item-radio :deep(.el-form-item__content) {
    width: 150px;
}
</style>
