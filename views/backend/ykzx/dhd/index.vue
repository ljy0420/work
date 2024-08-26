<template>
    <div class="layout-box">
        <!-- 搜索部分 -->
        <div class="search-box">
            <el-form :model="formData" :inline="true" label-width="auto" class="zw-table-search">
                <el-form-item label="库房" label-width="40">
                    <el-select v-model="formData.KFBM" placeholder="请选择" clearable @change="kfChange" class="kf-select">
                        <el-option v-for="opt in ykData" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="单据状态">
                    <el-select v-model="formData.ZT" placeholder="请选择" clearable class="zt-select">
                        <el-option v-for="opt in djzt" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="供应商" label-width="50">
                    <el-select v-model="formData.GYSBM" filterable placeholder="请选择" clearable>
                        <el-option v-for="opt in gysArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="开单时间">
                    <el-date-picker
                        v-model="formData.TIME"
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

                <el-form-item label="检索" label-width="40">
                    <el-input v-model="formData.keywords" type="string" placeholder="请输入文字(支持模糊搜索)"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="getdhdList">查询</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 按钮部分 -->
        <div class="table-item-top">
            <div class="btn" @click="ssdialogVisible = true">
                <Icon name="local-create" style="color: #4ca7f9" class="local-icon" />
                <div>新增单据</div>
            </div>
            <div @click="printYkBtn()" :class="[currentradio ? 'btn' : 'current-btn']">
                <Icon name="local-print" :style="currentradio ? 'color:#4ca7f9' : 'color:bbbbbb'" class="local-icon" />
                <div>打印单据</div>
            </div>

            <div class="btn" @click="exportYkBtn()">
                <Icon name="local-export" style="color: #4ca7f9" class="local-icon" />
                <div>导出单据</div>
            </div>
        </div>
        <!-- 表格 -->
        <el-table
            id="exportTable"
            ref="tableref"
            :data="tableData"
            :header-row-class-name="'custom-header'"
            stripe
            style="width: 100%"
            height="calc(100vh - 245px)"
            class="ba-data-table w100"
            highlight-current-row
            @row-click="currentRowBtn"
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
            <el-table-column prop="JHLX" label="计划类型" align="center" width="120">
                <template #default="{ row }">
                    {{ row.JYLX == 0 ? '手工输入' : row.JYLX == 1 ? '系统生成' : '外部导入' }}
                </template>
            </el-table-column>
            <el-table-column prop="GJZE" label="购进总额" align="center" width="80"> </el-table-column>
            <el-table-column prop="LSZE" label="零售总额" align="center" width="80"> </el-table-column>
            <el-table-column prop="SHRXM" label="审核人" align="center" width="80"> </el-table-column>
            <el-table-column prop="SHRQ" label="审核时间" align="center" width="155"> </el-table-column>
            <el-table-column prop="BZ" label="备注" align="center" width="170"> </el-table-column>
            <el-table-column fixed="right" label="操作" align="center" width="200">
                <template #default="{ row }">
                    <div class="table-item">
                        <div class="btn" @click="dhdLook(row)">
                            <Icon name="local-look" style="color: #4ca7f9" class="local-icon" />
                            <div>查看</div>
                        </div>
                        <div class="btn" v-if="row.ZT == 1" @click="dhdEdit(row)">
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
                :total="formData.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            >
            </el-pagination>
        </div>

        <!-- 建单模式 -->
        <el-dialog v-model="ssdialogVisible" :title="dialogTitle" width="40%" class="ba-operate-dialog dhmode-edit">
            <el-scrollbar class="ba-table-form-scrollbar">
                <el-radio-group v-model="radio" style="width: 280px; margin: 20px 20px 10px" @change="radioChange">
                    <el-radio :label="3" style="width: 100%">手工输入建单</el-radio>
                    <el-radio :label="6">低于警戒线库存数生成订货单</el-radio>
                    <el-radio :label="9">距最高限差库存数生成订货单</el-radio>
                    <el-radio :label="10">按时间段库存消耗总量生成订货单</el-radio>
                    <el-radio :label="11">按时间段仓库出库总量生成订货单</el-radio>
                </el-radio-group>

                <el-form :model="modedata" :inline="true" label-width="75px" :rules="rules" ref="ruleFormRef">
                    <el-form-item label="供应商">
                        <el-select v-model="modedata.gys" filterable placeholder="请选择供应商" clearable style="width: 100%">
                            <el-option v-for="opt in gysArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="消耗时间" v-show="radio == 10" prop="TIME">
                        <el-date-picker
                            v-model="modedata.TIME"
                            type="daterange"
                            :editable="false"
                            format="YYYY-MM-DD "
                            value-format="YYYY-MM-DD"
                            range-separator="—"
                            end-placeholder="结束时间"
                            start-placeholder="开始时间"
                        />
                    </el-form-item>
                    <el-form-item label="出库时间" v-show="radio == 11" prop="TIME">
                        <el-date-picker
                            v-model="modedata.TIME"
                            type="daterange"
                            :editable="false"
                            format="YYYY-MM-DD "
                            value-format="YYYY-MM-DD"
                            range-separator="—"
                            end-placeholder="结束时间"
                            start-placeholder="开始时间"
                            placement="top"
                        />
                    </el-form-item>
                </el-form>
            </el-scrollbar>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="ssdialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="newOrderModel">确定</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- end -->
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { getgysxxlist, getyklist } from '/@/api/common'
import type { FormItemRule } from 'element-plus'
import { buildValidatorData } from '/@/utils/validate'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getdhd, ykDhdEdit } from '/@/api/backend/jcgl/dhd'
import { export_table_to_excel } from '/@/utils/excel'
import { useNavTabs } from '/@/stores/navTabs'
import { useRouter } from 'vue-router'

