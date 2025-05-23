# Database Schema Design

## Rooms

```sql
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL UNIQUE
```