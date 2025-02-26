import { FormControl, InputGroup } from "react-bootstrap";

interface SearchBarProps {
    query: string;
    onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, onSearch }) => {
    return (
        <InputGroup className="mt-4 mb-3">
            <FormControl
                placeholder="Search Users..."
                value={query}
                onChange={onSearch}
            />
        </InputGroup>
    );
};

export default SearchBar;
