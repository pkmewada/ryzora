(() => {
	const header = document.querySelector('.site-header');
	const toggle = header?.querySelector('.site-header__toggle');
	const nav = header?.querySelector('.site-header__nav');
	const logo = header?.querySelector('.site-header__logo img');

	if (!header || !toggle || !nav) return;

	const closeMenu = () => {
		header.classList.remove('is-menu-open');
		toggle.setAttribute('aria-expanded', 'false');
	};

	const updateScrollState = () => {
		const isScrolled = window.scrollY > 24;
		header.classList.toggle('is-scrolled', isScrolled);
		if (logo) {
			logo.src = isScrolled ? logo.dataset.darkLogo : logo.dataset.lightLogo;
		}
	};

	toggle.addEventListener('click', () => {
		const isOpen = header.classList.toggle('is-menu-open');
		toggle.setAttribute('aria-expanded', String(isOpen));
	});

	nav.addEventListener('click', event => {
		if (event.target.closest('a')) closeMenu();
	});

	document.addEventListener('keydown', event => {
		if (event.key === 'Escape') closeMenu();
	});

	window.addEventListener('scroll', updateScrollState, { passive: true });
	window.addEventListener('resize', () => {
		if (window.innerWidth > 900) closeMenu();
	});

	updateScrollState();
})();
