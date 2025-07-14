import { Space, Table } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import MainContentColumn1 from './Column1';
import MainContentColumn2 from './Column2';
import MainContentColumn3 from './Column3';

const MainContent = () => {
  const isMobile = useMediaQuery('(max-width: 1080px)');

  const pcTable = (
    <Table w="95%" h="90%" style={{ fontSize: '30px' }}>
      <Table.Thead>
        <Table.Tr style={{ border: 'none' }}>
          <Table.Th w="33%">Step 1 - Join the Discord Server</Table.Th>
          <Table.Th w="33%">Step 2 - Enter your username</Table.Th>
          <Table.Th w="33%">Step 3 - Enjoy!</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>
          <MainContentColumn1 />
          <MainContentColumn2 />
          <MainContentColumn3 />
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );

  const mobileTable = (
    <Table w="95%" h="90%" style={{ fontSize: '30px' }}>
      <Table.Thead>
        <Table.Tr style={{ border: 'none' }}>
          <Table.Th w="100%">Step 1 - Join the Discord Server</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>
          <MainContentColumn1 />
        </Table.Tr>
      </Table.Tbody>
      <Space h="xl" />
      <Table.Thead>
        <Table.Tr style={{ border: 'none' }}>
          <Table.Th w="100%">Step 2 - Enter your username</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>
          <MainContentColumn2 />
        </Table.Tr>
      </Table.Tbody>
      <Space h="xl" />
      <Table.Thead>
        <Table.Tr style={{ border: 'none' }}>
          <Table.Th w="100%">Step 3 - Enjoy!</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>
          <MainContentColumn3 />
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );

  return isMobile ? mobileTable : pcTable;
};

export default MainContent;
