define([
	"dojo/_base/declare",
	"dijit/registry",
	"dojo/on",
	"dojo/_base/lang",
	"dojox/mobile/ScrollableView",
	"dojo/query"
], function(declare, registry, on, lang, ScrollableView){

	return declare("flickerview.SettingsView", [ScrollableView], {

		tagInput: '',
		selectSwitch: '',

		/**
		 *
		 */
		startup: function() {
			this.inherited(arguments);
			//alert('[' + flickerview.QUERY.tags + '|' + flickerview.QUERY.tagmode + '|' + flickerview.QUERY.lang + ']');

			// set default settings
			(this.tagInput = registry.byId("tags")).set('value', flickerview.QUERY.tags);
			(this.selectSwitch = registry.byId("select")).set('value', (flickerview.QUERY.tagmode === "all")?"on":"off");
			registry.byId(flickerview.QUERY.lang).set('checked', true);

			// handler to record the selected feed language
			this.on(".languageFeedRadio:click", function(e){
				flickerview.QUERY.lang = e.target.value;
			});

			// handler to update search query parameters when done button is selected
			registry.byId("doneButton").on("click", lang.hitch(this, function(){
				flickerview.QUERY.tags = this.tagInput.get('value');
				flickerview.QUERY.tagmode = (this.selectSwitch.get('value') === "on")?"all":"any";
				//alert('[' + flickerview.QUERY.tags + '|' + flickerview.QUERY.tagmode + '|' + flickerview.QUERY.lang + ']');
			}));
		}

	});
});
