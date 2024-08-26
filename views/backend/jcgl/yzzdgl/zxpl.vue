<template>
    <div>
        <el-table ref="tableRef" class="ba-data-table w100 zxpl" :data="state.zxplData" v-loading="state.bwLoading" border
            height="530px" :v-loading="state.bwLoading" @selection-change="handleSelectionChange">
            <el-table-column type="selection" label="选择" width="50" />
            <el-table-column prop="PLMC" label="名称"></el-table-column>
            <el-table-column prop="YWMC" label="英文名称" width="170"></el-table-column>
            <el-table-column prop="PLCS" label="频率次数" width="100"> </el-table-column>
            <el-table-column prop="PLJG" label="频率间隔" width="100"> </el-table-column>
            <el-table-column prop="JGDW" label="间隔单位" width="100"> </el-table-column>
        </el-table>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch, nextTick } from 'vue'
import type { ElTable } from 'element-plus'
import { getPlzd } from '/@/api/backend/jcgl/plsj'
import { getYzxmYfyl } from '/@/api/backend/jcgl/yzxmzd'
import { useAdminInfo } from '/@/stores/adminInfo'

const adminInfo = useAdminInfo()

defineOptions({
    name: 'jcgl/yzzdgl/jcbw',
})

const tableRef = ref<InstanceType<typeof ElTable>>()
const props = defineProps({
    currentXmbm: {
        type: String,
    }
})

const emit = defineEmits(["yfylDataChange"]);

const state: {
    zxplData: any //执行频率
    currentXmbm: any
    yfylData: any //用法用量
    bwLoading: boolean
} = reactive({
    zxplData: [],
    currentXmbm: props.currentXmbm,
    yfylData: [],
    bwLoading: false
})

const loadZxpl = () => {
    getPlzd({}).then((res) => {
        state.zxplData = res.data
        state.bwLoading = false
        if (state.currentXmbm) {
            loadYfyl(state.currentXmbm)
        }
    }).finally(() => {
        state.bwLoading = false
    })
}

const loadYfyl = (xmbm: string) => {
    getYzxmYfyl({ agrs: xmbm }).then((res) => {
        console.log('用法用量', res)
        if (res.data && res.data.length > 0) {
            state.yfylData = res.data
            let plbmArr: any = []
            state.yfylData.forEach((item: any) => {
                if(!plbmArr.includes(item.PLBM)) {
                    plbmArr.push(item.PLBM)
                }
            })
            const rows = state.zxplData.filter((ele:any)=>plbmArr.includes(ele.PLBM))
            if(rows && rows.length>0) {
                rows.forEach((row: any) => {
                    tableRef.value!.toggleRowSelection(row, true)
                })
            }
        } else {
            state.yfylData = []
        }
    })
}

const handleSelectionChange = (selection: any) => {
    // if (selection.length > 1) {
    //     //控制单选
    //     tableRef.value!.clearSelection()
    //     tableRef.value!.toggleRowSelection(selection.pop())
    // } else {
    //     emit('zxplCheckedChange',selection)
    // }
    if (selection.length > 0) {
        const yfylItems: any = []
        let xz = 0
        selection.forEach((item: any) => {
            yfylItems.push({
                JGBM: adminInfo.jgbm,
                XMBM: state.currentXmbm,
                XZ: xz,
                YFBM: state.currentXmbm,
                PLBM: item.PLBM
            })
            xz++;
        })
        state.yfylData = yfylItems
    } else {
        state.yfylData = []
    }
    //emit('zxplCheckedChange',selection)
}

watch(
    () => state.yfylData,
    (val) => {
        emit('yfylDataChange', val)
    },
    {
        deep: true
    }
)

onMounted(() => {
    state.bwLoading = true
    nextTick(()=>{
        loadZxpl()
    })
})
</script>

<style scoped lang="scss">
.zxpl-data-table {
    :deep(.el-table__row .el-table__cell) {
        padding: 3px 0;
    }
}
</style>
