export function vibrateSuccess() {
  if ("vibrate" in navigator) {
    navigator.vibrate(50);
  }
}

export function vibrateError() {
  if ("vibrate" in navigator) {
    navigator.vibrate([50, 100, 50]);
  }
}

export function vibrateCheckIn() {
  if ("vibrate" in navigator) {
    navigator.vibrate([100, 50, 100]);
  }
}

export function vibrateCheckOut() {
  if ("vibrate" in navigator) {
    navigator.vibrate(200);
  }
}
