define('backbone.autocomplete', [], function() {
	var AutoCompleteItemView = Backbone.View.extend({
	    tagName: "li",
	    template: _.template('<a><%= label %></a>'),
	
	    events: {
	        "click": "select"
	    },
	    
	    initialize: function(options) {
	        this.options = options;
	    },
	
	    render: function () {
	        this.$el.html(this.template({
	            "label": this.model.label()
	        }));
	        
	        if(typeof this.options.group === 'boolean' && this.options.group) {
		        this.$el.addClass('title');
	        }
	        
	        return this;
	    },
	
	    select: function () {
	    	if(typeof this.options.group === 'boolean' && this.options.group) {
	    		return false;
	    	}
	    	
	        this.options.parent.hide().select(this.model);
	        
	        return false;
	    }
	
	});
	
	var AutoCompleteView = Backbone.View.extend({
	    tagName: "ul",
	    className: "autocomplete",
	    wait: 300,
	
	    queryParameter: "query",
	    minKeywordLength: 2,
	    currentText: "",
	    itemView: AutoCompleteItemView,
	    groupKey: null,
	
	    initialize: function (options) {
	        _.extend(this, options);
	        this.filter = _.debounce(this.filter, this.wait);
	        
	        if(this.groupKey) {
		        this.model.comparator = this.groupKey;
	        }
	    },
	
	    render: function () {
	        // disable the native auto complete functionality
	        this.input.attr("autocomplete", "off");
	
	        this.$el.width(this.input.outerWidth());
	
	        this.input
	            .keyup(_.bind(this.keyup, this))
	            .keydown(_.bind(this.keydown, this))
	            .after(this.$el);
	
	        return this;
	    },
	
	    keydown: function (event) {
	        if (event.keyCode == 38) return this.move(-1);
	        if (event.keyCode == 40) return this.move(+1);
	        if (event.keyCode == 13) return this.onEnter();
	        if (event.keyCode == 27) return this.hide();
	    },
	
	    keyup: function () {
	        var keyword = this.input.val();
	        if (this.isChanged(keyword)) {
	            if (this.isValid(keyword)) {
	                this.filter(keyword);
	            } else {
	                this.hide()
	            }
	        }
	    },
	
	    filter: function (keyword) {
	    	var keyword = keyword.toLowerCase();
	        if (this.model.url) {
	
	            var parameters = {};
	            parameters[this.queryParameter] = keyword;
	
	            this.model.fetch({
	                success: function () {
	                    this.loadResult(this.model.models, keyword);
	                }.bind(this),
	                data: parameters
	            });
	
	        } else {
	            this.loadResult(this.model.filter(function (model) {
	                return model.label().toLowerCase().indexOf(keyword) !== -1
	            }), keyword);
	        }
	    },
	
	    isValid: function (keyword) {
	        return keyword.length > this.minKeywordLength
	    },
	
	    isChanged: function (keyword) {
	        return this.currentText != keyword;
	    },
	
	    move: function (position) {
	        var current = this.$el.children(".active"),
	            siblings = this.$el.children(),
	            index = current.index() + position;
	        if (siblings.eq(index).length) {
	            current.removeClass("active");
	            siblings.eq(index).addClass("active");
	        }
	        return false;
	    },
	
	    onEnter: function () {
	        this.$el.children(".active").click();
	        return false;
	    },
	
	    loadResult: function (model, keyword) {
	        this.currentText = keyword;
	        this.show().reset();
	        if (model.length) {
	            _.forEach(model, this.addItem, this);
	            this.show();
	        } else {
	            this.hide();
	        }
	    },
	    
	    currentGroup: null,
	
	    addItem: function (model) {
	    	var self = this;
	    		    
	    	if(this.groupKey && model.has(this.groupKey) && 
	    	   (!this.currentGroup || this.currentGroup != model.get(this.groupKey))) {
	    	   	this.currentGroup = model.get(this.groupKey);
	    	   	
	    	   	var GroupModel = Backbone.Model.extend({
	            	label: function() {
	            		return self.currentGroup;
	            	}
	            });
	    	   
		    	this.$el.append(new this.itemView({
		            model: new GroupModel(),
		            parent: this,
		            group: true
		        }).render().$el);
	    	}
	    
	        this.$el.append(new this.itemView({
	            model: model,
	            parent: this
	        }).render().$el);
	    },
	
	    select: function (model) {
	        var label = model.label();
	        this.input.val(label);
	        this.currentText = label;
	        this.onSelect(model);
	    },
	
	    reset: function () {
	        this.$el.empty();
	        return this;
	    },
	
	    hide: function () {
	        this.$el.hide();
	        this.onHide();
	        return this;
	    },
	
	    show: function () {
	        this.$el.show();
	        this.onShow();
	        return this;
	    },
	
	    // callback definitions
	    onSelect: function () {},
	    onShow: function () {},
	    onHide: function () {}
	
	});
	
	return AutoCompleteView;
});