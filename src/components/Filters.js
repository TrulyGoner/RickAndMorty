import { useState } from 'react';
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

  function applyFilters(e) {
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
  }

  function clearFilters() {
    const next = new URL(url.toString());

    next.search = '';

    setName('');
    setStatus('');
    setGender('');
    setSpecies('');

    setActivePage(0);
    setApiURL(next.toString());
  }

  return (
    <Form onSubmit={applyFilters}>
      <Field>
        <Label>Search</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </Field>

      <Field>
        <Label>Status</Label>
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Any</option>
          <option value="alive">Alive</option>
          <option value="dead">Dead</option>
          <option value="unknown">Unknown</option>
        </Select>
      </Field>

      <Field>
        <Label>Gender</Label>
        <Select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Any</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="genderless">Genderless</option>
          <option value="unknown">Unknown</option>
        </Select>
      </Field>

      <Field>
        <Label>Species</Label>
        <Input value={species} onChange={(e) => setSpecies(e.target.value)} />
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
  gap: 12px;
  align-items: center;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: #fff;
  font-size: 12px;
  margin-bottom: 6px;
`;

const Input = styled.input`
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  min-width: 160px;
  background: #fff;
`;

const Select = styled.select`
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #fff;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button`
  padding: 8px 12px;
  background: #83bf46;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

const ClearButton = styled.button`
  padding: 8px 12px;
  background: transparent;
  color: #fff;
  border: 1px solid #fff;
  border-radius: 6px;
  cursor: pointer;
`;
