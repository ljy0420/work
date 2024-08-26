import createAxios from '/@/utils/axios'

/**
 * 获取医嘱项目执行科室
 * @returns 
 */
export function getYzxmzxks(data: any) {
    return createAxios({
        url: '/api/v1/xtsjwh/yzxmzdwh/cxyzzxks',
        method: 'post',
        data: data
    })
}

/**
 * 获取医嘱项目收费明细
 * @param data 
 * @returns 
 */
export function getYzxmsfmx(data: any) {
    return createAxios({
        url: '/api/v1/xtsjwh/yzxmzdwh/cxyzsfmx',
        method: 'post',
        data: data
    })
}

/**
 * 获取医嘱项目适用科室
 * @param data 
 * @returns 
 */
export function getYzxmSyks(data: any) {
    return createAxios({
        url: '/api/v1/xtsjwh/yzxmzdwh/cxyzsyks',
        method: 'post',
        data: data
    })
}

export function getYzxmYfyl(data: any) {
    return createAxios({
        url: '/api/v1/xtsjwh/yzxmzdwh/cxyzyfyl',
        method: 'post',
        data: data
    })
}