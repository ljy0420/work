<template>
    <div>
        <!-- 录入诊断 -->
        <el-dialog
            class="ba-operate-dialog"
            :close-on-click-modal="false"
            :model-value="state.show"
            @close="onClose"
            :destroy-on-close="true"
            align-center
            width="1200px"
        >
            <template #header>
                <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">录入诊断</div>
            </template>
            <div class="lrzd-box">
                <div class="lrzd-left">
                    <div class="lrzd-filter">
                        <el-form-item>
                            <el-input
                                v-model="state.keywords"
                                clearable
                                @input="debounce(onSearchInput, 500)()"
                                placeholder="请输入文字(支持模糊搜索)"
                            >
                                <template #suffix>
                                    <Icon name="local-find" color="#409eff" />
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="诊断类型：">
                            <el-radio-group v-model="zdlx">
                                <el-radio :label="-1">全部</el-radio>
                                <el-radio :label="1">西医诊断</el-radio>
                                <el-radio :label="2">中医诊断</el-radio>
                                <el-radio :label="3">中医症候</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </div>
                    <div class="zd-list">
                        <el-table
                            v-loading="state.loading"
                            class="ba-data-table w100"
                            header-cell-class-name="table-header-cell"
                            :data="state.zdListData"
                            highlight-current-row
                            :show-header="false"
                            @selection-change="onSelectionChange"
                            height="100%"
                        >
                            <el-table-column type="selection" width="30" align="center" />
                            <el-table-column prop="ICDM" label="编码" width="135" :show-overflow-tooltip="true">
                                <template #default="{ row }">
                                    <span class="zdlx-tag">{{ renderZdlx(row.FLBM) }}</span
                                    ><span>{{ row.ICDM }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="JBMC" label="名称" :show-overflow-tooltip="true" />
                        </el-table>
                    </div>
                    <div class="tb-pagination">
                        <el-pagination
                            v-model:current-page="zdlist.page"
                            v-model:page-size="zdlist.size"
                            small
                            background
                            align="center"
                            layout="prev, pager, next, total"
                            :total="zdlist.count"
                            @current-change="zdlistCurrentChange"
                        />
                    </div>
                </div>
                <div class="lrzd-right">
                    <div class="yxzd-title">
                        已选诊断（<span>{{ state.xyzdData.length + state.zyzdData.length }}</span
                        >个）
                    </div>
                    <div class="xyzd-title">
                        西医诊断：<span>{{ state.xyzdData.length }}</span
                        >个
                    </div>
                    <div class="xyzd-list">
                        <el-table
                            v-loading="state.loading"
                            class="ba-data-table w100"
                            height="100%"
                            header-cell-class-name="table-header-cell"
                            :data="state.xyzdData"
                            highlight-current-row
                        >
                            <el-table-column label="NO" type="index" width="60" />
                            <el-table-column prop="ICDM" label="ICD码" width="130" />
                            <el-table-column prop="JBMC" label="疾病名称" />
                            <el-table-column prop="YS" label="设疑似" width="70">
                                <template #default="scope">
                                    <el-switch
                                        @change="onChangeXYYS($event, scope.row)"
                                        :model-value="scope.row.YS"
                                        active-value="1"
                                        inactive-value="0"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column prop="ZZ" label="设主诊" width="70">
                                <template #default="scope">
                                    <el-switch
                                        @change="onChangeXYZZ($event, scope.row)"
                                        :model-value="scope.row.ZZ"
                                        active-value="1"
                                        inactive-value="0"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column width="50">
                                <template #default="scope">
                                    <el-button link>
                                        <Icon
                                            name="local-remove"
                                            class="local-icon"
                                            style="color: #aaa; width: 15px; height: 15px"
                                            @click="onRemoveXyzd(scope)"
                                        />
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="zyzd-title">
                        中医诊断：<span>{{ state.zyzdData.length }}</span
                        >个
                    </div>
                    <div class="zyzd-list">
                        <el-table
                            v-loading="state.loading"
                            class="ba-data-table w100"
                            height="100%"
                            header-cell-class-name="table-header-cell"
                            :data="state.zyzdData"
                            highlight-current-row
                        >
                            <el-table-column label="NO" type="index" width="60" />
                            <el-table-column prop="ICDM" label="ICD码" width="130" />
                            <el-table-column prop="JBMC" label="疾病名称" />
                            <el-table-column prop="YS" label="设疑似" width="70">
                                <template #default="scope">
                                    <el-switch
                                        @change="onChangeZYYS($event, scope.row)"
                                        :model-value="scope.row.YS"
                                        active-value="1"
                                        inactive-value="0"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column prop="ZZ" label="设主诊" width="70">
                                <template #default="scope">
                                    <el-switch
                                        @change="onChangeZYZZ($event, scope.row)"
                                        :model-value="scope.row.ZZ"
                                        active-value="1"
                                        inactive-value="0"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column width="50">
                                <template #default="scope">
                                    <el-button link>
                                        <Icon
                                            name="local-remove"
                                            class="local-icon"
                                            style="color: #aaa; width: 15px; height: 15px"
                                            @click="onRemoveZyzd(scope)"
                                        />
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
            <template #footer>
                <div class="yd-from-footer">
                    <el-button ref="btnSave" v-blur type="primary" @click="onConfirm" class="btn-form-save"> 保存 </el-button>
                    <el-button @click="onClose" class="btn-form-cancel">取消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, watch } from 'vue'
