/*
 * jQuery multiselect 1.0.0
 * https://github.com/kjepo/multiselect/
 *
 * Copyright 2020, Kjell Post
 * http://www.irstafoto.se
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

(function ($) {
    'use strict';

    $.fn.multiselect = function(actn, forbidden) {

	if (actn == "reset") {
	    console.log("reset!");
	    this.removeClass("mt-selected").removeClass("mt-disabled");
	    dimExcluded();
	    satOK();
	    return true;
	} else if (actn == "init") {
	    this.click(function() { multiselect($(this)); });
	    dimExcluded();
	    satOK();
	    return this;
	}

	// return true iff p selected is still a legal configuration
	function illegal(p, forbidden) {
	    var name = p.attr("data-mt-name");
	    if (!name) {
		console.warn("Warning: an element doesn't have the attribute data-mt-name defined");
		return false;
	    }

	    for (var i = 0; i < forbidden.length; i++) {
		var fi = forbidden[i];
		var found = false;
		for (var j = 0; j < fi.length; j++)
		    if (fi[j] == name)
			found = true;
		// found == true iff name in forbidden[i]
		// now check the other elements in forbidden[i] to see if they are selected
		if (found) {
		    for (var j = 0; j < fi.length; j++) {
			var name1 = fi[j];
			if (name == name1)
			    continue;
			var e = $(".mt-selected[data-mt-name='" + name1 + "']");
			if (e.length == 0)
			    found = false;
		    }
		}
		// found == true iff all elements in forbidden[i] are selected as well
		if (found)
		    return false;
	    }
	    return true;
	}
	
	function satOK() {
	    // find largest column
	    var c = 0;
	    $(".mt-select").each(function() {
		c = Math.max(c, $(this).attr("data-mt-col"));
	    });
	    // check all columns have one choice
	    var s = true;
	    for (var i = 0; i <= c; i++) {
		var p = $(".mt-selected[data-mt-col=" + i + "]");
		var l = p.length;
		if (l == 0) {
		    s  = false;
		    $(".mt-header-column-" + i)
			.html($(".mt-header-column-" + i).attr("data-mt-name"))
			.removeClass("btn-success")
			.addClass("btn-secondary");
		} else {
		    $(".mt-header-column-" + i)
			.html(p.attr("data-mt-name"))
			.removeClass("btn-secondary")
			.addClass("btn-success");

		}
	    }
	}

	function dimExcluded() {
	    $(".mt-select").each(function() {
		var p = $(this);
		if (!illegal(p, forbidden))
		    p.addClass("mt-disabled");
		else
		    p.removeClass("mt-disabled");
	    });
	}

	function multiselect(p) {
	    if (p.hasClass("mt-selected"))
		p.removeClass("mt-selected"); // turn off
	    else {        
		// turn on, but first turn off all other in same column
		var c = p.attr("data-mt-col");
		$(".mt-select[data-mt-col=" + c + "]").each(function() {
		    $(this).removeClass("mt-selected");
		});

		// see if selecting p is a legal combination
		if (illegal(p, forbidden)) 
		    p.addClass("mt-selected");
		else
		    p.removeClass("mt-selected");
	    }
	    dimExcluded();
	    satOK();
	    return false;
	}
	
    }

}(jQuery));
