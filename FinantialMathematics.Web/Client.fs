namespace mdw.Roll

open WebSharper
open WebSharper.JavaScript
open WebSharper.JQuery
open WebSharper.UI.Next
open WebSharper.UI.Next.Client

[<JavaScript>]
module Client =
    open WebSharper.UI.Next.Html


    let renderRolls =
        div [
            Doc.Element "h1" [] [Doc.TextNode "Recent rolls:"]
        ]
    let Main =
        JQuery.Of("#main").Empty().Ignore
        renderRolls |> Doc.RunById "main"
