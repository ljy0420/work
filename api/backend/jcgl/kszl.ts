import createAxios from '/@/utils/axios'

/**
 * 获取科室人员列表
 * @param params 
 * @returns 
 */
export function getKsrylb(params: any) {
    return createAxios({
        url: '/api/v1/xtsjwh/kszlwh/ksrylb',
        method: 'post',
        data: params
    })
}

export function getKsbq(params: any) { // 获取科室病区
    return createAxios({
        url: '/api/v1/xtsjwh/kszlwh/ksbq',
        method: 'post',
        data: params
    })
}

export function getMzzslb(params: any) { // 门诊诊室-列表
    return createAxios({
        url: '/api/v1/xtsjwh/kszlwh/mzzslb',
        method: 'post',
        data: params
    })
}

export function mzzsAdd(params: any) { // 门诊诊室-xinzeng
    return createAxios({
        url: '/api/v1/xtsjwh/kszlwh/mzzsAdd',
        method: 'post',
        data: params
    })
}

export function mzzsEdit(params: any) { // 门诊诊室-xiugai
    return createAxios({
        url: '/api/v1/xtsjwh/kszlwh/mzzsEdit',
        method: 'post',
        data: params
    })
}

export function mzzsDel(params: any) { // 门诊诊室-shanchu
    return createAxios({
        url: '/api/v1/xtsjwh/kszlwh/mzzsDel',
        method: 'post',
        data: params
    })
}
