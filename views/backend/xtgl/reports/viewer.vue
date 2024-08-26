<template>
    <div class="default-main ba-table-box">
        <div id="viewer"></div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { Stimulsoft } from "stimulsoft-reports-js/Scripts/stimulsoft.blockly.editor"

// Stimulsoft.Base.Localization.StiLocalization.setLocalizationFile("locales/zh-CHS.xml");
// let report = new Stimulsoft.Report.StiReport();
// let dataSource = new Stimulsoft.Report.Dictionary.StiJsonDatabase("demo1", "http://192.168.0.66:802/api/v1/common/getzdmx?flbm=GB_009001")
// report.loadFile("http://192.168.68.15:802/api/files/getmrt/demo1");
// report.dictionary.databases.clear();
// report.dictionary.databases.add(dataSource);

// const doPrint = () => {
//     report.renderAsync(function(){
//         report.print();
//     });
// }

onMounted(() => {
    Stimulsoft.Base.Localization.StiLocalization.setLocalizationFile("locales/zh-CHS.xml")
    let options = new Stimulsoft.Viewer.StiViewerOptions()
    options.appearance.fullScreenMode = false
    // options.toolbar.showPrintButton = false;
    let viewer = new Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);

    let report = new Stimulsoft.Report.StiReport();

    let dataSource = new Stimulsoft.Report.Dictionary.StiJsonDatabase("demo1", "http://192.168.68.15:802/api/v1/common/getzdmx?flbm=GB_009001")
    //report.loadFile("/reports/SimpleList.mrt");
    report.loadFile("http://192.168.68.15:802/api/files/getmrt/demo1");
    report.dictionary.databases.clear();
    report.dictionary.databases.add(dataSource);

    viewer.report = report;

    viewer.renderHtml("viewer");
});
</script>

<style scoped lang="scss">
</style>