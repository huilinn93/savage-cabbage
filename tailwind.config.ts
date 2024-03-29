import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    "./components/**/*.{js,vue,ts}",
    "./src/**/*.{vue,html,js,ts, css}",
    "./index.html",
  ],
  theme: {
    screens: {
      xs: "375px",
      sm: {'min': '640px', 'max': '767px'},
      md: {'min': '768px', 'max': '1023px'},
      lg: {'min': '1024px', 'max': '1279px'},
      xl: {'min': '1280px'},
    },
    extend: {
      colors: {
        beige: '#B6928B',
        champagne: '#F3EDE3',
        grey: '#3F474F',
        green: '#919A89',
      },
      fontFamily: {
        sans: 'caviarDreams',
        sansBold: 'caviarDreamsBold',
        serif: 'playfair',
        header: 'sweetAloha',
      },
      fontSize: {
        xs: '0.9rem',
        sm: '1rem',
        lg: '1.25rem',
        xl: '1.55rem',
        xxl: '2.5rem'
      },
    }
  },
}
