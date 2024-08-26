<template>
    <div class="default-main home-container">
        <div class="banner">
            <el-row :gutter="10">
                <el-col :md="24" :lg="18">
                    <div class="welcome suspension">
                        <img class="welcome-img" :src="headerSvg" alt="" />
                        <div class="welcome-text">
                            <div class="welcome-title">{{ adminInfo.nickname + t('utils.comma') + getGreet() }}</div>
                            <div class="welcome-note">{{ state.remark }}</div>
                        </div>
                    </div>
                </el-col>
                <el-col :lg="6" class="hidden-md-and-down">
                    <div class="working">
                        <img class="working-coffee" :src="coffeeSvg" alt="" />
                        <div class="working-text">
                            {{ t('dashboard.You have worked today') }}<span class="time">{{ state.workingTimeFormat }}</span>
                        </div>
                        <div @click="onChangeWorkState()" class="working-opt working-rest">
                            {{ state.pauseWork ? t('dashboard.Continue to work') : t('dashboard.have a bit of rest') }}
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="small-panel-box">
            <el-row :gutter="20">
                <el-col :sm="12" :lg="6">
                    <div class="small-panel user-reg suspension">
                        <div class="small-panel-title">今日挂号数</div>
                        <div class="small-panel-content">
                            <div class="content-left">
                                <Icon color="#1AA5F3" size="20" name="fa fa-plus-circle" />
                                <span id="user_reg_number">2312</span>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :sm="12" :lg="6">
                    <div class="small-panel file suspension">
                        <div class="small-panel-title">急诊就诊数</div>
                        <div class="small-panel-content">
                            <div class="content-left">
                                <Icon color="#F48595" size="20" name="fa fa-frown-o" />
                                <span id="file_number">236</span>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :sm="12" :lg="6">
                    <div class="small-panel users suspension">
                        <div class="small-panel-title">住院病人数</div>
                        <div class="small-panel-content">
                            <div class="content-left">
                                <Icon color="#99A8B5" size="20" name="fa fa-h-square" />
                                <span id="users_number">1367</span>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :sm="12" :lg="6">
                    <div class="small-panel addons suspension">
                        <div class="small-panel-title">出院病人数</div>
                        <div class="small-panel-content">
                            <div class="content-left">
                                <Icon color="#AD85F4" size="20" name="fa fa-sign-out" />
                                <span id="addons_number">368</span>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="shortcut-menu">
            <el-row :gutter="20">
                <el-col :xs="24" :sm="24" :md="12" :lg="12">
                    <el-card class="shortcut-menu-card" shadow="hover" header="快捷菜单">
                        <div class="shortcut-menu-div">
                            <el-scrollbar>
                                <el-row :gutter="20">
                <el-col :sm="12" :lg="6">
                    <router-link class="h100" title="门诊就诊" to="/admin/xtgl/xtcdwh">
                        <div class="menu-panel suspension">
                            <Icon color="#8595F4" size="32" name="fa fa-plus-square" />
                            <div class="menu-title">门诊就诊</div>
                        </div>
                    </router-link>
                </el-col>
                <el-col :sm="12" :lg="6">
                    <!-- <a href="https://www.baidu.com" target="_blank">
                    <div class="menu-panel suspension">
                        <Icon color="#AD85F4" size="32" name="fa fa-file-text" />
                        <div class="menu-title">入院登记</div>
                    </div>
                    </a> -->
                    <div class="menu-panel suspension">
                        <Icon color="#AD85F4" size="32" name="fa fa-file-text" />
                        <div class="menu-title">入院登记</div>
                    </div>
                </el-col>
                <el-col :sm="12" :lg="6">
                    <div class="menu-panel suspension">
                        <Icon color="#74A8B5" size="32" name="fa fa-users" />
                        <div class="menu-title">护理中心</div>
                    </div>
                </el-col>
                <el-col :sm="12" :lg="6">
                    <div class="menu-panel suspension">
                        <Icon color="#F48595" size="32" name="fa fa-search" />
                        <div class="menu-title">档案查询</div>
                    </div>
                </el-col>
                <el-col :sm="12" :lg="6">
                    <div class="menu-panel suspension">
                        <Icon color="#8595F4" size="32" name="fa fa-plus-square" />
                        <div class="menu-title">门诊就诊</div>
                    </div>
                </el-col>
                <el-col :sm="12" :lg="6">
                    <div class="menu-panel suspension">
                        <Icon color="#AD85F4" size="32" name="fa fa-file-text" />
                        <div class="menu-title">入院登记</div>
                    </div>
                </el-col>
                <el-col :sm="12" :lg="6">
                    <div class="menu-panel suspension">
                        <Icon color="#74A8B5" size="32" name="fa fa-users" />
                        <div class="menu-title">护理中心</div>
                    </div>
                </el-col>
                <el-col :sm="12" :lg="6">
                    <div class="menu-panel suspension">
                        <Icon color="#F48595" size="32" name="fa fa-search" />
                        <div class="menu-title">档案查询</div>
                    </div>
                </el-col>
                <el-col :sm="12" :lg="6">
                    <div class="menu-panel suspension">
                        <Icon color="#8595F4" size="32" name="fa fa-plus-square" />
                        <div class="menu-title">门诊就诊</div>
                    </div>
                </el-col>
                <el-col :sm="12" :lg="6">
                    <div class="menu-panel suspension">
                        <Icon color="#AD85F4" size="32" name="fa fa-file-text" />
                        <div class="menu-title">入院登记</div>
                    </div>
                </el-col>
                <el-col :sm="12" :lg="6">
                    <div class="menu-panel suspension">
                        <Icon color="#74A8B5" size="32" name="fa fa-users" />
                        <div class="menu-title">护理中心</div>
                    </div>
                </el-col>
            </el-row>
                            </el-scrollbar>
                        </div>
                    </el-card>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12">
                    <el-card class="his-notice-card" shadow="hover" header="院内公告">
                        <div class="his-notice-div">
                            <el-scrollbar>
                                <div class="his-notice-item">
                                    <Icon class="notice-item-icon" color="#8595F4" name="fa fa-bell-o" />
                                    <div class="notice-item-base">
                                        <div class="notice-item-date">2023-08-08</div>
                                        <div class="notice-item-content">院内公告院内公告院内公告院内公告院内公告院内公告院内公告...</div>
                                    </div>
                                    <Icon class="notice-item-arrow" color="#8595F4" name="fa fa-angle-right" />
                                </div>
                                <div class="his-notice-item">
                                    <Icon class="notice-item-icon" color="#8595F4" name="fa fa-bell-o" />
                                    <div class="notice-item-base">
                                        <div class="notice-item-date">2023-08-08</div>
                                        <div class="notice-item-content">院内公告院内公告院内公告院内公告院内公告院内公告院内公告...</div>
                                    </div>
                                    <Icon class="notice-item-arrow" color="#8595F4" name="fa fa-angle-right" />
                                </div>
                                <div class="his-notice-item">
                                    <Icon class="notice-item-icon" color="#8595F4" name="fa fa-bell-o" />
                                    <div class="notice-item-base">
                                        <div class="notice-item-date">2023-08-08</div>
                                        <div class="notice-item-content">院内公告院内公告院内公告院内公告院内公告院内公告院内公告...</div>
                                    </div>
                                    <Icon class="notice-item-arrow" color="#8595F4" name="fa fa-angle-right" />
                                </div>
                                <div class="his-notice-item">
                                    <Icon class="notice-item-icon" color="#8595F4" name="fa fa-bell-o" />
                                    <div class="notice-item-base">
                                        <div class="notice-item-date">2023-08-08</div>
                                        <div class="notice-item-content">院内公告院内公告院内公告院内公告院内公告院内公告院内公告...</div>
                                    </div>
                                    <Icon class="notice-item-arrow" color="#8595F4" name="fa fa-angle-right" />
                                </div>
                                <div class="his-notice-item">
                                    <Icon class="notice-item-icon" color="#8595F4" name="fa fa-bell-o" />
                                    <div class="notice-item-base">
                                        <div class="notice-item-date">2023-08-08</div>
                                        <div class="notice-item-content">院内公告院内公告院内公告院内公告院内公告院内公告院内公告...</div>
                                    </div>
                                    <Icon class="notice-item-arrow" color="#8595F4" name="fa fa-angle-right" />
                                </div>
                            </el-scrollbar>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>

        <div class="growth-chart">
            <el-row :gutter="20">
                <el-col class="lg-mb-20" :xs="24" :sm="24" :md="12" :lg="12">
                    <el-card shadow="hover" header="门急诊周数据">
                        <div class="user-growth-chart" :ref="chartRefs.set"></div>
                    </el-card>
                </el-col>
                <el-col class="lg-mb-20" :xs="24" :sm="24" :md="12" :lg="12">
                    <el-card shadow="hover" header="科室病人数分布">
                        <div class="user-surname-chart" :ref="chartRefs.set"></div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, nextTick, onActivated, watch, onBeforeMount } from 'vue'
