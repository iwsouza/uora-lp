import type { MotionValue } from "framer-motion";
import type { MutableRefObject } from "react";

export type AppShowcaseWorldProps = {
  scrollRef: MutableRefObject<number>;
  chatOpacity: MotionValue<number>;
  dashOpacity: MotionValue<number>;
  chatProgress: MotionValue<number>;
  dashProgress: MotionValue<number>;
};