import { debounce } from '/@/utils/common'
import { baTableApi } from '/@/api/common'

const prop = defineProps(['brid', 'lrzdList', 'zdxz'])

const emit = defineEmits(['zdConfirm', 'zdxz'])

const zdlx = ref(1)

const state: {
    keywords: string
    flbm: string
    loading: boolean
    show: boolean
    zdListData: any
    xyzdData: any
    zyzdData: any
    zdData: any
} = reactive({
    keywords: '',
    flbm: '7030006',
    loading: false,
    show: false,
    zdListData: [],
    xyzdData: [],
    zyzdData: [],
    zdData: [],
})

const zdlist = reactive({
    page: 1,
    size: 20,
    count: 0,
})

watch(
    () => zdlx.value,
    (val) => {
        if (val == -1) {
            state.flbm = ''
        } else if (val == 1) {
            state.flbm = '7030006'
        } else if (val == 2) {
            state.flbm = '7030003'
        } else if (val == 3) {
            state.flbm = '7030004'
        } else {
            state.flbm = ''
        }
        getList()
    }
)

const onSearchInput = () => {
    getList()
}

const zdlistCurrentChange = (page: number) => {
    zdlist.page = page
    getList()
}

const onSelectionChange = (rows: any) => {
    if (rows && rows.length > 0) {
        rows.forEach((item: any) => {
            let zdlx = renderZdlx(item.FLBM)
            if (zdlx == '中') {
                let yxjb = state.zyzdData.find((ele: any) => ele.ICDM == item.ICDM)
                if (!yxjb) {
                    state.zyzdData.push({ ICDM: item.ICDM, JBMC: item.JBMC, YS: '0', ZZ: '0' })
                }
            } else {
                let yxjb = state.xyzdData.find((ele: any) => ele.ICDM == item.ICDM)
                if (!yxjb) {
                    state.xyzdData.push({ ICDM: item.ICDM, JBMC: item.JBMC, YS: '0', ZZ: '0' })
                }
            }
        })
    }
}

const onChangeXYYS = (e: any, row: any) => {
    row.YS = e
    if (e == '1') {
        state.xyzdData.forEach((item: any) => {
            if (item.ICDM == row.ICDM) {
                item.ZZ = '0'
            }
        })
    }
}

