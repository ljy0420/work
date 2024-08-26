import createAxios from '/@/utils/axios'

/**
 * 获取药品执行科室
 * @returns
 */
export function getYpzxks(data: any) {
    return createAxios({
        url: '/api/v1/xtsjwh/ypzdwh/cxzxks',
        method: 'post',
        data: data,
    })
}

export function saveYpzxks(data: any) {
    return createAxios({
        url: '/api/v1/xtsjwh/ypzdwh/bczxks',
        method: 'post',
        data: data,
    })
}
// 查询药品加成比例
export function getYpjcbl(data: any) {
    return createAxios({
        url: '/api/v1/xtsjwh/ypzdwh/cxypjcbl',
        method: 'post',
        data: data,
    })
}
// 保存药品加成比例
export function saveYpjcbl(data: any) {
    return createAxios({
        url: '/api/v1/xtsjwh/ypzdwh/bcypjcbl',
        method: 'post',
        data: data,
    })
}

// 删除药品加成比例
export function deleteYpjcbl(data: any) {
    return createAxios({
        url: '/api/v1/xtsjwh/ypzdwh/scypjcbl',
        method: 'post',
        data: data,
    })
}
// 查询药品用法用量
export function getYpyfyl(data: any) {
    return createAxios({
        url: '/api/v1/xtsjwh/ypzdwh/cxyfyl',
        method: 'post',
        data: data,
    })
}

// 查询药品用法用量
export function getYpgmsyxm(data: any) {
    return createAxios({
        url: '/api/v1/xtsjwh/ypzdwh/cxgmsyxm',
        method: 'post',
        data: data,
    })
}

// 保存药品用法用量与过敏试验项目
export function saveYpyfyl(data: any) {
    return createAxios({
        url: '/api/v1/xtsjwh/ypzdwh/bcypyfyl',
        method: 'post',
        data: data,
    })
}
export function getYfzd(params: any) {
    return createAxios({
        url: '/api/v1/xtsjwh/yfxxwh/index',
        method: 'post',
        data: params,
    })
}
export function getPlzd(params: any) {
    return createAxios({
        url: '/api/v1/xtsjwh/plxxwh/index',
        method: 'post',
        data: params,
    })
}
export function getYzxmzd(params: any) {
    return createAxios({
        url: '/api/v1/xtsjwh/yzxmzdwh/index',
        method: 'post',
        data: params,
    })
}
