<template>
    <div class="page-header">
        <div class="logo">
            <img class="logo-img" src="~assets/logo.png" alt="logo" />
            <div class="syst-name">{{ siteConfig.siteName }}</div>
        </div>
        <div class="sitename">
            <span>您好！</span>
            <span>{{ adminInfo.jgmc }}</span>
            <span>（机构编码：{{ adminInfo.jgbm }}）</span>
        </div>
        <div class="header-nav">
            <div class="item item-split">|</div>
            <div class="item item-user">
                <Icon name="local-user" size="14" />
                <span>{{ adminInfo.username }}</span>
            </div>
            <div class="item item-msg">
                <Icon name="local-msg" size="14" />
                <el-badge :value="12"></el-badge>
                <span>消息</span>
            </div>
            <el-popover placement="bottom" :width="270" trigger="click">
                <template #reference>
                    <div class="item item-setting">
                        <Icon name="local-setting" size="14" />
                        <span>设置</span>
                    </div>
                </template>
                <div class="setting-container">
                    <el-form ref="formRef" :model="configStore.layout">
                        <el-form-item label="侧边菜单水平折叠" class="off-on">
                            <el-switch @change="onCommitState($event, 'menuCollapse')"
                                :model-value="configStore.layout.menuCollapse"></el-switch>
                        </el-form-item>
                        <el-form-item label="侧边菜单手风琴" class="off-on">
                            <el-switch @change="onCommitState($event, 'menuUniqueOpened')"
                                :model-value="configStore.layout.menuUniqueOpened"></el-switch>
                        </el-form-item>
                        <el-form-item label="侧边菜单宽度">
                            <el-input @input="onCommitState($event, 'menuWidth')" type="number" :step="10" :min="200" :max="500"
                                :model-value="configStore.layout.menuWidth">
                                <template #append>px</template>
                            </el-input>
                        </el-form-item>
                    </el-form>
                    <el-divider />
                    <div class="change-pwd">修改密码</div>
                    <el-divider />
                    <div class="clear-storage" @click="onClearCache('storage')">清理浏览器缓存</div>
                    <el-divider />
                    <div class="more-setting">更多设置</div>
                </div>
            </el-popover>

            <div class="item item-logout" @click="onLogout">
                <Icon name="local-logout" size="14" />
                <span>注销</span>
            </div>
            <div class="item item-split">|</div>
            <div class="item item-version">{{ siteConfig.version }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useSiteConfig } from '/@/stores/siteConfig'
import { useConfig } from '/@/stores/config'
import { Local,Session } from '/@/utils/storage'
import router from '/@/router'
import { ADMIN_INFO } from '/@/stores/constant/cacheKey'
import { useAdminInfo } from '/@/stores/adminInfo'
import { logout } from '/@/api/backend/index'

const siteConfig = useSiteConfig()
const configStore = useConfig()
const adminInfo = useAdminInfo()

const onCommitState = (value: any, name: any) => {
    configStore.setLayout(name, value)
}

const onClearCache = (type: string) => {
    if (type == 'storage') {
        const adminInfo = Local.get(ADMIN_INFO)
        Session.clear()
        Local.clear()
        Local.set(ADMIN_INFO, adminInfo)
    }
}

const onLogout = () => {
    logout().then(() => {
        Local.remove(ADMIN_INFO)
        router.go(0)
    })
}

</script>

<style scoped lang="scss">
.fold {
    margin-left: auto;
}

.unfold {
    margin: 0 auto;
}

.page-header {
    height: 40px;
    // line-height: 40px;
    background: #59A7FF;
    color: #fff;
    display: flex;
    justify-content: space-between;

    .logo {
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        font-size: 18px;

        .logo-img {
            width: 27px;
            height: 27px;
            background-color: #59A7FF;
            border-radius: 50%;
        }

        .syst-name {
            display: inline-block;
            overflow: hidden;
            min-width: 200px;
            margin-left: 10px;
            margin-right: 10px;
            // font-weight: bold;
        }
    }

    .sitename {
        display: inline-block;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        min-width: 370px;
        overflow: hidden;
    }

    .header-nav {
        display: inline-block;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        min-width: 450px;
        overflow: hidden;

        .item {
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
        }

        .icon {
            margin-right: 10px;
            color: #fff !important;
        }

        .item-split {
            margin-right: 30px;
        }

        .item-user {
            margin-right: 20px;
        }

        .item-msg {
            position: relative;
            margin-right: 20px;

            .el-badge {
                position: absolute;
                top: -5px;
                left: 10px;

                :deep(.el-badge__content) {
                    font-size: 9px;
                    padding: 0 5px;
                    border: none;
                }
            }

        }

        .item-setting {
            margin-right: 20px;
        }

        .item-logout {
            margin-right: 30px;
        }

        .item-version {
            margin-right: 20px;
        }

        .item-user:hover,
        .item-msg:hover,
        .item-setting:hover,
        .item-logout:hover {
            cursor: pointer;
        }
    }
}

.setting-container {
    padding: 5px 20px 5px 10px;

    :deep(.el-form .el-form-item.off-on) {
        justify-content: space-between;

        .el-form-item__content {
            flex: none;
        }
    }

    :deep(.el-input .el-input__wrapper) {
        box-shadow: none;

        .el-input__inner {
            border-bottom: 1px solid #f1f1f1;
        }

        .el-input__suffix-inner {
            border-bottom: 1px solid #f1f1f1;
        }
    }

    :deep(.el-input .el-input__wrapper.is-focus) {
        box-shadow: none !important;
    }

    :deep(.el-input .el-input-group__append) {
            box-shadow: none;
            background-color: #fff;
            padding: 0 5px;
        }

    .el-form-item {
        margin-bottom: 10px;
    }

    .change-pwd {
        display: flex;
        padding: 10px 0;
        color: #000;
    }

    .change-pwd:hover {
        background-color: #F0F8FF;
        cursor: pointer;
    }

    .clear-storage {
        display: flex;
        padding: 10px 0;
        color: #000;
    }

    .clear-storage:hover {
        background-color: #F0F8FF;
        cursor: pointer;
    }

    .more-setting {
        display: flex;
        padding: 10px 0;
        color: #000;
        letter-spacing: 1px;
        align-items: center;
        justify-content: center;
        text-align: center;
    }

    .more-setting:hover {
        background-color: #F0F8FF;
        cursor: pointer;
    }

    :deep(.el-divider--horizontal) {
        margin: 10px 0;
    }
}</style>
