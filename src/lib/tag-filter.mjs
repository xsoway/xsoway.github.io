const trailingPunctuation = /[，。；、,.;:!！？?）)】\]]+$/u;
const sentencePunctuation = /[。！？；：]/u;
const tableOrExamplePrefix = /^(?:表|代码示例|示例)\s*\d/u;

export function normalizeTag(value) {
  const name = value.trim()
    .replace(/^(?:[-*]\s+)+/u, '')
    .replace(trailingPunctuation, '');
  const hanCount = [...name].filter((character) => /\p{Script=Han}/u.test(character)).length;
  const wordCount = name.split(/\s+/u).length;
  if (!name || name.startsWith('/') || name.toLocaleLowerCase() === 'draft') return null;
  if (hanCount > 10 || wordCount > 3 || [...name].length > 32 || sentencePunctuation.test(name) || tableOrExamplePrefix.test(name)) return null;
  return name;
}
