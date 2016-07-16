module ValueOfAssetTest

open Xunit
open ValueOfAsset
open AssetUtil

[<Theory>]
[<InlineData(1, 1)>]
[<InlineData(10, 1)>]
[<InlineData(1000, 1)>]
let ``compute value of asset with present value strategy`` n (v:decimal) =
    let asset = assetSameValue n v
    let s = valueOfAsset asset (0.M) (ValueOfAsset.PresentValue)
    Assert.Equal( (decimal n) * v, s )