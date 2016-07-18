module RateOfChange

open FinantilaMathematics.Currency
open LatestExchangeRates

let rateOfChange sourceCurrency finalCurrency (rateTable:Currency->ExchanegRate) =
    let (_, _, sourceRate) = sourceCurrency |> rateTable
    let (_, _, finalRate) = finalCurrency |> rateTable
    sourceRate / finalRate

let exchangeCurrency (money:Money) (finalCurrency:Currency)
    (rateTable:Currency->ExchanegRate):Money =
    let (d, sourceCurrency ) = money
    let rateOfChange' =
        rateTable |> ( (sourceCurrency, finalCurrency) ||> rateOfChange )
    (d * rateOfChange'), finalCurrency

let exchange (amount:Money) (rate:ExchanegRate):Money =
    let rsc,dc,r = rate
    let a,sc = amount
    if sc<>rsc then
        "Currency mismatch error! Currency rate is not for the source currency"
        |> CurrencyException |> raise
    a * r, dc


let add (amount1:Money) (amount2:Money) =
    let d1,c1 = amount1
    let d2,c2 = amount2
    let sum = if c1=c2 then d1 + d2 else d1 + d2 * (latestRate (c1, c2))
    sum, c1

