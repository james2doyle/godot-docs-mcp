import { createDocument } from '@mixmark-io/domino';
import MiniSearch, { type Options as MiniSearchOptions } from 'minisearch';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

type Version = 'stable' | 'latest' | '4.6' | '4.5' | '4.4' | '4.3';

type SearchIndexItem = {
  id: number;
  name: string;
  category: string;
  url: string;
};

/** Bucket of miniseaches for each version */
const miniSearches = new Map<Version, MiniSearch<SearchIndexItem>>();

/** The markdown version of docs pages - avoids refetching them */
const fetchedPages = new Map();

const miniSearchOptions: MiniSearchOptions = {
  fields: ['name'], // fields to index for full-text search
  storeFields: ['name', 'category', 'url'], // fields to return with search results
  searchOptions: {
    boostDocument: (_, __, storedFields) => {
      // boost class pages
      return storedFields?.category === 'classes' ? 2 : 1;
    },
    fuzzy: 0.2,
  },
};

const turndownService = new TurndownService({
  hr: '---',
  codeBlockStyle: 'fenced',
});

function makeFullUrl(version: Version, page: string) {
  return `https://docs.godotengine.org/en/${version}${page}`;
}

function toMarkdown(html: string) {
  const doc = createDocument(html);
  const content = doc.querySelector('div[role="main"]');

  return turndownService.use(gfm).turndown(content);
}

async function search(searchTerm: string, version: Version = 'stable') {
  // keep the DB from being recreated/reindexed over and over
  if (!miniSearches.has(version)) {
    console.info(`Creating index for ${version}`);
    const miniSearch = new MiniSearch<SearchIndexItem>(miniSearchOptions);

    const searchIndex: SearchIndexItem[] = await import(
      `./indexes/${version}/searchindex.js.json`
    ).then((mod) => mod.default);

    miniSearch.removeAll();
    miniSearch.addAll(searchIndex);

    miniSearches.set(version, miniSearch);
  }

  const miniSearch = miniSearches.get(version);

  if (!miniSearch) {
    throw new Error(`No minisearch could be created for ${version}`);
  }

  const output = miniSearch.search(searchTerm);

  return output.map(({ url }) => makeFullUrl(version, url));
}

export const searchDocs = async (
  searchTerm: string,
  version: Version = 'stable',
) => {
  const results = await search(searchTerm, version);

  if (results.length < 1) {
    return {
      content: [
        {
          type: 'text',
          text: `Failed to find any documentation for "${searchTerm}"`,
        },
      ],
      isError: true,
    };
  }

  return {
    content: [
      {
        type: 'text',
        text: results.join('\n'),
      },
    ],
  };
};

export const getDocsPageForTerm = async (
  searchTerm: string,
  version: Version = 'stable',
) => {
  const results = await search(searchTerm, version);

  if (results.length < 1) {
    return {
      content: [
        {
          type: 'text',
          text: `Failed to find any documentation for "${searchTerm}"`,
        },
      ],
      isError: true,
    };
  }

  const url = results[0];

  if (fetchedPages.has(url)) {
    console.info(`Reused existing markdown for ${url}`);

    return {
      content: [
        {
          type: 'text',
          text: fetchedPages.get(url),
        },
      ],
    };
  }

  const res = await fetch(url);

  if (res.ok) {
    const contentType = res.headers.get('content-type') || '';

    const isHTML = contentType.includes('html');
    const body = await res.text();
    const content = !isHTML ? body : toMarkdown(body);

    console.info(`Created markdown for ${url}`);

    const output = [`URL: ${url}`, `Content: ${content}`].join('\n');

    fetchedPages.set(url, output);

    return {
      content: [
        {
          type: 'text',
          text: output,
        },
      ],
    };
  }

  return {
    content: [
      {
        type: 'text',
        text: `Failed to fetch ${url}: ${res.status} ${res.statusText}\n${res.body}`,
      },
    ],
    isError: true,
  };
};
