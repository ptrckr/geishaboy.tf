const source_dir = "src/";
const dest_dir = "docs/";
const config = {
  // grunt-contrib-copy
  copy: {
    main: {
      files: [{
        expand: true,
        cwd: source_dir,
        src: ["CNAME", "img/**", "fonts/**", "js/**", "favicon.png"],
        dest: dest_dir
      }]
    }
  },

  // grunt-contrib-cssmin
  cssmin: {
    options: {
      mergeIntoShorthands: true,
    },
    target: {
      files: [{
        expand: true,
        cwd: source_dir,
        src: ["*.css"],
        dest: dest_dir
      }]
    }
  },

  // grunt-contrib-pug
  pug: {
    compile: {
      options: {
        data: (src, dest) => {
          const collection = require("./collection");

          return {
            url: {
              backpack: "https://backpack.tf/profiles/76561198060233163",
              scm: "https://steamcommunity.com/market/listings/440/Unusual%20Geisha%20Boy",
              steam: "https://steamcommunity.com/id/ptrckr",
              trade: "https://steamcommunity.com/tradeoffer/new/?partner=99967435&token=eCs5JlvU",
              bp_credit: "https://backpack.tf/developer/particles"
            },
            key_price_eu: 1.60,
            series: collection.series,
            currently_buying_geishas: false,
            geishas: {
              collected: collection.series.reduce((a, s) =>
                a += s.effects.filter(effect => effect.collected).length, 0),
              total: collection.series.reduce((a, s) =>
                a += s.effects.length, 0)
            }
          };
        }
      },
      files: [{
        expand: true,
        cwd: source_dir,
        src: "index.pug",
        dest: dest_dir,
        ext: ".html"
      }]
    }
  }
};

module.exports = grunt => {
  grunt.initConfig(config);
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-pug");
  grunt.registerTask("static_build", ["copy", "cssmin", "pug"]);
};
