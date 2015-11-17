// from http://old.nabble.com/measuring-elapsed-time-on-mingw-td28132431.html


#include <sys/time.h> 
#include <sys/timeb.h> 
#include <stdio.h> 
#include <stdlib.h> 
#include <windows.h> 

int main (int argc, char *argv[]) 
{ 
  int count = atoi(argv[1]); 
  FILETIME ft_before, ft_after; 
  struct _timeb tb_before, tb_after; 
  struct timeval tv_before, tv_after; 
  LARGE_INTEGER pcfreq; 
  LARGE_INTEGER pc_before, pc_after; 
  int i, j; 

  if (!QueryPerformanceFrequency (&pcfreq)) 
    printf ("QueryPerformanceFrequency failed\n"); 

  GetSystemTimeAsFileTime (&ft_before); 
  _ftime (&tb_before); 
  gettimeofday (&tv_before, NULL); 
  if (!QueryPerformanceCounter (&pc_before)) 
    printf ("QueryPerformanceCounter failed\n"); 

  ///  this is the function to test
  usleep(10000);
  
  /* A DIFFERENT FUNCTION
  for (i = 0; i < count; i++) 
    for (j = 0; j < 10000; j++) 
      ; 
  */
  
  ///
    
  GetSystemTimeAsFileTime (&ft_after); 
  _ftime (&tb_after); 
  gettimeofday (&tv_after, NULL); 
  if (!QueryPerformanceCounter (&pc_after)) 
    printf ("QueryPerformanceCounter failed\n"); 

  printf ("GetSystemTimeAsFileTime %ld *0.1us\n" 
          "_ftime %ld ms\n" 
          "gettimeofday %ld us\n" 
          "QueryPerformanceCounter %ld (freq %ld) = %g s\n", 
          (ft_after.dwHighDateTime - ft_before.dwHighDateTime) * 0x10000 + ft_after.dwLowDateTime - ft_before.dwLowDateTime, 
          (tb_after.time - tb_before.time) * 1000 + tb_after.millitm - tb_before.millitm, 
          (tv_after.tv_sec - tv_before.tv_sec) * 1000000 + tv_after.tv_usec - tv_before.tv_usec, 
          (long) (pc_after.QuadPart - pc_before.QuadPart), (long) pcfreq.QuadPart, (double)(pc_after.QuadPart - pc_before.QuadPart) / (double) pcfreq.QuadPart); 
  return 0; 
}
