import { Box, Text } from '@mantine/core';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <Box
      style={{
        backgroundColor: '#232525',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        color: 'white',
      }}
      w="100%"
      h={100}
    >
      <Text>Made with ❤️</Text>
      <Text mt="xs">
        Copyright © {new Date().getFullYear()}{' '}
        <Link
          to="https://bennynguyen.dev"
          target="_blank"
          style={{ textDecoration: 'none', color: 'white' }}
        >
          <strong>Benny Nguyen</strong>
        </Link>
      </Text>
    </Box>
  );
};

export default Footer;
