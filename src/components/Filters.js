import { useState, useCallback, useRef } from 'react';
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

  const statusRef = useRef(null);
  const genderRef = useRef(null);
  const speciesRef = useRef(null);

  const onNameChange = useCallback((e) => setName(e.target.value), []);
  const onStatusChange = useCallback((e) => setStatus(e.target.value), []);
  const onGenderChange = useCallback((e) => setGender(e.target.value), []);
  const onSpeciesChange = useCallback((e) => setSpecies(e.target.value), []);
  const onTypeChange = useCallback((e) => setType(e.target.value), []);

  const applyFilters = useCallback(
    (e) => {
      e?.preventDefault();

      const next = new URL(url.toString());

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

  const clearFilters = useCallback(
    () => {
      const next = new URL(url.toString());
      next.search = '';

      setName('');
      setStatus('');
      setGender('');
      setSpecies('');
      setType('');

      setActivePage(0);
      setApiURL(next.toString());
    },
    [setActivePage, setApiURL, url]
  );

  const clearField = useCallback(
    (setter) => (e) => {
      e?.preventDefault();
      e?.stopPropagation();
      setter('');
    },
    []
  );

  const clearStatus = useCallback(() => setStatus(''), []);
  const clearGender = useCallback(() => setGender(''), []);
  const focusSpecies = useCallback(() => speciesRef.current?.focus(), []);
  const handleSpeciesIconClick = useCallback(
    (e) => {
      if (species) {
        e?.preventDefault();
        e?.stopPropagation();
        setSpecies('');
      } else {
        focusSpecies();
      }
    },
    [species, focusSpecies]
  );

  return (
    <Form onSubmit={applyFilters}>
      <TopRow>
        <Field>
          <Select
            ref={statusRef}
            value={status}
            onChange={onStatusChange}
            aria-label="Status"
          >
            <option value="" disabled>
              Status
            </option>
            <option value="alive">Alive</option>
            <option value="dead">Dead</option>
            <option value="unknown">Unknown</option>
          </Select>

          <FieldIcon
            onClick={status ? clearStatus : undefined}
            style={{ pointerEvents: status ? 'auto' : 'none' }}
            title={status ? 'Clear status' : 'Open status'}
            tabIndex={0}
            role="button"
          >{status ? <SvgX /> : <SvgChevron />}</FieldIcon>
        </Field>

        <Field>
          <Select
            ref={genderRef}
            value={gender}
            onChange={onGenderChange}
            aria-label="Gender"
          >
            <option value="" disabled>
              Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="genderless">Genderless</option>
            <option value="unknown">Unknown</option>
          </Select>

          <FieldIcon
            onClick={gender ? clearGender : undefined}
            style={{ pointerEvents: gender ? 'auto' : 'none' }}
            title={gender ? 'Clear gender' : 'Open gender'}
            tabIndex={0}
            role="button"
          >{gender ? <SvgX /> : <SvgChevron />}</FieldIcon>
        </Field>

        <Field>
          <InputWrapper>
            <Input
              ref={speciesRef}
              placeholder="Species"
              value={species}
              onChange={onSpeciesChange}
            />
            <FieldIcon
              onClick={handleSpeciesIconClick}
              title={species ? 'Clear species' : 'Open species'}
              tabIndex={0}
              role="button"
            >{species ? <SvgX /> : <SvgChevron />}</FieldIcon>
          </InputWrapper>
        </Field>
      </TopRow>

      <BottomRow>
        <Field>
          <InputWrapper>
            <Input placeholder="Name" value={name} onChange={onNameChange} />
            {name ? (
              <FieldIcon onClick={clearField(setName)} title="Clear name" tabIndex={0} role="button">{<SvgX />}</FieldIcon>
            ) : null}
          </InputWrapper>
        </Field>

        <Field>
          <InputWrapper>
            <Input placeholder="Type" value={type} onChange={onTypeChange} />
            {type ? (
              <FieldIcon onClick={clearField(setType)} title="Clear type" tabIndex={0} role="button">{<SvgX />}</FieldIcon>
            ) : null}
          </InputWrapper>
        </Field>

        <Actions>
          <Button type="submit">Apply</Button>
          <ClearButton type="button" onClick={clearFilters}>Clear</ClearButton>
        </Actions>
      </BottomRow>
    </Form>
  );
}

function SvgChevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SvgX() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const Form = styled.form`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-direction: column;
  width: 540px;
  max-width: 100%;

  @media (max-width: 900px) {
    width: 100%;
    align-items: center;
  }

  @media (max-width: 600px) {
    align-items: stretch;
    gap: 10px;
  }
`;

const Field = styled.div`
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.02);
  padding: 6px 8px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  min-width: 140px;
  position: relative;

  &:focus-within {
    background: rgba(131, 191, 70, 0.04);
    border-color: #83bf46;
  }

  @media (max-width: 600px) {
    min-width: auto;
    width: 100%;
    justify-content: stretch;
  }
`;

const InputWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  width: 100%;
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
  width: 100%;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
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
  width: 100%;

  option[disabled] {
    color: rgba(255, 255, 255, 0.6);
  }

  option {
    color: #0b1220;
    background: #fff;
  }

  option:hover {
    background: #eaf7dd;
  }

  option:checked,
  option[selected] {
    background: #dff0c8;
  }

  &:focus option[selected],
  &:focus option:checked {
    background: #0b3547;
    color: #fff;
  }

  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
`;

const TopRow = styled.div`
  display: flex;
  gap: 12px;
  width: 540px;
  max-width: 100%;
  align-items: center;
  justify-content: flex-end;

  ${Field} {
    flex: 1 1 0;
    min-width: 0;
  }

  @media (max-width: 900px) {
    width: 100%;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-left: 12px;
`;

const BottomRow = styled.div`
  display: flex;
  gap: 12px;
  width: 540px;
  max-width: 100%;
  align-items: center;
  justify-content: flex-end;

  ${Field} {
    flex: 1 1 0;
    min-width: 0;
  }

  ${Actions} {
    margin-left: 12px;
    flex: 0 0 auto;
  }

  @media (max-width: 900px) {
    width: 100%;
  }
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
    background: rgba(131, 191, 70, 0.08);
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
    background: rgba(255, 77, 79, 0.08);
  }
`;

const FieldIcon = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 4px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;

  &:hover {
    color: #83bf46;
    background: rgba(131, 191, 70, 0.06);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(131, 191, 70, 0.12);
  }
`;
