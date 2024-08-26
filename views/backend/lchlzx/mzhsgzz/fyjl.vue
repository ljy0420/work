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
                        <el-button type="text" plain>
                            <Icon name="local-fyqd" />
                            <span class="operate-text">费用清单</span>
                        </el-button>
                    </div>
                    <span class="top-text">共十四条收费明细，总金额388.74元</span>
                </div>
                <div class="mz-home-body">
                    <div>
                        <el-table
                            ref="tableRef"
                            :data="state.tableData"
                            highlight-current-row
                            @selection-change="onSelectionChange"
                            style="width: 100%"
                            class="ba-data-table w100"
                            header-cell-class-name="table-header-cell"
                        >
                            <el-table-column prop="FPH" label="发票号" width="80" />
                            <el-table-column prop="LSM" label="流水码" width="90"></el-table-column>
                            <el-table-column prop="XMBM" label="项目编码" width="160"> </el-table-column>
                            <el-table-column prop="XMMC" label="项目名称" width="340" />
                            <el-table-column prop="GG" label="规格" width="100" />
                            <el-table-column prop="DJ" label="单价" width="70" />
                            <el-table-column prop="ZL" label="总量" width="60" />
                            <el-table-column prop="ZJE" label="总金额" width="70" />
                            <el-table-column prop="FYBZ" label="发药标志" width="80" />
                            <el-table-column prop="FYDH" label="发药单号" width="80" />
                            <el-table-column prop="TYBZ" label="退药标志" width="80" />
                            <el-table-column prop="SQDID" label="申请单ID" width="110" />
                            <el-table-column prop="DWMC" label="DWMC" width="80" />
                            <el-table-column prop="PCH" label="PCH" width="110" />
                        </el-table>
                    </div>
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
const props = defineProps(['tab'])

