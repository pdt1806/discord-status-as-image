import { Box, Table } from "@mantine/core"

const MainContentColumn1 = () => {
  return (
    <Table.Td h="100%">
      <Box h="100%" display="flex" mt="xl">
        <iframe
          src="https://discord.com/widget?id=1174576233581912074&theme=dark"
          style={{
            width: "90%",
            height: "90%",
            border: "none",
            minHeight: "300px",
            maxHeight: "500px",
          }}
        />
      </Box>
    </Table.Td>
  )
}

export default MainContentColumn1
