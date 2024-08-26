<template>
    <!-- 关联医生 -->
    <div>
        <div style="display: flex; padding: 10px 20px 0">
            <div class="sfjm-box">
                <Icon name="local-tips" style="color: rgb(255, 0, 0)" class="local-icon" />
                <span style="font-weight: 600; font-size: 12px">此处显示收费项目的价格.背景颜色为黄色的<br />那行是当前价格</span>
            </div>
            <div>
                <el-button type="primary" @click="tjPriceBtn">
                    <Icon name="local-create" style="color: rgb(241, 241, 241)" class="local-icons" />
                    调价
                </el-button>
                <el-checkbox
                    v-model="checked"
                    @change="priceChange"
                    :true-label="1"
                    :false-label="0"
                    label="显示历史价格"
                    style="margin-left: 10px"
                />
            </div>
        </div>

        <div class="disable-hover-highlight">
            <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                style="width: 100%; margin-top: 10px"
                height="200px"
                class="ba-data-table w100"
                :highlight-current-row="false"
                :cell-style="{ background: 'transparent' }"
            >
                <el-table-column type="index" width="50" align="center" />
                <el-table-column property="DH" label="单据号" width="130"> </el-table-column>
                <el-table-column property="ZXSJ" label="执行日期" width="170"> </el-table-column>
                <el-table-column property="YXSJ" label="终止日期" width="170"> </el-table-column>
                <el-table-column property="YJ" label="原价" width="80"> </el-table-column>
                <el-table-column property="XJ" label="现价" width="80"> </el-table-column>
                <el-table-column prop="BDYY" label="变动原因" width="100" align="center">
                    <template #default="scope">
                        <span class="span-color-true" v-if="scope.row.BDYY == 1">初始定价</span>
                        <span class="span-color-false" v-if="scope.row.BDYY == 2">日常调价</span>
                    </template>
                </el-table-column>
                <el-table-column property="ZZY" label="操作员" width="100"> {{ adminInfo.nickname }} </el-table-column>
                <el-table-column property="GXSJ" label="操作时间" width="200"> </el-table-column>
                <el-table-column width="125" prop="TJSM" label="调价说明"></el-table-column>
            </el-table>
        </div>

        <!-- 表单 -->
        <EditForm :rowBm="prop.rowBM" ref="sfEditRef" :tableData="tableData" @refresh="refresh" />
    </div>
</template>

<script setup lang="ts">
import { provide, reactive, onMounted, watch, nextTick, ref } from 'vue'
import { getCxzljmb } from '/@/api/backend/jcgl/zlzdwh'
import EditForm from './edit.vue'
import Table from '/@/components/table/index.vue'
import { useAdminInfo } from '/@/stores/adminInfo'

const adminInfo = useAdminInfo()

const sfEditRef = ref(null)
const prop = defineProps(['rowBM'])
const checked = ref(false)
const tableData = ref([])
const arr = ref([])

const priceChange = (val) => {
    getCxzl()
}

const refresh = () => {
    getCxzl()
}

const tableRowClassName = ({ row }: { row: any }) => {
    if (row.ZT === 1) {
        return 'yellow-background'
    }
    return ''
}

//调价
const tjPriceBtn = () => {
    sfEditRef.value.drawerData.ssdialogVisible = true
}

const getCxzl = async () => {
    let data = {
        agrs: {
            XMBM: prop.rowBM,
        },
    }
    if (!checked.value) {
        const res = await getCxzljmb(data)
        let newData = res.data.filter((item) => {
            return item.ZT == 1
        })
        tableData.value.splice(0, tableData.value.length, ...newData)
        console.log('tableData.value: ', tableData.value)
    } else {
        const res = await getCxzljmb(data)
        tableData.value = res.data
    }
}

onMounted(() => {
    getCxzl()
})

watch(
    () => prop.rowBM,
    async (val) => {
        if (val) {
            getCxzl()
        }
    }
)
</script>

<style scoped lang="scss">
.sfjm-box {
    display: flex;
    align-items: center;
    margin-right: 10px;
    .local-icon {
        margin-right: 10px;
        font-size: 23px;
    }
}
.local-icons {
    font-size: 14px;
    margin-right: 5px;
}
:deep(.yellow-background) {
    background-color: yellow;
}
</style>
