<template>
    <div class="layout-box">
        <div class="form-top">
            <el-scrollbar>
                <el-form :model="formData" :inline="true" label-width="100px" :rules="rules" ref="ruleFormRef">
                    <el-form-item prop="KDRQ" label="开单日期">
                        <el-date-picker
                            v-model="formData.KDRQ"
                            type="datetime"
                            :disabled="examineTime != undefined"
                            placeholder="请选择开单日期"
                            style="width: 100%"
                        />
                    </el-form-item>
                    <el-form-item prop="SHRQ" label="审核日期">
                        <el-date-picker v-model="examineTime" type="datetime" :disabled="true" placeholder="请选择审核日期" style="width: 100%" />
                    </el-form-item>
                    <el-form-item label="单据号">
                        <el-input v-model="formData.DJH" type="string" :disabled="true" placeholder="请输入单据号" />
                    </el-form-item>
                    <el-form-item prop="CGRBM" label="采购员">
                        <el-select
                            v-model="formData.CGRBM"
                            placeholder="请选择采购员"
                            :disabled="examineTime != undefined"
                            filterable
                            style="width: 100%"
                            class="CGY"
                            @keyup.enter="handleKeyDown5($event, 'CGYBM')"
                        >
                            <el-option v-for="opt in personnelIfon" :key="opt.RYBM" :label="opt.RYXM" :value="opt.RYBM"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="CGYBM" label="仓管员">
                        <el-select
                            v-model="formData.CGYBM"
                            :disabled="examineTime != undefined"
                            placeholder="请选择仓管员"
                            filterable
                            style="width: 100%"
                            class="CGYBM"
                            @keyup.enter="handleKeyDown5($event, 'GYS')"
                        >
                            <el-option v-for="opt in personnelIfon" :key="opt.RYBM" :label="opt.RYXM" :value="opt.RYBM"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="供应商" prop="GYSBM">
                        <el-select
                            filterable
                            v-model="formData.GYSBM"
                            :disabled="examineTime != undefined"
                            placeholder="请选择供应商"
                            style="width: 100%"
                            class="GYS"
                            @keyup.enter="handleKeyDown5($event, 'GYSLXR')"
                        >
                            <el-option v-for="opt in gysData" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="GYSLXR" label="供应商联系人">
                        <el-input
                            v-model="formData.GYSLXR"
                            type="string"
                            :disabled="examineTime != undefined"
                            placeholder="请输入供应商联系人"
                            class="GYSLXR"
                            @keydown.enter="handleKeyDown5($event, 'FPHM')"
                        />
                    </el-form-item>
                    <el-form-item prop="FPHM" label="发票号">
                        <el-input
                            v-model="formData.FPHM"
                            type="string"
                            :disabled="examineTime != undefined"
                            placeholder="请输入发票号"
                            class="FPHM"
                            @keydown.enter="handleKeyDown5($event, 'specs_frame')"
                        />
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input
                            v-model="formData.BZ"
                            type="string"
                            :disabled="examineTime != undefined"
                            placeholder="请输入备注信息"
                            class="specs_frame"
                            @keydown.enter="handleKeyDown4($event, 'YPMC')"
                        />
                    </el-form-item>
                </el-form>
            </el-scrollbar>
        </div>
        <div class="yd-card-body">
            <el-form :model="state" :rules="rules" ref="ruleFormRef2">
                <el-table
                    ref="tableref"
                    :data="state.ykData"
                    class="color-table"
                    :header-cell-style="{ borderColor: '#e0e0e0' }"
                    :cell-style="{ borderColor: '#e0e0e0' }"
                    height="calc(100vh - 300px)"
                >
                    <el-table-column prop="PXH" label="行号" align="center" :width="65" class-name="custom-header">
                        <template #default="{ row }">
                            <span>{{ row.PXH }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="药品" align="center" width="150">
                        <el-table-column prop="YPBM" label="编码" align="center" width="120">
                            <template #default="{ row }">
                                <span>{{ row.YPBM }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="YPMC" label="品名" align="center" width="170">
                            <template #default="scope">
                                <SelectTable
                                    :disabled="examineTime != undefined"
                                    :agrs="scope.row"
                                    :data="ypInfo"
                                    :max-height="270"
                                    :tableWidth="800"
                                    :defaultSelectVal="scope.row.YPBM"
                                    :isShowQuery="false"
                                    :columns="[
                                        { label: '编码', prop: 'YPBM', width: '130' },
                                        { label: '品名', prop: 'YPMC', width: '150' },
                                        { label: '包装', prop: 'YKBZ', width: '60' },
                                        { label: '规格', prop: 'GG', width: '150' },
                                        { label: '单位', prop: 'YKDW', width: '60' },
                                        { label: '规格库存', prop: 'GGKC', width: '85' },
                                        { label: '上次零售价', prop: 'SCLSJ', width: '95' },
                                        { label: '上次进货价', prop: 'SCJHJ', width: '95' },
                                        { label: '产地', prop: 'CD', width: '200' },
                                        { label: '批准文号', prop: 'PZWH', width: '150' },
                                    ]"
                                    :keywords="{ label: 'YPMC', value: 'YPBM' }"
                                    :isShowFirstColumn="false"
                                    :isShowPagination="false"
                                    :isKeyup="true"
                                    filterable
                                    class="YPMC"
                                    @radioChange="singleSelectChange"
                                    @blur="handleKeyDown2(scope, 'yk-CPPH')"
                                />
                            </template>
                        </el-table-column>
                        <el-table-column prop="GG" label="规格" align="center" width="150">
                            <template #default="{ row }">
                                <span>{{ row.GG }}</span>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column prop="DWBZ" label="包装" align="center" width="70">
                        <template #default="{ row }">
                            <span>{{ row.DWBZ }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="CPPH" label="产品批号" align="center" width="150">
                        <template #default="scope">
                            <el-form-item style="height: 15px" :prop="'ykData.' + scope.$index + '.CPPH'" :rules="rules1.CPPH">
                                <el-input
                                    v-model="scope.row.CPPH"
                                    type="string"
                                    :disabled="!scope.row.isEdit || examineTime != undefined"
                                    style="width: 100%"
                                    class="yk-CPPH"
                                    @keydown.enter="cpphhandleKeyDown($event, scope, 'yk-SL', 'yk-CPPH')"
                                ></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="SL" label="数量" align="center" width="80">
                        <template #default="scope">
                            <el-form-item style="height: 15px" :prop="'ykData.' + scope.$index + '.SL'" :rules="rules1.SL">
                                <el-input
                                    v-model.number="scope.row.SL"
                                    style="width: 100%"
                                    :disabled="!scope.row.isEdit || examineTime != undefined"
                                    oninput="value=value.replace(/[^\d]/g,'')"
                                    @change="slhandleChange(scope.row)"
                                    class="yk-SL"
                                    @keydown.enter="slhandleKeyDown($event, scope, 'yk-JHJ', 'yk-SL')"
                                ></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="DW" label="单位" align="center" width="60">
                        <template #default="{ row }">
                            <span>{{ row.DW }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="jinjia" label="进价" align="center" width="150">
                        <el-table-column prop="JHJ" label="进货价" align="center" width="90">
                            <template #default="scope">
                                <el-form-item style="height: 15px" :prop="'ykData.' + scope.$index + '.JHJ'" :rules="rules1.JHJ">
                                    <el-input
                                        v-model.number="scope.row.JHJ"
                                        style="width: 100%"
                                        :disabled="!scope.row.isEdit || examineTime != undefined"
                                        oninput="value=value.replace(/[^\d]/g,'')"
                                        @change="jhjhandleChange(scope.row)"
                                        class="yk-JHJ"
                                        @keydown.enter="jhjhandleKeyDown($event, scope, 'yk-ZKL', 'yk-JHJ')"
                                    ></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="JHJE" label="进货金额" align="center" width="80">
                            <template #default="{ row }">
                                <span>{{ row.JHJE }}</span>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column prop="ZKL" label="加成率" align="center" width="90">
                        <template #default="scope">
                            <el-form-item style="height: 15px" :prop="'ykData.' + scope.$index + '.ZKL'" :rules="rules1.ZKL">
                                <el-input
                                    v-model.number="scope.row.ZKL"
                                    style="width: 100%"
                                    :disabled="!scope.row.isEdit || examineTime != undefined"
                                    oninput="value=value.replace(/[^\d]/g,'')"
                                    @change="jclhandleChange(scope.row)"
                                    class="yk-ZKL"
                                    @keydown.enter="zklhandleKeyDown($event, scope, 'yk-LSJ', 'yk-ZKL')"
                                ></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="零售价" align="center" width="150">
                        <el-table-column prop="LSJ" label="零售价" align="center" width="90">
                            <template #default="scope">
                                <el-form-item style="height: 15px" :prop="'ykData.' + scope.$index + '.LSJ'" :rules="rules1.LSJ">
                                    <el-input
                                        v-model.number="scope.row.LSJ"
                                        style="width: 100%"
                                        :disabled="!scope.row.isEdit || examineTime != undefined"
                                        oninput="value=value.replace(/[^\d]/g,'')"
                                        @change="lsjhandleChange(scope.row)"
                                        class="yk-LSJ"
                                        @keydown.enter="lsjhandleKeyDown($event, scope, 'SCRQ', 'yk-LSJ')"
                                    ></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="LSJE" label="零售金额" align="center" width="100">
                            <template #default="{ row }">
                                <span>{{ row.LSJE }}</span>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column prop="CD" label="产地" align="center" width="200">
                        <template #default="{ row }">
                            <span>{{ row.CD }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="SCRQ" label="生产日期" align="center" width="150">
                        <template #default="scope">
                            <el-form-item style="height: 15px" :prop="'ykData.' + scope.$index + '.SCRQ'" :rules="rules.SCRQ">
                                <el-date-picker
                                    v-model="scope.row.SCRQ"
                                    :disabled="!scope.row.isEdit || examineTime != undefined"
                                    type="date"
                                    style="width: 100%"
                                    class="SCRQ"
                                    @change="updateYXQ(scope)"
                                    @keydown.enter="scrqhandleKeyDown($event, scope, 'YXQ', 'SCRQ')"
                                />
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="YXQ" label="有效期" align="center" width="150">
                        <template #default="scope">
                            <el-form-item style="height: 15px" :prop="'ykData.' + scope.$index + '.YXQ'" :rules="rules.YXQ">
                                <el-date-picker
                                    v-model="scope.row.YXQ"
                                    :disabled="!scope.row.isEdit || examineTime != undefined"
                                    type="date"
                                    style="width: 100%"
                                    prefix-icon=""
                                    clear-icon=""
                                    class="YXQ"
                                    @keydown.enter="yxqhandleKeyDown($event, scope, 'HWBM', 'YXQ')"
                                />
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="规格库存" align="center" width="90">
                        <template #default="{ row }">
                            <span>{{ row.GGKC }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="address" label="批号库存" align="center" width="90">
                        <template #default="{ row }">
                            <span>{{ row.PHKC }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="PZWH" label="批准文号" align="center" width="150">
                        <template #default="{ row }">
                            <span>{{ row.PZWH }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="货位" align="center" width="130">
                        <template #default="scope">
                            <el-cascader
                                ref="hwref"
                                style="width: 100%"
                                :disabled="!scope.row.isEdit || examineTime != undefined"
                                v-model="scope.row.HWBM"
                                :props="defaultProps"
                                :options="groupOptions"
                                :show-all-levels="false"
                                filterable
                                placeholder="请选择"
                                class="HWBM"
                                @change="handleChange(scope, 'CGFS')"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="采购类型" align="center" width="120">
                        <template #default="scope">
                            <el-form-item style="height: 15px" :prop="'ykData.' + scope.$index + '.CGFS'" :rules="rules1.CGFS">
                                <el-select
                                    v-model="scope.row.CGFS"
                                    :disabled="!scope.row.isEdit || examineTime != undefined"
                                    clearable
                                    style="width: 100%"
                                    placeholder=""
                                    class="CGFS"
                                    @keyup.enter="cgfshandleKeyDown($event, scope, 'BZQK', 'CGFS')"
                                >
                                    <el-option v-for="opt in cgfsOptions" :key="opt.value" :label="opt.label" :value="opt.value"> </el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="包装情况" align="center" width="120">
                        <template #default="scope">
                            <el-form-item style="height: 15px" :prop="'ykData.' + scope.$index + '.BZQK'" :rules="rules1.BZQK">
                                <el-select
                                    v-model="scope.row.BZQK"
                                    :disabled="!scope.row.isEdit || examineTime != undefined"
                                    clearable
                                    style="width: 100%"
                                    placeholder=""
                                    class="BZQK"
                                    @keyup.enter="bzqkhandleKeyDown($event, scope, 'ZLQK', 'BZQK')"
                                >
                                    <el-option v-for="opt in bzqkOptions" :key="opt.value" :label="opt.label" :value="opt.value"> </el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="质量情况" align="center" width="100">
                        <template #default="scope">
                            <el-form-item style="height: 15px" :prop="'ykData.' + scope.$index + '.ZLQK'" :rules="rules1.ZLQK">
                                <el-select
                                    v-model="scope.row.ZLQK"
                                    :disabled="!scope.row.isEdit || examineTime != undefined"
                                    clearable
                                    style="width: 100%"
                                    placeholder=""
                                    class="ZLQK"
                                    @keyup.enter="zlqkhandleKeyDown($event, scope, 'CLQK', 'ZLQK')"
                                >
                                    <el-option v-for="opt in zlqkOptions" :key="opt.value" :label="opt.label" :value="opt.value"> </el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="处理情况" align="center" width="100">
                        <template #default="scope">
                            <el-form-item style="height: 15px" :prop="'ykData.' + scope.$index + '.CLQK'" :rules="rules1.CLQK">
                                <el-select
                                    v-model="scope.row.CLQK"
                                    :disabled="!scope.row.isEdit || examineTime != undefined"
                                    clearable
                                    style="width: 100%"
                                    placeholder=""
                                    class="CLQK"
                                    @keyup.enter="clqkhandleKeyDown($event, scope, 'YSJG', 'CLQK')"
                                >
                                    <el-option v-for="opt in clqkOptions" :key="opt.value" :label="opt.label" :value="opt.value"> </el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="验收结果" align="center" width="100">
                        <template #default="scope">
                            <el-form-item style="height: 15px" :prop="'ykData.' + scope.$index + '.YSJG'" :rules="rules1.YSJG">
                                <el-select
                                    v-model="scope.row.YSJG"
                                    :disabled="!scope.row.isEdit || examineTime != undefined"
                                    clearable
                                    style="width: 100%"
                                    placeholder=""
                                    class="YSJG"
                                    @keyup.enter="ysjghandleKeyDown($event, scope, 'CYTJ', 'YSJG')"
                                >
                                    <el-option v-for="opt in ysjgOptions" :key="opt.value" :label="opt.label" :value="opt.value"> </el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="CYTJ" label="储运条件" align="center" width="150">
                        <template #default="scope">
                            <el-form-item style="height: 15px" :prop="'ykData.' + scope.$index + '.CYTJ'" :rules="rules1.CYTJ">
                                <el-input
                                    v-model="scope.row.CYTJ"
                                    type="string"
                                    :disabled="!scope.row.isEdit || examineTime != undefined"
                                    class="CYTJ"
                                    @keyup.enter="cytjhandleKeyDown($event, scope, 'BZ', 'CYTJ')"
                                ></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="TMH" label="条码号" align="center" width="150">
                        <template #default="{ row }">
                            <span>{{ row.TMH }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="SCJHJ" label="上次进货价" align="center" width="100">
                        <template #default="{ row }">
                            <span>{{ row.SCJHJ }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="本次与上次进货价差额" align="center" width="160">
                        <template #default="{ row }">
                            <span>{{ row.JHJCE }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="国家医保编码" align="center" width="150">
                        <template #default="{ row }">
                            <span>{{ row.GJBM }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="国家医保名称" align="center" width="150">
                        <template #default="{ row }">
                            <span>{{ row.GJMC }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="BZ" label="备注" align="center" width="150">
                        <template #default="scope">
                            <el-input
                                v-model="scope.row.BZ"
                                type="string"
                                :disabled="!scope.row.isEdit || examineTime != undefined"
                                style="width: 100%"
                                class="BZ"
                                @keydown.enter="handleKeyDown1($event, scope, 'YPMC')"
                            ></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="操作" width="150" fixed="right" align="center">
                        <template #default="scope">
                            <div style="display: flex; justify-content: space-around">
                                <el-button link v-blur type="primary" size="small" :disabled="examineTime != undefined" round @click="addYk">
                                    新增
                                </el-button>
                                <el-button link v-blur type="primary" size="small" :disabled="examineTime != undefined" @click="editYk(scope.row)">
                                    {{ scope.row.editTxt }}
                                </el-button>
                                <el-popconfirm title="您确定删除这条记录吗?" @confirm="deleteYk(scope.$index)">
                                    <template #reference>
                                        <el-button
                                            link
                                            v-blur
                                            type="primary"
                                            :disabled="examineTime != undefined"
                                            v-if="state.ykData.length !== 1"
                                            size="small"
                                            >删除</el-button
                                        >
                                    </template>
                                </el-popconfirm>
                            </div>
                        </template>
                    </el-table-column>
                    <template #empty>
                        <el-empty description="暂无数据" />
                    </template>
                </el-table>
            </el-form>
        </div>
        <el-form :model="formData" :inline="true" label-width="90px" ref="ruleFormRefs" :rules="rules" class="bottom-form">
            <el-form-item label="单据类型" prop="DJLX">
                <el-select v-model="formData.DJLX" placeholder="请选择单据类型" clearable style="width: 100%" :disabled="examineTime != undefined">
                    <el-option v-for="opt in djlxOptions" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="随货单据号">
                <el-input v-model="formData.SHDH" type="string" placeholder="请输入随货单据号" :disabled="examineTime != undefined" />
            </el-form-item>
            <el-form-item label="交易类型" prop="JYLX">
                <el-select v-model="formData.JYLX" placeholder="请选择交易类型" clearable style="width: 100%" :disabled="examineTime != undefined">
                    <el-option v-for="opt in jylxOptions" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开单人" prop="KDRBM">
                <el-select v-model="formData.KDRBM" placeholder="请选择开单人" clearable style="width: 100%" :disabled="examineTime != undefined">
                    <el-option v-for="opt in personnelIfon" :key="opt.RYBM" :label="opt.RYXM" :value="opt.RYBM"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="审核人">
                <el-select v-model="examinePeople" placeholder="" :disabled="true" clearable style="width: 100%">
                    <el-option v-for="opt in personnelIfon" :key="opt.RYBM" :label="opt.RYXM" :value="opt.RYBM"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="yd-from-footer btn-box">
            <el-button style="margin-right: 30px; padding: 0 35px" type="primary" @click="onSubmit" :disabled="examineTime != undefined"
                >保存</el-button
            >
            <el-button style="margin-right: 30px; padding: 0 35px" @click="examine" type="primary" :disabled="examineTime != undefined"
                >发送审核</el-button
            >
            <el-button style="margin-right: 30px; padding: 0 35px" type="primary">打印</el-button>
            <el-button plain style="padding: 0 35px" @click="canleBtn">取消</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import SelectTable from '/@/components/select-table/selectTable.vue'
import { getrylist, getxtTime, getYpInfo, getgyslist } from '/@/api/common'
import { ElMessage, ElMessageBox } from 'element-plus'
import { validateForm } from '/@/utils/common'
import { ykJhdEdit, ykJhdCreate, getJhdInfo, getJhdList, dyDhdDetail } from '/@/api/backend/yk/jhd'
import { cxhwzd } from '/@/api/backend/jcgl/hwgl'
import { useAdminInfo } from '/@/stores/adminInfo'
import { useRouter, useRoute } from 'vue-router'
import useCurrentInstance from '/@/utils/useCurrentInstance'
import { useNavTabs } from '/@/stores/navTabs'

defineOptions({
    name: 'ykzx/jhd/edit',
})

const { proxy } = useCurrentInstance()
const navTabs = useNavTabs()
const router = useRouter()
const route = useRoute()
const ruleFormRef = ref()
const ruleFormRefs = ref()
const personnelIfon = ref([])
const ypInfo = ref([])
const ruleFormRef2 = ref()
const adminInfo = useAdminInfo()
const gysData = ref([])
const DHDJH = ref()
let cKFBM = route.query.cKFBM
let ID = route.query.ID
let receiptType = route.query.type

const formData = reactive({
    GYSBM: '',
    CGRBM: '',
    CGYBM: '',
    KDRQ: '',
    BZ: '',
    JYLX: 0,
    DJLX: 0,
    GYSLXR: '',
    FPHM: '',
    SHRQ: '',
    KDRXM: '',
    KDRBM: '',
    SHDH: '',
    DJH: '',
})

const state: {
    ykData: any
} = reactive({
    ykData: [
        {
            PXH: 1,
            YPBM: '',
            YPMC: '',
            GG: '',
            DW: '',
            DWBZ: '',
            CPPH: '',
            SL: '',
            ZKL: '',
            JHJ: '',
            JHJE: '',
            HWBM: '',
            LSJ: '',
            LSJE: '',
            SCRQ: '',
            YXQ: '',
            CD: '',
            PZWH: '',
            CGFS: [],
            BZQK: 0,
            ZLQK: 0,
            CLQK: 0,
            YSJG: 0,
            TMH: '',

            SCJHJ: '',
            BZ: '',
            GJBM: '',
            JHJCE: '',
            GJMC: '',
            isEdit: true,
            editTxt: '确定',
        },
    ],
})

const slhandleChange = (row) => {
    row.JHJE = row.SL * row.JHJ
    row.LSJE = (row.LSJ * row.SL).toFixed(2)
}

const jhjhandleChange = (row) => {
    if (row.ZKL != 0 && row.ZKL) {
        row.LSJ = ((Number(row.ZKL) + 1) * row.JHJ).toFixed(2)
        row.LSJE = (row.LSJ * row.SL).toFixed(2)
    }
    row.JHJE = row.SL * row.JHJ
}

const lsjhandleChange = (row) => {
    row.LSJE = (row.LSJ * row.SL).toFixed(2)
}

const jclhandleChange = (row) => {
    if (row.ZKL == 0) {
    } else {
        row.LSJ = ((Number(row.ZKL) + 1) * row.JHJ).toFixed(2)
        row.JHJE = row.SL * row.JHJ
        row.LSJE = (row.LSJ * row.SL).toFixed(2)
    }
}

const getCureentTime = async () => {
    const res = await getxtTime()
    formData.KDRQ = res.data
    formData.KDRBM = adminInfo.rybm
}

const groupOptions = ref([])
const defaultProps = {
    checkStrictly: true,
    emitPath: false,
    multiple: false,
    label: 'HWMC',
    value: 'HWBM',
}
const getYpInfos = () => {
    getYpInfo({ agrs: { KFBM: cKFBM, YWLX: '药品字典' } }).then((r: any) => {
        ypInfo.value = r.data
    })
    cxhwzd({ agrs: { KFBM: cKFBM, YWLX: 'Tree' } }).then((r) => {
        groupOptions.value = r.data
    })
    getgyslist({ agrs: { DLBM: '2' } }).then((r) => {
        gysData.value = r.data.options
    })
}
getYpInfos()
getCureentTime()

const validateCPPH = (rule: any, value: any, callback: any) => {
    if (value === '' || value === undefined) {
        console.log(value)

        callback(new Error(''))
    } else {
        callback()
    }
}

const validate = (rule: any, value: any, callback: any) => {
    if (value === '' || value === 0 || value === undefined) {
        callback(new Error(''))
    } else {
        callback()
    }
}

const rules = reactive({
    GYSBM: [{ required: true, message: '供应商不能为空', trigger: 'change' }],
    CGRBM: [{ required: true, message: '采购员不能为空', trigger: 'change' }],
    KDRQ: [{ required: true, message: '开单时间不能为空', trigger: 'blur' }],
    DJLX: [{ required: true, message: '单据类型不能为空', trigger: 'change' }],
    JYLX: [{ required: true, message: '交易类型不能为空', trigger: 'change' }],
    SCRQ: [{ required: true, message: '交易类型不能为空', trigger: 'change' }],
    YXQ: [{ required: true, message: '交易类型不能为空', trigger: 'change' }],
})

const rules1 = reactive({
    CPPH: [{ required: true, validator: validateCPPH, trigger: 'blur' }],
    SL: [{ required: true, validator: validate, trigger: 'blur' }],
    JHJ: [{ required: true, validator: validate, trigger: 'blur' }],
    ZKL: [{ required: true, validator: validate, trigger: 'blur' }],
    LSJ: [{ required: true, validator: validate, trigger: 'blur' }],
    CGFS: [{ required: true, validator: validate, trigger: 'blur' }],
    BZQK: [{ required: true, validator: validate, trigger: 'blur' }],
    ZLQK: [{ required: true, validator: validate, trigger: 'blur' }],
    CLQK: [{ required: true, validator: validate, trigger: 'blur' }],
    YSJG: [{ required: true, validator: validate, trigger: 'blur' }],
    CYTJ: [{ required: true, validator: validate, trigger: 'blur' }],
})

// 获取 el-table
const tableref = ref(null)
const cpphhandleKeyDown = (event: any, scope: any, nextClass: any, thisClass: any) => {
    if (event.keyCode === 13) {
        // 按下回车键聚焦到下一个输入框
        if (nextClass && scope.row.CPPH) {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${nextClass} .el-input__inner`)
            if (ele) {
                ele.focus()
            }
        } else {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${thisClass} .el-input__inner`)
            if (ele) {
                ele.blur()
                nextTick(() => {
                    ele.focus()
                })
            }
        }
    }
}
const slhandleKeyDown = (event: any, scope: any, nextClass: any, thisClass: any) => {
    if (event.keyCode === 13) {
        // 按下回车键聚焦到下一个输入框
        if (nextClass && scope.row.SL) {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${nextClass} .el-input__inner`)
            if (ele) {
                ele.focus()
            }
        } else {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${thisClass} .el-input__inner`)
            if (ele) {
                ele.blur()
                nextTick(() => {
                    ele.focus()
                })
            }
        }
    }
}
const jhjhandleKeyDown = (event: any, scope: any, nextClass: any, thisClass: any) => {
    if (event.keyCode === 13) {
        // 按下回车键聚焦到下一个输入框
        if (nextClass && scope.row.JHJ) {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${nextClass} .el-input__inner`)
            if (ele) {
                ele.focus()
            }
        } else {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${thisClass} .el-input__inner`)
            if (ele) {
                ele.blur()
                nextTick(() => {
                    ele.focus()
                })
            }
        }
    }
}
const zklhandleKeyDown = (event: any, scope: any, nextClass: any, thisClass: any) => {
    if (event.keyCode === 13) {
        // 按下回车键聚焦到下一个输入框
        if (nextClass && scope.row.ZKL) {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${nextClass} .el-input__inner`)
            if (ele) {
                ele.focus()
            }
        } else {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${thisClass} .el-input__inner`)
            if (ele) {
                ele.blur()
                nextTick(() => {
                    ele.focus()
                })
            }
        }
    }
}
const lsjhandleKeyDown = (event: any, scope: any, nextClass: any, thisClass: any) => {
    if (event.keyCode === 13) {
        // 按下回车键聚焦到下一个输入框
        if (nextClass && scope.row.LSJ) {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${nextClass} .el-input__inner`)
            if (ele) {
                ele.focus()
            }
        } else {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${thisClass} .el-input__inner`)
            if (ele) {
                ele.blur()
                nextTick(() => {
                    ele.focus()
                })
            }
        }
    }
}
const scrqhandleKeyDown = (event: any, scope: any, nextClass: any, thisClass: any) => {
    if (event.keyCode === 13) {
        // 按下回车键聚焦到下一个输入框
        if (nextClass && scope.row.SCRQ) {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${nextClass} .el-input__inner`)
            if (ele) {
                ele.focus()
            }
        } else {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${thisClass} .el-input__inner`)
            if (ele) {
                ele.blur()
                nextTick(() => {
                    ele.focus()
                })
            }
        }
    }
}
const yxqhandleKeyDown = (event: any, scope: any, nextClass: any, thisClass: any) => {
    if (event.keyCode === 13) {
        // 按下回车键聚焦到下一个输入框
        if (nextClass && scope.row.YXQ) {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${nextClass} .el-input__inner`)
            if (ele) {
                ele.focus()
            }
        } else {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${thisClass} .el-input__inner`)
            if (ele) {
                ele.blur()
                nextTick(() => {
                    ele.focus()
                })
            }
        }
    }
}
const cgfshandleKeyDown = (event: any, scope: any, nextClass: any, thisClass: any) => {
    if (event.keyCode === 13) {
        // 按下回车键聚焦到下一个输入框
        if (nextClass) {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${nextClass} .el-input__inner`)
            if (ele) {
                ele.focus()
            }
        } else {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${thisClass} .el-input__inner`)
            if (ele) {
                ele.blur()
                nextTick(() => {
                    ele.focus()
                })
            }
        }
    }
}
const bzqkhandleKeyDown = (event: any, scope: any, nextClass: any, thisClass: any) => {
    if (event.keyCode === 13) {
        // 按下回车键聚焦到下一个输入框
        if (nextClass) {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${nextClass} .el-input__inner`)
            if (ele) {
                ele.focus()
            }
        } else {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${thisClass} .el-input__inner`)
            if (ele) {
                ele.blur()
                nextTick(() => {
                    ele.focus()
                })
            }
        }
    }
}
const zlqkhandleKeyDown = (event: any, scope: any, nextClass: any, thisClass: any) => {
    if (event.keyCode === 13) {
        // 按下回车键聚焦到下一个输入框
        if (nextClass) {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${nextClass} .el-input__inner`)
            if (ele) {
                ele.focus()
            }
        } else {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${thisClass} .el-input__inner`)
            if (ele) {
                ele.blur()
                nextTick(() => {
                    ele.focus()
                })
            }
        }
    }
}
const clqkhandleKeyDown = (event: any, scope: any, nextClass: any, thisClass: any) => {
    if (event.keyCode === 13) {
        // 按下回车键聚焦到下一个输入框
        if (nextClass) {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${nextClass} .el-input__inner`)
            if (ele) {
                ele.focus()
            }
        } else {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${thisClass} .el-input__inner`)
            if (ele) {
                ele.blur()
                nextTick(() => {
                    ele.focus()
                })
            }
        }
    }
}
const ysjghandleKeyDown = (event: any, scope: any, nextClass: any, thisClass: any) => {
    if (event.keyCode === 13) {
        // 按下回车键聚焦到下一个输入框
        if (nextClass) {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${nextClass} .el-input__inner`)
            if (ele) {
                ele.focus()
            }
        } else {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${thisClass} .el-input__inner`)
            if (ele) {
                ele.blur()
                nextTick(() => {
                    ele.focus()
                })
            }
        }
    }
}
const cytjhandleKeyDown = (event: any, scope: any, nextClass: any, thisClass: any) => {
    if (event.keyCode === 13) {
        // 按下回车键聚焦到下一个输入框
        if (nextClass && scope.row.CYTJ) {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${nextClass} .el-input__inner`)
            if (ele) {
                ele.focus()
            }
        } else {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${thisClass} .el-input__inner`)
            if (ele) {
                ele.blur()
                nextTick(() => {
                    ele.focus()
                })
            }
        }
    }
}
const handleKeyDown1 = (event: any, scope: any, nextClass: any) => {
    if (event.keyCode === 13) {
        if (state.ykData.length - scope.$index === 1) {
            addYk()
        }
        nextTick(() => {
            const rowIndex = scope.$index + 1
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${nextClass} .el-input__inner`)
            if (ele) {
                ele.focus()
            }
        })
    }
}
const handleKeyDown2 = (scope: any, nextClass: any) => {
    if (nextClass && scope.row.YPMC) {
        const rowIndex = scope.$index
        let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${nextClass} .el-input__inner`)
        if (ele) {
            ele.focus()
        }
    }
}
const handleKeyDown3 = () => {
    let ele = ruleFormRef.value.$el.querySelector(`.CGY .el-input__inner`)
    if (ele) {
        ele.focus()
    }
}
const handleKeyDown4 = (event: any, nextClass: any) => {
    if (event.keyCode === 13) {
        let ele = tableref.value.$el.querySelector(`.${nextClass} .el-input__inner`)
        if (ele) {
            ele.focus()
        }
    }
}

const handleKeyDown5 = (event: any, nextClass: any) => {
    if (event.keyCode === 13) {
        let ele = ruleFormRef.value.$el.querySelector(`.${nextClass} .el-input__inner`)
        if (ele) {
            ele.focus()
        }
    }
}
const hwref = ref(null)
const handleChange = (scope, nextClass) => {
    if (nextClass) {
        const rowIndex = scope.$index
        hwref.value.togglePopperVisible()
        let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${nextClass} .el-input__inner`)
        if (ele) {
            ele.focus()
        }
    }
}

const updateYXQ = (scope) => {
    if ((scope.row.SCRQ && scope.row.YXQ == '') || scope.row.YXQ == null) {
        let scrq = new Date(scope.row.SCRQ)
        let yxq = new Date(scrq.getFullYear() + 3, scrq.getMonth(), scrq.getDate())
        scope.row.YXQ = yxq
    }
}

const singleSelectChange = (row: any, agrs: any) => {
    agrs.YPBM = row.YPBM
    agrs.YPMC = row.YPMC
    agrs.DWBZ = row.YKBZ
    agrs.GG = row.GG
    agrs.DW = row.YKDW
    agrs.CD = row.CD
    agrs.PZWH = row.PZWH
    agrs.GJMC = row.GJMC
    agrs.GLBM = row.GLBM
    agrs.SCJHJ = row.SCJHJ
    agrs.TMH = row.TXM
    agrs.GGKC = row.GGKC
    agrs.ZKL = row?.JCL
    agrs.HWBM = row.HWBM
    agrs.KCID = row.KCID
    agrs.JHJ = row.SCJHJ
    agrs.LSJ = row.SCLSJ
}

const addYk = () => {
    state.ykData.push({
        PXH: 1 + state.ykData.length,
        YPBM: '',
        YPMC: '',
        GG: '',
        DW: '',
        DWBZ: '',
        CPPH: '',
        HWBM: '',
        SL: '',
        ZKL: '',
        JHJ: '',
        JHJE: '',
        LSJ: '',
        LSJE: '',
        SCRQ: '',
        YXQ: '',
        JHJCE: '',
        CD: '',
        PZWH: '',
        CGFS: [],
        BZQK: 0,
        ZLQK: 0,
        CLQK: 0,
        YSJG: 0,
        TMH: '',
        SCJHJ: '',
        BZ: '',
        GJBM: '',
        GJMC: '',
        isEdit: true,
        editTxt: '确定',
    })
}

const editYk = (row: any) => {
    if (row.isEdit) {
        row.editTxt = '编辑'
    } else {
        row.editTxt = '确认'
    }
    row.isEdit = !row.isEdit
}

const deleteYk = (index: any) => {
    state.ykData.splice(index, 1)
}

const DJHs = ref()
const DJIDs = ref()
const IDs = ref()
const KFBMs = ref()

const updateData = async (r) => {
    DJHs.value = r.data.DJH
    DJIDs.value = r.data.DJID
    IDs.value = r.data.ID
    KFBMs.value = r.data.KFBM
    let data = {
        agrs: {
            DJID: r.data.DJID,
            KFBM: r.data.KFBM,
            DJH: r.data.DJH,
        },
    }
    let res = await getJhdInfo(data)
    state.ykData = res.data
    state.ykData.forEach((item) => {
        item.isEdit = true
        item.editTxt = '确认'
    })
    formData.DJH = r.data.DJH
}

const onSubmit = async () => {
    const formRefs = [ruleFormRef.value, ruleFormRefs.value]
    validateForm(formRefs).then(async (valid) => {
        if (valid.every((result) => result)) {
            const { ID, DJID, cKFBM } = route.query
            const validRows = state.ykData.filter((row) => row.YPMC !== '')

            // 检查空字段
            const emptyFields = []
            validRows.forEach((row, index) => {
                const emptyField = { rowIndex: index + 1, ypmc: row.YPMC, gg: row.GG, fields: [] }
                if (!row.YPMC) emptyField.fields.push('药品名称')
                if (!row.GG) emptyField.fields.push('规格')
                if (!row.SL) emptyField.fields.push('数量')
                if (!row.JHJ) emptyField.fields.push('进价')
                if (!row.LSJ) emptyField.fields.push('零售价')
                if (!row.SCRQ) emptyField.fields.push('生产日期')
                if (!row.YXQ) emptyField.fields.push('有效期')

                if (emptyField.fields.length > 0) {
                    emptyFields.push(emptyField)
                }
            })
            if (emptyFields.length > 0) {
                // 定位到第一条
                const firstEmptyField = emptyFields[0]
                const tableRef = tableref.value
                tableRef.setScrollTop(firstEmptyField.rowIndex * 43)

                // 提示
                const remainingEmptyFields = emptyFields.slice(1)
                if (remainingEmptyFields.length > 0) {
                    const sortedEmptyFields = remainingEmptyFields.sort((a, b) => a.rowIndex - b.rowIndex)
                    const messages = sortedEmptyFields
                        .map(({ rowIndex, ypmc, gg, fields }) => `第${rowIndex}行的${ypmc}${gg}的${fields.join('、')}未填写`)
                        .join('<br/><br/>')
                    ElMessage.warning({
                        message: `第${firstEmptyField.rowIndex}行的${firstEmptyField.ypmc}${firstEmptyField.gg}的${firstEmptyField.fields.join(
                            '、'
                        )}未填写<br/><br/>${messages}`,
                        dangerouslyUseHTMLString: true,
                        duration: 3000,
                    })
                } else {
                    const message = `第${firstEmptyField.rowIndex}行的${firstEmptyField.ypmc}${firstEmptyField.gg}的${firstEmptyField.fields.join(
                        '、'
                    )}未填写`
                    ElMessage.warning({
                        message,
                        dangerouslyUseHTMLString: true,
                        duration: 3000,
                    })
                }
            } else {
                console.log('输入完了')
                let data, r

                switch (receiptType) {
                    case 'edit':
                        data = {
                            agrs: {
                                ZB: { ...formData, ID: ID || IDs.value, DJID: DJID || DJIDs.value, KFBM: cKFBM || KFBMs.value },
                                MXB: validRows,
                                LX: '保存',
                            },
                        }
                        r = await ykJhdEdit(data)
                        ElMessage.success('修改成功')
                        break

                    case 'create':
                        data = {
                            agrs: {
                                ZB: { ...formData, KFBM: cKFBM },
                                MXB: validRows,
                            },
                        }
                        r = await ykJhdCreate(data)
                        ElMessage.success('新增成功')
                        if (r.code == 1 && r.msg == '保存成功') {
                            receiptType = 'edit'
                        }
                        break

                    case 'generate':
                    case 'allGenerate':
                        data = {
                            agrs: {
                                ZB: { ...formData, KFBM: cKFBM, DHDJH: DHDJH.value },
                                MXB: validRows,
                            },
                        }
                        r = await ykJhdCreate(data)
                        ElMessage.success('新增成功')
                        if (r.code == 1 && r.msg == '保存成功') {
                            receiptType = 'edit'
                        }
                        break
                }
                updateData(r)
            }
        }
    })
}

const examinePeople = ref()
const examineTime = ref()
const examine = async () => {
    const confirmMessage = `发送审核后，这条单据将不能使用，您确定要发送审核吗？`
    const confirmOptions = {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
    }

    const handleExamine = async (data) => {
        let flag = state.ykData.some((item) => !item.ID)
        if (flag) {
            ElMessage.error('新增数据必须先保存再审核')
            return
        }
        const { code, data: responseData } = await ykJhdEdit(data)
        if (code === 1) {
            examineTime.value = responseData.SHRQ
            examinePeople.value = responseData.SHRBM
            ElMessage.success('审核成功')
            let data1 = {
                agrs: {
                    DJID: route.query.DJID,
                    KFBM: route.query.KFBM,
                    DJH: route.query.DJH,
                },
            }
            let res = await getJhdInfo(data1)
            state.ykData = res.data
        }
    }

    const showConfirmDialog = (message, options) => {
        return new Promise((resolve, reject) => {
            ElMessageBox.confirm(message, '提示', options)
                .then(() => {
                    resolve()
                })
                .catch(() => {
                    reject()
                })
        })
    }

    if (ID) {
        const { DJID, cKFBM, DJH, ID } = route.query
        const data = {
            agrs: {
                ZB: { DJID, KFBM: cKFBM, DJH, ID },
                LX: '审核',
            },
        }
        try {
            await showConfirmDialog(confirmMessage, confirmOptions)
            await handleExamine(data)
        } catch (error) {}
    } else {
        const data = {
            agrs: {
                ZB: {
                    DJID: DJIDs.value,
                    KFBM: KFBMs.value,
                    DJH: DJHs.value,
                    ID: IDs.value,
                },
                LX: '审核',
            },
        }
        try {
            await showConfirmDialog(confirmMessage, confirmOptions)
            await handleExamine(data)
        } catch (error) {}
    }
}

// 单据类型
const djlxOptions = [
    { value: 0, label: '普通' },
    { value: 1, label: '采购计划生成' },
    { value: 2, label: '阳关采购平台对接' },
]
// 交易类型
const jylxOptions = [
    { value: 0, label: '手工输入' },
    { value: 1, label: '系统生成' },
    { value: 2, label: '外部导入' },
]
// 采购方式
const cgfsOptions = [
    { value: 0, label: '招标' },
    { value: 1, label: '议标' },
    { value: 2, label: '评标' },
    { value: 3, label: '实价' },
    { value: 4, label: '批价' },
    { value: 5, label: '自制' },
    { value: 6, label: '扣前' },
    { value: 7, label: '扣后' },
]

// 包装情况
const bzqkOptions = [
    { value: 0, label: '包装完好' },
    { value: 1, label: '包装破损' },
    { value: 2, label: '包装损坏' },
]
// 质量情况
const zlqkOptions = [
    { value: 0, label: '合格' },
    { value: 1, label: '不合格' },
]
// 处理情况
const clqkOptions = [
    { value: 0, label: '入库' },
    { value: 1, label: '退库' },
]

// 验收情况
const ysjgOptions = [
    { value: 0, label: '合格' },
    { value: 1, label: '不合格' },
]

// 转换
// function convertData(data) {
//     return data.map((item) => ({
//         label: item.HWMC,
//         value: item.HWBM,
//         children: item.children ? convertData(item.children) : null,
//     }))
// }

const toLastTab = () => {
    const lastTab = navTabs.state.tabsView.slice(-1)[0]
    if (lastTab) {
        lastTab.query.KFBM = cKFBM
        router.push(lastTab)
    } else {
        router.push('/admin')
    }
}

const canleBtn = () => {
    navTabs.closeTab(route)
    proxy.eventBus.emit('onTabViewClose', route)
    if (navTabs.state.activeRoute?.path === route.path) {
        toLastTab()
    } else {
        navTabs.setActiveRoute(navTabs.state.activeRoute!)
    }
}

const getlook = async () => {
    const res = await getJhdInfo({
        agrs: {
            DJID: route.query.DJID,
            cKFBM: route.query.cKFBM,
            DJH: route.query.DJH,
        },
    })
    const r = await getJhdList({
        agrs: {
            ID,
        },
    })
    state.ykData = res.data
    state.ykData.forEach((item) => {
        item.isEdit = true
        item.editTxt = '确认'
    })
    formData.KDRQ = r.data[0].KDRQ
    formData.DJH = r.data[0].DJH
    formData.GYSBM = r.data[0].GYSBM
    formData.GYSLXR = r.data[0].GYSLXR
    formData.CGRBM = r.data[0].CGRBM
    formData.CGYBM = r.data[0].CGYBM
    formData.SHDH = r.data[0].SHDH
    formData.BZ = r.data[0].BZ
    formData.DJLX = r.data[0].DJLX
    formData.JYLX = r.data[0].JYLX
    formData.KDRBM = r.data[0].KDRBM
    formData.FPHM = r.data[0].FPHM
    examineTime.value = r.data[0].SHRQ
    examinePeople.value = r.data[0].SHRBM
}
const receiptgenerate = async () => {
    let data = {
        agrs: {
            DJLX: '订货单',
            DJID: route.query.DJID,
            KFBM: route.query.cKFBM,
            DJH: route.query.DJH,
            YWLX: receiptType == 'generate' ? 1 : 2,
            ListID: receiptType == 'allGenerate' ? JSON.parse(route.query.ListID) : [],
        },
    }
    const res = await dyDhdDetail(data)

    if (res.code === 1) {
        if (res.data.data.length !== 0) {
            state.ykData = res.data.data
            DHDJH.value = res.data.DJH
            state.ykData.forEach((item) => {
                item.isEdit = true
                item.editTxt = '确认'
                item.BZQK = 0
                item.ZLQK = 0
                item.CLQK = 0
                item.YSJG = 0
            })
        }
    } else {
        ElMessage.error('操作失败，稍后再试')
    }
}

onMounted(() => {
    receiptType = route.query.type
    if (receiptType == 'create') {
        handleKeyDown3()
    }
    if (receiptType != 'create' && receiptType != 'generate' && receiptType != 'allGenerate') {
        getlook()
    } else if (receiptType == 'generate' || receiptType == 'allGenerate') {
        receiptgenerate()
    }
    // 获取人员信息
    getrylist({ agrs: {} }).then((r) => {
        personnelIfon.value = r.data.options
    })
})
</script>

<style lang="scss" scoped>
:deep(.el-table .cell) {
    padding: 0;
}

:deep(.el-form-item__error) {
    display: none;
}

:deep(.el-table thead) {
    color: #000;
}

:deep(.el-form--inline .el-form-item) {
    margin-right: 5px;
    margin-bottom: 5px;
}

.el-dialog__header :deep(.el-dialog__headerbtn) {
    size: 14px;
}

:deep(.el-table__header) {
    line-height: 40px;
}

.el-table :deep(.el-table__cell) {
    padding: 5px 5px;
    font-size: 14px;
}

.none-input :deep(.el-input__wrapper) {
    box-shadow: none;
    background: transparent;
}

.none-input :deep(.el-input__inner) {
    text-align: center;
}

:deep(.el-dialog) {
    margin-top: 80px;
}

.specs_frame :deep(.el-input__inner) {
    width: 525px;
}

.layout-box {
    height: calc(100vh - 100px);
    background-color: #fff;
    margin: 10px 6px;
    padding-top: 10px;

    .form-top {
        height: 80px;
        max-height: 80px;
        width: 100%;
        .el-form {
            min-width: 1300px;
        }
        .el-form-item :deep(.el-form-item__content) {
            width: 220px;
        }
    }

    .btn-box {
        margin-top: 10px;
    }

    .color-table {
        border: solid 1px #ebebeb;
    }

    .yd-card-body {
        padding: 5px 10px;
    }

    .bottom-form {
        margin-top: 6px;
        min-width: 1300px;
        :deep(.el-input) {
            width: 160px;
        }
    }
}

.yk-SL :deep(.el-input__inner) {
    text-align: center;
}

.yk-JHJ :deep(.el-input__inner) {
    text-align: center;
}

.yk-LSJ :deep(.el-input__inner) {
    text-align: center;
}

.yk-ZKL :deep(.el-input__inner) {
    text-align: center;
}
</style>
