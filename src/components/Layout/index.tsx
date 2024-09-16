import { Box, Loader } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { debugging, disiAPI, refinerAPI } from '../../env/env';
import { Error500 } from '../../pages/Error/500';
import Footer from '../Footer';
import Header from '../Header';
import HeaderNoti from '../HeaderNoti';

const Layout = () => {
  const [page, setPage] = useState(<Loader color="white" type="bars" ml="auto" mr="auto" />);
  const navigate = useNavigate();

  const proceedToDemo = () => {
    navigate('/');
    setPage(<Outlet />);
  };

  useEffect(() => {
    const testAPIandPB = async () => {
      try {
        const controller = new AbortController();
        const { signal } = controller;

        const timeoutId = setTimeout(() => {
          controller.abort();
        }, 3000);

        const responseAPI = await fetch(debugging ? disiAPI.dev : disiAPI.prod, { signal });
        const responsePB = await fetch('https://disi-pb.bennynguyen.dev/api', { signal });
        const responseRefiner = await fetch(debugging ? refinerAPI.dev : refinerAPI.prod, {
          signal,
        });

        clearTimeout(timeoutId);

        if (![responseAPI, responsePB, responseRefiner].every((response) => response.ok)) {
          throw new Error('One or more requests failed');
        }

        setPage(<Outlet />);
      } catch (e) {
        setPage(<Error500 proceedToDemo={proceedToDemo} />);
      }
    };

    testAPIandPB();
  }, []);

  return (
    <Box
      w="100vw"
      bg="#111111"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        color: 'white',
      }}
    >
      <Header />
      <HeaderNoti />
      <Box style={{ flexGrow: '1' }} />
      {page}
      <Box style={{ flexGrow: '1' }} />
      <Footer />
    </Box>
  );
};

export default Layout;
