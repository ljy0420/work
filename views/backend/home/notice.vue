<template>
    <div>
        <el-dialog class="ba-operate-dialog" :close-on-click-modal="false" :model-value="state.showEdit" @close="closeClick"
            :destroy-on-close="true" align-center width="900px">
            <template #header>
                <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']">
                    消息
                </div>
            </template>
            <el-scrollbar>
                <div v-if="state.showMode === 'list'" class="notice-list">
                    <el-tabs v-model="state.activeName" class="notice-tabs">
                        <el-tab-pane label="全部消息" name="all">
                            <div class="his-notice-item" v-for="item in state.noticeItems" :index="item.id" :key="item.id">
                                <el-badge is-dot v-if="item.unread">
                                    <div class="notice-item-icon" :class="item.type === 4 ? 'danger' : ''">
                                        <Icon name="local-msg" />
                                    </div>
                                </el-badge>
                                <div v-else class="notice-item-icon" :class="item.type === 4 ? 'danger' : ''">
                                    <Icon name="local-msg" />
                                </div>
                                <div class="notice-item-base">
                                    <div class="notice-item-date">{{ item.date }}</div>
                                    <div class="notice-item-content" :class="item.type === 4 ? 'txt-danger' : ''">{{
                                        item.content }}
                                    </div>
                                </div>
                                <div class="notice-item-more" @click="toMore(item)">更多 ></div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane :label="'未读消息（' + state.unreadItems.length + '）'" name="unread">
                            <div class="his-notice-item" v-for="item in state.unreadItems" :index="item.id" :key="item.id">
                                <el-badge is-dot v-if="item.unread">
                                    <div class="notice-item-icon" :class="item.type === 4 ? 'danger' : ''">
                                        <Icon name="local-msg" />
                                    </div>
                                </el-badge>
                                <div v-else class="notice-item-icon" :class="item.type === 4 ? 'danger' : ''">
                                    <Icon name="local-msg" />
                                </div>
                                <div class="notice-item-base">
                                    <div class="notice-item-date">{{ item.date }}</div>
                                    <div class="notice-item-content" :class="item.type === 4 ? 'txt-danger' : ''">{{
                                        item.content }}
                                    </div>
                                </div>
                                <div class="notice-item-more" @click="toMore(item)">更多 ></div>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                    <div class="clear-unread" @click="clearUnread">
                        <Icon name="local-clear" />
                        <span>清除未读</span>
                    </div>
                </div>
                <div v-if="state.showMode === 'detail'" class="notice-detail">
                    <div class="notice-detail-header">
                        <div class="to-list" @click="toList">
                            <Icon name="local-goback" />
                            <span>返回列表</span>
                        </div>
                    </div>
                    <div class="notice-body">
                        <h3 class="notice-title">{{ state.noticeDetail.title }}</h3>
                        <h4 class="notice-date">{{ state.noticeDetail.date }}</h4>
                        <div class="notice-content">{{ state.noticeDetail.content }}</div>
                    </div>
                </div>
            </el-scrollbar>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, watch } from 'vue'
import { ElNotification } from 'element-plus'

const state: {
    showEdit: boolean,
    activeName: string,
    noticeItems: any,
    unreadItems: any,
    showMode: string,
    noticeDetail: any
} = reactive({
    showEdit: false,
    activeName: 'all',
    noticeItems: [
        {
            id: 1,
            date: '2023-08-08',
            title: '院内公告',
            content: '院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告',
            unread: true,
            type: 1
        },
        {
            id: 2,
            date: '2023-08-08',
            title: '院内公告',
            content: '院内公告院内公告院内公告院内公告院内公告',
            unread: true,
            type: 1
        },
        {
            id: 3,
            date: '2023-08-08',
            title: '院内公告',
            content: '院内公告院内公告院内公告院内公告院内公告',
            unread: false,
            type: 1
        },
        {
            id: 4,
            date: '2023-08-08',
            title: '库存预警提醒',
            content: '库存预警库存预警库存预警库存预警库存预警',
            unread: true,
            type: 4
        },
        {
            id: 5,
            date: '2023-08-08',
            title: '院内公告',
            content: '院内公告院内公告院内公告院内公告院内公告',
            unread: true,
            type: 1
        },
        {
            id: 6,
            date: '2023-08-08',
            title: '院内公告',
            content: '院内公告院内公告院内公告院内公告院内公告',
            unread: false,
            type: 1
        },
        {
            id: 7,
            date: '2023-08-08',
            title: '院内公告',
            content: '院内公告院内公告院内公告院内公告院内公告',
            unread: false,
            type: 1
        },
        {
            id: 8,
            date: '2023-08-08',
            title: '院内公告',
            content: '院内公告院内公告院内公告院内公告院内公告',
            unread: false,
            type: 1
        },
        {
            id: 9,
            date: '2023-08-08',
            title: '院内公告',
            content: '院内公告院内公告院内公告院内公告院内公告',
            unread: false,
            type: 1
        },
        {
            id: 10,
            date: '2023-08-08',
            title: '院内公告',
            content: '院内公告院内公告院内公告院内公告院内公告',
            unread: false,
            type: 1
        }
    ],
    unreadItems: [
        {
            id: 1,
            date: '2023-08-08',
            title: '院内公告',
            content: '院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告',
            unread: true,
            type: 1
        },
        {
            id: 2,
            date: '2023-08-08',
            title: '院内公告',
            content: '院内公告院内公告院内公告院内公告院内公告',
            unread: true,
            type: 1
        },
        {
            id: 4,
            date: '2023-08-08',
            title: '库存预警提醒',
            content: '库存预警库存预警库存预警库存预警库存预警',
            unread: true,
            type: 4
        },
        {
            id: 5,
            date: '2023-08-08',
            title: '院内公告',
            content: '院内公告院内公告院内公告院内公告院内公告',
            unread: true,
            type: 1
        }
    ],
    showMode: 'list',
    noticeDetail: {
        id: 1,
        date: '2023-08-08',
        title: '院内公告',
        content: '院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告院内公告',
        unread: true,
        type: 1
    }
})


