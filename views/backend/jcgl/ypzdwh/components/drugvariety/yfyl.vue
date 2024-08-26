<template>
    <div>
        <el-dialog
            class="ba-operate-dialog"
            :close-on-click-modal="false"
            :model-value="dialogVisble"
            @close="cancel"
            :destroy-on-close="true"
            align-center
            id="yfyl-dialog"
            width="800px"
        >
            <template #header>
                <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']">
                    {{ '用法用量设置' }}
                </div>
            </template>
            <div class="ba-operate-form">
                <el-form ref="formRef" :model="formData" label-position="left" label-width="80" :rules="rules">
                    <el-form-item prop="XMBM" label="指定药品">
                        <el-select
                            v-model="formData.XMBM"
                            placeholder="请选择"
                            filterable
                            clearable
                            style="width: 100%"
                            @change="change"
                            class="XMBM"
                            @keyup.enter="handleKeyDown5($event, 'SYXMBM')"
                            ref="selectRef"
                        >
                            <el-option
                                v-for="opt in prop.ypdata"
                                :key="opt.YPBM"
                                :label="'[' + opt.YPBM + ']' + opt.YPMC + '(' + opt.GG + ')'"
                                :value="opt.YPBM"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <div class="title1">过敏试验</div>
                    <el-table
                        ref="tableref1"
                        class="ba-data-table w100"
                        header-cell-class-name="table-header-cell"
                        :data="state.gmsyxmData"
                        highlight-current-row
                        height="200px"
                        border
                    >
                        <el-table-column type="index" align="center" width="60px" />
                        <el-table-column label="项目名称" prop="XMMC" align="center">
                            <template #default="scope">
                                <el-select
                                    v-model="scope.row.SYXMBM"
                                    placeholder="请选择"
                                    filterable
                                    clearable
                                    style="width: 100%"
                                    :disabled="!scope.row.isEdit"
                                    class="SYXMBM"
                                    @keyup.enter="handleKeyDown4($event, 'YF')"
                                >
                                    <el-option v-for="opt in yzxmList" :key="opt.XMBM" :label="opt.XMMC" :value="opt.XMBM"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="" label="操作" width="150" fixed="right" align="center">
                            <template #default="scope">
                                <div style="display: flex; justify-content: space-around">
                                    <el-button link v-blur type="primary" size="small" round @click="addgmsyxm"> 新增 </el-button>
                                    <el-button link v-blur type="primary" size="small" @click="editgmsyxm(scope.row)">
                                        {{ scope.row.editTxt }}
                                    </el-button>
                                    <el-popconfirm title="您确定删除这条记录吗?" @confirm="deletegmsyxm(scope.$index)">
                                        <template #reference>
                                            <el-button link v-blur type="primary" v-if="state.gmsyxmData.length !== 1" size="small">删除</el-button>
                                        </template>
                                    </el-popconfirm>
                                </div>
                            </template>
                        </el-table-column>
                        <template #empty>
                            <el-empty description="暂无数据" />
                        </template>
                    </el-table>
                    <div class="title2">常规用法用量</div>
                    <el-form :model="state" :rules="rules1" ref="ruleFormRef2">
                        <el-table
                            ref="tableref2"
                            class="ba-data-table w100"
                            header-cell-class-name="table-header-cell"
                            :data="state.yfylData"
                            highlight-current-row
                            height="200px"
                            border
                        >
                            <el-table-column type="index" label="序号" align="center" width="60px" />
                            <el-table-column label="用法" prop="YFMC" align="center" width="155px">
                                <template #default="scope">
                                    <el-select
                                        v-model="scope.row.YFBM"
                                        placeholder="请选择"
                                        filterable
                                        clearable
                                        style="width: 100%"
                                        :disabled="!scope.row.isEdit"
                                        class="YF"
                                        @keyup.enter="yfhandleKeyDown($event, scope, 'PL')"
                                    >
                                        <el-option v-for="opt in yfylList" :key="opt.XMBM" :label="opt.XMMC" :value="opt.XMBM"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column label="频率" prop="PLMC" align="center" width="170px">
                                <template #default="scope">
                                    <el-select
                                        v-model="scope.row.PLBM"
                                        placeholder="请选择"
                                        filterable
                                        clearable
                                        style="width: 100%"
                                        :disabled="!scope.row.isEdit"
                                        class="PL"
                                        @keyup.enter="plhandleKeyDown($event, scope, 'CRJL')"
                                    >
                                        <el-option v-for="opt in plList" :key="opt.PLBM" :label="opt.PLMC" :value="opt.PLBM"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column label="成人剂量" prop="CRJL" align="center" width="90px">
                                <template #default="scope">
                                    <el-form-item style="height: 15px" :prop="'yfylData.' + scope.$index + '.CRJL'" :rules="rules1.CRJL">
                                        <el-input
                                            v-model.number="scope.row.CRJL"
                                            style="width: 100%"
                                            oninput="value=value.replace(/[^\d]/g,'')"
                                            class="CRJL"
                                            :disabled="!scope.row.isEdit"
                                            @keydown.enter="crjlhandleKeyDown($event, scope, 'ETJL', 'CRJL')"
                                        ></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="小儿剂量" prop="ETJL" align="center" width="90px">
                                <template #default="scope">
                                    <el-form-item style="height: 15px" :prop="'yfylData.' + scope.$index + '.ETJL'" :rules="rules1.ETJL">
                                        <el-input
                                            v-model.number="scope.row.ETJL"
                                            style="width: 100%"
                                            oninput="value=value.replace(/[^\d]/g,'')"
                                            class="ETJL"
                                            :disabled="!scope.row.isEdit"
                                            @keydown.enter="etjlhandleKeyDown($event, scope, 'YSZT', 'ETJL')"
                                        ></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="医生嘱托" prop="YSZT" align="center" width="150px">
                                <template #default="scope">
                                    <el-input
                                        v-model="scope.row.YSZT"
                                        type="string"
                                        style="width: 100%"
                                        :disabled="!scope.row.isEdit"
                                        class="YSZT"
                                        @keydown.enter="handleKeyDown1($event, scope, 'YF')"
                                    ></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="" label="操作" width="150" fixed="right" align="center">
                                <template #default="scope">
                                    <div style="display: flex; justify-content: space-around">
                                        <el-button link v-blur type="primary" size="small" round @click="addyfyl"> 新增 </el-button>
                                        <el-button link v-blur type="primary" size="small" @click="edityfyl(scope.row)">
                                            {{ scope.row.editTxt }}
                                        </el-button>
                                        <el-popconfirm title="您确定删除这条记录吗?" @confirm="deleteyfyl(scope.$index)">
                                            <template #reference>
                                                <el-button link v-blur type="primary" v-if="state.yfylData.length !== 1" size="small">删除</el-button>
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
import { ElMessage, type FormInstance, type FormItemRule } from 'element-plus'
import { getYpyfyl, getYpgmsyxm, saveYpyfyl, getPlzd, getYzxmzd } from '/@/api/backend/jcgl/ypxxwh'
import { buildValidatorData } from '/@/utils/validate'
import { useAdminInfo } from '/@/stores/adminInfo'

