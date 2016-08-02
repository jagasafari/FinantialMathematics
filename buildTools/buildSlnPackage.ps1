fsi.exe .\cleanAllBuild.fsx
& .\installPackages.ps1
cd ..
$a = 'C:\Program Files (x86)\MSBuild\14.0\Bin\MSBuild.exe'
& $a

cd .\BuildTools