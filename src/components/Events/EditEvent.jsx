import { Link, useLoaderData, useNavigate, useParams } from 'react-router-dom';
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
        await queryClient.cancelQueries({ queryKey: ['event'] });
        await queryClient.cancelQueries({ queryKey: ['events'] });

        const previousEvent = queryClient.getQueryData(['event', { id }]);
        const previousEvents = queryClient.getQueryData(['events']);

        queryClient.setQueryData(['event', { id }], newEvent);
        queryClient.setQueryData(['events'], (oldEvents = []) =>
          oldEvents.map((event) => (event.id === newEvent.id ? newEvent : event))
        );

        return { previousEvent, previousEvents };
      },
      onSuccess: (updatedEvent) => {
        queryClient.setQueryData(['event', { id }], updatedEvent);
        queryClient.setQueryData(['events'], (oldEvents = []) =>
          oldEvents.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
        );
        queryClient.invalidateQueries({ queryKey: ['events'] });
        queryClient.invalidateQueries({ queryKey: ['event'] });
        handleClose();
      },
      onError: (_error, _data, context) => {
        if (context?.previousEvent) {
          queryClient.setQueryData(['event', { id }], context.previousEvent);
        }
        if (context?.previousEvents) {
          queryClient.setQueryData(['events'], context.previousEvents);
        }
      },
    });

  const { data: eventData, isLoading: isEventLoading, isError: isEventError, error: eventError } =
    useQuery({
      queryKey: ['event', { id }],
      queryFn: ({ signal }) => fetchEvent({ id, signal }),
    });
  // useLoaderData();
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
      {/* {isEventLoading && <p>Loading...</p>} */}
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



export function loader({ params }) {
  return queryClient.fetchQuery({
    queryKey: ['event', { id: params.id }],
    queryFn: ({ signal }) => fetchEvent({ id: params.id, signal }),
  })
}