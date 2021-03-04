import { createCollectionRouter } from "../../lib/create-collection-route.ts";
import { WishlistItem } from "../../lib/types.ts";

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
  {
    slug: "gfuel-tropical-rain-tub",
    title: "Tropical Rain Tub",
    link: "https://gfuel.com/collections/tubs/products/tropical-rain-tub",
    purchaseDetails: null,
  },
  {
    slug: "shining-fates-elite-trainer-box",
    title: "Pokemon TCG: Shining Fates Elite Trainer Box",
    link:
      "https://www.amazon.com/Pokemon-TCG-Shining-Fates-Trainer/dp/B08PS2F9RD/ref=sr_1_16?crid=3728DKJO3V9MC&dchild=1&keywords=shining+fates+elite+trainer+box&qid=1614892900&sprefix=shining+fates%2Caps%2C229&sr=8-16",
    purchaseDetails: null,
  },
];

export default createCollectionRouter<WishlistItem>(
  "wishlist",
  wishlist // Do not display items that I already got
    .filter(({ purchaseDetails }) => purchaseDetails === null),
);
