import { useCallback } from "react";
import { playPop, playSuccess, playFail } from "../components/effects/sound";

export function useSoundEffects() {
  const pop = useCallback(() => playPop(), []);
  const success = useCallback(() => playSuccess(), []);
  const fail = useCallback(() => playFail(), []);

  return { pop, success, fail };
}