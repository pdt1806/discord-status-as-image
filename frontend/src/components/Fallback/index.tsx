import { Center, Loader } from '@mantine/core';

export default function Fallback() {
  return (
    <Center>
      <Loader color="white" type="bars" ml="auto" mr="auto" />
    </Center>
  );
}
