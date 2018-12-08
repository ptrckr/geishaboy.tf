---
---

// @@@ Sizes
const stamp_size = 230;
const main_p_width = document.querySelector("main p").clientWidth;
const width = document.documentElement.clientWidth;
const height = document.documentElement.clientHeight;

// @@@ Canvas
const c = document.querySelector("canvas");
const ctx = c.getContext("2d");
c.width = width;
c.height = height;

// @@@ Geisha Collection
const collection = JSON.parse(`{{ site.series | jsonify }}`);

// @@@ Paint
const angles_count = 16;
let angles_to_paint = [];
for (let angle = 0; angle < 360; angle += 360 / angles_count) {
  angles_to_paint.push(angle);
}

const stamp = new Image();

stamp.onload = () => {
  for (let collection = 0; collection < Math.min(collections.length, angles_count); ++collection) {
    const current_collection = collections[collection].effects.map(x => x.id);
    console.log(current_collection);
    let angle = angles_to_paint.shift();

    for (let i = 0; i < current_collection.length; i++) {
      const current_effect = current_collection[i];

      const geisha = new Image();

      geisha.onload = () => {
        ctx.save();

        let rotation = 90 + angle;
        let radius = main_p_width - 200;

        if (i > 0) {
          angle += Math.floor(Math.random() * 3) * (Math.random() > 0.5 ? 1 : -1);
          rotation += Math.floor(Math.random() * 30) * (Math.random() > 0.5 ? 1 : -1);
          radius += Math.floor(Math.random() * 300);
        }

        let x = (width / 2) + radius * Math.cos(angle * Math.PI / 180);
        let y = (height / 2) + radius * Math.sin(angle * Math.PI / 180);

        ctx.translate(x, y);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.translate(-x, -y);

        ctx.drawImage(geisha, x - stamp_size / 2 + 10, y - stamp_size / 2 + 10, stamp_size - 20, stamp_size - 20);

        ctx.shadowColor = "black";
        ctx.shadowBlur = 40;
        ctx.drawImage(stamp, x - stamp_size / 2, y - stamp_size / 2, stamp_size, stamp_size);

        ctx.restore();
      }

      geisha.src = `../img/stamps/${current_effect}.jpg`;
    }
  }
}

stamp.src = "../img/section/stamp.png";
