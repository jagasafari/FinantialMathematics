module ValueOfAssetComputation
open System.Linq

let futureValueOfOneDolarToday (opportnityCostOfCapital:decimal) (year:int) =
    decimal (float (1.0M+opportnityCostOfCapital) ** float year)

let exchangeRateSeq n (oportunityCostOfCapital:decimal) =
    let rec ers (acc:int) =
        seq {
            if acc < n then
                yield 1M / (futureValueOfOneDolarToday oportunityCostOfCapital (acc+1))
                yield! (acc+1) |> ers
        }
    ers 0

let presentValue (cashSeq:seq<decimal>) (oportunityCostOfCapital:decimal) =
    let cashList = cashSeq |> List.ofSeq
    let futureExchangeRate = exchangeRateSeq (cashList.Count()) oportunityCostOfCapital
    Seq.zip futureExchangeRate cashList
    |> Seq.sumBy (fun (x,y) -> x * y)

let netPresentValue (investment:decimal) (cashSeq:seq<decimal>)
    (oportunityCostOfCapital:decimal) =
    let pv = presentValue cashSeq oportunityCostOfCapital
    - investment + pv

type AmountUnit =
    | Million
    | Thousand
    | Billion

let amountUnitMultiplier = function
    | Million -> 1000000M
    | Thousand -> 1000M
    | Billion -> 1000000000M

let presentValue' (cashSeq:seq<decimal>) (futureExchangeRateSeq:seq<decimal>) =
    cashSeq |> Seq.zip <| futureExchangeRateSeq
    |> Seq.sumBy (fun x-> (x |> fst) * (x |> snd))

let netPresentValue' (investment:decimal) (cashSeq:seq<decimal>)
    (futureExchangeRateSeq:seq<decimal>) =
    let pv = presentValue' cashSeq futureExchangeRateSeq
    - investment + pv

