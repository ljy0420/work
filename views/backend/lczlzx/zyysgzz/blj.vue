<template>
    <div class="blj-container" v-loading="state.loading">
        病历夹
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
        if (value === 'blj') {
            state.loading = true
            setTimeout(() => {
                state.loading = false
            }, 1000);
        }
    }
)

onMounted(() => {
    console.log('blj....')
})
</script>

<style lang="scss" scoped>
.blj-container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}
</style>