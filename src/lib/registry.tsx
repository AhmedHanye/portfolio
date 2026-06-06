"use client";
 
import React, { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";
 
export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only create stylesheet once with lazy initial state
  const [jsxStyleSheet] = useState(() => new ServerStyleSheet());
 
  useServerInsertedHTML(() => {
    const styles = jsxStyleSheet.getStyleElement();
    jsxStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  const shouldForwardProp = (propName: string, elementToBeRendered: unknown) => {
    if (typeof elementToBeRendered === "string") {
      return isPropValid(propName);
    }
    return true;
  };
 
  if (typeof window !== "undefined") {
    return (
      <StyleSheetManager shouldForwardProp={shouldForwardProp}>
        {children}
      </StyleSheetManager>
    );
  }
 
  return (
    <StyleSheetManager sheet={jsxStyleSheet.instance} shouldForwardProp={shouldForwardProp}>
      {children}
    </StyleSheetManager>
  );
}
