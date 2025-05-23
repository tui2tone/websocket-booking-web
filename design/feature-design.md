# Booking System via Websocket

## TechStack

### Frontend
- Next.JS
- Tailwind
- ShaCDN
- Deployment via [Vercel](vercel.com)

### Backend
- Node.JS
- Websocket
  - Pusher as Websocket as a service [pusher.com](pusher.com)
- Database
  - [Supebase](supabase.com)

## Client

- [ ] Dashboard Page
  - [ ] Rooms List
  - [ ] Gen UserID and Profile via Socket Sessions
- [ ] Rooms Detail Page
  - [ ] Waiting Queue
  - [ ] Seat List (5 Seat per room)
  - [ ] Seat Selectors
- [ ] Admin Page
  - [ ] Rooms List
    - [ ] Status
  - [ ] Add Room Button
  - [ ] Clear Room Booked Button
  - [ ] Rooms Detail Page
    - [ ] List of booked/waiting seats

## Backend

- [ ] Rooms CRUD API
- [ ] Bookings API

## Booking Logic

```mermaid
stateDiagram-v2
    [*] --> Dashboard
    Dashboard --> Select_Room

```