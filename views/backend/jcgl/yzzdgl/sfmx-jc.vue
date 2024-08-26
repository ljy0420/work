<template>
    <div class="yd-card-body">
        <el-form :model="state" :rules="rules" ref="ruleFormRef">
            <el-table class="ba-data-table w100" :data="state.sfmxData" border height="480px">
                <el-table-column prop="BWMC" label="部位" width="100"></el-table-column>
                <el-table-column prop="JCFFMC" label="检查方法" width="150"></el-table-column>
                <el-table-column prop="SFXMMC" label="收费项目" width="230">
                    <template #default="scope">
                        <SelectSfxm v-model="scope.row.SFXMMC" :conditions="{ leiBie: '2' }" :agrs="scope.row" @choice="onChoice" />
                    </template>
                </el-table-column>
                <el-table-column prop="JG" label="单价" width="130"></el-table-column>
                <el-table-column prop="SFSL" label="收费数量" width="90">
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
            </el-table>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch, nextTick } from 'vue'
import SelectSfxm from '/@/components/selectext/select-sfxm.vue'

defineOptions({
    name: 'jcgl/yzzdgl/sfmx',
})

const ruleFormRef = ref()

const props = defineProps({
    currentXmbm: {
        type: String
    },
    sfmx: {
        type: Array as unknown as any[],
        default: () => [],
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
    sfmxData: []
})

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

watch(
    () => props.sfmx,
    (newVal) => {
        // console.log('sfmx',newVal)
        nextTick(() => {
            state.sfmxData = newVal
        })
    }
)

watch(
    () => props.lb,
    (val) => {
        state.leibie = val
    }
)

onMounted(() => {

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