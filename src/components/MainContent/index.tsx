import { Box, Button, Image, Table, Text, TextInput, UnstyledButton } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';

const MainContent = () => {
  const [userID, setUserID] = useState('');
  const [link, setLink] = useState('');
  const form = useForm({
    initialValues: {
      userID: '',
    },
  });

  return (
    <Table w="95%" h="90%" style={{ fontSize: '30px' }}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th w="33%">Step 1 - Join the Discord Server</Table.Th>
          <Table.Th w="33%">Step 2 - Enter your User ID</Table.Th>
          <Table.Th w="33%">Step 3 - Enjoy!</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>
          <Table.Td h="100%">
            <iframe
              src="https://discord.com/widget?id=1174576233581912074&theme=dark"
              style={{ width: '90%', height: '90%', border: 'none' }}
            />
          </Table.Td>
          <Table.Td display={'flex'} style={{ alignItems: 'start' }}>
            <Box
              component="form"
              onSubmit={form.onSubmit((values) => {
                setUserID('');
                setLink('');
                setUserID(values.userID);
                setLink(`http://disi-api.bennynguyen.us/smallcard/${values.userID}`);
              })}
              w="90%"
            >
              <TextInput
                {...form.getInputProps('userID')}
                withAsterisk
                required
                label="User ID"
                placeholder="Enter your User ID"
              />
              <Button type="submit">Generate</Button>
            </Box>
          </Table.Td>
          <Table.Td>
            {link !== '' ? (
              <Box display={'flex'} style={{ flexDirection: 'column' }}>
                <a href={`https://discord.com/users/${userID}`} target="_blank">
                  <Image src={link} mb="md" />
                </a>
                <UnstyledButton
                  mb="md"
                  onClick={async () => await navigator.clipboard.writeText(link)}
                >
                  🔗 Copy Image URL
                </UnstyledButton>
                <UnstyledButton
                  onClick={async () =>
                    await navigator.clipboard.writeText(
                      `<a href="https://discord.com/users/${userID}" target="_blank"><img src=${link}></img></a>`
                    )
                  }
                >
                  🔗 Copy Anchor
                </UnstyledButton>
              </Box>
            ) : (
              <Text>Complete the previous steps correctly and your cards will show here!</Text>
            )}
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
};

export default MainContent;
