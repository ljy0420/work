<template>
    <div>
        <el-dialog
            class="ba-operate-dialog"
            :close-on-click-modal="false"
            :model-value="dialogVisble"
            @close="cancel"
            :destroy-on-close="true"
            align-center
            id="fdjcl-dialog"
            width="800px"
        >
            <template #header>
                <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']">
                    {{ '药品分段加成率设置' }}
                </div>
            </template>
            <div class="ba-operate-form">
                <el-form ref="formRef" :model="state" :rules="rules" :show-error="false">
                    <el-table
                        ref="tableref"
                        class="ba-data-table w100"
                        header-cell-class-name="table-header-cell"
                        :data="state.fdjclData"
                        height="400px"
                        border
                    >
                        <el-table-column type="index" align="center" width="55px"></el-table-column>
                        <el-table-column label="类别" prop="LB" width="130px" align="center">
                            <template #default="scope">
                                <el-form-item style="height: 15px" :prop="'fdjclData.' + scope.$index + '.LB'" :rules="rules.LB">
                                    <el-select
                                        v-model="scope.row.LB"
                                        placeholder="请选择"
                                        filterable
                                        clearable
                                        style="width: 100%"
                                        class="LB"
                                        :disabled="!scope.row.isEdit"
                                        @keyup.enter="handleKeyDown2(scope, 'yp-ZDJ')"
                                    >
                                        <el-option v-for="opt in lbOptions" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="最低价" prop="ZDJ" width="100px" align="center">
                            <template #default="scope">
                                <el-form-item style="height: 15px" :prop="'fdjclData.' + scope.$index + '.ZDJ'" :rules="rules.ZDJ">
                                    <el-input-number
                                        v-model="scope.row.ZDJ"
                                        style="width: 100%"
                                        class="yp-ZDJ"
                                        :controls="false"
                                        :min="0"
                                        :step="0.01"
                                        :precision="2"
                                        :disabled="!scope.row.isEdit"
                                        @keydown.enter="zdjhandleKeyDown($event, scope, 'yp-ZGJ', 'yp-ZDJ')"
                                    ></el-input-number>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="最高价" prop="ZGJ" width="100px" align="center">
                            <template #default="scope">
                                <el-form-item style="height: 15px" :prop="'fdjclData.' + scope.$index + '.ZGJ'" :rules="rules.ZGJ">
                                    <el-input-number
                                        v-model="scope.row.ZGJ"
                                        style="width: 100%"
                                        :controls="false"
                                        :min="0"
                                        :step="0.01"
                                        :precision="2"
                                        class="yp-ZGJ"
                                        :disabled="!scope.row.isEdit"
                                        @keydown.enter="zgjhandleKeyDown($event, scope, 'yp-JCL', 'yp-ZGJ')"
                                    ></el-input-number>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="加成率" prop="JCL" width="100px" align="center">
                            <template #default="scope">
                                <el-form-item style="height: 15px" :prop="'fdjclData.' + scope.$index + '.JCL'" :rules="rules.JCL">
                                    <el-input-number
                                        v-model="scope.row.JCL"
                                        style="width: 100%"
                                        :controls="false"
                                        :min="0"
                                        :step="0.01"
                                        :precision="2"
                                        class="yp-JCL"
                                        :disabled="!scope.row.isEdit"
                                        @keydown.enter="jclhandleKeyDown($event, scope, 'BZ', 'yp-JCL')"
                                    ></el-input-number>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="备注" prop="BZ" align="center">
                            <template #default="scope">
                                <el-input
                                    v-model="scope.row.BZ"
                                    type="string"
                                    style="width: 100%"
                                    class="BZ"
                                    :disabled="!scope.row.isEdit"
                                    @keydown.enter="handleKeyDown1($event, scope, 'LB')"
                                ></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="" label="操作" width="150" fixed="right" align="center">
                            <template #default="scope">
                                <div style="display: flex; justify-content: space-around">
                                    <el-button link v-blur type="primary" size="small" round @click="addfdjcl"> 新增 </el-button>
                                    <el-button link v-blur type="primary" size="small" @click="editfdjcl(scope.row)">
                                        {{ scope.row.editTxt }}
                                    </el-button>
                                    <el-popconfirm title="您确定删除这条记录吗?" @confirm="deletefdjcl(scope.row, scope.$index)">
                                        <template #reference>
                                            <el-button link v-blur type="primary" v-if="state.fdjclData.length !== 1" size="small">删除</el-button>
                                        </template>
                                    </el-popconfirm>
                                </div>
                            </template>
                        </el-table-column>
                        <template #empty>
                            <el-empty description="暂无数据" />
                        </template>
                    </el-table>
                </el-form>
            </div>
            <template #footer>
                <div class="yd-from-footer">
                    <el-button v-blur @click="submitForm(formRef)" type="primary" class="btn-form-save">保存</el-button>
                    <el-button @click="cancel" class="btn-form-cancel">取消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, nextTick } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { getYpjcbl, saveYpjcbl, deleteYpjcbl } from '/@/api/backend/jcgl/ypxxwh'
