module ValueOfAssetComputationTest

open Xunit
open ValueOfAssetComputation
open Swensen.Unquote
open Rates

[<Theory>]
[<InlineData(1, 0.5, 1.5)>]
[<InlineData(2, 0.5, 2.25)>]
let `` future value of one dolar`` (year:int) (oportunityCostOfCapital:decimal) expected =
    let actual = futureValueOfOneDolarToday year oportunityCostOfCapital 
    Assert.Equal(actual, expected)

[<Theory>]
[<InlineData(1, 0.25)>]
[<InlineData(2, 0.25)>]
let ``exchange rate aka discount factor future sequance`` (n:int) (r:decimal) =
    let s = exchangeRateSeq n r
    let sum = s |> Seq.sum
    sum <! decimal n

[<Fact>]
let ``compute net present value`` () =
    let investment = 10M * amountUnitMultiplier Million
    let cashSeq = seq {
        yield 5M * amountUnitMultiplier Million
        yield 7M * amountUnitMultiplier Million
    }
    let exchangeRateSeq = seq {
        yield 0.9M
        yield 0.8M
    }
    let npv = netPresentValue' investment cashSeq exchangeRateSeq
    npv =! (0.1M*amountUnitMultiplier Million)