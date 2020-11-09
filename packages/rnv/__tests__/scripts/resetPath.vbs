Set oShell = WScript.CreateObject("WScript.Shell")
filename = oShell.ExpandEnvironmentStrings("%TEMP%\resetvars.bat")
Set objFileSystem = CreateObject("Scripting.fileSystemObject")
Set oFile = objFileSystem.CreateTextFile(filename, TRUE)

oFile.WriteLine("@echo off")

set oEnv=oShell.Environment("System")
for each sitem in oEnv 
    oFile.WriteLine("SET " & sitem)
next
path = oEnv("PATH")

set oEnv=oShell.Environment("User")
for each sitem in oEnv 
    oFile.WriteLine("SET " & sitem)
next

path = path & ";" & oEnv("PATH")
oFile.WriteLine("SET PATH=" & path)
oFile.Close