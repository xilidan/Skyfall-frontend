/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: ['en', 'ru', 'kk'],
  pseudoLocale: 'pseudo',
  sourceLocale: 'en',
  fallbackLocales: {
    default: 'en',
  },
  catalogs: [
    {
      path: 'src/locales/{locale}',
      include: ['src/'],
    },
  ],
}
