import { onMounted, onUnmounted } from "vue";

const useEventlistener = (target, event, callback) => {
  onMounted(() => target.addEventListener(event, callback));
  onUnmounted(() => target.removeEventListener(event, callback));
};
export default {
  useEventlistener,
};
