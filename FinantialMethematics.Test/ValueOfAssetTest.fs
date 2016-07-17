module ValueOfAssetTest

open NUnit.Framework
open ValueOfAsset
open AssetUtil
open Swensen.Unquote

[<TestCase(1, 1)>]
[<TestCase(10, 1)>]
[<TestCase(1000, 1)>]
let ``compute value of asset with present value strategy`` n (v:decimal) =
    let asset = assetSameValue n v
    let s = valueOfAsset asset (0.M) (ValueOfAsset.PresentValue)
    ((decimal n) * v = s ) =! true