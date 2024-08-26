<template>
    <div>
        <el-dialog
            class="ba-operate-dialog"
            :close-on-click-modal="false"
            :model-value="state.show"
            @close="cancel"
            :destroy-on-close="true"
            align-center
            id="ddbczxks-dialog"
            width="1271px"
        >
            <template #header>
                <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']">
                    {{ '留观登记簿' }}
                </div>
            </template>
            <div class="header">
                <div class="content">
                    <el-form class="cx">
                        <el-row :gutter="0">
                            <el-col :xs="12" :sm="5">
                                <el-form-item prop="CXFS" label="查询方式：">
                                    <el-select v-model="form.CXFS" clearable style="width: 150px">
                                        <el-option v-for="opt in state.cxfsArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="12" :sm="6">
                                <el-form-item prop="CXNR" label="查询内容：">
                                    <el-input v-model="form.CXNR" type="string" placeholder="请输入查询内容"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="12" :sm="4" class="cxBtn">
                                <el-button type="primary">查询</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </div>
            <div class="main">
                <el-table
                    ref="tableRef"
                    :data="state.tableData"
                    border
                    highlight-current-row
                    @selection-change="onSelectionChange"
                    style="width: 100%"
                    class="ba-data-table w100"
                    header-cell-class-name="table-header-cell"
                    height="calc(100vh - 550px)"
                >
                    <el-table-column prop="RQ" label="日期" width="100" />
                    <el-table-column prop="BRXM" label="病人姓名" width="90"></el-table-column>
                    <el-table-column prop="SFZH" label="身份证号" width="120"> </el-table-column>
                    <el-table-column prop="GDDH" label="固定电话" width="120" />
                    <el-table-column prop="SJHM" label="手机号码" width="120" />
                    <el-table-column prop="JTDZ" label="家庭地址" width="150" />
                    <el-table-column prop="NL" label="年龄" width="70" />
                    <el-table-column prop="XB" label="性别" width="60" />
                    <el-table-column prop="XBZW" label="性别作为" width="90" />
                    <el-table-column prop="JGBM" label="机构编码" width="100" />
                    <el-table-column prop="LGBLH" label="留观病历号" width="120" />
                    <el-table-column prop="LGQSSJ" label="留观起始时间" width="150" />
                    <el-table-column prop="CBPD" label="初步判断" width="120" />
                    <el-table-column prop="JBBM" label="疾病编码" width="100" />
                    <el-table-column prop="LGZZSJ" label="留观截至时间" width="150" />
                    <el-table-column prop="DJRBM" label="登记人编码" width="100" />
                    <el-table-column prop="DJRXM" label="登记人姓名" width="110" />
                    <el-table-column prop="LGJSRBM" label="留观接收人编码" width="130" />
                    <el-table-column prop="LGJSRXM" label="留观接收人姓名" width="140" />
                </el-table>
                <div class="pagination">
                    <div class="fy-btn">
                        <el-button type="primary" @click="handleFirstClick" :disabled="currentPage <= 1">首页</el-button>
                        <el-button type="primary" @click="handleLastClick" :disabled="currentPage >= Math.ceil(total / pageSize)">末页</el-button>
                    </div>
                    <div class="fy">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[10, 20, 30, 40]"
                            :page-size="pageSize"
                            layout="sizes, prev, pager, next, jumper"
                            :total="total"
                        >
                        </el-pagination>
                    </div>
                    <div class="fy-ys">当前页数：{{ currentPage }}, 总页数：{{ Math.ceil(total / pageSize) }}</div>
                </div>
            </div>
            <template #footer>
                <div class="yd-from-footer">
                    <el-button @click="cancel" class="btn-form-cancel">关闭</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormItemRule } from 'element-plus'

const formRef = ref<FormInstance>()

