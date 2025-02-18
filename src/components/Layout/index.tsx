import { Box } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import classes from '../../App.module.css';
import { debugging, disiAPI, refinerAPI } from '../../env/env';
import { Error500 } from '../../pages/Error/500';
import Fallback from '../Fallback';
import Footer from '../Footer';
import Header from '../Header';
import ModalNoti from '../ModalNoti';

const Layout = () => {
  const [page, setPage] = useState(<Fallback />);
  const navigate = useNavigate();

  const proceedToDemo = () => {
    navigate('/');
    setPage(<Outlet />);
  };

  const modalNoti = ModalNoti();

  useEffect(() => {
    const testAPIandPB = async () => {
      try {
        const controller = new AbortController();
        const { signal } = controller;

        const timeoutId = setTimeout(() => {
          controller.abort();
        }, 3000);

        const responseAPI = await fetch(disiAPI[debugging], { signal });
        const responsePB = await fetch('https://disi-pb.bennynguyen.dev/api', { signal });
        const responseRefiner = await fetch(refinerAPI[debugging], {
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
    modalNoti.checkTimeout(2, 5000);
  }, []);

  return (
    <Box
      className={classes.layout}
      w="100vw"
      bg="#111111"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        color: 'white',
      }}
    >
      {/* {modalNoti.element} */}
      <Header />
      {/* <HeaderNoti /> */}
      <Box style={{ flexGrow: '1' }} />
      {page}
      <Box style={{ flexGrow: '1' }} />
      <Footer />
    </Box>
  );
};

export default Layout;
