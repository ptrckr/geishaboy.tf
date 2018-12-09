---
---

// @@@ Functions
// https://stackoverflow.com/a/6274381
const ShuffleArray = a => {
  let j, x, i;

  for (i = a.length - 1; i > 0; --i) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }

  return a;
}

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

// @@@ Sizes
const stamp_size = 230;
const content_width = document.querySelector("main p").clientWidth;
const client_width = document.documentElement.clientWidth;
const client_height = document.documentElement.clientHeight;

// @@@ Canvas
const c = document.querySelector("canvas");
const ctx = c.getContext("2d");
c.width = client_width;
c.height = client_height;

// @@@ Geisha Collection
const collections = JSON.parse(`{{ site.series | jsonify }}`);

// @@@ Paint
const angles_count = 16;
const angle_offset = 360 / 16 * 1 * -2;
let angles_to_paint = [];

for (let i = 0; i < collections.length; ++i) {
  const step = 360 / angles_count;
  let angle = angle_offset;

  if (i < collections.length / 2) {
    angle += step * i;
  } else {
    angle += step * i + ((360 - collections.length * step) / 2);
  }

  angles_to_paint.push(angle);
}

const sprite = new Image();
sprite.onload = () => {
  Paint(sprite);
}
sprite.src = `assets/img/sprite.png`;

const Paint = sprite => {
  let index = 0;
  for (let collection = 0; collection < Math.min(collections.length, angles_count); ++collection) {
    let current_collection = collections[collection].effects.filter(x => x.collected).map(x => {
      x.index = index++;
      return x;
    });
    ShuffleArray(current_collection);
    let angle = angles_to_paint.shift();

    for (let i = 0; i < current_collection.length; i++) {
      const effect = current_collection[i];

      ctx.save();

      let rotation = 90 + angle;
      let radius = content_width - 200;

      if (i > 0) {
        angle += Math.floor(Math.random() * 3) * (Math.random() > 0.5 ? 1 : -1);
        rotation += Math.floor(Math.random() * 30) * (Math.random() > 0.5 ? 1 : -1);
        radius += Math.floor(Math.random() * 300);
      }

      const x = (client_width / 2) + radius * Math.cos(angle * Math.PI / 180);
      const y = (client_height / 2) + radius * Math.sin(angle * Math.PI / 180);

      ctx.translate(x, y);
      ctx.rotate(rotation * Math.PI / 180);
      ctx.translate(-x, -y);

      ctx.shadowColor = "black";
      ctx.shadowBlur = 30;
      ctx.fillStyle = "white";
      CreateStampPath(ctx, x - stamp_size / 2, y - stamp_size / 2, stamp_size, stamp_size, 12);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.fillStyle = "#8650AC";
      ctx.fillRect(x - stamp_size / 2 + 20, y - stamp_size / 2 + 20, stamp_size - 40, stamp_size - 40);

      ctx.drawImage(
        sprite,
        // Source
        stamp_size * effect.index, 0, stamp_size, stamp_size,
        // Destination
        x - stamp_size / 2 + 20,
        y - stamp_size / 2 + 20,
        stamp_size - 40,
        stamp_size - 40
      );

      ctx.restore();
    }
  }

  c.classList.remove("canvas_loading");
}
