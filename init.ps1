# Script de inicializacion para la App Veterinaria
# Ejecuta tanto el backend como el frontend simultaneamente

Write-Host "Iniciando App Veterinaria..." -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan

# Verificar si Node.js esta instalado
try {
    $nodeVersion = node --version
    Write-Host "Node.js detectado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: Node.js no esta instalado o no esta en PATH" -ForegroundColor Red
    Write-Host "Por favor instala Node.js desde https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

# Verificar si Angular CLI esta instalado
try {
    $ngVersion = ng version --help 2>$null
    Write-Host "Angular CLI detectado" -ForegroundColor Green
} catch {
    Write-Host "Angular CLI no detectado, instalando..." -ForegroundColor Yellow
    npm install -g @angular/cli
}

# Verificar si MongoDB esta ejecutandose
Write-Host "Verificando MongoDB..." -ForegroundColor Cyan
try {
    $mongoProcess = Get-Process mongod -ErrorAction SilentlyContinue
    if ($mongoProcess) {
        Write-Host "MongoDB esta ejecutandose" -ForegroundColor Green
    } else {
        Write-Host "MongoDB no detectado ejecutandose" -ForegroundColor Yellow
        Write-Host "Asegurate de que MongoDB este instalado e iniciado" -ForegroundColor Yellow
        Write-Host "Para Windows: net start MongoDB" -ForegroundColor Gray
    }
} catch {
    Write-Host "No se pudo verificar el estado de MongoDB" -ForegroundColor Yellow
}

# Instalar dependencias del backend si es necesario
Write-Host "Verificando dependencias del backend..." -ForegroundColor Cyan
if (!(Test-Path ".\backend\node_modules")) {
    Write-Host "Instalando dependencias del backend..." -ForegroundColor Yellow
    Set-Location ".\backend"
    npm install
    Set-Location ".."
    Write-Host "Dependencias del backend instaladas" -ForegroundColor Green
} else {
    Write-Host "Dependencias del backend ya instaladas" -ForegroundColor Green
}

# Instalar dependencias del frontend si es necesario
Write-Host "Verificando dependencias del frontend..." -ForegroundColor Cyan
if (!(Test-Path ".\frontend\node_modules")) {
    Write-Host "Instalando dependencias del frontend..." -ForegroundColor Yellow
    Set-Location ".\frontend"
    npm install
    Set-Location ".."
    Write-Host "Dependencias del frontend instaladas" -ForegroundColor Green
} else {
    Write-Host "Dependencias del frontend ya instaladas" -ForegroundColor Green
}

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Iniciando servidores..." -ForegroundColor Green
Write-Host "Backend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:4200" -ForegroundColor Yellow
Write-Host "API Docs: http://localhost:3000/api-docs" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan

# Crear trabajos en segundo plano para ejecutar ambos servidores
Write-Host "Iniciando servidor backend..." -ForegroundColor Cyan
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD\backend
    npm run dev
}

Write-Host "Iniciando servidor frontend..." -ForegroundColor Cyan
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD\frontend
    ng serve --open
}

# Mostrar informacion de los trabajos
Write-Host ""
Write-Host "Trabajos iniciados:" -ForegroundColor Green
Write-Host "   Backend Job ID: $($backendJob.Id)" -ForegroundColor Gray
Write-Host "   Frontend Job ID: $($frontendJob.Id)" -ForegroundColor Gray
Write-Host ""

# Funcion para mostrar logs de los trabajos
function Show-JobLogs {
    Write-Host "Logs del Backend:" -ForegroundColor Cyan
    Receive-Job $backendJob
    Write-Host ""
    Write-Host "Logs del Frontend:" -ForegroundColor Cyan  
    Receive-Job $frontendJob
    Write-Host ""
}

# Mostrar credenciales de prueba
Write-Host "CREDENCIALES DE PRUEBA:" -ForegroundColor Magenta
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Usuario Regular:" -ForegroundColor White
Write-Host "   Email: juan@email.com" -ForegroundColor Gray
Write-Host "   Password: 123456" -ForegroundColor Gray
Write-Host ""
Write-Host "Veterinario:" -ForegroundColor White  
Write-Host "   Email: carlos@veterinaria.com" -ForegroundColor Gray
Write-Host "   Password: 123456" -ForegroundColor Gray
Write-Host ""
Write-Host "Administrador:" -ForegroundColor White
Write-Host "   Email: admin@veterinaria.com" -ForegroundColor Gray
Write-Host "   Password: 123456" -ForegroundColor Gray
Write-Host "================================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "COMANDOS DISPONIBLES:" -ForegroundColor Magenta
Write-Host "   'logs' - Mostrar logs de ambos servidores" -ForegroundColor Gray
Write-Host "   'stop' - Detener ambos servidores" -ForegroundColor Gray
Write-Host "   'status' - Ver estado de los trabajos" -ForegroundColor Gray
Write-Host "   'exit' - Salir y detener servidores" -ForegroundColor Gray
Write-Host ""

# Loop principal para manejar comandos
do {
    $command = Read-Host "AppVeterinaria> "
    
    switch ($command.ToLower()) {
        "logs" {
            Show-JobLogs
        }
        "status" {
            Write-Host "Estado de los trabajos:" -ForegroundColor Cyan
            Write-Host "Backend Job $($backendJob.Id): $($backendJob.State)" -ForegroundColor Gray
            Write-Host "Frontend Job $($frontendJob.Id): $($frontendJob.State)" -ForegroundColor Gray
        }
        "stop" {
            Write-Host "Deteniendo servidores..." -ForegroundColor Yellow
            Stop-Job $backendJob, $frontendJob
            Remove-Job $backendJob, $frontendJob
            Write-Host "Servidores detenidos" -ForegroundColor Green
            break
        }
        "exit" {
            Write-Host "Cerrando App Veterinaria..." -ForegroundColor Yellow
            Stop-Job $backendJob, $frontendJob
            Remove-Job $backendJob, $frontendJob
            Write-Host "Hasta luego!" -ForegroundColor Green
            break
        }
        "" {
            # No hacer nada si se presiona Enter
        }
        default {
            Write-Host "Comando no reconocido. Usa: logs, status, stop, exit" -ForegroundColor Red
        }
    }
} while ($true)