import createAxios from '/@/utils/axios'

/**
 * 查询调价单
 * @returns
 */
export const getTjdList = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/tjd/index',
        method: 'POST',
        data,
    })
}

/**
 * 新增调价单
 * @returns
 */
export const ykTjdCreate = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/tjd/add',
        method: 'POST',
        data,
    })
}

/**
 * 编辑调价单
 * @returns
 */
export const ykTjdEdit = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/tjd/edit',
        method: 'POST',
        data,
    })
}

/**
 * 查询调价单明细
 * @returns
 */
export const getTjdMx = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/tjd/cxtjdmx',
        method: 'POST',
        data,
    })
}
