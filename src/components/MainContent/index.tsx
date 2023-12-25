import { isMobile } from '@/utils/tools';
import {
  Box,
  Button,
  Checkbox,
  ColorPicker,
  HoverCard,
  Image,
  NativeSelect,
  NumberInput,
  Table,
  Text,
  TextInput,
  Title,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const MainContent = () => {
  const [link, setLink] = useState('');
  const [tail, setTail] = useState('');
  const [userID, setUserID] = useState('');
  const form = useForm({
    initialValues: {
      username: null as String | null,
      colorMode: 'Single',
      backgroundSingle: '',
      backgroundGradient1: '',
      backgroundGradient2: '',
      backgroundGradientAngle: 0,
      created: false,
    },
  });

  const [colorMode, setColorMode] = useState('Single');

  function copiedNotification() {
    notifications.show({
      title: 'Copied!',
      message: 'Copied to clipboard',
      color: 'teal',
      icon: null,
      autoClose: 2000,
    });
  }

  const column1 = (
    <Table.Td h="100%">
      <iframe
        src="https://discord.com/widget?id=1174576233581912074&theme=dark"
        style={{ width: '90%', height: '90%', border: 'none', minHeight: '300px' }}
      />
    </Table.Td>
  );

  const column2 = (
    <Table.Td display={'flex'} style={{ alignItems: 'start', flexDirection: 'column' }}>
      <Box
        component="form"
        onSubmit={form.onSubmit(() => {
          fetch(`http://localhost:7000/username/${form.values.username}`).then(async (res) => {
            if (res.status === 404) {
              notifications.show({
                title: 'Error!',
                message: 'User not found',
                color: 'red',
                icon: null,
                autoClose: 3000,
              });
              return;
            }
            const data = await res.json();
            setUserID(data.id);
            let newTail =
              colorMode == 'Gradient'
                ? `&bg1=${form.values.backgroundGradient1.replace(
                    '#',
                    ''
                  )}&bg2=${form.values.backgroundGradient2.replace('#', '')}&angle=${
                    form.values.backgroundGradientAngle
                  }`
                : form.values.backgroundSingle
                  ? `&bg=${form.values.backgroundSingle.replace('#', '')}`
                  : '';
            if (form.values.created) newTail += '&created=true';
            setTail(newTail);
            setLink(
              `https://disi-api.bennynguyen.us/smallcard/${data.id}?${newTail}` // disi-api
            );
          });
        })}
        w="90%"
      >
        <TextInput
          {...form.getInputProps('username')}
          withAsterisk
          required
          id="disi-username"
          label="Username"
          minLength={2}
          maxLength={32}
          placeholder="Enter your username"
          onChange={(e) => {
            form.setValues({
              ...form.values,
              username: e.currentTarget.value,
            });
          }}
        />
        <Checkbox
          label="Show account created date"
          mt="md"
          {...form.getInputProps('created')}
          onChange={(e) => {
            form.setValues({
              ...form.values,
              created: e.currentTarget.checked,
            });
          }}
        />
        <Box mt="xl">
          <Title order={4}>Background color</Title>
          <NativeSelect
            {...form.getInputProps('colorMode')}
            label="Color mode"
            data={['Single', 'Gradient']}
            onChange={(e) => {
              setColorMode(e.currentTarget.value);
              form.setValues({
                ...form.values,
                backgroundGradient1: '',
                backgroundGradient2: '',
                backgroundGradientAngle: 0,
                backgroundSingle: '',
              });
              form.setFieldValue('colorMode', e.currentTarget.value);
            }}
          />
          {colorMode === 'Single' ? (
            <HoverCard shadow="md" openDelay={250}>
              <HoverCard.Target>
                <TextInput
                  placeholder="#2B2D31"
                  description="Leave blank for default Discord color"
                  label="Color"
                  {...form.getInputProps('backgroundSingle')}
                  maxLength={7}
                  minLength={7}
                  onChange={(e) => {
                    if (
                      /^([A-Fa-f0-9]{1,6})?$/.test(e.currentTarget.value) &&
                      !form.values.backgroundSingle
                    )
                      e.currentTarget.value = `#${e.currentTarget.value.toUpperCase()}`;
                    if (
                      /^#([A-Fa-f0-9]{1,6})?$/.test(e.currentTarget.value) ||
                      e.currentTarget.value === ''
                    ) {
                      const finalValue = e.currentTarget.value.toUpperCase();
                      form.setValues({
                        ...form.values,
                        backgroundSingle: finalValue,
                      });
                    }
                  }}
                />
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <ColorPicker
                  value={form.values.backgroundSingle}
                  onChange={(e) => {
                    form.setValues({
                      ...form.values,
                      backgroundSingle: e.toUpperCase(),
                    });
                  }}
                />
              </HoverCard.Dropdown>
            </HoverCard>
          ) : (
            <Box display={'flex'} style={{ justifyContent: 'space-between' }} w="100%">
              <HoverCard shadow="md" openDelay={250}>
                <HoverCard.Target>
                  <TextInput
                    placeholder="#1E1E1E"
                    label="Gradient 1"
                    {...form.getInputProps('backgroundGradient1')}
                    maxLength={7}
                    minLength={7}
                    required
                    onChange={(e) => {
                      if (
                        /^([A-Fa-f0-9]{1,6})?$/.test(e.currentTarget.value) &&
                        !form.values.backgroundGradient1
                      )
                        e.currentTarget.value = `#${e.currentTarget.value.toUpperCase()}`;
                      if (
                        /^#([A-Fa-f0-9]{1,6})?$/.test(e.currentTarget.value) ||
                        e.currentTarget.value === ''
                      ) {
                        const finalValue = e.currentTarget.value.toUpperCase();
                        form.setValues({
                          ...form.values,
                          backgroundGradient1: finalValue,
                        });
                      }
                    }}
                  />
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <ColorPicker
                    value={form.values.backgroundGradient1}
                    onChange={(e) => {
                      form.setValues({
                        ...form.values,
                        backgroundGradient1: e.toUpperCase(),
                      });
                    }}
                  />
                </HoverCard.Dropdown>
              </HoverCard>
              <HoverCard shadow="md" openDelay={250}>
                <HoverCard.Target>
                  <TextInput
                    placeholder="#FFFFFF"
                    pl={10}
                    pr={10}
                    label="Gradient 2"
                    {...form.getInputProps('backgroundGradient2')}
                    maxLength={7}
                    minLength={7}
                    required
                    onChange={(e) => {
                      if (
                        /^([A-Fa-f0-9]{1,6})?$/.test(e.currentTarget.value) &&
                        !form.values.backgroundGradient2
                      )
                        e.currentTarget.value = `#${e.currentTarget.value.toUpperCase()}`;
                      if (
                        /^#([A-Fa-f0-9]{1,6})?$/.test(e.currentTarget.value) ||
                        e.currentTarget.value === ''
                      )
                        form.setValues({
                          ...form.values,
                          backgroundGradient2: e.currentTarget.value.toUpperCase(),
                        });
                    }}
                  />
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <ColorPicker
                    value={form.values.backgroundGradient2}
                    onChange={(e) => {
                      form.setValues({
                        ...form.values,
                        backgroundGradient2: e.toUpperCase(),
                      });
                    }}
                  />
                </HoverCard.Dropdown>
              </HoverCard>
              <NumberInput
                placeholder="0"
                label="Angle"
                {...form.getInputProps('backgroundGradientAngle')}
                allowDecimal={false}
                clampBehavior="strict"
                max={360}
                min={0}
                required
                onChange={(e) => {
                  form.setValues({
                    ...form.values,
                    backgroundGradientAngle: e as number,
                  });
                }}
              />
            </Box>
          )}
        </Box>
        <Button type="submit" mt="xl">
          Generate
        </Button>
      </Box>
    </Table.Td>
  );

  const column3 = (
    <Table.Td>
      {link !== '' ? (
        <Box display={'flex'} style={{ flexDirection: 'column' }}>
          <a href={`https://discord.com/users/${userID}`} target="_blank">
            <Image src={link} mb="md" />
          </a>
          <UnstyledButton
            w="fit-content"
            mb="md"
            onClick={async () => {
              await navigator.clipboard.writeText(link);
              copiedNotification();
            }}
          >
            🔗 Copy Image URL
          </UnstyledButton>
          <UnstyledButton
            w="fit-content"
            mb="md"
            onClick={async () => {
              await navigator.clipboard.writeText(
                `<a href="https://discord.com/users/${userID}" target="_blank"><img width="300px" height="100px" src="${link}"></img></a>`
              );
              copiedNotification();
            }}
          >
            🔗 Copy Anchor (image)
          </UnstyledButton>
          <Tooltip label="Reload every 30 seconds" position="right">
            <UnstyledButton mb="md" w="fit-content">
              <Link
                to={`/smallcard?id=${userID}${tail}`}
                target="_blank"
                style={{ textDecoration: 'none', color: 'white' }}
              >
                <UnstyledButton>🌐 View live card</UnstyledButton>
              </Link>
            </UnstyledButton>
          </Tooltip>
          <UnstyledButton
            w="fit-content"
            onClick={async () => {
              await navigator.clipboard.writeText(
                `<iframe src="https://disi.bennynguyen.us/smallcard?id=${userID}${tail}" name="disi-small-card" height="100px" width="300px"></iframe>`
              );
              copiedNotification();
            }}
          >
            🔗 Copy iframe (live card)
          </UnstyledButton>
          <Text mt="md" size="sm">
            It may take a while for the image to be loaded.
          </Text>
        </Box>
      ) : (
        <Text>Complete the previous steps correctly and your cards will show here!</Text>
      )}
    </Table.Td>
  );

  const pcTable = (
    <Table w="95%" h="90%" style={{ fontSize: '30px' }}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th w="33%">Step 1 - Join the Discord Server</Table.Th>
          <Table.Th w="33%">Step 2 - Enter your username</Table.Th>
          <Table.Th w="33%">Step 3 - Enjoy!</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>
          {column1}
          {column2}
          {column3}
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );

  const mobileTable = (
    <Table w="95%" h="90%" style={{ fontSize: '30px' }}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th w="100%">Step 1 - Join the Discord Server</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>{column1}</Table.Tr>
      </Table.Tbody>
      <Table.Thead>
        <Table.Tr>
          <Table.Th w="100%">Step 2 - Enter your username</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>{column2}</Table.Tr>
      </Table.Tbody>
      <Table.Thead>
        <Table.Tr>
          <Table.Th w="100%">Step 3 - Enjoy!</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>{column3}</Table.Tr>
      </Table.Tbody>
    </Table>
  );

  return isMobile ? mobileTable : pcTable;
};

export default MainContent;
