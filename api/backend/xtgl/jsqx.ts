import createAxios from '/@/utils/axios'

/**
 * 获取菜单树
 * @returns 
 */
export function getAllMenus() {
    return createAxios({
        url: '/api/v1/xtsjwh/jsqxwh/menus',
        method: 'get',
    })
}

/**
 * 保存角色菜单
 * @param data 
 * @returns 
 */
export function saveJsCaidan(data: any)
{
    return createAxios(
        {
            url: '/api/v1/xtsjwh/jsqxwh/savejsqxcd',
            method: 'post',
            data: data
        },
        {
            showSuccessMessage: true,
        }
    )
}

/**
 * 获取角色菜单
 * @param data 
 * @returns 
 */
export function getJsCaidan(data: any)
{
    return createAxios(
        {
            url: '/api/v1/xtsjwh/jsqxwh/getjsqxcd',
            method: 'post',
            data: data
        }
    )
}

/**
 * 获取角色人员
 * @param data 
 * @returns 
 */
export function getJsRenyuan(data: any)
{
    return createAxios(
        {
            url: '/api/v1/xtsjwh/jsqxwh/getjsqxyh',
            method: 'post',
            data: data
        }
    )
}

/**
 * 保存角色用户
 * @param data 
 * @returns 
 */
export function saveJsYonghu(data: any)
{
    return createAxios(
        {
            url: '/api/v1/xtsjwh/jsqxwh/savejsqxyh',
            method: 'post',
            data: data
        },
        {
            showSuccessMessage: true,
        }
    )
}