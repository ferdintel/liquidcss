const prefersReducedMotion = () =>
  typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Makes `[data-lg-ripple]` elements spawn a ripple that starts at the exact click point. */
export function enableRipple(root: ParentNode = document): () => void {
  const elements = [...root.querySelectorAll<HTMLElement>("[data-lg-ripple]")];
  const cleanups: Array<() => void> = [];

  for (const el of elements) {
    const computed = getComputedStyle(el);
    if (computed.position === "static") el.style.position = "relative";
    if (computed.overflow === "visible") el.style.overflow = "hidden";

    const onClick = (event: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const span = document.createElement("span");
      span.setAttribute("aria-hidden", "true");
      Object.assign(span.style, {
        position: "absolute",
        left: `${event.clientX - rect.left}px`,
        top: `${event.clientY - rect.top}px`,
        width: "0",
        height: "0",
        borderRadius: "999px",
        background: "radial-gradient(circle, rgb(255 255 255 / 0.5) 0%, transparent 70%)",
        pointerEvents: "none",
        transform: "translate(-50%, -50%)",
        transition: prefersReducedMotion() ? "none" : "width 650ms ease, height 650ms ease, opacity 650ms ease",
      });
      el.appendChild(span);
      requestAnimationFrame(() => {
        span.style.width = `${size}px`;
        span.style.height = `${size}px`;
        span.style.opacity = "0";
      });
      span.addEventListener("transitionend", () => span.remove(), { once: true });
      setTimeout(() => span.remove(), 800);
    };

    el.addEventListener("click", onClick);
    cleanups.push(() => el.removeEventListener("click", onClick));
  }

  return () => cleanups.forEach((fn) => fn());
}
