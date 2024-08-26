<template>
    <div class="jysq-container" v-loading="state.loading">
        <div class="jysq-action">
            <el-button type="text" plain @click="addNew">
                <Icon name="local-create" />
                <span class="operate-text">新增检验</span>
            </el-button>
            <el-button type="text" plain @click="history">
                <Icon name="local-history" />
                <span class="operate-text">调用历史检验</span>
            </el-button>
            <el-button type="text" plain @click="look">
                <Icon name="local-look" />
                <span class="operate-text">查看结果</span>
            </el-button>
            <el-button type="text" plain @click="jyjgbd">
                <Icon name="local-compare" />
                <span class="operate-text">检验结果对比</span>
            </el-button>
        </div>
        <div v-if="state.isempty" class="jysq-empty">
            <div class="empty-box">
                <div class="empty-img"></div>
                <div class="empty-action">
                    <el-button type="primary" size="large">
                        <Icon name="local-create" />
                        <span class="operate-text">新增检验</span>
                    </el-button>
                    <el-button type="primary" size="large" @click="history">
                        <Icon name="local-history" />
                        <span class="operate-text">调用历史检验</span>
                    </el-button>
                </div>
            </div>
        </div>
        <div v-else class="jysq-box">
            <el-table class="ba-data-table w100" header-cell-class-name="table-header-cell" :data="state.jysqData" :default-expand-all="true">
                <el-table-column label="NO" type="expand" width="50">
                    <template #default="scope">
                        <el-table class="ba-data-table w100" header-cell-class-name="table-header-cell" :data="scope.row.XM" :show-header="false">
                            <el-table-column label="NO" type="index" width="50" align="center" />
                            <el-table-column prop="XMMC" label="项目名称" :show-overflow-tooltip="true" />
                            <el-table-column prop="ZXKS" label="执行科室" width="150" :show-overflow-tooltip="true" />
                            <el-table-column prop="JJ" label="加急" width="100" :show-overflow-tooltip="true"> </el-table-column>
                            <el-table-column prop="BZ" label="备注" width="150" :show-overflow-tooltip="true" />
                            <el-table-column prop="JE" label="金额(元)" width="150" :show-overflow-tooltip="true" />
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column prop="XMMC" label="项目名称" :show-overflow-tooltip="true">
                    <template #default="scope">
                        <div class="title-xmmc">{{ scope.row.XMMC }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="ZXKS" label="执行科室" width="150" :show-overflow-tooltip="true" />
                <el-table-column prop="JJ" label="加急" width="100" :show-overflow-tooltip="true" />
                <el-table-column prop="BZ" label="备注" width="150" :show-overflow-tooltip="true" />
                <el-table-column prop="JE" label="金额(元)" width="150" :show-overflow-tooltip="true" />
            </el-table>
            <div class="summary">小计：600元</div>
        </div>
        <JysqAdd ref="jysqAddRef" :jysqData="props.jysqData" />
        <JysqHistory ref="flag" />
        <JysqLook ref="flag1" />
        <JysqComparison ref="flag2" />
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import JysqAdd from './jysq/jysq-add.vue'
import JysqHistory from './jysq/jysq-history.vue'
import JysqLook from './jysq/jysq-look.vue'
import JysqComparison from './jysq/jysq-comparison.vue'
const props = defineProps(['tab', 'jysqData'])

const jysqAddRef = ref()
const flag = ref()
const flag1 = ref()
const flag2 = ref()
const state: {
    loading: boolean
    isempty: boolean
    jysqData: any
} = reactive({
    loading: false,
    isempty: false,
    jysqData: [
        {
            XMMC: '分类1',
            XM: [
                {
                    XMMC: '免疫组化',
                    ZXKS: '检验室',
                    BBBW: '血液',
                    JJ: '加急',
                    BZ: '备注备注一下',
                    JE: '200',
                },
                {
                    XMMC: '免疫组化',
                    ZXKS: '检验室',
                    BBBW: '血液',
                    JJ: '加急',
                    BZ: '备注备注一下',
                    JE: '200',
                },
            ],
        },
        {
            XMMC: '分类2',
            XM: [
                {
                    XMMC: '免疫组化',
                    ZXKS: '检验室',
                    BBBW: '血液',
                    JJ: '加急',
                    BZ: '备注备注一下',
                    JE: '200',
                },
            ],
        },
    ],
})

const addNew = () => {
    jysqAddRef.value.show()
}

const history = () => {
    flag.value.show()
}

const look = () => {
    flag1.value.show()
}

const jyjgbd = () => {
    flag2.value.show()
}

watch(
    () => props.tab,
    (value) => {
        if (value === 'jysq') {
            state.loading = true
            setTimeout(() => {
                state.loading = false
            }, 1000)
        }
    }
)

onMounted(() => {})
</script>
<style lang="scss" scoped>
.jysq-container {
    height: 100%;
    display: flex;
    flex-direction: column;

    .operate-text {
        margin-left: 6px;
    }

    .jysq-action {
        display: inline-block;

        .svg-icon {
            color: #59a7ff !important;
        }
    }

    .jysq-empty {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .empty-box {
            width: 60%;
            padding: 50px 30px 20px 30px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border: 2px dashed #f1f1f1;
            border-radius: 30px;

            .empty-img {
                height: 300px;
                width: 300px;
                background: url(/@/assets/images/jysq-cover.png) no-repeat center center/cover;
            }

            .empty-action {
                padding: 30px 60px;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;

                .el-button {
                    border-radius: 20px;
                    width: 170px;
                }

                .el-button:nth-child(1) {
                    margin-right: 60px;
                }

                .svg-icon {
                    color: #fff !important;
                }
            }
        }
    }

    .jysq-box {
        .title-xmmc {
            color: #000;
            font-weight: 600;
        }
        :deep(.el-table__expanded-cell) {
            padding: 0;
        }
        :deep(.el-table__expand-icon) {
            display: none;
        }
        .summary {
            padding: 10px 5px;
            font-weight: 600;
            text-align: right;
        }
    }
}
</style>
