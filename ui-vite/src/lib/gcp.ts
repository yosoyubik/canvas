import Api from './urbit/api';

export default class GcpApi extends Api {
  // Does not touch the store; use the value manually.
  async isConfigured(): Promise<boolean> {
    return this.spider('landscape', 'noun', 'json', 'gcp-is-configured', {});
  }

  // Does not return the token; read it out of the store.
  async getToken(): Promise<void> {
    return this.spider('landscape', 'noun', 'gcp-token', 'gcp-get-token', {});
  }
}
