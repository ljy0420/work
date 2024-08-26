<template>
    <!-- 对话框表单 -->
    <el-dialog
        class="ba-operate-dialog"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        :model-value="['Add', 'Edit'].includes(baTable.form.operate!)"
        @close="baTable.toggleForm"
        align-center
        width="950px"
    >
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">
                {{ baTable.form.operate == 'Add' ? '科室资料-新增' : '科室资料-修改' }}
            </div>
        </template>
        <el-scrollbar v-loading="baTable.form.loading" class="ba-table-form-scrollbar">
            <div
                class="ba-operate-form yd-input-round"
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
                    <el-form-item prop="SJBM" label="上级科室">
                        <el-select v-model="baTable.form.items!.SJBM" filterable placeholder="请选择上级科室" style="width: 100%">
                            <el-option v-for="opt in prop.sjks" :key="opt.KSBM" :label="opt.KSMC" :value="opt.KSBM"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="KSMC" label="科室名称">
                        <el-input @change="KsChange" v-model="baTable.form.items!.KSMC" type="string" placeholder="请输入科室名称"></el-input>
                    </el-form-item>
                    <el-form-item prop="SSBM" label="所属部门">
                        <el-select v-model="baTable.form.items!.SSBM" filterable placeholder="请选择所属部门" clearable style="width: 100%">
                            <el-option v-for="opt in prop.ssbm" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="拼音码">
                        <el-input v-model="baTable.form.items!.PYM" type="string" placeholder="请输入拼音码"></el-input>
                    </el-form-item>

                    <el-form-item prop="ZBM" label="自编码">
                        <el-input v-model="baTable.form.items!.ZBM" type="string" placeholder="请输入自编码"></el-input>
                    </el-form-item>
                    <el-form-item label="五笔码">
                        <el-input v-model="baTable.form.items!.WBM" type="string" placeholder="请输入五笔码"></el-input>
                    </el-form-item>

                    <FormItem
                        prop="SFGH"
                        label="是否挂号"
                        v-model="baTable.form.items!.SFGH"
                        type="radio"
                        :data="{
                            content: { '0': '否', '1': '是' },
                            childrenAttr: { border: true },
                        }"
                    />
                    <FormItem
                        prop="SFYPLY"
                        label="是否药品领用"
                        v-model="baTable.form.items!.SFYPLY"
                        type="radio"
                        :data="{
                            content: { '0': '否', '1': '是' },
                            childrenAttr: { border: true },
                        }"
                    />
                    <FormItem
                        prop="SFWPLY"
                        label="是否物品领用"
                        v-model="baTable.form.items!.SFWPLY"
                        type="radio"
                        :data="{
                            content: { '0': '否', '1': '是' },
                            childrenAttr: { border: true },
                        }"
                    />
                    <FormItem
                        prop="SFSBLY"
                        label="是否设备领用"
                        v-model="baTable.form.items!.SFSBLY"
                        type="radio"
                        :data="{
                            content: { '0': '否', '1': '是' },
                            childrenAttr: { border: true },
                        }"
                    />
                    <FormItem
                        prop="YXZT"
                        label="有效状态"
                        v-model="baTable.form.items!.YXZT"
                        type="radio"
                        :data="{
                            content: { '0': '无效', '1': '有效' },
                            childrenAttr: { border: true },
                        }"
                    />
                    <el-form-item label="科室类型" prop="KSLX">
                        <el-checkbox-group v-model="state.kslxlb" @change="handleCheckChange">
                            <el-checkbox
                                style="width: 76px"
                                v-for="opt in prop.kslx"
                                :key="opt.BM"
                                :label="opt.BM + '.' + opt.MC"
                                :disabled="isSelectBq && opt.BM != 11 ? true : false"
                            ></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="所属病区" v-if="state.kslxlb.length > 0 && !state.kslxlb.includes('11.病区')">
                        <el-checkbox-group v-model="state.ssbqlb">
                            <el-checkbox 
                            style="width: 76px"
                            v-for="opt in prop.bqlb" 
                            :key="opt.KSBM" 
                            :label="opt.KSBM">{{ opt.KSMC }} </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item prop="KSZR" label="科室主任">
                        <el-select v-model="baTable.form.items!.KSZR" filterable placeholder="请选择科室主任" clearable style="width: 100%">
                            <el-option v-for="opt in state.kszrlb" :key="opt.RYBM" :label="opt.RYXM" :value="opt.RYBM"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="KSHSZ" label="科室护士长">
                        <el-select v-model="baTable.form.items!.KSHSZ" filterable placeholder="请选择科室护士长" clearable style="width: 100%">
                            <el-option v-for="opt in state.kshslb" :key="opt.RYBM" :label="opt.RYXM" :value="opt.RYBM"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="MRZXHS" label="默认执行护士">
                        <el-select v-model="baTable.form.items!.MRZXHS" filterable placeholder="请选择默认执行护士" clearable style="width: 100%">
                            <el-option v-for="opt in state.kshslb" :key="opt.RYBM" :label="opt.RYXM" :value="opt.RYBM"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="PXH" label="排序号">
                        <el-input type="number" v-model="baTable.form.items!.PXH" placeholder="请输入排序号" clearable />
                    </el-form-item>
                    <el-form-item prop="GDCWS" label="编制床位数">
                        <el-input type="number" v-model="baTable.form.items!.GDCWS" placeholder="请输入编制床位数" clearable />
                    </el-form-item>
                    <el-form-item label="国标码">
                        <el-input type="string" v-model="baTable.form.items!.GBM" placeholder="请输入国标码" clearable />
                    </el-form-item>
                    <el-form-item label="备注" style="100%">
                        <el-input v-model="baTable.form.items!.BZ" placeholder="备注" clearable type="textarea" />
                    </el-form-item>
                </el-form>
            </div>
        </el-scrollbar>
        <template #footer>
            <div class="yd-from-footer">
                <el-button v-blur :loading="baTable.form.submitLoading" @click="onSubmit(formRef)" type="primary" class="btn-form-save">
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
import { buildValidatorData } from '/@/utils/validate'
import type { FormInstance, FormItemRule } from 'element-plus'
import { ElMessage } from 'element-plus'
import { getPymWbm } from '/@/api/common'
import { getKsrylb, getKsbq } from '/@/api/backend/jcgl/kszl'

