<template>
    <!-- 对话框表单 -->
    <el-dialog
        class="ba-operate-dialog bw-edit"
        :close-on-click-modal="false"
        :model-value="['Add', 'Edit'].includes(baTable.form.operate!)"
        @close="baTable.toggleForm"
        :destroy-on-close="true"
        align-center
        width="750px"
    >
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']">
                {{ baTable.form.operate == 'Add' ? '部位信息-新增' : '部位信息-修改' }}
            </div>
        </template>
        <el-scrollbar v-loading="baTable.form.loading" class="ba-table-form-scrollbar">
            <div class="ba-operate-form" :class="'ba-' + baTable.form.operate + '-form'">
                <el-form
                    ref="formRef"
                    :inline="true"
                    :model="baTable.form.items"
                    label-position="right"
                    :label-width="baTable.form.labelWidth + 'px'"
                    :rules="rules"
                    v-if="!baTable.form.loading"
                >
                <div style="padding: 5px 15px;">
                    <el-row :gutter="2">
                        <el-col :xs="24" :sm="24">
                            <el-form-item prop="FLBM" label="分类">
                                <div class="bwfl-select">
                                    <el-cascader
                                        v-model="baTable.form.items!.FLBM"
                                        :props="defaultProps"
                                        :options="prop.flData"
                                        :show-all-levels="true"
                                        filterable
                                        clearable
                                        popper-class="flbm-tree-cascader"
                                        placeholder="请选择"
                                    />
                                </div>
                            </el-form-item> 
                        </el-col>
                    </el-row>
                    <el-row :gutter="2">
                        <el-col :xs="24" :sm="8">
                            <el-form-item prop="BWBM" label="编码">
                                <el-input v-model="baTable.form.items!.BWBM" type="string" placeholder="请输入" :disabled="true" style="width: 150px;"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="16">
                            <el-form-item prop="BWMC" label="名称">
                                <el-input v-model="baTable.form.items!.BWMC" type="string" @change="mChange" placeholder="请输入"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="2">
                        <el-col :xs="24" :sm="8">
                            <el-form-item prop="LX" label="类型">
                                <div class="lx-select">
                                    <el-select v-model="baTable.form.items!.LX" placeholder="请选择类型" clearable filterable>
                                        <el-option v-for="opt1 in bwlxOptions" :key="opt1.value" :label="opt1.label" :value="opt1.value"></el-option>
                                    </el-select>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="16">
                            <el-form-item prop="BZ" label="备注">
                                <el-input v-model="baTable.form.items!.BZ" type="string" placeholder="请输入备注"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                </el-form>
                 
            </div>
            <div style="margin: 5px 36px;">
                    <div style="font-weight: bold;color: #000;font-size: 15px;">检查方法及方法组织</div>
                    <div style="border: 1px solid #dcdfe6;padding: 10px">
                        <el-table :data="state.jcffData" border height="300px" class="ba-data-table w100" header-cell-class-name="table-header-cell" highlight-current-row>
                            <el-table-column type="index" width="50" align="center" />
                            <el-table-column prop="LX" label="类型" width="100" align="center">
                                <template #default="scope">
                                    <el-select
                                        v-model="scope.row.LX"
                                        placeholder="选择"
                                        clearable
                                        filterable
                                        style="width: 100%"
                                    >
                                        <el-option v-for="opt1 in fflxOptions" :key="opt1.value" :label="opt1.label" :value="opt1.value"> </el-option>
                                    </el-select>
                                    <!-- <div class="huchi-check" v-if="scope.row.LX==0">
                                        <el-checkbox v-model="scope.row.LX" :true-label="1" :false-label="0"></el-checkbox>
                                    </div>
                                    <div class="gongtong-check" v-else>
                                        <el-checkbox v-model="scope.row.LX" :true-label="1" :false-label="0"></el-checkbox>
                                    </div> -->
                                </template>
                            </el-table-column>
                            <el-table-column prop="MC" label="方法名称" align="center">
                                <template #default="scope">
                                    <el-input
                                        v-model="scope.row.MC"
                                        type="string"
                                        placeholder="请输入"
                                    ></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="YXLX" label="影像类型" width="115" align="center">
                                <template #default="scope">
                                    <el-input
                                        v-model="scope.row.YXLX"
                                        type="string"
                                        placeholder="请输入"
                                    ></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="ZYBZ" label="造影" width="60" align="center">
                                <template #default="scope">
                                    <el-checkbox v-model="scope.row.ZYBZ" :true-label="'1'" :false-label="'0'" />
                                </template>
                            </el-table-column>
                            <el-table-column prop="" label="操作" width="80" fixed="right" align="center">
                                <template #default="scope">
                                    <el-button link v-blur type="primary" size="small" @click="addJcff(scope.row)">
                                        <Icon name="local-create" style="color: rgb(14, 141, 77)" class="local-icon" />
                                    </el-button>
                                    <el-popconfirm title="您确定删除这条记录吗?" @confirm="deleteJcff(scope.$index)" width="200">
                                        <template #reference>
                                            <el-button link v-blur type="primary" size="small" style="margin-left: 3px;">
                                                <Icon name="local-delete" style="color: rgb(245, 75, 33)" class="local-icon" />
                                            </el-button>
                                        </template>
                                    </el-popconfirm>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
        </el-scrollbar>

        <template #footer>
            <div class="yd-from-footer">
                <el-button v-blur :loading="baTable.form.submitLoading" @click="submitForm(formRef)" type="primary" class="btn-form-save">
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
import type { FormInstance, FormItemRule } from 'element-plus'
import { ElMessage } from 'element-plus'
import { buildValidatorData } from '/@/utils/validate'
import { getPymWbm } from '/@/api/common'
import { useAdminInfo } from '/@/stores/adminInfo'
import { getJcff } from '/@/api/backend/jcgl/jcbwsz'

