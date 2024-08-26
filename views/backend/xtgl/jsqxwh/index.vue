<template>
    <div class="default-main">
        <el-row :gutter="10">
            <el-col :xs="24" :sm="9">
                <div class="ba-table-box">
                    <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info" show-icon />
                    <!-- 表格顶部菜单 -->
                    <TableHeader :buttons="['refresh', 'add', 'edit', 'delete', 'quickSearch']" quick-search-placeholder="输入关键字搜索" />

                    <!-- 表格 -->
                    <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
                    <Table :pagination="false" height="calc(100vh - 170px)" @cell-click="cellClickHandle">
                        <template #ttt>
                            <el-table-column prop="JSBM" label="选择" width="70" align="center">
                                <template #default="scope">
                                    <el-radio v-model="state.tableRadio" :label="scope.row.JSBM">&nbsp;</el-radio>
                                </template>
                            </el-table-column>
                        </template>
                    </Table>

                    <!-- 表单 -->
                    <EditForm />
                </div>
            </el-col>
            <el-col class="xs-mb-20" :xs="24" :sm="15">
                <el-tabs v-model="state.activeTab" type="border-card" @tab-click="tabHandleClick">
                    <el-tab-pane name="jsqxcd" label="角色功能">
                        <el-scrollbar class="ba-table-form-scrollbar">
                            <div style="width: 80%;height: 75vh;background-color: #fff;">
                                <el-form ref="jsgnFormRef" :model="state.jsqxgnItems" label-position="right" label-width="70px" :rules="rules">
                                    <el-form-item prop="auth" label="权限">
                                        <el-tree 
                                            ref="treeRef" 
                                            :key="state.treeKey"
                                            :default-checked-keys="state.defaultCheckedKeys" :default-expand-all="true"
                                            show-checkbox node-key="id"
                                            :props="{ children: 'children', label: 'title', class: treeNodeClass }"
                                            :data="state.menuRules" />
                                    </el-form-item>
                                </el-form>
                            </div>
                        </el-scrollbar>
                        <el-form-item>
                            <el-button round type="primary" @click="saveJsqxgn">保存</el-button>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane name="jsqxry" label="角色用户">
                        <el-scrollbar class="ba-table-form-scrollbar">
                            <div style="width: 80%;height: 75vh;background-color: #fff;">
                                <el-transfer 
                                filterable 
                                :filter-method="filterMethod" 
                                :props="{ key: 'RYBM', label: 'RYXM' }"
                                :titles="['用户列表', '已选用户']"
                                filter-placeholder="请输入人员姓名"
                                v-model="state.jsyhValue"
                                :data="state.jsyhData"
                                style="height: 600px;">
                                </el-transfer>
                            </div>
                        </el-scrollbar>
                        <el-form-item>
                            <el-button round type="primary" @click="saveJsqxyh">保存</el-button>
                        </el-form-item>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { provide, ref, reactive } from 'vue'
import baTableClass from '/@/utils/baTable'
import EditForm from './edit.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/index.vue'
import { baTableApi } from '/@/api/common'
import { getAllMenus, saveJsCaidan, getJsCaidan, getJsRenyuan, saveJsYonghu } from '/@/api/backend/xtgl/jsqx'
import type { FormInstance, ElTree, FormItemRule } from 'element-plus'
import { uuid } from '/@/utils/random'
import type Node from 'element-plus/es/components/tree/src/model/node'

interface MenuRules {
    id: number
    title: string
    children: MenuRules[]
}

const jsgnFormRef = ref<FormInstance>()
const treeRef = ref<InstanceType<typeof ElTree>>()

const state: {
    treeKey: string
    defaultCheckedKeys: number[]
    menuRules: MenuRules[],
    activeTab: string,
    currentJsbm: string,
    jsqxgnItems: anyObj,
    tableRadio: any,
    jsyhData: any,
    jsyhValue: any
} = reactive({
    treeKey: uuid(),
    defaultCheckedKeys: [],
    menuRules: [],
    activeTab: 'jsqxcd',
    currentJsbm: '',
    jsqxgnItems: {},
    tableRadio: '',
    jsyhData: [],
    jsyhValue: []
})

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    auth: [
        {
            required: true,
            validator: (rule: any, val: string, callback: Function) => {
                let ids = getCheckeds()
                if (ids.length <= 0) {
                    return callback(new Error('请选择权限'))
                }
                return callback()
            },
        },
    ]
})

