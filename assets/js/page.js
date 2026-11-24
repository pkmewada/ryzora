(() => {
	document.documentElement.classList.add('js');
	const state = { domReady: document.readyState !== 'loading', cssReady: false, appReady: false, failure: '' };
	const showFailure = message => {
		const notice = document.getElementById('page-load-notice');
		if (notice) {
			notice.hidden = false;
			notice.querySelector('[data-load-error]').textContent = message;
		}
		const status = document.getElementById('page-load-message');
		if (status) status.textContent = message;
		document.querySelectorAll('[data-load-retry]').forEach(button => { button.hidden = false; });
	};
	const finishIfReady = () => {
		if (state.domReady && state.cssReady && state.appReady) {
			document.getElementById('preloader-wrapper')?.classList.add('is-hidden');
			if (state.failure) showFailure(state.failure);
		}
	};
	const updateDays = () => {
		const target = new Date(2026, 11, 25);
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const days = Math.max(0, Math.ceil((target - today) / 86400000));
		const counter = document.getElementById('event-days');
		if (counter) {
			counter.textContent = days;
			counter.parentElement.lastChild.textContent = days === 1 ? ' Day' : ' Days';
		}
	};

	document.addEventListener('DOMContentLoaded', () => {
		state.domReady = true;
		document.querySelectorAll('[data-load-retry]').forEach(button => button.addEventListener('click', () => window.location.reload()));
		const fonts = document.getElementById('google-fonts');
		if (fonts) fonts.media = 'all';
		const stylesheet = document.getElementById('main-stylesheet');
		if (stylesheet) {
			stylesheet.addEventListener('load', () => {
				state.cssReady = true;
				finishIfReady();
			}, { once: true });
			stylesheet.addEventListener('error', () => {
				state.failure = 'Some page files could not be loaded. Check your connection and refresh the page.';
				state.cssReady = true;
				finishIfReady();
			}, { once: true });
			stylesheet.rel = 'stylesheet';
		} else {
			state.cssReady = true;
		}
		state.appReady = true;
		updateDays();
		window.setInterval(updateDays, 3600000);
		if (state.failure) showFailure(state.failure);
		finishIfReady();
	}, { once: true });

	window.addEventListener('error', event => {
		const target = event.target;
		if (target instanceof HTMLImageElement) {
			state.failure = 'Some photos could not be loaded. Check your connection and refresh the page.';
			if (state.domReady && state.cssReady && state.appReady) showFailure(state.failure);
		} else if (target instanceof HTMLLinkElement || target instanceof HTMLScriptElement) {
			state.failure = 'Some page files could not be loaded. Check your connection and refresh the page.';
			if (target.id === 'main-stylesheet') state.cssReady = true;
			if (target.id === 'app-script') state.appReady = true;
			if (state.domReady) {
				showFailure(state.failure);
				finishIfReady();
			}
		}
	}, true);

	window.setTimeout(() => {
		if (!state.domReady || !state.cssReady || !state.appReady) {
			state.failure = 'This is taking longer than expected. Check your connection and try again.';
			showFailure(state.failure);
			if (state.domReady) {
				state.cssReady = true;
				state.appReady = true;
				finishIfReady();
			}
		}
	}, 15000);
})();
