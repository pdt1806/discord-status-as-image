import { Box, Image, Text, Title } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { Link, useNavigate } from "react-router-dom"

const Header = () => {
  const navigate = useNavigate()
  const isHome = window.location.pathname === "/"
  const smallestHeader = useMediaQuery("(max-width: 400px)")

  return (
    <Box
      style={{
        backgroundColor: "#121212",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      w="100%"
      h={80}
    >
      <Box style={{ backgroundColor: "#121212", display: "flex", alignItems: "center" }}>
        <Image
          src="/images/disi-logo.png"
          alt="Discord Status as Image"
          h={80}
          w={80}
          style={{ cursor: !isHome ? "pointer" : "" }}
          onClick={() => {
            !isHome && navigate("/")
          }}
        />
        <Title
          c="white"
          ml="md"
          style={{ fontSize: smallestHeader ? "20px" : "25px", cursor: !isHome ? "pointer" : "" }}
          onClick={() => {
            !isHome && navigate("/")
          }}
        >
          Discord Status as Image
        </Title>
      </Box>
      <Text mr="xl" style={{ fontSize: "18px" }} c="white" visibleFrom="smallHeader">
        Created by{" "}
        <Link
          to="https://github.com/pdt1806"
          target="_blank"
          style={{ textDecoration: "none", color: "white" }}
        >
          <strong>pdt1806</strong>
        </Link>
      </Text>
    </Box>
  )
}

export default Header
