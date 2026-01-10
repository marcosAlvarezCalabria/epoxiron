import { renderHook } from '@testing-library/react-hooks';
import { useClientes } from '../useClientes';

test('hello world!', () => {
  const { result } = renderHook(() => useClientes());
  expect(result.current).toBeDefined();
});