module RateOfChangeTest
open Xunit
open FinantilaMathematics.Currency
open FsCheckProperties
open Swensen.Unquote
open RateOfChange

let testRateTable = function
    | Eur -> Eur,Usd,1.23M
    | Pln -> Pln,Usd,0.67M
    | Ypy -> Ypy,Usd,0.12M
    | Gbp -> Gbp,Usd,1.4M
    | Usd -> Usd,Usd,1M

[<Theory>]
[<InlineData(1, 1.83582)>]
let ``convert eur to pln`` (eurAmount:decimal) (expected:decimal) =
    let c = Currency.Eur
    let m:Money = (eurAmount, c)
    let actual, finalCurrency = exchangeCurrency m Pln testRateTable
    Assert.Equal (Currency.Pln, finalCurrency)
    Assert.InRange ( actual, expected - 0.0001M , expected + 0.0001M)

[<RandomTypeProperty>]
let ``converting to the same currency gives the same amount`` (m:Money) =
    let (amount,cur) = m
    let actual, finalCurrency = exchangeCurrency m cur testRateTable
    test <@ finalCurrency = cur @>
    test <@ actual = amount @>

[<Fact>]
let ``currency mismatch throws Currency exception`` () =
    let m = 10M, Pln
    let er = Usd,Ypy,1.2M
    let ex =
        Assert.Throws<CurrencyException> (fun () -> exchange m er |> ignore )
    ex.Message.Contains("Currency mismatch error! Currency rate is not for the
        source currency");

[<Fact>]
let ``exchange yens to punds`` () =
    let y:Money = 150M,Ypy
    let r:ExchanegRate = Ypy,Gbp,0.0065M
    let d,c = y |> exchange <|r
    d =! 0.975M
    c =! Gbp

[<RandomTypeProperty>]
let ``currency of sum `` (a1:Money) (a2:Money) =
    let d, c = add a1 a2
    c =! (a1 |> snd)