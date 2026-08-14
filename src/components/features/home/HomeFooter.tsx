"use client";

import React from "react";
import { AppBar, Toolbar } from "react95";
import { useTranslations } from "next-intl";

export default function HomeFooter() {
  const t = useTranslations("HomePage.footer");

  return (
    <footer className="w-full mt-12">
      <AppBar
        style={{
          position: "static",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          width: "100%",
        }}
      >
        <Toolbar
          style={{
            justifyContent: "center",
            padding: "6px 12px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div className="text-xs text-neutral-900 text-center font-mono py-1 select-none">
            {t("copyright")}
          </div>
        </Toolbar>
      </AppBar>
    </footer>
  );
}

