module CurrencyTest

open Xunit
open FinantilaMathematics.Currency
open FsCheckProperties
open Swensen.Unquote

let testRateTable = function
    | Eur -> 1.23M
    | Pln -> 0.67M
    | Ypy -> 0.12M
    | Gbp -> 1.4M
    | Usd -> 1M

[<Theory>]
[<InlineData(1, 1.83582)>]
let ``convert eur to pln`` (eurAmount:decimal) (expected:decimal) =
    let c = Currency.Eur
    let m:Money = (eurAmount, c)
    let actual, finalCurrency = convert m Pln testRateTable
    Assert.Equal (Currency.Pln, finalCurrency)
    Assert.InRange ( actual, expected - 0.0001M , expected + 0.0001M)

[<RandomTypeProperty>]
let ``converting to the same currency gives the same amount`` (m:Money) =
    let (amount,cur) = m
    let actual, finalCurrency = convert m cur testRateTable
    test <@ finalCurrency = cur @>
    test <@ actual = amount @>
