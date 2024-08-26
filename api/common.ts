import createAxios from '/@/utils/axios'
import { isAdminApp, checkFileMimetype } from '/@/utils/common'
import { getUrl } from '/@/utils/axios'
import { useAdminInfo } from '/@/stores/adminInfo'
import { useUserInfo } from '/@/stores/userInfo'
import { ElNotification, UploadRawFile } from 'element-plus'
import { useSiteConfig } from '/@/stores/siteConfig'
import { state as uploadExpandState, fileUpload as uploadExpand } from '/@/components/mixins/baUpload'
import { AxiosRequestConfig } from 'axios'
import { uuid } from '/@/utils/random'
import { i18n } from '../lang'

/*
 * 公共请求函数和Url定义
 */

// Admin模块
export const suffixSvgUrl = '/admin/ajax/buildSuffixSvg'
export const areaUrl = '/admin/ajax/area'
export const getTablePkUrl = '/admin/ajax/getTablePk'
export const getTableFieldListUrl = '/admin/ajax/getTableFieldList'
export const changeTerminalConfigUrl = '/admin/ajax/changeTerminalConfig'
export const clearCacheUrl = '/admin/ajax/clearCache'

// 公共
export const apiUploadUrl = '/api/v1/attachment/uploadimg'
export const refreshTokenUrl = '/api/common/refreshToken'
export const getPymWbmUrl = '/api/v1/common/getpymwbm'
export const getZdmxUrl = '/api/v1/common/getzdmx'
export const getMultiZdmxUrl = '/api/v1/common/getmultizdmx'
export const getGetYzxmzdUrl = '/api/v1/common/GetYzxmzd'
export const getrylistUrl = '/api/v1/common/getrylist'
export const getgystUrl = '/api/v1/common/getgysxxlist'
export const getykUrl = '/api/v1/ykzx/yplzgl/cxyfyk'
export const getCurrenrTime = '/api/v1/common/getsystemdate'
export const getYkYpList = '/api/v1/ykzx/yplzgl/Index'

/**
 * 上传文件
 */
export function fileUpload(fd: FormData, params: anyObj = {}, forceLocal = false, config: AxiosRequestConfig = {}): ApiPromise {
    let errorMsg = ''
    const file = fd.get('file') as UploadRawFile
    const siteConfig = useSiteConfig()

    if (!file.name || typeof file.size == 'undefined') {
        errorMsg = i18n.global.t('utils.The data of the uploaded file is incomplete!')
    } else if (!checkFileMimetype(file.name, file.type)) {
        errorMsg = i18n.global.t('utils.The type of uploaded file is not allowed!')
    } else if (file.size > siteConfig.upload.maxsize) {
        errorMsg = i18n.global.t('utils.The size of the uploaded file exceeds the allowed range!')
    }
    if (errorMsg) {
        return new Promise((resolve, reject) => {
            ElNotification({
                type: 'error',
                message: errorMsg,
            })
            reject(errorMsg)
        })
    }

    if (!forceLocal && uploadExpandState() == 'enable') {
        return uploadExpand(fd, params, config)
    }

    return createAxios({
        url: apiUploadUrl,
        method: 'POST',
        data: fd,
        params: params,
        timeout: 0,
        ...config,
    })
}

/**
 * 生成文件后缀icon的svg图片
 * @param suffix 后缀名
 * @param background 背景色,如:rgb(255,255,255)
 */
export function buildSuffixSvgUrl(suffix: string, background = '') {
    const adminInfo = useAdminInfo()
    return (
        getUrl() +
        suffixSvgUrl +
        '?batoken=' +
        adminInfo.getToken() +
        '&suffix=' +
        suffix +
        (background ? '&background=' + background : '') +
        '&server=1'
    )
}

/**
 * 获取地区数据
 */
export function getArea(values: number[]) {
    const params: { province?: number; city?: number; uuid?: string } = {}
    if (values[0]) {
        params.province = values[0]
    }
    if (values[1]) {
        params.city = values[1]
    }
    params.uuid = uuid()
    return createAxios({
        url: areaUrl,
        method: 'GET',
        params: params,
    })
}

/**
 * 缓存清理接口
 */
export function postClearCache(type: string) {
    return createAxios(
        {
            url: clearCacheUrl,
            method: 'POST',
            data: {
                type: type,
            },
        },
        {
            showSuccessMessage: true,
        }
    )
}

/**
 * 远程下拉框数据获取
 */
export function getSelectData(remoteUrl: string, q: string, params: {}) {
    return createAxios({
        url: remoteUrl,
        method: 'get',
        params: Object.assign(params, {
            select: true,
            keywords: q,
        }),
    })
}

