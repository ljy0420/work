<template>
    <div class="br-list-box">
        <div class="br-filter">
            <el-radio-group v-model="state.dateRangeType" @change="dateRangeChange">
                <el-radio :label="1">最近7天</el-radio>
                <el-radio :label="2">最近15天</el-radio>
                <el-radio :label="3">最近30天</el-radio>
            </el-radio-group>
            <el-form-item label="" style="margin-bottom: 5px">
                <el-date-picker
                    v-model="state.dateRange"
                    align="right"
                    type="datetimerange"
                    range-separator="-"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    format="YYYY-MM-DD HH:mm:ss"
                />
            </el-form-item>
            <el-radio-group v-model="state.searchType">
                <el-radio :label="1">快速查询</el-radio>
                <el-radio :label="2">读医保卡</el-radio>
                <el-radio :label="3">读身份证</el-radio>
            </el-radio-group>
            <div style="display: flex">
                <el-input v-model="state.keywords" placeholder="请输入文字(支持模糊搜索)" style="margin-right: 10px"> </el-input>
                <el-button type="primary">查询</el-button>
            </div>
        </div>
        <div class="title" style="margin-top: 10px; font-weight: 600">已诊（30人）</div>
        <div class="br-container">
            <el-table
                v-loading="state.loading"
                class="ba-data-table w100"
                header-cell-class-name="table-header-cell"
                :data="props.yzList"
                highlight-current-row
                height="100%"
                @current-change="currentChange"
                @row-click="onRowClick"
            >
                <el-table-column prop="XM" label="姓名" width="70" />
                <el-table-column prop="HY" label="号源" width="60" />
                <el-table-column prop="YYSJ" label="预约时间" width="100" />
                <el-table-column prop="GHLX" label="挂号类型" width="90" />
                <el-table-column prop="BLH" label="病历号" width="150" />
                <el-table-column width="30" fixed="right" align="center">
                    <template #default="scope">
                        <el-dropdown placement="left" v-if="scope.row.ID == state.currentBrid">
                            <el-button type="text" plain>
                                <Icon name="local-more" style="color: #59a7ff" class="local-icon" />
                            </el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item>回退</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'

const emit = defineEmits(['rowChange', 'filterChange'])
const props = defineProps(['yzList'])

const filter: {
    dateRange: any
} = reactive({
    dateRange: [],
})
const state: {
    loading: boolean
    keywords: string
    dateRange: any
    dateRangeType: any
    searchType: any
    currentBrid: any
} = reactive({
    loading: false,
    keywords: '',
    dateRange: '',
    dateRangeType: 1,
    searchType: 1,
    currentBrid: 0,
})

const currentChange = (row: any) => {
    emit('rowChange', row)
}

function formatDate(date: any) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

const dateRangeChange = (value: any) => {
    const end = new Date()
    const start = new Date()
    if (value == 1) {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        state.dateRange = [start, end]
    } else if (value == 2) {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 15)
        state.dateRange = [start, end]
    } else if (value == 3) {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        state.dateRange = [start, end]
    }
    const startTime = state.dateRange[0]
    const endTime = state.dateRange[1]
    // 将开始时间和结束时间转换为 "yyyy-mm-dd" 格式
    const startDate = formatDate(startTime)
    const endDate = formatDate(endTime)
    filter.dateRange = [startDate, endDate]
    emit('filterChange', filter)
}

const onRowClick = (row: any) => {
    state.currentBrid = row.ID
}

onMounted(() => {
    dateRangeChange(1)
    state.loading = true
    setTimeout(() => {
        state.loading = false
    }, 1000)
})
</script>

<style lang="scss" scoped>
.br-list-box {
    display: flex;
    flex-direction: column;
    position: relative;
    height: 100%;

    .br-container {
        height: calc(100% - 100px);
        margin-top: 10px;
    }
}

.br-filter {
    :deep(.el-radio__input) {
        display: none;
    }
}
</style>
