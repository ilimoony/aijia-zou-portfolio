const portfolio = document.querySelector('#portfolio');
const openBookButton = document.querySelector('#openBook');
const turnRibbon = document.querySelector('#turnRibbon');
const turnBackRibbon = document.querySelector('#turnBackRibbon');
const restartEnding = document.querySelector('#restartEnding');
const resetButton = document.querySelector('#resetBook');
const tocLinks = [...document.querySelectorAll('.toc-link')];
const contentsPage = document.querySelector('.contents-page');
const content = document.querySelector('.section-content');
const title = document.querySelector('#sectionTitle');
const description = document.querySelector('#sectionDescription');
const instruction = document.querySelector('#instruction');
const pageCount = document.querySelector('#pageCount');
const progressFill = document.querySelector('#progressFill');
const aboutArt = document.querySelector('.about-art');
const experienceArt = document.querySelector('.experience-art');
const videoArt = document.querySelector('.video-art');
const posterArt = document.querySelector('.poster-art');
const artworkHotspots = [...document.querySelectorAll('.artwork-hotspot')];
const artPreview = document.querySelector('#artPreview');
const artPreviewImage = document.querySelector('#artPreviewImage');
const pageTurn = document.querySelector('#pageTurn');
const pageTurnFront = pageTurn.querySelector('.page-turn-front');
const pageTurnBack = pageTurn.querySelector('.page-turn-back');
let view = 'cover';
let activeSection = -1;
let turning = false;

const sections = [
  { id: 'about', label: 'ABOUT ME', kicker: 'A LITTLE ABOUT ME', title: 'Aijia Zou', description: 'A designer drawn to quiet details, tactile stories, and the space between function and feeling.' },
  { id: 'experience', label: 'EXPERIENCE', kicker: 'EXPERIENCE', title: 'In the making.', description: 'Currently studying at Vassar College and exploring visual identity, editorial design, and thoughtful digital experiences.' },
  { id: 'video', label: 'VIDEO EDITS', kicker: 'MOVING IMAGE', title: 'Video edits', description: 'A collection of rhythmic cuts, visual stories, and short-form edits.' },
  { id: 'poster', label: 'POSTER / MAGAZINE', kicker: 'PRINT & EDITORIAL', title: 'Poster / magazine design', description: 'Print-led experiments in composition, typography, and image-making.' },
];

function renderProgress() {
  const labels = ['COVER', 'CONTENTS', 'ABOUT ME', 'EXPERIENCE', 'VIDEO EDITS', 'POSTER / MAGAZINE', 'BACK COVER'];
  const current = view === 'cover' ? 0 : view === 'ending' ? 6 : activeSection < 0 ? 1 : activeSection + 2;
  pageCount.textContent = labels[current];
  progressFill.style.width = `${current / 6 * 100}%`;
  instruction.textContent = view === 'cover'
    ? 'CLICK THE RIBBON TO OPEN'
    : view === 'ending'
      ? 'THE END · CLICK THE BOOK TO RETURN'
      : activeSection < 0
        ? 'CONTENTS · CLICK A SECTION OR TURN THE RIBBON'
        : 'CLICK THE RIBBON TO TURN THE PAGE';
}

function pageImageFor(index) {
  if (index === -1) return 'assets/catalog-spread-cutout.png';
  if (index === 0) return 'assets/about-me-spread-cutout.png';
  if (index === 1) return 'assets/experience-spread-cutout.png';
  if (index === 2) return 'assets/video-projects-spread-cutout.png';
  if (index === 3) return 'assets/poster-magazine-spread-cutout.png';
  return 'assets/red-open-book-cutout.png';
}

function renderTurnCopy(face, index, showOnLeaf) {
  const copy = face.querySelector('.turn-copy');
  const section = sections[index];
  if (!showOnLeaf || index < 4 || !section) {
    copy.replaceChildren();
    return;
  }
  const kicker = document.createElement('span');
  kicker.className = 'section-kicker';
  kicker.textContent = section.kicker;
  const heading = document.createElement('h2');
  heading.textContent = section.title;
  const paragraph = document.createElement('p');
  paragraph.textContent = section.description;
  copy.replaceChildren(kicker, heading, paragraph);
}

function playPageTurn(direction = 'forward', fromIndex = activeSection, toIndex = activeSection + 1) {
  const forward = direction === 'forward';
  const frontIndex = fromIndex;
  const backIndex = toIndex;
  pageTurnFront.style.backgroundImage = `url("${pageImageFor(frontIndex)}")`;
  pageTurnBack.style.backgroundImage = `url("${pageImageFor(backIndex)}")`;
  pageTurnFront.style.backgroundPosition = `${forward ? 83 : 17}% 39%`;
  pageTurnBack.style.backgroundPosition = `${forward ? 17 : 83}% 39%`;
  renderTurnCopy(pageTurnFront, frontIndex, forward);
  renderTurnCopy(pageTurnBack, backIndex, !forward);

  pageTurn.classList.remove('is-turning', 'is-turning-back');
  void pageTurn.offsetWidth;
  const turnClass = direction === 'back' ? 'is-turning-back' : 'is-turning';
  pageTurn.classList.add(turnClass);
  window.setTimeout(() => pageTurn.classList.remove(turnClass), 1100);
}

