<template>
    <div>
        <div @contextmenu.stop="" id="bubble" class="bubble">
            <canvas id="bubble-canvas" class="bubble-canvas"></canvas>
        </div>
        <div class="login">
            <div class="login-box">
                <div class="title">医院信息管理系统</div>
                <div class="form">
                    <div class="content">
                        <el-form @keyup.enter="onSubmitPre()" ref="formRef" :rules="rules" size="large" :model="form" label-width="50px">
                            <el-form-item prop="JGBM" label="机构">
                                <el-select v-model="form.JGBM" placeholder="请选择机构" clearable style="width: 100%;" @change="onJgChange">
                                    <el-option v-for="item in page.agranList" :key="item.value" :label="item.label" :value="item.value"/>
                                    <template #prefix>
                                        <Icon name="fa fa-institution" class="form-item-icon" size="10" color="var(--el-input-icon-color)" />
                                    </template>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="RYBM" label="用户">
                                <el-input
                                    ref="usernameRef"
                                    type="text"
                                    clearable
                                    v-model="form.RYBM"
                                    placeholder="请输入用户名"
                                >
                                    <template #prefix>
                                        <Icon name="fa fa-user" class="form-item-icon" size="16" color="var(--el-input-icon-color)" />
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item prop="KL" label="密码">
                                <el-input
                                    ref="passwordRef"
                                    v-model="form.KL"
                                    type="password"
                                    placeholder="请输入密码"
                                    show-password
                                >
                                    <template #prefix>
                                        <Icon name="fa fa-unlock-alt" class="form-item-icon" size="16" color="var(--el-input-icon-color)" />
                                    </template>
                                </el-input>
                            </el-form-item>
                            <!-- <el-checkbox v-model="form.keep" :label="t('login.Hold session')" size="default"></el-checkbox> -->
                            <el-form-item>
                                <el-button
                                    :loading="state.submitLoading"
                                    class="submit-button"
                                    round
                                    type="primary"
                                    size="large"
                                    @click="onSubmitPre()"
                                >
                                    登录
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div class="footer">
                    <div class="copyright">Copyright  2014-2023 All Rights Reserved 湖南达尔健科技有限公司 版权所有</div>
                    <div class="kefu">客户服务电话: 133-5722-6667</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, reactive, ref } from 'vue'
import * as pageBubble from '/@/utils/pageBubble'
import type { FormInstance, InputInstance } from 'element-plus'
import { ElNotification } from 'element-plus'
import { useConfig } from '/@/stores/config'
import { useAdminInfo } from '/@/stores/adminInfo'
import { login } from '/@/api/backend'
import { buildValidatorData } from '/@/utils/validate'
import router from '/@/router'
import toggleDark from '/@/utils/useDark'
let timer: number

const config = useConfig()
const adminInfo = useAdminInfo()
toggleDark(config.layout.isDark)

const formRef = ref<FormInstance>()
const usernameRef = ref<InputInstance>()
const passwordRef = ref<InputInstance>()
const state = reactive({
    showCaptcha: false,
    submitLoading: false,
})
const form = reactive({
    JGBM: '',
    RYBM: '',
    KL: ''
})

const page = reactive({
    agranList:[{
        value: -1,
        label: '请选择'
    }]
})

// 表单验证规则
const rules = reactive({
    JGBM: [{ required: true, message: '请选择机构', trigger: 'change' }],
    RYBM: [{ required: true, message: '请输入用户名' }],
    KL: [buildValidatorData({ name: 'required', message: '请输入密码' }), buildValidatorData({ name: 'password' })],
})

onMounted(() => {
    timer = window.setTimeout(() => {
        pageBubble.init()
    }, 1000)

    login('get')
        .then((res) => {
            //state.showCaptcha = res.data.captcha
            state.showCaptcha = false
            page.agranList = []
            if(res.data.length>0){
                res.data.forEach((element: { JGBM: any; JGMC: any }) => {
                    page.agranList.push({ value:element.JGBM, label:element.JGMC })
                });
            }
            //nextTick(() => focusInput())
        })
        .catch((err) => {
            console.log(err)
        })
})

const onJgChange = (item: any) => {
    form.RYBM = item
}

onBeforeUnmount(() => {
    clearTimeout(timer)
    pageBubble.removeListeners()
})

const onSubmitPre = () => {
    formRef.value?.validate((valid) => {
        if (valid) {
            onSubmit()
        }
    })
}

const onSubmit = () => {
    state.submitLoading = true
    //form.captchaInfo = captchaInfo
    login('post', { agrs: form })
        .then((res) => {
            adminInfo.dataFill(res.data.userInfo)
            ElNotification({
                message: res.msg,
                type: 'success',
            })
            router.push({ path: res.data.routePath })
        })
        .finally(() => {
            state.submitLoading = false
        })
}
</script>

<style scoped lang="scss">
.bubble {
    overflow: hidden;
    // background-image: url(/@/assets/logo-bg.png);
    // background-color: #faf9f9;
    background: url(/@/assets/bg.jpg) repeat;
}
.form-item-icon {
    height: auto;
}
.login {
    position: absolute;
    top: 0;
    display: flex;
    width: 100vw;
    height: 100vh;
    align-items: center;
    justify-content: center;
    .login-box {
        overflow: hidden;
        width: 922px;
        height: 550px;
        padding: 0;
        background: url(/@/assets/login-form-bg.png) no-repeat;
        margin-bottom: 80px;
    }
    .title{
        text-align: center;
        color: #fff;
        margin-top: 30px;
        font-size: 50px;
        font-family: '华文行楷';
    }
    .form {
        position: relative;
        .content {
            margin-left: 520px;
            margin-right: 10px;
            padding: 90px 40px 40px 40px;
        }
        .submit-button {
            width: 100%;
            letter-spacing: 2px;
            font-weight: 300;
            margin-top: 15px;
            --el-button-bg-color: var(--el-color-primary);
        }
    }
    .footer{
        text-align: center;
        color: #fff;
        font-weight: 600;
        font-family: '微软雅黑';
        .copyright{
            font-size: 17px;
            margin-top: 5px;
        }
        .kefu{
            font-size: 15px;
            margin-top: 10px;
        }
    }
}

@media screen and (max-width: 720px) {
    .login {
        display: flex;
        align-items: center;
        justify-content: center;
        .login-box {
            width: 600px;
            margin-top: 0;
        }
    }
}
.chang-lang :deep(.el-dropdown-menu__item) {
    justify-content: center;
}
.content :deep(.el-input__prefix) {
    display: flex;
    align-items: center;
}

@media screen and (max-height: 800px) {
    .login .login-box {
        margin-bottom: 0;
    }
}
</style>