const onChangeXYZZ = (e: any, row: any) => {
    row.ZZ = e
    if (e == '1') {
        state.xyzdData.forEach((item: any) => {
            if (item.ICDM != row.ICDM) {
                item.ZZ = '0'
                item.YS = '1'
            } else {
                item.YS = '0'
            }
        })
    }
}

const onChangeZYYS = (e: any, row: any) => {
    row.YS = e
    if (e == '1') {
        state.zyzdData.forEach((item: any) => {
            if (item.ICDM == row.ICDM) {
                item.ZZ = '0'
            }
        })
    }
}

const onChangeZYZZ = (e: any, row: any) => {
    row.ZZ = e
    if (e == '1') {
        state.zyzdData.forEach((item: any) => {
            if (item.ICDM != row.ICDM) {
                item.ZZ = '0'
                item.YS = '1'
            } else {
                item.YS = '0'
            }
        })
    }
}

const onRemoveXyzd = (scope: any) => {
    let index = scope.$index
    state.xyzdData.splice(index, 1)
}

const onRemoveZyzd = (scope: any) => {
    let index = scope.$index
    state.zyzdData.splice(index, 1)
}

const renderZdlx = (bm: string) => {
    let ret = ''
    switch (bm) {
        case '7030003':
            ret = '中'
            break
        case '7030004':
            ret = '中'
            break
        case '7030005':
            ret = '中'
            break
        case '7030006':
            ret = '西'
            break
        case '7030007':
            ret = '西'
            break
    }
    return ret
}

const api = new baTableApi('/api/v1/xtsjwh/jbxxwh/')

const getList = () => {
    api.requestData('index', {
        agrs: { page: zdlist.page, size: zdlist.size, youXiaoZT: '-1', fenLeiBM: state.flbm, keywords: state.keywords },
    }).then((res: any) => {
        state.zdListData = res.data
        zdlist.count = res.count
    })
}

onMounted(() => {})

const onClose = () => {
    state.show = false
}

const onConfirm = () => {
    state.show = false
    if (zdlx.value === 1) {
        state.zdData = state.xyzdData
        emit('zdConfirm', state.zdData)
        emit('zdxz', zdlx.value)
    } else {
        state.zdData = state.zyzdData
        emit('zdConfirm', state.zdData)
        emit('zdxz', zdlx.value)
    }
}

const show = () => {
    getList()
    state.xyzdData = []
    state.zyzdData = []
    if (prop.zdxz === 1) {
        state.xyzdData = prop.lrzdList
    }
    if (prop.zdxz === 2) {
        state.zyzdData = prop.lrzdList
    }
    state.show = true
}

defineExpose({ show })
</script>

<style scoped lang="scss">
.el-form-item {
    margin-bottom: 10px;
}

:deep(.el-dialog__body) {
    min-height: 500px;
    height: 800px;
}

.zdlx-tag {
    margin-right: 6px;
    font-size: 12px;
    background-color: #7299bc;
    color: #fff;
    padding: 2px;
}

.lrzd-box {
    padding: 15px 5px;
    height: 100%;
    display: flex;
    flex-direction: row;

    .lrzd-left {
        height: 100%;
        width: 40%;

        .el-radio {
            margin-right: 20px;
        }

        .zd-list {
            height: calc(100% - 115px);
        }

        .tb-pagination {
            display: flex;
            justify-content: center;
            margin-top: 10px;
        }
    }

    .lrzd-right {
        height: 100%;
        margin-left: 15px;
        padding-left: 15px;
        border-left: 1px solid #dcdfe6;
        width: 60%;

        .yxzd-title {
            padding: 0 0 10px 0;
            font-weight: 600;
        }

        .xyzd-title {
            padding: 5px 0;
        }

        .xyzd-list {
            height: calc(50% - 50px);
        }

        .zyzd-title {
            margin-top: 10px;
            padding: 5px 0;
        }

        .zyzd-list {
            height: calc(50% - 50px);
        }
    }
}
</style>
