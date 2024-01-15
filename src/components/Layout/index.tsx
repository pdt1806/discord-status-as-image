import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { Box } from "@mantine/core"
import { Outlet } from "react-router-dom"

const Layout = () => {
  return (
    <Box
      w="100vw"
      bg="#292929"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <Header />
      <Box style={{ flexGrow: "1" }} />
      <Outlet />
      <Box style={{ flexGrow: "1" }} />
      <Footer />
    </Box>
  )
}

export default Layout
