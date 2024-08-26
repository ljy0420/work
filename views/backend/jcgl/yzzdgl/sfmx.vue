<template>
    <div class="yd-card-body">
        <el-form :model="state" :rules="rules" ref="ruleFormRef">
            <el-table class="ba-data-table w100" :data="state.sfmxData" border height="480px">
                <el-table-column prop="SFXMMC" label="收费项目" width="230">
                    <template #default="scope">
                        <SelectSfxm v-model="scope.row.SFXMMC" :agrs="scope.row" :conditions="{ leiBie: state.leibie }" @choice="onChoice" />
                    </template>
                </el-table-column>
                <el-table-column prop="JG" label="单价" width="150"></el-table-column>
                <el-table-column prop="SFSL" label="收费数量" width="130">
                    <template #default="scope">
                        <el-form-item :prop="'sfmxData.' + scope.$index + '.SFSL'" :rules="rules.SFSL">
                            <el-input-number v-model="scope.row.SFSL" :controls="false" type="number"
                                :min="0"></el-input-number>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column prop="GX" label="固定项目" width="130">
                    <template #default="scope">
                        <el-radio-group v-model="scope.row.GX">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="操作" width="80" fixed="right" align="center">
                    <template #default="scope">
                        <el-button link v-blur type="primary" size="small" @click="addRow">
                            <Icon name="local-create" style="color: rgb(14, 141, 77)" class="local-icon" />
                        </el-button>
                        <el-popconfirm title="您确定删除这条记录吗?" width="200" @confirm="deleteRow(scope.$index)">
                            <template #reference>
                                <el-button link v-blur type="primary" size="small" style="margin-left: 3px"
                                    v-if="state.sfmxData.length > 1">
                                    <Icon name="local-delete" style="color: rgb(245, 75, 33)" class="local-icon" />
                                </el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch, nextTick } from 'vue'
import SelectSfxm from '/@/components/selectext/select-sfxm.vue'
import { getYzxmsfmx } from '/@/api/backend/jcgl/yzxmzd'

defineOptions({
    name: 'jcgl/yzzdgl/sfmx',
})

const ruleFormRef = ref()

const props = defineProps({
    currentXmbm: {
        type: String
    },
    lb: {
        type: String,
        default: () => ''
    }
})

const emit = defineEmits(["sfmxChange"]);

const state: {
    currentXmbm: any,
    leibie: any,
    sfmxData: any
} = reactive({
    currentXmbm: props.currentXmbm,
    leibie: props.lb,
    sfmxData: [{ SFXMBM: '', JG: '', SFSL: 1, GX: 1, BWBM:'', JCFFBM:'' }]
})

/**
 * 加载收费项目
 */
const loadSfmx = (xmbm: String) => {
    getYzxmsfmx({ agrs: xmbm }).then((res) => {
        if (res.data && res.data.length > 0) {
            state.sfmxData = res.data
        } else {
            state.sfmxData = [{ SFXMBM: '', JG: '', SFSL: 1, GX: 1, BWBM:'', JCFFBM:'' }]
        }
    })
}

const validateSFSL = (rule: any, value: any, callback: any) => {
    if (value === '' || value === 0 || value === undefined || value === null) {
        callback(new Error(''))
    } else {
        callback()
    }
}

const rules = reactive({
    SFSL: [{ required: true, validator: validateSFSL, trigger: 'blur' }],
})

const onChoice = (row: any, agrs: any) => {
    agrs.SFXMBM = row.XMBM
    agrs.SFXMMC = row.XMMC
    agrs.JG = row.DJ
}

const addRow = () => {
    state.sfmxData.push({ SFXMBM: '', JG: '', SFSL: 1, GX: 1, BWBM:'', JCFFBM:'' })
}

const deleteRow = (rowIndex: any) => {
    state.sfmxData.splice(rowIndex, 1)
}

watch(
    () => state.sfmxData,
    (val) => {
        emit("sfmxChange", val)
    },
    {
        deep: true,
    }
)

watch(
    () => props.lb,
    (val) => {
        state.leibie = val
    }
)

onMounted(() => {
    if(props.currentXmbm) {
        loadSfmx(props.currentXmbm)
    }
})
</script>

<style scoped lang="scss">
:deep(.el-form--inline .el-form-item) {
    margin-right: 5px;
    margin-bottom: 5px;
}

.el-table :deep(.el-form-item) {
    margin-bottom: 0;
}

.el-table :deep(.el-table__cell) {
    font-size: 14px;
}

.el-table__cell .el-radio {
    margin-right: 10px;
}
</style>