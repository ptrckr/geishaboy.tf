const main = document.querySelector("main");
const footer = document.querySelector("footer");
const series = document.querySelector(".series");
const effect = document.querySelector(".effect");

let window_width = window.innerWidth;
let window_height = window.innerHeight;

const resize = geisha_count => {
	let main_width = main.clientWidth;
	let main_height = main.clientHeight;

	const max_rows = 8;
	let closest_match = {
		ratio: Number.MAX_SAFE_INTEGER,
		row: 0,
		col: 0
	}

	for (let row = 1; row <= max_rows; ++row) {
		const width = main_width / (geisha_count / row);
		const height = main_height / row;
		const ratio = Math.max(width, height) / Math.min(width, height);

		if (ratio < closest_match.ratio) {
			closest_match.ratio = ratio;
			closest_match.row = row;
			closest_match.col = Math.ceil(geisha_count / row);
		}
	}

	main.style.gridTemplateRows = `repeat(${closest_match.row}, auto)`;
	main.style.gridTemplateColumns = `repeat(${closest_match.col}, auto)`;
}

const rotate = (el, x, y) => {
	el.style.transform = `perspective(1500px) rotateX(${x}deg) rotateY(${y}deg)`;
}

main.addEventListener("mousemove", e => {
	const max_degree_x = 6;
	const max_degree_y = 3;

	let y = 0;
	if (e.clientX < window_width / 2) { // left
		y = max_degree_y / (window_width / 2) * (window_width / 2 - e.clientX);
	} else { // right
		y = max_degree_y / (window_width / 2) * (e.clientX - window_width / 2);
		y *= -1;
	}

	let x = 0;
	if (e.clientY < window_height / 2) { // top
		x = window_height / 2 - e.clientY;
		x = max_degree_x / (window_height / 2) * x;
		x *= -1;
	} else { // bottom
		x = window_height / 2 - (window_height - e.clientY);
		x = max_degree_x / (window_height / 2) * x;
	}


    rotate(main, x, y);
}, false);

main.addEventListener("mouseenter", e => {
	main.classList.add("smooth");
	setTimeout(() => {
		main.classList.remove("smooth");
	}, 250);
}, false);

main.addEventListener("mouseenter", e => {
	if (e.target.tagName === "LI") {
		effect.innerText = e.target.dataset.effect;
		series.innerText = e.target.dataset.series;

		if (e.target.classList.contains("missing")) {
			footer.classList.add("missing");

			if (e.target.dataset.buyingPrice)
				footer.querySelector(".effect").dataset.buyingPrice = e.target.dataset.buyingPrice;
		} else {
			footer.classList.remove("missing");
		}
	}
}, true)

const set_footer_default_text = () => {
	footer.classList.remove("missing");
	series.innerText = "Frog leaps into pond. Lotus blossoms fall to earth.";
	effect.innerText = "Medic has girl's hair.";
}

main.addEventListener("mouseleave", () => {
	set_footer_default_text();

	main.classList.add("smooth");
	rotate(main, 0, 0);
	setTimeout(() => {
		main.classList.remove("smooth");
	}, 250);
}, false);