const localAsset = (name) => `./assets/${name}`;

export const assets = {
  logo: localAsset("logo.svg"),
  hero: localAsset("hero.jpg"),
  landmarkCatamaran: localAsset("landmark-catamaran.svg"),
  carouselArrowLeft: localAsset("carousel-arrow-left.svg"),
  carouselArrowRight: localAsset("carousel-arrow-right.svg"),
  landmarksBg: localAsset("landmark-iconsiam.png"),
  landmarkCards: [
    localAsset("landmark-card-1.png"),
    localAsset("landmark-card-2.png"),
    localAsset("landmark-card-3.jpg"),
  ],
  landmarkStates: [
    {
      key: "iconsiam",
      bg: localAsset("landmark-iconsiam.png"),
      image: localAsset("landmark-iconsiam.png"),
    },
    {
      key: "rama8",
      bg: localAsset("landmark-rama8.png"),
      image: localAsset("landmark-rama8.png"),
    },
    {
      key: "grandPalace",
      bg: localAsset("landmark-grand-palace.png"),
      image: localAsset("landmark-grand-palace.png"),
    },
    {
      key: "watArun",
      bg: localAsset("landmark-wat-arun.jpg"),
      image: localAsset("landmark-wat-arun.jpg"),
    },
  ],
  cruiseCards: [
    localAsset("cruise-1.png"),
    localAsset("cruise-2.png"),
  ],
  menu: localAsset("menu.png"),
  culinaryIcon: localAsset("culinary-icon.svg"),
  culinaryArrow: localAsset("culinary-arrow.svg"),
  culinaryMenu: [
    [localAsset("culinary-menu-1.png"), localAsset("culinary-menu-2.png")],
    [localAsset("culinary-menu-3.png"), localAsset("culinary-menu-4.png")],
    [localAsset("culinary-menu-5.png"), localAsset("culinary-menu-6.png")],
    [localAsset("culinary-menu-7.png"), localAsset("culinary-menu-8.png")],
  ],
  piers: [
    localAsset("pier-1.png"),
    localAsset("pier-2.png"),
    localAsset("pier-3.png"),
    localAsset("pier-4.png"),
    localAsset("pier-5.png"),
  ],
  blogs: [
    localAsset("blog-1.png"),
    localAsset("blog-2.png"),
    localAsset("blog-3.png"),
  ],
  blogImageCount: localAsset("blog-image-count.svg"),
  reviewStar: localAsset("review-star.svg"),
  reviewVerified: localAsset("review-verified.svg"),
  guests: [
    localAsset("guest-1.jpg"),
    localAsset("guest-2.png"),
    localAsset("guest-3.jpg"),
  ],
  reviewGallery: [
    localAsset("review-1.png"),
    localAsset("review-2.png"),
    localAsset("review-3.png"),
  ],
};
