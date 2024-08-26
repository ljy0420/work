<template>
    <div class="nav-bar">
        <NavTabs />
    </div>
</template>

<script setup lang="ts">
import { useConfig } from '/@/stores/config'
import NavTabs from '/@/layouts/backend/components/navBar/tabs.vue'

const config = useConfig()

</script>

<style scoped lang="scss">
.nav-bar {
    display: flex;
    height: 36px;
    width: 100%;
    margin: 5px 0px 0px 6px;
    background-color: v-bind('config.getColorVal("headerBarBackground")');
    :deep(.nav-tabs) {
        display: flex;
        height: 100%;
        position: relative;
        .ba-nav-tab {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 20px;
            cursor: pointer;
            z-index: 1;
            height: 100%;
            user-select: none;
            color: v-bind('config.getColorVal("headerBarTabColor")');
            transition: all 0.2s;
            -webkit-transition: all 0.2s;
            .close-icon {
                padding: 2px;
                margin: 2px 0 0 4px;
            }
            .close-icon:hover {
                background: var(--ba-color-primary-light);
                color: var(--el-border-color) !important;
                border-radius: 50%;
            }
            &.active {
                color: v-bind('config.getColorVal("headerBarTabActiveColor")');
            }
            &:hover {
                background-color: v-bind('config.getColorVal("headerBarHoverBackground")');
            }
        }
        .nav-tabs-active-box {
            position: absolute;
            height: 50px;
            background-color: v-bind('config.getColorVal("headerBarTabActiveBackground")');
            transition: all 0.2s;
            -webkit-transition: all 0.2s;
        }
    }
}
.unfold {
    align-self: center;
    padding-left: var(--ba-main-space);
}
</style>
