module FinantilaMathematics.Currency

open LatestExchangeRates

type Currency = | Usd | Eur| Pln | Ypy | Gbp

type Money = decimal * Currency

let rateToUsdTable currency =
    match currency with
    | Usd -> 1M
    | Eur -> latestRate "EUR,USD"
    | Gbp -> latestRate "GBP,USD"
    | Pln -> latestRate "PLN,USD"
    | Ypy -> latestRate "YPY,USD"

let rateOfChange sourceCurrency finalCurrency (rateTable:Currency->decimal) =
    let sourceRate = sourceCurrency |> rateTable
    let finalRate = finalCurrency |> rateTable
    sourceRate / finalRate

let convert (money:Money) (finalCurrency:Currency) (rateTable:Currency->decimal)
    :Money =
    let (d, sourceCurrency ) = money
    let rateOfChange' =
        rateTable |> ( (sourceCurrency, finalCurrency) ||> rateOfChange )
    (d * rateOfChange'), finalCurrency
