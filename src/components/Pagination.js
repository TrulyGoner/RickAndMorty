import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useData } from './providers';

export function Pagination() {
  const [pages, setPages] = useState([]);
  const { apiURL, info, activePage, setActivePage, setApiURL } = useData();

  function pageClickHandler(index) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActivePage(index);
    setApiURL(pages[index]);
  }

  function goFirst() {
    pageClickHandler(0);
  }

  function goPrev() {
    pageClickHandler(activePage - 1);
  }

  function goNext() {
    pageClickHandler(activePage + 1);
  }

  function goLast() {
    pageClickHandler(pages.length - 1);
  }

  useEffect(() => {
    const createdPages = Array.from({ length: info.pages }, (_, i) => {
      const URLWithPage = new URL(apiURL);

      URLWithPage.searchParams.set('page', i + 1);

      return URLWithPage.toString();
    });

    setPages(createdPages);
  }, [info, apiURL]);

  if (pages.length <= 1) return null;

  return (
    <StyledPagination>
      {pages[activePage - 1] && (
        <>
          {activePage - 1 !== 0 && (
            <>
              <Page onClick={goFirst}>« First</Page>
              <Ellipsis>...</Ellipsis>
            </>
          )}

          <Page onClick={goPrev}>{activePage}</Page>
        </>
      )}

      <Page active>{activePage + 1}</Page>

      {pages[activePage + 1] && (
        <>
          <Page onClick={goNext}>{activePage + 2}</Page>

          {activePage + 1 !== pages.length - 1 && (
            <>
              <Ellipsis>...</Ellipsis>
              <Page onClick={goLast}>Last »</Page>
            </>
          )}
        </>
      )}
    </StyledPagination>
  );
}

const StyledPagination = styled.div`
  width: 100%;
  text-align: center;
`;

const Page = styled.span`
  color: #fff;
  font-size: 18px;
  padding: 5px;
  cursor: pointer;
  transition: color 0.2s;
  ${({ active }) => active && 'color: #83bf46'};

  &:hover {
    color: #83bf46;
  }
`;


const Ellipsis = styled(Page)`
  cursor: default;

  &:hover {
    color: #fff;
  }
`;
