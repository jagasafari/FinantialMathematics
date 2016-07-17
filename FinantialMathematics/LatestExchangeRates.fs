module LatestExchangeRates

open FSharp.Data

let latestRate symbols =
    let str =
        ("http://api.fixer.io/latest?symbols=" + symbols) |> Http.RequestString
    1M