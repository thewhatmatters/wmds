---
bump: patch
---
**MapLink: an address, and a link to directions.**

- **MapLink** (new): shows an `address` as text with a "Get directions" link that opens the maps site, or the maps app on a phone. `place` sets what the map is asked for (the business's name with its address, or a home town), `areas` lists the towns a business serves, `mode="search"` shows the place instead of a route, and `provider="apple"` asks Apple Maps. `actions` takes more buttons beside the link, such as "Call". There is no embedded map. `mapLinkHref()` gives the same link address for your own markup. See **Components → MapLink → Pattern — visit us**.

### Consumer actions

- None. If you built the address and a hand-written maps link from **Button**, switch to **MapLink**.
