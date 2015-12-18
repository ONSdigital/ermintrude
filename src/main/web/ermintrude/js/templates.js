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
templates['collectionDetails'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "      <li data-path=\""
    + alias2(alias1((depth0 != null ? depth0.uri : depth0), depth0))
    + "\"><span class=\"page-item page-item--"
    + alias2(alias1((depth0 != null ? depth0.type : depth0), depth0))
    + "\">"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0,((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.language : stack1),"===","cy",{"name":"ifCond","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</span>\n      </li>\n";
},"2":function(depth0,helpers,partials,data) {
    return "(Welsh)\n      ";
},"4":function(depth0,helpers,partials,data) {
    var stack1;

  return ": "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1), depth0));
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<section class=\"panel workspace-edit\">\n<div>\n  <ul class=\"page-list\">\n"
    + ((stack1 = helpers.each.call(depth0,depth0,{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "  </ul>\n</div>\n";
},"useData":true});
templates['collectionList'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "      <tr data-id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-name=\""
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "\">\n        <td headers=\"collection-name\" class=\"collection-name\">"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</td>\n        <td headers=\"collection-date\" class=\"collection-date\">"
    + alias3(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"date","hash":{},"data":data}) : helper)))
    + "</td>\n      </tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<section class=\"panel col col--2 collection-create\">\n</section>\n<section class=\"panel col col--8 collection-select\" xmlns=\"http://www.w3.org/1999/html\">\n  <h1 class=\"text-align-center\">Select a collection</h1>\n  <table class=\"collections-select-table\">\n    <thead>\n    <tr>\n      <th id=\"collection-name\" scope=\"col\">Collection name</th>\n      <th id=\"collection-date\" scope=\"col\">Collection date</th>\n    </tr>\n    </thead>\n    <tbody>\n"
    + ((stack1 = helpers.each.call(depth0,depth0,{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </tbody>\n  </table>\n</section>\n\n<section class=\"panel col col--12 collection-selected\">\n  <section class=\"panel col col--12 workspace-browser\">\n    <div class=\"browser\">\n      <iframe id=\"iframe\" src=\"\"></iframe>\n    </div>\n  </section>\n</section>";
},"useData":true});
templates['ermintrude'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"wrapper\">\n  <nav class=\"admin-nav\">\n  </nav>\n  <div class=\"section\">\n  </div>\n</div>";
},"useData":true});
templates['login'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"col--4 login-wrapper\">\n  <h1>Login</h1>\n\n  <form method=\"post\" action=\"\" class=\"form-login\">\n    <label for=\"email\">Email:</label>\n    <input id=\"email\" type=\"email\" class=\"fl-user-and-access__email\" name=\"email\" cols=\"40\" rows=\"1\"/>\n\n    <label for=\"password\">Password:</label>\n    <input id=\"password\" type=\"password\" class=\"fl-user-and-access__password\" name=\"password\" cols=\"40\" rows=\"1\"/>\n\n    <button type=\"submit\" id=\"login\" class=\"btn-florence-login fl-panel--user-and-access__login \">Log in</button>\n  </form>\n</div>";
},"useData":true});
templates['mainNav'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.collection : depth0)) != null ? stack1.name : stack1),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n      <li class=\"nav--admin__item nav--admin__item--collections "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.Authentication : depth0)) != null ? stack1.isAuthenticated : stack1),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\">\n        <a href=\"#\">Collections</a></li>\n\n      <li class=\"nav--admin__item nav--admin__item--logout\"><a href=\"#\">Logout</a></li>\n";
},"2":function(depth0,helpers,partials,data) {
    var stack1;

  return "        <li id=\"working-on\" class=\"nav--admin__item nav--admin__item--collection selected\"><a href=\"#\">Working\n          on: "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.collection : depth0)) != null ? stack1.name : stack1), depth0))
    + "</a></li>\n";
},"4":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0,((stack1 = (depth0 != null ? depth0.collection : depth0)) != null ? stack1.name : stack1),{"name":"unless","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"5":function(depth0,helpers,partials,data) {
    return "selected";
},"7":function(depth0,helpers,partials,data) {
    return "      <li class=\"nav--admin__item nav--admin__item--login selected\"><a href=\"#\">Login</a></li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<section class=\"col--4 nav-left\">\n  <form method=\"post\" action=\"\" id=\"mainNavSelect\" class=\"form-list-collection\">\n  </form>\n</section>\n<section class=\"col--8 nav-right\">\n  <ul class=\" nav--admin\">\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.Authentication : depth0)) != null ? stack1.isAuthenticated : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + "  </ul>\n</section>\n";
},"useData":true});
templates['mainNavSelect'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "      <option value=\""
    + alias2(alias1((depth0 != null ? depth0.uri : depth0), depth0))
    + "\">"
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</option>\n";
},"2":function(depth0,helpers,partials,data) {
    var stack1;

  return ": "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1), depth0));
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"select-wrap\">\n  <select id=\"docs-list\" name=\"docs-list\">\n    <option value=\"\">Select a document to view</option>\n"
    + ((stack1 = helpers.each.call(depth0,depth0,{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "  </select>\n</div>";
},"useData":true});
templates['userDetails'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"section-head\">\n  <h2>"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</h2>\n</div>\n\n<div class=\"section-content\">\n</div>\n\n<nav class=\"section-nav\">\n  <button class=\"btn-user-change-password btn-collection-work-on\">Change password</button>\n  <button class=\"btn-user-delete btn-page-delete\">Delete user</button>\n  <button class=\"btn-user-cancel btn-collection-cancel\">Cancel</button>\n</nav>\n\n";
},"useData":true});
})();