module Asset

open System

type CashFlow = decimal*DateTime
type Asset(cashFlowSeq:seq<CashFlow>) =
    do
        cashFlowSeq |> Seq.map (fun (cf, dt) -> dt)
        |> Seq.pairwise
        |> Seq.tryFind (fun e -> (e |> fst) > (e |> snd ) )
        |> Option.isSome
        |> fun x -> if x then invalidArg "cashFlowSeq" "sequence must be increasing"

    member __.CashFlowSeq = cashFlowSeq
    member __.TimeLine = cashFlowSeq |> Seq.map(fun x -> x |> snd)
    member __.CashSeq = cashFlowSeq |> Seq.map(fun x-> x|> fst)

type SymbolicOfAsset = BuisnessEntity | Property | Plant | Equipment | Patent
                        | Stock | Bond | Option | Knowledge | Reputation | Opportunity
