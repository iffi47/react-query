import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { fetchEvent } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function EditEvent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const mutate = useMutation({
    // mutationFn: () =>  edi
  });
  const { data, isLoading, isPending, isError, error } = useQuery({
    queryKey: ['event-edit', { id }],
    queryFn: ({ signal }) => fetchEvent({ id, signal }),
  })
  function handleSubmit(formData) {}

  function handleClose() {
    navigate('../');
  }

  return (
    <Modal onClose={handleClose}>
      {isLoading && <p>Loading...</p>}
      {isError && <ErrorBlock title="Error Occurred!" message={error?.info?.message || "Something went wrong!"} />}
      {data && <EventForm inputData={data} onSubmit={handleSubmit}>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Update
        </button>
      </EventForm>}
    </Modal>
  );
}
