cd ..\FinantialMathematics.Web
ri .\Content -Recurse
ri .\bin -Recurse
ri .\obj -Recurse

$a = 'C:\Program Files (x86)\MSBuild\14.0\Bin\MSBuild.exe'
& $a

cd ..\BuildTools