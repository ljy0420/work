import createAxios from '/@/utils/axios'

/**
 * 获取字典分类树
 * @returns 
 */
export function getZdflList() {
    return createAxios({
        url: '/api/v1/xtsjwh/zdmxgl/QueryFenLeiList',
        method: 'post',
        data:{ agrs: "-1" }
    })
}

/**
 * 新增字典分类
 * @param data 
 * @returns 
 */
export function addFenLei(data: any) {
    return createAxios({
        url: '/api/v1/xtsjwh/zdmxgl/AddFenLei',
        method: 'post',
        data:{ agrs: data }
    },
    {
        showSuccessMessage: true,
    })
}

/**
 * 修改字典分类
 * @param data 
 * @returns 
 */
export function editFenLei(data: any) {
    return createAxios({
        url: '/api/v1/xtsjwh/zdmxgl/EditFenLei',
        method: 'post',
        data:{ agrs: data }
    },
    {
        showSuccessMessage: true,
    })
}