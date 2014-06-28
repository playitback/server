define('view/media/header/search', ['backbone', 'collection/search', 'backbone.autocomplete'], function(Backbone, SearchCollection, AutoCompleteView) {
	
	return Backbone.View.extend({
		
		tagName: 'form',
		className: 'search',
		
		initialize: function(options) {
			this.mediaView = options && options.mediaView || null;
						
			this.collection = new SearchCollection();
		},
		
		render: function() {
			var self = this;
		
			this.$el.append(
				$('<input />', { type: 'text', placeholder: 'Add TV Show\'s & Movies...' })
			)
			.append(
				$('<a></a>', { 'class': 'clear' })
			);
					
			$('#media .row .header').append(this.$el);
			
			this.autoComplete = new AutoCompleteView({
				groupKey: 'type',
				input: this.$el.find('input'),
				model: this.collection,
				onSelect: function(selected) {
					self.$el.find('input').val('');
					
					self.mediaView.addMedia(selected.mediaObject());
				},
				onShow: function() {
					$('section#content #media .header').addClass('search-visible');
				},
				onHide: function() {
					$('section#content #media .header').removeClass('search-visible');
				}
			});
			
			this.autoComplete.render();
			
			this.createEvents();
		},
		
		createEvents: function() {
			var self = this;
		
			this.$el.find('a.clear').click(function() {
				self.autoComplete.hide();
				
				self.$el.find('input[type=text]').val('').trigger('keyup');
			});
			
			this.$el.find('input[type=text]').keyup(function() {
				self.$el.find('a.clear').toggle($(this).val().length > 0);
			});
		}
		
	});
	
});