<template>
    <div class="default-main index-container">
        <div class="banner">
            <el-row :gutter="20">
                <el-col :sm="12" :lg="6">
                    <div class="small-panel welcome">
                        <div class="title">Hi，<span>{{ adminInfo.nickname }}</span><span class="greeting">{{ getGreeting()
                        }}</span></div>
                        <div class="content">美好的一天开始了。</div>
                    </div>
                </el-col>
                <el-col :sm="12" :lg="6">
                    <div class="small-panel jrdjzrs">
                        <div class="title">今日待接诊人数</div>
                        <div class="content">
                            <div class="content-left">
                                <span id="file_number">25</span>
                                <span class="all-jzrs">/ 30</span>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :sm="12" :lg="6">
                    <div class="small-panel byyjzrs">
                        <div class="title">本月已接诊人数</div>
                        <div class="content">
                            <div class="content-left">
                                <span id="users_number">389</span>
                            </div>
                            <div class="content-right">
                                <div class="compare-label">比上月</div>
                                <div class="compare-down">
                                    <Icon name="local-down" />
                                    <span>0.8%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :sm="12" :lg="6">
                    <div class="small-panel hzmyd">
                        <div class="title">患者满意度</div>
                        <div class="content">
                            <div class="content-left">
                                <span>98.6%</span>
                            </div>
                            <div class="content-right">
                                <div class="compare-label">比上月</div>
                                <div class="compare-up">
                                    <Icon name="local-up" />
                                    <span>26.2%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="shortcut-menu">
            <el-row :gutter="20">
                <el-col :xs="24" :sm="24" :md="12" :lg="18">
                    <div class="shortcut-menu-title">
                        <div class="title-tag"></div>
                        <div class="title-label">快捷入口</div>
                        <div class="menu-edit" @click="menuEdit">
                            <Icon name="local-edit" class="local-icon" />
                            <span>编辑</span>
                        </div>
                    </div>
                    <div class="shortcut-menu-body">
                        <el-scrollbar>
                            <el-row :gutter="0">
                                <el-col :sm="12" :lg="6" v-for="menu in state.shortcutMenus" :index="menu.id"
                                    :key="menu.id">
                                    <router-link class="h100" :title="state.title" :to="'/admin/' + menu.path">
                                        <div class="menu-panel suspension">
                                            <el-image :src="menu.imgurl ? menu.imgurl : './images/menu/icon-default.png'"
                                                class="menu-img">
                                                <template #error>
                                                    <Icon name="el-icon-Picture" size="50" color="#aaa" />
                                                </template>
                                            </el-image>
                                            <div class="menu-title">{{ menu.title }}</div>
                                        </div>
                                    </router-link>
                                </el-col>
                            </el-row>
                        </el-scrollbar>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="6">
                    <div class="his-notice-title">
                        <div class="title-tag"></div>
                        <div class="title-label">通知公告</div>
                        <div class="notice-more" @click="showNotice">
                            <span>更多 ></span>
                        </div>
                    </div>
                    <div class="his-notice-body">
                        <el-scrollbar>
                            <div class="his-notice-item">
                                <el-badge :is-dot="true">
                                    <div class="notice-item-icon">
                                        <Icon name="local-msg" />
                                    </div>
                                </el-badge>
                                <div class="notice-item-base">
                                    <div class="notice-item-date">2023-08-08</div>
                                    <div class="notice-item-content">院内公告院内公告院内公告院内公告院内公告...</div>
                                </div>
                                
                            </div>
                            <div class="his-notice-item">
                                <el-badge :is-dot="true">
                                    <div class="notice-item-icon">
                                        <Icon name="local-msg" />
                                    </div>
                                </el-badge>
                                <div class="notice-item-base">
                                    <div class="notice-item-date">2023-08-08</div>
                                    <div class="notice-item-content">院内公告院内公告院内公告院内公告院内公告...</div>
                                </div>
                            </div>
                            <div class="his-notice-item">
                                <el-badge :is-dot="false">
                                    <div class="notice-item-icon danger">
                                        <Icon name="local-msg" />
                                    </div>
                                </el-badge>
                                <div class="notice-item-base">
                                    <div class="notice-item-date">2023-08-08</div>
                                    <div class="notice-item-content txt-danger">院内公告院内公告院内公告院内公告院内公告院内公告院内公告...</div>
                                </div>
                            </div>
                        </el-scrollbar>
                    </div>
                </el-col>
            </el-row>
        </div>

        <div class="growth-chart">
            <el-row :gutter="20">
                <el-col class="lg-mb-20" :xs="24" :sm="24" :md="18" :lg="18">
                    <div class="yd-card">
                        <div class="yd-card-header">
                            <div class="title-tag"></div>
                            <div class="title-label">门急诊周数据</div>
                        </div>
                        <div class="yd-card-body">
                            <div class="user-growth-chart" :ref="chartRefs.set"></div>
                        </div>
                    </div>
                </el-col>
                <el-col class="lg-mb-20" :xs="24" :sm="24" :md="6" :lg="6">
                    <div class="yd-card">
                        <div class="yd-card-header">
                            <div class="title-tag"></div>
                            <div class="title-label">科室病人数分布</div>
                        </div>
                        <div class="yd-card-body">
                            <div class="user-surname-chart" :ref="chartRefs.set"></div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <MenuEdit ref="menuEditRef" :shortcutMenus="state.shortcutMenus" @menuChange="menuChange" />
        <NoticeDialog ref="noticeDialogRef" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, nextTick, onActivated, watch, onBeforeMount } from 'vue'
