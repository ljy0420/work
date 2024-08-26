<template>
    <div class="layout-box">
        <h3>测试</h3>
        <div>
            <el-button @click="selectYp">选择药品</el-button>
        </div>
        <div>
            <el-select v-model="state.KFBM" placeholder="请选择药房" clearable>
                <el-option v-for="opt in state.kfArr" :key="opt.BM" :label="opt.MC" :value="opt.BM"></el-option>
            </el-select>
        </div>
        <div>
            <el-table class="ba-data-table w100" :data="state.ypData" border height="200px">
                <el-table-column prop="YPBM" label="编码" width="130">
                </el-table-column>
                <el-table-column prop="YPMC" label="名称" width="200">
                    <template #default="scope">
                        <SelectYpxx v-model="scope.row.YPMC" :agrs="scope.row"
                            :conditions="{ KFBM: state.KFBM, YWLX: '药品字典' }" :remote-search="false" @choice="onChoice2" />
                    </template>
                </el-table-column>
                <el-table-column prop="BZ" label="备注" width="130">
                </el-table-column>
                <el-table-column prop="SFXM" label="收费项目" width="130">
                    <template #default="scope">
                        <SelectSfxm v-model="scope.row.SFXM" :agrs="scope.row" @choice="onChoice3" />
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import SelectYpxx from '/@/components/ykzx/select-ypxx.vue'
import SelectSfxm from '/@/components/selectext/select-sfxm.vue'
import { useRouter } from 'vue-router'

defineOptions({
    name: 'test/demo',
})

const router = useRouter()

const state: {
    selectYp: boolean,
    keywords: string,
    kfArr: any,
    KFBM: string,
    ypData: any
} = reactive({
    selectYp: false,
    keywords: '',
    kfArr: [
        { MC: '成药库', BM: '000287' },
        { MC: '药库', BM: '000154' }
    ],
    KFBM: '',
    ypData: [
        {
            YPBM: '123',
            YPMC: '测试1',
            BZ: '',
            SFXM: ''
        },
        {
            YPBM: '121',
            YPMC: '测试2',
            BZ: '',
            SFXM: ''
        }
    ]
})

const onChoice2 = (row: any, agrs: any) => {
    console.log(row)
    state.selectYp = false
    agrs.YPBM = row.YPBM
    agrs.YPMC = row.YPMC
}

const onChoice3 = (row: any, agrs: any) => {
    agrs.SFXM = row.XMMC
}

onMounted(() => {

})

const selectYp = () => {
    state.KFBM = '000287'
    state.selectYp = true
}

</script>

<style lang="scss" scoped>
.layout-box {
    margin: 6px;
    background-color: #fff;
    padding: 20px;
    height: calc(100vh - 100px);
}
</style>