const prefersReducedMotion = () =>
  typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Makes `[data-lg-tilt]` elements rotate towards the cursor instead of a fixed hover angle. */
export function enableTilt(root: ParentNode = document): () => void {
  const elements = [...root.querySelectorAll<HTMLElement>("[data-lg-tilt]")];
  const cleanups: Array<() => void> = [];

  for (const el of elements) {
    if (prefersReducedMotion()) continue;

    const maxDeg = Number(el.dataset.lgTiltMax ?? 10);

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      el.style.setProperty("--lg-rx", `${(-py * maxDeg * 2).toFixed(2)}deg`);
      el.style.setProperty("--lg-ry", `${(px * maxDeg * 2).toFixed(2)}deg`);
      el.style.transform = `perspective(800px) rotateX(var(--lg-rx)) rotateY(var(--lg-ry))`;
    };

    const onLeave = () => {
      el.style.setProperty("--lg-rx", "0deg");
      el.style.setProperty("--lg-ry", "0deg");
      el.style.transform = "";
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    cleanups.push(() => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    });
  }

  return () => cleanups.forEach((fn) => fn());
}
