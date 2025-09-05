import { useQueryCreateKey } from '../hooks/useQueryCreateKey';

const GenerateButton = () => {
  const { refetch, isFetching } = useQueryCreateKey();

  const handleClick = () => {
    refetch();
  };

  return (
    <button onClick={handleClick} disabled={isFetching}>
      {isFetching ? 'Generating...' : 'Generate Key'}
    </button>
  );
};

export default GenerateButton;
