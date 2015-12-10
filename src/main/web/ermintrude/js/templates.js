(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['browseNode'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=this.escapeExpression;

  return " \n  <li data-url=\""
    + alias1(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\">\n    <span class=\"page-item"
    + ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.uri : depth0),{"name":"unless","hash":{},"fn":this.program(2, data, 0),"inverse":this.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + "\">"
    + alias1(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1),{"name":"if","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</span>\n    <div class=\"page-options\">\n      <button class=\"btn-browse-edit\">Edit</button>\n      <button class=\"btn-browse-create\">Create</button>\n      <button class=\"btn-browse-delete\">Delete</button>\n    </div>\n    "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.children : depth0),{"name":"if","hash":{},"fn":this.program(8, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "  </li>\n";
},"2":function(depth0,helpers,partials,data) {
    return " page-item--directory";
},"4":function(depth0,helpers,partials,data) {
    var helper;

  return " page-item--"
    + this.escapeExpression(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"type","hash":{},"data":data}) : helper)));
},"6":function(depth0,helpers,partials,data) {
    var stack1;

  return ": "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1), depth0));
},"8":function(depth0,helpers,partials,data) {
    var stack1;

  return " \n        <ul>\n          "
    + ((stack1 = this.invokePartial(partials.browseNode,depth0,{"name":"browseNode","data":data,"helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + " \n        </ul>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.children : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"usePartial":true,"useData":true});
templates['changePassword'] = template({"1":function(depth0,helpers,partials,data) {
    return "          <label for=\"password-old\">Current password:</label><input id=\"password-old\" type=\"password\" cols=\"40\"\n                                                                    rows=\"1\"/>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"change-password-overlay table-builder overlay\">\n  <div class=\"table-builder__inner\">\n    <div id=\"edit-table\" class=\"table-builder__editor\">\n      <h1>Change password</h1>\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.authenticate : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "      <label for=\"password-new\">New password:</label><input id=\"password-new\" type=\"password\" cols=\"40\" rows=\"1\"/>\n      <label for=\"password-confirm\">Confirm new password:</label><input id=\"password-confirm\" type=\"password\" cols=\"40\"\n                                                                        rows=\"1\"/>\n      <button id=\"update-password\" class=\"btn-florence-login fl-panel--user-and-access__login \">Update password</button>\n      <button id=\"update-password-cancel\" class=\"\">Cancel</button>\n    </div>\n  </div>\n</div>";
},"useData":true});
templates['chartBuilder'] = template({"1":function(depth0,helpers,partials,data) {
    return "            <option value=\"bar\">Bar Chart</option>\n            <option value=\"rotated\">Bar Chart (rotated)</option>\n            <option value=\"line\">Line Chart</option>\n            <option value=\"area\">Area Chart</option>\n            <option value=\"barline\">Bar + Line Chart</option>\n            <option value=\"rotated-barline\">Bar + Line Chart (rotated)</option>\n            <option value=\"dual-axis\">Dual Axis</option>\n            <option value=\"scatter\">Scatter Plot Chart</option>\n            <option value=\"pie\">Pie Chart</option>\n            <option value=\"population\">Population Pyramid</option>\n            <option value=\"confidence-interval\">Confidence Interval</option>\n            <option value=\"rotated-confidence-interval\">Confidence Interval (rotated)</option>\n            <option value=\"box-and-whisker\">Box and Whisker</option>\n";
},"3":function(depth0,helpers,partials,data) {
    return "              <option value=\"0.56\">16:9</option>\n              <option value=\"0.75\">4:3</option>\n              <option value=\"0.42\">21:9</option>\n              <option value=\"1\">1:1</option>\n              <option value=\"1.3\">10:13</option>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"chart-builder overlay\">\n  <div class=\"chart-builder__inner\">\n    <!-- <h1>Chart Builder</h1> -->\n\n    <div id=\"edit-chart\" class=\"chart-builder__editor\">\n\n      <span class=\"refresh-text\">\n        <label for=\"chart-title\">Title\n            <input type=\"text\" id=\"chart-title\" placeholder=\"[Title]\" value=\""
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "\"/>\n        </label>\n        <label for=\"chart-subtitle\">Sub-title\n            <input type=\"text\" id=\"chart-subtitle\" placeholder=\"[Subtitle]\" value=\""
    + alias3(((helper = (helper = helpers.subtitle || (depth0 != null ? depth0.subtitle : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"subtitle","hash":{},"data":data}) : helper)))
    + "\"/>\n        </label>\n        <label for=\"chart-source\">Source\n            <input type=\"text\" id=\"chart-source\" placeholder=\"[Source]\" value=\""
    + alias3(((helper = (helper = helpers.source || (depth0 != null ? depth0.source : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"source","hash":{},"data":data}) : helper)))
    + "\"/>\n        </label>\n      </span>\n        <label for=\"chart-unit\">Units\n            <input type=\"text\" id=\"chart-unit\" class=\"refresh-chart\" placeholder=\"[Unit]\" value=\""
    + alias3(((helper = (helper = helpers.unit || (depth0 != null ? depth0.unit : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"unit","hash":{},"data":data}) : helper)))
    + "\"/>\n        </label>\n\n        <label for=\"chart-data\">Chart data</label>\n            <textarea id=\"chart-data\" class=\"refresh-chart\" placeholder=\"Paste your data here\" rows=\"4\" cols=\"120\"></textarea>\n\n      <label for=\"chart-alt-text\">Alt text</label>\n        <textarea id=\"chart-alt-text\" class=\"refresh-text\" placeholder=\"[Alt text]\">"
    + alias3(((helper = (helper = helpers.altText || (depth0 != null ? depth0.altText : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"altText","hash":{},"data":data}) : helper)))
    + "</textarea>\n\n      <label>Chart type<br>\n        <div class=\"select-wrap\">\n          <select id=\"chart-type\" class=\"refresh-chart\">\n"
    + ((stack1 = (helpers.select || (depth0 && depth0.select) || alias1).call(depth0,(depth0 != null ? depth0.chartType : depth0),{"name":"select","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </select>\n        </div>\n      </label>\n\n      <label>Aspect ratio<br>\n        <div class=\"select-wrap\">\n          <select id=\"aspect-ratio\" class=\"refresh-chart\">\n"
    + ((stack1 = (helpers.select || (depth0 && depth0.select) || alias1).call(depth0,(depth0 != null ? depth0.aspectRatio : depth0),{"name":"select","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "          </select>\n        </div>\n      </label>\n\n      <div id=\"extras\" class=\"refresh-chart\">\n\n      </div>\n\n      <label>Label interval<br>\n        <input type=\"text\" id=\"chart-label-interval\" class=\"refresh-chart\" placeholder=\"[Label interval]\" value=\""
    + alias3(((helper = (helper = helpers.labelInterval || (depth0 != null ? depth0.labelInterval : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"labelInterval","hash":{},"data":data}) : helper)))
    + "\"/>\n      </label>\n\n      <label>Decimal places<br>\n        <input type=\"text\" id=\"chart-decimal-places\" class=\"refresh-chart\" placeholder=\"[Decimal places]\" value=\""
    + alias3(((helper = (helper = helpers.decimalPlaces || (depth0 != null ? depth0.decimalPlaces : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"decimalPlaces","hash":{},"data":data}) : helper)))
    + "\"/>\n      </label>\n\n\n      <label for=\"chart-alt-text\">X axis label</label>\n        <input type=\"text\" id=\"chart-x-axis-label\" style=\"width: 99.7%\" class=\"refresh-chart\" placeholder=\"[X axis label]\" value=\""
    + alias3(((helper = (helper = helpers.xAxisLabel || (depth0 != null ? depth0.xAxisLabel : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"xAxisLabel","hash":{},"data":data}) : helper)))
    + "\"/>\n\n        <label for=\"chart-notes\">Notes</label>\n        <textarea id=\"chart-notes\" class=\"refresh-text\" placeholder=\"Add chart notes here\" rows=\"4\" cols=\"120\">"
    + alias3(((helper = (helper = helpers.notes || (depth0 != null ? depth0.notes : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"notes","hash":{},"data":data}) : helper)))
    + "</textarea>\n    </div>\n\n\n    <div id=\"preview-chart\" class=\"chart-builder__preview\">\n\n      <span id=\"chart-title-preview\"></span>\n      </br>\n      <span id=\"chart-subtitle-preview\"></span>\n      \n      <div id=\"chart\"></div>\n      \n\n      <span id=\"chart-source-preview\"></span>\n      <span id=\"chart-notes-preview\"></span>\n        \n    </div>\n\n    <div class=\"chart-builder__footer\">\n        <button class=\"btn-chart-builder-create\">Save chart</button>\n        <button class=\"btn-chart-builder-cancel\">Cancel</button>\n    </div>\n\n  </div>\n\n\n  <div id=\"hiddenDiv\" style=\"display:none\">\n    <canvas id=\"hiddenCanvas\"></canvas>\n\n  </div>\n\n\n  <div id=\"hiddenSvgForDownload\"></div>\n  <canvas id=\"hiddenCanvasForDownload\"></canvas>\n\n</div>";
},"useData":true});
templates['chartEditBarlineExtras'] = template({"1":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=this.lambda, alias2=this.escapeExpression, alias3=helpers.helperMissing;

  return "  <label>"
    + alias2(alias1(depth0, depth0))
    + "</label>\n  <div class=\"select-wrap\">\n    <select id=\"types_"
    + alias2(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias3),(typeof helper === "function" ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"col--5\">\n"
    + ((stack1 = (helpers.select || (depth0 && depth0.select) || alias3).call(depth0,helpers.lookup.call(depth0,(depths[1] != null ? depths[1].chartTypes : depths[1]),depth0,{"name":"lookup","hash":{},"data":data}),{"name":"select","hash":{},"fn":this.program(2, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </select>\n  </div>\n  <label for=\""
    + alias2(alias1(depth0, depth0))
    + "\">Bar stack</label>\n    <input id=\""
    + alias2(alias1(depth0, depth0))
    + "\" name=\"group_check\" value=\""
    + alias2(alias1(depth0, depth0))
    + "\" type=\"checkbox\""
    + ((stack1 = (helpers.ifContains || (depth0 && depth0.ifContains) || alias3).call(depth0,depth0,((stack1 = (depths[1] != null ? depths[1].groups : depths[1])) != null ? stack1['0'] : stack1),{"name":"ifContains","hash":{},"fn":this.program(4, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ">\n  <br/>\n";
},"2":function(depth0,helpers,partials,data) {
    return "        <option value=\"bar\">Bar</option>\n        <option value=\"line\">Line</option>\n";
},"4":function(depth0,helpers,partials,data) {
    return " checked";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.series : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true,"useDepths":true});
templates['chartEditDualAxisExtras'] = template({"1":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=this.escapeExpression, alias2=helpers.helperMissing;

  return "  <label>"
    + alias1(this.lambda(depth0, depth0))
    + "</label>\n  <div class=\"select-wrap\">\n    <select id=\"types_"
    + alias1(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"col--5\">\n"
    + ((stack1 = (helpers.select || (depth0 && depth0.select) || alias2).call(depth0,helpers.lookup.call(depth0,(depths[1] != null ? depths[1].chartTypes : depths[1]),depth0,{"name":"lookup","hash":{},"data":data}),{"name":"select","hash":{},"fn":this.program(2, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </select>\n  </div>\n  <br/>\n";
},"2":function(depth0,helpers,partials,data) {
    return "        <option value=\"bar\">Bar</option>\n        <option value=\"line\">Line</option>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.series : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true,"useDepths":true});
templates['chartEditLineChartExtras'] = template({"1":function(depth0,helpers,partials,data) {
    return "checked";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<label for=\"start-from-zero\">Start from zero</label>\n<input id=\"start-from-zero\" name=\"Start from zero\" "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.startFromZero : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " type=\"checkbox\">";
},"useData":true});
templates['collectionDetails'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression, alias4=this.lambda;

  return "      <li><span class=\"page-item page-item--"
    + alias3(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"type","hash":{},"data":data}) : helper)))
    + "\">"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.language : stack1),"===","cy",{"name":"ifCond","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " ("
    + alias3((helpers.lastEditedBy || (depth0 && depth0.lastEditedBy) || alias1).call(depth0,(depth0 != null ? depth0.events : depth0),{"name":"lastEditedBy","hash":{},"data":data}))
    + ")</span>\n        <div class=\"page-options\">\n          <button class=\"btn-page-edit\" data-path=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\" data-language=\""
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.language : stack1), depth0))
    + "\">Edit file</button>\n          <button class=\"btn-page-move\" data-path=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\" data-language=\""
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.language : stack1), depth0))
    + "\">Move file</button>\n          <button class=\"btn-page-delete page-delete\" data-path=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\" data-language=\""
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.language : stack1), depth0))
    + "\">Delete file</button>\n        </div>\n      </li>\n";
},"2":function(depth0,helpers,partials,data) {
    return "(Welsh)\n      ";
},"4":function(depth0,helpers,partials,data) {
    var stack1;

  return ": "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1), depth0));
},"6":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression, alias4=this.lambda;

  return "      <li><span class=\"page-item page-item--"
    + alias3(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"type","hash":{},"data":data}) : helper)))
    + "\">"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.language : stack1),"===","cy",{"name":"ifCond","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " ("
    + alias3((helpers.lastEditedBy || (depth0 && depth0.lastEditedBy) || alias1).call(depth0,(depth0 != null ? depth0.events : depth0),{"name":"lastEditedBy","hash":{},"data":data}))
    + ")</span>\n        <div class=\"page-options\">\n          <button class=\"btn-page-edit\" data-path=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\" data-language=\""
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.language : stack1), depth0))
    + "\">Review file</button>\n          <button class=\"btn-page-move\" data-path=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\" data-language=\""
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.language : stack1), depth0))
    + "\">Move file</button>\n          <button class=\"btn-page-delete page-delete\" data-path=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\" data-language=\""
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.language : stack1), depth0))
    + "\">Delete file</button>\n        </div>\n      </li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression, alias4=this.lambda;

  return "<div class=\"section-head\">\n  <h2>"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</h2>\n  <p>Publish: "
    + alias3(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"date","hash":{},"data":data}) : helper)))
    + "</br>"
    + alias3((helpers.createdBy || (depth0 && depth0.createdBy) || alias1).call(depth0,(depth0 != null ? depth0.events : depth0),{"name":"createdBy","hash":{},"data":data}))
    + "</p>\n  <button class=\"btn-collection-edit\">Edit collection</button>\n</div>\n<div class=\"section-content\">\n  <h3 id=\"in-progress-uris\">"
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.inProgress : depth0)) != null ? stack1.length : stack1), depth0))
    + " pages in progress</h3>\n  <ul class=\"page-list\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.inProgress : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "  </ul>\n  <h3 id=\"complete-uris\">"
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.complete : depth0)) != null ? stack1.length : stack1), depth0))
    + " pages awaiting review</h3>\n  <ul class=\"page-list\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.complete : depth0),{"name":"each","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "  </ul>\n  <h3 id=\"reviewed-uris\">"
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.reviewed : depth0)) != null ? stack1.length : stack1), depth0))
    + " pages awaiting approval</h3>\n  <ul class=\"page-list\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.reviewed : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "  </ul>\n</div>\n\n<nav class=\"section-nav\">\n  <button class=\"btn-collection-work-on\">Work on collection</button>\n  <button class=\"btn-collection-approve\">Approve collection</button>\n  <button id=\"collection-delete\" class=\"btn-page-delete page-delete\">Delete collection</button>\n  <button class=\"btn-collection-cancel\">Cancel</button>\n</nav>\n\n";
},"useData":true});
templates['collectionEdit'] = template({"1":function(depth0,helpers,partials,data) {
    return "checked";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"collection-editor\">\n  <div class=\"collection-editor__inner\">\n\n    <div class=\"collection-editor__editor\">\n      <textarea class=\"auto-size\" type=\"text\" id=\"collection-editor-name\" placeholder=\"Enter new name\">"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</textarea>\n      <div class=\"select-wrap\">\n        <select id=\"editor-team\">\n          <option selected disabled=\"disabled\">Edit the team the collection can be previewed by</option>\n          <option value=\"Team1\">Team 1</option>\n          <option value=\"Team2\">Team 2</option>\n          <option value=\"Team3\">Team 3</option>\n        </select>\n      </div>\n      <input type=\"radio\" id=\"collection-editor-scheduled\" name=\"publishType\" value=\"scheduledCollection\" required\n             "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,(depth0 != null ? depth0.type : depth0),"===","scheduled",{"name":"ifCond","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " ><label for=\"collection-editor-scheduled\">Scheduled publish</label>\n      <input type=\"radio\" id=\"collection-editor-manual\" name=\"publishType\" value=\"manualCollection\" required "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,(depth0 != null ? depth0.type : depth0),"===","manual",{"name":"ifCond","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "><label for=\"collection-editor-manual\">Manual publish</label>\n      <div id=\"collection-editor-date-block\" class=\"block\">\n        <input type=\"text\" id=\"collection-editor-date\" placeholder=\"dd/mm/yyyy\" value=\""
    + alias3(((helper = (helper = helpers.publishDate || (depth0 != null ? depth0.publishDate : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"publishDate","hash":{},"data":data}) : helper)))
    + "\"/>\n        <div class=\"select-wrap select-wrap--small\">\n          <select id=\"collection-editor-hour\">\n"
    + ((stack1 = this.invokePartial(partials.selectorHour,depth0,{"name":"selectorHour","data":data,"indent":"            ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "          </select>\n        </div>\n        <div class=\"select-wrap select-wrap--small\">\n          <select id=\"collection-editor-min\">\n"
    + ((stack1 = this.invokePartial(partials.selectorMinute,depth0,{"name":"selectorMinute","data":data,"indent":"            ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "          </select>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"collection-editor__footer\">\n      <div class=\"collection-editor__footer-div\">\n        <button class=\"btn-collection-editor-save\">Save changes</button>\n        <button class=\"btn-collection-editor-cancel\">Cancel</button>\n      </div>\n    </div>\n\n  </div>\n</div>";
},"usePartial":true,"useData":true});
templates['collectionList'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "      <tr data-id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n        <td headers=\"collection-name\" class=\"collection-name\">"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</td>\n        <td headers=\"collection-date\" class=\"collection-date\">"
    + alias3(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"date","hash":{},"data":data}) : helper)))
    + "</td>\n      </tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<section class=\"panel col col--6 collection-select\" xmlns=\"http://www.w3.org/1999/html\">\n  <h1 class=\"text-align-center\">Select a collection</h1>\n  <table class=\"collections-select-table\">\n    <thead>\n    <tr>\n      <th id=\"collection-name\" scope=\"col\">Collection name</th>\n      <th id=\"collection-date\" scope=\"col\">Collection date</th>\n    </tr>\n    </thead>\n    <tbody>\n"
    + ((stack1 = helpers.each.call(depth0,depth0,{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </tbody>\n  </table>\n</section>\n<section class=\"panel col col--6 collection-create\">\n  <h1 class=\"text-align-center\">Create a collection</h1>\n\n  <form method=\"post\" action=\"\" class=\"form-create-collection\">\n    <label for=\"collectionname\" class=\"hidden\">Scheduled publish</label>\n    <input id=\"collectionname\" type=\"text\" placeholder=\"Collection name\"/>\n    <label for=\"team\" class=\"hidden\">Select the team the collection can be previewed by</label>\n    <div class=\"select-wrap\">\n        <select id=\"team\">\n        <option selected disabled=\"disabled\">Select the team the collection can be previewed by</option>\n        <option value=\"Team1\">Team 1</option>\n        <option value=\"Team2\">Team 2</option>\n        <option value=\"Team3\">Team 3</option>\n      </select>\n    </div>\n    <input type=\"radio\" id=\"scheduledpublish\" name=\"publishType\" value=\"scheduled\" checked><label\n      for=\"scheduledpublish\">Scheduled publish</label>\n    <input type=\"radio\" id=\"manualpublish\" name=\"publishType\" value=\"manual\" required><label for=\"manualpublish\">Manual\n    publish</label>\n    <br>\n\n    <div id=\"scheduledPublishOptions\" class=\"block scheduled-publish-options\">\n      <input type=\"radio\" id=\"customschedule\" name=\"scheduleType\" value=\"custom\" checked><label for=\"customschedule\">Custom\n      schedule</label>\n      <input type=\"radio\" id=\"releaseschedule\" name=\"scheduleType\" value=\"release\" required><label\n        for=\"releaseschedule\">Calendar entry schedule</label>\n\n      <div id=\"customScheduleOptions\" class=\"custom-schedule-options\">\n        <div class=\"block\">\n          <label for=\"date\" class=\"hidden\">Date</label>\n          <input id=\"date\" type=\"text\" placeholder=\"dd/mm/yyyy\"/>\n          <br>\n          <label for=\"hour\" class=\"hidden\">Hour</label>\n          <div class=\"select-wrap select-wrap--small\">\n            <select id=\"hour\">\n"
    + ((stack1 = this.invokePartial(partials.selectorHour,depth0,{"name":"selectorHour","data":data,"indent":"              ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "            </select>\n          </div>\n          <label for=\"min\" class=\"hidden\">Minutes</label>\n          <div class=\"select-wrap select-wrap--small\">\n            <select id=\"min\">\n"
    + ((stack1 = this.invokePartial(partials.selectorMinute,depth0,{"name":"selectorMinute","data":data,"indent":"              ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "            </select>\n          </div>\n        </div>\n      </div>\n\n      <div id=\"releaseScheduleOptions\" class=\"block text-center hidden release-schedule-options\">\n        <button class=\"btn-select-release\">Select a calendar entry</button>\n\n        </br>\n        </br>\n        <span class=\"selected-release\"></span>\n\n      </div>\n\n    </div>\n\n    <button class=\"btn-collection-create\">Create collection</button>\n  </form>\n</section>\n<section class=\"panel col col--6 collection-selected\">\n\n</section>";
},"usePartial":true,"useData":true});
templates['editNav'] = template({"1":function(depth0,helpers,partials,data) {
    return "    <button class=\"btn-edit-save-and-submit-for-approval\" >Save and submit for approval</button>\n";
},"3":function(depth0,helpers,partials,data) {
    return "    <button class=\"btn-edit-save-and-submit-for-review\">Save and submit for review</button>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<!--<button class=\"btn-edit-cancel\">Cancel</button>-->\n<button class=\"btn-edit-save\">Save</button>\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isPageComplete : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "");
},"useData":true});
templates['editNavChild'] = template({"1":function(depth0,helpers,partials,data) {
    return "  <button class=\"btn-edit-save-and-submit-for-approval\" >Save, submit for approval and back to parent</button>\n";
},"3":function(depth0,helpers,partials,data) {
    return "  <button class=\"btn-edit-save-and-submit-for-review\">Save, submit for review and back to parent</button>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<button class=\"btn-edit-save\">Save</button>\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isPageComplete : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "");
},"useData":true});
templates['editorAlert'] = template({"1":function(depth0,helpers,partials,data,blockParams,depths) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression, alias4=this.lambda;

  return "        <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n          <div class=\"edit-section__sortable-item--counter float-left\">"
    + alias3((helpers.plus || (depth0 && depth0.plus) || alias1).call(depth0,(data && data.index),1,{"name":"plus","hash":{},"data":data}))
    + ". </div>\n          <input id=\"date_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" type=\"text\" placeholder=\"Day month year\" value=\""
    + alias3(alias4((depth0 != null ? depth0.date : depth0), depth0))
    + "\"/>\n          <textarea style=\"display: none;\" id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-markdown_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(alias4((depth0 != null ? depth0.correctionNotice : depth0), depth0))
    + "</textarea>\n          <div class=\"edit-section__buttons\">\n            <button class=\"btn-markdown-edit\" id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n            <button class=\"btn-page-delete\" id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n          </div>\n          <div id=\"correction-container_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"correction-alert\"></div>\n        </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"edit-section\" id=\""
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\">\n  <div class=\"edit-section__head\">\n    <h1>Alerts</h1>\n    <p>Date | Body copy </p>\n  </div>\n  <div class=\"edit-section__content\">\n    <div id=\"sortable-"
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.list : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n    <div class=\"text-center\">\n      <button class=\"btn-add-section\" id=\"add-"
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\">Add "
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "</button>\n    </div>\n  </div>\n</div>";
},"useData":true,"useDepths":true});
templates['editorCompendiumDatasetFiles'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "  <div id=\"correction_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__item\">\n    <div class=\"edit-section__sortable-item--counter float-left\">"
    + alias3((helpers.plus || (depth0 && depth0.plus) || alias1).call(depth0,(data && data.index),1,{"name":"plus","hash":{},"data":data}))
    + ". </div>\n    <p id=\"correction-title_show_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</p>\n    <p id=\"correction-filename_show_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.file || (depth0 != null ? depth0.file : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"file","hash":{},"data":data}) : helper)))
    + "</p>\n    <div class=\"edit-section__buttons\">\n      <button class=\"btn-markdown-edit\" id=\"correction-upload_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Upload new file</button>\n    </div>\n  </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,depth0,{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
templates['editorContent'] = template({"1":function(depth0,helpers,partials,data) {
    return "Content";
},"3":function(depth0,helpers,partials,data) {
    return "Collapsible sections";
},"5":function(depth0,helpers,partials,data) {
    return "Main sections | Title | Body copy";
},"7":function(depth0,helpers,partials,data) {
    return "Background notes | References |\n            Footnotes";
},"9":function(depth0,helpers,partials,data,blockParams,depths) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression, alias4=this.lambda;

  return "                <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n                    <div class=\"edit-section__sortable-item--counter float-left\">"
    + alias3((helpers.plus || (depth0 && depth0.plus) || alias1).call(depth0,(data && data.index),1,{"name":"plus","hash":{},"data":data}))
    + "</div>\n                    <textarea class=\"auto-size\" id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Type title here\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</textarea>\n                    <textarea style=\"display: none;\" id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-markdown_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.markdown || (depth0 != null ? depth0.markdown : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"markdown","hash":{},"data":data}) : helper)))
    + "</textarea>\n\n                    <div class=\"edit-section__buttons\">\n                        <button class=\"btn-markdown-edit\" id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n                        <button class=\"btn-page-delete\" id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n                    </div>\n                </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"edit-section\" id=\""
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\">\n    <div class=\"edit-section__head\">\n        <h1>"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,(depth0 != null ? depth0.idField : depth0),"==","section",{"name":"ifCond","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.program(3, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + "</h1>\n        <p>"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,(depth0 != null ? depth0.idField : depth0),"==","section",{"name":"ifCond","hash":{},"fn":this.program(5, data, 0, blockParams, depths),"inverse":this.program(7, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + "</p>\n    </div>\n    <div class=\"edit-section__content\">\n        <div id=\"sortable-"
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.list : depth0),{"name":"each","hash":{},"fn":this.program(9, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n            <button class=\"btn-add-section\" id=\"add-"
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\">Add "
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "</button>\n        </div>\n    </div>\n</div>";
},"useData":true,"useDepths":true});
templates['editorContentNoTitle'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"edit-section\" id=\"content\">\n    <div class=\"edit-section__head\">\n        <h1>"
    + alias3(((helper = (helper = helpers.header || (depth0 != null ? depth0.header : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"header","hash":{},"data":data}) : helper)))
    + "</h1>\n        <p>Body copy</p>\n    </div>\n    <div class=\"edit-section__content\">\n        <div id=\"sortable-content\" class=\"edit-section__sortable\">\n            <div class=\"edit-section__item\">\n                <textarea class=\"auto-size\" id=\"content-markdown\" placeholder=\"Click edit to add\n                content\" style=\"display: none;\">"
    + alias3(((helper = (helper = helpers.list || (depth0 != null ? depth0.list : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"list","hash":{},"data":data}) : helper)))
    + "</textarea>\n                <div class=\"edit-section__title\">To add or edit content click edit</div>\n                <div class=\"edit-section__buttons\">\n                    <button class=\"btn-markdown-edit\" id=\"content-edit\">Edit</button>\n                    <button class=\"btn-page-delete\" id=\"content-delete\">Delete</button>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>";
},"useData":true});
templates['editorContentOne'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=this.escapeExpression;

  return "<div class=\"edit-section\" id=\"one\">\n    <div class=\"edit-section__head\">\n        <h1>"
    + alias1(((helper = (helper = helpers.header || (depth0 != null ? depth0.header : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"header","hash":{},"data":data}) : helper)))
    + "</h1>\n        <p>Body copy</p>\n    </div>\n    <div class=\"edit-section__content\">\n        <div id=\"sortable-one\" class=\"edit-section__sortable\">\n            <div class=\"edit-section__item\">\n                <textarea class=\"auto-size\" id=\"one-markdown\" placeholder=\"Type or click edit to add\n                content\" style=\"display: none;\">"
    + alias1(this.lambda(((stack1 = (depth0 != null ? depth0.list : depth0)) != null ? stack1.markdown : stack1), depth0))
    + "</textarea>\n                <div class=\"edit-section__title\">To add or edit content click edit</div>\n                <div class=\"edit-section__buttons\">\n                    <button class=\"btn-markdown-edit\" id=\"one-edit\">Edit</button>\n                    <button class=\"btn-page-delete\" id=\"one-delete\">Delete</button>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>";
},"useData":true});
templates['editorCorrection'] = template({"1":function(depth0,helpers,partials,data) {
    return "      <h1>Corrections</h1>\n      <p>Date | Notice </p>\n";
},"3":function(depth0,helpers,partials,data) {
    return "      <h1>Versions</h1>\n      <p>Title</p>\n";
},"5":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "        <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__item\">\n          <div id=\"correction-edition_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" correction-url=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\"></div>\n          <input id=\"correction-date_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" type=\"text\" placeholder=\"Day month year\"\n                 value=\""
    + alias3(((helper = (helper = helpers.updateDate || (depth0 != null ? depth0.updateDate : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"updateDate","hash":{},"data":data}) : helper)))
    + "\" class=\"hasDateTimePicker\"/>\n          <textarea style=\"display: none;\" id=\"correction-markdown_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.correctionNotice || (depth0 != null ? depth0.correctionNotice : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"correctionNotice","hash":{},"data":data}) : helper)))
    + "</textarea>\n\n          <div class=\"edit-section__buttons\">\n            <button class=\"btn-markdown-edit\" id=\"correction-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit notice</button>\n            <button class=\"btn-page-delete\" id=\"correction-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n          </div>\n        </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"edit-section\" id=\""
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\">\n  <div class=\"edit-section__head\">\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,(depth0 != null ? depth0.idField : depth0),"===","correction",{"name":"ifCond","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "  </div>\n  <div class=\"edit-section__content\">\n    <div id=\"sortable-"
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable\">\n      <div id=\""
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "-section\"></div>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.list : depth0),{"name":"each","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n    <div class=\"text-center\">\n      <button class=\"btn-add-section\" id=\"add-"
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\">Add "
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "</button>\n    </div>\n  </div>\n</div>";
},"useData":true});
templates['editorDate'] = template({"1":function(depth0,helpers,partials,data,blockParams,depths) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression, alias4=this.lambda;

  return "        <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__item\">\n          <div id=\"previousDate_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(alias4((depth0 != null ? depth0.previousDate : depth0), depth0))
    + "</div>\n          <textarea style=\"display: none;\" id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-markdown_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(alias4((depth0 != null ? depth0.changeNotice : depth0), depth0))
    + "</textarea>\n          <div class=\"edit-section__buttons\">\n            <button class=\"btn-markdown-edit\" id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-note_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit notice</button>\n          </div>\n        </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"edit-section\" id=\""
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\">\n  <div class=\"edit-section__head\">\n    <h1>Date changes</h1>\n    <p>Date | Change notice</p>\n  </div>\n  <div class=\"edit-section__content\">\n    <div id=\"sortable-"
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.list : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n  </div>\n</div>";
},"useData":true,"useDepths":true});
templates['editorDocWithFiles'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "  <div id=\"correction_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__item\">\n    <div class=\"edit-section__sortable-item--counter float-left\">"
    + alias3((helpers.plus || (depth0 && depth0.plus) || alias1).call(depth0,(data && data.index),1,{"name":"plus","hash":{},"data":data}))
    + ". </div>\n    <p id=\"correction-title_show_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</p>\n    <p id=\"correction-filename_show_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.file || (depth0 != null ? depth0.file : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"file","hash":{},"data":data}) : helper)))
    + "</p>\n    <button class=\"btn-markdown-edit\" id=\"correction-upload_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Upload new file</button>\n  </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,depth0,{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
templates['editorDownloads'] = template({"1":function(depth0,helpers,partials,data,blockParams,depths) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression, alias4=this.lambda;

  return "                <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n                    <div class=\"edit-section__sortable-item--counter float-left\">"
    + alias3((helpers.plus || (depth0 && depth0.plus) || alias1).call(depth0,(data && data.index),1,{"name":"plus","hash":{},"data":data}))
    + ". </div>\n                    <textarea id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"add-tooltip edit-section__title\" placeholder='Add a title'>"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</textarea>\n\n                    <div class=\"edit-section__buttons\">\n                        <button class=\"btn-page-delete\" id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n                    </div>\n                    <div id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-filename_show_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__file-name\">"
    + alias3(((helper = (helper = helpers.file || (depth0 != null ? depth0.file : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"file","hash":{},"data":data}) : helper)))
    + "</div>\n                </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"edit-section\" id=\""
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\">\n    <div class=\"edit-section__head\">\n        <h1>Upload "
    + alias3(((helper = (helper = helpers.supplementary || (depth0 != null ? depth0.supplementary : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"supplementary","hash":{},"data":data}) : helper)))
    + "files</h1>\n        <p>Title | Name</p>\n    </div>\n    <div class=\"edit-section__content\">\n        <div id=\"sortable-"
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.list : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n            <button class=\"btn-add-section\" id=\"add-"
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\">Add file</button>\n        </div>\n    </div>\n</div>";
},"useData":true,"useDepths":true});
templates['editorDownloadsWithSummary'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item edit-section__sortable-item--summary\">\n                    <div class=\"edit-section__sortable-item--counter float-left\">"
    + alias3((helpers.plus || (depth0 && depth0.plus) || alias1).call(depth0,(data && data.index),1,{"name":"plus","hash":{},"data":data}))
    + ". </div>\n                    <textarea id=\"file-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"add-tooltip\" placeholder=\"Type title here and click\n                    edit to add description\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</textarea>\n                    <textarea style=\"display: none;\" id=\"file-summary_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.fileDescription || (depth0 != null ? depth0.fileDescription : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"fileDescription","hash":{},"data":data}) : helper)))
    + "</textarea>\n                    <br>\n                    <div id=\"file-filename_show_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.file || (depth0 != null ? depth0.file : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"file","hash":{},"data":data}) : helper)))
    + "</div>\n                    <div class=\"edit-section__buttons\">\n                        <button class=\"btn-markdown-edit\" id=\"file-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit description</button>\n                        <button class=\"btn-page-delete\" id=\"file-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n                    </div>\n                </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"edit-section\" id=\"file\">\n    <div class=\"edit-section__head\">\n        <h1>Upload files</h1>\n        <p>Title | Link</p>\n    </div>\n    <div class=\"edit-section__content\">\n        <div id=\"sortable-file\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.list : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n            <button class=\"btn-add-section\" id=\"add-file\">Add file</button>\n        </div>\n    </div>\n</div>";
},"useData":true});
templates['editorLinks'] = template({"1":function(depth0,helpers,partials,data,blockParams,depths) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression, alias4=this.lambda;

  return "                <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n                    <div class=\"edit-section__sortable-item--counter float-left\">"
    + alias3((helpers.plus || (depth0 && depth0.plus) || alias1).call(depth0,(data && data.index),1,{"name":"plus","hash":{},"data":data}))
    + ". </div>\n                    <textarea class=\"auto-size\" id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-uri_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Paste link here and\n                    click edit to add content\">"
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "</textarea>\n                    <textarea style=\"display: none;\" id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-markdown_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</textarea>\n                    <button class=\"btn-markdown-edit\" id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n                    <button class=\"btn-page-delete\" id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n                </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"edit-section\" id=\""
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\">\n    <div class=\"edit-section__head\">\n        <h1>Related "
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "s</h1>\n        <p> Link | Title</p>\n    </div>\n    <div class=\"edit-section__content\">\n        <div id=\"sortable-"
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.list : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n            <button class=\"btn-add-section\" id=\"add-"
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\">Add "
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "</button>\n        </div>\n    </div>\n</div>";
},"useData":true,"useDepths":true});
templates['editorRelated'] = template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return this.escapeExpression(((helper = (helper = helpers.idPlural || (depth0 != null ? depth0.idPlural : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"idPlural","hash":{},"data":data}) : helper)));
},"3":function(depth0,helpers,partials,data) {
    var helper;

  return this.escapeExpression(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)));
},"5":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression, alias4=this.lambda;

  return "        <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n          <div class=\"edit-section__sortable-item--counter float-left\">"
    + alias3((helpers.plus || (depth0 && depth0.plus) || alias1).call(depth0,(data && data.index),1,{"name":"plus","hash":{},"data":data}))
    + ".</div>\n          <div class=\"edit-section__title\">\n            "
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1),{"name":"if","hash":{},"fn":this.program(6, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n          </div>\n          <div class=\"edit-section__buttons\">\n            <button class=\"btn-page-delete\" id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n          </div>\n        </div>\n";
},"6":function(depth0,helpers,partials,data) {
    var stack1;

  return ": "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1), depth0));
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"edit-section\" id=\""
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\">\n  <div class=\"edit-section__head\">\n    <h1>Related "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.idPlural : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.program(3, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + "</h1>\n\n    <p>Title</p>\n  </div>\n  <div class=\"edit-section__content\">\n    <div id=\"sortable-"
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.list : depth0),{"name":"each","hash":{},"fn":this.program(5, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n    <div class=\"text-center\">\n      <button class=\"btn-add-section\" id=\"add-"
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\">Add "
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "</button>\n    </div>\n  </div>\n</div>";
},"useData":true,"useDepths":true});
templates['editorTopics'] = template({"1":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression, alias4=this.lambda;

  return "        <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__item\">\n          <div class=\"edit-section__sortable-item--counter float-left\">"
    + alias3((helpers.plus || (depth0 && depth0.plus) || alias1).call(depth0,(data && data.index),1,{"name":"plus","hash":{},"data":data}))
    + ". </div>\n          "
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "\n          <div class=\"edit-section__buttons\">\n            <button class=\"btn-page-delete\" id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n          </div>\n        </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"edit-section\" id=\""
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\">\n  <div class=\"edit-section__head\">\n    <h1>Other related "
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "</h1>\n    <p>Title</p>\n  </div>\n  <div class=\"edit-section__content\">\n    <div id=\"sortable-"
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.list : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n    <div class=\"text-center\">\n      <button class=\"btn-add-section\" id=\"add-"
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\">Add "
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "</button>\n    </div>\n  </div>\n</div>";
},"useData":true,"useDepths":true});
templates['ermintrude'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"wrapper\">\n  <nav class=\"admin-nav\">\n  </nav>\n  <div class=\"section\">\n  </div>\n</div>";
},"useData":true});
templates['iframeNav'] = template({"1":function(depth0,helpers,partials,data) {
    return "    <label for='latest' class='latest__label'>Latest release</label>\n    <input id='latest' class='latest__checkbox' type='checkbox' value='value' checked='checked'>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class='iframe-nav'>\n  <button class='btn-browse-get'>Use this page</button>\n  <button class='btn-browse-cancel'>Cancel</button>\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.hasLatest : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</div>";
},"useData":true});
templates['imageBuilder'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"image-builder overlay\">\n  <div class=\"image-builder__inner\">\n\n    <div id=\"edit-image\" class=\"image-builder__editor\">\n\n      <span class=\"refresh-text\">\n        <input type=\"text\" id=\"image-title\" placeholder=\"[Title]\" value=\""
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "\"/>\n        <input type=\"text\" id=\"image-subtitle\" placeholder=\"[Subtitle]\" value=\""
    + alias3(((helper = (helper = helpers.subtitle || (depth0 != null ? depth0.subtitle : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"subtitle","hash":{},"data":data}) : helper)))
    + "\"/>\n        <input type=\"text\" id=\"image-source\" placeholder=\"[Source]\" value=\""
    + alias3(((helper = (helper = helpers.source || (depth0 != null ? depth0.source : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"source","hash":{},"data":data}) : helper)))
    + "\"/>\n        <input type=\"text\" id=\"image-alt-text\" placeholder=\"[Alt text]\" value=\""
    + alias3(((helper = (helper = helpers.altText || (depth0 != null ? depth0.altText : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"altText","hash":{},"data":data}) : helper)))
    + "\"/>\n      </span>\n\n      <form id=\"upload-image-form\">\n        <label>Image file upload</label>\n        <input type=\"file\" name=\"image-upload\" id=\"image-upload\">\n        <input type=\"submit\" value=\"Upload image\">\n      </form>\n\n      </br>\n\n      <form id=\"upload-data-form\">\n        <label>Data file upload</label>\n        <input type=\"file\" name=\"data-upload\" id=\"data-upload\">\n        <input type=\"submit\" value=\"Upload data\">\n      </form>\n\n      </br>\n\n      <textarea id=\"image-notes\" class=\"refresh-text\" placeholder=\"Add image notes here\" rows=\"4\" cols=\"120\">"
    + alias3(((helper = (helper = helpers.notes || (depth0 != null ? depth0.notes : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"notes","hash":{},"data":data}) : helper)))
    + "</textarea>\n\n    </div>\n\n    <div id=\"preview-image\" class=\"image-builder__preview\">\n      <span id=\"image-title-preview\"></span>\n      </br>\n      <span id=\"image-subtitle-preview\"></span>\n\n      <div id=\"image\"></div>\n\n      <span id=\"image-source-preview\"></span>\n      <span id=\"image-notes-preview\"></span>\n\n    </div>\n\n    <div class=\"image-builder__footer\">\n      <button class=\"btn-image-builder-create\">Save image</button>\n      <button class=\"btn-image-builder-cancel\">Cancel</button>\n    </div>\n\n  </div>\n</div>";
},"useData":true});
templates['login'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"col--4 login-wrapper\">\n  <h1>Login</h1>\n\n  <form method=\"post\" action=\"\" class=\"form-login\">\n    <label for=\"email\">Email:</label>\n    <input id=\"email\" type=\"email\" class=\"fl-user-and-access__email\" name=\"email\" cols=\"40\" rows=\"1\"/>\n\n    <label for=\"password\">Password:</label>\n    <input id=\"password\" type=\"password\" class=\"fl-user-and-access__password\" name=\"password\" cols=\"40\" rows=\"1\"/>\n\n    <button type=\"submit\" id=\"login\" class=\"btn-florence-login fl-panel--user-and-access__login \">Log in</button>\n  </form>\n</div>";
},"useData":true});
templates['mainNav'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.collection : depth0)) != null ? stack1.name : stack1),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n        <li class=\"nav--admin__item nav--admin__item--collections "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.Authentication : depth0)) != null ? stack1.isAuthenticated : stack1),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\">\n        <a href=\"#\">Collections</a></li>\n        <li class=\"nav--admin__item nav--admin__item--users\"><a href=\"#\">Users and access</a></li>\n        <li class=\"nav--admin__item nav--admin__item--publish\"><a href=\"#\">Publishing queue</a></li>\n        <li class=\"nav--admin__item nav--admin__item--reports\"><a href=\"#\">Reports</a></li>\n\n\n        <li class=\"nav--admin__item nav--admin__item--logout\"><a href=\"#\">Logout</a></li>\n";
},"2":function(depth0,helpers,partials,data) {
    var stack1;

  return "          <li id=\"working-on\" class=\"nav--admin__item nav--admin__item--collection selected\"><a href=\"#\">Working on: "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.collection : depth0)) != null ? stack1.name : stack1), depth0))
    + "</a></li>\n";
},"4":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0,((stack1 = (depth0 != null ? depth0.collection : depth0)) != null ? stack1.name : stack1),{"name":"unless","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"5":function(depth0,helpers,partials,data) {
    return "selected";
},"7":function(depth0,helpers,partials,data) {
    return "        <li class=\"nav--admin__item nav--admin__item--login selected\"><a href=\"#\">Login</a></li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<ul class=\"nav nav--admin\">\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.Authentication : depth0)) != null ? stack1.isAuthenticated : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + "</ul>\n";
},"useData":true});
templates['markdownEditor'] = template({"1":function(depth0,helpers,partials,data) {
    return this.escapeExpression(this.lambda((depth0 != null ? depth0.title : depth0), depth0));
},"3":function(depth0,helpers,partials,data) {
    return "Content Editor";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"markdown-editor\">\n  <div class=\"markdown-editor__header\">\n    <h1>"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.title : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "</h1>\n\n    <div class=\"custom-markdown-buttons\">\n      <button class=\"btn-markdown-editor-chart\" title=\"Build Chart\"></button>\n      <button class=\"btn-markdown-editor-table\" title=\"Build Table\"></button>\n      <button class=\"btn-markdown-editor-image\" title=\"Add image\"></button>\n    </div>\n    <div id=\"wmd-button-bar\"></div>\n  </div>\n  <div class=\"markdown-editor__content\">\n    <div id=\"wmd-preview\" class=\"wmd-panel wmd-preview\"></div>\n    <div id=\"wmd-edit\" class=\"wmd-panel wmd-edit\">\n      <h2>Markdown:</h2>\n      <textarea class=\"wmd-input\" id=\"wmd-input\">"
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.markdown : depth0), depth0))
    + "</textarea>\n\n      <div class=\"markdown-editor-line-numbers\"></div>\n    </div>\n  </div>\n  <div class=\"markdown-editor__footer\">\n    <button class=\"btn-markdown-editor-save\">Save changes</button>\n      <button class=\"btn-markdown-editor-exit\">Save changes and exit</button>\n      <button class=\"btn-markdown-editor-cancel\">Cancel</button>\n  </div>\n</div>";
},"useData":true});
templates['markdownEditorNoTitle'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"markdown-editor\">\n  <div class=\"markdown-editor__header\">\n    <h1>Content editor</h1>\n    <div class=\"custom-markdown-buttons\">\n      <button class=\"btn-markdown-editor-chart\" title=\"Build chart\"></button>\n      <button class=\"btn-markdown-editor-table\" title=\"Build table\"></button>\n      <button class=\"btn-markdown-editor-image\" title=\"Add image\"></button>\n    </div>\n    <div id=\"wmd-button-bar\"></div>\n  </div>\n  <div class=\"markdown-editor__content\">\n    <div id=\"wmd-preview\" class=\"wmd-panel wmd-preview\"></div>\n    <div id=\"wmd-edit\" class=\"wmd-panel wmd-edit\">\n      <h2>Markdown:</h2>\n      <textarea class=\"wmd-input\" id=\"wmd-input\">"
    + this.escapeExpression(this.lambda(depth0, depth0))
    + "</textarea>\n      <div class=\"markdown-editor-line-numbers\"></div>\n    </div>\n  </div>\n  <div class=\"markdown-editor__footer\">\n    <button class=\"btn-markdown-editor-save\">Save changes</button>\n      <button class=\"btn-markdown-editor-exit\">Save changes and exit</button>\n      <button class=\"btn-markdown-editor-cancel\">Cancel</button>\n  </div>\n</div>";
},"useData":true});
templates['publishDetails'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "  <div class=\"collections-accordion\">\n    <div class=\"collections-section\">\n      <div class=\"collections-section__head\">\n        <h3 class=\"collection-name\" data-id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</h3>\n      </div>\n      <div class=\"collections-section__content\">\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.pageType : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        <button class=\"btn-collection-unlock\">Unlock collection</button>\n        <h4>Approved pages in this collection</h4>\n        <ul class=\"page-list\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.pageDetails : depth0),{"name":"each","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </ul>\n      </div>\n    </div>\n  </div>\n";
},"2":function(depth0,helpers,partials,data) {
    return "          <button class=\"btn-collection-publish\">Publish collection</button>\n";
},"4":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "          <li><span class=\"page-item page-item--"
    + alias3(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"type","hash":{},"data":data}) : helper)))
    + "\" data-path=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</span>\n            <div class=\"page-options\">\n              <button class=\"btn-page-delete\">Remove from this publish</button>\n            </div>\n          </li>\n";
},"5":function(depth0,helpers,partials,data) {
    var stack1;

  return ": "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1), depth0));
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"section-head\">\n  <h2>"
    + alias3(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"date","hash":{},"data":data}) : helper)))
    + "</h2>\n  <p>"
    + alias3(((helper = (helper = helpers.subtitle || (depth0 != null ? depth0.subtitle : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"subtitle","hash":{},"data":data}) : helper)))
    + "</p>\n</div>\n\n<div class=\"section-content section-content--fullwidth\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.collectionDetails : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n\n<nav class=\"section-nav\">\n  <button class=\"btn-collection-cancel\">Cancel</button>\n</nav>\n";
},"useData":true});
templates['publishList'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "    <tr data-collections=\""
    + alias2(alias1((depth0 != null ? depth0.ids : depth0), depth0))
    + "\">\n      <td>"
    + alias2(alias1((depth0 != null ? depth0.date : depth0), depth0))
    + "</td>\n    </tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<section class=\"panel col col--6 publish-select\">\n  <h1 class=\"text-align-center\">Select a publish date</h1>\n  <table class=\"publish-select-table\">\n    <thead>\n    <tr>\n      <th id=\"publish-name\" scope=\"col\">Publish date</th>\n    </tr>\n    </thead>\n    <tbody>\n"
    + ((stack1 = helpers.each.call(depth0,depth0,{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </tbody>\n  </table>\n</section>\n<section class=\"panel col col--6 publish-selected\">\n\n</section>";
},"useData":true});
templates['relatedModal'] = template({"1":function(depth0,helpers,partials,data) {
    return "        <label for='latest' class='latest__label'>Latest release</label>\n        <input id='latest' class='latest__checkbox' type='checkbox' value='value' checked='checked'>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class='modal'>\n  <div class='modal-box'>\n    <div class='uri-input'>\n      <label for='uri-input' class='uri-input__label'>Add/edit by URL</label>\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.hasLatest : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "      <input id='uri-input' placeholder='Enter URL' type='text' class='uri-input__input'>\n    </div>\n    <div class='uri-browse'>\n      <p class='uri-browse__label'>Or browse to find the page</p>\n      <button class='btn-uri-browse'>Browse</button>\n    </div>\n    <div class='modal-nav'>\n      <button class='btn-uri-get'>Save</button>\n      <button class='btn-uri-cancel'>Cancel</button>\n    </div>\n  </div>\n</div>";
},"useData":true});
templates['releaseSelector'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"release-select overlay\">\n  <div class=\"table-builder__inner release-select__inner\">\n\n    <div class=\"release-select__header\">\n        <h1 class=\"release-select__heading\">Select a calendar entry</h1>\n        <div class=\"release-select-search\">\n          <input id=\"release-search-input\" class=\"release-select-search__input\" type=\"text\" placeholder=\"Search for a release\">\n        </div>\n    </div>\n    <div class=\"release-select__body\">\n        <table class=\"release-select-table\">\n          <thead>\n          <tr>\n            <th scope=\"col\">Calendar entry</th>\n            <th scope=\"col\">Calendar entry date</th>\n          </tr>\n          </thead>\n          <tbody id=\"release-list\">\n          </tbody>\n        </table>\n    </div>\n\n    <div class=\"release-select__footer\">\n        <button class=\"btn-release-selector-cancel\">Cancel</button>\n    </div>\n\n  </div>\n</div>";
},"useData":true});
templates['reportDetails'] = template({"1":function(depth0,helpers,partials,data) {
    return " style=\"color: green; font-weight: 700;\" ";
},"3":function(depth0,helpers,partials,data) {
    return " style=\"color:\n  red; font-weight: 700;\"\n  ";
},"5":function(depth0,helpers,partials,data) {
    var helper;

  return "  <p style=\"color: red; font-weight: 700;\">Verification failed for "
    + this.escapeExpression(((helper = (helper = helpers.verifyFailedCount || (depth0 != null ? depth0.verifyFailedCount : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"verifyFailedCount","hash":{},"data":data}) : helper)))
    + "  file(s)</p>\n";
},"7":function(depth0,helpers,partials,data) {
    var helper;

  return "  <p style=\"color: green; font-weight: 700;\">Verified "
    + this.escapeExpression(((helper = (helper = helpers.verifiedCount || (depth0 != null ? depth0.verifiedCount : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"verifiedCount","hash":{},"data":data}) : helper)))
    + " file(s) successfully </p>\n";
},"9":function(depth0,helpers,partials,data) {
    var helper;

  return "  <p style=\"color: yellow; font-weight: 700;\">Verifying "
    + this.escapeExpression(((helper = (helper = helpers.verifyInprogressCount || (depth0 != null ? depth0.verifyInprogressCount : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"verifyInprogressCount","hash":{},"data":data}) : helper)))
    + " file(s) </p>\n";
},"11":function(depth0,helpers,partials,data) {
    var stack1;

  return "  <div class=\"section-content section-content--fullwidth\">\n    <div class=\"collections-accordion\">\n      <div class=\"collections-section\">\n        <div class=\"collections-section__head\">\n          <h3 class=\"collection-name\">Error list</h3>\n        </div>\n        <div class=\"collections-section__content\">\n          <ul class=\"page-list\">\n"
    + ((stack1 = helpers.each.call(depth0,((stack1 = (depth0 != null ? depth0.success : depth0)) != null ? stack1.errors : stack1),{"name":"each","hash":{},"fn":this.program(12, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "          </ul>\n        </div>\n      </div>\n    </div>\n  </div>\n";
},"12":function(depth0,helpers,partials,data) {
    return "              <li>"
    + this.escapeExpression(this.lambda(depth0, depth0))
    + "</li>\n";
},"14":function(depth0,helpers,partials,data) {
    var stack1, alias1=helpers.helperMissing;

  return "  <div class=\"section-content section-content--fullwidth\">\n    <div class=\"collections-accordion\">\n      <div class=\"collections-section\">\n        <div class=\"collections-section__head\">\n          <h3 class=\"collection-name\">"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.success : depth0)) != null ? stack1.transaction : stack1)) != null ? stack1.uriInfos : stack1)) != null ? stack1.length : stack1),">","1",{"name":"ifCond","hash":{},"fn":this.program(15, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.success : depth0)) != null ? stack1.transaction : stack1)) != null ? stack1.uriInfos : stack1)) != null ? stack1.length : stack1),"<=","1",{"name":"ifCond","hash":{},"fn":this.program(17, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</h3>\n        </div>\n        <div class=\"collections-section__content\">\n          <table class=\"collections-report-table\">\n            <thead>\n            <tr>\n              <th class=\"file-name\">Name</th>\n              <th class=\"file-size\">Size (B)</th>\n              <th class=\"file-duration\">Time (ms)</th>\n            </tr>\n            </thead>\n            <tbody>\n"
    + ((stack1 = helpers.each.call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.success : depth0)) != null ? stack1.transaction : stack1)) != null ? stack1.uriInfos : stack1),{"name":"each","hash":{},"fn":this.program(19, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "            </tbody>\n          </table>\n        </div>\n      </div>\n    </div>\n  </div>\n";
},"15":function(depth0,helpers,partials,data) {
    var stack1;

  return " "
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.success : depth0)) != null ? stack1.transaction : stack1)) != null ? stack1.uriInfos : stack1)) != null ? stack1.length : stack1), depth0))
    + " files published\n          ";
},"17":function(depth0,helpers,partials,data) {
    var stack1;

  return " "
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.success : depth0)) != null ? stack1.transaction : stack1)) != null ? stack1.uriInfos : stack1)) != null ? stack1.length : stack1), depth0))
    + "\n            file published ";
},"19":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "              <tr "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,(depth0 != null ? depth0.verificationStatus : depth0),"===","failed",{"name":"ifCond","hash":{},"fn":this.program(20, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "  "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,(depth0 != null ? depth0.verificationStatus : depth0),"===","verified",{"name":"ifCond","hash":{},"fn":this.program(22, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " >\n                <td class=\"file-name\">"
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "</td>\n                <td class=\"file-size\">"
    + alias3(((helper = (helper = helpers.size || (depth0 != null ? depth0.size : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"size","hash":{},"data":data}) : helper)))
    + "</td>\n                <td class=\"file-duration\">"
    + alias3(((helper = (helper = helpers.duration || (depth0 != null ? depth0.duration : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"duration","hash":{},"data":data}) : helper)))
    + "</td>\n              </tr>\n";
},"20":function(depth0,helpers,partials,data) {
    return " style=\"color: red;\" ";
},"22":function(depth0,helpers,partials,data) {
    return " style=\"color: green;\" ";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"section-head\">\n  <h2>"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</h2>\n\n  <p>"
    + alias3(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"date","hash":{},"data":data}) : helper)))
    + "</p>\n\n  <p>\n    Total time: <span "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,(depth0 != null ? depth0.duration : depth0),"<","60000",{"name":"ifCond","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,(depth0 != null ? depth0.duration : depth0),">=","60000",{"name":"ifCond","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + alias3(((helper = (helper = helpers.duration || (depth0 != null ? depth0.duration : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"duration","hash":{},"data":data}) : helper)))
    + "</span> ms\n  </p>\n  \n  <p>Started at: "
    + alias3(((helper = (helper = helpers.starting || (depth0 != null ? depth0.starting : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"starting","hash":{},"data":data}) : helper)))
    + "</p>\n  \n  \n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,(depth0 != null ? depth0.verifyFailedCount : depth0),">",0,{"name":"ifCond","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,(depth0 != null ? depth0.verifiedCount : depth0),">",0,{"name":"ifCond","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "  \n\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,(depth0 != null ? depth0.verifyInprogressCount : depth0),">",0,{"name":"ifCond","hash":{},"fn":this.program(9, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "  \n\n</div>\n\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.success : depth0)) != null ? stack1.error : stack1),{"name":"if","hash":{},"fn":this.program(11, data, 0),"inverse":this.program(14, data, 0),"data":data})) != null ? stack1 : "")
    + "\n<nav class=\"section-nav\">\n  <button class=\"btn-collection-cancel\">Cancel</button>\n</nav>";
},"useData":true});
templates['reportList'] = template({"1":function(depth0,helpers,partials,data) {
    return "style=\"color: red;\" ";
},"3":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "      <tr data-collections-order=\""
    + alias2(alias1((depth0 != null ? depth0.order : depth0), depth0))
    + "\">\n        <td class=\"collection-name\">"
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + "</td>\n        <td class=\"collection-date\">"
    + alias2(alias1((depth0 != null ? depth0.formattedDate : depth0), depth0))
    + "</td>\n      </tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<section class=\"panel col col--6 publish-select\">\n  <h1 class=\"text-align-center\">Select a published collection</h1>\n  <table class=\"publish-select-table\">\n    <thead>\n    <tr>\n      <th id=\"collection-name\" "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.error : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " scope=\"col\">Collection name</th>\n      <th id=\"collection-date\" scope=\"col\">Publish date</th>\n    </tr>\n    </thead>\n    <tbody>\n"
    + ((stack1 = helpers.each.call(depth0,depth0,{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </tbody>\n  </table>\n</section>\n<section class=\"panel col col--6 publish-selected\">\n\n</section>";
},"useData":true});
templates['selectorHour'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<option value=\"0\">00</option>\n<option value=\"3600000\">01</option>\n<option value=\"7200000\">02</option>\n<option value=\"10800000\">03</option>\n<option value=\"14400000\">04</option>\n<option value=\"18000000\">05</option>\n<option value=\"21600000\">06</option>\n<option value=\"25200000\">07</option>\n<option value=\"28800000\">08</option>\n<option value=\"32400000\" selected=\"selected\">09</option>\n<option value=\"36000000\">10</option>\n<option value=\"39600000\">11</option>\n<option value=\"43200000\">12</option>\n<option value=\"46800000\">13</option>\n<option value=\"50400000\">14</option>\n<option value=\"54000000\">15</option>\n<option value=\"57600000\">16</option>\n<option value=\"61200000\">17</option>\n<option value=\"64800000\">18</option>\n<option value=\"68400000\">19</option>\n<option value=\"72000000\">20</option>\n<option value=\"75600000\">21</option>\n<option value=\"79200000\">22</option>\n<option value=\"82800000\">23</option>";
},"useData":true});
templates['selectorMinute'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<option value=\"0\">00</option>\n<option value=\"1800000\" selected=\"selected\">30</option>";
},"useData":true});
templates['tableBuilder'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"table-builder overlay\">\n  <div class=\"table-builder__inner\">\n\n    <div id=\"edit-table\" class=\"table-builder__editor\">\n      <form id=\"upload-table-form\">\n        <input type=\"text\" id=\"table-title\" placeholder=\"[Title]\" value=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "\"/>\n        <input type=\"file\" name=\"files\" id=\"files\">\n        <input type=\"submit\" value=\"Submit\">\n      </form>\n    </div>\n\n    <div id=\"preview-table\" class=\"table-builder__preview\">\n      \n    </div>\n\n    <div class=\"table-builder__footer\">\n        <button class=\"btn-table-builder-create\">Save table</button>\n        <button class=\"btn-table-builder-cancel\">Cancel</button>\n    </div>\n\n  </div>\n</div>";
},"useData":true});
templates['userDetails'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"section-head\">\n  <h2>"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</h2>\n</div>\n\n<div class=\"section-content\">\n</div>\n\n<nav class=\"section-nav\">\n  <button class=\"btn-user-change-password btn-collection-work-on\">Change password</button>\n  <button class=\"btn-user-delete btn-page-delete\">Delete user</button>\n  <button class=\"btn-user-cancel btn-collection-cancel\">Cancel</button>\n</nav>\n\n";
},"useData":true});
templates['userList'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "      <tr data-id=\""
    + alias3(((helper = (helper = helpers.email || (depth0 != null ? depth0.email : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"email","hash":{},"data":data}) : helper)))
    + "\">\n        <td headers=\"username\" class=\"collection-name\">"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</td>\n        <td headers=\"password\" class=\"collection-name\">"
    + alias3(((helper = (helper = helpers.email || (depth0 != null ? depth0.email : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"email","hash":{},"data":data}) : helper)))
    + "</td>\n      </tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<section class=\"panel col col--6 collection-select\">\n  <h1 class=\"text-align-center\">Select a user</h1>\n  <table class=\"collections-select-table\">\n    <thead>\n    <tr>\n      <th id=\"collection-name\" scope=\"col\">Name</th>\n      <th id=\"collection-name\" scope=\"col\">Email</th>\n    </tr>\n    </thead>\n    <tbody>\n"
    + ((stack1 = helpers.each.call(depth0,depth0,{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </tbody>\n  </table>\n</section>\n<section class=\"panel col col--6 collection-create\">\n  <h1 class=\"text-align-center\">Create a user</h1>\n\n  <form autocomplete=\"off\" method=\"post\" action=\"\" class=\"form-create-user\" >\n    <input id=\"create-user-username\" type=\"text\" placeholder=\"Username\" autocomplete=\"off\" />\n    <input id=\"create-user-email\" type=\"text\" placeholder=\"Email\" autocomplete=\"off\" />\n    <input id=\"create-user-password\" type=\"password\" placeholder=\"Password\" autocomplete=\"off\" />\n\n    <button class=\"btn-collection-create\">Create user</button>\n  </form>\n</section>\n<section class=\"panel col col--6 collection-selected\">\n\n</section>";
},"useData":true});
templates['workBrowse'] = template({"1":function(depth0,helpers,partials,data) {
    return " page-item--directory";
},"3":function(depth0,helpers,partials,data) {
    var helper;

  return " page-item--"
    + this.escapeExpression(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"type","hash":{},"data":data}) : helper)));
},"5":function(depth0,helpers,partials,data) {
    var stack1;

  return " \n                <ul>\n                    "
    + ((stack1 = this.invokePartial(partials.browseNode,depth0,{"name":"browseNode","data":data,"helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + " \n                </ul>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=this.escapeExpression;

  return "<section class=\"panel workspace-browse\">\n  <nav class=\"tree-nav-holder\">\n    <ul class=\"page-list page-list--tree\">\n          <li data-url=\""
    + alias1(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\">\n            <span class=\"page-item"
    + ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.uri : depth0),{"name":"unless","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "\">"
    + alias1(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</span>\n            <div class=\"page-options\">\n              <button class=\"btn-browse-edit\">Edit</button>\n              <button class=\"btn-browse-create\">Create</button>\n              <button class=\"btn-browse-delete\">Delete</button>\n            </div>\n            "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.children : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "          </li>\n    </ul>\n  </nav>\n</section>";
},"usePartial":true,"useData":true});
templates['workCreate'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<section class=\"panel workspace-create\">\n  <h1>New page details</h1>\n  <form>\n    <label for=\"pagetype\" class=\"hidden\">Page type</label>\n\n    <div class=\"select-wrap\">\n      <select id=\"pagetype\" required>\n        <option value=\"\" name=\"\">Select your option</option>\n        <option value=\"bulletin\" name=\"bulletin\">Bulletin</option>\n        <option value=\"article\" name=\"article\">Article</option>\n        <option value=\"article_download\" name=\"article_download\">Article (PDF only)</option>\n        <option value=\"dataset_landing_page\" name=\"dataset_landing_page\">Dataset</option>\n        <option value=\"timeseries_landing_page\" name=\"timeseries_landing_page\">Timeseries dataset</option>\n        <option value=\"compendium_landing_page\" name=\"compendium_landing_page\">Compendium</option>\n        <option value=\"static_landing_page\" name=\"static_landing_page\">Static landing page</option>\n        <option value=\"static_page\" name=\"static_page\">Generic static page</option>\n        <option value=\"static_methodology\" name=\"static_methodology\">Methodology article</option>\n        <option value=\"static_methodology_download\" name=\"static_methodology_download\">Methodology article (PDF only)\n        </option>\n        <option value=\"static_qmi\" name=\"static_qmi\">QMI</option>\n        <option value=\"static_foi\" name=\"static_foi\">FOI</option>\n        <option value=\"static_adhoc\" name=\"static_adhoc\">Ad hoc</option>\n        <option value=\"release\" name=\"release\">Calendar entry</option>\n      </select>\n    </div>\n    <div class=\"edition\"></div>\n    <label for=\"pagename\" class=\"hidden\">Page name</label>\n    <input id=\"pagename\" class=\"full\" type=\"text\" placeholder=\"Page name\" />\n    <button class=\"btn-page-create\">Create page</button>\n  </form>\n</section>\n";
},"useData":true});
templates['workEditCharts'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "        <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n          <div class=\"edit-section__title\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</div>\n          <div id=\"chart-to-be-copied_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" style=\"display: none\">&ltons-chart path=\""
    + alias3(((helper = (helper = helpers.filename || (depth0 != null ? depth0.filename : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"filename","hash":{},"data":data}) : helper)))
    + "\" /&gt</div>\n          <div class=\"edit-section__buttons\">\n            <button class=\"btn-markdown-edit\" id=\"chart-copy_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Copy</button>\n            <button class=\"btn-markdown-edit\" id=\"chart-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n            <button class=\"btn-page-delete\" id=\"chart-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n          </div>\n        </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"edit-section\" id=\"charts\">\n  <div class=\"edit-section__head\">\n    <h1>Charts</h1>\n\n    <p>Edit existing charts</p>\n  </div>\n  <div id=\"chart-list\" class=\"edit-section__content\">\n    <div id=\"sortable-chart\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.charts : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n    <div class=\"text-center\">\n      <button class=\"btn-add-section\" id=\"add-chart\">Add chart</button>\n    </div>\n  </div>\n</div>";
},"useData":true});
templates['workEditImages'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "        <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n          <div class=\"edit-section__title\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</div>\n          <div id=\"image-to-be-copied_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" style=\"display: none\">&ltons-image path=\""
    + alias3(((helper = (helper = helpers.filename || (depth0 != null ? depth0.filename : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"filename","hash":{},"data":data}) : helper)))
    + "\" /&gt</div>\n          <div class=\"edit-section__buttons\">\n            <button class=\"btn-markdown-edit\" id=\"image-copy_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Copy</button>\n            <button class=\"btn-markdown-edit\" id=\"image-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n            <button class=\"btn-page-delete\" id=\"image-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n          </div>\n        </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"edit-section\" id=\"images\">\n  <div class=\"edit-section__head\">\n    <h1>Images</h1>\n\n    <p>Edit existing images</p>\n  </div>\n  <div id=\"image-list\" class=\"edit-section__content\">\n    <div id=\"sortable-image\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.images : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n    <div class=\"text-center\">\n      <button class=\"btn-add-section\" id=\"add-image\">Add image</button>\n    </div>\n  </div>\n</div>";
},"useData":true});
templates['workEditT1'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n  <div class=\"edit-accordion\">\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Metadata</h1>\n\n        <p>Keywords</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"metadata-list\">\n          <div class=\"title\">\n            <label for=\"title\">Title\n              <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"keywords\">Summary\n              <textarea class=\"auto-size\" type=\"text\" id=\"summary\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.summary : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"keywords\">Keywords\n              <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\"\n                     style=\"display: none;\">\n            </label>\n            <ul id=\"keywordsTag\"></ul>\n          </div>\n          <div>\n            <label for=\"metaDescription\">Meta description\n              <textarea class=\"auto-size\" type=\"text\" id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"sections\">\n      <div class=\"edit-section__head\">\n        <h1>Statistical highlights</h1>\n\n        <p></p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-section\" class=\"edit-section__sortable\">\n          <div id=\"to-populate\"></div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT16'] = template({"1":function(depth0,helpers,partials,data) {
    return "            <div></div>\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return "            <div class=\"provisional-date\">\n              <label for=\"provisionalDate\">Provisional date range\n              <textarea class=\"auto-size\" type=\"text\"\n                        id=\"provisionalDate\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.provisionalDate : stack1), depth0))
    + "</textarea>\n              </label>\n            </div>\n            <div id=\"finalised\">\n              <label for=\"finalised\" style=\"display: inline-block;\">Finalise </label>\n              <input type=\"checkbox\" name=\"finalised\" value=\"false\" class=\"checkbox\"/>\n            </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n  <div class=\"edit-accordion\">\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Metadata</h1>\n\n        <p id=\"metadata-d\">Title | Summary | Release date | Next release | Contact | Summary | NS status | Cancel</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"metadata-list\">\n          <div>\n            <label for=\"title\">Title\n              <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"summary-p\">\n            <label for=\"summary\">Summary\n              <textarea class=\"auto-size\" type=\"text\" id=\"summary\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.summary : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n			<div class=\"release-date\">\n              <label for=\"releaseDate\">Release date and time\n                  <input id=\"releaseDate\" type=\"text\" placeholder=\"Day month year\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.releaseDate : stack1), depth0))
    + "\"/>\n              </label>\n\n              <div class=\"select-wrap select-wrap--small\">\n                <select id=\"release-hour\">\n"
    + ((stack1 = this.invokePartial(partials.selectorHour,depth0,{"name":"selectorHour","data":data,"indent":"                  ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "                </select>\n              </div>\n              <div class=\"select-wrap select-wrap--small\">\n                <select id=\"release-min\">\n"
    + ((stack1 = this.invokePartial(partials.selectorMinute,depth0,{"name":"selectorMinute","data":data,"indent":"                  ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "                </select>\n              </div>\n			</div>\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.finalised : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "          <div class=\"next-p\">\n            <label for=\"nextRelease\">Next release\n              <textarea class=\"auto-size\" type=\"text\" id=\"nextRelease\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.nextRelease : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactName\">Contact name\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactName\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.name : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactEmail\">Contact email\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactEmail\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.email : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactTelephone\">Contact telephone\n              <textarea class=\"auto-size\" type=\"text\"\n                        id=\"contactTelephone\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.telephone : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"natStat\">\n            <label for=\"natStat-checkbox\">National statistic </label>\n            <input id=\"natStat-checkbox\" type=\"checkbox\" name=\"natStat\" value=\"false\" class=\"checkbox\"/>\n          </div>\n          <div id=\"cancelled\">\n            <label for=\"cancelled\">Cancelled </label>\n            <input type=\"checkbox\" name=\"cancelled\" value=\"false\" class=\"checkbox\"/>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div id=\"prerelease\"></div>\n\n    <div id=\"cancellation\"></div>\n\n    <div id=\"changeDate\"></div>\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Preview release content</h1>\n\n        <p>References</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"add-preview\">Preview</button>\n        </div>\n      </div>\n    </div>\n\n  </div>\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT1Sections'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "    <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n        <div class=\"edit-section__sortable-item--counter float-left\">"
    + alias3((helpers.plus || (depth0 && depth0.plus) || alias1).call(depth0,(data && data.index),1,{"name":"plus","hash":{},"data":data}))
    + ". </div>\n        <p id=\"section-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.statistics : depth0)) != null ? stack1.title : stack1), depth0))
    + "</p>\n        <button class=\"btn-markdown-edit\" id=\"section-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n    </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,depth0,{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
templates['workEditT2'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n  <div class=\"edit-accordion\">\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Metadata</h1>\n        <p>Title | Summary | Keywords</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"metadata-list\">\n          <div>\n            <label for=\"title\">Title\n              <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"summary-p\">\n            <label for=\"summary\">Summary\n              <textarea class=\"auto-size\" type=\"text\" id=\"summary\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.summary : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"keywords\">Keywords\n              <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\" style=\"display: none;\">\n            </label>\n            <ul id=\"keywordsTag\"></ul>\n          </div>\n          <div>\n            <label for=\"metaDescription\">Meta description\n              <textarea class=\"auto-size\" type=\"text\" id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <div id=\"highlights\"></div>\n\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT3'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n  <div class=\"edit-accordion\">\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Metadata</h1>\n        <p>Title | Summary | Keywords</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"metadata-list\">\n          <div>\n            <label for=\"title\">Title\n              <textarea class=\"auto-size\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"summary-p\">\n            <label for=\"summary\">Summary\n              <textarea class=\"auto-size\" id=\"summary\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.summary : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"keywords\">Keywords\n              <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\" style=\"display: none;\">\n            </label>\n            <ul id=\"keywordsTag\"></ul>\n          </div>\n          <div>\n            <label for=\"metaDescription\">Meta description\n              <textarea class=\"auto-size\" id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div id=\"timeseries\"></div>\n\n    <div id=\"bulletins\"></div>\n\n    <div id=\"articles\"></div>\n\n    <div id=\"datasets\"></div>\n\n    <div id=\"qmi\"></div>\n\n    <div id=\"methodology\"></div>\n\n  </div>\n\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT4Article'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n  <div class=\"edit-accordion\">\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Metadata</h1>\n        <p id=\"metadata-a\">Title | Contact | Abstract | Keywords</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"metadata-list\">\n          <div>\n            <label for=\"title\">Title\n              <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div class=\"edition\">\n            <label for=\"edition\">Edition\n              <textarea class=\"auto-size\" type=\"text\" id=\"edition\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div class=\"release-date\">\n            <label for=\"releaseDate\">Release date\n              <input id=\"releaseDate\" type=\"text\" placeholder=\"Day month year\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.releaseDate : stack1), depth0))
    + "\"/>\n            </label>\n          </div>\n          <div class=\"next-p\">\n            <label for=\"nextRelease\">Next release\n              <textarea class=\"auto-size\" type=\"text\" id=\"nextRelease\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.nextRelease : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactName\">Contact name\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactName\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.name : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactEmail\">Contact email\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactEmail\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.email : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactTelephone\">Contact telephone\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactTelephone\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.telephone : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"abstract-p\">\n            <label for=\"abstract\">Abstract\n              <textarea class=\"auto-size\" type=\"text\" id=\"abstract\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1._abstract : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"natStat\">\n            <label for=\"natStat-checkbox\">National statistic </label>\n            <input id=\"natStat-checkbox\" type=\"checkbox\" name=\"natStat\" value=\"false\" />\n          </div>\n          <div>\n            <label for=\"keywords\">Keywords\n              <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\" style=\"display: none;\">\n            </label>\n            <ul id=\"keywordsTag\"></ul>\n          </div>\n          <div>\n            <label for=\"metaDescription\">Meta description\n              <textarea class=\"auto-size\" type=\"text\" id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div id=\"section\"></div>\n\n    <div id=\"tab\"></div>\n\n    <div id=\"charts\"></div>\n\n    <div id=\"tables\"></div>\n\n    <div id=\"images\"></div>\n\n    <div id=\"article\"></div>\n\n    <div id=\"document\"></div>\n\n    <div id=\"data\"></div>\n\n    <div id=\"topics\"></div>\n\n    <div id=\"link\"></div>\n\n    <div id=\"qmi\"></div>\n\n    <div id=\"methodology\"></div>\n\n    <div id=\"correction\"></div>\n\n    <div id=\"alert\"></div>\n\n  </div>\n\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT4ArticleDownload'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n  <div class=\"edit-accordion\">\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Metadata</h1>\n        <p id=\"metadata-b\">Title | Next release | Contact | Summary | NS status | Keywords</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"metadata-list\">\n          <div>\n            <label for=\"title\">Title\n              <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div class=\"edition\">\n            <label for=\"edition\">Edition\n              <textarea class=\"auto-size\" type=\"text\" id=\"edition\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div class=\"release-date\">\n            <label for=\"releaseDate\">Release date\n              <input id=\"releaseDate\" type=\"text\" placeholder=\"Day month year\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.releaseDate : stack1), depth0))
    + "\"/>\n\n            </label>\n          </div>\n          <div class=\"next-p\">\n            <label for=\"nextRelease\">Next release\n              <textarea class=\"auto-size\" type=\"text\" id=\"nextRelease\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.nextRelease : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactName\">Contact name\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactName\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.name : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactEmail\">Contact email\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactEmail\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.email : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactTelephone\">Contact telephone\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactTelephone\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.telephone : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"summary-p\">\n            <label for=\"abstract\">Abstract\n              <textarea class=\"auto-size\" type=\"text\" id=\"abstract\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1._abstract : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"natStat\">\n            <label for=\"natStat-checkbox\">National statistic </label>\n            <input id=\"natStat-checkbox\" type=\"checkbox\" name=\"natStat\" value=\"false\" />\n          </div>\n          <div>\n            <label for=\"keywords\">Keywords\n              <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\" style=\"display: none;\">\n            </label>\n            <ul id=\"keywordsTag\"></ul>\n          </div>\n          <div>\n            <label for=\"metaDescription\">Meta description\n              <textarea class=\"auto-size\" type=\"text\" id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div id=\"content\"></div>\n\n    <div id=\"file\"></div>\n\n    <div id=\"charts\"></div>\n\n    <div id=\"tables\"></div>\n\n    <div id=\"images\"></div>\n\n    <div id=\"document\"></div>\n\n    <div id=\"data\"></div>\n\n    <div id=\"topics\"></div>\n\n    <div id=\"link\"></div>\n\n    <div id=\"qmi\"></div>\n\n    <div id=\"methodology\"></div>\n\n    <div id=\"alert\"></div>\n\n    <div id=\"correction\"></div>\n\n  </div>\n\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT4Bulletin'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n  <div class=\"edit-accordion\">\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Metadata</h1>\n        <p id=\"metadata-b\">Title | Next release | Contact | Summary | NS status | Keywords</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"metadata-list\">\n          <div>\n            <label for=\"title\">Title\n            <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div class=\"edition\">\n            <label for=\"edition\">Edition\n              <textarea class=\"auto-size\" type=\"text\" id=\"edition\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div class=\"release-date\">\n            <label for=\"releaseDate\">Release date\n              <input id=\"releaseDate\" type=\"text\" placeholder=\"Day month year\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.releaseDate : stack1), depth0))
    + "\"/>\n\n            </label>\n          </div>\n          <div class=\"next-p\">\n            <label for=\"nextRelease\">Next release\n            <textarea class=\"auto-size\" type=\"text\" id=\"nextRelease\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.nextRelease : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactName\">Contact name\n            <textarea class=\"auto-size\" type=\"text\" id=\"contactName\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.name : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactEmail\">Contact email\n            <textarea class=\"auto-size\" type=\"text\" id=\"contactEmail\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.email : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactTelephone\">Contact telephone\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactTelephone\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.telephone : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"summary-p\">\n            <label for=\"summary\">Summary\n            <textarea class=\"auto-size\" type=\"text\" id=\"summary\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.summary : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"natStat\">\n            <label for=\"natStat-checkbox\">National statistic </label>\n            <input id=\"natStat-checkbox\" type=\"checkbox\" name=\"natStat\" value=\"false\" />\n          </div>\n          <div id=\"headline1-p\">\n            <label for=\"headline1\">Headline 1\n            <textarea class=\"auto-size\" type=\"text\" id=\"headline1\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.headline1 : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"headline2-p\">\n            <label for=\"headline2\">Headline 2\n            <textarea class=\"auto-size\" type=\"text\" id=\"headline2\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.headline2 : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"headline3-p\">\n            <label for=\"headline3\">Headline 3\n            <textarea class=\"auto-size\" type=\"text\" id=\"headline3\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.headline3 : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"keywords\">Keywords\n            <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\" style=\"display: none;\">\n            </label>\n            <ul id=\"keywordsTag\"></ul>\n          </div>\n          <div>\n            <label for=\"metaDescription\">Meta description\n              <textarea class=\"auto-size\" type=\"text\" id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div id=\"section\"></div>\n\n    <div id=\"tab\"></div>\n\n    <div id=\"charts\"></div>\n\n    <div id=\"tables\"></div>\n\n    <div id=\"images\"></div>\n\n    <div id=\"bulletin\"></div>\n\n    <div id=\"document\"></div>\n\n    <div id=\"data\"></div>\n\n    <div id=\"topics\"></div>\n\n    <div id=\"link\"></div>\n\n    <div id=\"qmi\"></div>\n\n    <div id=\"methodology\"></div>\n\n    <div id=\"correction\"></div>\n\n    <div id=\"alert\"></div>\n\n  </div>\n\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"      ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT4Compendium'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n\n  <div class=\"child-page\">\n    <p class=\"child-page__content\">This is a sub-page of <span class=\"child-page__title\"></span></p>\n  </div>\n\n  <div class=\"edit-accordion\">\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Metadata</h1>\n        <p id=\"metadata-a\">Title | Contact | Abstract | Keywords</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"metadata-list\">\n          <div>\n            <label for=\"title\">Title\n              <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div class=\"edition\">\n            <label for=\"edition\">Headline\n              <textarea class=\"auto-size\" type=\"text\" id=\"headline\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.headline : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div class=\"release-date\">\n            <label for=\"releaseDate\">Release date\n              <input id=\"releaseDate\" type=\"text\" placeholder=\"Day month year\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.releaseDate : stack1), depth0))
    + "\"/>\n            </label>\n          </div>\n          <div class=\"next-p\">\n            <label for=\"nextRelease\">Next release\n              <textarea class=\"auto-size\" type=\"text\" id=\"nextRelease\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.nextRelease : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactName\">Contact name\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactName\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.name : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactEmail\">Contact email\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactEmail\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.email : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactTelephone\">Contact telephone\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactTelephone\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.telephone : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"abstract-p\">\n            <label for=\"abstract\">Abstract\n              <textarea class=\"auto-size\" type=\"text\" id=\"abstract\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1._abstract : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"natStat\">\n            <label for=\"natStat-checkbox\">National statistic </label>\n            <input id=\"natStat-checkbox\" type=\"checkbox\" name=\"natStat\" value=\"false\" />\n          </div>\n          <div>\n            <label for=\"keywords\">Keywords\n              <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\" style=\"display: none;\">\n            </label>\n            <ul id=\"keywordsTag\"></ul>\n          </div>\n          <div>\n            <label for=\"metaDescription\">Meta description\n              <textarea class=\"auto-size\" type=\"text\" id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div id=\"section\"></div>\n\n    <div id=\"tab\"></div>\n\n    <div id=\"charts\"></div>\n\n    <div id=\"tables\"></div>\n\n    <div id=\"images\"></div>\n\n    <div id=\"document\"></div>\n\n    <div id=\"data\"></div>\n\n    <div id=\"topics\"></div>\n\n    <div id=\"link\"></div>\n\n    <div id=\"qmi\"></div>\n\n    <div id=\"methodology\"></div>\n\n    <div id=\"correction\"></div>\n\n    <div id=\"alert\"></div>\n\n  </div>\n\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNavChild,depth0,{"name":"editNavChild","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT4Methodology'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n  <div class=\"edit-accordion\">\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Metadata</h1>\n        <p id=\"metadata-m\">Title | Contact | Summary | Keywords</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"metadata-list\">\n          <div>\n            <label for=\"title\">Title\n              <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div class=\"release-date\">\n            <label for=\"releaseDate\">Release date\n              <input id=\"releaseDate\" type=\"text\" placeholder=\"Day month year\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.releaseDate : stack1), depth0))
    + "\"/>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactName\">Contact name\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactName\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.name : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactEmail\">Contact email\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactEmail\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.email : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactTelephone\">Contact telephone\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactTelephone\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.telephone : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"summary-p\">\n            <label for=\"summary\">Summary\n              <textarea class=\"auto-size\" type=\"text\" id=\"summary\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.summary : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"keywords\">Keywords\n              <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\" style=\"display: none;\">\n            </label>\n            <ul id=\"keywordsTag\"></ul>\n          </div>\n          <div>\n            <label for=\"metaDescription\">Meta description\n              <textarea class=\"auto-size\" type=\"text\" id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div id=\"section\"></div>\n\n    <div id=\"tab\"></div>\n\n    <div id=\"charts\"></div>\n\n    <div id=\"tables\"></div>\n\n    <div id=\"images\"></div>\n\n    <div id=\"document\"></div>\n\n    <div id=\"dataset\"></div>\n\n    <div id=\"topics\"></div>\n\n    <!--<div id=\"topics\"></div>-->\n\n    <!--<div id=\"link\"></div>-->\n\n    <!--<div id=\"qmi\"></div>-->\n\n    <div id=\"alert\"></div>\n\n  </div>\n\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT5'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n  <div class=\"edit-accordion\">\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Metadata</h1>\n        <p id=\"metadata-a\">Title | Next release | Key note | Unit | NS | Source</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"metadata-list\">\n          <div>\n            <label for=\"title\">Title\n              <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div class=\"next-p\">\n            <label for=\"nextRelease\">Next release\n              <textarea class=\"auto-size\" type=\"text\" id=\"nextRelease\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.nextRelease : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactName\">Contact name\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactName\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.name : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactEmail\">Contact email\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactEmail\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.email : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactTelephone\">Contact telephone\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactTelephone\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.telephone : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"number\">Number\n              <textarea class=\"auto-size\" type=\"text\" id=\"number\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.number : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"keyNote\">Key note\n              <textarea class=\"auto-size\" type=\"text\" id=\"keyNote\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keyNote : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"natStat\">\n            <label for=\"natStat-checkbox\">National statistic </label>\n            <input id=\"natStat-checkbox\" type=\"checkbox\" name=\"natStat\" value=\"false\" />\n          </div>\n          <div>\n            <label for=\"unit\">Unit\n              <textarea class=\"auto-size\" type=\"text\" id=\"unit\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.unit : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"preUnit\">Pre unit\n              <textarea class=\"auto-size\" type=\"text\" id=\"preUnit\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.preUnit : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"isIndex\">\n            <label for=\"isIndex\">Index? </label>\n            <input type=\"checkbox\" name=\"isIndex\" value=\"false\" />\n          </div>\n          <div>\n            <label for=\"source\">Source\n              <textarea class=\"auto-size\" type=\"text\" id=\"source\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.source : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"keywords\">Keywords\n              <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\" style=\"display: none;\">\n            </label>\n            <ul id=\"keywordsTag\"></ul>\n          </div>\n          <div>\n            <label for=\"metaDescription\">Meta description\n              <textarea class=\"auto-size\" type=\"text\" id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div id=\"one\"></div>\n\n    <div id=\"note\"></div>\n\n    <div id=\"document\"></div>\n\n    <div id=\"timeseries\"></div>\n\n    <div id=\"dataset\"></div>\n\n    <div id=\"qmi\"></div>\n\n    <div id=\"methodology\"></div>\n\n    <div id=\"topics\"></div>\n\n    <div id=\"alert\"></div>\n\n  </div>\n\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT6'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n  <div class=\"edit-accordion\">\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Metadata</h1>\n        <p id=\"metadata-b\">Title | Next release | Contact | Summary | NS status | Keywords</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"metadata-list\">\n          <div>\n            <label for=\"title\">Title\n              <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div class=\"edition\">\n            <label for=\"edition\">Edition\n              <textarea class=\"auto-size\" type=\"text\" id=\"edition\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div class=\"release-date\">\n            <label for=\"releaseDate\">Release date\n              <input id=\"releaseDate\" type=\"text\" placeholder=\"Day month year\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.releaseDate : stack1), depth0))
    + "\"/>\n            </label>\n          </div>\n          <div class=\"next-p\">\n            <label for=\"nextRelease\">Next release\n              <textarea class=\"auto-size\" type=\"text\" id=\"nextRelease\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.nextRelease : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactName\">Contact name\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactName\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.name : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactEmail\">Contact email\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactEmail\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.email : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactTelephone\">Contact telephone\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactTelephone\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.telephone : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"abstract-p\">\n            <label for=\"abstract\">Summary\n              <textarea class=\"auto-size\" type=\"text\" id=\"summary\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.summary : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"natStat\">\n            <label for=\"natStat-checkbox\">National statistic </label>\n            <input id=\"natStat-checkbox\" type=\"checkbox\" name=\"natStat\" value=\"false\" />\n          </div>\n          <div>\n            <label for=\"keywords\">Keywords\n              <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\" style=\"display: none;\">\n            </label>\n            <ul id=\"keywordsTag\"></ul>\n          </div>\n          <div>\n            <label for=\"metaDescription\">Meta description\n              <textarea class=\"auto-size\" type=\"text\" id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Chapters</h1>\n        <p>Title</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-chapter\" class=\"edit-section__sortable\">\n          <div id=\"chapters\"></div>\n        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"add-chapter\">Add chapter</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Compendium data</h1>\n        <p>Title</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-compendium-data\" class=\"edit-section__sortable\">\n          <div id=\"datasets\"></div>\n        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"add-compendium-data\">Add data</button>\n        </div>\n      </div>\n    </div>\n\n    <div id=\"document\"></div>\n\n    <div id=\"data\"></div>\n\n    <div id=\"qmi\"></div>\n\n    <div id=\"methodology\"></div>\n\n    <div id=\"alert\"></div>\n\n  </div>\n\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT6Chapter'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "  <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n    <div class=\"edit-section__sortable-item--counter float-left\">"
    + alias3((helpers.plus || (depth0 && depth0.plus) || alias1).call(depth0,(data && data.index),1,{"name":"plus","hash":{},"data":data}))
    + ".</div>\n    <div id=\"chapter-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__title\">"
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</div>\n    <div class=\"edit-section__buttons\">\n      <button class=\"btn-markdown-edit\" id=\"chapter-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n      <button class=\"btn-page-delete\" id=\"chapter-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n    </div>\n  </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,depth0,{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
templates['workEditT6Dataset'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "  <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__item\">\n    <p id=\"compendium-data-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</p>\n\n    <div class=\"edit-section__buttons\">\n      <button class=\"btn-markdown-edit\" id=\"compendium-data-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n      <button class=\"btn-page-delete\" id=\"compendium-data-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n    </div>\n  </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,depth0,{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
templates['workEditT7'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n  <div class=\"edit-accordion\">\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Metadata</h1>\n        <p id=\"metadata-ad\">Title | Release date | Reference | Keywords</p>\n        <p id=\"metadata-f\">Title | Release date | Keywords</p>\n        <p id=\"metadata-md\">Title | Contact | Revised | Keywords</p>\n        <p id=\"metadata-q\">Title | Contact | Survey | Frequency | How compiled | Coverage | Size | Revised |\n            Keywords</p>\n        <p id=\"metadata-s\">Title | Summary | Keywords</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"metadata-list\">\n          <div>\n            <label for=\"title\">Title\n              <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"summary-p\">\n            <label for=\"summary\">Summary\n              <textarea class=\"auto-size\" type=\"text\" id=\"summary\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.summary : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"natStat\">\n            <label for=\"natStat-checkbox\">National statistic </label>\n            <input id=\"natStat-checkbox\" type=\"checkbox\" name=\"natStat\" value=\"false\" />\n          </div>\n          <div id=\"contact-p\">\n            <label for=\"contactName\">Contact name\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactName\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.name : stack1), depth0))
    + "</textarea>\n            </label>\n            <label for=\"contactEmail\">Contact email\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactEmail\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.email : stack1), depth0))
    + "</textarea>\n            </label>\n            <label for=\"contactPhone\">Contact phone\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactTelephone\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.telephone : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"survey-p\">\n            <label for=\"survey\">Survey name\n              <textarea class=\"auto-size\" type=\"text\" id=\"survey\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.surveyName : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"frequency-p\">\n            <label for=\"frequency\">Frequency\n              <textarea class=\"auto-size\" type=\"text\" id=\"frequency\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.frequency : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"compilation-p\">\n            <label for=\"compilation\">How compiled\n              <textarea class=\"auto-size\" type=\"text\" id=\"compilation\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.compilation : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"geoCoverage-p\">\n            <label for=\"geoCoverage\">Geographic coverage\n              <textarea class=\"auto-size\" type=\"text\" id=\"geoCoverage\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.geographicCoverage : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"sampleSize-p\">\n            <label for=\"sampleSize\">Sample size\n              <textarea class=\"auto-size\" type=\"text\" id=\"sampleSize\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.sampleSize : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div class=\"lastRevised-p\">\n            <label for=\"lastRevised\">Last revised\n              <input type=\"text\" id=\"lastRevised\" placeholder=\"Day month year\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.lastRevised : stack1), depth0))
    + "\"/>\n            </label>\n          </div>\n          <div class=\"release-date\">\n            <label for=\"releaseDate\">Release date\n              <input id=\"releaseDate\" type=\"text\" placeholder=\"Day month year\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.releaseDate : stack1), depth0))
    + "\"/>\n            </label>\n          </div>\n          <div id=\"reference-p\">\n            <label for=\"reference\">Reference\n              <textarea class=\"auto-size\" type=\"text\" id=\"reference\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.reference : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"keywords\">Keywords\n              <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\" style=\"display: none;\">\n            </label>\n            <ul id=\"keywordsTag\"></ul>\n          </div>\n          <div>\n            <label for=\"metaDescription\">Meta description\n              <textarea class=\"auto-size\" type=\"text\" id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div id=\"content\"></div>\n\n    <div id=\"file\"></div>\n\n    <div id=\"document\"></div>\n\n    <div id=\"dataset\"></div>\n\n    <div id=\"link\"></div>\n\n    <div id=\"alert\"></div>\n\n  </div>\n\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT7Landing'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              <textarea class=\"auto-size\" id=\"section-uri_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Copy link or click Go to, navigate to page and click Copy link. Then add a title and click Edit\">"
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <textarea class=\"auto-size\" id=\"section-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Type a title and click Edit\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <textarea style=\"display: none;\" id=\"section-markdown_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.summary || (depth0 != null ? depth0.summary : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"summary","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-markdown-edit\" id=\"section-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n              <button class=\"btn-page-delete\" id=\"section-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n  <div class=\"edit-accordion\">\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Metadata</h1>\n        <p>Title | Summary | Keywords</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"metadata-list\">\n          <div>\n            <label for=\"title\">Title\n              <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"summary-p\">\n            <label for=\"summary\">Summary\n              <textarea class=\"auto-size\" type=\"text\" id=\"summary\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.summary : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"keywords\">Keywords\n              <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\" style=\"display: none;\">\n            </label>\n            <ul id=\"keywordsTag\"></ul>\n          </div>\n          <div>\n            <label for=\"metaDescription\">Meta description\n              <textarea class=\"auto-size\" type=\"text\" id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Sections</h1>\n        <p> Link | Summary</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-section\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.sections : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"add-section\">Add section</button>\n        </div>\n      </div>\n    </div>\n\n    <div id=\"edition\"></div>\n\n    <div id=\"content\"></div>\n\n    <div id=\"link\"></div>\n\n  </div>\n\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT8'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<section class=\"panel workspace-edit\">\n\n  <div class=\"child-page\">\n    <p class=\"child-page__content\">This is a sub-page of <span class=\"child-page__title\"></span></p>\n  </div>\n\n  <div class=\"edit-accordion\">\n\n    <div id=\"one\"></div>\n\n    <div id=\"version\"></div>\n\n    <div id=\"correction\"></div>\n\n    <div id=\"supplementary-files\"></div>\n\n  </div>\n\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNavChild,depth0,{"name":"editNavChild","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT8Compendium'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n\n  <div class=\"child-page\">\n    <p class=\"child-page__content\">This is a sub-page of <span class=\"child-page__title\"></span></p>\n  </div>\n\n  <div class=\"edit-accordion\">\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Metadata</h1>\n\n        <p id=\"metadata-d\">Title | Next release | Contact | Summary | NS status | Keywords</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"metadata-list\">\n          <div>\n            <label for=\"title\">Title\n              <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"summary-p\">\n            <label for=\"summary\">Summary\n              <textarea class=\"auto-size\" type=\"text\" id=\"summary\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.summary : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div class=\"release-date\">\n            <label for=\"releaseDate\">Release date\n              <input id=\"releaseDate\" type=\"text\" placeholder=\"Day month year\"\n                     value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.releaseDate : stack1), depth0))
    + "\"/>\n            </label>\n          </div>\n          <div class=\"next-p\">\n            <label for=\"nextRelease\">Next release\n              <textarea class=\"auto-size\" type=\"text\" id=\"nextRelease\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.nextRelease : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactName\">Contact name\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactName\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.name : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactEmail\">Contact email\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactEmail\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.email : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactTelephone\">Contact telephone\n              <textarea class=\"auto-size\" type=\"text\"\n                        id=\"contactTelephone\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.telephone : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"datasetId\">Dataset ID\n              <textarea class=\"auto-size\" type=\"text\" id=\"datasetId\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.datasetId : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"natStat\">\n            <label for=\"natStat-checkbox\">National statistic </label>\n            <input id=\"natStat-checkbox\" type=\"checkbox\" name=\"natStat\" value=\"false\"/>\n          </div>\n          <div>\n            <label for=\"keywords\">Keywords\n              <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\" style=\"display: none;\">\n            </label>\n            <ul id=\"keywordsTag\"></ul>\n          </div>\n          <div>\n            <label for=\"metaDescription\">Meta description\n              <textarea class=\"auto-size\" type=\"text\"\n                        id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div id=\"file\"></div>\n\n    <div id=\"document\"></div>\n\n    <div id=\"dataset\"></div>\n\n    <div id=\"qmi\"></div>\n\n    <div id=\"methodology\"></div>\n\n    <div id=\"correction\"></div>\n\n  </div>\n\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNavChild,depth0,{"name":"editNavChild","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT8CorrectionList'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression, alias4=this.lambda;

  return "      <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__item\">\n        <div id=\"correction-edition_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" correction-url=\""
    + alias3(alias4((depth0 != null ? depth0.uri : depth0), depth0))
    + "\">"
    + alias3(alias4((depth0 != null ? depth0.label : depth0), depth0))
    + "</div>\n        <input id=\"correction-date_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" type=\"text\" placeholder=\"Day month year\"\n               value=\""
    + alias3(alias4((depth0 != null ? depth0.updateDate : depth0), depth0))
    + "\"/>\n        <textarea style=\"display: none;\" id=\"correction-markdown_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(alias4((depth0 != null ? depth0.correctionNotice : depth0), depth0))
    + "</textarea>\n        <button class=\"btn-markdown-edit\" id=\"correction-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit notice</button>\n        <button class=\"btn-page-delete\" id=\"correction-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n      </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div id=\""
    + this.escapeExpression(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "-section\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.list : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</div>";
},"useData":true});
templates['workEditT8LandingDatasetList'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "  <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n    <p id=\"edition_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1), depth0))
    + "</p>\n    <button class=\"btn-markdown-edit\" id=\"edition-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Update / Add supplementary file</button>\n    <button class=\"btn-page-delete\" id=\"edition-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete file</button>\n  </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,depth0,{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
templates['workEditT8LandingPage'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n  <div class=\"edit-accordion\">\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Metadata</h1>\n        <p id=\"metadata-d\">Title | Next release | Contact | Summary | NS status | Keywords</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"metadata-list\">\n          <div>\n            <label for=\"title\">Title\n              <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"summary-p\">\n            <label for=\"summary\">Summary\n              <textarea class=\"auto-size\" type=\"text\" id=\"summary\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.summary : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div class=\"release-date\">\n            <label for=\"releaseDate\">Release date\n              <input id=\"releaseDate\" type=\"text\" placeholder=\"Day month year\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.releaseDate : stack1), depth0))
    + "\"/>\n            </label>\n          </div>\n          <div class=\"next-p\">\n            <label for=\"nextRelease\">Next release\n              <textarea class=\"auto-size\" type=\"text\" id=\"nextRelease\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.nextRelease : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactName\">Contact name\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactName\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.name : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactEmail\">Contact email\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactEmail\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.email : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactTelephone\">Contact telephone\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactTelephone\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.telephone : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"datasetId\">Dataset ID\n              <textarea class=\"auto-size\" type=\"text\" id=\"datasetId\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.datasetId : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"natStat\">\n            <label for=\"natStat-checkbox\">National statistic </label>\n            <input id=\"natStat-checkbox\" type=\"checkbox\" name=\"natStat\" value=\"false\" />\n          </div>\n          <div>\n            <label for=\"keywords\">Keywords\n              <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\" style=\"display: none;\">\n            </label>\n            <ul id=\"keywordsTag\"></ul>\n          </div>\n          <div>\n            <label for=\"metaDescription\">Meta description\n              <textarea class=\"auto-size\" type=\"text\" id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div id=\"one\"></div>\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Download options</h1>\n        <p>Title</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-edition\" class=\"edit-section__sortable\">\n          <div id=\"edition\"></div>\n        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"add-edition\">Add spreadsheet</button>\n        </div>\n      </div>\n    </div>\n\n    <div id=\"dataset\"></div>\n\n    <div id=\"document\"></div>\n\n    <div id=\"qmi\"></div>\n\n    <div id=\"methodology\"></div>\n\n    <div id=\"topics\"></div>\n\n    <div id=\"alert\"></div>\n\n  </div>\n\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT8VersionList'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "  <div id=\""
    + this.escapeExpression(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "-section\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.list : depth0),{"name":"each","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "  </div>\n";
},"2":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.type : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"3":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression, alias4=this.lambda;

  return "        <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__item\">\n          <div id=\"correction-edition_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" correction-url=\""
    + alias3(alias4((depth0 != null ? depth0.uri : depth0), depth0))
    + "\">"
    + alias3(alias4((depth0 != null ? depth0.label : depth0), depth0))
    + "</div>\n          <input id=\"correction-date_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" type=\"text\" placeholder=\"Day month year\"\n                 value=\""
    + alias3(alias4((depth0 != null ? depth0.updateDate : depth0), depth0))
    + "\"/>\n          <textarea style=\"display: none;\" id=\"correction-markdown_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(alias4((depth0 != null ? depth0.correctionNotice : depth0), depth0))
    + "</textarea>\n          <textarea style=\"display: none;\" id=\"correction-markdown-label_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(alias4((depth0 != null ? depth0.label : depth0), depth0))
    + "</textarea>\n          <button class=\"btn-markdown-edit\" id=\"correction-edit-label_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit label</button>\n          <button class=\"btn-markdown-edit\" id=\"correction-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit notice</button>\n          <button class=\"btn-page-delete\" id=\"correction-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n        </div>\n";
},"5":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "  <div id=\""
    + this.escapeExpression(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "-section\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.list : depth0),{"name":"each","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "  </div>\n";
},"6":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.type : depth0),{"name":"unless","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"7":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression, alias4=this.lambda;

  return "        <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__item\">\n          <div id=\"version-edition_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" version-url=\""
    + alias3(alias4((depth0 != null ? depth0.uri : depth0), depth0))
    + "\">"
    + alias3(alias4((depth0 != null ? depth0.label : depth0), depth0))
    + "</div>\n          <input id=\"version-date_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" type=\"text\" placeholder=\"Day month year\"\n                 value=\""
    + alias3(alias4((depth0 != null ? depth0.updateDate : depth0), depth0))
    + "\"/>\n          <textarea style=\"display: none;\" id=\"version-markdown-label_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(alias4((depth0 != null ? depth0.label : depth0), depth0))
    + "</textarea>\n          <button class=\"btn-markdown-edit\" id=\"version-edit-label_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit label</button>\n          <button class=\"btn-page-delete\" id=\"version-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n        </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.correction : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(5, data, 0),"data":data})) != null ? stack1 : "");
},"useData":true});
templates['workEditTables'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "        <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n          <div class=\"edit-section__title\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</div>\n          <div id=\"table-to-be-copied_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" style=\"display: none\">&ltons-table path=\""
    + alias3(((helper = (helper = helpers.filename || (depth0 != null ? depth0.filename : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"filename","hash":{},"data":data}) : helper)))
    + "\" /&gt</div>\n          <div class=\"edit-section__buttons\">\n            <button class=\"btn-markdown-edit\" id=\"table-copy_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Copy</button>\n            <button class=\"btn-markdown-edit\" id=\"table-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n            <button class=\"btn-page-delete\" id=\"table-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n          </div>\n        </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"edit-section\" id=\"tables\">\n  <div class=\"edit-section__head\">\n    <h1>Tables</h1>\n\n    <p>Edit existing tables</p>\n  </div>\n  <div id=\"table-list\" class=\"edit-section__content\">\n    <div id=\"sortable-table\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.tables : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n    <div class=\"text-center\">\n      <button class=\"btn-add-section\" id=\"add-table\">Add table</button>\n    </div>\n  </div>\n</div>";
},"useData":true});
templates['workSpace'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<nav class=\"panel col col--1 workspace-nav\">\n  <ul class=\"nav nav--workspace\">\n    <div id=\"nav--workspace__welsh\" style=\"margin-top: 20px;\"></div>\n      <br/>\n    <li class=\"nav--workspace__browse selected\" id=\"browse\"><a href=\"#\">Browse</a></li>\n    <li class=\"nav--workspace__create\" id=\"create\"><a href=\"#\">Create</a></li>\n    <li class=\"nav--workspace__edit\" id=\"edit\"><a href=\"#\">Edit</a></li>\n  </ul>\n</nav>\n<div class=\"col col--4 workspace-menu\">\n    <p style=\"color: #f5f6f7\">Loading ...</p>\n</div>\n<section class=\"panel col col--7 workspace-browser\">\n  <div class=\"browser\">\n    <div class=\"addressbar\">\n      <button class=\"browser-btn-back\">&lt;</button>\n      <button class=\"browser-btn-forward\">&gt;</button>\n      <label for=\"browser-location\" class=\"browser-location-label\">Preview URL</label><input id=\"browser-location\" class=\"browser-location\" type=\"text\" value=\"\">\n      <button class=\"browser-btn-mobile\">Mobile</button>\n    </div>\n    <iframe id=\"iframe\" src=\""
    + this.escapeExpression(this.lambda(depth0, depth0))
    + "\"></iframe>\n  </div>\n</section>\n";
},"useData":true});
})();