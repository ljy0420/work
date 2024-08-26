<template>
    <div>
        <el-dialog
        class="ba-operate-dialog"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        :model-value="['Add', 'Edit'].includes(baTable.form.operate!)"
        @close="baTable.toggleForm"
        align-center
        width="700px"
    >
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">
                {{ baTable.form.operate == 'Add' ? '系统菜单-新增' : '系统菜单-修改' }}
            </div>
        </template>
        <el-scrollbar v-loading="baTable.form.loading" class="ba-table-form-scrollbar">
            <div
                class="ba-operate-form yd-input-round"
                :class="'ba-' + baTable.form.operate + '-form'"
                :style="'width: calc(100% - ' + baTable.form.labelWidth! / 2 + 'px)'"
            >
                <el-form
                    ref="formRef"
                    :model="baTable.form.items"
                    label-position="right"
                    :label-width="baTable.form.labelWidth + 'px'"
                    :rules="rules"
                    v-if="!baTable.form.loading"
                >
                    <!-- <FormItem
                        type="remoteSelect"
                        prop="pid"
                        label="上级菜单"
                        v-model="baTable.form.items!.pid"
                        placeholder="点击选择"
                        :input-attr="{
                            params: { isTree: true },
                            field: 'title',
                            'remote-url': '/api/v1/xtsjwh/xtcdwh/tree',
                        }"
                    /> -->
                    <el-form-item prop="pid" label="上级菜单">
                        <el-tree-select 
                        v-model="baTable.form.items!.pid"
                        :data="state.menus"
                        check-strictly
                        filterable
                        clearable
                        :render-after-expand="false"
                        :default-expand-all="true"
                        :props="{label:'title',value:'id'}"
                        style="width: 100%;"
                        >
                        </el-tree-select>
                    </el-form-item>
                    <FormItem
                        label="功能类型"
                        v-model="baTable.form.items!.type"
                        type="radio"
                        :data="{
                            content: { menu_dir: '模块', menu: '菜单', button: '按钮' },
                            childrenAttr: { border: true }
                        }"
                        :input-attr="{ onChange: typeChange }"
                    />
                    <el-form-item prop="title" label="菜单名称">
                        <el-input
                            v-model="baTable.form.items!.title"
                            type="string"
                            placeholder="请输入菜单名称"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="name" label="路由名称">
                        <el-input
                            v-model="baTable.form.items!.name"
                            type="string"
                            placeholder="请输入路由名称"
                        ></el-input>
                    </el-form-item>
                    <el-form-item v-if="baTable.form.items!.type != 'button'" label="路由路径">
                        <el-input
                            v-model="baTable.form.items!.path"
                            type="string"
                            placeholder="请输入路由路径"
                        ></el-input>
                    </el-form-item>
                    <FormItem
                        v-if="baTable.form.operate && baTable.form.items!.type != 'button'"
                        type="icon"
                        label="菜单图标"
                        v-model="baTable.form.items!.icon"
                        :input-attr="{ 'show-icon-name': true }"
                    />
                    <el-form-item v-if="baTable.form.operate && baTable.form.items!.type != 'button'" label="PNG图标">
                        <el-input
                            v-model="baTable.form.items!.imgurl"
                            type="string"
                            placeholder="请输入PNG图标路径"
                        ></el-input>
                    </el-form-item>
                    <FormItem
                        v-if="baTable.form.items!.type == 'menu'"
                        label="菜单类型"
                        v-model="baTable.form.items!.menu_type"
                        type="radio"
                        :data="{
                            content: { tab: '选项卡', link: '链接', iframe: 'Iframe' },
                            childrenAttr: { border: true },
                        }"
                    />
                    <el-form-item
                        prop="url"
                        v-if="baTable.form.items!.menu_type != 'tab' && baTable.form.items!.type != 'button'"
                        label="链接地址"
                    >
                        <el-input
                            v-model="baTable.form.items!.url"
                            type="string"
                            placeholder="请输入链接地址"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                        v-if="baTable.form.items!.type == 'menu' && baTable.form.items!.menu_type == 'tab'"
                        label="前端组件"
                    >
                        <el-input
                            v-model="baTable.form.items!.component"
                            type="string"
                            placeholder="请输入组件路径(.vue文件)"
                        ></el-input>
                    </el-form-item>
                    <FormItem
                        label="在菜单中隐藏"
                        v-model="baTable.form.items!.hide_in_menu"
                        type="radio"
                        :data="{
                            content: { false: '否', true: '是' },
                            childrenAttr: { border: true },
                        }"
                    />
                    <FormItem
                        label="缓存"
                        v-model="baTable.form.items!.keepalive"
                        type="radio"
                        :data="{
                            content: { 0: '禁用', 1: '启用' },
                            childrenAttr: { border: true },
                        }"
                    />
                    <FormItem
                        label="状态"
                        v-model="baTable.form.items!.status"
                        type="radio"
                        :data="{
                            content: { '0': '禁用', '1': '启用' },
                            childrenAttr: { border: true },
                        }"
                    />
                </el-form>
            </div>
        </el-scrollbar>
        <template #footer>
            <div class="yd-from-footer">
                <el-button v-blur :loading="baTable.form.submitLoading" @click="baTable.onSubmit(formRef)" type="primary" class="btn-form-save">
                    {{ baTable.form.operateIds && baTable.form.operateIds.length > 1 ? '保存并编辑下一条' : '保存' }}
                </el-button>
                <el-button @click="baTable.toggleForm('')" class="btn-form-cancel">取消</el-button>
            </div>
        </template>
    </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, inject } from 'vue'
import type baTableClass from '/@/utils/baTable'
import FormItem from '/@/components/formItem/index.vue'
import { buildValidatorData } from '/@/utils/validate'
import type { FormInstance, FormItemRule } from 'element-plus'
import { getParentMenus } from '/@/api/backend/xtgl/xtcd'

const formRef = ref<FormInstance>()
const baTable = inject('baTable') as baTableClass

const state: {
    menus: any
} = reactive({
    menus: []
})

const typeChange = (value: any) => {
    if(value !='menu') {
        baTable.form.items!.menu_type = ''
    } else {
        baTable.form.items!.menu_type = 'tab'
    }
}

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    title: [buildValidatorData({ name: 'required', message: '菜单名称不能为空.' })],
    name: [buildValidatorData({ name: 'required', message: '路由名称不能为空.' })],
    url: [buildValidatorData({ name: 'url', message: '请确认url是否正确' })],
    pid: [
        {
            validator: (rule: any, val: string, callback: Function) => {
                if (!val) {
                    return callback()
                }
                if (parseInt(val) == parseInt(baTable.form.items!.id)) {
                    return callback(new Error('上级菜单不能是当前菜单'))
                }
                return callback()
            },
            trigger: 'blur',
        },
    ],
})

getParentMenus().then((res)=>{
    state.menus = res.data
})

</script>

<style scoped lang="scss">
:deep(.el-dialog__body) {
    height: 670px;
}
</style>
