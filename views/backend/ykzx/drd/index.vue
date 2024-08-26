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
                    <el-button type="primary" @click="getDrdsList">查询</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 按钮部分 -->
        <div class="table-item-top">
            <div @click="printYkBtn('print')" :class="[currentradio ? 'btn' : 'current-btn']">
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
            <el-table-column prop="TCKF" label="调出库房" align="center" width="100"> </el-table-column>
            <el-table-column prop="KDRQ" label="开单时间" align="center" width="160"> </el-table-column>
            <el-table-column prop="KDRXM" label="开单人" align="center" width="80"> </el-table-column>
            <el-table-column prop="SQR" label="申请人" align="center" width="80"> </el-table-column>
            <el-table-column prop="CGYXM" label="仓管员" align="center" width="80"> </el-table-column>
            <el-table-column prop="DCDJH" label="来源单据号" align="center" width="100"> </el-table-column>
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
            <el-table-column prop="GJZE" label="购进总额" align="center" width="80"> </el-table-column>
            <el-table-column prop="LSZE" label="零售总额" align="center" width="80"> </el-table-column>
            <el-table-column prop="SHRXM" label="审核人" align="center" width="80"> </el-table-column>
            <el-table-column prop="SHRQ" label="审核时间" align="center" width="155"> </el-table-column>
            <el-table-column prop="BZ" label="备注" align="center" width="150"> </el-table-column>
            <el-table-column fixed="right" label="操作" align="center" width="80">
                <template #default="{ row }">
                    <div class="table-item">
                        <div class="btn" @click="ykDrdLokk(row)">
                            <Icon name="local-look" style="color: #4ca7f9" class="local-icon" />
                            <div>查看</div>
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
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { getgyslist, getyklist } from '/@/api/common'
import { getDrdList } from '/@/api/backend/yk/drd'
import { useRouter } from 'vue-router'
import { export_table_to_excel } from '/@/utils/excel'

defineOptions({
    name: 'ykzx/drd',
})

const router = useRouter()
const currentradio = ref('')
const tableData = ref([])
const gysData = ref([])
const ykData = ref([])

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
    export_table_to_excel('#exportTable', '调入单')
}

watch(
    () => formData.KFBM,
    (val) => {
        if (val) {
            getDrdsList()
        }
    }
)

const handleSizeChange = (v: any) => {
    formData.size = v
    getDrdsList()
}

const handleCurrentChange = (v: any) => {
    formData.page = v
    getDrdsList()
}

// 调入单列表
const getDrdsList = async () => {
    const res = await getDrdList({ agrs: { ...formData } })
    tableData.value = res.data
    formData.count = res.count
}

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
    getDrdsList()
}

const ykDrdLokk = (row) => {
    router.push({
        path: '/admin/ykzx/drd/look',
        query: {
            type: 'look',
            DJID: row.DJID,
            KFBM: row.KFBM,
            DJH: row.DJH,
            ID: row.ID,
        },
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
</style>
