<template>
    <div class="layout-box">
        <el-dialog v-model="detailVisible" width="100%" class="ba-operate-dialog yzxmf-edit">
            <!-- 按钮部分 -->
            <div class="btn-box">
                <el-button size="large" type="primary">保存</el-button>
                <el-button size="large" type="primary">审核</el-button>
                <el-button size="large" type="primary">打印</el-button>
                <el-button size="large" type="primary">取消</el-button>
            </div>
            <h2 class="yk-title">药库订货单</h2>
            <!-- 搜索部分 -->
            <div class="search-box">
                <el-form :model="formData" :inline="true" label-width="auto" class="zw-table-search">
                    <el-row class="chat_form" :gutter="20">
                        <el-col :span="5">
                            <el-form-item label="开单日期">
                                <el-date-picker
                                    v-model="formData.KDRQ"
                                    type="date"
                                    placeholder="请选择开单日期"
                                    format="YYYY-MM-DD "
                                    value-format="YYYY-MM-DD"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="审核日期">
                                <el-date-picker
                                    v-model="formData.SHRQ"
                                    type="date"
                                    placeholder="请选择审核日期"
                                    format="YYYY-MM-DD "
                                    value-format="YYYY-MM-DD"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="单据号">
                                <el-input v-model="formData.DJH" type="string" placeholder="请输入单据号"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="供应商">
                                <el-select v-model="formData.GYS" placeholder="请选择库房" clearable @change="kfChange" style="width: 100%">
                                    <el-option v-for="opt in yfykArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="采购员">
                                <el-select v-model="formData.CGRBM" placeholder="请选择库房" clearable style="width: 100%" @focus="kfFocus">
                                    <el-option v-for="opt in lxData" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="5">
                            <el-form-item label="批准人">
                                <el-input type="text" placeholder="请输入批准人"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="备注">
                                <el-input type="text" placeholder="请输入备注"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="单据类型">
                                <el-input v-model="formData.keywords" type="string" placeholder="请输入单据类型"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="计划类型">
                                <el-input v-model="formData.keywords" type="string" placeholder="请输入计划类型"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="交易类型">
                                <el-input v-model="formData.keywords" type="string" placeholder="请输入交易类型"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="开单人">
                                <el-input v-model="formData.keywords" type="string" placeholder="请输入开单人"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="审核人">
                                <el-input v-model="formData.keywords" type="string" placeholder="请输入审核人"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div class="yd-card-body">
                <el-table
                    ref="tableref"
                    :data="state.ykData"
                    stripe
                    style="width: 100%"
                    class="color-table"
                    :header-cell-style="{ borderColor: '#e0e0e0' }"
                    :cell-style="{ borderColor: '#e0e0e0' }"
                >
                    <el-table-column prop="PXH" label="行号" align="center" width="150">
                        <template #default="{ row }">
                            <el-input v-model="row.PXH" type="string" :disabled="!row.isEdit" placeholder="请输入方法名称"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="药品" align="center" width="150">
                        <el-table-column prop="YPMC" label="品名" align="center" width="150">
                            <template #default="{ row }">
                                <el-select
                                    v-model="row.YPMC"
                                    placeholder="请选择采购类型"
                                    :disabled="!row.isEdit"
                                    clearable
                                    style="width: 100%"
                                    @change="selcet(row.YPMC, row)"
                                >
                                    <el-option v-for="opt in prop.ypInfo" :key="opt.YPBM" :label="opt.YPMC" :value="opt.YPBM"> </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="GG" label="规格" align="center" width="150">
                            <template #default="{ row }">
                                <el-input v-model="row.GG" type="string" :disabled="!row.isEdit" placeholder="请输入方法名称"></el-input>
                            </template>
                        </el-table-column>
                    </el-table-column>

                    <el-table-column prop="DW" label="单位" align="center" width="150">
                        <template #default="{ row }">
                            <el-select v-model="row.DW" placeholder="请选择采购类型" :disabled="!row.isEdit" clearable style="width: 100%">
                                <el-option v-for="opt in state.bmData" :key="opt.BM" :label="opt.MC" :value="opt.BM"> </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="SL" label="数量" align="center" width="150">
                        <template #default="{ row }">
                            <el-input v-model="row.SL" type="number" :disabled="!row.isEdit" placeholder="请输入方法名称"></el-input>
                        </template>
                    </el-table-column>

                    <el-table-column prop="jinjia" label="进价" align="center" width="150">
                        <el-table-column prop="JHJ" label="进货价" align="center" width="150">
                            <template #default="{ row }">
                                <el-input v-model="row.JHJ" type="number" :disabled="!row.isEdit" placeholder="请输入方法名称"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="JHJE" label="进货金额" align="center" width="150">
                            <template #default="{ row }">
                                <el-input v-model="row.JHJE" type="number" :disabled="!row.isEdit" placeholder="请输入方法名称"></el-input>
                            </template>
                        </el-table-column>
                    </el-table-column>

                    <el-table-column prop="address" label="零售价" align="center" width="150">
                        <el-table-column prop="LSJ" label="零售价" align="center" width="150">
                            <template #default="{ row }">
                                <el-input v-model="row.LSJ" type="number" :disabled="!row.isEdit" placeholder="请输入方法名称"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="LSJE" label="零售金额" align="center" width="150">
                            <template #default="{ row }">
                                <el-input v-model="row.LSJE" type="number" :disabled="!row.isEdit" placeholder="请输入方法名称"></el-input>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column prop="CD" label="产地" align="center" width="150">
                        <template #default="{ row }">
                            <el-input v-model="row.CD" type="string" :disabled="!row.isEdit" placeholder="请输入方法名称"></el-input>
                        </template>
                    </el-table-column>

                    <el-table-column prop="PZWH" label="批准文号" align="center" width="150">
                        <template #default="{ row }">
                            <el-input v-model="row.PZWH" type="string" :disabled="!row.isEdit" placeholder="请输入方法名称"></el-input>
                        </template>
                    </el-table-column>

                    <el-table-column prop="BZ" label="备注" align="center" width="150">
                        <template #default="{ row }">
                            <el-input v-model="row.BZ" type="string" :disabled="!row.isEdit" placeholder="请输入方法名称"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="操作" width="100" fixed="right" align="center">
                        <template #default="scope">
                            <el-button link v-blur type="primary" size="small" @click="editYk(scope.row)">
                                {{ scope.row.editTxt }}
                            </el-button>
                            <el-popconfirm title="您确定删除这条记录吗?" @confirm="deleteYk(scope.$index)">
                                <template #reference>
                                    <el-button link v-blur type="primary" size="small">删除</el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                    <template #empty>
                        <el-empty description="暂无数据" />
                    </template>
                </el-table>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { getyfyklist, getgysxxlist } from '/@/api/common'
