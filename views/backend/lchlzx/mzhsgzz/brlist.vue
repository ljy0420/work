<template>
    <div class="br-list-box">
        <div class="br-filter">
            <el-input v-model="state.keywords" placeholder="请输入文字(支持模糊搜索)">
                <template #suffix>
                    <Icon name="local-find" color="#409eff" />
                </template>
            </el-input>
        </div>
        <div class="br-container">
            <el-table
                v-loading="state.loading"
                class="ba-data-table w100"
                header-cell-class-name="table-header-cell"
                :data="state.hzListData"
                highlight-current-row
                height="100%"
                @current-change="currentChange"
            >
                <el-table-column prop="LGZT" width="40" />
                <el-table-column prop="ZT" label="执行状态" width="80" />
                <el-table-column prop="BLH" label="门诊病历号" width="120" />
                <el-table-column prop="XM" label="病人姓名" width="80" />
                <el-table-column prop="XB" label="性别" width="70" />
                <el-table-column prop="NL" label="年龄" width="80" />
                <el-table-column prop="KSMC" label="科室名称" width="100" />
                <el-table-column prop="GHSJ" label="挂号时间" width="180" />
            </el-table>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'

const emit = defineEmits(['rowChange'])
const state: {
    loading: boolean
    keywords: string
    hzListData: any
} = reactive({
    loading: false,
    keywords: '',
    hzListData: [
        {
            XM: '张三',
            HY: '线上',
            GHSJ: '2024-03-07 09:43:34',
            GHLX: '主任门诊',
            BLH: '2023112256',
            XB: '男',
            NL: '23岁',
            ZJHM: '430456200001011356',
            DHHM: '13125444586',
            RYLB: '医保居民',
            MZ: '汉族',
            ZZ: '湖南省长沙市岳麓区XXX街道XXX路100号',
            GMS: '青霉素过敏',
            ZD: 'XXXXXXXXXXXXXXXXXX',
            CSRQ: '2000.01.01',
            KSMC: '中医科',
            ZT: '未执行',
            LGZT: '留',
        },
        {
            XM: '李四',
            HY: '线上',
            GHSJ: '2024-01-10 14:19:38',
            GHLX: '主任门诊',
            BLH: '2023112257',
            XB: '男',
            NL: '22岁',
            ZJHM: '430456200101011356',
            DHHM: '13125444586',
            RYLB: '医保居民',
            MZ: '汉族',
            ZZ: '湖南省长沙市岳麓区XXX街道XXX路101号',
            GMS: '青霉素过敏',
            ZD: 'XXXXXXXXXXXXXXXXXX',
            CSRQ: '2001.01.01',
            KSMC: '中医科',
            ZT: '未执行',
            LGZT: '',
        },
        {
            XM: '王五',
            HY: '线上',
            GHSJ: '2023-11-29 10:45:57',
            GHLX: '主任门诊',
            BLH: '2023112258',
            XB: '男',
            NL: '21岁',
            ZJHM: '430456200201011356',
            DHHM: '13125444586',
            RYLB: '医保居民',
            MZ: '汉族',
            ZZ: '湖南省长沙市岳麓区XXX街道XXX路102号',
            GMS: '青霉素过敏',
            ZD: 'XXXXXXXXXXXXXXXXXX',
            CSRQ: '2002.01.01',
            KSMC: '中医科',
            ZT: '未执行',
            LGZT: '',
        },
        {
            XM: '李四',
            HY: '线上',
            GHSJ: '2023-11-23 09:34:30',
            GHLX: '主任门诊',
            BLH: '2023112259',
            XB: '男',
            NL: '20岁',
            ZJHM: '430456200301011356',
            DHHM: '13125444586',
            RYLB: '医保居民',
            MZ: '汉族',
            ZZ: '湖南省长沙市岳麓区XXX街道XXX路103号',
            GMS: '青霉素过敏',
            ZD: 'XXXXXXXXXXXXXXXXXX',
            CSRQ: '2003.01.01',
            KSMC: '中医科',
            ZT: '已执行',
            LGZT: '',
        },
        {
            XM: '王五',
            HY: '线上',
            GHSJ: '2023-11-15 10:01:11',
            GHLX: '主任门诊',
            BLH: '2023112260',
            XB: '男',
            NL: '21岁',
            ZJHM: '430456200201011356',
            DHHM: '13125444586',
            RYLB: '医保居民',
            MZ: '汉族',
            ZZ: '湖南省长沙市岳麓区XXX街道XXX路104号',
            GMS: '青霉素过敏',
            ZD: 'XXXXXXXXXXXXXXXXXX',
            CSRQ: '2002.01.01',
            KSMC: '中医科',
            ZT: '未执行',
            LGZT: '',
        },
        {
            XM: '李四',
            HY: '线上',
            GHSJ: '2023-06-30 08:42:35',
            GHLX: '主任门诊',
            BLH: '2023112261',
            XB: '男',
            NL: '21岁',
            ZJHM: '430456200201011356',
            DHHM: '13125444586',
            RYLB: '医保居民',
            MZ: '汉族',
            ZZ: '湖南省长沙市岳麓区XXX街道XXX路105号',
            GMS: '青霉素过敏',
            ZD: 'XXXXXXXXXXXXXXXXXX',
            CSRQ: '2002.01.01',
            KSMC: '中医科',
            ZT: '未执行',
            LGZT: '',
        },
        {
            XM: '王五',
            HY: '线上',
            GHSJ: '2023-06-29 08:11:05',
            GHLX: '主任门诊',
            BLH: '2023112262',
            XB: '男',
            NL: '21岁',
            ZJHM: '430456200201011356',
            DHHM: '13125444586',
            RYLB: '医保居民',
            MZ: '汉族',
            ZZ: '湖南省长沙市岳麓区XXX街道XXX路106号',
            GMS: '青霉素过敏',
            ZD: 'XXXXXXXXXXXXXXXXXX',
            CSRQ: '2002.01.01',
            KSMC: '针灸推拿科',
            ZT: '已执行',
            LGZT: '',
        },
        {
            XM: '李四',
            HY: '线上',
            GHSJ: '2023-06-28 14:40:39',
            GHLX: '主任门诊',
            BLH: '2023112263',
            XB: '男',
            NL: '21岁',
            ZJHM: '430456200201011356',
            DHHM: '13125444586',
            RYLB: '医保居民',
            MZ: '汉族',
            ZZ: '湖南省长沙市岳麓区XXX街道XXX路107号',
            GMS: '青霉素过敏',
            ZD: 'XXXXXXXXXXXXXXXXXX',
            CSRQ: '2002.01.01',
            KSMC: '针灸推拿科',
            ZT: '已执行',
            LGZT: '',
        },
        {
            XM: '王五',
            HY: '线上',
            GHSJ: '2023-06-28 14:40:39',
            GHLX: '主任门诊',
            BLH: '2023112264',
            XB: '男',
            NL: '21岁',
            ZJHM: '430456200201011356',
            DHHM: '13125444586',
            RYLB: '医保居民',
            MZ: '汉族',
            ZZ: '湖南省长沙市岳麓区XXX街道XXX路108号',
            GMS: '青霉素过敏',
            ZD: 'XXXXXXXXXXXXXXXXXX',
            CSRQ: '2002.01.01',
            KSMC: '针灸推拿科',
            ZT: '已执行',
            LGZT: '',
        },
    ],
})

const currentChange = (row: any) => {
    emit('rowChange', row)
}

onMounted(() => {
    state.loading = true
    setTimeout(() => {
        state.loading = false
    }, 1000)
})
</script>

<style lang="scss" scoped>
.br-list-box {
    display: flex;
    flex-direction: column;
    position: relative;
    height: 100%;

    .br-container {
        height: calc(100% - 40px);
        margin-top: 10px;
        :deep(.el-table__body-wrapper tr td:first-child) {
            color: red;
        }
    }
}
</style>
