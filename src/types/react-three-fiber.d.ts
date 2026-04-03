/* eslint-disable @typescript-eslint/no-empty-object-type -- merge R3F tags into React 19 JSX */
import type { ThreeElements } from "@react-three/fiber";

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements extends ThreeElements {}
    }
  }
}

export {};
