function createDoubleTapPreventer(timeout_ms: number) {
  let dblTapTimer: NodeJS.Timeout;
  let dblTapPressed = false;

  return function (e: TouchEvent) {
    console.log('tap');
    clearTimeout(dblTapTimer);
    if (dblTapPressed) {
      e.preventDefault();
      dblTapPressed = false;
    } else {
      dblTapPressed = true;
      dblTapTimer = setTimeout(() => {
        dblTapPressed = false;
      }, timeout_ms);
    }
  };
}

export default function preventDoubleTap() {
  document.body.addEventListener('touchstart', createDoubleTapPreventer(500), {
    passive: false,
  });
}
