<template>
    <div class="jcsq-container" v-loading="state.loading">
        检查申请
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'

const props = defineProps(['tab'])
const state: {
    loading: boolean
} = reactive({
    loading: false
})

watch(
    () => props.tab,
    (value) => {
        if (value === 'jcsq') {
            state.loading = true
            setTimeout(() => {
                state.loading = false
            }, 1000);
        }
    }
)

onMounted(() => { 

})
</script>
<style lang="scss" scoped>
.jcsq-container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}
</style>