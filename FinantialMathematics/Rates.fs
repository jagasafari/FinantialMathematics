module Rates

let futureValueOfOneDolarToday (year:int) (opportnityCostOfCapital:decimal) =
    decimal (float (1.0M+opportnityCostOfCapital) ** float year)

let moneyTodayInFuture (investment:decimal) (rate:decimal) (years:int) =
    let m = decimal (float (investment + rate) ** float years)
    investment * m

let oneDolarInTYears t oportunityCostOfCapital =
    1M / (futureValueOfOneDolarToday t oportunityCostOfCapital)

let exchangeRateSeq n (oportunityCostOfCapital:decimal) =
    let oneDolarInTYears' t = oneDolarInTYears t oportunityCostOfCapital
    let rec ers (acc:int) =
        seq {
            if acc < n then
                yield oneDolarInTYears' (acc+1)
                yield! (acc+1) |> ers
        }
    ers 0