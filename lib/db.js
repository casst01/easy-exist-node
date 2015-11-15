module.exports = function DB(host, opts) {

	if(opts.collection && opts.collection[0] != "/") {
		throw new Error('ArgumentError: \"collection\" must contain preceding \'/\'');
	}

};