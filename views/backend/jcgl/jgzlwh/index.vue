<template>
    <div class="jgzl-container">
        <div class="ba-operate-form ba-edit-form yd-input-round" :style="'width: calc(60% - ' + 100 / 2 + 'px)'" style="border: 1px solid #aaa;border-radius: 20px;background-color: #fff;">
            <el-form ref="formRef" :inline="true" :model="formData.items" label-position="right" :label-width="'130px'" :rules="rules">
                <el-form-item prop="JGBM" label="机构编码">
                    <el-input type="string" v-model="formData.items.JGBM" placeholder="请输入机构编码" :readonly="true"></el-input>
                </el-form-item>
                <el-form-item prop="JGJB" label="机构级别">
                    <el-select
                        v-model="formData.items.JGJB"
                        placeholder="请选择机构级别"
                        clearable
                        style="width: 100%;"
                        :disabled="true"
                        >
                        <el-option v-for="opt in jgjbOptions" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="XZQHBM" label="行政区划">
                    <el-select
                        v-model="formData.items.XZQHBM"
                        placeholder="请选择行政区划"
                        clearable
                        style="width: 100%;"
                        :disabled="true"
                        >
                        <el-option v-for="opt in state.xzqhOptions" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="JGMC" label="机构名称">
                    <el-input type="string" v-model="formData.items.JGMC" @change="mChange" placeholder="请输入机构名称"></el-input>
                </el-form-item>
                <el-form-item prop="ZZJGDM" label="组织机构代码">
                    <el-input type="string" v-model="formData.items.ZZJGDM" placeholder="请输入组织机构代码"></el-input>
                </el-form-item>
                <el-form-item prop="JGXZ" label="机构性质">
                    <el-input type="string" v-model="formData.items.JGXZ" placeholder="请输入机构性质"></el-input>
                </el-form-item>
                <el-form-item prop="FR" label="法人">
                    <el-input type="string" v-model="formData.items.FR" placeholder="请输入法人"></el-input>
                </el-form-item>
                <el-form-item prop="LXDH" label="联系电话">
                    <el-input type="string" v-model="formData.items.LXDH" placeholder="请输入联系电话"></el-input>
                </el-form-item>
                <FormItem
                    label="管理机构"
                    v-model="formData.items.GLJGBZ"
                    type="radio"
                    :data="{ content: { '1': '是', '0': '否' }, childrenAttr: { border: true } }"
                />
                <FormItem
                    label="有效状态"
                    v-model="formData.items.YXZT"
                    type="radio"
                    :data="{ content: { '0': '否', '1': '是' }, childrenAttr: { border: true } }"
                />
                <el-form-item prop="ZBZRS" label="总编制人数">
                    <el-input type="string" v-model="formData.items.ZBZRS" placeholder="请输入总编制人数"></el-input>
                </el-form-item>
                <el-form-item prop="ZYM" label="自编码">
                    <el-input type="string" v-model="formData.items.ZBM" placeholder="请输入自编码"></el-input>
                </el-form-item>
                <el-form-item prop="PYM" label="拼音码">
                    <el-input type="string" v-model="formData.items.PYM" placeholder="请输入拼音码"></el-input>
                </el-form-item>
                <el-form-item prop="WBM" label="五笔码">
                    <el-input type="string" v-model="formData.items.WBM" placeholder="请输入五笔码"></el-input>
                </el-form-item>
                <el-form-item prop="SJGLJG" label="上级机构">
                    <el-input type="string" v-model="formData.items.SJGLJG" placeholder="请输入上级机构"></el-input>
                </el-form-item>
                <el-form-item prop="JBDJ" label="级别等级">
                    <el-select
                        v-model="formData.items.JBDJ"
                        placeholder="请选择级别等级"
                        clearable
                        style="width: 100%;"
                        >
                        <el-option v-for="opt in state.jbdjOptions" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="JGDZ" label="机构地址">
                    <el-input type="string" v-model="formData.items.JGDZ" placeholder="请输入机构地址"></el-input>
                </el-form-item>
                <el-form-item prop="JGWZ" label="机构网站">
                    <el-input type="string" v-model="formData.items.JGWZ" placeholder="请输入机构网址"></el-input>
                </el-form-item>
                <el-form-item label="机构管理员">
                    <el-input type="string" v-model="state.jggly" :readonly="true"></el-input>
                </el-form-item>
            </el-form>
            <div style="padding-left: 50px;margin-bottom: 30px;">
            <el-button v-blur type="primary" @click="submitForm(formRef)">
                保  存
            </el-button>
            <el-button @click="btnCancel">取  消</el-button>
            </div>
        </div>
        
    </div>