watch(() => state.showEdit,
    () => {
        if (state.showEdit) {

        }
    }
)

onMounted(() => {

})

const closeClick = () => {
    state.showMode = 'list'
    state.showEdit = false;
}

const clearUnread = () => {
    state.noticeItems.forEach((item: any) => {
        item.unread = false
    })
    state.unreadItems.forEach((item: any) => {
        item.unread = false
    })
}

const toMore = (item: any) => {
    state.showMode = 'detail';
    state.noticeDetail = item;
}

const toList = () => {
    state.showMode = 'list'
}

const showDialog = () => {
    state.showMode = 'list'
    state.showEdit = true;
}

defineExpose({ showDialog })

</script>

<style scoped lang="scss">
:deep(.el-dialog__body) {
    padding: 0;
    height: 600px;
}

.notice-list {
    position: relative;
    padding: 10px 20px 15px 20px;

    :deep(.el-tabs__header) {
        margin: 0;
    }

    .his-notice-item {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 20px 10px;
        background-color: var(--ba-bg-color-overlay);
        border-bottom: 1px solid #f1f1f1;

        .notice-item-icon {
            width: 46px;
            height: 46px;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 39px;
            border-radius: 50%;
            background-color: #F3F9FE;

            .svg-icon {
                color: #8595F4 !important;
            }
        }

        .notice-item-base {
            margin-left: 10px;
            color: #2c3f5d;

            .notice-item-date {
                font-size: 15px;
            }

            .notice-item-content {
                padding: 5px 1px;
                font-size: 13px;
                color: #aaa;
                width: 720px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }

        .notice-item-more {
            align-self: flex-end;
            color: #4ca7f9;
            font-size: 12px;
            padding-left: 10px;
            padding-bottom: 6px;
        }

        .notice-item-more:hover {
            cursor: pointer;
        }

        .danger {
            background-color: #FFF0F0;

            .svg-icon {
                color: #E45656 !important;
            }
        }

        .txt-danger {
            color: #E45656 !important;
        }
    }

    .his-notice-item:last-child {
        border-bottom: none;
    }

    .his-notice-item:hover {
        background-color: #F0FAFF;
    }

    :deep(.el-badge__content.is-fixed.is-dot) {
        position: absolute;
        right: 10px;
        top: 7px;
    }

    .clear-unread {
        position: absolute;
        top: 15px;
        right: 30px;
        display: flex;
        align-items: center;
        justify-content: center;

        .svg-icon {
            color: #4ca7f9 !important;
            font-size: 14px !important;
        }

        span {
            color: #4ca7f9;
            margin-left: 5px;
            font-size: 12px;
        }
    }

    .clear-unread:hover {
        cursor: pointer;
    }
}

.notice-detail {
    position: relative;
    padding: 10px 20px 15px 20px;

    .notice-detail-header {
        padding: 0px 15px;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .to-list {
            display: flex;
            align-items: center;
            justify-content: center;

            .svg-icon {
                color: #4ca7f9 !important;
                font-size: 14px !important;
            }

            span {
                color: #4ca7f9;
                margin-left: 5px;
                font-size: 12px;
            }
        }
    }
    .notice-body {
        margin-top: 5px;
        .notice-title {
            text-align:center;
            color:#202020;
            font-size: 12px;
            font-weight: bold;
            padding: 5px;
        }
        .notice-date {
            text-align: center;
            font-size: 12px;
            color: #8F8F8F;
            padding: 5px;
        }
        .notice-content {
            padding: 5px 10px 30px 10px;
            text-indent: 2em;
            line-height: 2em;
        }
    }
}</style>