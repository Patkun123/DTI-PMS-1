"use client"

import { useEffect } from "react"
import { usePage } from "@inertiajs/react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function FlashMessages() {
  const { props } = usePage()
  const flash = (props as any).flash

  // detect dark mode from <html class="dark"> (Tailwind way)
  const isDark = typeof window !== "undefined" && document.documentElement.classList.contains("dark")

  useEffect(() => {
    if (flash?.success) toast.success(flash.success)
    if (flash?.error) toast.error(flash.error)
    if (flash?.info) toast.info(flash.info)
  }, [flash])

  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={isDark ? "dark" : "light"} // 👈 dynamic
    />
  )
}
