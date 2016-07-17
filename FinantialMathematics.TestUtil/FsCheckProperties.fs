module FsCheckProperties

open FsCheck
open FsCheck.Xunit
open FinantilaMathematics.Currency

type RandomType =
    static member Cur() = Arb.Default.Derive ()

type RandomTypePropertyAttribute() =
    inherit PropertyAttribute(Arbitrary = [| typeof<RandomType> |])

type ExchangeRate =
    static member Decimal() =
        Arb.Default.Decimal() |> Arb.filter (fun x -> x > 0.0001M && x<10000M)

type ExchangeRatePropertyAttribute() =
    inherit PropertyAttribute(Arbitrary = [| typeof<ExchangeRate> |])