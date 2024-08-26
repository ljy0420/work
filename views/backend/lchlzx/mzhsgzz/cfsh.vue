<template>
    <div class="mz-home-container">
        <div class="mz-home-content">
            <el-scrollbar v-loading="state.loading">
                <div class="mz-home-top">
                    <div class="mzcf-action">
                        <el-button type="text" plain>
                            <Icon name="local-refresh" />
                            <span class="operate-text">刷新</span>
                        </el-button>
                        <el-dropdown class="button-dropdown">
                            <el-button type="text" plain>
                                <Icon name="local-print" style="margin-left: 10px" />
                                <span class="operate-text">打印</span>
                            </el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="sykBtn">输液卡</el-dropdown-item>
                                    <el-dropdown-item>治疗单</el-dropdown-item>
                                    <el-dropdown-item>瓶签</el-dropdown-item>
                                    <el-dropdown-item>病人信息卡</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                        <el-button type="text" plain>
                            <Icon name="local-sjt" />
                            <span class="operate-text">处方核对</span>
                        </el-button>

                        <el-button type="text" plain>
                            <Icon name="local-zyjt" />
                            <span class="operate-text">取消核对</span>
                        </el-button>
                        <el-button type="text" plain>
                            <Icon name="local-bjyx1" />
                            <span class="operate-text">标记阳性</span>
                        </el-button>
                        <el-button type="text" plain>
                            <Icon name="local-bjyx" />
                            <span class="operate-text">标记阴性</span>
                        </el-button>
                        <el-button type="text" plain>
                            <Icon name="local-bjwb" />
                            <span class="operate-text">脱敏</span>
                        </el-button>
                        <el-button type="text" plain>
                            <Icon name="local-bjwb" />
                            <span class="operate-text">处方执行</span>
                        </el-button>
                        <el-button type="text" plain>
                            <Icon name="local-withdraw" />
                            <span class="operate-text">取消执行</span>
                        </el-button>
                        <el-button type="text" plain>
                            <Icon name="local-bjys" />
                            <span class="operate-text">设置样式</span>
                        </el-button>
                    </div>
                </div>
                <div class="mz-home-body">
                    <div class="empty" v-if="state.cfList.length == 0">
                        <div class="empty-img"></div>
                    </div>
                    <div v-else>
                        <el-table
                            ref="tableRef"
                            :data="state.cfList"
                            highlight-current-row
                            @selection-change="onSelectionChange"
                            style="width: 100%"
                            class="ba-data-table w100"
                            header-cell-class-name="table-header-cell"
                        >
                            <el-table-column prop="ZT" width="60" />
                            <el-table-column type="selection" width="30" />
                            <el-table-column prop="CFH" label="处方号" width="80" />
                            <el-table-column prop="KSSJ" label="开始时间" width="140"></el-table-column>
                            <el-table-column prop="YZNR" label="医嘱内容" width="180"> </el-table-column>
                            <el-table-column prop="GG" label="规格" width="70" />
                            <el-table-column prop="YL" label="用量" width="100" />
                            <el-table-column prop="YF" label="用法" width="80" />
                            <el-table-column prop="PL" label="频率" width="60" />
                            <el-table-column prop="TS" label="天数" width="60" />
                            <el-table-column prop="DS" label="滴速" width="60" />
                            <el-table-column prop="ZL" label="总量" width="60" />
                            <el-table-column prop="DW" label="单位" width="80" />
                            <el-table-column prop="DJ" label="单价" width="70" />
                            <el-table-column prop="ZJE" label="总金额" width="90" />
                            <el-table-column prop="JS" label="剂数" width="60" />
                            <el-table-column prop="ZXSJ" label="执行时间" width="140" />
                            <el-table-column prop="YSZT" label="医生嘱托" width="150" />
                            <el-table-column prop="JJ" label="紧急" width="60" />
                            <el-table-column prop="JDZT" label="校对状态" width="90" />
                            <el-table-column prop="ZXZT" label="执行状态" width="90" />
                            <el-table-column prop="PSZT" label="皮试状态" width="100" />
                        </el-table>
                    </div>
                </div>
                <div class="foot">
                    <div class="jd">校对</div>
                    <div class="fsysf">发送已收费</div>
                    <div class="fswsf">发送未收费</div>
                    <div class="ytf">已退费</div>
                    <div class="yinxing">阴性</div>
                    <div class="yangxing">阳性</div>
                </div>
            </el-scrollbar>
        </div>
        <Brcflb ref="brcflbRef" />
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import Brcflb from './cfsh/brcflb.vue'
const props = defineProps(['tab'])
const brcflbRef = ref()
const state: {
    loading: boolean
    cfList: any
} = reactive({
    loading: false,
    cfList: [
        {
            ZT: '执行',
            CFH: '239642',
            KSSJ: '2024-01-10 14:20',
            YZNR: '0.8%氯化钠注射液250ml',
            GG: '250ml',
            YL: '250  ml',
            YF: '静脉输液',
            PL: 'qd',
            TS: '1',
            DS: '1',
            ZL: '1',
            DW: '瓶',
            DJ: '1.56',
            ZJE: '1.56',
            JS: '1',
            ZXSJ: '2024-01-10 14:22',
            YSZT: '',
            JJ: '否',
            JDZT: '未校对',
            ZXZT: '未执行',
            PSZT: '',
        },
        {
            ZT: '阴性',
            CFH: '240038',
            KSSJ: '2024-03-07 13:58',
            YZNR: '注射用头孢他啶1G',
            GG: '1G',
            YL: '1  g',
            YF: '鞘内封闭',
            PL: 'qd',
            TS: '1',
            DS: '1',
            ZL: '1',
            DW: '支',
            DJ: '27.43',
            ZJE: '27.43',
            JS: '1',
            ZXSJ: '',
            YSZT: '',
            JJ: '否',
            JDZT: '未校对',
            ZXZT: '未执行',
            PSZT: '',
        },
        {
            ZT: '阳性',
            CFH: '239375',
            KSSJ: '2023-11-29 10:52',
            YZNR: '葡萄糖注射液200ml(+)',
            GG: '200ml',
            YL: '0.01  200ml',
            YF: '皮试',
            PL: '',
            TS: '1',
            DS: '',
            ZL: '0',
            DW: '200ml',
            DJ: '10',
            ZJE: '0',
            JS: '1',
            ZXSJ: '',
            YSZT: '',
            JJ: '否',
            JDZT: '未校对',
            ZXZT: '未执行',
            PSZT: '',
        },
    ],
})