const adminInfo = useAdminInfo()

const dialogVisble = ref(false)

const formRef = ref<FormInstance>()
const yfylList = ref([])
const plList = ref([])
const yzxmList = ref([])
const prop = defineProps(['selectYpbm', 'ypdata'])

const formData = reactive({
    ypdata: [],
    yfylData: [],
    gmsyxmData: [],
    XMBM: '',
    YZXMBM: '',
})
const state: {
    yfylData: any //用法用量数据
    gmsyxmData: any //过敏试验项目数据
} = reactive({
    yfylData: [
        {
            YFBM: '',
            PLBM: '',
            CRJL: '',
            ETJL: '',
            YSZT: '',
            isEdit: true,
            editTxt: '确定',
        },
    ],
    gmsyxmData: [
        {
            XMBM: '',
            isEdit: true,
            editTxt: '确定',
        },
    ],
})
const tableref1 = ref(null)
const tableref2 = ref(null)
const selectRef: any = ref<HTMLElement | null>(null)
const crjlhandleKeyDown = (event: any, scope: any, nextClass: any, thisClass: any) => {
    if (event.keyCode === 13) {
        // 按下回车键聚焦到下一个输入框
        if (nextClass && scope.row.CRJL) {
            const rowIndex = scope.$index
            let ele = tableref2.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${nextClass} .el-input__inner`)
            if (ele) {
                ele.focus()
            }
        } else {
            const rowIndex = scope.$index
            let ele = tableref2.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${thisClass} .el-input__inner`)
            if (ele) {
                ele.blur()
                nextTick(() => {
                    ele.focus()
                })
            }
        }
    }
}

