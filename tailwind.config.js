module.exports = {
  content: ['./**/*.{html,js}'],
  theme: {
    fontFamily: {
      sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui']
    },
    extend: {
      colors: {
        spaceBlack: '#04070D',
        spaceDark: '#0B1624',
        rustBlue: '#0B3D91',
        rocketPurple: '#7B2CBF',
        liechtensteinRed: '#D50000',
        speedYellow: '#FFD600',
        neonGreen: '#2AFF62',
        royalPurple: '#6E44FF',
      },
      fontSize: {
        '4.5xl': 'clamp(2.5rem, 5vw, 3.75rem)',
        '2.5xl': 'clamp(1.75rem, 3vw, 1.875rem)',
        'lg-fluid': 'clamp(1.125rem, 1.5vw, 1.25rem)',
      },
      animation: {
        'gradient-x': 'gradient-x 8s ease infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'pulseFast': 'pulse 1.5s cubic-bezier(0.4,0,0.6,1) infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'linear-move': 'linear-move 15s linear infinite',
        'fade-slide': 'fadeSlide 0.3s ease-out forwards',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'linear-move': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fadeSlide': {
          '0%': { opacity: '0', transform: 'translateY(2rem)' },
          '100%': { opacity: '1', transform: 'none' },
        }
      },
      transitionProperty: {
        'height': 'height',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(42, 255, 98, 0.5)',
        'inner-glow': 'inset 0 0 10px rgba(42, 255, 98, 0.15)',
      },
      dropShadow: { 
        'neon': '0 0 12px rgba(42,255,98,.35)' 
      },
    }
  },
  safelist: [
    'translate-x-full',
    'translate-x-0',
    'translate-y-full',
    'opacity-0',
    'transition-all',
    'duration-300',
    'animate-pulseFast',
    'animate-pulse-slow',
    'animate-spin',
    'animate-fade-slide',
    'overflow-hidden',
    'fixed',
    'bottom-0',
    'h-18',
    'bg-spaceDark/80',
    'backdrop-blur',
    'backdrop-blur-lg',
    'hero-slot-gif',
    'hero-radar-svg',
    'hero-mirror-gif',
    'text-gradient',
    'sparkline-chart',
    'timeline-dot-pulse',
    'text-neonGreen',
    'bg-rocketPurple/10',
    'glass-card',
    'drop-shadow-neon',
    'border-neonGreen/30',
    'shadow-[0_0_24px_rgba(42,255,98,0.25)]',
    'btn-neon',
    'btn-ghost'
  ]
}; 