<template>
    <div class="layout-box">
        <div class="search-box">
            <el-form :model="formData" :inline="true" label-width="auto" class="zw-table-search">
                <el-form-item label="库房" label-width="40">
                    <el-select v-model="formData.KFBM" placeholder="请选择库房" clearable @change="select" class="kf-select">
                        <el-option v-for="opt in ykData" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="单据状态">
                    <el-select v-model="formData.ZT" placeholder="请选择" clearable class="zt-select">
                        <el-option v-for="opt in djztData" :key="opt.value" :label="opt.MC" :value="opt.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="供应商" label-width="50">
                    <el-select v-model="formData.GYSBM" placeholder="请选择" clearable filterable class="gys-select">
                        <el-option v-for="opt in gysData" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开单时间">
                    <el-date-picker
                        class="kd-select"
                        v-model="formData.TIME"
                        type="daterange"
                        :teleported="false"
                        :editable="false"
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                        range-separator="—"
                        end-placeholder="结束时间"
                        start-placeholder="开始时间"
                    />
                </el-form-item>
                <el-form-item label="检索" label-width="40">
                    <el-input v-model="formData.keywords" type="string" placeholder="请输入文字(支持模糊搜索)"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getChdsList">查询</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 按钮部分 -->
        <div class="table-item-top">
            <el-dropdown>
                <span class="btn"> <Icon name="local-create" style="color: #4ca7f9" class="local-icon" />新增单据 </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="ckdCreate()">手工录入</el-dropdown-item>
                        <el-dropdown-item @click="ykjhdBtnType('qldOrder')">根据请领单生成</el-dropdown-item>
                        <el-dropdown-item @click="ykjhdBtnType('order')">根据进货单生成</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <div @click="printYkBtn()" :class="[currentradio ? 'btn' : 'current-btn']">
                <Icon name="local-print" :style="currentradio ? 'color:#4ca7f9' : 'color:bbbbbb'" class="local-icon" />
                <div>打印单据</div>
            </div>

            <div class="btn" @click="exportYkBtn()">
                <Icon name="local-export" style="color: #4ca7f9" class="local-icon" />
                <div>导出单据</div>
            </div>
        </div>
        <el-table
            id="exportTable"
            ref="tableref"
            :data="tableData"
            :header-row-class-name="'custom-header'"
            :row-class-name="setRowClassName"
            stripe
            style="width: 100%"
            height="calc(100vh - 245px)"
            class="ba-data-table w100"
            @row-click="handleRowClick"
            highlight-current-row
        >
            <el-table-column label="NO" type="index" width="50" />
            <el-table-column prop="ZT" label="状态" align="left" width="80">
                <template #default="{ row }">
                    <div v-if="row.ZT === 0" class="status-invalid">已作废</div>
                    <div v-else-if="row.ZT === 1" class="status-saved">暂存</div>
                    <div v-else class="status-approved">已审核</div>
                </template>
            </el-table-column>
            <el-table-column prop="DJH" label="单据号" align="center" width="100"> </el-table-column>
            <el-table-column prop="MDYF" label="目的药房" align="center" width="100"> </el-table-column>
            <el-table-column prop="QLR" label="请领人" align="center" width="80"> </el-table-column>
            <el-table-column prop="KDRQ" label="开单时间" align="center" width="160"> </el-table-column>
            <el-table-column prop="KDRXM" label="开单人" align="center" width="80"> </el-table-column>
            <el-table-column prop="FHRXM" label="发货人" align="center" width="80"> </el-table-column>
            <el-table-column prop="PZRXM" label="批准人" align="center" width="80"> </el-table-column>
            <el-table-column prop="CGRXM" label="仓管员" align="center" width="80"> </el-table-column>
            <el-table-column prop="DJLX" label="单据类型" align="center" width="140">
                <template #default="{ row }">
                    {{ row.DJLX == 0 ? '普通' : row.DJLX == 1 ? '采购计划生成' : '阳关采购平台对接' }}
                </template>
            </el-table-column>
            <el-table-column prop="JYLX" label="交易类型" align="center" width="120">
                <template #default="{ row }">
                    {{ row.JYLX == 0 ? '手工输入' : row.JYLX == 1 ? '系统生成' : '外部导入' }}
                </template>
            </el-table-column>
            <el-table-column prop="QLKS" label="请领科室" align="center" width="100"> </el-table-column>
            <el-table-column prop="QLDJH" label="请领单据号" align="center" width="120"> </el-table-column>
            <el-table-column prop="GJZE" label="购进总额" align="center" width="80"> </el-table-column>
            <el-table-column prop="LSZE" label="零售总额" align="center" width="80"> </el-table-column>
            <el-table-column prop="SHRXM" label="审核人" align="center" width="80"> </el-table-column>
            <el-table-column prop="SHRQ" label="审核时间" align="center" width="155"> </el-table-column>
            <el-table-column prop="JHDJH" label="进货单据号" align="center" width="140"> </el-table-column>
            <el-table-column prop="BZ" label="备注" align="center" width="150"> </el-table-column>
            <el-table-column fixed="right" label="操作" align="center" width="200">
                <template #default="{ row }">
                    <div class="table-item">
                        <div class="btn" @click="ckdLook(row)">
                            <Icon name="local-look" style="color: #4ca7f9" class="local-icon" />
                            <div>查看</div>
                        </div>
                        <div class="btn" v-if="row.ZT == 1" @click="ckdEdit(row)">
                            <Icon name="local-edit" style="color: #4ca7f9" class="local-icon" />
                            <div>编辑</div>
                        </div>
                        <div class="btn" v-if="row.ZT == 1" @click="cancelBtn(row)">
                            <Icon name="local-cancel" style="color: #4ca7f9" class="local-icon" />
                            <div>作废</div>
                        </div>
                    </div>
                </template>
            </el-table-column>

            <template #empty>
                <el-empty description="暂无数据" />
            </template>
        </el-table>
        <div class="pagination">
            <el-pagination
                v-model:current-page="formData.page"
                v-model:page-size="formData.size"
                :page-sizes="[20, 30, 50, 100]"
                :small="small"
                align="center"
                layout="total, sizes, prev, pager, next, jumper"
                :total="formData.count"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
        <!-- 引用进货单 -->
        <el-dialog
            v-model="jhddialogVisible"
            :title="djTableData == 'order' ? '调用进货单' : '调用请领单'"
            width="50%"
            class="ba-operate-dialog jhdyy-edit"
            draggable
            :close-on-click-modal="false"
        >
            <el-scrollbar class="ba-table-form-scrollbar">
                <div class="jhd-box">
                    <el-form :model="dialogformData" :inline="true" label-width="75px" :rules="rules" ref="ruleFormRef">
                        <el-form-item>
                            <el-date-picker
                                v-model="dialogformData.TIME"
                                type="daterange"
                                :teleported="false"
                                :editable="false"
                                format="YYYY-MM-DD "
                                value-format="YYYY-MM-DD"
                                range-separator="—"
                                end-placeholder="结束时间"
                                start-placeholder="开始时间"
                            />
                        </el-form-item>
                        <el-form-item>
                            <el-select v-model="dateOption" placeholder="请选择" size="large" @change="dataChange" class="date-select">
                                <el-option v-for="item in dateData" :key="item.value" :label="item.label" :value="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="dialogformData.keywords" placeholder="订单号/企业/联系人/采购员" class="kw-input" clearable>
                                <template #prefix>
                                    <Icon name="el-icon-Search" size="16" color="var(--el-input-icon-color)" />
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="getJhdsList">
                                <Icon name="local-create" style="color: rgb(241, 241, 241)" class="local-icons" />
                                查询
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div v-if="djTableData == 'order'">
                    <el-table
                        ref="tableref"
                        :data="jhdtableData"
                        :header-row-class-name="'custom-header'"
                        stripe
                        style="width: 100%"
                        height="510"
                        class="ba-data-table w100"
                        @row-click="jhdhandleRowClick"
                        highlight-current-row
                    >
                        <el-table-column prop="XMBM" label="选择" width="70" align="center">
                            <template #default="scope">
                                <el-radio v-model="jhdRadio" :label="scope.row.ID">&nbsp;</el-radio>
                            </template>
                        </el-table-column>
                        <el-table-column prop="KDRQ" label="开单日期" align="center" width="160"> </el-table-column>
                        <el-table-column prop="DJH" label="单据号" align="center" width="100">
                            <template #default="scope">
                                <span :style="{ color: scope.row.ID === jhdRadio ? 'red' : '' }">{{ scope.row.DJH }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="GYSMC" label="供应商" align="center" width="200">
                            <template #default="scope">
                                <span :style="{ color: scope.row.ID === jhdRadio ? 'red' : '' }">{{ scope.row.GYSMC }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="KDRXM" label="开单人" align="center" width="80"> </el-table-column>
                        <el-table-column prop="CGRXM" label="采购人" align="center" width="80">
                            <template #default="scope">
                                <span :style="{ color: scope.row.ID === jhdRadio ? 'red' : '' }">{{ scope.row.CGRXM }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="PZRXM" label="批准人" align="center" width="80">
                            <template #default="scope">
                                <span :style="{ color: scope.row.ID === jhdRadio ? 'red' : '' }">{{ scope.row.PZRXM }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="CGYXM" label="仓管员" align="center" width="80">
                            <template #default="scope">
                                <span :style="{ color: scope.row.ID === jhdRadio ? 'red' : '' }">{{ scope.row.CGYXM }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="GJZE" label="进货金额" align="center" width="80">
                            <template #default="scope">
                                <span :style="{ color: scope.row.ID === jhdRadio ? 'red' : '' }">{{ scope.row.GJZE }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="LSZE" label="零售金额" align="center" width="80">
                            <template #default="scope">
                                <span :style="{ color: scope.row.ID === jhdRadio ? 'red' : '' }">{{ scope.row.LSZE }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" align="center" width="100">
                            <template #default="{ row }">
                                <div
                                    @click="lookDetail(row)"
                                    :style="{ color: row.ID === jhdRadio ? 'red' : '', cursor: row.ID ? 'pointer' : 'pointer' }"
                                >
                                    查看明细
                                </div>
                            </template>
                        </el-table-column>

                        <template #empty>
                            <el-empty description="暂无数据" />
                        </template>
                    </el-table>
                </div>
                <div v-if="djTableData == 'qldOrder'">
                    <el-table
                        ref="tablerefl"
                        :data="jhdtableData"
                        :header-row-class-name="'custom-header'"
                        stripe
                        style="width: 100%"
                        height="510"
                        class="ba-data-table w100"
                        @row-click="jhdhandleRowClick"
                        highlight-current-row
                    >
                        <el-table-column prop="XMBM" label="选择" width="70" align="center">
                            <template #default="scope">
                                <el-radio v-model="jhdRadio" :label="scope.row.ID">&nbsp;</el-radio>
                            </template>
                        </el-table-column>
                        <el-table-column prop="KDRQ" label="开单日期" align="center" width="160"> </el-table-column>
                        <el-table-column prop="DJH" label="单据号" align="center" width="100">
                            <template #default="scope">
                                <span :style="{ color: scope.row.ID === jhdRadio ? 'red' : '' }">{{ scope.row.DJH }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="CKKF" label="请领药房" align="center" width="80">
                            <template #default="scope">
                                <span :style="{ color: scope.row.ID === jhdRadio ? 'red' : '' }">{{ scope.row.QLYF }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="KDRXM" label="开单人" align="center" width="80"> </el-table-column>
                        <el-table-column prop="SQRXM" label="申请人" align="center" width="80">
                            <template #default="scope">
                                <span :style="{ color: scope.row.ID === jhdRadio ? 'red' : '' }">{{ scope.row.SQRXM }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="PZRXM" label="批准人" align="center" width="80">
                            <template #default="scope">
                                <span :style="{ color: scope.row.ID === jhdRadio ? 'red' : '' }">{{ scope.row.PZRXM }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="CGYXM" label="仓管员" align="center" width="80">
                            <template #default="scope">
                                <span :style="{ color: scope.row.ID === jhdRadio ? 'red' : '' }">{{ scope.row.CGYXM }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="GJZE" label="进货金额" align="center" width="80">
                            <template #default="scope">
                                <span :style="{ color: scope.row.ID === jhdRadio ? 'red' : '' }">{{ scope.row.GJZE }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="LSZE" label="零售金额" align="center" width="80">
                            <template #default="scope">
                                <span :style="{ color: scope.row.ID === jhdRadio ? 'red' : '' }">{{ scope.row.LSZE }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" align="center" width="100">
                            <template #default="{ row }">
                                <div
                                    @click="lookDetail(row)"
                                    :style="{ color: row.ID === jhdRadio ? 'red' : '', cursor: row.ID ? 'pointer' : 'pointer' }"
                                >
                                    查看明细
                                </div>
                            </template>
                        </el-table-column>
                        <template #empty>
                            <el-empty description="暂无数据" />
                        </template>
                    </el-table>
                </div>
                <div class="ss-pagination">
                    <el-pagination
                        v-model:current-page="dialogformData.page"
                        v-model:page-size="dialogformData.size"
                        :page-sizes="[20, 30, 50, 100]"
                        :small="small"
                        align="center"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="dialogformData.count"
                        @size-change="jhdhandleSizeChange"
                        @current-change="jhdhandleCurrentChange"
                    />
                </div>
            </el-scrollbar>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="jhddialogVisible = false">取消</el-button>
                    <el-button type="primary" :disabled="!jhdRadio" @click="jhdmxSubmit">确定</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 引用进货单end -->
        <JhdEdit
            ref="jhdmxRef"
            :jhdmxDate="jhdmxDate"
            :kfbm="formData.KFBM"
            :yfbm="yfbm"
            :ypInfo="ypInfo"
            :djTableData="djTableData"
            :djid="djid"
            :djh="djh"
            @changeDialog="changeDialog"
        ></JhdEdit>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { getgyslist, getyklist } from '/@/api/common'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getJhdList, getJhdInfo } from '/@/api/backend/yk/jhd'
import { getQldList, getQldMx } from '/@/api/backend/yfzx/qld'
import { getChdList, ykChdEdit, dyJhdMx } from '/@/api/backend/yk/chd'
import JhdEdit from './jhdedit.vue'
import { export_table_to_excel } from '/@/utils/excel'
import { useNavTabs } from '/@/stores/navTabs'
import { useRouter } from 'vue-router'

defineOptions({
    name: 'ykzx/ckd',
})

// 出库单因为要引用请领和进货单用了两个table外 其余变量方法名都是共用一个 根据djTableData 判断
// 判断引用请领还是进货
let djTableData = ref('')
const jhdRadio = ref()
const currentradio = ref('')
const tableData = ref([])
const jhdtableData = ref([])
const gysData = ref([])
const ykData = ref([])
const jhdmxRef = ref(null)
const kfbm = ref('')
const kfbmShow = ref(false)
const ypInfo = ref([])
const jhddialogVisible = ref()
const dateOption = ref('0')
const jhdmxDate = ref([])
const djid = ref()
const yfbm = ref()
const djh = ref()

const router = useRouter()
const navTabs = useNavTabs()

// 退货单data
const formData = reactive({
    ZT: '',
    KFBM: '',
    GYSBM: '',
    KDRQ: '',
    TIME: [],
    keywords: '',
    page: 1,
    size: 20,
    count: 0,
})

const printYkBtn = () => {
    if (currentradio.value) {
        console.log('打印了')
    } else {
        return
    }
}
const exportYkBtn = () => {
    export_table_to_excel('#exportTable', '出库单')
}

//进货单/请领单dialogdata
const dialogformData = reactive({
    TIME: [],
    keywords: '',
    KFBM: '',
    ZT: 2,
    page: 1,
    size: 20,
    count: 0,
})

// 引用进货单弹窗
const ykjhdBtnType = (type) => {
    if (type === 'order' || type === 'qldOrder') {
        djTableData.value = type
        console.log('type: ', type)
        jhddialogVisible.value = true
    }
}

watch(
    () => jhddialogVisible.value,
    (val) => {
        if (val) {
            getJhdsList()
        }
    }
)

// 出库单分页
const handleSizeChange = (v: any) => {
    formData.size = v
    getChdsList()
}
const handleCurrentChange = (v: any) => {
    formData.page = v
    getChdsList()
}

// 进货单分页
const jhdhandleCurrentChange = (v: any) => {
    dialogformData.page = v
    getJhdsList()
}
const jhdhandleSizeChange = (v: any) => {
    dialogformData.size = v
    getJhdsList()
}

// 出库单列表
const getChdsList = async () => {
    const res = await getChdList({ agrs: { ...formData } })
    tableData.value = res.data
    formData.count = res.count
}

// 进货单请领单列表
const getJhdsList = async () => {
    let res = null

    if (djTableData.value === 'order') {
        res = await getJhdList({ agrs: { ...dialogformData } })
    } else if (djTableData.value === 'qldOrder') {
        res = await getQldList({ agrs: { ...dialogformData } })
    }

    if (res) {
        jhdtableData.value = res.data
        dialogformData.count = res.count
    }
}

const ckdLook = (row) => {
    router.push({
        path: '/admin/ykzx/ckd/detail',
        query: { ID: row.ID, DJID: row.DJID, KFBM: formData.KFBM, cKFBM: row.KFBM, DJH: row.DJH, JHDJH: row.JHDJH, QLDJH: row.QLDJH, type: 'look' },
    })
}

const ckdEdit = (row) => {
    router.push({
        path: '/admin/ykzx/ckd/edit',
        query: { ID: row.ID, DJID: row.DJID, KFBM: formData.KFBM, cKFBM: row.KFBM, DJH: row.DJH, JHDJH: row.JHDJH, QLDJH: row.QLDJH, type: 'edit' },
    })
}

const ckdCreate = () => {
    router.push({
        path: '/admin/ykzx/ckd/add',
        query: { KFBM: formData.KFBM, type: 'create' },
    })
}

const handleRowClick = (row) => {
    currentradio.value = row.ID
}
// 引用请领单和引用进货单共用一个
const jhdhandleRowClick = (row) => {
    jhdRadio.value = row.ID
    djid.value = row.DJID
    djh.value = row.DJH
    yfbm.value = row.YFBM
}

// 进货单请领单明细确认
const jhdmxSubmit = async () => {
    router.push({
        path: '/admin/ykzx/ckd/add',
        query: {
            KFBM: formData.KFBM,
            cKFBM: djTableData.value === 'order' ? formData.KFBM : yfbm.value,
            DJID: djid.value,
            DJH: djh.value,
            type: djTableData.value == 'order' ? 'order' : 'qldOrder',
            allType: 'one',
        },
    })
}

// 格式化时间
const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

//引用请领or进货时间的方法
const dataChange = (val) => {
    const endDate = new Date()
    const startDate = new Date()
    if (val == 0) {
        startDate.setMonth(startDate.getMonth() - 1)
    } else if (val == 1) {
        startDate.setMonth(startDate.getMonth() - 3)
    } else if (val == 2) {
        startDate.setMonth(startDate.getMonth() - 6)
    } else if (val == 3) {
        startDate.setFullYear(startDate.getFullYear() - 1)
    }
    dialogformData.TIME = [formatDate(startDate), formatDate(endDate)]
    getJhdsList()
}

watch(
    () => formData.KFBM,
    (val) => {
        if (val) {
            dialogformData.KFBM = val
            getChdsList()
        }
    }
)
const changeDialog = () => {
    jhddialogVisible.value = false
}

// 引用进货or请领查看明细
const lookDetail = async (row) => {
    let res = null
    djid.value = row.DJID
    djh.value = row.DJH
    yfbm.value = row.YFBM
    if (djTableData.value === 'order') {
        res = await getJhdInfo({ agrs: { DJH: row.DJH, DJID: row.DJID, KFBM: formData.KFBM } })
    } else if (djTableData.value === 'qldOrder') {
        res = await getQldMx({ agrs: { DJH: row.DJH, DJID: row.DJID, YFBM: row.YFBM } })
    }
    jhdmxDate.value = res.data
    jhdmxRef.value.drawerData.jhdmxdialog = true
}

const select = (row) => {
    if (row) {
        kfbm.value = row
        // 获取药品信息
        kfbmShow.value = true
    }
}

const dateData = [
    { value: '0', label: '近一月' },
    { value: '1', label: '近三月' },
    { value: '2', label: '近半年' },
    { value: '3', label: '近一年' },
]

const djztData = [
    { value: '0', MC: '已作废' },
    { value: '1', MC: '已保存' },
    { value: '2', MC: '已审核' },
]

const resetForm = () => {
    formData.ZT = ''
    formData.GYSBM = ''
    formData.KDRQ = ''
    formData.TIME = []
    formData.keywords = ''
    getChdsList()
}

const cancelBtn = (row) => {
    ElMessageBox.confirm(`作废后，这条单据将不能使用，您确定要作废吗？`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        const { DJID, KFBM, DJH, ID } = row
        let data = {
            agrs: {
                ZB: { DJID, KFBM, DJH, ID },
                LX: '作废',
            },
        }
        await ykChdEdit(data)
        ElMessage.success('操作成功')
        getChdsList()
    })
}

const loadOptions = async () => {
    // 获取药库
    const res = await getyklist({ agrs: '1' })
    if (res.data && res.data.length > 0) {
        ykData.value = res.data
        if (ykData.value.length > 0) {
            formData.KFBM = ykData.value[0]?.BM
        }
        const lastTab = navTabs.state.tabsView.slice(-1)[0]
        if (lastTab.query.KFBM) {
            formData.KFBM = lastTab.query.KFBM
        }
    }
}

onMounted(() => {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - 1)
    dialogformData.TIME = [formatDate(startDate), formatDate(endDate)]
    // 获取供应商
    getgyslist({ agrs: { DLBM: '2' } }).then((r) => {
        gysData.value = r.data.options
    })

    loadOptions()
})
</script>

<style lang="scss" scoped>
:deep(.el-dialog__title) {
    color: #fff;
}
.date-select :deep(.el-input) {
    width: 100px;
}
.kw-input :deep(.el-input__wrapper) {
    border-radius: 20px;
}
:deep(.custom-header) th {
    color: #000;
}
:deep(.el-table__row) {
    height: 32px;
}
.table-item-top {
    background: #ffffff;
    padding: 10px 5px;
    display: flex;

    .btn,
    .current-btn {
        display: flex;
        height: 24px;
        font-size: 12px;
        align-items: center;
        margin-right: 8px;
        width: 70px;
        .local-icon {
            font-size: 14px;
            margin-right: 3px;
        }
    }

    .btn {
        color: #4ca7f9;
        cursor: pointer;
    }

    .current-btn {
        color: #bbbbbb;
    }
}
.table-item {
    display: flex;
    margin-left: 10px;
    .btn {
        display: flex;
        height: 24px;
        font-size: 12px;
        align-items: center;
        margin-right: 8px;
        width: 48px;
        color: #4ca7f9;
        cursor: pointer;
        .local-icon {
            font-size: 14px;
            margin-right: 3px;
        }
    }
    .export {
        width: 70px !important;
    }
}

.kf-select :deep(.el-input) {
    width: 87px;
}
.zt-select :deep(.el-input) {
    width: 100px;
}
:deep(.el-date-editor) {
    width: 230px;
}
.layout-box {
    padding: 0 6px;
    .custom-row {
        height: 20px;
    }
    .btn-box {
        width: 100%;
        border: 1px solid #eaeaea;
        background: #f9f9f9;
        border-radius: 5px;
        padding: 12px 20px;
        margin-top: 20px;
    }
    .search-box {
        width: 100%;
        background: #ffffff;
        border-bottom: solid 1px #cecece;
        margin: 10px 0 5px;
        .zw-table-search {
            min-width: 1300px;
            background: #ffffff;
            box-sizing: border-box;
            padding: 10px 10px 0;
            :deep(.el-form-item) {
                margin-bottom: 10px;
            }
        }
        .chat_form {
            .el-col {
                &:last-child {
                    text-align: right;
                }
            }
        }
    }
    .pagination {
        margin-top: 6px;
        display: flex;
        align-items: center;
        width: calc(100vw - 273px);
        height: 37px;
        justify-content: center;
        background-color: #f6f6f6;
    }
    .ss-pagination {
        display: flex;
        justify-content: center;
        margin-top: 5px;
    }
    .jhd-box {
        margin: 10px 0 10px 10px;
        .local-icons {
            font-size: 14px;
            margin-right: 5px;
        }
    }
}
.status-invalid {
    width: 53px;
    height: 18px;
    line-height: 17px;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 1);
    color: rgba(247, 128, 128, 1);
    font-size: 12px;
    text-align: center;
    font-family: Roboto;
    border: 1px solid rgba(247, 128, 128, 1);
}

.status-saved {
    width: 53px;
    height: 18px;
    line-height: 17px;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 1);
    color: rgba(255, 164, 0, 1);
    font-size: 12px;
    text-align: center;
    font-family: Roboto;
    border: 1px solid rgba(255, 164, 0, 1);
}

.status-approved {
    width: 53px;
    height: 18px;
    line-height: 17px;
    border-radius: 4px;
    background-color: rgba(76, 167, 249, 0.11);
    color: rgba(76, 167, 249, 1);
    font-size: 12px;
    text-align: center;
    font-family: Roboto;
}
</style>
