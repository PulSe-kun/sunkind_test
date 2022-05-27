export const unit = id => {
  const _unit = [
    '个',
    '支',
    '把',
    '颗',
    '块',
    '张',
    '包',
    '本',
    '次',
    '袋',
    '千克',
    '双',
    '台',
    '套',
    '组',
    '对',
    '副',
    '根',
    '盒',
    '件',
    '节',
    '斤',
    '卷',
    '辆',
    '米',
    '盘',
    '批',
    '片',
    '瓶',
    '提',
    '条',
    '桶',
    '箱',
    '只',
    'PCS'
  ]
  return _unit[id]
}
// 截取字符串中间用省略号显示
export const getSubStr = str => {
  if (str.length > 4) {
    var subStr1 = str.substr(0, 4)
    var subStr2 = str.substr(str.length - 2, 2)
    var subStr = subStr1 + '...' + subStr2
    return subStr
  }
  return str
}
export const getPalletState = type => {
  switch (type) {
    case 0:
      return '空盘'
    case 1:
      return '有空余'
    case 2:
      return '满盘'
    default:
      break
  }
}
