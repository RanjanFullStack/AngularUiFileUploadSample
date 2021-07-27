Import-Module WebAdministration

#AppVariables Starts
# Best is to read this from CodePipeline / CodeBuild / CodeDeploy environment variable
#$stageOrEnvironment = "feature" # Options are features, dev, test, uat, prod, mvp etc.
$clientOrPod = "pod"             # Options are pod, demo, <client-code>
$applicationName = "app"
$mainApplication = "foliosure"
$deploymentSourceFolderName = "FoliosureUITemp\dist\FolioSure\"

# Constant - Don't change
$DEFAULT_WEB_SITE = "default web site"
$APP_POOL_DOT_NET_VERSION = "v4.0"

# TODO: Change this path - Application specific - Begin
$WEBSITE_ROOT_PATH = "E:\inetpub\wwwroot\foliosure\"

switch ($env:DEPLOYMENT_GROUP_NAME) {
    "NON-PROD-DEV" {
        $stageOrEnvironment = "dev"
    }
    "NON-PROD-TEST" {
        $stageOrEnvironment = "test"
    }
    "NON-PROD-UAT" {
        $stageOrEnvironment = "uat"
    }
    Default {
        $stageOrEnvironment = "feature"
    }
}

$webSiteAppPoolName = "app_pool_foliosure_" + $stageOrEnvironment + "_" + $clientOrPod
$webSiteInstancePath = $WEBSITE_ROOT_PATH + $stageOrEnvironment + "\" + $clientOrPod

switch ($stageOrEnvironment) {
    "feature" {
        switch ($clientOrPod) {
            "pod" {
                $webSiteName = $DEFAULT_WEB_SITE
                $webSiteBindingsPort = "80"
            }
        }
    }
    "dev" {
        switch ($clientOrPod) {
            "pod" {
                $webSiteName = $DEFAULT_WEB_SITE
                $webSiteBindingsPort = "80"
            }
        }
    }
    "test" {
        switch ($clientOrPod) {
            "pod" {
                $webSiteName = $DEFAULT_WEB_SITE
                $webSiteBindingsPort = "80"
            }
        }
    }
    "uat" {
        switch ($clientOrPod) {
            "pod" {
                $webSiteName = $DEFAULT_WEB_SITE
                $webSiteBindingsPort = "80"
            }
            "demo" {
                $webSiteName = $DEFAULT_WEB_SITE
                $webSiteBindingsPort = "80"
            }
        }
    }
    "prod" {
        switch ($clientOrPod) {
            "demo" {
                $webSiteName = "demo.foliosure.com"
                $webSiteBindingsPort = "8001"
            }
            "beat-shared" {
                $webSiteName = "shared.foliosure.com"
                $webSiteBindingsPort = "8002"
            }
            "beat-dedicated" {
                $webSiteName = "dedicated.foliosure.com"
                $webSiteBindingsPort = "8003"
            }
            default {
                $webSiteName = "<Not set>"
                $webSiteBindingsPort = "-1"
            }
        }
    }
    default {
        $webSiteName = "<Not set>"
        $webSiteBindingsPort = "-1"
    }
}

$PSPath = "IIS:\Sites\$webSiteName\$mainApplication\" + $stageOrEnvironment + "\" + $clientOrPod
$VirtualPath = "$webSiteName\$mainApplication\" + $stageOrEnvironment + "\" + $clientOrPod

if ($stageOrEnvironment -eq "prod" -and $webSiteName -ne $DEFAULT_WEB_SITE) {
    $PSPath = "IIS:\Sites\$webSiteName"
    $VirtualPath = "$webSiteName"
}
# TODO: Change this path - Application specific - End
#AppVariables End

#BEATDevOpsHelper Starts

