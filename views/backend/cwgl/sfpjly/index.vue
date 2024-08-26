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
          <EditForm :RYZL="state.ryzlData" :PJLXROW="state.pjlxRow" :PJKC="state.pjlxkcData" @savePjlyEdit="savePjlyrefresh"/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { provide, reactive, onMounted } from 'vue'
import baTableClass from '/@/utils/baTable'
import EditForm from './edit.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/index.vue'
import { defaultOptButtons } from '/@/components/table'
import { baTableApi } from '/@/api/common'
import { GetPiaoJulx,GetRenYuanxx,GetPiaoJurkmx } from '/@/api/backend/cwgl/pjlyjl'

defineOptions({
    name: 'cwgl/pjlyjl',
})


const optButtons = defaultOptButtons(['edit', 'delete'])

const baTable = new baTableClass(
    new baTableApi('/api/v1/cwgl/pjlyjl/'),
    {
        column: [
            { type: 'selection', align: 'center' },
            { label: '编码', prop: 'ID', align: 'center',  width: 70 },
            { label: '票据类型名称', prop: 'PJLXMC', align: 'center', width: 150 },
            { label: '领用人姓名', prop: 'LYRXM', align: 'center', width: 150 },
            { label: '起始号码', prop: 'QSHM', align: 'center', width: 150 },
            { label: '结束号码', prop: 'JSHM', align: 'center', width: 150 },
            { label: '领用时间', prop: 'CZSJ', align: 'center', width: 200 },
            { label: '操作员姓名', prop: 'CZYXM', align: 'center', width: 150 },
            { label: '当前号码', prop: 'DQHM', align: 'center', width: 150 },
            { label: '剩余数量', prop: 'SYSL', align: 'center', width: 150 },
            { label: '批号', prop: 'PH', align: 'center', width: 150 },
            { label: '备注', prop: 'BZ', align: 'center', width: 150 },
            { label: '发票代码', prop: 'FPDM', align: 'center', width: 150 },
            { label: '性质', prop: 'XZ', align: 'center', width: 100, render: 'switch' },
            {
                label: '操作',
                align: 'center',
                width: '100',
                render: 'buttons',
                buttons: optButtons,
                fixed: 'right',
            },
        ],
        dblClickNotEditColumn: [undefined],
    },
    {
        defaultItems: {
            YXZT: '1',
        },
    }
)

const state: {
    tableRadio: any,
    pjlxData: any,
    ryzlData: any,
    pjlxRow: any,
    btnArr: any,
    pjkcData: any,
    pjlxkcData: any
} = reactive({
    tableRadio: '',
    pjlxData: [],
    ryzlData: [],
    pjlxRow: {},
    btnArr: [],
    pjkcData: [],
    pjlxkcData: []
})

const cellClickHandle = (row:any) => {
  console.log(row.PJLXBM)
  state.pjlxkcData=state.pjkcData.filter((item:any)=> item.PJLXBM == row.PJLXBM)
  console.log(state.pjlxkcData)
  state.pjlxRow=row
  state.btnArr = ['refresh', 'add', 'edit', 'delete', 'quickSearch', 'columnDisplay']
  baTable.table.filter!.PJLXBM = row.PJLXBM
  baTable.getIndex()
}

const savePjlyrefresh = () => {
  baTable.table.filter!.PJLXBM = state.pjlxRow.PJLXBM
  baTable.getIndex()
}
provide('baTable', baTable)

baTable.mount()

onMounted(()=>{
  GetPiaoJulx().then(res=>{
    state.pjlxData=res.data
  })
  GetRenYuanxx().then(res=>{
    state.ryzlData=res.data
  })
  GetPiaoJurkmx().then(res=>{
    state.pjkcData=res.data
    console.log(res.data)
  })
})
</script>

<style scoped lang="scss"></style>
