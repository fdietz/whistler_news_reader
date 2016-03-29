export function findScrollableAncestor(currentNode) {
  let node = currentNode;

  while (node.parentNode) {
    node = node.parentNode;

    if (node === document || node === document.documentElement) {
      continue;
    }

    const style = window.getComputedStyle(node);
    const overflowY = style.getPropertyValue("overflow-y") ||
      style.getPropertyValue("overflow");

    if (overflowY === "auto" || overflowY === "scroll") {
      return node;
    }
  }

  // fallback window
  return window;
}

export function isElementInViewport (element) {
  const rect = element.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
