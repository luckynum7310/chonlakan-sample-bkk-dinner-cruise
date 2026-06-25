const localAsset = (name) => `./assets/${name}`;

export const assets = {
  logo: localAsset("logo.svg"),
  hero: localAsset("hero.jpg"),
  landmarkCatamaran: localAsset("landmark-catamaran.svg"),
  carouselArrowLeft: localAsset("carousel-arrow-left.svg"),
  carouselArrowRight: localAsset("carousel-arrow-right.svg"),
  landmarksBg: localAsset("landmark-iconsiam.jpg"),
  landmarkCards: [
    localAsset("landmark-card-1.jpg"),
    localAsset("landmark-card-2.jpg"),
    localAsset("landmark-card-3.jpg"),
  ],
  landmarkStates: [
    {
      key: "iconsiam",
      bg: localAsset("landmark-iconsiam.jpg"),
      image: localAsset("landmark-iconsiam.jpg"),
    },
    {
      key: "rama8",
      bg: localAsset("landmark-rama8.jpg"),
      image: localAsset("landmark-rama8.jpg"),
    },
    {
      key: "grandPalace",
      bg: localAsset("landmark-grand-palace.jpg"),
      image: localAsset("landmark-grand-palace.jpg"),
    },
    {
      key: "watArun",
      bg: localAsset("landmark-wat-arun.jpg"),
      image: localAsset("landmark-wat-arun.jpg"),
    },
  ],
  cruiseCards: [
    localAsset("cruise-1.jpg"),
    localAsset("cruise-2.jpg"),
  ],
  menu: localAsset("menu.jpg"),
  culinaryIcon: localAsset("culinary-icon.svg"),
  culinaryArrow: localAsset("culinary-arrow.svg"),
  culinaryMenu: [
    [localAsset("culinary-menu-1.jpg"), localAsset("culinary-menu-2.jpg")],
    [localAsset("culinary-menu-3.jpg"), localAsset("culinary-menu-4.jpg")],
    [localAsset("culinary-menu-5.jpg"), localAsset("culinary-menu-6.jpg")],
    [localAsset("culinary-menu-7.jpg"), localAsset("culinary-menu-8.jpg")],
  ],
  piers: [
    localAsset("pier-1.jpg"),
    localAsset("pier-2.jpg"),
    localAsset("pier-3.jpg"),
    localAsset("pier-4.jpg"),
    localAsset("pier-5.jpg"),
  ],
  blogs: [
    localAsset("blog-1.jpg"),
    localAsset("blog-2.jpg"),
    localAsset("blog-3.jpg"),
  ],
  blogImageCount: localAsset("blog-image-count.svg"),
  reviewStar: localAsset("review-star.svg"),
  reviewVerified: localAsset("review-verified.svg"),
  guests: [
    localAsset("guest-1.jpg"),
    localAsset("guest-2.jpg"),
    localAsset("guest-3.jpg"),
  ],
  reviewGallery: [
    localAsset("review-1.jpg"),
    localAsset("review-2.jpg"),
    localAsset("review-3.jpg"),
  ],
};
