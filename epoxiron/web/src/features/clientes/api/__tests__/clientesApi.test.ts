const axios = require('axios');
const mockAxios = require('jest-mock-axios');

afterEach(() => {
	mockAxios.reset();
});

test('should fetch clients successfully', async () => {
	const clients = [{ id: 1, name: 'Client A' }, { id: 2, name: 'Client B' }];
	mockAxios.get.mockResolvedValueOnce({ data: clients });

	const response = await axios.get('/api/clients');
	expect(response.data).toEqual(clients);
});

test('should handle fetch clients error', async () => {
	mockAxios.get.mockRejectedValueOnce(new Error('Network Error'));

	await expect(axios.get('/api/clients')).rejects.toThrow('Network Error');
});