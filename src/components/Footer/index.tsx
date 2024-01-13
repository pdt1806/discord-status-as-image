import { Box, Space, Text } from '@mantine/core';
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
      pt="lg"
      pb="lg"
      h="min-content"
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
      <Space h="md" />
      <Box display={'flex'}>
        <Link to="/privacy-policy" style={{ textDecoration: 'none', color: 'white' }}>
          Privacy Policy
        </Link>
        <Text> • </Text>
        <Link to="/terms-of-service" style={{ textDecoration: 'none', color: 'white' }}>
          Terms of Service
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;
