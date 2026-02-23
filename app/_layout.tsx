"use client";


import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
 
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {

  const pathName = usePathname()
  const themes = useTheme();

  if (!pathName.startsWith("/reportes")) {
    if (themes.theme !== "dark") {
      themes.setTheme("dark")
    }
    
  } else {
      themes.setTheme("light")

  }



  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}