// Settings for the next «Почётная порция» auction. Empty values render as
// "to be announced" on the page. While `open` is false the page is a preview:
// no bid button, no payment details.
export type Bid = { name: string; amount: number; at: string };

export const auction = {
  open: false,
  date: "", // e.g. "2026-11-14"
  city: { ru: "", uz: "", en: "" },
  venue: "",
  currency: "USDT",
  startPrice: 0, // in `currency`
  step: 0, // minimum raise, in `currency`
  onlineCloses: "", // when online bidding stops before the live final, e.g. "2026-11-13T20:00"
  bids: [] as Bid[], // filled in by the organisers after each confirmed bid
};
