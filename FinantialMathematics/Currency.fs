module FinantilaMathematics.Currency

exception CurrencyException of string

type Currency = | Usd | Eur| Pln | Ypy | Gbp

type Money = decimal * Currency
type ExchanegRate = Currency * Currency * decimal

let currencyString = function
    | Usd -> "USD"
    | Gbp -> "GBP"
    | Ypy -> "YPY"
    | Pln -> "PLN"
    | Eur -> "EUR"

