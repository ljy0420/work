<template>
    <!-- 关联医生 -->

    <div>
        <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info" show-icon />

        <!-- 表格顶部菜单 -->
        <TableHeader :buttons="['refresh', 'add', 'edit', 'delete', 'quickSearch']" quick-search-placeholder="输入关键字" />

        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <Table :pagination="false" max-height="750px">
            <template #ksbmSlot>
                <el-table-column prop="KSBM" label="科室名称" width="150" align="center">
                    <template #default="scope">
                        <!-- <span>{{ renderLx(scope.row.YSBM) }}</span> -->
                        <span>{{ scope.row.KSMC }}</span>
                    </template>
                </el-table-column>
            </template>
            <template #jggzSlot>
                <el-table-column prop="JGGZ" label="警告规则" width="150" align="center">
                    <template #default="scope">
                        <span v-if="scope.row.JGGZ == 0">无</span>
                        <span v-if="scope.row.JGGZ == 1">到限号数时提示</span>
                        <span v-if="scope.row.JGGZ == 2">挂号就提示</span>
                        <span v-if="scope.row.JGGZ == 3">满号禁止</span>
                    </template>
                </el-table-column>
            </template>
        </Table>

        <!-- 表单 -->
        <EditFormKs :ksList="state.ksList" :rowBm="prop.rowBm" />
    </div>
</template>

<script setup lang="ts">
import { provide, reactive, onMounted, watch, nextTick } from 'vue'
import baTableClass from '/@/utils/baTableThree'
import EditFormKs from './editKs.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/other.vue'
import { getCxmzys, getCxghlxglry } from '/@/api/backend/jcgl/ghlxwh'
import { baTableApi3, getKsList } from '/@/api/common'
import { useAdminInfo } from '/@/stores/adminInfo'

const adminInfo = useAdminInfo()

const prop = defineProps(['rowBm'])

const state: {
    ksList: any
    glData: any
    activeTab: string
} = reactive({
    ksList: [],
    glData: [],
    activeTab: 'glys',
})

const baTable = new baTableClass(
    new baTableApi3('/api/v1/xtsjwh/ghlxwh/Cxghlxglks'),
    {
        expandAll: true,
        column: [
            { type: 'selection', align: 'center' },
            { label: '挂号类别编码', prop: 'LBBM', align: 'left', width: 130 },
            { label: '科室编码', prop: 'YSBM', align: 'center', render: 'slot', slotName: 'ksbmSlot' },
            { label: '限约数', prop: 'XYS', align: 'center' },
            { label: '限号数', prop: 'XHS', align: 'center' },
            { label: '警告规则', prop: 'JGGZ', align: 'center', render: 'slot', slotName: 'jggzSlot' },
        ],
        pk: 'FLBM',
        dblClickNotEditColumn: [undefined],
        dragSortLimitField: 'SJBM',
    },
    {
        defaultItems: {
            // LX: prop.lxData,
        },
        labelWidth: 100,
    }
)

provide('baTable', baTable)

// let agrs = 43
const getIndex = (agrs) => {
    // baTable.table.filter!.agrs = 43
    // baTable.table.filter!.jgbm = adminInfo.jgbm
    baTable.getIndex(agrs)?.then(() => {
        if (baTable.table.data && baTable.table.data.length > 0) {
        }
    })
}

onMounted(() => {
    baTable.mount()

    getIndex(prop.rowBm)

    getKsList().then((res) => {
        state.ksList = res.data.options
    })
})

watch(
    () => prop.rowBm,
    (newVal) => {
        if (newVal) {
            nextTick(() => {
                getIndex(prop.rowBm)
            })
        }
    }
)
</script>

<style scoped lang="scss"></style>
