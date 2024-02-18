import { Anchor, Box, Image, Text, Title } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { Link } from "react-router-dom"

const Header = () => {
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
      h={100}
    >
      <Anchor
        href="/"
        style={{
          backgroundColor: "#121212",
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
          color: "white",
        }}
        ml="sm"
      >
        <Image
          src="/images/disi-logo.png"
          alt="Discord Status as Image"
          h={75}
          w={75}
          style={{ borderRadius: "15%" }}
        />
        <Title c="white" ml="md" style={{ fontSize: smallestHeader ? "20px" : "25px" }}>
          Discord Status as Image
        </Title>
      </Anchor>
      <Text mr="lg" style={{ fontSize: "18px" }} c="white" visibleFrom="smallHeader">
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
