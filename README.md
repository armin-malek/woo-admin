# Woo Admin
> An alternative Woocommerce Admin Panel that is easy to use, minimal, and mobile-friendly

### Features
- Simple to set up, it’s just a NextJS project Hit deploy and it's done!
- it can work with numerous SQL databases out of the box (defaults to SQLite)
- Create, View, Edit, and Delete your Woocommerce Products
- Easily Manage your orders
- Basic dashboard for information about the status of the shop🤷

### Why?
The WordPress admin panel is just too crowded and shop owners tend to get lost, what they need is to manage their products and orders, and Woo Admin was the simplest solution I could think of.

### DataBase?
saving the API keys in local storage didn't seem to be a great idea, so a simple database to hold the keys and authenticate the users was the way to go.
al though it defaults to a SQLite database thanks to the Prisma ORM it can work with
- PostgreSQL
- MySQL
- MariaDB
- PlanetScale
- SQLite
- AWS Aurora
- Microsoft SQL Server
- Azure SQL
- CockroachDB
