/*

http://stackoverflow.com/questions/8460244/create-c-unmanaged-dll-using-vs2010
compile dll using VS2012 x86 Native Tools Command Prompt AND:

"C:\Program Files (x86)\Microsoft Visual Studio 11.0\VC\bin\x86_amd64\cl.exe" /D_USRDLL /D_WINDLL factorial.c /link /DLL /OUT:libfactorial.dll /NOENTRY

x86 version:

where cl.exe
C:\Program Files (x86)\Microsoft Visual Studio 11.0\VC\bin\cl.exe

cl.exe /D_USRDLL /D_WINDLL factorial.c /link /DLL /OUT:libfactorial.dll

Apparently must use 64-bit compiled DLL since I am using 64-bit node



http://www.transmissionzero.co.uk/computing/building-dlls-with-mingw/
OR compile using MINGW:

gcc -c -o fac.o factorial.c
gcc -o fac.dll -s -shared fac.o -Wl,--subsystem,windows

*/

var ffi = require('ffi')

var libfactorial = ffi.Library('./libfactorial_mingw', {
  'factorial': [ 'uint64', [ 'int' ] ]
})

if (process.argv.length < 3) {
  console.log('Arguments: ' + process.argv[0] + ' ' + process.argv[1] + ' <max>')
  process.exit()
}

var output = libfactorial.factorial(parseInt(process.argv[2]))

console.log('Your output: ' + output)