const form = reactive({})

const table = reactive({
    selection: [],
})

const onSelectionChange = (selection: any) => {
    table.selection = selection
}

const sykBtn = () => {
    brcflbRef.value.show()
}

watch(
    () => props.tab,
    (value) => {
        if (value === 'mzcf') {
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
.mz-home-container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    .mz-home-content {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        .mz-home-top {
            display: inline-block;
            position: relative;
            height: 50px;
            width: 100%;
            text-align: center;
            line-height: 50px;
            font-size: 20px;
            border-bottom: 3px solid #f1f1f1;
            box-sizing: border-box;
            .mzcf-action {
                float: left;
                .button-dropdown {
                    margin-top: 11px;
                    margin-right: 6px;
                }
                .button-emit {
                    width: 80px;
                    margin-left: 220px;
                }
                .svg-icon {
                    color: #59a7ff !important;
                }
                .operate-text {
                    margin-left: 6px;
                }
            }
        }
        .mz-home-body {
            flex-grow: 1;
            width: 100%;
            margin-top: 10px;
            .empty {
                margin-left: -120px;
                margin-top: 100px;
                background: #f8f8f8;
                .empty-img {
                    position: absolute;
                    margin-top: 40px;
                    margin-left: 580px;
                    height: 200px;
                    width: 200px;
                    background: url(/@/assets/images/empty-2.png) no-repeat center center/cover;
                }

                .empty-img::after {
                    content: '请新增处方';
                    position: absolute;
                    bottom: -10px;
                    left: 55px;
                    padding: 8px;
                    color: #afafaf;
                    font-size: 14px;
                }
            }
        }
        .foot {
            position: absolute;
            display: flex;
            bottom: 0;
            height: 40px;
            width: 100%;
            margin-top: 10px;
            .jd {
                margin-top: 5px;
                margin-left: 35px;
                font-size: 16px;
            }
            .jd::before {
                position: absolute;
                display: inline-block;
                content: '';
                margin-top: 2px;
                margin-left: -24px;
                width: 18px;
                height: 18px;
                background-color: #eeeeee;
            }
            .fsysf {
                margin-top: 5px;
                margin-left: 35px;
                font-size: 16px;
            }
            .fsysf::before {
                position: absolute;
                display: inline-block;
                content: '';
                margin-top: 2px;
                margin-left: -24px;
                width: 18px;
                height: 18px;
                background-color: #000000;
            }
            .fswsf {
                margin-top: 5px;
                margin-left: 35px;
                font-size: 16px;
            }
            .fswsf::before {
                position: absolute;
                display: inline-block;
                content: '';
                margin-top: 2px;
                margin-left: -24px;
                width: 18px;
                height: 18px;
                background-color: #1900ff;
            }
            .ytf {
                margin-top: 5px;
                margin-left: 35px;
                font-size: 16px;
            }
            .ytf::before {
                position: absolute;
                display: inline-block;
                content: '';
                margin-top: 2px;
                margin-left: -24px;
                width: 18px;
                height: 18px;
                background-color: #ff0000;
            }
            .yinxing {
                margin-top: 5px;
                margin-left: 35px;
                font-size: 16px;
            }
            .yinxing::before {
                position: absolute;
                display: inline-block;
                content: '';
                margin-top: 2px;
                margin-left: -24px;
                width: 18px;
                height: 18px;
                background-color: #09ff00;
            }
            .yangxing {
                margin-top: 5px;
                margin-left: 35px;
                font-size: 16px;
            }
            .yangxing::before {
                position: absolute;
                display: inline-block;
                content: '';
                margin-top: 2px;
                margin-left: -24px;
                width: 18px;
                height: 18px;
                background-color: #8c00ff;
            }
        }
    }
}
.expand-icon {
    transform: rotate(180deg);
}
</style>