const etjlhandleKeyDown = (event: any, scope: any, nextClass: any, thisClass: any) => {
    if (event.keyCode === 13) {
        // 按下回车键聚焦到下一个输入框
        if (nextClass && scope.row.ETJL) {
            const rowIndex = scope.$index
            let ele = tableref2.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${nextClass} .el-input__inner`)
            if (ele) {
                ele.focus()
            }
        } else {
            const rowIndex = scope.$index
            let ele = tableref2.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${thisClass} .el-input__inner`)
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
        if (state.yfylData.length - scope.$index === 1) {
            addyfyl()
        }
        nextTick(() => {
            if (!scope.row.YFBM) {
                const rowIndex = scope.$index + 1
                let ele = tableref2.value.$el
                    .querySelector(`.el-table__row:nth-child(${rowIndex + 1})`)
                    .querySelector(`.${nextClass} .el-input__inner`)
                if (ele) {
                    ele.focus()
                }
            }
        })
    }
}

const yfhandleKeyDown = (event: any, scope: any, nextClass: any) => {
    if (event.keyCode === 13) {
        if (nextClass && scope.row.YFBM) {
            const rowIndex = scope.$index
            let ele = tableref2.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${nextClass} .el-input__inner`)
            if (ele) {
                ele.focus()
            }
        }
    }
}

const plhandleKeyDown = (event: any, scope: any, nextClass: any) => {
    if (event.keyCode === 13) {
        if (nextClass && scope.row.PLBM) {
            const rowIndex = scope.$index
            let ele = tableref2.value.$el.querySelector(`.el-table__row:nth-child(${rowIndex + 1})`).querySelector(`.${nextClass} .el-input__inner`)
            if (ele) {
                ele.focus()
            }
        }
    }
}

const handleKeyDown3 = () => {
    nextTick(() => {
        selectRef.value.focus()
    })
}

const handleKeyDown4 = (event: any, nextClass: any) => {
    if (event.keyCode === 13) {
        let ele = tableref2.value.$el.querySelector(`.el-table__row:nth-child(1)`).querySelector(`.${nextClass} .el-input__inner`)
        if (ele) {
            ele.focus()
        }
    }
}

const handleKeyDown5 = (event: any, nextClass: any) => {
    if (event.keyCode === 13) {
        let ele = tableref1.value.$el.querySelector(`.el-table__row:nth-child(1)`).querySelector(`.${nextClass} .el-input__inner`)
        if (ele) {
            ele.focus()
        }
    }
}

const change = () => {
    loadYpyfyl()
    loadYpgmsyxm()
    loadYpyfpl()
}

const loadYpgmsyxm = () => {
    prop.ypdata.forEach((item: any) => {
        formData.YZXMBM = item.YZXMBM
    })
    // 获取过敏试验项目
    getYpgmsyxm({ agrs: formData.YZXMBM }).then((res) => {
        if (res.code == 1) {
            state.gmsyxmData = res.data
            if (state.gmsyxmData.length < 1) {
                addgmsyxm()
            }
            state.gmsyxmData.forEach((item: any) => {
                item.isEdit = true
                item.editTxt = '确认'
            })
        }
    })
}

const loadYpyfyl = () => {
    prop.ypdata.forEach((item: any) => {
        formData.YZXMBM = item.YZXMBM
    })
    // 获取用法用量
    getYpyfyl({ agrs: formData.YZXMBM }).then((res) => {
        if (res.code == 1) {
            state.yfylData = res.data
            if (state.yfylData.length < 1) {
                addyfyl()
            }
            state.yfylData.forEach((item: any) => {
                item.isEdit = true
                item.editTxt = '确认'
            })
        }
    })
}

const loadYpyfpl = () => {
    getYzxmzd({ agrs: { caoZuoLX: ['2', '3', '4'] } }).then((res) => {
        if (res.code == 1) {
            yfylList.value = res.data
        }
    })
    getPlzd({ jgbm: adminInfo.jgbm }).then((res) => {
        if (res.code == 1) {
            plList.value = res.data
        }
    })
    getYzxmzd({ agrs: { leiBieBM: '3', caoZuoLX: ['1'] } }).then((res) => {
        if (res.code == 1) {
            yzxmList.value = res.data
        }
    })
}
watch(
    () => prop.ypdata,
    (val) => {
        if (val) {
            if (prop.ypdata && prop.ypdata.length > 0) {
                formData.XMBM = prop.ypdata[0].YPBM
                loadYpyfyl()
                loadYpgmsyxm()
                loadYpyfpl()
            }
        }
    }
)

watch(
    () => dialogVisble.value,
    (val) => {
        if (val) {
            handleKeyDown3()
        }
    }
)

watch(
    () => prop.selectYpbm,
    (val) => {
        if (val) {
            formData.XMBM = val
            nextTick(() => {
                loadYpyfyl()
                loadYpgmsyxm()
                loadYpyfpl()
            })
        }
    }
)

// 新增一行
const addgmsyxm = () => {
    state.gmsyxmData.push({
        XMBM: '',
        isEdit: true,
        editTxt: '确定',
    })
}

// 控制行可编辑
const editgmsyxm = (row: any) => {
    if (row.isEdit) {
        row.editTxt = '编辑'
    } else {
        row.editTxt = '确认'
    }
    row.isEdit = !row.isEdit
}
// 删除行
const deletegmsyxm = (index: any) => {
    state.gmsyxmData.splice(index, 1)
}

// 新增一行
const addyfyl = () => {
    state.yfylData.push({
        YFBM: '',
        PLBM: '',
        CRJL: '',
        ETJL: '',
        YSZT: '',
        isEdit: true,
        editTxt: '确定',
    })
}

// 控制行可编辑
const edityfyl = (row: any) => {
    if (row.isEdit) {
        row.editTxt = '编辑'
    } else {
        row.editTxt = '确认'
    }
    row.isEdit = !row.isEdit
}
// 删除行
const deleteyfyl = (index: any) => {
    state.yfylData.splice(index, 1)
}

const validate = (rule: any, value: any, callback: any) => {
    if (value === '' || value === 0 || value === undefined) {
        callback(new Error(''))
    } else {
        callback()
    }
}

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    XMBM: [buildValidatorData({ name: 'required', message: '项目编码不能为空.' })],
})

const rules1 = reactive({
    CRJL: [{ required: true, validator: validate, trigger: 'blur' }],
    ETJL: [{ required: true, validator: validate, trigger: 'blur' }],
})

const submitForm = async (formEl: FormInstance | undefined) => {
    // 借鉴的成员
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            let gmsyxmItems: any = []
            let yfylItems: any = []
            prop.ypdata.forEach((item: any) => {
                formData.YZXMBM = item.YZXMBM
            })
            if (state.gmsyxmData) {
                state.gmsyxmData.forEach((item: any) => {
                    gmsyxmItems.push({ XMBM: formData.YZXMBM, SYXMBM: item.SYXMBM })
                })
            }
            let increment = 0
            if (state.yfylData) {
                state.yfylData.forEach((item: any) => {
                    yfylItems.push({
                        XMBM: formData.YZXMBM,
                        XZ: increment,
                        YFBM: item.YFBM,
                        PLBM: item.PLBM,
                        CRJL: item.CRJL,
                        ETJL: item.ETJL,
                        YSZT: item.YSZT,
                    })
                    increment++
                })
            }
            let data = {
                agrs: {
                    BM: formData.YZXMBM,
                    ListT1: gmsyxmItems,
                    ListT2: yfylItems,
                },
            }
            saveYpyfyl(data).then((res: any) => {
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

const show = () => {
    dialogVisble.value = true
    handleKeyDown3()
}

defineExpose({
    show,
})
</script>
<style scoped lang="scss">
.title1 {
    width: 100%;
    margin-top: -10px;
    margin-bottom: 10px;
}
.title2 {
    width: 100%;
    margin-top: 10px;
    margin-bottom: 10px;
}
:deep(.el-dialog__body) {
    height: 600px;
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
.CRJL :deep(.el-input__inner) {
    text-align: center;
}
.ETJL :deep(.el-input__inner) {
    text-align: center;
}
</style>
