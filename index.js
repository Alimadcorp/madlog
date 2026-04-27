class MadlogClient {
  constructor(channel = 'none', testMode = false, mode = "default") {
    this.url = 'https://log.alimad.co/api';
    this.testMode = testMode;
    this.channel = channel;
    if (mode == "silent") {
      this.silent = true;
    }
    this.init();
  }
  async init() {
    try {
      this.country = await this.getCountry();
      if (this.testMode) {
        console.log('Country:', this.country);
      }
    } catch (e) {
      if (!this.silent || this.testMode)
        console.log('Failed to get country', e);
    }
  }
  async log(text, status = 'log') {
    const endpoint = `${this.url}/log`;
    const params = new URLSearchParams({
      text,
      status,
      country: this.country || 'Undefined',
      channel: this.channel,
    });
    const url = `${endpoint}?${params.toString()}`;
    if (this.testMode) {
      console.log('Logging', url);
    }
    try {
      const response = await fetch(url, {
        method: 'GET', mode: 'cors'
      });
      if (this.testMode) {
        let w = await response.json();
        console.log('Logged', w);
      }
      return response.ok;
    } catch (e) {
      if (!this.silent || this.testMode)
        console.warn('Madlog failed', e);
      return false;
    }
  }
  async pull(channel = this.channel) {
    const endpoint = `${this.url}/pull`;
    const params = new URLSearchParams({
      channel
    });
    const url = `${endpoint}?${params.toString()}`;
    if (this.testMode) {
      console.log('Pulling logs from', url);
    }
    try {
      const response = await fetch(url);
      if (this.testMode) {
        console.log('Pulled logs', response);
      }
      if (!response.ok) {
        return null;
      }
      return await response.json();
    } catch (e) {
      if (!this.silent || this.testMode)
        console.warn('Failed to pull logs', e);
      return null;
    }
  }
  async getCountry() {
    try {
      const response = await fetch('https://api.country.is');
      const data = await response.json();
      if (this.testMode) {
        console.log('Country data', data);
      }
      return data.country || 'Undefined';
    } catch (e) {
      if (!this.silent || this.testMode)
        console.warn('Failed to get country', e);
      return 'Undefined';
    }
  }
}
