import JSZip from 'jszip';

const getMimeType = fileName => {
  if (/\.jpe?g$/.test(fileName)) return 'image/jpeg';
  if (fileName.endsWith('.png')) return 'image/png';
  if (fileName.endsWith('.gif')) return 'image/gif';
  if (fileName.endsWith('.webp')) return 'image/webp';
  if (fileName.endsWith('.svg')) return 'image/svg+xml';

  if (fileName.endsWith('.mp4')) return 'video/mp4';
  if (fileName.endsWith('.webm')) return 'video/webm';

  if (fileName.endsWith('.mp3')) return 'audio/mpeg';
  if (fileName.endsWith('.m4a')) return 'audio/mp4';
  if (fileName.endsWith('.wav')) return 'audio/wav';
  if (fileName.endsWith('.opus')) return 'audio/ogg';

  return null;
};

const showError = (message, err) => {
  console.error(err || message); // eslint-disable-line no-console
  alert(message); // eslint-disable-line no-alert
};

const readChatFile = zipData => {
  const chatFile = zipData.file('_chat.txt');

  if (chatFile) return chatFile.async('string');

  const chatFiles = zipData.file(/.*(?:chat|whatsapp).*\.txt$/i);

  if (!chatFiles.length) {
    throw new Error('No txt files found in archive');
  }

  const chatFilesSorted = chatFiles.sort(
    (a, b) => a.name.length - b.name.length,
  );

  return chatFilesSorted[0].async('string');
};

const replaceEncryptionMessageAuthor = messages =>
  messages.map((message, i) => {
    if (i < 10 && message.message.includes('end-to-end')) {
      return { ...message, author: 'System' };
    }
    return message;
  });

const extractFile = file => {
  if (!file) return null;
  if (typeof file === 'string') return file;

  const jszip = new JSZip();

  return jszip.loadAsync(file);
};

const fileToText = file => {
  if (!file) return Promise.resolve('');
  if (typeof file === 'string') return Promise.resolve(file);

  return readChatFile(file);
};

export {
  getMimeType,
  showError,
  readChatFile,
  replaceEncryptionMessageAuthor,
  extractFile,
  fileToText,
};
