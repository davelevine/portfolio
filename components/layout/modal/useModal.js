import { useState, useCallback } from 'react';

/**
 * Custom hook to manage modal state.
 * @returns {Object} - An object containing modal state and handlers.
 */
const useModal = () => {
  // State to control the visibility of the modal
  const [showModal, setShowModal] = useState(false);
  // State to determine the type of modal (e.g., contact, resume)
  const [modalType, setModalType] = useState('');

  /**
   * Function to open the modal.
   * @param {string} type - The type of modal to display.
   */
  const showModalHandler = useCallback((type) => {
    setModalType(type);
    setShowModal(true);
  }, []);

  /**
   * Function to close the modal.
   */
  const closeModalHandler = useCallback(() => {
    setShowModal(false);
    setModalType('');
  }, []);

  return { showModal, modalType, showModalHandler, closeModalHandler };
};

export default useModal;