import axios from 'axios';

export interface Article {
  text?: string;
  html?: string;
  media?: unknown[];
  images?: string[];
  author?: string;
  pub_date?: string;
  url?: string;
  canonical_url?: string;
  title?: string;
  language?: string;
  image?: string;
  summary?: string;
  modified_date?: string;
  site_name?: string;
  favicon?: string;
  encoding?: string;
}

interface ExtractResponse {
  article: Article;
}

export class ArticleExtractService {
  private apiTimeoutSeconds: number;

  constructor(private apiHost: string, private apiKey: string, apiTimeoutSeconds?: number) {
    if (apiTimeoutSeconds) {
      this.apiTimeoutSeconds = apiTimeoutSeconds;
    } else {
      this.apiTimeoutSeconds = 120;
    }
  }

  async retrieveArticle(articleUrl: string): Promise<Article> {
    console.log(`Retrieving article url: ${articleUrl}`);

    try {
      const requestOptions = {
        params: {
          url: articleUrl,
          js_timeout: this.apiTimeoutSeconds,
          media: 'false',
        },
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': this.apiHost,
        },
      };
      const response = await axios.get<ExtractResponse>(`https://${this.apiHost}/v1.1/extract`, requestOptions);

      console.log(JSON.stringify(response.data, null, 4));

      return response.data.article;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('error message: ', error.message);
      } else {
        console.log('unexpected error: ', error);
      }

      return null;
    }
  }
}
