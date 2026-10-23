// Arrow keys move through each navigation group; Tab still works normally.
document.querySelectorAll('nav').forEach(function (navigation) {
  navigation.addEventListener('keydown', function (event) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const links = Array.from(navigation.querySelectorAll('a[href]')).filter(function (link) {
      return link.getClientRects().length > 0 && link.getAttribute('aria-disabled') !== 'true';
    });
    const currentIndex = links.indexOf(document.activeElement);
    if (currentIndex < 0) return;

    let nextIndex;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (currentIndex + 1) % links.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (currentIndex - 1 + links.length) % links.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = links.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    links[nextIndex].focus();
  });
});
