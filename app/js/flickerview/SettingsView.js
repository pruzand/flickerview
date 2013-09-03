define([
	"dojo/_base/declare",
	"dijit/registry",
	"dojo/on",
	"dojox/mobile/ScrollableView",
	"dojo/query"
], function(declare, registry, on, ScrollableView){

	return declare("flickerview.SettingsView", [ScrollableView], {
		/**
		 *
		 */
		startup: function() {
			this.inherited(arguments);

			on(this, ".languageFeedRadio:click", this.onFeedLanguageChange);
		},

		onFeedLanguageChange: function(e){
			console.log("Language change ! " + e.target.value);
		}
	});
});
