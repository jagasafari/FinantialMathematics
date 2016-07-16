module ValueOfAssetComputation
open System.Linq

let futureValueOfOneDolarToday (opportnityCostOfCapital:decimal) (year:int) =
    decimal (float (1.0M+opportnityCostOfCapital) ** float year)

let exchangeRate (opportnityCostOfCapital:decimal) (year:int) =
    let div = futureValueOfOneDolarToday opportnityCostOfCapital year
    1M / div

let exchangeRateSeq n (oportunityCostOfCapital:decimal) =
    let rec ers (acc:int) =
        seq {
            if acc < n then
                yield exchangeRate oportunityCostOfCapital acc
                yield! (acc+1) |> ers
        }
    ers 0

let presentValue (cashSeq:seq<decimal>) (oportunityCostOfCapital:decimal) =
    let cashSeqCache = cashSeq |> Seq.cache
    let futureExchangeRate = exchangeRateSeq (cashSeqCache.Count() + 1)
                                oportunityCostOfCapital
    Seq.zip (futureExchangeRate |> Seq.skip 1 ) cashSeqCache
    |> Seq.sumBy (fun x-> (x |> fst) * (x |> snd))

let netPresentValue (cashSeq:seq<decimal>) (oportunityCostOfCapital:decimal) =
    let cashSeqCache = cashSeq |> Seq.cache
    let futureExchangeRate = exchangeRateSeq (cashSeqCache.Count() ) oportunityCostOfCapital
    if cashSeqCache.Count() = 1 then
        cashSeqCache |> Seq.head
    else
        futureExchangeRate |> Seq.zip <| (cashSeqCache |> Seq.skip 1)
        |> Seq.sumBy (fun x-> (x |> fst) * (x |> snd))
        |> fun x -> x + (cashSeqCache |> Seq.head )

