setlocal

set "JAVA_HOME=C:\Program Files\Java\jdk-23"
set MAVEN_URI=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip
set MAVEN_ZIP=%USERPROFILE%\.m2\wrapper\apache-maven-3.9.6-bin.zip
set MAVEN_DIR=%USERPROFILE%\.m2\wrapper\apache-maven-3.9.6

if not exist "%MAVEN_DIR%\apache-maven-3.9.6\bin\mvn.cmd" (
    echo Downloading Maven...
    if not exist "%USERPROFILE%\.m2\wrapper" mkdir "%USERPROFILE%\.m2\wrapper"
    powershell -Command "Invoke-WebRequest -Uri '%MAVEN_URI%' -OutFile '%MAVEN_ZIP%'"
    
    echo Extracting Maven...
    powershell -Command "Expand-Archive -Path '%MAVEN_ZIP%' -DestinationPath '%MAVEN_DIR%' -Force"
)

set MAVEN_HOME=%MAVEN_DIR%\apache-maven-3.9.6
set PATH=%MAVEN_HOME%\bin;%JAVA_HOME%\bin;%PATH%

"%MAVEN_HOME%\bin\mvn" %*
