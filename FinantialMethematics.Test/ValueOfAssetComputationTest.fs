module ValueOfAssetComputationTest

open Xunit
open ValueOfAssetComputation
open Swensen.Unquote

[<Theory>]
[<InlineData(1, 0.5, 1.5)>]
[<InlineData(2, 0.5, 2.25)>]
let `` future value of one dolar`` (year:int) (oportunityCostOfCapital:decimal) expected =
    let actual = futureValueOfOneDolarToday oportunityCostOfCapital year
    Assert.Equal(actual, expected)

[<Theory>]
[<InlineData(1, 1, 0.5)>]
let ``exchange rate aka discount factor for getting one dolar in future year``
    (year:int) (opportunityCostOfCapital:decimal) expected =
    let actual = exchangeRate opportunityCostOfCapital year
    Assert.Equal(actual, expected)



[<Theory>]
[<InlineData(1, 0.25)>]
[<InlineData(2, 0.25)>]
let ``exchange rate aka discount factor future sequance`` (n:int) (r:decimal) =
    let s = exchangeRateSeq n r
    let sum = s |> Seq.sum
    if n > 1 then
        sum <! decimal n
    else
        sum =! 1M