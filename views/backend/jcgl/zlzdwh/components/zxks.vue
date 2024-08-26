<template>
    <div>
        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <div class="zxks-box">
            <div class="sfjm-box">
                <Icon name="local-tips" style="color: rgb(255, 0, 0)" class="local-icon" />
                <span style="font-weight: 600">本页面仅供参考,如需修改请双击</span>
            </div>
            <div style="display: flex">
                <el-form-item label="门诊执行科室" style="margin-right: 25px">
                    <el-select v-model="MZZXKS" :disabled="true" placeholder="门诊执行科室" clearable style="width: 100%">
                        <el-option v-for="opt in state.mzzxksArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="住院执行科室">
                    <el-select v-model="ZYZXKS" :disabled="true" placeholder="住院执行科室" clearable style="width: 100%">
                        <el-option v-for="opt in state.mzzxksArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                    </el-select>
                </el-form-item>
            </div>
        </div>
        <el-table
            :data="state.mzzxksData"
            style="width: 100%; margin-top: 10px"
            height="200px"
            class="ba-data-table w100"
            :highlight-current-row="false"
            border
            @row-dblclick="dblclick"
        >
            <el-table-column type="index" width="50" align="center" />
            <el-table-column prop="KDKSBM" label="来源" width="120">
                <template #default="scope">
                    <el-select v-model="scope.row.BRLY" placeholder="请选择" filterable :disabled="true">
                        <el-option v-for="opt in state.lyArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                    </el-select>
                </template>
            </el-table-column>

            <el-table-column prop="ZXKSBM" label="执行科室" width="200">
                <template #default="scope">
                    <el-select v-model="scope.row.ZXKSBM" placeholder="请选择" filterable style="width: 100%" :disabled="true">
                        <el-option v-for="opt in state.ksArr" :key="opt.KSBM" :label="opt.KSMC" :value="opt.KSBM"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column prop="KDKSBM" label="服务科室" width="560">
                <template #default="scope">
                    <el-select v-model="scope.row.FWKS" placeholder="请选择" filterable multiple style="width: 100%" :disabled="true">
                        <el-option v-for="opt in state.kdksArr" :key="opt.KSBM" :label="opt.KSMC" :value="opt.KSBM"></el-option>
                    </el-select>
                </template>
            </el-table-column>
        </el-table>

        <DdbczxksForm
            ref="flag"
            :rowBM="prop.rowBM"
            :mxtableData="prop.mxtableData"
            :xfxmRowData="prop.xfxmRowData"
            @currentRowData="currentRowData"
            :ksArr="state.ksArr"
            :kdksArr="state.kdksArr"
            :index="1"
        />
        <!-- 表单 -->
        <!-- <EditForm currentRowData:="currentRowData" /> -->
    </div>
</template>

<script setup lang="ts">
import { provide, reactive, onMounted, watch, nextTick, ref } from 'vue'
import EditForm from '../edit.vue'
import { getCxzlzxks } from '/@/api/backend/jcgl/zlzdwh'
import { getKsList } from '/@/api/common'
import { useAdminInfo } from '/@/stores/adminInfo'
import { emit } from 'process'
import DdbczxksForm from './ddbczxks.vue'
const adminInfo = useAdminInfo()

const prop = defineProps(['rowBM', 'mxtableData', 'index', 'xfxmRowData'])
const emit = defineEmits(['currentRowData'])
const MZZXKS = ref()
const ZYZXKS = ref()
const flag = ref()

const currentRowData = (row: any) => {
    emit('currentRowData', row)
}

const state: {
    lyArr: any
    ksArr: any
    kdksArr: any
    mzzxksData: any
    mzzxksArr: any
} = reactive({
    lyArr: [
        { BM: 1, MC: '门诊' },
        { BM: 2, MC: '住院' },
    ],
    ksArr: [],
    kdksArr: [],
    mzzxksData: [],
    mzzxksArr: [
        { BM: 0, MC: '无明确执行科室' },
        { BM: 1, MC: '病人科室' },
        { BM: 2, MC: '病人病区' },
        { BM: 3, MC: '操作员所在科室' },
        { BM: 4, MC: '指定科室执行' },
        { BM: 6, MC: '开单人所在科室' },
    ],
})

const dblclick = () => {
    // emit('currentRowData', row)
    flag.value.dialogVisble = true
}

/**
 * 加载开单和执行科室
 */
getKsList().then((res) => {
    console.log(res)

    state.ksArr = res.data.options
    let kdks: any = []
    res.data.options.forEach((item: any) => {
        if (item.KSLX != '11.病区') {
            kdks.push(item)
        }
    })
    state.kdksArr = kdks
})

const getCXks = () => {
    // 查询诊疗执行科室
    getCxzlzxks({ jgbm: adminInfo.jgbm, agrs: prop.rowBM }).then((res) => {
        let arr: any = []
        res.data.forEach((item: any) => {
            arr.push({ BRLY: item.BRLY, FWKS: item.FWKS, ZXKSBM: item.ZXKSBM })
        })
        state.mzzxksData = arr
    })
}

const getCXkss = () => {
    // 查询诊疗执行科室
    // prop.xfxmRowData.find((item) => {
    //     if (item.XMBM == prop.rowBM) {
    //         MZZXKS.value = item.MZZXKS
    //         ZYZXKS.value = item.ZYZXKS
    //     }
    // })
    MZZXKS.value = prop.xfxmRowData.MZZXKS
    ZYZXKS.value = prop.xfxmRowData.ZYZXKS
}

watch(
    () => prop.index,
    (val) => {
        if (val == 1) {
            //getCXks()
            //getCXkss()
        }
    }
)

watch(
    () => prop.mxtableData,
    (val) => {
        state.mzzxksData = val
    }
)

watch(
    () => prop.xfxmRowData,
    (val) => {
        if (val) {
            console.log('prop.xfxmRowData', prop.xfxmRowData)
            MZZXKS.value = val.MZZXKS
            ZYZXKS.value = val.ZYZXKS
        }
    }
)

onMounted(() => {
    getCXkss()
    //getCXks()
    //getCXkss()
})
</script>

<style scoped lang="scss">
.zxks-box {
    display: flex;
    flex-direction: column;
    padding: 10px 20px 0;
    .el-form-item {
        margin-bottom: 0px;
    }
}
.sfjm-box {
    display: flex;
    align-items: center;
    margin-right: 10px;
    margin-bottom: 10px;
    .local-icon {
        margin-right: 8px;
        font-size: 23px;
    }
}
</style>