const state: {
    loading: boolean
    tableData: any
} = reactive({
    loading: false,
    tableData: [
        {
            FPH: '2003090',
            LSM: '6792977',
            XMBM: '1700314000000552',
            XMMC: '一天三餐套餐',
            GG: '',
            DJ: '30',
            ZL: '1',
            ZJE: '30',
            FYBZ: '否',
            FYDH: '0',
            TYBZ: '',
            SQDID: '0000889680',
            DWMC: '天',
            PCH: '',
        },
        {
            FPH: '2003090',
            LSM: '6792982',
            XMBM: '015411',
            XMMC: '骨保灵颗粒',
            GG: '',
            DJ: '48.10',
            ZL: '2',
            ZJE: '96.20',
            FYBZ: '是',
            FYDH: '209',
            TYBZ: '',
            SQDID: '0000889679',
            DWMC: '片',
            PCH: '0000000019',
        },
        {
            FPH: '2003090',
            LSM: '6792984',
            XMBM: '02121',
            XMMC: '葡萄糖注射液',
            GG: '200ml',
            DJ: '10',
            ZL: '15',
            ZJE: '150',
            FYBZ: '是',
            FYDH: '209',
            TYBZ: '',
            SQDID: '',
            DWMC: '200ml',
            PCH: '0000000024',
        },
        {
            FPH: '2003090',
            LSM: '6792985',
            XMBM: '02121',
            XMMC: '葡萄糖注射液(皮试)',
            GG: '200ml',
            DJ: '10',
            ZL: '0',
            ZJE: '0',
            FYBZ: '是',
            FYDH: '209',
            TYBZ: '',
            SQDID: '',
            DWMC: '200ml',
            PCH: '0000000024',
        },
        {
            FPH: '2003090',
            LSM: '6792986',
            XMBM: '02121',
            XMMC: '葡萄糖注射液',
            GG: '',
            DJ: '10',
            ZL: '1',
            ZJE: '10',
            FYBZ: '是',
            FYDH: '209',
            TYBZ: '',
            SQDID: '0000889681',
            DWMC: '200ml',
            PCH: '0000000024',
        },
        {
            FPH: '2003090',
            LSM: '6792980',
            XMBM: '170314000000546',
            XMMC: '钢丝',
            GG: '',
            DJ: '12',
            ZL: '1',
            ZJE: '12',
            FYBZ: '否',
            FYDH: '0',
            TYBZ: '',
            SQDID: '0000889681',
            DWMC: '圈',
            PCH: '',
        },
        {
            FPH: '2003090',
            LSM: '6792987',
            XMBM: '170620000000446',
            XMMC: '非吸收缝合线',
            GG: '',
            DJ: '5.18',
            ZL: '1',
            ZJE: '5.18',
            FYBZ: '否',
            FYDH: '0',
            TYBZ: '',
            SQDID: '0000889679',
            DWMC: '束',
            PCH: '',
        },
        {
            FPH: '2003091',
            LSM: '6792990',
            XMBM: '4B0102',
            XMMC: '保和丸',
            GG: '9g*10丸（大蜜丸）',
            DJ: '1.0250',
            ZL: '1',
            ZJE: '1.03',
            FYBZ: '是',
            FYDH: '216',
            TYBZ: '',
            SQDID: '',
            DWMC: '片',
            PCH: '0000000046',
        },
        {
            FPH: '2003090',
            LSM: '6792979',
            XMBM: '180923',
            XMMC: '一次性注射器',
            GG: '',
            DJ: '10',
            ZL: '2',
            ZJE: '20',
            FYBZ: '是',
            FYDH: '209',
            TYBZ: '',
            SQDID: '0000889680',
            DWMC: '支',
            PCH: '0000000054',
        },
        {
            FPH: '2003090',
            LSM: '6792975',
            XMBM: '011091',
            XMMC: '拔甲治疗',
            GG: '',
            DJ: '20',
            ZL: '1',
            ZJE: '20',
            FYBZ: '否',
            FYDH: '0',
            TYBZ: '',
            SQDID: '0000889679',
            DWMC: '次',
            PCH: '',
        },
        {
            FPH: '2003090',
            LSM: '6792983',
            XMBM: '161224000000102',
            XMMC: '鱼腥草',
            GG: '',
            DJ: '3.58',
            ZL: '1',
            ZJE: '3.58',
            FYBZ: '否',
            FYDH: '0',
            TYBZ: '',
            SQDID: '0000889680',
            DWMC: '克',
            PCH: '0000000012',
        },
        {
            FPH: '2003090',
            LSM: '6792976',
            XMBM: 'asdadsadasdasda',
            XMMC: '测试套餐-肝',
            GG: '',
            DJ: '25',
            ZL: '1',
            ZJE: '25',
            FYBZ: '否',
            FYDH: '0',
            TYBZ: '',
            SQDID: '0000889680',
            DWMC: '元/次',
            PCH: '',
        },
        {
            FPH: '2003090',
            LSM: '6792978',
            XMBM: '161255000000041',
            XMMC: '丙型肝炎抗体测定(Anti-HCV)',
            GG: '',
            DJ: '9',
            ZL: '1',
            ZJE: '9',
            FYBZ: '否',
            FYDH: '0',
            TYBZ: '',
            SQDID: '0000889681',
            DWMC: '次',
            PCH: '',
        },
        {
            FPH: '2003090',
            LSM: '6792981',
            XMBM: '190922000002010',
            XMMC: 'C—反应蛋白测定(CRP)_各种免疫学方法、单扩法',
            GG: '',
            DJ: '6.75',
            ZL: '1',
            ZJE: '6.75',
            FYBZ: '否',
            FYDH: '0',
            TYBZ: '',
            SQDID: '0000889681',
            DWMC: '次',
            PCH: '',
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
            .top-text {
                float: right;
                color: red;
                font-weight: bold;
                font-size: 14px;
            }
        }
        .mz-home-body {
            flex-grow: 1;
            width: 100%;
            margin-top: 10px;
        }
    }
}
.expand-icon {
    transform: rotate(180deg);
}
</style>
