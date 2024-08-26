import createAxios from "/@/utils/axios"

export function AddPiaoJulx(data:any){
  return createAxios({
    url:'/api/v1/cwgl/Pjlxyy/add',
    method:'post',
    data:{agrs:data}
  },{
    showSuccessMessage:true
  })
}