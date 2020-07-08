const isPOJO = (value) => {
	/* eslint-disable-next-line eqeqeq */
	if (value == null || typeof value !== 'object') {
		return false;
	}

	const proto = Object.getPrototypeOf(value);

	/* eslint-disable-next-line eqeqeq */
	if (proto == null) {
		return true;
	}

	return proto.constructor.name === 'Object';
};

const delay = (delay) =>
	new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, delay);
	});

const peekMessage = (error) => {
	const body = error.response && error.response.body;
	let errors;
	try {
		const parsedBody = JSON.parse(body);
		errors = parsedBody.errors || [];
	} catch(err) {
		return 'Unknown error!';
	}

	const len = errors && errors.length || 0;
	if (len > 0 && errors[0].message) {
		return errors[0].message;
	}

	return 'Unknown error!';
};

const normalizeUrl = (fragment) => {
	const url = fragment.replace(/\/+/g, '/');
	if (url.length > 1) {
		return url.replace(/\/$/, '');
	}

	return url;
};

module.exports = {
	isPOJO,
	delay,
	normalizeUrl,
	peekMessage
};
