#!/bin/bash
echo 'INFO: Running training process...'
node writer/training.js
echo 'INFO: Training completed. Shutting down.'
sudo shutdown -h now