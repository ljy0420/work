<template>
    <div>
        <div class="zxks-tab">
            <el-row :gutter="2">
                <el-col :xs="24" :sm="9" style="padding-left: 5px">
                    <el-form-item label="门诊执行科室">
                        <el-select v-model="state.MZZXKS" placeholder="请选择" clearable style="width: 190px"
                            @change="mzzxksChange">
                            <el-option v-for="opt in state.zxksArr" :key="opt.BM" :label="opt.MC"
                                :value="opt.BM"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="9">
                    <div>
                        <el-form-item label="住院执行科室">
                            <el-select v-model="state.ZYZXKS" placeholder="请选择" clearable style="width: 190px"
                                @change="zyzxksChange">
                                <el-option v-for="opt in state.zxksArr" :key="opt.BM" :label="opt.MC"
                                    :value="opt.BM"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="6"></el-col>
            </el-row>
            <el-table class="ba-data-table w100" :data="state.zxksData" border height="480px">
                <el-table-column prop="BRLY" label="病人来源" width="115">
                    <template #default="scope">
                        <el-select filterable clearable v-model="scope.row.BRLY" placeholder="请选择"
                            :disabled="!scope.row.isEdit" style="width: 100%">
                            <el-option v-for="opt in state.brlyArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"
                                :disabled="opt.disabled"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="ZXKSBM" label="执行科室" width="130">
                    <template #default="scope">
                        <el-select v-model="scope.row.ZXKSBM" placeholder="请选择" filterable clearable
                            :disabled="!scope.row.isEdit" style="width: 100%">
                            <el-option v-for="opt in state.kdksArr" :key="opt.KSBM" :label="opt.KSMC"
                                :value="opt.KSBM"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="FWKS" label="服务科室">
                    <template #default="scope">
                        <el-select v-model="scope.row.FWKS" placeholder="请选择(可多选)" filterable clearable multiple
                            :disabled="!scope.row.isEdit" style="width: 100%">
                            <el-option v-for="opt in state.ksArr" :key="opt.KSBM" :label="opt.KSMC"
                                :value="opt.KSBM"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="操作" width="80" fixed="right" align="center">
                    <template #default="scope">
                        <el-button link v-blur type="primary" size="small" @click="addZxks"
                            v-show="state.MZZXKS === 4 || state.ZYZXKS === 4">
                            <Icon name="local-create" style="color: rgb(14, 141, 77)" class="local-icon" />
                        </el-button>
                        <el-popconfirm title="您确定删除这条记录吗?" width="200" @confirm="deleteZxks(scope.$index)">
                            <template #reference>
                                <el-button link v-blur type="primary" size="small" style="margin-left: 3px"
                                    v-if="state.zxksData.length > 1">
                                    <Icon name="local-delete" style="color: rgb(245, 75, 33)" class="local-icon" />
                                </el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, watch, nextTick } from 'vue'
import { getYzxmzxks } from '/@/api/backend/jcgl/yzxmzd'

defineOptions({
    name: 'jcgl/yzzdgl/jcbw',
})

const props = defineProps({
    currentXmbm: {
        type: String
    },
    ks: {
        type: Array as unknown as any[],
        default: () => [],
    },
    kdks: {
        type: Array as unknown as any[],
        default: () => [],
    },
    mzzxks: {
        type: [String, Number]
    },
    zyzxks: {
        type: [String, Number]
    },
})

const emit = defineEmits(["zxksDataChange", "mzzxksChange", "zyzxksChange"]);

