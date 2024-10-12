export function camelCaseToTitleCase(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1') // 在大写字母前添加空格
    .replace(/^./, (char) => char.toUpperCase()) // 将第一个字母大写
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // 将每个单词的首字母大写，其余字母小写
    .join(' ');
}
