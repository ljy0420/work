<template>
    <el-container class="layout-container">
        <el-header class="header-container">
            <PageHeader />
        </el-header>
        <el-container>
            <AsideMenu />
            <el-container class="content-wrapper">
                <NavTab />
                <Main />
            </el-container>
        </el-container>
    </el-container>
    <CloseFullScreen v-if="navTabs.state.tabFullScreen" />
</template>

<script setup lang="ts">
import PageHeader from '/@/layouts/backend/components/pageHeader.vue'
import AsideMenu from '/@/layouts/backend/components/asideMenu.vue'
import NavTab from '/@/layouts/backend/components/navTabs.vue'
import Main from '/@/layouts/backend/router-view/main.vue'
import CloseFullScreen from '/@/layouts/backend/components/closeFullScreen.vue'
import { useNavTabs } from '/@/stores/navTabs'
const navTabs = useNavTabs()
</script>

<style scoped>
.layout-container {
    height: 100%;
    width: 100%;
}
.header-container{
    height: 40px;
    line-height: 40px;
    background: #59A7FF;
    color: #fff;
}
.content-wrapper {
    flex-direction: column;
    width: 100%;
    height: 100%;
}
</style>