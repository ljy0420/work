import createAxios from "/@/utils/axios"

export function AddPiaoJulyjl(data:any){
  return createAxios({
    url:'/api/v1/cwgl/pjlyjl/add',
    method:'post',
    data:{agrs:data}
  },{
    showSuccessMessage:true
  })
}

export function GetPiaoJulyjl(rkmxid: any){
  return createAxios({
    url:'/api/v1/cwgl/pjlyjl/index',
    method:'post',
    data:{agrs:rkmxid}
  },{
    showSuccessMessage:true
  })
}

export function GetPiaoJurkmx(){
  return createAxios({
    url:'/api/v1/cwgl/pjrkmx/index',
    method:'post',
    data:{agrs:{}}
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