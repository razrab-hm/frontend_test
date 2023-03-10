import { useState } from 'react';
import { useHistory } from 'react-router-dom';

function useModalControls() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const history = useHistory();

  function handleModalOpen() {
    setIsModalOpen(true);
  }

  function handleModalClose() {
    setIsModalOpen(false);
    history.replace('/main');
  }

  return {
    open: handleModalOpen,
    close: handleModalClose,
    isModalOpen,
  };
}

export default useModalControls;
