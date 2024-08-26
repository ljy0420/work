<template>
    <div class="br-list-box">
        <div class="br-filter">
            <el-input v-model="state.keywords" placeholder="请输入文字(支持模糊搜索)">
                <template #suffix>
                    <Icon name="local-find" color="#409eff" />
                </template>
            </el-input>
        </div>
        <div class="br-container">
            <el-table
                v-loading="state.loading"
                class="ba-data-table w100"
                header-cell-class-name="table-header-cell"
                :data="props.hzList"
                highlight-current-row
                height="100%"
                @current-change="currentChange"
                @row-click="onRowClick"
            >
                <el-table-column prop="BRXM" label="姓名" width="70" />
                <el-table-column prop="SJLY" label="号源" width="130">
                    <template #default="scope">
                        <span v-if="scope.row.SJLY !== undefined && state.SJLY[scope.row.SJLY] !== undefined">{{
                            state.SJLY[scope.row.SJLY].label
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="GHLXMC" label="挂号类型" width="90" />
                <el-table-column prop="MZBLH" label="病历号" width="150" />
                <el-table-column prop="DJSJ" label="预约时间" width="160" />

                <el-table-column width="30" fixed="right" align="center">
                    <template #default="scope">
                        <el-dropdown placement="left" v-if="scope.row.ID == state.currentBrid">
                            <el-button type="text" plain>
                                <Icon name="local-more" style="color: #59a7ff" class="local-icon" />
                            </el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="Jzbtn(scope.row)">接诊</el-dropdown-item>
                                    <el-dropdown-item>标记过号</el-dropdown-item>
                                    <el-dropdown-item>转科</el-dropdown-item>
                                    <el-dropdown-item>取消接诊</el-dropdown-item>
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
import { ElMessage } from 'element-plus'
import { brjzztxg } from '/@/api/backend/lczlzx/brlist'
const emit = defineEmits(['rowChange'])
const props = defineProps(['ksData', 'hzList'])
const state: {
    loading: boolean
    keywords: string
    currentBrid: any
    SJLY: any
} = reactive({
    loading: false,
    keywords: '',
    currentBrid: 0,
    SJLY: [
        { value: 0, label: '挂号处收费' },
        { value: 1, label: '表示收费模式直接收费病人' },
        { value: 2, label: '医生站简易挂号' },
        { value: 3, label: '体检' },
        { value: 4, label: '微信' },
        { value: 5, label: '互联网医院' },
        { value: 6, label: '自助机' },
    ],
})

const Jzbtn = (row: any) => {
    let data = {
        agrs: {
            LX: '接诊',
            JZID: row.JZID,
            GHKSBM: props.ksData,
            JZKSBM: props.ksData,
        },
    }
    brjzztxg(data).then((res) => {
        if (res.code != 1) {
            ElMessage({
                type: 'error',
                message: '接诊失败',
            })
        } else {
            ElMessage({
                type: 'success',
                message: '接诊成功',
            })
        }
    })
}

const currentChange = (row: any) => {
    emit('rowChange', row)
}

const onRowClick = (row: any) => {
    state.currentBrid = row.ID
}

onMounted(() => {
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
        height: calc(100% - 40px);
        margin-top: 10px;
    }
}
</style>
