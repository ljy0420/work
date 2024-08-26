<template>
    <div class="jcsq-container" v-loading="state.loading">
        <div class="jcsq-action">
            <el-button type="text" plain @click="addjcsq">
                <Icon name="local-create" />
                <span class="operate-text">新增检查</span>
            </el-button>
            <el-button type="text" plain @click="history">
                <Icon name="local-history" />
                <span class="operate-text">调用历史检查</span>
            </el-button>
            <el-button type="text" plain @click="look">
                <Icon name="local-look" />
                <span class="operate-text">查看结果</span>
            </el-button>
        </div>
        <div v-if="state.isempty" class="jcsq-empty">
            <div class="empty-box">
                <div class="empty-img"></div>
                <div class="empty-action">
                    <el-button type="primary" size="large" @click="addjcsq">
                        <Icon name="local-create" />
                        <span class="operate-text">新增检查</span>
                    </el-button>
                    <el-button type="primary" size="large" @click="history">
                        <Icon name="local-history" />
                        <span class="operate-text">调用历史检查</span>
                    </el-button>
                </div>
            </div>
        </div>
        <div v-else class="jcsq-box">
            <el-table class="ba-data-table w100" header-cell-class-name="table-header-cell" :data="state.jcsqData" :default-expand-all="true">
                <el-table-column label="NO" type="expand" width="50">
                    <template #default="scope">
                        <el-table class="ba-data-table w100" header-cell-class-name="table-header-cell" :data="scope.row.XM" :show-header="false">
                            <el-table-column label="NO" type="index" width="50" align="center" />
                            <el-table-column prop="YZNR" label="医嘱内容" :show-overflow-tooltip="true" />
                            <el-table-column prop="ZXKS" label="执行科室" width="150" :show-overflow-tooltip="true" />
                            <el-table-column prop="JJ" label="加急" width="100" :show-overflow-tooltip="true"> </el-table-column>
                            <el-table-column prop="JE" label="金额(元)" width="150" :show-overflow-tooltip="true" />
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column prop="XMMC" label="医嘱内容" :show-overflow-tooltip="true">
                    <template #default="scope">
                        <div class="title-xmmc">{{ scope.row.XMMC }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="ZXKS" label="执行科室" width="150" :show-overflow-tooltip="true" />
                <el-table-column prop="JJ" label="加急" width="100" :show-overflow-tooltip="true" />
                <el-table-column prop="JE" label="金额(元)" width="150" :show-overflow-tooltip="true" />
            </el-table>
            <div class="summary">小计：350元</div>
        </div>
        <Addjcsq ref="flag" :jcsqData="props.jcsqData" />
        <jcsqHistory ref="flag1" />
        <lookJcsq ref="flag2" />
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import Addjcsq from './jcsq/jcsq-add.vue'
import jcsqHistory from './jcsq/jcsq-history.vue'
import lookJcsq from './jcsq/jcsq-look.vue'
const props = defineProps(['tab', 'jcsqData'])
const flag = ref()
const flag1 = ref()
const flag2 = ref()

const state: {
    loading: boolean
    isempty: boolean
    jcsqData: any
} = reactive({
    loading: false,
    isempty: false,
    jcsqData: [
        {
            XMMC: '彩超申请单',
            XM: [
                {
                    YZNR: '胸部常规多普勒常规检查',
                    ZXKS: '彩超室',
                    JJ: '加急',
                    JE: '200',
                },
                {
                    YZNR: '多普勒常规',
                    ZXKS: '彩超室',
                    JJ: '加急',
                    JE: '150',
                },
            ],
        },
        {
            XMMC: 'CT申请单',
            XM: [
                {
                    YZNR: '参考文字',
                },
            ],
        },
    ],
})

const addjcsq = () => {
    flag.value.show()
}

const history = () => {
    flag1.value.show()
}

const look = () => {
    flag2.value.show()
}

watch(
    () => props.tab,
    (value) => {
        if (value === 'jcsq') {
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
.jcsq-container {
    height: 100%;
    display: flex;
    flex-direction: column;

    .operate-text {
        margin-left: 6px;
    }

    .jcsq-action {
        padding: 5px 0;

        .svg-icon {
            color: #59a7ff !important;
        }
    }

    .jcsq-empty {
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
                background: url(/@/assets/images/jcsq-cover.png) no-repeat center center/cover;
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

    .jcsq-box {
        margin-top: 1px;
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
