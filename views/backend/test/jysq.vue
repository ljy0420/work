<template>
    <div class="jysq-container" v-loading="state.loading">
        检验申请
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
        if (value === 'jysq') {
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
.jysq-container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}
</style>