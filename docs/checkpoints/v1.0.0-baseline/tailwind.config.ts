import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/features/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        mint:        '#A8E6CF',
        berry:       '#FF9EC0',
        pancake:     '#FFD89C',
        syrup:       '#C97B3D',
        gold:        '#E8A53C',
        sky:         '#BDE3FF',
        lavender:    '#E2D6FF',
        eggshell:    '#FFFCF5',
        cream:       '#FFF8EE',
        creamShade:  '#F4ECDC',
        cocoa:       '#3B2A22',
        inkSoft:     '#5B4B43',
        muted:       '#8B7A70',
        midnight:    '#1F1611',
        midnightCard:'#2A1E18',
        liveRed:     '#FF4757',
        success:     '#5BC79A',
      },
      fontFamily: {
        display: ['var(--font-display)', 'ui-serif', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        cute: ['var(--font-cute)', '"Comic Sans MS"', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(3.25rem, 7vw, 5.75rem)', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.5rem, 5vw, 4rem)',     { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(2rem, 3.6vw, 2.75rem)',  { lineHeight: '1.1',  letterSpacing: '-0.01em' }],
      },
      borderRadius: {
        sm: '6px', md: '10px', lg: '16px', xl: '22px', '2xl': '28px', '3xl': '36px', pill: '999px',
      },
      boxShadow: {
        soft:    '0 2px 0 rgba(59,42,34,0.06), 0 14px 28px rgba(59,42,34,0.06)',
        lifted:  '0 4px 0 rgba(59,42,34,0.06), 0 22px 44px rgba(59,42,34,0.10)',
        glow:    '0 0 0 4px rgba(168,230,207,0.4)',
        liveGlow:'0 0 0 4px rgba(255,71,87,0.25), 0 0 24px rgba(255,71,87,0.45)',
      },
      backgroundImage: {
        'mood-waffle':  'linear-gradient(135deg, #FFD89C 0%, #E8A53C 50%, #FF9EC0 100%)',
        'mood-mint':    'linear-gradient(135deg, #A8E6CF 0%, #BDE3FF 50%, #E2D6FF 100%)',
        'mood-berry':   'linear-gradient(135deg, #FF9EC0 0%, #FFD89C 50%, #FFF8EE 100%)',
        'mood-syrup':   'linear-gradient(135deg, #3B2A22 0%, #C97B3D 50%, #FFD89C 100%)',
        'mood-cereal':  'linear-gradient(135deg, #E2D6FF 0%, #A8E6CF 33%, #FFD89C 66%, #FF9EC0 100%)',
      },
      keyframes: {
        floatY:    { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        floatRot:  { '0%,100%': { transform: 'translateY(0) rotate(-2deg)' }, '50%': { transform: 'translateY(-6px) rotate(2deg)' } },
        livePulse: { '0%': { transform: 'scale(1)', opacity: '0.5' }, '100%': { transform: 'scale(1.6)', opacity: '0' } },
        sparkle:   { '0%,100%': { opacity: '0.4', transform: 'scale(0.92)' }, '50%': { transform: 'scale(1)', opacity: '1' } },
        shimmer:   { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      animation: {
        'float-y':     'floatY 4s cubic-bezier(0.32,0.72,0,1) infinite',
        'float-rot':   'floatRot 5s cubic-bezier(0.32,0.72,0,1) infinite',
        'live-pulse':  'livePulse 1.4s ease-out infinite',
        'sparkle':     'sparkle 2.4s ease-in-out infinite',
        'shimmer':     'shimmer 3s linear infinite',
      },
      transitionTimingFunction: {
        morning: 'cubic-bezier(0.32, 0.72, 0, 1)',
        stretch: 'cubic-bezier(0.16, 1, 0.3, 1)',
        syrup:   'cubic-bezier(0.65, 0, 0.35, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
