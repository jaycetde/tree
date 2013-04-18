'use strict';

var query = require('query')
	, event = require('event')
	, Emitter = require('emitter')
	, classes = require('classes')
	, each = require('each')
;

function empty(el) {
	while (el.firstChild) {
		el.removeChild(el.firstChild);
	}
}

var Tree = module.exports = function (id, html) {

	if (!(this instanceof Tree)) {
		return new Tree(name, id);
	}
	
	this.id = id;

	this.el = document.createElement('div');

	this.el.appendChild(this.parentNode({ id: id, html: html }));

	this.on('loading', this.loading);
	this.on('loaded', this.loaded);

};

Emitter(Tree.prototype);

Tree.prototype.emptyNodeHTML = '(empty)';

Tree.prototype.find = function (id) {
	return query('[data-id="' + id + '"]', this.el);
};

Tree.prototype.children = function (id) {
	return query('.tree-children', this.find(id));
};

Tree.prototype.title = function (id) {
	return query('.tree-title', this.find(id));
};

Tree.prototype.toggle = function (id) {

	classes(this.children(id)).toggle('tree-hidden');

};

Tree.prototype.show = function (id) {

	classes(this.children(id)).remove('tree-hidden');

};

Tree.prototype.hide = function (id) {

	classes(this.children(id)).add('tree-hidden');

};

Tree.prototype.get = function (id) {

	var self = this
		, parent = this.find(id)
		, callback = function (arr) {

			self.emit('loaded', id, arr);

			self.setChildren(id, arr);

		}
	;

	this.emit('loading', id);

	this.fetch(id, callback);

};

Tree.prototype.setChildren = function (id, data) {

	var self = this
		, parent = this.find(id)
		, children = this.children(id)
	;
	
	empty(children);

	if (data.length === 0) {
		return children.appendChild(this.emptyNode());
	}

	each(data, function (item) {
		
		var el;

		if (item.parent) {

			el = self.parentNode(item);

		} else {

			el = self.singleNode(item);

		}

		children.appendChild(el);

	});

};

Tree.prototype.parentNode = function (data) {

	var container = document.createElement('div')
		, title = document.createElement('div')
	;

	container.setAttribute('data-id', data.id);
	classes(container).add('tree-container');

	title.innerHTML = data.html;
	classes(title).add('tree-title').add('tree-parent');
	event.bind(title, 'click', this.parentClick.bind(this));

	container.appendChild(title);

	return container;

};

Tree.prototype.singleNode = function (data) {

	var title = document.createElement('div');
	
	title.innerHTML = data.html;
	title.setAttribute('data-id', data.id);
	classes(title).add('tree-title');

	return title;

};

Tree.prototype.emptyNode = function () {

	var node = document.createElement('div');

	node.innerHTML = this.emptyNodeHTML;
	classes(node).add('tree-empty-node');

	return node;

};

Tree.prototype.parentClick = function (e) {
	
	// If it's children are already loading, do nothing
	if (classes(e.target).has('tree-loading')) {
		return;
	}

	var children = query('.tree-children', e.target.parentNode);
	
	if (!children) {
		
		children = document.createElement('div');

		classes(children).add('tree-children');

		e.target.parentNode.appendChild(children);

		this.get(e.target.parentNode.getAttribute('data-id'));

	} else {

		classes(children).toggle('tree-hidden');

	}

};

Tree.prototype.loading = function (id) {
	classes(this.title(id)).add('tree-loading');
};

Tree.prototype.loaded = function (id) {
	classes(this.title(id)).remove('tree-loading');
};

Tree.prototype.fetch = function (id, callback) {
	callback([]); // default is to return an empty set
};
