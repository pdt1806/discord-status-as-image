import { smallestHeader } from '@/utils/tools';
import { Box, Image, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <Box
      style={{
        backgroundColor: '#232525',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      w="100%"
      h={100}
    >
      <Box style={{ backgroundColor: '#232525', display: 'flex', alignItems: 'center' }}>
        <Image src="/images/disi-logo.png" alt="Discord Status as Image" h={100} w={100} />
        <Title c="white" ml="md" style={{ fontSize: smallestHeader ? '25px' : '35px' }}>
          Discord Status as Image
        </Title>
      </Box>
      <Text mr="xl" style={{ fontSize: '20px' }} c="white" visibleFrom="smallHeader">
        Created by{' '}
        <Link
          to="https://github.com/pdt1806"
          target="_blank"
          style={{ textDecoration: 'none', color: 'white' }}
        >
          <strong>pdt1806</strong>
        </Link>
      </Text>
    </Box>
  );
};

export default Header;
