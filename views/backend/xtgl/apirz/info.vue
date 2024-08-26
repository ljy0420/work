<template>
    <!-- 查看详情 -->
    <el-dialog class="ba-operate-dialog" :model-value="baTable.form.operate ? true : false" @close="baTable.toggleForm">
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">API日志详情</div>
        </template>
        <el-scrollbar v-loading="baTable.form.loading" class="ba-table-form-scrollbar">
            <div class="ba-operate-form" :class="'ba-' + baTable.form.operate + '-form'">
                <el-descriptions :column="2" border>
                    <el-descriptions-item label="操作员编码">
                        {{ baTable.form.extend!.info.CZYBM }}
                    </el-descriptions-item>
                    <el-descriptions-item label="操作员名称">
                        {{ baTable.form.extend!.info.CZYMC }}
                    </el-descriptions-item>
                    <el-descriptions-item label="操作名称">
                        {{ baTable.form.extend!.info.CZMC }}
                    </el-descriptions-item>
                    <el-descriptions-item label="IP地址">
                        {{ baTable.form.extend!.info.IP }}
                    </el-descriptions-item>
                    <el-descriptions-item :width="120" :span="2" label="API地址">
                        {{ baTable.form.extend!.info.URL }}
                    </el-descriptions-item>
                    <el-descriptions-item :width="120" :span="2" label="User Agent">
                        {{ baTable.form.extend!.info.USERAGENT }}
                    </el-descriptions-item>
                    <el-descriptions-item label="操作时间">
                        {{ timeFormat(baTable.form.extend!.info.CJSJ) }}
                    </el-descriptions-item>
                    <el-descriptions-item label="状态码">
                        {{ baTable.form.extend!.info.CODE }}
                    </el-descriptions-item>
                    <el-descriptions-item :width="120" :span="2" label="请求参数">
                        <el-tree class="table-el-tree" :data="baTable.form.extend!.info.PARAM" :props="{ label: 'label', children: 'children' }" />
                    </el-descriptions-item>
                    <el-descriptions-item v-if="baTable.form.extend!.info.CODE!=1" :width="120" :span="2" label="异常信息">
                        {{ baTable.form.extend!.info.ERROR }}
                    </el-descriptions-item>
                </el-descriptions>
            </div>
        </el-scrollbar>
    </el-dialog>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import type BaTable from '/@/utils/baTable'
import { timeFormat } from '/@/utils/common'

const baTable = inject('baTable') as BaTable

</script>

<style scoped lang="scss">
.table-el-tree {
    :deep(.el-tree-node) {
        white-space: unset;
    }
    :deep(.el-tree-node__content) {
        display: block;
        align-items: unset;
        height: unset;
    }
}
</style>
