module AssetUtil

open DateTimeSeq
open System
open Asset

let assetSameValue n v =
    Asset(n |> getIncreasingDateTimeSeqFromNow |> Seq.map (fun x -> (v, x) ))

let randomAsset n =
    let rnd = Random()
    Asset( n |> getIncreasingDateTimeSeqFromNow
    |> Seq.map (fun x -> (decimal (rnd.NextDouble()), x) ) )


let futureExchangeRateSeq todatDolar n =
    let rec futureExchangeRateSeqRec acc =
        seq{
            if acc < n then
                let futureDolar = 0.5M
                yield futureDolar / todatDolar
                yield! (acc+1) |> futureExchangeRateSeqRec
        }
    futureExchangeRateSeqRec 0