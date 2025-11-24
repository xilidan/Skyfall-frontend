import {msg} from '@lingui/core/macro'

export const propertyConfig = {
  photoMaxCount: 10,
  regionMap: {
    almaty: msg({
      context: 'RegionList',
      message: 'Almaty',
    }),
    astana: msg({
      context: 'RegionList',
      message: 'Astana',
    }),
    shymkent: msg({
      context: 'RegionList',
      message: 'Shymkent',
    }),
  } as const,
}