import { CountUp } from 'countup.js'
import * as echarts from 'echarts'
import { useNavTabs } from '/@/stores/navTabs'
import { useTemplateRefsList } from '@vueuse/core'
import { GetShortcutMenus } from '/@/api/backend/dashboard'
import { useEventListener } from '@vueuse/core'
import { useAdminInfo } from '/@/stores/adminInfo'
import { getGreeting } from '/@/utils/common'
import MenuEdit from './menuEdit.vue'
import NoticeDialog from './notice.vue'

defineOptions({
    name: 'dashboard',
})

const navTabs = useNavTabs()
const chartRefs = useTemplateRefsList<HTMLDivElement>()
const adminInfo = useAdminInfo()

const menuEditRef = ref()
const noticeDialogRef = ref()

const state: {
    charts: any[]
    remark: string
    showMenuEdit: boolean
    shortcutMenus: any[]
} = reactive({
    charts: [],
    remark: 'dashboard.Loading',
    showMenuEdit: false,
    shortcutMenus: []
})

const loadShortcutMenus = () => {
    GetShortcutMenus({ agrs: {} }).then((res) => {
        if (res.code == 1) {
            state.shortcutMenus = res.data
        }
    })
}


const menuChange = (data: any) => {
    loadShortcutMenus()
}

const countUpFun = (id: string) => {
    nextTick(() => {
        let value = document.getElementById(id)?.innerText
        if (value) {
            new CountUp(id, parseInt(value), {
                startVal: 0,
                duration: 3,
            }).start()
        }
    })
}

const initCountUp = () => {
    countUpFun('user_reg_number')
    countUpFun('file_number')
    countUpFun('users_number')
    countUpFun('addons_number')
}

const initUserGrowthChart = () => {
    const userGrowthChart = echarts.init(chartRefs.value[0] as HTMLElement)
    const option = {
        grid: {
            top: 0,
            right: 0,
            bottom: 20,
            left: 0,
        },
        xAxis: {
            data: [
                '周一',
                '周二',
                '周三',
                '周四',
                '周五',
                '周六',
                '周日',
            ],
        },
        yAxis: {},
        legend: {
            data: ['门诊', '急诊'],
            textStyle: {
                color: '#73767a',
            },
        },
        series: [
            {
                name: '门诊',
                data: [136, 121, 130, 150, 126, 117, 137],
                type: 'line',
                smooth: true,
                areaStyle: {
                    color: '#FFF',
                },
            },
            {
                name: '急诊',
                data: [76, 190, 156, 103, 167, 137, 113],
                type: 'line',
                smooth: true,
                areaStyle: {
                    color: '#FFF',
                    opacity: 0.5,
                },
            },
        ],
    }
    userGrowthChart.setOption(option)
    state.charts.push(userGrowthChart)
}

