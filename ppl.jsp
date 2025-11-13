<%@ page contentType="text/html;charset=UTF-8" language="java"%>

<!-- <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"/> -->
<!-- <script src="/paperless/assets/plugins/highchart/modules/exporting.js"></script>
<script src="/paperless/assets/plugins/highchart/modules/offline-exporting.js"></script> -->
<style>
    /* @media only screen and (max-width: 990px) {
        #chart_detail {
            display: none;
        }
    } */

    body {
        background-image: url("/paperless/assets/images/checklist/background.png");
        background-size: cover;
    }

    /* Let's get this party started */
    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0, 100, 167, 0.377);
        -webkit-border-radius: 4px;
        border-radius: 4px;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        -webkit-border-radius: 4px;
        border-radius: 4px;
        background: #0ee4ff;
        -webkit-box-shadow: inset 0 0 6px #002930;
    }

    ::-webkit-scrollbar-thumb:window-inactive {
        background: #0ee4ff;
    }

    .tableFixHead {
        overflow-y: auto;
        height: 86%;
    }

    #tbl {
        width: 100%;
        text-align: center;
        border-collapse: separate;
        border-spacing: 0;
        line-height: 2;
    }

    #tbl th {
        /* Apply both top and bottom borders to the <th> */
        border-top: 1px solid #00515f93;
        border-bottom: 1px solid #00515f93;
        border-right: 1px solid #00515f93;
        ;
    }

    #tbl td {
        /* For cells, apply the border to one of each side only (right but not left, bottom but not top) */
        border-bottom: 1px solid #00515f93;
        border-right: 1px solid #00515f93;
    }

    #tbl th:first-child,
    #tbl td:first-child {
        /* Apply a left border on the first <td> or <th> in a row */
        border-left: 1px solid #00515f93;
    }

    #tbl thead th {
        position: sticky;
        top: 0;
        background-color: #092436;
        color: #068b8d;
    }

    /* img {
        position: absolute;
    } */

    #box-1 {
        margin: 0;
        padding: 0;
        background-image: url("/paperless/assets/images/checklist/box1.png");
        background-size: 100% 100%;
    }

    .box2 {
        /* background-image: url("/paperless/assets/dist/img/Group7452.png"); */
        background-size: 100% 100%;
        position: relative;
    }

    #box-3 {
        /* background-image: url("/paperless/assets/dist/img/Group7452.png"); */
        background-size: 100% 100%;
        padding: 0.8%;
    }

    .header1 {
        background-repeat: no-repeat;
        background-attachment: fixed;
        margin: 0px !important;
        position: relative;
    }

    .header2 {
        background-repeat: no-repeat;
        background-attachment: fixed;
    }

    .text {
        color: #daf9f7;
        position: absolute;
        /* font-family: 'Gentium Basic', serif !important; */
        text-align: center;
        width: 100%;
        font-size: 2.8vh;
        margin: auto;
    }

    .text2 {
        color: #daf9f7;
        position: absolute;
        padding: 3px;
        /* font-family: sans-serif; */
        text-align: center;
        width: 100%;
        font-size: 2.3vh;
        margin: auto;
        margin-top: 5vh;
        background-image: url("/paperless/assets/images/checklist/FAI2.png");
        background-repeat: no-repeat;
        background-position: center;
    }

    .text3 {
        position: absolute;
        color: #00c2dc;
        /* font-family: sans-serif; */
        text-align: left;
        width: 100%;
        font-size: 0.9rem;
        margin: -0.6rem 0rem 0rem 3rem;
    }

    .header_in {
        width: 100%;
        position: absolute;
        top: 0.5vh;
    }

    .ad .right {
        margin-bottom: 0px;
        margin-right: 6em;
        width: auto;
        background: transparent;
        color: #00bdd6;
        font-size: 14px;
        border: solid #2f8abc 1px;
        box-shadow: 0 2px 4px 0 #2f8abc;
        border-radius: 4px;
    }

    .btn-circle {
        border: none;
        width: 50px;
        height: 32px;
        padding: 6px 0px;
        /* border-radius: 15px; */
        text-align: center;
        font-size: 12px;
        line-height: 1.42857;
    }

    .btn-circle option {
        background: #034e78;
    }

    .btn-h1 .btn-primary,
    .btn-show-total {
        color: #00c2dc;
        background-color: #ffffff00;
        background-size: 100% 100%;
        border: solid #2f8abc 1px;
        box-shadow: 0 2px 4px 0 #2f8abc;
    }

    .hidden {
        display: none;
    }

    .dropdown {
        position: relative;
        display: inline-block;
    }

    .dropdown-content {
        display: none;
        position: absolute;
        background-color: #f9f9f9;
        min-width: 250px;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        z-index: 1;
        font-size: 0.8em;
    }

    .dropdown-content a {
        color: #7bbef9;
        padding: 13px 10px;
        text-decoration: none;
        display: block;
        background-color: #09223a;
    }

    .dropdown-content a:hover {
        background-color: #087177
    }

    .dropdown-content a:active {
        background-color: #00c2dc
    }

    /*end header*/
    .chart {
        height: 24.5vh;
        overflow: hidden;
        margin: auto;
        margin: 0.4rem 0.5rem 0.8rem 0.5rem;
    }

    .timspan_group {
        position: absolute;
        text-align: left;
        width: 12%;
        margin: -1rem 0rem 0rem 8rem;
        height: 1.6rem;
        font-size: 0.9em;
    }

    .timespan_input {
        height: 1.6rem;
    }

    .timespan_prepend {
        height: 1.6rem;
    }

    .timespan_text {
        height: 1.6rem;
        padding-left: 0rem;
        padding-right: 0rem;
    }

    .btn_group {
        position: absolute;
        margin: -1.5rem 0rem 0rem 18.5rem;
        padding: 0.15rem;
        margin-top: -0.9rem;
        color: #068b8d;
        background: #011428;
        outline: none;
        border-radius: 4px;
        border: 1px solid #068b8d;
    }

    .input-group-prepend .input-group-text {
        color: #00c2dc;
        background: transparent;
        border: 1px solid #068b8d;
    }

    #reservation {
        background: transparent;
        border: 1px solid #068b8d;
        color: #00c2dc;

    }

    .check_bar progress[value] {
        /* Reset the default appearance */
        -webkit-appearance: none;
        appearance: none;
        width: 60%;
        height: 1.2vh;
    }

    .check_bar progress[value]::-webkit-progress-bar {
        background-color: rgba(238, 238, 238, 0);
        /* border: #056e9f solid 1px; */
        border-width: 1px;
        border-style: solid;
        border-color: #3bdbc0;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25) inset;
    }

    .check_bar progress[value]::-webkit-progress-value {
        background-image:
            -webkit-linear-gradient(left, #25926b, #3bdbc0);
        border-radius: 2px;
    }

    .uncheck_bar progress[value] {
        -webkit-appearance: none;
        appearance: none;
        width: 60%;
        height: 1.2vh;
    }

    .uncheck_bar progress[value]::-webkit-progress-bar {
        background-color: rgba(238, 238, 238, 0);
        border-width: 1px;
        border-style: solid;
        border-color: #f4eb96;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25) inset;
    }

    .uncheck_bar progress[value]::-webkit-progress-value {
        background-image:
            -webkit-linear-gradient(left, #e0cd00, #f4eb96);
        border-radius: 2px;
    }

    .abnormal_bar progress[value] {
        -webkit-appearance: none;
        appearance: none;
        width: 60%;
        height: 1.2vh;
    }

    .abnormal_bar progress[value]::-webkit-progress-bar {
        background-color: rgba(238, 238, 238, 0);
        border-width: 1px;
        border-style: solid;
        border-color: #ff9b78;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25) inset;
    }

    .abnormal_bar progress[value]::-webkit-progress-value {
        background-image:
            -webkit-linear-gradient(left, #f87a30, #ff9b78);
        border-radius: 2px;
    }


    /* #tbl  {
        border: rgb(42, 77, 77) solid 1px;
    } */

    #myInput {
        color: #00c2dc;
        /* background: transparent; */
        border: 1px solid #068b8d;
        border-radius: 2px;
        background-color: #068b8d2c;
        font-family: sans-serif, FontAwesome;
    }

    ::placeholder {
        color: #0e7279;
        opacity: 1;
        /* Firefox */
    }

    :-ms-input-placeholder {
        /* Internet Explorer 10-11 */
        color: #0e7279;
    }

    ::-ms-input-placeholder {
        /* Microsoft Edge */
        color: #0e7279;
    }

    .d_btn {
        text-align: center;
        padding: 3px;
        height: 100%;
        min-width: 50px;
        border: 1px solid #068b8d;
        background-color: #068b8d2c;
        color: #00c2dc;
        font-size: 11px;
        font-weight: bold;
        cursor: pointer;
    }

    .d_btn_dis {
        border: 1px solid #838383;
        background-color: #8383832c;
        color: #838383;
        cursor: not-allowed;
    }

    .detail_s {
        padding: 0px;
        width: 100%;
        margin: auto;
    }

    .detail_s .number {
        font-size: 6vh;
        line-height: 0.9;
        font-weight: bold;
        color: #00c2dc;
        width: 100%;
        text-align: center;
    }

    .detail_s .name {
        font-size: 12px;
        color: #00c2dc;
        width: 100%;
        text-align: center;
    }

    .detail_s .uncheck {
        color: #f4eb96;
    }

    .detail_s .check {
        color: #3bdbc0;
    }

    .detail_s .abnormal {
        color: #ff9b78;
    }

    .detail_s .progressBar {
        width: 100%;
        text-align: center;
    }

    #tbl_title,
    #totalForm {
        color: #8ce5ff;
        font-weight: 500;
        font-size: 16px;
    }

    .btn_detail {
        background: repeating-linear-gradient(90deg, #016f71, #4CAF50 60px);
        border: tomato;
        border-radius: 6px;
        margin: 5px;
    }

    /* .icon_detail{
        cursor: pointer;
    } */

    .icon_detail:hover {
        cursor: pointer;
        color: #85e1ae;
        /* font-size: 16px; */
    }

    .no_data {
        text-align: center;
        position: absolute;
        top: 45%;
    }


    .fade {
        opacity: 1;
    }

    #statistic-data-check-qr th {
        position: sticky;
        top: 0;
    }

    #statistic-data-check-qr th:first-of-type,
    #statistic-data-check-qr td:first-of-type {
        left: 0;
        position: sticky;
        background: #0e273e;
        z-index: 3;
        border: 1px solid #686868;

    }

    #statistic-data-check-qr {
        /* z-index: 1;
        background: #04111e; */
        border: 1px solid #f9f9f9 !important;
    }


    #statistic-data-check-qr {
        border-color: cornflowerblue;
        margin: auto;
        margin-bottom: 3px;
    }

    #statistic-data-check-qr tbody td {
        padding: 3px;
        text-align: center;
        border: 1px solid #686868;
    }

    #statistic-data-check-qr tbody {
        color: white;
    }

    #statistic-data-check-qr thead th {
        min-width: 100px;
        padding: 3px;
        text-align: center;
        border: 1px solid #686868 !important;
        /* border-color: cornflowerblue; */
    }

    #statistic-data-check-qr thead tr {
        color: white;
    }

    .value-step {
        text-align: center;
    }

    .txt-color-success {
        color: #00ec36;
    }

    .modal-content {
        background: #04111e;
        /* box-shadow: 0 0px 6px 0 #ffffff; */
        border: 1px solid #f9f9f9;
    }

    .card-body {
        background: #04111e;
        /* background: #ffffff00; */
        padding: 0.5rem 1rem 0.5rem 1rem;
    }

    .card {
        background: #4a53521a;
        margin-bottom: 0;
    }

    .modal-header {
        background: #f1f1f11f;
        border: 0;
    }

    .modal-footer {
        background: #f1f1f11f;
        border: 0;
    }

    #name_form {
        color: #9cfeff;
    }

    .head-table .clear-view {
        color: #f1f1f1;
    }

    .modalQr-code .clear-view {
        color: aquamarine;
    }

    .bar_charts {
        float: left;
    }

    .item_bar {
        border: #068b8d solid 1px;
        border-radius: 6px;
        cursor: pointer;
        margin: 0 4px;
        width: fit-content;
        padding: 2px 4px;
    }

    .item_bar:hover {
        /* border: #068b8d solid 1px; */
        background-color: rgba(0, 74, 97, 0.356);
    }

    .item_bar_active {
        border: #ffffff solid 1px;
        background-color: rgba(0, 74, 97, 0.356);
        color: #00c2dc;
    }

    .highcharts-figure,
    .highcharts-data-table table {
        min-width: 100%;
        max-width: 100%;
        margin: 1em auto;
    }

    .highcharts-data-table table {
        font-family: Verdana, sans-serif;
        border-collapse: collapse;
        border: 1px solid #ebebeb;
        margin: 10px auto;
        text-align: center;
        width: 100%;
        max-width: 500px;
    }

    .highcharts-data-table caption {
        padding: 1em 0;
        font-size: 1.2em;
        color: #555;
    }

    .highcharts-data-table th {
        font-weight: 600;
        padding: 0.5em;
    }

    .highcharts-data-table td,
    .highcharts-data-table th,
    .highcharts-data-table caption {
        padding: 0.5em;
    }

    .highcharts-data-table thead tr,
    .highcharts-data-table tr:nth-child(even) {
        background: #f8f8f8;
    }

    .highcharts-data-table tr:hover {
        background: #f1f7ff;
    }

    /* .highcharts-figure,
    .highcharts-data-table table {
        min-width: 310px;
        max-width: 800px;
        margin: 1em auto;
    } */

    #chart-by-team {
        height: 400px;
    }

    .loader {
        display: block;
        position: fixed;
        z-index: 1000;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background: rgba(10 10 10 / 22%) url('/paperless/assets/images/loadingg.gif') 50% 50% no-repeat;
    }

    .css-time-span {
        width: 220px;
        margin-top: 5px;
    }

    .content {
        width: 99vw;
        height: 99vh;
        padding: 0 0 0 10px;
    }

    @media only screen and (min-width: 960px) and (max-width: 1024px) {
        body {
            font-size: 11px !important;
        }

        .css-time-span {
            width: 147px;
            margin-top: 0px;
        }

        .detail_s .name {
            font-size: 11px;
        }

        .detail_s .number {
            font-size: 3vh;
        }

        .tableFixHead {
            height: 81%;
        }
    }
