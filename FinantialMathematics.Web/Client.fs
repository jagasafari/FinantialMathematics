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

    let charts = Map.empty
                    .Add("Broad money growth (annual %)", chart0)
                    .Add("5-bank asset concentration", chart1)

    let plotSelection = charts |> Map.toList |> List.map(fun (k,_) -> k)
    let varMu = Var.Create plotSelection.[0]
    let plotSelectionDoc = Doc.Select [cls "form-control"] (sprintf "%A") plotSelection varMu :> Doc
    let chartDiv' varMuValue =
        ChartingUtil.chartDiv varMuValue (charts.[varMuValue]()) legent' :> Doc
    let chartDiv = varMu.View |> View.Map(fun x -> div [chartDiv' x])
    let Main =
        JQuery.Of("#main").Empty().Ignore

        let a =
            divc "panel-default" [
                divc "panel-body" [
                    div [ plotSelectionDoc ]
                    chartDiv |> Doc.EmbedView
                ]
            ] :> Doc

        a |> Doc.RunById "main"
