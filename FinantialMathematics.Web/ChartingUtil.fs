namespace FinantialMathematics.Web

open WebSharper
open WebSharper.Charting
open WebSharper.UI.Next
open WebSharper.UI.Next.Client
open WebSharper.UI.Next.Html
open FSharp.Data

[<JavaScript>]
module ChartingUtil =
    let randomColor =
        let r = System.Random()
        fun () -> Color.Rgba(r.Next 256, r.Next 256, r.Next 256, 1.)

    let defaultChartConfig() =
        ChartJs.LineChartConfiguration(
            PointDot=false, BezierCurve = true, DatasetFill=false)

    let renderChartLines (data: seq<_ * float> []) (colors: Color []) =
        data
        |>Array.zip colors
        |>Array.map(fun (c,e) ->
            Chart.Line(e).WithPointStrokeColor(c)
                .WithStrokeColor(c))
        |>Chart.Combine
        |>fun c -> Renderers.ChartJs.Render(
                    c, Size = Size(750, 500), Config = defaultChartConfig())

    let legend  (countries: string []) (colors: Color []) =
        countries
        |> Array.zip colors
        |> Array.map (fun (color, countryName)->
            div[
                    spanAttr[
                        "width:20px;height:20px;\
                        margin-right:10px;\
                        display:inline-block;\
                        background-color:" + color.ToString() |> attr.style
                    ][]
                    span [text countryName]
                ])
        |>Seq.cast
        |>div

    let chartDiv title (chart:Async<Elt>) (legend:unit->Elt)=
        div [
            h2 [text title]
            Doc.Async chart
            legend ()
            ]