export function getTablePk(table: string) {
    return createAxios({
        url: getTablePkUrl,
        method: 'get',
        params: {
            table: table,
        },
    })
}

/**
 * 获取数据表的字段
 * @param table 数据表名
 * @param clean 只要干净的字段注释（只要字段标题）
 */
export function getTableFieldList(table: string, clean = true) {
    return createAxios({
        url: getTableFieldListUrl,
        method: 'get',
        params: {
            table: table,
            clean: clean ? 1 : 0,
        },
    })
}

export function refreshToken() {
    const adminInfo = useAdminInfo()
    const userInfo = useUserInfo()
    return createAxios({
        url: refreshTokenUrl,
        method: 'POST',
        data: {
            refreshToken: isAdminApp() ? adminInfo.getToken('refresh') : userInfo.getToken('refresh'),
        },
    })
}
/**
 *
 * @param params 获取医嘱字典
 * @returns
 */
export function getGetYzxmzd(params: any) {
    return createAxios({
        url: getGetYzxmzdUrl,
        method: 'post',
        data: params,
    })
}

/**
 *
 * @param params 获取供应商
 * @returns
 */
export function getgyslist(params: any) {
    return createAxios({
        url: getgystUrl,
        method: 'post',
        data: params,
    })
}

/**
 *
 * @param params 获取药库
 * @returns
 */
export function getyklist(data: any) {
    return createAxios({
        url: getykUrl,
        method: 'POST',
        data,
    })
}

/**
 *
 * @param params 获取时间
 * @returns
 */
export function getxtTime() {
    return createAxios({
        url: getCurrenrTime,
    })
}

/**
 *
 * @param params 获取药品明细
 * @returns
 */
export function getYpInfo(data: any) {
    return createAxios({
        url: getYkYpList,
        method: 'POST',
        data,
    })
}

export function getrylist(params: any) {
    return createAxios({
        url: getrylistUrl,
        method: 'post',
        data: params,
    })
}
/**
 *
 * @param params 获取拼音码和五笔码
 * @returns
 */
export function getPymWbm(params: any) {
    return createAxios({
        url: getPymWbmUrl,
        method: 'post',
        data: params,
    })
}

/**
 * 根据分类编码获取字典
 * @param flbm
 * @returns
 */
export function getZdmx(flbm: string) {
    return createAxios({
        url: getZdmxUrl,
        method: 'get',
        params: {
            flbm: flbm,
        },
    })
}

/**
 * 获取多个分类字典
 * @param flbm 分类编码以,分割
 * @returns
 */
export function getMultiZdmx(flbm: string[]) {
    return createAxios({
        url: getMultiZdmxUrl,
        method: 'post',
        data: flbm,
    })
}

/**
 * 获取科室列表
 * @returns
 */
export function getKsList() {
    return createAxios({
        url: '/api/v1/common/getkslist',
        method: 'get',
    })
}

/**
 * 获取手术字典
 * @param data
 * @returns
 */
export function getSszd(data: any) {
    return createAxios({
        url: '/api/v1/common/getsszd',
        method: 'post',
        data: data,
    })
}

/**
 * 获取部位
 * @param data
 * @returns
 */
export function getBw(data: any) {
    return createAxios({
        url: '/api/v1/common/getbw',
        method: 'post',
        data: data,
    })
}

/**
 * 获取部位分类
 * @param data
 * @returns
 */
export function getBwfl(data: any) {
    return createAxios({
        url: '/api/v1/common/getbwfl',
        method: 'post',
        data: data,
    })
}

/**
 * 获取部位检查方法
 * @param data
 * @returns
 */
export function getBwJcff(data: any) {
    return createAxios({
        url: '/api/v1/common/getbwjcff',
        method: 'post',
        data: data,
    })
}

/**
 * 获取分类、部位、检查方法
 * @param data
 * @returns
 */
export function getBwjcffAndFl(data: any) {
    return createAxios({
        url: '/api/v1/common/GetBwJcffAndFl',
        method: 'post',
        data: data,
    })
}

export function getBwGroupInfo(data: any) {
    return createAxios({
        url: '/api/v1/common/GetBwGroupInfo',
        method: 'post',
        data: data,
    })
}

/**
 * 获取医嘱项目检查类型
 * @param data
 * @returns
 */
export function getYzxmjclx(data: any) {
    return createAxios({
        url: '/api/v1/common/GetYzxmjclx',
        method: 'post',
        data: data,
    })
}

/**
 * 查询药房药库
 * @param data
 * @returns
 */
export function getCxyfyk(data: any) {
    return createAxios({
        url: '/api/v1/ykzx/yplzgl/cxyfyk',
        method: 'post',
        data: data,
    })
}

/**
 * 获取药库药房字典
 * @param data
 * @returns
 */
