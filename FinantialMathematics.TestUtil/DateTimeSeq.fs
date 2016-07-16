module DateTimeSeq
open System

let incByOne pred =
    if pred then 1 else 0

let increaseRandomly (dt:DateTime) =
    let rnd = Random()
    let m = 27
    let incd = ( dt.Day + rnd.Next(1, m) ) % m + 1
    let im = ( dt.Day > incd ) |> incByOne
    let incm =
        ( dt.Month + im ) % 13 |> fun x -> if x = 0 then x + 1 else x
    let iy = (dt.Month > incm) |> incByOne
    DateTime(dt.Year + iy, incm, incd)

let getIncreasingDateTimeSeqFromNow n =
    if n = 0 then invalidArg "n" "must not be zero"
    let rec randomDateTimeSeq acc =
        seq {
            yield (acc |> snd)
            if (acc |> fst |> fun x -> x < n - 1) then
                yield!
                    ( acc |> fst |> fun x -> x + 1, acc |> snd |> increaseRandomly )
                    |> randomDateTimeSeq
        }
    randomDateTimeSeq (0, DateTime.Now)

open System.Linq
open Xunit
open Swensen.Unquote
open System.Collections.Generic

let assertIncreasingSeq (ps:(DateTime*DateTime) list) =
    ps.Any() =! true
    ps |> Seq.tryFind (fun e -> (e |> fst) > (e |> snd) ) |> Option.isSome  =! false

[<Theory>]
[<InlineData(1)>]
[<InlineData(2)>]
[<InlineData(3)>]
[<InlineData(30)>]
[<InlineData(300)>]
let ``generate increasing date time seq`` n =
    let s = List<DateTime>( n |> getIncreasingDateTimeSeqFromNow )
    let ps = s |> Seq.pairwise |> List.ofSeq
    Assert.True (s.First() > DateTime.Now.AddDays(-1.))
    if n>1 then
        assertIncreasingSeq ps
