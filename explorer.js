'use strict';

/* Depends on
 *  jQuery
 *  EventEmitter
 *  browser (document)
 */

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
		return new Tree(name, root);
	}

	this.name = name;
	this._root = root;

	this.current = null;

	this.on('loading', this.loading);
	this.on('loaded', this.loaded);

	// initialize this.$el
	this.$el = $(document.createElement('div'));

};

inherits(Tree, EventEmitter);

Tree.prototype.$ = function (selector) {
	return this.$el.find(selector);
};

Tree.prototype.get = function (path, callback) {

	var self = this;

	self.emit('loading', path);

	$.get(self._root + path, function (data) {

		self.emit('loaded', path, data);

		callback(data);

	});

};

Tree.prototype.toggle = function (path) {

	this.$('[data-path=' + path + '] > .tree-children').toggle();

};

Tree.prototype.show = function (path) {

	this.$('[data-path=' + path + '] > .tree-children').show();

};

Tree.prototype.hide = function (path) {

	this.$('[data-path=' + path + '] > .tree-children').hide();

};

Tree.prototype.load = function (path) {

	var self = this;

	self.root.get(path, function (data) {

		var $children = self.$('[data-path=' + path + '] > .tree-children');

		data.sort(function (a, b) {
			return a.dir && !b.dir ? -1 : !a.dir && b.dir ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
		});

		$children.empty();

		$.each(data, function (i, item) {

			var $item = $(document.createElement('div'));

			$item.html(item.name).addClass('tree-item');

			if (item.dir) {

				var $container = $(document.createElement('div'))
					, $childContainer = $(document.createElement('div'))
				;

				$container.attr('data-path', item.path);
				$childContainer.addClass('tree-children');
				$item.addClass('tree-dir');

				$container.append($item, $childContainer);

				$children.append($container);

			} else {

				$item.attr('data-path', item.path);
				$children.append($item);

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

	this.$('[data-path=' + path + '] > .tree-item').addClass('tree-loading');

};

Tree.prototype.loaded = function (path) {

	this.$('[data-path=' + path + '] > .tree-item').removeClass('tree-loading');

};
