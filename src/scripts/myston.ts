const desktop = window.matchMedia("(min-width: 1200px)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const myston = document.querySelector<HTMLElement>("[data-myston]");
const button = myston?.querySelector<HTMLButtonElement>("[data-myston-button]");
const eyes = myston?.querySelectorAll<HTMLElement>("[data-myston-eye]");
const terminal = myston?.querySelector<HTMLElement>("[data-myston-terminal]");
const ripple = myston?.querySelector<HTMLElement>("[data-myston-ripple]");
const hero = document.querySelector<HTMLElement>("#hero");
const about = document.querySelector<HTMLElement>("#about");

if (myston && button && eyes && terminal && ripple && hero && about && desktop.matches) {
  const messages = [
    "hi, i'm myston",
    "em is fine too",
    "i live on this site",
    "mostly i just watch",
  ];
  let isIntroducing = false;
  let isPointerOver = false;
  let isFocused = false;
  let interactionSession = false;
  let sessionId = 0;
  let isInRegion = false;
  let quietTimer: number | undefined;
  let activeWaitCancel: (() => void) | undefined;

  const wait = (duration: number) =>
    new Promise<void>((resolve) => {
      const timeout = window.setTimeout(() => {
        activeWaitCancel = undefined;
        resolve();
      }, duration);
      activeWaitCancel = () => {
        window.clearTimeout(timeout);
        activeWaitCancel = undefined;
        resolve();
      };
    });

  const updateRegion = () => {
    const aboutBounds = about.getBoundingClientRect();
    const fixedCenter = window.innerHeight / 2;
    const aboutCenter = aboutBounds.top + aboutBounds.height / 2;

    if (getComputedStyle(myston).position === "fixed" && aboutCenter <= fixedCenter) {
      const bounds = myston.getBoundingClientRect();
      myston.style.position = "absolute";
      myston.style.top = `${window.scrollY + fixedCenter - bounds.height / 2}px`;
      myston.style.transform = "none";
    } else if (getComputedStyle(myston).position === "absolute") {
      const bounds = myston.getBoundingClientRect();
      const mystonCenter = bounds.top + bounds.height / 2;

      if (mystonCenter >= fixedCenter) {
        myston.style.removeProperty("position");
        myston.style.removeProperty("top");
        myston.style.removeProperty("transform");
      }
    }

    const updatedBounds = myston.getBoundingClientRect();
    isInRegion = updatedBounds.bottom > 0 && updatedBounds.top < window.innerHeight;
    myston.hidden = false;
  }

  const scheduleQuiet = () => {
    if (quietTimer !== undefined) window.clearTimeout(quietTimer);
    quietTimer = window.setTimeout(() => {
      if (document.activeElement !== button) myston.classList.add("is-quiet");
    }, 18000);
  };

  const wake = () => {
    updateRegion();

    if (!isInRegion) return;

    myston.classList.remove("is-quiet");

    if (!isPointerOver && !isFocused && !isIntroducing) scheduleQuiet();
  };

  const writeMessage = async (message: string, currentSession: number) => {
    if (reducedMotion.matches) {
      if (currentSession !== sessionId) return;
      terminal.textContent = message;
      return;
    }

    terminal.textContent = "";
    for (const character of message) {
      if (currentSession !== sessionId) return;
      terminal.textContent += character;
      await wait(38);
      if (currentSession !== sessionId) return;
    }
  };

  const introduce = async (currentSession: number) => {
    if (isIntroducing || !isInRegion) return;

    isIntroducing = true;
    if (quietTimer !== undefined) window.clearTimeout(quietTimer);
    myston.classList.remove("is-quiet");
    terminal.textContent = "";

    for (const message of messages) {
      if (!reducedMotion.matches) {
        myston.classList.add("is-bouncing");
        await wait(780);
        if (currentSession !== sessionId) return;
        myston.classList.add("is-rippling");
        await wait(220);
        if (currentSession !== sessionId) return;
        myston.classList.remove("is-bouncing");
        await wait(260);
        if (currentSession !== sessionId) return;
        myston.classList.remove("is-rippling");
      } else {
        await wait(250);
        if (currentSession !== sessionId) return;
      }

      await writeMessage(message, currentSession);
      if (currentSession !== sessionId) return;
      await wait(320);
      if (currentSession !== sessionId) return;
    }

    myston.classList.remove("is-bouncing", "is-rippling");
    myston.classList.remove("is-active");
    terminal.textContent = "";
    isIntroducing = false;
    scheduleQuiet();
  };

  const startSession = () => {
    if (interactionSession || !isInRegion) return;

    interactionSession = true;
    void introduce(++sessionId);
  };

  const endSession = () => {
    if (isPointerOver || isFocused) return;

    myston.classList.remove("is-active");
    if (isIntroducing) {
      sessionId++;
      activeWaitCancel?.();
      isIntroducing = false;
      myston.classList.remove("is-bouncing", "is-rippling");
      terminal.textContent = "";
    }
    interactionSession = false;
  };

  const trackEyes = (event: PointerEvent) => {
    if (reducedMotion.matches || !isInRegion) return;

    const bounds = button.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;
    const offsetX = Math.max(-1, Math.min(1, (event.clientX - centerX) / 100)) * 4;
    const offsetY = Math.max(-1, Math.min(1, (event.clientY - centerY) / 100)) * 4;

    for (const eye of eyes) {
      eye.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }
  };

  button.addEventListener("pointerenter", () => {
    isPointerOver = true;
    myston.classList.add("is-active");
    startSession();
  });
  button.addEventListener("pointerleave", () => {
    isPointerOver = false;
    endSession();
  });
  button.addEventListener("focus", () => {
    isFocused = true;
    myston.classList.add("is-active");
    startSession();
  });
  button.addEventListener("blur", () => {
    isFocused = false;
    endSession();
  });
  window.addEventListener("pointermove", (event) => {
    trackEyes(event);
    wake();
  }, { passive: true });
  window.addEventListener("keydown", wake);
  window.addEventListener("scroll", wake, { passive: true });
  window.addEventListener("resize", updateRegion);
  updateRegion();
}
