// lib/searchClient.ts
import algoliasearch from 'algoliasearch'

const searchClient = algoliasearch('YourApplicationID', 'YourSearchOnlyAPIKey')

export default searchClient
