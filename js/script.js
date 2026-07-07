// ===== Current year in footer =====
document.getElementById("year").textContent = new Date().getFullYear();

// ===== Mobile nav toggle =====
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => navLinks.classList.remove("open"))
);

// ===== Navbar shadow on scroll =====
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 10);
});

// ===== Reveal-on-scroll animation =====
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// ===== Image lightbox for galleries =====
(function () {
  const galleryImgs = Array.from(
    document.querySelectorAll(
      ".exp-gallery-item img, .gallery-item img, .polaroid-photo img, .carousel-item img, .slideshow img"
    )
  );
  if (!galleryImgs.length) return;

  // Build the lightbox overlay once
  const lb = document.createElement("div");
  lb.className = "lightbox";
  lb.innerHTML =
    '<button class="lightbox-close" aria-label="Close">&times;</button>' +
    '<button class="lightbox-nav lightbox-prev" aria-label="Previous">&#8249;</button>' +
    '<img class="lightbox-img" src="" alt="" />' +
    '<button class="lightbox-nav lightbox-next" aria-label="Next">&#8250;</button>';
  document.body.appendChild(lb);

  const lbImg = lb.querySelector(".lightbox-img");
  let group = [];
  let index = 0;

  const show = () => {
    lbImg.src = group[index].src;
    lbImg.alt = group[index].alt || "";
  };
  const open = (g, i) => {
    group = g;
    index = i;
    show();
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    lb.classList.remove("open");
    document.body.style.overflow = "";
  };
  const next = () => {
    index = (index + 1) % group.length;
    show();
  };
  const prev = () => {
    index = (index - 1 + group.length) % group.length;
    show();
  };

  galleryImgs.forEach((img) => {
    img.addEventListener("click", () => {
      const container = img.closest(
        ".exp-feature-gallery, .exp-gallery-grid, .gallery, .polaroid-gallery, .carousel-track, .slideshow"
      );
      const g = container
        ? Array.from(container.querySelectorAll("img")).filter(
            (im) => im.offsetParent !== null
          )
        : [img];
      open(g, g.indexOf(img));
    });
  });

  lb.querySelector(".lightbox-close").addEventListener("click", close);
  lb.querySelector(".lightbox-next").addEventListener("click", (e) => {
    e.stopPropagation();
    next();
  });
  lb.querySelector(".lightbox-prev").addEventListener("click", (e) => {
    e.stopPropagation();
    prev();
  });
  lb.addEventListener("click", (e) => {
    if (e.target === lb) close();
  });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight") next();
    else if (e.key === "ArrowLeft") prev();
  });
})();

// ===== Single-frame slideshows =====
document.querySelectorAll(".slideshow").forEach((show) => {
  const imgs = Array.from(show.querySelectorAll("img"));
  const prev = show.querySelector(".slideshow-prev");
  const next = show.querySelector(".slideshow-next");
  const counter = show.querySelector(".slideshow-current");
  if (imgs.length < 2) return;

  let i = imgs.findIndex((im) => im.classList.contains("active"));
  if (i < 0) i = 0;

  const go = (n) => {
    imgs[i].classList.remove("active");
    i = (n + imgs.length) % imgs.length;
    imgs[i].classList.add("active");
    if (counter) counter.textContent = i + 1;
  };

  if (prev) prev.addEventListener("click", () => go(i - 1));
  if (next) next.addEventListener("click", () => go(i + 1));
});

// ===== Horizontal carousels =====
document.querySelectorAll(".carousel").forEach((carousel) => {
  const track = carousel.querySelector(".carousel-track");
  const prevBtn = carousel.querySelector(".carousel-prev");
  const nextBtn = carousel.querySelector(".carousel-next");
  if (!track) return;

  const scrollAmount = () => Math.max(track.clientWidth * 0.8, 280);

  const updateArrows = () => {
    const maxScroll = track.scrollWidth - track.clientWidth - 2;
    if (prevBtn) prevBtn.hidden = track.scrollLeft <= 2;
    if (nextBtn) nextBtn.hidden = track.scrollLeft >= maxScroll;
  };

  if (prevBtn)
    prevBtn.addEventListener("click", () =>
      track.scrollBy({ left: -scrollAmount(), behavior: "smooth" })
    );
  if (nextBtn)
    nextBtn.addEventListener("click", () =>
      track.scrollBy({ left: scrollAmount(), behavior: "smooth" })
    );

  track.addEventListener("scroll", updateArrows);
  window.addEventListener("resize", updateArrows);
  updateArrows();
});
