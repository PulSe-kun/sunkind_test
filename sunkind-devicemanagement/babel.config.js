const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
  // 去掉打包之后的console输出
  prodPlugins.push('transform-remove-console')
}
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [...prodPlugins]
}
