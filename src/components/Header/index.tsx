import { Box, Image, Text, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Link } from 'react-router-dom';

const Header = () => {
  const smallestHeader = useMediaQuery('(max-width: 400px)');

  return (
    <Box
      style={{
        borderBottom: '1px solid #333',
        backgroundColor: '#1a1a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      w="100%"
      h={100}
    >
      <Link
        to="/"
        style={{
          backgroundColor: '#1a1a1a',
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          color: 'white',
          marginLeft: 'var(--mantine-spacing-sm)',
        }}
      >
        <Image
          src="/images/disi-logo.png"
          alt="Discord Status as Image"
          h={75}
          w={75}
          style={{ borderRadius: '15%' }}
        />
        <Title c="white" ml="md" style={{ fontSize: smallestHeader ? '20px' : '25px' }}>
          Discord Status as Image
        </Title>
      </Link>
      <Text mr="lg" style={{ fontSize: '18px' }} c="white" visibleFrom="smallHeader">
        Created by{' '}
        <Link to="https://github.com/pdt1806" style={{ textDecoration: 'none', color: 'white' }}>
          <strong>pdt1806</strong>
        </Link>
      </Text>
    </Box>
  );
};

export default Header;
