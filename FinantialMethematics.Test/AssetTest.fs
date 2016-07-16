module AssetTest

open System.Collections.Generic
open FsUnit
open DateTimeSeq
open AssetUtil
open Xunit
open Asset
open System
open Swensen.Unquote

[<Theory>]
[<InlineData(1)>]
[<InlineData(2)>]
[<InlineData(20)>]
let ``create asset type and assert cashflow seq elements`` n =
    (fun () -> n |> randomAsset |> ignore)
    |> should not' ( throw typeof<_>)

    let s =
        List<DateTime>(n |> getIncreasingDateTimeSeqFromNow)
    s.Add(DateTime(2016,7,3))
    let cs' = s |> Seq.map (fun x -> (2.4M, x) )

    let ex = Assert.Throws<ArgumentException>(fun () -> Asset( cs' ) |> ignore)
    ex.Message.Contains( "sequence must be increasing") =! true

