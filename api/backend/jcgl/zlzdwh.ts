import createAxios from '/@/utils/axios'

/**
 * 获取疾病信息分类
 * @returns
 */
export function getCxjdfl(params: anyObj = {}) {
    return createAxios({
        url: '/api/v1/xtsjwh/Zlzdwh/Cxjdfl',
        method: 'post',
        data: params,
    })
}

export function getCxzlzxks(params: anyObj = {}) {
    //查询诊疗执行科室
    return createAxios({
        url: '/api/v1/xtsjwh/zlzdwh/cxzlzxks',
        method: 'post',
        data: params,
    })
}

export function getCxzljmb(params: anyObj = {}) {
    //查询诊疗价目表
    return createAxios({
        url: '/api/v1/xtsjwh/zlzdwh/Cxzljmb',
        method: 'post',
        data: params,
    })
}

export function Bczljmb(params: anyObj = {}) {
    //把坡村诊疗价目表
    return createAxios({
        url: '/api/v1/xtsjwh/zlzdwh/Bczljmb',
        method: 'post',
        data: params,
    })
}

export function djctljmb(params: anyObj = {}) {
    //查询调价冲突信息
    return createAxios({
        url: '/api/v1/xtsjwh/zlzdwh/cttjxx',
        method: 'post',
        data: params,
    })
}

export function ddbczxks(params: anyObj = {}) {
    //单独保存执行科室
    return createAxios({
        url: '/api/v1/xtsjwh/zlzdwh/ddbczxks',
        method: 'post',
        data: params,
    })
}
