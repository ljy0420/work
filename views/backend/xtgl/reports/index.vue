<template>
    <div id="designer"></div>
</template>

<script setup lang="ts">
import { reactive,onMounted } from "vue";
import { useRoute } from 'vue-router'
import { Stimulsoft } from "stimulsoft-reports-js/Scripts/stimulsoft.blockly.editor";
import { getYsdjDetail, saveYsdjnr } from '/@/api/backend/xtgl/ysdj'

const route = useRoute()

const state: {
    ID: string,
    DJID: string|undefined,
    YSMC: string
} = reactive({
    ID: '',
    DJID: '',
    YSMC: ''
})

const renderReport = (param: any) => {
    Stimulsoft.Base.Localization.StiLocalization.setLocalizationFile("locales/zh-CHS.xml")

    let options = new Stimulsoft.Designer.StiDesignerOptions();
    options.appearance.fullScreenMode = false;
    options.appearance.showLocalization = false;
    options.toolbar.showSaveButton = false;

    let designer = new Stimulsoft.Designer.StiDesigner(options, "StiDesigner", false);

    let report = new Stimulsoft.Report.StiReport();
    if(param){
        //console.log('加载样式')
        report.load(param)
    }

    designer.report = report;

    designer.renderHtml("designer");

    designer.onSaveReport  = function (agrs) {
        agrs.report.reportName = state.YSMC;
        var jsonReport = agrs.report.saveToJsonString();
        //console.log(jsonReport)
        let reportId = state.ID ? state.ID : agrs.report.reportGuid
        saveYsdjnr({
            ID: reportId,
            DJID: state.DJID,
            YSMC: state.YSMC,
            YSNR_JSON: jsonReport
        })
    }

    designer.onSaveAsReport = function (agrs) {
        agrs.report.reportName = state.YSMC;
        var jsonReport = agrs.report.saveToJsonString();
        //console.log(jsonReport)
        let reportId = state.ID ? state.ID : agrs.report.reportGuid
        saveYsdjnr({
            ID: reportId,
            DJID: state.DJID,
            YSMC: state.YSMC,
            YSNR_JSON: jsonReport
        })
    }
}

onMounted(() => {
    // console.log(route.query.id,"接收query")
    // console.log('route.params',route.params) //route.params无法接收参数
    // console.log('history.state', history.state.params)
    state.DJID = route.query.id?.toString()
    getYsdjDetail({ id: route.query.id }).then((res)=>{
        console.log(res)
        if(res.code == 1){
            state.YSMC = res.data.YSMC
            if(res.data.ID){
                state.ID = res.data.ID
                //renderReport(route.query.id)
                renderReport(res.data.YSNR_JSON)
            } else {
                renderReport(null)
            }
        }
    })
});
</script>

<style scoped lang="scss">
</style>