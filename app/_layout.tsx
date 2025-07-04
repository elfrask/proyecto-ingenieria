"use client";


import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { useTheme } from "next-themes";
 
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {

    const themes = useTheme();

    if (themes.theme !== "dark") {
        themes.setTheme("dark")
    }


  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}