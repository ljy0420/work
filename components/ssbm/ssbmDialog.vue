<template>
    <el-dialog v-model="ssdialogVisible" title="选择手术编码" width="30%">
        <!-- 搜索 -->
        <el-form :model="formData" class="searchForm" :inline="true">
            <el-form-item label-width="80px">
                <el-input v-model="formData.ssKeywords" placeholder="搜索关键字" clearable> </el-input>
            </el-form-item>
            <el-form-item style="margin-left: 50px">
                <el-button size="small" type="primary" @click="submitForm">查询</el-button>
                <el-button size="small" @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>
        <el-table ref="tableref" :data="shbmData" stripe style="width: 100%" height="200">
            <el-table-column width="55">
                <template #default="{ row }">
                    <el-radio :key="row.BM" v-model="radio1" :label="row.BM" @click="radio(row)"></el-radio>
                </template>
            </el-table-column>
            <el-table-column label="编码" align="center">
                <template #default="{ row }">
                    <span>{{ row.BM }}</span>
                </template>
            </el-table-column>
            <el-table-column label="名称" align="center">
                <template #default="{ row }">
                    <span>{{ row.MC }}</span>
                </template>
            </el-table-column>
        </el-table>
        <div class="ss-pagination">
            <el-pagination
                small
                layout="prev, pager, next, total"
                v-model:currentPage="formData.page"
                ::page-sizes="[15, 25, 50, 100]"
                v-model:page-size="formData.pageSize"
                background
                align="right"
                :total="formData.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            >
            </el-pagination>
        </div>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="ssdialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitSsbm">保存</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { reactive, ref, watch, onMounted } from 'vue'
import { getSszd } from '/@/api/common'

const radio1 = ref('')
const ssdialogVisible = ref(false)
const emit = defineEmits(['updateSelectRow'])
const shbmData = ref([])

const formData = reactive({
    page: 1,
    ssKeywords: '',
    pageSize: 20,
    total: 0,
})

const selectRows: any = ref([])

const radio = (v: any) => {
    selectRows.value = v
}

const handleSizeChange = (v: any) => {
    console.log(v, 'handl')
}

const handleCurrentChange = (v: any) => {
    formData.page = v
    getSszdList(formData.page, '')
}

const submitForm = () => {
    getSszdList(1, formData.ssKeywords)
}

const resetForm = () => {
    getSszdList(1, '')
}

const submitSsbm = () => {
    ssdialogVisible.value = false
    // 直接调用
    emit('updateSelectRow', selectRows.value)
}
/**
 * 查询手术字典
 * @param page
 * @param keywords
 */
const getSszdList = (page: number, keywords: string) => {
    formData.ssKeywords = keywords
    getSszd({ agrs: { fenLeiBM: '3', yxzt: '1', page: page, size: formData.pageSize, keywords: keywords } }).then((res) => {
        shbmData.value = res.data.options
        formData.total = res.count
    })
}

defineExpose({
    ssdialogVisible,
    radio1,
})
onMounted(() => {
    getSszdList(formData.page, '')
})
</script>

<style lang="scss" scoped>
:deep .el-radio__label {
    font-size: 0;
}
.ss-pagination {
    margin-top: 30px;
    display: flex;
    justify-content: flex-end;
}
</style>
