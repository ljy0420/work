<template>
    <!-- 关联医生 -->
    <el-tabs v-model="state.activeTab" type="border-card" style="width: 100%">
        <el-tab-pane name="sfjm" label="收费价目">
            <Sfjm :rowBM="prop.rowBM" :index="0" />
        </el-tab-pane>
        <el-tab-pane name="zxks" label="执行科室">
            <Zxks :rowBM="prop.rowBM" :mxtableData="prop.mxtableData" :xfxmRowData="prop.xfxmRowData" @currentRowData="currentRowData" :index="1" />
        </el-tab-pane>
    </el-tabs>
</template>

<script setup lang="ts">
import { provide, reactive, watch, ref } from 'vue'
import Zxks from './zxks.vue'
import Sfjm from './sfjm.vue'
import { useAdminInfo } from '/@/stores/adminInfo'

const adminInfo = useAdminInfo()
const index = ref(0)
const emit = defineEmits(['currentRowData'])
const prop = defineProps(['rowBM', 'mxtableData', 'xfxmRowData'])

const currentRowData = (row) => {
    emit('currentRowData', row)
}

const state: {
    ysData: any
    glData: any
    activeTab: string
} = reactive({
    ysData: [],
    glData: [],
    activeTab: 'sfjm',
})
</script>

<style scoped lang="scss">
:deep(.el-tabs__content) {
    padding: 0;
}
</style>
