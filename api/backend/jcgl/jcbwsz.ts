import createAxios from '/@/utils/axios'

/**
 * 获取分类部位
 * @returns
 */
export function getjcbw(data: any) {
    return createAxios({
        url: '/api/v1/xtsjwh/bwxx/Index_fl',
        method: 'post',
        data: data,
    })
}

/**
 * 新增部位分类
 * @param data
 * @returns
 */
export function addFenLei(data: any) {
    return createAxios(
        {
            url: '/api/v1/xtsjwh/bwxx/Add_fl',
            method: 'post',
            data: { agrs: data },
        },
        {
            showSuccessMessage: true,
        }
    )
}

/**
 * 修改部位分类
 * @param data
 * @returns
 */
export function editFenLei(data: any) {
    return createAxios(
        {
            url: '/api/v1/xtsjwh/bwxx/Edit_fl',
            method: 'post',
            data: { agrs: data },
        },
        {
            showSuccessMessage: true,
        }
    )
}

/**
 * 查询检查方法
 * @param data
 * @returns
 */
export function getJcff(data: any) {
    return createAxios({
        url: '/api/v1/xtsjwh/bwxx/Index_jcff',
        method: 'post',
        data: { agrs: data },
    })
}
