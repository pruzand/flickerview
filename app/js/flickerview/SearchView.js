define([
	"dojo/_base/declare",
	"dijit/registry",
	"dojo/on",
	"dojo/_base/lang",
	"dojo/date/locale",
	"dojo/dom-class",
	"dojox/mobile/ScrollableView",
	"dojox/mobile/ProgressIndicator",
	"dojo/request/script",
	"dojox/mobile/ListItem"
], function(declare, registry, on, lang, locale, domClass, ScrollableView, ProgressIndicator, scriptRequest){

	return declare("flickerview.SearchView", [ScrollableView], {
		refreshButton: null,
		searchList: null,
		searchHeading: null,
		progressIndicator: null,
		detailContainer:null,
		detailHeading:null,
		flickerviewItemTemplateString:
			'<img src="${photo}" width="80px" height="80px" alt="${title}" style="float:left;"/>' +
			'<div class="photoSummary">' +
				'<div class="photoTitle">${title}</div>' +
				'<div class="publishedTime">${published}</div>' +
				'<div class="author troncatedText">${author}</div>' +
			'</div><div class="summaryClear"></div>',

		// init variables and handlers
		startup: function() {
			this.inherited(arguments);
			this.progressIndicator = ProgressIndicator.getInstance();
			this.refreshButton = registry.byId("refreshButton");
			this.searchList = registry.byId("searchList");
			this.searchHeading = registry.byId("searchHeading");
			this.detailContainer = registry.byId("detailContainer");
			this.detailHeading = registry.byId("detailHeading");
			// add click handler to the button that call refresh
			on(this.refreshButton, "click", lang.hitch(this, this.refresh) );
		},

		// refresh view with content from Flicker
		refresh: function() {
			this.scrollTo({x:0,y:0});
			// remove all list items
			this.searchList.destroyDescendants();
			// start progress indicator
			this.searchHeading.set('label',"loading...");
			this.searchList.domNode.appendChild(this.progressIndicator.domNode);
			this.progressIndicator.start();
			// request feed from Flicker
			var url = "http://api.flickr.com/services/feeds/photos_public.gne";
			var args = {
				jsonp: "jsoncallback",
				preventCache: true,
				timeout: 3000,
				query: flickerview.QUERY
			};
			scriptRequest.get(url, args).then(lang.hitch(this, this.onFlickerResponse), lang.hitch(this, this.onFlickerError));
		},

		// error handler
		onFlickerError: function(error) {
			this.progressIndicator.stop();
			this.searchList.destroyDescendants();
			this.searchHeading.set('label',error);
			alert(error);
		},

		//  response handler
		onFlickerResponse: function(result) {
			this.progressIndicator.stop();
			this.searchList.destroyDescendants();
			this.searchHeading.set('label',result.title);

			dojo.forEach(result.items, lang.hitch(this, function (resultItem) {
				// Create a new list item
				var listItem = new dojox.mobile.ListItem({}).placeAt(this.searchList, "last");
				listItem.set("transition","slide");
				listItem.set("moveTo","#");
				listItem.onClick = lang.hitch(this, function(){
					this.detailHeading.set("label", resultItem.title);
					this.detailContainer.domNode.innerHTML = resultItem.description;
					listItem.transitionTo("details");
				});
				domClass.add(listItem.domNode, "photoListItem");
				listItem.containerNode.innerHTML = this.substitute(this.flickerviewItemTemplateString, {
					photo: resultItem.media.m,
					title: resultItem.title,
					published: locale.format(new Date(resultItem.published), {locale:flickerview.QUERY.lang}),
					author: resultItem.author
				});
			}));
		},

		// Pushes data into a template - primitive
		substitute: function(template,obj) {
			return template.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g, function(match,key){
				return obj[key];
			});
		}
	});
});
