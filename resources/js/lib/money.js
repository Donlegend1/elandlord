export function moneySymbol(currency = 'NGN') {
    const symbols = {
        NGN: '₦',
        USD: '$',
        GHS: 'GH₵',
        ZAR: 'R',
        KES: 'KSh ',
    };

    return symbols[currency] || `${currency} `;
}

export function formatMoney(amount, currency = 'NGN') {
    if (amount === null || amount === undefined || amount === '') return `${moneySymbol(currency)}0.00`;
    return `${moneySymbol(currency)}${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
