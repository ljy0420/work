<template>
    <div class="dzbl-container" v-loading="state.loading">
        电子病历
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
        if (value === 'dzbl') {
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
.dzbl-container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}
</style>