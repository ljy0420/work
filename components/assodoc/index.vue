<template>
    <!-- 关联医生 -->
    <el-tabs v-model="state.activeTab" type="border-card" style="width: 700px">
        <el-tab-pane name="glys" label="关联医生">
            <Glys :rowBm="prop.rowBm" />
        </el-tab-pane>
        <el-tab-pane name="glks" label="关联科室">
            <Glks :rowBm="prop.rowBm" />
        </el-tab-pane>
    </el-tabs>
</template>

<script setup lang="ts">
import { provide, reactive } from 'vue'
import Glys from './Glys.vue'
import Glks from './Glks.vue'
import { useAdminInfo } from '/@/stores/adminInfo'

const adminInfo = useAdminInfo()

const prop = defineProps(['rowBm'])

const state: {
    ysData: any
    glData: any
    activeTab: string
} = reactive({
    ysData: [],
    glData: [],
    activeTab: 'glys',
})
</script>

<style scoped lang="scss"></style>
