<template>
    <div class="default-main">
        <el-row :gutter="10">
            <el-col :xs="24" :sm="2">
                <div class="fl-zone">
                    <el-radio-group size="large" v-model="state.DLBM" @change="dlbmChange" style="width: 100%;">
                        <el-radio-button label="2" style="width: 100%;">药品</el-radio-button>
                        <el-radio-button label="3" style="width: 100%;margin-top: 10px;">物品</el-radio-button>
                        <el-radio-button label="4" style="width: 100%;margin-top: 10px;">设备</el-radio-button>
                    </el-radio-group>
                </div>
            </el-col>
            <el-col :xs="24" :sm="22">
                <div class="ba-table-box">
                    <!-- 表格顶部菜单 -->
                    <TableHeader
                    :buttons="['refresh', 'add', 'edit', 'delete', 'quickSearch', 'columnDisplay']"
                    quick-search-placeholder="输入关键字"
                    />

                    <!-- 表格 -->
                    <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
                    <Table :pagination="false" height="calc(100vh - 139px)" />

                    <!-- 表单 -->
                    <EditForm />
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { provide, reactive } from 'vue'
import baTableClass from '/@/utils/baTable'
import EditForm from './edit.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/default.vue'
import { defaultOptBtns } from '/@/components/table'
import { baTableApi } from '/@/api/common'

const state: {
    DLBM: string
} = reactive({
    DLBM: '2',
})

defineOptions({
    name: 'xtgl/gysxxwh',
})

const optButtons = defaultOptBtns(['edit', 'delete'])

const baTable = new baTableClass(
    new baTableApi('/api/v1/xtsjwh/gysxxwh/'),
    {
        column: [
            { label: 'NO', type: 'index', align: 'center' },
            { label: '供应商编码', prop: 'GYSBM', align: 'left', width: 130 },
            { label: '供应商名称', prop: 'GYSMC', align: 'left', width: 200 },
            { label: '别名', prop: 'BM', align: 'left', width: 150 },
            { label: '联系人', prop: 'LXR', align: 'left', width: 100 },
            { label: '联系人电话', prop: 'LXRDH', align: 'left', width: 130 },
            { label: '业务范围', prop: 'YWFW', align: 'left', width: 150 },
            { label: '营业执照', prop: 'YYZZ', align: 'left', width: 150 },
            { label: '经营许可证', prop: 'JYXKZ', align: 'left', width: 130 },
            { label: 'GMP', prop: 'GMP', align: 'left', width: 130 },
            { label: 'GSP', prop: 'GSP', align: 'left', width: 130 },
            { label: '委托书', prop: 'WTS', align: 'left', width: 130 },
            { label: '有效期', prop: 'YXQ', align: 'left', width: 170 },
            { label: '有效状态', prop: 'YXZT', align: 'left', width: 100, render: 'switch' },
            {
                label: '操作',
                align: 'center',
                width: '90',
                render: 'buttons',
                buttons: optButtons,
                fixed: 'right'
            },
        ],
        dblClickNotEditColumn: [undefined, 'YXZT'],
        pk: 'GYSBM',
        filter: {DLBM:"2"}
    },
    {
        defaultItems: {
            YXZT: '1',
        },
    }
)

const dlbmChange = (value: any) =>{
    baTable.table.filter = {DLBM:state.DLBM}
    baTable.getIndex()
    baTable.form.defaultItems!.DLBM = value
    if(value === '2'){
        baTable.form.defaultItems!.XLBM ='1'
        baTable.form.defaultItems!.PSQYLX = '药品经营企业'
    }else if(value === '3'){
        baTable.form.defaultItems!.XLBM ='2'
        baTable.form.defaultItems!.PSQYLX = '物品生产企业'
    }else if(value === '4'){
        baTable.form.defaultItems!.XLBM ='3'
        baTable.form.defaultItems!.PSQYLX = '设备生产企业'
    }
}

provide('baTable', baTable)

baTable.mount()
baTable.getIndex()
baTable.form.defaultItems!.DLBM='2'
baTable.form.defaultItems!.XLBM ='1'
baTable.form.defaultItems!.PSQYLX = '药品经营企业'
</script>

<style scoped lang="scss">
.fl-zone {
    padding: 10px 10px 20px 10px;
    background-color: #fff;
    height: calc(100% - 15px);
}
.el-radio-button :deep(.el-radio-button__inner) {
    border-left: var(--el-border);
    border-radius: var(--el-border-radius-base);
    box-shadow: none!important;
    width: 100%;
    min-width: 65px;
}
</style>
