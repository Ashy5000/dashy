mkvar neuralNetWidth 30
setvar neuralNetWidth 20
log getvar neuralNetWidth
set width getvar neuralNetWidth
set depth 1
set rand 0.1
set rounds 30
set calibration 0.1
set round -
set data [1,2,3,4,5]
init
train
end
output