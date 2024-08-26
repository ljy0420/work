import createAxios from "/@/utils/axios"

export function AddPiaoJurkmx(data:any){
  return createAxios({
    url:'/api/v1/cwgl/Pjrkmx/add',
    method:'post',
    data:{agrs:data}
  },{
    showSuccessMessage:true
  })
}

export function GetPiaoJulx(){
  return createAxios({
    url:'/api/v1/cwgl/pjlxyy/index',
    method:'post',
    data:{agrs:{}}
  },{
    showSuccessMessage:true
  })
}

export function GetRenYuanxx(){
  return createAxios({
    url:'/api/v1/xtsjwh/ryzlwh/index',
    method:'post',
    data:{agrs:{chaXunL:'RYBM,RYXM'}}
  },{
    showSuccessMessage:true
  })
}