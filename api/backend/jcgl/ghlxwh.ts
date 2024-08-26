import createAxios from '/@/utils/axios'

/**
 * 查询挂号类型还未关联的人员
 * @param params 
 * @returns 
 */
export function getCxmzys(params: any) {
    return createAxios({
        url: '/api/v1/xtsjwh/ghlxwh/Cxmzys',
        method: 'post',
        data: params
    })
}

/**
 * 查询挂号类型关联的人员
 * @param params 
 * @returns 
 */
export function getCxghlxglry(params: any) {
    return createAxios({
        url: '/api/v1/xtsjwh/ghlxwh/Cxghlxglry',
        method: 'post',
        data: params
    })
}
