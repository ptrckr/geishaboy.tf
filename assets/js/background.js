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

// ——— Geisha Collection ———
const collections = JSON.parse(`{{ site.series | jsonify }}`);

// ——— Paint ———
const sprite = new Image();

sprite.onload = () => {
  let index = 0;

  for (let collection = 0; collection < collections.length; ++collection) {
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

      /* Stamp */
      CreateStampPath(ctx, 0, 0, stamp_size, stamp_size, 10);
      ctx.fillStyle = "white";
      ctx.fill();

      /* Inner Background */
      ctx.fillStyle = "#8650AC";
      ctx.fillRect(18, 18, stamp_size - 36, stamp_size - 36);

      /* Effect Image */
      ctx.drawImage(
        sprite,
        stamp_size * effect.index, 0, stamp_size, stamp_size,
        18, 18, stamp_size - 36, stamp_size - 36
      );

      setTimeout(() => {
        canvas.classList.remove("hidden_canvas");
      }, 75 * effect.index);
    }
  }
}

sprite.src = "assets/img/sprite.png";
