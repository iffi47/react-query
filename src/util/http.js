import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export async function fetchEvents({ signal, searchTerm }) {
 console.log(searchTerm);
 let url = "http://localhost:3000/events";

 if (searchTerm) {
  url += "?search=" + searchTerm;
 }

 const response = await fetch(url, { signal: signal });

 if (!response.ok) {
  const error = new Error("An error occurred while fetching the events");
  error.code = response.status;
  error.info = await response.json();
  throw error;
 }

 const { events } = await response.json();

 return events;
}

export async function createNewEvent(input, method) {
 const payload =
  typeof input === "object" && input !== null && "event" in input
   ? input
   : { event: input, method: method ?? "POST" };

 const { event, method: requestMethod = "POST" } = payload;

 console.log({ event, requestMethod });

 let url = "http://localhost:3000/events";
 if (requestMethod === "PUT") {
  url = `http://localhost:3000/events/${event.id}`;
 }
 if (requestMethod === "PUT" && !event?.id) {
  const error = new Error("Please send event id");
  error.code = 400;
  error.info = { message: "Event ID is missing" };
  throw error;
 }

 const response = await fetch(url, {
  method: requestMethod,
  body: JSON.stringify({ event }),
  headers: {
   "Content-Type": "application/json",
  },
 });

 if (!response.ok) {
  const error = new Error("An error occurred while creating the event");
  error.code = response.status;
  error.info = await response.json();
  throw error;
 }

 const { event: createdEvent } = await response.json();

 return createdEvent;
}

export async function fetchSelectableImages({ signal }) {
 const response = await fetch(`http://localhost:3000/events/images`, {
  signal,
 });

 if (!response.ok) {
  const error = new Error("An error occurred while fetching the images");
  error.code = response.status;
  error.info = await response.json();
  throw error;
 }

 const { images } = await response.json();

 return images;
}

export async function fetchEvent({ id, signal }) {
 const response = await fetch(`http://localhost:3000/events/${id}`, { signal });

 if (!response.ok) {
  const error = new Error("An error occurred while fetching the event");
  error.code = response.status;
  error.info = await response.json();
  throw error;
 }

 const { event } = await response.json();

 return event;
}

export async function deleteEvent({ id }) {
 const response = await fetch(`http://localhost:3000/events/${id}`, {
  method: "DELETE",
 });

 if (!response.ok) {
  const error = new Error("An error occurred while deleting the event");
  error.code = response.status;
  error.info = await response.json();
  throw error;
 }

 return response.json();
}