# set-executionpolicy remotesigned
if ($PSHOME -like "*SysWOW64*") {
    Write-Warning "Restarting this script under 64-bit Windows PowerShell."

    # Restart this script under 64-bit Windows PowerShell.
    #   (\SysNative\ redirects to \System32\ for 64-bit mode)

    & (Join-Path ($PSHOME -replace "SysWOW64", "SysNative") powershell.exe) -File `
		(Join-Path $PSScriptRoot $MyInvocation.MyCommand) @args

    # Exit 32-bit script.
    Exit $LastExitCode
    Write-Warning " 64-bit Windows PowerShell done."
}

function CreateFolder($arg_Path) {
    Write-Host -ForegroundColor Green -Object "Started: CreateFolder($arg_Path)"

    if (!(Test-Path -Path $arg_Path)) {
        Write-Host -ForegroundColor Green -Object "Creating Folder..."
        New-Item -ItemType directory -Path $arg_Path
    }

    Write-Host -ForegroundColor Green -Object "Ended: CreateFolder($arg_Path)"
}

function DeleteFolderContent($arg_Path) {
    Write-Host -ForegroundColor Green -Object "Begin: DeleteFolderContent($arg_Path)"

    if (Test-Path -Path $arg_Path) {
        Write-Host -ForegroundColor Green -Object "Deleting Folder Contents..."
        Remove-Item ($arg_Path + "\*") -Recurse -Force
    }

    Write-Host -ForegroundColor Green -Object "Ended: DeleteFolderContent($arg_Path)"
}

function DeleteFolder($arg_Path) {
    Write-Host -ForegroundColor Green -Object "Begin: DeleteFolder($arg_Path)"

    if (Test-Path -Path $arg_Path) {
        Write-Host -ForegroundColor Green -Object "Deleting Folder..."
        Remove-Item $arg_Path -Recurse -Force
    }

    Write-Host -ForegroundColor Green -Object "Ended: DeleteFolder($arg_Path)"
}

function CreateApplicationPool($arg_AppPoolName, $arg_AppPoolDotNetVersion) {
    Write-Host -ForegroundColor Green -Object "Started: CreateApplicationPool($arg_AppPoolName, $arg_AppPoolDotNetVersion)"

    if (!(IsApplicationPoolExists($arg_AppPoolName))) {
        Write-Host -ForegroundColor Green -Object "Creating Application Pool..."
        New-WebAppPool -Name $arg_AppPoolName
    }

    Write-Host -ForegroundColor Green -Object "Ended: CreateApplicationPool($arg_AppPoolName, $arg_AppPoolDotNetVersion)"
}

function RemoveApplicationPool($arg_AppPoolName) {
    Write-Host -ForegroundColor Green -Object "Begin: RemoveApplicationPool($arg_AppPoolName)"

    if (IsApplicationPoolExists($arg_AppPoolName)) {
        Write-Host -ForegroundColor Green -Object "Removing Application Pool..."
        Remove-WebAppPool -Name $arg_AppPoolName

        # Sleep for 3 seconds and check again if App pool exists
        Start-Sleep -Seconds 3

        if (IsApplicationPoolExists($arg_AppPoolName)) {
            Write-Host -ForegroundColor Green -Object "Removing Application Pool..."
            Remove-WebAppPool -Name $arg_AppPoolName
        }
    }

    Write-Host -ForegroundColor Green -Object "Ended: RemoveApplicationPool($arg_AppPoolName)"
}

function IsApplicationPoolExists($arg_AppPoolName) {
    Write-Host -ForegroundColor Gray -Object "Begin: IsApplicationPoolExists($arg_AppPoolName)"

    $foundAppPool = $false

    if (Test-Path IIS:\AppPools\$arg_AppPoolName) {
        # AppPool is found
        $foundAppPool = $true
    }

    Write-Host -ForegroundColor Gray -Object "Ended: IsApplicationPoolExists($arg_AppPoolName)"

    return $foundAppPool
}

function StartApplicationPool($arg_AppPoolName) {
    Write-Host -ForegroundColor Green -Object "Started: StartApplicationPool($arg_AppPoolName)"

    Start-WebAppPool -Name $arg_AppPoolName

    Write-Host -ForegroundColor Green -Object "Ended: StartApplicationPool($arg_AppPoolName)"
}

function StopApplicationPool($arg_AppPoolName, [int]$secs) {
    Write-Host -ForegroundColor Green -Object "Begin: StopApplicationPool($arg_AppPoolName, $secs)"

    if (!(IsApplicationPoolExists($arg_AppPoolName))) {
        Write-Host -ForegroundColor Green -Object "Ended: StopApplicationPool($arg_AppPoolName, $secs)"
        return
    }

    $retvalue = $false
    $wsec = (get-date).AddSeconds($secs)

    $pstate = Get-WebAppPoolState -Name $arg_AppPoolName

    if ($pstate.Value -eq "Stopped") {
        Write-Host -ForegroundColor Yellow -Object "WebAppPool '$arg_AppPoolName' is stopped already"
        return $true
    }

    Stop-WebAppPool -Name $arg_AppPoolName
    Write-Host -ForegroundColor Green -Object "Waiting up to $secs seconds for the WebAppPool '$arg_AppPoolName' to stop..."
    $poolNotStopped = $true
    while (((get-date) -lt $wsec) -and $poolNotStopped) {
        $pstate = Get-WebAppPoolState -Name $arg_AppPoolName
        if ($pstate.Value -eq "Stopped") {
            Write-Host -ForegroundColor Green -Object "WebAppPool '$arg_AppPoolName' is stopped"
            $poolNotStopped = $false
            $retvalue = $true
        }
    }

    Write-Host -ForegroundColor Green -Object "Ended: StopApplicationPool($arg_AppPoolName, $secs)"

    return $retvalue
}

function CreateWebSite($arg_WebSiteName, $arg_WebSiteBindingPort, $arg_WebSiteAppPoolName, $arg_WebSiteRootPath) {
    Write-Host -ForegroundColor Green -Object "Started: CreateWebSite($arg_WebSiteName, $arg_WebSiteBindingPort, $arg_WebSiteAppPoolName, $arg_WebSiteRootPath)"

    if (!(Get-Website | where-object { $_.name -eq $arg_WebSiteName }) -and (!($arg_WebSiteName -eq ''))) {
        Write-Host -ForegroundColor Green -Object "Creating new website '$arg_WebSiteName' with port '$arg_WebSiteBindingPort'"
        New-Website -Name $arg_WebSiteName -PhysicalPath $arg_WebSiteRootPath -Port $arg_WebSiteBindingPort -ApplicationPool $arg_WebSiteAppPoolName -HostHeader "" -Force
    }

    Write-Host -ForegroundColor Green -Object "Ended: CreateWebSite($arg_WebSiteName, $arg_WebSiteBindingPort, $arg_WebSiteAppPoolName, $arg_WebSiteRootPath)"
}

function DeleteWebSite($arg_webSite) {
    Write-Host -ForegroundColor Green -Object "Ended: DeleteWebSite($arg_webSite)"

    if (!($arg_webSite.ToLower() -eq $defaultWebSite)) {
        # Remove website
        Remove-Website -Name $arg_WebSite -ErrorAction SilentlyContinue
    }

    Write-Host -ForegroundColor Green -Object "Ended: DeleteWebSite($arg_webSite)"
}

function StartWebSite($arg_WebSiteName) {
    Write-Host -ForegroundColor Green -Object "Started: StartWebSite($arg_WebSiteName)"

    if (Get-Website -Name $arg_WebSiteName | where-object { $_.name -eq $arg_WebSiteName }) {
        if ((Get-WebsiteState -Name $arg_WebSiteName).Value.ToLower() -ne "started") {
            Write-Host -ForegroundColor Green -Object "Starting website '$arg_WebSiteName'"
            Start-Website -Name $arg_WebSiteName
        }
    }

    Write-Host -ForegroundColor Green -Object "Ended: StartWebSite($arg_WebSiteName)"
}

function StopWebSite($arg_webSite) {
    Write-Host -ForegroundColor Green -Object "Begin: StopWebSite($arg_webSite)"

    if (!($arg_webSite.ToLower() -eq $defaultWebSite)) {
        # Stop website
        $w = Get-Website -Name $arg_WebSite
        if ($w.Name.Length -gt 0) {
            Stop-Website -Name $arg_WebSite -Passthru
        }
    }

    Write-Host -ForegroundColor Green -Object "Ended: StopWebSite($arg_webSite)"
}

function CreateWebVirtualDirectory($arg_Name, $arg_Path, $arg_WebSite) {
    Write-Host -ForegroundColor Green -Object "Started: CreateWebVirtualDirectory($arg_Name, $arg_Path, $arg_WebSite)"

    if (Test-Path -Path $arg_Path) {
        Write-Host -ForegroundColor Green -Object "Creating Virtual Directory..."
        New-WebVirtualDirectory -Name $arg_Name -PhysicalPath $arg_Path -Site $arg_WebSite -Force -ErrorAction SilentlyContinue
    }

    Write-Host -ForegroundColor Green -Object "Ended: CreateWebVirtualDirectory($arg_Name, $arg_Path, $arg_WebSite)"
}

# We don't want to play around with virtual directory once created
# This may need a fix and testing in future.
function RemoveWebVirtualDirectory($arg_AppName, $arg_website, $arg_applicationPath) {
    Write-Host -ForegroundColor Green -Object "Begin: RemoveWebVirtualDirectory($arg_AppName, $arg_website, $arg_applicationPath)"

    $removeVirtualDirectory = 'IIS:\Sites\' + $arg_website + '\' + $virtualPath + '\' + $arg_AppName
    if ((Test-Path -Path $removeVirtualDirectory)) {
        Remove-Item $removeVirtualDirectory -Force -Recurse
    }

    Write-Host -ForegroundColor Green -Object "Ended: RemoveWebVirtualDirectory($arg_AppName, $arg_website, $arg_applicationPath)"
}

function CopyContentsToDeploymentFolder($arg_SourcePath, $arg_DestinationPath) {
    Write-Host -ForegroundColor Green -Object "Started: CopyContentsToDeploymentFolder($arg_SourcePath, $arg_DestinationPath)"

    Copy-Item ($arg_SourcePath + "\*") -Destination $arg_DestinationPath -Recurse -Force

    Write-Host -ForegroundColor Green -Object "Ended: CopyContentsToDeploymentFolder($arg_SourcePath, $arg_DestinationPath)"
}

function SetIISIUserPersmissions($arg_AppFolderPath) {
    Write-Host -ForegroundColor Green -Object "Started: SetIISIUserPersmissions($arg_AppFolderPath)"

    # $myacl = Get-Acl $arg_AppFolderPath
    # $myaclentry = "IIS_IUSRS","FullControl", "ContainerInherit, ObjectInherit", "None", "Allow"
    # $myaccessrule = New-Object System.Security.AccessControl.FileSystemAccessRule($myaclentry)
    # $myacl.SetAccessRule($myaccessrule)
    # Get-ChildItem -Path "$mypath" -Recurse -Force | Set-Acl -AclObject $myacl -Verbose

    Write-Host -ForegroundColor Green -Object "Ended: SetIISIUserPersmissions($arg_AppFolderPath)"
}

function ConvertToWebApplication($arg_ApplicationPool, $arg_PSPath) {
    Write-Host -ForegroundColor Green -Object "Started: ConvertToWebApplication($arg_ApplicationPool, $arg_PSPath)"

    Write-Host -ForegroundColor Green -Object "Converting to Web application..."
    ConvertTo-WebApplication -ApplicationPool $arg_ApplicationPool -PSPath $arg_PSPath -Force -ErrorAction SilentlyContinue

    Write-Host -ForegroundColor Green -Object "Ended: ConvertToWebApplication($arg_ApplicationPool, $arg_PSPath)"
}

function RemoveWebApplication($arg_AppName, $arg_VirtualPath) {
    Write-Host -ForegroundColor Green -Object "Begin: RemoveWebApplication($arg_AppName, $arg_VirtualPath)"

    Remove-WebApplication -Name $arg_AppName -Site $arg_VirtualPath -ErrorAction SilentlyContinue

    Write-Host -ForegroundColor Green -Object "Ended: RemoveWebApplication($arg_AppName, $arg_VirtualPath)"
}
#BEATOpsHelper Ends

function DeployWebSiteToServer($arg_WebSiteRootPath, $arg_WebSiteAppPoolName, $arg_WebSiteName, $arg_WebSiteBindingsPort) {
    Write-Host -ForegroundColor Green -Object "Started: DeployWebSiteToServer($arg_WebSiteRootPath, $arg_WebSiteAppPoolName, $arg_WebSiteName, $arg_WebSiteBindingsPort)"

    #navigate to the app pools root
    cd IIS:\AppPools\

    # Step 1: Create website root folder
    CreateFolder $arg_WebSiteRootPath

    if (!($arg_WebSiteName -eq $DEFAULT_WEB_SITE)) {
        # Step 2: Create application pool for website
        CreateApplicationPool $arg_WebSiteAppPoolName $APP_POOL_DOT_NET_VERSION

        # Step 3: Start the application pool
        StartApplicationPool $arg_WebSiteAppPoolName

        # Step 4: Create website
        CreateWebSite $arg_WebSiteName $arg_WebSiteBindingsPort $arg_WebSiteAppPoolName $arg_WebSiteRootPath

        # Step 5: Start the website
        StartWebSite $arg_WebSiteName
    }
    else {
        # Step 6: Create Web Virtual Directory
        CreateWebVirtualDirectory $mainApplication $WEBSITE_ROOT_PATH $arg_WebSiteName
    }
    Write-Host -ForegroundColor Green -Object "Ended: DeployWebSiteToServer($arg_WebSiteRootPath, $arg_WebSiteAppPoolName, $arg_WebSiteName, $arg_WebSiteBindingsPort)"
}

function DeployApplicationToServer($arg_AppName) {
    Write-Host -ForegroundColor Green -Object "Started: DeployApplicationToServer($arg_AppName)"

    $appPoolName = ("App_Pool_" + $mainApplication + "_" + $stageOrEnvironment + "_" + $clientOrPod + "_" + $arg_AppName).ToLower()
    $applicationPath = ($webSiteInstancePath + "\" + $arg_AppName)
    $applicationSourcePath = ($WEBSITE_ROOT_PATH + $deploymentSourceFolderName)

    #navigate to the app pools root
    cd IIS:\AppPools\

    # Step 1: Create folder for application
    CreateFolder $applicationPath

    # Step 2: Copy contents to deployment folder
    CopyContentsToDeploymentFolder $applicationSourcePath $applicationPath

    # Step 3: Set IIS_IUser Persmission to application folder
    SetIISIUserPersmissions $applicationPath

    # Step 4: Create application pool for web application
    CreateApplicationPool $appPoolName $appPoolDotNetVersion

    # Step 5: Create web application
    ConvertToWebApplication $appPoolName ($PSPath + "\" + $arg_AppName)

    # Step 6: Start the application pool
    StartApplicationPool $appPoolName

    Write-Host -ForegroundColor Green -Object "Ended: DeployApplicationToServer($arg_AppName)"
    Write-Host -ForegroundColor Green -Object ""
}

function AfterInstall() {
    Clear-Host

    Write-Host -ForegroundColor Magenta -Object "AfterInstall.ps1 - Script execution begins here"
    Write-Host -ForegroundColor Magenta -Object ""

    if ($webSiteBindingsPort -eq -1) {
        Write-Host -ForegroundColor Red -Object "Invalid deployment settings. Review AppVariables.ps1"
        Write-Host -ForegroundColor Magenta -Object ""
        Write-Host -ForegroundColor Magenta -Object "AfterInstall.ps1 - Script execution ends here"
        return
    }

    DeployWebSiteToServer $webSiteInstancePath $webSiteAppPoolName $webSiteName $webSiteBindingsPort

    DeployApplicationToServer $applicationName

    # TODO: In production, this line should be uncommented as part of clean-up
    #DeleteFolder ($WEBSITE_ROOT_PATH + "FoliosureAPITemp")

    Write-Host -ForegroundColor Magenta -Object "AfterInstall.ps1 - Script execution ends here"
}

AfterInstall
