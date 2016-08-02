open System.IO

let deleteBuildFolders' dir =
    seq {yield "bin"; yield "obj"}
    |>Seq.filter(fun x-> Directory.Exists(Path.Combine(dir, x)))
    |>Seq.iter(fun x ->
        let deletingDir = Path.Combine(dir, x)
        printfn "%s" deletingDir
        Directory.Delete(deletingDir, true)
        )

let rec deleteBuildFolders (startDir:string) acc =
    if acc<2 then
        deleteBuildFolders' startDir
        for dir in (startDir |> Directory.EnumerateDirectories)
            do deleteBuildFolders dir (acc+1)

let slnDir = Directory.GetParent(Directory.GetCurrentDirectory()).FullName
deleteBuildFolders slnDir 0
