import React from 'react';

type TodosToolbarProps = {
  projects: string[];
  selectedProjectIndex: number; // -1 = Latest, 0+ = project index
  setSelectedProjectIndex: (index: number) => void;
};

export const TodosToolbar: React.FC<TodosToolbarProps> = ({
  projects,
  selectedProjectIndex,
  setSelectedProjectIndex,
}) => {
  const canGoLeft = selectedProjectIndex > -1;
  const canGoRight = selectedProjectIndex < projects.length - 1;

  const goLeft = () => {
    if (canGoLeft) {
      setSelectedProjectIndex(selectedProjectIndex - 1);
    }
  };

  const goRight = () => {
    if (canGoRight) {
      setSelectedProjectIndex(selectedProjectIndex + 1);
    }
  };

  const getDisplayTitle = () => {
    if (selectedProjectIndex === -1) return 'Latest';
    return projects[selectedProjectIndex] || 'Project';
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1rem',
      }}
    >
      <button
        onClick={goLeft}
        disabled={!canGoLeft}
        style={{ opacity: canGoLeft ? 1 : 0.3 }}
      >
        ←
      </button>

      <span
        style={{ fontWeight: 'bold', minWidth: '120px', textAlign: 'center' }}
      >
        {getDisplayTitle()}
      </span>

      <button
        onClick={goRight}
        disabled={!canGoRight}
        style={{ opacity: canGoRight ? 1 : 0.3 }}
      >
        →
      </button>
    </div>
  );
};