// 控制分段加成率设置对话框显示隐藏
const dialogVisble = ref(false)

const formRef = ref<FormInstance>()

const formData = reactive({
    ID: '',
    LB: '',
    ZDJ: '',
    ZGJ: '',
    JCL: '',
    BZ: '',
})
const state: {
    fdjclData: any //分段加成率数据
} = reactive({
    fdjclData: [
        {
            ID: '',
            LB: '',
            ZDJ: '',
            ZGJ: '',
            JCL: '',
            BZ: '',
            isEdit: true,
            editTxt: '确定',
        },
    ],
})

// 回车聚焦事件
const tableref = ref(null)
const zdjhandleKeyDown = (event: any, scope: any, nextClass: any, thisClass: any) => {
    if (event.keyCode === 13) {
        // 按下回车键聚焦到下一个输入框
        if (nextClass && scope.row.ZDJ) {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${nextClass} .el-input__inner`)
            if (ele) {
                ele.focus()
            }
        } else {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${thisClass} .el-input__inner`)
            if (ele) {
                ele.blur()
                nextTick(() => {
                    ele.focus()
                })
            }
        }
    }
}
const zgjhandleKeyDown = (event: any, scope: any, nextClass: any, thisClass: any) => {
    if (event.keyCode === 13) {
        // 按下回车键聚焦到下一个输入框
        if (nextClass && scope.row.ZGJ) {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${nextClass} .el-input__inner`)
            if (ele) {
                ele.focus()
            }
        } else {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${thisClass} .el-input__inner`)
            if (ele) {
                ele.blur()
                nextTick(() => {
                    ele.focus()
                })
            }
        }
    }
}
const jclhandleKeyDown = (event: any, scope: any, nextClass: any, thisClass: any) => {
    if (event.keyCode === 13) {
        // 按下回车键聚焦到下一个输入框
        if (nextClass && scope.row.JCL) {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${nextClass} .el-input__inner`)
            if (ele) {
                ele.focus()
            }
        } else {
            const rowIndex = scope.$index
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${thisClass} .el-input__inner`)
            if (ele) {
                ele.blur()
                nextTick(() => {
                    ele.focus()
                })
            }
        }
    }
}