getAllMenus().then((res) => {
    state.menuRules = res.data
})

const getCheckeds = () => {
    return treeRef.value!.getCheckedKeys().concat(treeRef.value!.getHalfCheckedKeys())
}

const treeNodeClass = (data: anyObj, node: Node) => {
    if (node.isLeaf) return ''
    let addClass = true
    for (const key in node.childNodes) {
        if (!node.childNodes[key].isLeaf) {
            addClass = false
        }
    }
    return addClass ? 'penultimate-node' : ''
}

defineOptions({
    name: 'xtgl/xtcdwh',
})

const baTable = new baTableClass(
    new baTableApi('/api/v1/xtsjwh/jsqxwh/'),
    {
        column: [
            { label: '选择', render: 'slot', slotName: 'ttt' },
            { label: '名称', prop: 'JSMC', align: 'left' },
            { label: '描述', prop: 'JSMS', align: 'left' },
            { label: '状态', prop: 'YXZT', align: 'left', render: 'switch' },
        ],
        dblClickNotEditColumn: [undefined, 'YXZT'],
        pk: 'JSBM'
    },
    {
        defaultItems: {
            YXZT: 1,
        },
        labelWidth: 100
    }
)

const cellClickHandle = (row: any) => {
    state.treeKey = uuid()
    state.defaultCheckedKeys = []
    state.currentJsbm = row.JSBM
    state.tableRadio = row.JSBM
    baTable.table.selection?.splice(0, 1);
    baTable.table.selection?.push(row)
    if (state.activeTab === 'jsqxcd') {
        getJsCaidan({ agrs: row.JSBM }).then((res) => {
            state.defaultCheckedKeys = res.data.jscd
        })
    } else if (state.activeTab === 'jsqxry') {
        getJsRenyuan({ agrs: row.JSBM }).then((res) => {
            state.jsyhData = res.data.users
            state.jsyhValue = res.data.auths
        })
    }
}

const saveJsqxgn = () => {
    const cdids = getCheckeds()
    saveJsCaidan({ agrs: { jsId: state.currentJsbm, cdIds: cdids } }).then((res) => {
        console.log(res)
    })
}



const saveJsqxyh = () => {
    console.log(state.jsyhValue)
    saveJsYonghu({ agrs: { jsbm: state.currentJsbm, jsyhs: state.jsyhValue } }).then((res) => {
        console.log(res)
    })
}

const tabHandleClick = (tab: any) => {
    if (state.currentJsbm) {
        if (tab.paneName === 'jsqxcd') {
            getJsCaidan({ agrs: state.currentJsbm }).then((res) => {
                state.defaultCheckedKeys = res.data.jscd
            })
        } else if (tab.paneName === 'jsqxry') {
            getJsRenyuan({ agrs: state.currentJsbm }).then((res) => {
                state.jsyhData = res.data.users
                state.jsyhValue = res.data.auths
            })
        }
    }
}

const filterMethod = (query: any, item: any) => {
    return item.RYXM.indexOf(query) > -1;
}

provide('baTable', baTable)

baTable.mount()
baTable.getIndex()
</script>

<style scoped lang="scss">

// .el-tabs--border-card :deep(.el-tabs__header .el-tabs__item:not(.is-disabled):hover) {
//     color: #333;
// }

// .el-tabs--border-card :deep(.el-tabs__header .el-tabs__item.is-active) {
//     color: #333;
//     background: linear-gradient(180deg, #11aa95, #c6ffdd);
//     z-index: 999;
// }

// .el-tabs--border-card :deep(.el-tabs__header) {
//     position: relative;
// }

