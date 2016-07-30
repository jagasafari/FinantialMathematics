module InterestRateTest
open Rates
open Xunit
open Swensen.Unquote

[<Theory>]
[<InlineData(1,1.05)>]
[<InlineData(2,1.1025)>]
[<InlineData(3,1.157625)>]
let ``investment pays of in iterest rate`` y expected=
    let inv = 1M
    let r = 0.05M
    moneyTodayInFuture inv r y =! expected