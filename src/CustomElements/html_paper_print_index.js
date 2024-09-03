import i18n from "@/i18n";

function addStyles(win, styles) {
    styles.forEach(style => {
        let link = win.document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        link.setAttribute('href', style);
        win.document.getElementsByTagName('head')[0].appendChild(link);
    });
}

const VueHtmlToPaper = {
    install(Vue, options = {}) {
        Vue.prototype.$htmlToPaper = (el, title, localOptions, cb = () => true) => {
            let defaultName = '_blank',
                defaultSpecs = ['fullscreen=yes', 'titlebar=yes', 'scrollbars=yes'],
                defaultReplace = true,
                defaultStyles = []
            let {
                name = defaultName,
                specs = defaultSpecs,
                replace = defaultReplace,
                styles = defaultStyles
            } = options;

            // If has localOptions
            // TODO: improve logic
            if (!!localOptions) {
                if (localOptions.name) name = localOptions.name;
                if (localOptions.specs) specs = localOptions.specs;
                if (localOptions.replace) replace = localOptions.replace;
                if (localOptions.styles) styles = localOptions.styles;
            }
            specs = !!specs.length ? specs.join(',') : '';

            const element = window.document.getElementById(el);

            if (!element) {
                alert(`Element to print #${el} not found!`);
                return;
            }

            const url = '';
            const win = window.open(url, name, specs, replace);
            if (i18n.locale == 'fa') {
                win.document.write(`
         <html dir="rtl" > 
<!--         <meta name="viewport" content="width=device-width, initial-scale=1.0">-->
          <head>
            <title>${title}</title>
            <style>
      @media print{
         @page { 
                size: 10cm 8cm;
        
            }
          
     }
 /*       @media print{*/
 /*     body {*/
 /*-webkit-transform: rotate(-90deg); */
 /*    -moz-transform:rotate(-90deg);*/
 /*    filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=3);*/
 /*        }*/
 /*   */
 /*    }*/

             @media print {
  th{
  font-size: 12px;
  }
    body {
        min-width: 10px!important;
    }
    .container {
        min-width: 10px!important;
    }
  table {
        min-width: 10px!important;
    }
   
}
            </style>
          </head>
          <body style=";min-width: 20px!important;">
            ${element.innerHTML}
          </body>
        </html>
      `);

            }
            else {
                var htmmml = `
        <html > 
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <head>
            <title>${title}</title>
            <style>
       
           @media print {
   th{
  font-weight: 400!important;
  font-size: 12px!important;
  }
    body {
        min-width:10px!important;
    }
    table {
        min-width:10px!important;
    }
    .container {
        min-width:10px!important;
    }
  .table-bordered th, .table-bordered td {
    border: 2px solid;
    border-color: #000000;
}
}
            </style>
          </head>
          <body style="min-width: 20px!important;">
            ${element.innerHTML}
          </body>
        </html>
      `
                // console.log(htmmml)
                win.document.write(htmmml);

            }

            addStyles(win, styles);
            addStyles(win, styles);

            setTimeout(() => {
                win.document.close();
                win.focus();
                win.print();
                win.close();
                cb();
            }, 1000);

            return true;
        };


        //****************************************************************
        //****************************************************************
        //****************************************************************
        Vue.prototype.$htmlToPaperHeader = (el, header_id, footer_id, localOptions, cb = () => true) => {
            let defaultName = '_blank',
                defaultSpecs = ['fullscreen=yes', 'titlebar=yes', 'scrollbars=yes'],
                defaultReplace = true,
                defaultStyles = []
            let {
                name = defaultName,
                specs = defaultSpecs,
                replace = defaultReplace,
                styles = defaultStyles
            } = options;

            // If has localOptions
            // TODO: improve logic
            if (!!localOptions) {
                if (localOptions.name) name = localOptions.name;
                if (localOptions.specs) specs = localOptions.specs;
                if (localOptions.replace) replace = localOptions.replace;
                if (localOptions.styles) styles = localOptions.styles;
            }
            specs = !!specs.length ? specs.join(',') : '';

            const element = window.document.getElementById(el);
            const element_header = window.document.getElementById(header_id);
            const element_footer = window.document.getElementById(footer_id);
            if (!element) {
                alert(`Element to print #${el} not found!`);
                return;
            }
            if (!element_header) {
                alert(`Element to print #${header_id} not found!`);
                return;
            }
            if (!element_footer) {
                alert(`Element to print #${header_id} not found!`);
                return;
            }

            const url = '';
            const win = window.open(url, name, specs, replace);

            if (i18n.locale == 'fa') {
                win.document.write(`<html xmlns="http://www.w3.org/1999/xhtml" dir="rtl">
<head>
<style>

.page-header {
  position: fixed;
  top: 0mm;
  width: 100%;

}
svg{
display: none;
}
.page-footer {
     
  position: fixed;
  bottom: 0;
  width: 100%;
}
  
.page-header, .page-header-space {
  height: 50px;
}

.page-footer, .page-footer-space {
  height: 50px;
              page-break-before: always;

}
.page-footer-space {
  height: 50px;
            page-break-before: always;

}
.page {
  /*page-break-after: always;*/
/*page-break-inside: avoid;*/
/*-webkit-column-break-inside: avoid;*/
/*-webkit-break-inside: avoid;*/
}


   #pageFooter:after {
    left: 0; 
    top: 100%;
    white-space: nowrap; 
    z-index: 20;
    -moz-border-radius: 5px; 
    -moz-box-shadow: 0px 0px 4px #222;  
    background-image: -moz-linear-gradient(top, #eeeeee, #cccccc);  
  }

        #pageFooter
        {
            page-break-before: always;
            counter-increment: page;
        }
        #pageFooter:after
        {
            display: block;
            /*content: "Page " counter(page);*/
        }
        #pageFooter.first.page
        {
            page-break-before: avoid;
        }
@page {
  margin: 10mm;

}
footer {
            position: absolute; 
            margin-left: 190mm; 
        }
@media print {

   thead {display: table-header-group;} 
   tfoot {display: table-footer-group;}
 
   button {display: none;}
   
   body {
   margin: 0;

    }
}
</style>
</head>

<body>
  <div class="page-header" style="text-align: center">
                     ${element_header.innerHTML}
    <br/>
  
  </div>

  <div class="page-footer">
                     ${element_footer.innerHTML}
  </div>

  <table style="width: 100%">

    <thead>
      <tr>
        <td>
          <!--place holder for the fixed-position header-->
          <div class="page-header-space"></div>
        </td>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td>
          <!--*** CONTENT GOES HERE ***-->
         
          <div class="page"  id="page">
                               ${element.innerHTML}
          </div>
        </td>
      </tr>
    </tbody>

    <tfoot>
      <tr>
        <td >
          <!--place holder for the fixed-position footer-->
          <div class="page-footer-space"></div>
        </td>
      </tr>
    </tfoot>

  </table>
  <script>
// var  count = Math.round(document.body.clientHeight / 3508);
//     for (var i = 1; i <= count; i++) { 
page_number()
function page_number(){
      // document.getElementById("pageFooter").innerText+= '<label >adadasdasdasdasdasdasdasd' + i + '/' + count + '</label>';
    //
    // var xpath = "//a[text()='Page 1']";
// var matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      document.getElementById("pageFooter").innerText="salam";

}
    // }
</script>
</body>

</html>`);

            } else {

                win.document.write(`
        <html dir="ltr">

<head>
<style>
      #pageFooter:after {
    counter-increment: page;
    /*content:"Page " counter(page) ;*/
    left: 0; 
    top: 100%;
    white-space: nowrap; 
    z-index: 20;
    -moz-border-radius: 5px; 
    -moz-box-shadow: 0px 0px 4px #222;  
    background-image: -moz-linear-gradient(top, #eeeeee, #cccccc);  
  }
.page-header, .page-header-space {
  height: 50px;
}

.page-footer, .page-footer-space {
  height: 50px;

}
.page-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
}

.page-header {
  position: fixed;
  top: 0mm;
  width: 100%;
}

.page {
width: 100%;
  /*page-break-after: always;*/
}

@page {
  margin: 10mm
}

@media print {
   thead {display: table-header-group;} 
   tfoot {display: table-footer-group;}
   
   button {display: none;}
   
   body {margin: 0;}
}
</style>
</head>
<body>

  <div class="page-header" style="text-align: center">
                     ${element_header.innerHTML}
    <br/>
  
  </div>

  <div class="page-footer">
                     ${element_footer.innerHTML}
  </div>

  <table style="width: 100%">

    <thead>
      <tr>
        <td>
          <!--place holder for the fixed-position header-->
          <div class="page-header-space"></div>
        </td>
      </tr>
    </thead>

    <tbody >
      <tr >
        <td >
          <!--*** CONTENT GOES HERE ***-->
         
          <div class="page" style="line-height: 3;">
                               ${element.innerHTML}
          </div>
        </td>
      </tr>
    </tbody>

    <tfoot>
      <tr>
        <td>
          <!--place holder for the fixed-position footer-->
          <div class="page-footer-space"></div>
        </td>
      </tr>
    </tfoot>

  </table>

</body>

</html>`);

            }

            addStyles(win, styles);

            setTimeout(() => {
                win.document.close();
                win.focus();
                win.print();
                win.close();
                cb();
            }, 1000);

            return true;
        };
        //****************************************************************

        Vue.prototype.$htmlToPaperHeaderTitle = (el, header_id, footer_id, title, localOptions, cb = () => true) => {
            let defaultName = '_blank',
                defaultSpecs = ['fullscreen=yes', 'titlebar=yes', 'scrollbars=yes'],
                defaultReplace = true,
                defaultStyles = []
            let {
                name = defaultName,
                specs = defaultSpecs,
                replace = defaultReplace,
                styles = defaultStyles
            } = options;

            // If has localOptions
            // TODO: improve logic
            if (!!localOptions) {
                if (localOptions.name) name = localOptions.name;
                if (localOptions.specs) specs = localOptions.specs;
                if (localOptions.replace) replace = localOptions.replace;
                if (localOptions.styles) styles = localOptions.styles;
            }
            specs = !!specs.length ? specs.join(',') : '';

            const element = window.document.getElementById(el);
            const element_header = window.document.getElementById(header_id);
            const element_footer = window.document.getElementById(footer_id);
            if (!element) {
                alert(`Element to print #${el} not found!`);
                return;
            }
            if (!element_header) {
                alert(`Element to print #${header_id} not found!`);
                return;
            }
            if (!element_footer) {
                alert(`Element to print #${header_id} not found!`);
                return;
            }

            const url = '';
            const win = window.open(url, name, specs, replace);
            console.log(`<html dir="rtl">
<title>${title}</title>
<head>
<link rel="stylesheet" href="https://cdn.rtlcss.com/bootstrap/v4.2.1/css/bootstrap.min.css">
<link rel="stylesheet" href="https://omdesho.ir/print_css/printing.css">
<style>
      #pageFooter:after {
    counter-increment: page;
    /*content:"Page " counter(page) ;*/
    left: 0; 
    top: 100%;
    white-space: nowrap; 
    z-index: 20;
    -moz-border-radius: 5px; 
    -moz-box-shadow: 0px 0px 4px #222;  
    background-image: -moz-linear-gradient(top, #eeeeee, #cccccc);  
  }
.page-header, .page-header-space {
  height: 50px;
}

.page-footer, .page-footer-space {
  height: 50px;

}
.page-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
}

.page-header {
  position: fixed;
  top: 0mm;
  width: 100%;
}

.page {
  /*page-break-after: always;*/
}

@page {
  margin: 10mm
}

@media print {
   thead {display: table-header-group;} 
   tfoot {display: table-footer-group;}
   
   button {display: none;}
   
   body {margin: 0;}
}
</style>
</head>
<body>

  <div class="page-header" style="text-align: center">
                     ${element_header.innerHTML}
    <br/>
  
  </div>

  <div class="page-footer">
                     ${element_footer.innerHTML}
  </div>

  <table style="width: 100%">

    <thead>
      <tr>
        <td>
          <!--place holder for the fixed-position header-->
          <div class="page-header-space"></div>
        </td>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td>
          <!--*** CONTENT GOES HERE ***-->
         
          <div class="page" >
                               ${element.innerHTML}
          </div>
        </td>
      </tr>
    </tbody>

    <tfoot>
      <tr>
        <td >
          <!--place holder for the fixed-position footer-->
          <div class="page-footer-space"></div>
        </td>
      </tr>
    </tfoot>

  </table>

</body>

</html>`)
            if (i18n.locale == 'fa') {
                win.document.write(`<html dir="rtl">
<title>${title}</title>
<head>
<style>
      #pageFooter:after {
    counter-increment: page;
    /*content:"Page " counter(page) ;*/
    left: 0; 
    top: 100%;
    white-space: nowrap; 
    z-index: 20;
    -moz-border-radius: 5px; 
    -moz-box-shadow: 0px 0px 4px #222;  
    background-image: -moz-linear-gradient(top, #eeeeee, #cccccc);  
  }
.page-header, .page-header-space {
  height: 50px;
}

.page-footer, .page-footer-space {
  height: 50px;

}
.page-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
}

.page-header {
  position: fixed;
  top: 0mm;
  width: 100%;
}

.page {
  /*page-break-after: always;*/
}

@page {
  margin: 10mm
}

@media print {
   thead {display: table-header-group;} 
   tfoot {display: table-footer-group;}
   
   button {display: none;}
   
   body {margin: 0;}
}
</style>
</head>
<body>

  <div class="page-header" style="text-align: center">
                     ${element_header.innerHTML}
    <br/>
  
  </div>

  <div class="page-footer">
                     ${element_footer.innerHTML}
  </div>

  <table style="width: 100%">

    <thead>
      <tr>
        <td>
          <!--place holder for the fixed-position header-->
          <div class="page-header-space"></div>
        </td>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td>
          <!--*** CONTENT GOES HERE ***-->
         
          <div class="page" >
                               ${element.innerHTML}
          </div>
        </td>
      </tr>
    </tbody>

    <tfoot>
      <tr>
        <td >
          <!--place holder for the fixed-position footer-->
          <div class="page-footer-space"></div>
        </td>
      </tr>
    </tfoot>

  </table>

</body>

</html>`);

            } else {

                win.document.write(`
        <html dir="ltr">
<title>${title}</title>

<head>
<style>
      #pageFooter:after {
    counter-increment: page;
    /*content:"Page " counter(page) ;*/
    left: 0; 
    top: 100%;
    white-space: nowrap; 
    z-index: 20;
    -moz-border-radius: 5px; 
    -moz-box-shadow: 0px 0px 4px #222;  
    background-image: -moz-linear-gradient(top, #eeeeee, #cccccc);  
  }
.page-header, .page-header-space {
  height: 50px;
}

.page-footer, .page-footer-space {
  height: 50px;

}
.page-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
}

.page-header {
  position: fixed;
  top: 0mm;
  width: 100%;
}

.page {
width: 100%;
  /*page-break-after: always;*/
}

@page {
  margin: 10mm
}

@media print {
   thead {display: table-header-group;} 
   tfoot {display: table-footer-group;}
   
   button {display: none;}
   
   body {margin: 0;}
}
</style>
</head>
<body>

  <div class="page-header" style="text-align: center">
                     ${element_header.innerHTML}
    <br/>
  
  </div>

  <div class="page-footer">
                     ${element_footer.innerHTML}
  </div>

  <table style="width: 100%">

    <thead>
      <tr>
        <td>
          <!--place holder for the fixed-position header-->
          <div class="page-header-space"></div>
        </td>
      </tr>
    </thead>

    <tbody >
      <tr >
        <td >
          <!--*** CONTENT GOES HERE ***-->
         
          <div class="page" >
                               ${element.innerHTML}
          </div>
        </td>
      </tr>
    </tbody>

    <tfoot>
      <tr>
        <td>
          <!--place holder for the fixed-position footer-->
          <div class="page-footer-space"></div>
        </td>
      </tr>
    </tfoot>

  </table>

</body>

</html>`);

            }

            addStyles(win, styles);

            setTimeout(() => {
                win.document.close();
                win.focus();
                win.print();
                win.close();
                cb();
            }, 1000);

            return true;
        };
//*************************************************************************
        Vue.prototype.$htmlToPaperHeaderTitle_height = (el, header_id, footer_id, title, height, footer_height, localOptions, cb = () => true) => {
            let defaultName = '_blank',
                defaultSpecs = ['fullscreen=yes', 'titlebar=yes', 'scrollbars=yes'],
                defaultReplace = true,
                defaultStyles = []
            let {
                name = defaultName,
                specs = defaultSpecs,
                replace = defaultReplace,
                styles = defaultStyles
            } = options;

            // If has localOptions
            // TODO: improve logic
            if (!!localOptions) {
                if (localOptions.name) name = localOptions.name;
                if (localOptions.specs) specs = localOptions.specs;
                if (localOptions.replace) replace = localOptions.replace;
                if (localOptions.styles) styles = localOptions.styles;
            }
            specs = !!specs.length ? specs.join(',') : '';

            const element = window.document.getElementById(el);
            const element_header = window.document.getElementById(header_id);
            const element_footer = window.document.getElementById(footer_id);
            if (!element) {
                alert(`Element to print #${el} not found!`);
                return;
            }
            if (!element_header) {
                alert(`Element to print #${header_id} not found!`);
                return;
            }
            if (!element_footer) {
                alert(`Element to print #${header_id} not found!`);
                return;
            }
            const url = '';
            const win = window.open(url, name, specs, replace);
            const style_html = `<style>
      h6.pageFooter_no1:after {
          counter-increment: page;
    /*content:"Page " counter(page) ;*/
    left: 0; 
    top: 100%;
    white-space: nowrap; 
    z-index: 20; 
    -moz-border-radius: 5px; 
    -moz-box-shadow: 0px 0px 4px #222;  
    background-image: -moz-linear-gradient(top, #eeeeee, #cccccc);  
  }
  th svg {
    display: none!important;
    }
input[type=checkbox]{
   display:none;
}

.text-center{
text-align: center;
}
.page-header, .page-header-space {
          counter-increment: page;

  height: ${height}px;
}

.page-footer {
  height: fit-content;
}
 .page-footer-space {
  height: 50px;
}
.page-footer {

  position: fixed;
  bottom: 0;
  width: 100%;
}

.page-header {

  position: fixed;
  top: 0mm;
  width: 100%;
}

.page {
  /*page-break-after: always;*/
  height: fit-content;
}

@page {
  margin: 10mm
}

@media print {
   thead {display: table-header-group;} 
   tfoot {display: table-footer-group;}
   
   button {display: none;}
   
   body {margin: 0;}
}
</style>
`;
            if (i18n.locale == 'fa') {
                win.document.write(`<html dir="rtl">
<title>${title}</title>
<head>
${style_html}
</head>
<body>

  <div class="page-header" >
                     ${element_header.innerHTML}
    <br/>
  
  </div>

  <div class="page-footer" >
                     ${element_footer.innerHTML}
  </div>

  <table style="width: 100%">

    <thead>
      <tr>
        <td>
          <!--place holder for the fixed-position header-->
          <div class="page-header-space"></div>
        </td>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td>
          <!--*** CONTENT GOES HERE ***-->
         
          <div class="page" >
                               ${element.innerHTML}
          </div>
        </td>
      </tr>
    </tbody>

    <tfoot>
      <tr>
        <td >
          <!--place holder for the fixed-position footer-->
          <div class="page-footer-space"></div>
        </td>
      </tr>
    </tfoot>

  </table>

</body>

</html>`);

            } else {

                win.document.write(`
        <html dir="ltr">
<title>${title}</title>

<head>
${style_html}
</head>
<body>

  <div class="page-header" >
                     ${element_header.innerHTML}
    <br/>
  
  </div>

  <div class="page-footer">
                     ${element_footer.innerHTML}
  </div>

  <table style="width: 100%">

    <thead>
      <tr>
        <td>
          <!--place holder for the fixed-position header-->
          <div class="page-header-space"></div>
        </td>
      </tr>
    </thead>

    <tbody >
      <tr >
        <td >
          <!--*** CONTENT GOES HERE ***-->
         
          <div class="page" >
                               ${element.innerHTML}
          </div>
        </td>
      </tr>
    </tbody>

    <tfoot>
      <tr>
        <td>
          <!--place holder for the fixed-position footer-->
          <div class="page-footer-space"></div>
        </td>
      </tr>
    </tfoot>

  </table>

</body>

</html>`);

            }

            addStyles(win, styles);

            setTimeout(() => {
                win.document.close();
                win.focus();
                win.print();
                win.close();
                cb();
            }, 1000);

            return true;
        };

//*************************************************************************
        Vue.prototype.$htmlToPaperHeaderTitle_height_multiple_class = (el, header_id, footer_id, title, height, footer_height, localOptions, cb = () => true) => {
            let defaultName = '_blank',
                defaultSpecs = ['fullscreen=yes', 'titlebar=yes', 'scrollbars=yes'],
                defaultReplace = true,
                defaultStyles = []
            let {
                name = defaultName,
                specs = defaultSpecs,
                replace = defaultReplace,
                styles = defaultStyles
            } = options;

            // If has localOptions
            // TODO: improve logic
            if (!!localOptions) {
                if (localOptions.name) name = localOptions.name;
                if (localOptions.specs) specs = localOptions.specs;
                if (localOptions.replace) replace = localOptions.replace;
                if (localOptions.styles) styles = localOptions.styles;
            }
            specs = !!specs.length ? specs.join(',') : '';

            const elements = window.document.getElementsByClassName(el);
            const element_headers = window.document.getElementsByClassName(header_id);
            const element_footers = window.document.getElementsByClassName(footer_id);

            const url = '';
            const win = window.open(url, name, specs, replace);
            const style_html = `<style>
      h6.pageFooter_no1:after {
          counter-increment: page;
    /*content:"Page " counter(page) ;*/
    left: 0; 
    top: 100%;
    white-space: nowrap; 
    z-index: 20; 
    -moz-border-radius: 5px; 
    -moz-box-shadow: 0px 0px 4px #222;  
    background-image: -moz-linear-gradient(top, #eeeeee, #cccccc);  
  }
  th svg {
    display: none!important;
    }
input[type=checkbox]{
   display:none;
}

.text-center{
text-align: center;
}
.page-header, .page-header-space {
          counter-increment: page;

  height: ${height}px;
}

.page-footer {
  height: fit-content;
}
 .page-footer-space {
  height: 50px;
}
.page-footer {

  position: fixed!important;
  bottom: 0;
  width: 100%;
}

.page-header {

  position: absolute!important;
  top: 0mm;
  width: 100%;
}

.page {
  /*page-break-after: always;*/
  height: fit-content;
}

@page {
  margin: 10mm
}

@media print {
   thead {display: table-header-group;} 
   tfoot {display: table-footer-group;}
   
   button {display: none;}
   
   body {margin: 0;}
   .break{
  page-break-after: always;

}
}
</style>
`;
            var html = ``
            if (i18n.locale == 'fa') {
                html = `<html dir="rtl">
<title>${title}</title>
<head>
${style_html}
</head>
<body >
`;
                for (var i = 0; i < elements.length; i++) {
                    var element = elements[i]
                    var element_header = element_headers[i]
                    var element_footer = element_footers[i]


                    html += `
<div class="break"  style="position: relative">

  <div class="page-header" >
                     ${element_header.innerHTML}
    <br/>
  
  </div>

  <div class="page-footer" >
                     ${element_footer.innerHTML}
  </div>

  <table style="width: 100%">

    <thead>
      <tr>
        <td>
          <!--place holder for the fixed-position header-->
          <div class="page-header-space"></div>
        </td>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td>
          <!--*** CONTENT GOES HERE ***-->
         
          <div class="page" >
                               ${element.innerHTML}
          </div>
        </td>
      </tr>
    </tbody>

    <tfoot>
      <tr>
        <td >
          <!--place holder for the fixed-position footer-->
          <div class="page-footer-space"></div>
        </td>
      </tr>
    </tfoot>

  </table>

</div>
`
                }
                html += `
</body>

</html>`
                win.document.write(html);

            } else {
                html = `  <html dir="ltr">
<title>${title}</title>

<head>
${style_html}
</head>
<body >`
                for (var i = 0; i < elements.length; i++) {
                    var element = elements[i]
                    var element_header = element_headers[i]
                    var element_footer = element_footers[i]

                    html += `<div class="break"  style="position: relative">
  <div class="page-header" >
                     ${element_header.innerHTML}
    <br/>
  
  </div>

  <div class="page-footer">
                     ${element_footer.innerHTML}
  </div>

  <table style="width: 100%">

    <thead>
      <tr>
        <td>
          <!--place holder for the fixed-position header-->
          <div class="page-header-space"></div>
        </td>
      </tr>
    </thead>

    <tbody >
      <tr >
        <td >
          <!--*** CONTENT GOES HERE ***-->
         
          <div class="page" >
                               ${element.innerHTML}
          </div>
        </td>
      </tr>
    </tbody>

    <tfoot>
      <tr>
        <td>
          <!--place holder for the fixed-position footer-->
          <div class="page-footer-space"></div>
        </td>
      </tr>
    </tfoot>

  </table>

</div>`
                }
                html += `</body>

</html>`
                win.document.write(html);

            }


            addStyles(win, styles);

            setTimeout(() => {
                win.document.close();
                win.focus();
                win.print();
                win.close();
                cb();
            }, 1000);
            console.log(win, win.document)
            return true;
        };

//*************************************************************************
        Vue.prototype.$htmlForEmail = (el, header_id, footer_id, title, localOptions, cb = () => true) => {
            let defaultName = '_blank',
                defaultSpecs = ['fullscreen=yes', 'titlebar=yes', 'scrollbars=yes'],
                defaultReplace = true,
                defaultStyles = []
            let {
                name = defaultName,
                specs = defaultSpecs,
                replace = defaultReplace,
                styles = defaultStyles
            } = options;

            // If has localOptions
            // TODO: improve logic
            if (!!localOptions) {
                if (localOptions.name) name = localOptions.name;
                if (localOptions.specs) specs = localOptions.specs;
                if (localOptions.replace) replace = localOptions.replace;
                if (localOptions.styles) styles = localOptions.styles;
            }
            specs = !!specs.length ? specs.join(',') : '';

            const element = window.document.getElementById(el);
            const element_header = window.document.getElementById(header_id);
            const element_footer = window.document.getElementById(footer_id);
            if (!element) {
                alert(`Element to print #${el} not found!`);
                return;
            }
            if (!element_header) {
                alert(`Element to print #${header_id} not found!`);
                return;
            }
            if (!element_footer) {
                alert(`Element to print #${header_id} not found!`);
                return;
            }

            const url = '';
            // const win = window.open(url, name, specs, replace);
            var email_html = "";
            if (i18n.locale == 'fa') {
                email_html = (`<html dir="rtl">
<title>${title}</title>
<head>

<style  type="text/css">

      #pageFooter:after {
    counter-increment: page;
    /*content:"Page " counter(page) ;*/
    left: 0; 
    top: 100%;
    white-space: nowrap; 
    z-index: 20;
    -moz-border-radius: 5px; 
    -moz-box-shadow: 0px 0px 4px #222;  
    background-image: -moz-linear-gradient(top, #eeeeee, #cccccc);  
  }
.page-header, .page-header-space {
  height: 50px;
}

.page-footer, .page-footer-space {
  height: 50px;

}
.page-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
}

.page-header {
  position: fixed;
  top: 0mm;
  width: 100%;
}

.page {
  /*page-break-after: always;*/
}

@page {
  margin: 10mm
}

@media print {
   thead {display: table-header-group;} 
   tfoot {display: table-footer-group;}
   
   button {display: none;}
   
   body {margin: 0;}
}
</style>
</head>
<body>

  <div class="page-header" style="text-align: center">
                     ${element_header.innerHTML}
    <br/>
  
  </div>

  <div class="page-footer">
                     ${element_footer.innerHTML}
  </div>

  <table style="width: 100%">

    <thead>
      <tr>
        <td>
          <!--place holder for the fixed-position header-->
          <div class="page-header-space"></div>
        </td>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td>
          <!--*** CONTENT GOES HERE ***-->
         
          <div class="page" >
                               ${element.innerHTML}
          </div>
        </td>
      </tr>
    </tbody>

    <tfoot>
      <tr>
        <td >
          <!--place holder for the fixed-position footer-->
          <div class="page-footer-space"></div>
        </td>
      </tr>
    </tfoot>

  </table>

</body>

</html>`);
            } else {
                email_html = (`
        <html dir="ltr">
<title>ssss</title>

<head>
<style  type="text/css">

   

      #pageFooter:after {
    counter-increment: page;
    /*content:"Page " counter(page) ;*/
    left: 0; 
    top: 100%;
    white-space: nowrap; 
    z-index: 20;
    -moz-border-radius: 5px; 
    -moz-box-shadow: 0px 0px 4px #222;  
    background-image: -moz-linear-gradient(top, #eeeeee, #cccccc);  
  }
.page-header, .page-header-space {
  height: 50px;
}

.page-footer, .page-footer-space {
  height: 50px;

}
.page-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
}

.page-header {
  position: fixed;
  top: 0mm;
  width: 100%;
}

.page {
width: 100%;
  /*page-break-after: always;*/
}

@page {
  margin: 10mm
}

@media print {
   thead {display: table-header-group;} 
   tfoot {display: table-footer-group;}
   
   button {display: none;}
   
   body {margin: 0;}
}
</style>
</head>
<body>

  <div class="page-header" style="text-align: center">
                     ${element_header.innerHTML}
    <br/>
  
  </div>

  <div class="page-footer">
                     ${element_footer.innerHTML}
  </div>

  <table style="width: 100%">

    <thead>
      <tr>
        <td>
          <!--place holder for the fixed-position header-->
          <div class="page-header-space"></div>
        </td>
      </tr>
    </thead>

    <tbody >
      <tr >
        <td >
          <!--*** CONTENT GOES HERE ***-->
         
          <div class="page" >
                               ${element.innerHTML}
          </div>
        </td>
      </tr>
    </tbody>

    <tfoot>
      <tr>
        <td>
          <!--place holder for the fixed-position footer-->
          <div class="page-footer-space"></div>
        </td>
      </tr>
    </tfoot>

  </table>

</body>

</html>`);
            }
            //
            // addStyles(win, styles);
            //
            // setTimeout(() => {
            //     win.document.close();
            //     win.focus();
            //     win.print();
            //     win.close();
            //     cb();
            // }, 1000);

            return email_html;
        };

    }
}

export default VueHtmlToPaper;
