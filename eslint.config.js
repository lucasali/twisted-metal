import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
})