const formRef = ref<FormInstance>()
const baTable = inject('baTable') as baTableClass

const prop = defineProps(['ssbm', 'kslx', 'sjks', 'bqlb'])

const isSelectBq = ref(false) // 是否选择11病区
const state: {
    kslxlb: any
    kszrlb: any
    kshslb: any
    ssbqlb: any
} = reactive({
    kslxlb: [],
    kszrlb: [{ RYBM: '', RYXM: '无' }],
    kshslb: [{ RYBM: '', RYXM: '无' }],
    ssbqlb: [],
})

watch(
    () => baTable.form.operate,
    () => {
        if (baTable.form.items!.KSLX) {
            let arr = baTable.form.items!.KSLX.split(',')
            state.kslxlb = arr
            //console.log('state.kslxlb', state.kslxlb)
            if (arr && arr.includes('11.病区')) {
                isSelectBq.value = true
            } else {
                isSelectBq.value = false
            }
        } else {
            state.kslxlb = []
        }
        if (baTable.form.items!.KSBM) {
            getKsrylb({ agrs: { keShiBM: baTable.form.items!.KSBM, youXiaoZT: '-1' } })
                .then((res) => {
                    if (res.data) {
                        let kszrlbArr: any = []
                        kszrlbArr.push({ RYBM: '', RYXM: '无' })
                        let kshslbArr: any = []
                        kshslbArr.push({ RYBM: '', RYXM: '无' })
                        for (let i = 0; i < res.data.length; i++) {
                            let item = res.data[i]
                            if (item.LSZ == '1') {
                                kszrlbArr.push({ RYBM: item.RYBM, RYXM: item.RYXM })
                            } else if (item.LSZ == '26') {
                                kshslbArr.push({ RYBM: item.RYBM, RYXM: item.RYXM })
                            }
                        }
                        state.kszrlb = kszrlbArr
                        state.kshslb = kshslbArr
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        if(baTable.form.operate == 'Edit'){
            if (baTable.form.items!.KSBM) {
                getKsbq({ jgbm: baTable.form.items!.JGBM, agrs: { JGBM: baTable.form.items!.JGBM, KSBM: baTable.form.items!.KSBM } })
                    .then((res) => {
                        if (res.data) {
                            //console.log(res.data)
                            let ssbqlbArr: any = []
                            for (let i = 0; i < res.data.length; i++) {
                                let item = res.data[i]
                                ssbqlbArr.push(item.BQBM)
                            }
                            state.ssbqlb = ssbqlbArr
                            //console.log('state.ssbqlb', state.ssbqlb)
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
        } else {
            isSelectBq.value = false
            state.kslxlb = []
        }
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

const handleCheckChange = (val: any) => {
    if (val && val.includes('11.病区')) {
        isSelectBq.value = true
        state.kslxlb = ['11.病区']
    } else {
        isSelectBq.value = false
    }
}

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    KSMC: [buildValidatorData({ name: 'required', message: '名称不能为空.' })],
    SSBM: [buildValidatorData({ name: 'required', message: '所属部门不能为空.' })],
    SFGH: [buildValidatorData({ name: 'required', message: '请选择是否挂号.' })],
    GHJE: [buildValidatorData({ name: 'required', message: '挂号金额不能为空.' })],
    SFYPLY: [buildValidatorData({ name: 'required', message: '请选择是否药品领用.' })],
    SFWPLY: [buildValidatorData({ name: 'required', message: '请选择是否物品领用.' })],
    SFSBLY: [buildValidatorData({ name: 'required', message: '请选择是否设备领用.' })],
    YXZT: [buildValidatorData({ name: 'required', message: '请选择有效状态.' })],
    PXH: [buildValidatorData({ name: 'required', message: '请输入排序号.' })],
    GDCWS: [buildValidatorData({ name: 'required', message: '请输入编制床位数.' })],
    KSLX: [buildValidatorData({ name: 'required', message: '选择科室类型.' })]
})

const onSubmit = (form: any) => {
    if (state.kslxlb.length > 0) {
        let kslx = state.kslxlb.join(',')
        baTable.form.items!.KSLX = kslx
    } else {
        baTable.form.items!.KSLX = ''
    }
    if (state.ssbqlb.length > 0 && !state.kslxlb.includes('11.病区')) {
        let ssbq = state.ssbqlb.join(',')
        baTable.form.items!.SSBQ = ssbq
    } else {
        baTable.form.items!.SSBQ = ''
    }
    if (baTable.form.items!.KSBM && baTable.form.items!.KSBM == baTable.form.items!.SJBM) {
        ElMessage.error('上级科室不能选择自己.')
        return
    }
    baTable.onSubmit(form)
}
</script>

<style scoped lang="scss">
.ba-operate-dialog :deep(.el-dialog__body) {
    height: 60vh;
}
:deep(.el-form-item) {
    display: inline-flex;
    vertical-align: middle;
    margin-right: 32px;
}
:deep(.el-radio-group) {
    width: 200px;
}
:deep(.el-input) {
    width: 200px;
}
.el-textarea {
    width: 580px;
}
</style>
