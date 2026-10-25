// Texts for the "Instagram Stories" window, shared by every share bar.

const uz = {
  title: "Instagram Stories uchun rasm",
  hold: "Rasmni bosib turing va «Rasmni saqlash»ni tanlang.",
  desktop: "Rasmni yuklab oling va telefondan Story'ga joylang.",
  download: "Rasmni yuklab olish",
  open: "Instagram'ni ochish",
  copy: "Havolani nusxalash",
  copied: "Havola nusxalandi",
  steps: "Instagram'da: yangi Story → galereyadan rasmni tanlang → «Link» stikeri va havolani qo'ying.",
  tip: "Story'ga «Link» stikerini qo'shing: havolani «Havolani nusxalash» tugmasi bilan oling.",
  close: "Yopish",
};

const ru: typeof uz = {
  title: "Картинка для Instagram Stories",
  hold: "Нажмите на картинку и удерживайте, затем выберите «Сохранить в Фото».",
  desktop: "Скачайте картинку и выложите её в сторис с телефона.",
  download: "Скачать картинку",
  open: "Открыть Instagram",
  copy: "Копировать ссылку",
  copied: "Ссылка скопирована",
  steps: "В Instagram: новая история → выберите картинку из галереи → стикер «Ссылка» и вставьте ссылку.",
  tip: "Добавьте в сторис стикер «Ссылка»: ссылку можно взять кнопкой «Копировать ссылку».",
  close: "Закрыть",
};

const en: typeof uz = {
  title: "Image for Instagram Stories",
  hold: "Press and hold the image, then choose “Save to Photos”.",
  desktop: "Download the image and post it to your Story from your phone.",
  download: "Download image",
  open: "Open Instagram",
  copy: "Copy link",
  copied: "Link copied",
  steps: "In Instagram: new Story → pick the image from your gallery → add a Link sticker with the link.",
  tip: "Add a Link sticker to the Story: get the link with the “Copy link” button.",
  close: "Close",
};

export const storyText = { uz, ru, en };
export type StoryLabels = typeof uz;
