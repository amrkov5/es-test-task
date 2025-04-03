import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { gender, species, status } from './data';

export const FilterComponent = () => {
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [type, setType] = useState('');
  const [name, setName] = useState('');

  const resetFilter = useCallback(() => {
    setSelectedSpecies(null);
    setSelectedStatus(null);
    setSelectedGender(null);
    setType('');
    setName('');
  }, []);

  const setInput = useCallback(
    (inputFn) => (event) => {
      inputFn(event.target.value);
    },
    []
  );

  return (
    <FilterContainer>
      <PrepareSelect
        data={status}
        selectedItem={selectedStatus}
        setItem={setSelectedStatus}
        type="Status"
      />
      <PrepareSelect
        data={gender}
        selectedItem={selectedGender}
        setItem={setSelectedGender}
        type="Gender"
      />
      <PrepareSelect
        data={species}
        selectedItem={selectedSpecies}
        setItem={setSelectedSpecies}
        type="Species"
      />
      <FilterLabel>
        <FilterInput
          placeholder="Name"
          value={name}
          onChange={setInput(setName)}
        ></FilterInput>
      </FilterLabel>
      <FilterLabel>
        <FilterInput
          placeholder="Type"
          value={type}
          onChange={setInput(setType)}
        ></FilterInput>
      </FilterLabel>
      <FilterBtnWrapper>
        <FilterBtn isReset={false}>Apply</FilterBtn>
        <FilterBtn isReset onClick={resetFilter}>
          Reset
        </FilterBtn>
      </FilterBtnWrapper>
    </FilterContainer>
  );
};

const PrepareSelect = ({ data, selectedItem, setItem, type }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [chosenOption, setChosenOption] = useState(null);

  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!selectedItem) {
      setChosenOption(null);

      return;
    }

    setChosenOption(data.indexOf(selectedItem.toLowerCase()));
  }, [data, selectedItem]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  const toggleSelector = useCallback(
    (event) => {
      if (event.currentTarget !== event.target && selectedItem) {
        return;
      }
      setIsOpen(() => !isOpen);
    },
    [isOpen, selectedItem]
  );

  const chooseOption = useCallback(
    (event) => {
      setItem(event.target.innerText);
      setIsOpen(() => !isOpen);
    },
    [isOpen, setItem]
  );

  const resetInput = useCallback(() => {
    if (selectedItem) {
      setItem(null);
      setIsOpen(false);
    }
  }, [setItem, selectedItem]);

  return (
    <FilterSelectWrapper ref={wrapperRef}>
      <FilterSelectButton
        isOpen={isOpen}
        onClick={toggleSelector}
        selectedItem={selectedItem}
      >
        {selectedItem ? selectedItem : type}
        <FilterSelectIcon
          isOpen={isOpen}
          itemSelected={selectedItem}
          onClick={resetInput}
        >
          {selectedItem ? <CloseIcon /> : <ChevronUpIcon />}
        </FilterSelectIcon>
      </FilterSelectButton>
      <FilterOptionWrapper isOpen={isOpen}>
        {data.map((el, index) => (
          <FilterOption
            index={index}
            chosenOption={chosenOption}
            key={el}
            onClick={chooseOption}
          >
            {el}
          </FilterOption>
        ))}
      </FilterOptionWrapper>
    </FilterSelectWrapper>
  );
};

const ChevronUpIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16">
    <path
      d="M18 6L6 18M6 6l12 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const FilterContainer = styled.div`
  width: 560px;
  height: 90px;
  display: grid;
  grid-template: repeat(2, 40px) / repeat(3, 180px);
  grid-gap: 10px;
`;

const FilterLabel = styled.label``;

const FilterSelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const FilterSelectButton = styled.button`
  width: 100%;
  height: 100%;
  padding: 12px 12px 12px 16px;
  background-color: ${(props) => (props.isOpen ? '#346' : '#263750')};
  border: 1px solid #83bf46;
  border-radius: 8px;
  font-size: 16px;
  color: ${(props) => (props.selectedItem ? '#fff' : '#b3b3b3')};
  text-overflow: ellipsis;
  text-align: left;
  text-transform: capitalize;
  transition: 0.2s ease-in-out;
  :hover {
    background-color: #346;
    cursor: pointer;
  }
`;

const FilterSelectIcon = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 30px;
  transition: 0.2s ease-in-out;
  :hover {
    color: ${(props) => (props.itemSelected ? '#83bf46' : '#b3b3b3')};
  }
`;

const FilterOptionWrapper = styled.div`
  position: absolute;
  top: 45px;
  left: 0;
  width: 100%;
  max-height: 175px;
  visibility: ${(props) => (props.isOpen ? 'visible' : 'hidden')};
  background-color: white;
  border-radius: 8px;
  border: 1px solid #d9d9d9;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  overflow-y: auto;
  z-index: 20;
`;

const FilterOption = styled.div`
  min-height: 35px;
  padding: 8px;
  text-transform: capitalize;
  font-weight: ${(props) =>
    Number(props.index) === props.chosenOption ? 700 : 400};
  :hover {
    background-color: rgba(131, 191, 70, 0.2);
  }
`;

const FilterInput = styled.input`
  width: 100%;
  height: 100%;
  padding: 12px 12px 12px 16px;
  background-color: #263750;
  border: 1px solid #83bf46;
  border-radius: 8px;
  color: white;
  text-overflow: ellipsis;
  transition: 0.2s ease-in-out;
  ::placeholder {
    color: #b3b3b3;
  }
  :hover {
    background-color: #346;
  }
  :focus {
    background-color: #346;
    outline: none;
  }
`;

const FilterBtnWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const FilterBtn = styled.button`
  --btn-color: ${(props) => (props.isReset ? '#ff5152' : '#83BF46')};

  width: 85px;
  color: var(--btn-color);
  background-color: transparent;
  border: 1px solid var(--btn-color);
  border-radius: 8px;
  transition: 0.2s ease-in-out;

  :hover {
    background-color: var(--btn-color);
    color: white;
    cursor: pointer;
  }
`;
