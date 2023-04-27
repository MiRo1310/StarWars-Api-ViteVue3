import eventJS from "./useEventlistener";
import { ref } from "vue";

export function useResponsive() {
  let isMobile = ref(window.innerWidth < 768);
  let isDesktop = ref(window.innerWidth >= 768);
  let displayHeight = ref(window.innerHeight);
  let displayWidth = ref(window.displayWidth);

  eventJS.useEventlistener(window, "resize", (event) => {
    event.target.innerWidth < 768
      ? (isMobile.value = true)
      : (isMobile.value = false);
    event.target.innerWidth >= 768
      ? (isDesktop.value = true)
      : (isDesktop.value = false);
  });
  return { isMobile, isDesktop, displayHeight, displayWidth };
}
