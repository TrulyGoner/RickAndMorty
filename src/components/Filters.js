import { useState, useCallback } from 'react';
import styled from 'styled-components';
import { useData } from './providers';

export function Filters() {
  const { apiURL, setApiURL, setActivePage } = useData();

  const url = (() => {
    try {
      return new URL(apiURL);
    } catch (e) {
      return new URL('https://rickandmortyapi.com/api/character/');
    }
  })();

  const [name, setName] = useState(url.searchParams.get('name') || '');
  const [status, setStatus] = useState(url.searchParams.get('status') || '');
  const [gender, setGender] = useState(url.searchParams.get('gender') || '');
  const [species, setSpecies] = useState(url.searchParams.get('species') || '');
  const [type, setType] = useState(url.searchParams.get('type') || '');

  const onNameChange = useCallback((e) => setName(e.target.value), []);
  const onStatusChange = useCallback((e) => setStatus(e.target.value), []);
  const onGenderChange = useCallback((e) => setGender(e.target.value), []);
  const onSpeciesChange = useCallback((e) => setSpecies(e.target.value), []);
  const onTypeChange = useCallback((e) => setType(e.target.value), []);

  const applyFilters = useCallback(
    (e) => {
      e?.preventDefault();

      const next = new URL(url.toString());

      // clear existing filter params
      next.searchParams.delete('name');
      next.searchParams.delete('status');
      next.searchParams.delete('gender');
      next.searchParams.delete('species');
      next.searchParams.delete('type');
      next.searchParams.delete('page');

      if (name.trim()) next.searchParams.set('name', name.trim());
      if (status) next.searchParams.set('status', status);
      if (gender) next.searchParams.set('gender', gender);
      if (species.trim()) next.searchParams.set('species', species.trim());
      if (type.trim()) next.searchParams.set('type', type.trim());

      setActivePage(0);
      setApiURL(next.toString());
    },
    [name, status, gender, species, type, setActivePage, setApiURL, url]
  );

  const clearFilters = useCallback(() => {
    const next = new URL(url.toString());

    next.search = '';

    setName('');
    setStatus('');
    setGender('');
    setSpecies('');
    setType('');

    setActivePage(0);
    setApiURL(next.toString());
  }, [setActivePage, setApiURL, url]);

  return (
    <Form onSubmit={applyFilters}>
      <TopRow>
        <Field>
          <Select value={status} onChange={onStatusChange}>
            <option value="" disabled>
              Status
            </option>
            <option value="alive">Alive</option>
            <option value="dead">Dead</option>
            <option value="unknown">Unknown</option>
          </Select>
        </Field>

        <Field>
          <Select value={gender} onChange={onGenderChange}>
            <option value="" disabled>
              Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="genderless">Genderless</option>
            <option value="unknown">Unknown</option>
          </Select>
        </Field>

        <Field>
          <Input placeholder="Species" value={species} onChange={onSpeciesChange} />
        </Field>
      </TopRow>

      <BottomRow>
        <Field>
          <Input placeholder="Name" value={name} onChange={onNameChange} />
        </Field>

        <Field>
          <Input placeholder="Type" value={type} onChange={onTypeChange} />
        </Field>

        <Actions>
          <Button type="submit">Apply</Button>
          <ClearButton type="button" onClick={clearFilters}>
            Clear
          </ClearButton>
        </Actions>
      </BottomRow>
    </Form>
  );
}

const Form = styled.form`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  flex-direction: column;
  width: 100%;
`;

const Field = styled.div`
  display: inline-flex;
  align-items: center;
  background: rgba(255,255,255,0.02);
  padding: 6px 8px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.04);
  min-width: 140px;

  @media (max-width: 600px) {
    min-width: auto;
    width: 100%;
    justify-content: stretch;
  }
`;

const Input = styled.input`
  padding: 6px 8px;
  border-radius: 6px;
  border: none;
  background: transparent;
  min-width: 120px;
  color: #fff;
  outline: none;
  font-size: 14px;

  &::placeholder {
    color: rgba(255,255,255,0.6);
  }

  &:focus {
    outline: none;
  }
`;

const Select = styled.select`
  padding: 6px 8px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: #fff;
  min-width: 120px;
  outline: none;
  font-size: 14px;

  option[disabled] {
    color: rgba(255,255,255,0.6);
  }

  option {
    color: #0b1220;
    background: #fff;
  }

  /* hide default arrow on some browsers to keep compact look */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
`;

const TopRow = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  align-items: center;
  justify-content: flex-end;

  ${Field} {
    min-width: 120px;
  }
`;

const BottomRow = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  align-items: center;
  justify-content: flex-end;

  ${Field} {
    min-width: 140px;
  }

  ${Field}:nth-child(1) {
    min-width: 220px;
  }

  ${Field}:nth-child(2) {
    min-width: 140px;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-left: 12px;
`;

const Button = styled.button`
  padding: 10px 14px;
  background: transparent;
  color: #83bf46;
  border: 1px solid #83bf46;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  box-shadow: none;

  &:hover {
    background: rgba(131,191,70,0.08);
  }
`;

const ClearButton = styled.button`
  padding: 10px 14px;
  background: transparent;
  color: #ff4d4f;
  border: 1px solid #ff4d4f;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: rgba(255,77,79,0.08);
  }
`;