const initUserSurnameChart = () => {
    const userSurnameChart = echarts.init(chartRefs.value[1] as HTMLElement)
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
            data: ['外科', '内科', '放射科', '检验科', '急诊科', '皮肤科', '儿科'],
            textStyle: {
                color: '#73767a',
            },
        },
        series: [
            {
                name: '科室',
                type: 'pie',
                radius: '55%',
                center: ['40%', '50%'],
                data: [
                    { name: '外科', value: 123 },
                    { name: '内科', value: 223 },
                    { name: '放射科', value: 313 },
                    { name: '检验科', value: 231 },
                    { name: '急诊科', value: 189 },
                    { name: '皮肤科', value: 201 },
                    { name: '儿科', value: 199 }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                },
            },
        ],
    }
    userSurnameChart.setOption(option)
    state.charts.push(userSurnameChart)
}

const echartsResize = () => {
    nextTick(() => {
        for (const key in state.charts) {
            state.charts[key].resize()
        }
    })
}

onActivated(() => {
    echartsResize()
})

onMounted(() => {
    initCountUp()
    initUserGrowthChart()
    initUserSurnameChart()
    loadShortcutMenus()
    useEventListener(window, 'resize', echartsResize)
})

onBeforeMount(() => {
    for (const key in state.charts) {
        state.charts[key].dispose()
    }
})

onUnmounted(() => {

})

watch(
    () => navTabs.state.tabFullScreen,
    () => {
        echartsResize()
    }
)

const menuEdit = () => {
    menuEditRef.value.showEdit();
}

const showNotice = () => {
    noticeDialogRef.value.showDialog();
}

</script>

<style scoped lang="scss">
.index-container {
    padding: 15px;
    background: #fff;
}

.small-panel {
    background-color: #F0F8FF;
    border-radius: 10px;
    min-height: 139px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: center;
    padding-left: 30px;
}

.banner {
    .welcome {
        background: url(/@/assets/images/welcome-card-bg.png) no-repeat center center/cover;

        .title {
            font-size: 20px;

            .greeting {
                font-size: 30px;
                margin-left: 15px;
            }
        }

        .content {
            margin-top: 20px;
            font-size: 20px;
        }
    }

    .jrdjzrs {
        background: url(/@/assets/images/jrdjzrs-card-bg.png) no-repeat center center/cover;
        padding-left: 50px;

        .title {
            font-size: 24px;
            font-weight: 600;
            color: #fff;
        }

        .content {
            margin-top: 15px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            .content-left {
                font-size: 46px;
                font-weight: 600;
                .all-jzrs {
                    margin-left: 10px;
                    font-size: 24px;
                    color: #222;
                    font-weight: 600;
                }
            }
            .content-right {
                margin-left: 50px;
                .compare-label {
                    font-size: 14px;
                    color: #202020;
                    margin-bottom: 10px;
                }
                .compare-down {
                    font-size: 16px;
                    color: #0CAD7C;
                    font-weight: bold;
                    display: flex;
                    .svg-icon {
                        color: #0CAD7C !important;
                    }
                    span {
                        margin-left: 10px;
                    }
                }
                .compare-up {
                    font-size: 16px;
                    color: #EA6666;
                    font-weight: bold;
                    display: flex;
                    .svg-icon {
                        color: #EA6666 !important;
                    }
                    span {
                        margin-left: 10px;
                    }
                }
            }
        }
    }

    .byyjzrs {
        background: url(/@/assets/images/byyjzrs-card-bg.png) no-repeat center center/cover;
        padding-left: 50px;

        .title {
            font-size: 24px;
            font-weight: 600;
            color: #fff;
        }

        .content {
            margin-top: 15px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            .content-left {
                font-size: 46px;
                font-weight: 600;
            }
            .content-right {
                margin-left: 50px;
                .compare-label {
                    font-size: 14px;
                    color: #202020;
                    margin-bottom: 10px;
                }
                .compare-down {
                    font-size: 16px;
                    color: #0CAD7C;
                    font-weight: bold;
                    display: flex;
                    .svg-icon {
                        color: #0CAD7C !important;
                    }
                    span {
                        margin-left: 10px;
                    }
                }
                .compare-up {
                    font-size: 16px;
                    color: #EA6666;
                    font-weight: bold;
                    display: flex;
                    .svg-icon {
                        color: #EA6666 !important;
                    }
                    span {
                        margin-left: 10px;
                    }
                }
            }
        }
    }

    .hzmyd {
        background: url(/@/assets/images/hzmyd-card-bg.png) no-repeat center center/cover;
        padding-left: 50px;

        .title {
            font-size: 24px;
            font-weight: 600;
            color: #fff;
        }

        .content {
            margin-top: 15px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            .content-left {
                font-size: 46px;
                font-weight: 600;
            }
            .content-right {
                margin-left: 50px;
                .compare-label {
                    font-size: 14px;
                    color: #202020;
                    margin-bottom: 10px;
                }
                .compare-down {
                    font-size: 16px;
                    color: #0CAD7C;
                    font-weight: bold;
                    display: flex;
                    .svg-icon {
                        color: #0CAD7C !important;
                    }
                    span {
                        margin-left: 10px;
                    }
                }
                .compare-up {
                    font-size: 16px;
                    color: #EA6666;
                    font-weight: bold;
                    display: flex;
                    .svg-icon {
                        color: #EA6666 !important;
                    }
                    span {
                        margin-left: 10px;
                    }
                }
            }
        }
    }
}