const handleKeyDown1 = (event: any, scope: any, nextClass: any) => {
    if (event.keyCode === 13) {
        if (state.fdjclData.length - scope.$index === 1) {
            addfdjcl()
        }
        nextTick(() => {
            const rowIndex = scope.$index + 1
            let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${nextClass} .el-input__inner`)
            if (ele) {
                ele.focus()
            }
        })
    }
}

const handleKeyDown2 = (scope: any, nextClass: any) => {
    if (nextClass && scope.row.LB) {
        const rowIndex = scope.$index
        let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${nextClass} .el-input__inner`)
        if (ele) {
            ele.focus()
        }
    }
}

const handleKeyDown3 = () => {
    let ele = tableref.value.$el.querySelector(`.el-table__row:nth-child(1)`).querySelector(`.LB .el-input__inner`)
    if (ele) {
        ele.focus()
    }
}

const loadYpjcbl = () => {
    // 获取药品加成比例
    getYpjcbl({ agrs: '' }).then((res) => {
        if (res.code == 1) {
            state.fdjclData = res.data
            state.fdjclData.forEach((item: any) => {
                item.isEdit = true
                item.editTxt = '确认'
            })
        }
    })
}

watch(
    () => dialogVisble.value,
    (val) => {
        if (val) {
            loadYpjcbl()
            nextTick(() => {
                handleKeyDown3()
            })
        }
    }
)

const lbOptions = [
    { BM: '21', MC: '西成药' },
    { BM: '22', MC: '中成药' },
    { BM: '23', MC: '中草药' },
    { BM: '24', MC: '配方颗粒' },
]
// 新增一行
const addfdjcl = () => {
    state.fdjclData.push({
        ID: '',
        LB: '',
        ZDJ: '',
        ZGJ: '',
        JCL: '',
        BZ: '',
        isEdit: true,
        editTxt: '确定',
    })
}

// 控制行可编辑
const editfdjcl = (row: any) => {
    if (row.isEdit) {
        row.editTxt = '编辑'
    } else {
        row.editTxt = '确认'
    }
    row.isEdit = !row.isEdit
}
// 删除行
const deletefdjcl = (row: any, index: any) => {
    formData.ID = row.ID
    deleteYpjcbl({ agrs: formData.ID }).then((res) => {
        if (res.code != 1) {
            ElMessage({
                type: 'error',
                message: '删除失败',
            })
        } else {
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
        }
    })
    state.fdjclData.splice(index, 1)
}

const validate = (rule: any, value: any, callback: any) => {
    if (value === '' || value === 0 || value === undefined) {
        callback(new Error(''))
    } else {
        callback()
    }
}

const rules = reactive({
    LB: [{ required: true, validator: validate, trigger: 'blur' }],
    ZDJ: [{ required: true, validator: validate, trigger: 'blur' }],
    ZGJ: [{ required: true, validator: validate, trigger: 'blur' }],
    JCL: [{ required: true, validator: validate, trigger: 'blur' }],
})

const submitForm = async (formEl: FormInstance | undefined) => {
    // 借鉴的成员
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            let fdjclItems: any = []
            if (state.fdjclData && state.fdjclData.length === 1) {
                state.fdjclData.forEach((item: any) => {
                    formData.ID = item.ID
                    formData.LB = item.LB
                    formData.ZDJ = item.ZDJ
                    formData.ZGJ = item.ZGJ
                    formData.JCL = item.JCL
                    formData.BZ = item.BZ
                })
            }
            if (state.fdjclData && state.fdjclData.length > 1) {
                state.fdjclData.forEach((item: any) => {
                    fdjclItems.push({ ID: item.ID, LB: item.LB, ZDJ: item.ZDJ, ZGJ: item.ZGJ, JCL: item.JCL, BZ: item.BZ })
                })
            }
            let data = {
                agrs: {
                    mode: {
                        ID: formData.ID,
                        LB: formData.LB,
                        ZDJ: formData.ZDJ,
                        ZGJ: formData.ZGJ,
                        JCL: formData.JCL,
                        BZ: formData.BZ,
                    },
                    list: fdjclItems,
                },
            }
            saveYpjcbl(data).then((res: any) => {
                if (res.code != 1) {
                    ElMessage({
                        type: 'error',
                        message: '保存失败',
                    })
                } else {
                    ElMessage({
                        type: 'success',
                        message: '保存成功',
                    })
                    dialogVisble.value = false
                }
            })
        } else {
            console.log('error submit!', fields)
        }
    })
}
const cancel = () => {
    dialogVisble.value = false
}

defineExpose({
    dialogVisble,
})
</script>
<style scoped lang="scss">
:deep(.el-dialog__body) {
    height: 500px;
}

.ba-data-table :deep(.table-header-cell) .cell {
    color: var(--el-text-color-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

:deep(.el-select-tags-wrapper .el-tag) {
    color: #333;
}
.yp-ZDJ :deep(.el-input__inner) {
    text-align: center;
}
.yp-ZGJ :deep(.el-input__inner) {
    text-align: center;
}
.yp-JCL :deep(.el-input__inner) {
    text-align: center;
}
</style>
