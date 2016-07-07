/* This includes 7 files: src/evo_modal_window.js, src/evo_images.js, src/evo_user_crop.js, src/evo_user_report.js, src/evo_user_contact_groups.js, src/evo_rest_api.js, src/evo_item_flag.js */
function openModalWindow(a,b,c,d,e,f){var g="overlay_page_active";"undefined"!=typeof d&&1==d&&(g="overlay_page_active_transparent"),"undefined"==typeof b&&(b="560px");var h="";return"undefined"!=typeof c&&(c>0||""!=c)&&(h=' style="height:'+c+'"'),jQuery("#overlay_page").length>0?void jQuery("#overlay_page").html(a):(jQuery("body").append('<div id="screen_mask"></div><div id="overlay_wrap" style="width:'+b+'"><div id="overlay_layout"><div id="overlay_page"'+h+"></div></div></div>"),jQuery("#screen_mask").fadeTo(1,.5).fadeIn(200),jQuery("#overlay_page").html(a).addClass(g),void jQuery(document).on("click","#close_button, #screen_mask, #overlay_page",function(a){if("overlay_page"==jQuery(this).attr("id")){var b=jQuery("#overlay_page form");if(b.length){var c=b.position().top+jQuery("#overlay_wrap").position().top,d=c+b.height();a.clientY>c&&a.clientY<d||closeModalWindow()}return!0}return closeModalWindow(),!1}))}function closeModalWindow(a){return"undefined"==typeof a&&(a=window.document),jQuery("#overlay_page",a).hide(),jQuery(".action_messages",a).remove(),jQuery("#server_messages",a).insertBefore(".first_payload_block"),jQuery("#overlay_wrap",a).remove(),jQuery("#screen_mask",a).remove(),!1}function user_crop_avatar(a,b,c){"undefined"==typeof c&&(c="avatar");var d=750,e=320,f=jQuery(window).width(),g=jQuery(window).height(),h=f,i=g,j=i/h;i=i>d?d:i<e?e:i,h=h>d?d:h<e?e:h;var k=10,l=10;k=h-2*k>e?10:0,l=i-2*l>e?10:0;var m=h>d?d:h,n=i>d?d:i;openModalWindow('<span id="spinner" class="loader_img loader_user_report absolute_center" title="'+evo_js_lang_loading+'"></span>',m+"px",n+"px",!0,evo_js_lang_crop_profile_pic,[evo_js_lang_crop,"btn-primary"],!0);var o={top:parseInt(jQuery("div.modal-dialog div.modal-body").css("paddingTop")),right:parseInt(jQuery("div.modal-dialog div.modal-body").css("paddingRight")),bottom:parseInt(jQuery("div.modal-dialog div.modal-body").css("paddingBottom")),left:parseInt(jQuery("div.modal-dialog div.modal-body").css("paddingLeft"))},p=parseInt(jQuery("div.modal-dialog div.modal-body").css("min-height"))-(o.top+o.bottom),q=m-(o.left+o.right),r={user_ID:a,file_ID:b,aspect_ratio:j,content_width:q,content_height:p,display_mode:"js",crumb_user:evo_js_crumb_user};return evo_js_is_backoffice?(r.ctrl="user",r.user_tab="crop",r.user_tab_from=c):(r.blog=evo_js_blog,r.disp="avatar",r.action="crop"),jQuery.ajax({type:"POST",url:evo_js_user_crop_ajax_url,data:r,success:function(a){openModalWindow(a,m+"px",n+"px",!0,evo_js_lang_crop_profile_pic,[evo_js_lang_crop,"btn-primary"])}}),!1}function user_report(a,b){openModalWindow('<span class="loader_img loader_user_report absolute_center" title="'+evo_js_lang_loading+'"></span>',"auto","",!0,evo_js_lang_report_user,[evo_js_lang_report_this_user_now,"btn-danger"],!0);var c={action:"get_user_report_form",user_ID:a,crumb_user:evo_js_crumb_user};return evo_js_is_backoffice?(c.is_backoffice=1,c.user_tab=b):c.blog=evo_js_blog,jQuery.ajax({type:"POST",url:evo_js_user_report_ajax_url,data:c,success:function(a){openModalWindow(a,"auto","",!0,evo_js_lang_report_user,[evo_js_lang_report_this_user_now,"btn-danger"])}}),!1}function user_contact_groups(a){return openModalWindow('<span class="loader_img loader_user_report absolute_center" title="'+evo_js_lang_loading+'"></span>',"auto","",!0,evo_js_lang_contact_groups,evo_js_lang_save,!0),jQuery.ajax({type:"POST",url:evo_js_user_contact_groups_ajax_url,data:{action:"get_user_contact_form",blog:evo_js_blog,user_ID:a,crumb_user:evo_js_crumb_user},success:function(a){openModalWindow(a,"auto","",!0,evo_js_lang_contact_groups,evo_js_lang_save,!0)}}),!1}function evo_rest_api_request(url,params_func,func_method,method,func_fail){var params=params_func,func=func_method;"function"==typeof params_func&&(func=params_func,params={},method=func_method),"undefined"==typeof method&&(method="GET"),jQuery.ajax({contentType:"application/json; charset=utf-8",type:method,url:restapi_url+url,data:params}).then(function(data,textStatus,jqXHR){"object"==typeof jqXHR.responseJSON&&eval(func)(data,textStatus,jqXHR)},function(jqXHR){b2evo_show_debug_ajax_error=!1,"function"==typeof func_fail&&"object"==typeof jqXHR.responseJSON&&eval(func_fail)(jqXHR.responseJSON,jqXHR)})}jQuery(document).keyup(function(a){27==a.keyCode&&closeModalWindow()}),jQuery(document).ready(function(){jQuery("img.loadimg").each(function(){jQuery(this).prop("complete")?jQuery(this).removeClass("loadimg"):jQuery(this).on("load",function(){jQuery(this).removeClass("loadimg")})})}),jQuery(document).on("click","a.evo_post_flag_btn",function(){var a=jQuery(this),b=parseInt(a.data("id"));return b>0&&(a.data("status","inprogress"),jQuery("span",jQuery(this)).addClass("fa-x--hover"),evo_rest_api_request("collections/"+a.data("coll")+"/items/"+b+"/flag",function(b){b.flag?(a.find("span:first").show(),a.find("span:last").hide()):(a.find("span:last").show(),a.find("span:first").hide()),jQuery("span",a).removeClass("fa-x--hover"),setTimeout(function(){a.removeData("status")},500)})),!1}),jQuery(document).on("mouseover","a.evo_post_flag_btn",function(){"inprogress"!=jQuery(this).data("status")&&jQuery("span",jQuery(this)).addClass("fa-x--hover")});