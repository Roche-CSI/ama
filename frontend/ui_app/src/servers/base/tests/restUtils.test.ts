import {
  fetchGet,
  fetchPost,
  fetchPut,
  fetchDelete,
} from '../restUtils';

describe('restUtils', () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('fetchGet resolves with data on success', async () => {
    // @ts-ignore
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ result: 'ok' }),
    });
    const data = await fetchGet('http://127.0.0.1:5000');
    expect(data).toEqual({ result: 'ok' });
  });

  it('fetchGet rejects on error', async () => {
    // @ts-ignore
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: 'fail' }),
    });
    await expect(fetchGet('http://127.0.0.1:5000')).rejects.toThrow('Server Error with Status Code: 500');
  });

  it('fetchPost resolves with data on success', async () => {
    // @ts-ignore
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ posted: true }),
    });
    const data = await fetchPost('http://127.0.0.1:5000', { foo: 'bar' });
    expect(data).toEqual({ posted: true });
  });

  it('fetchPut resolves with data on success', async () => {
    // @ts-ignore
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ updated: true }),
    });
    const data = await fetchPut('http://127.0.0.1:5000', { foo: 'bar' });
    expect(data).toEqual({ updated: true });
  });

  it('fetchDelete resolves with data on success', async () => {
    // @ts-ignore
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ deleted: true }),
    });
    const data = await fetchDelete('http://127.0.0.1:5000');
    expect(data).toEqual({ deleted: true });
  });

  it('retries failed requests up to 3 times', async () => {
    // @ts-ignore
    global.fetch
      .mockRejectedValueOnce(new Error('fail1'))
      .mockRejectedValueOnce(new Error('fail2'))
      .mockResolvedValue({
        ok: true,
        json: async () => ({ retried: true }),
      });
    const data = await fetchGet('http://127.0.0.1:5000');
    expect(data).toEqual({ retried: true });
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });
});