import emoji from 'react-easy-emoji';

export default function createEmoji(input) {
  return emoji(input, {
    baseUrl: '//twemoji.maxcdn.com/2/svg',
    ext: '.svg',
    size: '',
  });
}
