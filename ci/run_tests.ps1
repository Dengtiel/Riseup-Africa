<#
CI-friendly PowerShell test runner for Windows environments.
What it does:
 - Removes project-level uploads/ and backend/data.db before running tests
 - Creates an isolated virtualenv, installs backend requirements, runs pytest
 - Always removes uploads/ and backend/data.db and the temporary venv after the run
#>

Param()
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot\.. | Resolve-Path -Relative
$root = (Resolve-Path "$PSScriptRoot\..").ProviderPath
$venv = Join-Path $root '.venv_ci'

function Cleanup {
    Write-Host 'Cleaning artifacts...'
    Remove-Item -Recurse -Force (Join-Path $root 'uploads') -ErrorAction SilentlyContinue
    Remove-Item -Force (Join-Path $root 'backend\data.db') -ErrorAction SilentlyContinue
    if (Test-Path $venv) { Remove-Item -Recurse -Force $venv -ErrorAction SilentlyContinue }
}

try {
    Cleanup
    Write-Host 'Creating virtualenv...'
    python -m venv $venv
    $activate = Join-Path $venv 'Scripts\Activate.ps1'
    if (Test-Path $activate) {
        & $activate
    } else {
        Write-Host 'Could not find Activate.ps1 — continuing without activation (pip may be global)'
    }

    pip install --upgrade pip
    pip install -r (Join-Path $root 'backend\requirements.txt')

    Write-Host 'Running pytest...'
    $rc = 0
    try { pytest -q } catch { $rc = 1 }

    if ($rc -ne 0) { Write-Host 'Tests failed'; exit $rc }
    Write-Host 'Tests passed'
} finally {
    Cleanup
}
