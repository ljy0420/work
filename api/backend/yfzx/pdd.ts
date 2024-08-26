import createAxios from '/@/utils/axios'

/**
 * 查询盘点单
 * @returns
 */
export const getPddList = (data: any) => {
    return createAxios({
        url: '/api/v1/yfzx/pdd/index',
        method: 'POST',
        data,
    })
}

/**
 * 查询盘点单明细
 * @returns
 */
export const getPddMx = (data: any) => {
    return createAxios({
        url: '/api/v1/yfzx/pdd/cxpddmx',
        method: 'POST',
        data,
    })
}

/**
 * 查询药品
 * @returns
 */
export const getYpInfo = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/yplzgl/Index',
        method: 'POST',
        data,
    })
}

/**
 * 修改
 * @returns
 */
export const yfPddEdit = (data: any) => {
    return createAxios({
        url: '/api/v1/yfzx/pdd/edit',
        method: 'POST',
        data,
    })
}

/**
 * 新增
 * @returns
 */
export const yfPddCreate = (data: any) => {
    return createAxios({
        url: '/api/v1/yfzx/pdd/add',
        method: 'POST',
        data,
    })
}

/**
 * 查询药房
 * @returns
 */
export const cxYfYk = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/yplzgl/cxyfyk',
        method: 'POST',
        data,
    })
}

/**
 * 生成盘点明细
 * @returns
 */
export const scPdmx = (data: any) => {
    return createAxios({
        url: '/api/v1/yfzx/pdd/scpdmx',
        method: 'POST',
        data,
    })
}

/**
 * 查询药品分类
 * @returns
 */
export const cxYpfl = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/yplzgl/cxypfl',
        method: 'POST',
        data,
    })
}

/**
 * 查询货位位置信息
 * @returns
 */
export const cxhwzd = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/yplzgl/cxhwzd',
        method: 'POST',
        data,
    })
}

/**
 * 获取药房药品类别
 * @returns
 */
export const hqyfyplb = (data: any) => {
    return createAxios({
        url: '/api/v1/ykzx/pdd/hqyfyplb',
        method: 'POST',
        data,
    })
}

/**
 * 审核前账面库存数量检查
 * @returns
 */
export const kcsljc = (data: any) => {
    return createAxios({
        url: '/api/v1/yfzx/pdd/kcsljc',
        method: 'POST',
        data,
    })
}
