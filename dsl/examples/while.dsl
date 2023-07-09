mkvar counter 0
mkvar max 5
mkvar incrementSize 1
while <exp counter max
+ counter counter incrementSize
log getvar counter
closewhile
end