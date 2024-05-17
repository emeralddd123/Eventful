# Eventful: Your Passport to Unforgettable Moments

Eventful is more than just a ticketing platform; it's your gateway to a world of experiences. We connect you with pulsating concerts, captivating theater performances, thrilling sports events, enlightening cultural gatherings, and everything in between.

This project uses NestJS, MySQL, and Redis to build a comprehensive event management platform.

## Features

- **Authentication and Authorization**: Secure user accounts for event creators and attendees.
- **Event Management**: Create, manage, and view events.
- **Ticketing**: Purchase tickets and receive QR codes for entry.
- **QR Code Generation**: Generate unique QR codes for each ticket.
- **Shareability**: Share events on social media platforms.
- **Notifications**: Set reminders for upcoming events (creators and attendees).
- **Analytics**: Track event attendance, ticket sales, and user engagement.

## Technologies

- **Backend**: NestJS (Node.js & TypeScript)
- **Database**: MySQL
- **Cache**: Redis
- **Documentation**: OpenAPI (planned)

## Getting Started

1. Clone this repository.
2. Install dependencies: `npm install`
3. Configure database and Redis connections (refer to configuration files).
4. Run the application: `npm run start`

## TypeORM Migrations

To manage database migrations using TypeORM, use the following commands:

1. Create a new migration:
    ```bash
    npm run typeorm migration:create -- -n MigrationName
    ```
2. Generate a migration based on changes in the entity files:
    ```bash
    npm run typeorm migration:generate -- -n MigrationName
    ```
3. Run all pending migrations:
    ```bash
    npm run typeorm migration:run
    ```
4. Revert the last executed migration:
    ```bash
    npm run typeorm migration:revert
    ```

## Contributing

We welcome contributions! Please refer to the contributing guidelines (to be added) before submitting pull requests.

## License

This project is licensed under the MIT License (see LICENSE file).
