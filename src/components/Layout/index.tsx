import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { disiAPI, testing } from "@/env/env"
import { Error500 } from "@/pages/Error/500"
import { Box } from "@mantine/core"
import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"

const Layout = () => {
  const [page, setPage] = useState(<Outlet />)

  useEffect(() => {
    const testAPIandPB = async () => {
      try {
        const responseAPI = await fetch(testing ? disiAPI["dev"] : disiAPI["prod"])
        const responsePB = await fetch("https://disi-pb.bennynguyen.dev")
        if (!responseAPI.ok || !responsePB.ok) {
          setPage(<Error500 />)
        }
      } catch (e) {
        setPage(<Error500 />)
      }
    }

    testAPIandPB()
  }, [])

  return (
    <Box
      w="100vw"
      bg="#1c1c1c"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <Header />
      <Box style={{ flexGrow: "1" }} />
      {page}
      <Box style={{ flexGrow: "1" }} />
      <Footer />
    </Box>
  )
}

export default Layout