const state: {
    ksArr: any, //科室
    kdksArr: any, //开单科室
    zxksData: any //执行科室
    MZZXKS: any, //门诊执行科室
    ZYZXKS: any, //住院执行科室
    currentXmbm: any,
    zxksArr: any,
    brlyArr: any,
    bwLoading: boolean
} = reactive({
    ksArr: props.ks,
    kdksArr: props.kdks,
    zxksData: [{ BRLY: '', ZXKSBM: '', FWKS: [], isEdit: false, editTxt: '确定' }],
    MZZXKS: props.mzzxks,
    ZYZXKS: props.zyzxks,
    currentXmbm: props.currentXmbm,
    zxksArr: [
        { BM: 0, MC: '不跟踪执行的医嘱' },
        { BM: 1, MC: '由病人科室执行' },
        { BM: 2, MC: '由病人病区执行' },
        { BM: 3, MC: '操作员所在科室' },
        { BM: 4, MC: '指定科室执行' },
        { BM: 5, MC: '医院外执行' },
        { BM: 6, MC: '开单人所在科室' }
    ],
    brlyArr: [
        { BM: '1', MC: '门诊', disabled: true },
        { BM: '2', MC: '住院', disabled: true },
    ],
    bwLoading: false
})

watch(
    () => state.zxksData,
    (val) => {
        if (val) {
            const zxksArr: any = []
            val.forEach((item: any) => {
                if (item.FWKS && item.FWKS.length > 0) {
                    item.FWKS.forEach((kdksbm: any) => {
                        zxksArr.push({ BRLY: item.BRLY, ZXKSBM: item.ZXKSBM, KDKSBM: kdksbm })
                    })
                } else {
                    zxksArr.push({ BRLY: item.BRLY, ZXKSBM: item.ZXKSBM, KDKSBM: '' })
                }
            })
            emit('zxksDataChange', zxksArr)
        } else {
            emit('zxksDataChange', [])
        }
    },
    {
        deep: true
    }
)

const loadZxks = () => {
    //console.log('查询执行科室')
    if (state.currentXmbm) {
        getYzxmzxks({ agrs: state.currentXmbm }).then((res) => {
            // console.log('获取执行科室',res)
            if (res.data && res.data.length > 0) {
                res.data.forEach((item: any) => {
                    item.isEdit = false
                    item.editTxt = '编辑'
                })
                state.zxksData = res.data
                zxksEidtSet()
            } else {
                state.zxksData = [{ BRLY: '', ZXKSBM: '', FWKS: [], isEdit: false, editTxt: '确定' }]
                zxksEidtSet()
            }
        })
    } else {
        state.zxksData = [{ BRLY: '', ZXKSBM: '', FWKS: [], isEdit: false, editTxt: '确定' }]
        zxksEidtSet()
    }
}

const zxksEidtSet = () => {
    if (state.zxksData && state.zxksData.length > 0) {
        state.zxksData.forEach((item: any) => {
            item.isEdit = true
        })
    }
    if (state.MZZXKS == 4 && state.ZYZXKS == 4) {
        state.brlyArr.forEach((item: any) => {
            item.disabled = false
        })
    } else if (state.MZZXKS == 4 && state.ZYZXKS != 4) {
        state.brlyArr.forEach((item: any) => {
            item.disabled = true
            if (item.BM == 1) {
                item.disabled = false
            } else {
                item.disabled = true
            }
        })
    } else if (state.MZZXKS != 4 && state.ZYZXKS == 4) {
        state.brlyArr.forEach((item: any) => {
            item.disabled = true
            if (item.BM == 1) {
                item.disabled = true
            } else {
                item.disabled = false
            }
        })
    } else {
        state.brlyArr.forEach((item: any) => {
            item.disabled = true
        })
        if (state.zxksData && state.zxksData.length > 0) {
            state.zxksData.forEach((item: any) => {
                item.isEdit = false
            })
        }
    }
}

const mzzxksChange = (value: any) => {
    emit("mzzxksChange", value)
    zxksEidtSet()
}

const zyzxksChange = (value: any) => {
    emit("zyzxksChange", value)
    zxksEidtSet()
}

const addZxks = () => {
    state.zxksData.push({ BRLY: '', ZXKSBM: '', FWKS: [], isEdit: true, editTxt: '确定' })
}

const deleteZxks = (rowIndex: any) => {
    state.zxksData.splice(rowIndex, 1)
}

onMounted(() => {
    state.bwLoading = true
    nextTick(() => {
        loadZxks()
    })
})
</script>

<style scoped lang="scss">
:deep(.el-select-tags-wrapper .el-tag) {
    color: #333;
}

.zxks-tab .el-form-item {
    margin-bottom: 10px;
}
</style>