</style>
<div class="loader"></div>

<!-- <body> -->
    <div class="header col-md-12 p-0" style=" height: 10vh">
        <div class="header1">
            <img src="/paperless/assets/images/checklist/header1.png" alt="" width="100%" height="40px"
                style="height: 5.8vh;">
            <div class="row header_in">
                <div class="col-md-4" style="top: 1vh">
                    <div class="row btn-h1">
                        <div class="col-md-2"></div>
                        <!--<div class="col-md-1" style="margin-left: 1.3rem;"> -->
                        <select id="btnBu" class="btn btn-primary btn-circle"></select>
                        <!-- </div> -->
                        <!-- <div class="col-md-1" style="margin-left: 1.3rem;"> -->
                        <select id="select-factory" class="btn btn-primary"
                            style="margin-left: 20px;"></select>
                        <!-- </div> -->
                        <div class="col-md-1 dropdown d-none" style="margin-left: 1.3rem;">
                            <select id="select-team" class="dropbtn btn btn-primary btn-circle">TEAM</select>
                        </div>
                    <div style="margin-left: 1.3rem;">
                            <button class="btn btn-primary btn__fullscreen--in" onclick="goFullScreen()"><i class="fas fa-expand"></i></button>
                            <button class="btn btn-primary btn__fullscreen--out d-none" onclick="goOutFullScreen()"><i class="fas fa-compress"></i></button>
                    </div>    
                    </div>
                </div>
                <div class="col-md-4">
                    <h5 class="text">
                        <!-- Paperless Checklist Statistics -->
                        <spring:message code='paperless.checklist.statistic' />
                    </h5>
                </div>
                <div class="col-md-4 ad" style="top: 1vh; cursor: pointer;">
                    <div class="form-group right float-right py-1 px-4 d-none">
                        <span style="font-family: sans-serif;">Administrator</span>
                        <i class="fas fa-user-circle ml-1"> </i>
                    </div>
                    <!-- /.form group -->
                </div>
                <img style="position: relative; top: 2.5vh" src="/paperless/assets/images/checklist/header2mini.png"
                    alt="" width="100%">
            </div>
        </div>
        <!--End header1-->

        <!--Begins header2-->
        <!-- <div class="header2">
            <h6 class="text2"><b>FAI</b></h6>
        </div> -->
        <!--End header2-->
    </div>
    <div class="content">
        <div class="row">
            <div class="col-md-5" style="height: calc(60vh);float: left;">
                <div id="box-1" class="row" style="height: calc(58.8vh);">
                    <div class="col-md-12 no_data d-none" id="n_chart">
                        <span style="color: #8ce5ff; font-size: 3vh;"><i class="far fa-dizzy"></i><b> No
                                Data!</b></span>
                    </div>

                    <div class="col-md-12 m-3">
                        <div class="row mb-1" style="width: 99%;">
                            <div class="col-md-12">
                                <div style="float: left">
                                    <span style="color: #8ce5ff; font-size: 2.7vh;"><b id="factory_name">N/A
                                            Statistic</b></span>
                                </div>
                                <div style="float:right">
                                    <div class="input-group input-group-sm css-time-span">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text"><i class="far fa-calendar-alt"></i></span>
                                        </div>
                                        <input type="text" class="form-control form-control-sm float-right"
                                            id="reservation">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row"
                            style="background-color: #00414d00; width: 98%; color: #fff; border-radius: 6px;">
                            <div class="" style="overflow-x: auto; margin: auto; z-index: 999;">
                                <table id="tbl_item">
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="row" style="height: 42vh;">
                            <div class="col-md-7" style="float: left;">
                                <div class="w-100 p-0" style="margin: auto; height: 90%;" id="statistic"></div>
                                <!-- <button class="btn-show-total" onclick="showTotalChecked()">Total Checked</button> -->
                            </div>
                            <div class="col-md-5" id="chart_detail" style="float: left;margin: auto;">
                                <div class="row detail_s">
                                    <span id="number_check" class="number check">0</span>
                                    <span class="name check">
                                        <!-- Quantity Checked -->
                                        <spring:message code='quantityChecked' />
                                    </span>
                                    <span class="progressBar check_bar">
                                        <progress id="checked" value="0" max="100"></progress>
                                    </span>
                                </div>
                                <div class="row detail_s" style="margin-top: 20px;">
                                    <span id="number_uncheck" class="number uncheck">0</span>
                                    <span class="name uncheck" id="status_name_un">
                                        <!-- Quantity Unchecked -->
                                        <spring:message code='quantityChecked' />
                                    </span>
                                    <span class="progressBar uncheck_bar">
                                        <progress id="unchecked" value="0" max="100"></progress>
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div class="col-md-7 pl-0" style=" height: 60vh;float: left;">
                <div id="box-2" class="box2 mb-1" style="height: 29vh;">
                    <div class="col-md-12 no_data" id="n_box-2">
                        <span style="color: #8ce5ff; font-size: 3vh;"><i class="far fa-meh-rolling-eyes"></i><b> No
                                Data!</b></span>
                    </div>
                    <div class="row" style="padding-top: 5px; padding-left: 15px; width: 100%; height: 100%;"
                        id="department"></div>
                </div>
                <div id="box-2_1" class="box2" style="height: 29vh;">
                    <div class="col-md-12 no_data" id="n_box-2_1">
                        <span style="color: #8ce5ff; font-size: 3vh;"><i class="far fa-frown"></i><b> No
                                Data!</b></span>
                    </div>
                    <!-- <div class="row" style="padding: 5px; padding-left: 15px; width: 100%; height: 100%;" id="MEchecklist"> -->
                    <div class="row" style="padding: 5px; padding-left: 15px; width: 100%; height: 100%;"
                        id="chart-by-team">
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12" style="height: 29vh;">
                <div id="box-3" style="height: 29vh">
                    <div class="row" style="margin: auto;">
                        <div class="col-md-12 m-0 mb-2">
                            <div class="float-left">
                                <span id='tbl_title'></span>
                                <span class="ml-2" id="totalForm"></span>
                            </div>
                            <div class="float-left" style="margin-left: 20px;">
                                <img src="/paperless/assets/images/icon_loading.gif" width="25px" height="25px"
                                    id="icon_loading" style="margin-right: 16px;" class="icon-loading d-none">
                            </div>
                            <input class="float-right ml-2" type="text" id="myInput" onkeyup="myFunction()"
                                placeholder="Search..." title="Type in a name">
                            <div class="float-right d_btn d_btn_dis">
                                <!-- By Paperless Type -->
                                <spring:message code='by' />-<spring:message code='paperlessType' />
                            </div>
                            <div class="float-right d_btn d_btn_dis"><spring:message code='by' />-<spring:message code='me.chu_ki_check' /></div>
                            <div class="float-right d_btn" onclick="window.location.href='/paperless/me-status-line'">
                                <!-- By
                                Line -->
                                <spring:message code='by' />-<spring:message code='qrcode.line' />
                            </div>
                            <div class="float-right d_btn d_btn_dis">All</div>
                        </div>
                    </div>
                    <div class="tableFixHead">
                        <table class="" id='tbl'>
                            <thead style="text-align: center;">
                                <th style="min-width: 30px;">#</th>
                                <th>
                                    <!-- QR Code -->
                                    <spring:message code='home.qr_code' />
                                </th>
                                <th>
                                    <!-- Line -->
                                    <spring:message code='qrcode.line' />
                                </th>
                                <th>
                                    <!-- Checklist name -->
                                    <spring:message code='checklistName' />
                                </th>
                                <th style="min-width: 165px;">
                                    <!-- Frequency -->
                                    <spring:message code='me.chu_ki_check' />
                                </th>
                                <!-- <th style="min-width: 80px;">Action</th> -->
                            </thead>
                            <tbody id="myTable" style="color: #daf9f7; text-align: center;">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="modal-detail">
        <div class="modal-dialog modal-dialog-centered" style="max-width: 93%;">
            <div class="modal-content">
                <div class="modal-header p-2">
                    <h5 class="modal-title" id="name_form" style="line-height: 1.1;">
                         <!-- Detail Checklist -->
                         <spring:message code='paper.detail.checklist' />
                    </h5>
                </div>

                <!-- <div class="card" style="max-height: 78vh;"> -->
                <div class="card">
                    <div class="card-header d-none">
                        <h3 class="card-title" id="detail-name-form"></h3>
                        <div class="card-tools">
                            <button style="font-size: 15px; border: 0px; background: #fff; padding: 3px 12px;"
                                id="btn-view-check" class="d-none"> <i class="fas fa-clipboard-check"></i></button>
                            <button id="btn-change-icon"
                                style="font-size: 15px; border: 0px; background: #fff; padding: 3px 12px;"
                                onclick="openNav()"> <i class="fas fa-expand-arrows-alt" id="icon1"></i></button>
                            <button
                                style="font-size: 15px; margin-right: 15px; border: 0px; background: #fff; padding: 3px 12px;"
                                id="btn-export"> <i class="fas fa-download"></i></button>
                        </div>
                    </div>
                    <div class="card-body" style="overflow-y: auto;">
                        <div class=" clear-view">
                            <div class="dialog-chart-statistic d-none row"></div>
                            <div class="dialog-chart-statistic d-none row"></div>
                            <div class="modalQr-code">
                                <div class="head-table">
                                    <div class="row clear-view" style="text-align: center; margin-top: 8px;">
                                        <div class="col-md-1"><b>
                                            <!-- Xưởng -->
                                            <spring:message code='me.factory' />
                                            : </b><span id="detail-factory"></span></div>
                                        <div class="col-md-2"><b>
                                            <!-- Tầng -->
                                            <spring:message code='me.floor' />
                                            : </b><span id="detail-floor"></span></div>
                                        <div class="col-md-2"><b>
                                            <!-- Chuyền -->
                                            <spring:message code='qrcode.line' />
                                            : </b><span id="detail-line"></span></div>
                                        <div class="col-md-2"><b>
                                            <!-- Chu kì kiểm tra -->
                                            <spring:message code='me.chu_ki_check' />
                                            : </b><span id="detail-cycle"></span>
                                        </div>
                                        <div class="col-md-3"><b>
                                            <!-- Mã thiết bị -->
                                            <spring:message code='home.qr_code' />
                                            : </b><span id="detail-qr"></span></div>
                                        <div class="col-md-2"><b>
                                            <!-- Thời gian -->
                                            <spring:message code='me.time_date' />
                                            : </b><span id="detail-time"></span>
                                        </div>
                                    </div>
                                </div>
                                <div style="overflow-x: scroll; margin:8px 0px;">
                                    <table id="statistic-data-check-qr" border="1">
                                        <thead></thead>
                                        <tbody></tbody>
                                    </table>
                                </div>
                                <p class="clear-view" style="margin-bottom: 8px; text-align: right; margin-right: 8px;">
                                    <b>
                                        <!-- Mã biểu -->
                                        <spring:message code='paper.code' />
                                        : </b><span id="detail-form-code"></span></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer p-1">
                    <button type="button" class="btn btn-danger btn-sm" data-dismiss="modal"
                        style="margin-right: 5px;"><i class="fa fa-times"></i> 
                        <!-- Close -->
                        <spring:message code='close' />
                    </button>
                </div>

            </div>
        </div>
        <div class="view-image" id="view-image"></div>
