module ValueOfAsset

open Asset
open ValueOfAssetComputation

type ValueOfAsset = PresentValue | NetPresentValue | Unknown

let valueOfAsset (asset:Asset) (oportunityCostOfCapital:decimal) strategy =
    match strategy with
    | PresentValue -> presentValue asset.CashSeq oportunityCostOfCapital
    | NetPresentValue -> netPresentValue asset.CashSeq oportunityCostOfCapital
    | _ -> invalidArg "strategy" "unknown value of asset compuatation strategy"

