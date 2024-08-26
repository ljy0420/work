<template>
    <div class="mz-home-container">
        <div class="mz-home-content">
            <el-scrollbar v-loading="state.loading">
                <div class="mz-home-top">
                    <div class="mzbl-action">
                        <el-button type="text" plain class="top-btn">
                            <Icon name="local-refresh" />
                            <span class="operate-text">刷新</span>
                        </el-button>
                        <el-button type="text" plain class="top-btn" @click="apzwBtn">
                            <Icon name="local-jh" />
                            <span class="operate-text">安排座位</span>
                        </el-button>
                        <el-button type="text" plain class="top-btn">
                            <Icon name="local-sjt" />
                            <span class="operate-text">置空座位</span>
                        </el-button>
                        <el-button type="text" plain class="top-btn">
                            <Icon name="local-zyjt" />
                            <span class="operate-text">调换座位</span>
                        </el-button>
                    </div>
                </div>
                <div class="mz-home-body">
                    <div class="seat-container">
                        <div
                            v-for="seat in seats"
                            :key="seat.id"
                            :class="['seat', seat.selected ? 'selected' : '']"
                            @click="showDropdownMenu(seat, $event)"
                        >
                            <div class="seat-id">{{ seat.id }}</div>
                            <div class="seat-name">{{ seat.name }}</div>
                            <div class="seat-xb">{{ seat.xb }}</div>
                            <div class="seat-nl">{{ seat.nl }}</div>
                            <div class="seat-blh">{{ seat.blh }}</div>
                            <div class="seat-bg"></div>
                        </div>
                        <div v-if="isDropdownMenuVisible" :style="{ top: dropdownMenuY + 'px', left: dropdownMenuX + 'px' }" class="dropdown-menu">
                            <div class="menu-items" @click="handleDropdownClick">
                                <el-button type="text" plain>
                                    <Icon name="local-zwap" />
                                    <span class="operate-text">安排座位</span>
                                </el-button>
                                <el-button type="text" plain>
                                    <Icon name="local-zkzw" />
                                    <span class="operate-text">置空座位</span>
                                </el-button>
                                <el-button type="text" plain>
                                    <Icon name="local-dhzw" />
                                    <span class="operate-text">调换座位</span>
                                </el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </el-scrollbar>
        </div>
        <Zwap ref="zwapRef" :brxx="props.brxx" />
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import Zwap from './zwgl/zwap.vue'
const props = defineProps(['tab', 'brxx'])
const zwapRef = ref()
const state: {
    loading: boolean
} = reactive({
    loading: false,
})

const form = reactive({})

const seats = Array.from({ length: 22 }, (_, index) => ({
    id: index + 1,
    name: `Seat ${index + 1}`,
    xb: '',
    nl: '',
    blh: '',
    selected: false,
}))

const isDropdownMenuVisible = ref(false)
const dropdownMenuX = ref(0)
const dropdownMenuY = ref(0)

const showDropdownMenu = (selectedSeat: any, event: any) => {
    dropdownMenuX.value = event.clientX
    dropdownMenuY.value = event.clientY
    isDropdownMenuVisible.value = true
    seats.forEach((seat) => {
        seat.selected = false
    })

    selectedSeat.selected = true
}

const handleDocumentClick = (event: any) => {
    if (!event.target.closest('.seat-container')) {
        seats.forEach((seat) => {
            seat.selected = false
        })
        isDropdownMenuVisible.value = false
    }
}

const handleDropdownClick = (event: any) => {
    isDropdownMenuVisible.value = false
    event.stopPropagation()
}

const apzwBtn = () => {
    console.log(111)

    zwapRef.value.show()
}

watch(
    () => props.tab,
    (value) => {
        if (value === 'zwgl') {
            state.loading = true
            setTimeout(() => {
                state.loading = false
            }, 1000)
        }
    }
)

onMounted(() => {
    document.addEventListener('click', handleDocumentClick)
})
</script>

<style lang="scss" scoped>
.mz-home-container {
    height: 100%;
    display: flex;
    flex-direction: row;
    .mz-home-content {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        .mz-home-top {
            position: relative;
            height: 50px;
            width: 100%;
            text-align: center;
            line-height: 50px;
            font-size: 20px;
            border-bottom: 3px solid #f1f1f1;
            .mzbl-action {
                float: left;
                .top-btn {
                    margin-left: 10px;
                }
                .svg-icon {
                    color: #59a7ff !important;
                }
                .operate-text {
                    margin-left: 6px;
                }
            }
        }
        .mz-home-body {
            flex-grow: 1;
            width: 100%;
            .seat-container {
                display: flex;
                flex-wrap: wrap;
            }

            .seat {
                position: relative;
                width: 120px;
                height: 120px;
                margin: 10px;
                background-color: #f1f1f1;
                border: 1px solid #ccc;
                display: flex;
                justify-content: center;
                align-items: center;
                .seat-id {
                    top: 0px;
                    left: 0px;
                    position: absolute;
                    border-bottom: 2px solid rgb(176, 180, 231);
                    height: 20px;
                    width: 50px;
                    font-size: 14px;
                    text-align: end;
                    padding-right: 10px;
                }
                .seat-name {
                    top: 0px;
                    right: 0px;
                    position: absolute;
                    border-left: 2px solid rgb(176, 180, 231);
                    border-bottom: 2px solid rgb(176, 180, 231);
                    height: 20px;
                    width: 70px;
                    font-size: 14px;
                    padding-left: 10px;
                }
                .seat-xb {
                    top: 20px;
                    left: 0px;
                    position: absolute;
                    border-bottom: 2px solid rgb(176, 180, 231);
                    height: 20px;
                    width: 50px;
                    font-size: 14px;
                    text-align: end;
                    padding-right: 10px;
                }
                .seat-nl {
                    top: 20px;
                    right: 0px;
                    position: absolute;
                    border-left: 2px solid rgb(176, 180, 231);
                    border-bottom: 2px solid rgb(176, 180, 231);
                    height: 20px;
                    width: 70px;
                    font-size: 14px;
                    padding-left: 10px;
                }
                .seat-blh {
                    top: 40px;
                    left: 0px;
                    position: absolute;
                    border-bottom: 2px solid rgb(176, 180, 231);
                    height: 20px;
                    width: 120px;
                    font-size: 14px;
                    text-align: center;
                    padding-right: 10px;
                }
                .seat-bg {
                    top: 60px;
                    right: 0px;
                    position: absolute;
                    border-left: 2px solid rgb(176, 180, 231);
                    background-image: url('src/assets/images/br.png');
                    background-size: 50% 50%;
                    background-repeat: no-repeat; /* 防止背景图片重复 */
                    background-position: center; /* 将背景图片垂直居中 */
                    height: 60px;
                    width: 50px;
                    font-size: 14px;
                    padding-left: 10px;
                }
            }
            .selected {
                background-color: rgb(8, 255, 181);
            }
            .dropdown-menu {
                position: fixed;
                background-color: white;
                border: 1px solid #ccc;
                padding: 10px;
            }
            .menu-items {
                display: flex;
                flex-direction: column; /* 将按钮容器设置为垂直方向 */
                .svg-icon {
                    color: #59a7ff !important;
                }
                .operate-text {
                    margin-left: 6px;
                }
            }
        }
    }
}
:deep(.el-button + .el-button) {
    margin-left: 0px;
}
</style>