export function getyfyklist() {
    return createAxios({
        url: '/api/v1/common/getyfyklist',
        method: 'get',
    })
}

/**
 * 获取供应商字典
 * @param data
 * @returns
 */
export function getgysxxlist(data: any) {
    return createAxios({
        url: '/api/v1/common/getgysxxlist',
        method: 'post',
        data: data,
    })
}

/**
 * 获取医嘱项目检验标本
 * @param data
 * @returns
 */
export function getYzxmjybb(data: any) {
    return createAxios({
        url: '/api/v1/common/GetYzxmjybb',
        method: 'post',
        data: data,
    })
}

/**
 * 获取医嘱项目检验类型
 * @param data
 * @returns
 */
export function getYzxmjylx(data: any) {
    return createAxios({
        url: '/api/v1/common/GetYzxmjylx',
        method: 'post',
        data: data,
    })
}

/**
 * 获取报销类别
 * @param data
 * @returns
 */
export function getBxlblist(data: any) {
    return createAxios({
        url: '/api/v1/common/getbxlblist',
        method: 'post',
        data: data,
    })
}

/**
 * 获取厂家字典
 * @param data
 * @returns
 */
export function getCjxxlist(data: any) {
    return createAxios({
        url: '/api/v1/common/getcjxxlist',
        method: 'post',
        data: data,
    })
}

/**
 * 获取收费项目字典
 * @param data
 * @returns
 */
export function getSfxmzdList(data: any) {
    return createAxios({
        url: '/api/v1/common/GetSfxmzd',
        method: 'post',
        data: data,
    })
}

/**
 * 获取收入项目字典
 * @param data
 * @returns
 */
export function getSrxmzdList(data: any) {
    return createAxios({
        url: '/api/v1/common/GetSrxmzd',
        method: 'post',
        data: data,
    })
}

/**
 * 获取挂号类别
 * @param data
 * @returns
 */
export function getGhlbList(data: any) {
    return createAxios({
        url: '/api/v1/common/GetGhlb',
        method: 'post',
        data: data,
    })
}

/**
 * 生成一个控制器的：增、删、改、查、排序的操作url
 */
export class baTableApi {
    private controllerUrl
    public actionUrl

    constructor(controllerUrl: string) {
        this.controllerUrl = controllerUrl
        this.actionUrl = new Map([
            ['index', controllerUrl + 'index'],
            ['add', controllerUrl + 'add'],
            ['edit', controllerUrl + 'edit'],
            ['del', controllerUrl + 'delete'],
            ['detail', controllerUrl + 'detail'],
            ['sortable', controllerUrl + 'sortable'],
            ['updatefield', controllerUrl + 'update']
        ])
    }

    index(filter: anyObj = {}) {
        return createAxios({
            url: this.actionUrl.get('index'),
            method: 'post',
            data: filter,
        })
    }

    edit(params: anyObj) {
        return createAxios({
            url: this.actionUrl.get('edit'),
            method: 'get',
            params: params,
        })
    }

    detail(params: anyObj) {
        return createAxios({
            url: this.actionUrl.get('detail'),
            method: 'get',
            params: params,
        })
    }

    del(ids: string[]) {
        return createAxios(
            {
                url: this.actionUrl.get('del'),
                method: 'DELETE',
                data: ids,
            },
            {
                showSuccessMessage: true,
            }
        )
    }

    batchDelete(data: anyObj) {
        return createAxios(
            {
                url: this.actionUrl.get('del'),
                method: 'DELETE',
                data: data,
            },
            {
                showSuccessMessage: true,
            }
        )
    }

    requestData(action: string, filter: anyObj = {}) {
        return createAxios({
            url: this.controllerUrl + action,
            method: 'post',
            data: filter,
        })
    }

    doPost(url: string, data: anyObj = {}) {
        return createAxios({
            url: url,
            method: 'post',
            data: data,
        })
    }

    postData(action: string, data: anyObj) {
        return createAxios(
            {
                url: this.actionUrl.has(action) ? this.actionUrl.get(action) : this.controllerUrl + action,
                method: 'post',
                data: data,
            },
            {
                showSuccessMessage: true,
            }
        )
    }

    sortableApi(id: string, targetId: string, oldIdx: number | undefined, newIdx: number | undefined) {
        return createAxios({
            url: this.actionUrl.get('sortable'),
            method: 'post',
            data: {
                sourceId: id,
                targetId: targetId,
                oldIndex: oldIdx,
                newIndex: newIdx,
            },
        })
    }

    sortableApi2(oldRow: any, newRow: any, oldIdx: number | undefined, newIdx: number | undefined) {
        return createAxios({
            url: this.actionUrl.get('sortable'),
            method: 'post',
            data: {
                source: oldRow,
                target: newRow,
                oldIndex: oldIdx,
                newIndex: newIdx,
            },
        })
    }
}