import { dhdmx } from '/@/api/backend/jcgl/dhd'
import Edit from './edit.vue'
const radio1 = ref('')
const tableData = []
const detailVisible = ref(true)

const ykEditRef = ref(null)
const yfykArr = ref([])
const gysArr = ref([])
const current = ref('')
const prop = defineProps(['ywcl', 'type'])

const formData = reactive({
    KFBM: '',
    ZT: '',
    GYSBM: '',
    TIME: [],
    pageSize: 20,
    total: 0,
    keywords: '',
})

const lxData = [
    { BM: '1', MC: '西药' },
    { BM: '2', MC: '成药' },
    { BM: '3', MC: '草药' },
    { BM: '7', MC: '配方颗粒' },
]

const state: {
    ykData: any
    bmData: any
} = reactive({
    ykData: [],
    bmData: [],
})

const addYkjhdBtn = () => {
    ykEditRef.value.ssdialogVisible = true
}

const kfChange = (val) => {
    current.value = val
}

const editYk = (row: any) => {
    if (row.isEdit) {
        row.editTxt = '编辑'
    } else {
        row.editTxt = '确认'
    }
    row.isEdit = !row.isEdit
}

onMounted(() => {
    getyfyklist().then((res) => {
        yfykArr.value = res.data.options
    })
    getgysxxlist({ agrs: { DLBM: 2 } }).then((res) => {
        gysArr.value = res.data.options
    })

    //查询订货单明细 新增不用调，修改才调
    if (prop.type == 'edit') {
        dhdmx({ agrs: { DJID: '', KFBM: '', DJH: '' } }).then((res) => {
            // yfykArr.value = res.data.options
        })
    }
    state.ykData = prop.ywcl
    state.ykData.forEach((item: any) => {
        item.isEdit = false
        item.editTxt = '编辑'
    })
    console.log('state.ykData', state.ykData)
})
</script>

<style lang="scss" scoped>
.layout-box {
    padding: 0 16px;
    .btn-box {
        width: 100%;
        border: 1px solid #eaeaea;
        background: #f9f9f9;
        border-radius: 5px;
        padding: 12px 20px;
        margin-top: 20px;
    }
    .search-box {
        margin: 20px 0 10px;
        .zw-table-search {
            background: #f9f9f9;
            border: 1px solid #eaeaea;
            margin-bottom: 18px;
            box-sizing: border-box;
            padding: 10px 10px 0;
            :deep(.el-form-item) {
                margin-bottom: 10px;

                .el-select {
                    width: 100%;
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
        margin-top: 30px;
        display: flex;
        justify-content: flex-end;
    }
}
.yk-title {
    text-align: center;
}
</style>
