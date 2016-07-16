module CurrencyTest

open Xunit
open FinantilaMathematics.Currency

[<Theory>]
[<InlineData(1, 1.1, 0.25)>]
let ``convert eur to pln`` (eurAmount:decimal) (rate:decimal) (ratePlnToUsd:decimal)=
    let c = Eur rate
    let m:Money = (eurAmount, c)
    let actual = convert m (Pln ratePlnToUsd)
    Assert.Equal (4.4M, actual)