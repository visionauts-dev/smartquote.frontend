/**
 * Generic confirm delete modal - driven by Redux ui.activeModal
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppHooks';
import { closeModal } from '../../redux/slices/uiSlice';
import { removeQuoteLocal } from '../../redux/slices/quotesSlice';
import { removeTemplateLocal } from '../../redux/slices/templatesSlice';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

type DeleteTarget = 'quote' | 'template';

export const ConfirmDeleteModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { activeModal, modalPayload } = useAppSelector((state) => state.ui);
  const [loading, setLoading] = React.useState(false);

  const isOpen = activeModal === 'deleteQuote' || activeModal === 'confirmDelete';
  const target: DeleteTarget = (modalPayload?.templateId != null) ? 'template' : 'quote';
  const id = (modalPayload?.quoteId ?? modalPayload?.templateId ?? modalPayload?.id) as string | undefined;

  const handleConfirm = async () => {
    if (!id) return;
    setLoading(true);
    if (target === 'quote') {
      dispatch(removeQuoteLocal(id));
      navigate('/quotes');
    } else {
      dispatch(removeTemplateLocal(id));
      navigate('/templates');
    }
    dispatch(closeModal());
    setLoading(false);
  };

  const handleClose = () => dispatch(closeModal());

  const title = target === 'quote' ? 'Delete quote?' : 'Delete template?';
  const message =
    target === 'quote'
      ? 'This quote will be removed. This action cannot be undone.'
      : 'This template will be removed. This action cannot be undone.';

  return (
    <Modal isOpen={!!isOpen && !!id} onClose={handleClose} title={title}>
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirm} loading={loading}>
          Delete
        </Button>
      </div>
    </Modal>
  );
};
