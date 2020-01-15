$BaseDir = (Get-Item -LiteralPath $MyInvocation.MyCommand.Source).Directory.Parent;
$src = Get-ChildItem -LiteralPath $BaseDir.FullName | Where-Object {$_.Name -eq "src"}
$dist = Get-ChildItem -LiteralPath $BaseDir.FullName | Where-Object {$_.Name -eq "dist"}

$target = $dist.FullName + "\KsMdPlus.zip" ;
Get-ChildItem -LiteralPath $src.FullName | Compress-Archive -DestinationPath $target

