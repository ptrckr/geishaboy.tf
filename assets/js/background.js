---
---

"use strict";

// ——— Functions ———
const CreateStampPath = (ctx, x, y, w, h, teeth_count) => {
	const steps = teeth_count * 2;
	const step = w / steps;
  const radius = step / 2;

	ctx.beginPath();
  ctx.moveTo(x + step, y);

  // Iterate Sides
  for (let i = 0; i < 4; ++i) {
    ctx.save();
    ctx.translate(x + w / 2, y + h / 2);
    ctx.rotate((90 * i) * Math.PI / 180);
    ctx.translate((x + w / 2) * -1, (y + h / 2) * -1)

    // Draw Border
    for (let j = 0; j <= steps / 2; ++j) {
      if (j === steps / 2) {
        ctx.arc(x + w, y, radius, 180 * Math.PI / 180, 90 * Math.PI / 180, 1);
      } else if (j !== 0) {
        ctx.arc(x + (w / steps * 2) * j, y, radius, 180 * Math.PI / 180, Math.PI * 2, 1);
      }
    }

    ctx.restore();
  }

  ctx.closePath();
}

// ——— Sizes ———
const stamp_size = {{ site.grid_size }};
const stamp_padding = 18;
const padded_stamp_size = stamp_size - stamp_padding;
const clip_radius = 4;

// ——— Geisha Collection ———
const collections = JSON.parse(`{{ site.data.collection.series | jsonify }}`);

// ——— Preload Images ———
const Preload = (images, callback) => {
	let loaded = 0;

	Object.keys(images).forEach(img => {
		const image = new Image();
		images[img].img = image;

		image.onload = () => {
			if (++loaded == Object.keys(images).length) {
				callback(images);
			}
		}

		image.src = images[img].src;
	})
}

// ——— Paint ———
const Paint = images => {
  let index = 0;

  for (let collection = 0; collection < collections.length; ++collection) {
		let current_color = collections[collection].color;
    let current_collection = collections[collection].effects.map(x => {
      x.index = index++;
      return x;
    });

    for (let i = 0; i < current_collection.length; ++i) {
      const effect = current_collection[i];

      if (!effect.collected) {
        continue;
      }

      const canvas = document.querySelector(`.stamp_${effect.index}`);
      const ctx = canvas.getContext("2d");

      canvas.setAttribute("style", `transform: rotate(${Math.random() * (4 * (Math.random() > .5 ? 1 : -1))}deg) scale(1);`);
      canvas.width = stamp_size;
      canvas.height = stamp_size;

      // Stamp
      CreateStampPath(ctx, 0, 0, stamp_size, stamp_size, 10);
      ctx.fillStyle = "white";
      ctx.fill();

			// Clip and save stamp path
			ctx.clip();
			ctx.save();

			// Clip image area
			ctx.beginPath();
			ctx.moveTo(stamp_padding, stamp_padding + clip_radius);
			ctx.arcTo(stamp_padding, stamp_padding, stamp_padding + clip_radius, stamp_padding, clip_radius);
			ctx.lineTo(padded_stamp_size - clip_radius, stamp_padding);
			ctx.arcTo(padded_stamp_size, stamp_padding, padded_stamp_size, stamp_padding + clip_radius, clip_radius);
			ctx.lineTo(padded_stamp_size, padded_stamp_size - clip_radius);
			ctx.arcTo(padded_stamp_size, padded_stamp_size, padded_stamp_size - clip_radius, padded_stamp_size, clip_radius);
			ctx.lineTo(stamp_padding + clip_radius, padded_stamp_size);
			ctx.arcTo(stamp_padding, padded_stamp_size, stamp_padding, padded_stamp_size - clip_radius, clip_radius);
			ctx.closePath();
			ctx.clip();

      // Effect Image
      ctx.drawImage(
        images.sprite.img,
        stamp_size * effect.index, 0, stamp_size, stamp_size,
        stamp_padding, stamp_padding, stamp_size - stamp_padding * 2, stamp_size - stamp_padding * 2
      );

			// Restore stamp clip path
			ctx.restore();

			// Draw blood splatter if item is duped
			if (effect.duped) {
				ctx.globalCompositeOperation = "multiply";
				ctx.drawImage(
					images.blood.img,
					0, 0, stamp_size, stamp_size
				);
			}

			// Collection indication
			// ctx.fillStyle = current_color;
			// ctx.translate(stamp_size, 0);
			// ctx.rotate(45 * Math.PI / 180);
			// ctx.fillRect(stamp_padding / -2, stamp_padding / -2, stamp_padding, stamp_padding);

      setTimeout(() => {
        canvas.classList.remove("hidden_canvas");
      }, 75 * effect.index);
    }
  }
}

// ——— Init ———
Preload({
	sprite: {
		src: "assets/img/sprite.jpg"
	},
	blood: {
		src: "assets/img/blood_splatter/splatter.png"
	}
}, Paint);
