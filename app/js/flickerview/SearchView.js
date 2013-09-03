define([
	"dojo/_base/declare",
	"dijit/registry",
	"dojo/on",
	"dojox/mobile/ScrollableView"
], function(declare, registry, on,  ScrollableView){

	return declare("flickerview.SearchView", [ScrollableView], {

		refreshButton: null,

		startup: function() {
			this.inherited(arguments);
			this.refreshButton = registry.byId("refreshButton");
			// add click handler to the button that call refresh
			on(this.refreshButton, "click", this.refresh );
		},

		refresh: function() {
			console.log("Refresh list ! ");
		}
	});
});
