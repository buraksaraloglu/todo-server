## Todo App - Backend

It's a todo app server built with Express.

### Important Specs

> These specs are additions to CRUD operations.

- Made an in-memory cache that has 30 seconds of lifespan. After each `post`, `put` or `delete` request, cache's lifespan resets. That way, API response times reduced are down to ~5ms. _(if cache is available.)_
- Built a rate-limit middleware using `express-rate-limit`. Any client makes _100 requests per 30 seconds_, gets temporary IP ban.
- Built a rate-limit middleware using `express-slow-down`. After _50 requests in 30 seconds_, each request's response time gets slower +500ms.