const form = reactive({
    CXFS: '',
    CXNR: '',
})
const state: {
    loading: boolean
    show: boolean
    cxfsArr: any
    tableData: any
} = reactive({
    loading: false,
    show: false,
    cxfsArr: [
        { BM: 1, MC: '病人姓名' },
        { BM: 2, MC: '姓名首拼' },
        { BM: 3, MC: '身份证号' },
    ],
    tableData: [
        {
            RQ: '2023-04-13',
            BRXM: '黎宇宇',
            SFZH: '',
            GDDH: '13574425104',
            SJHM: '13574425104',
            JTDZ: '长沙湖南',
            NL: '29岁',
            XB: '1',
            XBZW: '男',
            JGBM: '530102',
            LGBLH: '2023000001',
            LGQSSJ: '2023/4/13 11:37:14',
            CBPD: '',
            JBBM: 'E25.001',
            LGZZSJ: '2023/4/13 11:37:23',
            DJRBM: '530102',
            DJRXM: '超级管理员',
            LGJSRBM: '530102',
            LGJSRXM: '超级管理员',
        },
        {
            RQ: '2024-01-30',
            BRXM: '唐雪见',
            SFZH: '',
            GDDH: '',
            SJHM: '',
            JTDZ: '不详',
            NL: '26岁',
            XB: '1',
            XBZW: '男',
            JGBM: '530102',
            LGBLH: '0000000346',
            LGQSSJ: '2024/2/2 16:29:02',
            CBPD: '',
            JBBM: 'B07.x04',
            LGZZSJ: '2024/2/2 16:34:47',
            DJRBM: '056',
            DJRXM: '刘万荣',
            LGJSRBM: '056',
            LGJSRXM: '刘万荣',
        },
        {
            RQ: '2024-03-07',
            BRXM: '归海一刀',
            SFZH: '',
            GDDH: '151744711204',
            SJHM: '',
            JTDZ: '',
            NL: '56岁',
            XB: '1',
            XBZW: '男',
            JGBM: '530102',
            LGBLH: '0000000405',
            LGQSSJ: '2024/3/7 11:37:28',
            CBPD: '',
            JBBM: 'A07.06.03',
            LGZZSJ: '',
            DJRBM: '056',
            DJRXM: '刘万荣',
            LGJSRBM: '',
            LGJSRXM: '',
        },
    ],
})

// 分页相关数据
const currentPage = ref(1) // 当前页数
const pageSize = ref(10) // 每页显示条数
const total = ref(100) // 总条数

// 当每页条数改变时触发
const handleSizeChange = (val) => {
    pageSize.value = val
    // 重新获取数据...
}

// 当当前页数改变时触发
const handleCurrentChange = (val) => {
    currentPage.value = val
    // 重新获取数据...
}

// 点击跳转到首页按钮时触发
const handleFirstClick = () => {
    currentPage.value = 1
    // 重新获取数据...
}

// 点击跳转到末页按钮时触发
const handleLastClick = () => {
    const lastPage = Math.ceil(total.value / pageSize.value)
    currentPage.value = lastPage
    // 重新获取数据...
}

const table = reactive({
    selection: [],
})

const onSelectionChange = (selection: any) => {
    table.selection = selection
}

const rules: Partial<Record<string, FormItemRule[]>> = reactive({})

const cancel = () => {
    state.show = false
}

const show = () => {
    state.show = true
}

onMounted(() => {})

defineExpose({
    show,
})
</script>
<style scoped lang="scss">
:deep(.el-select-tags-wrapper .el-tag) {
    color: #333;
}

:deep(.table1 .el-scrollbar__bar) {
    bottom: -10px;
}

.el-table :deep(.el-table__cell) {
    padding: 5px 5px;
    font-size: 12px;
}
.header {
    margin-top: 10px;
    .content {
        display: flex;
        align-items: center; /* 垂直居中 */
        justify-content: center; /* 水平居中 */
        height: 30px;
        margin-top: 10px;
        .cx {
            width: 100%;
            margin-top: 20px;
            .cxBtn {
                margin-left: 20px;
            }
        }
    }
}
.main {
    margin-left: 30px;
    margin-top: 10px;
    width: 1171px;
}
.btn-form-print {
    margin-left: 30px;
    width: 80px;
}

.ba-data-table {
    margin-top: 20px;
}
.pagination {
    margin-top: 20px;
    .fy-btn {
        display: inline-block;
    }
    .fy {
        margin-left: 10px;
        display: inline-block;
    }
    .fy-ys {
        margin-left: 10px;
        display: inline-block;
    }
}
</style>
