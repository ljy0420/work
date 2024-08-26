<template>
    <div class="default-main ba-table-box">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="6">
          <div class="ba-table-box">
            <el-table 
            :data="state.pjlxData" 
            style="width: 100%" 
            :highlight-current-row="true" 
            @cell-click="cellClickHandle"
            class="ba-data-table w100"
            header-cell-class-name="table-header-cell">
              <el-table-column prop="PJLXMC" label="票据类型" align="center"></el-table-column>
            </el-table>
          </div>
        </el-col>
        <el-col :xs="24" :sm="18">
          <div class="ba-table-box">
            <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info" show-icon />

            <!-- 表格顶部菜单 -->
            <TableHeader
                :buttons="state.btnArr"
                quick-search-placeholder="输入关键字"
            />

            <!-- 表格 -->
            <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
            <Table :pagination="false" max-height="750px" />

            <!-- 表单 -->
            <EditForm :RYZL="state.ryzlData" :PJLXROW="state.pjlxRow" @savePjrkEdit="savePjrkrefresh"/>
          </div>
        </el-col>
      </el-row>
    </div>
</template>

<script setup lang="ts">
import { reactive,provide, onMounted } from 'vue'
import baTableClass from '/@/utils/baTable'
import EditForm from './edit.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/index.vue'
import { defaultOptButtons } from '/@/components/table'
import { baTableApi } from '/@/api/common'
import { GetPiaoJulx,GetRenYuanxx } from '/@/api/backend/cwgl/pjrkmx'

defineOptions({
    name: 'cwgl/pjrkgl',
})


const optButtons = defaultOptButtons(['edit', 'delete'])

const baTable = new baTableClass(
    new baTableApi('/api/v1/cwgl/pjrkmx/'),
    {
        column: [
            { type: 'selection', align: 'center' },
            { label: '编码', prop: 'ID', align: 'center',  width: 130 },
            { label: '单号', prop: 'DH', align: 'center',  width: 130 },
            { label: '前缀', prop: 'QZ', align: 'center',  width: 130 },
            { label: '起始号码', prop: 'QSHM', align: 'center',  width: 130 },
            { label: '结束号码', prop: 'JSHM', align: 'center',  width: 130 },
            { label: '起始值', prop: 'QSZ', align: 'center',  width: 130 },
            { label: '结束值', prop: 'JSZ', align: 'center',  width: 130 },
            { label: '数量', prop: 'SL', align: 'center',  width: 130 },
            { label: '库存数量', prop: 'KCSL', align: 'center', width: 130 },
            { label: '入库人姓名', prop: 'RKRXM', align: 'center', width: 130 },
            { label: '保管人姓名', prop: 'BGRXM', align: 'center', width: 130 },
            { label: '入库时间', prop: 'RKSJ', align: 'center', width: 130 },
            { label: '备注', prop: 'BZ', align: 'center', width: 300 },
            { label: '有效状态', prop: 'ZT', align: 'center', width: 100, render: 'switch' },
            {
                label: '操作',
                align: 'center',
                width: '100',
                render: 'buttons',
                buttons: optButtons,
                fixed: 'right',
            },
        ],
        dblClickNotEditColumn: [undefined, 'ZT'],
    },
    {
        defaultItems: {
            PXH: 0,
            YXZT: '1',
        },
    }
)

const state: {
    tableRadio: any,
    pjlxData: any,
    ryzlData: any,
    pjlxRow: any,
    btnArr: any
} = reactive({
    tableRadio: '',
    pjlxData: [],
    ryzlData: [],
    pjlxRow: {},
    btnArr: []
})

const cellClickHandle = (row:any) => {
  state.pjlxRow=row
  state.btnArr = ['refresh', 'add', 'edit', 'delete', 'quickSearch', 'columnDisplay']
  baTable.table.filter!.PJLXBM = row.PJLXBM
  baTable.getIndex()
}

const savePjrkrefresh = () => {
  baTable.table.filter!.PJLXBM = state.pjlxRow.PJLXBM
  baTable.getIndex()
}
provide('baTable', baTable)

onMounted(()=>{
  GetPiaoJulx().then(res=>{
    state.pjlxData=res.data
  })
  GetRenYuanxx().then(res=>{
    state.ryzlData=res.data
  })
})

</script>

<style scoped lang="scss"></style>
