import styled from 'styled-components';
import { Logo } from './Logo';
import { Filters } from '../Filters';

export function Header() {
  return (
    <HeaderContainer>
      <Logo />

      <FiltersWrapper>
        <Filters />
      </FiltersWrapper>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
`;

const FiltersWrapper = styled.div`
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
`;
