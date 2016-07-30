module ValueOfAsset

type ValueOfAsset = PresentValue | NetPresentValue | Unknown

let takePositiveNvp (nvp:decimal) = nvp > 0M