// .el-tabs--border-card :deep(.el-tabs__header .el-tabs__item) {
//     color: #FFF;
//     margin: 0 15px;
//     background: linear-gradient(180deg, #84d4c8, #c6ffdd);
//     border: none;
//     height: 28px;
//     line-height: 28px;
// }

// .el-tabs--border-card :deep(.el-tabs__header .el-tabs__item:first-child) {
//     margin-left: 22px;
// }

// .el-tabs--border-card :deep(.el-tabs__header .el-tabs__item::before) {
//     content: "";
//     height: 100%;
//     position: absolute;
//     background: linear-gradient(180deg, #84d4c8, #c6ffdd);
//     border-radius: 8px;
//     width: 30px;
//     top: 0;
//     transition: all .3s cubic-bezier(.645, .045, .355, 1);
// }

// .el-tabs--border-card :deep(.el-tabs__header .el-tabs__item::after) {
//     content: "";
//     height: 100%;
//     position: absolute;
//     background: linear-gradient(180deg, #84d4c8, #c6ffdd);
//     border-radius: 8px;
//     width: 30px;
//     top: 0;
//     transition: all .3s cubic-bezier(.645, .045, .355, 1);
// }

// .el-tabs--border-card :deep(.el-tabs__header .el-tabs__item::before) {
//     right: -16px;
//     transform: skew(25deg);
//     border-radius: 0 8px 0 0;
// }

// .el-tabs--border-card :deep(.el-tabs__header .el-tabs__item::after) {
//     transform: skew(-25deg);
//     left: -16px;
//     border-radius: 8px 0 0 0;
//     border-left: 1px solid #d9d9d9;
// }

// .el-tabs--border-card :deep(.el-tabs__header .el-tabs__item.is-active::before) {
//     background: linear-gradient(180deg, #11aa95, #c6ffdd);
//     transition: all .3s cubic-bezier(.645, .045, .355, 1);
//     z-index: 999;
// }

// .el-tabs--border-card :deep(.el-tabs__header .el-tabs__item.is-active::after) {
//     background: linear-gradient(180deg, #11aa95, #c6ffdd);
//     transition: all .3s cubic-bezier(.645, .045, .355, 1);
//     z-index: 999;
// }

// .el-tabs--border-card :deep(.el-tabs__header .el-tabs__item.is-active::before) {
//     border-right: 1px solid #d9d9d9;
// }

// .el-tabs--border-card :deep(.el-tabs__header .el-tabs__item.is-active::after) {
//     border-left: 1px solid #d9d9d9;
// }

.el-tabs--border-card {
    border: none;
    box-shadow: var(--el-box-shadow-light);
    border-radius: var(--el-border-radius-base);
}

.el-tabs--border-card :deep(.el-tabs__header) {
    background-color: var(--ba-bg-color);
    border-bottom: none;
    border-top-left-radius: var(--el-border-radius-base);
    border-top-right-radius: var(--el-border-radius-base);
}

.el-tabs--border-card :deep(.el-tabs__item.is-active) {
    border: 1px solid transparent;
}

.el-tabs--border-card :deep(.el-tabs__nav-wrap) {
    border-top-left-radius: var(--el-border-radius-base);
    border-top-right-radius: var(--el-border-radius-base);
}

:deep(.el-transfer-panel) {
    .el-transfer-panel__body {
        height: 500px;
    }
}

:deep(.el-transfer){
    display: flex;
    align-items: center;
    .el-transfer-panel{
        width: 300px;
    }
    .el-transfer__buttons{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .el-button.el-button--primary{
            margin: 10px;
            width: 39px;
            height: 39px;
            border-radius: 50%;
        }
    }
}


:deep(.penultimate-node) {
    .el-tree-node__children {
        padding-left: 60px;
        white-space: pre-wrap;
        line-height: 12px;

        .el-tree-node {
            display: inline-block;
        }

        .el-tree-node__content {
            padding-left: 5px !important;
            padding-right: 5px;

            .el-tree-node__expand-icon {
                display: none;
            }
        }
    }
}
</style>
