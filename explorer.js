'use strict';

var $ = jQuery;
var EventEmitter = '';
var _ = 'underscore'; // ( _.each )
//document

function inherits (child, parent) {
	for (var key in parent.prototype) {
		if (parent.prototype.hasOwnProperty(key) {
			child.prototype[key] = parent.prototype[key];
		}
	}
}

var Root = function (path, options) {

	if (!(this instanceof Root)) {
		return new Root(path, options);
	}

	this._path = path;
	this._options = options;

};

inherits(Root, EventEmitter);

Root.prototype.get = function (path, callback) {
	
	var self = this;

	self.emit('loading', path);

	$.get(self._path + path, function (data) {

		self.emit('loaded', path, data);

		callback(data);

	});

};

var Tree = function (name, root) {

	if (!(this instanceof Tree)) {
		return new Tree(root);
	}

	this.name = name;
	this.root = new Root(root);

	this.current = null;

	this.root.on('loading', this.loading, this);
	this.root.on('loaded', this.loaded, this);

	// initialize this.$el
	this.$el = $();

};

inherits(Tree, EventEmitter);

Tree.prototype.$ = function (selector) {
	return this.$el.find(selector);
};

Tree.prototype.toggle = function (path) {

	this.$('.tree-children [data-path=' + path + ']').toggle();

};

Tree.prototype.show = function (path) {

	this.$('.tree-children [data-path=' + path + ']').show();

};

Tree.prototype.hide = function (path) {

	this.$('.tree-children [data-path=' + path + ']').hide();

};

Tree.prototype.load = function (path) {

	var self = this;

	self.root.get(path, function (data) {

		var $children = self.$('tree-children [data-path=' + path + ']');

		data.sort(function (a, b) {
			return a.dir && !b.dir ? -1 : !a.dir && b.dir ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
		});

		$children.empty();

		_.each(data, function (item) {

			var $item = $(document.createElement('div'));

			$item.html(item.name).addClass('tree-item').attr('data-path', item.path);

			$children.append($item);

			if (item.dir) {

				var $child = $(document.createElement('div'));

				$item.addClass('tree-dir');

				$child.addClass('tree-children').attr('data-path', item.path);

				$children.append($child);

			}

		});

		self.current = path;

	});

};

Tree.prototype.refresh = function () {

	if (this.current) {
		this.load(this.current);
	}

};

Tree.prototype.loading = function (path) {

	this.$('tree-item [data-path=' + path + ']').addClass('tree-loading');

};

Tree.prototype.loaded = function (path) {

	this.$('tree-item [data-path=' + path + ']').removeClass('tree-loading');

};
