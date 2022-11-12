import { presetUno } from 'unocss'
import presetIcons from '@unocss/preset-icons'

export default {
  shortcuts: [
    {
      btn: 'text-sm py-2 px-4 rounded bg-neutral-900 hover:bg-neutral-700 border border-transparent text-white disabled:bg-gray-300 disabled:hover:bg-gray-300 disabled:cursor-not-allowed',
      'btn-delete':
        'text-sm py-2 px-4 rounded bg-transparent hover:bg-red-600 border border-color-red-600 text-red-600 hover:text-white disabled:border-color-gray-300 disabled:hover:border-color-gray-300 disabled:hover:bg-transparent disabled:text-gray-300 disabled:hover:text-gray-300 disabled:cursor-not-allowed',
    },
  ],
  rules: [
    [
      /^form-select$/,
      () => ({
        'background-image': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
        'background-size': '1.5rem 1.5rem',
        'background-position': 'right 0.55rem center',
      }),
    ],
    [
      /^text-clamp-(\d\d)$/,
      ([, d]: any) => ({
        display: '-webkit-box;',
        '-webkit-line-clamp': d,
        '-webkit-box-orient': 'vertical',
        overflow: 'hidden',
      }),
    ],
  ],
  variants: [
    // href: hover:
    (matcher: any) => {
      if (!matcher.startsWith('href:')) return matcher
      return {
        // slice `hover:` prefix and passed to the next variants and rules
        matcher: matcher.slice(5),
        selector: (s: string) => `${s} a`,
      }
    },
  ],
  theme: {
    colors: {
      cream: '#ebe6db',
    },
    listStyleType: {
      revert: 'revert',
    },
    boxShadow: {
      inner: 'inset 0px 0px 0px 1px rgba(255, 255, 255, 0.05)',
      letterboxd:
        '0px 0px 2.2px var(--un-shadow-color),0px 0px 5.3px var(--un-shadow-color),0px 0px 10px var(--un-shadow-color),0px 0px 17.9px var(--un-shadow-color),0px 0px 33.4px var(--un-shadow-color),0px 0px 80px var(--un-shadow-color)',
    },
    boxShadowColor: {
      orange: '#FF8000',
    },
    transitionProperty: {
      bounce:
        'transform 0.4s cubic-bezier(.26,.5,0,1.14), opacity 0.4s cubic-bezier(.26,.5,0,1.14)',
    },
  },
  presets: [presetUno(), presetIcons()],
}
