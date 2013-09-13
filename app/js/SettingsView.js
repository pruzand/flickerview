define([
	"dojo/_base/declare",
	"dojox/mobile/ScrollableView",
	"dijit/registry",
	"dojo/on",
	"dojo/_base/lang"
], function (declare, ScrollableView, registry, on, lang) {

	return declare([ScrollableView], {
		feedView: '',
		tagInput: '',
		selectSwitch: '',
		selectedLanguage: '',
		startup: function () {
			this.inherited(arguments);
			this.feedView = registry.byId("feed");
			this.tagInput = registry.byId("tags");
			this.selectSwitch = registry.byId("select");
			// handler to record the selected feed language
			this.on("[name=feedLanguage]:click", lang.hitch(this, function (e) {
				this.selectedLanguage = e.target.value;
			}));
			// handler to update search query parameters when done button is selected
			registry.byId("doneButton").on("click", lang.hitch(this, function () {
				// we are done with the settings: transition to FeedView
				this.performTransition("feed");
				// check if anything changed in the setting view
				if (this.getTags() !== flickerview.QUERY.tags ||
					this.getTagMode() !== flickerview.QUERY.tagmode ||
					this.selectedLanguage !== flickerview.QUERY.lang) {
					// update QUERY
					flickerview.QUERY.tags = this.getTags();
					flickerview.QUERY.tagmode = this.getTagMode();
					flickerview.QUERY.lang = this.selectedLanguage;
					// force FeedView list refresh
					this.feedView.refresh()
				}
			}));
			//
			this.on("beforeTransitionIn", lang.hitch(this, function () {
				this.setTags(flickerview.QUERY.tags);
				this.setTagMode(flickerview.QUERY.tagmode);
				this.selectedLanguage = flickerview.QUERY.lang;
				registry.byId(this.selectedLanguage).set('checked', true);
			}));
		},
		setTags: function (tags) {
			this.tagInput.set('value', tags);
		},
		getTags: function () {
			return this.tagInput.get('value');
		},
		setTagMode: function (tagmode) {
			this.selectSwitch.set('value', (tagmode === "all") ? "on" : "off");
		},
		getTagMode: function () {
			return (this.selectSwitch.get('value') === "on") ? "all" : "any";
		}
	});
});
