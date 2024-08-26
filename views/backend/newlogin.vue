<script setup lang="ts">
import { onMounted, onBeforeUnmount, reactive, ref } from 'vue'
import type { FormInstance, InputInstance } from 'element-plus'
import { ElNotification } from 'element-plus'
import { useConfig } from '/@/stores/config'
import { useAdminInfo } from '/@/stores/adminInfo'
import { login } from '/@/api/backend'
import { buildValidatorData } from '/@/utils/validate'
import router from '/@/router'
let timer: number

const config = useConfig()
const adminInfo = useAdminInfo()

const formRef = ref<FormInstance>()
const usernameRef = ref<InputInstance>()
const passwordRef = ref<InputInstance>()
const state = reactive({
    showCaptcha: false,
    submitLoading: false,
    jgmc: '',
    showPwd: false
})
const form = reactive({
    JGBM: '',
    RYBM: '',
    KL: ''
})

const page = reactive({
    agranList: [{
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
    login('get').then((res) => {
        state.showCaptcha = false
        page.agranList = []
        if (res.data.length > 0) {
            res.data.forEach((element: { JGBM: any; JGMC: any }) => {
                page.agranList.push({ value: element.JGBM, label: element.JGMC 
                })
            });
        }
    }).catch((err) => {
        console.log(err)
    })
})

const onJgChange = (item: any) => {
    form.RYBM = item
    state.jgmc = page.agranList.find((ele: any) => ele.value == item)?.label
}

onBeforeUnmount(() => {
    clearTimeout(timer)
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
    login('post', { agrs: form }).then((res) => {
        adminInfo.dataFill(res.data.userInfo)
        ElNotification({
            message: res.msg,
            type: 'success',
        })
        router.push({ path: res.data.routePath })
    }).finally(() => {
        state.submitLoading = false
    })
}

const showPwd = () => {
    state.showPwd = true
}

const hidePwd = () => {
    state.showPwd = false
}

</script>

<template>
  <div class="login">
    <div class="login_box">
      <div class="login_box_left">
        <div class="bgi"></div>
      </div>

      <div class="login_box_right ">
        <div class="title">
          <h4>{{ state.jgmc }}</h4>
          <h3>医院信息管理系统</h3>
          <h5>HOSPITAL INFOMATION SYSTEM</h5>
        </div>
        <div class="login_form">
          <el-form @keyup.enter="onSubmitPre()" ref="formRef" :rules="rules" size="large" :model="form"
            label-width="50px">
            <el-form-item prop="JGBM" label="">
              <el-select class="input" v-model="form.JGBM" placeholder="请选择机构" clearable style="width: 100%;"
                @change="onJgChange">
                <el-option v-for="item in page.agranList" :key="item.value" :label="item.label" :value="item.value" />
                <template #prefix>
                  <Icon name="local-org" />
                </template>
              </el-select>
            </el-form-item>
            <el-form-item prop="RYBM" label="">
              <el-input class="input" ref="usernameRef" type="text" clearable v-model="form.RYBM" placeholder="请输入用户名">
                <template #prefix>
                  <Icon name="local-user-fill" />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="KL" label="">
              <el-input class="input" ref="passwordRef" v-model="form.KL" :type="state.showPwd ? 'text' : 'password'"
                placeholder="请输入密码">
                <template #prefix>
                  <Icon name="local-pwd" />
                </template>
                <template #suffix>
                  <Icon v-if="!state.showPwd" name="local-pwd-hide" @click="showPwd" />
                  <Icon v-else name="local-pwd-show" @click="hidePwd" />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button :loading="state.submitLoading" class="submit-button" round plain size="large"
                @click="onSubmitPre()">
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="copyright">
      <h6>Copyright 2014-2023 All Rights Reserved 湖南达尔健科技有限公司 版权所有 <span>版本v4.0.0</span></h6>
      <h6>客户服务电话: 133-5722-6667</h6>
    </div>
  </div>
</template>
<style scoped lang="scss">
.login {
  width: 100vw;
  height: 100vh;
  background: url(/@/assets/login-bg-new.png) no-repeat center center/cover;
  // background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .login_box {
    width: 1000px;
    height: 530px;
    border-radius: 20px;
    display: flex;
    box-shadow: 1px 1px 46px 1px #85c1fc;

    .login_box_left {
      width: 60%;
      height: 100%;
      padding: 60px;
      background-color: #fff;
      border-radius: 20px 0 0 20px;
      display: flex;
      align-items: center;
      justify-content: center;

      .bgi {
        width: 100%;
        height: 100%;
        background: url(/@/assets/login-form-bg-new.png) no-repeat;
        background-size: contain;
      }
    }

    .login_box_right {
      width: 40%;
      height: 100%;
      background-color: #409eff;
      border-radius: 0 20px 20px 0;

      .title {
        margin-top: 50px;
        color: #fff;
        text-align: center;
        font-weight: normal;

        h4 {
          margin: 0 auto;
          font-size: 23px;
          font-weight: normal;

        }

        h3 {
          font-size: 38px;
          font-weight: normal;

        }

        h5 {
          color: #70b2ff;
          font-weight: normal;
          font-size: 19px;
        }
      }

      .login_form {
        margin-top: 40px;

        .el-form-item {
          width: 88%;
          margin-top: 30px;

          :deep(.el-input__wrapper) {
            border-radius: 20px;
          }

          :deep(.el-form-item__error) {
            left: 41px;
          }

          :deep(.svg-icon) {
            color: var(--el-input-icon-color) !important;
          }

          .submit-button {
            font-size: 17px;
            letter-spacing: 20px;
            margin-top: 5px;
            width: 100%;
            background-color: #0b60b8;
            color: #fff;
            border: none
          }

          .submit-button:hover {
            opacity: 0.9
          }
        }

        .el-form-item:last-child {
          width: 88%;
          margin-top: 50px;
        }

        :deep(.is-success .el-input__prefix .svg-icon) {
          color: #409eff !important;
        }

        :deep(.is-error .el-input__prefix .svg-icon) {
          color: #409eff !important;
        }

        :deep(.is_focus .el-input__prefix .svg-icon) {
          color: #409eff !important;
        }
      }

      :deep(.el-form-item.is-error .el-input__wrapper) {
        box-shadow: none;
      }
    }
  }

  .copyright {
    // position: fixed;
    // bottom: 8%;
    margin-top: 50px;
    color: #cdcdcd;
    text-align: center;

    h6 {
      font-size: 16px;
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
