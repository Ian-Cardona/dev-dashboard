import GenerateButton from './components/GenerateButton';
import { useQueryCreateKey } from './hooks/useQueryCreateKey';

const Generate = () => {
  const { data, isLoading, error } = useQueryCreateKey();

  return (
    <div>
      <GenerateButton />

      {isLoading && <div>Loading...</div>}

      {error && <div>Error generating key</div>}

      {data && (
        <div>
          <h3>Generated Key:</h3>
          <code>{data.pkey}</code>
        </div>
      )}
    </div>
  );
};

export default Generate;
