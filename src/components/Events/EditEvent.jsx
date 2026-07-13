import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { createNewEvent, fetchEvent, queryClient } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function EditEvent() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { mutate, isPending: isMutationPending, isError: isMutationError, error: mutationError } =
    useMutation({
      mutationFn: createNewEvent,
      onMutate: async (data) => {
        const newEvent = data.event;
        await queryClient.cancelQueries({ queryKey: ['event', 'events', { id }] })
        queryClient.setQueryData(['event', 'events', { id }], newEvent)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['events', 'event'], });
        navigate('/events');
      },
    });

  const { data: eventData, isLoading: isEventLoading, isError: isEventError, error: eventError } =
    useQuery({
      queryKey: ['event', { id }],
      queryFn: ({ signal }) => fetchEvent({ id, signal }),
    });

  function handleSubmit(formData) {
    formData.id = id
    console.log(formData);
    mutate({ event: formData, method: 'PUT' });
  }

  function handleClose() {
    navigate('../');
  }

  return (
    <Modal onClose={handleClose}>
      {isEventLoading && <p>Loading...</p>}
      {(isEventError || isMutationError) && (
        <ErrorBlock
          title="Error Occurred!"
          message={eventError?.info?.message || mutationError?.info?.message || 'Something went wrong!'}
        />
      )}
      {eventData && (
        <EventForm inputData={eventData} onSubmit={handleSubmit}>
          <Link to="../" className="button-text">
            Cancel
          </Link>
          <button type="submit" className="button">
            Update
          </button>
        </EventForm>
      )}
    </Modal>
  );
}