const router = useRouter()
const navTabs = useNavTabs()
const ruleFormRef = ref()
const tableData = ref([])
const kfbmShow = ref(false)
const ykData = ref([])
const gysArr = ref([])
const current = ref('')
const currentradio = ref('')
const radio = ref(3)
const dialogTitle = ref('建单模式')
const ssdialogVisible = ref(false)

defineOptions({
    name: 'ykzx/dhd',
})

const formData = reactive({
    ZT: '',
    KFBM: '',
    GYSBM: '',
    KDRQ: '',
    TIME: [],
    keywords: '',
    page: 1,
    size: 20,
    total: 0,
})
const modedata = reactive({
    gys: '',
    TIME: [],
})

const currentRowBtn = (row) => {
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
    export_table_to_excel('#exportTable', '订货单')
}

const kfChange = (val) => {
    current.value = val
    kfbmShow.value = true
}

const getdhdList = async () => {
    const res = await getdhd({ agrs: { ...formData } })
    tableData.value = res.data
    formData.total = res.count
}

const resetForm = () => {
    formData.ZT = ''
    formData.GYSBM = ''
    formData.TIME = []
    formData.keywords = ''
    getdhdList()
}

watch(
    () => ssdialogVisible.value,
    (val) => {
        if (val) {
            modedata.TIME = []
            modedata.gys = ''
        }
    }
)

watch(
    () => formData.KFBM,
    (val) => {
        if (val) {
            getdhdList()
        }
    }
)

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    TIME: [buildValidatorData({ name: 'required', message: '时间不能为空.' })],
})

// 单据状态
const djzt = [
    { BM: 0, MC: '已作废' },
    { BM: 1, MC: '已保存' },
    { BM: 2, MC: '已审核' },
]

const loadOptions = async () => {
    // 获取药库
    const res = await getyklist({ agrs: '1' })
    console.log(res.data)
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

const handleSizeChange = (v: any) => {
    formData.size = v
    getdhdList()
}

const handleCurrentChange = (v: any) => {
    formData.page = v
    getdhdList()
}

// 建单模式
const radioChange = (val) => {
    radio.value = val
}

const dialogClose = () => {
    ssdialogVisible.value = false
}

const dhdLook = (row) => {
    router.push({
        path: '/admin/ykzx/dhd/detail',
        query: { ID: row.ID, DJID: row.DJID, cKFBM: row.KFBM, DJH: row.DJH, type: 'look' },
    })
}

const dhdEdit = (row) => {
    router.push({
        path: '/admin/ykzx/dhd/edit',
        query: { ID: row.ID, DJID: row.DJID, cKFBM: row.KFBM, DJH: row.DJH, type: 'edit' },
    })
}

const newOrderModel = async () => {
    const modeRadio = radio.value

    if (modeRadio === 3) {
        router.push({
            path: '/admin/ykzx/dhd/add',
            query: { cKFBM: formData.KFBM, type: 'create', modeRadio, GYS: modedata.gys },
        })
        dialogClose()
    } else if (modeRadio === 6 || modeRadio === 9) {
        router.push({
            path: '/admin/ykzx/dhd/add',
            query: { cKFBM: formData.KFBM, type: 'create', modeRadio, GYS: modedata.gys },
        })
        dialogClose()
    } else if (modeRadio === 10 || modeRadio === 11) {
        const isValid = await ruleFormRef.value.validate()
        if (isValid) {
            router.push({
                path: '/admin/ykzx/dhd/add',
                query: { cKFBM: formData.KFBM, type: 'create', modeRadio, TIME: modedata.TIME, GYS: modedata.gys },
            })
            dialogClose()
        }
    }
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
        await ykDhdEdit(data)
        ElMessage.success('操作成功')
        getdhdList()
    })
}

onMounted(() => {
    // 供应商
    getgysxxlist({ agrs: { DLBM: 2 } }).then((res) => {
        gysArr.value = res.data.options
    })
    loadOptions()
})
</script>

<style lang="scss" scoped>
:deep(.el-dialog__title) {
    color: #fff;
}
:deep(.el-form-item__error) {
    display: none;
}
.table :deep(.el-radio__label) {
    font-size: 0;
}
:deep(.custom-header) th {
    color: #000;
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
    .pagination {
        margin-top: 6px;
        display: flex;
        align-items: center;
        width: calc(100vw - 273px);
        height: 37px;
        justify-content: center;
        background-color: #f6f6f6;
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
}
</style>