.shortcut-menu {
    margin-bottom: 10px;

    .shortcut-menu-title {
        display: flex;
        padding: 10px 0;
        font-size: 15px;

        .title-tag {
            display: inline-block;
            background-color: #4499f9;
            width: 5px;
            margin-right: 6px;
        }

        .title-label {
            display: inline-block;
            font-weight: 600;
        }

        .menu-edit {
            display: flex;
            align-items: center;
            justify-content: center;
            color: #4ca7f9;
            margin-left: 25px;
            cursor: pointer;

            .svg-icon {
                color: #4ca7f9 !important;
                width: 15px;
                height: 15px;
            }

            span {
                font-size: 12px;
                margin-left: 5px;
            }
        }
    }

    .shortcut-menu-body {
        height: 270px;

        a {
            text-decoration: none;
        }

        .menu-panel {
            background-color: #F0F8FF;
            padding: 15px 20px;
            margin: 10px;
            text-align: center;
            border-radius: 8px;

            .menu-title {
                font-size: 15px;
                margin-top: 10px;
                color: #000;
            }

            .menu-img {
                width: 50px;
                height: 50px;
            }
        }
    }

    .his-notice-title {
        display: flex;
        padding: 10px 0;
        font-size: 15px;

        .title-tag {
            display: inline-block;
            background-color: #4499f9;
            width: 5px;
            margin-right: 6px;
        }

        .title-label {
            display: inline-block;
            font-weight: 600;
        }

        .notice-more {
            display: flex;
            align-items: center;
            justify-content: center;
            color: #4ca7f9;
            margin-left: 25px;
            cursor: pointer;
            font-size: 13px;

            .svg-icon {
                color: #4ca7f9 !important;
                width: 15px;
                height: 15px;
            }

            span {
                font-size: 12px;
                margin-left: 5px;
            }
        }
    }

    .his-notice-body {
        height: 270px;

        .his-notice-item {
            display: flex;
            align-items: center;
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
                background-color: #F0F8FF;

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
                    width: 300px;
                    white-space:nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
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

        :deep(.el-badge__content.is-fixed.is-dot) {
            position: absolute;
            right: 10px;
            top: 7px;
        }
    }
}

.yd-card {
    .yd-card-header {
        display: flex;
        padding: 10px 0;
        font-size: 15px;

        .title-tag {
            display: inline-block;
            background-color: #4499f9;
            width: 5px;
            margin-right: 6px;
        }

        .title-label {
            display: inline-block;
            font-weight: 600;
        }
    }

    .yd-card-body {
        padding: 10px;
        min-height: 270px;
    }
}

.user-growth-chart,
.file-growth-chart {
    height: 270px;
}

.user-source-chart,
.user-surname-chart {
    height: 270px;
}</style>