function selectSection(index, animate = true) {
  const previousSection = activeSection;
  activeSection = Math.max(0, Math.min(sections.length - 1, index));
  if (animate) {
    turning = true;
    playPageTurn('forward', previousSection, activeSection);
  }
  contentsPage.hidden = true;
  content.hidden = false;
  const update = () => {
    const current = sections[activeSection];
    const pageArt = activeSection === 0 ? aboutArt : activeSection === 1 ? experienceArt : activeSection === 2 ? videoArt : activeSection === 3 ? posterArt : null;
    aboutArt.hidden = pageArt !== aboutArt;
    experienceArt.hidden = pageArt !== experienceArt;
    videoArt.hidden = pageArt !== videoArt;
    posterArt.hidden = pageArt !== posterArt;
    portfolio.classList.toggle('show-experience-links', activeSection === 1);
    portfolio.classList.toggle('show-video-links', activeSection === 2);
    portfolio.classList.toggle('show-poster-hotspots', activeSection === 3);
    content.hidden = Boolean(pageArt);
    content.dataset.section = current.id;
    title.textContent = current.title;
    description.textContent = current.description;
    content.querySelector('.section-kicker').textContent = current.kicker;
    content.classList.remove('is-changing');
    if (animate) window.setTimeout(() => { turning = false; }, 780);
  };
  if (animate) {
    content.classList.add('is-changing');
    window.setTimeout(update, 360);
  } else {
    update();
    content.classList.remove('is-changing');
  }
  renderProgress();
}

function openPortfolio() {
  if (view !== 'cover') return;
  view = 'spread';
  portfolio.dataset.view = view;
  activeSection = -1;
  contentsPage.hidden = false;
  content.hidden = true;
  aboutArt.hidden = true;
  experienceArt.hidden = true;
  videoArt.hidden = true;
  posterArt.hidden = true;
  portfolio.classList.remove('show-experience-links');
  portfolio.classList.remove('show-video-links');
  portfolio.classList.remove('show-poster-hotspots');
  renderProgress();
}

function showEnding() {
  view = 'ending';
  portfolio.dataset.view = view;
  renderProgress();
}

function turnForward() {
  if (turning || view !== 'spread') return;
  if (activeSection < sections.length - 1) selectSection(activeSection + 1);
  else {
    turning = true;
    playPageTurn('forward', activeSection, activeSection + 1);
    window.setTimeout(showEnding, 1000);
    window.setTimeout(() => { turning = false; }, 1150);
  }
}

function turnBackward() {
  if (turning || view !== 'spread') return;
  if (activeSection < 0) {
    turning = true;
    playPageTurn('back', -1, -2);
    window.setTimeout(reset, 650);
    window.setTimeout(() => { turning = false; }, 900);
    return;
  }
  turning = true;
  playPageTurn('back', activeSection, activeSection - 1);
  if (activeSection === 0) {
    activeSection = -1;
    contentsPage.hidden = false;
    content.hidden = true;
    aboutArt.hidden = true;
    experienceArt.hidden = true;
    videoArt.hidden = true;
    posterArt.hidden = true;
    portfolio.classList.remove('show-experience-links');
    portfolio.classList.remove('show-video-links');
    portfolio.classList.remove('show-poster-hotspots');
    renderProgress();
    window.setTimeout(() => { turning = false; }, 1100);
  } else {
    selectSection(activeSection - 1, false);
    window.setTimeout(() => { turning = false; }, 1100);
  }
}

function reset() {
  view = 'cover';
  activeSection = -1;
  turning = false;
  portfolio.dataset.view = view;
  contentsPage.hidden = false;
  content.hidden = true;
  aboutArt.hidden = true;
  experienceArt.hidden = true;
  videoArt.hidden = true;
  posterArt.hidden = true;
  portfolio.classList.remove('show-experience-links');
  portfolio.classList.remove('show-video-links');
  portfolio.classList.remove('show-poster-hotspots');
  renderProgress();
}

openBookButton.addEventListener('click', (event) => { event.stopPropagation(); openPortfolio(); });
turnRibbon.addEventListener('click', (event) => { event.stopPropagation(); turnForward(); });
turnBackRibbon.addEventListener('click', (event) => { event.stopPropagation(); turnBackward(); });
function showArtworkPreview(hotspot) {
  artPreviewImage.src = hotspot.dataset.preview;
  artPreviewImage.alt = hotspot.getAttribute('aria-label') || 'Artwork preview';
  artPreview.classList.add('is-visible');
  artPreview.setAttribute('aria-hidden', 'false');
}
function hideArtworkPreview() {
  artPreview.classList.remove('is-visible');
  artPreview.setAttribute('aria-hidden', 'true');
}
artworkHotspots.forEach((hotspot) => {
  hotspot.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'touch') showArtworkPreview(hotspot);
  });
  hotspot.addEventListener('pointerleave', (event) => {
    if (event.pointerType !== 'touch') hideArtworkPreview();
  });
  hotspot.addEventListener('focus', () => showArtworkPreview(hotspot));
  hotspot.addEventListener('blur', hideArtworkPreview);
  hotspot.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'touch') showArtworkPreview(hotspot);
  });
});
document.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch' && !event.target.closest('.artwork-hotspot')) hideArtworkPreview();
});
tocLinks.forEach((link) => link.addEventListener('click', () => {
  if (view === 'spread' && activeSection < 0 && !turning) selectSection(Number(link.dataset.section));
}));
restartEnding.addEventListener('click', reset);
resetButton.addEventListener('click', reset);
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' || event.key === ' ') {
    if (view === 'cover') openPortfolio();
    else if (view === 'spread') turnForward();
  }
  if (event.key === 'ArrowLeft' && view === 'spread') turnBackward();
  if (event.key === 'Home') reset();
});
renderProgress();
