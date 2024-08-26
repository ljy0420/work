<template>
    <div>
        <el-dialog class="ba-operate-dialog" :close-on-click-modal="false" :model-value="state.showEdit" @close="closeClick"
            :destroy-on-close="true" align-center width="900px">
            <template #header>
                <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']">
                    编辑快捷菜单
                </div>
            </template>
            <el-scrollbar>
                <div class="menu-container">
                    <div class="shortcut-menu-header">首页展示快捷菜单（{{ state.shortcutMenus.length }}/{{ state.shortcutLimit }}）
                    </div>
                    <div class="shortcut-menu-list" @dragover="event => event.preventDefault()" @drop="ondrop($event)">
                        <div class="shortcut-menu-item" v-for="menu in state.shortcutMenus" :index="menu.id" :key="menu.id">
                            <div class="label">
                                {{ menu.title }}
                            </div>
                            <div class="btn-del" @click="delMenu(menu)">
                                <Icon name="local-close" />
                            </div>
                        </div>
                        <div class="shortcut-menu-empty" v-if="state.shortcutMenus.length === 0">从下面菜单列表中选择</div>
                        <el-popconfirm v-if="state.shortcutMenus.length > 0" title="您确定移除所有快捷菜单吗?" width="230"
                            @confirm="removeAllMenus" @onConfirm="removeAllMenus">
                            <template #reference>
                                <div class="shortcut-menu-clear">
                                    <el-tooltip content="移除所有" placement="left">
                                        <Icon name="local-remove" />
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-popconfirm>
                        <!-- <div class="shortcut-menu-clear" v-if="state.shortcutMenus.length > 0" @click="removeAllMenus">
                            <Icon name="local-remove" />
                        </div> -->
                    </div>
                    <div class="menu-header"><span>待添加快捷菜单</span></div>
                    <div class="menu-tabs-container">
                        <el-tabs v-model="state.activeName" class="menu-tabs">
                            <el-tab-pane v-for="menu in state.menus" :index="menu.id" :key="menu.id" :label="menu.title"
                                :name="menu.name">
                                <div class="menu-list">
                                    <div class="menu-item"
                                        :class="state.shortcutMenus.some(ele => ele.id === submenu.id) ? 'menu-nomove' : ''"
                                        v-for="submenu in menu.children" :index="submenu.id" :key="submenu.id"
                                        :draggable="!state.shortcutMenus.some(ele => ele.id === submenu.id)"
                                        @dragstart="dragstart($event, submenu)" @dragend="dragend($event, submenu)">
                                        <div class="label">
                                            {{ submenu.title }}
                                        </div>
                                        <el-button class="btn-add"
                                            :disabled="state.shortcutMenus.some(ele => ele.id === submenu.id)"
                                            @click="addMenu(submenu)">
                                            <Icon name="local-add" />
                                        </el-button>
                                    </div>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </el-scrollbar>
            <template #footer>
                <div class="yd-from-footer">
                    <el-button v-blur type="primary" @click="saveClick" class="btn-form-save">保存</el-button>
                    <el-button @click="cancelClick" class="btn-form-cancel">取消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, watch } from 'vue'
import { SaveShortcutMenus, GetFlMenus } from '/@/api/backend/dashboard'
import { ElNotification } from 'element-plus'

const prop = defineProps(['shortcutMenus'])

const emit = defineEmits(["menuChange"]);

const state: {
    showEdit: boolean,
    menus: any,
    shortcutMenus: any,
    dragMenu: any,
    shortcutLimit: number,
    activeName: string
} = reactive({
    showEdit: false,
    menus: [],
    shortcutMenus: [],
    dragMenu: null,
    shortcutLimit: 8,
    activeName: ''
})

const dragstart = (e: any, data: any) => {
    //console.log('dragstart',e,data)
    state.dragMenu = data
}

const dragend = () => {
    //console.log('dragend',e,data)
    state.dragMenu = null
}

const ondrop = () => {
    //console.log('drop',e)
    if (state.dragMenu) {
        if (!state.shortcutMenus.some(ele => ele.id === state.dragMenu.id)) {
            if (state.shortcutMenus.length < state.shortcutLimit) {
                state.shortcutMenus.push(state.dragMenu);
            } else {
                ElNotification({
                    type: 'warning',
                    message: '首页展示快捷菜单已满，请删除后再添加',
                })
            }
        } else {
            ElNotification({
                type: 'warning',
                message: '快捷菜单已存在，无需重复添加.',
            })
        }
    }
}

const delMenu = (data: any) => {
    state.shortcutMenus.splice(state.shortcutMenus.findIndex(ele => ele.id === data.id), 1);
}

