<template>
    <template v-for="menu in props.menus">
        <template v-if="menu.children && menu.children.length > 0 && menu.children.find((m)=>m.meta.hide_in_menu==false)">
            <el-sub-menu @click="onClickSubMenu(menu)" :index="menu.path" :key="menu.path" v-if="!menu.meta?.hide_in_menu">
                <template #title>
                    <Icon v-if="menu.meta?.pid===0" :color="config.getColorVal('menuColor')" :name="menu.meta?.icon ? menu.meta?.icon : config.layout.menuDefaultIcon" />
                    <span v-else>&nbsp;&nbsp;&nbsp;</span>
                    <span>{{ menu.meta?.title ? menu.meta?.title : $t('noTitle') }}</span>
                </template>
                <menu-tree :menus="menu.children"></menu-tree>
            </el-sub-menu>
        </template>
        <template v-else>
            <el-menu-item :index="menu.path" :key="menu.path" @click="onClickMenu(menu)" v-if="!menu.meta?.hide_in_menu">
                <Icon v-if="menu.meta?.pid===0" :color="config.getColorVal('menuColor')" :name="menu.meta?.icon ? menu.meta?.icon : config.layout.menuDefaultIcon" />
                <span v-else>&nbsp;&nbsp;&nbsp;</span>
                <span>{{ menu.meta?.title ? menu.meta?.title : $t('noTitle') }}</span>
            </el-menu-item>
        </template>
    </template>
</template>
<script setup lang="ts">
import { useConfig } from '/@/stores/config'
import { RouteRecordRaw } from 'vue-router'
import { onClickMenu } from '/@/utils/router'

const config = useConfig()

interface Props {
    menus: RouteRecordRaw[]
}
const props = withDefaults(defineProps<Props>(), {
    menus: () => [],
})

const onClickSubMenu = (menu: RouteRecordRaw) => {
    if (['Streamline', 'Double'].includes(config.layout.layoutMode) && menu.children?.length) {
        onClickMenu(menu.children[0])
    }
}
</script>

<style scoped lang="scss">
.el-sub-menu .icon,
.el-menu-item .icon {
    vertical-align: middle;
    margin-right: 5px;
    width: 24px;
    text-align: center;
    flex-shrink: 0;
}
.is-active > .icon {
    color: var(--el-menu-active-color) !important;
}
.el-menu-item.is-active {
    background-color: v-bind('config.getColorVal("menuActiveBackground")');
}
</style>
