import useEventlistener from "./useEventlistener";
import { ref } from "vue";

export function useResponsive() {
  let isMobile = ref(window.innerWidth < 768);
  let isDesktop = ref(window.innerWidth >= 768);
  let displayHeight = ref(window.innerHeight);
  let displayWidth = ref(window.displayWidth);

  useEventlistener(window, "resize", (event) => {
    isMobile = event.target.innerWidth < 768;
    isDesktop = !isMobile;
  });
  return { isMobile, isDesktop, displayHeight, displayWidth };
}