<!-- </body> -->

<!-- <script src="/paperless/assets/plugins/highchart/modules/highstock.js"></script> -->
<script src="/paperless/assets/plugins/highchart/themes/dark-unica.js"></script>
<script>
    
let isLoading = true;


function goFullScreen() {
    var elem = document.documentElement; 

    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }

    $('.btn__fullscreen--out').removeClass('d-none');
    $('.btn__fullscreen--in').addClass('d-none');
    $('iframe').addClass('iframe--full');
}

function goOutFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }

    $('.btn__fullscreen--in').removeClass('d-none');
    $('.btn__fullscreen--out').addClass('d-none');
    $('iframe').removeClass('iframe--full');
}

    const _state={
        idFac:null,
        nameFactory:null,
        id_flag:null,
        teamId:null,
        id_type:null,
        nameTeam:null,
        sDate:null,
        nameCheck:null,
        formTimeout: null,
    }

    var sBu = searchParams('nameBU');
    var idFactory = searchParams('id-bu');  
    
    var dataset = {};
    var count = 1

    var get_session = window.sessionStorage.getItem('dataset');
    if (get_session != undefined) {
        dataset = JSON.parse(get_session);
    }

    var timeTitle = '';
    var temp_selection;
    var tempFLag = "";
    var idBu = (dataset.idBu != undefined ? dataset.idBu : "");
    // var sbuName = (dataset.sbuName != undefined ? dataset.sbuName : "");
    var status_name = '<spring:message code="needed.check" /> ';
    var status_name_chart = "<spring:message code='needed.check' /> ";
    var flag_id_value = "1";
    _state.id_flag = flag_id_value;

    $("#status_name_un").html(status_name);

    function init() {
        requestGetSbuName();
    }

    function requestGetSbuName() {
        $(".loader").removeClass("d-none");

        $.ajax({
            type: "GET",
            url: "/paperless/api/v2/get_list_bu",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                $(".loader").addClass("d-none");

                var status = response['status'];
                var data = response['data'];
                var message = response['message'];
                var total = response['total'];
                if (total > 0) {
                    var htmlBu = "";
                    // $('#btnBu').html(htmlBu);
                    for (var i = 0; i < data.length; i++) {
                        htmlBu += '<option value="' + data[i] + '">' + data[i] + '</option>';
                    }
                    // sbuName = (sbuName != '' ? sbuName : data[0]);
                    $('#btnBu').html(htmlBu);
                    // $('#btnBu').val(sbuName);

                    if (sBu != null) {
                        $("#btnBu [value=" + sBu + "]").attr("selected", true);
                        getFactory(sBu);
                    } else {
                        $("#btnBu [value=" + data[0] + "]").attr("selected", true);
                        getFactory(data[0]);
                    }

                } else {
                    console.log("No data factory line.");
                }
            },
            failure: function (error) {
                $(".loader").addClass("d-none");

                console.log(error);
            }
        });
    }


    $("#btnBu").change(function () {
        isLoading = true;
        // sbuName = $("#btnBu").find("option:selected").val();
        // sbuName = $(this).val();
        // dataset.sbuName = $(this).val();
        // idBu = '';
        // var nameFactory = $("#btnBu").val();
        _state.nameFactory = $("#btnBu").val();
        getFactory(_state.nameFactory); 
    });


    function getFactory(nameFactory) {
        $(".loader").removeClass("d-none");

        // $('#select-factory').html('');
        $.ajax({
            type: "GET",
            url: "/paperless/api/v2/get_list_factory_with_group_line",
            data: {
                sbu_name: nameFactory
            },
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                $(".loader").addClass("d-none");

                var status = response['status'];
                var data = response['data'];
                var message = response['message'];
                var total = response['total'];
                if (total > 0) {
                    var htmlFactory = "";
                    for (var i = 0; i < data.length; i++) {
                        htmlFactory += '<option value="' + data[i]['id'] + '">' + data[i]['name'] + '</option>';
                    }
                    // idBu = (idBu != '' ? idBu : data[0]['id']);
                    $('#select-factory').html(htmlFactory);
                    // $('#select-factory').val(idBu);
                    
                    if (idFactory != null) {
                        $("#select-factory [value=" + idFactory + "]").attr("selected", true);
                        //  _state.idFac=idFactory
                        // loadItem(idFactory);

                        _state.idFac=idFactory;
                        loadItem(_state.idFac);

                    } else {
                        $("#select-factory [value=" + data[0]['id'] + "]").attr("selected", true);
                        _state.idFac = data[0]['id']
                        loadItem(_state.idFac)
                        // loadItem(data[0]['id']);
                    }

                    // if (idBu != null && idBu != '') {
                    // }
                } else {
                    alert("No data factory line!");
                }
                window.sessionStorage.setItem('dataset', JSON.stringify(dataset));
            },
            error: function (e) {
                $(".loader").addClass("d-none");
                var res = JSON.parse(e.responseText);
                alert(res.message);

            }
        });
    }


    $("#select-factory").change(function () {
        isLoading = true;
        // idBu = $("#select-factory").find("option:selected").val();
        // idBu = $(this).val();
        // dataset.idBu = $(this).val();
        var idFac = $("#select-factory").val();
        _state.idFac=idFac;
        console.log(_state.idFac);
        loadItem(idFac);
        window.sessionStorage.setItem('dataset', JSON.stringify(dataset));

    });


    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }

    Date.prototype.toString = function () {
        var date = new Date(this.valueOf());
        var year = date.getFullYear();
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        var hour = date.getHours().toString();
        hour = hour.length > 1 ? hour : '0' + hour;
        var minute = date.getMinutes().toString();
        minute = minute.length > 1 ? minute : '0' + minute;
        var second = date.getSeconds().toString();
        second = second.length > 1 ? second : '0' + second;
        var a = year + "-" + month + "-" + day;
        return a;
    }

    Date.prototype.toString2 = function () {
        var date = new Date(this.valueOf());
        var year = date.getFullYear();
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        var hour = date.getHours().toString();
        hour = hour.length > 1 ? hour : '0' + hour;
        var minute = date.getMinutes().toString();
        minute = minute.length > 1 ? minute : '0' + minute;
        var second = date.getSeconds().toString();
        second = second.length > 1 ? second : '0' + second;
        var a = day + "." + month;
        return a;
    }

    Date.prototype.calDayFromDateToDate = function (date) {
        const oneDay = 24 * 60 * 60 * 1000;
        var start = new Date(this.valueOf());
        var diffDay = Math.round(Math.abs((start - date) / oneDay));
        return diffDay;
    }

    function getTotalDayInMonth(timeSpan) {
        var startDate = timeSpan;
        var dateCheck = new Date(startDate);
        var feb = 28;
        if (dateCheck.getFullYear() * 1 % 4 == 0) {
            feb = 29;
        }
        var month = dateCheck.getMonth();
        var day = 30;
        switch (month) {
            case 0:
            case 2:
            case 4:
            case 6:
            case 7:
            case 9:
            case 11:
                day = 31;
                break;
            case 1:
                day = feb;
                break;
            default:
                day = 30;
                break;
        }
        return day;
    }

    function defaultItemTime(idStep, frmFlag, timeSpan) {
        var html = "";
        if (frmFlag == 1) {
            //DAY
            var totalDay = getTotalDayInMonth(timeSpan);
            for (var j = 1; j <= totalDay; j++) {
                var tmp = '';
                if (j < 10) {
                    tmp = '0' + j;
                } else tmp = j;
                html += '<td class="step' + idStep + '_' + tmp + '"></td>';
            }
        } else if (frmFlag == 2) {
            //week
            for (var j = 1; j <= 53; j++) {

                html += '<td class="step' + idStep + '_' + j + '"></td>';
            }
        } else if (frmFlag == 3) {
            //month
            for (var j = 1; j <= 12; j++) {
                html += '<td class="step' + idStep + '_' + j + '"></td>';
            }
        } else if (frmFlag == 4) {
            //quarter
            for (var j = 1; j <= 4; j++) {

                html += '<td class="step' + idStep + '_' + j + '"></td>';
            }
        } else if (frmFlag == 5) {
            //year
            var mDate = new Date();
            var yearStart = 2019;
            var yearEnd = mDate.getFullYear();
            for (var j = yearStart; j <= yearEnd; j++) {
                var tmp = '';

                html += '<td class="step' + idStep + '_' + j + '"></td>';
            }
        } else if (frmFlag == 7) {
            //shift

            var totalDay = getTotalDayInMonth(timeSpan);
            for (var j = 1; j <= totalDay; j++) {
                var tmp = '';
                if (j < 10) {
                    tmp = '0' + j;
                } else tmp = j;

                html += '<td class="step' + idStep + '_' + tmp + '_DAY"></td>'
                    + '<td class="step' + idStep + '_' + tmp + '_NIGHT"></td>';
            }
        } else if (frmFlag == 8) {
            //lession 4
            for (var j = 1; j <= 4; j++) {
                html += '<td class="step' + idStep + '_' + j + '"></td>';
            }
        }
        return html;
    }

    function getFormatDate(strDate) {
        var date = new Date(strDate);
        var year = date.getFullYear();
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        var hour = date.getHours().toString();
        hour = hour.length > 1 ? hour : '0' + hour;
        var minute = date.getMinutes().toString();
        minute = minute.length > 1 ? minute : '0' + minute;
        var second = date.getSeconds().toString();
        second = second.length > 1 ? second : '0' + second;

        var a = year + "/" + month + "/" + day + " 08:30:00";

        timeM = a;
        return a;
        // return time;
    }

    $('#reservation').daterangepicker({
        timePicker: true,
        timePickerIncrement: 7,
        singleDatePicker: true,
        locale: {
            format: 'YYYY/MM/DD HH:mm'
        }
    });

    var start = moment().format("YYYY/MM/DD HH:mm");
    $('#reservation').data('daterangepicker').setStartDate(start);

    var timeSpan = $('#reservation').val();

    $('#reservation').on('change', function () {
        timeSpan = this.value;
        init()
    });

    Date.prototype.getWeekNumber = function () {

        var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
        var dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
    };
    $("#reservation").change(function () {
        if (moment(new Date($('#reservation').val())).format("YYYY/MM/DD HH:mm") < moment(new Date()).format("YYYY/MM/DD HH:mm")) {
            status_name = "Quantity Unchecked";
            status_name_chart = "Unchecked";
        }
        else {
            var status_name = 'Needed Check ';
            status_name_chart = 'Needed Check';
        }
        $("#status_name_un").html(status_name);
        loadDateDf();
        // loadItem();
    });

    function getQuarter(d) {
        var m = Math.floor(d.getMonth() / 3) + 1;
        return m > 4 ? m - 4 : m;
    }

    function loadDateDf() {
        var sDate = $('#reservation').val();
        var date = new Date(sDate);
        var d = date.toString();
        //  var w = date.getWeekNumber();
        var oneJan = new Date(date.getFullYear(), 0, 1);
        var numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
        var w = Math.ceil((date.getDay() + 1 + numberOfDays) / 7);
        //    console.log("result---", result)
        var m = date.getMonth();
        var y = date.getFullYear();

        // var monthNames = ["January", "February", "March", "April", "May", "June",
        //     "July", "August", "September", "October", "November", "December"
        // ];
        var monthNames = ["1", "2", "3", "4", "5", "6",
            "7", "8", "9", "10", "11", "12"
        ];
        $("#time_1").html(" " + d.slice(8,) + "");
        $("#time_2").html(" " + w + "");
        $("#time_3").html(" " + monthNames[m] + "");
        $("#time_4").html(" " + getQuarter(date) + "");
        $("#time_5").html(" " + y + "");
        $("#time_7").html(" " + "DAY" + "");
    }

    function loadItem(idFac) {
        $(".loader").removeClass("d-none");

        $('#tbl_item>tbody').html('');
        $.ajax({
            type: 'GET',
            url: '/paperless/api/v2/get_flag_by_bu',
            data: {
                idBu: idFac,
            },
            success: function (res) {
                $(".loader").addClass("d-none");

                var data = res['data'];
                var html = '<tr>';

                for (i in data) {
                    html += '<td class="td_item">' +
                        '<div class="bar_charts item_bar" id="flag_' + data[i].id_flag + '">' +
                        '<div class="bar_charts text-center pl-0 w-100">' +
                        '<span class="f"><b>' + data[i].name + '</b> </span>' +
                        '<span class="t" id="time_' + data[i].id_flag + '"></span><br>' +
                        '<span class="t" id="total_' + data[i].id_flag + '"></span>' +
                        '</div>' +
                        '</div></td>';
                }
                html += '</tr>';
                $('#tbl_item>tbody').html(html);
                itemBarClick();
                loadDateDf();

                if (data != null) {
                    if (_state.id_flag) {
                        $("#flag_" + _state.id_flag).addClass('item_bar_active');
                    } else {
                        $("#flag_" + data[0].id_flag).addClass('item_bar_active');
                        
                        _state.id_flag = data[0].id_flag;
                    }
                    // getDataPaperless(data[0].id_flag);
                    // _state.id_flag = data[0].id_flag;
                    // getDataPaperless(data[0].id_flag)
                    getDataPaperless(_state.id_flag)
                }

                $("#factory_name").html($("#select-factory").find("option:selected").html() + ' Statistic');
            }, error(error) {
                $(".loader").addClass("d-none");
                clearInterval(window.autoReloadTimeout)
            }
        });
    }


    // var dataTEST = []
    function getDataPaperless(id_flag) {
        // console.log("id_flag---", id_flag)
        $(".loader").removeClass("d-none");

        if (id_flag == null) {
            var idFlag = 1;
        } else {
            var idFlag = id_flag;
        }
        var sDate = $('#reservation').val();
        var title = ' <spring:message code="department.statistic" /> - ' + sDate + tempFLag;
        $.ajax({
            type: 'GET',
            url: '/paperless/api/v2/statistic/get_data_statistic_bu_team_v2',
            data: {
                id_bu: $("#select-factory").val(),
                id_flag: idFlag,
                time_span: sDate,

            },
            success: function (res) {
                $(".loader").addClass("d-none");

                var data = res['data'];
                // dataTEST = data
                var tmpData = [{
                    name: "Report",
                    data: []
                }];
                if (data == null) {
                    alert("No Data!");
                    $("#n_box-2_1 span").html('<i class="far fa-frown"></i><b> No Data!</b>');
                    $("#chart_detail").addClass("d-none");
                    $("#statistic").addClass("d-none");
                    $("#department").addClass("d-none");
                    $("#chart-by-team").addClass("d-none");
                    $("#tbl>tbody").html('<tr><td colspan="6"><i class="far fa-smile-beam"></i> No Data!</td></tr>');
                    $("#tbl_title").html('No Data!');
                    $("#n_chart").removeClass('d-none');
                    $("#n_box-2_1").removeClass('d-none');
                    $("#n_box-2").removeClass('d-none');
                } else {

                    $("#chart_detail").removeClass("d-none");
                    $("#statistic").removeClass("d-none");
                    $("#department").removeClass("d-none");
                    $("#chart-by-team").removeClass("d-none");
                    $("#n_chart").addClass('d-none');
                    $("#n_box-2").addClass('d-none');
                    $("#n_box-2_1").addClass('d-none');

                    var sum = data.check + data.un_check;
                    var dataDepartment = data.teams;
                    var objData = {};
                    var team_id = [];

                    var categories = [];
                    var series = [];
                    var d_checked = [];

                    var percent_check = [];
                    var percent_uncheck = [];

                    var d_unchecked = [];
                    // var sl_check =[]
                    // var d_abnormal = [];

                    for (i in dataDepartment) {
                        team_id.push(dataDepartment[i].team_id);
                        categories.push(dataDepartment[i].team_name);
                        d_checked.push(dataDepartment[i].check);
                        d_unchecked.push(dataDepartment[i].un_check);
                        // d_abnormal.push(dataDepartment[i].abnormal);
                        percent_check.push(dataDepartment[i].percent_check);
                        percent_uncheck.push(100 - dataDepartment[i].percent_check)
                         _state.teamId=team_id;
                    }
                    // console.log("percent_check: ", percent_check);
                    // console.log("percent_uncheck: ", percent_uncheck)

                    objData[0] = {
                        "categories": categories,
                        "teamId": team_id
                    };
                   
                    var df1 = 'check';
                    var df2 = objData[0].teamId[0];
                    var df3 = '<spring:message code="me.checked" />';
                    var df4 = objData[0].categories[0];

                    tmpChecked = {
                        name: "<spring:message code='me.checked' />",
                        y: data.check,
                        events: {
                            click: function (event) {
                            }
                        },
                        sl: d_checked,
                        enableMouseTracking: false
                    }

                    tmpUnchecked = {
                        name: status_name_chart,
                        y: data.un_check,
                        events: {
                            click: function (event) {
                            }
                        },
                        sl: d_unchecked,
                        enableMouseTracking: false
                    }

                    $('#number_check').html(data.check);
                    document.getElementById("checked").value = (data.check / sum) * 100;

                    $('#number_uncheck').html(data.un_check);
                    document.getElementById("unchecked").value = (data.un_check / sum) * 100;

                    tmpData[0]['data'].push(tmpChecked);
                    tmpData[0]['data'].push(tmpUnchecked);
                    loadHightchart(tmpData);

                    var dataChecked = {
                        name: "<spring:message code='me.checked' />",
                        data: percent_check,
                        id_data: 'check',
                        sl: d_checked,
                    };
                    var dataUnhecked = {
                        name: status_name_chart,
                        data: percent_uncheck,
                        id_data: 'un_check',
                        sl: d_unchecked,
                    };

                    series.push(dataUnhecked);
                    series.push(dataChecked);
                    // console.log("series: ", series)
                   
                    loadDepartment(objData, series, title, id_flag, sDate);
                    _state.teamId = data["teams"][0].team_id;
                    // _state.id_flag = id_flag;
                    _state.id_type = 1;
                    _state.nameTeam = data["teams"][0].team_name;
                    _state.sDate = sDate;
                    // getMEchecklist(data["teams"][0].team_id, id_flag, 1, data["teams"][0].team_name);
                    getMEchecklist(_state.teamId,_state.id_flag,_state.id_type,_state.nameTeam)
                    count = 1
                    loadDataFormChecked(_state.id_flag,_state.teamId,_state.sDate)
                    // loadDataFormChecked(id_flag, data["teams"][0].team_id, sDate);
                }
            },
            error:function(){
                clearInterval(window.autoReloadTimeout)
            }
        })
    }

    function loadHightchart(tmpData) {
        Highcharts.chart('statistic', {
            colors: ['#3bdbc0', '#f4eb96'],
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                backgroundColor: '#fff0',
                borderColor: "#4572A7",
                margin: [0, 0, 0, 0]
            },

            title: {

                text: 'aaaa',
                style: {
                    enabled: false,
                    color: '#daf9f7',
                    fontSize: "0px"
                }
            },
            tooltip: {
                // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
                backgroundColor: '#063052db',
                valueSuffix: '',
                style: {
                    color: '#fff',
                }
            },
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: false,
                    cursor: 'auto',
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}<br> {point.percentage:.1f}%',
                        connectorColor: 'silver',
                        distance: "15",
                        color: '#ffff',
                        style: {
                            fontWeight: 'none',
                            textOverflow: 'clip',
                            textOutline: '0',
                        },
                    },
                }
            },
            navigation: {
                buttonOptions: {
                    height: 14,
                    width: 14,
                    symbolSize: 8,
                    symbolX: 7,
                    symbolY: 7,
                    symbolStrokeWidth: 1
                }
            },
            credits: {
                enabled: false
            },
            series: tmpData
        });
    }

    // var obj = []
    function loadDepartment(objData, series, title, id_flag, sDate) {
        // console.log("series-----: ", series)

        // obj = objData
        Highcharts.chart('department', {
            colors: ['#f4eb96', '#3bdbc0'],
            // [0, 1, 2] | 0: abnomal, 1: uncheck, 2: check
            chart: {
                type: 'column',
                backgroundColor: '#fff0',
            },
            title: {
                text: title,
                style: {
                    fontWeight: 'bold',
                    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',
                    color: '#8ce5ff',
                    fontSize: "2.7vh",
                }
            },
            xAxis: {
                categories: objData[0].categories,
                labels: {
                    style: {
                        color: '#FFF',
                        // fontSize: "14px",
                    },

                },
                gridLineWidth: 0,
                minorGridLineWidth: 0,
                tickLength: 0,
                tickWidth: 0,
            },
            yAxis: {
                min: 0,
                gridLineColor: '#023c37b3',
                title: {
                    text: ''
                },

                stackLabels: {
                    enabled: false,
                    style: {
                        fontWeight: 'bold',
                        color: ( // theme
                            Highcharts.defaultOptions.title.style &&
                            Highcharts.defaultOptions.title.style.color
                        ) || 'gray'
                    }
                },
                labels: {
                    format: '{value}%',
                    style: {
                        color: '#FFF',
                    },
                },
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderColor: '#78d4e1',
                borderWidth: 1,
                borderRadius: 6,
                backgroundColor: null,
                itemStyle: {
                    color: '#ffffff',
                    fontSize: "11px",
                    fontWeight: null
                },
                itemHoverStyle: {
                    color: '#FFF263',
                    fontSize: "11.5px",
                }
            },
            // tooltip: {
            //     headerFormat: '<b style="color: #FFF">{point.x}</b><br/>',
            //     pointFormat: '<span style="color: #FFF">{series.name}: {point.y}% ({series.sl}: {point.y}) </span><br/><span style="color: #FFF">Total: {point.stackTotal}%</span>',
            //     backgroundColor: '#063052db'
            // },

            tooltip: {
                formatter: function () {
                    return '<span>' + this.x + '<br>' + this.series.name + ': ' + this.y + '% (' + series[this.series.name == 'Checked' ? 1 : 0].sl[objData[0].categories.indexOf(this.x)] + ')</span>'
                }

            },

            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: false,
                        style: {
                            color: '#023c37b3',
                        },
                    }
                },
                series: {
                    borderColor: null,
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function () {
                                // console.log("test click")
                                //alert('Category: ' + this.category + ', value: ' + this.series.userOptions.id_data);
                                //alert(objData[0].teamId[this.x]);
                                // console.log("series:", this);

                                var id_type = this.colorIndex;
                                // console.log("id_type11111:", id_type);

                                // alert("id_type--------------------:", id_type);
                                temp_selection = '';
                                _state.teamId = objData[0].teamId[this.x];
                                // _state.id_flag =  id_flag;
                                _state.id_type = id_type;
                                _state.nameTeam = this.category;
                                // getMEchecklist(objData[0].teamId[this.x], id_flag, id_type, this.category);
                                getMEchecklist(_state.teamId,id_flag,_state.id_type,_state.nameTeam)
                                // console.log(this.series.userOptions.id_data + " | " + objData[0].teamId[this.x] + " | " + this.series.name + " | " + this.category + " | " + id_flag + " | " + id_type);
                                // console.log("this.category", this.category)
                                // console.log("this.category", this.category)

                                count = 1
                                if (id_type == 1) { //1 : checked
                                    _state.id_flag = id_flag;
                                    _state.teamId = objData[0].teamId[this.x];
                                    _state.sDate = sDate;
                                    _state.nameTeam = this.category;
                                    _state.nameCheck = this.series.name
                                    loadDataFormChecked(id_flag,_state.teamId,_state.sDate,_state.nameTeam,_state.nameCheck)
                                    // loadDataFormChecked(id_flag, objData[0].teamId[this.x], sDate, this.category, this.series.name);
                                } else {            //0: uncheck
                                    loadDataFormUnCheck(id_flag, objData[0].teamId[this.x], sDate, this.category, this.series.name);
                                }
                            }
                        }
                    }
                }
            },
            credits: {
                enabled: false
            },
            series: series
        });

    }

    function loadInfoQcc(idQcc) {
        $(".loader").removeClass("d-none");

        $.ajax({
            type: "GET",
            url: "/paperless/api/v1/get_info_qcc_by_id_qcc",
            data: {
                id_qcc: idQcc
            },
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                $(".loader").addClass("d-none");

                var data = response['data'];
                //console.log(data);
                $("#name_form").html(data[0]['fr_name']);
                $("#detail-form-code").html(data[0]['fr_code']);
                $("#detail-factory").html(data[0]['bu_name']);
                $("#detail-floor").html(data[0]['floor']);
                $("#detail-line").html(data[0]['line_name']);
                $("#detail-qr").html(data[0]['fr_code']);
                $("#detail-cycle").html(data[0]['fl_name']);
            },
            failure: function (errMsg) {
                console.log(errMsg);
                $(".loader").addClass("d-none");

            }
        });
    }

    function loadHeaderTime(frmFlag, timeSpan) {
        var thead = '<tr><th style="min-width: 500px;"><button class="d-none" style="font-size: 15px; border: 0px; background: #fff; padding: 3px 12px;" id="btn-view-chart"> <i class="fas fa-chart-line d-none"></i></button></th>';
        switch (parseInt(frmFlag)) {
            case 2:
                //week
                for (var i = 1; i <= 53; i++) {
                    thead += '<th>WK' + i + '<br><span style="font-weight: 400;" class="step_create_time_' + i + '"></span></th>';
                }
                break;
            case 3:
                //month
                for (var i = 1; i <= 12; i++) {
                    thead += '<th>' + i + '<br><span style="font-weight: 400;" class="step_create_time_' + i + '"></span></th>';
                }
                break;
            case 4:
                //quarter
                for (var i = 1; i <= 4; i++) {
                    thead += '<th>' + i + '<br><span style="font-weight: 400;" class="step_create_time_' + i + '"></span></th>';
                }
                break;
            case 5:
                //year
                var mDate = new Date();
                var yearStart = 2019;
                var yearEnd = mDate.getFullYear();
                for (var i = yearStart; i <= yearEnd; i++) {
                    thead += '<th>' + i + '<br><span style="font-weight: 400;" class="step_create_time_' + i + '"></span></th>';
                }
                break;
            case 6:
                //Lien tuc
                break;
            case 7:
                //Shift
                var totalDay = getTotalDayInMonth(timeSpan);
                var thead = '<tr><th rowspan="2" style="min-width: 500px; width: 500px;"></th>';
                for (var i = 1; i <= totalDay; i++) {
                    thead += '<th colspan="2">' + i + '</th>';
                }
                thead += '</tr><tr>';
                for (var i = 1; i <= totalDay; i++) {
                    thead += '<th>D</th><th>N</th>';
                }
                thead += '</tr>';
                break;
            case 8:
                //Lession 6h
                // for (var i = 1; i <= 4; i++) {
                //     thead += '<th>' + i + '</th>';
                // }
                thead += '<th>白班/Ca ngày<br>第一節 Tiết 1<br>07:30-13:30</th>' +
                    '<th>白班/Ca ngày<br>第二節 Tiết 2<br>13:30-19:300</th>' +
                    '<th>晚班/Ca Đêm<br>第一節 Tiết 1<br>19:30-01:30</th>' +
                    '<th>晚班/Ca Đêm<br>第二節 Tiết 2<br>01:30-07:30</th>';
                break;
            default:
                //Day
                var totalDay = getTotalDayInMonth(timeSpan);
                for (var i = 1; i <= totalDay; i++) {
                    thead += '<th>' + i + '</th>';
                }
                break;
        }
        thead += '</tr>';
        $("#statistic-data-check-qr thead").html(thead);
    }

    function showDataStatistic(qccId, frmFlag, time) {
        $(".loader").removeClass("d-none");

        $("#detail-time").html(time);
        //$('#icon_loading_detail_qr').css("display", "block");
        $(".dialog-chart-statistic").html("");
        $.ajax({
            type: "GET",
            url: "/paperless/api/web/get_step_form_report_by_qr_code",
            data: {
                idQrCode: qccId
            },
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                $(".loader").addClass("d-none");

                var length = response.length;
                if (length > 0) {
                    loadHeaderTime(frmFlag, time);
                    var row = "";
                    for (var i = 0; i < length; i++) {
                        var defValue = defaultItemTime(response[i]['step_id'], frmFlag, time);
                        row += '<tr class="step-' + response[i]['step_id'] + '"><td class="fixed" style="text-align: left;"><span>[' + (i + 1) + '] ' + response[i]['step_name'] + '</span><input type="checkbox" name="cb-show-value" class="cb-show-value d-none" id-step="' + response[i]['step_id'] + '"></td>' + defValue + '</tr>'
                    }
                    var defValue = defaultItemTime("_create_user", frmFlag, time);
                    row += '<tr class="text-center bg-body-blue"><td style="text-align: left;" class="fixed bg-body-blue-first first-col first-col-td"><spring:message code="paperless.checklist.applicant" /></td>' + defValue + '</tr>';
                    var defValue = defaultItemTime("_signer_user", frmFlag, time);
                    row += '<tr class="text-center bg-body-blue"><td style="text-align: left;" class="fixed bg-body-blue-first first-col first-col-td"><spring:message code="signer" /></td>' + defValue + '</tr>';
                    $("#statistic-data-check-qr tbody").html(row);

                    // clickCbShowValue();
                    loadDataCheck(qccId, frmFlag, time);
                    loadInfoQcc(qccId);
                } else {
                    console.log("Data null");
                }
                $('#icon_loading_detail_qr').css("display", "none");
            },
            failure: function (errMsg) {
                $(".loader").addClass("d-none");
                console.log(errMsg);
                $('#icon_loading_detail_qr').css("display", "none");
            }
        });
    }

    var dataTest = [];
    function loadDataCheck(idQcc, frmFlag, timeSpan) {
        $(".loader").removeClass("d-none");

        var mDate = new getFormatDate(timeSpan);
        $.ajax({
            type: "GET",
            url: "/paperless/api/web/get_list_report_result_by_id_qr",
            data: {
                id_qr_code: idQcc,
                time_span: timeM + " - " + timeM
            },
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                $(".loader").addClass("d-none");

                var data = response['data'];
                dataTest = data
                var idsReport = [];

                if (frmFlag == 8) {
                    for (i in data) {
                        for (j in data[i]) {
                            console.log("j----", j) //==1
                            for (k in data[i][j]) {
                                console.log("k----", k)
                                var classStyle = "fas fa-times txt-color-error";
                                switch (data[i][j][k].value_check) {
                                    case 0:
                                        // classStyle = "fas fa-check txt-color-success";
                                        classStyle = "txt-color-success";
                                        break;
                                    case 2:
                                        //  classStyle = "fas fa-minus-circle node-txt-color-default";
                                        classStyle = "txt-color-default";
                                        break;
                                    default:
                                        //  classStyle = "fas fa-times txt-color-error";
                                        classStyle = "txt-color-error";
                                        break;
                                }
                                var status = '<span class="value-step ' + classStyle + '">' + data[i][j][k].value_content + '</span>' +
                                    // '<span data-toggle="tooltip" title="' + data[i][j][k].value_content + '"><i class="value-check ' + classStyle + '"></i></span>'+
                                    loadDataMedia(data[i][j][k]["media"]);
                                $('.step' + data[i][j][k].step_id + '_' + j + '').html(status);
                            }
                            $('.step_create_time_' + j).html(data[i][j][0]['time'].slice(0, 10));
                            $('.step_create_user_' + j).html(data[i][j][0]['id_card'] + '<br>' + data[i][j][0]['fullname']);
                            $('.step_signer_user_' + j).addClass(" signer_user_" + data[i][j][0]['rr_id']);
                            if (idsReport.indexOf(data[i][j][0]['rr_id']) == -1) {
                                idsReport.push(data[i][j][0]['rr_id']);
                            }
                        }
                    }
                }
                else if (frmFlag == 1) {
                    for (i in data) {
                        var convertTime = i.substring(8);
                        for (j in data[i]) {
                            var classStyle = "fas fa-times txt-color-error";
                            switch (data[i][j].value_check) {
                                case 0:
                                    classStyle = "fas fa-check txt-color-success";
                                    classStyle = "txt-color-success";
                                    break;
                                case 2:
                                    classStyle = "fas fa-minus-circle node-txt-color-default";
                                    classStyle = "txt-color-default";
                                    break;
                                default:
                                    classStyle = "fas fa-times txt-color-error";
                                    classStyle = "txt-color-error";
                                    break;
                            }
                            var status = '<span class="value-step ' + classStyle + '">' + data[i][j].value_content + '</span><span data-toggle="tooltip" title="' + data[i][j].value_content + '"><i class="value-check ' + classStyle + '"></i></span>' + loadDataMedia(data[i][j]['media']);
                            $('.step' + data[i][j].step_id + '_' + convertTime).html(status);
                        }
                        $('.step_create_time_' + convertTime).html(data[i][0]['time']);
                        $('.step_create_user_' + convertTime).html(data[i][0]['id_card'] + '<br>' + data[i][0]['fullname']);
                        $('.step_signer_user_' + convertTime).addClass(" signer_user_" + data[i][0]['rr_id']);
                        if (idsReport.indexOf(data[i][0]['rr_id']) == -1) {
                            idsReport.push(data[i][0]['rr_id']);
                        }
                    }
                }
                else if (frmFlag == 7) {
                    for (day in data) {
                        var convertTime = day.substring(8);
                        for (shift in data[day]) {
                            var item = data[day][shift];
                            for (var i = 0; i < item.length; i++) {
                                var classStyle = "fas fa-times txt-color-error";
                                switch (item[i].value_check) {
                                    case 0:
                                        classStyle = "fas fa-check txt-color-success";
                                        classStyle = "txt-color-success";
                                        break;
                                    case 2:
                                        classStyle = "fas fa-minus-circle node-txt-color-default";
                                        classStyle = "txt-color-default";
                                        break;
                                    default:
                                        classStyle = "fas fa-times txt-color-error";
                                        classStyle = "txt-color-error";
                                        break;
                                }
                                var status = '<span class="value-step ' + classStyle + '">' + item[i].value_content + '</span><span data-toggle="tooltip" title="' + item[i].value_content + '"><i class="value-check ' + classStyle + '"></i></span>' + loadDataMedia(item[i]['media']);

                                $('.step' + item[i].step_id + '_' + convertTime + "_" + shift).html(status);
                            }
                            $('.step_create_time_' + convertTime + "_" + shift).html(item[0]['time']);
                            $('.step_create_user_' + convertTime + "_" + shift).html(item[0]['id_card'] + '<br>' + item[0]['fullname']);
                            $('.step_signer_user_' + convertTime + "_" + shift).addClass(" signer_user_" + item[0]['rr_id']);

                            if (idsReport.indexOf(item[0]['rr_id']) == -1) {
                                idsReport.push(item[0]['rr_id']);
                            }
                        }
                    }
                }
                else {
                    for (i in data) {
                        console.log("i--------", i)
                        for (j in data[i]) {
                            var classStyle = "fas fa-times txt-color-error";
                            switch (data[i][j].value_check) {
                                case 0:
                                    classStyle = "fas fa-check txt-color-success";
                                    classStyle = "txt-color-success";
                                    break;
                                case 2:
                                    classStyle = "fas fa-minus-circle node-txt-color-default";
                                    classStyle = "txt-color-default";
                                    break;
                                default:
                                    classStyle = "fas fa-times txt-color-error";
                                    classStyle = "txt-color-error";
                                    break;
                            }
                            var status = '<span class="value-step ' + classStyle + '">' + data[i][j].value_content + '</span><span data-toggle="tooltip" title="' + data[i][j].value_content + '"><i class="value-check ' + classStyle + '"></i></span>' + loadDataMedia(data[i][j]['media']);

                            $('.step' + data[i][j].step_id + '_' + i).html(status);
                        }
                        $('.step_create_time_' + i).html(data[i][0]['time'].slice(0, 10));
                        $('.step_create_user_' + i).html(data[i][0]['id_card'] + '<br>' + data[i][0]['fullname']);
                        $('.step_signer_user_' + i).addClass(" signer_user_" + data[i][0]['rr_id']);
                        if (idsReport.indexOf(data[i][0]['rr_id']) == -1) {
                            idsReport.push(data[i][0]['rr_id']);
                        }
                    }
                }
                loadDataSigned(idsReport);
            }
        });
    }

    function loadDataSigned(dataRequest) {
        if (dataRequest.length > 0) {
            $.ajax({
                type: 'POST',
                url: "/paperless/api/v2/get_list_signer_by_ids_report",
                cache: false,
                data: JSON.stringify(dataRequest),
                contentType: "application/json; charset=utf-8",
                success: function (res) {
                    var status = res['status'];
                    var mess = res['message'];
                    var total = res['total'];
                    var data = res['data'];
                    if (total > 0) {
                        for (var i = 0; i < data.length; i++) {
                            var classSign = ".signer_user_" + data[i]['rrId'];
                            $(classSign).append(data[i]['idCard'] + " " + '<br>' + data[i]['fullName']);
                        }
                    }
                },
                error: function (e) {
                    alert(e.message);
                }
            });
        }
    }

    function loadDataMedia(mData) {
        var medias = JSON.parse(mData);
        var htmlMedia = "";
        if (medias.length > 0) {
            for (var i = 0; i < medias.length; i++) {
                htmlMedia += '<img data-enlargable src="/paperless/ws-data/images/' + medias[i] + '" width="30px" height="30px" class="img-enlargable" alt="Fail" id="img-data-' + i + '" onclick="zoomImage(' + i + ')">';
            }
        }
        return htmlMedia;
    }

    function showDetail(id_qcc, flag_id) {
        if (flag_id == 6) {
            var timeSpan = $('#reservation').val();
            showDataStatistic6(id_qcc, flag_id, timeSpan);
            $('#modal-detail').modal("show");
            $(".content").css('filter', 'blur(8px)');
        } else {
            loadInfoQcc(id_qcc);
            var timeSpan = $('#reservation').val();
            loadHeaderTime(flag_id, timeSpan);
            showDataStatistic(id_qcc, flag_id, timeSpan);
            $('#modal-detail').modal("show");
            $(".content").css('filter', 'blur(8px)');
        }
    }

    $('#modal-detail').on('hidden.bs.modal', function () {
        $(".content").css('filter', 'none');
    });


    $('.MEchecklist').bind('click', function () {

        var chart = $('#container').highcharts(),
            series = chart.series[0],
            points = series.points;

        points[1].select(true, true);
        points[10].select(true, true);
    });

    function itemBarClick() {
        $('.item_bar').click(function () {
            isLoading = true;
            flag_id_value = $(this)[0].id.replace("flag_", "");
            _state.id_flag = flag_id_value;

            var dateN = new Date();
            var time = new Date().getHours() + ":" + new Date().getMinutes();
            var tSift = Date.parse(new Date(dateN) + " " + time);
            var defaultSift1 = Date.parse(new Date(dateN) + ' 19:30');
            var defaultSift2 = Date.parse(new Date(dateN) + ' 07:30');

            if (tSift < defaultSift1 && tSift >= defaultSift2) {
                var dateNow = moment(new Date()).format("YYYY/MM/DD ")
                var datePick = moment(new Date($('#reservation').val())).format("YYYY/MM/DD HH:mm");
            } else {
                var dateNow = moment(new Date()).format("YYYY/MM/DD ").add(-1, "days").format("YYYY/MM/DD HH:mm");
                var datePick = moment(new Date($('#reservation').val())).format("YYYY/MM/DD HH:mm");

            }

            switch (flag_id_value) {
                case '1':
                    if (datePick < dateNow) {
                        status_name = "Quantity Unchecked";
                        status_name_chart = "Unchecked";
                    }
                    else {
                        var status_name = 'Needed Check ';
                        status_name_chart = 'Needed Check';
                    }
                    break;
                case '2':
                    //week click item D/w/m/y/s
                    if (datePick.getFullYear < dateNow.getFullYear) {
                        status_name = "Quantity Unchecked";
                        status_name_chart = "Unchecked";
                    } else {
                        if (new Date(datePick).getWeekNumber() < new Date(dateNow).getWeekNumber()) {
                            status_name = "Quantity Unchecked";
                            status_name_chart = "Unchecked";
                        } else {
                            var status_name = 'Needed Check ';
                            status_name_chart = 'Needed Check';
                        }
                    }
                    break;
                case '3':
                    if (datePick.getFullYear < dateNow.getFullYear) {
                        status_name = "Quantity Unchecked";
                        status_name_chart = "Unchecked";
                    } else {
                        if (datePick.getMonth < dateNow.getMonth) {
                            status_name = "Quantity Unchecked";
                            status_name_chart = "Unchecked";
                        } else {
                            status_name = 'Needed Check ';
                            status_name_chart = 'Needed Check';
                        }
                    }
                    break;
                case '4':
                    if (datePick.getFullYear < dateNow.getFullYear) {
                        status_name = "Quantity Unchecked";
                        status_name_chart = "Unchecked";
                    } else {
                        if (getQuarter(new Date(datePick)) < getQuarter(new Date(dateNow))) {
                            status_name = "Quantity Unchecked";
                            status_name_chart = "Unchecked";
                        } else {
                            status_name = 'Needed Check ';
                            status_name_chart = 'Needed Check';
                        }
                    }
                    break;
                case '5':
                    if (datePick.getFullYear < dateNow.getFullYear) {
                        status_name = "Quantity Unchecked";
                        status_name_chart = "Unchecked";
                    } else {
                        status_name = 'Needed Check ';
                        status_name_chart = 'Needed Check';
                    }
                    break;
                case '7':
                    if (datePick.getFullYear < dateNow.getFullYear) {
                        status_name = "Quantity Unchecked";
                        status_name_chart = "Unchecked";
                    } else {
                        if (getQuarter(new Date(datePick)) < getQuarter(new Date(dateNow))) {
                            status_name = 'Quantity Unchecked ';
                            status_name_chart = 'Unchecked';
                        } else {
                            status_name = 'Needed Check ';
                            status_name_chart = 'Needed Check';
                        }
                    }
                    break;
                default:
                    break;
            }

            $("#status_name_un").html(status_name);
            temp_selection = '';
            var ft = $(".f").html() + $(".t").html();
            var arr_f = (this.id).split("_");
            tempFLag = " | " + $(this).children()[0].innerText.replace("\n\n\n", " ").trim();
            getDataPaperless(arr_f[1]);
            // _state.id_flag = arr_f[1];
            $("." + $(this).parent()[0].className).children().removeClass('item_bar_active');
            $(this).addClass('item_bar_active');
        });
    }

    function showDataStatistic6(qccId, frmFlag, timeSpan) {
        $("#detail-time").html(timeSpan);

        $(".dialog-detail-qr").css("display", "block");
        $('#icon_loading_detail_qr').css("display", "block");
        $.ajax({
            type: "GET",
            url: "/paperless/api/web/get_step_form_report_by_qr_code",
            data: {
                idQrCode: qccId
            },
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                var length = response.length;
                dataStep = response;
                if (length > 0) {
                    loadTitleContinuity(response);
                    loadDataByTime(qccId, timeSpan);
                    loadInfoQcc(qccId);
                } else {
                    console.log("Data null");
                }

                $('#icon_loading_detail_qr').css("display", "none");
            },
            failure: function (errMsg) {
                console.log(errMsg);

                $('#icon_loading_detail_qr').css("display", "none");
            }
        });
    }

    function loadTitleContinuity(res) {
        var thead = "<tr class='d-none'><th>Paper code: </th><th class='form_name'></th></tr>"
            + "<tr class='bg-head-blue text-center' id='row_created_at'><th style='width: 20vw'>Created At</th></tr>"
            + "<tr class='bg-head-blue text-center' id='row_employee'><th>Employee</th></tr>";
        var tbody = "";
        for (var i = 0; i < res.length; i++) {
            tbody += "<tr class='row_step_" + res[i].step_id + "'><th class='step'>[" + (i + 1) + "] " + res[i]['step_name'] + "</th></tr>";
        }
        tbody += "<tr class='row_signer'><th>Signer</th></tr>";
        tbody += "<tr'><td class='row_form_description' colspan='31'>Note: " + res[0].descriptionForm + "</td></tr>";
        $("#statistic-data-check-qr thead").html(thead);
        $("#statistic-data-check-qr tbody").html(tbody);
    }

    function loadRowData(idReport, position) {
        console.log(idReport);
        var rowReport = '';
        $("#statistic-data-check-qr thead tr#row_created_at").append("<th class='time_create" + idReport + "'></th>");
        $("#statistic-data-check-qr thead tr#row_employee").append("<th class='id_card" + idReport + "'></th>");
        for (var i = 0; i < dataStep.length; i++) {
            var idView = "re-" + idReport + "-" + dataStep[i]['step_id'];
            rowReport = "<td id='" + idView + "' class='step'></td>";
            $("#statistic-data-check-qr tbody tr.row_step_" + dataStep[i]['step_id']).append(rowReport);
        }
        $("#statistic-data-check-qr tbody tr.row_signer").append("<td class='signer_user_" + idReport + "'></td>");
        x
    }

    function loadDataByTime(idQcc, time) {
        var eDate = moment(time).add(-6, "days").format("YYYY/MM/DD") + ' 07:30:00';
        var sDate = moment(time).add(1, "days").format("YYYY/MM/DD") + ' 07:30:00';
        var timeSpan = eDate + ' - ' + sDate;
        $.ajax({
            type: "GET",
            url: "/paperless/api/v1/get_data_report_continuity_qcc",
            data: {
                id_qcc: idQcc,
                time_span: timeSpan
            },
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                var status = response['status'];
                var total = response['total'];
                var data = response['data'];
                var position = 0;
                if (total > 0) {
                    var idReports = [];
                    for (var idReport in data) {
                        loadRowData(idReport, ++position);
                        $(".time_create" + idReport).html(data[idReport][0]['rr_create_at']);
                        $(".id_card" + idReport).html(data[idReport][0]['u_id_card']);
                        for (var i = 0; i < data[idReport].length; i++) {
                            var idView = "#re-" + idReport + "-" + data[idReport][i]['rrs_id_step'];
                            $(idView).html(data[idReport][i]['rrs_content'] + loadDataMedia(data[idReport][i]['rrs_media']));
                        }
                        idReports.push(idReport);
                    }
                    loadDataSigned(idReports);
                }
            },
            failure: function (errMsg) {
                console.log(errMsg);
            }
        });
    }

    $(".ico-close-dialog").click(function () {
        $(".dialog-detail-qr").css("display", "none");
    })

    $(".ico-export-excel").click(function () {
        fnExcelReport();
    });

    function loadInfoQcc(idQcc) {
        $.ajax({
            type: "GET",
            url: "/paperless/api/v1/get_info_qcc_by_id_qcc",
            data: {
                id_qcc: idQcc
            },
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                var data = response['data'];
                // if(data.length > 0){
                $(".detail-name-form").html(data[0]['fr_name']);
                $("#detail-form-code").html(data[0]['fr_code']);
                $("#detail-factory").html(data[0]['bu_name']);
                $("#detail-floor").html(data[0]['floor']);
                $("#detail-line").html(data[0]['line_name']);
                $("#detail-qr").html(data[0]['qc_code']);
                $("#detail-cycle").html(data[0]['fl_name']);
                // }else{
                //     // Alert data null
                // }
                $(".form_name").html(data[0]['fr_name']);
            },
            failure: function (errMsg) {
                console.log(errMsg);
            }
        });
    }

    // var dataTest = []
    function getMEchecklist(teamId, id_flag, id_type, nameTeam) {
        clearInterval(window.autoReloadTimeout);
        // console.log("type--------", id_type)
        $(".loader").removeClass("d-none");
        var textType = ""
        $.ajax({
            type: "GET",
            url: "/paperless/api/v2/statistic/get_data_statistic_team_v2",
            data: {
                id_bu: $("#select-factory").val(),
                id_flag: id_flag,
                id_team: teamId,
                time_span: timeSpan,
            },
            contentType: "application/json; charset=utf-8",
            success: function (res) {
                var data = res['data'];
                var dataCheck = [];
                var dataCate = [];
                var dataUnCheck = [];
                var dataStartDate = []
                // var dataTotalQr = []

                if (res.status == 1 && res.total > 0) {
                    for (var itemDate in data) {
                        // dataTest = data
                        // console.log("itemData", data[itemDate].mData)
                        var item = {
                            key: itemDate,
                            // name: data[itemDate].team_name,
                            check: data[itemDate].mData.check,
                            uncheck: data[itemDate].mData.un_check,
                            date: data[itemDate].startDate
                        }
                        // console.log("item----", item)
                        dataCate.push(item.key);
                        dataCheck.push(item.check);
                        dataUnCheck.push(item.uncheck);
                        dataStartDate.push(item.date);
                        // dataTotalQr.push(item.qr);
                    }

                    // console.log("dataCate:", dataCate)
                    // console.log("dataCate:", dataCheck)
                    // console.log("dataCate:", dataUnCheck)
                    if (id_type == 1) {
                        loadDataHightChartByTeam(dataStartDate, dataCheck, dataCate, "#3bdbc0", "<spring:message code='me.checked' />", nameTeam, id_flag, teamId, 1);
                        textType = "<spring:message code='me.checked' />"
                    } else {
                        loadDataHightChartByTeam(dataStartDate, dataUnCheck, dataCate, "#f4eb96", "<spring:message code='needed.check' />", nameTeam, id_flag, teamId, 0);
                        textType = "<spring:message code='needed.check' />"

                    }
                    // console.log("dataTotalQR: ", dataTotalQr)
                    $(".loader").addClass("d-none");
                    $("#chart_detail").removeClass("d-none");
                    $("#statistic").removeClass("d-none");
                    $("#department").removeClass("d-none");
                    $("#chart-by-team").removeClass("d-none");
                    $("#n_chart").addClass('d-none');
                    $("#n_box-2").addClass('d-none');
                    $("#n_box-2_1").addClass('d-none');
                    $("#tbl_title").html(nameTeam + " (" + timeSpan + ") - " + textType)

                } else {
                    alert("No data");
                    $("#n_box-2_1 span").html('<i class="far fa-frown"></i><b> No Data!</b>');
                    $("#chart_detail").addClass("d-none");
                    $("#statistic").addClass("d-none");
                    $("#department").addClass("d-none");
                    $("#chart-by-team").addClass("d-none");
                    $("#tbl>tbody").html('<tr><td colspan="6"><i class="far fa-smile-beam"></i> No Data!</td></tr>');
                    $("#tbl_title").html('No Data!');
                    $("#n_chart").removeClass('d-none');
                    $("#n_box-2_1").removeClass('d-none');
                    $("#n_box-2").removeClass('d-none');
                }
            },
            failure: function (errMsg) {
                console.log(errMsg);
                $(".loader").addClass("d-none");
                clearInterval(window.autoReloadTimeout)
            },complete: function () {
            isLoading = false;
            if (!isLoading){
                window.autoReloadTimeout && clearInterval(window.autoReloadTimeout);
                window.autoReloadTimeout = setInterval(reloadData, 300000);
            }
        }
        });
    }


    function loadDataHightChartByTeam(mDate, mCheck, mCate, colorColum, nameCheck, nameTeam, idFlag, idTeam, idType) {
        // console.log("mDate: ", mDate)
        Highcharts.chart('chart-by-team', {
            chart: {
                type: 'column',
                backgroundColor: '#fff0',
            },
            title: {
                text: nameTeam + " (" + timeSpan + ") - " + nameCheck,
                style: {
                    fontWeight: 'bold',
                    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',
                    color: '#8ce5ff',
                    fontSize: "2.7vh",
                }
            },
            xAxis: {
                categories: mCate,
                labels: {
                    style: {
                        color: '#FFF',
                        // fontSize: "14px",
                    },
                },
                gridLineWidth: 0,
                minorGridLineWidth: 0,
                tickLength: 0,
                tickWidth: 0,
            },
            yAxis: {
                min: 0,
                gridLineColor: '#023c37b3',
                title: {
                    text: ''
                },

                stackLabels: {
                    enabled: false,
                    style: {
                        fontWeight: 'bold',
                        color: ( // theme
                            Highcharts.defaultOptions.title.style &&
                            Highcharts.defaultOptions.title.style.color
                        ) || 'gray'
                    }
                },
                labels: {
                    style: {
                        color: '#FFF',
                    },
                },
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderColor: '#78d4e1',
                borderWidth: 1,
                borderRadius: 6,
                backgroundColor: null,
                itemStyle: {
                    color: '#ffffff',
                    fontSize: "11px",
                    fontWeight: null
                },
                itemHoverStyle: {
                    color: '#FFF263',
                    fontSize: "11.5px",
                }
            },
            tooltip: {
                headerFormat: '<b style="color: #FFF">{point.x}</b><br/>',
                pointFormat: '<span style="color: #FFF">{series.name}: {point.y}</span><br/><span style="color: #FFF"><spring:message code="home.total" />: {point.stackTotal}</span>',
                backgroundColor: '#063052db'
            },

            plotOptions: {
                column: {
                    pointWidth: 40,
                    stacking: 'normal',
                    dataLabels: {
                        enabled: false,
                        style: {
                            color: '#023c37b3',
                        },
                    }
                },
                series: {
                    borderColor: null,
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function () {
                                // console.log("test click day by day")
                                var id_type = this.colorIndex;
                                count = 1
                                var dateTimeConvert = mDate[this.x].slice(0, 16).replaceAll("-", "/")
                                // getMEchecklist(this.series.userOptions.id_data, objData[0].teamId[this.x], this.series.name, this.category, id_flag, id_type);
                                if (idType == 1) {
                                    // _state.id_flag = idFlag;
                                    _state.teamId = idTeam;
                                    _state.sDate = dateTimeConvert;
                                    _state.nameTeam = nameTeam;
                                    _state.nameCheck = nameCheck
                                    loadDataFormChecked(idFlag,_state.teamId,_state.sDate,_state.nameTeam,_state.nameCheck);
                                    // loadDataFormChecked(idFlag, idTeam, dateTimeConvert, nameTeam, nameCheck);
                                } else {
                                    loadDataFormUnCheck(idFlag, idTeam, dateTimeConvert, nameTeam, nameCheck)
                                }
                                // console.log("series Date-----", mDate[this.x]);
                            }
                        }
                    }
                }
            },
            credits: {
                enabled: false
            },
            series: [{
                name: nameCheck,
                type: 'column',
                color: colorColum,
                data: mCheck,
                tooltip: {
                    valueSuffix: ''
                }

            },
                // {
                //     name: nameCheck,
                //     type: 'line',
                //     color: colorColum,
                //     data: mCheck,
                //     tooltip: {
                //         valueSuffix: ''
                //     }

                // }
            ]
        });

    }
    function loadDataFormUnCheck(idFlag, idTeam, sDate, nameTeam, nameCheck) {
        $(".icon-loading").removeClass("d-none");
        $.ajax({
            type: "GET",
            url: "/paperless/api/v2/statistic/get_qr_code_uncheck_data_statistic_bu_team_v2",
            data: {
                id_bu: $("#select-factory").val() * 1,
                id_flag: idFlag,
                id_team: idTeam,
                time_span: sDate,
            },
            contentType: "application/json; charset=utf-8",
            success: function (res) {
                $(".icon-loading").addClass("d-none");
                $("#tbl_title").html(nameTeam + " (" + sDate + ") - " + nameCheck)
                var data = res['data'];
                if (res.status == 1 && res.total > 0) {
                    bultTable(data);

                }
            },
            failure: function (errMsg) {
                console.log(errMsg);

            }
        });
    }

    function loadDataFormChecked(idFlag, idTeam, sDate, nameTeam, nameCheck) {
        $(".icon-loading").removeClass("d-none");
        $.ajax({
            type: "GET",
            url: "/paperless/api/v2/statistic/get_qr_code_checked_data_statistic_bu_team_v2",
            data: {
                id_bu: $("#select-factory").val() * 1,
                id_flag: idFlag,
                id_team: idTeam,
                time_span: sDate,
            },
            contentType: "application/json; charset=utf-8",
            success: function (res) {
                $(".icon-loading").addClass("d-none");
                $("#tbl_title").html(nameTeam + " (" + sDate + ") - " + nameCheck)
                var data = res['data'];
                if (data != null) {
                    if (res.status == 1 && res.total > 0) {
                        bultTable(data);
                    } else {
                        $("#tbl tbody").html('<tr><td colspan="6"><i class="far fa-smile-beam"></i> No Data!</td></tr>');
                        $("#totalForm").html(" - Total Checklist: 0")
                    }
                } else {
                    $("#tbl tbody").html('<tr><td colspan="6"><i class="far fa-smile-beam"></i> No Data!</td></tr>');
                }
             
            },
            failure: function (errMsg) {
            console.log(errMsg);
            }
        });
    }

    function reloadData() {
        if (isLoading) {
            console.log("loading");
            return; 
        }
        
        var currentTime = moment().format("YYYY/MM/DD HH:mm");
        $('#reservation').data('daterangepicker').setStartDate(currentTime);
        $('#reservation').val(currentTime);
        
        timeSpan = currentTime;
        _state.sDate = currentTime;
        
        loadItem(_state.idFac);
    }

    function bultTable(data) {
        var html = "";
        for (var i = 0; i < data.length; i++) {
            var mergeSn = data[i].qr_code

            var mergeBu = data[i].qr_id
            html += '<tr class="icon_detail" onclick="showDetail(' + data[i].qcc_id + ', ' + data[i].flag_id + ')">' +
                '<td class="sn sn-' + mergeBu + '" sn_name="' + mergeBu + '">' + (i + 1) + '</td>' +
                '<td class="bu bu-' + mergeBu + '" bu_name="' + mergeBu + '">' + data[i].qr_code + '</td>' +
                '<td style="white-space: nowrap; padding: 0 5px 0 5px;">' + data[i].line_name + '</td>' +
                '<td style="text-align: left" class="pl-2 pr-2">' + data[i].form_code + '&nbsp - &nbsp ' + data[i].form_name + '</td>' +
                '<td>' + data[i].description + '</td>' +
                '</tr>'
        }
        $("#tbl tbody").html(html);
        mergeRow("sn");
        mergeRow("bu");
    }
    const mergeRow = function (param) {
        var rowObj = {};
        var elem = document.getElementsByClassName(param);

        for (var i = 0; i < elem.length; i++) {
            var param_name = elem[i].getAttribute(param + '_name');
            // console.log("rowOBJ:", rowObj[param_name]);
            //  console.log("param_name:", param_name);

            //   rowObj.push(param_name)
            if (rowObj[param_name] == null) {
                rowObj[param_name] = 1;
                // console.log("rowOBJ 1:", rowObj[param_name]);

            } else {
                rowObj[param_name] += 1;
                // console.log("rowOBJ 2:", rowObj[param_name]);

            }
        }
        //   console.log("rowObj", rowObj);

        if (param != 'sn') {
            for (var i in rowObj) {
                $('.' + param + '-' + i + ':not(:first)').remove();  // da co remove r
                var param_first = document.getElementsByClassName(param + '-' + i);
                param_first[0].setAttribute("rowspan", rowObj[i]);
                // console.log("rowspan: ", rowObj[i])
                // console.log("paramlist.length: ", param_first.length)
                // console.log("paramlist[0]: ", param_first[0])
                // console.log("pram_first: " + rowObj[i], param_first)

                // for (var i = 1; i < param_first.length; i++) {
                //     param_first[i].remove();
                //     i--;
                // }
            }
        }
        else {
            for (var i in rowObj) {
                $('.' + param + '-' + i + ':not(:first)').remove();
                var param_first = document.getElementsByClassName(param + '-' + i);
                param_first[0].setAttribute("rowspan", rowObj[i]);
                // param_first[0].innerHTML = count;
                count++;
                // for (var i = 1; i < param_first.length; i++) {
                //     param_first[i].remove();
                //     i--;
                // }

            }
            $("#totalForm").html(" <spring:message code='total.Checklist' />: " + (count - 1))
        }
    }

    $('#view-image').click(function () {
        $(this).fadeOut();
        $('meta[name="viewport"]').attr('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0');
        // window.onpopstate = function (event) {
        //     event.preventDefault();
        // };
    })

    function zoomImage(index) {
        var src = $("#img-data-" + index).attr("src");
        $('#view-image').css({
            background: 'RGB(47,48,59) url(' + src + ') no-repeat center',
            backgroundSize: 'contain',
            width: '100%',
            height: '100%',
            position: 'fixed',
            zIndex: '10000',
            top: '0',
            left: '0',
            cursor: 'zoom_out',
            display: 'block'
        });

        $('meta[name="viewport"]').attr('content', 'width=device-width, initial-scale=1');
        history.pushState(null, null, location.href);
        window.onpopstate = function () {
            $('#view-image').css('display', 'none');
            $('meta[name="viewport"]').attr('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0');
            history.go(1);
            // window.onpopstate = function (event) {
            //     event.preventDefault();
            // };
        }
    }

    function searchParams(name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results == null) {
            return null;
        } else {
            return decodeURIComponent(results[1]) || 0;
        }
    }

    $(document).ready(function () {
        $("#myInput").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#myTable tr").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
        init();
    });
    // function reloadData(){
    //     if (!window.autoReloadInterval) {
    //     window.autoReloadInterval = setInterval(() => {
    //         loadItem(_state.idFac);
    //         getDataPaperless(_state.id_flag);
    //         getMEchecklist(_state.teamId,_state.id_flag,_state.id_type,_state.nameTeam);
    //         loadDataFormChecked(_state.id_flag, _state.teamId,_state.sDate, _state.nameTeam, _state.nameCheck);
    //     }, 7000);
    //     }
    // }

</script>
