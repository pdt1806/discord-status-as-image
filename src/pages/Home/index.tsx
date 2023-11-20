import MainContent from "@/components/MainContent";
import { Box, Center, Title } from "@mantine/core";

const Home = () => {
  return (
    <Box
      w="100vw"
      h="100vh"
      display={"flex"}
      style={{
        flexDirection: "column",
        alignItems: "center",
        background: "url('/images/background.png')",
        backgroundSize: "cover",
        color: "white",
      }}
    >
      <Title mt="10vh" size={60}>
        Discord Status as Image
      </Title>
      <Box
        mt="xl"
        h="70%"
        w="80%"
        mih={450}
        miw={1000}
        style={{ backgroundColor: "#00000050", borderRadius: "25px" }}
      >
        <Center w="100%" h="100%">
          <MainContent />
        </Center>
      </Box>
    </Box>
  );
};

export default Home;
