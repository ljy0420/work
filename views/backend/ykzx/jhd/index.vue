<template>
    <div class="layout-box">
        <!-- 搜索部分 -->
        <div class="search-box">
            <el-form :model="formData" :inline="true" label-width="auto" class="zw-table-search">
                <el-form-item label="库房" label-width="40">
                    <el-select v-model="formData.KFBM" placeholder="请选择库房" clearable class="kf-select">
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
                    <el-button type="primary" @click="getJhdsList">查询</el-button>
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
                        <el-dropdown-item @click="jhdCreate()">手工录入</el-dropdown-item>
                        <el-dropdown-item @click="dhddialogVisible = true">根据订货单生成</el-dropdown-item>
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
            v-loading="loading"
            id="exportTable"
            ref="tableref"
            :data="tableData"
            :header-row-class-name="'custom-header'"
            stripe
            style="width: 100%"
            height="calc(100vh - 245px)"
            class="ba-data-table w100"
            @row-click="handleRowClick"
            highlight-current-row
        >
            <el-table-column type="index" width="50" label="NO" />
            <el-table-column prop="ZT" label="状态" align="left" width="80">
                <template #default="{ row }">
                    <div v-if="row.ZT === 0" class="status-invalid">已作废</div>
                    <div v-else-if="row.ZT === 1" class="status-saved">暂存</div>
                    <div v-else class="status-approved">已审核</div>
                </template>
            </el-table-column>
            <el-table-column prop="DJH" label="单据号" align="center" width="100"> </el-table-column>
            <el-table-column prop="KDRQ" label="开单时间" align="center" width="160"> </el-table-column>
            <el-table-column prop="KDRXM" label="开单人" align="center" width="80"> </el-table-column>
            <el-table-column prop="CGRXM" label="采购人" align="center" width="80"> </el-table-column>
            <el-table-column prop="PZRXM" label="批准人" align="center" width="80"> </el-table-column>
            <el-table-column prop="CGYXM" label="仓管员" align="center" width="80"> </el-table-column>
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
            <el-table-column prop="SHDH" label="随货单号" align="center" width="170"> </el-table-column>
            <el-table-column prop="FPHM" label="发票号" align="center" width="155"> </el-table-column>
            <el-table-column prop="GJZE" label="购进总额" align="center" width="80"> </el-table-column>
            <el-table-column prop="LSZE" label="零售总额" align="center" width="80"> </el-table-column>
            <el-table-column prop="SHRBM" label="审核人" align="center" width="80"> </el-table-column>
            <el-table-column prop="SHRQ" label="审核时间" align="center" width="155"> </el-table-column>
            <el-table-column prop="DHDJH" label="订货单据号" align="center" width="140"> </el-table-column>
            <el-table-column prop="BZ" label="备注" align="center" width="150"> </el-table-column>
            <el-table-column fixed="right" label="操作" align="center" width="180">
                <template #default="{ row }">
                    <div class="table-item">
                        <div class="btn" @click="jhdLokk(row)">
                            <Icon name="local-look" style="color: #4ca7f9" class="local-icon" />
                            <div>查看</div>
                        </div>
                        <div class="btn" v-if="row.ZT == 1" @click="jhdEdit(row)">
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
        <div class="ss-pagination">
            <el-pagination
                v-model:current-page="formData.page"
                v-model:page-size="formData.size"
                :page-sizes="[20, 30, 50, 100]"
                :small="small"
                align="center"
                :disabled="disabled"
                :background="background"
                layout="total, sizes, prev, pager, next, jumper"
                :total="formData.count"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
        <!-- 进货单dialog -->
        <el-dialog
            v-model="dhddialogVisible"
            title="调用订货单"
            width="55%"
            class="ba-operate-dialog jhdyy-edit"
            draggable
            :close-on-click-modal="false"
        >
            <el-scrollbar class="ba-table-form-scrollbar">
                <div class="dhd-box">
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
                            <el-button type="primary" @click="getDhdsList">
                                <Icon name="local-create" style="color: rgb(241, 241, 241)" class="local-icons" />
                                查询
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <el-table
                    ref="tableref"
                    :data="dhdtableData"
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
                            <el-radio v-model="dhdRadio" :label="scope.row.ID">&nbsp;</el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column prop="KDRQ" label="开单日期" align="center" width="160"> </el-table-column>
                    <el-table-column prop="DJH" label="单据号" align="center" width="100">
                        <template #default="scope">
                            <span :style="{ color: scope.row.ID === dhdRadio ? 'red' : '' }">{{ scope.row.DJH }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="GYSMC" label="供应商" align="center" width="200">
                        <template #default="scope">
                            <span :style="{ color: scope.row.ID === dhdRadio ? 'red' : '' }">{{ scope.row.GYSMC }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="KDRXM" label="开单人" align="center" width="80"> </el-table-column>
                    <el-table-column prop="CGRXM" label="采购人" align="center" width="80">
                        <template #default="scope">
                            <span :style="{ color: scope.row.ID === dhdRadio ? 'red' : '' }">{{ scope.row.CGRXM }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="PZRXM" label="批准人" align="center" width="80">
                        <template #default="scope">
                            <span :style="{ color: scope.row.ID === dhdRadio ? 'red' : '' }">{{ scope.row.PZRXM }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="CGYXM" label="仓管员" align="center" width="80">
                        <template #default="scope">
                            <span :style="{ color: scope.row.ID === dhdRadio ? 'red' : '' }">{{ scope.row.CGYXM }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="GJZE" label="进货金额" align="center" width="80">
                        <template #default="scope">
                            <span :style="{ color: scope.row.ID === dhdRadio ? 'red' : '' }">{{ scope.row.GJZE }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="LSZE" label="零售金额" align="center" width="80">
                        <template #default="scope">
                            <span :style="{ color: scope.row.ID === dhdRadio ? 'red' : '' }">{{ scope.row.LSZE }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" align="center" width="100">
                        <template #default="{ row }">
                            <div
                                @click="lookDetail(row)"
                                :style="{ color: row.ID === dhdRadio ? 'red' : '', cursor: row.ID ? 'pointer' : 'pointer' }"
                            >
                                查看明细
                            </div>
                        </template>
                    </el-table-column>

                    <template #empty>
                        <el-empty description="暂无数据" />
                    </template>
                </el-table>
                <div class="pagination">
                    <el-pagination
                        v-model:current-page="dialogformData.page"
                        v-model:page-size="dialogformData.size"
                        :page-sizes="[20, 30, 50, 100]"
                        :small="small"
                        align="center"
                        :disabled="disabled"
                        :background="background"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="dialogformData.count"
                        @size-change="dhdhandleSizeChange"
                        @current-change="dhdhandleCurrentChange"
                    />
                </div>
            </el-scrollbar>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dhddialogVisible = false">取消</el-button>
                    <el-button type="primary" :disabled="!dhdRadio" @click="dhdmxSubmit">确定</el-button>
                </span>
            </template>
        </el-dialog>
        <DhdEdit
            ref="dhdmxRef"
            :dhdmxDate="dhdmxDate"
            :kfbm="formData.KFBM"
            :djid="djid"
            :djh="djh"
            @changeDialog="changeDialog"
            :dhddialogVisible="dhddialogVisible"
        ></DhdEdit>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { getgyslist, getyklist } from '/@/api/common'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getJhdList, ykJhdEdit } from '/@/api/backend/yk/jhd'
import { getdhd, dhdmx } from '/@/api/backend/jcgl/dhd'
import { useNavTabs } from '/@/stores/navTabs'
import { useRouter } from 'vue-router'
import { export_table_to_excel } from '/@/utils/excel'
import DhdEdit from './dhdedit.vue'

defineOptions({
    name: 'ykzx/jhd',
})

const router = useRouter()
const navTabs = useNavTabs()
const currentradio = ref('')
const tableData = ref([])
const gysData = ref([])
const ykData = ref([])
const dhdmxRef = ref(null)
const dhdtableData = ref([])
const loading = ref(true)
const dhddialogVisible = ref(false)
const dhdRadio = ref()
const djid = ref()
const djh = ref()
const dateOption = ref('0')
const dhdmxDate = ref([])

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

//订货单dialogdata
const dialogformData = reactive({
    TIME: [],
    keywords: '',
    KFBM: '',
    ZT: 2,
    page: 1,
    size: 20,
    count: 0,
})

const handleRowClick = (row) => {
    currentradio.value = row.ID
}

const printYkBtn = () => {
    if (currentradio.value) {
        console.log('打印了')
    } else {
        return
    }
}
const exportYkBtn = () => {
    export_table_to_excel('#exportTable', '进货单')
}
watch(
    () => formData.KFBM,
    (val) => {
        if (val) {
            getJhdsList()
        }
    }
)
watch(
    () => dhddialogVisible.value,
    (val) => {
        if (val) {
            getDhdsList()
        }
    }
)

// 进货单interfacedata
const jhdhandleRowClick = (row) => {
    dhdRadio.value = row.ID
    djid.value = row.DJID
    djh.value = row.DJH
}

// 进货单分页
const handleSizeChange = (v: any) => {
    formData.size = v
    getJhdsList()
}

const handleCurrentChange = (v: any) => {
    formData.page = v
    getJhdsList()
}

//订货单分页
const dhdhandleSizeChange = (v: any) => {
    dialogformData.size = v
    getDhdsList()
}

const dhdhandleCurrentChange = (v: any) => {
    dialogformData.page = v
    getDhdsList()
}

// 进货单列表
const getJhdsList = async () => {
    loading.value = true
    const res = await getJhdList({ agrs: { ...formData } })
    tableData.value = res.data
    loading.value = false
    formData.count = res.count
}

// 订货单列表
const getDhdsList = async () => {
    const res = await getdhd({ agrs: { ...dialogformData } })
    dhdtableData.value = res.data
    dialogformData.count = res.count
}

// 订货单查看明细
const lookDetail = async (row) => {
    djid.value = row.DJID
    djh.value = row.DJH
    const res = await dhdmx({ agrs: { DJH: row.DJH, DJID: row.DJID, KFBM: formData.KFBM } })
    dhdmxDate.value = res.data
    dhdmxRef.value.drawerData.dhdmxdialog = true
}

const changeDialog = () => {
    dhddialogVisible.value = false
}

const djztData = [
    { value: '0', MC: '已作废' },
    { value: '1', MC: '已保存' },
    { value: '2', MC: '已审核' },
]

const dateData = [
    { value: '0', label: '近一月' },
    { value: '1', label: '近三月' },
    { value: '2', label: '近半年' },
    { value: '3', label: '近一年' },
]

const resetForm = () => {
    formData.ZT = ''
    formData.GYSBM = ''
    formData.KDRQ = ''
    formData.TIME = []
    formData.keywords = ''
    getJhdsList()
}

// 订货单明细确认
const dhdmxSubmit = async () => {
    router.push({
        path: '/admin/ykzx/jhd/add',
        query: { cKFBM: formData.KFBM, DJID: djid.value, DJH: djh.value, type: 'generate' },
    })
}

// 时间格式的方法
const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

// 下拉时间选择方法
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
    getDhdsList()
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
        await ykJhdEdit(data)
        ElMessage.success('操作成功')
        getJhdsList()
    })
}

const jhdLokk = (row) => {
    router.push({
        path: '/admin/ykzx/jhd/detail',
        query: { ID: row.ID, DJID: row.DJID, cKFBM: row.KFBM, DJH: row.DJH, type: 'look' },
    })
}

const jhdEdit = (row) => {
    router.push({
        path: '/admin/ykzx/jhd/edit',
        query: { ID: row.ID, DJID: row.DJID, cKFBM: row.KFBM, DJH: row.DJH, type: 'edit' },
    })
}

const jhdCreate = () => {
    router.push({
        path: '/admin/ykzx/jhd/add',
        query: { cKFBM: formData.KFBM, type: 'create' },
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
.date-select :deep(.el-input) {
    width: 100px;
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
        cursor: pointer;
        color: #4ca7f9;
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
                .el-select {
                }
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
    .ss-pagination {
        margin-top: 6px;
        display: flex;
        align-items: center;
        width: calc(100vw - 273px);
        height: 37px;
        justify-content: center;
        background-color: #f6f6f6;
    }
    .pagination {
        display: flex;
        justify-content: center;
        margin-top: 10px;
    }
    .dhd-box {
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
