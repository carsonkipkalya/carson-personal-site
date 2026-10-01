interface BindExpandableDialogOptions {
  cardSelector: string;
  openSelector: string;
  dialogSelector: string;
  closeSelector: string;
  contentSelector: string;
}

let activeDialog: HTMLDialogElement | null = null;
let previousOverflow = "";

export function bindExpandableDialogs({
  cardSelector,
  openSelector,
  dialogSelector,
  closeSelector,
  contentSelector,
}: BindExpandableDialogOptions) {
  const cards = document.querySelectorAll<HTMLElement>(cardSelector);

  for (const card of cards) {
    const openButton = card.querySelector<HTMLButtonElement>(openSelector);
    const dialog = card.querySelector<HTMLDialogElement>(dialogSelector);
    const closeButton = card.querySelector<HTMLButtonElement>(closeSelector);

    if (!openButton || !dialog || !closeButton) continue;

    let transition: Animation | undefined;
    let isClosing = false;

    const closeDialog = () => {
      if (!dialog.open || isClosing) return;

      isClosing = true;
      dialog.classList.add("is-closing");

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !transition) {
        dialog.close();
        return;
      }

      transition.onfinish = () => dialog.close();
      transition.reverse();
    };

    openButton.addEventListener("click", () => {
      if (activeDialog || dialog.open) return;

      const cardRect = card.getBoundingClientRect();
      previousOverflow = document.documentElement.style.overflow;
      dialog.showModal();
      dialog.querySelector<HTMLElement>(contentSelector)?.scrollTo({
        top: 0,
        behavior: "instant",
      });

      activeDialog = dialog;
      document.documentElement.style.overflow = "hidden";
      openButton.setAttribute("aria-expanded", "true");
      closeButton.focus({ preventScroll: true });

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const dialogRect = dialog.getBoundingClientRect();
      const offsetX = cardRect.left + cardRect.width / 2 - (dialogRect.left + dialogRect.width / 2);
      const offsetY = cardRect.top + cardRect.height / 2 - (dialogRect.top + dialogRect.height / 2);
      const scaleX = cardRect.width / dialogRect.width;
      const scaleY = cardRect.height / dialogRect.height;

      transition = dialog.animate(
        [
          { transform: `translate(${offsetX}px, ${offsetY}px) scale(${scaleX}, ${scaleY})` },
          { transform: "translate(0, 0) scale(1, 1)" },
        ],
        {
          duration: 280,
          easing: "cubic-bezier(0.2, 0.75, 0.25, 1)",
          fill: "both",
        },
      );
    });

    closeButton.addEventListener("click", closeDialog);

    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeDialog();
    });

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeDialog();
    });

    dialog.addEventListener("close", () => {
      transition?.cancel();
      transition = undefined;
      dialog.classList.remove("is-closing");
      openButton.setAttribute("aria-expanded", "false");
      document.documentElement.style.overflow = previousOverflow;
      activeDialog = null;
      openButton.focus({ preventScroll: true });
      isClosing = false;
    });
  }
}
