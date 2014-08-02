define('form', ['backbone'], function(Backbone) {

	var FormView = Backbone.View.extend({
		
	});
	
	var Form = function() {
	
		this._fields = [];
	
		this._build = function() {
			if(typeof this.builder != 'function') {
				throw 'Cannot build form without a valid builder';
			}	
			
			this.builder();
		};
		
	};
	
	Form.prototype.setBuilder = function(builder) {
		this.builder = builder;
		
		this._build();
	};
	
	Form.prototype.addField = function(name, type) {
		this.fields[name] = new FormView({
			name: name,
			type: type
		});
	};
	
	Form.prototype.build = function() {
		return new Backbone.View.extend({
			
			initialize: function(options) {
				this.fields = options.fields || null;
			},
			
			render: function() {
				
			}
			
		})({ this._fields });
	};
		
	return Form;
	
});