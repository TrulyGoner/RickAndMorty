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

  const onNameChange = useCallback((e) => setName(e.target.value), []);
  const onStatusChange = useCallback((e) => setStatus(e.target.value), []);
  const onGenderChange = useCallback((e) => setGender(e.target.value), []);
  const onSpeciesChange = useCallback((e) => setSpecies(e.target.value), []);

  const applyFilters = useCallback(
    (e) => {
      e?.preventDefault();

      const next = new URL(url.toString());

      // clear existing filter params
      next.searchParams.delete('name');
      next.searchParams.delete('status');
      next.searchParams.delete('gender');
      next.searchParams.delete('species');
      next.searchParams.delete('page');

      if (name.trim()) next.searchParams.set('name', name.trim());
      if (status) next.searchParams.set('status', status);
      if (gender) next.searchParams.set('gender', gender);
      if (species.trim()) next.searchParams.set('species', species.trim());

      setActivePage(0);
      setApiURL(next.toString());
    },
    [name, status, gender, species, setActivePage, setApiURL, url]
  );

  const clearFilters = useCallback(() => {
    const next = new URL(url.toString());

    next.search = '';

    setName('');
    setStatus('');
    setGender('');
    setSpecies('');

    setActivePage(0);
    setApiURL(next.toString());
  }, [setActivePage, setApiURL, url]);

  return (
    <Form onSubmit={applyFilters}>
      <Field>
        <Label>Search</Label>
        <Input value={name} onChange={onNameChange} />
      </Field>

      <Field>
        <Label>Status</Label>
        <Select value={status} onChange={onStatusChange}>
          <option value="">Any</option>
          <option value="alive">Alive</option>
          <option value="dead">Dead</option>
          <option value="unknown">Unknown</option>
        </Select>
      </Field>

      <Field>
        <Label>Gender</Label>
        <Select value={gender} onChange={onGenderChange}>
          <option value="">Any</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="genderless">Genderless</option>
          <option value="unknown">Unknown</option>
        </Select>
      </Field>

      <Field>
        <Label>Species</Label>
        <Input value={species} onChange={onSpeciesChange} />
      </Field>

      <Actions>
        <Button type="submit">Apply</Button>
        <ClearButton type="button" onClick={clearFilters}>
          Clear
        </ClearButton>
      </Actions>
    </Form>
  );
}

const Form = styled.form`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  background: transparent;
  padding: 8px 10px;
  border-radius: 8px;
  min-width: 220px;

  @media (max-width: 600px) {
    min-width: auto;
    width: 100%;
  }
`;

const Label = styled.label`
  color: #ffb457;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const Input = styled.input`
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.12);
  background: transparent;
  min-width: 140px;
  color: #fff;
  outline: none;

  &::placeholder {
    color: rgba(255,255,255,0.65);
  }

  &:focus {
    border-color: #83bf46;
    box-shadow: 0 0 0 4px rgba(131, 191, 70, 0.08);
    background: transparent;
  }
`;

const Select = styled.select`
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.12);
  background: transparent;
  color: #fff;
  min-width: 140px;
  outline: none;

  option {
    color: #0b1220;
    background: #fff;
  }

  &:focus {
    box-shadow: 0 0 0 4px rgba(131, 191, 70, 0.08);
    background: transparent;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
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
