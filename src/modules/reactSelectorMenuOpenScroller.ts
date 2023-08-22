export const onMenuOpenScroller = () => {
  setTimeout(() => {
    const selectedEl = document.querySelector('.react-selector');

    if (selectedEl) {
      selectedEl.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, 15);
};
