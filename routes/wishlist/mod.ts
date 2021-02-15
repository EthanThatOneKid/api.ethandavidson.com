import { createCollectionRouter } from "../../lib/create-collection-route.ts";
import ApproxDate from "../../lib/approx-date.ts";

export interface WishlistItem {
  slug: string;
  title: string;
  link: string | null;
  purchaseDetails: {
    by: string;
    when: ApproxDate;
  } | null;
}

export const getWishlistItemFromSlug = (query: string) =>
  wishlist.find(({ slug }) => slug === query);

export const wishlist: WishlistItem[] = [
  {
    slug: "discord-nitro",
    title: "Discord Nitro",
    link: "https://discord.com/nitro",
    purchaseDetails: null,
  },
  {
    slug: "boomerang",
    title: "Boomerang",
    link: "https://watch.boomerang.com/shows",
    purchaseDetails: null,
  },
];

export default createCollectionRouter<WishlistItem>(
  "whishlist",
  wishlist // Do not display items that I already got
    .filter(({ purchaseDetails }) => purchaseDetails !== null),
);
