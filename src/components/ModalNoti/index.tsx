import { Box, Button, Flex, Image, Modal, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link } from 'react-router-dom';

export default function ModalNoti(): {
  element: JSX.Element;
  state: boolean;
  close: () => void;
  open: () => void;
  toggle: () => void;
  checkTimeout: (day: number, delay: number) => void; // to check if the modal has been opened within an interval of time
} {
  const [opened, controls] = useDisclosure(false);

  const closeHandler = () => {
    controls.close();
    localStorage.setItem('modal-noti', new Date().toISOString());
  };

  const checkTimeout = (day: number, delay: number) => {
    setTimeout(() => {
      const modalNotiFlag = localStorage.getItem('modal-noti');
      if (modalNotiFlag) {
        const diff = new Date().getTime() - new Date(modalNotiFlag).getTime();
        if (diff < 1000 * 3600 * 24 * day) {
          return;
        }
      }
      controls.open();
    }, delay);
  };

  return {
    element: (
      <Modal
        styles={{
          header: {
            background: '#1a1a1a',
            color: '#fff',
          },
          body: {
            background: '#1a1a1a',
            color: '#fff',
          },
          close: { background: '#1a1a1a', color: '#fff' },
        }}
        opened={opened}
        onClose={closeHandler}
        centered
        radius="md"
        padding="lg"
        size="auto"
        title="Choir Concert at Antelope, CA!"
      >
        <Flex direction={{ base: 'column', md: 'row' }} align="center">
          <Image
            mx="auto"
            src="images/f24-choir-poster.webp"
            w={{ base: 250, xs: 300, lg: 350 }}
            alt="Choir Concert at Antelope!"
            radius="md"
          />
          <Box
            maw={700}
            mt={{ base: 'lg', md: 0 }}
            ta={{ base: 'center', md: 'left' }}
            ml={{ base: 0, md: 'lg' }}
          >
            <Title order={2} mb="md">
              Hop on the Choir Train and Journey through the Decades!
            </Title>
            <Text>
              Antelope High School Concert and Chamber Choirs present a nostalgic concert featuring
              music from the 1950s to 1980s. Join us on{' '}
              <strong>
                Thursday, October 3rd, and Friday, October 4th, at 7:00 PM in the Antelope High
                School Performing Arts Center.
              </strong>{' '}
              Hope to see you there!
            </Text>
            <Button
              onClick={closeHandler}
              color="indigo"
              size="lg"
              mt="lg"
              component={Link}
              to="https://gofan.co/app/school/CA68179?activity=Performing%20Arts"
              target="_blank"
            >
              Buy your tickets now!
            </Button>
          </Box>
        </Flex>
      </Modal>
    ),
    state: opened,
    checkTimeout,
    ...controls,
  };
}
