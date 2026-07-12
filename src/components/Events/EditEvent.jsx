import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueries } from '@tanstack/react-query';
import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { use } from 'react';
import { fetchEvent } from '../../util/http.js';

export default function EditEvent() {
  const navigate = useNavigate();
  const mutate = useMutation({
    // mutationFn: () =>  edi
  });
  const {data} = useQueries({
    queryFn: fetchEvent
  })
  function handleSubmit(formData) {}

  function handleClose() {
    navigate('../');
  }

  return (
    <Modal onClose={handleClose}>
      <EventForm inputData={null} onSubmit={handleSubmit}>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Update
        </button>
      </EventForm>
    </Modal>
  );
}
