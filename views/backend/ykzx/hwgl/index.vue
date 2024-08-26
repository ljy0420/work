<template>
    <div class="layout-box">
        <div class="zw-box">
            <div style="width: 20%; margin-right: 10px">
                <el-table
                    :data="yfykList"
                    stripe
                    class="ba-data-table"
                    :header-row-class-name="'custom-header'"
                    height="calc(100vh - 90px)"
                    @row-click="radio"
                >
                    <el-table-column width="55">
                        <template #default="{ row }">
                            <el-radio v-model="currentBm" :label="row.BM" @click="radio(row)">&nbsp;</el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column prop="BM" label="库房编码" align="left"> </el-table-column>
                    <el-table-column prop="MC" label="库房名称" align="center"> </el-table-column>
                </el-table>
            </div>
            <div style="width: 80%">
                <div class="search-box">
                    <el-form :model="formData" :inline="true" label-width="auto" class="zw-table-search">
                        <el-form-item label="检索">
                            <el-input v-model="formData.search" type="string" style="width: 500px" placeholder="请输入文字(支持模糊搜索)"></el-input>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="onSearch">查询</el-button>
                            <el-button @click="resetForm">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="table-item-top">
                    <div class="btn" @click="onCreate">
                        <Icon name="local-create" style="color: #4ca7f9" class="local-icon" />
                        <div>新增货位</div>
                    </div>

                    <div @click="exportYkBtn" :class="[currentradio ? 'btn' : 'current-btn']">
                        <Icon name="local-export" :style="currentradio ? 'color:#4ca7f9' : 'color:bbbbbb'" class="local-icon" />
                        <div>导出</div>
                    </div>
                </div>
                <Table ref="tableRef" :pagination="false" height="calc(100vh - 192px)" />
            </div>
        </div>
        <Edit :yfykArr="yfykArr" :tableData="baTable.table.data"  />
    </div>
</template>

<script setup lang="ts">
import { provide, ref, reactive, onMounted } from 'vue'
import { getyfyklist, getCxyfyk } from '/@/api/common'
import Edit from './edit.vue'
import baTableClass from '/@/utils/baTable'
import Table from '/@/components/table/index.vue'
import { defaultOptBtns } from '/@/components/table'
import { baTableApi } from '/@/api/common'

defineOptions({
    name: 'ykzx/hwgl',
})

const tableRef = ref()

const optButtons = defaultOptBtns(['weigh-sort', 'edit', 'delete'])

const api = new baTableApi('/api/v1/ykzx/yplzgl/cxhwzd')
api.actionUrl = new Map([
    ['index', '/api/v1/ykzx/yplzgl/cxhwzd'],
    ['add', '/api/v1/ykzx/yplzgl/xzhwzd'],
    ['edit', '/api/v1/ykzx/yplzgl/xghwzd'],
    ['sortable', '/api/v1/ykzx/yplzgl/hwzdpx'],
])

const baTable = new baTableClass(api,
    {
        expandAll: false,
        column: [
            { label: 'NO', type: 'index', align: 'center', width: 100 },
            { label: '货位编码', prop: 'HWBM', align: 'left', width: 300 },
            { label: '货位名称', prop: 'HWMC', align: 'left', minWidth: 260, showOverflowTooltip: true },
            { label: '拼音码', prop: 'PYM', align: 'left', width: 150 },
            { label: '五笔码', prop: 'WBM', align: 'left', width: 100 },
            { label: '排序号', prop: 'PXH', align: 'left', width: 150 },
            {
                label: '操作',
                align: 'center',
                width: '115',
                render: 'buttons',
                buttons: optButtons,
                fixed: 'right'
            },
        ],
        pk: 'HWBM',
        dragSortLimitField: 'SJBM',
        dblClickNotEditColumn: [undefined],
    },
    {
        labelWidth: 90
    }
)

const currentBm = ref()
const yfykArr = ref([])
const yfykList = ref([])
const currentradio = ref()
const formData = reactive({
    search: '',
})

const exportYkBtn = () => {}

const onCreate = () => {
    if(baTable.table.data && baTable.table.data.length>0) {
        let total = 0
        for(let i=0; i< baTable.table.data?.length; i++) {
            let c = getRowCount(baTable.table.data[i])
            total = total + c
        }
        baTable.form.defaultItems!.PXH = total + 1
    } else {
        baTable.form.defaultItems!.PXH = 1
    }
    baTable.form.defaultItems!.KFBM = currentBm.value
    baTable.onTableHeaderAction('add', {})
}

const onSearch = () => {
    getHwzdList()
}

const getHwzdList = () => {
    baTable.table.filter = { KFBM: currentBm.value, YWLX: 'Tree', keywords: formData.search }
    baTable.getIndex()?.then(() => {
        baTable.dragSort('.tb-row-weigh-sort')
    })
}

function getRowCount(tbData: any) {
    let count = 0;
    function traverse(node: any) {
        count++;
        if (node.children) {
            node.children.forEach(traverse);
        }
    }
    traverse(tbData);
    return count;
}

provide('baTable', baTable)

onMounted(() => {
    baTable.table.ref = tableRef.value
    baTable.mount()
    getyfyklist().then((res) => {
        yfykArr.value = res.data.options
    })

    // 查询药房药库
    getCxyfyk({ agrs: '3' }).then((res) => {
        if (res.code == 1) {
            yfykList.value = res.data
            if (yfykList.value && yfykList.value.length > 0) {
                currentBm.value = yfykList.value[0].BM
                getHwzdList()
            }
        }
    })
})

const resetForm = () => {
    formData.search = ''
    getHwzdList()
}

const radio = (row: any) => {
    currentBm.value = row.BM
    getHwzdList()
}

</script>

<style lang="scss" scoped>
:deep(.custom-header) th {
    color: #000;
}
:deep(.el-radio) {
    height: 0px;
}
.layout-box {
    padding: 0 6px;
    .zw-box {
        display: flex;
        margin-top: 10px;
        // justify-content: space-between;
        .btn-box {
            width: 100%;
            border: 1px solid #eaeaea;
            background: #f9f9f9;
            border-radius: 5px;
            padding: 12px 20px;
            margin-top: 20px;
        }
        .search-box {
            margin-bottom: 5px;
            .zw-table-search {
                background: #ffffff;
                border-bottom: solid 1px #cecece;
                box-sizing: border-box;
                padding: 10px 10px 0;
                :deep(.el-form-item) {
                    margin-bottom: 10px;

                    .el-select {
                        width: 100%;
                    }
                }
            }
        }
        .table-item {
            .btn {
                color: #4ca7f9;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                .local-icon {
                    font-size: 14px;
                    margin-right: 5px;
                }
            }
        }
        .table-item-top {
            background: #ffffff;
            padding: 10px 5px;
            display: flex;

            .btn,
            .current-btn {
                display: flex;
                height: 24px;
                font-size: 14px;
                align-items: center;
                margin-right: 8px;
                .local-icon {
                    font-size: 14px;
                    margin-right: 3px;
                }
            }

            .btn {
                cursor: pointer;
                color: #4ca7f9;
            }

            .current-btn {
                color: #bbbbbb;
            }
        }
    }
}
</style>
