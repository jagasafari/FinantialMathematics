module InterestRate

let moneyTodayInFuture (investment:decimal) (rate:decimal) (years:int) =
    let m = decimal (float (investment + rate) ** float years)
    investment * m


