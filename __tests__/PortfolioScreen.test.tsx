import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PortfolioScreen from '@/app/screens/portfolioScreen';


jest.mock('../../api/fmp', () => ({ fetchQuote: jest.fn(async (s) => ({ symbol: s, price: 100, name: 'Mock Co' })) }));

describe('PortfolioScreen', () => {
  it('adds a stock and shows total', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(<PortfolioScreen />);
    fireEvent.changeText(getByPlaceholderText('Symbol (e.g. AAPL)'), 'AAPL');
    fireEvent.changeText(getByPlaceholderText('Quantity'), '2');
    fireEvent.press(getByText('Add Stock'));
    await waitFor(() => expect(findByText('$200.00')).resolves.toBeTruthy());
  });
});
