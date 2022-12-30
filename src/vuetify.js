import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import colors from 'vuetify/lib/util/colors';

export default createVuetify({
  components,
  directives,
  icons:
    {
      defaultSet: 'mdi',
      aliases,
      sets:
      {
        mdi,
      },
    },
  display:
    {
      mobileBreakpoint: 800,
      thresholds:
      {
        xs: 340,
        sm: 600,
        md: 800,
        lg: 1280,
      },
    },
  theme:
    {
      defaultTheme: 'light',
      themes:
      {
        light:
          {
            dark: false,
            colors:
              {
                filler: '#FEFEE0',
                primary: colors.blue.base,
              }
          },
      },
      options:
        {
          customProperties: true
        },
    }
});
