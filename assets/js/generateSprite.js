---
---

const collections = JSON.parse(`{{ site.series | jsonify }}`);

// @@@ Paths
const path = {
  screenshots: `assets/img/stamps/__ID__.jpg`,
  bptf_fallback: `assets/img/particles/__ID__.png`
};

const sprite_size = {{ site.grid_size }};
const c = document.createElement("canvas");
document.body.appendChild(c);
const ctx = c.getContext("2d");

let sprite_count = 0;
collections.forEach(collection => {
  collection.effects.forEach(effect => {
    ++sprite_count;
  })
});

c.width = sprite_size * sprite_count;
c.height = sprite_size;

let i = 0;
collections.forEach(collection => {
  collection.effects.forEach(effect => {
    const x = i++ * sprite_size;
    const img = new Image();

    img.onload = () => {
      ctx.drawImage(img, x, 0, sprite_size, sprite_size);
    };

    img.onerror = () => {
      if (effect.error) return;

      const src = path.bptf_fallback.replace("__ID__", effect.id);
      img.src = src;

      effect.error = true;
    }

    img.src = path[effect.collected ? "screenshots" : "bptf_fallback"].replace("__ID__", effect.id);
  })
});
