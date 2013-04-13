'use strict';

var $ = jQuery;
var EventEmitter = '';

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

Tree.prototype.$path = function (path) {
	return this.$el.find('[data-path=' + path + ']');
};

Tree.prototype.toggle = function (path) {

	this.$path(path).toggle();

};

Tree.prototype.show = function (path) {

	this.$path(path).show();

};

Tree.prototype.hide = function (path) {

	this.$path(path).hide();

};

Tree.prototype.load = function (path) {

	var self = this;

	self.root.get(path, function (data) {

		// add into list

	});

};

Tree.prototype.refresh = function () {

	if (this.current) {
		this.load(this.current);
	}

};

Tree.prototype.loading = function (path) {

	this.$path(path).addClass('tree-loading');

};

Tree.prototype.loaded = function (path) {

	this.$path(path).removeClass('tree-loading');

};
