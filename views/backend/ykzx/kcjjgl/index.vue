<template>
    <div class="layout-box">
        <div class="search-box">
            <el-form :model="formData" :inline="true" label-width="auto" class="zw-table-search">
                <el-form-item label="库房" label-width="40">
                    <el-select v-model="formData.KFBM" placeholder="请选择库房" @change="kfChange" class="kf-select">
                        <el-option v-for="opt in state.kfData" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="药品分类">
                    <el-select v-model="formData.YPFL" clearable filterable placeholder="请选择药品分类" @change="ypChange">
                        <el-option v-for="opt in state.ypData" :key="opt.FLBM" :label="opt.FLMC" :value="opt.FLBM"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="检索" label-width="40">
                    <el-input v-model="formData.keywords" type="string" placeholder="请输入文字(支持模糊搜索)"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="getkcjjList">查询</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-table
            ref="tableref"
            :data="tableData"
            stripe
            class="ba-data-table w100"
            height="calc(100vh - 190px)"
            :header-row-class-name="'custom-header'"
        >
            <el-table-column label="NO" type="index" width="50" align="center" />
            <el-table-column prop="YPBM" label="编码" align="center" width="120">
                <template #default="{ row }">
                    {{ row.YPBM }}
                </template>
            </el-table-column>
            <el-table-column prop="YPMC" label="名称" align="center" width="150"> </el-table-column>
            <el-table-column prop="GG" label="规格" align="center" width="120"> </el-table-column>
            <el-table-column prop="CD" label="产地" align="center" width="200"> </el-table-column>
            <el-table-column prop="JBDW" label="单位" align="center" width="70"> </el-table-column>
            <el-table-column prop="SX" label="上限" align="center" width="80">
                <template #default="scope">
                    <template v-if="scope.row.editing">
                        <el-input v-model="scope.row.SX" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                    </template>
                    <template v-else>{{ scope.row.SX }}</template>
                </template>
            </el-table-column>
            <el-table-column prop="XX" label="下限" align="center" width="80">
                <template #default="scope">
                    <template v-if="scope.row.editing">
                        <el-input v-model="scope.row.XX" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                    </template>

                    <template v-else>{{ scope.row.XX }}</template>
                </template>
            </el-table-column>
            <el-table-column prop="HWMC" label="货位" align="center" width="120">
                <template #default="scope">
                    <template v-if="scope.row.editing">
                        <el-cascader
                            style="width: 100%"
                            v-model="scope.row.HWBM"
                            :props="defaultProps"
                            :options="groupOptions"
                            :show-all-levels="false"
                            filterable
                            placeholder="请选择"
                        />
                    </template>
                    <template v-else>
                        {{ scope.row.HWMC }}
                    </template>
                </template>
            </el-table-column>
            <el-table-column prop="JS" label="禁售" align="center" width="80">
                <template #default="scope">
                    <el-switch v-model="scope.row.JS" :active-value="1" :inactive-value="0" :disabled="!scope.row.editing"></el-switch>
                </template>
            </el-table-column>
            <el-table-column prop="JG" label="禁购" align="center" width="80">
                <template #default="scope">
                    <el-switch v-model="scope.row.JG" :active-value="1" :inactive-value="0" :disabled="!scope.row.editing"></el-switch>
                </template>
            </el-table-column>
            <el-table-column prop="SL" label="库存数量" align="center" width="90"> </el-table-column>
            <el-table-column prop="YXQ" label="有效期" align="center" width="160"> </el-table-column>
            <el-table-column prop="GJBM" label="国家医保编码" align="center" width="130"> </el-table-column>
            <el-table-column prop="GJMC" label="国家医保名称" align="center" width="140"> </el-table-column>
            <el-table-column label="操作" align="center" fixed="right" width="150">
                <template #default="scope">
                    <div class="table-item">
                        <!-- <div class="btn" @click="editKcjjglBtn(scope)">
                            {{ scope.row.editing ? '确认' : '编辑' }}
                        </div>
                        <div class="btn" @click="cancelBtn(scope)" v-if="scope.row.editing">取消</div> -->
                        <el-button size="small" @click="editKcjjglBtn(scope)" type="primary">{{ scope.row.editing ? '确认' : '编辑' }}</el-button>
                        <el-button size="small" @click="cancelBtn(scope)" v-if="scope.row.editing">取消</el-button>
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
                :page-sizes="[15, 20, 25, 50]"
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
    </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { cxhwzd } from '/@/api/backend/jcgl/hwgl'
