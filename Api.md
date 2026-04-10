## Create Search

**Method:** `POST`  
**Route:** `redditSearch/createSearch`

Creates a canonical Reddit search record if one does not already exist for the generated `searchUrl`. If an identical `searchUrl` already exists, it returns that existing record id instead of creating a duplicate.

### Query parameters

* `shop: string` (required)

### Request body

```json
{
  "input": "Game Kings",
  "filters": {
    "searchMode": "combined",
    "includeTextPosts": true,
    "includeLinkPosts": true,
    "textMatchMode": "exact",
    "textTarget": "title_or_body",
    "linkTarget": "domain",
    "includeSubreddits": "",
    "excludeSubreddits": "",
    "excludeTerms": "",
    "advancedOpen": false
  }
}
```

### Success response

```json
{
  "id": "665f0d3f4f9a9b0012345678",
  "created": true
}
```

### Alternate success response when an identical search already exists

```json
{
  "id": "665f0d3f4f9a9b0012345678",
  "created": false
}
```

\---

## Get Search

**Method:** `GET`  
**Route:** `redditSearch/getSearch/{id}`

Retrieves a single search by id for the authenticated org. This endpoint also records the search in the org's search history. If cached results are still fresh, it returns those. Otherwise it fetches the Reddit RSS feed, updates the stored search record, and returns the refreshed result.

### Query parameters

* `shop: string` (required)

### Path parameters

* `id: string` (required, must be a valid ObjectId string)

### Success response

Returns a full `RedditSearchModel`.

Example:

```json
{
  "id": "665f0d3f4f9a9b0012345678",
  "query": "game kings",
  "searchUrl": "https://www.reddit.com/search.rss?q=%28title%3A%22game+kings%22+OR+selftext%3A%22game+kings%22%29&sort=new&t=all",
  "alternateUrl": "https://www.reddit.com/search/?q=%28title%3A%22game+kings%22+OR+selftext%3A%22game+kings%22%29&sort=new&t=all",
  "filters": {
    "searchMode": "combined",
    "includeTextPosts": true,
    "includeLinkPosts": true,
    "textMatchMode": "exact",
    "textTarget": "title_or_body",
    "linkTarget": "domain",
    "includeSubreddits": "",
    "excludeSubreddits": "",
    "excludeTerms": "",
    "advancedOpen": false
  },
  "results": [
    {
      "authorName": "example_user",
      "authorUrl": "https://www.reddit.com/user/example_user/",
      "entryUrl": "https://www.reddit.com/comments/example_comment",
      "subreddit": "newzealand",
      "entryId": "t3_abcdef",
      "updatedAt": "2026-04-11T00:00:00.000Z",
      "publishedAt": "2026-04-11T00:00:00.000Z",
      "title": "Game Kings mentioned here",
      "content": "<p>Example HTML content</p>",
      "fetchedAt": "2026-04-11T00:15:00.000Z"
    }
  ],
  "subscribers": null,
  "mySubscription": {
    "org": "665f0d3f4f9a9b0099999999",
    "subscribedAt": "2026-04-01T00:00:00.000Z",
    "frequency": "daily",
    "lastNotificationSentAt": "2026-04-10T00:00:00.000Z",
    "disabled": false
  },
  "createdAt": "2026-04-01T00:00:00.000Z",
  "updatedAt": "2026-04-11T00:15:00.000Z",
  "createdBy": "665f0d3f4f9a9b0099999999",
  "disabled": false,
  "lastSyncedAt": "2026-04-11T00:15:00.000Z",
  "lastSuccessfulSyncAt": "2026-04-11T00:15:00.000Z",
  "syncStatus": "SUCCESS",
  "syncError": null,
  "resultCount": 12,
  "lastResultAt": "2026-04-11T00:00:00.000Z"
}
```

\---

## Update Subscription

**Method:** `POST`  
**Route:** `redditSearch/updateSubscription`

Creates, updates, disables, or re-enables the authenticated org's subscription for a given search.

### Query parameters

* `shop: string` (required)

### Request body

```json
{
  "searchId": "665f0d3f4f9a9b0012345678",
  "frequency": "daily",
  "disabled": false
}
```

### Rules

* `frequency` is required when `disabled` is `false`
* `frequency` can be omitted when `disabled` is `true`
* only one subscription per org per search is allowed
* disabled subscriptions are preserved in the array rather than removed
* if enabling a brand new or previously disabled subscription would exceed the org's plan limit, the request fails

### Success response

Returns the requesting org's subscription only:

```json
{
  "org": "665f0d3f4f9a9b0099999999",
  "subscribedAt": "2026-04-01T00:00:00.000Z",
  "frequency": "daily",
  "lastNotificationSentAt": null,
  "disabled": false
}
```

\---

## Get Searches

**Method:** `GET`  
**Route:** `redditSearch/getSearches`

Returns a combined list of the org's subscribed searches and search-history searches. Each search appears only once. Subscriptions come first, then remaining history items.

### Query parameters

* `shop: string` (required)

### Optional headers

* `subscriptions-only: "true"`  
When set, only subscription-backed searches are returned.

### Filtering

* disabled search records are excluded
* missing search-history records are ignored
* `mySubscription` is populated
* `subscribers` is omitted
* `results` is always returned as `null`

### Success response

```json
{
  "searches": [
    {
      "id": "665f0d3f4f9a9b0012345678",
      "query": "game kings",
      "searchUrl": "https://www.reddit.com/search.rss?...",
      "alternateUrl": "https://www.reddit.com/search/?q=...",
      "filters": {
        "searchMode": "combined",
        "includeTextPosts": true,
        "includeLinkPosts": true,
        "textMatchMode": "exact",
        "textTarget": "title_or_body",
        "linkTarget": "domain",
        "includeSubreddits": "",
        "excludeSubreddits": "",
        "excludeTerms": "",
        "advancedOpen": false
      },
      "results": null,
      "subscribers": null,
      "mySubscription": {
        "org": "665f0d3f4f9a9b0099999999",
        "subscribedAt": "2026-04-01T00:00:00.000Z",
        "frequency": "daily",
        "lastNotificationSentAt": "2026-04-10T00:00:00.000Z",
        "disabled": false
      },
      "createdAt": "2026-04-01T00:00:00.000Z",
      "updatedAt": "2026-04-11T00:15:00.000Z",
      "createdBy": "665f0d3f4f9a9b0099999999",
      "disabled": false,
      "lastSyncedAt": "2026-04-11T00:15:00.000Z",
      "lastSuccessfulSyncAt": "2026-04-11T00:15:00.000Z",
      "syncStatus": "SUCCESS",
      "syncError": null,
      "resultCount": 12,
      "lastResultAt": "2026-04-11T00:00:00.000Z"
    }
  ]
}
```

\---

## Update Org

**Method:** `POST`  
**Route:** `shopify/updateOrg`

Updates organisation-level settings for the authenticated org. Currently only `contactEmail` is supported.

### Query parameters

* `shop: string` (required)

### Request body

```json
{
  "contactEmail": "alerts@example.com"
}
```

### Success response

Returns the full `OrganisationModel` with `includeCredentials: false`.

Example:

```json
{
  "id": "665f0d3f4f9a9b0099999999",
  "name": "Example Store",
  "contactEmail": "alerts@example.com",
  "shopifyConnectionStatus": "ACTIVE",
  "billingPlanStatus": "ACTIVE",
  "billingPlanHandle": "PRO",
  "redditSearchHistory": [
    "665f0d3f4f9a9b0012345678",
    "665f0d3f4f9a9b0012345679"
  ]
}
```