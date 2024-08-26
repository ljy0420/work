<template>
    <el-aside v-if="!navTabs.state.tabFullScreen" class="layout-aside-Classic">
        <MenuVertical />
        <!-- <MenuVerticalBasic /> -->
        <div class="aside-bottom">
            <Icon name="local-menu-toggle" @click="onMenuCollapse" size="16" />
        </div>
    </el-aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MenuVertical from '/@/layouts/backend/components/menus/menuVertical.vue'
// import MenuVerticalBasic from '/@/layouts/backend/components/menus/menuVerticalBasic.vue'
import { useConfig } from '/@/stores/config'
import { useNavTabs } from '/@/stores/navTabs'
import { closeShade } from '/@/utils/pageShade'
import { Session } from '/@/utils/storage'
import { BEFORE_RESIZE_LAYOUT } from '/@/stores/constant/cacheKey'
import { setNavTabsWidth } from '/@/utils/layout'

defineOptions({
    name: 'layout/asidemenu',
})

const config = useConfig()
const navTabs = useNavTabs()

const menuWidth = computed(() => config.menuWidth())

const onMenuCollapse = function () {
    if (config.layout.shrink && !config.layout.menuCollapse) {
        closeShade()
    }

    config.setLayout('menuCollapse', !config.layout.menuCollapse)

    Session.set(BEFORE_RESIZE_LAYOUT, {
        layoutMode: config.layout.layoutMode,
        menuCollapse: config.layout.menuCollapse,
    })

    // 等待侧边栏动画结束后重新计算导航栏宽度
    setTimeout(() => {
        setNavTabsWidth()
    }, 350)
}

</script>

<style scoped lang="scss">
.layout-aside-Default {
    background: var(--ba-bg-color-overlay);
    margin: 10px 0 10px 10px;
    height: calc(100vh - 22px);
    box-shadow: var(--el-box-shadow-light);
    border-radius: var(--el-border-radius-base);
    overflow: hidden;
    transition: width 0.3s ease;
    width: v-bind(menuWidth);
}

.layout-aside-Classic,
.layout-aside-Double {
    background: var(--ba-bg-color-overlay);
    margin: 0px;
    padding-bottom: 30px;
    height: calc(100vh - 40px);
    overflow: hidden;
    transition: width 0.3s ease;
    width: v-bind(menuWidth);
}

.aside-bottom {
    height: 50px;
    line-height: 50px;
    padding-left: 24px;
}
</style>
