export function smoothScrollTo(targetY: number, duration: number): Promise<void> {
  return new Promise((resolve) => {
    const start = window.scrollY;
    const distance = targetY - start;
    let startTime: number | null = null;

    function step(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
      window.scrollTo(0, start + distance * ease);
      if (progress < 1) requestAnimationFrame(step);
      else resolve();
    }

    requestAnimationFrame(step);
  });
}
