import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { disiAPI, refinerAPI, testing } from '@/env/env';
import { Error500 } from '@/pages/Error/500';
import { Box } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const Layout = () => {
  const [page, setPage] = useState(<Outlet />);
  const navigate = useNavigate();

  const proceedToDemo = () => {
    navigate('/');
    setPage(<Outlet />);
  };

  useEffect(() => {
    const testAPIandPB = async () => {
      try {
        const controller = new AbortController();
        const signal = controller.signal;

        const timeoutId = setTimeout(() => {
          controller.abort();
        }, 1000);

        const responseAPI = await fetch(testing ? disiAPI['dev'] : disiAPI['prod'], { signal });
        const responsePB = await fetch('https://disi-pb.bennynguyen.dev/_/', { signal });
        const responseRefiner = await fetch(testing ? refinerAPI['dev'] : refinerAPI['prod'], {
          signal,
        });

        clearTimeout(timeoutId);

        if (![responseAPI, responsePB, responseRefiner].every((response) => response.ok)) {
          throw new Error('One or more requests failed');
        }
      } catch (e) {
        setPage(<Error500 proceedToDemo={proceedToDemo} />);
      }
    };

    testAPIandPB();
  }, []);

  return (
    <Box
      w="100vw"
      bg="#1c1c1c"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        color: 'white',
      }}
    >
      <Header />
      <Box style={{ flexGrow: '1' }} />
      {page}
      <Box style={{ flexGrow: '1' }} />
      <Footer />
    </Box>
  );
};

export default Layout;
