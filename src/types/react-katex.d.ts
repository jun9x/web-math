declare module "react-katex" {
  import * as React from "react";

  export interface MathComponentProps {
    math: string;
    block?: boolean;
    errorColor?: string;
    renderError?: (error: Error | TypeError) => React.ReactNode;
  }

  export const InlineMath: React.ComponentType<MathComponentProps>;
  export const BlockMath: React.ComponentType<MathComponentProps>;

  export default InlineMath;
}
