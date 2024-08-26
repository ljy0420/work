<template>
    <div>
        <el-dialog class="ba-operate-dialog" :close-on-click-modal="false" :model-value="state.show" @close="onClose"
            :destroy-on-close="true" align-center width="800px">
            <template #header>
                <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">
                    挂号结算预览
                </div>
            </template>
            <el-scrollbar class="ba-table-form-scrollbar">
                <div class="ba-operate-form">
                    <el-form ref="formRef" :model="prop.ghInfo" label-position="right" label-width="100px">
                        <div>病人基本信息</div>
                        <div class="brjbxx">
                            <el-row :gutter="0">
                                <el-col :xs="12" :sm="8">
                                    <el-form-item label="姓名">
                                        <el-input v-model="prop.ghInfo!.XM" type="string" :readonly="true"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="8">
                                    <el-form-item label="性别">
                                        <el-input v-model="prop.ghInfo!.XB" type="string" :readonly="true"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="8">
                                    <el-form-item label="病人类型">
                                        <el-input v-model="prop.ghInfo!.BRLX" type="string" :readonly="true"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="0">
                                <el-col :xs="12" :sm="8">
                                    <el-form-item label="挂号单号">
                                        <el-input v-model="prop.ghInfo!.GHDH" type="string" :readonly="true"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="8">
                                    <el-form-item label="挂号费">
                                        <el-input v-model="prop.ghInfo!.GHF" type="string" :readonly="true"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="8">
                                    <el-form-item label="工本费">
                                        <el-input v-model="prop.ghInfo!.GBF" type="string" :readonly="true"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="0">
                                <el-col :xs="12" :sm="8">
                                    <el-form-item label="诊查费">
                                        <el-input v-model="prop.ghInfo!.ZCF" type="string" :readonly="true"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="8">
                                    <el-form-item label="病历本费">
                                        <el-input v-model="prop.ghInfo!.BLBF" type="string" :readonly="true"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                        <div>结算信息</div>
                        <div class="brjbxx">
                            <el-row :gutter="0">
                                <el-col :xs="12" :sm="12">
                                    <el-form-item label="总金额">
                                        <el-input v-model="prop.ghInfo!.ZJE" type="string" :readonly="true"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="12">
                                    <el-form-item label="补偿金额">
                                        <el-input v-model="prop.ghInfo!.BCJE" type="string" :readonly="true"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="0">
                                <el-col :xs="12" :sm="12">
                                    <el-form-item label="卡余额">
                                        <el-input v-model="prop.ghInfo!.KYE" type="string" :readonly="true"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="12">
                                    <el-form-item label="应交金额">
                                        <el-input v-model="prop.ghInfo!.YJJE" type="string" :readonly="true"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="0">
                                <el-col :xs="12" :sm="12">
                                    <el-form-item label="POS金额">
                                        <el-input v-model="prop.ghInfo!.POSJE" type="string" :readonly="true"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="12">
                                    <el-form-item label="实交金额">
                                        <el-input v-model="prop.ghInfo!.SJJE" type="string" :readonly="true"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="0">
                                <el-col :xs="24" :sm="24">
                                    <el-form-item label="支付方式">
                                        <el-radio-group v-model="zffs">
                                            <el-radio :label="0">0-现金</el-radio>
                                            <el-radio :label="1">1-微信</el-radio>
                                            <el-radio :label="2">2-支付宝</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="0">
                                <el-col :xs="12" :sm="12">
                                    <el-form-item label="找零">
                                        <el-input v-model="prop.ghInfo!.ZL" type="string" :readonly="true"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="12" :sm="12">
                                    <el-form-item label="卡支付后余额">
                                        <el-input v-model="prop.ghInfo!.KZFHYE" type="string" :readonly="true"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="brjbxx">
                            <el-form-item label="接口支付信息">
                                <el-input type="textarea" placeholder="" :rows="3"></el-input>
                            </el-form-item>
                        </div>

                    </el-form>
                </div>

            </el-scrollbar>
            <template #footer>
                <div class="yd-from-footer">
                    <el-button ref="btnSave" v-blur type="primary" @click="onConfirm" class="btn-form-save">
                        确定
                    </el-button>
                    <el-button @click="onClose" class="btn-form-cancel">取消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'


const prop = defineProps(['ghInfo'])

const emit = defineEmits(["ghConfirm"]);

const zffs = ref(0)

const state: {
    options: any,
    show: boolean
} = reactive({
    options: [],
    show: false
})

onMounted(() => {

})

const onClose = () => {
    state.show = false;
}

const onConfirm = () => {
    state.show = false;
    emit('ghConfirm', '')
}

const show = () => {
    state.show = true;
}

defineExpose({ show })

</script>

<style scoped lang="scss">
.el-form-item {
    margin-bottom: 10px;
}

:deep(.el-dialog__body) {
    height: 600px;
}

.brjbxx {
    border: 1px solid #f1f1f1;
    margin-top: 5px;
    margin-bottom: 10px;
    padding-top: 10px;
    padding-right: 10px;
}
</style>