const addMenu = (data: any) => {
    // if(state.shortcutMenus.findIndex(ele => ele.id == data.id)<0) {
    //     state.shortcutMenus.push(data);
    // }
    if (!state.shortcutMenus.some(ele => ele.id === data.id)) {
        if (state.shortcutMenus.length < state.shortcutLimit) {
            state.shortcutMenus.push(data);
        } else {
            ElNotification({
                type: 'warning',
                message: '首页展示快捷菜单已满，请删除后再添加',
            })
        }
    } else {
        ElNotification({
            type: 'warning',
            message: '快捷菜单已存在，无需重复添加.',
        })
    }
}

const removeAllMenus = () => {
    state.shortcutMenus = []
}

watch(() => state.showEdit,
    () => {
        if (state.showEdit) {
            let val = prop.shortcutMenus
            if (val && val.length > 0) {
                let arr: any = []
                val.forEach((ele: any) => {
                    arr.push({ id: ele.id, title: ele.title });
                })
                state.shortcutMenus = arr;
            } else {
                state.shortcutMenus = []
            }
        }
    }
)

onMounted(() => {
    GetFlMenus({ agrs: {} }).then(res => {
        // console.log(res)
        state.menus = res.data
        if (res.data && res.data.length > 0) {
            state.activeName = res.data[0].name
        }
    })
})

const closeClick = () => {
    state.showEdit = false;
}

const saveClick = () => {
    if (state.shortcutMenus.length <= 0) {
        ElNotification({
            type: 'warning',
            message: '请添加快捷菜单.',
        })
        return;
    }
    let arr: any = []
    for (let i = 0; i < state.shortcutMenus.length; i++) {
        arr.push({
            CDBM: state.shortcutMenus[i].id,
            PXH: i + 1
        });
    }
    SaveShortcutMenus({ agrs: arr }).then(res => {
        if (res.code == 1) {
            ElNotification({
                type: 'success',
                message: '保存成功.',
            })
            state.showEdit = false;
            emit('menuChange', state.shortcutMenus)
        } else {
            ElNotification({
                type: 'error',
                message: res.msg,
            })
        }
    })
}

const cancelClick = () => {
    state.showEdit = false;
}

const showEdit = () => {
    state.showEdit = true;
}

defineExpose({ showEdit })

</script>

<style scoped lang="scss">
:deep(.el-dialog__body) {
    padding: 0;
    height: 600px;
}

.menu-container {
    padding: 0 0 15px 0;

    .shortcut-menu-header {
        padding: 15px;
        font-weight: bold;
        color: #000;
    }

    .menu-header {
        padding: 15px 20px 5px 15px;
        font-weight: bold;
        color: #000;
    }
}

.shortcut-menu-list {
    position: relative;
    padding: 0px 20px 15px 30px;
    background-color: #F0F8FF;
    height: 130px;

    .shortcut-menu-item {
        display: inline-flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        background-color: #fff;
        border: 1px solid #f1f1f1;
        height: 43px;
        margin-right: 25px;
        margin-top: 15px;
        border-radius: 8px;

        .label {
            width: 150px;
        }

        .btn-del {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: #4499f9;
            width: 30px;
            height: 100%;
            border-radius: 0px 8px 8px 0;
            border: none;
            .svg-icon {
                font-size: 10px !important;
                color: #4499f9 !important;
            }
        }
    }

    .shortcut-menu-item:hover .btn-del {
        background-color: #4499f9;
        color: #fff;
        .svg-icon {
            font-size: 10px !important;
            color: #fff !important;
        }
    }

    .shortcut-menu-empty {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #aaa;
    }

    .shortcut-menu-clear {
        position: absolute;
        top: 10px;
        right: 10px;

        .svg-icon {
            font-size: 13px !important;
            color: #999 !important;
        }
    }

    .shortcut-menu-clear:hover {
        cursor: pointer;

        .svg-icon {
            font-size: 13px !important;
            color: #666 !important;
        }
    }
}

.menu-tabs-container {
    padding: 0px 15px;
}

.menu-list {
    padding: 0px 20px;
    min-height: 260px;
    background-color: #f6f6f6;

    .menu-item {
        display: inline-flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        background-color: #fff;
        border: 1px solid #f1f1f1;
        height: 43px;
        margin-right: 15px;
        margin-top: 15px;
        border-radius: 8px;
        cursor: move;

        .label {
            width: 115px;
        }

        .btn-add {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: #4499f9;
            width: 30px;
            height: 100%;
            border-radius: 0px 8px 8px 0;
            border: none;
            .svg-icon {
                font-size: 13px !important;
                color: #4499f9 !important;
            }
        }
    }

    .menu-nomove {
        cursor: default;
        color: #ccc;

        .btn-add {
            color: #ccc;
            .svg-icon {
                font-size: 13px !important;
                color: #ccc !important;
            }
        }
    }

    .menu-item:hover .btn-add {
        background-color: #4499f9;
        color: #fff;
        .svg-icon {
            font-size: 13px !important;
            color: #fff !important;
        }
    }

    .menu-nomove:hover .btn-add {
        background-color: #fff;
        color: #ccc;
        .svg-icon {
            font-size: 13px !important;
            color: #ccc !important;
        }
    }
}
</style>