import { cloneDeep } from 'lodash-es'
import { getKcjjList, getykList, getypflList, kcjjdetails } from '/@/api/backend/yk/kcjjgl'

const tableDataBackup = ref([])
const tableData = ref([])

const formData = reactive({
    keywords: '',
    KFBM: '',
    YPFL: '',
    page: 1,
    size: 15,
    count: 0,
})
const state: {
    kfData: any
    ypData: any
} = reactive({
    kfData: [],
    ypData: [],
})

tableData.value.forEach((item) => {
    item.editing = false
})

const groupOptions = ref([])
const defaultProps = {
    checkStrictly: true,
    emitPath: false,
    multiple: false,
    label: 'HWMC',
    value: 'HWBM',
}

watch(
    () => formData.KFBM,
    async (val) => {
        if (val) {
            const r = await cxhwzd({ agrs: { KFBM: val, YWLX: 'Tree' } })
            groupOptions.value = r.data

            const res = await getypflList({ agrs: val })
            state.ypData = res.data

            getkcjjList()
        }
    }
)

const cancelBtn = (scope) => {
    //     严谨
    //     scope.row.SX = tableDataBackup.value.SX
    //     scope.row.XX = tableDataBackup.value.XX
    //     scope.row.HWBM = tableDataBackup.value.HWBM
    //     scope.row.JS = tableDataBackup.value.JS
    //     scope.row.JG = tableDataBackup.value.JG
    //     scope.row.editing = false
    Object.assign(scope.row, tableDataBackup.value)
    scope.row.editing = false
}

const editKcjjglBtn = (scope) => {
    if (!scope.row.editing) {
        tableData.value.forEach((item) => {
            if (item.editing && item !== scope.row) {
                cancelBtn({ row: item })
            }
        })
        scope.row.editing = true
        tableDataBackup.value = cloneDeep(scope.row)
    } else {
        let data = {
            agrs: {
                LX: '修改',
                ZB: {
                    KFBM: formData.KFBM,
                    YPBM: scope.row.YPBM,
                    HWBM: scope.row.HWBM,
                    SX: scope.row.SX,
                    XX: scope.row.XX,
                    JS: scope.row.JS,
                    JG: scope.row.JG,
                },
            },
        }
        kcjjdetails(data).then((res) => {
            if (res.code == 1) {
                getkcjjList()
                scope.row.editing = false
                ElMessage.success('编辑成功')
            }
        })
    }
}

const getkcjjList = async () => {
    const res = await getKcjjList({ agrs: { ...formData } })
    tableData.value = res.data
    formData.count = res.count
}

const resetForm = () => {
    formData.keywords = ''
    formData.YPFL = ''
    getkcjjList()
}

const kfChange = async (value: string) => {
    getkcjjList()
}

const ypChange = async (value: string) => {
    getkcjjList()
}

const loadOptions = async () => {
    getykList({ agrs: '3' }).then((res) => {
        state.kfData = res.data
        if (res.data && res.data.length > 0) {
            state.kfData = res.data
            if (state.kfData.length > 0) {
                formData.KFBM = state.kfData[0]?.BM
            }
        }
    })
}

const handleSizeChange = (v: any) => {
    formData.size = v
    getkcjjList()
}

const handleCurrentChange = (v: any) => {
    formData.page = v
    getkcjjList()
}

onMounted(() => {
    // getykList({ agrs: '1' }).then((r) => {
    //     state.kfData = r.data
    // })
    loadOptions()
})
</script>

<style scoped lang="scss">
:deep(.custom-header) th {
    color: #000;
}
.kf-select :deep(.el-input) {
    width: 100px;
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
        margin: 10px 0 5px;
        .zw-table-search {
            background: #ffffff;
            border-bottom: solid 1px #cecece;
            box-sizing: border-box;
            padding: 10px 10px 0;
            :deep(.el-form-item) {
                margin-bottom: 10px;
                .el-select {
                    // width: 300px;
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
        display: flex;
        justify-content: center;
        margin-top: 5px;
    }
}
.table-item {
    display: flex;
    margin-left: 10px;
    div {
        width: 50px;
        height: 24px;
        background: #ffffff;
        border-radius: 2px;
        border: 1px solid #eaeaea;
        line-height: 24px;
        margin-right: 5px;
        font-size: 14px;
        color: #33302d;
        text-align: center;
        cursor: pointer;
    }
}
</style>
