<template>
    <div class="layout-box">
        <!-- 搜索部分 -->
        <div class="search-box">
            <el-form :model="formData" :inline="true" label-width="auto" class="zw-table-search">
                <el-form-item label="药房" label-width="40">
                    <el-select v-model="formData.YFBM" placeholder="请选择药房" clearable class="kf-select">
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
                    <el-button type="primary" @click="getPddsList">查询</el-button>
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
                        <el-dropdown-item @click="pddCreate()">手工录入</el-dropdown-item>
                        <el-dropdown-item @click="pddOder()">生成盘点明细</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <div @click="printYkBtn('print')" :class="[currentradio ? 'btn' : 'current-btn']">
                <Icon name="local-print" :style="currentradio ? 'color:#4ca7f9' : 'color:bbbbbb'" class="local-icon" />
                <div>打印单据</div>
            </div>

            <div class="export" @click="exportYfBtn('export')" :class="[currentradio ? 'btn' : 'current-btn']">
                <Icon name="local-export" :style="currentradio ? 'color:#4ca7f9' : 'color:bbbbbb'" class="local-icon" />
                <div>导出单据</div>
            </div>
        </div>
        <el-table
            id="exportTable"
            ref="tableref"
            :data="tableData"
            :header-row-class-name="'custom-header'"
            stripe
            style="width: 100%"
            height="calc(100vh - 245px)"
            class="ba-data-table w100"
            :header-cell-style="{ borderColor: '#e0e0e0' }"
            :cell-style="{ borderRightColor: 'transparent' }"
            @row-click="handleRowClick"
            highlight-current-row
        >
            <el-table-column type="index" width="50" label="NO" />
            <el-table-column prop="ZT" label="状态" align="center" width="80">
                <template #default="{ row }">
                    <div v-if="row.ZT === 0" class="status-invalid">已作废</div>
                    <div v-else-if="row.ZT === 1" class="status-saved">暂存</div>
                    <div v-else class="status-approved">已审核</div>
                </template>
            </el-table-column>
            <el-table-column prop="DJH" label="单据号" align="center" width="100"> </el-table-column>
            <el-table-column prop="YFBM" label="盘点库房" align="center" width="160">
                <template #default="scope">
                    <span>{{ renderKfbm(scope.row.YFBM) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="KDRQ" label="开单时间" align="center" width="160"> </el-table-column>
            <el-table-column prop="KDRXM" label="开单人" align="center" width="100"> </el-table-column>
            <el-table-column prop="PDRBM" label="盘点人" align="center" width="100"> </el-table-column>
            <el-table-column prop="PZRBM" label="批准人" align="center" width="100"> </el-table-column>
            <el-table-column prop="CGYXM" label="仓管员" align="center" width="100"> </el-table-column>
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
            <el-table-column prop="GJ" label="购进" align="center" width="250">
                <el-table-column prop="ZMJHZE" label="账面" align="center" width="90">
                    <template #default="{ row }">
                        <span>{{ row.ZMJHZE }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="PDJHZE" label="盘点" align="center" width="90">
                    <template #default="{ row }">
                        <span>{{ row.PDJHZE }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="JHCE" label="差额" align="center" width="90">
                    <template #default="{ row }">
                        <span>{{ row.JHCE }}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column prop="LS" label="零售" align="center" width="250">
                <el-table-column prop="ZMLSZE" label="账面" align="center" width="90">
                    <template #default="{ row }">
                        <span>{{ row.ZMLSZE }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="PDLSZE" label="盘点" align="center" width="90">
                    <template #default="{ row }">
                        <span>{{ row.PDLSZE }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="LSCE" label="差额" align="center" width="90">
                    <template #default="{ row }">
                        <span>{{ row.LSCE }}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column prop="SHRXM" label="审核人" align="center" width="120"> </el-table-column>
            <el-table-column prop="SHRQ" label="审核时间" align="center" width="160"> </el-table-column>
            <el-table-column fixed="right" label="操作" align="center" width="180">
                <template #default="{ row }">
                    <div class="table-item">
                        <div class="btn" @click="pddLokk(row)">
                            <Icon name="local-look" style="color: #4ca7f9" class="local-icon" />
                            <div>查看</div>
                        </div>
                        <div class="btn" v-if="row.ZT == 1" @click="pddEdit(row)">
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
                :disabled="disabled"
                :background="background"
                layout="total, sizes, prev, pager, next, jumper"
                :total="formData.count"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
        <!-- 药库载入盘点 -->
        <el-dialog
            v-model="mxdialogVisible"
            :title="dialogTitle"
            width="650px"
            class="ba-operate-dialog"
            style="height: 300px"
            :close-on-click-modal="false"
        >
            <div class="mxdialog">
                <el-row :gutter="2">
                    <el-col :xs="24" :sm="10">
                        <el-checkbox false-label="null" :true-label="1" v-model="formData.YWLX">所有记录</el-checkbox>
                    </el-col>
                    <el-col :xs="24" :sm="14">
                        <el-checkbox false-label="null" :true-label="2" v-model="formData.YWLX">库存大于0的记录</el-checkbox>
                    </el-col>
                </el-row>
                <el-row :gutter="2">
                    <el-col :xs="24" :sm="24">
                        <el-checkbox false-label="null" :true-label="3" v-model="formData.YWLX">货柜为</el-checkbox>
                        <el-cascader
                            v-model="state.HWBM"
                            :props="defaultProps"
                            :options="groupOptions"
                            :show-all-levels="false"
                            filterable
                            clearable
                            placeholder="请选择"
                            :disabled="formData.YWLX != 3"
                            style="width: 473px; padding-left: 5px"
                        />
                    </el-col>
                </el-row>
                <el-row :gutter="2">
                    <el-col :xs="24" :sm="10">
                        <el-checkbox false-label="null" :true-label="4" v-model="formData.YWLX">类别为</el-checkbox>
                        <el-select
                            v-model="state.LB"
                            filterable
                            placeholder="请选择类别"
                            clearable
                            multiple
                            :disabled="formData.YWLX != 4"
                            style="width: 170px; padding-left: 5px"
                        >
                            <el-option v-for="opt in lbArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :xs="24" :sm="14">
                        <el-checkbox false-label="null" :true-label="5" v-model="formData.YWLX">有效期>=</el-checkbox>
                        <el-date-picker
                            v-model="state.YXQ"
                            type="datetime"
                            placeholder="请选择有效期"
                            :disabled="formData.YWLX != 5"
                            style="width: 210px; padding-left: 5px"
                        />
                    </el-col>
                </el-row>
            </div>

            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="scpdMxSubmit" style="width: 80px">确定</el-button>
                    <el-button @click="mxdialogVisible = false" style="width: 80px; margin-left: 25px">取消</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { getgyslist, getyklist } from '/@/api/common'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useNavTabs } from '/@/stores/navTabs'
import { getPddList, yfPddEdit, cxhwzd, hqyfyplb } from '/@/api/backend/yfzx/pdd'
import { useRouter } from 'vue-router'
import { export_table_to_excel } from '/@/utils/excel'
defineOptions({
    name: 'yfzx/pdd',
})

const router = useRouter()
const navTabs = useNavTabs()
const currentradio = ref('')
const tableData = ref([])
const gysData = ref([])
const ykData = ref([])
const dialogTitle = ref('药库载入盘点')
const mxdialogVisible = ref(false)
const lbArr = ref([])
const groupOptions = ref([])
const defaultProps = {
    checkStrictly: true,
    emitPath: false,
    multiple: true,
    label: 'HWMC',
    value: 'HWBM',
}

const state: {
    HWBM: any
    YXQ: any
    LB: any
} = reactive({
    HWBM: '',
    YXQ: '',
    LB: '',
})
// 盘点单data
const formData = reactive({
    ZT: '',
    YFBM: '',
    GYSBM: '',
    KDRQ: '',
    TIME: [],
    keywords: '',
    page: 1,
    size: 20,
    count: 0,
    YWLX: 0,
})
// 根据编码获取盘点科室
const renderKfbm = (bm: string) => {
    let ret = bm
    ret = ykData.value.find((item: any) => item.BM == bm)?.MC
    return ret
}
// 载入生成盘点弹窗控制
const pddOder = () => {
    mxdialogVisible.value = true
}
// 导出
const exportYfBtn = () => {
    export_table_to_excel('#exportTable', '盘点单')
}
// 时间格式化
const formattedTime = () => {
    const date = new Date(state.YXQ)
    const year = date.getFullYear()
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const day = ('0' + date.getDate()).slice(-2)
    const hour = ('0' + date.getHours()).slice(-2)
    const minute = ('0' + date.getMinutes()).slice(-2)
    const second = ('0' + date.getSeconds()).slice(-2)
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}
// 生成盘点明细
const scpdMxSubmit = async () => {
    if (formData.YWLX == 1 || formData.YWLX == 2) {
        mxdialogVisible.value = false
        router.push({
            path: '/admin/yfzx/pdd/oder',
            query: { cYFBM: formData.YFBM, YWLX: formData.YWLX, type: 'oder' },
        })
    } else if (formData.YWLX == 3 || formData.YWLX == 4) {
        mxdialogVisible.value = false
        router.push({
            path: '/admin/yfzx/pdd/oder',
            query: { cYFBM: formData.YFBM, YWLX: formData.YWLX, ListBM: state.HWBM ? state.HWBM : state.LB, type: 'oder' },
        })
    } else if (formData.YWLX == 5) {
        mxdialogVisible.value = false
        console.log(state.YXQ)

        router.push({
            path: '/admin/yfzx/pdd/oder',
            query: { cYFBM: formData.YFBM, YWLX: formData.YWLX, Date: formattedTime(), type: 'oder' },
        })
    } else {
        ElMessage.error('操作失败，稍后再试')
    }
}

const handleRowClick = (row: any) => {
    currentradio.value = row.ID
}

watch(
    () => formData.YFBM,
    (val) => {
        if (val) {
            getPddsList()
            // 获取货位信息
            cxhwzd({ agrs: { KFBM: formData.YFBM, YWLX: 'Tree' } }).then((res) => {
                groupOptions.value = res.data
            })
            // 获取药品分类
            hqyfyplb({ agrs: formData.YFBM }).then((res) => {
                lbArr.value = res.data
            })
        }
    }
)

const handleSizeChange = (v: any) => {
    formData.size = v
    getPddsList()
}

const handleCurrentChange = (v: any) => {
    formData.page = v
    getPddsList()
}

// 盘点单列表
const getPddsList = async () => {
    const res = await getPddList({ agrs: { ...formData } })
    tableData.value = res.data
    formData.count = res.count
}
// 打印
const printYkBtn = () => {
    if (currentradio.value) {
        console.log('打印了')
    } else {
        return
    }
}
// 单据状态
const djztData = [
    { value: '0', MC: '已作废' },
    { value: '1', MC: '已保存' },
    { value: '2', MC: '已审核' },
]
// 重置
const resetForm = () => {
    formData.ZT = ''
    formData.GYSBM = ''
    formData.KDRQ = ''
    formData.TIME = []
    formData.keywords = ''
    getPddsList()
}
// 作废
const cancelBtn = (row: any) => {
    ElMessageBox.confirm(`作废后，这条单据将不能使用，您确定要作废吗？`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        const { DJID, YFBM, DJH, ID } = row
        let data = {
            agrs: {
                ZB: { DJID, YFBM, DJH, ID },
                LX: '作废',
            },
        }
        await yfPddEdit(data)
        ElMessage.success('操作成功')
        getPddsList()
    })
}
// 新增
const pddCreate = () => {
    router.push({
        path: '/admin/yfzx/pdd/add',
        query: { cYFBM: formData.YFBM, type: 'create' },
    })
}
// 修改
const pddEdit = (row: any) => {
    router.push({
        path: '/admin/yfzx/pdd/edit',
        query: { ID: row.ID, DJID: row.DJID, cYFBM: row.YFBM, DJH: row.DJH, type: 'edit' },
    })
}
// 查看
const pddLokk = (row: any) => {
    router.push({
        path: '/admin/yfzx/pdd/detail',
        query: { ID: row.ID, DJID: row.DJID, cYFBM: row.YFBM, DJH: row.DJH, type: 'look' },
    })
}

const loadOptions = async () => {
    // 获取库房
    const res = await getyklist({ agrs: '2' })
    if (res.data && res.data.length > 0) {
        ykData.value = res.data
        if (ykData.value.length > 0) {
            formData.YFBM = ykData.value[0]?.BM
        }
        const lastTab = navTabs.state.tabsView.slice(-1)[0]
        if (lastTab.query.YFBM) {
            formData.YFBM = lastTab.query.YFBM
        }
    }
}

onMounted(() => {
    // 获取供应商
    getgyslist({ agrs: { DLBM: '2' } }).then((r) => {
        gysData.value = r.data.options
    })
    loadOptions()
})
</script>

<style lang="scss" scoped>
:deep(.el-table thead.is-group th.el-table__cell) {
    background-color: rgb(232, 232, 232);
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
:deep(.el-radio__label) {
    font-size: 0;
}

.kf-select :deep(.el-input) {
    width: 90px;
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
            min-width: 1320px;
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
:deep(.ba-operate-dialog .el-dialog__footer) {
    display: flex;
    margin-left: 220px;
    padding: 20px;
    box-shadow: none;
    justify-content: space-between;
    width: auto;
}
.mxdialog {
    padding: 15px 10px;
    .el-row {
        margin-bottom: 15px;
    }
}
:deep(.el-dialog__title) {
    color: white;
}
</style>