</template>

<script setup lang="ts">

import { reactive, ref, onMounted, onBeforeMount } from 'vue'
import FormItem from '/@/components/formItem/index.vue'
import type { FormInstance, FormItemRule } from 'element-plus'
import { getPymWbm, getZdmx } from '/@/api/common'
import { getQhxx, getJgxx, editJgxx } from '/@/api/backend/jcgl/jgzl'
import { useAdminInfo } from '/@/stores/adminInfo'
import useCurrentInstance from '/@/utils/useCurrentInstance'
import { useNavTabs } from '/@/stores/navTabs'
import { useRoute,useRouter } from 'vue-router'
const navTabs = useNavTabs()
const route = useRoute()
const router = useRouter()
const { proxy } = useCurrentInstance()

const adminInfo = useAdminInfo()

const formData: {
    items: any
} = reactive({
    items: {}
})

const state: {
    jggly: any,
    xzqhOptions: any,
    jbdjOptions: any,
    dqbm: any,
    xzjb: any
} = reactive({
    jggly: '',
    xzqhOptions: [],
    jbdjOptions: [],
    dqbm: '',
    xzjb: ''
})

const jgjbOptions = [
    { value: '1', label: '省级' },
    { value: '2', label: '市级' },
    { value: '3', label: '县级' },
    { value: '4', label: '乡镇级' },
    { value: '5', label: '村级' }
]

const formRef = ref<FormInstance>()

defineOptions({
    name: 'xtgl/jgzlwh',
})

const toLastTab = () => {
    const lastTab = navTabs.state.tabsView.slice(-1)[0]
    if (lastTab) {
        router.push(lastTab)
    } else {
        router.push('/admin')
    }
}

const btnCancel = () => {
    navTabs.closeTab(route)
    proxy.eventBus.emit('onTabViewClose', route)
    if (navTabs.state.activeRoute?.path === route.path) {
        toLastTab()
    } else {
        navTabs.setActiveRoute(navTabs.state.activeRoute!)
    }
}

const mChange = (value: string) => {
    getPymWbm({agrs:value}).then((res)=>{
        formData.items.PYM = res.data.PYM
        formData.items.WBM = res.data.WBM
    })
}

getQhxx().then((res)=>{
    let arr: any = []
    for(let i=0;i<res.data.length;i++){
        let item = res.data[i]
        state.dqbm = item.DQBM
        state.xzjb = item.XZJB
        arr.push({ value: item.DQBM, label: item.DQMC });
    }
    state.xzqhOptions = arr
    state.jggly = adminInfo.rybm
    getJgxx({ rybm: adminInfo.rybm, agrs: {DQBM:state.dqbm,XZJB:state.xzjb } }).then((resJgxx)=>{
        if(resJgxx.data) {
            formData.items = resJgxx.data[0]
        }
    })
    let flbm = ''
    switch(state.xzjb)
    {
        case '1': flbm = 'Z_000101'; break
        case '2': flbm = 'Z_000102'; break
        case '3': flbm = 'Z_000103'; break
        case '4': flbm = 'Z_000104'; break
        case '5': flbm = 'Z_000105'; break
    }
    getZdmx(flbm).then((res)=>{
        let arr: any = []
        for(let i=0;i<res.data.options.length;i++){
            let item = res.data.options[i]
            arr.push({ value: item.BM, label: item.MC });
        }
        state.jbdjOptions = arr
    })
})

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    JGBM: [{ required: true, message: '机构编码不能为空', trigger: 'blur' }],
    JGMC: [{ required: true, message: '机构名称不能为空', trigger: 'blur' }]
})

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            editJgxx({agrs:formData.items}).then((res)=>{
                console.log(res)
            })
        } else {
            console.log('error submit!', fields)
        }
    })
}

onBeforeMount(() => {
    // console.log(navTabs.state.tabsView)
    // console.log(route.name)
    // let current = navTabs.state.tabsView.find(item => item.name == route.name)
    // current.meta.title = '111'
    // console.log(current)
})

onMounted(() => {
    
})

</script>

<style scoped lang="scss">
.jgzl-container {
    background-color: #fff;
    padding: 20px;
    margin: 6px;
    height: calc(100vh - 95px);
}
.ba-input-item-radio :deep(.el-form-item__content) {
    width: 220px;
}
</style>
