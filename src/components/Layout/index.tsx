import { Box } from "@mantine/core";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Error500 } from "../../pages/Error/500";
import { disiAPI, refinerAPI } from "../../utils/const";
import Fallback from "../Fallback";
import Footer from "../Footer";
import Header from "../Header";
import "./index.module.css";

const Layout = () => {
  const [page, setPage] = useState(<Fallback />);

  useEffect(() => {
    const testAPIandPB = async () => {
      try {
        const controller = new AbortController();
        const { signal } = controller;

        const timeoutId = setTimeout(() => {
          controller.abort();
        }, 3000);

        const responseAPI = await fetch(disiAPI, { signal });
        const responsePB = await fetch("https://pocketbase.disi.fyi/api", {
          signal,
        });
        const responseRefiner = await fetch(refinerAPI, {
          signal,
        });

        clearTimeout(timeoutId);

        if (
          ![responseAPI, responsePB, responseRefiner].every(
            (response) => response.ok,
          )
        ) {
          throw new Error("One or more requests failed");
        }

        setPage(<Outlet />);
      } catch (e) {
        setPage(<Error500 />);
      }
    };

    testAPIandPB();
  }, []);

  return (
    <Box
      w="100vw"
      bg="#111111"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <Header />
      <Box style={{ flexGrow: "1" }} />
      {page}
      <Box style={{ flexGrow: "1" }} />
      <Footer />
    </Box>
  );
};

export default Layout;
