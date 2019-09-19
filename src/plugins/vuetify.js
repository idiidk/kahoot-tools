import Vue from "vue";
import Vuetify from "vuetify";
import colors from "vuetify/lib/util/colors";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify);

const opts = {
  theme: {
    themes: {
      light: {
        primary: colors.indigo.darken1,
        secondary: colors.indigo.darken2,
        accent: colors.indigo.darken1
      },
      dark: {
        primary: colors.indigo.lighten1,
        secondary: colors.indigo.lighten2,
        accent: colors.indigo.accent1
      }
    }
  }
};

export default new Vuetify(opts);