export class baTableApi2 {
    //改造 author:liu
    private controllerUrl
    public actionUrl

    constructor(controllerUrl: string) {
        this.controllerUrl = controllerUrl

        this.actionUrl = new Map([
            ['index', controllerUrl],
            ['add', '/api/v1/xtsjwh/ghlxwh/Xzghlxglys'],
            ['edit', '/api/v1/xtsjwh/ghlxwh/Xgghlxglys'],
            ['del', '/api/v1/xtsjwh/ghlxwh/Scghlxglys'],
            ['detail', controllerUrl + 'detail'],
            ['sortable', controllerUrl + 'sortable'],
        ])
    }

    index(filter: anyObj = {}) {
        return createAxios({
            url: this.actionUrl.get('index'),
            method: 'post',
            data: filter,
        })
    }

    edit(params: anyObj) {
        return createAxios({
            url: this.actionUrl.get('edit'),
            method: 'get',
            params: params,
        })
    }

    detail(params: anyObj) {
        return createAxios({
            url: this.actionUrl.get('detail'),
            method: 'get',
            params: params,
        })
    }

    del(ids: string[]) {
        return createAxios(
            {
                url: this.actionUrl.get('del'),
                method: 'DELETE',
                data: ids,
            },
            {
                showSuccessMessage: true,
            }
        )
    }

    postData(action: string, data: anyObj) {
        return createAxios(
            {
                url: this.actionUrl.has(action) ? this.actionUrl.get(action) : this.controllerUrl + action,
                method: 'post',
                data: data,
            },
            {
                showSuccessMessage: true,
            }
        )
    }

    sortableApi(id: string, targetId: string, oldIdx: number | undefined, newIdx: number | undefined) {
        return createAxios({
            url: this.actionUrl.get('sortable'),
            method: 'post',
            data: {
                sourceId: id,
                targetId: targetId,
                oldIndex: oldIdx,
                newIndex: newIdx,
            },
        })
    }

    sortableApi2(oldRow: any, newRow: any, oldIdx: number | undefined, newIdx: number | undefined) {
        return createAxios({
            url: this.actionUrl.get('sortable'),
            method: 'post',
            data: {
                source: oldRow,
                target: newRow,
                oldIndex: oldIdx,
                newIndex: newIdx,
            },
        })
    }
}

export class baTableApi3 {
    //改造 author:liu
    private controllerUrl
    public actionUrl

    constructor(controllerUrl: string) {
        this.controllerUrl = controllerUrl

        this.actionUrl = new Map([
            ['index', controllerUrl],
            ['add', '/api/v1/xtsjwh/ghlxwh/Xzghlxglks'],
            ['edit', '/api/v1/xtsjwh/ghlxwh/Xgghlxglks'],
            ['del', '/api/v1/xtsjwh/ghlxwh/Scghlxglks'],
            ['detail', controllerUrl + 'detail'],
            ['sortable', controllerUrl + 'sortable'],
        ])
    }

    index(filter: anyObj = {}) {
        return createAxios({
            url: this.actionUrl.get('index'),
            method: 'post',
            data: filter,
        })
    }

    edit(params: anyObj) {
        return createAxios({
            url: this.actionUrl.get('edit'),
            method: 'get',
            params: params,
        })
    }

    detail(params: anyObj) {
        return createAxios({
            url: this.actionUrl.get('detail'),
            method: 'get',
            params: params,
        })
    }

    del(ids: string[]) {
        return createAxios(
            {
                url: this.actionUrl.get('del'),
                method: 'DELETE',
                data: ids,
            },
            {
                showSuccessMessage: true,
            }
        )
    }

    postData(action: string, data: anyObj) {
        return createAxios(
            {
                url: this.actionUrl.has(action) ? this.actionUrl.get(action) : this.controllerUrl + action,
                method: 'post',
                data: data,
            },
            {
                showSuccessMessage: true,
            }
        )
    }

    sortableApi(id: string, targetId: string, oldIdx: number | undefined, newIdx: number | undefined) {
        return createAxios({
            url: this.actionUrl.get('sortable'),
            method: 'post',
            data: {
                sourceId: id,
                targetId: targetId,
                oldIndex: oldIdx,
                newIndex: newIdx,
            },
        })
    }

    sortableApi2(oldRow: any, newRow: any, oldIdx: number | undefined, newIdx: number | undefined) {
        return createAxios({
            url: this.actionUrl.get('sortable'),
            method: 'post',
            data: {
                source: oldRow,
                target: newRow,
                oldIndex: oldIdx,
                newIndex: newIdx,
            },
        })
    }
}