const adminInfo = useAdminInfo()

const prop = defineProps(['flData', 'opt', 'selectFlbm'])

const state: {
    jcffData: any
} = reactive({
    jcffData: [],
})

const defaultProps = {
    label: 'FLMC', 
    value: 'FLBM',
    checkStrictly: true
}

//添加检查方法
const addJcff = (row: any) => {
    state.jcffData.push({
        JGBM: adminInfo.jgbm,
        BM: '',
        MC: '',
        BWBM: baTable.form.items!.BWBM,
        YXLX: '',
        LX: 1,
        ZYBZ: '0',
        GXSJ: '',
        SCBZ: '0',
        CZYBM: ''
    })
}
//删除检查方法
const deleteJcff = (index: any) => {
    if(state.jcffData.length === 1) {
        state.jcffData[0].BM = ''
        state.jcffData[0].MC = ''
        state.jcffData[0].YXLX = ''
        state.jcffData[0].LX = ''
        state.jcffData[0].ZYBZ = ''
        state.jcffData[0].GXSJ = ''
        state.jcffData[0].SCBZ = '1'
        state.jcffData[0].CZYBM = ''
        return;
    }
    state.jcffData.splice(index, 1)
}

const formRef = ref<FormInstance>()
const baTable = inject('baTable') as baTableClass

const mChange = (value: string) => {
    getPymWbm({ agrs: value }).then((res) => {
        baTable.form.items!.PYM = res.data.PYM
        baTable.form.items!.WBM = res.data.WBM
    })
}

const bwlxOptions = [
    { value: '2', label: '检查' },
    { value: '3', label: '治疗' },
    { value: '4', label: '手术' },
]

const fflxOptions = [
    { value: 0, label: '互斥' },
    { value: 1, label: '共同' },
]

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    FLBM: [buildValidatorData({ name: 'required', message: '分类不能为空' })],
    BWMC: [buildValidatorData({ name: 'required', message: '部位名称不能为空' })],
    LX: [buildValidatorData({ name: 'required', message: '类型不能为空' })],
})

// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            if(Array.isArray(baTable.form.items!.FLBM) && baTable.form.items!.FLBM.length>0) {
                baTable.form.items!.FLBM = baTable.form.items!.FLBM[baTable.form.items!.FLBM.length-1]
            }
            // let jcffValid = true
            // for(let i=0; i<state.jcffData.length; i++) {
            //     if(!state.jcffData[i].MC) {
            //         jcffValid = false
            //         break
            //     }
            // }
            // if(!jcffValid) {
            //     ElMessage.error('检查方法数据未填写完整.')
            //     return
            // }

            let jcffItems: any = []
            for(let i=0; i<state.jcffData.length; i++) {
                if(state.jcffData[i].MC) {
                    jcffItems.push({
                        JGBM: adminInfo.jgbm,
                        LX: state.jcffData[i].LX,
                        MC: state.jcffData[i].MC,
                        BWBM: baTable.form.items!.BWBM,
                        YXLX: state.jcffData[i].YXLX,
                        ZYBZ: state.jcffData[i].ZYBZ,
                        SCBZ: '0'
                    })
                }
            }
            let data = {
                agrs: {
                    bw: { JGBM: adminInfo.jgbm, ...baTable.form.items },
                    jcff: jcffItems,
                },
            }
            try {
                baTable.onSubmitData(data)
            } catch (err) {
                console.log(err)
            }
        } else {
            console.log('error submit!', fields)
        }
    })
}
// 回显检查方法
watch(
    () => baTable.form.items,
    async (val) => {
        if (val && baTable.form.operate == 'Edit') {
            const agrs = {
                jgbm: adminInfo.jgbm,
                bwbm: val.BWBM,
            }
            const res = await getJcff(agrs)
            state.jcffData = res.data
            if(state.jcffData.length == 0) {
                state.jcffData.push({
                    JGBM: adminInfo.jgbm,
                    BM: '',
                    MC: '',
                    BWBM: baTable.form.items!.BWBM,
                    YXLX: '',
                    LX: 1,
                    ZYBZ: '0',
                    GXSJ: '',
                    SCBZ: '0',
                    CZYBM: '',
                })
            }
        } else {
            state.jcffData = []
            state.jcffData.push({
                JGBM: adminInfo.jgbm,
                BM: '',
                MC: '',
                BWBM: baTable.form.items!.BWBM,
                YXLX: '',
                LX: 1,
                ZYBZ: '0',
                GXSJ: '',
                SCBZ: '0',
                CZYBM: '',
            })
        }
    }
)
</script>

<style scoped lang="scss">
.ba-operate-form .el-row{

.el-col:nth-child(1){
    .bwfl-select{
        display: inline-block;
        :deep(.el-input){
            width: 600px;
        }
    }
    .lx-select{
        display: inline-block;
        :deep(.el-input){
            width: 150px;
        }
    }
}
.el-col:nth-child(2){
    :deep(.el-input){
        width: 372px;
    }
}
}

.ba-data-table :deep(.table-header-cell) .cell {
    color: var(--el-text-color-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.huchi-check :deep(.el-checkbox__inner){
    border-radius: 50% !important;
    border-color: #e6c045;
}
.huchi-check :deep(.el-checkbox__input.is-checked .el-checkbox__inner){
    border-color: var(--el-checkbox-checked-bg-color);
}
.huchi-check :deep(.el-checkbox__input.is-disabled .el-checkbox__inner){
    border-color: var(--el-checkbox-disabled-border-color);
}
.gongtong-check :deep(.el-checkbox__inner){
    border-color: #808080;
}
.gongtong-check :deep(.el-checkbox__input.is-checked .el-checkbox__inner){
    border-color: var(--el-checkbox-checked-bg-color);
}
.gongtong-check :deep(.el-checkbox__input.is-disabled .el-checkbox__inner){
    border-color: var(--el-checkbox-disabled-border-color);
}

.jcff_box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    .del_icon {
        line-height: 12px;
        cursor: pointer;
    }
}

.yd-card-header {
    padding: 13px 10px;
    background-color: #fff;
    margin-bottom: 1px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f5f5f5;
    margin-bottom: 10px;
    .title {
        color: #000;
        font-size: 17px;
        margin-right: 20px;
    }
    .title .left {
        display: inline-block;
        background-color: #409eff;
        width: 5px;
        height: 12px;
        margin-right: 10px;
    }
}
.yd-card-body {
    padding: 10px;
}
</style>
