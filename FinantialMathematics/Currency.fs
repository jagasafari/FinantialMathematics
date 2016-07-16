module FinantilaMathematics.Currency

type RateToUsd = decimal

type Currency =
    | Usd of RateToUsd
    | Eur of RateToUsd
    | Pln of RateToUsd

type Money = decimal * Currency

let rate (currency:Currency) =
    match currency with
    | Usd x -> x
    | Eur x -> x
    | Pln x -> x

let rateOfChange sourceCurrency finalCurrency =
    (sourceCurrency |> rate) / (finalCurrency |> rate)

let convert (money:Money) (finalCurrency:Currency) =
    let (d, sourceCurrency) = money
    let rateOfChange' = finalCurrency |> ( sourceCurrency |> rateOfChange )
    d * rateOfChange'


