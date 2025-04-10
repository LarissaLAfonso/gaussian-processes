import { browser } from '$app/environment'; // SvelteKit builtin alias
import { readable } from "svelte/store";

export default readable(0, (set) => { // Readable Svelte store that starts at 0 and receives a function that sets up scroll tracking
	let ticking = false; // scroll handler runs at most once per frame
	let lastScrollY = 0; // stores lastest scroll position

	const updateScrollY = () => { 
		set(lastScrollY);
		ticking = false;
	};

	const onScroll = () => { // On every scroll event capture the scroll position and set it to lastScrollY
		lastScrollY = window.scrollY;
		if (!ticking) {
			requestAnimationFrame(updateScrollY);
			ticking = true;
		}
	};

	if (browser) document.addEventListener('scroll', onScroll); // If the browser is available, add the scroll event listener
    
    // Cleanup function to remove the event listener when the store is destroyed
	return () => {
		if (browser) document.removeEventListener("scroll", onScroll);
	};
});