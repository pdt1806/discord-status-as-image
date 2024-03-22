import { Anchor, Group, Text, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import classes from './index.module.css';

const links = [
  { link: '/terms-of-service', label: 'Terms of Service' },
  { link: '/privacy-policy', label: 'Privacy Policy' },
];

export default function Footer() {
  const isMobile = useMediaQuery('(max-width: 48em)');

  const items = links.map((link) => (
    <Anchor c="dimmed" key={link.label} href={link.link} lh={1} size="sm">
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <div className={classes.inner}>
        <Anchor
          href="https://bennynguyen.dev"
          target="_blank"
          style={{ textDecoration: 'none', color: 'white' }}
        >
          <Group>
            <img
              src="https://bennynguyen.dev/icons/webIcon.svg"
              alt="Logo"
              width={35}
              height={35}
              style={{ pointerEvents: 'none', filter: 'grayscale(100%) brightness(0) invert(1)' }}
            />
            <Title order={4}>Benny Nguyen</Title>
          </Group>
        </Anchor>
        <Group mt={isMobile ? 'lg' : '0'} className={classes.links}>
          {items}
        </Group>
        <Text mt={isMobile ? 'md' : '0'} mb={isMobile ? 'sm' : '0'} ta="center">
          Made with ❤️ from Antelope, CA
        </Text>
      </div>
    </div>
  );
}
