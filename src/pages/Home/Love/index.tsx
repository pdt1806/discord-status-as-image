import { UserCardImage } from '@/components/UserCard';
import { Box, Flex, Text, Title } from '@mantine/core';

export default function Love({ isMobile }: { isMobile: boolean | undefined }) {
  return (
    <Flex align="center" direction={isMobile ? 'column' : 'row'}>
      <Box w={isMobile ? '100%' : '45%'}>
        <Title mt="xl" mb="md" order={2}>
          Love My Work?
        </Title>
        <Text>
          If you enjoy my work, check out my other stuff on GitHub or visit my Portfolio website.
          You can support me by "buying me a coffee" or sponsoring me on GitHub. Your support means
          a lot!
        </Text>
      </Box>
      <Box w={isMobile ? '100%' : '50%'} h="auto" mt="xl" ml="auto" mr={isMobile ? 'auto' : '0'}>
        <UserCardImage />
      </Box>
    </Flex>
  );
}