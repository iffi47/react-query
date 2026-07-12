import { Link, Outlet, useParams } from 'react-router-dom';

import Header from '../Header.jsx';
import { useQueries, useQuery } from '@tanstack/react-query';
import { fetchEvent } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function EventDetails() {
  const { id } = useParams();
  const { data, isLoading, isPending, isError, error } = useQuery({
    queryKey: ['event', { id: id }],
    queryFn: ({ signal }) => fetchEvent({ id, signal }),
  });

  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      {isPending && 'Loading Data!'}
      {isError && <ErrorBlock title="Event not found!" message={error?.info?.message || 'Something went wrong!'} />}
      {data && <article id="event-details">
        <header>
          <h1>{data.title}</h1>
          <nav>
            <button>Delete</button>
            <Link to={`/events/${data.id}/edit`}>Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>{data.date} @ {data.time}</time>
            </div>
            <p id="event-details-description">{data.description}</p>
          </div>
        </div>
      </article>}
    </>
  );
}
