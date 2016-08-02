namespace FinantialMathematics.Web

open WebSharper
open WebSharper.JQuery
open WebSharper.UI.Next
open WebSharper.UI.Next.Client
open WebSharper.UI.Next.Html
open FSharp.Data

[<JavaScript>]
module Client =
    type WorldBank = WorldBankDataProvider<Asynchronous=true>
    let data = WorldBank.GetDataContext()

    let countries =
        [|
            data.Countries.Austria
            data.Countries.Hungary
            data.Countries.``United Kingdom``
            data.Countries.Poland
            data.Countries.``United Arab Emirates``
            data.Countries.``United States``
        |]

    let colors = Array.map(fun _ ->ChartingUtil.randomColor()) countries

    let legent'() = countries |> Array.map(fun c-> c.Name) |> ChartingUtil.legend <| colors

    let renderChartLines' (data: seq<_*float> []) =
        data |> ChartingUtil.renderChartLines <| colors

    let plotDataYears (i: Runtime.WorldBank.Indicator) =
        Seq.zip ( Seq.map string i.Years) i.Values

    let renderChartLinesYears data = data |> Array.map plotDataYears |> renderChartLines'

    let chart0() =
        async{
            let! data =
                countries
                |>Seq.map(fun c->c.Indicators.``Broad money growth (annual %)``)
                |>Async.Parallel

            return data |> renderChartLinesYears
            }

    let chart1() =
        async{
            let! data =
                countries
                |>Seq.map(fun c->c.Indicators.``5-bank asset concentration``)
                |>Async.Parallel
            return data |> renderChartLinesYears
        }
    let chartDiv' title chart = ChartingUtil.chartDiv title chart legent'

    let Main =
        JQuery.Of("#main").Empty().Ignore
        Doc.Concat [
                chartDiv' "Broad money growth (annual %)" (chart0())
                chartDiv' "5-bank asset concentration" (chart1())
            ]
        |> Doc.RunById "main"