import headerSvg from '/@/assets/dashboard/header-1.svg'
import coffeeSvg from '/@/assets/dashboard/coffee.svg'
import { CountUp } from 'countup.js'
import * as echarts from 'echarts'
import { useNavTabs } from '/@/stores/navTabs'
import { useTemplateRefsList } from '@vueuse/core'
import { dashboard } from '/@/api/backend/dashboard'
import { useI18n } from 'vue-i18n'
import { Local } from '/@/utils/storage'
import { useAdminInfo } from '/@/stores/adminInfo'
import { WORKING_TIME } from '/@/stores/constant/cacheKey'
import { getGreet } from '/@/utils/common'
import { useEventListener } from '@vueuse/core'
let workTimer: number

defineOptions({
    name: 'dashboard',
})

const d = new Date()
const { t } = useI18n()
const navTabs = useNavTabs()
const adminInfo = useAdminInfo()
const chartRefs = useTemplateRefsList<HTMLDivElement>()

const state: {
    charts: any[]
    remark: string
    workingTimeFormat: string
    pauseWork: boolean
} = reactive({
    charts: [],
    remark: 'dashboard.Loading',
    workingTimeFormat: '',
    pauseWork: false,
})

dashboard().then((res) => {
    state.remark = res.data.remark
})

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
                t('dashboard.Monday'),
                t('dashboard.Tuesday'),
                t('dashboard.Wednesday'),
                t('dashboard.Thursday'),
                t('dashboard.Friday'),
                t('dashboard.Saturday'),
                t('dashboard.Sunday'),
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
                data: [100, 160, 280, 230, 190, 200, 480],
                type: 'line',
                smooth: true,
                areaStyle: {
                    color: '#8595F4',
                },
            },
            {
                name: '急诊',
                data: [45, 180, 146, 99, 210, 127, 288],
                type: 'line',
                smooth: true,
                areaStyle: {
                    color: '#F48595',
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
            data: ['外科','内科','放射科','检验科','急诊科','皮肤科','信息科','功能科','儿科'],
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
                    { name: '信息科', value: 356 },
                    { name: '功能科', value: 89 },
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

const onChangeWorkState = () => {
    const time = parseInt((new Date().getTime() / 1000).toString())
    const workingTime = Local.get(WORKING_TIME)
    if (state.pauseWork) {
        // 继续工作
        workingTime.pauseTime += time - workingTime.startPauseTime
        workingTime.startPauseTime = 0
        Local.set(WORKING_TIME, workingTime)
        state.pauseWork = false
        startWork()
    } else {
        // 暂停工作
        workingTime.startPauseTime = time
        Local.set(WORKING_TIME, workingTime)
        clearInterval(workTimer)
        state.pauseWork = true
    }
}

const startWork = () => {
    const workingTime = Local.get(WORKING_TIME) || { date: '', startTime: 0, pauseTime: 0, startPauseTime: 0 }
    const currentDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
    const time = parseInt((new Date().getTime() / 1000).toString())

    if (workingTime.date != currentDate) {
        workingTime.date = currentDate
        workingTime.startTime = time
        workingTime.pauseTime = workingTime.startPauseTime = 0
        Local.set(WORKING_TIME, workingTime)
    }

    let startPauseTime = 0
    if (workingTime.startPauseTime <= 0) {
        state.pauseWork = false
        startPauseTime = 0
    } else {
        state.pauseWork = true
        startPauseTime = time - workingTime.startPauseTime // 已暂停时间
    }

    let workingSeconds = time - workingTime.startTime - workingTime.pauseTime - startPauseTime

    state.workingTimeFormat = formatSeconds(workingSeconds)
    if (!state.pauseWork) {
        workTimer = window.setInterval(() => {
            workingSeconds++
            state.workingTimeFormat = formatSeconds(workingSeconds)
        }, 1000)
    }
}

const formatSeconds = (seconds: number) => {
    var secondTime = 0 // 秒
    var minuteTime = 0 // 分
    var hourTime = 0 // 小时
    var dayTime = 0 // 天
    var result = ''

    if (seconds < 60) {
        secondTime = seconds
    } else {
        // 获取分钟，除以60取整数，得到整数分钟
        minuteTime = Math.floor(seconds / 60)
        // 获取秒数，秒数取佘，得到整数秒数
        secondTime = Math.floor(seconds % 60)
        // 如果分钟大于60，将分钟转换成小时
        if (minuteTime >= 60) {
            // 获取小时，获取分钟除以60，得到整数小时
            hourTime = Math.floor(minuteTime / 60)
            // 获取小时后取佘的分，获取分钟除以60取佘的分
            minuteTime = Math.floor(minuteTime % 60)
            if (hourTime >= 24) {
                // 获取天数， 获取小时除以24，得到整数天
                dayTime = Math.floor(hourTime / 24)
                // 获取小时后取余小时，获取分钟除以24取余的分；
                hourTime = Math.floor(hourTime % 24)
            }
        }
    }

    result =
        hourTime +
        t('dashboard.hour') +
        ((minuteTime >= 10 ? minuteTime : '0' + minuteTime) + t('dashboard.minute')) +
        ((secondTime >= 10 ? secondTime : '0' + secondTime) + t('dashboard.second'))
    if (dayTime > 0) {
        result = dayTime + t('dashboard.day') + result
    }
    return result
}

onActivated(() => {
    echartsResize()
})

onMounted(() => {
    startWork()
    initCountUp()
    initUserGrowthChart()
    initUserSurnameChart()
    useEventListener(window, 'resize', echartsResize)
})

onBeforeMount(() => {
    for (const key in state.charts) {
        state.charts[key].dispose()
    }
})

onUnmounted(() => {
    clearInterval(workTimer)
})

watch(
    () => navTabs.state.tabFullScreen,
    () => {
        echartsResize()
    }
)
</script>

<style scoped lang="scss">
.home-container {
    padding: 5px;
}
.welcome {
    background: #e1eaf9;
    border-radius: 6px;
    display: flex;
    align-items: center;
    padding: 15px 20px !important;
    box-shadow: 0 0 30px 0 rgba(82, 63, 105, 0.05);
    .welcome-img {
        height: 100px;
        margin-right: 10px;
        user-select: none;
    }
    .welcome-title {
        font-size: 1.5rem;
        line-height: 30px;
        color: var(--ba-color-primary-light);
    }
    .welcome-note {
        padding-top: 6px;
        font-size: 15px;
        color: var(--el-text-color-primary);
    }
}
.working {
    height: 130px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    height: 100%;
    position: relative;
    &:hover {
        .working-coffee {
            -webkit-transform: translateY(-4px) scale(1.02);
            -moz-transform: translateY(-4px) scale(1.02);
            -ms-transform: translateY(-4px) scale(1.02);
            -o-transform: translateY(-4px) scale(1.02);
            transform: translateY(-4px) scale(1.02);
            z-index: 999;
        }
    }
    .working-coffee {
        transition: all 0.3s ease;
        width: 80px;
    }
    .working-text {
        display: block;
        width: 100%;
        font-size: 15px;
        text-align: center;
        color: var(--el-text-color-primary);
    }
    .working-opt {
        position: absolute;
        top: -40px;
        right: 10px;
        background-color: rgba($color: #000000, $alpha: 0.3);
        padding: 10px 20px;
        border-radius: 20px;
        color: var(--ba-bg-color-overlay);
        transition: all 0.3s ease;
        cursor: pointer;
        opacity: 0;
        z-index: 999;
        &:active {
            background-color: rgba($color: #000000, $alpha: 0.6);
        }
    }
    &:hover {
        .working-opt {
            opacity: 1;
            top: 0;
        }
        .working-done {
            opacity: 1;
            top: 50px;
        }
    }
}
.small-panel-box {
    margin-top: 20px;
}
.small-panel {
    background-color: #e9edf2;
    border-radius: var(--el-border-radius-base);
    padding: 25px;
    margin-bottom: 20px;
    .small-panel-title {
        color: #92969a;
        font-size: 15px;
    }
    .small-panel-content {
        display: flex;
        align-items: flex-end;
        margin-top: 20px;
        color: #2c3f5d;
        .content-left {
            font-size: 24px;
            .icon {
                margin-right: 10px;
            }
            span {
                display: inline-block;
                font-size: 28px;
            }
        }
        .content-right {
            font-size: 18px;
            margin-left: auto;
        }
        .color-success {
            color: var(--el-color-success);
        }
        .color-warning {
            color: var(--el-color-warning);
        }
        .color-danger {
            color: var(--el-color-danger);
        }
        .color-info {
            color: var(--el-text-color-secondary);
        }
    }
}
.shortcut-menu {
    margin-bottom: 20px;
}
.user-growth-chart,
.file-growth-chart {
    height: 400px;
}
.shortcut-menu-div {
    height: 300px;
    padding: 10px;
    a{
        text-decoration: none;
    }
    .menu-panel{
        background-color: #e9edf2;
        padding: 25px;
        margin-bottom: 20px;
        text-align: center; 
        border-radius: 15px;
        margin-left:10px;
        margin-top: 10px;
        .menu-title {
            font-size: 15px;
            margin-top: 10px;
            color: #000;
        }
    }
}
.his-notice-div{
    height: 300px;
}

.user-source-chart,
.user-surname-chart {
    height: 400px;
}
.new-user-item {
    display: flex;
    align-items: center;
    padding: 20px;
    margin: 10px 15px;
    box-shadow: 0 0 30px 0 rgba(82, 63, 105, 0.05);
    background-color: var(--ba-bg-color-overlay);
    .new-user-avatar {
        height: 48px;
        width: 48px;
        border-radius: 50%;
    }
    .new-user-base {
        margin-left: 10px;
        color: #2c3f5d;
        .new-user-name {
            font-size: 15px;
        }
        .new-user-time {
            font-size: 13px;
        }
    }
    .new-user-arrow {
        margin-left: auto;
    }
}

.his-notice-item{
    display: flex;
    align-items: center;
    padding: 10px 20px;
    margin: 10px 15px;
    box-shadow: 0 0 30px 0 rgba(82, 63, 105, 0.05);
    background-color: var(--ba-bg-color-overlay);
    border-radius: 15px;
    .notice-item-base {
        margin-left: 10px;
        color: #2c3f5d;
        .notice-item-date {
            font-size: 15px;
        }
        .notice-item-content {
            padding: 5px 1px;
            font-size: 13px;
        }
    }
    .notice-item-arrow {
        margin-left: auto;
    }
}
.shortcut-menu-card :deep(.el-card__body) {
    padding: 0;
}
.his-notice-card :deep(.el-card__body) {
    padding: 0;
}

@media screen and (max-width: 425px) {
    .welcome-img {
        display: none;
    }
}
@media screen and (max-width: 1200px) {
    .lg-mb-20 {
        margin-bottom: 20px;
    }
}
html.dark {
    .welcome {
        background-color: var(--ba-bg-color-overlay);
    }
    .small-panel {
        background-color: var(--ba-bg-color-overlay);
        .small-panel-content {
            color: var(--el-text-color-regular);
        }
    }
    .menu-panel{
        background-color: var(--ba-bg-color-overlay);
    }
    .new-user-item {
        .new-user-base {
            color: var(--el-text-color-regular);
        }
    }
}
</style>
