<template>
    <!-- 对话框表单 -->
    <el-dialog
        v-model="drawerData.ssdialogVisible"
        :title="drawerData.title"
        width="700px"
        class="ba-operate-dialog sjtj-edit"
        custom-class="my-dialog"
        draggable
        center
        :close-on-click-modal="false"
    >
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']">
                {{ baTable.form.operate == 'Add' ? '新增' : '修改' }}
            </div>
        </template>

        <div class="ba-operate-form" :class="'ba-' + baTable.form.operate + '-form'">
            <div class="yd-input-round">
                <el-form :inline="true" ref="formRef" :model="baTable.form.items" label-position="right" :rules="rules" label-width="80px">
                    <el-row :gutter="2">
                        <el-col :xs="24" :sm="10">
                            <el-form-item label="项目编码">
                                <el-input
                                    v-model="formData.XMBM"
                                    type="string"
                                    style="width: 185px"
                                    placeholder="项目编码"
                                    :disabled="true"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="14">
                            <el-form-item prop="BWMC" label="项目名称">
                                <el-input v-model="sfxmmc" type="string" style="width: 280px" placeholder="项目名称" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="2">
                        <el-col :xs="24" :sm="10">
                            <el-form-item prop="PYM" label="单据号">
                                <el-input v-model="formData.DH" type="string" style="width: 185px" placeholder="请输入单据号"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="6">
                            <el-form-item prop="WBM" label="原价">
                                <div class="yj-input">
                                    <el-input
                                        v-model="formData.YJ"
                                        :disabled="true"
                                        style="width: 115px"
                                        type="string"
                                        placeholder="请输入原价"
                                    ></el-input>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="8">
                            <el-form-item prop="BZ" label="现价">
                                <el-input v-model="formData.XJ" style="width: 115px" type="string" placeholder="现价"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="2">
                        <el-col :xs="24" :sm="10">
                            <el-form-item prop="SHRQ" label="执行时间">
                                <el-date-picker v-model="formData.ZXSJ" type="datetime" placeholder="请选择执行时间" style="width: 100%" />
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12">
                            <el-checkbox v-model="checked1" :true-label="1" :false-label="0" label="立即执行" style="margin-left: 10px" />
                        </el-col>
                    </el-row>
                    <el-row :gutter="2">
                        <el-col :xs="24" :sm="10">
                            <div style="display: block">
                                <el-form-item prop="SHRQ" label="调价说明">
                                    <el-input v-model="formData.TJSM" type="textarea" :rows="3" style="width: 550px" placeholder="请输入"></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>

        <template #footer>
            <div class="yd-from-footer">
                <el-button type="primary" @click="onSubmit">保存</el-button>
                <el-button @click="drawerData.ssdialogVisible = false" class="btn-form-cancel">取消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, inject, watch } from 'vue'
import type baTableClass from '/@/utils/baTable'
import type { FormInstance } from 'element-plus'
import { buildValidatorData } from '/@/utils/validate'
import { ElMessage, ElMessageBox } from 'element-plus'
import { djctljmb, Bczljmb } from '/@/api/backend/jcgl/zlzdwh'

const prop = defineProps(['fldata', 'opt', 'selectFlbm', 'tableData', 'rowBm'])
const emit = defineEmits(['refresh'])

const drawerData = ref({
    title: '收费项目调价管理',
    ssdialogVisible: false,
    direction: 'rtl',
    drugInfo: {},
    type: '',
    controlType: 'create',
})

const sfxmmc = ref()

const checked1 = ref('')
const formData = reactive({
    YJID: '',
    XMBM: prop.rowBm,
    YJ: '',
    XJ: '',
    TJSM: '',
    DH: '',
    ZXSJ: '',
})

watch(
    () => drawerData.value.ssdialogVisible,
    (val) => {
        if (val && prop.tableData.length) {
            const firstItem = prop.tableData[0]
            const { ID, XJ, XMMC } = firstItem
            formData.YJID = ID
            formData.YJ = XJ
            sfxmmc.value = XMMC
            console.log('ID, XJ, XMMC: ', ...prop.tableData)
        }
    }
)

const canle = () => {
    formData.XJ = ''
    formData.TJSM = ''
    formData.DH = ''
    formData.ZXSJ = ''
}

const formRef = ref<FormInstance>()
const baTable = inject('baTable') as baTableClass

// 提交表单
const onSubmit = async (valid, fileds) => {
    if (valid) {
        let data = {
            agrs: {
                mode: { ...formData },
                baoCunLX: checked1.value ? '立即执行' : '',
            },
        }
        const res = await djctljmb(data)
        if (res.count > 0) {
            ElMessageBox.confirm(`当前执行时间后存在其他调价信息,确认要保存吗`, '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(async () => {
                const res = await Bczljmb(data)
                if (res.code == 1) {
                    emit('refresh')
                    ElMessage.success('调价成功')
                    drawerData.value.ssdialogVisible = false
                    canle()
                }
            })
        } else {
            const res = await Bczljmb(data)
            if (res.code == 1) {
                emit('refresh')
                ElMessage.success('调价成功')
                drawerData.value.ssdialogVisible = false
                canle()
            }
        }
        console.log(res, 'resresresres')
    }
}

defineExpose({
    drawerData,
})
</script>

<style scoped lang="scss">
.ba-operate-form .el-row {
    .el-col:nth-child(1) {
        :deep(.el-input) {
            width: 215px;
        }
    }
}
</style>
