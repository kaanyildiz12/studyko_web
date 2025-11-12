# Add dynamic export to all admin API routes
$files = Get-ChildItem -Path "src\app\api\admin" -Filter "route.ts" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Check if already has dynamic export
    if ($content -notmatch "export const dynamic") {
        # Find the first export async function and add dynamic export before it
        $newContent = $content -replace "(export async function (GET|POST|PUT|DELETE|PATCH))", "// Force dynamic rendering for this API route`r`nexport const dynamic = 'force-dynamic';`r`n`r`n`$1"
        
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        Write-Host "✓ Updated: $($file.FullName)" -ForegroundColor Green
    } else {
        Write-Host "○ Already has dynamic export: $($file.FullName)" -ForegroundColor Yellow
    }
}

Write-Host "`n✅ All admin API routes updated!" -ForegroundColor Cyan
