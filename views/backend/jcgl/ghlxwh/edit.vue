<template>
    <!-- 对话框表单 -->
    <el-dialog
        class="ba-operate-dialog"
        :close-on-click-modal="false"
        :model-value="['Add', 'Edit'].includes(baTable.form.operate!)"
        @close="baTable.toggleForm"
        :destroy-on-close="true"
        width="600px"
    >
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">
                {{ baTable.form.operate == 'Add' ? '挂号类型-新增' : '挂号类型-修改' }}
            </div>
        </template>
        <el-scrollbar v-loading="baTable.form.loading" class="ba-table-form-scrollbar">
            <div
                class="ba-operate-form"
                :class="'ba-' + baTable.form.operate + '-form'"
                :style="'width: calc(100% - ' + baTable.form.labelWidth! / 2 + 'px)'"
            >
                <el-form
                    ref="formRef"
                    :model="baTable.form.items"
                    label-position="right"
                    :label-width="baTable.form.labelWidth + 'px'"
                    :rules="rules"
                    v-if="!baTable.form.loading"
                >
                    <!-- <el-form-item prop="BM" label="编码">
                        <el-input v-model="baTable.form.items!.BM" type="string" placeholder="请输入编码"></el-input>
                    </el-form-item> -->
                    <el-form-item prop="MC" label="名称">
                        <el-input v-model="baTable.form.items!.MC" @change="KsChange" type="string" placeholder="请输入名称"></el-input>
                    </el-form-item>
                    <el-form-item prop="LX" label="挂号类型">
                        <el-select v-model="baTable.form.items!.LX" filterable placeholder="请选择挂号类型" clearable style="width: 100%">
                            <el-option v-for="opt in state.lxArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item prop="KSBM" label="科室编码">
                        <el-select v-model="baTable.form.items!.KSBM" filterable placeholder="请选择科室编码" clearable style="width: 100%" @change="ksbmChange">
                            <el-option v-for="opt in prop.ksList" :key="opt.KSBM" :label="opt.KSMC" :value="opt.KSBM"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="YSBM" label="医生编码">
                        <el-select v-model="baTable.form.items!.YSBM" filterable placeholder="请选择医生编码" clearable style="width: 100%">
                            <el-option v-for="opt in state.ryList" :key="opt.RYBM" :label="opt.RYXM" :value="opt.RYBM"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="YZXMBM" label="医嘱项目编码">
                        <el-select v-model="baTable.form.items!.YZXMBM" filterable placeholder="请选择医嘱项目编码" clearable style="width: 100%">
                            <el-option v-for="opt in prop.yzxmData" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="JSZC" label="技术职称">
                        <el-select v-model="baTable.form.items!.JSZC" filterable placeholder="请选择技术职称" clearable style="width: 100%">
                            <el-option v-for="opt in state.jszcArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="PYM" label="拼音码">
                        <el-input v-model="baTable.form.items!.PYM" type="string" placeholder="请输入拼音码"></el-input>
                    </el-form-item>
                    <el-form-item prop="WBM" label="五笔码">
                        <el-input v-model="baTable.form.items!.WBM" type="string" placeholder="请输入五笔码"></el-input>
                    </el-form-item>
                    <el-form-item prop="KSSJ" label="开始时间">
                        <el-date-picker v-model="baTable.form.items!.KSSJ" type="date" placeholder="请选择开始时间" style="width: 100%" />
                    </el-form-item>
                    <el-form-item prop="JSSJ" label="结束时间">
                        <el-date-picker v-model="baTable.form.items!.JSSJ" type="date" placeholder="请输入结束时间" style="width: 100%" />
                    </el-form-item>
                </el-form>
            </div>
        </el-scrollbar>
        <template #footer>
            <div class="yd-from-footer">
                <el-button v-blur :loading="baTable.form.submitLoading" @click="baTable.onSubmit(formRef)" type="primary" class="btn-form-save">
                    {{ baTable.form.operateIds && baTable.form.operateIds.length > 1 ? '保存并编辑下一条' : '保存' }}
                </el-button>
                <el-button @click="baTable.toggleForm('')" class="btn-form-cancel">取消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, inject, watch } from 'vue'
import type baTableClass from '/@/utils/baTable'
import FormItem from '/@/components/formItem/index.vue'
import type { FormInstance, FormItemRule } from 'element-plus'
import { getPymWbm, getrylist } from '/@/api/common'
import { buildValidatorData } from '/@/utils/validate'

const formRef = ref<FormInstance>()
const baTable = inject('baTable') as baTableClass
const prop = defineProps(['zdData', 'yzxmData', 'ksList', 'ryList'])

const state: {
    lxArr: any
    jszcArr: any
    lxNum: any
    ksbm: any
    ryList: any
} = reactive({
    lxArr: [],
    jszcArr: [],
    lxNum: '',
    ksbm: '',
    ryList: [],
})

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    MC: [buildValidatorData({ name: 'required', message: '名称不能为空.' })],
    LX: [buildValidatorData({ name: 'required', message: '挂号类型不能为空.' })],
})

watch(
    () => baTable.form.operate,
    () => {
        state.lxArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_100010')
        state.jszcArr = prop.zdData.filter((ele: any) => ele.FLBM == 'GB_00101')
    }
)

watch(
    () => state.ksbm,
    () => {
        getrylist({ agrs: { liShuZ: 1, renYuanKSBM: state.ksbm } }).then((res) => {
            state.ryList = res.data.options
        })
    }
)

const KsChange = (value: string) => {
    getPymWbm({ agrs: value })
        .then((res) => {
            baTable.form.items!.PYM = res.data.PYM
            baTable.form.items!.WBM = res.data.WBM
        })
        .catch((err) => {
            console.log(err)
        })
}

const ksbmChange = (value) => {
    state.ksbm = value
}

const lxChange = (val) => {
    if (val == 2) {
        state.lxNum = 2
    } else if (val == 3) {
        state.lxNum = 3
    } else {
        state.lxNum = ''
    }
}
</script>

<style scoped lang="scss">
</style>