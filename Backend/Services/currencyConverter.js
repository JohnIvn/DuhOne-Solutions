import CurrencyConverter from 'currency-converter-lt';

const convertCurrency = async (amount, fromCurrency, toCurrency) => {
    try {
        const currencyConverter = new CurrencyConverter();
        const convertedAmount = await currencyConverter.from(fromCurrency).to(toCurrency).amount(amount).convert();
        console.log(`${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`);
    } catch (error) {
        console.error('Error while converting currency:', error.message);
    }
};

convertCurrency(100, 'USD', 'EUR');

convertCurrency(50, 'GBP', 'USD');
