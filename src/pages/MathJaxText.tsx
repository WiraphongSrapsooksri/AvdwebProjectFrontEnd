import React, { useEffect } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    MathJax?: any;
  }
}

interface MathJaxProps {
  text: string;
  fontSize?: string;
}

const MathJaxText: React.FC<MathJaxProps> = ({ text, fontSize }) => {
  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typesetPromise?.();
    }
  }, [text]);

  return (
    <div>
      <span
        style={{ fontFamily: "Kanit", fontSize: fontSize }}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </div>
  );
};

export default MathJaxText;
