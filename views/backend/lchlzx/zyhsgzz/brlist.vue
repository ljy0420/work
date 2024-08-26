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
            <el-table v-loading="state.loading" class="ba-data-table w100" header-cell-class-name="table-header-cell"
                :data="state.hzListData" highlight-current-row height="100%" @current-change="currentChange">
                <el-table-column prop="XM" label="姓名" width="70" />
                <el-table-column prop="HY" label="号源" width="60" />
                <el-table-column prop="YYSJ" label="预约时间" width="100" />
                <el-table-column prop="GHLX" label="挂号类型" width="90" />
                <el-table-column prop="BLH" label="病历号" width="150" />
            </el-table>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'

const emit = defineEmits(['rowChange'])
const state: {
    loading: boolean,
    keywords: string,
    hzListData: any
} = reactive({
    loading: false,
    keywords: '',
    hzListData: [
        {
            XM: '张三',
            HY: '线上',
            YYSJ: '12-24 10:30',
            GHLX: '主任门诊',
            BLH: '2023112256',
            XB: '男',
            NL: '23岁10个月',
            ZJHM: '430456200001011356',
            DHHM: '13125444586',
            RYLB: '医保居民',
            MZ: '汉族',
            ZZ: '湖南省长沙市岳麓区XXX街道XXX路100号',
            GMS: '青霉素过敏',
            ZD: 'XXXXXXXXXXXXXXXXXX',
            CSRQ: '2000.01.01'
        },
        {
            XM: '李四',
            HY: '线上',
            YYSJ: '12-24 10:40',
            GHLX: '主任门诊',
            BLH: '2023112257',
            XB: '男',
            NL: '22岁10个月',
            ZJHM: '430456200101011356',
            DHHM: '13125444586',
            RYLB: '医保居民',
            MZ: '汉族',
            ZZ: '湖南省长沙市岳麓区XXX街道XXX路101号',
            GMS: '青霉素过敏',
            ZD: 'XXXXXXXXXXXXXXXXXX',
            CSRQ: '2001.01.01'
        },
        {
            XM: '王五',
            HY: '线上',
            YYSJ: '12-24 10:50',
            GHLX: '主任门诊',
            BLH: '2023112258',
            XB: '男',
            NL: '21岁10个月',
            ZJHM: '430456200201011356',
            DHHM: '13125444586',
            RYLB: '医保居民',
            MZ: '汉族',
            ZZ: '湖南省长沙市岳麓区XXX街道XXX路102号',
            GMS: '青霉素过敏',
            ZD: 'XXXXXXXXXXXXXXXXXX',
            CSRQ: '2002.01.01'
        },
        {
            XM: '李四',
            HY: '线上',
            YYSJ: '12-24 11:00',
            GHLX: '主任门诊',
            BLH: '2023112259',
            XB: '男',
            NL: '20岁10个月',
            ZJHM: '430456200301011356',
            DHHM: '13125444586',
            RYLB: '医保居民',
            MZ: '汉族',
            ZZ: '湖南省长沙市岳麓区XXX街道XXX路103号',
            GMS: '青霉素过敏',
            ZD: 'XXXXXXXXXXXXXXXXXX',
            CSRQ: '2003.01.01'
        },
        {
            XM: '王五',
            HY: '线上',
            YYSJ: '12-24 11:10',
            GHLX: '主任门诊',
            BLH: '2023112260',
            XB: '男',
            NL: '21岁10个月',
            ZJHM: '430456200201011356',
            DHHM: '13125444586',
            RYLB: '医保居民',
            MZ: '汉族',
            ZZ: '湖南省长沙市岳麓区XXX街道XXX路104号',
            GMS: '青霉素过敏',
            ZD: 'XXXXXXXXXXXXXXXXXX',
            CSRQ: '2002.01.01'
        },
        {
            XM: '李四',
            HY: '线上',
            YYSJ: '12-24 11:20',
            GHLX: '主任门诊',
            BLH: '2023112261',
            XB: '男',
            NL: '21岁10个月',
            ZJHM: '430456200201011356',
            DHHM: '13125444586',
            RYLB: '医保居民',
            MZ: '汉族',
            ZZ: '湖南省长沙市岳麓区XXX街道XXX路105号',
            GMS: '青霉素过敏',
            ZD: 'XXXXXXXXXXXXXXXXXX',
            CSRQ: '2002.01.01'
        },
        {
            XM: '王五',
            HY: '线上',
            YYSJ: '12-24 11:30',
            GHLX: '主任门诊',
            BLH: '2023112262',
            XB: '男',
            NL: '21岁10个月',
            ZJHM: '430456200201011356',
            DHHM: '13125444586',
            RYLB: '医保居民',
            MZ: '汉族',
            ZZ: '湖南省长沙市岳麓区XXX街道XXX路106号',
            GMS: '青霉素过敏',
            ZD: 'XXXXXXXXXXXXXXXXXX',
            CSRQ: '2002.01.01'
        },
        {
            XM: '李四',
            HY: '线上',
            YYSJ: '12-24 11:40',
            GHLX: '主任门诊',
            BLH: '2023112263',
            XB: '男',
            NL: '21岁10个月',
            ZJHM: '430456200201011356',
            DHHM: '13125444586',
            RYLB: '医保居民',
            MZ: '汉族',
            ZZ: '湖南省长沙市岳麓区XXX街道XXX路107号',
            GMS: '青霉素过敏',
            ZD: 'XXXXXXXXXXXXXXXXXX',
            CSRQ: '2002.01.01'
        },
        {
            XM: '王五',
            HY: '线上',
            YYSJ: '12-24 11:50',
            GHLX: '主任门诊',
            BLH: '2023112264',
            XB: '男',
            NL: '21岁10个月',
            ZJHM: '430456200201011356',
            DHHM: '13125444586',
            RYLB: '医保居民',
            MZ: '汉族',
            ZZ: '湖南省长沙市岳麓区XXX街道XXX路108号',
            GMS: '青霉素过敏',
            ZD: 'XXXXXXXXXXXXXXXXXX',
            CSRQ: '2002.01.01'
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
    }, 1000);
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
    }
}
</style>